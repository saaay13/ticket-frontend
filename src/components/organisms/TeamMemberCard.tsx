import React, { useState } from "react";
import { Mail, Ticket as TicketIcon, CheckCircle, Clock, Building, ShieldCheck } from "lucide-react";
import { Card, CardContent, Avatar, AvatarFallback } from "@/components/molecules";
import { Badge, Progress, Button } from "@/components/atoms";
import { User } from "@/services/UserService";
import { Department } from "@/services/DepartmentService";
import { cn } from "@/lib/Utils";

export interface TeamMemberCardProps {
  member: User;
  stats: { total: number; resolved: number; open: number; rate: number };
  isAdmin: boolean;
  type: "it" | "staff";
  departments: Department[];
  getDeptName: (deptId?: number) => string;
  onUpdateUser: (userId: number, updates: Partial<User>) => Promise<void>;
  onDeleteUser: (userId: number) => Promise<void>;
  onRestoreUser: (userId: number) => Promise<void>;
  updatingId: number | null;
}

export function TeamMemberCard({
  member,
  stats,
  isAdmin,
  type,
  departments,
  getDeptName,
  onUpdateUser,
  onDeleteUser,
  onRestoreUser,
  updatingId
}: TeamMemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const startEditing = () => {
    setIsEditing(true);
    setEditFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
    });
  };

  const handleSave = async () => {
    await onUpdateUser(member.id, editFormData);
    setIsEditing(false);
  };

  const isOnline = member.active;
  const isIT = member.department_id === 1 && (member.role === 'Admin' || member.role === 'Agent');
  console.log(stats)

  return (
    <Card className="border-none shadow-premium hover:shadow-xl transition-all group overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="p-8 flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <Avatar 
              className={cn(
                "w-20 h-20 rounded-[2rem] shadow-lg transition-transform duration-300 group-hover:scale-105",
                isIT ? "shadow-primary/20 ring-4 ring-primary/10" : "shadow-neutral-200 ring-4 ring-neutral-100"
              )}
            >
              <AvatarFallback 
                className={cn(
                  "rounded-[2rem] text-2xl font-black text-white",
                  isIT ? "bg-gradient-to-br from-primary to-primary-700" : "bg-gradient-to-br from-neutral-400 to-neutral-600"
                )}
              >
                {member.first_name[0]}{member.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10",
              isOnline ? "bg-success" : "bg-neutral-300"
            )} />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex gap-2 w-full pr-4">
                  <input className="border rounded p-1 text-sm font-bold w-1/2 outline-primary" value={editFormData.first_name || ""} onChange={e=>setEditFormData({...editFormData, first_name: e.target.value})} />
                  <input className="border rounded p-1 text-sm font-bold w-1/2 outline-primary" value={editFormData.last_name || ""} onChange={e=>setEditFormData({...editFormData, last_name: e.target.value})} />
                </div>
              ) : (
                <h3 className="text-xl font-black text-neutral-800 truncate">{member.first_name} {member.last_name}</h3>
              )}
              
              {!isEditing && (
                <Badge variant={isOnline ? "success" : "destructive"} className="text-[9px] font-black uppercase tracking-widest px-2 py-0">
                  {isOnline ? "Activo" : "Eliminado"}
                </Badge>
              )}
            </div>

            <div className={cn(
              "flex items-center gap-2 font-bold text-xs uppercase tracking-wider",
              isIT ? "text-primary" : "text-neutral-500"
            )}>
              {isIT ? <ShieldCheck size={12} /> : <Building size={12} />}
              
              {isAdmin && type === "staff" ? (
                <select
                  className="bg-neutral-50 border border-neutral-200 rounded-md py-1 px-2 text-xs font-bold outline-none focus:border-primary w-48"
                  value={member.department_id || ""}
                  disabled={updatingId === member.id}
                  onChange={(e) => onUpdateUser(member.id, { department_id: e.target.value ? parseInt(e.target.value) : undefined })}
                >
                  <option value="">Sin Departamento</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              ) : (
                member.department?.name || getDeptName(member.department_id)
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-2 items-center">
              {isAdmin && type === "staff" ? (
                <select
                  className="bg-neutral-50 border border-neutral-200 rounded-md py-1 px-2 text-[9px] font-black uppercase outline-none focus:border-primary"
                  value={member.role || "Staff"}
                  disabled={updatingId === member.id}
                  onChange={(e) => onUpdateUser(member.id, { role: e.target.value as any })}
                >
                  <option value="Staff">Personal (Usuario Regular)</option>
                  <option value="Agent">Agente (Técnico Soporte)</option>
                  <option value="Admin">Administrador</option>
                </select>
              ) : (
                <Badge variant="outline" className="rounded-lg text-[9px] font-black border-neutral-100 bg-neutral-50/50">
                  {member.role === 'Admin' ? 'Administrador' : member.role === 'Agent' ? 'Agente' : 'Personal'}
                </Badge>
              )}
              {isIT && (
                <Badge variant="outline" className="rounded-lg text-[9px] font-black border-neutral-100 bg-neutral-50/50">
                  {stats.total} Casos
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isIT && (
          <div className="px-8 py-6 bg-neutral-50/50 border-t border-neutral-100/50 grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total</p>
              <div className="flex items-center justify-center gap-1.5 font-black text-lg text-neutral-800">
                <TicketIcon size={14} className="text-primary" />
                {stats.total}
              </div>
            </div>
            <div className="text-center space-y-1 border-x border-neutral-100">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Abiertos</p>
              <div className="flex items-center justify-center gap-1.5 font-black text-lg text-neutral-800">
                <Clock size={14} className="text-warning" />
                {stats.open}
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Resueltos</p>
              <div className="flex items-center justify-center gap-1.5 font-black text-lg text-neutral-800">
                <CheckCircle size={14} className="text-success" />
                {stats.resolved}
              </div>
            </div>
          </div>
        )}

        <div className="px-8 py-6 space-y-4 pt-2">
          {isIT && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Eficiencia</span>
                <span className="text-xs font-black text-primary">{stats.rate}%</span>
              </div>
              <Progress value={stats.rate} className="h-2 rounded-full" />
            </>
          )}

          <div className="pt-2 flex items-center justify-between w-full pr-4">
            {isEditing ? (
              <input className="border rounded-md p-1.5 w-full text-xs font-bold text-neutral-700 bg-neutral-50 mb-2 outline-primary" value={editFormData.email || ""} onChange={e=>setEditFormData({...editFormData, email: e.target.value})} />
            ) : (
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-primary transition-colors">
                <Mail size={14} /> {member.email}
              </a>
            )}
            {!isEditing && <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-widest">ID: {member.id}</span>}
          </div>
          
          {isAdmin && type === "staff" && (
             <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 mt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" className="text-xs py-1" onClick={() => setIsEditing(false)} disabled={updatingId === member.id}>Cancelar</Button>
                    <Button variant="primary" className="text-xs py-1" onClick={handleSave} disabled={updatingId === member.id}>
                      {updatingId === member.id ? "Guardando..." : "Guardar"}
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    {member.active ? (
                      <>
                        <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest py-1.5" onClick={startEditing} disabled={updatingId === member.id}>
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-[10px] uppercase font-black tracking-widest py-1.5 border-error/20 text-error hover:bg-error/5" 
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que deseas eliminar a ${member.first_name}?`)) {
                              onDeleteUser(member.id);
                            }
                          }} 
                          disabled={updatingId === member.id}
                        >
                          Eliminar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="text-[10px] uppercase font-black tracking-widest py-1.5" 
                        onClick={() => onRestoreUser(member.id)}
                        disabled={updatingId === member.id}
                      >
                        Reactivar Usuario
                      </Button>
                    )}
                  </div>
                )}
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
