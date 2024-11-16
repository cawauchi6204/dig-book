import {
  Book,
  BookOpen,
  Bookmark,
  GraduationCap,
  Computer,
  Briefcase,
  Heart,
  Music,
  GamepadIcon,
  BookText,
  ScrollText,
  Baby,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

// カテゴリーの型定義
type Genre = {
  id: string;
  title: string;
  title_en: string;
  icon: LucideIcon;
  bgColor: string;
};

// カテゴリーデータ
const categories: Genre[] = [
  {
    id: "literature_criticism",
    title: "文学・評論",
    title_en: "Literature & Criticism",
    icon: BookOpen,
    bgColor: "bg-gradient-to-br from-rose-500 to-rose-700",
  },
  {
    id: "comics",
    title: "コミック",
    title_en: "Comics & Manga",
    icon: Book,
    bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  },
  {
    id: "business",
    title: "ビジネス・経済",
    title_en: "Business & Economics",
    icon: Briefcase,
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
  },
  {
    id: "computers",
    title: "コンピュータ・IT",
    title_en: "Computers & IT",
    icon: Computer,
    bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-700",
  },
  {
    id: "certification",
    title: "資格・検定",
    title_en: "Certification & Testing",
    icon: GraduationCap,
    bgColor: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
  {
    id: "lifestyle",
    title: "暮らし・健康",
    title_en: "Lifestyle & Health",
    icon: Heart,
    bgColor: "bg-gradient-to-br from-pink-500 to-pink-700",
  },
  {
    id: "light_novels",
    title: "ライトノベル",
    title_en: "Light Novels",
    icon: BookText,
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
  },
  {
    id: "children",
    title: "絵本・児童書",
    title_en: "Children's Books",
    icon: Baby,
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
  },
  {
    id: "music",
    title: "楽譜・音楽書",
    title_en: "Sheet Music & Music Books",
    icon: Music,
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
  },
  {
    id: "gaming",
    title: "ゲーム攻略本",
    title_en: "Gaming Guides",
    icon: GamepadIcon,
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-700",
  },
  {
    id: "magazines",
    title: "雑誌",
    title_en: "Magazines",
    icon: ScrollText,
    bgColor: "bg-gradient-to-br from-slate-500 to-slate-700",
  },
  {
    id: "paperbacks",
    title: "新書・文庫",
    title_en: "Paperbacks",
    icon: Bookmark,
    bgColor: "bg-gradient-to-br from-teal-500 to-teal-700",
  },
];

const BookCategories = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black pt-10 text-white">
      <div className="px-4 grid grid-cols-2 gap-4">
        {categories.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.id}
              href={`/?genre=${genre.id}`}
              className={`${genre.bgColor} rounded-xl p-4 aspect-[1.6/1] relative overflow-hidden cursor-pointer`}
            >
              <span className="text-xl font-bold">{genre.title}</span>
              <Icon className="absolute bottom-2 right-2 h-12 w-12 opacity-50" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookCategories;
