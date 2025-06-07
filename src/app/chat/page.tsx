'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '@/store/slices/user';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MessageList } from '@/components/pages/chat/message-list';
import { MessageInput } from '@/components/pages/chat/message-input';
import { IncomingCallModal } from '@/components/elements/call/incoming-call-modal';
import { CallInterface } from '@/components/elements/call/call-interface';
import { Icons } from '@/components/elements/icons';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { setCurrentUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user) {
      setCurrentUser({
        
        id: (session.user as { id?: string }).id || 'current-user',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
      });
    }
  }, [session, status, setCurrentUser, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* <Header /> */}
      <div className="flex-1 flex overflow-auto">
        {/* <Sidebar className="hidden md:flex" /> */}
        
        <div className="flex-1 flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
      </div>

      {/* Call Components */}
      <IncomingCallModal />
      <CallInterface />
    </div>
  );
}