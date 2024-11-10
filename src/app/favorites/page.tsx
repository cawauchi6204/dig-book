'use client'

import { useEffect, useState } from 'react'
import { Book } from '../../../types/Book'
import ProductCard from '../../components/ProductCard'

const getFavoriteProducts = (): Book[] => {
  if (typeof window === 'undefined') return []
  const likedItems = localStorage.getItem('likedItems')
  return likedItems ? JSON.parse(likedItems) : []
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Book[]>([])
  console.log("🚀 ~ FavoritesPage ~ favorites:", favorites)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = getFavoriteProducts()
        setFavorites(data)
      } catch (error) {
        console.error('お気に入りの読み込みに失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="py-16">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-16">
        <h1 className="text-3xl font-bold mb-8">
          お気に入り
        </h1>
        {favorites.length === 0 ? (
          <p className="text-gray-600">お気に入りに登録された商品はありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((book) => (
              <div key={book.id}>
                <ProductCard product={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
