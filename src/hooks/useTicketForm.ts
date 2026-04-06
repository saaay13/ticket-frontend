import { useState, useEffect, useCallback } from "react";
import { categoryService, Category } from "@/services/CategoryService";
import { departmentService, Department } from "@/services/DepartmentService";
import { userService, User as StaffUser } from "@/services/UserService";
import { ticketService, CreateTicketData } from "@/services/TicketService";
import { useAuth } from "@/context/AuthContext";

// Estructura del formulario
export interface TicketFormState {
  title: string;
  description: string;
  category_id: string;
  priority: string;
  assignee_id: string;
  department_id: string;
  requesterName: string;
  requesterEmail: string;
  dueDate: string;
}

const INITIAL_STATE: TicketFormState = {
  title: "",
  description: "",
  category_id: "",
  priority: "Medium",
  assignee_id: "",
  department_id: "",
  requesterName: "",
  requesterEmail: "",
  dueDate: "",
};

export function useTicketForm() {
  const [form, setForm] = useState<TicketFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<TicketFormState>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<StaffUser[]>([]);
  
  const { user: authUser } = useAuth();

  // Auto-completar datos del solicitante si el usuario tiene sesion iniciada
  useEffect(() => {
    if (authUser) {
      setForm(prev => ({
        ...prev,
        requesterName: prev.requesterName || `${authUser.first_name} ${authUser.last_name}`,
        requesterEmail: prev.requesterEmail || authUser.email,
        department_id: prev.department_id || authUser.department_id?.toString() || "",
      }));
    }
  }, [authUser]);

  // Cargar datos estaticos
  const loadBaseData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, deps, usersData] = await Promise.all([
        categoryService.getAll(),
        departmentService.getAll(),
        userService.getAll()
      ]);
      setCategories(cats);
      setDepartments(deps);
      
      // Filtrar la lista de tecnicos (Admins y Agentes del Depto de Soporte #1)
      const technicians = usersData.filter(u => 
        (u.role === 'Agent' || u.role === 'Admin') && 
        u.department_id === 1
      );
      
      setUsers(technicians);
    } catch (err) {
      console.error('Error loading form data:', err);
      setError('Error al cargar datos base del formulario.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBaseData(); }, [loadBaseData]);

  // Actualizar campo y limpiar error
  const updateField = useCallback((key: keyof TicketFormState, value: any) => {
    setForm(prev => ({...prev, [key]: value}));
    setErrors(prev => ({...prev, [key]: undefined}));
  }, []);

  // Validacion basica
  const validate = () => {
    const e: Partial<TicketFormState> = {};
    if (!form.title.trim()) e.title = "Título obligatorio";
    if (!form.description.trim()) e.description = "Descripción obligatoria";
    if (!form.category_id) e.category_id = "Categoría obligatoria";
    if (!form.requesterName.trim()) e.requesterName = "Nombre obligatorio";
    if (!form.requesterEmail.trim()) e.requesterEmail = "Correo obligatorio";
    if (!form.department_id) e.department_id = "Departamento obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Logica de envio
  const submit = async () => {
    if (!validate()) return null;
    try {
      setSubmitting(true);
      setError(null);

      // 1. Get or create requester
      let requester = await userService.findByEmail(form.requesterEmail);
      if (!requester) {
        const parts = form.requesterName.trim().split(' ');
        requester = await userService.create({
          first_name: parts[0] || '',
          last_name: parts.slice(1).join(' ') || '',
          email: form.requesterEmail,
          department_id: parseInt(form.department_id),
          role: 'requester',
          active: true
        });
      }

      // 2. Create ticket
      const ticketData: CreateTicketData = {
        title: form.title,
        requester_id: requester.id,
        details: {
          description: form.description,
          priority: form.priority,
          department: departments.find(d => d.id === parseInt(form.department_id))?.name,
        },
        category_id: parseInt(form.category_id),
        assigned_to_id: form.assignee_id ? parseInt(form.assignee_id) : undefined,
      };

      return await ticketService.create(ticketData);
    } catch (err) {
      setError('No se pudo crear el reporte de soporte.');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setForm(INITIAL_STATE);
    setErrors({});
  }, []);

  return { 
    form, 
    errors, 
    categories, 
    departments, 
    users, 
    loading, 
    submitting, 
    error, 
    updateField, 
    submit, 
    reset 
  };
}
