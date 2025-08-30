import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthContext } from './Auth';
import chatSignalRService from '../services/ChatSignalRService';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isLoggedIn, token } = useAuthContext();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(new Map()); // conversationId -> messages array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Map()); // conversationId -> Set of userIds

  // Global cleanup on app close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isConnected) {
        chatSignalRService.stop();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Only disconnect if user is not logged in
      if (!isLoggedIn || !user) {
        chatSignalRService.stop();
      }
    };
  }, [isLoggedIn, user, isConnected]);

  // SignalR connection management
  useEffect(() => {
    if (isLoggedIn && user && token) {
      initializeSignalR();
    } else {
      disconnectSignalR();
      resetChatState();
    }

    // Only disconnect when user logs out, not on component unmount
    return () => {
      if (!isLoggedIn || !user) {
        disconnectSignalR();
      }
    };
  }, [isLoggedIn, user, token]);

  const initializeSignalR = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Set token provider for SignalR service
      chatSignalRService.setTokenProvider(() => {
        // Try getting token from auth context first
        if (token) {
          console.log("Using token from auth context for SignalR");
          return token;
        }
        
        // Fallback to localStorage
        const localToken = localStorage.getItem("jwt");
        if (localToken) {
          console.log("Using token from localStorage for SignalR");
          return localToken;
        }
        
        // Fallback to sessionStorage
        const sessionToken = sessionStorage.getItem("jwt");
        if (sessionToken) {
          console.log("Using token from sessionStorage for SignalR");
          return sessionToken;
        }
        
        console.log("No token found for SignalR");
        return null;
      });

      // Setup event handlers
      chatSignalRService.on('connected', () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('[Chat Context] SignalR connected successfully');
      });

      chatSignalRService.on('connectionFailed', (error) => {
        setIsConnected(false);
        setIsConnecting(false);
        setError('Bağlantı kurulamadı');
        console.error('[Chat Context] SignalR connection failed:', error);
      });

      chatSignalRService.on('connectionClosed', () => {
        setIsConnected(false);
        console.log('[Chat Context] SignalR connection closed - User logged in:', isLoggedIn, 'User exists:', !!user);
      });

      chatSignalRService.on('reconnecting', () => {
        setIsConnected(false);
        console.log('[Chat Context] SignalR reconnecting...');
      });

      chatSignalRService.on('reconnected', () => {
        setIsConnected(true);
        console.log('[Chat Context] SignalR reconnected successfully');
      });

      // Message handlers
      chatSignalRService.on('messageReceived', (message) => {
        console.log('Received message:', message);
        
        // Add message to conversation-specific storage
        setConversationMessages(prev => {
          const newMap = new Map(prev);
          const conversationId = message.conversationId;
          const existingMessages = newMap.get(conversationId) || [];
          
          // Prevent duplicates
          if (!existingMessages.find(msg => msg.id === message.id)) {
            newMap.set(conversationId, [...existingMessages, message]);
          }
          
          return newMap;
        });
        
        // Add message to current conversation if it's active
        if (activeConversation && message.conversationId === activeConversation.id) {
          addMessage(message);
        }
        
        // Update conversation's last message
        updateConversationLastMessage(message.conversationId, message);
      });

      chatSignalRService.on('conversationRead', ({ conversationId, userId }) => {
        console.log('Conversation read:', conversationId, userId);
        // Update message read status if it's the active conversation
        if (activeConversation && conversationId === activeConversation.id) {
          setMessages(prev => prev.map(msg => 
            msg.senderId === user?.id ? { ...msg, isRead: true } : msg
          ));
        }
      });

      chatSignalRService.on('typing', ({ conversationId, userId, isTyping }) => {
        if (userId === user?.id) return; // Ignore our own typing
        
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          if (!newMap.has(conversationId)) {
            newMap.set(conversationId, new Set());
          }
          
          const usersInConversation = newMap.get(conversationId);
          if (isTyping) {
            usersInConversation.add(userId);
          } else {
            usersInConversation.delete(userId);
          }
          
          return newMap;
        });
      });

      // Start connection
      await chatSignalRService.start();
      
    } catch (error) {
      console.error('Failed to initialize SignalR:', error);
      setIsConnecting(false);
      setError('Bağlantı başlatılamadı');
    }
  }, [user, activeConversation, token]);

  const disconnectSignalR = useCallback(async () => {
    try {
      console.log('[Chat Context] Disconnecting SignalR...');
      await chatSignalRService.stop();
      setIsConnected(false);
      setIsConnecting(false);
      console.log('[Chat Context] SignalR disconnected successfully');
    } catch (error) {
      console.error('[Chat Context] Error disconnecting SignalR:', error);
    }
  }, []);

  // Update conversations list
  const updateConversations = useCallback((newConversations) => {
    setConversations(newConversations);
  }, []);

  // Update active conversation
  const updateActiveConversation = useCallback(async (conversation) => {
    // Leave previous conversation
    if (activeConversation) {
      try {
        await chatSignalRService.leaveConversation(activeConversation.id);
      } catch (error) {
        console.error('Error leaving conversation:', error);
      }
    }

    setActiveConversation(conversation);

    // Join new conversation
    if (conversation && isConnected) {
      try {
        await chatSignalRService.joinConversation(conversation.id);
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    }
  }, [activeConversation, isConnected]);

  // Update messages for active conversation
  const updateMessages = useCallback((newMessages) => {
    setMessages(newMessages);
  }, []);

  // Add new message to current messages
  const addMessage = useCallback((message) => {
    setMessages(prev => {
      // Prevent duplicates
      if (prev.find(msg => msg.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  // Update conversation's last message and unread count
  const updateConversationLastMessage = useCallback((conversationId, message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: message, 
              lastMessageAt: message.createdAt,
              // Only increment unread count if it's not our message and not the active conversation
              unreadCount: message.senderId === user?.id || (activeConversation?.id === conversationId) 
                ? conv.unreadCount 
                : (conv.unreadCount || 0) + 1
            }
          : conv
      )
    );
  }, [user, activeConversation]);

  // Mark conversation as read (reset unread count)
  const markConversationAsRead = useCallback(async (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // Also mark as read via SignalR
    if (isConnected) {
      try {
        await chatSignalRService.markConversationAsRead(conversationId);
      } catch (error) {
        console.error('Error marking conversation as read via SignalR:', error);
      }
    }
  }, [isConnected]);

  // Send message via SignalR
  const sendMessage = useCallback(async (conversationId, content) => {
    if (!isConnected) {
      throw new Error('SignalR bağlantısı yok');
    }

    try {
      const message = await chatSignalRService.sendMessage(conversationId, content);
      return message;
    } catch (error) {
      console.error('Error sending message via SignalR:', error);
      throw error;
    }
  }, [isConnected]);

  // Send typing indicator
  const sendTyping = useCallback(async (conversationId, isTyping) => {
    if (isConnected && activeConversation?.id === conversationId) {
      try {
        await chatSignalRService.sendTyping(conversationId, isTyping);
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
  }, [isConnected, activeConversation]);

  // Get typing users for a conversation
  const getTypingUsers = useCallback((conversationId) => {
    return typingUsers.get(conversationId) || new Set();
  }, [typingUsers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset chat state (on logout)
  const resetChatState = useCallback(() => {
    setConversations([]);
    setActiveConversation(null);
    setMessages([]);
    setConversationMessages(new Map());
    setError(null);
    setTypingUsers(new Map());
  }, []);

  const value = {
    // State
    conversations,
    activeConversation,
    messages,
    conversationMessages,
    setConversationMessages,
    loading,
    error,
    isConnected,
    isConnecting,
    
    // Actions
    updateConversations,
    updateActiveConversation,
    updateMessages,
    addMessage,
    updateConversationLastMessage,
    markConversationAsRead,
    sendMessage,
    sendTyping,
    getTypingUsers,
    setLoading,
    setError,
    clearError,
    resetChatState
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
