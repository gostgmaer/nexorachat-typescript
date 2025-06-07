import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStore, User, AuthUser } from '@/types';

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      setUsers: (users: User[]) => set({ users }),

      setCurrentUser: (user: AuthUser | null) => set({ currentUser: user }),

      updateUserStatus: (userId: string, isOnline: boolean) => {
        const { users } = get();
        set({
          users: users.map(user =>
            user.id === userId
              ? { ...user, isOnline, lastSeen: isOnline ? undefined : new Date() }
              : user
          ),
        });
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);