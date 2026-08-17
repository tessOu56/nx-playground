/**
 * Event-stack client — same OpenAPI as Nest dump / api-mock.
 * Switch runtime with NEXT_PUBLIC_API_BASE_URL | VITE_API_BASE_URL
 * (http://localhost:3001/api live, http://localhost:3011/api mock).
 */
export { getEventStackBaseUrl, eventStackRequest } from './http';
export * from './types';
export * from './operations';
export * from './hooks';
export * as eventStackGenerated from './generated/nXPlaygroundEventStackAPI';
