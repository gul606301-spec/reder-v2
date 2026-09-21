import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  src?: string;
  alt: string;
  title?: string;
  author?: string;
  className?: string;
  aspectRatio?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  src,
  alt,
  title,
  author,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-[2/3]',
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(!src);
    setIsLoaded(false);
  }, [src]);

  const displayTitle = title || alt || 'Kitap';
  const displayAuthor = author || '';

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full ${aspectRatio} bg-gradient-to-br from-[#132845] via-[#0e1d32] to-[#091322] border border-[#1d3557]/80 rounded-lg p-2.5 flex flex-col justify-between select-none relative overflow-hidden shadow-inner text-left`}
      >
        {/* Decorative subtle spine line on the left */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500/60 via-[#F06449]/50 to-amber-500/30" />

        {/* Top Header / Category Icon */}
        <div className="flex items-center justify-between pl-1">
          <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-400">
            <BookOpen className="w-3 h-3" />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">READER</span>
        </div>

        {/* Center Title and Author */}
        <div className="my-auto py-1.5 pl-1.5 pr-1">
          <h5 className="font-serif font-bold text-[11px] sm:text-xs text-neutral-100 leading-snug line-clamp-3">
            {displayTitle}
          </h5>
          {displayAuthor && (
            <p className="text-[9px] text-amber-400/90 font-medium truncate mt-1">
              {displayAuthor}
            </p>
          )}
        </div>

        {/* Bottom subtle detail */}
        <div className="pt-1 border-t border-neutral-800/80 flex items-center justify-between pl-1 text-[8px] text-neutral-500">
          <span className="truncate">Eser</span>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${aspectRatio} bg-neutral-850`}>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-90'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={(e) => {
          // OpenLibrary returns 1x1 blank transparent gif when a cover is missing
          if (e.currentTarget.naturalWidth <= 1 && e.currentTarget.naturalHeight <= 1) {
            setHasError(true);
          } else {
            setIsLoaded(true);
          }
        }}
      />
    </div>
  );
};
