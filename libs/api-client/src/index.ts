// Core API Client
export {
  apiClient,
  customInstance,
  setTokens,
  getTokens,
  clearTokens,
  isApiError,
  getErrorMessage,
  healthCheck,
} from './lib/api-client';
export type { ApiError } from './lib/api-client';

// React Query Hooks
export { useApiQuery, useApiMutation } from './hooks/useApi';

// Mock API Hooks
export {
  createMockQuery,
  createMockMutation,
  isMockEnabled,
} from './hooks/useMockApi';
export { createSmartApiHook } from './hooks/useSmartApi';

// React Query Provider and Client
export { QueryProvider } from './QueryProvider';
export { queryClient } from './queryClient';

// API Configuration
export { apiConfig, toggleMockMode, isUsingMock } from './config/api';

// Re-export commonly used React Query utilities
export { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
export type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

// Note: For environment-specific APIs, import directly from:
// - import { useGetTemplates } from '@nx-playground/api-client/form/dev';
// - import { useGetRegistrationFlows } from '@nx-playground/api-client/identity/dev';
// - import { useGetEvents } from '@nx-playground/api-client/event/dev';
// - import { useGetTickets } from '@nx-playground/api-client/tickets/dev';
// - import { useGetMedia } from '@nx-playground/api-client/media/dev';
// - import { useGetCommunity } from '@nx-playground/api-client/community/dev';
