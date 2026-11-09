import React from 'react';
import { BookItem } from '../data/booksData.ts';
import { DossierCard } from './DossierCard.tsx';
import { Clock } from 'lucide-react';

interface ContinueReadingRowProps {
  items: BookItem[];
  onOpenReader: (item: BookItem) => void;
  onOpenDetails: (item: BookItem) => void;
  wishlist?: string[];
  onToggleWishlist?: (item: BookItem) => void;
}

export const ContinueReadingRow: React.FC<ContinueReadingRowProps> = ({
  items,
  onOpenReader,
  onOpenDetails,
  wishlist = [],
  onToggleWishlist,
}) => {
  return (
    <section className="mb-8 select-none" aria-label="Section Reprendre la lecture">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-base lg:text-lg font-bold tracking-tight flex items-center gap-2">
            <span>Reprendre la lecture</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-semibold">
              {items.length} en cours
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Poursuivez vos études historiques là où vous vous étiez arrêté
          </p>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.map((book) => (
          <div key={book.id} className="relative flex flex-col">
            <DossierCard
              book={book}
              onOpenReader={onOpenReader}
              onOpenDetails={onOpenDetails}
              isInWishlist={wishlist.includes(book.id)}
              onToggleWishlist={onToggleWishlist}
              actionLabel="Reprendre"
            />
            {/* Subtle progress bar at bottom of card */}
            <div className="mt-2 px-2 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-300">
                <Clock className="w-3 h-3 text-red-400" />
                <span>{book.readTimeRemaining || 'En cours'}</span>
              </span>
              <span className="font-semibold text-zinc-200">
                {book.progressPercent || 50}% complété
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
