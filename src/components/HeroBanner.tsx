import React, { useState } from 'react';
import { BookOpen, Plus, Check, Star, Sparkles } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import { HERO_HISTORICAL_BOOK } from '../data/historicalDossiers.ts';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface HeroBannerProps {
  book?: BookItem;
  onRead: (item: BookItem) => void;
  isInWishlist: boolean;
  onToggleWishlist: (item: BookItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  book = HERO_HISTORICAL_BOOK,
  onRead,
  isInWishlist,
  onToggleWishlist,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const previews = [
    {
      id: 0,
      title: '1. Contexte & Coalition',
      subtitle: 'Les origines de la confrontation',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 1,
      title: '2. La Bataille de Kirina',
      subtitle: 'Le tournant décisif de 1235',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      title: '3. Naissance de l\'Empire',
      subtitle: 'L\'ordre mandingue et la Charte',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handleReadClick = () => {
    playNetflixTaDum();
    onRead(book);
  };

  const handleThumbClick = (index: number) => {
    playClickSound();
    setActiveChapterIndex(index);
  };

  return (
    <div className="relative w-full h-[220px] lg:h-[250px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-5 select-none group bg-zinc-950">
      {/* Background High-Resolution Cinematic Historical Backdrop */}
      <img
        src={book.coverImage || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85'}
        alt={book.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=85';
        }}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.01] transition-transform duration-700 opacity-80"
      />

      {/* Cinematic Vignette & Deep Shadow Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

      {/* Hero Left Content */}
      <div className="absolute left-6 lg:left-8 top-5 bottom-4 z-10 flex flex-col justify-between max-w-xl">
        <div>
          {/* Badge: Dossier Historique Majeur */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-[10px] font-bold text-red-400 mb-2 tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>Dossier Historique à la Une · Sélection Officielle</span>
          </div>

          {/* Stylized Book Title */}
          <h1
            className="text-white text-3xl lg:text-4xl font-black tracking-wide leading-tight drop-shadow-2xl uppercase line-clamp-1"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: '0.04em',
            }}
          >
            {book.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium tracking-wide mt-1.5 drop-shadow">
            <span className="text-white font-semibold">{book.author}</span>
            <span>·</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              {book.rating}
            </span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">{book.matchScore}% Match</span>
          </div>

          {/* Logline / Description */}
          <p className="text-zinc-300/90 text-xs lg:text-[13px] leading-relaxed mt-2.5 line-clamp-2 max-w-lg drop-shadow">
            {book.description}
          </p>
        </div>

        {/* Action Buttons: Lire + Ma Liste */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleReadClick}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold transition-all duration-150 shadow-lg shadow-red-950/60 hover:scale-103 cursor-pointer"
            aria-label={`Lire le dossier ${book.title}`}
          >
            <BookOpen className="w-3.5 h-3.5 fill-white" />
            <span>Lire le dossier</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onToggleWishlist(book);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              isInWishlist
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            aria-label={isInWishlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
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

      {/* Right Side: Chapter Thumbnails Carousel */}
      <div className="hidden md:flex absolute right-6 bottom-4 z-10 items-end gap-2.5">
        {previews.map((preview, idx) => {
          const isActive = activeChapterIndex === idx;
          return (
            <div
              key={preview.id}
              onClick={() => handleThumbClick(idx)}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'ring-2 ring-[#E50914] scale-105 shadow-xl shadow-red-950/50'
                  : 'opacity-70 hover:opacity-100 hover:scale-102 border border-white/10'
              }`}
              style={{ width: '84px', height: '56px' }}
              title={preview.title}
            >
              <img
                src={preview.image}
                alt={preview.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-1">
                <span className="text-[9px] font-bold text-white leading-tight truncate">
                  {preview.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
