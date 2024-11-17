"use client";

import { useRouter } from "next/navigation";

export default function BottomBar() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#121212] border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex h-full font-medium">
        <button
          onClick={() => router.push("/")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <svg
            className="w-5 h-5 mb-2 text-white dark:text-white group-hover:text-white dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="text-sm text-white dark:text-white group-hover:text-white dark:group-hover:text-white">
            Home
          </span>
        </button>
        <button
          onClick={() => router.push("/genres")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <svg
            className="w-5 h-5 mb-2 text-white dark:text-white group-hover:text-white dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 4h4v1H7V4Zm-.5 5a.5.5 0 0 1-1 0V7h1v2Zm5 0a.5.5 0 0 1-1 0V7h1v2Z" />
          </svg>
          <span className="text-sm text-white dark:text-white group-hover:text-white dark:group-hover:text-white">
            Genres
          </span>
        </button>
        <button
          onClick={() => router.push("/favorites")}
          type="button"
          className="w-full inline-flex flex-col items-center justify-center px-5 group"
        >
          <svg
            className="w-5 h-5 mb-2 text-white dark:text-white group-hover:text-white dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 8.19c0-4.3-4.88-6.34-8-3.19C6.88 1.85 2 3.89 2 8.19c0 2.84 2.1 5.12 4.1 6.81L10 19l3.9-4C15.9 13.31 18 11.03 18 8.19z" />
          </svg>
          <span className="text-sm text-white dark:text-white group-hover:text-white dark:group-hover:text-white">
            Favorite
          </span>
        </button>
      </div>
    </div>
  );
}
