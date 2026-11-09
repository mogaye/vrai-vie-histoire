import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Edit3,
  BookOpen,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { BookItem } from '../data/booksData.ts';

interface BookReaderModalProps {
  book: BookItem | null;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  const [fontSize, setFontSize] = useState<number>(17);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [chapterIdx, setChapterIdx] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [customContent, setCustomContent] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load custom content from localStorage when book changes
  useEffect(() => {
    if (book) {
      setChapterIdx(0);
      setIsEditMode(false);
      const saved = localStorage.getItem(`book_custom_content_${book.id}`);
      if (saved) {
        setCustomContent(saved);
      } else {
        setCustomContent('');
      }
    }
  }, [book]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeech();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopSpeech();
    };
  }, []);

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeech();
    } else {
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSaveCustomContent = () => {
    if (!book) return;
    localStorage.setItem(`book_custom_content_${book.id}`, customContent);
    setSaveToast('Contenu et notes personnalisés enregistrés avec succès !');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetCustomContent = () => {
    if (!book) return;
    localStorage.removeItem(`book_custom_content_${book.id}`);
    setCustomContent('');
    setSaveToast('Contenu personnalisé réinitialisé.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  if (!book) return null;

  const currentChapter = book.chapters[chapterIdx] || book.chapters[0];

  const themeStyles = {
    dark: 'bg-[#121316] text-zinc-200 border-zinc-800',
    sepia: 'bg-[#fbf0d9] text-[#4a3928] border-[#e8d8be]',
    light: 'bg-[#fafafa] text-[#1c1c1e] border-zinc-200',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={() => {
        stopSpeech();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${themeStyles[readerTheme]}`}
      >
        {/* Top Reader Toolbar */}
        <header className="px-5 py-3.5 flex items-center justify-between border-b border-inherit shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#E50914] font-black tracking-wider text-sm font-sans shrink-0">
              NETFLIX BOOKS
            </span>
            <div className="h-4 w-px bg-current opacity-20 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold truncate max-w-xs md:max-w-md">{book.title}</h2>
              <span className="text-[11px] opacity-70 truncate block">{book.author}</span>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mode switch: Lecture vs Édition */}
            <button
              onClick={() => {
                stopSpeech();
                setIsEditMode(!isEditMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
              }`}
              title={isEditMode ? 'Revenir à la lecture' : 'Ajouter ou éditer des contenus'}
            >
              {isEditMode ? <BookOpen className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isEditMode ? 'Mode Lecture' : 'Éditer / Vos contenus'}</span>
            </button>

            {/* Audio Narration Toggle (only in read mode) */}
            {!isEditMode && (
              <button
                onClick={() => toggleSpeech(`${currentChapter.title}. ${currentChapter.content}`)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40 animate-pulse'
                    : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
                }`}
                title={isSpeaking ? 'Arrêter la lecture audio' : 'Écouter la lecture audio'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Arrêter' : 'Audio'}</span>
              </button>
            )}

            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFontSize((s) => Math.max(13, s - 2))}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                title="Diminuer la police"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                title="Agrandir la police"
              >
                A+
              </button>
            </div>

            {/* Reader Theme Switcher */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setReaderTheme('dark')}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-900 border ${readerTheme === 'dark' ? 'ring-2 ring-red-500' : 'opacity-60'}`}
                title="Thème Sombre"
              />
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#fbf0d9] border ${readerTheme === 'sepia' ? 'ring-2 ring-red-500' : 'opacity-60'}`}
                title="Thème Sépia"
              />
              <button
                onClick={() => setReaderTheme('light')}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border ${readerTheme === 'light' ? 'ring-2 ring-red-500' : 'opacity-60'}`}
                title="Thème Clair"
              />
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isBookmarked ? 'text-red-500' : 'opacity-60 hover:opacity-100'
              }`}
              title="Marquer ce dossier"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-1.5 rounded-full opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Fermer le lecteur"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chapter Quick Bar (Jump directly to any section) */}
        {!isEditMode && (
          <div className="px-5 py-2 border-b border-inherit overflow-x-auto flex items-center gap-2 text-xs no-scrollbar shrink-0 bg-black/5 dark:bg-white/5">
            {book.chapters.map((chap, idx) => {
              const active = chapterIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    stopSpeech();
                    setChapterIdx(idx);
                  }}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                    active
                      ? 'bg-[#E50914] text-white shadow font-semibold'
                      : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {chap.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Reader Book Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-14 py-6 leading-relaxed max-w-3xl mx-auto w-full">
          {saveToast && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveToast}</span>
            </div>
          )}

          {isEditMode ? (
            /* Custom Content / Note Editor */
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-1">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Espace de saisie : Ajoutez vos contenus et notes pour ce dossier</span>
                </h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Conformément à votre demande, vous pouvez ajouter, rédiger ou remplacer les contenus de ce dossier historique.
                  Vos modifications sont automatiquement sauvegardées en mémoire locale.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
                  Vos contenus / notes pour « {book.title} »
                </label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Tapez ou collez ici vos textes, analyses, résumés détaillés, citations ou ajouts pour ce dossier historique..."
                  rows={14}
                  className="w-full p-4 rounded-xl border border-inherit bg-black/10 dark:bg-white/5 outline-none focus:ring-2 focus:ring-[#E50914] text-sm leading-relaxed font-sans resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSaveCustomContent}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold transition shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer mes contenus</span>
                </button>

                {customContent && (
                  <button
                    onClick={handleResetCustomContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs opacity-60 hover:opacity-100 hover:text-red-400 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Normal Reading Mode */
            <>
              {/* Chapter Heading */}
              <div className="mb-6 text-center border-b border-inherit pb-5">
                <span className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center justify-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Dossier Historique Documenté
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                  {currentChapter.title}
                </h3>
              </div>

              {/* Chapter Content with custom font size */}
              <div
                className="font-serif tracking-normal leading-[1.85] whitespace-pre-line text-justify"
                style={{ fontSize: `${fontSize}px` }}
              >
                {currentChapter.content}
              </div>

              {/* If user has saved custom notes for this dossier, display them as an addendum */}
              {customContent && (
                <div className="mt-8 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Vos Notes et Contenus Enregistrés :
                  </span>
                  <div
                    className="font-sans text-xs leading-relaxed opacity-90 whitespace-pre-line"
                  >
                    {customContent}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Pagination & Progress Bar */}
        {!isEditMode && (
          <footer className="px-5 py-3 border-t border-inherit flex items-center justify-between text-xs opacity-80 shrink-0">
            <div className="flex items-center gap-2">
              <button
                disabled={chapterIdx === 0}
                onClick={() => {
                  stopSpeech();
                  setChapterIdx((i) => Math.max(0, i - 1));
                }}
                className="flex items-center gap-1 px-3 py-1 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <span className="text-[11px] font-medium hidden sm:inline">
                Section {chapterIdx + 1} sur {book.chapters.length}
              </span>

              <button
                disabled={chapterIdx >= book.chapters.length - 1}
                onClick={() => {
                  stopSpeech();
                  setChapterIdx((i) => Math.min(book.chapters.length - 1, i + 1));
                }}
                className="flex items-center gap-1 px-3 py-1 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-medium"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium">Chapitre {chapterIdx + 1} / {book.chapters.length}</span>
              <div className="w-20 sm:w-28 h-1.5 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E50914] transition-all"
                  style={{
                    width: `${((chapterIdx + 1) / book.chapters.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
