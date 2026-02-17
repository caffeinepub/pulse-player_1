import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export function useHistory() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    loadHistory();
  }, [actor, identity]);

  async function loadHistory() {
    try {
      const localHistory = await db.getAllHistory();
      const localIds = localHistory.map(h => h.id);
      
      if (actor && identity) {
        try {
          const cloudHistory = await actor.getHistory();
          const merged = Array.from(new Set([...cloudHistory, ...localIds]));
          setRecentlyPlayed(merged.slice(0, 100));
        } catch (error) {
          console.warn('Could not sync history from cloud:', error);
          setRecentlyPlayed(localIds);
        }
      } else {
        setRecentlyPlayed(localIds);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  async function addToHistory(trackId: string) {
    try {
      await db.addHistory(trackId);
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(id => id !== trackId);
        return [trackId, ...filtered].slice(0, 100);
      });
      
      if (actor && identity) {
        try {
          await actor.addToHistory(trackId);
        } catch (error) {
          console.warn('Could not sync history to cloud:', error);
        }
      }
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  }

  async function clearHistory() {
    try {
      await db.clearHistory();
      setRecentlyPlayed([]);
      
      if (actor && identity) {
        try {
          await actor.clearHistory();
        } catch (error) {
          console.warn('Could not clear cloud history:', error);
        }
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  return {
    recentlyPlayed,
    addToHistory,
    clearHistory,
  };
}
