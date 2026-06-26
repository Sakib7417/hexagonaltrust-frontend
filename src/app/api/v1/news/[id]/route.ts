import { NextResponse } from 'next/server';
import { readNews, writeNews } from '@/lib/news-store';

export async function PUT(request: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;
  const body = await request.json();
  const news = await readNews();
  const index = news.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ message: 'News item not found' }, { status: 404 });
  }

  news[index] = {
    ...news[index],
    ...body,
  };

  await writeNews(news);
  return NextResponse.json(news[index]);
}

export async function DELETE(_request: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;
  const news = await readNews();
  const updated = news.filter((item) => item.id !== id);

  if (updated.length === news.length) {
    return NextResponse.json({ message: 'News item not found' }, { status: 404 });
  }

  await writeNews(updated);
  return NextResponse.json({ success: true });
}
