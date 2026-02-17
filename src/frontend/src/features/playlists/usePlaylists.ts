import { useState, useEffect } from 'react';
import { db, type PlaylistLocal } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';
import type { Track } from '@/backend';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { offlineOnly } = useOfflineOnlyMode();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const localPlaylists = await db.getAllPlaylists();
      setPlaylists(localPlaylists);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async (name: string) => {
    const newPlaylist: PlaylistLocal = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      trackIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await db.addPlaylist(newPlaylist);
      setPlaylists(prev => [...prev, newPlaylist]);

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.createPlaylist(name);
        } catch (error) {
          console.error('Cloud sync failed (create playlist):', error);
        }
      }
    } catch (error) {
      console.error('Failed to create playlist:', error);
      throw error;
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      const playlist = playlists.find(p => p.id === id);
      await db.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity && playlist) {
        try {
          await actor.deletePlaylist(playlist.name);
        } catch (error) {
          console.error('Cloud sync failed (delete playlist):', error);
        }
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      throw error;
    }
  };

  const addTrackToPlaylist = async (playlistId: string, track: Track) => {
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) throw new Error('Playlist not found');

      const updatedPlaylist: PlaylistLocal = {
        ...playlist,
        trackIds: [...playlist.trackIds, track.id],
        updatedAt: Date.now(),
      };

      await db.addPlaylist(updatedPlaylist);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.addTrackToPlaylist(playlist.name, track);
        } catch (error) {
          console.error('Cloud sync failed (add track):', error);
        }
      }
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
      throw error;
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) throw new Error('Playlist not found');

      const updatedPlaylist: PlaylistLocal = {
        ...playlist,
        trackIds: playlist.trackIds.filter(id => id !== trackId),
        updatedAt: Date.now(),
      };

      await db.addPlaylist(updatedPlaylist);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));

      // Sync to cloud only if not in offline-only mode and authenticated
      if (!offlineOnly && actor && identity) {
        try {
          await actor.removeTrackFromPlaylist(playlist.name, trackId);
        } catch (error) {
          console.error('Cloud sync failed (remove track):', error);
        }
      }
    } catch (error) {
      console.error('Failed to remove track from playlist:', error);
      throw error;
    }
  };

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    isLoading,
  };
}
