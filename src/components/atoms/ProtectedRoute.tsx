import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireDept?: boolean;
}

/**
 * 🛡️ ProtectedRoute: El Guardián del Sistema
 * Verifica Autenticación, Roles y Asignación de Departamento.
 */
export function ProtectedRoute({ allowedRoles, requireDept = false }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // 🌀 Estado de Carga Premium
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-6">Validando Acceso...</p>
      </div>
    );
  }

  // 1️⃣ ¿Está logueado?
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ ¿Requiere departamento y no tiene uno? (Solo si no estamos en el Dashboard)
  // Administradores y Agentes pueden entrar siempre por ser personal de IT
  const userRole = user?.role?.toLowerCase();
  const isTechnical = userRole === 'admin' || userRole === 'agent';
  
  if (requireDept && !isTechnical && !user?.department_id && location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  // 3️⃣ ¿Tiene el rol permitido?
  if (allowedRoles && userRole && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
