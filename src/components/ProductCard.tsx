import Image from "next/image";
import { Database } from "../../types/supabasetype";
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Database["public"]["Tables"]["books"]["Row"];
  onRemove?: (id: string) => void;
}

export default function ProductCard({ product, onRemove }: ProductCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onRemove?.(product.isbn);
  };

  return (
    <a href={`${product.link}`} target="_blank" rel="noopener noreferrer">
      <div className="transition-transform flex flex-col items-center w-full relative">
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <span className="text-gray-600 text-sm">×</span>
          </button>
        )}
        <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-[5px_5px_10px_rgba(0,0,0,0.3)]">
          <div className={styles.bookCover}>
            <Image
              src={product.cover ?? ""}
              alt={product.title ?? ""}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-xs font-semibold line-clamp-2 min-h-[2rem] leading-4">
            {product.title}
          </h3>
          <button className={`mt-2 px-4 py-1 text-white rounded-md text-sm transition-colors ${
            product.link?.includes('rakuten') 
              ? 'bg-[#BF0000] hover:bg-[#a00000]' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}>
            {product.link?.includes('rakuten') ? 'buy rakuten' : 'buy amazon'}
          </button>
        </div>
      </div>
    </a>
  );
}
