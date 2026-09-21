import React, { useState } from 'react';
import { X, Calendar, Share2, ExternalLink, Check } from 'lucide-react';
import { BookNews } from '../types';

interface NewsDetailModalProps {
  news: BookNews | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBook?: (bookId: string) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !news) return null;

  const sourceUrl =
    news.sourceUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(`${news.title} ${news.source}`)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: news.sourceUrl || window.location.href,
        });
      } catch {
        // ignore share abort
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `"${news.title}" - ${news.source}\n${news.sourceUrl || window.location.href}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore clipboard error
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* 1. Haber Görseli & Üst Kategori + Tarih */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-neutral-800 shrink-0">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 p-2 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-xl backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider">
              {news.categoryLabel}
            </span>
            <span className="text-xs text-neutral-300 bg-neutral-900/70 px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {news.date}
            </span>
          </div>
        </div>

        {/* 2. Haber Gövdesi: Başlık, Üst Kaynak Referansı, Spot, İçerik ve Alt Kaynak Bloğu */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Haber Başlığı ve Sadeleştirilmiş Üst Kaynak Referansı */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">
              {news.title}
            </h2>
            <div className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1.5">
              <span className="text-neutral-400 font-medium">{news.source}</span>
            </div>
          </div>

          {/* Kısa Özet / Spot */}
          <div className="p-3.5 rounded-2xl bg-neutral-850 border border-neutral-800 text-amber-300/90 text-sm italic leading-relaxed">
            "{news.summary}"
          </div>

          {/* Haber İçeriği */}
          <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
            {news.content}
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 3. Belirgin Kaynak Alanı (Sayfa Sonu / Footer Öncesi) */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest text-amber-500 uppercase">
                  Kaynak
                </span>
                {news.date && (
                  <span className="text-[11px] text-neutral-400">
                    {news.date}
                  </span>
                )}
              </div>

              <div>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-white hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>{news.source}</span>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                </a>
                <p className="text-xs text-neutral-400 mt-1">
                  Bu haber <strong className="text-neutral-300 font-medium">{news.source}</strong> kaynak alınarak hazırlanmıştır.
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer group"
                >
                  <span>Orijinal Habere Git</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Footer Aksiyonları: Paylaş & Kapat */}
        <div className="p-4 border-t border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Bağlantı Kopyalandı' : 'Paylaş'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
