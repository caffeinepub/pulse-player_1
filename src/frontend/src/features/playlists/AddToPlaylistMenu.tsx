import type { MediaTrack } from '@/lib/storage/indexedDb';
import { usePlaylists } from './usePlaylists';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';

interface AddToPlaylistMenuProps {
  track: MediaTrack;
}

export function AddToPlaylistMenu({ track }: AddToPlaylistMenuProps) {
  const { playlists, addTrackToPlaylist } = usePlaylists();

  if (playlists.length === 0) {
    return (
      <DropdownMenuItem disabled>
        <Plus className="w-4 h-4 mr-2" />
        No playlists
      </DropdownMenuItem>
    );
  }

  return (
    <>
      {playlists.map((playlist) => (
        <DropdownMenuItem
          key={playlist.id}
          onClick={() => addTrackToPlaylist(playlist.id, track.id, {
            title: track.title,
            artist: track.artist,
            album: track.album,
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          {playlist.name}
        </DropdownMenuItem>
      ))}
    </>
  );
}
