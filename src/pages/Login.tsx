import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Monitor, Ticket, Mail, Lock, Eye, EyeOff, ArrowLeft, Send, CheckCircle, AlertCircle, User as UserIcon, UserPlus, Building } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button, Input } from "@/components/atoms";
import { UiFormField } from "@/components/molecules";

type View = "login" | "forgot" | "success" | "register";

export function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🛰️ Detectar ruta inicial (Login o Registro)
  useEffect(() => {
    const isRegisterPath = window.location.pathname.includes("register");
    if (isRegisterPath) {
      setView("register");
    } else {
      setView("login");
    }
  }, []);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");

  // Forgot State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Por favor, completa todos los campos.");
      return;
    }
    setIsLoading(true);
    try {
      await auth.login({ email: loginEmail, password: loginPassword });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setLoginError(err.message || "Credenciales incorrectas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    
    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      setRegError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      if (auth && 'register' in auth) {
        await (auth as any).register({
          first_name: regFirstName,
          last_name: regLastName,
          email: regEmail,
          password: regPassword,
          department_id: null // Se crea sin departamento por defecto
        });
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      setRegError(err.message || "Error al crear la cuenta.");
    } finally {
      setIsLoading(false);
    }
  };

  const bgImage =
    "https://images.unsplash.com/photo-1526925539332-aa3b66e35444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwc3VwcG9ydCUyMGhlbHBkZXNrJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MjgyNDQxNXww&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="min-h-screen w-full flex bg-neutral-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-transparent to-black/20" />
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl tracking-tight">Soporte IT</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Plataforma Institucional</p>
            </div>
          </div>

          <div>
             <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-md border border-white/10 shadow-lg">
               <Monitor className="w-9 h-9 text-white" />
             </div>
             <h1 className="text-white text-5xl font-black leading-tight mb-6 animate-in fade-in slide-in-from-left duration-700">
               Transformando el
               <br /><span className="text-primary-200 text-6xl">Soporte Técnico</span>
             </h1>
             <p className="text-white/80 text-lg leading-relaxed max-w-sm font-medium">
               Gestiona incidencias, rastrea equipos y resuelve problemas con eficiencia premium.
             </p>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold">
             <span>© 2026 COSABE IT System</span>
             <span className="w-1 h-1 rounded-full bg-white/20" />
             <span>v2.5 Premium Edition</span>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-4 mb-10 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-xl text-neutral-900 tracking-tight">Soporte IT</p>
          </div>

          {/* LOGIN VIEW */}
          {view === "login" && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-neutral-900">Bienvenido</h2>
                <p className="text-neutral-500 font-medium text-sm mt-1">Ingresa para gestionar tus tickets</p>
              </div>
              
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <UiFormField
                  label="Correo electrónico"
                  placeholder="usuario@cosabe.edu.bo"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />

                <div className="relative">
                  <UiFormField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] z-10 text-neutral-400 hover:text-primary transition-colors p-1">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {loginError && (
                  <div className="rounded-xl px-4 py-3 text-xs font-bold bg-error/10 text-error border border-error/20 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {loginError}
                  </div>
                )}

                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={() => setView("forgot")} className="text-xs font-bold text-primary hover:text-primary-700">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button type="submit" className="w-full py-6 text-sm font-bold shadow-lg shadow-primary/20" isLoading={isLoading}>
                  Iniciar Sesión
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-neutral-500 font-medium">
                    ¿No tienes una cuenta?{" "}
                    <button type="button" onClick={() => setView("register")} className="text-primary font-black hover:underline">
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === "register" && (
            <div className="animate-in fade-in slide-in-from-bottom duration-300">
              <div className="mb-8">
                <button type="button" onClick={() => setView("login")} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-primary mb-4">
                  <ArrowLeft size={14} /> Volver al login
                </button>
                <h2 className="text-3xl font-black text-neutral-900">Crear Cuenta</h2>
                <p className="text-neutral-500 font-medium text-sm mt-1">Únete a la plataforma de soporte</p>
              </div>
              
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <UiFormField
                    label="Nombre"
                    placeholder="Juan"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                  />
                  <UiFormField
                    label="Apellido"
                    placeholder="Pérez"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                  />
                </div>

                <UiFormField
                  label="Correo institucional"
                  placeholder="j.perez@cosabe.edu.bo"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  icon={<Mail size={16} />}
                />

                <UiFormField
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  icon={<Lock size={16} />}
                />

                {regError && (
                  <div className="rounded-xl px-4 py-3 text-xs font-bold bg-error/10 text-error border border-error/20 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {regError}
                  </div>
                )}

                <Button type="submit" className="w-full py-6 text-sm font-bold shadow-lg shadow-primary/20 mt-4" isLoading={isLoading}>
                  <UserPlus size={18} className="mr-2" /> Crear Mi Cuenta
                </Button>
              </form>
            </div>
          )}

          {/* FORGOT & SUCCESS VIEWS (Same as before) */}
          {view === "forgot" && (
            <div className="animate-in fade-in slide-in-from-right duration-300">
              <button type="button" onClick={() => setView("login")} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-primary mb-8 transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al login
              </button>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-neutral-900">Recuperar Acceso</h2>
                <p className="text-neutral-500 font-medium text-sm mt-1">Te enviaremos un enlace de restablecimiento.</p>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!forgotEmail) return;
                setIsLoading(true);
                try {
                  if (auth && 'forgotPassword' in auth) {
                    await (auth as any).forgotPassword(forgotEmail);
                    setView("success");
                  }
                } catch (err: any) {
                  setForgotError(err.message || "Error al enviar enlace.");
                } finally {
                  setIsLoading(false);
                }
              }} className="flex flex-col gap-6">
                <UiFormField label="Correo electrónico" placeholder="usuario@cosabe.edu.bo" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
                {forgotError && <div className="rounded-xl px-4 py-3 text-xs font-bold bg-error/10 text-error border border-error/20 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{forgotError}</div>}
                <Button type="submit" className="w-full py-6 text-sm font-bold shadow-lg shadow-primary/20" isLoading={isLoading}><Send size={16} className="mr-2" /> Enviar enlace</Button>
              </form>
            </div>
          )}

          {view === "success" && (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10 border border-success/20 shadow-inner"><CheckCircle size={32} className="text-success" /></div>
              <h2 className="text-3xl font-black text-neutral-900 mb-2">¡Revisa tu correo!</h2>
              <p className="text-sm font-medium text-neutral-500 mb-8 max-w-xs mx-auto">Si existe una cuenta con {forgotEmail}, recibirás instrucciones en unos minutos.</p>
              <Button onClick={() => setView("login")} variant="secondary" className="w-full py-6 text-sm font-bold">Volver al inicio</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
