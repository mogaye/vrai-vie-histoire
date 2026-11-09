import React from 'react';
import { X, BookOpen, Plus, Check, Star, Calendar, FileText } from 'lucide-react';
import { BookItem } from '../data/booksData.ts';
import { playClickSound, playNetflixTaDum } from '../utils/audio.ts';

interface BookDetailsModalProps {
  book: BookItem | null;
  onClose: () => void;
  onRead: (item: BookItem) => void;
  isInWishlist: boolean;
  onToggleWishlist: (item: BookItem) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  onClose,
  onRead,
  isInWishlist,
  onToggleWishlist,
}) => {
  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl bg-[#16171b] border border-white/10 shadow-2xl overflow-hidden text-white"
      >
        {/* Banner with Cover Image */}
        <div className="relative h-60 w-full overflow-hidden bg-black">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16171b] via-[#16171b]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Title & Actions on Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-red-500 tracking-wider">
                {book.genre}
              </span>
              <h2 className="text-2xl font-black drop-shadow-md">{book.title}</h2>
              <div className="flex items-center gap-2.5 mt-1 text-xs text-zinc-300">
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {book.rating}
                </span>
                <span>·</span>
                <span>{book.author}</span>
                <span>·</span>
                <span>{book.year}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playNetflixTaDum();
                  onClose();
                  onRead(book);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 fill-white" />
                <span>Lire</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onToggleWishlist(book);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-all"
                title={isInWishlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
              >
                {isInWishlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <p className="text-sm text-zinc-300 leading-relaxed mb-5">
            {book.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">Format :</span>
                <span className="text-zinc-200 font-medium">Dossier historique complet</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">Première parution :</span>
                <span className="text-zinc-200 font-medium">{book.year}</span>
              </div>
            </div>
            {book.progressPercent && (
              <div className="col-span-2 mt-2">
                <div className="flex items-center justify-between text-zinc-400 mb-1.5">
                  <span className="font-semibold text-zinc-200">
                    Progression de lecture
                  </span>
                  <span>{book.progressPercent}% (page {book.currentPage}/{book.totalPages})</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E50914]"
                    style={{ width: `${book.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
