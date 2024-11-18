"use client";

import { genres } from "@/app/constants/genres";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookGenres = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-black pt-10 pb-20 text-white">
      <div className="px-4 py-2">
        <div className="relative mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              className="w-full bg-white rounded-sm pl-10 h-12 text-black"
              placeholder="何を読みたいですか？"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-6 rounded-sm hover:bg-blue-700 transition-colors"
            onClick={() => {
              if (searchQuery.trim()) {
                router.push(
                  `/?search=${encodeURIComponent(searchQuery.trim())}`
                );
              }
            }}
          >
            検索
          </button>
        </div>
      </div>
      <div className="px-4 grid grid-cols-2 gap-4">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.id}
              href={`/?genre=${genre.id}`}
              className={`${genre.bgColor} rounded-sm p-4 aspect-[1.8/1] relative overflow-hidden cursor-pointer`}
            >
              <span className="text-base font-bold">{genre.title}</span>
              <Icon className="absolute bottom-2 right-2 h-10 w-10 opacity-50" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookGenres;
