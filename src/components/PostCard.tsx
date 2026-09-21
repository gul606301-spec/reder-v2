import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Star,
  Send,
  AlertTriangle,
  Quote,
} from 'lucide-react';
import { Book, SocialPost } from '../types';
import { useReader } from '../context/ReaderContext';
import { SpoilerContent } from './SpoilerContent';
import { BookCover } from './BookCover';

interface PostCardProps {
  post: SocialPost;
  onSelectBook?: (book: Book) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelectBook }) => {
  const { profile, likePost, addComment } = useReader();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentSpoiler, setIsCommentSpoiler] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeUserId = profile?.id || 'guest';
  const hasLiked = post.likes.includes(activeUserId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim(), isCommentSpoiler);
    setCommentText('');
    setIsCommentSpoiler(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.userName} - Reader Hub`,
          text: post.content,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      try {
        await navigator.clipboard.writeText(`"${post.content}" - ${post.userName} (Reader Hub)`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore clipboard error
      }
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });

  const contentTypeLabel =
    post.type === 'quote'
      ? 'ALINTI'
      : post.type === 'review'
      ? 'İNCELEME'
      : post.type === 'activity'
      ? 'OKUMA AKTİVİTESİ'
      : 'DÜŞÜNCE';

  const activityText =
    post.type === 'review' && post.book
      ? `${post.book.title} hakkında inceleme yaptı`
      : post.type === 'quote' && post.book
      ? `${post.book.title} kitabından alıntı paylaştı`
      : post.type === 'activity' && post.book
      ? `${post.book.title} okuma aktivitesi`
      : post.book
      ? `${post.book.title} hakkında düşündü`
      : `@${post.userUsername}`;

  return (
    <article className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 sm:p-5 transition-all shadow-sm">
      {/* 1. İçerik Türü Etiketi & Tarih */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
          {contentTypeLabel}
        </span>
        <span className="text-[11px] text-neutral-400">
          {formattedDate}
        </span>
      </div>

      {/* 2. Profil Avatarı + Kullanıcı Adı + Aktivite Bilgisi */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
          {post.userName.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-xs text-white truncate">{post.userName}</span>
            {post.type === 'review' && post.rating && (
              <span className="text-amber-400 text-xs tracking-tighter" title={`${post.rating}/5`}>
                {'★'.repeat(post.rating)}
                <span className="text-neutral-600">{'★'.repeat(5 - post.rating)}</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 truncate">
            {activityText}
          </p>
        </div>
      </div>

      {/* 3. Ana İçerik Metni */}
      {post.type === 'quote' ? (
        <div className="mb-3.5 pl-3 border-l-2 border-amber-500/60 py-1">
          <p className="font-serif italic text-xs sm:text-sm text-neutral-200 leading-relaxed">
            “{post.content}”
          </p>
        </div>
      ) : (
        <SpoilerContent
          content={post.content}
          isSpoiler={post.isSpoiler}
          spoilerReportedCount={post.spoilerReportedCount}
          postId={post.id}
          className="mb-3.5 text-xs sm:text-sm text-neutral-300 leading-relaxed"
        />
      )}

      {/* 4. Varsa Kitap Kapağı Kartı */}
      {post.book && (
        <div
          onClick={() =>
            onSelectBook?.({
              id: post.book!.id,
              title: post.book!.title,
              author: post.book!.author,
              cover: post.book!.cover,
              pages: 300,
            })
          }
          className="mb-3.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-neutral-800">
            <BookCover
              src={post.book.cover}
              alt={post.book.title}
              title={post.book.title}
              author={post.book.author}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate font-serif">
              {post.book.title}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">{post.book.author}</p>
          </div>
        </div>
      )}

      {/* 5. Alt Aksiyonlar: Beğeni, Yorum, Paylaş */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasLiked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{post.likes.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer ${
              showComments ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            title="Gönderiyi Paylaş"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Kopyalandı' : ''}</span>
          </button>
        </div>

        <span className="text-[11px] text-neutral-500">
          {post.comments.length > 0 ? `${post.comments.length} yorum` : ''}
        </span>
      </div>

      {/* Comment Section (Collapsible) */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-neutral-200">{comment.userName}</span>
                <span className="text-[10px] text-neutral-500">
                  {new Date(comment.createdAt).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <SpoilerContent content={comment.content} isSpoiler={comment.isSpoiler} />
            </div>
          ))}

          {/* New Comment Input with Spoiler Option */}
          <form onSubmit={handleCommentSubmit} className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Gönder</span>
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isCommentSpoiler}
                onChange={(e) => setIsCommentSpoiler(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <AlertTriangle className="w-3 h-3 text-amber-500/80" />
              <span>Yorumum spoiler içeriyor</span>
            </label>
          </form>
        </div>
      )}
    </article>
  );
};
