import React, { useState, useMemo } from 'react';
import {
  Plus,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { Book, BookNews, SocialPost } from '../../types';
import { bookNewsList } from '../../data/catalog';
import { useReader } from '../../context/ReaderContext';
import { PostCard } from '../PostCard';
import { NewsPostCard } from '../NewsPostCard';
import { CreatePostModal } from '../CreatePostModal';

interface HomeTabProps {
  onSelectBook: (book: Book) => void;
  onSelectNews: (news: BookNews) => void;
  onNavigateToLibrary?: () => void;
  onOpenGoalModal?: () => void;
}

type FeedFilter = 'all' | 'thoughts' | 'reviews' | 'quotes' | 'news';

export const HomeTab: React.FC<HomeTabProps> = ({
  onSelectBook,
  onSelectNews,
}) => {
  const { profile, posts } = useReader();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postInitialType, setPostInitialType] = useState<'general' | 'review' | 'quote'>('general');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Capitalized first name for greeting: e.g. "GÜL"
  const userGreetingName = profile?.name ? profile.name.trim().split(' ')[0].toUpperCase() : '';
  const userAvatarInitial = profile?.name ? profile.name.slice(0, 1).toUpperCase() : 'R';

  // Merge real user posts and editorial news into a single unified stream
  const unifiedFeed = useMemo(() => {
    // Map existing literature news with realistic chronological timestamps
    const newsFeedItems = bookNewsList.map((news, index) => {
      // Realistic descending time offsets (news 1 is newest, etc.)
      const baseTime = Date.now() - (index + 1) * 3600 * 1000 * 14;
      return {
        id: `news_${news.id}`,
        kind: 'news' as const,
        timestamp: baseTime,
        news,
      };
    });

    // Map social posts
    const postFeedItems = posts.map((post) => {
      const parsedTime = post.createdAt ? new Date(post.createdAt).getTime() : Date.now();
      return {
        id: `post_${post.id}`,
        kind: 'post' as const,
        timestamp: isNaN(parsedTime) ? Date.now() : parsedTime,
        post,
      };
    });

    // Combine and sort descending (newest content first)
    const combined = [...postFeedItems, ...newsFeedItems].sort((a, b) => b.timestamp - a.timestamp);

    // Filter by active feed filter
    return combined.filter((item) => {
      if (feedFilter === 'all') return true;
      if (feedFilter === 'news') return item.kind === 'news';
      if (feedFilter === 'thoughts') return item.kind === 'post' && (item.post?.type === 'general' || !item.post?.type);
      if (feedFilter === 'reviews') return item.kind === 'post' && item.post?.type === 'review';
      if (feedFilter === 'quotes') return item.kind === 'post' && item.post?.type === 'quote';
      return true;
    });
  }, [posts, feedFilter]);

  const filterLabels: Record<FeedFilter, string> = {
    all: 'Tüm Akış',
    thoughts: 'Düşünceler',
    reviews: 'İncelemeler',
    quotes: 'Alıntılar',
    news: 'Haberler',
  };

  return (
    <div className="space-y-4 pb-24 md:pb-12 animate-in fade-in duration-200 max-w-xl mx-auto">
      {/* 1. Ana Karşılama Başlığı (Kompakt, düşük yükseklik) */}
      <div className="pt-0.5">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
          Bugün Okuma Dünyanda Neler Var{userGreetingName ? `, ${userGreetingName}` : ''}?
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
          Kitaplar, okurlar ve edebiyat gündemi tek akışta.
        </p>
      </div>

      {/* 2. Kompakt Tek Satırlık Paylaşım Alanı (56px) */}
      <div
        onClick={() => {
          setPostInitialType('general');
          setIsCreatePostOpen(true);
        }}
        className="h-14 bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-750 rounded-2xl px-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            {userAvatarInitial}
          </div>
          <span className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-300 truncate select-none">
            Bir düşünceni paylaş...
          </span>
        </div>

        <div className="w-8 h-8 rounded-xl bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-all shrink-0">
          <Plus className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Akış Başlığı ve Küçük Ayar/Filtre İkonu (⚙) */}
      <div className="flex items-center justify-between pt-1 pb-0.5">
        <h2 className="text-base sm:text-lg font-bold font-serif text-white tracking-tight">
          Akış
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`p-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs ${
              feedFilter !== 'all'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Akış Filtresi"
            aria-label="Akış Filtresi"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {feedFilter !== 'all' && (
              <span className="text-[10px] font-bold text-amber-400">
                {filterLabels[feedFilter]}
              </span>
            )}
          </button>

          {isFilterMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsFilterMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-neutral-900 border border-neutral-800 rounded-2xl p-1.5 shadow-xl z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Akış Türü
                </div>
                {[
                  { id: 'all', label: 'Tüm Akış' },
                  { id: 'thoughts', label: 'Düşünceler' },
                  { id: 'reviews', label: 'İncelemeler' },
                  { id: 'quotes', label: 'Alıntılar' },
                  { id: 'news', label: 'Edebiyat Haberleri' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFeedFilter(item.id as FeedFilter);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      feedFilter === item.id
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {feedFilter === item.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Tek ve Birleşik İçerik Akışı (Düşünce, İnceleme, Alıntı, Haber · Editör) */}
      <div className="space-y-3.5 sm:space-y-4">
        {unifiedFeed.length === 0 ? (
          <div className="text-center py-12 bg-neutral-850 rounded-2xl border border-neutral-800 text-neutral-400 text-xs sm:text-sm p-6 space-y-2">
            <p>Bu filtrede henüz bir içerik bulunmuyor.</p>
            {feedFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setFeedFilter('all')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Tüm Akışı Göster
              </button>
            )}
          </div>
        ) : (
          unifiedFeed.map((item) => {
            if (item.kind === 'news' && item.news) {
              return (
                <NewsPostCard
                  key={item.id}
                  news={item.news}
                  onSelectNews={onSelectNews}
                />
              );
            }
            if (item.kind === 'post' && item.post) {
              return (
                <PostCard
                  key={item.id}
                  post={item.post}
                  onSelectBook={onSelectBook}
                />
              );
            }
            return null;
          })
        )}
      </div>

      {/* Paylaşım Bottom Sheet / Modal (Düşünce, İnceleme, Alıntı, Kitap) */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        initialType={postInitialType}
      />
    </div>
  );
};
