import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, RefreshCw, Trash2, ShieldAlert } from "lucide-react";
import { ticketService, Ticket } from "@/services/TicketService";
import { Button, Badge } from "@/components/atoms";
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
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/Utils";

export function TicketTrash() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTrash();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la papelera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/dashboard/tickets');
      return;
    }
    loadData();
  }, [user]);

  const handleRestore = async () => {
    if (!selectedTicketId) return;
    try {
      await ticketService.restore(selectedTicketId);
      loadData();
      setShowRestoreDialog(false);
    } catch (err) {
      console.error(err);
      alert("Error al restaurar");
    }
  };

  const confirmRestore = (id: string) => {
    setSelectedTicketId(id);
    setShowRestoreDialog(true);
  };

  if (loading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-neutral-900 flex items-center gap-3">
            <Trash2 className="text-error" /> Papelera de Tickets
          </h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Sección EXCLUSIVA de Administrador</p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-neutral-50 rounded-[2rem] border-2 border-dashed border-neutral-200 p-20 text-center">
          <Trash2 size={64} className="mx-auto mb-6 text-neutral-200" />
          <h2 className="text-xl font-bold text-neutral-400 uppercase tracking-widest">Papelera Vacía</h2>
          <p className="text-neutral-400 mt-2">No hay tickets eliminados para mostrar.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-premium border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100 uppercase text-[10px] font-black tracking-widest text-muted-foreground">
                <th className="px-6 py-4 text-left">Ticket</th>
                <th className="px-6 py-4 text-left">Título</th>
                <th className="px-6 py-4 text-left">Eliminado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md">
                      #{t.ticket_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-neutral-800 line-clamp-1">{t.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.requester?.first_name} {t.requester?.last_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-neutral-500">
                      {new Date(t.updated_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      className="px-4 py-2 text-xs font-black border-neutral-200 text-neutral-600 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                      onClick={() => confirmRestore(t.id)}
                    >
                      <RefreshCw size={14} className="mr-2" /> RESTAURAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-error/5 p-6 rounded-3xl border border-error/10 flex items-start gap-4">
        <div className="p-3 bg-error/10 rounded-2xl text-error">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-error uppercase tracking-widest mb-1">Aviso de Seguridad</h4>
          <p className="text-xs font-medium text-error/70 leading-relaxed max-w-2xl">
            Esta sección es solo para el equipo de administración. Aquí puedes recuperar incidencias que fueron retiradas de la vista principal. Un ticket restaurado volverá automáticamente al estado "Abierto".
          </p>
        </div>
      </div>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent className="bg-white rounded-3xl border-none shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-neutral-800 tracking-tight">¿Restaurar Ticket?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500 font-medium text-base">
              El ticket volverá a aparecer en la lista activa de incidencias con estado "Abierto".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel className="rounded-2xl py-6 px-8 font-black text-xs uppercase tracking-widest border-neutral-100 hover:bg-neutral-50 transition-all">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestore}
              className="rounded-2xl py-6 px-8 font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all border-none"
            >
              Sí, Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
