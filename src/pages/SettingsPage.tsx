import { useState, useEffect } from "react";
import { Save, Palette, CheckCircle, User as UserIcon, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules";
import { cn } from "@/lib/Utils";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/UserService";

export function SettingsPage() {
  const { user, updateUserLocal } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.update(user.id, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });
      updateUserLocal(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
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
          <p className="text-neutral-500 font-medium text-sm">Gestiona tu perfil y personaliza tu experiencia en la plataforma.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile */}
        <Section icon={UserIcon} title="Perfil de Usuario" description="Información personal y de contacto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Nombre</label>
              <div className="relative group">
                <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Apellido</label>
              <div className="relative group">
                <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-medium rounded-2xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-error mt-2 ml-1">{error}</p>
          )}

          <div className="pt-6 border-t border-neutral-50 flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-8 py-6 font-black shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle size={18} className="mr-2" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {loading ? "Guardando..." : saved ? "¡Datos Actualizados!" : "Guardar Cambios"}
            </Button>
          </div>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Apariencia" description="Personaliza la identidad visual de tu interfaz">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6 block">Paleta de Colores de Marca</p>
            <div className="flex flex-wrap gap-6">
              {[
                { id: "green", color: "bg-emerald-600", label: "Vaquero Green" },
                { id: "blue", color: "bg-blue-600", label: "Ocean Blue" },
                { id: "purple", color: "bg-purple-600", label: "Modern Purple" },
                { id: "red", color: "bg-red-600", label: "Urgent Red" },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  title={themeItem.label}
                  onClick={() => setTheme(themeItem.id as any)}
                  className={cn(
                    "w-16 h-16 rounded-[1.5rem] transition-all border-4 flex items-center justify-center relative",
                    currentTheme === themeItem.id ? "border-primary shadow-2xl scale-110" : "border-transparent hover:scale-105 hover:bg-neutral-50"
                  )}
                >
                  <div className={cn("w-full h-full rounded-2xl", themeItem.color)} />
                  {currentTheme === themeItem.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-4">
              <div className={cn("w-3 h-3 rounded-full animate-pulse", 
                currentTheme === 'green' ? 'bg-emerald-500' :
                currentTheme === 'blue' ? 'bg-blue-500' :
                currentTheme === 'purple' ? 'bg-purple-500' : 'bg-red-500'
              )} />
              <p className="text-xs font-black text-primary uppercase tracking-widest">
                Tema activo: {currentTheme.toUpperCase()} (Forest UI)
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}


