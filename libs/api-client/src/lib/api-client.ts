import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// 創建 API 客戶端實例
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 請求攔截器
  client.interceptors.request.use(
    config => {
      // 可以在這裡添加認證 token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // 響應攔截器
  client.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // 統一錯誤處理
      if (error.response?.status === 401) {
        // 未授權，清除 token 並重定向到登入頁面
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// 創建默認 API 客戶端實例
export const apiClientInstance = createApiClient(
  typeof process !== 'undefined' &&
    process.env.REACT_APP_API_URL &&
    typeof process.env.REACT_APP_API_URL === 'string'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:3001/api'
);

// 創建默認 API 客戶端
export const apiClient = apiClientInstance;

// Orval 需要的 mutator 函數
export const customInstance = async <T>(
  config: {
    url: string;
    method: string;
    params?: any;
    data?: any;
    responseType?: string;
    signal?: AbortSignal;
    headers?: any;
  },
  options?: any
): Promise<T> => {
  const response = await apiClientInstance.request({
    url: config.url,
    method: config.method as any,
    params: config.params,
    data: config.data,
    responseType: config.responseType as any,
    signal: config.signal,
    headers: { ...config.headers, ...options?.headers },
  });
  return response.data;
};

// 為 Orval 提供默認導出的 customInstance 函數
export default customInstance;

// Token 管理
export const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
};

export const getTokens = () => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem('authToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

// 錯誤處理
export const isApiError = (
  error: unknown
): error is { response?: { status: number; data: any } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response?.data?.message ?? 'An error occurred';
  }
  return error instanceof Error ? error.message : 'An error occurred';
};

// API 錯誤類型
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// 健康檢查
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (_error) {
    throw new Error('Health check failed');
  }
};

// 導出類型
export type { AxiosInstance, AxiosRequestConfig };
