'use client';

import { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { Icons } from '@/components/elements/icons';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderImage?: string;
}

export function ChatBubble({ 
  message, 
  isOwn, 
  showAvatar = true, 
  senderName,
  senderImage 
}: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  return (
    <div className={cn(
      'flex items-end gap-2 max-w-[80%]',
      isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
    )}>
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderImage} />
          <AvatarFallback>{senderName?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        'flex flex-col gap-1',
        isOwn ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-2 break-words',
          isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted text-muted-foreground rounded-bl-md'
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={cn(
          'flex items-center gap-1 text-xs text-muted-foreground',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span>{formatTime(new Date(message.timestamp))}</span>
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <Icons.checkCircle className="h-3 w-3 text-primary" />
              ) : (
                <Icons.check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}