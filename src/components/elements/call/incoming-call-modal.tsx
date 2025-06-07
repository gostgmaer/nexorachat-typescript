'use client';

import { useEffect, useState } from 'react';
import { useCall } from '@/hooks/use-call';
import { useWebRTC } from '@/hooks/use-webrtc';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icons } from '@/components/elements/icons';
import { cn } from '@/lib/utils';

export function IncomingCallModal() {
  const { incomingCall, answerCall, declineCall } = useCall();
  const { initiatePeer } = useWebRTC();
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (incomingCall) {
      setIsRinging(true);
      // Play ringtone sound
      const audio = new Audio('/ringtone.mp3');
      audio.loop = true;
      audio.play().catch(() => {
        // Ignore audio play errors
      });

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    } else {
      setIsRinging(false);
    }
  }, [incomingCall]);

  const handleAnswer = async () => {
    if (incomingCall) {
      answerCall(incomingCall);
      await initiatePeer(false, incomingCall);
    }
  };

  const handleDecline = () => {
    if (incomingCall) {
      declineCall(incomingCall);
    }
  };

  if (!incomingCall) return null;

  return (
    <Dialog open={!!incomingCall}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Caller Avatar */}
          <div className={cn(
            'relative',
            isRinging && 'animate-pulse'
          )}>
            <Avatar className="h-24 w-24">
              <AvatarImage src={incomingCall.callerImage} />
              <AvatarFallback className="text-2xl">
                {incomingCall.callerName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 p-2 bg-primary rounded-full">
              {incomingCall.type === 'video' ? (
                <Icons.video className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Icons.phone className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
          </div>

          {/* Caller Info */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{incomingCall.callerName}</h3>
            <p className="text-muted-foreground">
              Incoming {incomingCall.type} call...
            </p>
          </div>

          {/* Call Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={handleDecline}
            >
              <Icons.phoneOff className="h-6 w-6" />
            </Button>
            
            <Button
              variant="default"
              size="lg"
              className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
              onClick={handleAnswer}
            >
              <Icons.phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}