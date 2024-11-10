"use client";

import { useEffect, useState } from "react";
import { BookList } from "../components/BookList";
import { createClient } from "./utils/supabase/client";
import { Database } from "../../database.types";

function Simple() {
  const [books, setBooks] = useState<
    Database["public"]["Tables"]["books"]["Row"][]
  >([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchBooks = async () => {
      const likedBooks = JSON.parse(localStorage.getItem("likedBooks") || "[]");
      const likedBookIds = likedBooks.map(
        (book: Database["public"]["Tables"]["books"]["Row"]) => book.id
      );

      let query = supabase.from("books").select();

      if (likedBookIds.length > 0) {
        query = query.filter("id", "not.in", `(${likedBookIds.join(",")})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching books:", error);
        return;
      }

      setBooks(data || []);
    };

    fetchBooks();
  }, [supabase]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-10">
        <BookList initialBooks={books} />
      </div>
    </div>
  );
}

export default Simple;
