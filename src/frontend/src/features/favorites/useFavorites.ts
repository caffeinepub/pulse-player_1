import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { offlineOnly } = useOfflineOnlyMode();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const localFavorites = await db.getAllFavorites();
      const favoriteIds = localFavorites.map(f => f.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (trackId: string) => {
    const isFavorite = favorites.includes(trackId);
    
    try {
      if (isFavorite) {
        await db.removeFavorite(trackId);
        setFavorites(prev => prev.filter(id => id !== trackId));
      } else {
        await db.addFavorite(trackId);
        setFavorites(prev => [...prev, trackId]);
      }

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.toggleFavorite(trackId);
        } catch (error) {
          console.error('Cloud sync failed (favorites):', error);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  return {
    favorites,
    toggleFavorite,
    isLoading,
  };
}
