import { createClient } from "@supabase/supabase-js";
const fetch = (await import('node-fetch')).default;
import dotenv from "dotenv";

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
  itemUrl: string;
  largeImageUrl: string;
  itemCaption: string;
  publisherName: string;
  salesDate: string;
  isbn: string;
}

async function fetchBooksFromRakuten(genreId: string, page: number = 1): Promise<RakutenBook[]> {
  const url = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&booksGenreId=${genreId}&applicationId=${process.env.RAKUTEN_APP_ID}&sort=sales&outOfStockFlag=1&hits=30&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`ページ ${page} の楽天APIレスポンス:`, JSON.stringify(data, null, 2));
    const items = (data as { Items: { Item: RakutenBook }[] }).Items.map(
      (item) => item.Item
    );
    return items;
  } catch (error) {
    console.error(`ページ ${page} の楽天APIからのデータ取得に失敗:`, error);
    return [];
  }
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

        // すべての必須フィールドが存在するか確認
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
          console.log(`必須フィールドが不足しているため、以下の本をスキップします:`, book.title);
          continue;
        }

        console.log("挿入するデータ:", bookData);

        const { error } = await supabase.from("books").insert(bookData);

        if (error) {
          console.error("データの挿入に失敗:", error);
        }
      }
    } catch (error) {
      console.error("Supabaseの操作に失敗:", error);
      console.error("問題のある日付データ:", book.salesDate); // デバッグ用
    }
  }
}

async function main() {
  const genreId = "001006004004";
  const totalPages = 40; // 取得したいページ数を指定

  for (let page = 1; page <= totalPages; page++) {
    console.log(`ページ ${page} の処理を開始`);
    const books = await fetchBooksFromRakuten(genreId, page);
    await insertBooks(books);
    // APIの制限を考慮して、リクエスト間に少し待機時間を入れる
    if (page < totalPages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main().catch(console.error);
