import React from 'react';
import { MoreVertical, BookOpen, Star } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface BestsellersRowProps {
  items: BookItem[];
  onOpenReader: (item: BookItem) => void;
  onOpenDetails: (item: BookItem) => void;
}

export const BestsellersRow: React.FC<BestsellersRowProps> = ({
  items,
  onOpenReader,
  onOpenDetails,
}) => {
  return (
    <section className="mb-5 select-none" aria-label="Section Coups de Cœur">
      {/* Section Header */}
      <h2 className="text-white text-xs lg:text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
        <span>Coups de Cœur & Bestsellers</span>
      </h2>

      {/* Grid of 4 Book Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((book) => {
          return (
            <div
              key={book.id}
              onClick={() => {
                playNetflixTaDum();
                onOpenReader(book);
              }}
              className="group relative rounded-xl overflow-hidden bg-[#131417] border border-white/8 hover:border-white/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/70 cursor-pointer flex flex-col justify-between"
            >
              {/* Cover Image Container */}
              <div className="relative w-full h-[95px] lg:h-[105px] overflow-hidden bg-black">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-106"
                  loading="lazy"
                />

                {/* Rating Badge Top Right */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-amber-400 font-bold flex items-center gap-1 border border-white/10">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{book.rating}</span>
                </div>

                {/* Subtle Hover Reading Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50">
                    <BookOpen className="w-4 h-4 fill-white" />
                  </div>
                </div>
              </div>

              {/* Bottom Metadata Bar */}
              <div className="p-2.5 flex items-start justify-between gap-1.5 bg-[#0e0f11]">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white text-xs font-bold truncate group-hover:text-red-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-zinc-400 text-[10px] mt-0.5 tracking-tight font-medium truncate">
                    {book.author}
                  </p>
                </div>

                {/* More Details (Three dots) Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onOpenDetails(book);
                  }}
                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0"
                  title={`Détails sur ${book.title}`}
                  aria-label={`Détails pour ${book.title}`}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
