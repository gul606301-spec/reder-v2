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
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-black text-xl tracking-tight text-white block leading-none">
                Reader Hub
              </span>
              <span className="text-[10px] tracking-wider text-amber-500 font-semibold uppercase">
                Kişisel Okuma Alanı
              </span>
            </div>
          </div>

          {/* Right Header Status Action */}
          <div className="flex items-center gap-3">
            {profile ? (
              <button
                onClick={onOpenGoalModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 text-xs font-semibold text-neutral-200 transition-all cursor-pointer group"
                title="Günlük okuma hedefini yönet"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-amber-400 font-bold">{profile.streak} gün</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-300">
                  {profile.todayPages}/{profile.dailyGoal} sf
                </span>
              </button>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  Giriş Yap
                </button>
              )
            )}

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-2 border-l border-neutral-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 pb-safe">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
                  isActive ? 'text-amber-400 scale-105' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? 'bg-amber-500/20 text-amber-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
