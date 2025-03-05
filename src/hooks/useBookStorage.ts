import { books } from "@prisma/client";

export function useBookStorage(
  books: books[]
) {
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

  const addToStorage = (
    key: string,
    book: books
  ) => {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    if (
      !stored.some(
        (item: books) =>
          item.isbn === book.isbn
      )
    ) {
      console.log("🚀 ~ book:", book)
      stored.push(book);
      localStorage.setItem(key, JSON.stringify(stored));
    }
  };

  return { handleSwipe };
}
