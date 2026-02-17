import { Music, Video, Library, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'music' | 'video' | 'library' | 'settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'music' as const, label: 'Music', icon: Music },
    { id: 'video' as const, label: 'Video', icon: Video },
    { id: 'library' as const, label: 'Library', icon: Library },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-40 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary bg-accent shadow-sm scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
