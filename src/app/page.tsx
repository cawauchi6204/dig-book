"use client";

import { BookList } from "../components/BookList";
import { books } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { genres } from "@/app/constants/genres";

function Simple() {
  // URLからジャンルを取得
  const queryParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  
  // URLからジャンルを取得するか、localStorageから最後に見たジャンルを取得
  const getInitialGenre = () => {
    const urlGenre = queryParams.get("genre");
    
    // URLにジャンルがある場合はそれを使用
    if (urlGenre) {
      // localStorageに保存
      if (typeof window !== "undefined") {
        localStorage.setItem("lastViewedGenre", urlGenre);
      }
      return urlGenre;
    }
    
    // URLにジャンルがない場合はlocalStorageから取得
    if (typeof window !== "undefined") {
      const savedGenre = localStorage.getItem("lastViewedGenre");
      if (savedGenre) {
        return savedGenre;
      }
    }
    
    // どちらもない場合はundefined
    return undefined;
  };
  
  const genre = getInitialGenre();
  
  // ジャンルIDを日本語表記に変換する関数
  const getGenreTitle = (genreId: string | null | undefined): string => {
    if (!genreId) return "すべてのジャンル";
    
    const genreObj = genres.find(g => g.id === genreId);
    return genreObj ? genreObj.title : genreId;
  };

  const {
    data: books = [],
    error,
    refetch,
  } = useQuery({
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
          (book: books) => book.isbn
        );
        const nopeBookIsbns = nopeBooks.map(
          (book: books) => book.isbn
        );

        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            genre: genre || undefined,
            excludeIsbns: likedBookIsbns,
            nopeIsbns: nopeBookIsbns,
          }),
        });

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
    console.log("新しい本を取得中...");
    const result = await refetch();
    return result.data || [];
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-4">
        {/* ジャンル表示 */}
        <div className="text-center mb-2 bg-white rounded-lg py-1 shadow-sm">
          <p className="text-gray-700 font-medium">
            {genre ? `ジャンル: ${getGenreTitle(genre)}` : "すべてのジャンル"}
          </p>
        </div>
        <BookList initialBooks={books} onEmpty={handleEmpty} />
      </div>
    </div>
  );
}

export default Simple;
