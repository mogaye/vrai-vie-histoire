import React, { useState } from 'react';
import { BookItem } from '../data/booksData.ts';
import { BookOpen, Star, Info, Heart, Check } from 'lucide-react';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface DossierCardProps {
  book: BookItem;
  onOpenReader: (item: BookItem) => void;
  onOpenDetails?: (item: BookItem) => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (item: BookItem) => void;
  actionLabel?: string;
  className?: string;
}

// Color palettes for organic card gradient backgrounds inspired by the luxury travel card reference
function getCardBackground(genre: string = ''): { gradient: string; tintBorder: string } {
  const g = genre.toLowerCase();
  if (g.includes('afrique')) {
    // Warm terracotta / earth amber luxury glow
    return {
      gradient: 'from-[#281a13] via-[#1d140e] to-[#130d09]',
      tintBorder: 'border-amber-900/40 hover:border-amber-500/40',
    };
  }
  if (g.includes('europe')) {
    // Royal sapphire / deep midnight navy
    return {
      gradient: 'from-[#142332] via-[#0f1a26] to-[#091119]',
      tintBorder: 'border-sky-900/40 hover:border-sky-500/40',
    };
  }
  if (g.includes('asie')) {
    // Imperial crimson / mystical plum
    return {
      gradient: 'from-[#2a1721] via-[#1e1017] to-[#130a0f]',
      tintBorder: 'border-rose-900/40 hover:border-rose-500/40',
    };
  }
  if (g.includes('amérique')) {
    // Deep forest emerald / alpine moss
    return {
      gradient: 'from-[#17271e] via-[#101c15] to-[#0a120e]',
      tintBorder: 'border-emerald-900/40 hover:border-emerald-500/40',
    };
  }
  // Monde contemporain: Celestial obsidian / twilight slate
  return {
    gradient: 'from-[#1f1b29] via-[#16131d] to-[#0d0b12]',
    tintBorder: 'border-violet-900/40 hover:border-violet-500/40',
  };
}

export const DossierCard: React.FC<DossierCardProps> = ({
  book,
  onOpenReader,
  onOpenDetails,
  isInWishlist = false,
  onToggleWishlist,
  actionLabel = 'Consulter',
  className = '',
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const theme = getCardBackground(book.genre);

  // Extract region tag (e.g. "Afrique", "Europe", "Asie")
  const regionTag = book.genre.replace('Histoire · ', '').trim();
  // Extract part tag (e.g. "Partie 1", "Partie 2")
  const partMatch = book.pages?.match(/Partie \d/);
  const partTag = partMatch ? partMatch[0] : (book.author ? book.author.split('·')[0].trim() : 'Historique');

  const handleCardClick = () => {
    playNetflixTaDum();
    onOpenReader(book);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative rounded-[28px] overflow-hidden bg-gradient-to-b ${theme.gradient} border ${theme.tintBorder} shadow-[0_16px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between select-none ${className}`}
    >
      {/* Top Image Section with Smooth Bottom Blend */}
      <div className="relative w-full h-[190px] sm:h-[210px] overflow-hidden bg-black shrink-0">
        <img
          src={book.coverImage}
          alt={book.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        {/* Cinematic Vignette blending image directly into card gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* Carousel pagination dots at bottom of image (matching reference style) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setActiveSlide(idx);
              }}
              className={`transition-all rounded-full ${
                activeSlide === idx
                  ? 'w-4 h-1.5 bg-white shadow-sm'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Quick action buttons on top (Wishlist & Info) */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-20">
          {onOpenDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                onOpenDetails(book);
              }}
              className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition border border-white/10"
              title="Fiche détaillée"
              aria-label="Fiche détaillée"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                onToggleWishlist(book);
              }}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition border ${
                isInWishlist
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-black/60 hover:bg-black/90 border-white/10 text-white/80 hover:text-white'
              }`}
              title={isInWishlist ? 'Dans ma liste' : 'Ajouter à ma liste'}
              aria-label="Ajouter à ma liste"
            >
              <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3.5">
        {/* Title + Pill Metric Badge Row */}
        <div>
          <div className="flex items-start justify-between gap-2.5">
            <h3 className="text-white font-bold text-sm sm:text-[15px] leading-snug line-clamp-2 min-h-[42px] group-hover:text-zinc-100 transition-colors">
              {book.title}
            </h3>
            {/* Pill badge showing Year or Rating */}
            <div className="shrink-0 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-zinc-200 text-[11px] font-bold tracking-tight backdrop-blur-xs flex items-center gap-1 mt-0.5 shadow-sm">
              <span>{book.year ? (book.year.startsWith('-') ? `${book.year.replace('-', '')} av. J.-C.` : book.year) : book.rating}</span>
            </div>
          </div>

          {/* Description line */}
          <p className="text-zinc-300/85 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2 mt-1.5 font-normal">
            {book.description}
          </p>
        </div>

        {/* Tags Row: pill capsules matching reference */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-zinc-200 text-[11px] font-medium backdrop-blur-xs">
            {regionTag}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-zinc-300 text-[11px] font-medium backdrop-blur-xs">
            {partTag}
          </span>
          {book.progressPercent !== undefined && (
            <span className="px-2.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-[11px] font-semibold">
              {book.progressPercent}% lu
            </span>
          )}
        </div>

        {/* Primary Crisp Full-Width Action Button (matching "Reserve" in mockup) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playNetflixTaDum();
              onOpenReader(book);
            }}
            className="w-full py-2.5 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold tracking-tight shadow-lg shadow-black/30 transition-all duration-150 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            <span>{actionLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
