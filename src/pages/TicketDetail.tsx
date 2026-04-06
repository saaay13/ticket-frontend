import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AlertCircle, Tag } from "lucide-react";
import { useTicketDetail } from "@/hooks/useTicketDetail";
import { Badge, Button, Separator } from "@/components/atoms";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules";
import { TicketHeader, TicketThread, TicketMetadataSidebar } from "@/components/organisms";
import { useAuth } from "@/context/AuthContext";
import { userService, User as StaffUser } from "@/services/UserService";
import { ticketService } from "@/services/TicketService";

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    ticket,
    comments,
    loading,
    error,
    updating,
    addComment,
    updateTicketField
  } = useTicketDetail(id);

  const { user } = useAuth();
  const isIT = user?.role === 'Admin' || user?.role === 'Agent';
  const isAdmin = user?.role === 'Admin';

  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [staff, setStaff] = useState<StaffUser[]>([]);

  useEffect(() => {
    if (ticket) setCurrentStatus(ticket.status);
  }, [ticket]);

  useEffect(() => {
    userService.getAll().then(data => {
      setStaff(data.filter((u: any) => u.role === 'Admin' || u.role === 'Agent' || u.role === 'agente'));
    }).catch(err => console.error(err));
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || !id) return;
    try {
      const success = await updateTicketField({ status: newStatus.toLowerCase().replace(' ', '_') as any });
      if (success) {
        setCurrentStatus(newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAutoAssign = async () => {
    if (!user) return;
    await updateTicketField({ assigned_to_id: user.id });
  };

  const handleEscalate = async () => {
    await updateTicketField({ priority: "Critical" as any });
    await addComment("Ticket escalado a Senior (Prioridad Crítica).");
  };

  const handleDelete = async () => {
    if (!ticket || !id) return;
    try {
      await ticketService.delete(id);
      navigate("/dashboard/tickets");
    } catch (err) {
      console.error('Error deleting ticket:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-muted-foreground mt-6 uppercase tracking-widest">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-neutral-400" />
        </div>
        <h2 className="text-2xl font-black text-neutral-800 mb-2">Ticket no encontrado</h2>
        <p className="text-neutral-500 font-medium mb-8 max-w-xs">
          {error || "Lo sentimos, el ticket que buscas no está disponible o ha sido eliminado."}
        </p>
        <Button onClick={() => navigate("/tickets")} className="px-8 font-bold">
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <TicketHeader
        ticket={ticket}
        currentStatus={currentStatus}
        isIT={isIT}
        isAdmin={isAdmin}
        updating={updating}
        editing={editing}
        onStatusChange={handleStatusChange}
        onToggleEdit={() => setEditing(!editing)}
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-premium bg-white">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-500">Descripción del Caso</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed font-medium">
                {ticket.description}
              </div>

              {ticket.tags && ticket.tags.length > 0 && (
                <div className="space-y-6 mt-8">
                  <Separator className="bg-neutral-100" />
                  <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase border-neutral-100"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          <TicketThread
            comments={comments}
            onAddComment={addComment}
            updating={updating}
          />
        </div>

        <TicketMetadataSidebar
          ticket={ticket}
          isIT={isIT}
          isAdmin={isAdmin}
          editing={editing}
          updating={updating}
          staff={staff}
          currentUser={user}
          onUpdateField={updateTicketField}
          onAutoAssign={handleAutoAssign}
          onEscalate={handleEscalate}
          onDelete={() => setShowDeleteDialog(true)}
        />
      </div>

      {/* Modern Confirmation Dialog */}
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
