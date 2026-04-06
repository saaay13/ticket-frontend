import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { TicketList } from "@/pages/TicketList";
import { TicketDetail } from "@/pages/TicketDetail";
import { CreateTicket } from "@/pages/CreateTicket";
import { TeamPage } from "@/pages/TeamPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { MyTickets } from "@/pages/MyTickets";
import { TicketTrash } from "@/pages/TicketTrash";
import { ProtectedRoute } from "@/components/atoms";
import { Login } from "@/pages/Login";
import { LandingPage } from "@/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Login />,
  },
  {
    // 🌍 Nivel 1: Requiere Login
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          // 🏠 Dashboard: Abierto para todos los autenticados (Muestra banner si es null)
          { index: true, element: <Dashboard /> },
          
          // ⚙️ Settings: Abierto para todos
          { path: "settings", element: <SettingsPage /> },

          // 🛡️ Nivel 2: Requiere DEPARTAMENTO ASIGNADO
          {
            element: <ProtectedRoute requireDept={true} />,
            children: [
              { path: "tickets", element: <TicketList /> },
              { path: "tickets/new", element: <CreateTicket /> },
              { path: "tickets/:id", element: <TicketDetail /> },
              { path: "my-tickets", element: <MyTickets /> },
              
              // 🔱 Nivel 3.1: Requiere ROL ADMIN/AGENT
              {
                element: <ProtectedRoute allowedRoles={["Admin", "Agent"]} />,
                children: [
                  { path: "team", element: <TeamPage type="it" /> },
                ]
              },
              
              // 🔱 Nivel 3.2: Requiere EXCLUSIVAMENTE ROL ADMIN
              {
                element: <ProtectedRoute allowedRoles={["Admin"]} />,
                children: [
                  { path: "staff", element: <TeamPage type="staff" /> },
                  { path: "tickets/trash", element: <TicketTrash /> },
                ]
              }
            ]
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
