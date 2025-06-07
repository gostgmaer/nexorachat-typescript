'use client';

import { useCallback } from 'react';
// import { useChatStore } from '@/store/chat';
// import { useUserStore } from '@/store/user';
import { useSocket } from './use-socket';
import { Message, Chat, User } from '@/types';
import { toast } from 'sonner';
import { useUserStore } from '@/store/slices/user';
import { useChatStore } from '@/store/slices/chat';

export function useChat() {
  const { chats, activeChat, messages, addMessage, setActiveChat, markAsRead } = useChatStore();
  const { currentUser } = useUserStore();
  const { emit } = useSocket();

  const sendMessage = useCallback(async (content: string, chatId?: string) => {
    if (!currentUser || !content.trim()) return;

    const targetChatId = chatId || activeChat?.id;
    if (!targetChatId) {
      toast.error('No active chat selected');
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      senderId: currentUser.id,
      chatId: targetChatId,
      timestamp: new Date(),
      isRead: false,
    };

    // Add message locally first for immediate UI feedback
    addMessage(targetChatId, message);

    // Emit to socket server
    emit('message-sent', message);
  }, [currentUser, activeChat?.id, addMessage, emit]);

  const startChat = useCallback((user: User): Chat => {
    const existingChat = chats.find(chat => 
      chat.participants.some(p => p.id === user.id)
    );

    if (existingChat) {
      setActiveChat(existingChat);
      return existingChat;
    }

    const newChat: Chat = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      participants: [user],
      unreadCount: 0,
    };

    setActiveChat(newChat);
    return newChat;
  }, [chats, setActiveChat]);

  const markMessageAsRead = useCallback((messageId: string, chatId?: string) => {
    const targetChatId = chatId || activeChat?.id;
    if (!targetChatId || !currentUser) return;

    markAsRead(targetChatId, messageId);
    emit('message-read', { chatId: targetChatId, messageId, userId: currentUser.id });
  }, [activeChat?.id, currentUser, markAsRead, emit]);

  const startTyping = useCallback((chatId?: string) => {
    const targetChatId = chatId || activeChat?.id;
    if (!targetChatId || !currentUser) return;

    emit('typing-start', { chatId: targetChatId, userId: currentUser.id });
  }, [activeChat?.id, currentUser, emit]);

  const stopTyping = useCallback((chatId?: string) => {
    const targetChatId = chatId || activeChat?.id;
    if (!targetChatId || !currentUser) return;

    emit('typing-stop', { chatId: targetChatId, userId: currentUser.id });
  }, [activeChat?.id, currentUser, emit]);

  return {
    chats,
    activeChat,
    messages: activeChat ? messages[activeChat.id] || [] : [],
    sendMessage,
    startChat,
    setActiveChat,
    markMessageAsRead,
    startTyping,
    stopTyping,
  };
}