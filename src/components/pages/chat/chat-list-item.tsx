'use client';

import { Chat } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatListItemProps {
  chat: Chat;
  onClick: () => void;
  isActive: boolean;
}

export function ChatListItem({ chat, onClick, isActive }: ChatListItemProps) {
  const participant = chat.participants[0];
  const lastMessage = chat.lastMessage;

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent',
        isActive && 'bg-accent'
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={participant?.image} />
          <AvatarFallback>{participant?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {participant?.isOnline && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{participant?.name}</h3>
          {lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatTime(new Date(lastMessage.timestamp))}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate">
            {chat.isTyping 
              ? 'Typing...' 
              : lastMessage 
                ? truncateMessage(lastMessage.content)
                : 'No messages yet'
            }
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <Badge variant="default" className="h-5 min-w-[20px] text-xs">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}