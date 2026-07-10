import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1',
  withCredentials: true, // ikiwa unatumia cookies pia
});

// Request interceptor - inaongeza tokeni kwenye headers
apiClient.interceptors.request.use(
  (config) => {
    // Chukua tokeni kutoka localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - inashughulikia 401 kwa mfano
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Ikiwa kuna 401 na ombi halijajaribu tena
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Unaweza kuongeza logic ya refresh token hapa
      // Kwa sasa, futa tokeni na uelekeze kwenye login
      localStorage.removeItem('token');
      // Unaweza kutumia window.location au router kutoka Next
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };