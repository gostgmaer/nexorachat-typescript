export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  timestamp: Date;
  isRead?: boolean;
  type?: 'text' | 'emoji';
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  isTyping?: boolean;
  typingUsers?: string[];
}

export interface AuthUser extends User {
  accessToken?: string;
}

export interface ChatStore {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  markAsRead: (chatId: string, messageId: string) => void;
  setTyping: (chatId: string, isTyping: boolean, userId?: string) => void;
}

export interface UserStore {
  users: User[];
  currentUser: AuthUser | null;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: AuthUser | null) => void;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
}

export interface SettingsStore {
  isDarkMode: boolean;
  soundNotifications: boolean;
  toggleDarkMode: () => void;
  toggleSoundNotifications: () => void;
}

export interface CallData {
  id: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  receiverId: string;
  type: 'video' | 'voice';
  status: 'calling' | 'ringing' | 'connected' | 'ended' | 'declined';
  startTime?: Date;
  endTime?: Date;
}

export interface CallStore {
  currentCall: CallData | null;
  incomingCall: CallData | null;
  isCallActive: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  setCurrentCall: (call: CallData | null) => void;
  setIncomingCall: (call: CallData | null) => void;
  setCallActive: (active: boolean) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  endCall: () => void;
}

export type Theme = 'dark' | 'light' | 'system';

export interface SocketEvents {
  'user-connected': (user: User) => void;
  'user-disconnected': (userId: string) => void;
  'message-received': (message: Message) => void;
  'message-sent': (message: Message) => void;
  'typing-start': (data: { chatId: string; userId: string }) => void;
  'typing-stop': (data: { chatId: string; userId: string }) => void;
  'message-read': (data: { chatId: string; messageId: string; userId: string }) => void;
  'call-initiated': (callData: CallData) => void;
  'call-answered': (callData: CallData) => void;
  'call-declined': (callData: CallData) => void;
  'call-ended': (callData: CallData) => void;
  'webrtc-offer': (data: { callId: string; offer: RTCSessionDescriptionInit }) => void;
  'webrtc-answer': (data: { callId: string; answer: RTCSessionDescriptionInit }) => void;
  'webrtc-ice-candidate': (data: { callId: string; candidate: RTCIceCandidateInit }) => void;
}