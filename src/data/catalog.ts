import { Book, BookNews, ReadingStatus, UpcomingBook } from '../types';

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const formatMinutes = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 dk';
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} sa ${remaining} dk` : `${hours} sa`;
};

export const statusLabel = (status: ReadingStatus): string => {
  switch (status) {
    case 'reading':
      return 'Okuyorum';
    case 'finished':
      return 'Okudum';
    case 'want':
      return 'Okuyacağım';
    case 'dropped':
      return 'Yarım Bıraktım';
  }
};

export const featuredBooks: Book[] = [
  {
    id: 'ol-atomic-habits',
    workId: 'work-atomic-habits',
    title: 'Atomik Alışkanlıklar',
    originalTitle: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://covers.openlibrary.org/b/id/12539702-M.jpg',
    pages: 352,
    year: 2020,
    category: 'Kişisel Gelişim',
    publisher: 'Pegasus Yayınları',
    isbn: '9786052998380',
    isbn13: '9786052998380',
    isbn10: '6052998386',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Küçük değişikliklerle kalıcı ve dönüştürücü davranışlar oluşturmak için kanıta dayalı, pratik ve anlaşılır bir yaşam kılavuzu.',
  },
  {
    id: 'ol-the-little-prince',
    workId: 'work-the-little-prince',
    title: 'Küçük Prens',
    originalTitle: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    cover: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
    pages: 96,
    year: 1943,
    category: 'Klasik',
    publisher: 'Can Yayınları',
    isbn: '9789750719356',
    isbn13: '9789750719356',
    isbn10: '9750719359',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Bir çocuğun gözünden büyümeyi, dostluğu, insan sevgisini ve hayatta gerçekten önemli olanı anlatan zamansız bir başyapıt.',
  },
  {
    id: 'ol-kite-runner',
    workId: 'work-kite-runner',
    title: 'Uçurtma Avcısı',
    originalTitle: 'The Kite Runner',
    author: 'Khaled Hosseini',
    cover: 'https://covers.openlibrary.org/b/id/14846827-M.jpg',
    pages: 375,
    year: 2004,
    category: 'Roman',
    publisher: 'Everest Yayınları',
    isbn: '9789752891456',
    isbn13: '9789752891456',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Kabil’de çocukluk dostluğu, derin ihanet ve yıllar süren kefaret üzerine kaleme alınmış sarsıcı ve dokunaklı bir büyüme romanı.',
  },
  {
    id: 'ol-1984',
    workId: 'work-1984',
    title: '1984',
    originalTitle: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    cover: 'https://covers.openlibrary.org/b/id/9267242-M.jpg',
    pages: 352,
    year: 1949,
    category: 'Distopya',
    publisher: 'Can Yayınları',
    isbn: '9789750718533',
    isbn13: '9789750718533',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Büyük Birader’in her adımı gözetlediği, gerçeğin yeniden yazıldığı totaliter bir geleceğin sarsıcı anlatısı.',
  },
  {
    id: 'ol-seker-portakali',
    workId: 'work-seker-portakali',
    title: 'Şeker Portakalı',
    originalTitle: 'O Meu Pé de Laranja Lima',
    author: 'José Mauro de Vasconcelos',
    cover: 'https://covers.openlibrary.org/b/id/10950908-M.jpg',
    pages: 184,
    year: 1968,
    category: 'Dünya Edebiyatı',
    publisher: 'Can Yayınları',
    isbn: '9789750738609',
    isbn13: '9789750738609',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Günün birinde acıyı keşfeden küçük bir çocuğun, Zeze’nin masumiyet dolu sıcacık ve hüzünlü dünyası.',
  },
  {
    id: 'ol-kurk-mantolu-madonna',
    workId: 'work-kurk-mantolu-madonna',
    title: 'Kürk Mantolu Madonna',
    originalTitle: 'Kürk Mantolu Madonna',
    author: 'Sabahattin Ali',
    cover: 'https://covers.openlibrary.org/b/id/10848013-M.jpg',
    pages: 160,
    year: 1943,
    category: 'Türk Edebiyatı',
    publisher: 'Yapı Kredi Yayınları',
    isbn: '9789753638029',
    isbn13: '9789753638029',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Raif Efendi’nin içine kapalı dünyasında gizlediği, Maria Puder ile yaşadığı eşsiz ve unutulmaz tutku hikâyesi.',
  },
  {
    id: 'ol-beyaz-zambaklar-ulkesinde',
    workId: 'work-beyaz-zambaklar-ulkesinde',
    title: 'Beyaz Zambaklar Ülkesinde',
    originalTitle: 'In the Country of White Lilies',
    author: 'Grigory Petrov',
    cover: 'https://covers.openlibrary.org/b/id/10848805-M.jpg',
    pages: 144,
    year: 1923,
    category: 'Eğitim & Toplum',
    publisher: 'Koridor Yayıncılık',
    isbn: '9786054188048',
    isbn13: '9786054188048',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Bataklıklar diyarı Finlandiya’nın milletçe el ele vererek nasıl örnek bir uygarlık haline geldiğinin ilham verici öyküsü.',
  },
  {
    id: 'ol-insan-ne-ile-yasar',
    workId: 'work-insan-ne-ile-yasar',
    title: 'İnsan Ne İle Yaşar?',
    originalTitle: 'What Men Live By',
    author: 'Lev Tolstoy',
    cover: 'https://covers.openlibrary.org/b/id/11725468-M.jpg',
    pages: 96,
    year: 1885,
    category: 'Felsefi Öykü',
    publisher: 'Türkiye İş Bankası Kültür Yayınları',
    isbn: '9789944888066',
    isbn13: '9789944888066',
    language: 'tr',
    hasVerifiedTurkishEdition: true,
    description:
      'Sevgi, iyilik ve insanın varoluş amacını sorgulayan, Tolstoy’un kaleme aldığı zamansız felsefi masallar.',
  }
];

export const upcomingBooks: UpcomingBook[] = [
  {
    id: 'up-1',
    title: 'Gece Yarısı Kütüphanesi 2: Yankılar',
    author: 'Matt Haig',
    publisher: 'Domingo Yayınevi',
    releaseDate: '15 Ekim 2026',
    cover: 'https://covers.openlibrary.org/b/id/10313767-M.jpg',
    pages: 310,
    description: 'Nora Seed’in sonsuz olasılıklar arasındaki yeni yolculuğu ve paralel seçimlerin yankıları.',
    badge: 'Yakında',
    isPreorder: true
  },
  {
    id: 'up-2',
    title: 'Zamanın Ötesindeki Ada',
    author: 'Zülfü Livaneli',
    publisher: 'İnkılâp Kitabevi',
    releaseDate: '28 Eylül 2026',
    cover: 'https://covers.openlibrary.org/b/id/10461167-M.jpg',
    pages: 280,
    description: 'Ege’nin ıssız bir koyunda unutulmuş bir ailenin üç kuşağa yayılan derin sırları ve özgürlük arayışı.',
    badge: 'Yeni Çıkacak',
    isPreorder: true
  },
  {
    id: 'up-3',
    title: 'Yapay Zekâ ve Bilincin Sınırları',
    author: 'Prof. Dr. Sinan Canan',
    publisher: 'Tuti Kitap',
    releaseDate: '5 Ekim 2026',
    cover: 'https://covers.openlibrary.org/b/id/10891870-M.jpg',
    pages: 240,
    description: 'İnsan beyninin evrimi, sentetik düşünce ve 21. yüzyılda insan kalabilmenin nörobiyolojik yolları.',
    badge: 'Ön Sipariş',
    isPreorder: true
  },
  {
    id: 'up-4',
    title: 'Kayıp Zamanın İzinde: Özel Resimli Baskı',
    author: 'Marcel Proust (Çev. Roza Hakmen)',
    publisher: 'Yapı Kredi Yayınları',
    releaseDate: '12 Ekim 2026',
    cover: 'https://covers.openlibrary.org/b/id/12332709-M.jpg',
    pages: 450,
    description: 'Dünya edebiyatının anıt eseri için hazırlanan ilk defa yayımlanacak arşiv gravürlü koleksiyon edisyonu.',
    badge: 'Özel Baskı',
    isPreorder: false
  }
];

export const bookNewsList: BookNews[] = [
  {
    id: 'news-1',
    category: 'odul',
    categoryLabel: 'Edebiyat Ödülü',
    title: '2026 Uluslararası Booker Ödülü Kısa Listesi Açıklandı',
    summary: 'Bu yılın kısa listesinde dünya edebiyatının dört bir yanından altı çarpıcı çeviri roman yer alıyor.',
    content: `Uluslararası Booker Ödülü jürisi bu yılın en dikkat çeken çeviri eserlerinden oluşan 6 kitaplık kısa listeyi kamuoyuyla paylaştı.

