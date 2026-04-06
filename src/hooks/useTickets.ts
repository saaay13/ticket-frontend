import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTickets, Ticket } from "@/data/ticketData";

export interface TicketFilters {
  createdOnly?: boolean;
  assignedOnly?: boolean;
  sort?: string;
  order?: "asc" | "desc";
}

export function useTickets(filters?: TicketFilters) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {};
      if (filters?.sort) params.sort = filters.sort;
      if (filters?.order) params.order = filters.order;

      const data = await getTickets(params);
      
      let filtered = data;
      
      if (user) {
        if (filters?.createdOnly) {
          filtered = filtered.filter(t => Number(t.requester_id) === Number(user.id));
        }
        if (filters?.assignedOnly) {
          filtered = filtered.filter(t => Number(t.assigned_to_id) === Number(user.id));
        }
      }
      
      setTickets(filtered);
    } catch (err) {
      console.error("Error loading tickets:", err);
      setError("No se pudo conectar con el servidor de tickets.");
    } finally {
      setLoading(false);
    }
  }, [filters?.createdOnly, filters?.assignedOnly, filters?.sort, filters?.order, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tickets, loading, error, refresh };
}
