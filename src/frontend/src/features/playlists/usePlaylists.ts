import { useState, useEffect } from 'react';
import { db, type PlaylistLocal } from '@/lib/storage/indexedDb';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { Track } from '@/backend';
import { toast } from 'sonner';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistLocal[]>([]);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    loadPlaylists();
  }, [actor, identity]);

  async function loadPlaylists() {
    try {
      const localPlaylists = await db.getAllPlaylists();
      
      if (actor && identity) {
        try {
          const cloudPlaylistNames = await actor.getAllPlaylists();
          setPlaylists(localPlaylists);
        } catch (error) {
          console.warn('Could not sync playlists from cloud:', error);
          setPlaylists(localPlaylists);
        }
      } else {
        setPlaylists(localPlaylists);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  }

  async function createPlaylist(name: string) {
    try {
      const newPlaylist: PlaylistLocal = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        trackIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await db.addPlaylist(newPlaylist);
      setPlaylists(prev => [...prev, newPlaylist]);
      
      if (actor && identity) {
        try {
          await actor.createPlaylist(name);
        } catch (error) {
          console.warn('Could not sync playlist to cloud:', error);
        }
      }
      
      toast.success(`Created playlist "${name}"`);
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast.error('Failed to create playlist');
    }
  }

  async function deletePlaylist(id: string) {
    try {
      const playlist = playlists.find(p => p.id === id);
      await db.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
      
      if (actor && identity && playlist) {
        try {
          await actor.deletePlaylist(playlist.name);
        } catch (error) {
          console.warn('Could not delete playlist from cloud:', error);
        }
      }
      
      toast.success('Playlist deleted');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      toast.error('Failed to delete playlist');
    }
  }

  async function addTrackToPlaylist(playlistId: string, trackId: string, trackData: { title: string; artist: string; album: string }) {
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return;
      
      const updatedPlaylist = {
        ...playlist,
        trackIds: [...playlist.trackIds, trackId],
        updatedAt: Date.now(),
      };
      
      await db.addPlaylist(updatedPlaylist);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
      
      if (actor && identity) {
        try {
          const track: Track = {
            id: trackId,
            title: trackData.title,
            artist: trackData.artist,
            album: trackData.album,
          };
          await actor.addTrackToPlaylist(playlist.name, track);
        } catch (error) {
          console.warn('Could not sync track to cloud playlist:', error);
        }
      }
      
      toast.success('Added to playlist');
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
      toast.error('Failed to add to playlist');
    }
  }

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    reloadPlaylists: loadPlaylists,
  };
}
