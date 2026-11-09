import React from 'react';
import { BookItem } from '../data/booksData.ts';
import { DossierCard } from './DossierCard.tsx';

interface BestsellersRowProps {
  items: BookItem[];
  onOpenReader: (item: BookItem) => void;
  onOpenDetails: (item: BookItem) => void;
  wishlist?: string[];
  onToggleWishlist?: (item: BookItem) => void;
}

export const BestsellersRow: React.FC<BestsellersRowProps> = ({
  items,
  onOpenReader,
  onOpenDetails,
  wishlist = [],
  onToggleWishlist,
}) => {
  return (
    <section className="mb-8 select-none" aria-label="Section Coups de Cœur">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-base lg:text-lg font-bold tracking-tight flex items-center gap-2">
            <span>Coups de Cœur & Dossiers Majeurs</span>
            <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 font-semibold">
              Sélection
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Les moments charnières ayant bouleversé l'histoire des civilisations
          </p>
        </div>
      </div>

      {/* Grid of luxury cards matching user reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.map((book) => (
          <DossierCard
            key={book.id}
            book={book}
            onOpenReader={onOpenReader}
            onOpenDetails={onOpenDetails}
            isInWishlist={wishlist.includes(book.id)}
            onToggleWishlist={onToggleWishlist}
            actionLabel="Lire le dossier"
          />
        ))}
      </div>
    </section>
  );
};
