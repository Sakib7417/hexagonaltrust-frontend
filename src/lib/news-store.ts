import { promises as fs } from 'fs';
import path from 'path';

export interface NewsItem {
  id: string;
  textEn: string;
  textHi: string;
  active: boolean;
  createdAt: string;
}

const dataFolder = path.join(process.cwd(), 'data');
const dataFile = path.join(dataFolder, 'news.json');

async function ensureDataFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(dataFolder, { recursive: true });
    await fs.writeFile(dataFile, '[]', 'utf-8');
  }
}

export async function readNews(): Promise<NewsItem[]> {
  await ensureDataFile();
  const content = await fs.readFile(dataFile, 'utf-8');
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeNews(news: NewsItem[]) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(news, null, 2), 'utf-8');
}

export function createNewsItem(payload: {
  textEn: string;
  textHi: string;
  active?: boolean;
}): NewsItem {
  return {
    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    textEn: payload.textEn,
    textHi: payload.textHi,
    active: payload.active ?? true,
    createdAt: new Date().toISOString(),
  };
}
