import { AddLocalMediaButton } from './AddLocalMediaButton';
import { LocalMediaNotice } from './LocalMediaNotice';

export function EmptyLibraryState() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Library</h1>
      
      <LocalMediaNotice />

      <div className="flex flex-col items-center justify-center py-12">
        <img 
          src="/assets/generated/empty-library.dim_1200x800.png" 
          alt="Empty library" 
          className="w-64 h-auto mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">Your Library is Empty</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Add your favorite music and videos to get started. Files are stored locally on your device.
        </p>
        <AddLocalMediaButton />
      </div>
    </div>
  );
}
