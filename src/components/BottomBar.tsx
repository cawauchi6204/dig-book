"use client";

import { useRouter } from "next/navigation";
import { Flame, MessageCircle, User, Heart } from "lucide-react";

export default function BottomBar() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-md">
      <div className="flex h-full font-medium max-w-md mx-auto">
        <button
          onClick={() => router.push("/")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <Flame
            className="w-6 h-6 mb-1 text-[#FD297B] group-hover:text-[#FF5864]"
            fill="#FD297B"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700">
            発見
          </span>
        </button>
        <button
          onClick={() => router.push("/genres")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <MessageCircle
            className="w-6 h-6 mb-1 text-gray-400 group-hover:text-gray-600"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700">
            ジャンル
          </span>
        </button>
        <button
          onClick={() => router.push("/favorites")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <Heart
            className="w-6 h-6 mb-1 text-gray-400 group-hover:text-gray-600"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700">
            お気に入り
          </span>
        </button>
        <button
          onClick={() => router.push("/profile")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <User
            className="w-6 h-6 mb-1 text-gray-400 group-hover:text-gray-600"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700">
            プロフィール
          </span>
        </button>
      </div>
    </div>
  );
}
