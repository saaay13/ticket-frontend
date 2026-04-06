import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, Tooltip, TooltipTrigger, TooltipContent } from "@/components/molecules";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const userInitials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "??";

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
      <button
        className="lg:hidden text-gray-500 hover:text-gray-700"
        onClick={onOpenSidebar}
      >
        <Menu size={22} />
      </button>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications (Solo Admin y Agent) */}
        {(user?.role === 'Admin' || user?.role === 'Agent') && (
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Bell size={18} style={{ color: "#8A8A88" }} />
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#07590A" }}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Ver Notificaciones</TooltipContent>
            </Tooltip>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium">Notificaciones</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#07590A" }}>3 nuevas</span>
                </div>
                {[
                  { text: "TKT-001 ha sido actualizado", time: "Hace 5 min", dot: "#07590A" },
                  { text: "TKT-005 asignado a ti", time: "Hace 1 hora", dot: "#EF4444" },
                  { text: "TKT-009 vencimiento de SLA", time: "Hace 2 horas", dot: "#F59E0B" },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: n.dot }} />
                      <div>
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#8A8A88" }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-1 py-1 rounded-xl hover:bg-gray-100 transition duration-300"
          >
            <Avatar className="size-8 bg-primary shadow-sm ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block" style={{ color: "#374151" }}>{user?.first_name}</span>
            <ChevronDown size={14} style={{ color: "#8A8A88" }} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1">
              {["Cerrar Sesión"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  style={{ color: item === "Cerrar Sesión" ? "#EF4444" : "#374151" }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (item === "Cerrar Sesión") {
                      logout();
                      navigate("/login", { replace: true });
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
