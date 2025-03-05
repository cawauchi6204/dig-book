import { PrismaClient } from "@prisma/client";
const fetch = (await import("node-fetch")).default;
import dotenv from "dotenv";

// ジャンルの型定義
export interface Genre {
  id: string;
  name: string;
  level: number;
}

function getCategory(genreId: string): string {
  // 最初の3-6桁を取得して判定
  const baseId = genreId.slice(0, 6);

  // 本（001）のカテゴリー
  if (baseId.startsWith("001")) {
    const subCategory = baseId.slice(3, 6);

    // 各カテゴリーの判定
    if (subCategory === "001") return "comics_manga"; // 漫画（コミック）
    if (subCategory === "003") return "children_books"; // 絵本・児童書・図鑑
    if (subCategory === "004") return "literature_criticism"; // 小説・エッセイ
    if (subCategory === "005") return "computer_it"; // パソコン・システム開発
    if (subCategory === "006") return "business_economics"; // ビジネス・経済・就職
    if (subCategory === "016") return "career_certification"; // 資格・検定
    if (subCategory === "017") return "light_novels"; // ライトノベル
    if (subCategory === "018") return "sheet_music_scores"; // 楽譜
    if (subCategory === "019") return "paperbacks_novels"; // 文庫
    if (subCategory === "020") return "paperbacks_novels"; // 新書
    if (subCategory === "010") return "lifestyle_health_parenting"; // 美容・暮らし・健康・料理
    if (subCategory === "011" && genreId.includes("005")) return "game_guides"; // ゲーム攻略本
  }

  // 洋書（005）のカテゴリー
  if (baseId.startsWith("005")) {
    const subCategory = baseId.slice(3, 6);

    if (subCategory === "402") return "literature_criticism"; // Fiction & Literature
    if (subCategory === "403") return "business_economics"; // Business & Self-Culture
    if (subCategory === "404" && genreId.includes("009")) return "comics_manga"; // Comics & Graphic Novels
    if (subCategory === "405" && genreId.includes("001")) return "computer_it"; // Computers
    if (subCategory === "407") return "children_books"; // Books for kids
  }

  // 雑誌（007）のカテゴリー
  if (baseId.startsWith("007")) {
    return "magazines"; // すべての雑誌は'magazines'カテゴリーに
  }

  // デフォルトカテゴリーまたは該当なしの場合
  return "";
}

// 既存のconvertToNewGenreId関数を更新
const convertToNewGenreId = (rakutenGenreId: string): string => {
  return getCategory(rakutenGenreId);
};

// 下から実際につかう

dotenv.config();

// Prismaクライアントの初期化
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

// SQLクエリのログ出力設定
prisma.$on("query", (e: { query: string; params: string; duration: number }) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

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
  // Setを使用して重複を排除
  return [
    ...new Set(
      booksGenreId
        .split("/")
        .map((id) => id.slice(0, 9))
        .map((id) => convertToNewGenreId(id))
        .filter((id) => id !== undefined && id !== "")
    ),
  ] as string[];
}

async function insertBooks(books: RakutenBook[]) {
  for (const book of books) {
    try {
      // データの存在確認
      if (!book.isbn) {
        console.error("ISBNが存在しない本をスキップ:", book);
        continue;
      }

      // 画像がnoimageの場合はスキップ
      if (book.largeImageUrl && book.largeImageUrl.includes("noimage")) {
        console.log("画像がnoimageのため、以下の本をスキップします:", book.title);
        continue;
      }

      const existingBook = await prisma.books.findUnique({
        where: {
          isbn: book.isbn
        }
      });

      if (!existingBook) {
        let published_at: Date | null = null;
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
              published_at = new Date(`${year}-${month}-${day}`);
            }
          }
        }

        // 画像URLのサイズを1200x1200に変更
        const cover = book.largeImageUrl
          ? book.largeImageUrl.replace(/_ex=\d+x\d+/, "_ex=1200x1200")
          : null;

        // すべての必須フィールドが存在するか確認
        const genres = processGenreIds(book.booksGenreId);

        const bookData = {
          isbn: book.isbn,
          title: book.title || "",
          author: book.author || null,
          price: book.itemPrice || null,
          cover: cover,
          link: book.itemUrl || null,
          content: book.itemCaption || null,
          published_at: published_at,
          is_visible: true
        };

        // いずれかの値がnullの場合はスキップ
        if (!bookData.title) {
          console.log(
            `必須フィールドが不足しているため、以下の本をスキップします:`,
            book.title
          );
          continue;
        }

        console.log("挿入するデータ:", bookData);
        console.log("ジャンル:", genres);

        const bookResult = await prisma.books.create({
          data: bookData
        });

        if (!bookResult) {
          console.error("データの挿入に失敗");
          continue;
        }

        // ジャンルの挿入
        if (genres.length > 0 && bookResult) {
          const genreInserts = genres.map((genre) => ({
            book_isbn: bookResult.isbn,
            genre_id: genre
          }));

          await prisma.book_genres.createMany({
            data: genreInserts
          });
        }
      }
    } catch (error) {
      console.error("Prismaの操作に失敗:", error);
      console.error("問題のある日付データ:", book.salesDate); // デバッグ用
    }
  }
}

async function main() {
  const genreId = "001006018003";
  const totalPages = 200; // 取得したいページ数を指定

  try {
    for (let page = 1; page <= totalPages; page++) {
      console.log(`ページ ${page} の処理を開始`);
      const books = await fetchBooksFromRakuten(genreId, page);
      await insertBooks(books);
      // APIの制限を考慮して、リクエスト間に少し待機時間を入れる
      if (page < totalPages) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
