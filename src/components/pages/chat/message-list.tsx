'use client';

import { useMessages } from '@/hooks/use-messages';
import { useCall } from '@/hooks/use-call';
import { useChatStore } from '@/store/slices/chat';
import { useUserStore } from '@/store/slices/user';
import { ChatBubble } from './chat-bubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/elements/icons';

export function MessageList() {
  const { messages, messagesEndRef, currentUserId } = useMessages();
  const { activeChat } = useChatStore();
  const { users } = useUserStore();
  const { initiateCall } = useCall();

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icons.message className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No chat selected</h3>
          <p>Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  const participant = activeChat.participants[0];
  const isTyping = activeChat.isTyping && activeChat.typingUsers?.length > 0;

  const getSenderInfo = (senderId: string) => {
    if (senderId === currentUserId) return { name: 'You', image: undefined };
    const user = users.find(u => u.id === senderId) || participant;
    return { name: user?.name || 'Unknown', image: user?.image };
  };

  const handleVoiceCall = () => {
    if (participant) {
      initiateCall(participant, 'voice');
    }
  };

  const handleVideoCall = () => {
    if (participant) {
      initiateCall(participant, 'video');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={participant?.image} />
          <AvatarFallback>{participant?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium">{participant?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {participant?.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleVoiceCall}
            className="hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
          >
            <Icons.phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleVideoCall}
            className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
          >
            <Icons.video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icons.moreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const senderInfo = getSenderInfo(message.senderId);
              const showAvatar = !isOwn && (
                index === 0 || 
                messages[index - 1]?.senderId !== message.senderId
              );

              return (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  senderName={senderInfo.name}
                  senderImage={senderInfo.image}
                />
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant?.image} />
                <AvatarFallback>{participant?.name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}