import { Database } from '../../types/supabasetype';

export function useBookStorage(books: Database["public"]["Tables"]["books"]["Row"][]) {
  const handleSwipe = (direction: string, isbn: string) => {
    const currentItem = books.find((book) => book.isbn === isbn);
    if (!currentItem) return;

    switch (direction) {
      case "up":
        if (currentItem.link) {
          window.open(currentItem.link, "_blank");
        }
        break;
      case "right":
        addToStorage("likedBooks", currentItem);
        break;
      case "left":
        addToStorage("nopeBooks", currentItem);
        break;
    }
  };

  const addToStorage = (key: string, book: Book) => {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    if (!stored.some((item: Book) => item.isbn === book.isbn)) {
      stored.push(book);
      localStorage.setItem(key, JSON.stringify(stored));
    }
  };

  return { handleSwipe };
} 