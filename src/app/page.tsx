import { BookList } from "../components/BookList";
import { cookies } from "next/headers";
import { createClient } from "./utils/supabase/server";
import { SwipeGuide } from "@/components/SwipeGuide";

async function Simple() {
  // サーバーサイドでデータを取得
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: books, error } = await supabase.from("books").select();
  console.log("🚀 ~ books:", books);
  console.log("🚀 ~ error:", error);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-[600px] h-[70vh] relative mx-auto pt-6">
        <BookList initialBooks={books || []} />
      </div>
      <SwipeGuide />
    </div>
  );
}

export default Simple;
