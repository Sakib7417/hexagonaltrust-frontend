import api from './api';

export interface NewsItem {
  id: string;
  textEn: string;
  textHi: string;
  active: boolean;
  createdAt: string;
}

export interface CreateNewsDto {
  textEn: string;
  textHi: string;
}

export const newsService = {
  // Get all active news items
  getActiveNews: async () => {
    return api.get('/news/active');
  },

  // Get all news (admin)
  getAllNews: async () => {
    return api.get('/news');
  },

  // Create news item (admin)
  createNews: async (data: CreateNewsDto) => {
    return api.post('/news', data);
  },

  // Update news item (admin)
  updateNews: async (id: string, data: Partial<CreateNewsDto> & { active?: boolean }) => {
    return api.put(`/news/${id}`, data);
  },

  // Delete news item (admin)
  deleteNews: async (id: string) => {
    return api.delete(`/news/${id}`);
  },

  // Toggle active status
  toggleNewsStatus: async (id: string, active: boolean) => {
    return api.put(`/news/${id}`, { active });
  },
};
