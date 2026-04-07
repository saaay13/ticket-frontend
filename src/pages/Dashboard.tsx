import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Ticket as TicketIcon, AlertTriangle, Clock, CheckCircle, ArrowRight, Plus, ShieldCheck, ShieldAlert, Mail, Activity, RefreshCcw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge, Button, Skeleton } from "@/components/atoms";
import { DashboardStats, DashboardCharts, RecentTicketsList, TeamPerformanceMetrics } from "@/components/organisms";
import { useTickets } from "@/hooks/useTickets";
import { ticketService } from "@/services/TicketService";
import { getStatusLabel, getPriorityLabel } from "@/data/ticketData";

const categoryColors: Record<string, string> = {
  "Hardware": "var(--primary)",
  "Software": "var(--info)",
  "Redes": "var(--warning)",
  "Seguridad": "var(--error)",
  "Gestión de Accesos": "var(--primary-600)",
  "Correo Electrónico": "var(--indigo-500)",
  "Otros": "var(--neutral-400)"
};

export function Dashboard() {
  const { user } = useAuth();
  const { tickets, loading: ticketsLoading, refresh: refreshTickets } = useTickets();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getMetrics();
      if (data.error) {
        throw new Error(data.message || "Error del servidor al calcular métricas.");
      }
      setMetrics(data);
    } catch (err: any) {
      console.error("Error fetching metrics:", err);
      setError(err.message || "No se pudo conectar con el servidor de métricas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isAgent = user?.role?.toLowerCase() === "agent" || user?.role?.toLowerCase() === "agente";
  const isStaff = user?.role?.toLowerCase() === "staff" || user?.role?.toLowerCase() === "usuario";
  const isUnassigned = !user?.department_id;

  const stats = [
    { label: "Total de Tickets", value: metrics?.stats?.total || 0, icon: TicketIcon, variant: "primary", trend: "Global" },
    { label: "Pendientes", value: metrics?.stats?.open || 0, icon: AlertTriangle, variant: "warning", trend: "Abiertos" },
    { label: "En Proceso", value: metrics?.stats?.in_progress || 0, icon: Clock, variant: "info", trend: "Activos" },
    { label: "Resueltos", value: metrics?.stats?.resolved || 0, icon: CheckCircle, variant: "success", trend: "Completados" },
  ];

  const categoryData = (metrics?.categories || []).map((c: any) => ({
    name: c.name,
    value: c.value,
    color: categoryColors[c.name] || "var(--neutral-400)"
  })).sort((a: any, b: any) => b.value - a.value);

  const agents = metrics?.team || [];
  const weeklyData = metrics?.weekly || [];

  if (loading || ticketsLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 bg-neutral-100 rounded-2xl" />
            <Skeleton className="h-4 w-48 bg-neutral-50 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-56 bg-neutral-100 rounded-3xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-36 rounded-[2.5rem] bg-neutral-50/50 border border-neutral-100" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          <Skeleton className="h-32 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/50" />
          <Skeleton className="h-32 rounded-[2rem] bg-primary/5 border border-primary/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] rounded-[3rem] bg-neutral-50" />
          </div>
          <Skeleton className="h-[400px] rounded-[3rem] bg-neutral-50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-error/10 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-error/5 scale-110">
          <Activity size={48} className="text-error animate-pulse" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Error al Cargar Dashboard</h2>
          <p className="text-neutral-500 max-w-md mx-auto font-medium">{error}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => { fetchMetrics(); refreshTickets(); }} className="rounded-2xl px-8 py-7 font-black text-xs shadow-xl shadow-primary/20">
            <RefreshCcw size={16} className="mr-2" /> REINTENTAR CONEXIÓN
          </Button>
          <Link to="/dashboard/tickets">
            <Button variant="outline" className="rounded-2xl px-8 py-7 font-black text-xs">VER TICKETS</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" className="rounded-lg text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0 border-none shadow-sm">
              {isAdmin ? "Panel de Administración" : isAgent ? "Panel de Agente" : isStaff ? "Panel de Empleado" : "Validando Perfil"}
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Bienvenido, {user?.first_name}</h1>
          <p className="text-neutral-500 font-medium text-sm mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — {isUnassigned ? "Inicia el proceso de autenticación." : "Gestiona tus peticiones con eficiencia."}
          </p>
        </div>
        {!isUnassigned && (
          <Link to="/dashboard/tickets/new">
            <Button className="px-8 py-7 font-black shadow-xl shadow-primary/20 animate-in slide-in-from-right-4 duration-500">
              <Plus size={18} className="mr-2 stroke-[3px]" /> NUEVO TICKET
            </Button>
          </Link>
        )}
      </div>

      {/* Alerta crítica (Solo para IT) */}
      {(isAdmin || isAgent) && user?.department_id && (metrics?.stats?.critical || 0) > 0 && (
        <div className="group relative overflow-hidden bg-white rounded-3xl p-6 border-none shadow-premium animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-error animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-neutral-800 uppercase tracking-widest leading-none mb-1">Alerta Crítica del Sistema</h4>
              <p className="text-sm font-bold text-neutral-500">
                Hay <span className="text-error font-black">{metrics?.stats?.critical} tickets críticos</span> que requieren respuesta técnica inmediata.
              </p>
            </div>
            <Link to="/dashboard/tickets?priority=Critical">
              <Button variant="outline" className="rounded-xl font-black text-[10px] border-error/20 text-error hover:bg-error hover:text-white transition-all uppercase tracking-widest">Resolver Ahora</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pantalla de espera para no asignados */}
      {isUnassigned && (
        <div className="group relative overflow-hidden bg-white rounded-[2.5rem] p-10 border-2 border-dashed border-primary/20 shadow-premium animate-in zoom-in duration-700 mt-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8 relative z-10">
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-in bounce-in duration-1000 shadow-xl shadow-primary/5">
              <ShieldAlert size={48} className="text-primary stroke-[2.5px]" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 border-primary/20 text-primary mb-4 bg-primary/5">Cuenta en Espera</Badge>
                <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                  Hola <span className="text-primary">{user?.first_name}</span>. ¡Ya casi estamos!
                </h2>
              </div>
              <p className="text-lg font-medium text-neutral-500 leading-relaxed max-w-2xl">
                Tu registro fue exitoso, pero tu cuenta aún no ha sido asignada a una unidad institucional por el administrador.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                <Button className="rounded-2xl px-8 py-7 font-black text-xs shadow-xl shadow-primary/20">
                  <Mail size={16} className="mr-2" /> CONTACTAR SOPORTE IT
                </Button>
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest italic ml-2">Referencia: {user?.id}-AUTH</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isUnassigned && (
        <>
          {/* Estadísticas globales (Solo IT) */}
          {(isAdmin || isAgent) && (
            <DashboardStats stats={stats} />
          )}

          {/* Actividad personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <Link to="/dashboard/my-tickets" className="group">
              <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-premium-subtle group-hover:scale-110 transition-transform text-primary">
                  <TicketIcon size={28} className="stroke-[3px]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Actividad Personal</p>
                  <h3 className="text-2xl font-black text-neutral-800 tracking-tight"> Reportados</h3>
                  <p className="text-xs font-bold text-neutral-400 mt-0.5">Tickets que tú has enviado.</p>
                </div>
                <ArrowRight size={20} className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </div>
            </Link>
            {(isAdmin || isAgent) && (
              <Link to="/dashboard/tickets?view=assigned_to_me" className="group">
                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/50 hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-premium-subtle group-hover:scale-110 transition-transform text-indigo-600">
                    <ShieldCheck size={28} className="stroke-[3px]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Gestión Técnica</p>
                    <h3 className="text-2xl font-black text-neutral-800 tracking-tight"> Solicitudes</h3>
                    <p className="text-xs font-bold text-neutral-400 mt-0.5">Tickets asignados para resolver.</p>
                  </div>
                  <ArrowRight size={20} className="ml-auto text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </div>
              </Link>
            )}
          </div>

          {/* Gráficas técnicas (Solo IT) */}
          {(isAdmin || isAgent) && (
            <DashboardCharts weeklyData={weeklyData} categoryData={categoryData} total={metrics?.stats?.total || 0} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent tickets list */}
            <RecentTicketsList
              tickets={isStaff ? tickets.filter(t => t.requester_id === user?.id).slice(0, 5) : tickets.slice(0, 5)}
              isStaff={isStaff}
              isAdminOrAgent={isAdmin || isAgent}
            />

            {/* Métricas de rendimiento (Solo IT) */}
            {(isAdmin || isAgent) && (
              <TeamPerformanceMetrics agents={agents} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
