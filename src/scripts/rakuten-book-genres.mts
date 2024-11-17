import { genres } from "./rakuten-book-all-genres.mts";

// ジャンルの型定義
export interface Genre {
  id: string;
  name: string;
  level: number;
}

/**
 * 指定された条件でジャンルをフィルタリングする
 * @param options フィルタリングオプション
 * @returns フィルタリングされたジャンルの配列
 */
export function filterGenres(options: {
  level?: number;
  parentId?: string;
  keyword?: string;
}): Genre[] {
  return genres.filter((genre) => {
    // レベルでフィルタリング
    if (options.level !== undefined && genre.level !== options.level) {
      return false;
    }

    // 親IDでフィルタリング
    if (options.parentId !== undefined) {
      const parentLength = options.parentId.length;
      if (
        !genre.id.startsWith(options.parentId) ||
        genre.id.length !== parentLength + 3
      ) {
        return false;
      }
    }

    // キーワードでフィルタリング
    if (options.keyword && !genre.name.includes(options.keyword)) {
      return false;
    }

    return true;
  });
}

/**
 * 指定されたIDのジャンルを取得する
 * @param id ジャンルID
 * @returns ジャンルオブジェクト、存在しない場合はundefined
 */
export function getGenreById(id: string): Genre | undefined {
  return genres.find((genre) => genre.id === id);
}

/**
 * 指定されたジャンルの親ジャンルを取得する
 * @param genre ジャンルオブジェクト
 * @returns 親ジャンルオブジェクト、存在しない場合はundefined
 */
export function getParentGenre(genre: Genre): Genre | undefined {
  if (genre.level === 0) return undefined;
  const parentId = genre.id.slice(0, -3);
  return getGenreById(parentId);
}

/**
 * 指定されたジャンルの子ジャンルを取得する
 * @param genre ジャンルオブジェクト
 * @returns 子ジャンルの配列
 */
export function getChildGenres(genre: Genre): Genre[] {
  return filterGenres({ parentId: genre.id });
}

// 使用例
// // レベル1のジャンルを全て取得
// const level1Genres = filterGenres({ level: 1 });

// // 「本」カテゴリ（ID: 001）の子ジャンルを取得
// const bookGenres = filterGenres({ parentId: '001' });

// // 「RPG」を含むジャンルを検索
// const rpgGenres = filterGenres({ keyword: 'RPG' });

// // 特定のジャンルの親ジャンルを取得
// const genre = getGenreById('001001'); // 漫画（コミック）
// const parentGenre = getParentGenre(genre!); // 本
export const genreMapping = {
  // 文学・評論
  literature_criticism: [
    "001004008",
    "001004009",
    "001004003",
    "005402001",
    "005402002",
    "005402004",
    "005402005",
    "005402006",
  ],

  // 人文・思想
  philosophy_thought: ["001008", "005406003", "005406004"],

  // 社会・政治･法律
  society_politics_law: ["005406005", "005406008", "005406002"],

  // ノンフィクション
  non_fiction: ["001004004"],

  // 歴史・地理
  history_geography: ["005406001"],

  // ビジネス・経済
  business_economics: [
    "001006001",
    "001006002",
    "001006018",
    "001006019",
    "005403001",
  ],

  // 投資・金融・会社経営
  investment_finance_management: ["001006005", "001006024", "001006007"],

  // 科学・テクノロジー
  science_technology: ["001012", "005405005", "005405006"],

  // 医学・薬学・看護学・歯科学
  medicine_healthcare: ["005405003"],

  // コンピュータ・IT
  computer_it: ["001005", "005405001"],

  // アート・建築・デザイン
  art_architecture_design: ["005401001", "005401002", "005401003"],

  // 趣味・実用
  hobbies_practical: ["001009", "005401004"],

  // スポーツ・アウトドア
  sports_outdoors: ["005404008"],

  // 資格・検定・就職
  career_certification: [
    "001006010",
    "001006013",
    "001006014",
    "001006015",
    "001006016",
  ],

  // 暮らし・健康・子育て
  lifestyle_health_parenting: ["005404003", "005404005", "005404006"],

  // 旅行ガイド・マップ
  travel_guides_maps: ["005409002"],

  // 語学・辞事典・年鑑
  language_reference: ["005408003", "005408004"],

  // 英語学習
  english_learning: ["005408004"],

  // 教育・学参・受験
  education_study_guides: ["005404002", "005408002"],

  // 絵本・児童書
  children_books: ["005407001", "005407002"],

  // コミック
  comics_manga: ["001001", "005404009"],

  // ライトノベル
  light_novels: ["001017"],

  // 雑誌
  magazines: ["007"],
} as const;

