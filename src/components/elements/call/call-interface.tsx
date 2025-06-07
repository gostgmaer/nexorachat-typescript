'use client';

import { useEffect, useState } from 'react';
import { useCall } from '@/hooks/use-call';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useCallStore } from '@/store/slices/call';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icons } from '@/components/elements/icons';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function CallInterface() {
  const { currentCall, endCurrentCall } = useCall();
  const { isCallActive, isMuted, isVideoEnabled } = useCallStore();
  const { 
    localVideoRef, 
    remoteVideoRef, 
    toggleMute, 
    toggleVideo, 
    handleEndCall,
    initiatePeer 
  } = useWebRTC();
  const [callDuration, setCallDuration] = useState<string>('00:00');

  // Initialize peer connection when call starts
  useEffect(() => {
    if (currentCall && currentCall.status === 'calling') {
      initiatePeer(true, currentCall);
    }
  }, [currentCall, initiatePeer]);

  // Update call duration
  useEffect(() => {
    if (currentCall && isCallActive) {
      const interval = setInterval(() => {
        const duration = formatDistanceToNow(new Date(currentCall.startTime!), {
          includeSeconds: true,
        });
        setCallDuration(duration);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentCall, isCallActive]);

  const handleEndCallClick = () => {
    handleEndCall();
    endCurrentCall();
  };

  if (!currentCall) return null;

  const isVideoCall = currentCall.type === 'video';
  const participant = currentCall.callerId !== currentCall.receiverId 
    ? { name: currentCall.callerName, image: currentCall.callerImage }
    : { name: 'Unknown', image: undefined };

  return (
    <Dialog open={!!currentCall}>
      <DialogContent className="sm:max-w-4xl h-[80vh] p-0">
        <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
          {isVideoCall ? (
            <>
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Local Video */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : (
            /* Voice Call UI */
            <div className="flex flex-col items-center justify-center h-full text-white">
              <Avatar className="h-32 w-32 mb-6">
                <AvatarImage src={participant.image} />
                <AvatarFallback className="text-4xl bg-gray-700">
                  {participant.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-semibold mb-2">{participant.name}</h2>
              <p className="text-gray-300 mb-4">
                {isCallActive ? `Call duration: ${callDuration}` : 'Connecting...'}
              </p>
            </div>
          )}

          {/* Call Status Overlay */}
          {!isCallActive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">
                  {currentCall.status === 'calling' ? 'Calling...' : 'Connecting...'}
                </p>
              </div>
            </div>
          )}

          {/* Call Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
              {/* Mute Button */}
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  'rounded-full h-12 w-12 text-white hover:bg-white hover:bg-opacity-20',
                  isMuted && 'bg-red-500 hover:bg-red-600'
                )}
                onClick={toggleMute}
              >
                {isMuted ? (
                  <Icons.micOff className="h-6 w-6" />
                ) : (
                  <Icons.mic className="h-6 w-6" />
                )}
              </Button>

              {/* Video Toggle (only for video calls) */}
              {isVideoCall && (
                <Button
                  variant="ghost"
                  size="lg"
                  className={cn(
                    'rounded-full h-12 w-12 text-white hover:bg-white hover:bg-opacity-20',
                    !isVideoEnabled && 'bg-red-500 hover:bg-red-600'
                  )}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? (
                    <Icons.video className="h-6 w-6" />
                  ) : (
                    <Icons.videoOff className="h-6 w-6" />
                  )}
                </Button>
              )}

              {/* End Call Button */}
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={handleEndCallClick}
              >
                <Icons.phoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Call Duration (for active calls) */}
          {isCallActive && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-full px-4 py-2">
              <p className="text-white text-sm">{callDuration}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}