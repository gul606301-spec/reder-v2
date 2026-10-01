import React from 'react';
import { Home, Library, Compass, User, Flame, BookMarked, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { useReader } from '../context/ReaderContext';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenGoalModal: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenGoalModal, onOpenAuthModal }) => {
  const { profile } = useReader();

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'library', label: 'Kitaplığım', icon: Library },
    { id: 'search', label: 'Keşfet', icon: Compass },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-[#fffaf3]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[4.5rem] flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff745d] via-[#f45477] to-[#7659e8] text-white flex items-center justify-center font-black shadow-lg shadow-[#f45477]/25">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-black text-xl tracking-tight text-[#17233f] block leading-none">
                Reader Hub
              </span>
              <span className="text-[10px] tracking-wider text-[#e35d57] font-bold uppercase">
                Kişisel Okuma Alanı
              </span>
            </div>
          </div>

          {/* Right Header Status Action */}
          <div className="flex items-center gap-3">
            {profile ? (
              <button
                onClick={onOpenGoalModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-[#fff5ed] border border-[#f0dfd5] text-xs font-semibold text-[#273350] transition-all cursor-pointer group shadow-sm"
                title="Günlük okuma hedefini yönet"
              >
                <Flame className="w-4 h-4 text-[#f56b4f] fill-[#f56b4f] group-hover:scale-110 transition-transform" />
                <span className="text-[#e35d57] font-bold">{profile.streak} gün</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  {profile.todayPages}/{profile.dailyGoal} sf
                </span>
              </button>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 rounded-full bg-[#17233f] hover:bg-[#25365e] text-white shadow-lg shadow-[#17233f]/15 text-xs font-semibold transition-all cursor-pointer"
                >
                  Giriş Yap
                </button>
              )
            )}

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-3 border-l border-[#eaded5]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#17233f] text-white shadow-md shadow-[#17233f]/15'
                        : 'text-slate-500 hover:text-[#17233f] hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffaf3]/95 backdrop-blur-xl border-t border-white pb-safe shadow-[0_-10px_30px_rgba(32,38,67,0.08)]">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
                  isActive ? 'text-[#17233f] scale-105' : 'text-slate-400 hover:text-[#17233f]'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#17233f] text-white shadow-md shadow-[#17233f]/20' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${isActive ? 'text-[#17233f]' : 'text-slate-500'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
