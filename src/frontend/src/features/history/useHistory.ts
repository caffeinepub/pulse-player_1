import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';

export function useHistory() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { offlineOnly } = useOfflineOnlyMode();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await db.getAllHistory();
      const historyIds = history.map(h => h.id);
      setRecentlyPlayed(historyIds);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (trackId: string) => {
    try {
      await db.addHistory(trackId);
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(id => id !== trackId);
        return [trackId, ...filtered];
      });

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.addToHistory(trackId);
        } catch (error) {
          console.error('Cloud sync failed (history):', error);
        }
      }
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await db.clearHistory();
      setRecentlyPlayed([]);

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.clearHistory();
        } catch (error) {
          console.error('Cloud sync failed (clear history):', error);
        }
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  };

  return {
    recentlyPlayed,
    addToHistory,
    clearHistory,
    isLoading,
  };
}