export const reverseGenreMapping = {
  // 文学・評論 (Literature & Criticism)
  "001004008": "literature_criticism",
  "001004009": "literature_criticism",
  "001004003": "literature_criticism",
  "005402001": "literature_criticism",
  "005402002": "literature_criticism",
  "005402004": "literature_criticism",
  "005402005": "literature_criticism",
  "005402006": "literature_criticism",

  // 人文・思想 (Philosophy & Thought)
  "001008": "philosophy_thought",
  "005406003": "philosophy_thought",
  "005406004": "philosophy_thought",

  // 社会・政治･法律 (Society, Politics & Law)
  "005406005": "society_politics_law",
  "005406008": "society_politics_law",
  "005406002": "society_politics_law",

  // ノンフィクション (Non-fiction)
  "001004004": "non_fiction",

  // 歴史・地理 (History & Geography)
  "005406001": "history_geography",

  // ビジネス・経済 (Business & Economics)
  "001006001": "business_economics",
  "001006002": "business_economics",
  "001006018": "business_economics",
  "001006019": "business_economics",
  "005403001": "business_economics",

  // 投資・金融・会社経営 (Investment, Finance & Management)
  "001006005": "investment_finance_management",
  "001006024": "investment_finance_management",
  "001006007": "investment_finance_management",

  // 科学・テクノロジー (Science & Technology)
  "001012": "science_technology",
  "005405005": "science_technology",
  "005405006": "science_technology",

  // 医学・薬学・看護学・歯科学 (Medicine & Healthcare)
  "005405003": "medicine_healthcare",

  // コンピュータ・IT (Computer & IT)
  "001005": "computer_it",
  "005405001": "computer_it",

  // アート・建築・デザイン (Art, Architecture & Design)
  "005401001": "art_architecture_design",
  "005401002": "art_architecture_design",
  "005401003": "art_architecture_design",

  // 趣味・実用 (Hobbies & Practical)
  "001009": "hobbies_practical",
  "005401004": "hobbies_practical",

  // スポーツ・アウトドア (Sports & Outdoors)
  "005404008": "sports_outdoors",

  // 資格・検定・就職 (Career & Certification)
  "001006010": "career_certification",
  "001006013": "career_certification",
  "001006014": "career_certification",
  "001006015": "career_certification",
  "001006016": "career_certification",

  // 暮らし・健康・子育て (Lifestyle, Health & Parenting)
  "005404003": "lifestyle_health_parenting",
  "005404005": "lifestyle_health_parenting",
  "005404006": "lifestyle_health_parenting",

  // 旅行ガイド・マップ (Travel Guides & Maps)
  "005409002": "travel_guides_maps",

  // 語学・辞事典・年鑑 (Language & Reference)
  "005408003": "language_reference",
  "005408004": "language_reference",

  // 教育・学参・受験 (Education & Study Guides)
  "005404002": "education_study_guides",
  "005408002": "education_study_guides",

  // 絵本・児童書 (Children's Books)
  "005407001": "children_books",
  "005407002": "children_books",

  // コミック (Comics & Manga)
  "001001": "comics_manga",
  "005404009": "comics_manga",

  // ライトノベル (Light Novels)
  "001017": "light_novels",

  // 雑誌 (Magazines)
  "007": "magazines",
} as const;

// 型定義
export type RakutenGenreId = keyof typeof reverseGenreMapping;
export type NewGenreId = typeof reverseGenreMapping[RakutenGenreId];

// 変換関数
export function convertToNewGenreId(rakutenGenreId: string): NewGenreId | undefined {
  return reverseGenreMapping[rakutenGenreId as RakutenGenreId];
}

