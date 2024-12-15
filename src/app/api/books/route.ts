import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = 'edge';

// PrismaClientのグローバルインスタンスを作成
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

// SQLクエリのログ出力設定
prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 本を取得するPOSTエンドポイント
export async function POST(request: Request) {
  try {
    // リクエストボディの検証
    if (!request.body) {
      return NextResponse.json(
        { error: "リクエストボディが必要です" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 必要なパラメータの検証
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

    const isbnExcludeList = [...excludeIsbns, ...nopeIsbns].filter(Boolean); // nullやundefinedを除外

    if (isbnExcludeList.length > 0) {
      whereCondition.isbn = {
        notIn: isbnExcludeList
      };
    }

    // クエリの実行
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
      take: 10,
    });

    if (!books) {
      return NextResponse.json(
        { error: "本が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(books);

  } catch (error) {
    console.error("Error details:", error); // エラーの詳細をログ出力
    return NextResponse.json(
      { error: `サーバーエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
