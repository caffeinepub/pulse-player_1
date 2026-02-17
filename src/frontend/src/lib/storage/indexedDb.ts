export interface MediaTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  type: 'audio' | 'video';
  size: number;
  duration?: number;
  addedDate: number;
  fileHandle?: FileSystemFileHandle;
  objectUrl?: string;
}

export interface PlaylistLocal {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'pulse-player-db';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('tracks')) {
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('by-type', 'type', { unique: false });
        trackStore.createIndex('by-added', 'addedDate', { unique: false });
      }
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    };
  });
}

export const db = {
  async addTrack(track: MediaTrack): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tracks'], 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.put(track);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getTrack(id: string): Promise<MediaTrack | undefined> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tracks'], 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllTracks(): Promise<MediaTrack[]> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tracks'], 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async getTracksByType(type: 'audio' | 'video'): Promise<MediaTrack[]> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tracks'], 'readonly');
      const store = transaction.objectStore('tracks');
      const index = store.index('by-type');
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async deleteTrack(id: string): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['tracks'], 'readwrite');
      const store = transaction.objectStore('tracks');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async addPlaylist(playlist: PlaylistLocal): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      const request = store.put(playlist);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getPlaylist(id: string): Promise<PlaylistLocal | undefined> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['playlists'], 'readonly');
      const store = transaction.objectStore('playlists');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllPlaylists(): Promise<PlaylistLocal[]> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['playlists'], 'readonly');
      const store = transaction.objectStore('playlists');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async deletePlaylist(id: string): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async addFavorite(id: string): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.put({ id, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async removeFavorite(id: string): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getAllFavorites(): Promise<Array<{ id: string; timestamp: number }>> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async addHistory(id: string): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['history'], 'readwrite');
      const store = transaction.objectStore('history');
      const request = store.put({ id, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getAllHistory(): Promise<Array<{ id: string; timestamp: number }>> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['history'], 'readonly');
      const store = transaction.objectStore('history');
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result || [];
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async clearHistory(): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['history'], 'readwrite');
      const store = transaction.objectStore('history');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getSetting<T>(key: string): Promise<T | undefined> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async setSetting<T>(key: string, value: T): Promise<void> {
    const database = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
