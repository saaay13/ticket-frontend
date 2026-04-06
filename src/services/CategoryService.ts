import { apiService } from './ApiService';

export interface Category {
  id: number;
  name: string;
  sla_config?: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

class CategoryService {
  async getAll(): Promise<Category[]> {
    const response = await apiService.get<any>('/categories');
    return Array.isArray(response) ? response : (response.data || []);
  }

  async getById(id: number): Promise<Category> {
    const response = await apiService.get<any>(`/categories/${id}`);
    return response.data || response;
  }

  async create(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const response = await apiService.post<any>('/categories', data);
    return response.data || response.category || response;
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const response = await apiService.put<any>(`/categories/${id}`, data);
    return response.data || response.category || response;
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
export default categoryService;
