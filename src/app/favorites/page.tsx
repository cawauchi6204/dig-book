'use client'

import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { Database } from '../../../types/supabasetype'
import { genres } from '../constants/genres'

type Book = Database["public"]["Tables"]["books"]["Row"] & { book_genres: Database["public"]["Tables"]["book_genres"]["Row"][] }

const getFavoriteProducts = (): Book[] => {
  if (typeof window === 'undefined') return []
  const likedBooks = localStorage.getItem('likedBooks')
  return likedBooks ? JSON.parse(likedBooks).reverse() : []
}

const getGenreTitle = (genreId: string): string => {
  const genre = genres.find(genre => genre.id === genreId)
  return genre?.title || 'その他'
}

const groupByGenre = (books: Book[]) => {
  const grouped = books.reduce((acc, book) => {
    const genre = book.book_genres?.[0]?.genre_id || 'other'
    return {
      ...acc,
      [genre]: [...(acc[genre] || []), book]
    }
  }, {} as Record<string, Book[]>)

  return Object.fromEntries(
    Object.entries(grouped).sort((a, b) => {
      if (a[0] === 'other') return 1
      if (b[0] === 'other') return -1
      const indexA = genres.findIndex(cat => cat.id === a[0])
      const indexB = genres.findIndex(cat => cat.id === b[0])
      return indexA - indexB
    })
  )
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedGenres, setExpandedGenres] = useState<Record<string, boolean>>({})

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
        <div className="pt-8 pb-32">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  const groupedFavorites = groupByGenre(favorites)

  const toggleGenreExpand = (genreId: string) => {
    setExpandedGenres(prev => ({
      ...prev,
      [genreId]: !prev[genreId]
    }))
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-16">
        <h1 className="text-3xl font-bold mb-8">
          Your Favorites
        </h1>
        {favorites.length === 0 ? (
          <p className="text-gray-600">お気に入りに登録された商品はありません。</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedFavorites).map(([genreId, books]) => {
              const isExpanded = expandedGenres[genreId]
              const displayBooks = isExpanded ? books : books.slice(0, 9)
              const hasMore = books.length > 9

              return (
                <div key={genreId}>
                  <h2 className="text-2xl font-semibold mb-6">
                    {getGenreTitle(genreId)}
                  </h2>
                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    {displayBooks.map((book) => (
                      <div key={book.isbn}>
                        <ProductCard product={book} />
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => toggleGenreExpand(genreId)}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800"
                      >
                        {isExpanded ? '閉じる' : 'もっと見る'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
