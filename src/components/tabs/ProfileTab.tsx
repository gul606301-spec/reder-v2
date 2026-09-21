import React, { useState } from 'react';
import {
  User,
  Flame,
  BookOpen,
  Target,
  Bell,
  Edit3,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award,
  Phone,
  Mail,
  ShieldCheck,
  RotateCcw,
  EyeOff,
  Eye,
  Users,
  Trophy,
  Heart,
  Plus,
  Trash2,
  FolderPlus,
  History,
  X,
} from 'lucide-react';
import { Book, LibraryBook } from '../../types';
import { useReader } from '../../context/ReaderContext';
import { formatMinutes } from '../../data/catalog';
import { BookCover } from '../BookCover';
import { QuickLogBar } from '../QuickLogBar';

interface ProfileTabProps {
  onSelectBook: (book: Book) => void;
  onOpenGoalModal: () => void;
  onOpenAccountModal: () => void;
  onNavigateToSearch: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  onSelectBook,
  onOpenGoalModal,
  onOpenAccountModal,
  onNavigateToSearch,
}) => {
  const {
    profile,
    library,
    readingLogs,
    updateProfile,
    signOut,
    resetDemo,
    customLists,
    createCustomList,
    deleteCustomList,
  } = useReader();

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  if (!profile) {
    return (
      <div className="space-y-6 pb-20 md:pb-12 animate-in fade-in duration-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            KİŞİSEL MERKEZ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-0.5">
            Okur Profili
          </h1>
        </div>

        <div className="text-center py-16 px-4 bg-neutral-850 rounded-2xl border border-neutral-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-serif text-white">Hesabınıza Giriş Yapın</h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Okuma hedeflerinizi takip etmek, kitaplığınızı yönetmek ve notlarınızı kaydetmek için giriş yapın veya yeni bir hesap oluşturun.
            </p>
          </div>
          <button
            onClick={onOpenAccountModal}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Giriş Yap / Hesap Oluştur
          </button>
        </div>
      </div>
    );
  }

  const finishedBooks = library.filter((b) => b.status === 'finished').length;
  const activeBooks = library.filter((b) => b.status === 'reading');
  const totalPages = library.reduce((sum, b) => sum + (b.progress || 0), 0);
  const totalMinutes = library.reduce((sum, b) => sum + (b.minutes || 0), 0);

  // Month stats calculation
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const thisMonthLogs = readingLogs.filter((log) => log.date.startsWith(currentMonthKey));
  const monthPages = thisMonthLogs.reduce((sum, log) => sum + log.pages, 0);
  const monthBooksCount = new Set(thisMonthLogs.map((log) => log.bookId).filter(Boolean)).size;

  const todayPages = profile.todayPages || 0;
  const dailyGoal = profile.dailyGoal || 20;
  const yearlyGoal = profile.yearlyGoal || 24;
  const yearlyPercent = Math.min(100, Math.round((finishedBooks / Math.max(yearlyGoal, 1)) * 100));

  const favoriteBooks = library.filter((b) => b.favorite);
  const recentLogs = [...readingLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const handleCreateListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createCustomList(newListName, newListDesc);
    setNewListName('');
    setNewListDesc('');
    setIsCreatingList(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 animate-in fade-in duration-300">
      {/* Profile Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            KİŞİSEL MERKEZ
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-0.5">
            Okur Profili
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAccountModal}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Profili Düzenle</span>
          </button>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900 border border-neutral-750 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950 font-serif font-black text-3xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h2 className="text-xl font-bold text-white truncate">{profile.name}</h2>
              <span className="text-xs text-amber-400/90 font-mono">
                @{profile.username || 'reader'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  {profile.phone}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-xs text-neutral-300 mt-2.5 italic bg-neutral-900/60 px-3 py-2 rounded-xl border border-neutral-750/60 max-w-xl text-left">
                "{profile.bio}"
              </p>
            )}

            {/* XP & Gamification Level */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 pt-3 border-t border-neutral-750/70 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {profile.xp || 120} XP • Seviye 3 Edebiyat Meraklısı
              </span>
              <span className="text-neutral-400">
                {profile.streak > 0 ? `🔥 ${profile.streak} gün seri` : 'Yeni Başlangıç'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yıllık & Günlük Okuma Hedefleri (Roadmap Requirement) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-serif text-white">Okuma Hedefleri</h2>
          <button
            onClick={onOpenGoalModal}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            Hedefleri Güncelle →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Günlük Hedef Kartı */}
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Günlük Okuma Hedefi</span>
                  <span className="text-sm font-bold text-white">{dailyGoal} Sayfa</span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400">
                %{Math.min(100, Math.round((todayPages / Math.max(dailyGoal, 1)) * 100))}
              </span>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((todayPages / Math.max(dailyGoal, 1)) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Bugün okunan: {todayPages} sf</span>
              <span>Kalan: {Math.max(0, dailyGoal - todayPages)} sf</span>
            </div>
          </div>

          {/* Yıllık Hedef Kartı */}
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">2026 Yıllık Hedef</span>
                  <span className="text-sm font-bold text-white">{yearlyGoal} Kitap</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">%{yearlyPercent}</span>
            </div>

            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${yearlyPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Okunan: {finishedBooks} kitap</span>
              <span>Hedef: {yearlyGoal} kitap</span>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Kitaplarım Özeti (Faz 1) */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold font-serif text-white">Kitaplarım Özeti</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3.5 text-center">
            <span className="text-xs text-sky-400 font-semibold block">Okuyorum</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {library.filter((b) => b.status === 'reading').length}
            </span>
            <span className="text-[10px] text-neutral-400">aktif kitap</span>
          </div>
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3.5 text-center">
            <span className="text-xs text-amber-400 font-semibold block">Okuyacağım</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {library.filter((b) => b.status === 'want').length}
            </span>
            <span className="text-[10px] text-neutral-400">istek listesinde</span>
          </div>
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3.5 text-center">
            <span className="text-xs text-emerald-400 font-semibold block">Okudum</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {library.filter((b) => b.status === 'finished').length}
            </span>
            <span className="text-[10px] text-neutral-400">tamamlandı</span>
          </div>
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-3.5 text-center">
            <span className="text-xs text-rose-400 font-semibold block">Yarım Bıraktım</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {library.filter((b) => b.status === 'dropped').length}
            </span>
            <span className="text-[10px] text-neutral-400">beklemede</span>
          </div>
        </div>
      </section>

      {/* 18. Favori Kitaplar / Öne Çıkanlar (Faz 1) */}
      {favoriteBooks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Favori Kitaplarım ({favoriteBooks.length})
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favoriteBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="w-24 shrink-0 cursor-pointer group"
              >
                <div className="w-24 h-36 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/60 shadow-md group-hover:scale-105 transition-transform">
                  <BookCover
                    src={book.cover}
                    alt={book.title}
                    title={book.title}
                    author={book.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-semibold text-white mt-1.5 truncate group-hover:text-amber-400 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[10px] text-neutral-400 truncate">{book.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 16-17. Kişisel Kitap Listelerim & Liste Oluşturma (Faz 1) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-amber-400" />
            Kişisel Kitap Listelerim
          </h2>
          <button
            onClick={() => setIsCreatingList(!isCreatingList)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {isCreatingList ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isCreatingList ? 'Vazgeç' : 'Yeni Liste Oluştur'}</span>
          </button>
        </div>

        {isCreatingList && (
          <form
            onSubmit={handleCreateListSubmit}
            className="bg-neutral-850 border border-amber-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in"
          >
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Yeni Okuma Listesi
            </h3>
            <div>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Liste adı (Örn: 2026 Yaz Okumaları, Başucu Eserleri)"
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                placeholder="Açıklama (opsiyonel)"
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingList(false)}
                className="px-3 py-1.5 bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs"
              >
                Listeyi Kaydet
              </button>
            </div>
          </form>
        )}

        {customLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customLists.map((list) => {
              const listBooks = library.filter((b) => list.bookIds.includes(b.id));
              return (
                <div
                  key={list.id}
                  className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{list.name}</h4>
                      {list.description && (
                        <p className="text-xs text-neutral-400 mt-0.5">{list.description}</p>
                      )}
                      <span className="text-[11px] text-amber-400/90 font-medium block mt-1">
                        {list.bookIds.length} kitap
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCustomList(list.id)}
                      title="Listeyi sil"
                      className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {listBooks.length > 0 && (
                    <div className="flex gap-2 mt-3 pt-2.5 border-t border-neutral-800 overflow-x-auto">
                      {listBooks.slice(0, 4).map((b) => (
                        <div
                          key={b.id}
                          onClick={() => onSelectBook(b)}
                          className="w-10 h-14 rounded-lg overflow-hidden bg-neutral-800 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                          title={b.title}
                        >
                          <BookCover
                            src={b.cover}
                            alt={b.title}
                            title={b.title}
                            author={b.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : !isCreatingList ? (
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 text-center">
            <p className="text-xs text-neutral-400">
              Henüz özel okuma listesi oluşturmadınız. Tema ve hedeflerinize göre özel listeler
              oluşturabilirsiniz.
            </p>
          </div>
        ) : null}
      </section>

      {/* 19. Son Okuma Aktiviteleri (Faz 1) */}
      {recentLogs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Son Okuma Aktiviteleri
            </h2>
          </div>
          <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-800">
            {recentLogs.map((log) => {
              const book = log.bookId ? library.find((b) => b.id === log.bookId) : null;
              return (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                      📖
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        {book ? book.title : 'Okuma Kaydı'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {log.date} • {log.minutes > 0 ? `${log.minutes} dk` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+{log.pages} sayfa</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SPOILER GÖRÜNÜRLÜK AYARI (Faz 2 Spoiler İyileştirmesi) */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold font-serif text-white">
          Gizlilik & Spoiler Tercihleri
        </h2>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                {profile.hideSpoilers !== false ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">
                  Spoiler İçerikleri Otomatik Gizle
                </span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {profile.hideSpoilers !== false
                    ? 'Etiketli spoiler gönderiler bulanıklaştırılır ve tıklandığında açılır.'
                    : 'Spoiler içerikler doğrudan açık olarak görüntülenir.'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hideSpoilers !== false}
                onChange={(e) => updateProfile({ hideSpoilers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>
        </div>
      </section>

      {/* Okuma ve Hatırlatma Ayarları */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold font-serif text-white">Okuma Ayarları</h2>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div
            onClick={onOpenGoalModal}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">Günlük Sayfa Hedefi</span>
                <span className="text-xs text-neutral-400">Günde {profile.dailyGoal} sayfa</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">Okuma Hatırlatması</span>
                <span className="text-xs text-neutral-400">Her gün {profile.reminderTime}</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminderEnabled}
                onChange={(e) => updateProfile({ reminderEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>
        </div>
      </section>

      {/* İstatistikler Listesi */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold font-serif text-white">Genel İstatistikler</h2>
        <div className="bg-neutral-850 border border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-800 text-xs sm:text-sm">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-neutral-400">Toplam okunan kitap</span>
            <span className="font-bold text-white">{finishedBooks} adet</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-neutral-400">Toplam okunan sayfa</span>
            <span className="font-bold text-white">{totalPages} sayfa</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-neutral-400">Toplam okuma süresi</span>
            <span className="font-bold text-white">{formatMinutes(totalMinutes)}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-neutral-400">En uzun okuma serisi</span>
            <span className="font-bold text-amber-400">
              {profile.longestStreak || profile.streak} gün
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-neutral-400">Bu ay okunan sayfa</span>
            <span className="font-bold text-emerald-400">{monthPages} sayfa</span>
          </div>
        </div>
      </section>

      {/* Safe Persistence Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-2.5 text-xs text-neutral-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Verileriniz hesabınız altında güvenle saklanır. Oturumu kapattığınızda veya sayfayı yenilediğinizde hiçbir bilginiz kaybolmaz.
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={resetDemo}
          className="w-full py-3 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-750 font-semibold rounded-2xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-neutral-400" />
          <span>Okuma Kayıtlarını ve Kitaplığı Sıfırla</span>
        </button>

        <button
          onClick={signOut}
          className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-2xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Oturumu Kapat (Veriler Korunur)</span>
        </button>
      </div>
    </div>
  );
};
