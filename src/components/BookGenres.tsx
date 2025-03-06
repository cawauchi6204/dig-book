import { genres } from "@/app/constants/genres";
import Link from "next/link";

const BookGenres = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black pt-10 pb-20 text-white">
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
