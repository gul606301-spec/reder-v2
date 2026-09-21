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
  customLists: CustomBookList[];
  isReady: boolean;
  // Auth & Account Management
  signUp: (data: { name: string; email: string; phone?: string; username?: string; password?: string }) => { success: boolean; error?: string };
  signIn: (identifier: string, password?: string) => { success: boolean; error?: string };
  switchAccount: (userId: string) => void;
  signOut: () => void;
  updateProfile: (changes: Partial<ReaderProfile>) => void;
  toggleSpoilerPreference: () => void;
  // Social Posts & Reviews
  createPost: (params: {
    content: string;
    bookId?: string;
    bookData?: { id: string; title: string; author: string; cover?: string };
    rating?: number;
    isSpoiler?: boolean;
    type?: 'general' | 'review' | 'quote' | 'activity';
  }) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string, isSpoiler?: boolean) => void;
  reportPostSpoiler: (postId: string) => void;
  rateAndReviewBook: (bookId: string, rating: number, reviewText?: string, isSpoiler?: boolean) => void;
  // Library Actions
  addToLibrary: (book: Book, status?: ReadingStatus) => void;
  updateBook: (id: string, changes: Partial<LibraryBook>) => void;
  removeFromLibrary: (id: string) => void;
  toggleFavoriteBook: (bookId: string) => void;
  // Custom Lists
  createCustomList: (name: string, description?: string) => void;
  deleteCustomList: (id: string) => void;
  addBookToCustomList: (listId: string, bookId: string) => void;
  removeBookFromCustomList: (listId: string, bookId: string) => void;
  // Reading tracking
  recordReading: (pages: number, bookId?: string, minutes?: number) => void;
  updateReadingLog: (id: string, pages: number) => void;
  deleteReadingLog: (id: string) => void;
  resetDemo: () => void;
  isInLibrary: (id: string) => boolean;
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
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);

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

  // Helper to commit changes to the active account
  const mutateActiveAccount = (
    updater: (prev: UserAccount) => Partial<UserAccount>,
  ) => {
    if (!activeUserId) return;
    setAccounts((prevAccounts) => {
      const account = prevAccounts[activeUserId];
      if (!account) return prevAccounts;
      const updates = updater(account);
      const updatedAccount: UserAccount = {
        ...account,
        ...updates,
      };
      const nextAccounts = {
        ...prevAccounts,
        [activeUserId]: updatedAccount,
      };
      saveAccountsToStorage(nextAccounts);
      return nextAccounts;
    });
  };

  // 1. Sign Up (Prevent duplicate emails/usernames, create persistent account)
  const signUp = ({
    name,
    email,
    phone,
    username,
    password,
  }: {
    name: string;
    email: string;
    phone?: string;
    username?: string;
    password?: string;
  }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanUsername = (username || name.toLowerCase()).replace(/[^a-z0-9_]/g, '');

    // Check duplicate
    const exists = Object.values(accounts).some(
      (acc) =>
        acc.email.toLowerCase() === trimmedEmail ||
        acc.username.toLowerCase() === cleanUsername ||
        (phone && acc.phone && acc.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')),
    );

    if (exists) {
      return { success: false, error: 'Bu e-posta veya kullanıcı adı ile kayıtlı bir hesap zaten var.' };
    }

    const newId = `user_${Date.now()}`;
    const today = todayKey();

    const newProfile: ReaderProfile = {
      id: newId,
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
  const signIn = (identifier: string, password?: string) => {
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
  };

  // 5. Update Profile
  const updateProfile = (changes: Partial<ReaderProfile>) => {
    mutateActiveAccount((acc) => {
      const updatedProfile = { ...acc.profile, ...changes };
      return {
        profile: updatedProfile,
        name: changes.name ?? acc.name,
        username: changes.username ?? acc.username,
        phone: changes.phone ?? acc.phone,
      };
    });
  };

  // 6. Toggle Spoiler Preference
  const toggleSpoilerPreference = () => {
    if (!profile) return;
    const currentVal = profile.hideSpoilers !== false; // default true
    updateProfile({ hideSpoilers: !currentVal });
  };

  // 7. Social Posts with Spoilers
  const createPost = ({
    content,
    bookId,
    bookData,
    rating,
    isSpoiler = false,
    type = 'general',
  }: {
    content: string;
    bookId?: string;
    bookData?: { id: string; title: string; author: string; cover?: string };
    rating?: number;
    isSpoiler?: boolean;
    type?: 'general' | 'review' | 'quote' | 'activity';
  }) => {
    if (!profile) return;
    const bookObj =
      bookData ||
      (bookId
        ? library.find((b) => b.id === bookId) || featuredBooks.find((b) => b.id === bookId)
        : undefined);

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      userId: profile.id || activeUserId || 'user',
      userName: profile.name,
      userUsername: profile.username || 'reader',
      userAvatar: profile.avatar,
      type: type || (rating ? 'review' : 'general'),
      content: content.trim(),
      book: bookObj
        ? {
            id: bookObj.id,
            title: bookObj.title,
            author: bookObj.author,
            cover: bookObj.cover,
          }
        : undefined,
      rating,
      isSpoiler: Boolean(isSpoiler),
      spoilerReportedCount: 0,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => {
      const next = [newPost, ...prev];
      savePostsToStorage(next);
      return next;
    });
  };

  const likePost = (postId: string) => {
    if (!activeUserId) return;
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== postId) return p;
        const hasLiked = p.likes.includes(activeUserId);
        const nextLikes = hasLiked
          ? p.likes.filter((id) => id !== activeUserId)
          : [...p.likes, activeUserId];
        return { ...p, likes: nextLikes };
      });
      savePostsToStorage(next);
      return next;
    });
  };

  const addComment = (postId: string, content: string, isSpoiler = false) => {
    if (!profile) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: profile.id || activeUserId || 'user',
      userName: profile.name,
      userAvatar: profile.avatar,
      content: content.trim(),
      isSpoiler,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      });
      savePostsToStorage(next);
      return next;
    });
  };

  const reportPostSpoiler = (postId: string) => {
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== postId) return p;
        const newCount = (p.spoilerReportedCount || 0) + 1;
        return {
          ...p,
          spoilerReportedCount: newCount,
          isSpoiler: true, // Mark as spoiler once reported
        };
      });
      savePostsToStorage(next);
      return next;
    });
  };

  // 8. Rate & Review Book
  const rateAndReviewBook = (
    bookId: string,
    rating: number,
    reviewText?: string,
    isSpoiler = false,
  ) => {
    mutateActiveAccount((acc) => {
      const updatedLib = acc.library.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          userRating: rating,
          userReview: reviewText,
          isReviewSpoiler: isSpoiler,
        };
      });
      return { library: updatedLib };
    });

    // Also share to feed if review text is provided
    if (reviewText && reviewText.trim()) {
      createPost({
        content: reviewText,
        bookId,
        rating,
        isSpoiler,
        type: 'review',
      });
    } else if (rating > 0) {
      const book = library.find((b) => b.id === bookId);
      if (book && profile) {
        const newPost: SocialPost = {
          id: `rate-${Date.now()}`,
          userId: profile.id || activeUserId || 'user',
          userName: profile.name,
          userUsername: profile.username || 'reader',
          type: 'activity',
          activityType: 'rated',
          content: `"${book.title}" kitabına ${rating}/5 puan verdi. ⭐`,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
          },
          rating,
          isSpoiler: false,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString(),
        };
        setPosts((prev) => {
          const next = [newPost, ...prev];
          savePostsToStorage(next);
          return next;
        });
      }
    }
  };

  // 9. Library Actions
  const addToLibrary = (book: Book, status: ReadingStatus = 'want') => {
    mutateActiveAccount((acc) => {
      const exists = acc.library.some((b) => b.id === book.id);
      if (exists) {
        return {
          library: acc.library.map((b) => (b.id === book.id ? { ...b, status } : b)),
        };
      }
      const isFinished = status === 'finished';
      const newBook: LibraryBook = {
        ...book,
        status,
        progress: isFinished ? book.pages : 0,
        minutes: 0,
        addedAt: new Date().toISOString(),
      };
      return { library: [newBook, ...acc.library] };
    });

    // Create activity post in social feed
    if (profile) {
      const actType = status === 'reading' ? 'started' : status === 'finished' ? 'finished' : 'added_to_want';
      const actText =
        status === 'reading'
          ? `"${book.title}" kitabını okumaya başladı.`
          : status === 'finished'
          ? `"${book.title}" kitabını bitirdi! 📖🎉`
          : `"${book.title}" kitabını okuma listesine ekledi.`;

      const newPost: SocialPost = {
        id: `act-${Date.now()}`,
        userId: profile.id || activeUserId || 'user',
        userName: profile.name,
        userUsername: profile.username || 'reader',
        type: 'activity',
        activityType: actType,
        content: actText,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
        },
        isSpoiler: false,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => {
        const next = [newPost, ...prev];
        savePostsToStorage(next);
        return next;
      });
    }
  };

  const updateBook = (id: string, changes: Partial<LibraryBook>) => {
    let bookToAnnounce: LibraryBook | undefined;
    let oldStatus: ReadingStatus | undefined;

    mutateActiveAccount((acc) => {
      const currentBook = acc.library.find((b) => b.id === id);
      if (currentBook) {
        bookToAnnounce = currentBook;
        oldStatus = currentBook.status;
      }
      const updatedLib = acc.library.map((b) => {
        if (b.id !== id) return b;
        const normalized =
          changes.status === 'finished'
            ? { ...changes, progress: b.pages }
            : changes;
        return { ...b, ...normalized, lastReadAt: new Date().toISOString() };
      });
      return { library: updatedLib };
    });

    // Announce status change to feed if changed
    if (
      profile &&
      bookToAnnounce &&
      changes.status &&
      changes.status !== oldStatus
    ) {
      const actType =
        changes.status === 'reading'
          ? 'started'
          : changes.status === 'finished'
          ? 'finished'
          : 'added_to_want';
      const actText =
        changes.status === 'reading'
          ? `"${bookToAnnounce.title}" kitabını okumaya başladı.`
          : changes.status === 'finished'
          ? `"${bookToAnnounce.title}" kitabını okudu. 📖🎉`
          : changes.status === 'dropped'
          ? `"${bookToAnnounce.title}" kitabını yarım bıraktı.`
          : `"${bookToAnnounce.title}" kitabını okuyacaklar listesine ekledi.`;

      const newPost: SocialPost = {
        id: `act-${Date.now()}`,
        userId: profile.id || activeUserId || 'user',
        userName: profile.name,
        userUsername: profile.username || 'reader',
        type: 'activity',
        activityType: actType,
        content: actText,
        book: {
          id: bookToAnnounce.id,
          title: bookToAnnounce.title,
          author: bookToAnnounce.author,
          cover: bookToAnnounce.cover,
        },
        isSpoiler: false,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => {
        const next = [newPost, ...prev];
        savePostsToStorage(next);
        return next;
      });
    }
  };

  const removeFromLibrary = (id: string) => {
    mutateActiveAccount((acc) => ({
      library: acc.library.filter((b) => b.id !== id),
    }));
  };

  const toggleFavoriteBook = (bookId: string) => {
    mutateActiveAccount((acc) => {
      const updatedLib = acc.library.map((b) => {
        if (b.id !== bookId) return b;
        return { ...b, favorite: !b.favorite };
      });
      return { library: updatedLib };
    });
  };

  const createCustomList = (name: string, description?: string) => {
    if (!name.trim()) return;
    const newList: CustomBookList = {
      id: `list-${Date.now()}`,
      name: name.trim(),
      description: description?.trim(),
      bookIds: [],
      createdAt: new Date().toISOString(),
    };
    mutateActiveAccount((acc) => ({
      customLists: [...(acc.customLists || []), newList],
    }));
  };

  const deleteCustomList = (id: string) => {
    mutateActiveAccount((acc) => ({
      customLists: (acc.customLists || []).filter((l) => l.id !== id),
    }));
  };

  const addBookToCustomList = (listId: string, bookId: string) => {
    mutateActiveAccount((acc) => ({
      customLists: (acc.customLists || []).map((l) => {
        if (l.id !== listId) return l;
        if (l.bookIds.includes(bookId)) return l;
        return { ...l, bookIds: [...l.bookIds, bookId] };
      }),
    }));
  };

  const removeBookFromCustomList = (listId: string, bookId: string) => {
    mutateActiveAccount((acc) => ({
      customLists: (acc.customLists || []).map((l) => {
        if (l.id !== listId) return l;
        return { ...l, bookIds: l.bookIds.filter((id) => id !== bookId) };
      }),
    }));
  };

  // 10. Reading logs & streak
  const recordReading = (pages: number, bookId?: string, minutes: number = 0) => {
    const normalizedPages = Math.max(0, Math.floor(pages));
    const normalizedMinutes = Math.max(0, Math.floor(minutes));
    if (normalizedPages === 0 && normalizedMinutes === 0) return;

    const today = todayKey();
    const newLog: ReadingLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: today,
      pages: normalizedPages,
      minutes: normalizedMinutes,
      bookId,
      createdAt: new Date().toISOString(),
    };

    mutateActiveAccount((acc) => {
      const updatedLogs = [newLog, ...acc.readingLogs];

      // Update book progress
      let updatedLib = acc.library;
      if (bookId) {
        updatedLib = acc.library.map((b) => {
          if (b.id !== bookId) return b;
          const nextProgress = Math.min(b.pages, Math.max(b.progress, b.progress + normalizedPages));
          const isFinished = b.pages > 0 && nextProgress >= b.pages;
          return {
            ...b,
            progress: nextProgress,
            minutes: b.minutes + normalizedMinutes,
            status: isFinished ? ('finished' as ReadingStatus) : ('reading' as ReadingStatus),
            lastReadAt: new Date().toISOString(),
          };
        });
      }

      // Update profile
      const prevProfile = acc.profile;
      const isSameDay = prevProfile.todayPagesDate === today;
      const nextTodayPages = isSameDay ? prevProfile.todayPages + normalizedPages : normalizedPages;
      const nextTodayMinutes = isSameDay ? prevProfile.todayMinutes + normalizedMinutes : normalizedMinutes;
      const goalJustAchieved = prevProfile.todayPages < prevProfile.dailyGoal && nextTodayPages >= prevProfile.dailyGoal;

      if (goalJustAchieved) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
          });
        } catch (_) {}
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      const wasGoalMet = nextTodayPages >= prevProfile.dailyGoal;
      let nextStreak = prevProfile.streak;

      if (wasGoalMet && prevProfile.lastActiveDate !== today) {
        if (prevProfile.lastActiveDate === yesterdayKey) {
          nextStreak = prevProfile.streak + 1;
        } else {
          nextStreak = 1;
        }
      }

      const updatedProfile: ReaderProfile = {
        ...prevProfile,
        todayPages: nextTodayPages,
        todayMinutes: nextTodayMinutes,
        todayPagesDate: today,
        streak: nextStreak,
        longestStreak: Math.max(prevProfile.longestStreak || 0, nextStreak),
        lastActiveDate: wasGoalMet ? today : prevProfile.lastActiveDate,
        xp: (prevProfile.xp || 0) + normalizedPages * 2,
      };

      return {
        readingLogs: updatedLogs,
        library: updatedLib,
        profile: updatedProfile,
      };
    });
  };

  const updateReadingLog = (id: string, pages: number) => {
    const normalizedPages = Math.max(0, Math.floor(pages));
    mutateActiveAccount((acc) => {
      const existing = acc.readingLogs.find((l) => l.id === id);
      if (!existing || existing.pages === normalizedPages) return {};
      const diff = normalizedPages - existing.pages;
      const updatedLogs = acc.readingLogs.map((l) => (l.id === id ? { ...l, pages: normalizedPages } : l));

      let updatedProfile = acc.profile;
      const today = todayKey();
      if (existing.date === today) {
        updatedProfile = {
          ...acc.profile,
          todayPages: Math.max(0, acc.profile.todayPages + diff),
        };
      }

      let updatedLib = acc.library;
      if (existing.bookId) {
        updatedLib = acc.library.map((b) => {
          if (b.id !== existing.bookId) return b;
          const newProgress = Math.min(b.pages, Math.max(0, b.progress + diff));
          return {
            ...b,
            progress: newProgress,
            status: (newProgress >= b.pages ? 'finished' : 'reading') as ReadingStatus,
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

  const resetDemo = () => {
    setAccounts({});
    setActiveUserId(null);
    setPosts([]);
    saveAccountsToStorage({});
    savePostsToStorage([]);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  };

  const isInLibrary = (id: string) => library.some((b) => b.id === id);

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
        addBookToCustomList,
        removeBookFromCustomList,
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
