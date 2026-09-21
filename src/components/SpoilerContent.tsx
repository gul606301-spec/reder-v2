import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle, Flag } from 'lucide-react';
import { useReader } from '../context/ReaderContext';

interface SpoilerContentProps {
  content: string;
  isSpoiler?: boolean;
  spoilerReportedCount?: number;
  postId?: string;
  className?: string;
}

export const SpoilerContent: React.FC<SpoilerContentProps> = ({
  content,
  isSpoiler = false,
  spoilerReportedCount = 0,
  postId,
  className = '',
}) => {
  const { profile, reportPostSpoiler } = useReader();
  // If user preference is to show spoilers, start revealed. Otherwise start hidden if it's a spoiler.
  const hideByDefault = profile?.hideSpoilers !== false;
  const [isRevealed, setIsRevealed] = useState(!isSpoiler || !hideByDefault);
  const [hasReported, setHasReported] = useState(false);

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (postId && !hasReported) {
      reportPostSpoiler(postId);
      setHasReported(true);
    }
  };

  if (!isSpoiler) {
    return (
      <div className={`text-neutral-200 text-sm leading-relaxed ${className}`}>
        {content}
        {postId && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleReport}
              disabled={hasReported}
              className="text-[11px] text-neutral-500 hover:text-amber-400/80 flex items-center gap-1 transition-colors"
              title="Bu içeriğin spoiler içerdiğini düşünüyorsanız bildirin"
            >
              <Flag className="w-3 h-3" />
              <span>{hasReported ? 'Spoiler bildirildi' : 'Spoiler olarak bildir'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl transition-all ${className}`}>
      {/* Warning banner */}
      <div className="flex items-center justify-between py-1.5 px-3 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Bu içerik spoiler içeriyor</span>
          {spoilerReportedCount > 0 && (
            <span className="text-[10px] text-amber-400/70 font-normal">
              ({spoilerReportedCount} okur tarafından bildirildi)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsRevealed(!isRevealed)}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded-md transition-colors"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3 h-3" />
              <span>Spoiler'ı Gizle</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>Spoiler'ı Göster</span>
            </>
          )}
        </button>
      </div>

      {/* Content with conditional blur */}
      <div className="relative">
        <div
          className={`text-neutral-200 text-sm leading-relaxed transition-all duration-300 ${
            !isRevealed
              ? 'filter blur-[7px] select-none opacity-40 pointer-events-none'
              : 'filter-none opacity-100'
          }`}
        >
          {content}
        </div>

        {/* Overlay click to view button when hidden */}
        {!isRevealed && (
          <div
            onClick={() => setIsRevealed(true)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-neutral-900/30 rounded-lg hover:bg-neutral-900/40 transition-all"
          >
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-900/90 text-amber-300 border border-amber-500/30 shadow-lg flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              İçeriği Okumak İçin Tıklayın
            </span>
          </div>
        )}
      </div>

      {/* Report footer */}
      {postId && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleReport}
            disabled={hasReported}
            className="text-[11px] text-neutral-500 hover:text-amber-400/80 flex items-center gap-1 transition-colors"
          >
            <Flag className="w-3 h-3" />
            <span>{hasReported ? 'Spoiler bildirildi ✓' : 'Spoiler olarak bildir'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
