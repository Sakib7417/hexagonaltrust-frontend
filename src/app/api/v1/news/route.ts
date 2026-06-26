import { NextResponse } from 'next/server';
import { createNewsItem, readNews, writeNews } from '@/lib/news-store';

export async function GET() {
  const news = await readNews();
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.textEn || !body?.textHi) {
    return NextResponse.json({ message: 'Both textEn and textHi are required' }, { status: 400 });
  }

  const news = await readNews();
  const item = createNewsItem({
    textEn: body.textEn,
    textHi: body.textHi,
    active: body.active ?? true,
  });

  news.unshift(item);
  await writeNews(news);

  return NextResponse.json(item, { status: 201 });
}
