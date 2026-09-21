import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Check,
  Plus,
  Trash2,
  Calendar,
  Star,
  Play,
  Square,
  AlertTriangle,
  Send,
  MessageSquare,
  Heart,
  FolderPlus,
} from 'lucide-react';
import { Book, ReadingStatus } from '../types';
import { useReader } from '../context/ReaderContext';
import { statusLabel, formatMinutes } from '../data/catalog';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  const {
    library,
    addToLibrary,
    updateBook,
    removeFromLibrary,
    recordReading,
    createPost,
    rateAndReviewBook,
    toggleFavoriteBook,
    customLists,
    addBookToCustomList,
    removeBookFromCustomList,
  } = useReader();
  const [readingSessionSeconds, setReadingSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pagesInput, setPagesInput] = useState('10');

  // Review & Rating state
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewSpoiler, setReviewSpoiler] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setReadingSessionSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (isOpen && book) {
      const item = library.find((b) => b.id === book.id);
      setUserRating(item?.userRating || 0);
      setReviewText(item?.userReview || '');
      setReviewSpoiler(item?.isReviewSpoiler || false);
      setShowReviewInput(false);
      setIsTimerRunning(false);
      setReadingSessionSeconds(0);
    }
  }, [isOpen, book?.id]);

  if (!isOpen || !book) return null;

  const libraryItem = library.find((b) => b.id === book.id);
  const inLibrary = Boolean(libraryItem);
  const currentStatus: ReadingStatus = libraryItem?.status || 'want';
  const progress = libraryItem?.progress || 0;
  const progressPercent =
    book.pages > 0 ? Math.min(100, Math.round((progress / book.pages) * 100)) : 0;

  const handleStatusChange = (newStatus: ReadingStatus) => {
    if (inLibrary) {
      updateBook(book.id, { status: newStatus });
    } else {
      addToLibrary(book, newStatus);
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    rateAndReviewBook(book.id, rating);
  };

  const handleQuickPages = (pages: number) => {
    recordReading(pages, book.id);
  };

  const handleStopAndSaveTimer = () => {
    setIsTimerRunning(false);
    const minutes = Math.max(1, Math.round(readingSessionSeconds / 60));
    const pages = parseInt(pagesInput, 10) || 5;
    recordReading(pages, book.id, minutes);
    setReadingSessionSeconds(0);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    createPost({
      content: reviewText.trim(),
      bookId: book.id,
      rating: userRating > 0 ? userRating : undefined,
      isSpoiler: reviewSpoiler,
      type: 'review',
    });

    setReviewText('');
    setReviewSpoiler(false);
    setShowReviewInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-amber-500 font-bold">
              KİTAP DETAYI & İNCELEME
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Hero Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            <div className="relative w-28 h-40 sm:w-32 sm:h-48 rounded-xl overflow-hidden shadow-2xl bg-neutral-800 border border-neutral-700/50 shrink-0">
              <BookCover
                src={book.cover}
                alt={book.title}
                title={book.title}
                author={book.author}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                {(book.hasVerifiedTurkishEdition || book.language === 'tr') && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wide">
                    <Check className="w-3 h-3" />
                    Doğrulanmış Türkçe Baskı
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">{book.title}</h2>
              <p className="text-neutral-400 font-medium text-sm mt-0.5">{book.author}</p>

              {book.originalTitle && book.originalTitle.toLowerCase() !== book.title.toLowerCase() && (
                <p className="text-xs text-neutral-400 mt-1">
                  <span className="text-neutral-500 font-medium">Orijinal adı:</span> {book.originalTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-xs text-neutral-400">
                <span className="bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                  {book.pages > 0 ? `${book.pages} sayfa` : 'Sayfa bilgisi yok'}
                </span>
                {book.year && (
                  <span className="bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {book.year}
                  </span>
                )}
                {book.publisher && (
                  <span className="bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                    {book.publisher}
                  </span>
                )}
                {book.isbn && (
                  <span className="bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                    ISBN: {book.isbn}
                  </span>
                )}
                {book.category && (
                  <span className="bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                    {book.category}
                  </span>
                )}
              </div>

              {/* Status Selector (Roadmap: Okuyorum, Okuyacağım, Okudum, Yarım Bıraktım) */}
              <div className="mt-4">
                <label className="text-xs text-neutral-400 font-semibold block mb-1.5 text-left">
                  Okuma Durumu:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['reading', 'want', 'finished', 'dropped'] as ReadingStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        currentStatus === status && inLibrary
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                      }`}
                    >
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Star Rating: Only visible when "Okudum" (finished) is selected */}
              {currentStatus === 'finished' && inLibrary && (
                <div className="mt-3.5 pt-3 border-t border-neutral-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-medium">Puanın:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (userRating || libraryItem?.userRating || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {(userRating || libraryItem?.userRating) ? (
                    <span className="text-xs text-amber-400 font-medium">
                      {(userRating || libraryItem?.userRating)} / 5
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 italic">İsteğe bağlı</span>
                  )}
                </div>
              )}

              {/* Independent Actions (Favorites) */}
              <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleFavoriteBook(book.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    libraryItem?.favorite
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                  title={libraryItem?.favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${libraryItem?.favorite ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span>{libraryItem?.favorite ? 'Favorilerde' : 'Favorilere Ekle'}</span>
                </button>
              </div>

              {/* Custom Lists Selector */}
              {customLists.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                      <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                      Listelerime Ekle:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {customLists.map((list) => {
                      const isInList = list.bookIds.includes(book.id);
                      return (
                        <button
                          key={list.id}
                          type="button"
                          onClick={() => {
                            if (isInList) {
                              removeBookFromCustomList(list.id, book.id);
                            } else {
                              addBookToCustomList(list.id, book.id);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            isInList
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          {isInList ? '✓ ' : '+ '}
                          {list.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reading Progress (if in library or reading) */}
          {inLibrary && (
            <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">İlerleme Durumu</span>
                <span className="text-xs font-bold text-amber-400">
                  {progress} / {book.pages} sf (%{progressPercent})
                </span>
              </div>

              <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-neutral-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Quick Log Buttons */}
              <div className="pt-1 flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickPages(10)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  +10 sayfa
                </button>
                <button
                  onClick={() => handleQuickPages(25)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  +25 sayfa
                </button>
              </div>

              {/* Reading Stopwatch / Timer */}
              <div className="mt-3 pt-3 border-t border-neutral-700/50 flex items-center justify-between bg-neutral-900/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs text-neutral-300 font-medium block">
                      Okuma Kronometresi
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {Math.floor(readingSessionSeconds / 60)}:
                      {(readingSessionSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {!isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Başlat
                  </button>
                ) : (
                  <button
                    onClick={handleStopAndSaveTimer}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Durdur & Kaydet
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Review & Spoiler Tag Section */}
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white">İnceleme Paylaş</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewInput(!showReviewInput)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                {showReviewInput ? 'Kapat' : '+ İnceleme Yaz'}
              </button>
            </div>

            {showReviewInput && (
              <form onSubmit={handleReviewSubmit} className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Bu kitap hakkında düşüncelerinizi, karakterleri veya kurguyu yorumlayın..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewSpoiler}
                      onChange={(e) => setReviewSpoiler(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚠️ İncelemem Spoiler İçeriyor</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-amber-500/10"
                  >
                    <Send className="w-3 h-3" />
                    <span>Paylaş</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Book Summary / Description */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Kitap Hakkında</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {book.description ||
                'Bu kitap hakkında geniş açıklama yakında eklenecek. Kitaplığa ekleyerek okuma sürecini takip edebilirsin.'}
            </p>
          </div>

          {/* Remove from Library action */}
          {inLibrary && (
            <div className="pt-2 flex justify-between items-center border-t border-neutral-800">
              <span className="text-xs text-neutral-500">Kitaplığında kayıtlı</span>
              <button
                onClick={() => {
                  removeFromLibrary(book.id);
                  onClose();
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kitaplığımdan Çıkar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
