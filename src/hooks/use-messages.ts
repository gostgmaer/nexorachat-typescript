'use client';

import { useChatStore } from '@/store/slices/chat';
import { useUserStore } from '@/store/slices/user';
import { useEffect, useRef } from 'react';
// import { useChatStore } from '@/store/chat';
// import { useUserStore } from '@/store/user';

export function useMessages(chatId?: string) {
  const { messages, activeChat } = useChatStore();
  const { currentUser } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const targetChatId = chatId || activeChat?.id;
  const chatMessages = targetChatId ? messages[targetChatId] || [] : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length]);

  const getMessageStatus = (senderId: string, isRead: boolean) => {
    if (senderId !== currentUser?.id) return null;
    return isRead ? 'read' : 'sent';
  };

  return {
    messages: chatMessages,
    messagesEndRef,
    getMessageStatus,
    currentUserId: currentUser?.id,
  };
}