import api from './api';

export const bookService = {
  getBooks: async (params) => {

    const response = await api.get('/book/getbooks', { params });
    // Assuming backend returns { books: [], currentPage, totalPages }
    return response.data;
  },
  getBook: async (id) => {
    const response = await api.get(`/book/getbook/${id}`);
    return response.data;
  },
  getTrendingBooks: async () => {
    const response = await api.get('/book/trending');
    return response.data;
  },
  getRecentBooks: async () => {
    const response = await api.get('/book/recent');
    return response.data;
  },
  getBorrowedBooks: async () => {
    const response = await api.get('/book/borrowedBooks');
    return response.data;
  },
  getRecommendedBooks: async () => {
    const response = await api.get('/book/recommendations');
    return response.data;
  },
  getBorrowHistory: async () => {
    const response = await api.get('/book/history');
    return response.data;
  },
  borrowBook: async (bookId) => {
    const response = await api.post('/book/borrowBooks', { bookID: bookId });
    return response.data;
  },
  returnBook: async (id) => {
    const response = await api.put(`/book/returnbook/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/admin/adminAnalytics');
    return response.data;
  },
  getAllUsers: async (params) => {
    const response = await api.get('/admin/allUsers', { params });
    return response.data;
  },
  addBook: async (formData) => {
    const response = await api.post('/book/addbook', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateBook: async (id, formData) => {
    const response = await api.put(`/book/updatebook/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/book/deletebook/${id}`);
    return response.data;
  }
};
