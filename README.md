# 🎨 Sistema de Tickets - Frontend (UI)

Este es el Frontend reactivo y de diseño moderno del **Sistema de Tickets**. Está construido implementando la metodología de diseño atómico para garantizar una capa de interfaz de usuario limpia, mantenible y altamente modular.

## 🚀 Tecnologias Usadas

*   **Motor Principal**: React.js 18
*   **Lenguaje**: TypeScript (Tipado fuerte y seguro)
*   **Empaquetador**: Vite (Arranque instantaneo en desarrollo)
*   **Framework CSS**: TailwindCSS (Estilos utilitarios rápidos y responsivos)
*   **Enrutamiento**: React Router Dom v6
*   **Componentes Visuales**: Shadcn/UI y Radix UI Primitives (Accesibles e integrables)
*   **Iconografia**: Lucide-React
*   **Peticiones HTTP**: Axios (Con interceptores para manejar cabeceras y errores SPA)

## 🏗\ufe0f Arquitectura: Dise\u00f1o At\u00f3mico
Hemos estructurado los componentes web bajo *Atomic Design*:
1.  **`atoms/`**: Piezas base (Botones, Inputs, Etiquetas, Avatars).
2.  **`molecules/`**: Conjuntos (Tarjetas de informaci\u00f3n, Campos de b\u00fasqueda con Ã\u00adconos).
3.  **`organisms/`**: Bloques completos (Sidebar, Cabecera superior, Formularios, Tablas complejas).
4.  **`pages/`**: Vistas ruteables (Dashboard, Lista de Tickets, Panel de Equipo).

## ⚙\ufe0f Gu\u00eda de Instalacion y Arranque

### 1. Descarga del Proyecto (Git Clone)
Abre tu terminal y clona el repositorio de frontend:
```bash
git clone https://github.com/saaay13/ticket-frontend.git
cd ticket-frontend
```

### 2. Requisitos Previos
*   Tener instalado Node.js.
*   Asegurate que el servidor Backend de Laravel este encendido (generalmente en `http://localhost:8000`).

### 3. Configurar el Entorno
1. Duplica `.env.example` (si existe) a `.env`.
   Deberas tener apuntada tu variable local al backend:
   ```ini
   VITE_API_URL=http://localhost:8000/api
   ```
   *Nota: Por politicas de SPA Authentication, la URL del backend no debe llevar barras finales extras.*

### 4. Instalar Dependencias
Al clonar la aplicaci\u00f3n, necesitas instalar todas las dependencias de Node definidas:
```bash
npm install
# Opcionalmente: pnpm install o yarn install
```

### 5. Encender Servidor de Desarrollo
```bash
npm run dev
```

---
