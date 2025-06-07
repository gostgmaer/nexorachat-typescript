'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/slices/chat';
import { useUserStore } from '@/store/slices/user';
import { mockChats, mockMessages } from '@/lib/mock-data';
import { ChatListItem } from './chat-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/elements/icons';
import { useState } from 'react';

export function ChatList() {
  const { chats, setChats, setActiveChat, messages } = useChatStore();
  const { currentUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with mock data
  useEffect(() => {
    setChats(mockChats);
    
    // Set mock messages
    Object.entries(mockMessages).forEach(([chatId, chatMessages]) => {
      chatMessages.forEach(message => {
        useChatStore.getState().addMessage(chatId, message);
      });
    });
  }, [setChats]);

  const filteredChats = chats.filter(chat => {
    const participant = chat.participants[0];
    return participant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-3">Chats</h2>
        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Icons.message className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No chats found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                onClick={() => setActiveChat(chat)}
                isActive={chat.id === useChatStore.getState().activeChat?.id}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}