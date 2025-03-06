import { books } from "@prisma/client";
import { saveBook } from "../lib/indexedDB";

export function useBookStorage(
  books: books[]
) {
  const handleSwipe = async (direction: string, isbn: string) => {
    const currentItem = books.find((book) => book.isbn === isbn);
    if (!currentItem) return;

    switch (direction) {
      case "up":
        if (currentItem.link) {
          window.open(currentItem.link, "_blank");
        }
        break;
      case "right":
        await addToStorage("liked", currentItem);
        break;
      case "left":
        await addToStorage("nope", currentItem);
        break;
    }
  };

  const addToStorage = async (
    type: 'liked' | 'nope',
    book: books
  ) => {
    try {
      console.log(`🚀 ~ 本を${type === 'liked' ? 'お気に入り' : '興味なし'}に追加:`, book);
      await saveBook(book, type);
      
      // 後方互換性のためにLocalStorageにも保存（移行期間中）
      const key = type === 'liked' ? 'likedBooks' : 'nopeBooks';
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      if (!stored.some((item: books) => item.isbn === book.isbn)) {
        stored.push(book);
        localStorage.setItem(key, JSON.stringify(stored));
      }
    } catch (error) {
      console.error('本の保存に失敗しました:', error);
    }
  };

  return { handleSwipe };
}
