import { useQuery } from '@nx-playground/api-client';

import { UsersService } from '../services/usersService';

export function useUsersQuery(params?: {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['cms', 'users', params],
    queryFn: () => UsersService.getUsers(params),
  });
}
