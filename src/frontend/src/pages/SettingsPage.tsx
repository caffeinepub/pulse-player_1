import { LoginButton } from '@/features/auth/LoginButton';
import { EqualizerSettingsCard } from '@/features/equalizer/EqualizerSettingsCard';
import { PlaybackSettingsCard } from '@/features/settings/PlaybackSettingsCard';
import { SleepTimerControl } from '@/features/sleep-timer/SleepTimerControl';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Monitor, Download, CloudOff } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useExportCloudData } from '@/hooks/useQueries';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';
import { exportAllData } from '@/features/settings/exportData';
import { toast } from 'sonner';
import { useState } from 'react';
import type { CloudData } from '@/backend';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { identity } = useInternetIdentity();
  const { refetch: fetchCloudData } = useExportCloudData();
  const { offlineOnly, setOfflineOnly, isLoading: offlineModeLoading } = useOfflineOnlyMode();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let cloudData: CloudData | null = null;
      
      // Only try to fetch cloud data if not in offline-only mode and signed in
      if (!offlineOnly && identity) {
        try {
          const result = await fetchCloudData();
          cloudData = result.data ?? null;
        } catch (error) {
          console.error('Failed to fetch cloud data:', error);
        }
      }

      await exportAllData(cloudData);
      
      toast.success('Export successful', {
        description: 'Your data has been downloaded.',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'Unable to export data. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOfflineOnlyToggle = async (checked: boolean) => {
    try {
      await setOfflineOnly(checked);
      if (checked) {
        toast.success('Local-only mode enabled', {
          description: 'All data will be stored locally only.',
        });
      } else {
        toast.success('Local-only mode disabled', {
          description: 'Cloud features are now available.',
        });
      }
    } catch (error) {
      toast.error('Failed to update mode', {
        description: 'Please try again.',
      });
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">App Mode</h2>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <CloudOff className="w-4 h-4" />
                <p className="font-medium">Local-only mode</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Store all data locally without cloud sync
              </p>
            </div>
            <Switch
              checked={offlineOnly}
              onCheckedChange={handleOfflineOnlyToggle}
              disabled={offlineModeLoading}
            />
          </div>
        </div>
      </section>

      <Separator />

      {!offlineOnly && (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Account</h2>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {identity ? 'Signed in' : 'Sign in to sync your data across devices'}
                  </p>
                </div>
                <LoginButton />
              </div>
            </div>
          </section>

          <Separator />
        </>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Data Management</h2>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export data</p>
              <p className="text-sm text-muted-foreground mt-1">
                {offlineOnly 
                  ? 'Download all your local data as JSON'
                  : 'Download all your local and cloud data as JSON'}
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-accent shadow-sm'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-accent shadow-sm'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-primary bg-accent shadow-sm'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <EqualizerSettingsCard />

      <Separator />

      <PlaybackSettingsCard />

      <Separator />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sleep Timer</h2>
        <SleepTimerControl />
      </section>

      <footer className="pt-8 pb-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
