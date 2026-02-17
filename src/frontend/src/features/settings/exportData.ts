import { db } from '@/lib/storage/indexedDb';
import type { CloudData } from '@/backend';

export interface ExportData {
  version: string;
  exportDate: string;
  local: {
    tracks: any[];
    playlists: any[];
    favorites: any[];
    history: any[];
    settings: Record<string, any>;
  };
  cloud?: CloudData;
}

export async function exportAllData(cloudData?: CloudData | null): Promise<void> {
  try {
    // Gather local data
    const localData = await db.exportAllData();

    // Assemble export object
    const exportData: ExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      local: localData,
    };

    // Add cloud data if available
    if (cloudData) {
      exportData.cloud = cloudData;
    }

    // Convert to JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulse-player-export-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data');
  }
}
