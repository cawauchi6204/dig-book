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

  if (books.length === 0) {
    return (
      <div className="relative w-[90vw] h-[calc(90vw*1.4)] max-w-[500px] max-h-[700px] mx-auto  bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite] rounded-[5px] shadow-[2px_2px_8px_rgba(0,0,0,0.15)]">
        <div className="absolute inset-0 p-6 flex flex-col gap-4">
          {/* サムネイル部分 */}
          <div className="w-full h-[60%] rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite]" 
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>
    );
  }

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
