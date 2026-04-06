import { apiService } from './ApiService';

export interface Comment {
  id: number;
  ticket_id: string;
  user_id: number;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateCommentData {
  ticket_id: string;
  content: string;
  metadata?: Record<string, any>;
}

class CommentService {
  async getAll(ticketId?: string): Promise<Comment[]> {
    const url = ticketId ? `/comments?ticket_id=${ticketId}` : '/comments';
    return apiService.get<Comment[]>(url);
  }

  async getById(id: number): Promise<Comment> {
    return apiService.get<Comment>(`/comments/${id}`);
  }

  async create(data: CreateCommentData): Promise<Comment> {
    const response = await apiService.post<{ message: string; comment: Comment }>('/comments', data);
    return response.comment;
  }

  async update(id: number, data: Partial<CreateCommentData>): Promise<Comment> {
    const response = await apiService.put<{ message: string; comment: Comment }>(`/comments/${id}`, data);
    return response.comment;
  }

  async delete(id: number): Promise<void> {
    return apiService.delete(`/comments/${id}`);
  }
}

export const commentService = new CommentService();
