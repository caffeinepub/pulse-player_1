import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EQ_PRESET_LABELS, type EQPreset } from './presets';

export function EqualizerSettingsCard() {
  const [preset, setPreset] = useState<EQPreset>('off');

  useEffect(() => {
    loadEQSettings();
  }, []);

  async function loadEQSettings() {
    const saved = await db.getSetting<EQPreset>('eq-preset');
    if (saved) setPreset(saved);
  }

  async function handlePresetChange(newPreset: EQPreset) {
    setPreset(newPreset);
    await db.setSetting('eq-preset', newPreset);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Equalizer</h2>
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eq-preset">Preset</Label>
          <Select value={preset} onValueChange={(v) => handlePresetChange(v as EQPreset)}>
            <SelectTrigger id="eq-preset">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(EQ_PRESET_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Note: Equalizer functionality requires Web Audio API support
        </p>
      </div>
    </section>
  );
}
