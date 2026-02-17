import type { MediaTrack } from '@/lib/storage/indexedDb';
import { TrackActions } from './TrackActions';
import { usePlayer } from '../player/PlayerProvider';
import { formatDuration } from '@/lib/media-utils';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackListProps {
  tracks: MediaTrack[];
  context: string;
}

export function TrackList({ tracks, context }: TrackListProps) {
  const { play, currentTrack } = usePlayer();

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isPlaying = currentTrack?.id === track.id;
        
        return (
          <div
            key={track.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border transition-colors',
              isPlaying
                ? 'bg-accent border-primary'
                : 'bg-card border-border hover:bg-accent'
            )}
          >
            <button
              onClick={() => play(track, tracks)}
              className="flex-1 flex items-center gap-3 min-w-0 text-left"
            >
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium truncate', isPlaying && 'text-primary')}>
                  {track.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              
              {track.duration && (
                <span className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </span>
              )}
            </button>
            
            <TrackActions track={track} />
          </div>
        );
      })}
    </div>
  );
}
