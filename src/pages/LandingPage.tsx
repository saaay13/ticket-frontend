import React from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/atoms";
import {
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Users,
  Lock,
  ChevronRight
} from "lucide-react";

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  // Si ya tiene sesión, lo mandamos al Dashboard directamente
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen  selection:bg-primary/10 overflow-x-hidden">
      {/* 🚀 Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield size={22} className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-neutral-900 font-black text-lg leading-none tracking-tight">Soporte IT</span>
              <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sistema de Tickets</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-black text-xs uppercase tracking-widest">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-xl px-6 py-5 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all hover:scale-105 active:scale-95">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 🔮 Hero Section */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-[32rem] h-[32rem] bg-indigo-500/5 rounded-full blur-[150px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} className="text-primary" />
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">Resolución Inteligente v2.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tight leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Soporte Técnico <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-600 to-indigo-600">Elevado</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
            La plataforma definitiva para gestionar incidencias con velocidad extrema, seguridad de grado militar y una experiencia de usuario impecable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <Link to="/register">
              <Button size="lg" className="rounded-2xl px-10 py-8 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Crear Mi Cuenta <ArrowRight size={18} className="ml-2 stroke-[3px]" />
              </Button>
            </Link>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-black text-neutral-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white">
                +2k
              </div>
            </div>
            <p className="text-sm font-bold text-neutral-400 ml-2 italic">Únete a más de 2,000 usuarios activos</p>
          </div>
        </div>
      </section>

      {/* 🛡️ Values / Features */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4">¿Por qué elegirnos?</p>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Diseñado para la Excelencia Operativa</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Velocidad Extrema",
              desc: "Los agentes reciben alertas en tiempo real y gestionan tickets en segundos.",
              icon: Zap,
              color: "bg-amber-500/10 text-amber-500"
            },
            {
              title: "Seguridad Robusta",
              desc: "Encriptación de grado militar y control de acceso basado en roles.",
              icon: Lock,
              color: "bg-primary/10 text-primary"
            },
            {
              title: "Escalabilidad",
              desc: "Desde pequeñas oficinas hasta campus universitarios completos.",
              icon: Users,
              color: "bg-indigo-500/10 text-indigo-500"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-premium-subtle hover:shadow-premium transition-all duration-500 group">
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} className="stroke-[2.5px]" />
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-neutral-500 font-medium leading-relaxed leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-primary-500 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full -mr-[20rem] -mt-[20rem] blur-[100px]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
            {[
              { val: "99.9%", label: "Uptime" },
              { val: "< 5min", label: "Respuesta" },
              { val: "10k+", label: "Resueltos" },
              { val: "4.9/5", label: "Satisfacción" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📜 Footer */}
      <footer className="py-20 px-6 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield size={22} className="text-primary" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-neutral-900 font-black text-lg leading-none tracking-tight">Soporte IT</span>
              <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">© 2026 Todos los derechos reservados</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {["Términos", "Privacidad", "Seguridad", "Soporte"].map(item => (
              <a key={item} href="#" className="text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
