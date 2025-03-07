import { books } from "@prisma/client";
import styles from "./ProductCard.module.css";
import { removeBook } from "../lib/indexedDB";

interface ProductCardProps {
  product: books;
  onRemove?: (id: string) => void;
}

export default function ProductCard({ product, onRemove }: ProductCardProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      // IndexedDBから削除
      await removeBook(product.isbn);

      // 親コンポーネントに通知（UIの更新用）
      onRemove?.(product.isbn);
    } catch (error) {
      console.error("本の削除に失敗しました:", error);
    }
  };

  return (
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
        <div
          className={styles.bookCover}
          style={{
            backgroundImage: `url(${product.cover || "/img/richard.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <div className="mt-3 w-full">
        <h3 className="text-xs font-semibold h-[2rem] leading-4 overflow-hidden text-ellipsis line-clamp-2">
          {product.title}
        </h3>
        <div className="flex md:flex-row flex-col gap-2 h-[40px] mt-2">
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-center px-4 py-1 text-white rounded-md text-sm transition-colors bg-blue-500 hover:bg-blue-600`}
            >
              amazon
            </a>
          )}
          {product.rakuten_link && (
            <a
              href={product.rakuten_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-center px-4 py-1 text-white rounded-md text-sm bg-[#BF0000] hover:bg-[#a00000] transition-colors`}
            >
              rakuten
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
