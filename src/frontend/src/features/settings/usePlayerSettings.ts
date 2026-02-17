import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';

export interface PlayerSettings {
  gesturesEnabled: boolean;
}

const DEFAULT_SETTINGS: PlayerSettings = {
  gesturesEnabled: true,
};

export function usePlayerSettings() {
  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const saved = await db.getSetting<PlayerSettings>('player-settings');
    if (saved) {
      setSettings(saved);
    }
  }

  async function updateSettings(updates: Partial<PlayerSettings>) {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await db.setSetting('player-settings', newSettings);
  }

  return {
    settings,
    updateSettings,
  };
}
