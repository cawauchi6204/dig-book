import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { isbn: string } }
) {
  try {
    const isbn = params.isbn;

    if (!isbn) {
      return NextResponse.json(
        { error: "ISBN is required" },
        { status: 400 }
      );
    }

    const book = await prisma.books.findUnique({
      where: {
        isbn: isbn,
      },
      include: {
        book_genres: {
          include: {
            genres: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