Jüri başkanı, bu yılki seçkide özellikle toplumsal hafıza, iklim krizinin birey üzerindeki etkileri ve aile bağlarının dönüştürücü gücünü işleyen metinlerin öne çıktığını belirtti. 

Kazanan eser önümüzdeki ay Londra'da düzenlenecek gala gecesinde açıklanacak ve ödül tutarı yazar ile çevirmen arasında eşit olarak bölüştürülecek.`,
    date: '20 Eylül 2026',
    source: 'Edebiyat Bülteni',
    sourceUrl: 'https://thebookerprizes.com',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'news-2',
    category: 'yazar',
    categoryLabel: 'Yazar Röportajı',
    title: 'Orhan Pamuk Yeni Romanı Üzerinde Çalıştığını Duyurdu',
    summary: 'Nobel ödüllü yazar, İstanbul’un kaybolan zanaatları ve sahaflarını merkeze alan yeni bir roman üzerinde çalıştığını açıkladı.',
    content: `Orhan Pamuk katıldığı söyleşide, son iki yıldır üzerinde titizlikle çalıştığı yeni kurgu projesine dair ipuçları paylaştı.

Yazar, yeni kitabında 1970'ler ile 1990'lar arasındaki Beyoğlu'nun sahaf dükkanlarını, eski elyazması meraklılarını ve unutulmaya yüz tutmuş zanaatkarlarını konu aldığını ifade etti. Romanın 2027 baharında okurla buluşması planlanıyor.`,
    date: '18 Eylül 2026',
    source: 'Kültür & Sanat Masası',
    sourceUrl: 'https://www.orhanpamuk.net',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'news-3',
    category: 'yayinevi',
    categoryLabel: 'Yayınevi Duyurusu',
    title: 'Can Yayınları’ndan Yeni Çeviri Dizisi: “Kayıp Sesler”',
    summary: 'Yayınevi, bugüne dek Türkçeye kazandırılmamış çağdaş Latin Amerika ve Doğu Avrupa eserlerini okurla buluşturuyor.',
    content: `Can Yayınları, dünya edebiyatının gölgede kalmış kıymetli metinlerini kapsayan "Kayıp Sesler" dizisini duyurdu.

Dizinin editörlüğünü üstlenen ekip, ilk etapta 10 kitaptan oluşan bir seçki hazırladıklarını ve ilk üç kitabın Ekim ayında raflarda olacağını belirtti. Kitaplar özgün dillerinden doğrudan Türkçeye aktarılıyor.`,
    date: '15 Eylül 2026',
    source: 'Yayın Dünyası',
    sourceUrl: 'https://canyayinlari.com',
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'news-4',
    category: 'lansman',
    categoryLabel: 'Kitap Lansmanı',
    title: 'İstanbul Kitap Fuarı Bu Yıl “Okuma Kültürü ve Gelecek” Temasıyla Açılıyor',
    summary: 'Kasım ayında kapılarını açacak olan fuarda 800’ü aşkın yayınevi ve yüzlerce imza günü edebiyatseverleri ağırlayacak.',
    content: `Bu yıl 43. kez düzenlenecek olan Uluslararası İstanbul Kitap Fuarı, okuma alışkanlıklarının dijital çağdaki dönüşümüne odaklanacak.

Fuar kapsamında paneller, yazar-okur buluşmaları, atölyeler ve genç okurlar için özel interaktif okuma salonları kurulacak. Girişler öğrenciler ve öğretmenler için ücretsiz olacak.`,
    date: '12 Eylül 2026',
    source: 'Fuar Komitesi',
    sourceUrl: 'https://istanbulkitapfuari.com',
    imageUrl: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&q=80&w=600',
  }
];

