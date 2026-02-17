import type { MediaTrack } from '@/lib/storage/indexedDb';
import { useFavorites } from '../favorites/useFavorites';
import { AddToPlaylistMenu } from '../playlists/AddToPlaylistMenu';
import { Button } from '@/components/ui/button';
import { Heart, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrackActionsProps {
  track: MediaTrack;
}

export function TrackActions({ track }: TrackActionsProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isLiked = favorites.includes(track.id);

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(track.id);
        }}
        className={cn(isLiked && 'text-red-500')}
      >
        <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AddToPlaylistMenu track={track} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
