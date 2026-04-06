import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Plus, ListFilter, Search, Ticket as TicketIcon, Trash2 } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory
} from "@/data/ticketData";
import { ticketService } from "@/services/TicketService";
import {
  TicketFilters,
  TicketTable,
  TicketPagination
} from "@/components/organisms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules";
import { Button, Badge, Skeleton } from "@/components/atoms";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/Utils";

const STATUSES: TicketStatus[] = ["Open", "In Progress", "Pending", "Resolved", "Closed"];
const PRIORITIES: TicketPriority[] = ["Critical", "High", "Medium", "Low"];
const CATEGORIES: TicketCategory[] = ["Hardware", "Software", "Network", "Security", "Access Request", "Email", "Other"];

export function TicketList({ myTickets = false }: { myTickets?: boolean }) {
  const { user } = useAuth();
  const isIT = user?.role === 'Admin' || user?.role === 'Agent';
  const isAdmin = user?.role === 'Admin';

  // Navegación y Ordenamiento
  const [viewMode, setViewMode] = useState<"all" | "created" | "assigned">(myTickets ? "created" : "all");
  const [sortKey, setSortKey] = useState<keyof Ticket>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const backendSortMap: Partial<Record<keyof Ticket, string>> = {
    createdAt: "created_at",
    updatedAt: "updated_at",
    ticketNumber: "ticket_number",
    status: "status",
    priority: "details->priority",
    id: "id",
    title: "title"
  };

  // Hook de Datos (Ordenamiento en Servidor)
  const { tickets, loading, error, refresh } = useTickets({
    createdOnly: viewMode === "created",
    assignedOnly: viewMode === "assigned",
    sort: backendSortMap[sortKey] || "created_at",
    order: sortDir
  });

  // Filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Paginación y Diálogos
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const PER_PAGE = 8;

  const baseTickets = tickets;

  const filtered = useMemo(() => {
    return baseTickets.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.requester.toLowerCase().includes(search.toLowerCase());

      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchPriority = !priorityFilter || t.priority === priorityFilter;
      const matchCategory = !categoryFilter || t.category === categoryFilter;

      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }, [baseTickets, search, statusFilter, priorityFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key: keyof Ticket) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!selectedTicketId) return;
    try {
      await ticketService.delete(selectedTicketId);
      refresh();
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedTicketId(id);
    setShowDeleteDialog(true);
  };

  const activeFilters = [statusFilter, priorityFilter, categoryFilter].filter(Boolean).length;

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end pb-8 border-b border-neutral-100">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64 bg-neutral-100 rounded-xl" />
            <Skeleton className="h-4 w-32 bg-neutral-50 rounded-lg" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 bg-neutral-100 rounded-2xl" />
            <Skeleton className="h-14 w-48 bg-neutral-100 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-16 w-full bg-neutral-50 rounded-2xl" />
          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-premium-subtle">
            <div className="p-6 border-b border-neutral-50">
              <Skeleton className="h-6 w-full bg-neutral-50" />
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-6 border-b border-neutral-50 last:border-0 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="h-10 w-20 rounded-lg bg-neutral-50" />
                  <Skeleton className="h-4 w-1/3 rounded-lg bg-neutral-50" />
                </div>
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-8 w-24 rounded-lg bg-neutral-50" />
                  <Skeleton className="h-10 w-10 rounded-full bg-neutral-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center py-20 bg-error/5 rounded-[2rem] border border-error/10">
        <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TicketIcon size={32} className="text-error" />
        </div>
        <h2 className="text-xl font-black text-error mb-2">Error de comunicación</h2>
        <p className="text-sm font-medium text-error/70">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-6 border-error/20 text-error hover:bg-error hover:text-white"
        >
          Reintentar ahora
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
            {myTickets ? "Mis Tickets" : "Explorador de Incidencias"}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-[10px] font-black uppercase tracking-widest px-2 py-0 border-none">
              {filtered.length} Encontrados
            </Badge>
          </div>
        </div>

        {/* Selector de Vista */}
        <div className="flex items-center gap-2 bg-neutral-100/50 p-1.5 rounded-2xl w-fit border border-neutral-200/50">
          {[
            ...(!myTickets ? [{ id: "all", label: "Globales", icon: TicketIcon }] : []),
            { id: "created", label: "Mis Reportes", icon: Plus },
            ...(isIT ? [{ id: "assigned", label: "Mis Tareas", icon: TicketIcon }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                viewMode === tab.id
                  ? "bg-white text-primary shadow-md shadow-primary/5"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {isAdmin && (
          <Link to="/dashboard/tickets/trash">
            <Button
              variant="outline"
              className="p-3 border-neutral-100 text-neutral-400 hover:text-error hover:bg-error/5 hover:border-error/10 transition-all rounded-2xl group"
              title="Tickets Eliminados"
            >
              <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
        )}

        <Link to="/dashboard/tickets/new">
          <Button className="px-8 py-7 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
            <Plus size={18} className="mr-2 stroke-[3px]" /> NUEVO REPORTE
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <TicketFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
          priorityFilter={priorityFilter}
          onPriorityChange={(v) => { setPriorityFilter(v); setPage(1); }}
          categoryFilter={categoryFilter}
          onCategoryChange={(v) => { setCategoryFilter(v); setPage(1); }}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFilters={activeFilters}
          onClearFilters={() => { setStatusFilter(""); setPriorityFilter(""); setCategoryFilter(""); setPage(1); }}
          statuses={STATUSES}
          priorities={PRIORITIES}
          categories={CATEGORIES}
        />

        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          <TicketTable
            tickets={paginated}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onDelete={confirmDelete}
            isAdmin={isAdmin}
          />

          <TicketPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            filteredCount={filtered.length}
            perPage={PER_PAGE}
          />
        </div>
      </div>

      {/* Diálogo de Confirmación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white rounded-3xl border-none shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-neutral-800 tracking-tight">¿Eliminar este Ticket?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500 font-medium text-base">
              Esta acción moverá el ticket a la papelera. Podrá ser restaurado por un administrador más tarde. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel className="rounded-2xl py-6 px-8 font-black text-xs uppercase tracking-widest border-neutral-100 hover:bg-neutral-50 transition-all">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-2xl py-6 px-8 font-black text-xs uppercase tracking-widest bg-error hover:bg-error/90 text-white shadow-lg shadow-error/20 transition-all border-none"
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

