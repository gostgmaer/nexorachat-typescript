import { create } from 'zustand';
import { ChatStore, Chat, Message } from '@/types';

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: {},

  setChats: (chats: Chat[]) => set({ chats }),

  setActiveChat: (chat: Chat | null) => set({ activeChat: chat }),

  addMessage: (chatId: string, message: Message) => {
    const { messages, chats } = get();
    const chatMessages = messages[chatId] || [];
    
    set({
      messages: {
        ...messages,
        [chatId]: [...chatMessages, message].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      },
      chats: chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              lastMessage: message,
              unreadCount: message.senderId !== get().activeChat?.id ? (chat.unreadCount || 0) + 1 : chat.unreadCount
            }
          : chat
      ),
    });
  },

  markAsRead: (chatId: string, messageId: string) => {
    const { messages, chats } = get();
    const chatMessages = messages[chatId] || [];
    
    set({
      messages: {
        ...messages,
        [chatId]: chatMessages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ),
      },
      chats: chats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
    });
  },

  setTyping: (chatId: string, isTyping: boolean, userId?: string) => {
    const { chats } = get();
    
    set({
      chats: chats.map(chat => {
        if (chat.id === chatId) {
          if (isTyping && userId) {
            const typingUsers = chat.typingUsers || [];
            return {
              ...chat,
              isTyping: true,
              typingUsers: typingUsers.includes(userId) ? typingUsers : [...typingUsers, userId],
            };
          } else if (!isTyping && userId) {
            const typingUsers = (chat.typingUsers || []).filter(id => id !== userId);
            return {
              ...chat,
              isTyping: typingUsers.length > 0,
              typingUsers,
            };
          }
        }
        return chat;
      }),
    });
  },
}));