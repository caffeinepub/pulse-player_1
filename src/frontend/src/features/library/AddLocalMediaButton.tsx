import { useLibrary } from './useLibrary';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

export function AddLocalMediaButton() {
  const { addFiles } = useLibrary();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await addFiles(files);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        size="sm"
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Media
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
}
