import { db } from '@/lib/storage/indexedDb';

const OFFLINE_ONLY_KEY = 'offlineOnlyMode';

export async function getOfflineOnlyMode(): Promise<boolean> {
  try {
    const value = await db.getSetting<boolean>(OFFLINE_ONLY_KEY);
    return value ?? false;
  } catch (error) {
    console.error('Failed to get offline-only mode:', error);
    return false;
  }
}

export async function setOfflineOnlyMode(enabled: boolean): Promise<void> {
  try {
    await db.setSetting(OFFLINE_ONLY_KEY, enabled);
  } catch (error) {
    console.error('Failed to set offline-only mode:', error);
    throw error;
  }
}
