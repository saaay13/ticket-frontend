import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, AlertCircle, X, Tag, User, MapPin, Calendar, Type } from "lucide-react";
import { useTicketForm } from "@/hooks/useTicketForm";
import { Button, Input, Textarea } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules";
import { cn } from "@/lib/Utils";
import { getPriorityLabel } from "@/data/ticketData";

const PRIORITIES = ["Crítica", "Alta", "Media", "Baja"];

const priorityInfo: Record<string, { desc: string; color: string; bg: string; iconColor: string }> = {
  Crítica: { desc: "Impacto mayor, sistema caído", color: "text-error", bg: "bg-error/10", iconColor: "bg-error" },
  Alta: { desc: "Funcionalidad principal afectada", color: "text-warning", bg: "bg-warning/10", iconColor: "bg-warning" },
  Media: { desc: "Funcionalidad parcial afectada", color: "text-primary", bg: "bg-primary/10", iconColor: "bg-primary" },
  Baja: { desc: "Problema menor, con alternativa", color: "text-success", bg: "bg-success/10", iconColor: "bg-success" },
};

export interface CreateTicketFormProps {
  onSuccess: (ticketId: string) => void;
  onCancel?: () => void;
}

export function CreateTicketForm({ onSuccess, onCancel }: CreateTicketFormProps) {
  const navigate = useNavigate();
  const {
    form,
    errors,
    categories,
    departments,
    users,
    loading,
    submitting,
    error: submitError,
    updateField,
    submit
  } = useTicketForm();

  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = await submit();
    if (ticket) {
      onSuccess(ticket.ticket_number || ticket.id.toString());
    }
  };

  const FieldError = ({ field }: { field: keyof typeof form }) =>
    errors[field] ? (
      <span className="flex items-center gap-1.5 text-[10px] font-bold mt-1.5 text-error uppercase tracking-wider">
        <AlertCircle size={12} /> {errors[field]}
      </span>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* General Information */}
        <Card className="border-none shadow-premium bg-white overflow-hidden">
          <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <Tag size={14} /> Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                Título del problema <span className="text-error">*</span>
              </label>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Ej: Falla en conexión VPN corporativa"
                icon={<Type size={18} />}
                error={errors.title}
                className="py-6 px-12"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                Descripción detallada <span className="text-error">*</span>
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Explica qué está sucediendo, pasos para reproducir el error o cualquier mensaje que visualices..."
                rows={6}
                className={cn(
                  "rounded-3xl p-4 bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300",
                  errors.description ? "border-error" : "border-neutral-200"
                )}
              />
              <div className="flex items-center justify-between mt-1 px-1">
                <FieldError field="description" />
                <p className={cn("text-[10px] font-bold", form.description.length > 900 ? "text-error" : "text-neutral-400")}>
                  {form.description.length}/1000
                </p>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Requester Form Section */}
        <Card className="border-none shadow-premium bg-white overflow-hidden">
          <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <User size={14} /> Datos del Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                  Nombre Completo <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.requesterName}
                  onChange={(e) => updateField("requesterName", e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className={cn(
                    "w-full px-4 py-4 text-sm font-medium rounded-2xl border transition-all outline-none focus:ring-4 focus:ring-primary/10",
                    errors.requesterName ? "border-error bg-error/[0.02]" : "border-neutral-200 focus:border-primary"
                  )}
                />
                <FieldError field="requesterName" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                  Correo Institucional <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={form.requesterEmail}
                  onChange={(e) => updateField("requesterEmail", e.target.value)}
                  placeholder="usuario@empresa.com"
                  className={cn(
                    "w-full px-4 py-4 text-sm font-medium rounded-2xl border transition-all outline-none focus:ring-4 focus:ring-primary/10",
                    errors.requesterEmail ? "border-error bg-error/[0.02]" : "border-neutral-200 focus:border-primary"
                  )}
                />
                <FieldError field="requesterEmail" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                <MapPin size={10} /> Departamento de Origen <span className="text-error">*</span>
              </label>
              <select
                value={form.department_id}
                onChange={(e) => updateField("department_id", e.target.value)}
                className={cn(
                  "w-full px-4 py-4 text-sm font-black appearance-none rounded-2xl border transition-all outline-none bg-white focus:ring-4 focus:ring-primary/10",
                  errors.department_id ? "border-error" : "border-neutral-200 focus:border-primary",
                  !form.department_id && "text-neutral-300"
                )}
              >
                <option value="">Seleccionar departamento...</option>
                {departments.map((d: any) => <option key={d.id} value={d.id} className="text-neutral-800 font-bold">{d.name}</option>)}
              </select>
              <FieldError field="department_id" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar settings */}
      <div className="space-y-8">
        {/* Classification & Priority */}
        <Card className="border-none shadow-premium bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Tag size={14} /> Clasificación
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 block">
                Categoría del Ticket <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateField("category_id", cat.id.toString())}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between",
                      form.category_id === cat.id.toString()
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-neutral-100 bg-white text-neutral-400 hover:border-neutral-300"
                    )}
                  >
                    {cat.name}
                    {form.category_id === cat.id.toString() && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
              <FieldError field="category_id" />
            </div>

            <div className="pt-4 border-t border-neutral-50">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Prioridad Sugerida</label>
              <div className="space-y-3">
                {PRIORITIES.map((p) => {
                  const info = priorityInfo[p];
                  const isSelected = form.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updateField("priority", p)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all text-left group",
                        isSelected ? "border-current shadow-md scale-[1.02]" : "border-neutral-100 bg-white hover:border-neutral-300"
                      )}
                      style={{ color: isSelected ? `var(--priority-${p === 'Crítica' ? 'urgent' : p === 'Alta' ? 'high' : p === 'Media' ? 'medium' : 'low'})` : undefined }}
                    >
                      <div className={cn("w-3 h-3 rounded-full flex-shrink-0", info.iconColor)} />
                      <div className="flex-1">
                        <p className={cn("text-[10px] font-black uppercase tracking-widest", isSelected ? "text-current" : "text-neutral-700 group-hover:text-neutral-900")}>
                          {getPriorityLabel(p)}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-400 line-clamp-1">{info.desc}</p>
                      </div>
                      {isSelected && <CheckCircle size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Assignment (Optional) */}
        <Card className="border-none shadow-premium bg-white overflow-hidden">
          <CardHeader className="bg-neutral-50 border-b border-neutral-100">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <User size={14} /> Asignación Directa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <select
                value={form.assignee_id}
                onChange={(e) => updateField("assignee_id", e.target.value)}
                className="w-full px-4 py-4 text-xs font-bold rounded-2xl border border-neutral-100 transition-all outline-none bg-neutral-50 focus:border-primary focus:bg-white"
              >
                <option value="">Dejar sin asignar (Cola General)</option>
                {users.filter(u => u.role === 'Admin' || u.role === 'Agent').map((member: any) => (
                  <option key={member.id} value={member.id}>Asignar a: {member.first_name} {member.last_name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2">
                <Calendar size={12} /> Fecha de Compromiso
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                className="w-full px-4 py-3.5 text-xs font-bold rounded-2xl border border-neutral-100 outline-none focus:border-primary transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="space-y-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-7 font-black text-sm shadow-xl shadow-primary/20 animate-pulse hover:animate-none"
          >
            {submitting ? "Generando Ticket..." : "Emitir Ticket Ahora"}
          </Button>

          {submitError && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 animate-in shake duration-500">
              <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-error leading-tight">{submitError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onCancel ? onCancel : () => navigate(-1)}
            disabled={loading}
            className="w-full py-4 text-[10px] font-black text-neutral-400 hover:text-neutral-600 uppercase tracking-[0.2em] transition-all"
          >
            Cancelar Operación
          </button>
        </div>
      </div>
    </form>
  );
}
