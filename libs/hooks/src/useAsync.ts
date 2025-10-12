import { useCallback, useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * useAsync - 異步操作管理 Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { execute, data, isLoading, error } = useAsync(
 *     async () => {
 *       const res = await fetch('/api/data');
 *       return res.json();
 *     },
 *     { immediate: true }
 *   );
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   return <div>{data}</div>;
 * }
 * ```
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const data = await asyncFunction(...args);
        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({
          data: null,
          error: err,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        onError?.(err);
        throw err;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      execute(...([] as any));
    }
  }, [immediate, execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    execute,
    reset,
    ...state,
  };
}
