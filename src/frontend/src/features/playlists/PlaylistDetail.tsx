import type { PlaylistLocal } from '@/lib/storage/indexedDb';
import { useLibrary } from '../library/useLibrary';
import { usePlaylists } from './usePlaylists';
import { usePlayer } from '../player/PlayerProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { TrackList } from '../tracks/TrackList';

interface PlaylistDetailProps {
  playlist: PlaylistLocal;
  onBack: () => void;
}

export function PlaylistDetail({ playlist, onBack }: PlaylistDetailProps) {
  const { audioTracks } = useLibrary();
  const { deletePlaylist } = usePlaylists();
  const { play } = usePlayer();

  const tracks = playlist.trackIds
    .map(id => audioTracks.find(t => t.id === id))
    .filter((track): track is NonNullable<typeof track> => track !== undefined);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      play(tracks[0], tracks);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      await deletePlaylist(playlist.id);
      onBack();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold flex-1">{playlist.name}</h2>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      {tracks.length > 0 ? (
        <>
          <Button onClick={handlePlayAll} className="w-full mb-4 gap-2">
            <Play className="w-4 h-4" />
            Play All
          </Button>
          <TrackList tracks={tracks} context={`playlist-${playlist.id}`} />
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tracks in this playlist</p>
          <p className="text-sm mt-1">Add tracks from your library</p>
        </div>
      )}
    </div>
  );
}
