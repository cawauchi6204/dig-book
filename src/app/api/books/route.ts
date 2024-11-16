import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 全ての本を取得するGETエンドポイント
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')

    const books = await prisma.books.findMany({
      where: genre ? {
        book_genres: {
          some: {
            genre_id: genre
          }
        }
      } : undefined,
      include: {
        book_genres: {
          include: {
            genres: true
          }
        }
      }
    })
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    )
  }
}

// 新しい本を作成するPOSTエンドポイント
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const book = await prisma.books.create({
      data: {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
      }
    })
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    )
  }
}
