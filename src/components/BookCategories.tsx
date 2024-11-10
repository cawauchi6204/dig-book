import { Book, BookOpen, Bookmark, Clock, Crown, History, LucideIcon } from "lucide-react";

// カテゴリーの型定義
type Category = {
  title: string;
  icon: LucideIcon;
  bgColor: string;
};

// カテゴリーデータ
const categories: Category[] = [
  { title: "小説", icon: BookOpen, bgColor: "bg-rose-600" },
  { title: "マンガ", icon: Book, bgColor: "bg-emerald-700" },
  { title: "新刊", icon: Crown, bgColor: "bg-purple-600" },
  { title: "ビジネス", icon: Bookmark, bgColor: "bg-blue-800" },
  { title: "履歴", icon: History, bgColor: "bg-red-800" },
  { title: "ライトノベル", icon: Book, bgColor: "bg-cyan-700" },
  { title: "雑誌", icon: Clock, bgColor: "bg-indigo-900" },
];

const BookCategories = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black pt-10 text-white">
      <p className="text-center mb-10 text-xl">まだ実装中です</p>
      <div className="px-4 grid grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              className={`${category.bgColor} rounded-xl p-4 aspect-[1.6/1] relative overflow-hidden`}
            >
              <span className="text-xl font-bold">{category.title}</span>
              <Icon className="absolute bottom-2 right-2 h-12 w-12 opacity-50" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookCategories;