export const initialProfile = {
  name: '',
  email: '',
  username: '',
  phone: '',
  emailVerified: true,
  phoneVerified: false,
  dailyGoal: 20,
  reminderEnabled: true,
  reminderTime: '21:00',
  reminderDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  streak: 0,
  longestStreak: 0,
  todayPages: 0,
  todayMinutes: 0,
  todayPagesDate: todayKey(),
  lastActiveDate: todayKey(),
};

export const initialLibrary: import('../types').LibraryBook[] = [];

export const initialReadingLogs: import('../types').ReadingLog[] = [];

export const bookOfTheMonth: import('../types').Book & { month: string; discussionTopic: string } = {
  id: 'bom-2026-09',
  workId: 'work-blindness',
  month: 'Eylül 2026',
  title: 'Körlük',
  originalTitle: 'Ensaio sobre a Cegueira',
  author: 'José Saramago',
  cover: 'https://covers.openlibrary.org/b/id/10482411-M.jpg',
  pages: 336,
  year: 1995,
  category: 'Modern Klasik',
  publisher: 'Kırmızı Kedi Yayınevi',
  isbn: '9786052981320',
  isbn13: '9786052981320',
  language: 'tr',
  hasVerifiedTurkishEdition: true,
  rating: 4.8,
  ratingSource: 'Reader Topluluğu & Goodreads',
  readersCount: 384,
  description:
    'Bilinmeyen bir zamanda, adı belirtilmeyen bir ülkede aniden başlayan bulaşıcı bir beyaz körlük salgını. İnsan doğasının, vicdanın ve medeniyetin sınırlarını zorlayan sarsıcı bir başyapıt.',
  discussionTopic: 'Gözlerimizi kaybetmek mi, yoksa vicdanımızı kaybetmek mi daha tehlikeli?',
};

