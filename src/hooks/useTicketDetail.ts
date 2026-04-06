import { useState, useEffect, useCallback } from "react";
import { getTicketById, getComments, updateTicket, Ticket, Comment } from "@/data/ticketData";
import { ticketService } from "@/services/TicketService";
import { useAuth } from "@/context/AuthContext";

export function useTicketDetail(id: string | undefined) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const { user: authUser } = useAuth();

  // Cargar ticket y comentarios
  const loadData = useCallback(async (isSilent = false) => {
    if (!id) return;
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const [ticketData, commentsData] = await Promise.all([
        getTicketById(id),
        getComments(id)
      ]);
      setTicket(ticketData);
      setComments(commentsData);
    } catch (err) {
      console.error('Error loading ticket:', err);
      if (!isSilent) setError('Error al cargar detalles del ticket.');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Manejar adicion de un nuevo comentario (Modo Turbo)
  const addComment = useCallback(async (content: string) => {
    if (!content.trim() || !id) return;
    try {
      setUpdating(true);
      await ticketService.addComment(id, content.trim());
      await loadData(true);
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [id, loadData]);

  // Actualizar campo (Modo Turbo: Gestiona el estado local incluso antes del fetch)
  const updateTicketField = useCallback(async (data: Partial<Ticket>) => {
    if (!id || !ticket) return false;
    try {
      setUpdating(true);

      setTicket(prev => prev ? ({ ...prev, ...data }) : null);

      await updateTicket(id, data);
      await loadData(true);
      return true;
    } catch (err) {
      console.error('Error updating ticket:', err);
      await loadData(true);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [id, ticket, loadData]);

  return {
    ticket,
    comments,
    loading,
    error,
    updating,
    addComment,
    refresh: () => loadData(true),
    setTicket,
    updateTicketField
  };
}
