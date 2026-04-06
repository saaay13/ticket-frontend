import { apiService } from './ApiService';

export interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  details: {
    description: string;
    priority: string;
    department?: string;
    system?: string;
    source_ip?: string;
    resolution_time_minutes?: number;
    tags: string[];
    custom_fields: Record<string, any>;
  };
  status: string;
  requester_id: number;
  assigned_to_id?: number;
  category_id: number;
  closed_at?: string;
  total_time_minutes?: number;
  created_at: string;
  updated_at: string;
  requester?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  assigned_to?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
  comments?: Comment[];
}

export interface Comment {
  id: number;
  ticket_id: string;
  user_id: number;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateTicketData {
  title: string;
  requester_id: number;
  details: {
    description: string;
    priority: string;
    department?: string;
    system?: string;
    source_ip?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
  };
  category_id: number;
  assigned_to_id?: number;
}

export interface UpdateTicketData {
  title?: string;
  details?: Partial<Ticket['details']>;
  status?: string;
  assigned_to_id?: number;
  category_id?: number;
  closed_at?: string;
  total_time_minutes?: number;
}

class TicketService {
  async getAll(params?: Record<string, any>): Promise<Ticket[]> {
    const response = await apiService.get<any>('/tickets', params);
    return Array.isArray(response) ? response : (response.data || []);
  }

  async getById(id: string): Promise<Ticket> {
    const response = await apiService.get<any>(`/tickets/${id}`);
    return response.data || response;
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    const response = await apiService.post<any>('/tickets', data);
    return response.data || response.ticket || response;
  }

  async update(id: string, data: UpdateTicketData): Promise<Ticket> {
    const response = await apiService.put<any>(`/tickets/${id}`, data);
    return response.data || response.ticket || response;
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`/tickets/${id}`);
  }

  async getMetrics(): Promise<any> {
    return apiService.get<any>('/tickets/metrics');
  }

  async getTrash(): Promise<Ticket[]> {
    const response = await apiService.get<any>('/tickets/trash');
    return Array.isArray(response) ? response : (response.data || []);
  }

  async restore(id: string): Promise<void> {
    return apiService.post<void>(`/tickets/${id}/restore`, {});
  }

  async getComments(ticketId: string): Promise<Comment[]> {
    return apiService.get<Comment[]>(`/tickets/${ticketId}/comments`);
  }

  async addComment(ticketId: string, content: string): Promise<Comment> {
    return apiService.post<Comment>(`/comments`, {
      ticket_id: ticketId,
      content,
    });
  }
}

export const ticketService = new TicketService();
export default ticketService;