export const mysteryBooks: import('../types').MysteryBook[] = [
  {
    id: 'myst-1',
    category: 'Felsefi & Psikolojik',
    summary:
      'Gecenin bir yarısı uyanıp kendi varoluşunun anlamsızlığıyla yüzleşen bir adam. Bir cinayet planı kurar; fakat vicdanı, teorisinin önüne geçerek onu adım adım ruhsal bir mahkemeye sürükler.',
    book: {
      id: 'ol-crime-and-punishment',
      workId: 'work-crime-and-punishment',
      title: 'Suç ve Ceza',
      originalTitle: 'Prestupleniye i nakazaniye',
      author: 'Fyodor Dostoyevski',
      cover: 'https://covers.openlibrary.org/b/id/10521404-M.jpg',
      pages: 687,
      year: 1866,
      category: 'Dünya Klasikleri',
      publisher: 'Türkiye İş Bankası Kültür Yayınları',
      isbn: '9789944888240',
      isbn13: '9789944888240',
      language: 'tr',
      hasVerifiedTurkishEdition: true,
      rating: 4.9,
      ratingSource: '4.9 / 5 (Goodreads)',
      readersCount: 1250,
      description: 'Raskolnikov’un iç dünyası, vicdan azabı ve insan doğasının en derin çatışmaları.',
    },
  },
  {
    id: 'myst-2',
    category: 'Kişisel Gelişim & Psikoloji',
    summary:
      'Korkunç bir toplama kampında hayatta kalan bir nörolog ve psikiyatrist, insanın en zor şartlarda dahi acıya bir anlam bularak nasıl ayakta kalabileceğini kendi deneyimleriyle kanıtlıyor.',
    book: {
      id: 'ol-mans-search-for-meaning',
      title: 'İnsanın Anlam Arayışı',
      author: 'Viktor E. Frankl',
      cover: 'https://covers.openlibrary.org/b/id/8516506-M.jpg',
      pages: 172,
      year: 1946,
      category: 'Psikoloji',
      rating: 4.7,
      ratingSource: '4.7 / 5 (Reader Skoru)',
      readersCount: 890,
      description: 'Logoterapinin doğuşu ve insanın her koşulda anlam bulma kudreti.',
    },
  },
  {
    id: 'myst-3',
    category: 'Bilim Kurgu & Felsefe',
    summary:
      'Uzak bir çöl gezegeni, evrenin en değerli baharatı ve kaderinden kaçamayarak devrimci bir mesih haline gelen genç bir dükün görkemli epik yolculuğu.',
    book: {
      id: 'ol-dune',
      title: 'Dune',
      author: 'Frank Herbert',
      cover: 'https://covers.openlibrary.org/b/id/11481354-M.jpg',
      pages: 712,
      year: 1965,
      category: 'Bilim Kurgu',
      rating: 4.8,
      ratingSource: '4.8 / 5 (Goodreads)',
      readersCount: 2100,
      description: 'Arrakis çölünde ekoloji, siyaset, din ve insan bilincinin devasa destanı.',
    },
  },
  {
    id: 'myst-4',
    category: 'Türk Edebiyatı',
    summary:
      'Anadolu’nun unutulmuş bir kasabasına sürgün edilen genç bir öğretmen, köylülerin yabancılığıyla ve kendi içindeki yalnızlıkla savaşırken aşkı ve fedakarlığı keşfeder.',
    book: {
      id: 'ol-calikusu',
      title: 'Çalıkuşu',
      author: 'Reşat Nuri Güntekin',
      cover: 'https://covers.openlibrary.org/b/id/12958080-M.jpg',
      pages: 540,
      year: 1922,
      category: 'Türk Edebiyatı',
      rating: 4.6,
      ratingSource: '4.6 / 5',
      readersCount: 640,
      description: 'Feride’nin hüzünlü ve cesur hayat hikayesi.',
    },
  },
];

