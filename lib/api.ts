import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1',
  withCredentials: true,
});

// Optional: Add response interceptor to handle global 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - please log in");
      // Handle unauthorized logic here if needed
    }
    return Promise.reject(error);
  }
);