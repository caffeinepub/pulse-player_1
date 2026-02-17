import { useState, useEffect } from 'react';
import { getOfflineOnlyMode, setOfflineOnlyMode } from './offlineOnlyMode';

export function useOfflineOnlyMode() {
  const [offlineOnly, setOfflineOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOfflineOnlyMode()
      .then(setOfflineOnly)
      .finally(() => setIsLoading(false));
  }, []);

  const setMode = async (enabled: boolean) => {
    try {
      await setOfflineOnlyMode(enabled);
      setOfflineOnly(enabled);
    } catch (error) {
      console.error('Failed to update offline-only mode:', error);
      throw error;
    }
  };

  return {
    offlineOnly,
    setOfflineOnly: setMode,
    isLoading,
  };
}