export const triviaQuestions: import('../types').TriviaQuestion[] = [
  {
    id: 'triv-1',
    question: '“Bütün mutlu aileler birbirine benzer; her mutsuz ailenin mutsuzluğu kendine göredir.” cümlesiyle başlayan ünlü klasik hangisidir?',
    clue: 'Rus edebiyatının en büyük trajedilerinden biridir.',
    options: ['Anna Karenina', 'Savaş ve Barış', 'Karamazov Kardeşler', 'Babalar ve Oğullar'],
    correctIndex: 0,
    explanation: 'Lev Tolstoy’un başyapıtı Anna Karenina bu meşhur ilk cümleyle başlar.',
  },
  {
    id: 'triv-2',
    question: '“1984” romanında herkesin sürekli olarak izlendiği her şeyi gören lider figürünün adı nedir?',
    clue: 'İngilizcesi “Big Brother”.',
    options: ['O’Brien', 'Büyük Birader', 'Emmanuel Goldstein', 'Winston'],
    correctIndex: 1,
    explanation: 'George Orwell’ın distopyasında toplumu gözetleyen figür “Büyük Birader” (Big Brother)’dır.',
  },
  {
    id: 'triv-3',
    question: 'Kürk Mantolu Madonna romanında başkarakter Raif Efendi’nin Berlin’de aşık olduğu ressam kadının adı nedir?',
    clue: 'Kendi otoportresini sergileyen gizemli bir sanatçıdır.',
    options: ['Maria Puder', 'Madam Bovary', 'Clara', 'Emma'],
    correctIndex: 0,
    explanation: 'Sabahattin Ali’nin unutulmaz karakteri Maria Puder’dir.',
  },
  {
    id: 'triv-4',
    question: 'Küçük Prens gezegeninde en çok hangi canlıyı korumaya özen gösterirdi?',
    clue: 'Dört tane dikeni olan narin bir varlık.',
    options: ['Gül', 'Tilki', 'Yılan', 'Baobab Ağacı'],
    correctIndex: 0,
    explanation: 'Küçük Prens kendi küçük gezegenindeki tek ve eşsiz Gül’ünü fanusla korurdu.',
  },
  {
    id: 'triv-5',
    question: 'Nobel Edebiyat Ödülü’nü alan ilk Türk yazar kimdir?',
    clue: '2006 yılında bu ödüle layık görülmüştür.',
    options: ['Yaşar Kemal', 'Orhan Pamuk', 'Ahmet Hamdi Tanpınar', 'Nazım Hikmet'],
    correctIndex: 1,
    explanation: 'Orhan Pamuk 2006 yılında Nobel Edebiyat Ödülü’nü kazanmıştır.',
  },
];

export const initialSocialPosts: import('../types').SocialPost[] = [];


