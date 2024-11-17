"use client";
import React from "react";
import { BookCard } from "@/components/BookCard";
import { Database } from "../../types/supabasetype";
import { useBookList } from "@/hooks/useBookList";
import { useFlipCard } from "@/hooks/useFlipCard";
import { useBookStorage } from "@/hooks/useBookStorage";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Props = {
  initialBooks: Book[];
  onEmpty: () => Promise<Book[]>;
};

export function BookList({ initialBooks, onEmpty }: Props) {
  const { books, handleOutOfFrame } = useBookList(initialBooks, onEmpty);
  const { flipped, handleInteraction } = useFlipCard();
  const { handleSwipe } = useBookStorage(books);

  return (
    <>
      {books.map((book) => (
        <BookCard
          key={book.isbn}
          character={book}
          flipped={flipped}
          onSwipe={handleSwipe}
          onCardLeftScreen={handleOutOfFrame}
          onInteraction={handleInteraction}
        />
      ))}
    </>
  );
}
