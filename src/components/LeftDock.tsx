import React from 'react';
import { BookOpen, Library, Bookmark, Headphones, Home, Search, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface LeftDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  isSidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  isSidebarExpanded = true,
  onToggleSidebar,
}) => {
  const handleTab = (name: string) => {
    playClickSound();
    onSelectTab(name);
  };

  return (
    <aside
      className="hidden md:flex flex-col items-center justify-between py-4 px-2.5 border-r border-white/8 bg-[#101114] z-30 select-none shrink-0 h-full"
      aria-label="Navigation rapide bibliothèque"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Toggle Sidebar Expand / Collapse Button */}
        {onToggleSidebar && (
          <button
            onClick={() => {
              playClickSound();
              onToggleSidebar();
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              !isSidebarExpanded
                ? 'bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30 shadow-md shadow-red-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title={isSidebarExpanded ? 'Replier la barre latérale (Ctrl+B)' : 'Déplier la barre latérale (Ctrl+B)'}
            aria-label={isSidebarExpanded ? 'Replier la barre latérale' : 'Déplier la barre latérale'}
          >
            {isSidebarExpanded ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-red-400 animate-pulse" />
            )}
          </button>
        )}

        {/* Red Active Reading Badge */}
        <button
          onClick={() => handleTab('browse')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-[#E50914] text-white shadow-lg shadow-red-600/50 ring-2 ring-red-400/30'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
          title="Lecture active"
          aria-label="Lecture active"
        >
          <BookOpen className="w-4 h-4 fill-white text-white" />
        </button>

        {/* Library / Rayonnages Icon */}
        <button
          onClick={() => handleTab('library')}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            activeTab === 'library' ? 'text-white bg-white/15' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Rayonnages & Collections (Grille)"
          aria-label="Collections"
        >
          <Library className="w-4 h-4" />
        </button>

        {/* Bookmark / Ma Liste Icon */}
        <button
          onClick={() => handleTab('wishlist')}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            activeTab === 'wishlist' ? 'text-white bg-white/15' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Marque-pages & Favoris"
          aria-label="Marque-pages"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Audiobooks Icon */}
        <button
          onClick={() => handleTab('audio')}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            activeTab === 'audio' ? 'text-white bg-white/15' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Livres Audio & Synthèse Vocale"
          aria-label="Livres Audio"
        >
          <Headphones className="w-4 h-4" />
        </button>

        {/* Home Icon */}
        <button
          onClick={() => handleTab('browse')}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            activeTab === 'browse' ? 'text-white bg-white/15' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          title="Accueil Bibliothèque"
          aria-label="Accueil"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Search Icon */}
      <div>
        <button
          onClick={() => {
            playClickSound();
            onOpenSearch();
          }}
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Rechercher un dossier"
          aria-label="Rechercher"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
