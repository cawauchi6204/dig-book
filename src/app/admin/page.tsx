"use client";

import { useState, useEffect } from "react";
import { genres } from "@/app/constants/genres";
import { Loader2 } from "lucide-react";

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
const updateBookVisibility = async (isbn: string, isVisible: boolean): Promise<boolean> => {
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
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  );
};

// 本のカードコンポーネント
const BookCard = ({ book, onVisibilityChange }: { book: Book; onVisibilityChange: (isbn: string, isVisible: boolean) => Promise<void> }) => {
  const [isVisible, setIsVisible] = useState(book.is_visible);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    const newValue = !isVisible;
    setIsVisible(newValue);
    await onVisibilityChange(book.isbn, newValue);
    setIsUpdating(false);
  };

  return (
    <div className="w-full border rounded-md overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded-sm">
            <img
              src={book.cover || "/img/richard.jpg"}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{book.title}</h3>
            <p className="text-sm text-gray-500">
              {book.author || "著者不明"}
            </p>
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
              isVisible ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm">
            {isVisible ? "表示" : "非表示"}
          </span>
        </div>
        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
      </div>
    </div>
  );
};

// 管理画面のメインコンポーネント
export default function AdminPage() {
  const [activeGenre, setActiveGenre] = useState(genres[0].id);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 選択されたジャンルの本を取得
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      const fetchedBooks = await fetchBooksByGenre(activeGenre);
      setBooks(fetchedBooks);
      setIsLoading(false);
    };

    loadBooks();
  }, [activeGenre]);

  // 本の表示/非表示を更新
  const handleVisibilityChange = async (isbn: string, isVisible: boolean) => {
    const success = await updateBookVisibility(isbn, isVisible);
    
    if (success) {
      setToast({
        message: `「${books.find(b => b.isbn === isbn)?.title}」の表示設定を${isVisible ? '表示' : '非表示'}に変更しました`,
        type: 'success'
      });
      
      // 本のリストを更新
      setBooks(books.map(book => 
        book.isbn === isbn ? { ...book, is_visible: isVisible } : book
      ));
    } else {
      setToast({
        message: "更新に失敗しました。もう一度お試しください。",
        type: 'error'
      });
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {genre.title}
            </button>
          ))}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {genres.find(g => g.id === activeGenre)?.title}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500 py-10">このジャンルには本がありません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  onVisibilityChange={handleVisibilityChange}
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
