import { NextResponse } from "next/server";

export async function GET(
  { params }: { params: { title: string } }
) {
  const title = params.title;

  if (!title) {
    return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  console.log(`取得するタイトル: ${title}`);

  return NextResponse.json({
    message: "本の情報を取得しました",
    title,
  });
}
