import React, { useState } from 'react';
import { Play, Plus, Check, Clock, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import {
  HERO_HISTORICAL_BOOK,
  ALL_HISTORICAL_BOOKS,
} from '../data/historicalDossiers.ts';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface HeroBannerProps {
  book?: BookItem;
  onRead: (item: BookItem) => void;
  isInWishlist: boolean;
  onToggleWishlist: (item: BookItem) => void;
  onSelectHero?: (item: BookItem) => void;
}

// Flagship featured dossiers for the cinematic hero carousel
const FEATURED_HERO_BOOKS: BookItem[] = [
  HERO_HISTORICAL_BOOK, // Kirina (1235)
  ALL_HISTORICAL_BOOKS[23] || HERO_HISTORICAL_BOOK, // Constantinople (1453)
  ALL_HISTORICAL_BOOKS[101] || HERO_HISTORICAL_BOOK, // Mansa Musa (1324)
  ALL_HISTORICAL_BOOKS[45] || HERO_HISTORICAL_BOOK, // Gandhi (1930)
  ALL_HISTORICAL_BOOKS[21] || HERO_HISTORICAL_BOOK, // César (-49)
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  book = HERO_HISTORICAL_BOOK,
  onRead,
  isInWishlist,
  onToggleWishlist,
  onSelectHero,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use the active featured book
  const activeBook = FEATURED_HERO_BOOKS[currentIndex] || book;

  // Previous and next indices for the bottom preview cards
  const prevIndex = (currentIndex - 1 + FEATURED_HERO_BOOKS.length) % FEATURED_HERO_BOOKS.length;
  const nextIndex = (currentIndex + 1) % FEATURED_HERO_BOOKS.length;

  const prevBook = FEATURED_HERO_BOOKS[prevIndex];
  const nextBook = FEATURED_HERO_BOOKS[nextIndex];

  const handlePrev = () => {
    playClickSound();
    const newIdx = prevIndex;
    setCurrentIndex(newIdx);
    onSelectHero?.(FEATURED_HERO_BOOKS[newIdx]);
  };

  const handleNext = () => {
    playClickSound();
    const newIdx = nextIndex;
    setCurrentIndex(newIdx);
    onSelectHero?.(FEATURED_HERO_BOOKS[newIdx]);
  };

  const handleReadClick = () => {
    playNetflixTaDum();
    onRead(activeBook);
  };

  // Format year display (e.g. "1235", "1453", "49 AV. J.-C.")
  const formattedYear = activeBook.year
    ? (activeBook.year.startsWith('-')
      ? `${activeBook.year.replace('-', '')} AV. J.-C.`
      : `${activeBook.year} APR. J.-C.`)
    : 'HISTOIRE';

  // Split title for high-impact 2-line display like "Game / of Thrones" in reference
  const titleWords = activeBook.title.split(' ');
  const titleLine1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const titleLine2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <section
      className="relative w-full min-h-[500px] lg:h-[530px] rounded-3xl overflow-hidden border-0 shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-10 select-none bg-[#0a0b0e]"
      aria-label="Section Événement à la Une"
    >
      {/* 1. Background Cinematic Hero Image with clean presentation without side gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={activeBook.id}
          src={activeBook.coverImage}
          alt={activeBook.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85';
          }}
          className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform scale-100 filter brightness-95 contrast-105"
        />

        {/* Deep Bottom Multi-Stop Gradient Blend ("le bas en dégradé pour se matcher avec le fond") */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0f1013] via-[#0f1013]/95 via-35% via-[#0f1013]/60 via-70% to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Left Edge Vertical Timeline Bar (inspired by SUNDAY AT 9 AM in reference) */}
      <div className="absolute left-4 lg:left-6 top-16 bottom-32 z-20 hidden sm:flex flex-col items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-white font-bold uppercase [writing-mode:vertical-rl] rotate-180 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
          <Clock className="w-3.5 h-3.5 text-cyan-400 rotate-90 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
          <span>ÉPOQUE · {formattedYear}</span>
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent mt-4" />
      </div>

      {/* 3. Main Hero Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 pl-8 sm:pl-16 lg:pl-20">
        {/* Top Section: Title, Kicker & Logline */}
        <div className="pt-4 sm:pt-6 max-w-2xl">
          {/* Subtle Region & Era Kicker */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-black/60 border border-cyan-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md">
              {activeBook.genre || 'Dossier Majeur'}
            </span>
            <span className="text-xs text-white font-medium bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md">
              {activeBook.author}
            </span>
          </div>

          {/* Large Bold Title (like Game of Thrones in the reference) */}
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)]">
            <span className="block drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">{titleLine1}</span>
            <span className="block text-zinc-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">{titleLine2}</span>
          </h1>

          {/* Concise Logline */}
          <p className="text-zinc-100 text-xs sm:text-sm lg:text-[14px] leading-relaxed mt-4 max-w-lg font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {activeBook.description}
          </p>

          {/* Action Links: "watch trailer" inspired CTA + Ma Liste */}
          <div className="flex items-center gap-5 mt-6">
            {/* Primary Watch/Read Action with Cyan Circular Outline Button */}
            <button
              type="button"
              onClick={handleReadClick}
              className="group/btn flex items-center gap-3 cursor-pointer transition-transform active:scale-95"
            >
              <span className="text-cyan-400 group-hover/btn:text-cyan-300 text-xs sm:text-sm font-bold tracking-wide underline underline-offset-4 decoration-cyan-500/50 group-hover/btn:decoration-cyan-400 transition-colors">
                Lire le dossier
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-cyan-400 group-hover/btn:border-cyan-300 group-hover/btn:bg-cyan-400/10 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Play className="w-4 h-4 text-cyan-400 group-hover/btn:text-cyan-300 fill-cyan-400 ml-0.5 transition-colors" />
              </div>
            </button>

            {/* Secondary Wishlist Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onToggleWishlist(activeBook);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
                isInWishlist
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {isInWishlist ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dans ma liste</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Ma Liste</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4. Bottom Multi-Item Interactive Navigation (Faithful to HBO mockup) */}
        <div className="relative z-30 pt-8 pb-3 w-full flex items-center justify-between gap-2 sm:gap-6">
          {/* Bottom Left: Previous Featured Preview Card with avatar + overlapping orange arrow badge */}
          <div
            onClick={handlePrev}
            className="group/prev flex items-center gap-3.5 cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all max-w-[280px]"
            title={`Précédent : ${prevBook.title}`}
          >
            {/* Circular Avatar with pinned Orange Arrow Badge on the right rim */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 group-hover/prev:border-white/60 transition-colors shadow-xl">
                <img
                  src={prevBook.coverImage}
                  alt={prevBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Pinned orange arrow badge (like Barry card in HBO design) */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md border border-zinc-950">
                <ArrowRight className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Title & Timing label */}
            <div className="hidden md:block text-left min-w-0">
              <h4 className="text-white text-xs sm:text-sm font-bold truncate group-hover/prev:text-amber-400 transition-colors leading-tight">
                {prevBook.title.split('(')[0].trim()}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {prevBook.year ? `Époque ${prevBook.year}` : 'Dossier historique'}
              </p>
            </div>
          </div>

          {/* Vertical Faint Divider Line */}
          <div className="hidden lg:block w-px h-10 bg-white/15 shrink-0" />

          {/* Center: Iconic Dual-Tier Slider Navigation Tracks from HBO Reference */}
          <div className="flex flex-col items-center gap-3 px-2 sm:px-6 shrink-0">
            {/* Top row: [ < ] ──────── PREV */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:scale-105 cursor-pointer"
                aria-label="Dossier précédent"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>
              <div className="relative flex flex-col items-end">
                <span className="text-[9px] font-bold text-zinc-300 tracking-[0.2em] uppercase mb-0.5">
                  PREV
                </span>
                <div className="w-20 sm:w-28 h-px bg-white/40" />
              </div>
            </div>

            {/* Bottom row: NEXT ──────── [ > ] */}
            <div className="flex items-center gap-3">
              <div className="relative flex flex-col items-start">
                <span className="text-[9px] font-bold text-zinc-300 tracking-[0.2em] uppercase mb-0.5">
                  NEXT
                </span>
                <div className="w-20 sm:w-28 h-px bg-white/40" />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:scale-105 cursor-pointer"
                aria-label="Dossier suivant"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Vertical Faint Divider Line */}
          <div className="hidden lg:block w-px h-10 bg-white/15 shrink-0" />

          {/* Bottom Right: Next Featured Preview Card with avatar + overlapping orange arrow badge */}
          <div
            onClick={handleNext}
            className="group/next flex items-center gap-3.5 cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all max-w-[280px] text-right"
            title={`Suivant : ${nextBook.title}`}
          >
            {/* Title & Timing label */}
            <div className="hidden md:block min-w-0">
              <h4 className="text-white text-xs sm:text-sm font-bold truncate group-hover/next:text-amber-400 transition-colors leading-tight">
                {nextBook.title.split('(')[0].trim()}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {nextBook.year ? `Époque ${nextBook.year}` : 'Dossier historique'}
              </p>
            </div>

            {/* Circular Avatar with pinned Orange Arrow Badge on the left rim */}
            <div className="relative shrink-0">
              {/* Pinned orange arrow badge on left rim (pointing left like Last Week in HBO) */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md border border-zinc-950 z-10">
                <ArrowLeft className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 group-hover/next:border-white/60 transition-colors shadow-xl">
                <img
                  src={nextBook.coverImage}
                  alt={nextBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
