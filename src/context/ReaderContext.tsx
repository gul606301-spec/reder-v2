import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Book,
  LibraryBook,
  ReaderProfile,
  ReadingLog,
  ReadingStatus,
  SocialPost,
  UserAccount,
  CustomBookList,
} from '../types';
import {
  featuredBooks,
  initialLibrary,
  initialProfile,
  initialReadingLogs,
  initialSocialPosts,
  todayKey,
} from '../data/catalog';

const STORAGE_KEYS = {
  ACCOUNTS: 'reader_accounts_db_v5',
  ACTIVE_USER_ID: 'reader_active_user_id_v5',
  POSTS: 'reader_social_posts_v5',
};

// No fake accounts - completely real and user-created only
const defaultAccounts: Record<string, UserAccount> = {};

interface ReaderContextType {
  profile: ReaderProfile | null;
  library: LibraryBook[];
  readingLogs: ReadingLog[];
  posts: SocialPost[];
  accounts: Record<string, UserAccount>;
  isReady: boolean;
  signUp: (name: string, email: string, username: string, phone: string | undefined, password: string | undefined) => { success: boolean; error?: string };
  signIn: (identifier: string, password?: string) => { success: boolean; error?: string };
  switchAccount: (userId: string) => void;
  signOut: () => void;
  updateProfile: (changes: Partial<ReaderProfile>) => void;
  toggleSpoilerPreference: () => void;
  createPost: (content: string, type: 'general' | 'review' | 'quote', bookData?: { id: string; title: string; author: string; cover?: string }) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  reportPostSpoiler: (postId: string) => void;
  rateAndReviewBook: (bookId: string, rating: number, review: string) => void;
  addToLibrary: (book: Book, status?: ReadingStatus) => void;
  updateBook: (id: string, changes: Partial<LibraryBook>) => void;
  removeFromLibrary: (id: string) => void;
  recordReading: (pages: number, bookId?: string, minutes?: number) => void;
  updateReadingLog: (id: string, pages: number) => void;
  deleteReadingLog: (id: string) => void;
  resetDemo: () => void;
  isInLibrary: (id: string) => boolean;
  customLists: CustomBookList[];
  toggleFavoriteBook: (bookId: string) => void;
  createCustomList: (name: string) => void;
  deleteCustomList: (listId: string) => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Record<string, UserAccount>>({});
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Clear legacy storage keys containing fake accounts
      ['reader_accounts_db_v1', 'reader_accounts_db_v2', 'reader_accounts_db_v3', 'reader_active_user_id_v2', 'reader_active_user_id_v3', 'reader_social_posts_v2', 'reader_social_posts_v3'].forEach(
        (key) => {
          try {
            localStorage.removeItem(key);
          } catch {
            // ignore
          }
        },
      );

