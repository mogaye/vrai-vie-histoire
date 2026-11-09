import React from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import { playNetflixTaDum } from '../utils/audio.ts';

interface ContinueReadingRowProps {
  items: BookItem[];
  onOpenReader: (item: BookItem) => void;
  onOpenDetails: (item: BookItem) => void;
}

export const ContinueReadingRow: React.FC<ContinueReadingRowProps> = ({
  items,
  onOpenReader,
  onOpenDetails,
}) => {
  return (
    <section className="select-none" aria-label="Section Reprendre la lecture">
      {/* Section Header */}
      <h2 className="text-white text-xs lg:text-sm font-semibold tracking-wide mb-3 flex items-center justify-between">
        <span>Reprendre la lecture</span>
        <span className="text-zinc-500 text-xs font-normal">
          {items.length} livres en cours
        </span>
      </h2>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((book) => {
          const progress = book.progressPercent || 50;

          return (
            <div
              key={book.id}
              onClick={() => {
                playNetflixTaDum();
                onOpenReader(book);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                onOpenDetails(book);
              }}
              className="group relative rounded-xl overflow-hidden bg-[#101114] border border-white/8 hover:border-white/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/80 cursor-pointer flex flex-col justify-end h-[96px] lg:h-[105px]"
              title={`Reprendre ${book.title}`}
            >
              {/* Cover Background with vignette */}
              <img
                src={book.coverImage}
                alt={book.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                }}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark Overlays for high readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

              {/* Time Remaining Pill in Top Right */}
              {book.readTimeRemaining && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] text-zinc-300 font-medium flex items-center gap-1 border border-white/10">
                  <Clock className="w-2.5 h-2.5 text-red-500" />
                  <span>{book.readTimeRemaining}</span>
                </div>
              )}

              {/* Center Read Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50">
                  <BookOpen className="w-4 h-4 fill-white" />
                </div>
              </div>

              {/* Bottom Label Information */}
              <div className="relative z-10 px-3 pb-2">
                <span className="text-white text-xs font-bold tracking-tight drop-shadow truncate block group-hover:text-red-400 transition-colors">
                  {book.title}
                </span>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                  <span>Page {book.currentPage}/{book.totalPages}</span>
                  <span className="font-semibold text-zinc-300">{progress}%</span>
                </div>
              </div>

              {/* Bottom Edge Red Progress Bar */}
              <div className="relative w-full h-1 bg-zinc-700/60 overflow-hidden">
                <div
                  className="h-full bg-[#E50914] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
