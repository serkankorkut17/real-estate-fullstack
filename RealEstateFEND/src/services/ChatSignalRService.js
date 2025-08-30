import * as signalR from "@microsoft/signalr";

// Hub URL - backend'de ChatHub nasıl register edilmişse ona göre düzenleyin
// Yaygın seçenekler:
// 1. app.MapHub<ChatHub>("/chatHub") -> "/chatHub" 
// 2. app.MapHub<ChatHub>("/hubs/chat") -> "/hubs/chat"
// 3. app.MapHub<ChatHub>("/api/chat/hub") -> "/api/chat/hub"

// Deneyecek URL'ler - backend'inizde hangisi doğruysa onu kullanın
const possibleHubUrls = [
    `${import.meta.env.VITE_API_BASE_URL}/hubs/chat`,
    `${import.meta.env.VITE_API_BASE_URL}/chatHub`,
    `${import.meta.env.VITE_API_BASE_URL}/chat`,
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/hub`,
    `${import.meta.env.VITE_API_BASE_URL}/hub/chat`
];

const hubUrl = possibleHubUrls[0]; // İlk olarak /hubs/chat deneyelim

class ChatSignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.eventHandlers = new Map();
        this.tokenProvider = null;
        this.persistConnection = true; // Flag to control connection persistence
        this.currentHubUrlIndex = 0; // Track which URL we're trying
    }

    // Set token provider function from auth context
    setTokenProvider(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    // Get token from multiple sources with fallback
    getToken = () => {
        // First try the token provider (from auth context)
        if (this.tokenProvider) {
            const token = this.tokenProvider();
            if (token) return token;
        }
        
        // Fallback to localStorage
        const localToken = localStorage.getItem("jwt");
        if (localToken) return localToken;
        
        // Fallback to sessionStorage
        const sessionToken = sessionStorage.getItem("jwt");
        if (sessionToken) return sessionToken;
        
        return null;
    };

    createConnection() {
        if (this.connection) {
            return this.connection;
        }

        const currentHubUrl = possibleHubUrls[this.currentHubUrlIndex];
        console.log(`Trying hub URL [${this.currentHubUrlIndex}]: ${currentHubUrl}`);

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(currentHubUrl, {
                accessTokenFactory: () => {
                    const token = this.getToken();
                    console.log("AccessTokenFactory called, token:", token ? "Present" : "Not found");
                    return token;
                },
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
                skipNegotiation: false
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setupEventHandlers();
        this.setupConnectionEvents();

        return this.connection;
    }

    setupEventHandlers() {
        if (!this.connection) return;

        // Message received from other users
        this.connection.on("MessageReceived", (message) => {
            console.log("MessageReceived:", message);
            this.emit("messageReceived", message);
        });

        // Conversation marked as read by someone
        this.connection.on("ConversationRead", (conversationId, userId) => {
            console.log("ConversationRead:", conversationId, userId);
            this.emit("conversationRead", { conversationId, userId });
        });

        // Someone is typing
        this.connection.on("Typing", (conversationId, userId, isTyping) => {
            console.log("Typing:", conversationId, userId, isTyping);
            this.emit("typing", { conversationId, userId, isTyping });
        });
    }

    setupConnectionEvents() {
        if (!this.connection) return;

        this.connection.onclose((error) => {
            console.log("SignalR connection closed:", error);
            console.log("Connection state:", this.connection?.state);
            console.log("Persist connection flag:", this.persistConnection);
            this.isConnected = false;
            this.emit("connectionClosed", error);
        });

        this.connection.onreconnecting((error) => {
            console.log("SignalR reconnecting:", error);
            console.log("Reconnection attempt, error:", error);
            this.isConnected = false;
            this.emit("reconnecting", error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log("SignalR reconnected with ID:", connectionId);
            this.isConnected = true;
            this.emit("reconnected", connectionId);
        });
    }

    async start() {
        if (this.isConnected || this.isConnecting) {
            return;
        }

        for (let urlIndex = 0; urlIndex < possibleHubUrls.length; urlIndex++) {
            try {
                this.isConnecting = true;
                this.currentHubUrlIndex = urlIndex;
                
                // Clear previous connection
                this.connection = null;
                this.createConnection();

                const currentUrl = possibleHubUrls[urlIndex];
                console.log(`[${urlIndex + 1}/${possibleHubUrls.length}] Attempting to connect to SignalR hub: ${currentUrl}`);
                console.log("Token available:", this.getToken() ? "Yes" : "No");

                await this.connection.start();
                console.log(`✅ SignalR connected successfully to: ${currentUrl}`);
                
                this.isConnected = true;
                this.isConnecting = false;
                this.emit("connected");
                return; // Success, exit the loop
                
            } catch (error) {
                console.error(`❌ SignalR connection failed for URL [${urlIndex + 1}]:`, possibleHubUrls[urlIndex], error.message);
                
                this.isConnected = false;
                this.isConnecting = false;
                
                // If this is the last URL, emit the failure
                if (urlIndex === possibleHubUrls.length - 1) {
                    console.error("🚨 All SignalR hub URLs failed. Possible causes:");
                    console.error("1. Backend SignalR hub is not running");
                    console.error("2. Hub endpoint path is incorrect");
                    console.error("3. CORS issue");
                    console.error("4. Authentication token issue");
                    this.emit("connectionFailed", error);
                    throw error;
                }
                
                // Clean up connection before trying next URL
                if (this.connection) {
                    try {
                        await this.connection.stop();
                    } catch (stopError) {
                        // Ignore stop errors
                    }
                    this.connection = null;
                }
            }
        }
    }

    async stop() {
        if (!this.connection || !this.isConnected) {
            return;
        }

        try {
            await this.connection.stop();
            console.log("SignalR disconnected");
            this.isConnected = false;
        } catch (error) {
            console.error("Error stopping SignalR:", error);
        }
    }

    // Reset connection completely (useful when token changes)
    async resetConnection() {
        console.log("Resetting SignalR connection");
        
        // Stop existing connection
        if (this.connection) {
            try {
                await this.connection.stop();
            } catch (error) {
                console.error("Error stopping connection during reset:", error);
            }
        }
        
        // Clear connection state
        this.connection = null;
        this.isConnected = false;
        this.isConnecting = false;
        
        // Create and start new connection
        await this.start();
    }

    async joinConversation(conversationId) {
        if (!this.isConnected) {
            throw new Error("Not connected to SignalR");
        }

        try {
            await this.connection.invoke("JoinConversation", conversationId);
            console.log(`Joined conversation: ${conversationId}`);
        } catch (error) {
            console.error("Error joining conversation:", error);
            throw error;
        }
    }

    async leaveConversation(conversationId) {
        if (!this.isConnected) {
            return;
        }

        try {
            await this.connection.invoke("LeaveConversation", conversationId);
            console.log(`Left conversation: ${conversationId}`);
        } catch (error) {
            console.error("Error leaving conversation:", error);
        }
    }

    async sendMessage(conversationId, content) {
        if (!this.isConnected) {
            throw new Error("Not connected to SignalR");
        }

        try {
            const message = await this.connection.invoke("SendMessage", conversationId, content);
            console.log("Message sent via SignalR:", message);
            return message;
        } catch (error) {
            console.error("Error sending message via SignalR:", error);
            throw error;
        }
    }

    async markConversationAsRead(conversationId) {
        if (!this.isConnected) {
            return;
        }

        try {
            await this.connection.invoke("MarkConversationRead", conversationId);
            console.log(`Marked conversation as read: ${conversationId}`);
        } catch (error) {
            console.error("Error marking conversation as read:", error);
        }
    }

    async sendTyping(conversationId, isTyping) {
        if (!this.isConnected) {
            return;
        }

        try {
            await this.connection.invoke("Typing", conversationId, isTyping);
        } catch (error) {
            console.error("Error sending typing indicator:", error);
        }
    }

    // Event emitter methods
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    off(event, handler) {
        if (!this.eventHandlers.has(event)) {
            return;
        }
        const handlers = this.eventHandlers.get(event);
        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.eventHandlers.has(event)) {
            return;
        }
        this.eventHandlers.get(event).forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error("Error in event handler:", error);
            }
        });
    }

    // Getters
    get connected() {
        return this.isConnected;
    }

    get connecting() {
        return this.isConnecting;
    }
}

// Singleton instance
const chatSignalRService = new ChatSignalRService();

export default chatSignalRService;
