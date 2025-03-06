"use client";

import { useState, useEffect, useRef } from "react";
import { genres } from "@/app/constants/genres";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// 本の型定義
interface Book {
  isbn: string;
  title: string;
  author?: string | null;
  cover?: string | null;
  is_visible: boolean;
  published_at?: Date | null;
}

// ジャンルの本を取得する関数
const fetchBooksByGenre = async (genreId: string): Promise<Book[]> => {
  try {
    const response = await fetch(`/api/books/visibility?genre=${genreId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

// 本の表示/非表示を更新する関数
const updateBookVisibility = async (
  isbn: string,
  isVisible: boolean
): Promise<boolean> => {
  try {
    const response = await fetch("/api/books/visibility", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isbn, isVisible }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating book visibility:", error);
    return false;
  }
};

// トースト通知コンポーネント
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {message}
    </div>
  );
};

// 本のカードコンポーネント
const BookCard = ({
  book,
  onVisibilityChange,
  isFocused = false,
  isUpdating = false,
  cardRef,
}: {
  book: Book;
  onVisibilityChange: (isbn: string, isVisible: boolean) => Promise<void>;
  isFocused?: boolean;
  isUpdating?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}) => {
  const handleToggle = () => {
    // 更新処理は親コンポーネントに委譲
    const newValue = !book.is_visible;
    onVisibilityChange(book.isbn, newValue);
  };

  return (
    <div
      ref={isFocused ? cardRef : undefined}
      className={`w-full border rounded-md overflow-hidden shadow-sm ${
        isFocused ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
      tabIndex={isFocused ? 0 : -1}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded-sm relative">
            <Image
              src={book.cover || "/img/richard.jpg"}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 80px, 112px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author || "著者不明"}</p>
            <p className="text-xs text-gray-400 mt-1">
              {book.published_at
                ? new Date(book.published_at).toLocaleDateString()
                : "発売日不明"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-between items-center border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              book.is_visible ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                book.is_visible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm">{book.is_visible ? "表示" : "非表示"}</span>
        </div>
        {isUpdating && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        )}
      </div>
    </div>
  );
};

// 管理画面のメインコンポーネント
export default function AdminPage() {
  const [activeGenre, setActiveGenre] = useState(genres[0].id);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [updatingIsbn, setUpdatingIsbn] = useState<string | null>(null);
  const booksRef = useRef<Book[]>([]);
  const focusedCardRef = useRef<HTMLDivElement>(null);
  
  // booksの値が変わったらrefを更新
  useEffect(() => {
    booksRef.current = books;
  }, [books]);
  
  // フォーカスが変わったときに、その要素が画面の中央に来るようにスクロール
  useEffect(() => {
    if (focusedCardRef.current) {
      // スムーズにスクロール
      focusedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // 要素が画面の中央に来るようにスクロール
      });
    }
  }, [focusedIndex]);

  // 選択されたジャンルの本を取得
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      const fetchedBooks = await fetchBooksByGenre(activeGenre);

      // 出版日の降順でソート（最新の本が上に表示される）
      const sortedBooks = [...fetchedBooks].sort((a, b) => {
        // published_atがnullの場合は最後に表示
        if (!a.published_at) return 1;
        if (!b.published_at) return -1;

        // 日付を比較して降順にソート
        return (
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
        );
      });

      setBooks(sortedBooks);
      setIsLoading(false);
      // 本がロードされたら最初の本にフォーカスを設定
      if (sortedBooks.length > 0) {
        setFocusedIndex(0);
      } else {
        setFocusedIndex(-1);
      }
    };

    loadBooks();
  }, [activeGenre]);

  // キーボードナビゲーションの設定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentBooks = booksRef.current;
      if (currentBooks.length === 0) return;

      switch (e.key) {
        case "ArrowRight":
          // 右矢印キー：次の本にフォーカス
          setFocusedIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex < currentBooks.length ? nextIndex : prev;
          });
          e.preventDefault();
          break;
        case "ArrowLeft":
          // 左矢印キー：前の本にフォーカス
          setFocusedIndex((prev) => {
            const nextIndex = prev - 1;
            return nextIndex >= 0 ? nextIndex : prev;
          });
          e.preventDefault();
          break;
        case "ArrowDown":
          // 下矢印キー：下の行の本にフォーカス（1行に3冊表示の場合）
          setFocusedIndex((prev) => {
            const rowSize =
              window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            const nextIndex = prev + rowSize;
            return nextIndex < currentBooks.length ? nextIndex : prev;
          });
          e.preventDefault();
          break;
        case "ArrowUp":
          // 上矢印キー：上の行の本にフォーカス
          setFocusedIndex((prev) => {
            const rowSize =
              window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            const nextIndex = prev - rowSize;
            return nextIndex >= 0 ? nextIndex : prev;
          });
          e.preventDefault();
          break;
        case "a":
          // aキー：表示/非表示を切り替え
          if (focusedIndex >= 0 && focusedIndex < currentBooks.length) {
            const book = currentBooks[focusedIndex];
            handleVisibilityChange(book.isbn, !book.is_visible);
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex]); // booksの依存関係を削除

  // 本の表示/非表示を更新
  const handleVisibilityChange = async (isbn: string, isVisible: boolean) => {
    // 更新中の状態を設定
    setUpdatingIsbn(isbn);

    // 先に状態を更新してUIの応答性を向上
    const bookTitle = books.find((b) => b.isbn === isbn)?.title || "";

    // 本のリストを更新（先に更新してUIの応答性を向上）
    setBooks(
      books.map((book) =>
        book.isbn === isbn ? { ...book, is_visible: isVisible } : book
      )
    );

    try {
      // APIリクエストを非同期で実行
      const success = await updateBookVisibility(isbn, isVisible);

      if (success) {
        setToast({
          message: `「${bookTitle}」の表示設定を${
            isVisible ? "表示" : "非表示"
          }に変更しました`,
          type: "success",
        });
      } else {
        // 失敗した場合は元の状態に戻す
        setBooks(
          books.map((book) =>
            book.isbn === isbn ? { ...book, is_visible: !isVisible } : book
          )
        );

        setToast({
          message: "更新に失敗しました。もう一度お試しください。",
          type: "error",
        });
      }
    } finally {
      // 更新完了
      setUpdatingIsbn(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">本の管理画面</h1>

      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={`py-2 px-4 text-sm rounded-md transition-colors ${
                activeGenre === genre.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {genre.title}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            {genres.find((g) => g.id === activeGenre)?.title}
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              このジャンルには本がありません
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book, index) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  onVisibilityChange={handleVisibilityChange}
                  isFocused={index === focusedIndex}
                  isUpdating={updatingIsbn === book.isbn}
                  cardRef={focusedCardRef}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
