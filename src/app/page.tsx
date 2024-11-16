"use client";

import { BookList } from "../components/BookList";
import { Database } from "../../types/supabasetype";
import { useQuery } from "@tanstack/react-query";

function Simple() {
  const queryParams = new URLSearchParams();
  const genre = queryParams.get("genre");
  const { data: books = [], error } = useQuery({
    queryKey: ["books", genre],
    queryFn: async () => {
      // ローカルストレージからlikedBooksを取得
      const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]");
      // likedBooksからISBNの配列を作成
      const likedBookIsbns = likedBooks.map(
        (book: Database["public"]["Tables"]["books"]["Row"]) => book.isbn
      );
      const params = new URLSearchParams();
      if (genre) params.set("genre", genre);
      // likedBookIsbnsが存在する場合、excludeIsbnsクエリパラメータとして追加
      if (likedBookIsbns.length > 0) {
        params.set("excludeIsbns", likedBookIsbns.join(","));
      }
      const response = await fetch(`/api/books?${params.toString()}`);
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
