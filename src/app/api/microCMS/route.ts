import { NextResponse } from 'next/server';
import { client } from '../../../../libs/client';

export async function GET() {
  try {
    const res = await client.get({
      endpoint: process.env.END_POINT || '',
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    throw error;
  }
}