      const storedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);

      let loadedAccounts: Record<string, UserAccount> = {};
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        // Exclude any fake demo accounts
        delete parsed['user_reader'];
        delete parsed['user_gulsah'];
        delete parsed['user_ahmet'];
        delete parsed['user_emre'];
        delete parsed['user_selin'];
        loadedAccounts = parsed;
      }

      setAccounts(loadedAccounts);

      // Restore active user if valid and exists
      if (storedActiveId && loadedAccounts[storedActiveId]) {
        setActiveUserId(storedActiveId);
      } else {
        setActiveUserId(null);
      }

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);

      if (storedPosts) {
        const parsedPosts: SocialPost[] = JSON.parse(storedPosts);
        const fakeUserIds = new Set(['user_reader', 'user_gulsah', 'user_ahmet', 'user_emre', 'user_selin']);
        const realPosts = parsedPosts.filter((p) => !fakeUserIds.has(p.userId));
        setPosts(realPosts);
      }
    } catch (err) {
      console.warn('Failed to load accounts from storage', err);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Save accounts helper
  const saveAccountsToStorage = (updatedAccounts: Record<string, UserAccount>) => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));
  };

  const savePostsToStorage = (updatedPosts: SocialPost[]) => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
  };

  // Active user data
  const currentAccount = activeUserId ? accounts[activeUserId] || null : null;
  const profile = currentAccount?.profile || null;
  const library = currentAccount?.library || [];
  const readingLogs = currentAccount?.readingLogs || [];
  const customLists = currentAccount?.customLists || [];

  // Helper to mutate active account and persist
  const mutateActiveAccount = (updater: (acc: UserAccount) => Partial<UserAccount> | void) => {
    if (!activeUserId || !accounts[activeUserId]) return;

    const currentAcc = accounts[activeUserId];
    const changes = updater(currentAcc);
    if (!changes) return;

    const updated = { ...currentAcc, ...changes };
    const newAccounts = { ...accounts, [activeUserId]: updated };
    setAccounts(newAccounts);
    saveAccountsToStorage(newAccounts);
  };

  // 1. Sign Up
  const signUp = (name: string, email: string, username: string, phone: string | undefined, password: string | undefined): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Check if email/username already exists
    if (Object.values(accounts).some((acc) => acc.email.toLowerCase() === trimmedEmail || acc.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Bu e-posta veya kullanıcı adı zaten kayıtlı.' };
    }

    const newId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const today = todayKey();
    const newProfile: ReaderProfile = {
      name: name.trim(),
      email: trimmedEmail,
      username: cleanUsername,
      phone: phone?.trim(),
      emailVerified: true,
      phoneVerified: Boolean(phone),
      dailyGoal: 20,
      reminderEnabled: true,
      reminderTime: '21:00',
      reminderDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      streak: 0,
      longestStreak: 0,
      todayPages: 0,
      todayMinutes: 0,
      todayPagesDate: today,
      lastActiveDate: today,
      hideSpoilers: true,
      xp: 0,
    };

    const newAccount: UserAccount = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      username: cleanUsername,
      phone: phone?.trim(),
      password: password || '123456',
      emailVerified: true,
      phoneVerified: Boolean(phone),
      profile: newProfile,
      library: [], // Starts fresh with own library!
      readingLogs: [],
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = {
      ...accounts,
      [newId]: newAccount,
    };

    setAccounts(updatedAccounts);
    setActiveUserId(newId);
    saveAccountsToStorage(updatedAccounts);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newId);

    return { success: true };
  };

  // 2. Sign In (By email, username, or phone)
  const signIn = (identifier: string, password?: string): { success: boolean; error?: string } => {
    const term = identifier.trim().toLowerCase();
    const found = Object.values(accounts).find(
      (acc) =>
        acc.email.toLowerCase() === term ||
        acc.username.toLowerCase() === term ||
        (acc.phone && acc.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '')),
    );

    if (!found) {
      return { success: false, error: 'Girdiğiniz bilgilere ait bir hesap bulunamadı.' };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.' };
    }

    setActiveUserId(found.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, found.id);
    return { success: true };
  };

  // 3. Switch Account
  const switchAccount = (userId: string) => {
    if (accounts[userId]) {
      setActiveUserId(userId);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    }
  };

  // 4. Sign Out (Does NOT delete data! Keeps everything persistent!)
  const signOut = () => {
    setActiveUserId(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    // ✅ FİX: Hiçbir veri silinmiyor - accounts, library, readingLogs, posts hepsi localStorage'de kalıyor
  };

  // 5. Update Profile
  const updateProfile = (changes: Partial<ReaderProfile>) => {
    mutateActiveAccount((acc) => {
      return {
        profile: { ...acc.profile, ...changes },
      };
    });
  };

  // 6. Toggle Spoiler Preference
  const toggleSpoilerPreference = () => {
    mutateActiveAccount((acc) => {
      return {
        profile: { ...acc.profile, hideSpoilers: !acc.profile.hideSpoilers },
      };
    });
  };

  // 7. Create Post
  const createPost = (content: string, type: 'general' | 'review' | 'quote', bookData?: { id: string; title: string; author: string; cover?: string }) => {
    if (!activeUserId || !profile) return;

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      userId: activeUserId,
      userName: profile.name,
      userAvatar: profile.name.charAt(0).toUpperCase(),
      content,
      type,
      bookData,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      spoilerReports: 0,
      rating: undefined,
    };

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  // 8. Like Post
  const likePost = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !activeUserId) return;

    const liked = post.likes.includes(activeUserId);
    const updatedPost = {
      ...post,
      likes: liked ? post.likes.filter((id) => id !== activeUserId) : [...post.likes, activeUserId],
    };

    const updatedPosts = posts.map((p) => (p.id === postId ? updatedPost : p));
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  // 9. Add Comment
  const addComment = (postId: string, text: string) => {
    if (!profile || !activeUserId) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const comment = {
      id: `comment_${Date.now()}`,
      userId: activeUserId,
      userName: profile.name,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedPost = {
      ...post,
      comments: [...post.comments, comment],
    };

    const updatedPosts = posts.map((p) => (p.id === postId ? updatedPost : p));
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  // 10. Report Post Spoiler
  const reportPostSpoiler = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const updatedPost = {
      ...post,
      spoilerReports: post.spoilerReports + 1,
    };

    const updatedPosts = posts.map((p) => (p.id === postId ? updatedPost : p));
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  // 11. Rate and Review Book
  const rateAndReviewBook = (bookId: string, rating: number, review: string) => {
    if (!activeUserId || !profile) return;

    mutateActiveAccount((acc) => {
      const book = acc.library.find((b) => b.id === bookId);
      if (!book) return {};

      return {
        library: acc.library.map((b) =>
          b.id === bookId
            ? { ...b, userRating: rating, userReview: review }
            : b,
        ),
      };
    });

    // Also create a review post
    const book = library.find((b) => b.id === bookId);
    if (book) {
      createPost(review || `⭐ ${rating}/5`, 'review', { id: book.id, title: book.title, author: book.author, cover: book.cover });
    }
  };

  // 12. Add to Library
  const addToLibrary = (book: Book, status: ReadingStatus = 'want') => {
    mutateActiveAccount((acc) => {
      if (acc.library.some((b) => b.id === book.id)) return {};

      const newLibraryBook: LibraryBook = {
        id: book.id,
        workId: book.workId,
        title: book.title,
        originalTitle: book.originalTitle,
        author: book.author,
        cover: book.cover,
        pages: book.pages || 0,
        year: book.year,
        publisher: book.publisher,
        category: book.category,
        isbn: book.isbn,
        language: book.language || 'tr',
        status,
        progress: 0,
        minutes: 0,
        rating: book.rating,
        ratingSource: book.ratingSource,
        description: book.description,
      };

      return {
        library: [...acc.library, newLibraryBook],
      };
    });
  };

  // 13. Update Book
  const updateBook = (id: string, changes: Partial<LibraryBook>) => {
    mutateActiveAccount((acc) => {
      return {
        library: acc.library.map((b) =>
          b.id === id ? { ...b, ...changes } : b,
        ),
      };
    });
  };

  // 14. Remove from Library
  const removeFromLibrary = (id: string) => {
    mutateActiveAccount((acc) => {
      return {
        library: acc.library.filter((b) => b.id !== id),
      };
    });
  };

  // 15. Record Reading (progress + minutes)
  const recordReading = (pages: number, bookId?: string, minutes?: number) => {
    mutateActiveAccount((acc) => {
      const today = todayKey();
      const todayLogIndex = acc.readingLogs.findIndex((log) => log.date === today);

      let updatedLogs = acc.readingLogs;
      if (todayLogIndex >= 0) {
        updatedLogs[todayLogIndex] = {
          ...updatedLogs[todayLogIndex],
          pages: updatedLogs[todayLogIndex].pages + pages,
          minutes: updatedLogs[todayLogIndex].minutes + (minutes || 0),
        };
      } else {
        updatedLogs = [
          ...acc.readingLogs,
          {
            id: `log_${Date.now()}`,
            date: today,
            pages,
            minutes: minutes || 0,
            bookId,
          },
        ];
      }

      const updatedProfile = {
        ...acc.profile,
        todayPages: acc.profile.todayPages + pages,
        todayMinutes: acc.profile.todayMinutes + (minutes || 0),
        todayPagesDate: today,
      };

      let updatedLib = acc.library;
      if (bookId) {
        const nextProgress = Math.min(
          (updatedLib.find((b) => b.id === bookId)?.progress || 0) + pages,
          (updatedLib.find((b) => b.id === bookId)?.pages || Infinity),
        );

        updatedLib = updatedLib.map((book) => {
          if (book.id !== bookId) return book;

          const newProgress = Math.min(nextProgress, book.pages);
          return {
            ...book,
            progress: newProgress,
            status: (book.pages > 0 && newProgress >= book.pages ? 'finished' : newProgress < book.pages && book.status === 'finished' ? 'reading' : book.status) as ReadingStatus,
          };
        });
      }

      return {
        readingLogs: updatedLogs,
        profile: updatedProfile,
        library: updatedLib,
      };
    });
  };

  // 16. Update Reading Log
  const updateReadingLog = (id: string, pages: number) => {
    mutateActiveAccount((acc) => {
      const existing = acc.readingLogs.find((l) => l.id === id);
      if (!existing) return {};

      const pageDiff = pages - existing.pages;
      const updatedLogs = acc.readingLogs.map((l) =>
        l.id === id ? { ...l, pages } : l,
      );

      const today = todayKey();
      let updatedProfile = acc.profile;
      if (existing.date === today) {
        updatedProfile = {
          ...acc.profile,
          todayPages: Math.max(0, acc.profile.todayPages + pageDiff),
        };
      }

      let updatedLib = acc.library;
      if (existing.bookId) {
        const nextProgress = Math.min(
          (updatedLib.find((b) => b.id === existing.bookId)?.progress || 0) + pageDiff,
          (updatedLib.find((b) => b.id === existing.bookId)?.pages || Infinity),
        );

        updatedLib = updatedLib.map((book) => {
          if (book.id !== existing.bookId) return book;

          const newProgress = Math.min(nextProgress, book.pages);
          return {
            ...book,
            progress: newProgress,
            status: (book.pages > 0 && newProgress >= book.pages ? 'finished' : newProgress < book.pages && book.status === 'finished' ? 'reading' : book.status) as ReadingStatus,
          };
        });
      }

      return {
        readingLogs: updatedLogs,
        profile: updatedProfile,
        library: updatedLib,
      };
    });
  };

  // 17. Delete Reading Log
  const deleteReadingLog = (id: string) => {
    mutateActiveAccount((acc) => {
      const existing = acc.readingLogs.find((l) => l.id === id);
      if (!existing) return {};
      const updatedLogs = acc.readingLogs.filter((l) => l.id !== id);

      let updatedProfile = acc.profile;
      const today = todayKey();
      if (existing.date === today) {
        updatedProfile = {
          ...acc.profile,
          todayPages: Math.max(0, acc.profile.todayPages - existing.pages),
        };
      }

      return {
        readingLogs: updatedLogs,
        profile: updatedProfile,
      };
    });
  };

  // 18. Reset Demo (Clears all for testing)
  const resetDemo = () => {
    setAccounts({});
    setActiveUserId(null);
    setPosts([]);
    saveAccountsToStorage({});
    savePostsToStorage([]);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  };

  // 19. Is in Library
  const isInLibrary = (id: string) => library.some((b) => b.id === id);

  // 20. Toggle Favorite Book
  const toggleFavoriteBook = (bookId: string) => {
    mutateActiveAccount((acc) => {
      return {
        library: acc.library.map((b) =>
          b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b,
        ),
      };
    });
  };

  // 21. Create Custom List
  const createCustomList = (name: string) => {
    mutateActiveAccount((acc) => {
      const newList: CustomBookList = {
        id: `list_${Date.now()}`,
        name,
        books: [],
      };
      return {
        customLists: [...acc.customLists, newList],
      };
    });
  };

  // 22. Delete Custom List
  const deleteCustomList = (listId: string) => {
    mutateActiveAccount((acc) => {
      return {
        customLists: acc.customLists.filter((l) => l.id !== listId),
      };
    });
  };

  return (
    <ReaderContext.Provider
      value={{
        profile,
        library,
        readingLogs,
        posts,
        accounts,
        isReady,
        signUp,
        signIn,
        switchAccount,
        signOut,
        updateProfile,
        toggleSpoilerPreference,
        createPost,
        likePost,
        addComment,
        reportPostSpoiler,
        rateAndReviewBook,
        addToLibrary,
        updateBook,
        removeFromLibrary,
        recordReading,
        updateReadingLog,
        deleteReadingLog,
        resetDemo,
        isInLibrary,
        customLists,
        toggleFavoriteBook,
        createCustomList,
        deleteCustomList,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within ReaderProvider');
  }
  return context;
}
