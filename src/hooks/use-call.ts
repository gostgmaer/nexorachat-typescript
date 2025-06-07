'use client';

import { useCallback } from 'react';
import { useSocket } from './use-socket';
import { useCallStore } from '@/store/slices/call';
import { useUserStore } from '@/store/slices/user';
import { CallData, User } from '@/types';
import { toast } from 'sonner';

export function useCall() {
  const { emit } = useSocket();
  const { currentCall, incomingCall, setCurrentCall, setIncomingCall, endCall } = useCallStore();
  const { currentUser } = useUserStore();

  const initiateCall = useCallback((user: User, type: 'video' | 'voice') => {
    if (!currentUser) {
      toast.error('You must be logged in to make calls');
      return;
    }

    const callData: CallData = {
      id: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      callerId: currentUser.id,
      callerName: currentUser.name,
      callerImage: currentUser.image,
      receiverId: user.id,
      type,
      status: 'calling',
      startTime: new Date(),
    };

    setCurrentCall(callData);
    emit('call-initiated', callData);
    
    toast.success(`${type === 'video' ? 'Video' : 'Voice'} call initiated to ${user.name}`);
  }, [currentUser, setCurrentCall, emit]);

  const answerCall = useCallback((callData: CallData) => {
    setCurrentCall(callData);
    setIncomingCall(null);
    
    const answeredCall: CallData = {
      ...callData,
      status: 'connected',
    };
    
    emit('call-answered', answeredCall);
    toast.success('Call answered');
  }, [setCurrentCall, setIncomingCall, emit]);

  const declineCall = useCallback((callData: CallData) => {
    setIncomingCall(null);
    
    const declinedCall: CallData = {
      ...callData,
      status: 'declined',
      endTime: new Date(),
    };
    
    emit('call-declined', declinedCall);
    toast.info('Call declined');
  }, [setIncomingCall, emit]);

  const endCurrentCall = useCallback(() => {
    if (currentCall) {
      const endedCall: CallData = {
        ...currentCall,
        status: 'ended',
        endTime: new Date(),
      };
      
      emit('call-ended', endedCall);
      endCall();
      toast.info('Call ended');
    }
  }, [currentCall, emit, endCall]);

  return {
    currentCall,
    incomingCall,
    initiateCall,
    answerCall,
    declineCall,
    endCurrentCall,
  };
}