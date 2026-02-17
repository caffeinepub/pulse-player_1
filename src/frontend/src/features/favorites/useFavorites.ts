import { useState, useEffect } from 'react';
import { db } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    loadFavorites();
  }, [actor, identity]);

  async function loadFavorites() {
    try {
      const localFavs = await db.getAllFavorites();
      const localIds = localFavs.map(f => f.id);
      
      if (actor && identity) {
        try {
          const cloudFavs = await actor.getFavorites();
          const merged = Array.from(new Set([...localIds, ...cloudFavs]));
          setFavorites(merged);
          
          for (const id of merged) {
            if (!localIds.includes(id)) {
              await db.addFavorite(id);
            }
          }
        } catch (error) {
          console.warn('Could not sync favorites from cloud:', error);
          setFavorites(localIds);
        }
      } else {
        setFavorites(localIds);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }

  async function toggleFavorite(trackId: string) {
    const isCurrentlyFavorite = favorites.includes(trackId);
    
    try {
      if (isCurrentlyFavorite) {
        await db.removeFavorite(trackId);
        setFavorites(prev => prev.filter(id => id !== trackId));
      } else {
        await db.addFavorite(trackId);
        setFavorites(prev => [...prev, trackId]);
      }
      
      if (actor && identity) {
        try {
          await actor.toggleFavorite(trackId);
        } catch (error) {
          console.warn('Could not sync favorite to cloud:', error);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  }

  function isFavorite(trackId: string): boolean {
    return favorites.includes(trackId);
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
