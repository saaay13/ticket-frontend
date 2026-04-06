import React from "react";
import { Link } from "react-router";
import {
  ChevronUp,
  ChevronDown,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";
import {
  Ticket,
  getStatusColor,
  getPriorityColor,
  TicketStatus,
  TicketPriority,
  getStatusLabel,
  getPriorityLabel,
  getCategoryLabel
} from "@/data/ticketData";
import { cn } from "@/lib/Utils";
import { Badge } from "@/components/atoms";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent,
  Avatar,
  AvatarFallback
} from "@/components/molecules";
import { Mail, Calendar as CalendarIcon, User as UserIcon } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (key: any) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  sortKey,
  sortDir,
  onSort,
  openMenuId,
  setOpenMenuId,
  onDelete,
  isAdmin,
}) => {
  const SortIcon = ({ k }: { k: string }) => (
    <span className={cn("ml-1 inline-flex flex-col", sortKey === k ? "text-primary" : "text-muted-foreground")}>
      <ChevronUp size={10} className={cn("transition-opacity", sortKey === k && sortDir === "asc" ? "opacity-100" : "opacity-30")} />
      <ChevronDown size={10} className={cn("transition-opacity -mt-0.5", sortKey === k && sortDir === "desc" ? "opacity-100" : "opacity-30")} />
    </span>
  );

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto premium-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              {[
                { label: "ID del Ticket", key: "id" },
                { label: "Título", key: "title" },
                { label: "Prioridad", key: "priority" },
                { label: "Estado", key: "status" },
                { label: "Categoría", key: null },
                { label: "Asignado a", key: null },
                { label: "Creado", key: "createdAt" },
                { label: "", key: null },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={col.key ? () => onSort(col.key) : undefined}
                  className={cn(
                    "text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none transition-colors",
                    col.key && "cursor-pointer hover:bg-neutral-100/50"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.key && <SortIcon k={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-20 text-muted-foreground">
                  <Filter size={40} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-medium">No se encontraron incidencias con los filtros aplicados.</p>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => {
                const sc = getStatusColor(ticket.status as TicketStatus);
                const pc = getPriorityColor(ticket.priority as TicketPriority);
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-neutral-50/80 transition-all duration-200 group"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        to={`/dashboard/tickets/${ticket.id}`}
                        className="text-sm font-semibold text-neutral-800 hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {ticket.title}
                      </Link>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="text-[11px] mt-1 block text-muted-foreground font-bold hover:text-primary transition-colors cursor-help">
                            {ticket.requester} · {getCategoryLabel(ticket.category)}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-6 bg-white rounded-3xl border-none shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                          <div className="flex justify-between space-x-4">
                            <Avatar className="size-12 rounded-2xl ring-4 ring-primary/10">
                              <AvatarFallback className="bg-primary text-white text-sm font-black rounded-2xl">
                                {ticket.requester.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <h4 className="text-sm font-black text-neutral-800 tracking-tight">{ticket.requester}</h4>
                              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                                <UserIcon size={12} className="text-primary" /> Solicitante del Caso
                              </p>
                              <div className="flex items-center pt-3 gap-4">
                                <div className="flex items-center gap-1.5">
                                  <CalendarIcon size={12} className="text-neutral-300" />
                                  <span className="text-[10px] font-bold text-neutral-500 uppercase">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Mail size={12} className="text-neutral-300" />
                                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Contacto Directo</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge
                        variant={ticket.priority === 'Crítica' ? 'destructive' : ticket.priority === 'Alta' ? 'warning' : ticket.priority === 'Baja' ? 'success' : 'secondary'}
                        className="rounded-lg px-2.5 py-1 text-[11px] border-none font-bold"
                      >
                        {getPriorityLabel(ticket.priority)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge
                        variant={ticket.status === 'Resuelto' ? 'success' : ticket.status === 'En Progreso' ? 'info' : ticket.status === 'Abierto' ? 'warning' : 'secondary'}
                        className="rounded-lg px-2.5 py-1 text-[11px] border-none font-bold shadow-xs transition-transform group-hover:scale-105"
                      >
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg uppercase">
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm transition-transform group-hover:rotate-6",
                            ticket.assignee !== 'Sin Asignar' ? "bg-primary" : "bg-neutral-300"
                          )}
                        >
                          {ticket.assigneeAvatar}
                        </div>
                        <span className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
                          {ticket.assignee === 'Sin Asignar' ? 'Sin Asignar' : ticket.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-bold text-neutral-400">
                        {new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === ticket.id ? null : ticket.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-200 transition-all active:scale-90"
                        >
                          <MoreVertical size={16} className="text-neutral-400" />
                        </button>
                        {openMenuId === ticket.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-card rounded-xl shadow-xl border border-border z-30 py-1.5 animate-in fade-in zoom-in duration-200">
                            <Link
                              to={`/dashboard/tickets/${ticket.id}`}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-primary/5 hover:text-primary transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Eye size={15} /> Ver Detalles
                            </Link>
                            {isAdmin && (
                              <>
                                <div className="h-px bg-neutral-100 my-1 mx-2" />
                                <button
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-error hover:bg-error/5 transition-colors"
                                  onClick={() => {
                                    onDelete?.(ticket.id);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Trash2 size={15} /> Eliminar Ticket
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
