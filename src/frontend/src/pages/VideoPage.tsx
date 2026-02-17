import { useState } from 'react';
import { useLibrary } from '@/features/library/useLibrary';
import { VideoPlayerView } from '@/features/video/VideoPlayerView';
import { EmptyVideoState } from '@/features/video/EmptyVideoState';
import { Play, Clock } from 'lucide-react';
import { formatFileSize, formatDuration } from '@/lib/media-utils';

export function VideoPage() {
  const { videoTracks } = useLibrary();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (selectedVideo) {
    const video = videoTracks.find(v => v.id === selectedVideo);
    if (video) {
      return (
        <VideoPlayerView
          video={video}
          onClose={() => setSelectedVideo(null)}
        />
      );
    }
  }

  if (videoTracks.length === 0) {
    return <EmptyVideoState />;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Videos</h1>
      
      <div className="grid grid-cols-1 gap-3">
        {videoTracks.map((video) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video.id)}
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:bg-accent transition-colors text-left"
          >
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{video.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                {video.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(video.duration)}
                  </span>
                )}
                <span>{formatFileSize(video.size)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
