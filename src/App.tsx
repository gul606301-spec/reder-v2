import React, { useState } from 'react';
import { Book, BookNews, TabType } from './types';
import { ReaderProvider, useReader } from './context/ReaderContext';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/tabs/HomeTab';
import { LibraryTab } from './components/tabs/LibraryTab';
import { SearchTab } from './components/tabs/SearchTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { BookDetailModal } from './components/BookDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { DailyGoalModal } from './components/DailyGoalModal';
import { AccountEditModal } from './components/AccountEditModal';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const { isReady, profile } = useReader();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedNews, setSelectedNews] = useState<BookNews | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAuthModalDismissed, setIsAuthModalDismissed] = useState(false);
  const [isAuthModalForced, setIsAuthModalForced] = useState(false);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-neutral-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-wider uppercase font-semibold text-neutral-500">
            Reader Hub Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalForced(true)}
      />

      {/* Main Tab Screen Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <HomeTab
            onSelectBook={(book) => setSelectedBook(book)}
            onSelectNews={(news) => setSelectedNews(news)}
            onNavigateToLibrary={() => setActiveTab('library')}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
          />
        )}

        {activeTab === 'library' && (
          <LibraryTab
            onSelectBook={(book) => setSelectedBook(book)}
            onNavigateToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab onSelectBook={(book) => setSelectedBook(book)} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            onSelectBook={(book) => setSelectedBook(book)}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onOpenAccountModal={() => {
              if (!profile) {
                setIsAuthModalForced(true);
              } else {
                setIsAccountModalOpen(true);
              }
            }}
            onNavigateToSearch={() => setActiveTab('search')}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <BookDetailModal
        book={selectedBook}
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
      />

      <NewsDetailModal
        news={selectedNews}
        isOpen={Boolean(selectedNews)}
        onClose={() => setSelectedNews(null)}
      />

      <DailyGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <AccountEditModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* Auth / Onboarding if user logged out */}
      <AuthModal
        forceOpen={!profile ? !isAuthModalDismissed : isAuthModalForced}
        onClose={() => {
          setIsAuthModalDismissed(true);
          setIsAuthModalForced(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReaderProvider>
      <AppContent />
    </ReaderProvider>
  );
}
