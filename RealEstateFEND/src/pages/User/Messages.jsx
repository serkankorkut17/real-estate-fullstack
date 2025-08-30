import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import { HiChat, HiRefresh } from 'react-icons/hi';
import { useAuthContext } from '../../context/Auth';
import { useChatContext } from '../../context/Chat';
import { getConversationsAPI } from '../../services/ChatService';
import { formatDate } from '../../utils';
import ChatModal from '../../components/Chat/ChatModal';

const Messages = () => {
    const { t } = useTranslation(['common', 'chat']);
    const { user } = useAuthContext();
    const { 
        conversations, 
        updateConversations, 
        loading, 
        setLoading,
        isConnected,
        isConnecting
    } = useChatContext();

    console.log(conversations);
    
    
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    const loadConversations = async (showRefreshSpinner = false) => {
        try {
            if (showRefreshSpinner) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getConversationsAPI();
            console.log(response);
            
            
            if (response.status === 200) {
                const conversationsList = response.data.items || response.data || [];
                updateConversations(conversationsList);
                console.log('Conversations loaded:', conversationsList);
            } else {
                console.error('Failed to load conversations:', response);
                toast.error(t('chat.errorLoadingConversations') || 'Sohbetler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast.error(t('chat.errorLoadingConversations') || 'Sohbetler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        loadConversations(true);
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        setShowChatModal(true);
    };

    const handleCloseChatModal = () => {
        setSelectedConversation(null);
        setShowChatModal(false);
        // Refresh conversations to update unread counts
        loadConversations(true);
    };

    const getOtherParticipant = (conversation) => {
        const otherParticipant = {
            firstName: conversation.otherUserFirstName ?? t('chat.unknown'),
            lastName: conversation.otherUserLastName ?? ''
        }
        return otherParticipant;
    };

    const formatLastMessageTime = (dateString) => {
        if (!dateString) return '';
        
        const now = new Date();
        const messageDate = new Date(dateString);
        const diffInMs = now - messageDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            // Today - show time
            return messageDate.toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (diffInDays === 1) {
            // Yesterday
            return t('chat.yesterday');
        } else if (diffInDays < 7) {
            // This week - show day name
            return messageDate.toLocaleDateString('tr-TR', { weekday: 'long' });
        } else {
            // Older - show date
            return messageDate.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short'
            });
        }
    };

    if (loading && conversations.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {t('chat.loadingConversations') || 'Sohbetler yükleniyor...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('chat.messagesPage') || 'Mesajlarım'}
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {t('chat.conversationsList') || 'Tüm sohbetleriniz'}
                    </p>
                    {!isConnected && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {isConnecting 
                                ? (t('chat.connecting') || 'Bağlanıyor...')
                                : (t('chat.offline') || 'Çevrimdışı')
                            }
                        </p>
                    )}
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    color="gray"
                    size="sm"
                >
                    {refreshing ? (
                        <Spinner size="sm" className="mr-2" />
                    ) : (
                        <HiRefresh className="mr-2 h-4 w-4" />
                    )}
                    {t('chat.refresh') || 'Yenile'}
                </Button>
            </div>

            {conversations.length === 0 ? (
                <div className="text-center py-12">
                    <HiChat className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t('chat.noConversations') || 'Henüz mesajınız yok'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('chat.startMessaging') || 'İlgilendiğiniz emlaklar için mesaj göndermeye başlayın'}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {conversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation);
                            const hasUnread = conversation.unreadCount > 0;
                            
                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => handleConversationClick(conversation)}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-sm font-medium truncate ${
                                                    hasUnread 
                                                        ? 'text-gray-900 dark:text-white font-semibold' 
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {otherParticipant.firstName} {otherParticipant.lastName}
                                                </h4>
                                                <div className="flex items-center space-x-2">
                                                    {hasUnread && (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatLastMessageTime(conversation.lastMessageAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {conversation.propertyTitle && (
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                                                    {conversation.propertyTitle}
                                                </p>
                                            )}
                                            
                                            {conversation.lastMessage && (
                                                <p className={`text-sm truncate ${
                                                    hasUnread 
                                                        ? 'text-gray-900 dark:text-gray-200 font-medium' 
                                                        : 'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {conversation.lastMessage.content}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="ml-4 flex-shrink-0">
                                            <HiChat className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {showChatModal && selectedConversation && (
                <ChatModal
                    show={showChatModal}
                    onClose={handleCloseChatModal}
                    conversation={selectedConversation}
                    property={null}
                    owner={null}
                />
            )}
        </div>
    );
};

export default Messages;
