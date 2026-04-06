import { apiService } from './ApiService';

export interface Department {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  active?: boolean;
}

class DepartmentService {
  async getAll(): Promise<Department[]> {
    const response = await apiService.get<any>('/departments');
    return Array.isArray(response) ? response : (response.data || []);
  }

  async getById(id: number): Promise<Department> {
    const response = await apiService.get<any>(`/departments/${id}`);
    return response.data || response;
  }

  async create(data: CreateDepartmentData): Promise<Department> {
    const response = await apiService.post<any>('/departments', data);
    return response.data || response.department || response;
  }

  async update(id: number, data: Partial<CreateDepartmentData>): Promise<Department> {
    const response = await apiService.put<any>(`/departments/${id}`, data);
    return response.data || response.department || response;
  }
}

export const departmentService = new DepartmentService();
