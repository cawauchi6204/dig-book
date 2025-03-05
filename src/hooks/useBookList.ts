import { useState, useEffect } from "react";
import { books } from '@prisma/client';

export function useBookList(initialBooks: books[], onEmpty: () => Promise<books[]>) {
  const [books, setBooks] = useState(initialBooks);

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks]);

  const handleOutOfFrame = async (isbn: string) => {
    console.log(isbn + " left the screen!");
    const nextBooks = books.filter((book) => book.isbn !== isbn);
    setBooks(nextBooks);

    if (nextBooks.length === 0) {
      try {
        const newBooks = await onEmpty();
        setBooks(newBooks);
      } catch (error) {
        console.error("新しい本の取得に失敗しました:", error);
      }
    }
  };

  return { books, setBooks, handleOutOfFrame };
}
