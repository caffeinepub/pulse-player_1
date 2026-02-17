import { useState, useEffect } from 'react';
import { db, type MediaTrack } from '@/lib/storage/indexedDb';
import { extractMetadata } from '@/lib/media/metadata';
import { toast } from 'sonner';

export function useLibrary() {
  const [audioTracks, setAudioTracks] = useState<MediaTrack[]>([]);
  const [videoTracks, setVideoTracks] = useState<MediaTrack[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    try {
      const audio = await db.getTracksByType('audio');
      const video = await db.getTracksByType('video');
      setAudioTracks(audio);
      setVideoTracks(video);
    } catch (error) {
      console.error('Failed to load library:', error);
      toast.error('Failed to load library');
    } finally {
      setIsLoading(false);
    }
  }

  async function addFiles(files: File[]) {
    setIsIndexing(true);
    let successCount = 0;

    try {
      for (const file of files) {
        try {
          const metadata = await extractMetadata(file);
          const type = file.type.startsWith('audio/') ? 'audio' : 'video';
          
          const track: MediaTrack = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            type,
            size: file.size,
            duration: metadata.duration,
            addedDate: Date.now(),
            objectUrl: URL.createObjectURL(file),
          };

          await db.addTrack(track);
          
          if (type === 'audio') {
            setAudioTracks(prev => [...prev, track]);
          } else {
            setVideoTracks(prev => [...prev, track]);
          }
          
          successCount++;
        } catch (error) {
          console.error(`Failed to index ${file.name}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Added ${successCount} file${successCount > 1 ? 's' : ''} to library`);
      }
    } finally {
      setIsIndexing(false);
    }
  }

  return {
    audioTracks,
    videoTracks,
    isIndexing,
    isLoading,
    addFiles,
    reloadLibrary: loadLibrary,
  };
}
