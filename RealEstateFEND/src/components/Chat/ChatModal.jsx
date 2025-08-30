import { useState, useEffect, useRef, use } from "react";
import { Modal, ModalBody, ModalHeader, Button, TextInput, Spinner } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HiPaperAirplane, HiChat } from "react-icons/hi";
import { useAuthContext } from "../../context/Auth";
import { useChatContext } from "../../context/Chat";
import { 
    getOrCreateConversationAPI, 
    getMessagesAPI, 
    sendMessageAPI,
    markConversationAsReadAPI 
} from "../../services/ChatService";
import { formatDate } from "../../utils";

const ChatModal = ({ 
    show, 
    onClose, 
    property, 
    owner,
    conversation
}) => {
    const { t } = useTranslation("common");
    const { user } = useAuthContext();
    const { 
        messages, 
        conversationMessages,
        setConversationMessages,
        updateMessages, 
        addMessage, 
        updateConversationLastMessage,
        markConversationAsRead,
        sendMessage,
        sendTyping,
        getTypingUsers,
        updateActiveConversation,
        isConnected,
        setLoading: setChatLoading 
    } = useChatContext();
    
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [typingTimer, setTypingTimer] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        
        if (show && user) {
            if (conversation) {
                console.log("Initializing existing conversation");
                initializeExistingConversation();
            } else if (property && owner) {
                console.log("Initializing new conversation for property:", property.id, "with owner:", owner.id);
                initializeNewConversation();
            } else {
                console.log("Missing property or owner data - property:", !!property, "owner:", !!owner);
            }
        }

    }, [show, user, property?.id, owner?.id, conversation?.id]);

    useEffect(() => {
        if (show && currentConversation) {
            updateActiveConversation(currentConversation);
        }
        
        return () => {
            if (!show && currentConversation) {
                updateActiveConversation(null);
            }
        };
    }, [show, currentConversation]);

    // Listen for real-time messages and update current messages
    useEffect(() => {
        if (show && currentConversation && conversationMessages.has(currentConversation.id)) {
            const conversationMessagesArray = conversationMessages.get(currentConversation.id);
            console.log(`Updating currentMessages for conversation ${currentConversation.id}, ${conversationMessagesArray.length} messages`);
            setCurrentMessages(conversationMessagesArray);
        }
    }, [show, currentConversation, conversationMessages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);

    useEffect(() => {
        if (!show && currentConversation) {
            console.log("Modal closed - cleaning up");

            if (typingTimer) {
                clearTimeout(typingTimer);
                setTypingTimer(null);
            }

            if (isConnected) {
                sendTyping(currentConversation.id, false);
            }
            
            setCurrentConversation(null);
            setCurrentMessages([]);
            updateMessages([]);
            setNewMessage("");
            updateActiveConversation(null);
        }
    }, [show]);


    const initializeExistingConversation = async () => {
        try {
            setLoading(true);
            console.log('Initializing existing conversation:', conversation);

            setCurrentConversation(conversation);

            // First check if we have messages in conversationMessages map
            const cachedMessages = conversationMessages.get(conversation.id);
            if (cachedMessages && cachedMessages.length > 0) {
                console.log('Using cached messages:', cachedMessages.length);
                setCurrentMessages(cachedMessages);
                updateMessages(cachedMessages);
            } else {
                // Load messages for this conversation from API
                const messagesResponse = await getMessagesAPI(conversation.id);
                
                if (messagesResponse.status === 200) {
                    const messagesList = messagesResponse.data.items || messagesResponse.data || [];
                    console.log('Loaded messages from API:', messagesList.length);
                    
                    // Store in conversationMessages map
                    setConversationMessages(prev => {
                        const newMap = new Map(prev);
                        newMap.set(conversation.id, messagesList);
                        return newMap;
                    });
                    
                    setCurrentMessages(messagesList);
                    updateMessages(messagesList);
                }
            }
            
            // Mark conversation as read
            if (conversation.unreadCount > 0) {
                await markConversationAsReadAPI(conversation.id);
                markConversationAsRead(conversation.id);
            }
        } catch (error) {
            console.error("Error initializing existing conversation:", error);
            toast.error(t("chat.errorInitializing") || "Sohbet başlatılırken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const initializeNewConversation = async () => {
        try {
            setLoading(true);
            console.log('Creating new conversation for property:', property.id, 'with owner:', owner.id);
            const conversationResponse = await getOrCreateConversationAPI(owner.id, property.id);
            
            if (conversationResponse.status === 200 || conversationResponse.status === 201) {
                const newConversation = conversationResponse.data;
                console.log('New conversation created/found:', newConversation);
                setCurrentConversation(newConversation);

                const cachedMessages = conversationMessages.get(newConversation.id);
                if (cachedMessages && cachedMessages.length > 0) {
                    console.log('Using cached messages:', cachedMessages.length);
                    setCurrentMessages(cachedMessages);
                    updateMessages(cachedMessages);
                } else {
                    // Load messages for the new conversation
                    const messagesResponse = await getMessagesAPI(newConversation.id);
                    
                    if (messagesResponse.status === 200) {
                        const messagesList = messagesResponse.data.items || messagesResponse.data || [];
                        console.log('Loaded messages from API:', messagesList.length);

                        setConversationMessages(prev => {
                            const newMap = new Map(prev);
                            newMap.set(newConversation.id, messagesList);
                            return newMap;
                        });
                        
                        setCurrentMessages(messagesList);
                        updateMessages(messagesList);
                    }
                }
            } else {
                console.error('Failed to create/get conversation:', conversationResponse);
                toast.error(t("chat.errorLoadingConversation") || "Sohbet yüklenirken hata oluştu");
            }
        } catch (error) {
            console.error("Error initializing conversation:", error);
            toast.error(t("chat.errorInitializing") || "Sohbet başlatılırken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !currentConversation) return;

        const messageContent = newMessage.trim();
        setNewMessage("");

        try {
            setSending(true);

            if (typingTimer) {
                clearTimeout(typingTimer);
                setTypingTimer(null);
            }
            await sendTyping(currentConversation.id, false);
            
            if (isConnected) {
                // Send via SignalR for real-time delivery
                const sentMessage = await sendMessage(currentConversation.id, messageContent);
                
                // Add message to local state (will be confirmed by SignalR event)
                addMessage(sentMessage);
                
                // Update conversation's last message
                updateConversationLastMessage(currentConversation.id, sentMessage);
                
                console.log('Message sent successfully via SignalR:', sentMessage);
            } else {
                // Fallback to HTTP API if SignalR is not connected
                const response = await sendMessageAPI(currentConversation.id, messageContent);
                
                if (response.status === 200) {
                    const sentMessage = response.data;
                    addMessage(sentMessage);
                    updateConversationLastMessage(currentConversation.id, sentMessage);
                    console.log('Message sent successfully via HTTP:', sentMessage);
                } else {
                    setNewMessage(messageContent);
                    toast.error(t("chat.errorSending") || "Mesaj gönderilemedi");
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Restore message in input if sending failed
            setNewMessage(messageContent);
            toast.error(t("chat.errorSending") || "Mesaj gönderilemedi");
        } finally {
            setSending(false);
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        if (currentConversation && isConnected) {
            sendTyping(currentConversation.id, true);

            if (typingTimer) {
                clearTimeout(typingTimer);
            }

            const timer = setTimeout(() => {
                sendTyping(currentConversation.id, false);
                setTypingTimer(null);
            }, 2000);
            
            setTypingTimer(timer);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClose = () => {
        console.log("handleClose called - modal will close");
        onClose();
    };

    if (!user) {
        console.log("ChatModal: User not found, not rendering modal");
        return null;
    }

    const displayName = currentConversation 
        ? (currentConversation.otherUserFirstName + " " + currentConversation.otherUserLastName) 
        : (owner ? (owner.firstName + " " + owner.lastName) : "Kullanıcı");

    const propertyTitle = currentConversation?.propertyTitle || property?.title || "";

    const typingUsersInConversation = currentConversation 
        ? Array.from(getTypingUsers(currentConversation.id))
        : [];

    return (
        <Modal show={show} onClose={handleClose} size="lg">
            <ModalHeader>
                <div className="flex items-center space-x-3">
                    <HiChat className="h-5 w-5 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("chat.chatWith")} {displayName}
                        </h3>
                        {propertyTitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {propertyTitle}
                            </p>
                        )}
                        {!isConnected && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                {t("chat.offline") || "Çevrimdışı"}
                            </p>
                        )}
                    </div>
                </div>
            </ModalHeader>
            
            <ModalBody>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Spinner size="lg" />
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {t("chat.loading") || "Yükleniyor..."}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col h-96">
                        {/* Messages Container */}
                        <div 
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto mb-4 space-y-3 p-2"
                        >
                            {currentMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <HiChat className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {t("chat.noMessages") || "Henüz mesaj yok"}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        {t("chat.startConversation") || "Sohbeti başlatmak için bir mesaj yazın"}
                                    </p>
                                </div>
                            ) : (
                                currentMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.senderId === user.id ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.senderId === user.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-green-700 text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            <p className="break-words">{message.content}</p>
                                            <div
                                                className={`flex items-center justify-between mt-1 text-xs ${
                                                    message.senderId === user.id
                                                        ? 'text-blue-100'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                <span>{formatDate(message.createdAt)}</span>
                                                {message.senderId === user.id && (
                                                    <span className="ml-2">
                                                        {message.isRead ? '✓✓' : '✓'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Typing Indicator */}
                        {typingUsersInConversation.length > 0 && (
                            <div className="px-2 mb-2">
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {t("chat.typing") || "yazıyor..."}
                                </p>
                            </div>
                        )}

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <TextInput
                                type="text"
                                value={newMessage}
                                onChange={handleInputChange}
                                placeholder={t("chat.typeMessage") || "Mesajınızı yazın..."}
                                className="flex-1"
                                disabled={sending || !currentConversation}
                                maxLength={1000}
                            />
                            <Button
                                type="submit"
                                disabled={!newMessage.trim() || sending || !currentConversation}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {sending ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <HiPaperAirplane className="h-4 w-4" />
                                )}
                            </Button>
                        </form>
                        
                        {!currentConversation && (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {t("chat.connectingConversation") || "Sohbet bağlantısı kuruluyor..."}
                            </div>
                        )}
                        
                        {!isConnected && currentConversation && (
                            <div className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                                {t("chat.offlineMode") || "Çevrimdışı mod - mesajlar gecikmeli gönderilecek"}
                            </div>
                        )}
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

export default ChatModal;
