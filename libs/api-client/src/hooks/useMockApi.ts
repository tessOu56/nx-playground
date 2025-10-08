import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock 資料類型定義
export interface MockApiConfig {
  enabled: boolean;
  delay?: number;
}

// 默認配置
const defaultConfig: MockApiConfig = {
  enabled:
    typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
  delay: 500,
};

// 模擬 API 延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 創建 Mock Query Hook
export const createMockQuery = <T>(
  queryKey: string[],
  mockData: T,
  config: MockApiConfig = defaultConfig
): (() => ReturnType<typeof useQuery>) => {
  return () => {
    return useQuery({
      queryKey,
      queryFn: async () => {
        if (config.delay) {
          await delay(config.delay);
        }
        return mockData;
      },
      enabled: config.enabled,
      staleTime: 5 * 60 * 1000, // 5 分鐘
      gcTime: 10 * 60 * 1000, // 10 分鐘
    });
  };
};

// 創建 Mock Mutation Hook
export const createMockMutation = <TData, TVariables>(
  mutationKey: string,
  mockResponse: TData,
  config: MockApiConfig = defaultConfig
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: [mutationKey],
      mutationFn: async (_variables: TVariables) => {
        if (config.delay) {
          await delay(config.delay);
        }
        // 模擬成功響應
        return mockResponse;
      },
      onSuccess: () => {
        // 可以根據需要使相關查詢失效
        queryClient.invalidateQueries({ queryKey: ['formTemplates'] });
      },
    });
  };
};

// 環境檢測
export const isMockEnabled = () => {
  return (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development' &&
    (process.env.REACT_APP_USE_MOCK === 'true' ||
      (typeof window !== 'undefined' && (window as any).__USE_MOCK__))
  );
};
