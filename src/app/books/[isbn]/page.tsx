"use client";

import { useEffect, useState } from "react";
import { books } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function BookDetail({ params }: { params: { isbn: string } }) {
  const [book, setBook] = useState<books | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // APIエンドポイントから本の詳細を取得
        const response = await fetch(`/api/books/${params.isbn}`);
        if (!response.ok) {
          throw new Error("本の情報を取得できませんでした");
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.isbn]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-96 bg-gray-200 rounded"></div>
            <div className="w-full md:w-2/3">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </button>
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              本が見つかりませんでした
            </h1>
            <p className="text-gray-600">
              指定されたISBNの本は存在しないか、アクセスできません。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 本の表紙 */}
          <div className="w-full md:w-1/3 relative aspect-[2/3]">
            <Image
              src={book.cover || "/img/richard.jpg"}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="rounded-lg shadow-md object-cover"
            />
          </div>

          {/* 本の詳細情報 */}
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {book.title}
            </h1>
            <p className="text-gray-600 mb-4">
              著者: {book.author || "著者不明"}
            </p>

            {book.published_at && (
              <p className="text-sm text-gray-500 mb-4">
                発売日: {new Date(book.published_at).toLocaleDateString()}
              </p>
            )}

            {book.price && (
              <p className="text-lg font-semibold text-gray-800 mb-4">
                価格: ¥{book.price.toLocaleString()}
              </p>
            )}

            {/* 外部リンク */}
            <div className="flex flex-wrap gap-2 mb-6">
              {/* rakuten_linkプロパティが存在するか確認 */}
              {book.rakuten_link && (
                <a
                  href={book.rakuten_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <span>楽天で見る</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
              {book.link && (
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>詳細を見る</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>

            {/* 本の内容 */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                内容紹介
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: book.content || "内容情報がありません" }}
                className="text-gray-700"
              />
            </div>

            {/* ISBN情報 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
