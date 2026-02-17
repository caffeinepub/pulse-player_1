import { usePlayerSettings } from './usePlayerSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PlaybackSettingsCard() {
  const { settings, updateSettings } = usePlayerSettings();

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Playback</h2>
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="gestures">Video Gesture Controls</Label>
            <p className="text-sm text-muted-foreground">
              Swipe to adjust volume and brightness
            </p>
          </div>
          <Switch
            id="gestures"
            checked={settings.gesturesEnabled}
            onCheckedChange={(checked) => updateSettings({ gesturesEnabled: checked })}
          />
        </div>
      </div>
    </section>
  );
}
