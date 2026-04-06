import React from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/atoms";
import { Card } from "@/components/molecules";

export interface TicketSuccessMessageProps {
  ticketId: string;
  onReset: () => void;
}

export function TicketSuccessMessage({ ticketId, onReset }: TicketSuccessMessageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex items-center justify-center min-h-[500px] animate-in zoom-in duration-300">
      <Card className="max-w-md w-full text-center p-8 border-none shadow-premium bg-white">
        <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h2 className="text-3xl font-black text-neutral-800 mb-2">¡Ticket Creado!</h2>
        <p className="text-neutral-500 font-medium mb-1">
          Tu reporte ha sido enviado satisfactoriamente.
        </p>
        <div className="my-6 p-3 bg-primary/5 rounded-xl border border-primary/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">ID del Ticket</span>
          <p className="text-2xl font-black text-primary tracking-tight">#{ticketId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/tickets")}
            className="w-full py-6 font-black shadow-lg shadow-primary/20"
          >
            Ir a mis tickets
          </Button>
          <button
            onClick={onReset}
            className="w-full py-4 rounded-xl text-xs font-black text-neutral-400 hover:text-neutral-600 uppercase tracking-widest transition-colors"
          >
            Crear otro ticket
          </button>
        </div>
      </Card>
    </div>
  );
}
