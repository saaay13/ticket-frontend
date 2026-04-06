import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { authService, LoginCredentials, RegisterData } from "@/services/AuthService";
import { User as ApiUser } from "@/types";

// Context Shape
export type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  user: ApiUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) {
        setUser(u);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const resp = await authService.login(credentials);
    setUser(resp.user);
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterData) => {
    const resp = await authService.register(data);
    setUser(resp.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      loading,
      user,
      login,
      register,
      logout,
      forgotPassword,
    }),
    [isAuthenticated, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-6">Validando Identidad...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
