"use client";

import { useSearchParams } from "next/navigation";
import { BookList } from "../components/BookList";
import { Database } from "../../types/supabasetype";
import { useQuery } from "@tanstack/react-query";

function Simple() {
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");
  const { data: books = [], error } = useQuery({
    queryKey: ["books", genre],
    queryFn: async () => {
      const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]");
      const likedBookIsbns = likedBooks.map(
        (book: Database["public"]["Tables"]["books"]["Row"]) => book.isbn
      );

      const params = new URLSearchParams();
      if (genre) params.set("genre", genre);
      if (likedBookIsbns.length > 0) {
        params.set("excludeIsbns", likedBookIsbns.join(","));
      }

      const apiUrl = `/api/books?${params.toString()}`;
      const response = await fetch(apiUrl);
      return response.json();
    },
  });

  if (error) {
    console.error("Error fetching books:", error);
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-10">
        <BookList initialBooks={books} />
      </div>
    </div>
  );
}

export default Simple;
