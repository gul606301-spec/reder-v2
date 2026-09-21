export type ReadingStatus = 'reading' | 'finished' | 'want' | 'dropped';

export type LibraryViewMode = 'shelf' | 'grid' | 'list';

export type BookEdition = {
  id: string;
  title: string;
  language: 'tr' | 'en' | string;
  isTurkish?: boolean;
  cover?: string;
  isbn?: string;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  pages?: number;
  year?: number;
  description?: string;
  verifiedCover?: boolean;
};

export type BookWork = {
  id: string;
  originalTitle: string;
  author: string;
  category?: string;
  editions: BookEdition[];
  preferredEditionId?: string;
  aliases?: string[];
};

export type Book = {
  id: string;
  workId?: string;
  title: string; // Öncelikli gösterilecek başlık (Türkçe baskı)
  originalTitle?: string; // Orijinal eser adı (örn. Atomic Habits)
  author: string;
  cover?: string; // Gösterilen başlığa ait doğrulanmış kapak
  pages: number;
  description?: string;
  year?: number;
  category?: string;
  publisher?: string; // Türkçe yayınevi
  isbn?: string; // Türkçe baskı ISBN
  isbn10?: string;
  isbn13?: string;
  language?: string; // 'tr' | 'en' | ...
  hasVerifiedTurkishEdition?: boolean;
  editions?: BookEdition[];
  aliases?: string[];
  rating?: number; // External/community score (e.g. 4.6 / 5)
  ratingSource?: string; // e.g. "Reader Skoru (Goodreads)"
  readersCount?: number; // e.g. 142 kişi şu an okuyor
};

export type LibraryBook = Book & {
  status: ReadingStatus;
  progress: number;
  minutes: number;
  addedAt: string;
  lastReadAt?: string;
  userRating?: number; // 1-5 stars
  userReview?: string;
  isReviewSpoiler?: boolean;
  notes?: string;
  favorite?: boolean;
};

export type ReadingLog = {
  id: string;
  date: string; // YYYY-MM-DD
  pages: number;
  minutes: number;
  bookId?: string;
  createdAt: string;
};

export type ReaderProfile = {
  id?: string;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  dailyGoal: number;
  yearlyGoal?: number;
  hideSpoilers?: boolean; // User preference: default true (blur spoilers)
  reminderEnabled: boolean;
  reminderTime: string;
  reminderDays?: string[];
  streak: number;
  longestStreak?: number;
  todayPages: number;
  todayMinutes: number;
  todayPagesDate?: string;
  lastActiveDate?: string;
  xp?: number;
};

export type CustomBookList = {
  id: string;
  name: string;
  description?: string;
  bookIds: string[];
  createdAt: string;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  password?: string;
  bio?: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profile: ReaderProfile;
  library: LibraryBook[];
  readingLogs: ReadingLog[];
  favoriteBookIds?: string[];
  customLists?: CustomBookList[];
  savedPostIds?: string[];
  createdAt: string;
};

export type PostComment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  isSpoiler?: boolean;
  createdAt: string;
};

export type SocialPost = {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar?: string;
  type: 'general' | 'activity' | 'review' | 'quote';
  activityType?: 'started' | 'finished' | 'added_to_want' | 'rated';
  content: string;
  book?: {
    id: string;
    title: string;
    author: string;
    cover?: string;
  };
  rating?: number;
  isSpoiler?: boolean;
  spoilerReportedCount?: number;
  likes: string[]; // User IDs who liked
  comments: PostComment[];
  createdAt: string;
};

export type MysteryBook = {
  id: string;
  category: string;
  summary: string;
  book: Book;
};

export type TriviaQuestion = {
  id: string;
  question: string;
  clue: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type NewsCategory = 'kitap' | 'yazar' | 'yayinevi' | 'odul' | 'lansman';

export type BookNews = {
  id: string;
  category: NewsCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  source: string;
  sourceUrl?: string;
  imageUrl: string;
  relatedBookId?: string;
  relatedBookTitle?: string;
};

export type UpcomingBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  releaseDate: string;
  cover: string;
  pages: number;
  description: string;
  isPreorder?: boolean;
  badge?: string;
};

export type TabType = 'home' | 'library' | 'explore' | 'search' | 'profile';

