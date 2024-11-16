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

    // whereの条件を動的に構築
    const whereCondition = {
      book_genres: {
        some: {},
      },
      isbn: {
        notIn: [""],
      }
    };

    if (genre) {
      whereCondition.book_genres = {
        some: {
          genre_id: String(genre),
        },
      };
    }

    if (excludeIsbns) {
      whereCondition.isbn = {
        notIn: excludeIsbns.split(","),
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
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
