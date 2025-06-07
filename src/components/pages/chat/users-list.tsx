'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/slices/user';
import { useChat } from '@/hooks/use-chat';
import { mockUsers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/elements/icons';
import { cn } from '@/lib/utils';
import { User } from '@/types';

export function UsersList() {
  const { users, setUsers, currentUser } = useUserStore();
  const { startChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with mock data
  useEffect(() => {
    setUsers(mockUsers);
  }, [setUsers]);

  const filteredUsers = users.filter(user => 
    user.id !== currentUser?.id &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (user: User) => {
    startChat(user);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-3">Users</h2>
        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Icons.users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    'absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full',
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {user.isOnline ? 'Online' : `Last seen ${user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : 'unknown'}`}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartChat(user)}
                  className="shrink-0"
                >
                  <Icons.message className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}