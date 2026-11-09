import React from 'react';
import { Heart, Sparkles, BookOpen, Layers, PanelLeftClose } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  spotlightBooks: BookItem[];
  onOpenReader: (item: BookItem) => void;
  wishlistCount: number;
  totalBooksCount?: number;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  spotlightBooks,
  onOpenReader,
  wishlistCount,
  totalBooksCount = 200,
  onToggleCollapse,
}) => {
  return (
    <aside className="w-52 lg:w-56 shrink-0 flex flex-col justify-between py-1 pr-3 select-none">
      <div>
        {/* Brand Logo & Collapse Button */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <div
            onClick={() => {
              playNetflixTaDum();
              onSelectNav('browse');
            }}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span
              className="text-[#E50914] text-2xl lg:text-[27px] font-black tracking-widest drop-shadow-md group-hover:scale-102 transition-transform"
              style={{ fontFamily: "'Bebas Neue', 'Inter', sans-serif" }}
            >
              NETFLIX
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
              BOOKS
            </span>
          </div>

          {onToggleCollapse && (
            <button
              onClick={() => {
                playClickSound();
                onToggleCollapse();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Replier la barre latérale (Ctrl+B)"
              aria-label="Replier la barre latérale"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2.5 mb-5" aria-label="Navigation principale">
          <button
            onClick={() => {
              playClickSound();
              onSelectNav('browse');
            }}
            className={`flex items-center text-xs lg:text-[13px] font-semibold transition-all cursor-pointer py-1 ${
              activeNav === 'browse'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all ${
                activeNav === 'browse'
                  ? 'bg-[#E50914] shadow-sm shadow-red-500 ring-2 ring-red-500/20'
                  : 'bg-transparent'
              }`}
            />
            <span>Parcourir</span>
            <span className="ml-auto text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
              {totalBooksCount}
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onSelectNav('wishlist');
            }}
            className={`flex items-center text-xs lg:text-[13px] font-medium transition-all cursor-pointer py-1 ${
              activeNav === 'wishlist'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 mr-2.5 ${
                activeNav === 'wishlist' ? 'text-[#E50914] fill-red-600' : 'text-zinc-400'
              }`}
            />
            <span>Ma Liste</span>
            {wishlistCount > 0 && (
              <span className="ml-auto text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onSelectNav('coming_soon');
            }}
            className={`flex items-center text-xs lg:text-[13px] font-medium transition-all cursor-pointer py-1 ${
              activeNav === 'coming_soon'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 mr-2.5 ${
                activeNav === 'coming_soon' ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'
              }`}
            />
            <span>À paraître</span>
          </button>
        </nav>

        {/* Section: Coups de Projecteur Historiques 🔥 */}
        <div className="pt-3 border-t border-white/8">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-white text-xs font-bold tracking-wide flex items-center gap-1.5">
              <span>Dossiers Clés</span>
              <span className="text-red-500 text-xs">🔥</span>
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Sélection
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {spotlightBooks.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playNetflixTaDum();
                  onOpenReader(item);
                }}
                className="group relative rounded-xl overflow-hidden bg-black/40 border border-white/8 hover:border-white/20 p-1.5 flex gap-2.5 items-center cursor-pointer transition-all hover:bg-white/5"
              >
                {/* Thumbnail */}
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-black">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-zinc-200 text-xs font-bold truncate group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-[10px] truncate mt-0.5">
                    {item.author}
                  </p>
                </div>

                {/* Read icon button */}
                <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-[#E50914] text-zinc-300 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <BookOpen className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="pt-3 border-t border-white/8 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Layers className="w-3.5 h-3.5 text-red-500" />
          <span>200 Fiches Historiques</span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1">
          Partie 1 (100) & Partie 2 (100)
        </p>
      </div>
    </aside>
  );
};
