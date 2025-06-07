'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/elements/icons';
import { cn } from '@/lib/utils';
import { ChatList } from '@/components/pages/chat/chat-list';
import { UsersList } from '@/components/pages/chat/users-list';
import { SettingsPanel } from '@/components/pages/settings/settings-panel';
// import { SettingsPanel } from '@/components/settings/settings-panel';

type SidebarTab = 'chats' | 'users' | 'settings';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('chats');

  const tabs = [
    { id: 'chats' as const, label: 'Chats', icon: Icons.message },
    { id: 'users' as const, label: 'Users', icon: Icons.users },
    { id: 'settings' as const, label: 'Settings', icon: Icons.settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatList />;
      case 'users':
        return <UsersList />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatList />;
    }
  };

  return (
    <div className={cn('w-80 border-r bg-background flex flex-col', className)}>
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'outline' : 'ghost'}
              className={cn(
                'flex-1 rounded-none border-0',
                activeTab === tab.id && 'bg-muted'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}