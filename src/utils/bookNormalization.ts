import { Book, BookEdition, BookWork } from '../types';

/**
 * Normalizes text for lenient fuzzy and diacritic-insensitive matching.
 */
export const normalizeText = (text?: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Strips hyphens, spaces, and non-alphanumeric characters from ISBNs.
 */
export const cleanISBN = (isbn?: string): string => {
  if (!isbn) return '';
  return isbn.replace(/[^0-9X]/gi, '').toUpperCase();
};

export interface VerifiedWorkDefinition {
  workId: string;
  originalTitle: string;
  author: string;
  category?: string;
  aliases: string[];
  turkishEdition: {
    title: string;
    publisher: string;
    isbn13: string;
    isbn10?: string;
    cover: string;
    pages: number;
    year: number;
    description: string;
  };
  originalEdition?: {
    title: string;
    language: string;
    publisher?: string;
    isbn13?: string;
    isbn10?: string;
    cover?: string;
    pages?: number;
    year?: number;
  };
}

/**
 * Verified Works and Turkish Editions Knowledge Base.
 * Ensures that if a work is referenced by either its original English/foreign title
 * or its Turkish title, it resolves strictly to the SAME verified Turkish edition
 * with matching Turkish cover, Turkish publisher, and Turkish ISBN.
 */
export const VERIFIED_WORKS: VerifiedWorkDefinition[] = [
  {
    workId: 'work-atomic-habits',
    originalTitle: 'Atomic Habits',
    author: 'James Clear',
    category: 'Kişisel Gelişim',
    aliases: ['atomik aliskanliklar', 'atomic habits', 'tiny changes remarkable results', 'james clear'],
    turkishEdition: {
      title: 'Atomik Alışkanlıklar',
      publisher: 'Pegasus Yayınları',
      isbn13: '9786052998380',
      isbn10: '6052998386',
      cover: 'https://covers.openlibrary.org/b/id/12539702-M.jpg',
      pages: 352,
      year: 2020,
      description:
        'Küçük değişikliklerle kalıcı ve dönüştürücü davranışlar oluşturmak için kanıta dayalı, pratik ve anlaşılır bir yaşam kılavuzu.',
    },
    originalEdition: {
      title: 'Atomic Habits',
      language: 'en',
      publisher: 'Avery',
      isbn13: '9780735211292',
      pages: 320,
      year: 2018,
      cover: 'https://covers.openlibrary.org/b/id/12886416-M.jpg',
    },
  },
  {
    workId: 'work-the-little-prince',
    originalTitle: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Klasik',
    aliases: ['kucuk prens', 'the little prince', 'le petit prince', 'saint exupery', 'antoine de saint-exupery'],
    turkishEdition: {
      title: 'Küçük Prens',
      publisher: 'Can Yayınları',
      isbn13: '9789750719356',
      isbn10: '9750719359',
      cover: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
      pages: 96,
      year: 1943,
      description:
        'Bir çocuğun gözünden büyümeyi, dostluğu, insan sevgisini ve hayatta gerçekten önemli olanı anlatan zamansız bir başyapıt.',
    },
    originalEdition: {
      title: 'The Little Prince',
      language: 'fr',
      publisher: 'Reynal & Hitchcock',
      isbn13: '9780156012195',
      pages: 96,
      year: 1943,
      cover: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
    },
  },
  {
    workId: 'work-1984',
    originalTitle: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    category: 'Distopya',
    aliases: ['1984', 'nineteen eighty four', 'bin dokuz yuz seksen dort', 'george orwell', 'buyuk birader'],
    turkishEdition: {
      title: '1984',
      publisher: 'Can Yayınları',
      isbn13: '9789750718533',
      isbn10: '9750718530',
      cover: 'https://covers.openlibrary.org/b/id/9267242-M.jpg',
      pages: 352,
      year: 1949,
      description:
        'Büyük Birader’in her adımı gözetlediği, gerçeğin yeniden yazıldığı totaliter bir geleceğin sarsıcı anlatısı.',
    },
    originalEdition: {
      title: '1984',
      language: 'en',
      publisher: 'Secker & Warburg',
      isbn13: '9780451524935',
      pages: 328,
      year: 1949,
    },
  },
  {
    workId: 'work-animal-farm',
    originalTitle: 'Animal Farm',
    author: 'George Orwell',
    category: 'Klasik',
    aliases: ['hayvan ciftligi', 'animal farm', 'george orwell'],
    turkishEdition: {
      title: 'Hayvan Çiftliği',
      publisher: 'Can Yayınları',
      isbn13: '9789750719387',
      isbn10: '9750719383',
      cover: 'https://covers.openlibrary.org/b/id/10524458-M.jpg',
      pages: 152,
      year: 1945,
      description:
        'Bir çiftlikteki hayvanların insan efendilerine başkaldırışını ve ardından gelen yozlaşmayı anlatan çağdaş bir siyasi hiciv.',
    },
  },
  {
    workId: 'work-kite-runner',
    originalTitle: 'The Kite Runner',
    author: 'Khaled Hosseini',
    category: 'Roman',
    aliases: ['ucurtma avcisi', 'the kite runner', 'khaled hosseini', 'halit huseyni'],
    turkishEdition: {
      title: 'Uçurtma Avcısı',
      publisher: 'Everest Yayınları',
      isbn13: '9789752891456',
      isbn10: '9752891450',
      cover: 'https://covers.openlibrary.org/b/id/14846827-M.jpg',
      pages: 375,
      year: 2004,
      description:
        'Kabil’de çocukluk dostluğu, derin ihanet ve yıllar süren kefaret üzerine kaleme alınmış sarsıcı ve dokunaklı bir büyüme romanı.',
    },
    originalEdition: {
      title: 'The Kite Runner',
      language: 'en',
      publisher: 'Riverhead Books',
      isbn13: '9781594631931',
      pages: 371,
      year: 2003,
    },
  },
  {
    workId: 'work-blindness',
    originalTitle: 'Ensaio sobre a Cegueira',
    author: 'José Saramago',
    category: 'Modern Klasik',
    aliases: ['korluk', 'blindness', 'ensaio sobre a cegueira', 'jose saramago'],
    turkishEdition: {
      title: 'Körlük',
      publisher: 'Kırmızı Kedi Yayınevi',
      isbn13: '9786052981320',
      isbn10: '6052981327',
      cover: 'https://covers.openlibrary.org/b/id/10482411-M.jpg',
      pages: 336,
      year: 1995,
      description:
        'Bilinmeyen bir zamanda başlayan bulaşıcı beyaz körlük salgınıyla medeniyetin sınırlarını sınayan sarsıcı bir başyapıt.',
    },
  },
  {
    workId: 'work-midnight-library',
    originalTitle: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Roman',
    aliases: ['gece yarisi kutuphanesi', 'the midnight library', 'matt haig'],
    turkishEdition: {
      title: 'Gece Yarısı Kütüphanesi',
      publisher: 'Domingo Yayınevi',
      isbn13: '9786051981673',
      isbn10: '6051981676',
      cover: 'https://covers.openlibrary.org/b/id/10313767-M.jpg',
      pages: 296,
      year: 2021,
      description:
        'Yaşamla ölüm arasında yer alan gizemli bir kütüphanede, yaşanmamış pişmanlıkların ve olasılıkların büyülü hikâyesi.',
    },
  },
  {
    workId: 'work-seker-portakali',
    originalTitle: 'O Meu Pé de Laranja Lima',
    author: 'José Mauro de Vasconcelos',
    category: 'Dünya Edebiyatı',
    aliases: ['seker portakali', 'o meu pe de laranja lima', 'my sweet orange tree', 'vasconcelos', 'zeze'],
    turkishEdition: {
      title: 'Şeker Portakalı',
      publisher: 'Can Yayınları',
      isbn13: '9789750738609',
      isbn10: '9750738604',
      cover: 'https://covers.openlibrary.org/b/id/10950908-M.jpg',
      pages: 184,
      year: 1968,
      description:
        'Günün birinde acıyı keşfeden küçük bir çocuğun, Zeze’nin masumiyet dolu sıcacık ve hüzünlü dünyası.',
    },
  },
  {
    workId: 'work-kurk-mantolu-madonna',
    originalTitle: 'Kürk Mantolu Madonna',
    author: 'Sabahattin Ali',
    category: 'Türk Edebiyatı',
    aliases: ['kurk mantolu madonna', 'sabahattin ali', 'raif efendi', 'maria puder'],
    turkishEdition: {
      title: 'Kürk Mantolu Madonna',
      publisher: 'Yapı Kredi Yayınları',
      isbn13: '9789753638029',
      isbn10: '9753638023',
      cover: 'https://covers.openlibrary.org/b/id/10848013-M.jpg',
      pages: 160,
      year: 1943,
      description:
        'Raif Efendi’nin içine kapalı dünyasında gizlediği, Maria Puder ile yaşadığı eşsiz ve unutulmaz tutku hikâyesi.',
    },
  },
  {
    workId: 'work-beyaz-zambaklar-ulkesinde',
    originalTitle: 'In the Country of White Lilies',
    author: 'Grigory Petrov',
    category: 'Eğitim & Toplum',
    aliases: ['beyaz zambaklar ulkesinde', 'grigory petrov', 'finlandiya', 'snellman'],
    turkishEdition: {
      title: 'Beyaz Zambaklar Ülkesinde',
      publisher: 'Koridor Yayıncılık',
      isbn13: '9786054188048',
      isbn10: '6054188047',
      cover: 'https://covers.openlibrary.org/b/id/10848805-M.jpg',
      pages: 144,
      year: 1923,
      description:
        'Bataklıklar diyarı Finlandiya’nın milletçe el ele vererek nasıl örnek bir uygarlık haline geldiğinin ilham verici öyküsü.',
    },
  },
  {
    workId: 'work-insan-ne-ile-yasar',
    originalTitle: 'What Men Live By',
    author: 'Lev Tolstoy',
    category: 'Felsefi Öykü',
    aliases: ['insan ne ile yasar', 'what men live by', 'tolstoy', 'lev tolstoy'],
    turkishEdition: {
      title: 'İnsan Ne İle Yaşar?',
      publisher: 'Türkiye İş Bankası Kültür Yayınları',
      isbn13: '9789944888066',
      isbn10: '9944888065',
      cover: 'https://covers.openlibrary.org/b/id/11725468-M.jpg',
      pages: 96,
      year: 1885,
      description:
        'Sevgi, iyilik ve insanın varoluş amacını sorgulayan, Tolstoy’un kaleme aldığı zamansız felsefi masallar.',
    },
  },
  {
    workId: 'work-metamorphosis',
    originalTitle: 'Die Verwandlung',
    author: 'Franz Kafka',
    category: 'Klasik',
    aliases: ['donusum', 'die verwandlung', 'the metamorphosis', 'franz kafka', 'gregor samsa'],
    turkishEdition: {
      title: 'Dönüşüm',
      publisher: 'Can Yayınları',
      isbn13: '9789750719363',
      isbn10: '9750719367',
      cover: 'https://covers.openlibrary.org/b/id/12535492-M.jpg',
      pages: 104,
      year: 1915,
      description:
        'Bir sabah bunaltıcı düşlerden uyanan Gregor Samsa’nın devasa bir böceğe dönüşmesiyle başlayan sarsıcı yabancılaşma öyküsü.',
    },
  },
  {
    workId: 'work-the-alchemist',
    originalTitle: 'O Alquimista',
    author: 'Paulo Coelho',
    category: 'Modern Klasik',
    aliases: ['simyaci', 'the alchemist', 'o alquimista', 'paulo coelho', 'santiago'],
    turkishEdition: {
      title: 'Simyacı',
      publisher: 'Can Yayınları',
      isbn13: '9789750726439',
      isbn10: '9750726436',
      cover: 'https://covers.openlibrary.org/b/id/8231856-M.jpg',
      pages: 188,
      year: 1988,
      description:
        'Endülüslü çoban Santiago’nun Mısır Piramitleri’ne uzanan kişisel menkıbesi ve rüyalarının peşinden gidişinin felsefi masalı.',
    },
  },
  {
    workId: 'work-crime-and-punishment',
    originalTitle: 'Prestupleniye i nakazaniye',
    author: 'Fyodor Dostoyevski',
    category: 'Klasik',
    aliases: ['suc ve ceza', 'crime and punishment', 'dostoyevski', 'raskolnikov'],
    turkishEdition: {
      title: 'Suç ve Ceza',
      publisher: 'Türkiye İş Bankası Kültür Yayınları',
      isbn13: '9789944888240',
      isbn10: '9944888243',
      cover: 'https://covers.openlibrary.org/b/id/10521404-M.jpg',
      pages: 687,
      year: 1866,
      description:
        'Yoksul bir öğrenci olan Raskolnikov’un işlediği çifte cinayet sonrası vicdan, ahlak ve kefaretle olan amansız psikolojik hesaplaşması.',
    },
  },
  {
    workId: 'work-stranger',
    originalTitle: "L'Étranger",
    author: 'Albert Camus',
    category: 'Klasik',
    aliases: ['yabanci', 'the stranger', 'letranger', 'albert camus', 'meursault'],
    turkishEdition: {
      title: 'Yabancı',
      publisher: 'Can Yayınları',
      isbn13: '9789750738920',
      isbn10: '9750738922',
      cover: 'https://covers.openlibrary.org/b/id/10543261-M.jpg',
      pages: 112,
      year: 1942,
      description:
        'Toplumun dayattığı değer yargılarına kayıtsız kalan Meursault karakteri üzerinden varoluşçu saçmalığı ve yabancılaşmayı anlatan kült roman.',
    },
  },
  {
    workId: 'work-chess',
    originalTitle: 'Schachnovelle',
    author: 'Stefan Zweig',
    category: 'Klasik',
    aliases: ['satranc', 'the royal game', 'schachnovelle', 'stefan zweig', 'chess story'],
    turkishEdition: {
      title: 'Satranç',
      publisher: 'Türkiye İş Bankası Kültür Yayınları',
      isbn13: '9786053606116',
      isbn10: '6053606112',
      cover: 'https://covers.openlibrary.org/b/id/10542385-M.jpg',
      pages: 84,
      year: 1942,
      description:
        'Gestapo sorgusunda tek başına hücre hapsinde kalan bir entelektüelin satranç tutkusuyla zihnini koruma mücadelesi.',
    },
  },
  {
    workId: 'work-letter-from-unknown-woman',
    originalTitle: 'Brief einer Unbekannten',
    author: 'Stefan Zweig',
    category: 'Klasik',
    aliases: ['bilinmeyen bir kadinin mektubu', 'letter from an unknown woman', 'stefan zweig'],
    turkishEdition: {
      title: 'Bilinmeyen Bir Kadının Mektubu',
      publisher: 'Türkiye İş Bankası Kültür Yayınları',
      isbn13: '9786053606628',
      isbn10: '6053606627',
      cover: 'https://covers.openlibrary.org/b/id/10542450-M.jpg',
      pages: 64,
      year: 1922,
      description:
        'Bir kadının hayatı boyunca tek bir adama duyduğu gizli, karşılıksız ve derin aşkı anlatan dokunaklı bir itiraf mektubu.',
    },
  },
  {
    workId: 'work-sapiens',
    originalTitle: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'Tarih & Düşünce',
    aliases: ['sapiens', 'hayvanlardan tanrilara sapiens', 'yuval noah harari'],
    turkishEdition: {
      title: 'Hayvanlardan Tanrılara Sapiens',
      publisher: 'Kolektif Kitap',
      isbn13: '9786055029128',
      isbn10: '6055029120',
      cover: 'https://covers.openlibrary.org/b/id/8302302-M.jpg',
      pages: 412,
      year: 2015,
      description:
        'Önemsiz bir primat türünden dünyayı yöneten bir güce dönüşen Homo sapiens’in yüz bin yıllık evrimsel ve bilişsel serüveni.',
    },
  },
  {
    workId: 'work-brave-new-world',
    originalTitle: 'Brave New World',
    author: 'Aldous Huxley',
    category: 'Distopya',
    aliases: ['cesur yeni dunya', 'brave new world', 'aldous huxley'],
    turkishEdition: {
      title: 'Cesur Yeni Dünya',
      publisher: 'İthaki Yayınları',
      isbn13: '9789756902165',
      isbn10: '9756902163',
      cover: 'https://covers.openlibrary.org/b/id/12711018-M.jpg',
      pages: 272,
      year: 1932,
      description:
        'Biyolojik üreme ve şartlandırma yoluyla acının, sorgulamanın ve bireyselliğin yok edildiği sahte bir istikrar toplumu.',
    },
  },
  {
    workId: 'work-fahrenheit-451',
    originalTitle: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    category: 'Distopya',
    aliases: ['fahrenheit 451', 'ray bradbury', 'guy montag'],
    turkishEdition: {
      title: 'Fahrenheit 451',
      publisher: 'İthaki Yayınları',
      isbn13: '9786053757818',
      isbn10: '6053757811',
      cover: 'https://covers.openlibrary.org/b/id/12555776-M.jpg',
      pages: 208,
      year: 1953,
      description:
        'Kitapların yasaklandığı ve itfaiyecilerin yangın söndürmek yerine kitap yaktığı teknolojik ve sansürcü bir geleceğin öyküsü.',
    },
  },
];

/**
 * 1. Kitap Eşleştirme Önceliği Fonksiyonu (Matching Priority Hierarchy)
 *
 * Sıralama:
 * 1. ISBN-13 eşleşmesi
 * 2. ISBN-10 eşleşmesi
 * 3. Eserin orijinal adı + yazar eşleşmesi
 * 4. Türkçe çevrilmiş kitap adı + yazar eşleşmesi
 * 5. Yazar + yayınevi + yayın yılı ve alias eşleşmesi
 */
export function findVerifiedWork(candidate: {
  title?: string;
  author?: string;
  isbn?: string;
  isbns?: string[];
  publisher?: string;
  year?: number;
}): VerifiedWorkDefinition | null {
  const candidateIsbns = [
    cleanISBN(candidate.isbn),
    ...(candidate.isbns || []).map(cleanISBN),
  ].filter(Boolean);

  // 1. ISBN-13 Eşleşmesi
  for (const work of VERIFIED_WORKS) {
    const trIsbn13 = cleanISBN(work.turkishEdition.isbn13);
    const origIsbn13 = cleanISBN(work.originalEdition?.isbn13);
    if (candidateIsbns.some((isbn) => isbn === trIsbn13 || (origIsbn13 && isbn === origIsbn13))) {
      return work;
    }
  }

  // 2. ISBN-10 Eşleşmesi
  for (const work of VERIFIED_WORKS) {
    const trIsbn10 = cleanISBN(work.turkishEdition.isbn10);
    const origIsbn10 = cleanISBN(work.originalEdition?.isbn10);
    if (candidateIsbns.some((isbn) => (trIsbn10 && isbn === trIsbn10) || (origIsbn10 && isbn === origIsbn10))) {
      return work;
    }
  }

  const normTitle = normalizeText(candidate.title);
  const normAuthor = normalizeText(candidate.author);

  if (!normTitle) return null;

  // 3. Eserin Orijinal Adı + Yazar Eşleşmesi
  for (const work of VERIFIED_WORKS) {
    const normOrig = normalizeText(work.originalTitle);
    const normWorkAuthor = normalizeText(work.author);

    const authorMatches = !normAuthor || normAuthor.includes(normWorkAuthor) || normWorkAuthor.includes(normAuthor);

    if (authorMatches && (normTitle === normOrig || normTitle.includes(normOrig) || normOrig.includes(normTitle))) {
      return work;
    }
  }

  // 4. Türkçe Çevrilmiş Kitap Adı + Yazar Eşleşmesi
  for (const work of VERIFIED_WORKS) {
    const normTr = normalizeText(work.turkishEdition.title);
    const normWorkAuthor = normalizeText(work.author);

    const authorMatches = !normAuthor || normAuthor.includes(normWorkAuthor) || normWorkAuthor.includes(normAuthor);

    if (authorMatches && (normTitle === normTr || normTitle.includes(normTr) || normTr.includes(normTitle))) {
      return work;
    }
  }

  // 5. Yazar + Ek Metadata / Aliases Eşleşmesi
  for (const work of VERIFIED_WORKS) {
    const normWorkAuthor = normalizeText(work.author);
    const authorMatches = !normAuthor || normAuthor.includes(normWorkAuthor) || normWorkAuthor.includes(normAuthor);

    if (authorMatches) {
      for (const alias of work.aliases) {
        const normAlias = normalizeText(alias);
        if (normTitle === normAlias || normTitle.includes(normAlias) || normAlias.includes(normTitle)) {
          return work;
        }
      }
    }
  }

  return null;
}

/**
 * 2 & 3. Normalize single book according to Turkish edition rules.
 *
 * - If verified Turkish edition exists:
 *   display_title = Türkçe kitap adı
 *   cover_image = aynı Türkçe baskının kapağı
 *   publisher = Türkçe yayınevi
 *   isbn = Türkçe baskının ISBN'i
 *   language = 'tr'
 *   originalTitle = Eserin orijinal adı
 *
 * - If verified Turkish edition DOES NOT exist:
 *   Keep verified original edition without fake machine translation or mismatched cover.
 */
export function normalizeBookWithTurkishEdition(raw: Partial<Book> & { isbns?: string[] }): Book {
  const verifiedWork = findVerifiedWork({
    title: raw.title,
    author: raw.author,
    isbn: raw.isbn,
    isbns: raw.isbns,
    publisher: raw.publisher,
    year: raw.year,
  });

  if (verifiedWork) {
    const tr = verifiedWork.turkishEdition;
    const editions: BookEdition[] = [
      {
        id: `${verifiedWork.workId}-tr`,
        title: tr.title,
        language: 'tr',
        isTurkish: true,
        cover: tr.cover,
        isbn: tr.isbn13,
        isbn10: tr.isbn10,
        isbn13: tr.isbn13,
        publisher: tr.publisher,
        pages: tr.pages,
        year: tr.year,
        verifiedCover: true,
      },
    ];

    if (verifiedWork.originalEdition) {
      const orig = verifiedWork.originalEdition;
      editions.push({
        id: `${verifiedWork.workId}-orig`,
        title: orig.title,
        language: orig.language,
        isTurkish: false,
        cover: orig.cover,
        isbn: orig.isbn13,
        isbn10: orig.isbn10,
        isbn13: orig.isbn13,
        publisher: orig.publisher,
        pages: orig.pages,
        year: orig.year,
        verifiedCover: !!orig.cover,
      });
    }

    return {
      id: raw.id || verifiedWork.workId,
      workId: verifiedWork.workId,
      title: tr.title, // Türkçe kitap adı
      originalTitle: verifiedWork.originalTitle, // Orijinal adı
      author: verifiedWork.author,
      cover: tr.cover, // AYNI Türkçe baskıya ait kapak
      publisher: tr.publisher, // Türkçe yayınevi
      isbn: tr.isbn13, // Türkçe ISBN
      isbn10: tr.isbn10,
      isbn13: tr.isbn13,
      pages: tr.pages || raw.pages || 250,
      year: tr.year || raw.year,
      category: verifiedWork.category || raw.category,
      description: tr.description || raw.description,
      language: 'tr',
      hasVerifiedTurkishEdition: true,
      editions,
      aliases: verifiedWork.aliases,
      rating: raw.rating,
      ratingSource: raw.ratingSource,
      readersCount: raw.readersCount,
    };
  }

  // Fallback: Türkçe baskısı doğrulanmamış eser
  // Önemli kural: Makine çevirisi ile sahte başlık/kapak uydurulmaz,
  // mevcut orijinal başlık ve kapağı korunur.
  return {
    id: raw.id || `book-${Date.now()}`,
    title: raw.title || 'İsimsiz Eser',
    originalTitle: raw.originalTitle || raw.title,
    author: raw.author || 'Bilinmeyen Yazar',
    cover: raw.cover,
    pages: raw.pages || 200,
    publisher: raw.publisher,
    isbn: raw.isbn,
    year: raw.year,
    category: raw.category,
    description: raw.description,
    language: raw.language || 'en',
    hasVerifiedTurkishEdition: false,
    rating: raw.rating,
    ratingSource: raw.ratingSource,
    readersCount: raw.readersCount,
  };
}

/**
 * 7. Search in verified works index.
 * Matches across: title_tr, original_title, author, isbn_10, isbn_13, publisher, aliases.
 * If user queries "Atomic Habits" or "Atomik Alışkanlıklar", returns the same Turkish edition.
 */
export function searchInVerifiedWorks(searchQuery: string): Book[] {
  const q = normalizeText(searchQuery);
  const rawQ = searchQuery.trim().toLowerCase();
  const isbnQuery = cleanISBN(searchQuery);

  if (!q && !isbnQuery) return [];

  const matches: Book[] = [];

  for (const work of VERIFIED_WORKS) {
    const trTitle = normalizeText(work.turkishEdition.title);
    const origTitle = normalizeText(work.originalTitle);
    const author = normalizeText(work.author);
    const publisher = normalizeText(work.turkishEdition.publisher);
    const isbn13 = cleanISBN(work.turkishEdition.isbn13);
    const isbn10 = cleanISBN(work.turkishEdition.isbn10);
    const origIsbn13 = cleanISBN(work.originalEdition?.isbn13);

    let isMatch = false;

    // ISBN match
    if (isbnQuery && (isbnQuery === isbn13 || isbnQuery === isbn10 || isbnQuery === origIsbn13)) {
      isMatch = true;
    }

    // Title / Original Title match
    if (!isMatch && (trTitle.includes(q) || origTitle.includes(q) || q.includes(trTitle) || q.includes(origTitle))) {
      isMatch = true;
    }

    // Author match
    if (!isMatch && (author.includes(q) || q.includes(author))) {
      isMatch = true;
    }

    // Publisher match
    if (!isMatch && (publisher.includes(q) || q.includes(publisher))) {
      isMatch = true;
    }

    // Aliases match
    if (!isMatch) {
      for (const alias of work.aliases) {
        if (normalizeText(alias).includes(q) || q.includes(normalizeText(alias))) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      matches.push(
        normalizeBookWithTurkishEdition({
          id: work.workId,
          title: work.turkishEdition.title,
          author: work.author,
          cover: work.turkishEdition.cover,
          pages: work.turkishEdition.pages,
          year: work.turkishEdition.year,
          category: work.category,
          description: work.turkishEdition.description,
        }),
      );
    }
  }

  return matches;
}

/**
 * 8. Deduplicate Books (Duplicate Kontrolü)
 * Merges books belonging to the same work.
 * If "Atomic Habits" and "Atomik Alışkanlıklar" both arrive in search results or catalog,
 * they are merged under a single record prioritized by the verified Turkish edition.
 */
export function deduplicateBooks(books: Book[]): Book[] {
  const seenWorkKeys = new Set<string>();
  const deduplicated: Book[] = [];

  for (const book of books) {
    // Generate work key:
    // If workId is known, use it; otherwise author + base title
    const workKey =
      book.workId ||
      `${normalizeText(book.author)}___${normalizeText(book.originalTitle || book.title)}`;

    if (!seenWorkKeys.has(workKey)) {
      seenWorkKeys.add(workKey);
      deduplicated.push(book);
    } else {
      // If we already saw this work, check if the current one has verified Turkish edition
      const existingIndex = deduplicated.findIndex((b) => {
        const bKey = b.workId || `${normalizeText(b.author)}___${normalizeText(b.originalTitle || b.title)}`;
        return bKey === workKey;
      });

      if (existingIndex >= 0) {
        const existing = deduplicated[existingIndex];
        if (!existing.hasVerifiedTurkishEdition && book.hasVerifiedTurkishEdition) {
          // Replace with verified Turkish edition
          deduplicated[existingIndex] = book;
        }
      }
    }
  }

  return deduplicated;
}
