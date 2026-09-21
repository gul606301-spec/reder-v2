import React, { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  BookOpen,
  Plus,
  Check,
  Flame,
  Award,
  HelpCircle,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Eye,
  Heart,
  X,
  Star,
  Trophy,
  Clock,
  CheckCircle2,
  Users,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book, MysteryBook, TriviaQuestion } from '../../types';
import { BookCover } from '../BookCover';
import {
  featuredBooks,
  mysteryBooks,
  triviaQuestions,
  bookOfTheMonth,
} from '../../data/catalog';
import { useReader } from '../../context/ReaderContext';
import {
  searchInVerifiedWorks,
  normalizeBookWithTurkishEdition,
  deduplicateBooks,
} from '../../utils/bookNormalization';

interface SearchTabProps {
  onSelectBook: (book: Book) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ onSelectBook }) => {
  const { library, addToLibrary, isInLibrary, updateProfile, profile } = useReader();

  // Subtabs inside Keşfet: 'search' | 'recommend' | 'monthly' | 'trivia'
  const [subTab, setSubTab] = useState<'search' | 'recommend' | 'monthly' | 'trivia'>('search');

  // 1. SEARCH STATE
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = ['Klasik', 'Roman', 'Kişisel Gelişim', 'Distopya', 'Türk Edebiyatı', 'Felsefe'];

  // Search effect with debounce & fallback
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const verifiedMatches = searchInVerifiedWorks(trimmed);
      if (verifiedMatches.length > 0) {
        setResults(verifiedMatches);
      }

      try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
          trimmed,
        )}&limit=20&fields=key,work_key,title,author_name,isbn,publisher,cover_i,number_of_pages_median,first_publish_year,first_sentence`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('Arama servisine ulaşılamadı');
        const data = await res.json();

        if (Array.isArray(data.docs)) {
          const mapped: Book[] = data.docs.map((doc: any, index: number) => {
            const coverId = doc.cover_i;
            const isbns: string[] = Array.isArray(doc.isbn) ? doc.isbn : doc.isbn ? [doc.isbn] : [];
            const primaryIsbn = isbns[0];
            const cover = coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg?default=false`
              : primaryIsbn
              ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(primaryIsbn)}-M.jpg?default=false`
              : undefined;

            const rawCandidate: Partial<Book> & { isbns?: string[] } = {
              id: doc.work_key || doc.key || `ol-book-${index}`,
              title: doc.title || 'İsimsiz Eser',
              author: Array.isArray(doc.author_name) ? doc.author_name[0] : 'Bilinmeyen Yazar',
              cover,
              pages: doc.number_of_pages_median || 220,
              year: doc.first_publish_year || undefined,
              publisher: Array.isArray(doc.publisher) ? doc.publisher[0] : doc.publisher,
              isbn: primaryIsbn,
              isbns,
              description: Array.isArray(doc.first_sentence)
                ? doc.first_sentence[0]
                : doc.first_sentence || undefined,
            };

            return normalizeBookWithTurkishEdition(rawCandidate);
          });

          const combined = [...verifiedMatches, ...mapped];
          const deduplicated = deduplicateBooks(combined);
          setResults(deduplicated);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Local fallback from verified registry and featured books
          const q = trimmed.toLowerCase();
          const localMatches = featuredBooks.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.author.toLowerCase().includes(q) ||
              (b.originalTitle && b.originalTitle.toLowerCase().includes(q)),
          );
          const combined = [...verifiedMatches, ...localMatches];
          setResults(deduplicateBooks(combined));
        }
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // 2. MYSTERY CARD / TINDER SWIPE STATE (Roadmap: Kitap Öner)
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const currentMystery = mysteryBooks[cardIndex % mysteryBooks.length];

  const handleNextCard = () => {
    setHistory((prev) => [...prev, cardIndex]);
    setIsRevealed(false);
    setCardIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCardIndex(lastIndex);
    setIsRevealed(false);
  };

  // 3. TRIVIA GAME STATE (Roadmap: Kitap Bilgi Oyunu)
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentQuestion = triviaQuestions[triviaIndex];

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((s) => s + 10);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch (_) {}
    }
  };

  const handleNextQuestion = () => {
    if (triviaIndex < triviaQuestions.length - 1) {
      setTriviaIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setGameFinished(true);
      if (profile) {
        updateProfile({ xp: (profile.xp || 0) + score });
      }
    }
  };

  const handleRestartTrivia = () => {
    setTriviaIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 animate-in fade-in duration-300">
      {/* Keşfet Navigation Tabs */}
      <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto max-w-full">
        {[
          { id: 'search', label: 'Kitap Arama', icon: Search },
          { id: 'recommend', label: 'Kitap Öner (Gizemli Kartlar)', icon: Sparkles },
          { id: 'monthly', label: 'Ayın Kitabı', icon: Award },
          { id: 'trivia', label: 'Kitap Bilgi Oyunu', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                subTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. KITAP ARAMA (SEARCH SECTION) */}
      {subTab === 'search' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-2xl font-bold font-serif text-white">Kitap & Yazar Keşfet</h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Milyonlarca kitap arasından aradığın eseri bul ve kitaplığına tek tıkla ekle.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kitap adı, yazar veya ISBN arayın..."
              className="w-full bg-neutral-850 border border-neutral-750 focus:border-amber-500 rounded-2xl pl-12 pr-10 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors shadow-inner"
            />
            {isLoading && (
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin absolute right-4 top-3.5" />
            )}
          </div>

          {/* Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mr-1 shrink-0">
              Kategoriler:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(selectedTag === tag ? null : tag);
                  setQuery(selectedTag === tag ? '' : tag);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-400">
                Arama Sonuçları ({results.length} kitap bulundu)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((book) => {
                  const inLib = isInLibrary(book.id);
                  return (
                    <div
                      key={book.id}
                      className="group bg-neutral-850 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 flex flex-col justify-between transition-all"
                    >
                      <div
                        onClick={() => onSelectBook(book)}
                        className="cursor-pointer"
                      >
                        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 mb-2.5 border border-neutral-750 shadow-md">
                          <BookCover
                            src={book.cover}
                            alt={book.title}
                            title={book.title}
                            author={book.author}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate">{book.author}</p>
                      </div>

                      <button
                        onClick={() => addToLibrary(book, 'want')}
                        className={`mt-2.5 w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          inLib
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700'
                        }`}
                      >
                        {inLib ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Kitaplığında</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Listeye Ekle</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Default Popular Books if query empty */}
          {!query.trim() && (
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold font-serif text-white">Öne Çıkan Popüler Eserler</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {featuredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="group bg-neutral-850 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 mb-2 border border-neutral-750 shadow-md">
                      <BookCover
                        src={book.cover}
                        alt={book.title}
                        title={book.title}
                        author={book.author}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. KITAP ÖNER - GİZEMLİ KARTLAR (Roadmap: Tinder Swipe Feature) */}
      {subTab === 'recommend' && (
        <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              GİZEMLİ KİTAP KEŞFİ
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-0.5">Kitap Öner</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Kapağa ve isme önyargısız yaklaş! Sadece konusunu oku; merak edersen kartı çevirip eseri gör.
            </p>
          </div>

          {/* The Mystery Card */}
          <div className="bg-neutral-850 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative min-h-[380px] flex flex-col justify-between">
            {/* Category tag & Rewind */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {currentMystery.category}
              </span>

              {history.length > 0 && (
                <button
                  onClick={handleRewind}
                  className="text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Geri Al</span>
                </button>
              )}
            </div>

            {/* UNREVEALED STATE: Only Summary is shown! */}
            {!isRevealed ? (
              <div className="flex-1 flex flex-col justify-center space-y-4 py-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                    Bu Kitabın Konusu
                  </span>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-serif italic px-2">
                    "{currentMystery.summary}"
                  </p>
                </div>
              </div>
            ) : (
              /* REVEALED STATE: Cover, Title, Author & Rating are shown! */
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-2 text-center animate-in zoom-in-95 duration-200">
                <div className="w-24 h-36 rounded-xl shadow-xl border border-neutral-700 overflow-hidden">
                  <BookCover
                    src={currentMystery.book.cover}
                    alt={currentMystery.book.title}
                    title={currentMystery.book.title}
                    author={currentMystery.book.author}
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {currentMystery.book.title}
                  </h3>
                  <p className="text-xs text-neutral-400">{currentMystery.book.author}</p>
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{currentMystery.book.ratingSource || '4.8 / 5 Puan'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="pt-4 border-t border-neutral-800 space-y-2.5">
              {!isRevealed ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleNextCard}
                    className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <X className="w-4 h-4 text-rose-400" />
                    <span>İlgimi Çekmedi</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRevealed(true);
                      try {
                        confetti({ particleCount: 30, spread: 50 });
                      } catch (_) {}
                    }}
                    className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Merak Ettim!</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        addToLibrary(currentMystery.book, 'want');
                        handleNextCard();
                      }}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Okuyacaklarıma Ekle</span>
                    </button>

                    <button
                      onClick={() => {
                        addToLibrary(currentMystery.book, 'finished');
                        handleNextCard();
                      }}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Bunu Okudum</span>
                    </button>
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="w-full py-2 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    Sıradaki Öneriye Geç →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AYIN KİTABI (Roadmap: Book of the Month) */}
      {subTab === 'monthly' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" />
              READER KULÜBÜ
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1">
              Ayın Kitabı ({bookOfTheMonth.month})
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Toplulukla eş zamanlı oku, tartışmalara katıl ve okuma rozeti kazan.
            </p>
          </div>

          <div className="bg-neutral-850 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
              <div className="w-36 sm:w-44 aspect-[2/3] rounded-2xl shadow-xl border border-neutral-700 shrink-0 overflow-hidden">
                <BookCover
                  src={bookOfTheMonth.cover}
                  alt={bookOfTheMonth.title}
                  title={bookOfTheMonth.title}
                  author={bookOfTheMonth.author}
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {bookOfTheMonth.category}
                </span>
                <h3 className="font-serif font-bold text-2xl text-white">
                  {bookOfTheMonth.title}
                </h3>
                <p className="text-sm text-neutral-400">{bookOfTheMonth.author}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-300 pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {bookOfTheMonth.rating} Puan
                  </span>
                  <span className="flex items-center gap-1 text-sky-400 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {bookOfTheMonth.readersCount} kişi şu an okuyor
                  </span>
                  <span>{bookOfTheMonth.pages} sayfa</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed pt-2">
                  {bookOfTheMonth.description}
                </p>
              </div>
            </div>

            {/* Discussion topic */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Bu Ayın Tartışma Konusu
              </span>
              <p className="text-xs text-neutral-200 italic font-serif">
                "{bookOfTheMonth.discussionTopic}"
              </p>
            </div>

            {/* Join Read-Along Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-400">
                {isInLibrary(bookOfTheMonth.id)
                  ? '✓ Bu kitabı kitaplığına ekledin'
                  : 'Kitaplığına "Okuyorum" olarak ekle'}
              </span>

              <button
                onClick={() => {
                  addToLibrary(
                    {
                      id: bookOfTheMonth.id,
                      title: bookOfTheMonth.title,
                      author: bookOfTheMonth.author,
                      cover: bookOfTheMonth.cover,
                      pages: bookOfTheMonth.pages,
                      category: bookOfTheMonth.category,
                      description: bookOfTheMonth.description,
                    },
                    'reading',
                  );
                }}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  isInLibrary(bookOfTheMonth.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                {isInLibrary(bookOfTheMonth.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Okuma Kulübüne Katıldın</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Okumaya Katıl</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. KITAP BILGI OYUNU (Roadmap: Trivia Quiz Game) */}
      {subTab === 'trivia' && (
        <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4" />
              EDEBİYAT BİLGİ YARIŞMASI
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1">Kitap Bilgi Oyunu</h2>
            <p className="text-xs text-neutral-400 mt-1">
              5 soruyu cevapla, edebi bilgini test et ve Reader XP puanı kazan!
            </p>
          </div>

          {!gameFinished ? (
            <div className="bg-neutral-850 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              {/* Progress & Score */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">
                  Soru <strong className="text-white">{triviaIndex + 1}</strong> / {triviaQuestions.length}
                </span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {score} XP Puan
                </span>
              </div>

              {/* Question */}
              <div>
                <p className="text-[11px] text-amber-400/80 uppercase font-semibold mb-1.5">
                  İpucu: {currentQuestion.clue}
                </p>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let btnStyle = 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700';
                  if (isSelected && !isSubmitted) {
                    btnStyle = 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold';
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submit */}
              {isSubmitted && (
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                  <span className="font-bold text-amber-400 block mb-0.5">Açıklama:</span>
                  {currentQuestion.explanation}
                </div>
              )}

              {/* Submit / Next Button */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
                  >
                    Cevabı Onayla
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-neutral-800 hover:bg-neutral-750 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{triviaIndex < triviaQuestions.length - 1 ? 'Sıradaki Soru' : 'Sonucu Gör'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* FINISHED STATE */
            <div className="bg-neutral-850 border border-neutral-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white">Yarışma Tamamlandı!</h3>
              <p className="text-sm text-neutral-300">
                Tebrikler! <strong className="text-amber-400">+{score} XP</strong> puan kazandın ve profiline eklendi.
              </p>
              <button
                onClick={handleRestartTrivia}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-all"
              >
                Tekrar Oyna
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
