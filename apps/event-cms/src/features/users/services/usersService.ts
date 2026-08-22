import { listUsers, type UserListResponse } from '@nx-playground/api-client';

export class UsersService {
  static async getUsers(params?: {
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> {
    return listUsers({ limit: 100, ...params });
  }
}
