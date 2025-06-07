'use client';

import { useSettingsStore } from '@/store/slices/settings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/elements/icons';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function SettingsPanel() {
  const { isDarkMode, soundNotifications, toggleDarkMode, toggleSoundNotifications } = useSettingsStore();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Settings</h2>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="font-medium">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when receiving messages
              </p>
            </div>
            <Switch
              checked={soundNotifications}
              onCheckedChange={toggleSoundNotifications}
            />
          </div>
        </div>

        <Separator />

        {/* Account */}
        <div className="space-y-4">
          <h3 className="font-medium">Account</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/profile')}
            >
              <Icons.user className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/auth/change-password')}
            >
              <Icons.lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sign Out */}
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}