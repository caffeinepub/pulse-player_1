import { useLibrary } from '@/features/library/useLibrary';
import { AddLocalMediaButton } from '@/features/library/AddLocalMediaButton';
import { LocalMediaNotice } from '@/features/library/LocalMediaNotice';
import { LibrarySearchSortBar } from '@/features/library/LibrarySearchSortBar';
import { EmptyLibraryState } from '@/features/library/EmptyLibraryState';
import { TrackList } from '@/features/tracks/TrackList';
import { IndexingSkeleton } from '@/components/loading/IndexingSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Video } from 'lucide-react';
import { useState } from 'react';
import { searchAndSortTracks, searchAndSortVideos } from '@/features/library/searchSort';
import type { SortOption } from '@/features/library/searchSort';

export function LibraryPage() {
  const { audioTracks, videoTracks, isIndexing } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const filteredAudio = searchAndSortTracks(audioTracks, searchQuery, sortBy);
  const filteredVideo = searchAndSortVideos(videoTracks, searchQuery, sortBy);

  const hasMedia = audioTracks.length > 0 || videoTracks.length > 0;

  if (isIndexing) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Library</h1>
        <IndexingSkeleton />
      </div>
    );
  }

  if (!hasMedia) {
    return <EmptyLibraryState />;
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Library</h1>
        <AddLocalMediaButton />
      </div>

      <LocalMediaNotice />

      <LibrarySearchSortBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Tabs defaultValue="audio" className="mt-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Audio ({filteredAudio.length})
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video ({filteredVideo.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="mt-4">
          {filteredAudio.length > 0 ? (
            <TrackList tracks={filteredAudio} context="library" />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No audio files found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="video" className="mt-4">
          {filteredVideo.length > 0 ? (
            <div className="space-y-2">
              {filteredVideo.map((video) => (
                <div
                  key={video.id}
                  className="p-4 bg-card rounded-xl border border-border"
                >
                  <h3 className="font-medium">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(video.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No video files found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
