'use client';

import { useEffect, useCallback } from 'react';
import { socketManager } from '@/lib/socket';
import { useUserStore } from '@/store/slices/user';
import { useChatStore } from '@/store/slices/chat';
import { useCallStore } from '@/store/slices/call';
import { SocketEvents } from '@/types';
import { toast } from 'sonner';

export function useSocket() {
  const { currentUser, updateUserStatus } = useUserStore();
  const { addMessage, setTyping } = useChatStore();
  const { setIncomingCall } = useCallStore();

  const connect = useCallback(() => {
    if (!currentUser?.id) return;

    const socket = socketManager.connect(currentUser.id);

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('user-connected', (user) => {
      updateUserStatus(user.id, true);
      toast.success(`${user.name} is now online`);
    });

    socket.on('user-disconnected', (userId) => {
      updateUserStatus(userId, false);
    });

    socket.on('message-received', (message) => {
      addMessage(message.chatId, message);
      
      // Play notification sound if enabled
      if (typeof window !== 'undefined') {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      }
    });

    socket.on('typing-start', ({ chatId, userId }) => {
      setTyping(chatId, true, userId);
    });

    socket.on('typing-stop', ({ chatId, userId }) => {
      setTyping(chatId, false, userId);
    });

    // Call event listeners
    socket.on('call-initiated', (callData) => {
      if (callData.receiverId === currentUser.id) {
        setIncomingCall(callData);
        toast.info(`Incoming ${callData.type} call from ${callData.callerName}`);
      }
    });

    socket.on('call-answered', (callData) => {
      console.log('Call answered:', callData);
    });

    socket.on('call-declined', (callData) => {
      if (callData.callerId === currentUser.id) {
        toast.info('Call was declined');
        useCallStore.getState().endCall();
      }
    });

    socket.on('call-ended', (callData) => {
      toast.info('Call ended');
      useCallStore.getState().endCall();
    });

    // WebRTC signaling events
    socket.on('webrtc-offer', ({ callId, offer }) => {
      console.log('Received WebRTC offer:', callId, offer);
      // Handle in WebRTC hook
    });

    socket.on('webrtc-answer', ({ callId, answer }) => {
      console.log('Received WebRTC answer:', callId, answer);
      // Handle in WebRTC hook
    });

    socket.on('webrtc-ice-candidate', ({ callId, candidate }) => {
      console.log('Received ICE candidate:', callId, candidate);
      // Handle in WebRTC hook
    });

    return socket;
  }, [currentUser?.id, updateUserStatus, addMessage, setTyping, setIncomingCall]);

  const disconnect = useCallback(() => {
    socketManager.disconnect();
  }, []);

  const emit = useCallback(<K extends keyof SocketEvents>(
    event: K,
    data: Parameters<SocketEvents[K]>[0]
  ) => {
    socketManager.emit(event, data);
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [currentUser?.id, connect, disconnect]);

  return {
    connect,
    disconnect,
    emit,
    socket: socketManager.getSocket(),
  };
}