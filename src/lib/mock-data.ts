import { User, Chat, Message } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
    lastSeen: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
    lastSeen: new Date('2024-01-14T15:45:00Z'),
  },
];

export const mockMessages: Record<string, Message[]> = {
  'chat-1': [
    {
      id: 'msg-1',
      content: 'Hey! How are you doing?',
      senderId: '1',
      chatId: 'chat-1',
      timestamp: new Date('2024-01-15T09:00:00Z'),
      isRead: true,
    },
    {
      id: 'msg-2',
      content: 'I\'m doing great! Thanks for asking. How about you?',
      senderId: 'current-user',
      chatId: 'chat-1',
      timestamp: new Date('2024-01-15T09:05:00Z'),
      isRead: true,
    },
    {
      id: 'msg-3',
      content: 'That\'s wonderful to hear! I\'m doing well too. Working on some exciting projects.',
      senderId: '1',
      chatId: 'chat-1',
      timestamp: new Date('2024-01-15T09:10:00Z'),
      isRead: false,
    },
  ],
  'chat-2': [
    {
      id: 'msg-4',
      content: 'Did you see the presentation yesterday?',
      senderId: '2',
      chatId: 'chat-2',
      timestamp: new Date('2024-01-14T16:30:00Z'),
      isRead: true,
    },
    {
      id: 'msg-5',
      content: 'Yes, it was amazing! The team did a great job.',
      senderId: 'current-user',
      chatId: 'chat-2',
      timestamp: new Date('2024-01-14T16:35:00Z'),
      isRead: true,
    },
  ],
};

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    participants: [mockUsers[0]],
    lastMessage: mockMessages['chat-1'][2],
    unreadCount: 1,
  },
  {
    id: 'chat-2',
    participants: [mockUsers[1]],
    lastMessage: mockMessages['chat-2'][1],
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    participants: [mockUsers[2]],
    unreadCount: 0,
  },
];