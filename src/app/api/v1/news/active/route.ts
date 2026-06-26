import { NextResponse } from 'next/server';
import { readNews } from '@/lib/news-store';

export async function GET() {
  const news = await readNews();
  const activeNews = news.filter((item) => item.active);
  return NextResponse.json(activeNews);
}
