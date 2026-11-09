import { useState, useMemo, useEffect } from 'react';
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
import { DossierCard } from './components/DossierCard.tsx';
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('netflix_sidebar_expanded');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('netflix_sidebar_expanded', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ITEMS_PER_PAGE = 16;

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
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={toggleSidebar}
      />

      {/* True Full Screen Split View: Left Dock + Collapsible Sidebar + Main Scrollable Canvas */}
      <div className="relative z-10 flex-1 flex flex-row w-full h-[calc(100vh-53px)] overflow-hidden">
        {/* Left Quick Navigation Dock (Flush on the left edge, with expand/collapse toggle) */}
        <LeftDock
          activeTab={activeDockTab}
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebar={toggleSidebar}
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

        {/* Collapsible Sidebar: Navigation & Dossiers Clés ("dépliable / repliable") */}
        <div
          className={`h-full border-r border-white/8 bg-[#121317]/95 flex flex-col justify-between shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarExpanded
              ? 'w-56 lg:w-60 p-4 opacity-100'
              : 'w-0 p-0 border-r-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-56 lg:w-60 h-full flex flex-col justify-between overflow-y-auto pr-1">
            <Sidebar
              activeNav={activeNav}
              onSelectNav={(nav) => setActiveNav(nav as 'browse' | 'wishlist' | 'coming_soon')}
              spotlightBooks={spotlightBooks}
              onOpenReader={(book) => setReadingBook(book)}
              wishlistCount={wishlist.length}
              totalBooksCount={ALL_HISTORICAL_BOOKS.length}
              onToggleCollapse={toggleSidebar}
            />
          </div>
        </div>

        {/* Main Content Area (Edge-to-Edge Full Screen Scrolling) */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 bg-[#0f1013]/60">
          {activeNav === 'browse' ? (
            <>
              {/* Category & Display Mode Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/8">
                {/* Region filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                  {categories.map((cat) => {
                    const isActive = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setCategoryFilter(cat.id as typeof categoryFilter);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-zinc-950 shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5'
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    );
                  })}
                </div>

                {/* Display mode buttons (À la une vs Grille complète) */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/8 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setDisplayMode('rows');
                      setCategoryFilter('all');
                      setPartFilter('all');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      displayMode === 'rows' && categoryFilter === 'all'
                        ? 'bg-[#E50914] text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    À la une
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setDisplayMode('grid');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      displayMode === 'grid' || categoryFilter !== 'all'
                        ? 'bg-[#E50914] text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Grille ({filteredCatalog.length})
                  </button>
                </div>
              </div>
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
                    onSelectHero={(book) => setHeroBook(book)}
                  />

                  {/* Row 1: Grands Événements & Bestsellers */}
                  <BestsellersRow
                    items={BESTSELLER_HISTORICAL_BOOKS}
                    onOpenReader={(book) => setReadingBook(book)}
                    onOpenDetails={(book) => setDetailsBook(book)}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />

                  {/* Row 2: Reprendre l'étude et la lecture */}
                  <ContinueReadingRow
                    items={CONTINUE_HISTORICAL_BOOKS}
                    onOpenReader={(book) => setReadingBook(book)}
                    onOpenDetails={(book) => setDetailsBook(book)}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />

                  {/* Row 3: Afrique (Sélection de 4 dossiers majeurs) */}
                  <section className="mb-8 select-none">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-white text-base lg:text-lg font-bold tracking-tight flex items-center gap-2">
                          <span>Afrique : Royaumes, Empires & Indépendances</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                            40 dossiers
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Des épopées mandingues et aksoumites jusqu'aux luttes de libération
                        </p>
                      </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                      {AFRICA_BOOKS.slice(0, 4).map((book) => (
                        <DossierCard
                          key={book.id}
                          book={book}
                          onOpenReader={(b) => setReadingBook(b)}
                          onOpenDetails={(b) => setDetailsBook(b)}
                          isInWishlist={wishlist.includes(book.id)}
                          onToggleWishlist={toggleWishlist}
                          actionLabel="Lire le dossier"
                        />
                      ))}
                    </div>
                  </section>

                  {/* Row 4: Europe (Sélection de 4 dossiers majeurs) */}
                  <section className="mb-8 select-none">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-white text-base lg:text-lg font-bold tracking-tight flex items-center gap-2">
                          <span>Europe : Révolutions, Siècle des Lumières & Traités</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                            40 dossiers
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          De la démocratie athénienne à la chute du rideau de fer
                        </p>
                      </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                      {EUROPE_BOOKS.slice(0, 4).map((book) => (
                        <DossierCard
                          key={book.id}
                          book={book}
                          onOpenReader={(b) => setReadingBook(b)}
                          onOpenDetails={(b) => setDetailsBook(b)}
                          isInWishlist={wishlist.includes(book.id)}
                          onToggleWishlist={toggleWishlist}
                          actionLabel="Lire le dossier"
                        />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {paginatedGridBooks.map((book) => (
                      <DossierCard
                        key={book.id}
                        book={book}
                        onOpenReader={(b) => setReadingBook(b)}
                        onOpenDetails={(b) => setDetailsBook(b)}
                        isInWishlist={wishlist.includes(book.id)}
                        onToggleWishlist={toggleWishlist}
                        actionLabel="Lire le dossier"
                      />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {wishlistBooks.map((book) => (
                    <DossierCard
                      key={book.id}
                      book={book}
                      onOpenReader={(b) => setReadingBook(b)}
                      onOpenDetails={(b) => setDetailsBook(b)}
                      isInWishlist={true}
                      onToggleWishlist={toggleWishlist}
                      actionLabel="Lire le dossier"
                    />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {ALL_HISTORICAL_BOOKS.slice(100, 108).map((book) => (
                  <DossierCard
                    key={book.id}
                    book={book}
                    onOpenReader={(b) => setReadingBook(b)}
                    onOpenDetails={(b) => setDetailsBook(b)}
                    isInWishlist={wishlist.includes(book.id)}
                    onToggleWishlist={toggleWishlist}
                    actionLabel="Consulter"
                  />
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
