import api from "./api";

export const bookService = {
  getBooks: async (params) => {
    const response = await api.get("/api/v1/book/getbooks", { params });
    return response.data;
  },

  getBook: async (id) => {
    const response = await api.get(`/api/v1/book/getbook/${id}`);
    return response.data;
  },

  getTrendingBooks: async () => {
    const response = await api.get("/api/v1/book/trending");
    return response.data;
  },

  getRecentBooks: async () => {
    const response = await api.get("/api/v1/book/recent");
    return response.data;
  },

  getBorrowedBooks: async () => {
    const response = await api.get("/api/v1/book/borrowedBooks");
    return response.data;
  },

  getRecommendedBooks: async () => {
    const response = await api.get("/api/v1/book/recommendations");
    return response.data;
  },

  getBorrowHistory: async () => {
    const response = await api.get("/api/v1/book/history");
    return response.data;
  },

  borrowBook: async (bookId) => {
    const response = await api.post("/api/v1/book/borrowBooks", {
      bookID: bookId,
    });
    return response.data;
  },

  returnBook: async (id) => {
    const response = await api.put(`/api/v1/book/returnbook/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/api/v1/admin/adminAnalytics");
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await api.get("/api/v1/admin/allUsers", { params });
    return response.data;
  },

  addBook: async (formData) => {
    const response = await api.post("/api/v1/book/addbook", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateBook: async (id, formData) => {
    const response = await api.put(`/api/v1/book/updatebook/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/api/v1/book/deletebook/${id}`);
    return response.data;
  },
};
