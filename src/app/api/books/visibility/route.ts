import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// PrismaClientのグローバルインスタンスを作成
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 本の表示/非表示を切り替えるPATCHエンドポイント
export async function PATCH(request: Request) {
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
    const { isbn, isVisible } = body;

    if (!isbn) {
      return NextResponse.json(
        { error: "ISBNが必要です" },
        { status: 400 }
      );
    }

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: "isVisibleはブール値である必要があります" },
        { status: 400 }
      );
    }

    // 本の存在確認
    const existingBook = await prisma.books.findUnique({
      where: { isbn },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: "指定されたISBNの本が見つかりませんでした" },
        { status: 404 }
      );
    }

    // 本の表示/非表示を更新
    const updatedBook = await prisma.books.update({
      where: { isbn },
      data: {
        // @ts-expect-error - is_visible はスキーマに存在するが型定義に反映されていない
        is_visible: isVisible
      },
    });

    return NextResponse.json(updatedBook);

  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: `サーバーエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// 本の表示/非表示状態を取得するGETエンドポイント
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get('isbn');
    const genre = searchParams.get('genre');

    // ISBNが指定されている場合は特定の本の表示/非表示状態を返す
    if (isbn) {
      const book = await prisma.books.findUnique({
        where: { isbn },
        select: {
          isbn: true,
          title: true,
          // @ts-expect-error - is_visible はスキーマに存在するが型定義に反映されていない
          is_visible: true
        },
      });

      if (!book) {
        return NextResponse.json(
          { error: "指定されたISBNの本が見つかりませんでした" },
          { status: 404 }
        );
      }

      return NextResponse.json(book);
    }

    // ジャンルが指定されている場合はそのジャンルの本の表示/非表示状態を返す
    if (genre) {
      const books = await prisma.books.findMany({
        where: {
          book_genres: {
            some: {
              genre_id: genre,
            },
          },
        },
        select: {
          isbn: true,
          title: true,
          author: true,
          cover: true,
          // @ts-expect-error - is_visible はスキーマに存在するが型定義に反映されていない
          is_visible: true,
          published_at: true,
        },
        orderBy: {
          published_at: 'desc',
        },
      });

      return NextResponse.json(books);
    }

    // パラメータが指定されていない場合は全ての本の表示/非表示状態を返す
    const books = await prisma.books.findMany({
      select: {
        isbn: true,
        title: true,
        author: true,
        cover: true,
        // @ts-expect-error - is_visible はスキーマに存在するが型定義に反映されていない
        is_visible: true,
        published_at: true,
        book_genres: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        published_at: 'desc',
      },
    });

    return NextResponse.json(books);

  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: `サーバーエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
