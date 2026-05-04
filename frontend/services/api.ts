import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de requisição - adiciona token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Pegar token do localStorage (será implementado no STEP 3)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se erro 401 (não autorizado) e não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar refresh token (será implementado no STEP 3)
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refresh_token");
          
          if (refreshToken) {
            const response = await axios.post(
              `${API_URL}/auth/refresh-token`,
              { refresh_token: refreshToken }
            );

            const { access_token } = response.data;
            localStorage.setItem("access_token", access_token);

            // Retry requisição original
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se refresh falhar, redirecionar para login
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
