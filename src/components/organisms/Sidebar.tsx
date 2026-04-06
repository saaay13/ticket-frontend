import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings, 
  Plus, 
  User as UserIcon, 
  Shield, 
  X, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/Utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Tickets Globales", icon: Ticket, href: "/dashboard/tickets" },
  { label: "Equipo IT", icon: Shield, href: "/dashboard/team" },
  { label: "Control de Personal", icon: Users, href: "/dashboard/staff" },
  { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const userInitials = user 
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() 
    : "??";
  
  const fullName = user 
    ? `${user.first_name} ${user.last_name}` 
    : "Usuario";

  const isAdmin = user?.role === "Admin";
  const isAgent = user?.role === "Agent";
  const isStaff = user?.role === "Staff";
  const isUnassigned = !user?.department_id;

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (isUnassigned) {
      return item.label === "Dashboard" || item.label === "Configuración";
    }
    if (isStaff) {
      return !["Equipo IT", "Control de Personal"].includes(item.label);
    }
    // Agentes NO pueden ver la plantilla de personal general
    if (isAgent) {
      return item.label !== "Control de Personal";
    }
    return true;
  });

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-64 transition-transform duration-300 lg:translate-x-0 bg-primary shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">IT Support</div>
            <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Ticket System</div>
          </div>
        </div>
        <button className="lg:hidden text-white/70 hover:text-white transition-colors" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto premium-scroll">
        {filteredNavItems.map((item) => {
          const isActiveItem = isActive(item.href);
          const displayLabel = (isStaff && item.label === "Tickets Globales") ? "Tickets de Área" : item.label;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "group relative overflow-hidden flex items-center gap-3 px-4 py-3.5 my-1 rounded-2xl transition-all duration-300 outline-none",
                isActiveItem 
                  ? "bg-white/15 text-white shadow-lg shadow-black/5" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActiveItem && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              )}
              <item.icon size={19} className={isActiveItem ? "text-white" : "text-white/60 group-hover:text-white transition-colors"} />
              <span className="text-sm font-semibold tracking-wide">{displayLabel}</span>
              {item.label === "Nuevo Reporte" && (
                <span className="ml-auto w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Plus size={12} className="text-white" />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-4 pb-8 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3.5 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-primary bg-white shadow-sm flex-shrink-0"
          >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-bold truncate">{fullName}</div>
            <div className="text-white/50 text-[10px] font-medium truncate uppercase tracking-tight">{user?.email}</div>
          </div>
          <button
            className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
