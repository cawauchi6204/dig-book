import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// PrismaClientのグローバルインスタンスを作成
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const prisma = new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 本を取得するPOSTエンドポイント
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { genre, excludeIsbns = [], nopeIsbns = [] } = body;

    const whereCondition: {
      book_genres?: {
        some: {
          genre_id: string;
        };
      };
      isbn?: {
        notIn: string[];
      };
    } = {};

    if (genre) {
      whereCondition.book_genres = {
        some: {
          genre_id: String(genre),
        },
      };
    }

    const isbnExcludeList = [...excludeIsbns, ...nopeIsbns];

    if (isbnExcludeList.length > 0) {
      whereCondition.isbn = {
        notIn: isbnExcludeList
      };
    }

    const books = await prisma.books.findMany({
      where: whereCondition,
      include: {
        book_genres: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        published_at: "desc",
      },
      take: 20,
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
