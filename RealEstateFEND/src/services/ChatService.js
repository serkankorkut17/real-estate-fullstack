import API from "./Api";

// Get conversations for current user
export const getConversationsAPI = async (page = 1, pageSize = 50) => {
    try {
        const response = await API.get("/chat/conversations", {
            params: { page, pageSize }
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// Get or create conversation
export const getOrCreateConversationAPI = async (participantId, propertyId = null) => {
    try {
        const response = await API.post("/chat/conversations", {
            participantId,
            propertyId
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// Get messages for a conversation
export const getMessagesAPI = async (conversationId, page = 1, pageSize = 50) => {
    try {
        const response = await API.get(`/chat/conversations/${conversationId}/messages`, {
            params: { page, pageSize }
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// Send message to conversation
export const sendMessageAPI = async (conversationId, content) => {
    try {
        const response = await API.post(`/chat/conversations/${conversationId}/messages`, {
            content
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

// Mark single message as read
export const markMessageAsReadAPI = async (messageId) => {
    try {
        const response = await API.put(`/chat/messages/${messageId}/read`);
        return response;
    } catch (error) {
        return error.response;
    }
};

// Mark entire conversation as read
export const markConversationAsReadAPI = async (conversationId) => {
    try {
        const response = await API.put(`/chat/conversations/${conversationId}/read`);
        return response;
    } catch (error) {
        return error.response;
    }
};
