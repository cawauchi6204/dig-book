import { useState, useEffect } from "react";
import { Database } from '../../types/supabasetype';

export function useBookList(initialBooks: Database["public"]["Tables"]["books"]["Row"][], onEmpty: () => Promise<Database["public"]["Tables"]["books"]["Row"][]>) {
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