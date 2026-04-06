import React from "react";
import { Link } from "react-router";
import {
  BarChart2, Zap, Activity, User as UserIcon, ShieldCheck, TrendingUp
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Badge, Progress, Button } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules";
import { cn } from "@/lib/Utils";

// Estadísticas
export interface StatItem {
  label: string;
  value: number;
  icon: any;
  variant: any;
  trend: string;
}

export function DashboardStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={stat.label} className={cn(
          "border-none shadow-premium-subtle hover:shadow-premium group transition-all duration-300 animate-in slide-in-from-bottom-2",
          `delay-${i * 100}`
        )}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                stat.variant === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.variant === 'warning' ? 'bg-warning/10 text-warning' :
                    stat.variant === 'info' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
              )}>
                <stat.icon size={22} className="stroke-[2.5px]" />
              </div>
              <Badge variant={stat.variant} className="text-[10px] font-black uppercase px-2 py-0">
                {stat.trend}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-neutral-900 tracking-tight mt-1">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Gráficos
export function DashboardCharts({ weeklyData, categoryData, total }: { weeklyData: any[]; categoryData: any[]; total: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-premium bg-white overflow-hidden animate-in slide-in-from-left-4 duration-700">
        <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart2 size={20} className="text-primary" />
            </div>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">Actividad del Sistema</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "900", fill: "var(--neutral-400)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "900", fill: "var(--neutral-400)" }} />
              <Tooltip cursor={{ fill: 'var(--neutral-50)' }} contentStyle={{ borderRadius: "1.5rem", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", padding: "1rem" }} />
              <Bar dataKey="opened" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="resolved" fill="var(--neutral-200)" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-premium bg-white overflow-hidden animate-in slide-in-from-right-4 duration-700">
        <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Zap size={20} className="text-info" />
            </div>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">Por Categoría</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} className="outline-none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Total</p>
              <p className="text-2xl font-black text-neutral-800">{total}</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.slice(0, 5).map((c) => (
              <div key={c.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: c.color }} />
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest truncate max-w-[120px]">{c.name}</span>
                </div>
                <span className="text-xs font-black text-neutral-900">{c.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tickets recientes
export function RecentTicketsList({ tickets, isStaff, isAdminOrAgent }: { tickets: any[]; isStaff: boolean; isAdminOrAgent: boolean }) {
  return (
    <Card className={cn(isAdminOrAgent ? "lg:col-span-2" : "lg:col-span-3", "border-none shadow-premium bg-white overflow-hidden")}>
      <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity size={20} className="text-primary" />
          </div>
          <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">
            {isStaff ? "Mis Últimas Solicitudes" : "Últimos Movimientos"}
          </CardTitle>
        </div>
      </CardHeader>
      <div className="divide-y divide-neutral-50 max-h-[460px] overflow-y-auto premium-scroll">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            to={`/dashboard/tickets/${ticket.id}`}
            className="flex items-center gap-6 px-8 py-6 hover:bg-neutral-50/80 transition-all group border-l-4 border-l-transparent hover:border-l-primary"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">
                  #{ticket.id}
                </span>
                <span className="text-sm font-black text-neutral-800 truncate group-hover:text-primary transition-colors">{ticket.title}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><UserIcon size={10} /> {ticket.requester}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                <span className="flex items-center gap-1"><Zap size={10} /> {ticket.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge
                variant={ticket.priority === 'Critical' ? 'destructive' : ticket.priority === 'High' ? 'warning' : 'secondary'}
                className="text-[9px] font-black uppercase shadow-none"
              >
                {ticket.priority}
              </Badge>
              <Badge
                variant={ticket.status === 'Resolved' ? 'success' : ticket.status === 'In Progress' ? 'info' : 'secondary'}
                className="text-[9px] font-black uppercase shadow-none"
              >
                {ticket.status}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

// Rendimiento del equipo
export function TeamPerformanceMetrics({ agents }: { agents: any[] }) {
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-premium bg-white overflow-hidden">
        <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500">Métricas de Equipo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {agents.slice(0, 3).map((agent) => (
            <div key={agent.name} className="group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-white bg-primary shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-neutral-800">{agent.name}</p>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mt-1">
                    {agent.resolved}/{agent.total} resueltos
                  </p>
                </div>
                <div className="text-right font-black text-primary text-sm whitespace-nowrap">
                  {Math.round((agent.resolved / agent.total) * 100)}%
                </div>
              </div>
              <Progress value={(agent.resolved / agent.total) * 100} className="h-2 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-premium bg-secondary-50 p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-12 -mt-12" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary" />
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">CUMPLIMIENTO SLA</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black text-primary tracking-tighter">87</span>
            <span className="text-2xl font-black text-primary mb-1.5">%</span>
          </div>
          <Progress value={87} className="h-3 bg-white/10" />
          <p className="text-[11px] font-bold text-neutral-400 italic bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-primary not-italic font-black">Meta: 90%</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
