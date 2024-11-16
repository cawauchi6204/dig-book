import { Book, BookOpen, Bookmark, GraduationCap, Computer, Briefcase, Heart, Music, GamepadIcon, BookText, ScrollText, Baby, LucideIcon } from "lucide-react";

// カテゴリーの型定義
type Category = {
  title: string;
  icon: LucideIcon;
  bgColor: string;
};

// カテゴリーデータ
const categories: Category[] = [
  { title: "文学・評論", icon: BookOpen, bgColor: "bg-gradient-to-br from-rose-500 to-rose-700" },
  { title: "コミック", icon: Book, bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700" },
  { title: "ビジネス・経済", icon: Briefcase, bgColor: "bg-gradient-to-br from-blue-500 to-blue-700" },
  { title: "コンピュータ・IT", icon: Computer, bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-700" },
  { title: "資格・検定", icon: GraduationCap, bgColor: "bg-gradient-to-br from-amber-500 to-amber-700" },
  { title: "暮らし・健康", icon: Heart, bgColor: "bg-gradient-to-br from-pink-500 to-pink-700" },
  { title: "ライトノベル", icon: BookText, bgColor: "bg-gradient-to-br from-purple-500 to-purple-700" },
  { title: "絵本・児童書", icon: Baby, bgColor: "bg-gradient-to-br from-green-500 to-green-700" },
  { title: "楽譜・音楽書", icon: Music, bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700" },
  { title: "ゲーム攻略本", icon: GamepadIcon, bgColor: "bg-gradient-to-br from-orange-500 to-orange-700" },
  { title: "雑誌", icon: ScrollText, bgColor: "bg-gradient-to-br from-slate-500 to-slate-700" },
  { title: "新書・文庫", icon: Bookmark, bgColor: "bg-gradient-to-br from-teal-500 to-teal-700" }
];

const BookCategories = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black pt-10 text-white">
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
