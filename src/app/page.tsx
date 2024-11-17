"use client";

import { BookList } from "../components/BookList";
import { Database } from "../../types/supabasetype";
import { useQuery } from "@tanstack/react-query";

function Simple() {
  const queryParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const genre = queryParams.get("genre");
  const { data: books = [], error, refetch } = useQuery({
    queryKey: ["books", genre],
    queryFn: async () => {
      try {
        // ローカルストレージのアクセスをtry-catchで囲む
        const likedBooks = (() => {
          try {
            return JSON.parse(localStorage.getItem("likedBooks") || "[]");
          } catch {
            return [];
          }
        })();

        const nopeBooks = (() => {
          try {
            return JSON.parse(localStorage.getItem("nopeBooks") || "[]");
          } catch {
            return [];
          }
        })();

        // likedBooksとnopeBooksからISBNの配列を作成
        const likedBookIsbns = likedBooks.map(
          (book: Database["public"]["Tables"]["books"]["Row"]) => book.isbn
        );
        const nopeBookIsbns = nopeBooks.map(
          (book: Database["public"]["Tables"]["books"]["Row"]) => book.isbn
        );

        const params = new URLSearchParams();
        if (genre) params.set("genre", genre);
        if (likedBookIsbns.length > 0) {
          params.set("excludeIsbns", likedBookIsbns.join(","));
        }
        if (nopeBookIsbns.length > 0) {
          params.set("nopeIsbns", nopeBookIsbns.join(","));
        }

        // APIのベースURLを明示的に指定
        const apiUrl = `/api/books?${params.toString()}`;
        console.log("API URL:", apiUrl);  // デバッグ用
        const response = await fetch(apiUrl);
        return response.json();
      } catch (error) {
        console.error("Error in queryFn:", error);
        return [];
      }
    },
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.error("Error fetching books:", error);
  }

  const handleEmpty = async () => {
    console.log('Cards empty, fetching new books...');
    const result = await refetch();
    return result.data || [];
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-10">
        <BookList 
          initialBooks={books} 
          onEmpty={handleEmpty}
        />
      </div>
    </div>
  );
}

export default Simple;
