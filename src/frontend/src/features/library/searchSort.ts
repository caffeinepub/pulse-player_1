import type { MediaTrack } from '@/lib/storage/indexedDb';

export type SortOption = 'name' | 'size' | 'date';

export function searchAndSortTracks(
  tracks: MediaTrack[],
  query: string,
  sortBy: SortOption
): MediaTrack[] {
  let filtered = tracks;

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery) ||
        track.album.toLowerCase().includes(lowerQuery)
    );
  }

  return sortTracks(filtered, sortBy);
}

export function searchAndSortVideos(
  videos: MediaTrack[],
  query: string,
  sortBy: SortOption
): MediaTrack[] {
  let filtered = videos;

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(lowerQuery)
    );
  }

  return sortTracks(filtered, sortBy);
}

function sortTracks(tracks: MediaTrack[], sortBy: SortOption): MediaTrack[] {
  const sorted = [...tracks];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'size':
      sorted.sort((a, b) => b.size - a.size);
      break;
    case 'date':
      sorted.sort((a, b) => b.addedDate - a.addedDate);
      break;
  }

  return sorted;
}
