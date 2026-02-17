import { useLibrary } from '@/features/library/useLibrary';
import { Video, FileVideo } from 'lucide-react';

export function VideoPage() {
  const { videoTracks } = useLibrary();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" />
          Videos
        </h1>
        <p className="text-muted-foreground mt-1">
          {videoTracks.length} {videoTracks.length === 1 ? 'video' : 'videos'}
        </p>
      </div>

      {videoTracks.length > 0 ? (
        <div className="space-y-3">
          {videoTracks.map((video) => (
            <div
              key={video.id}
              className="p-4 bg-card rounded-xl border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <FileVideo className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(video.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
            <Video className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No videos yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add video files from your Library
          </p>
        </div>
      )}
    </div>
  );
}
