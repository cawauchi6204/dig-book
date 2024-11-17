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

// 全ての本を取得するGETエンドポイント
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const excludeIsbns = searchParams.get("excludeIsbns");
    const nopeIsbns = searchParams.get("nopeIsbns");

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

    const isbnExcludeList = [
      ...(excludeIsbns ? excludeIsbns.split(",") : []),
      ...(nopeIsbns ? nopeIsbns.split(",") : [])
    ];

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
      take: 3,
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
