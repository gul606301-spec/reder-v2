import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Newspaper, ExternalLink } from 'lucide-react';
import { BookNews } from '../types';

interface NewsPostCardProps {
  news: BookNews;
  onSelectNews: (news: BookNews) => void;
}

export const NewsPostCard: React.FC<NewsPostCardProps> = ({ news, onSelectNews }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Approximate default engagement numbers for realistic editorial feel
  const baseLikes = news.id === 'news-1' ? 42 : news.id === 'news-2' ? 38 : news.id === 'news-3' ? 29 : 24;
  const baseComments = news.id === 'news-1' ? 8 : news.id === 'news-2' ? 6 : news.id === 'news-3' ? 4 : 3;

  const likeCount = baseLikes + (hasLiked ? 1 : 0);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${news.title} - ${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore clipboard error
      }
    }
  };

  return (
    <article className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 sm:p-5 transition-all shadow-sm">
      {/* İçerik Türü Etiketi */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
          HABER · EDİTÖR
        </span>
        <span className="text-[11px] text-neutral-400">
          {news.date}
        </span>
      </div>

      {/* Profil / Editör Bilgisi */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
          <Newspaper className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-white truncate">{news.source || 'Edebiyat Masası'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-medium">Editör</span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate">{news.categoryLabel}</p>
        </div>
      </div>

      {/* Haber Başlığı & Özeti */}
      <div
        onClick={() => onSelectNews(news)}
        className="cursor-pointer group space-y-1.5 mb-3"
      >
        <h3 className="text-sm sm:text-base font-bold font-serif text-white group-hover:text-amber-400 transition-colors leading-snug">
          {news.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
          {news.summary}
        </p>
      </div>

      {/* Haber Görseli */}
      {news.imageUrl && (
        <div
          onClick={() => onSelectNews(news)}
          className="w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-3.5 cursor-pointer group relative"
        >
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-sm text-[11px] font-medium text-amber-400 flex items-center gap-1 border border-neutral-800">
            <span>Haberi Oku</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Alt Aksiyonlar: Beğeni, Yorum, Paylaş */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setHasLiked(!hasLiked)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasLiked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNews(news)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{baseComments}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            title="Haberi Paylaş"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Kopyalandı!' : ''}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectNews(news)}
          className="text-xs text-neutral-400 hover:text-amber-400 font-medium transition-colors"
        >
          Devamını Oku →
        </button>
      </div>
    </article>
  );
};
