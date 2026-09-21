import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  AlertTriangle,
  Star,
  Send,
  Sparkles,
  Quote,
  Search,
  Check,
  MessageSquare,
  CornerDownLeft,
} from 'lucide-react';
import { useReader } from '../context/ReaderContext';
import { Book, LibraryBook } from '../types';
import { featuredBooks } from '../data/catalog';
import { BookCover } from './BookCover';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBook?: Book;
  initialType?: 'general' | 'review' | 'quote';
}

const RATING_LABELS: Record<number, string> = {
  1: '🙁 Zayıf',
  2: '😐 Fena Değil',
  3: '🙂 İyiydi',
  4: '😊 Çok Başarılı',
  5: '🤩 Başyapıt!',
};

const QUICK_TAGS = ['📖 Okudum', '☕ Kahve & Kitap', '✨ Tavsiye Ederim', '💡 Düşünce', '❤️ Favorim'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  preselectedBook,
  initialType = 'general',
}) => {
  const { library, createPost } = useReader();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'general' | 'review' | 'quote'>(initialType);
  const [selectedBook, setSelectedBook] = useState<Book | LibraryBook | null>(
    preselectedBook || null
  );
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPostType(initialType);
      if (preselectedBook) {
        setSelectedBook(preselectedBook);
      }
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialType, preselectedBook]);

  if (!isOpen) return null;

  // Currently reading books from library for 1-click tagging
  const currentlyReadingBooks = library.filter((b) => b.status === 'reading');

  // Filter books for search dropdown (combines library and featured catalog without duplicates)
  const allAvailableBooks: (Book | LibraryBook)[] = [...library];
  featuredBooks.forEach((fb) => {
    if (!allAvailableBooks.some((b) => b.id === fb.id || b.title.toLowerCase() === fb.title.toLowerCase())) {
      allAvailableBooks.push(fb);
    }
  });

  const filteredBooks = searchQuery.trim()
    ? allAvailableBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allAvailableBooks.slice(0, 8);

  const handleSelectBook = (book: Book | LibraryBook) => {
    setSelectedBook(book);
    setIsBookPickerOpen(false);
    setSearchQuery('');
  };

  const handleRemoveBook = () => {
    setSelectedBook(null);
  };

  const handleAddTag = (tag: string) => {
    setContent((prev) => (prev ? `${prev} ${tag}` : tag));
    textareaRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    let finalContent = content.trim();
    if (postType === 'quote') {
      const formattedQuote = finalContent.startsWith('«') || finalContent.startsWith('"')
        ? finalContent
        : `«${finalContent}»`;
      finalContent = pageNumber.trim()
        ? `${formattedQuote} (s. ${pageNumber.trim()})`
        : formattedQuote;
    }

    createPost({
      content: finalContent,
      bookId: selectedBook?.id,
      bookData: selectedBook
        ? {
            id: selectedBook.id,
            title: selectedBook.title,
            author: selectedBook.author,
            cover: selectedBook.cover,
          }
        : undefined,
      rating: postType === 'review' && rating > 0 ? rating : undefined,
      isSpoiler,
      type: postType,
    });

    // Reset form
    setContent('');
    setSelectedBook(null);
    setIsSpoiler(false);
    setRating(0);
    setPageNumber('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                Gönderi & İnceleme Paylaş
              </h3>
              <p className="text-[11px] text-neutral-400">
                Toplulukla düşüncelerini, incelemeni veya bir alıntıyı paylaş
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 overflow-y-auto pr-1 flex-1">
          {/* Post Type Selector Pills */}
          <div className="grid grid-cols-3 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setPostType('general')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                postType === 'general'
                  ? 'bg-neutral-800 text-amber-400 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Düşünce</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('review')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                postType === 'review'
                  ? 'bg-neutral-800 text-amber-400 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>İnceleme</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('quote')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                postType === 'quote'
                  ? 'bg-neutral-800 text-amber-400 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Alıntı</span>
            </button>
          </div>

          {/* Book Tagging Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                İlgili Kitap
              </label>
              {!selectedBook && (
                <button
                  type="button"
                  onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold cursor-pointer"
                >
                  {isBookPickerOpen ? 'Listeyi Gizle' : '+ Kitap Seç'}
                </button>
              )}
            </div>

            {/* Selected Book Preview Card */}
            {selectedBook ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-800/80 border border-neutral-750 animate-in fade-in">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-neutral-700">
                    <BookCover
                      src={selectedBook.cover}
                      alt={selectedBook.title}
                      title={selectedBook.title}
                      author={selectedBook.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate font-serif">
                      {selectedBook.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate">{selectedBook.author}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveBook}
                  className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-750 rounded-lg transition-colors cursor-pointer"
                  title="Kitabı kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                {/* 1-Click Quick Chips for Currently Reading Books */}
                {currentlyReadingBooks.length > 0 && !isBookPickerOpen && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                      Okuduklarım:
                    </span>
                    {currentlyReadingBooks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBook(b)}
                        className="px-2 py-1 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 text-neutral-300 hover:text-amber-300 rounded-lg text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="truncate max-w-[120px]">{b.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Searchable Book Picker Dropdown */}
                {isBookPickerOpen && (
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 space-y-2 animate-in fade-in">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Kitap veya yazar adı ile ara..."
                        className="w-full bg-neutral-900 border border-neutral-750 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1">
                      {filteredBooks.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => handleSelectBook(book)}
                          className="flex items-center gap-2.5 p-1.5 hover:bg-neutral-850 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="w-6 h-8 rounded bg-neutral-800 overflow-hidden shrink-0">
                            <BookCover
                              src={book.cover}
                              alt={book.title}
                              title={book.title}
                              author={book.author}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs text-white font-medium block truncate">
                              {book.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 block truncate">
                              {book.author}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review-Specific: 5-Star Interactive Rating */}
          {postType === 'review' && (
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">Kitap Puanın:</span>
                <span className="text-xs font-bold text-amber-400">
                  {activeRating > 0 ? RATING_LABELS[activeRating] || `${activeRating} / 5` : 'Puan Verin'}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= activeRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quote-Specific: Page Number Input */}
          {postType === 'quote' && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 animate-in fade-in">
              <Quote className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="Sayfa No (Opsiyonel, örn: 142)"
                className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
          )}

          {/* Main Content Textarea */}
          <div className="space-y-1.5">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={postType === 'quote' ? 3 : 4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  postType === 'review'
                    ? 'Kitabın kurgusu, karakterleri veya üslubu hakkında ne düşündün? Detaylı değerlendirmeni yaz...'
                    : postType === 'quote'
                    ? 'Kitaptan altını çizdiğin o unutulmaz cümleyi veya pasajı yaz...'
                    : 'Okuma yolculuğun, bir kitap veya edebiyat hakkında düşüncelerini paylaş...'
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed transition-all"
                required
                maxLength={1200}
              />
            </div>

            {/* Quick Tag Pills & Character Counter */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[75%]">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700/60 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <span className={`text-[10px] ${content.length > 1000 ? 'text-amber-400' : 'text-neutral-500'}`}>
                {content.length}/1200
              </span>
            </div>
          </div>

          {/* Prominent Spoiler Toggle Box */}
          <div
            onClick={() => setIsSpoiler(!isSpoiler)}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer select-none ${
              isSpoiler
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-750'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  isSpoiler ? 'bg-amber-500/25 text-amber-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-200 block">
                  Bu gönderi Spoiler (Sürpriz Bozan) içeriyor
                </span>
                <p className="text-[10px] text-neutral-400">
                  Diğer okurlar için akışta otomatik olarak bulanıklaştırılır.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                isSpoiler
                  ? 'bg-amber-500 border-amber-500 text-neutral-950'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              {isSpoiler && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-neutral-500">
              <CornerDownLeft className="w-3 h-3" />
              Ctrl + Enter ile gönder
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-750 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                  content.trim()
                    ? 'text-neutral-950 bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 cursor-pointer'
                    : 'text-neutral-500 bg-neutral-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {postType === 'review'
                    ? 'İncelemeyi Paylaş'
                    : postType === 'quote'
                    ? 'Alıntıyı Paylaş'
                    : 'Paylaş'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
