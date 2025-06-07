'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import SimplePeer from 'simple-peer';
import { useSocket } from './use-socket';
import { useCallStore } from '@/store/slices/call';
import { CallData } from '@/types';
import { toast } from 'sonner';

export function useWebRTC() {
  const { emit } = useSocket();
  const { currentCall, isMuted, isVideoEnabled, setCallActive, endCall } = useCallStore();
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const getMediaStream = useCallback(async (video: boolean = true, audio: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 640, height: 480 } : false,
        audio,
      });
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera/microphone');
      return null;
    }
  }, []);

  const initiatePeer = useCallback(async (isInitiator: boolean, callData: CallData) => {
    try {
      const stream = await getMediaStream(
        callData.type === 'video',
        true
      );
      
      if (!stream) return;

      setLocalStream(stream);
      
      if (localVideoRef.current && callData.type === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      const newPeer = new SimplePeer({
        initiator: isInitiator,
        trickle: false,
        stream,
      });

      newPeer.on('signal', (data) => {
        if (data.type === 'offer') {
          emit('webrtc-offer', { callId: callData.id, offer: data });
        } else if (data.type === 'answer') {
          emit('webrtc-answer', { callId: callData.id, answer: data });
        }
      });

      newPeer.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setCallActive(true);
      });

      newPeer.on('connect', () => {
        console.log('WebRTC connection established');
        setCallActive(true);
      });

      newPeer.on('error', (error) => {
        console.error('WebRTC error:', error);
        toast.error('Call connection failed');
        handleEndCall();
      });

      newPeer.on('close', () => {
        console.log('WebRTC connection closed');
        handleEndCall();
      });

      setPeer(newPeer);
    } catch (error) {
      console.error('Error initiating peer:', error);
      toast.error('Failed to start call');
    }
  }, [emit, getMediaStream, setCallActive]);

  const handleAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
    if (peer && !peer.destroyed) {
      peer.signal(answer);
    }
  }, [peer]);

  const handleOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    if (peer && !peer.destroyed) {
      peer.signal(offer);
    }
  }, [peer]);

  const handleEndCall = useCallback(() => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Stop remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }

    // Destroy peer connection
    if (peer && !peer.destroyed) {
      peer.destroy();
    }
    setPeer(null);

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Update store
    endCall();
  }, [localStream, remoteStream, peer, endCall]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        useCallStore.getState().toggleMute();
      }
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream && currentCall?.type === 'video') {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        useCallStore.getState().toggleVideo();
      }
    }
  }, [localStream, currentCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleEndCall();
    };
  }, [handleEndCall]);

  return {
    peer,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    initiatePeer,
    handleAnswer,
    handleOffer,
    handleEndCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoEnabled,
  };
}