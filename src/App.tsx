import { useState, useMemo } from 'react';
import {
  ALL_HISTORICAL_BOOKS,
  BESTSELLER_HISTORICAL_BOOKS,
  CONTINUE_HISTORICAL_BOOKS,
  HERO_HISTORICAL_BOOK,
  AFRICA_BOOKS,
  EUROPE_BOOKS,
} from './data/historicalDossiers.ts';
import { BookItem } from './data/booksData.ts';
import {
  filterBooksByQuery,
  filterBooksByCategory,
  filterBooksByPart,
} from './utils/filterContent.ts';
import { LeftDock } from './components/LeftDock.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { HeaderBar } from './components/HeaderBar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { BestsellersRow } from './components/BestsellersRow.tsx';
import { ContinueReadingRow } from './components/ContinueReadingRow.tsx';
import { BookReaderModal } from './components/BookReaderModal.tsx';
import { BookDetailsModal } from './components/BookDetailsModal.tsx';
import { playClickSound, playNetflixTaDum } from './utils/audio.ts';
import {
  Sparkles,
  BookMarked,
  Volume2,
  Globe2,
  Compass,
  Grid,
  List,
  BookOpen,
  Star,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState<'browse' | 'wishlist' | 'coming_soon'>('browse');
  const [activeDockTab, setActiveDockTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'afrique' | 'europe' | 'asie' | 'ameriques' | 'monde'>('all');
  const [partFilter, setPartFilter] = useState<'all' | '1' | '2'>('all');
  const [displayMode, setDisplayMode] = useState<'rows' | 'grid'>('rows');
  const [heroBook, setHeroBook] = useState<BookItem>(HERO_HISTORICAL_BOOK);
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);
  const [detailsBook, setDetailsBook] = useState<BookItem | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([
    'dossier-p1-001',
    'dossier-p2-002',
    'dossier-p1-024',
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 24;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const toggleWishlist = (item: BookItem) => {
    setWishlist((prev) => {
      const exists = prev.includes(item.id);
      if (exists) {
        showToast(`Retiré de votre liste : « ${item.title} »`);
        return prev.filter((id) => id !== item.id);
      } else {
        showToast(`Ajouté à votre liste : « ${item.title} »`);
        return [...prev, item.id];
      }
    });
  };

  // Filtered catalog based on category, part, and search
  const filteredCatalog = useMemo(() => {
    let list = ALL_HISTORICAL_BOOKS;
    if (categoryFilter !== 'all') {
      list = filterBooksByCategory(list, categoryFilter);
    }
    if (partFilter !== 'all') {
      list = filterBooksByPart(list, partFilter);
    }
    if (searchQuery.trim() !== '') {
      list = filterBooksByQuery(list, searchQuery);
    }
    return list;
  }, [categoryFilter, partFilter, searchQuery]);

  // Wishlist books
  const wishlistBooks = useMemo(() => {
    return ALL_HISTORICAL_BOOKS.filter((item) => wishlist.includes(item.id));
  }, [wishlist]);

  // Spotlight recommendations for sidebar
  const spotlightBooks = useMemo(() => {
    return [
      ALL_HISTORICAL_BOOKS[0],   // Kirina
      ALL_HISTORICAL_BOOKS[101], // Mansa Musa
      ALL_HISTORICAL_BOOKS[23],  // Constantinople
    ];
  }, []);

  // Paginated books for Grid mode
  const totalGridPages = Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE);
  const paginatedGridBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCatalog.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCatalog, currentPage]);

  const categories = [
    { id: 'all', label: 'Tous les dossiers', count: 200, icon: Globe2 },
    { id: 'afrique', label: 'Afrique', count: 40, icon: Compass },
    { id: 'europe', label: 'Europe', count: 40, icon: Compass },
    { id: 'asie', label: 'Asie & Moyen-Orient', count: 39, icon: Compass },
    { id: 'ameriques', label: 'Amériques', count: 30, icon: Compass },
    { id: 'monde', label: 'Monde contemporain', count: 51, icon: Compass },
  ];

  return (
    <div className="w-screen h-screen bg-[#0e0f12] text-zinc-100 flex flex-col font-sans select-none overflow-hidden m-0 p-0">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(229,9,20,0.15) 0%, rgba(14,15,18,0) 70%)',
        }}
      />

      {/* Top Header Bar spans full 100% viewport width */}
      <HeaderBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onNotificationClick={() => showToast('200 dossiers historiques sont disponibles dans votre bibliothèque')}
        unreadCount={3}
      />

      {/* True Full Screen Split View: Left Dock + Sidebar + Main Scrollable Canvas */}
      <div className="relative z-10 flex-1 flex flex-row w-full h-[calc(100vh-53px)] overflow-hidden">
        {/* Left Quick Navigation Dock (Flush on the left edge, no floating margin) */}
        <LeftDock
          activeTab={activeDockTab}
          onSelectTab={(tab) => {
            setActiveDockTab(tab);
            if (tab === 'browse') setActiveNav('browse');
            if (tab === 'wishlist') setActiveNav('wishlist');
            if (tab === 'library') {
              setActiveNav('browse');
              setDisplayMode('grid');
            }
          }}
          onOpenSearch={() => {
            setActiveNav('browse');
            const searchEl = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement;
            searchEl?.focus();
          }}
        />

        {/* Sidebar: Navigation & Dossiers Clés */}
        <div className="w-56 lg:w-60 h-full p-4 border-r border-white/8 bg-[#121317]/95 flex flex-col justify-between shrink-0 overflow-y-auto">
          <Sidebar
            activeNav={activeNav}
            onSelectNav={(nav) => setActiveNav(nav as 'browse' | 'wishlist' | 'coming_soon')}
            spotlightBooks={spotlightBooks}
            onOpenReader={(book) => setReadingBook(book)}
            wishlistCount={wishlist.length}
            totalBooksCount={ALL_HISTORICAL_BOOKS.length}
          />
        </div>

        {/* Main Content Area (Edge-to-Edge Full Screen Scrolling) */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 bg-[#0f1013]/60">
          {activeNav === 'browse' ? (
            <>


              {/* Search feedback notice */}
              {searchQuery && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-zinc-300">
                  <span>
                    Résultats de recherche pour <strong className="text-white">« {searchQuery} »</strong> :{' '}
                    <span className="text-red-400 font-bold">{filteredCatalog.length} dossiers</span> trouvés
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Effacer le filtre
                  </button>
                </div>
              )}

              {/* Row mode or Grid mode */}
              {displayMode === 'rows' && !searchQuery && categoryFilter === 'all' && partFilter === 'all' ? (
                <>
                  {/* Hero Banner featuring flagship historical book */}
                  <HeroBanner
                    book={heroBook}
                    onRead={(book) => setReadingBook(book)}
                    isInWishlist={wishlist.includes(heroBook.id)}
                    onToggleWishlist={toggleWishlist}
                  />

                  {/* Row 1: Grands Événements & Bestsellers */}
                  <BestsellersRow
                    items={BESTSELLER_HISTORICAL_BOOKS}
                    onOpenReader={(book) => setReadingBook(book)}
                    onOpenDetails={(book) => setDetailsBook(book)}
                  />

                  {/* Row 2: Reprendre l'étude et la lecture */}
                  <ContinueReadingRow
                    items={CONTINUE_HISTORICAL_BOOKS}
                    onOpenReader={(book) => setReadingBook(book)}
                    onOpenDetails={(book) => setDetailsBook(book)}
                  />

                  {/* Row 3: Afrique (Sélection de 4 dossiers majeurs) */}
                  <section className="mb-5 select-none">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-white text-xs lg:text-sm font-semibold tracking-wide flex items-center gap-2">
                        <span>Afrique : Royaumes, Colonisation & Indépendances (40 dossiers)</span>
                      </h2>
                      <button
                        onClick={() => {
                          setCategoryFilter('afrique');
                          setDisplayMode('grid');
                        }}
                        className="text-xs text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                      >
                        Voir les 40 dossiers →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {AFRICA_BOOKS.slice(0, 4).map((book) => (
                        <div
                          key={book.id}
                          onClick={() => {
                            playNetflixTaDum();
                            setReadingBook(book);
                          }}
                          className="group relative rounded-xl overflow-hidden bg-[#131417] border border-white/8 hover:border-white/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/70 cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative w-full h-[105px] lg:h-[120px] overflow-hidden bg-black">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-106"
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-amber-400 font-bold flex items-center gap-1 border border-white/10">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              <span>{book.rating}</span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                                <BookOpen className="w-4 h-4 fill-white" />
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 flex items-start justify-between gap-1.5 bg-[#0e0f11]">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-white text-xs font-bold truncate group-hover:text-red-400 transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-zinc-400 text-[10px] mt-0.5 truncate font-medium">
                                {book.author}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setDetailsBook(book);
                              }}
                              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                              title="Fiche détaillée"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Row 4: Europe (Sélection de 4 dossiers majeurs) */}
                  <section className="mb-5 select-none">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-white text-xs lg:text-sm font-semibold tracking-wide flex items-center gap-2">
                        <span>Europe : Révolutions, Empires & Guerres (40 dossiers)</span>
                      </h2>
                      <button
                        onClick={() => {
                          setCategoryFilter('europe');
                          setDisplayMode('grid');
                        }}
                        className="text-xs text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                      >
                        Voir les 40 dossiers →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {EUROPE_BOOKS.slice(0, 4).map((book) => (
                        <div
                          key={book.id}
                          onClick={() => {
                            playNetflixTaDum();
                            setReadingBook(book);
                          }}
                          className="group relative rounded-xl overflow-hidden bg-[#131417] border border-white/8 hover:border-white/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/70 cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative w-full h-[105px] lg:h-[120px] overflow-hidden bg-black">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-106"
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-amber-400 font-bold flex items-center gap-1 border border-white/10">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              <span>{book.rating}</span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                                <BookOpen className="w-4 h-4 fill-white" />
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 flex items-start justify-between gap-1.5 bg-[#0e0f11]">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-white text-xs font-bold truncate group-hover:text-red-400 transition-colors">
                                {book.title}
                              </h3>
                              <p className="text-zinc-400 text-[10px] mt-0.5 truncate font-medium">
                                {book.author}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setDetailsBook(book);
                              }}
                              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                              title="Fiche détaillée"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                /* Complete Catalog Grid Mode (Paginated across all 200 dossiers) */
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Affichage de <strong className="text-white">{filteredCatalog.length} dossiers</strong>
                      {totalGridPages > 1 && ` (Page ${currentPage} sur ${totalGridPages})`}
                    </span>
                    {totalGridPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-medium cursor-pointer"
                        >
                          ← Précédent
                        </button>
                        <span className="text-xs text-zinc-300">
                          {currentPage} / {totalGridPages}
                        </span>
                        <button
                          disabled={currentPage >= totalGridPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalGridPages, p + 1))}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-medium cursor-pointer"
                        >
                          Suivant →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Book Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {paginatedGridBooks.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => {
                          playNetflixTaDum();
                          setReadingBook(book);
                        }}
                        className="group relative rounded-xl overflow-hidden bg-[#131417] border border-white/10 hover:border-white/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/70 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative w-full h-40 overflow-hidden bg-black">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-106"
                            loading="lazy"
                          />
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] text-amber-400 font-bold flex items-center gap-0.5 border border-white/10">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <span>{book.rating}</span>
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                              <BookOpen className="w-4 h-4 fill-white" />
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 flex flex-col justify-between flex-1 bg-[#0e0f11]">
                          <div>
                            <h3 className="text-white text-xs font-bold line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                              {book.title}
                            </h3>
                            <p className="text-zinc-400 text-[10px] mt-1 truncate">
                              {book.author}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                setDetailsBook(book);
                              }}
                              className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Info className="w-3 h-3" />
                              <span>Détails</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(book);
                              }}
                              className="text-[10px] text-red-500 hover:text-red-400 font-medium cursor-pointer"
                            >
                              {wishlist.includes(book.id) ? '✓ Sauvé' : '+ Liste'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Footer */}
                  {totalGridPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-4 pb-8">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold cursor-pointer"
                      >
                        Page précédente
                      </button>
                      <span className="text-xs text-zinc-400">
                        Page <strong className="text-white">{currentPage}</strong> sur {totalGridPages}
                      </span>
                      <button
                        disabled={currentPage >= totalGridPages}
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalGridPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold cursor-pointer"
                      >
                        Page suivante
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : activeNav === 'wishlist' ? (
            /* Wishlist / Ma Liste View */
            <div className="flex-1 flex flex-col select-none animate-fadeIn">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-red-500" />
                  <span>Ma Liste de Lecture & Recherche ({wishlistBooks.length})</span>
                </h2>
                <button
                  onClick={() => setActiveNav('browse')}
                  className="text-xs text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                >
                  ← Retour au catalogue complet
                </button>
              </div>

              {wishlistBooks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-zinc-400">
                  <p className="text-sm">Votre liste de lecture est actuellement vide.</p>
                  <button
                    onClick={() => setActiveNav('browse')}
                    className="mt-4 px-5 py-2 bg-[#E50914] text-white text-xs font-bold rounded-full hover:bg-red-700 transition cursor-pointer"
                  >
                    Explorer les 200 dossiers historiques
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {wishlistBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setReadingBook(book)}
                      className="group relative rounded-xl overflow-hidden bg-zinc-900/90 border border-white/10 hover:border-white/30 transition-all cursor-pointer p-2.5 flex flex-col justify-between"
                    >
                      <div className="h-40 rounded-lg overflow-hidden bg-black mb-2 shadow">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white truncate">{book.title}</h3>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{book.author}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <span className="text-[9px] text-zinc-500">{book.year}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(book);
                            }}
                            className="text-red-500 text-[10px] hover:text-red-400 font-semibold cursor-pointer"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* À Paraître / Coming Soon View */
            <div className="flex-1 flex flex-col select-none animate-fadeIn">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Partie 2 & Nouveautés Historiques en Bibliothèque</span>
                </h2>
                <button
                  onClick={() => setActiveNav('browse')}
                  className="text-xs text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                >
                  ← Retour au catalogue
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-4">
                Découvrez une sélection des fiches de la Partie 2 prêtes pour l'étude et l'enrichissement personnalisé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ALL_HISTORICAL_BOOKS.slice(100, 106).map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setReadingBook(book)}
                    className="rounded-xl overflow-hidden bg-zinc-900/90 border border-white/10 p-3.5 hover:border-white/30 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 rounded-lg overflow-hidden bg-black mb-3 shadow">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                        {book.genre}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-zinc-300">{book.author}</p>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadingBook(book);
                      }}
                      className="mt-3.5 w-full py-2 rounded-lg bg-white/10 hover:bg-[#E50914] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Consulter la fiche
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Sound Chime Button */}
      <button
        onClick={() => {
          playNetflixTaDum();
          showToast('Ta-dum!');
        }}
        className="fixed bottom-4 right-5 z-40 flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs text-zinc-300 hover:text-white shadow-xl transition-all cursor-pointer"
        title="Jouer le son d'introduction"
      >
        <Volume2 className="w-3.5 h-3.5 text-red-500" />
        <span>Chime</span>
      </button>

      {/* Interactive Digital Book & Historical Dossier Reader Modal */}
      <BookReaderModal
        book={readingBook}
        onClose={() => setReadingBook(null)}
      />

      {/* Book Details Modal */}
      <BookDetailsModal
        book={detailsBook}
        onClose={() => setDetailsBook(null)}
        onRead={(book) => setReadingBook(book)}
        isInWishlist={detailsBook ? wishlist.includes(detailsBook.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1f24] text-white text-xs font-medium px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#E50914]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
