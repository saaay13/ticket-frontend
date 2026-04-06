import { apiConfig } from "@/config/api";

class ApiService {
  private baseURL: string;
  public defaults: { headers: Record<string, string> };

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.defaults = {
      headers: { ...apiConfig.headers },
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Auth token
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      ...this.defaults.headers,
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      credentials: 'include', // Cookies
      headers,
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      // Auth Error
      if (response.status === 401) {
        // No Loop
        if (!url.includes('/api/login') && !url.includes('/api/logout')) {
          try {
            const { authService } = await import("./AuthService");
            if (authService.logout) {
              await authService.logout().catch(() => { });
            }
          } catch { }
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // CRUD
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let finalEndpoint = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        finalEndpoint += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(finalEndpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
