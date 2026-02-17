import { LoginButton } from '@/features/auth/LoginButton';
import { EqualizerSettingsCard } from '@/features/equalizer/EqualizerSettingsCard';
import { PlaybackSettingsCard } from '@/features/settings/PlaybackSettingsCard';
import { SleepTimerControl } from '@/features/sleep-timer/SleepTimerControl';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { identity } = useInternetIdentity();

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authentication</p>
              <p className="text-sm text-muted-foreground mt-1">
                {identity ? 'Signed in with Internet Identity' : 'Sign in to sync your data'}
              </p>
            </div>
            <LoginButton />
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
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'light'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                  theme === 'system'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-sm">System</span>
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
