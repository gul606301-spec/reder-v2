import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Bookmark,
  Flame,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Columns3,
  Star,
  Clock,
  XCircle,
  ArrowUpDown,
  Heart,
} from 'lucide-react';
import { Book, LibraryBook, LibraryViewMode, ReadingStatus } from '../../types';
import { useReader } from '../../context/ReaderContext';
import { statusLabel } from '../../data/catalog';
import { BookCover } from '../BookCover';

interface LibraryTabProps {
  onSelectBook: (book: Book) => void;
  onNavigateToSearch: () => void;
}

type SortOption = 'recent' | 'oldest' | 'title' | 'author' | 'rating';

export const LibraryTab: React.FC<LibraryTabProps> = ({ onSelectBook, onNavigateToSearch }) => {
  const { library } = useReader();
  const [filter, setFilter] = useState<'all' | ReadingStatus>('all');
  const [viewMode, setViewMode] = useState<LibraryViewMode>('shelf');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [activeShelfPage, setActiveShelfPage] = useState(0);

  const filteredBooks = useMemo(() => {
    const list = library.filter((b) => {
      const matchesFilter = filter === 'all' ? true : b.status === filter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.publisher && b.publisher.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.addedAt || 0).getTime() - new Date(b.addedAt || 0).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'tr');
      }
      if (sortBy === 'author') {
        return a.author.localeCompare(b.author, 'tr');
      }
      if (sortBy === 'rating') {
        return (b.userRating || b.rating || 0) - (a.userRating || a.rating || 0);
      }
      return 0;
    });
  }, [library, filter, searchQuery, sortBy]);

  // Bookshelf geometry
  const SHELF_CAPACITY = 12; // 3 rows x 4 books per shelf page
  const shelfPages = useMemo(() => {
    const pages: LibraryBook[][] = [];
    for (let i = 0; i < filteredBooks.length; i += SHELF_CAPACITY) {
      pages.push(filteredBooks.slice(i, i + SHELF_CAPACITY));
    }
    return pages.length > 0 ? pages : [[]];
  }, [filteredBooks]);

  const currentShelfBooks = shelfPages[activeShelfPage] || [];
  const shelves = [
    currentShelfBooks.slice(0, 4),
    currentShelfBooks.slice(4, 8),
    currentShelfBooks.slice(8, 12),
  ];

  const totalFinished = library.filter((b) => b.status === 'finished').length;
  const totalReading = library.filter((b) => b.status === 'reading').length;
  const totalWant = library.filter((b) => b.status === 'want').length;
  const totalDropped = library.filter((b) => b.status === 'dropped').length;
  const totalPagesRead = library.reduce((sum, b) => sum + (b.progress || 0), 0);

  return (
    <div className="space-y-6 pb-20 md:pb-12 animate-in fade-in duration-300">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            KİŞİSEL KİTAPLIK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-0.5">
            Kitap Rafım ({library.length})
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Eklediğin kitapları ahşap raf, ızgara veya liste görünümünde yönet.
          </p>
        </div>

        <button
          onClick={onNavigateToSearch}
          className="self-start sm:self-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kitap Ekle</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-neutral-400 font-medium block">Okunan Sayfa</span>
          <span className="text-lg font-bold text-amber-400">{totalPagesRead}</span>
        </div>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-neutral-400 font-medium block">Şu An Okunan</span>
          <span className="text-lg font-bold text-sky-400">{totalReading}</span>
        </div>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-neutral-400 font-medium block">Tamamlanan</span>
          <span className="text-lg font-bold text-emerald-400">{totalFinished}</span>
        </div>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-neutral-400 font-medium block">Yarım Bırakılan</span>
          <span className="text-lg font-bold text-rose-400/90">{totalDropped}</span>
        </div>
      </div>

      {/* Controls Bar: Filters & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-800 pb-3.5">
        {/* Status Filter Tabs (Roadmap: Tümü, Okuyorum, Okuyacağım, Okudum, Yarım Bıraktım) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: `Tümü (${library.length})` },
            { id: 'reading', label: `Okuyorum (${totalReading})` },
            { id: 'want', label: `Okuyacağım (${totalWant})` },
            { id: 'finished', label: `Okudum (${totalFinished})` },
            { id: 'dropped', label: `Yarım Bıraktım (${totalDropped})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as any);
                setActiveShelfPage(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kitaplığında ara..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Sort Selector (Roadmap: Son Eklenen, İlk Eklenen, Kitap Adı, Yazar Adı, Puan) */}
          <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-xl border border-neutral-800">
            <ArrowUpDown className="w-3 h-3 text-neutral-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-neutral-300 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="recent" className="bg-neutral-900">Son Eklenen</option>
              <option value="oldest" className="bg-neutral-900">İlk Eklenen</option>
              <option value="title" className="bg-neutral-900">Kitap Adı (A-Z)</option>
              <option value="author" className="bg-neutral-900">Yazar Adı (A-Z)</option>
              <option value="rating" className="bg-neutral-900">Puana Göre</option>
            </select>
          </div>

          {/* View Modes (Roadmap: Raf Görünümü, Grid, Liste) */}
          <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('shelf')}
              title="Ahşap Raf Görünümü"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'shelf'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Izgara (Grid) Görünümü"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Liste Görünümü"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-16 px-4 bg-neutral-850 border border-neutral-800 rounded-3xl">
          <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Bu filtrede kitap bulunamadı</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-5">
            Kitap arama ekranından yeni eserler ekleyebilir veya okuma durumunu güncelleyebilirsin.
          </p>
          <button
            onClick={onNavigateToSearch}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors"
          >
            Kitap Ara ve Ekle
          </button>
        </div>
      )}

      {/* 1. WOODEN BOOKSHELF VIEW (Ahşap Raf Görünümü) */}
      {viewMode === 'shelf' && filteredBooks.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-2 border-amber-950/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Shelf rows */}
            <div className="space-y-8">
              {shelves.map((shelfBooks, shelfIndex) => (
                <div key={shelfIndex} className="relative">
                  {/* Books on the shelf */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2 min-h-[160px] items-end pb-1">
                    {shelfBooks.map((book) => {
                      const percent =
                        book.pages > 0 ? Math.min(100, Math.round(((book.progress || 0) / book.pages) * 100)) : 0;

                      return (
                        <div
                          key={book.id}
                          onClick={() => onSelectBook(book)}
                          className="group cursor-pointer flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-200"
                        >
                          <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden shadow-xl bg-neutral-800 border border-neutral-700/80 group-hover:border-amber-500/80 transition-all">
                            <BookCover
                              src={book.cover}
                              alt={book.title}
                              title={book.title}
                              author={book.author}
                              className="w-full h-full object-cover"
                            />

                            {/* Status badge */}
                            <span
                              className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                book.status === 'finished'
                                  ? 'bg-emerald-500 text-neutral-950'
                                  : book.status === 'reading'
                                  ? 'bg-amber-500 text-neutral-950'
                                  : book.status === 'dropped'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-neutral-800/90 text-neutral-300'
                              }`}
                            >
                              {book.status === 'finished'
                                ? 'Bitti'
                                : book.status === 'reading'
                                ? `%${percent}`
                                : book.status === 'dropped'
                                ? 'Yarım'
                                : 'İstiyorum'}
                            </span>
                          </div>

                          <span className="font-serif font-bold text-xs text-white mt-1.5 group-hover:text-amber-400 transition-colors line-clamp-1 max-w-[110px]">
                            {book.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 line-clamp-1 max-w-[110px]">
                            {book.author}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real Wooden Shelf Plank styling */}
                  <div className="h-4 w-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-sm shadow-md border-t border-amber-600/30 flex items-center justify-between px-3">
                    <div className="w-2 h-1 bg-amber-950/60 rounded-full" />
                    <div className="w-2 h-1 bg-amber-950/60 rounded-full" />
                  </div>
                  {/* Plank shadow */}
                  <div className="h-2 w-full bg-black/40 blur-[2px]" />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination for shelves if multiple pages */}
          {shelfPages.length > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                disabled={activeShelfPage === 0}
                onClick={() => setActiveShelfPage((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-400">
                Raf {activeShelfPage + 1} / {shelfPages.length}
              </span>
              <button
                disabled={activeShelfPage === shelfPages.length - 1}
                onClick={() => setActiveShelfPage((prev) => Math.min(shelfPages.length - 1, prev + 1))}
                className="p-2 rounded-xl bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. GRID VIEW (Izgara Görünümü) */}
      {viewMode === 'grid' && filteredBooks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBooks.map((book) => {
            const percent =
              book.pages > 0 ? Math.min(100, Math.round(((book.progress || 0) / book.pages) * 100)) : 0;

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group bg-neutral-850 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 mb-2 border border-neutral-750 shadow-md">
                  <BookCover
                    src={book.cover}
                    alt={book.title}
                    title={book.title}
                    author={book.author}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />

                  <span
                    className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                      book.status === 'finished'
                        ? 'bg-emerald-500 text-neutral-950'
                        : book.status === 'reading'
                        ? 'bg-amber-500 text-neutral-950'
                        : book.status === 'dropped'
                        ? 'bg-rose-500 text-white'
                        : 'bg-neutral-800/90 text-neutral-300'
                    }`}
                  >
                    {statusLabel(book.status)}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{book.author}</p>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>{book.progress || 0} / {book.pages} sf</span>
                    <span className="font-semibold text-amber-400">%{percent}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. COMPACT LIST VIEW (Liste Görünümü) */}
      {viewMode === 'list' && filteredBooks.length > 0 && (
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl divide-y divide-neutral-800 overflow-hidden">
          {filteredBooks.map((book) => {
            const percent =
              book.pages > 0 ? Math.min(100, Math.round(((book.progress || 0) / book.pages) * 100)) : 0;

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="p-3.5 sm:p-4 hover:bg-neutral-800/60 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                    <BookCover
                      src={book.cover}
                      alt={book.title}
                      title={book.title}
                      author={book.author}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                        {book.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          book.status === 'finished'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : book.status === 'reading'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : book.status === 'dropped'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {statusLabel(book.status)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">{book.author}</p>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                      <span>{book.pages} sayfa</span>
                      {book.userRating && (
                        <span className="text-amber-400 font-medium flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {book.userRating} / 5
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white">%{percent}</div>
                    <div className="text-[10px] text-neutral-400">{book.progress || 0} sf okundu</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
