import { createClient } from "@supabase/supabase-js";
const fetch = (await import("node-fetch")).default;
import dotenv from "dotenv";

// ジャンルの型定義
export interface Genre {
  id: string;
  name: string;
  level: number;
}

// reverseGenreMappingの型を定義
type GenreMapping = {
  [key: string]: string;
};

// オブジェクトに型を付与
export const reverseGenreMapping: GenreMapping = {
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
// type RakutenGenreId = keyof typeof reverseGenreMapping;
// type NewGenreId = typeof reverseGenreMapping[RakutenGenreId];

// // 変換関数
const convertToNewGenreId = (rakutenGenreId: string): string => {
  return (reverseGenreMapping[rakutenGenreId] || "");
};

// 下から実際につかう

dotenv.config();

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RakutenBook {
  title: string;
  author: string;
  itemPrice: number;
  booksGenreId: string;
  itemUrl: string;
  largeImageUrl: string;
  itemCaption: string;
  publisherName: string;
  salesDate: string;
  isbn: string;
}

async function fetchBooksFromRakuten(
  genreId: string,
  page: number = 1
): Promise<RakutenBook[]> {
  const url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&booksGenreId=${genreId}&applicationId=${process.env.RAKUTEN_APP_ID}&sort=sales&outOfStockFlag=1&hits=30&page=${page}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(
      `ページ ${page} の楽天APIレスポンス:`,
      JSON.stringify(data, null, 2)
    );
    const items = (data as { Items: { Item: RakutenBook }[] }).Items.map(
      (item) => item.Item
    );
    return items;
  } catch (error) {
    console.error(`ページ ${page} の楽天APIからのデータ取得に失敗:`, error);
    return [];
  }
}

// ジャンルIDを処理する関数を追加
function processGenreIds(booksGenreId: string): string[] {
  // /で分割し、各ジャンルIDの最初の9文字を取得してconvertToNewGenreIdを適用
  return booksGenreId
    .split("/")
    .map((id) => id.slice(0, 9))
    .map((id) => convertToNewGenreId(id))
    .filter((id) => id !== undefined && id !== "") as string[];
}

async function insertBooks(books: RakutenBook[]) {
  for (const book of books) {
    try {
      // データの存在確認
      if (!book.isbn) {
        console.error("ISBNが存在しない本をスキップ:", book);
        continue;
      }

      const { data: existingBook } = await supabase
        .from("books")
        .select()
        .eq("isbn", book.isbn)
        .single();

      if (!existingBook) {
        let published_at = null;
        if (book.salesDate) {
          // 日付文字列から年月日以外の文字を除去
          const dateStr = book.salesDate
            .replace(/年|月|日|頃|上旬|中旬|下旬|予定|発売予定|未定/g, "")
            .trim();

          // 数字のみを抽出
          const dateNumbers = dateStr.match(/\d+/g);

          if (dateNumbers && dateNumbers[0]) {
            const numStr = dateNumbers[0];
            if (numStr.length >= 8) {
              const year = numStr.slice(0, 4);
              const month = numStr.slice(4, 6);
              const day = numStr.slice(6, 8);
              published_at = `${year}-${month}-${day}`;
            }
          }
        }

        // 画像URLのサイズを1200x1200に変更
        const cover = book.largeImageUrl
          ? book.largeImageUrl.replace(/_ex=\d+x\d+/, "_ex=1200x1200")
          : null;

        console.log("🚀 ~ insertBooks ~ bookData:", book);
        // すべての必須フィールドが存在するか確認
        const genres = processGenreIds(book.booksGenreId);

        const bookData = {
          isbn: book.isbn,
          title: book.title || null,
          author: book.author || null,
          price: book.itemPrice || null,
          cover: cover,
          link: book.itemUrl || null,
          content: book.itemCaption || null,
          published_at: published_at,
        };

        // いずれかの値がnullの場合はスキップ
        if (Object.values(bookData).includes(null)) {
          console.log(
            `必須フィールドが不足しているため、以下の本をスキップします:`,
            book.title
          );
          continue;
        }

        console.log("挿入するデータ:", bookData);
        console.log("ジャンル:", genres);

        // const { data: bookResult, error } = await supabase
        //   .from("books")
        //   .insert(bookData)
        //   .select()
        //   .single();

        // if (error) {
        //   console.error("データの挿入に失敗:", error);
        //   continue;
        // }

        // ジャンルの挿入を修正
        // if (genres.length > 0 && bookResult) {
        //   const genreInserts = genres.map(genre => ({
        //     book_id: bookResult.id,
        //     genre_id: genre
        //   }));

        //   const { error: genreError } = await supabase
        //     .from("book_genres")
        //     .insert(genreInserts);

        //   if (genreError) {
        //     console.error("ジャンルの挿入に失敗:", genreError);
        //   }
        // }
      }
    } catch (error) {
      console.error("Supabaseの操作に失敗:", error);
      console.error("問題のある日付データ:", book.salesDate); // デバッグ用
    }
  }
}

async function main() {
  const genreId = "001005006";
  const totalPages = 20; // 取得したいページ数を指定

  for (let page = 1; page <= totalPages; page++) {
    console.log(`ページ ${page} の処理を開始`);
    const books = await fetchBooksFromRakuten(genreId, page);
    await insertBooks(books.slice(0, 1));
    // APIの制限を考慮して、リクエスト間に少し待機時間を入れる
    if (page < totalPages) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main().catch(console.error);
