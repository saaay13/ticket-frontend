import { useState, useEffect, useMemo } from "react";
import { userService, User } from "@/services/UserService";
import { ticketService, Ticket as ApiTicket } from "@/services/TicketService";
import { departmentService, Department } from "@/services/DepartmentService";
import { User as UserIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms";
import { CreateUserForm, TeamMemberCard } from "@/components/organisms";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/Utils";

export interface TeamPageProps {
  type?: "it" | "staff";
}

export function TeamPage({ type = "it" }: TeamPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role?.toLowerCase() === 'admin';

  const loadData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [usersData, metricsData, depsData] = await Promise.all([
        userService.getAll(),
        ticketService.getMetrics(),
        departmentService.getAll()
      ]);
      setUsers(usersData);
      setMetrics(metricsData);
      setDepartments(depsData);
    } catch (err) {
      console.error('Error loading team data:', err);
      if (!isSilent) setError('No se pudo cargar la información del equipo');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateUser = async (userId: number, updates: any) => {
    try {
      setUpdatingId(userId);

      //Cambia los datos en pantalla al instante
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          const updatedUser = { ...u, ...updates };
          if (updates.department_id !== undefined) {
            delete updatedUser.department;
          }
          return updatedUser;
        }
        return u;
      }));

      await userService.update(userId, updates);
      await loadData(true);
    } catch (err) {
      console.error('Error updating user:', err);
      await loadData(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const teamMembers = useMemo(() => {
    if (type === "it") {
      // Equipo IT: Solo Admin/Agente en Depto de Soporte (ID 1)
      return users.filter(user => {
        const r = user.role?.toLowerCase();
        return (r === 'admin' || r === 'agent' || r === 'agente') && user.department_id === 1;
      });
    } else {
      // Staff/Directorio: Todos los demás
      return users.filter(user => {
        const r = user.role?.toLowerCase();
        return user.department_id !== 1 || (r !== 'admin' && r !== 'agent' && r !== 'agente');
      });
    }
  }, [users, type]);

  const getAgentStats = (userId: number) => {
    const agentMetric = metrics?.team?.find((m: any) => Number(m.id) === Number(userId));

    if (agentMetric) {
      return {
        total: agentMetric.total,
        resolved: agentMetric.resolved,
        open: agentMetric.open,
        rate: agentMetric.percentage
      };
    }

    return {
      total: 0,
      resolved: 0,
      open: 0,
      rate: 0
    };
  };

  const getDeptName = (deptId?: number) => {
    if (!deptId) return "Sin Departamento";
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : "Departamento General";
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-muted-foreground mt-6 uppercase tracking-widest">Sincronizando directorio...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center justify-between min-w-[50vw]">
            {type === "it" ? "Equipo IT Soporte" : "Control de Personal"}
            {isAdmin && type === "staff" && !showCreate && (
              <Button onClick={() => setShowCreate(true)} variant="primary" className="text-sm px-6">
                + Crear Usuario
              </Button>
            )}
          </h1>
          <p className="text-neutral-500 font-medium text-sm">
            {teamMembers.length} {type === "it" ? "especialistas gestionando la operación técnica." : "registros encontrados en el directorio general."}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-4 px-4 py-2 rounded-2xl border tracking-widest",
          type === "it" ? "bg-primary/5 border-primary/10 text-primary" : "bg-neutral-100 border-neutral-200 text-neutral-500"
        )}>
          {type === "it" ? <ShieldCheck size={18} /> : <UserIcon size={18} />}
          <p className="text-[10px] font-black uppercase">
            {type === "it" ? "Soporte Activo 24/7" : "Directorio Institucional"}
          </p>
        </div>
      </div>

      {showCreate && (
        <CreateUserForm
          departments={departments}
          onSuccess={() => { setShowCreate(false); loadData(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            stats={getAgentStats(member.id)}
            isAdmin={isAdmin}
            type={type}
            departments={departments}
            getDeptName={getDeptName}
            onUpdateUser={handleUpdateUser}
            updatingId={updatingId}
          />
        ))}
      </div>
    </div>
  );
}

