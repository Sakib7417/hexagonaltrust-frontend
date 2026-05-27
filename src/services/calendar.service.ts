import api from './api';

export const calendarService = {
  // Get user's calendar
  getCalendar: async (page = 1, limit = 20) => {
    const response = await api.get('/user/calendar', { params: { page, limit } });
    return response.data;
  },
};
