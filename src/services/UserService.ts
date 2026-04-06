import { apiService } from './ApiService';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id?: number;
  role?: string;
  active: boolean;
  department?: {
    id: number;
    name: string;
  };
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  department_id?: number;
  role?: string;
  active?: boolean;
  metadata?: Record<string, any>;
}

class UserService {
  async getAll(params?: Record<string, any>): Promise<User[]> {
    const response = await apiService.get<any>('/users', params);
    return Array.isArray(response) ? response : (response.data || []);
  }

  async getById(id: number): Promise<User> {
    const response = await apiService.get<any>(`/users/${id}`);
    return response.data || response;
  }

  async create(data: CreateUserData): Promise<User> {
    const response = await apiService.post<any>('/users', data);
    return response.data || response.user || response;
  }

  async update(id: number, data: Partial<CreateUserData>): Promise<User> {
    const response = await apiService.put<any>(`/users/${id}`, data);
    return response.data || response.user || response;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAll();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}

export const userService = new UserService();
