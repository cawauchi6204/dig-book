import { BookOpen, Book, Briefcase, Computer, GraduationCap, Heart, BookText, Baby, Music, GamepadIcon, ScrollText, Bookmark, LucideIcon } from "lucide-react";
type Genre = {
  id: string;
  title: string;
  title_en: string;
  icon: LucideIcon;
  bgColor: string;
};

// カテゴリーデータ
export const genres: Genre[] = [
  {
    id: "literature_criticism",
    title: "文学・評論",
    title_en: "Literature & Criticism",
    icon: BookOpen,
    bgColor: "bg-gradient-to-br from-rose-500 to-rose-700",
  },
  {
    id: "comics_manga",
    title: "コミック・漫画",
    title_en: "Comics & Manga",
    icon: Book,
    bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  },
  {
    id: "business_economics",
    title: "ビジネス・経済",
    title_en: "Business & Economics",
    icon: Briefcase,
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
  },
  {
    id: "computer_it",
    title: "コンピュータ・IT",
    title_en: "Computers & IT",
    icon: Computer,
    bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-700",
  },
  {
    id: "career_certification",
    title: "資格・検定",
    title_en: "Career & Certification",
    icon: GraduationCap,
    bgColor: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
  {
    id: "lifestyle_health_parenting",
    title: "暮らし・健康・子育て",
    title_en: "Lifestyle, Health & Parenting",
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
    id: "children_books",
    title: "絵本・児童書",
    title_en: "Children's Books",
    icon: Baby,
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
  },
  {
    id: "sheet_music_scores",
    title: "楽譜・音楽書",
    title_en: "Sheet Music & Scores",
    icon: Music,
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
  },
  {
    id: "game_guides",
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
    id: "paperbacks_novels",
    title: "新書・文庫",
    title_en: "Paperbacks & Novels",
    icon: Bookmark,
    bgColor: "bg-gradient-to-br from-teal-500 to-teal-700",
  },
];