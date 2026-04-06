import { useState } from "react";
import { Save, Bell, Shield, Palette, Globe, CheckCircle, Clock } from "lucide-react";
import { Button, Switch, Badge } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules";
import { cn } from "@/lib/Utils";
import { useTheme } from "@/context/ThemeContext";

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [sla, setSla] = useState({ critical: "4", high: "8", medium: "24", low: "72" });
  const [notif, setNotif] = useState({
    newTicket: true, assignment: true, statusChange: true, comment: false, slaAlert: true,
  });
  const [general, setGeneral] = useState({
    orgName: "Acme Corporation", supportEmail: "support@acme.com", timezone: "America/New_York",
    language: "English", autoAssign: true, requireDueDate: false,
  });
  const { theme: currentTheme, setTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ icon: Icon, title, description, children }: {
    icon: React.ElementType; title: string; description?: string; children: React.ReactNode;
  }) => (
    <Card className="border-none shadow-premium bg-white overflow-hidden">
      <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-neutral-800">{title}</CardTitle>
            {description && <p className="text-xs font-medium text-neutral-400 mt-0.5">{description}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">{children}</CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Configuración</h1>
          <p className="text-neutral-500 font-medium text-sm">Gestiona los parámetros globales de tu sistema de soporte.</p>
        </div>
        <Button
          onClick={handleSave}
          className="px-8 py-6 font-black shadow-lg shadow-primary/20"
        >
          {saved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
          {saved ? "¡Cambios Guardados!" : "Guardar Configuración"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General */}
        <Section icon={Globe} title="General" description="Información básica y localización de la plataforma">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Nombre de la Organización</label>
              <input
                type="text"
                value={general.orgName}
                onChange={(e) => setGeneral({ ...general, orgName: e.target.value })}
                className="w-full px-4 py-3.5 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email de Soporte</label>
              <input
                type="email"
                value={general.supportEmail}
                onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                className="w-full px-4 py-3.5 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Zona Horaria</label>
              <select
                value={general.timezone}
                onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                className="w-full px-4 py-3.5 text-sm font-black rounded-2xl border border-neutral-200 bg-white focus:border-primary transition-all outline-none"
              >
                <option value="America/New_York">America/New York (EST)</option>
                <option value="America/Chicago">America/Chicago (CST)</option>
                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Madrid">Europe/Madrid (CET)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Idioma</label>
              <select
                value={general.language}
                onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                className="w-full px-4 py-3.5 text-sm font-black rounded-2xl border border-neutral-200 bg-white focus:border-primary transition-all outline-none"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Portuguese</option>
                <option>French</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-50 flex items-center justify-between group">
            <div>
              <p className="text-sm font-black text-neutral-700">Asignación automática de tickets</p>
              <p className="text-xs font-medium text-neutral-400 mt-0.5">Asignar nuevos tickets a agentes disponibles según carga de trabajo</p>
            </div>
            <Switch checked={general.autoAssign} onCheckedChange={(v) => setGeneral({ ...general, autoAssign: v })} />
          </div>
          <div className="pt-6 border-t border-neutral-50 flex items-center justify-between group">
            <div>
              <p className="text-sm font-black text-neutral-700">Requerir fecha de compromiso</p>
              <p className="text-xs font-medium text-neutral-400 mt-0.5">Hacer obligatoria la fecha de entrega al crear tickets</p>
            </div>
            <Switch checked={general.requireDueDate} onCheckedChange={(v) => setGeneral({ ...general, requireDueDate: v })} />
          </div>
        </Section>

        {/* SLA */}
        <Section icon={Shield} title="Configuración de SLA" description="Tiempos máximos de respuesta (en horas) por nivel de prioridad">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {(["critical", "high", "medium", "low"] as const).map((level) => {
              const variants: Record<string, any> = {
                critical: "destructive",
                high: "warning",
                medium: "primary",
                low: "success",
              };
              return (
                <div key={level} className="space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <Badge variant={variants[level]} className="uppercase text-[10px] font-black px-2 py-0">
                    {level}
                  </Badge>
                  <div className="relative">
                    <input
                      type="number"
                      value={sla[level]}
                      onChange={(e) => setSla({ ...sla, [level]: e.target.value })}
                      className="w-full px-4 py-3 text-lg font-black rounded-xl border border-neutral-200 pr-12 focus:border-primary transition-all outline-none"
                      min={1}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-400 uppercase">h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notificaciones" description="Controla qué alertas deseas recibir y en qué eventos">
          <div className="space-y-2">
            {[
              { key: "newTicket", label: "Nuevo ticket creado", desc: "Alertas al recibir una nueva solicitud de soporte" },
              { key: "assignment", label: "Ticket asignado a mí", desc: "Notificar cuando se me asigne un caso directamente" },
              { key: "statusChange", label: "Cambios de estado", desc: "Actualizaciones sobre el ciclo de vida del ticket" },
              { key: "comment", label: "Nuevos comentarios", desc: "Respuestas de clientes u otros agentes" },
              { key: "slaAlert", label: "Alertas de vencimiento (SLA)", desc: "Avisos cuando un ticket está próximo a vencer" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 px-2 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-black text-neutral-700">{item.label}</p>
                  <p className="text-xs font-medium text-neutral-400 mt-0.5">{item.desc}</p>
                </div>
                <Switch
                  checked={notif[item.key as keyof typeof notif]}
                  onCheckedChange={(v) => setNotif({ ...notif, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Apariencia" description="Personaliza la identidad visual de tu interfaz">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Paleta de Colores de Marca</p>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "green", color: "bg-emerald-600", label: "Vibrant Green" },
                { id: "blue", color: "bg-blue-800", label: "Professional Blue" },
                { id: "purple", color: "bg-purple-600", label: "Modern Purple" },
                { id: "red", color: "bg-red-600", label: "Urgent Red" },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  title={themeItem.label}
                  onClick={() => setTheme(themeItem.id as any)}
                  className={cn(
                    "w-12 h-12 rounded-2xl transition-all border-4 flex items-center justify-center relative",
                    currentTheme === themeItem.id ? "border-primary shadow-lg scale-110" : "border-transparent hover:scale-105"
                  )}
                >
                  <div className={cn("w-full h-full rounded-xl", themeItem.color)} />
                  {currentTheme === themeItem.id && <CheckCircle size={16} className="absolute text-white" />}
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
              <Clock size={16} className="text-primary" />
              <p className="text-xs font-black text-primary uppercase tracking-widest">
                Tema actual: {currentTheme.toUpperCase()} (Forest Premium)
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

