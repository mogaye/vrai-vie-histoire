import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mic, Bell, Maximize2, Minimize2, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNotificationClick: () => void;
  unreadCount?: number;
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  searchQuery,
  onSearchChange,
  onNotificationClick,
  unreadCount = 2,
  isSidebarExpanded = true,
  onToggleSidebar,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 py-2 px-4 sm:px-6 border-b border-white/8 bg-[#121316]/95 backdrop-blur-md select-none shrink-0 z-20">
      {/* Left Navigation: Sidebar Toggle + History Arrows */}
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={() => {
              playClickSound();
              onToggleSidebar();
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              !isSidebarExpanded
                ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title={isSidebarExpanded ? 'Replier le menu (Ctrl+B)' : 'Déplier le menu (Ctrl+B)'}
            aria-label={isSidebarExpanded ? 'Replier la barre latérale' : 'Déplier la barre latérale'}
          >
            {isSidebarExpanded ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-red-400 animate-pulse" />
            )}
          </button>
        )}
        <button
          onClick={playClickSound}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
          title="Précédent"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={playClickSound}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
          title="Suivant"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Center Search Bar Pill */}
      <div className="flex-1 max-w-lg mx-auto">
        <div
          onClick={() => searchInputRef.current?.focus()}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1b1c20]/90 hover:bg-[#23242a] border border-white/10 transition-all focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 cursor-text shadow-inner"
        >
          <Mic className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher parmi les 200 dossiers historiques..."
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none border-none focus:outline-none"
            aria-label="Rechercher des dossiers"
          />
          {searchQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSearchChange('');
              }}
              className="text-[11px] text-zinc-400 hover:text-white px-1 cursor-pointer"
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Side: Fullscreen, Notification & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            isFullscreen
              ? 'bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
          }`}
          title={isFullscreen ? 'Quitter le plein écran' : 'Activer le mode plein écran'}
          aria-label="Plein écran"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{isFullscreen ? 'Quitter plein écran' : 'Plein écran'}</span>
        </button>

        {/* Notification Bell Button */}
        <button
          onClick={() => {
            playClickSound();
            onNotificationClick();
          }}
          className="relative w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer border border-white/5"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E50914] rounded-full ring-2 ring-zinc-900" />
          )}
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#E50914] to-red-400 shrink-0 shadow">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Samantha G."
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
              Samantha G.
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">
              @Samantha
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
