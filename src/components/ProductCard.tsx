import Image from "next/image";
import { Book } from "../../types/Book";

interface ProductCardProps {
  product: Book;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a href={`${product.link}`}>
      <div className="transition-transform flex flex-col items-center w-full">
        <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-[5px_5px_10px_rgba(0,0,0,0.3)]">
          <Image
            src={product.cover[0].url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="mt-3">
          <h3 className="text-lg font-semibold line-clamp-2">
            {product.title}
          </h3>
        </div>
      </div>
    </a>
  );
}
