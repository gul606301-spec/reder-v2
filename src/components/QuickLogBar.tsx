import React, { useState } from 'react';
import { Check, Plus, BookOpen, Sparkles } from 'lucide-react';
import { useReader } from '../context/ReaderContext';

interface QuickLogBarProps {
  compact?: boolean;
}

export const QuickLogBar: React.FC<QuickLogBarProps> = ({ compact = false }) => {
  const { library, recordReading } = useReader();
  const [pages, setPages] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeBooks = library.filter((b) => b.status === 'reading');
  const targetBookId = selectedBookId || (activeBooks.length > 0 ? activeBooks[0].id : undefined);
  const targetBook = library.find((b) => b.id === targetBookId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pages, 10);
    if (isNaN(pageNum) || pageNum <= 0) return;

    recordReading(pageNum, targetBookId);
    setPages('');

    setToastMessage(`+${pageNum} sayfa kaydedildi!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={`relative bg-neutral-800/90 border border-neutral-700/70 rounded-2xl p-4 shadow-lg backdrop-blur-sm ${compact ? 'text-sm' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white text-sm">Hızlı Okuma Kaydı</span>
            <span className="text-xs text-neutral-400 block">Sayfa sayısını yaz ve tek tıkla kaydet</span>
          </div>
        </div>

        {toastMessage && (
          <div className="animate-in fade-in slide-in-from-top duration-200 text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" />
            {toastMessage}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 items-stretch">
        <div className="flex-1 flex gap-2">
          <input
            type="number"
            min="1"
            max="1500"
            inputMode="numeric"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="Okunan sayfa (ör. 15)"
            className="flex-1 bg-neutral-900/80 border border-neutral-700 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-500 transition-colors"
          />

          {activeBooks.length > 1 && (
            <select
              value={targetBookId || ''}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="bg-neutral-900/80 border border-neutral-700 text-neutral-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-500 max-w-[130px] truncate"
            >
              {activeBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={!pages || parseInt(pages, 10) <= 0}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Kaydet</span>
        </button>
      </form>

      {targetBook && (
        <div className="mt-2.5 pt-2 border-t border-neutral-700/40 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1 truncate">
            <BookOpen className="w-3 h-3 text-neutral-500 shrink-0" />
            İlerleme: <strong className="text-neutral-200 truncate">{targetBook.title}</strong>
          </span>
          <span className="text-amber-400 font-medium shrink-0 ml-2">
            {targetBook.progress} / {targetBook.pages} sf
          </span>
        </div>
      )}
    </div>
  );
};
