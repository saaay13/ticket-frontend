import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Info } from "lucide-react";
import { CreateTicketForm, TicketSuccessMessage } from "@/components/organisms";

export function CreateTicket() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [newTicketId, setNewTicketId] = useState("");

  if (submitted) {
    return <TicketSuccessMessage ticketId={newTicketId} onReset={() => setSubmitted(false)} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} /> Volver
        </button>
        <span className="text-neutral-200">|</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Nuevo Ticket de Soporte</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Crear Incidencia</h1>
          <p className="text-neutral-500 font-medium text-sm">
            Completa los detalles para que nuestro equipo pueda ayudarte lo antes posible.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-100">
          <Info size={16} className="text-primary" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Llenado Obligatorio (*)</p>
        </div>
      </div>

      <CreateTicketForm onSuccess={(ticketId) => {
        setNewTicketId(ticketId);
        setSubmitted(true);
      }} />
    </div>
  );
}
