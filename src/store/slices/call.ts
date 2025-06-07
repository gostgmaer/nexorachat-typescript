import { create } from 'zustand';
import { CallStore, CallData } from '@/types';

export const useCallStore = create<CallStore>((set, get) => ({
  currentCall: null,
  incomingCall: null,
  isCallActive: false,
  isMuted: false,
  isVideoEnabled: true,

  setCurrentCall: (call: CallData | null) => set({ currentCall: call }),

  setIncomingCall: (call: CallData | null) => set({ incomingCall: call }),

  setCallActive: (active: boolean) => set({ isCallActive: active }),

  toggleMute: () => {
    const { isMuted } = get();
    set({ isMuted: !isMuted });
  },

  toggleVideo: () => {
    const { isVideoEnabled } = get();
    set({ isVideoEnabled: !isVideoEnabled });
  },

  endCall: () => {
    set({
      currentCall: null,
      incomingCall: null,
      isCallActive: false,
      isMuted: false,
      isVideoEnabled: true,
    });
  },
}));