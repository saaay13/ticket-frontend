import React, { useState } from "react";
import {
  ArrowLeft, Clock, User, Tag, Building,
  Calendar, MessageSquare, Send,
  Edit2, CheckCircle, AlertCircle, ChevronDown,
  Trash2,
} from "lucide-react";
import { Badge, Button } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback } from "@/components/molecules";
import {
  getStatusColor,
  getPriorityColor,
  getPriorityLabel,
  getStatusLabel,
  getCategoryLabel
} from "@/data/ticketData";
import { cn } from "@/lib/Utils";

const STATUS_OPTIONS = ["Abierto", "En Progreso", "Pendiente", "Resuelto", "Cerrado"];

// --- 1. TICKET HEADER ---
export function TicketHeader({
  ticket, currentStatus, isIT, isAdmin, updating, editing, onStatusChange, onToggleEdit, onBack, onUpdateField
}: any) {
  const [statusDropdown, setStatusDropdown] = useState(false);
  const sc = getStatusColor(currentStatus as any);

  const categories = ["Hardware", "Software", "Redes", "Seguridad", "Gestión de Accesos", "Correo Electrónico", "Otros"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6">
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-primary transition-colors pr-2 border-r border-neutral-200"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            #{ticket.id}
          </span>
          {editing ? (
            <select
              className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-transparent border-none outline-none focus:ring-0 cursor-pointer hover:text-primary transition-colors"
              value={ticket.category}
              onChange={(e) => onUpdateField({ category: e.target.value as any })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          ) : (
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{getCategoryLabel(ticket.category)}</span>
          )}
        </div>
        {editing ? (
          <input
            type="text"
            className="w-full text-3xl font-black text-neutral-900 tracking-tight bg-transparent border-none outline-none focus:ring-0 p-0"
            value={ticket.title}
            onChange={(e) => onUpdateField({ title: e.target.value })}
            placeholder="Título del Ticket"
            autoFocus
          />
        ) : (
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{ticket.title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => isIT && setStatusDropdown(!statusDropdown)}
            disabled={updating || !isIT}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-100 cursor-default",
              isIT && "cursor-pointer hover:shadow-md disabled:opacity-50"
            )}
            style={{ backgroundColor: sc.bg, color: sc.text }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
            {getStatusLabel(currentStatus)}
            {isIT && <ChevronDown size={14} className={cn("transition-transform duration-200", statusDropdown && "rotate-180")} />}
          </button>

          {statusDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-2xl shadow-xl border border-border z-30 py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-neutral-50 mb-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cambiar Estado</span>
              </div>
              {['Abierto', 'En Progreso', 'Pendiente', 'Resuelto', 'Cerrado', ...(isAdmin ? ['Eliminado'] : [])].map((status) => {
                const scOption = getStatusColor(status as any);
                return (
                  <button
                    key={status}
                    onClick={() => { onStatusChange(status); setStatusDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-neutral-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scOption.bg !== 'var(--neutral-100)' ? scOption.bg : scOption.text }} />
                      <span className="text-neutral-700">{getStatusLabel(status)}</span>
                    </div>
                    {currentStatus === status && <CheckCircle size={14} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isIT && (
          <Button
            variant={editing ? "primary" : "outline"}
            onClick={onToggleEdit}
            className={cn("font-bold", editing ? "" : "border-neutral-200")}
          >
            {editing ? <><CheckCircle size={14} className="mr-2" /> Listo</> : <><Edit2 size={14} className="mr-2" /> Modo Edición</>}
          </Button>
        )}
      </div>
    </div>
  );
}

// --- 2. TICKET THREAD ---
export function TicketThread({ comments, onAddComment, updating }: any) {
  const [newComment, setNewComment] = useState("");

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h`;
    return `${Math.floor(hours / 24)} d`;
  };

  const handleSend = async () => {
    if (!newComment.trim()) return;
    const ok = await onAddComment(newComment);
    if (ok) setNewComment("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-neutral-800">
          Hilo de Conversación
          <span className="ml-3 text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {comments.length}
          </span>
        </h3>
      </div>

      <Card className="border-2 border-primary/5 bg-primary/[0.02]">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="size-10 rounded-2xl bg-primary shadow-lg shadow-primary/20 ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary text-white text-xs font-black rounded-2xl">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe una respuesta o actualización..."
                rows={4}
                disabled={updating}
                className="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none bg-white"
              />
              <div className="flex items-center justify-between">
                <div />
                <Button
                  onClick={handleSend}
                  disabled={!newComment.trim() || updating}
                  className="font-bold px-6 shadow-lg shadow-primary/20"
                >
                  <Send size={14} className="mr-2" />
                  {updating ? "Enviando..." : "Enviar Respuesta"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
            <MessageSquare size={48} className="mx-auto mb-4 text-neutral-200" />
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Sin comentarios todavía</p>
          </div>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar
                className={cn(
                  "size-10 rounded-2xl shadow-sm flex-shrink-0 transition-transform group-hover:scale-110",
                  comment.author === "Me" ? "ring-2 ring-primary/10" : "ring-2 ring-neutral-100"
                )}
              >
                <AvatarFallback
                  className={cn(
                    "rounded-2xl text-xs font-black text-white",
                    comment.author === "Me" ? "bg-primary" : "bg-neutral-400"
                  )}
                >
                  {comment.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 group-hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-neutral-800">
                    {comment.author === "Me" ? "Tú (Soporte)" : comment.author}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase">
                    <Clock size={12} />
                    {timeAgo(comment.timestamp)}
                  </div>
                </div>
                <p className="text-sm font-medium text-neutral-600 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- 3. TICKET SIDEBAR METADATA ---
export function TicketMetadataSidebar({
  ticket,
  isIT,
  isAdmin,
  editing,
  updating,
  staff,
  currentUser,
  onUpdateField,
  onAutoAssign,
  onEscalate,
  onDelete
}: any) {
  const priorities = ["Crítica", "Alta", "Media", "Baja"];
  
  const details = [
    { icon: User, label: "Solicitante", value: ticket.requester, color: "text-blue-500", key: 'req' },
    { icon: User, label: "Asignado a", value: ticket.assignee, color: "text-orange-500", isAssignee: true, key: 'assign' },
    { icon: Building, label: "Departamento", value: ticket.department, color: "text-purple-500", key: 'dept', isDept: true },
    { icon: Tag, label: "Prioridad", value: getPriorityLabel(ticket.priority), color: "text-error", isBadge: true, isPriority: true, badgeVariant: ticket.priority === 'Crítica' ? 'destructive' : ticket.priority === 'Alta' ? 'warning' : ticket.priority === 'Baja' ? 'success' : 'secondary', key: 'prior' },
    { icon: Calendar, label: "Creado el", value: new Date(ticket.createdAt).toLocaleDateString() + " " + new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), color: "text-neutral-500", key: 'cal' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-premium overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <AlertCircle size={14} /> Detalles de Registro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {details.map((item) => (
            <div key={item.key} className="flex gap-4">
              <div className={cn("p-2 rounded-lg bg-neutral-50", item.color.replace('text-', 'bg-').replace('500', '50'))}>
                <item.icon size={16} className={item.color} />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{item.label}</p>
                {item.isAssignee && editing && isIT ? (
                  <select
                    className="w-full mt-1 text-sm font-bold bg-white border border-neutral-200 rounded-lg py-1.5 px-3 uppercase text-neutral-700 outline-none focus:border-primary disabled:opacity-50"
                    value={ticket.assigned_to_id || ""}
                    disabled={updating}
                    onChange={(e) => onUpdateField({ assigned_to_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  >
                    <option value="">Sin Asignar</option>
                    {staff.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                    ))}
                  </select>
                ) : item.isPriority && editing && isIT ? (
                  <select
                    className="w-full mt-1 text-sm font-bold bg-white border border-neutral-200 rounded-lg py-1.5 px-3 uppercase text-neutral-700 outline-none focus:border-primary disabled:opacity-50"
                    value={ticket.priority}
                    disabled={updating}
                    onChange={(e) => onUpdateField({ priority: e.target.value as any })}
                  >
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : item.isDept && editing && isIT ? (
                  <input
                    className="w-full mt-1 text-sm font-bold bg-white border border-neutral-200 rounded-lg py-1.5 px-3 uppercase text-neutral-700 outline-none focus:border-primary disabled:opacity-50"
                    value={ticket.department || ""}
                    placeholder="Departamento..."
                    disabled={updating}
                    onChange={(e) => onUpdateField({ department: e.target.value })}
                  />
                ) : item.isBadge ? (
                  <Badge variant={item.badgeVariant as any} className="font-black text-[10px] rounded-md px-2 py-0">
                    {item.value}
                  </Badge>
                ) : (
                  <p className="text-sm font-bold text-neutral-800">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions - Solamente visible para el equipo IT */}
      {isIT && (
        <div className="bg-secondary-50 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <h4 className="text-sm text-black uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
            <CheckCircle size={14} className="text-black" /> Acciones Rápidas
          </h4>
          <div className="grid grid-cols-1 gap-3 relative z-10">
            <Button
              variant="primary"
              className="w-full justify-start font-bold py-5 text-xs"
              onClick={onAutoAssign}
              disabled={updating || ticket.assigned_to_id === currentUser?.id}
            >
              Auto-asignarme Ticket
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start font-bold py-5 text-xs bg-white/10 hover:bg-white/20 border-none"
              onClick={onEscalate}
              disabled={updating || ticket.status === 'Cerrado' || ticket.status === 'Eliminado'}
            >
              Escalar a Senior
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start font-bold py-5 text-xs border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => onUpdateField({ status: 'Cerrado' })}
              disabled={updating || ticket.status === 'Cerrado' || ticket.status === 'Eliminado'}
            >
              <CheckCircle size={14} className="mr-2" /> Finalizar / Cerrar Ticket
            </Button>
            {isAdmin && (
               <Button
               variant="outline"
               className="w-full justify-start font-bold py-5 text-xs border-error/20 text-error hover:bg-error/5"
               onClick={onDelete}
               disabled={updating || ticket.status === 'Eliminado'}
             >
               <Trash2 size={14} className="mr-2" /> Eliminar Definitivamente
             </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

