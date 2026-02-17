import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { SortOption } from './searchSort';

interface LibrarySearchSortBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function LibrarySearchSortBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: LibrarySearchSortBarProps) {
  return (
    <div className="flex gap-2 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title, artist, album..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="size">Size</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
