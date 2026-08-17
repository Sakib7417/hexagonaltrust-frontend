import api from './api';

export const membershipService = {
  // Submit membership form
  submitForm: async (formData: any) => {
    const response = await api.post('/membership', formData);
    return response.data;
  },

  // Get user's membership form
  getForm: async () => {
    const response = await api.get('/membership');
    return response.data;
  },

  // Get all membership forms (Admin)
  getAllForms: async (page = 1, limit = 10, search?: string) => {
    const params: any = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/membership/all', { params });
    return response.data;
  },

  // Update a membership form by id (Admin)
  updateForm: async (id: string, formData: any) => {
    const response = await api.put(`/membership/${id}`, formData);
    return response.data;
  },
};
