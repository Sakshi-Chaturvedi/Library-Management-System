import api from "./api";

export const authService = {
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },
  verifyOTP: async (otpData) => {
    const response = await api.post("/api/v1/auth/verifyUser", otpData);
    return response.data;
  },
};
