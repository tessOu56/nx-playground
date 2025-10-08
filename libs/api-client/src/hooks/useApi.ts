import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';

// 封裝 useQuery hook
export const useApiQuery = <TData, TError = unknown>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData>,
    'queryKey' | 'queryFn'
  > & {
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  }
) => {
  const { onSuccess, onError, ...queryOptions } = options ?? {};

  const query = useQuery({
    queryKey,
    queryFn,
    ...queryOptions,
  });

  // 使用 useEffect 處理 onSuccess 和 onError
  useEffect(() => {
    if (query.isSuccess && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useEffect(() => {
    if (query.isError && onError) {
      onError(query.error as TError);
    }
  }, [query.isError, query.error, onError]);

  return query;
};

// 封裝 useMutation hook
export const useApiMutation = <TData, TError = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn'
  > & {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
  }
) => {
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,
  });

  // 使用 useEffect 處理 onSuccess 和 onError
  useEffect(() => {
    if (mutation.isSuccess && onSuccess) {
      onSuccess(mutation.data, mutation.variables as TVariables);
    }
  }, [mutation.isSuccess, mutation.data, mutation.variables, onSuccess]);

  useEffect(() => {
    if (mutation.isError && onError) {
      onError(mutation.error as TError, mutation.variables as TVariables);
    }
  }, [mutation.isError, mutation.error, mutation.variables, onError]);

  return mutation;
};
