export interface ExtractedMetadata {
  title: string;
  artist: string;
  album: string;
  duration?: number;
}

export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  const fileName = file.name;
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  let title = nameWithoutExt;
  let artist = 'Unknown Artist';
  let album = 'Unknown Album';
  let duration: number | undefined;

  const parts = nameWithoutExt.split(' - ');
  if (parts.length >= 2) {
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  }

  if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
    try {
      duration = await getMediaDuration(file);
    } catch (error) {
      console.warn('Could not extract duration:', error);
    }
  }

  return { title, artist, album, duration };
}

function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const media = file.type.startsWith('audio/') 
      ? new Audio(url)
      : document.createElement('video');
    
    media.preload = 'metadata';
    
    media.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(media.duration);
    };
    
    media.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load metadata'));
    };
    
    if (file.type.startsWith('video/')) {
      (media as HTMLVideoElement).src = url;
    }
  });
}
