import { apiService } from "@/services/ApiService";
import { User } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  department_id: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() {
    // Restore session
    const token = this.getToken();
    if (token) {
      this.setToken(token);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await apiService.post<AuthResponse>('/login', credentials);

      if (data.token) {
        this.setToken(data.token);
      }
      if (data.user) {
        this.setUser(data.user);
      }

      return data;
    } catch (error: any) {
      // Parse Error
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'Login failed. Please check your credentials.';

      throw new Error(errorMessage);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const resp = await apiService.post<AuthResponse>('/register', data);

      if (resp.token) {
        this.setToken(resp.token);
      }
      if (resp.user) {
        this.setUser(resp.user);
      }

      return resp;
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'No se pudo completar el registro.';

      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      // Auth Set
      await apiService.post('/logout', {});
    } catch (error) {
      console.warn('Logout API call failed, clearing local storage anyway');
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const resp = await apiService.get<any>('/user');
      const user = resp.data || resp;
      this.setUser(user);
      return user;
    } catch (error) {
      // Fallback
      this.clearAuth();
      return this.getUser();
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiService.post('/forgot-password', { email });
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'No se pudo enviar el enlace de recuperación.';

      throw new Error(errorMessage);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
