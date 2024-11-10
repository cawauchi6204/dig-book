import { BookList } from "../components/BookList";
import { cookies } from "next/headers";
import { createClient } from "./utils/supabase/server";

async function Simple() {
  // サーバーサイドでデータを取得
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: books, error } = await supabase.from("books").select();
  if (error) {
    console.error("Error fetching books:", error);
  }

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-10">
        <BookList initialBooks={books || []} />
      </div>
    </div>
  );
}

export default Simple;
