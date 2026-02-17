import { useState } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MiniPlayerBar } from '@/features/player/MiniPlayerBar';
import { FullPlayerSheet } from '@/features/player/FullPlayerSheet';
import { MusicPage } from '@/pages/MusicPage';
import { VideoPage } from '@/pages/VideoPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProfileSetupDialog } from '@/features/auth/ProfileSetupDialog';
import { useOfflineStatus } from '../offline/useOfflineStatus';
import { WifiOff } from 'lucide-react';

type Tab = 'music' | 'video' | 'library' | 'settings';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('music');
  const { isOffline } = useOfflineStatus();

  return (
    <div className="flex flex-col h-screen bg-background">
      <ProfileSetupDialog />
      
      {isOffline && (
        <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
          <WifiOff className="w-4 h-4" />
          <span>You're offline. Some features may be limited.</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'music' && <MusicPage />}
        {activeTab === 'video' && <VideoPage />}
        {activeTab === 'library' && <LibraryPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <MiniPlayerBar />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <FullPlayerSheet />
    </div>
  );
}
