import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch {
        // Refresh failed — clear tokens and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
