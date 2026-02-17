import { AppBrandHeader } from '@/components/branding/AppBrandHeader';
import { RecommendationsSection } from '@/features/recommendations/RecommendationsSection';
import { PlaylistsPanel } from '@/features/playlists/PlaylistsPanel';
import { useLibrary } from '@/features/library/useLibrary';
import { useHistory } from '@/features/history/useHistory';
import { useFavorites } from '@/features/favorites/useFavorites';
import { TrackList } from '@/features/tracks/TrackList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, Disc3 } from 'lucide-react';

export function MusicPage() {
  const { audioTracks } = useLibrary();
  const { recentlyPlayed } = useHistory();
  const { favorites } = useFavorites();

  const recentTracks = recentlyPlayed
    .map(id => audioTracks.find(t => t.id === id))
    .filter((track): track is NonNullable<typeof track> => track !== undefined)
    .slice(0, 20);

  const favoriteTracks = favorites
    .map(id => audioTracks.find(t => t.id === id))
    .filter((track): track is NonNullable<typeof track> => track !== undefined);

  return (
    <div className="min-h-full">
      <AppBrandHeader />
      
      <div className="px-4 py-6 space-y-8">
        <RecommendationsSection />

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Disc3 className="w-5 h-5" />
            Your Playlists
          </h2>
          <PlaylistsPanel />
        </section>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recently Played
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorites
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-4">
            {recentTracks.length > 0 ? (
              <TrackList tracks={recentTracks} context="recently-played" />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recently played tracks yet</p>
                <p className="text-sm mt-1">Start listening to see your history here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            {favoriteTracks.length > 0 ? (
              <TrackList tracks={favoriteTracks} context="favorites" />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No favorite tracks yet</p>
                <p className="text-sm mt-1">Like tracks to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
