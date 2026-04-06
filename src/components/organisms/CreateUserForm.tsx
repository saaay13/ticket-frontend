import React, { useState } from "react";
import { UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { userService } from "@/services/UserService";
import { Department } from "@/services/DepartmentService";

export interface CreateUserFormProps {
  departments: Department[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateUserForm({ departments, onSuccess, onCancel }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    department_id: '', 
    role: 'Staff' 
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userService.create({
        ...createFormData,
        department_id: createFormData.department_id ? parseInt(createFormData.department_id) : undefined
      });
      setCreateFormData({ first_name: '', last_name: '', email: '', password: '', department_id: '', role: 'Staff' });
      onSuccess();
    } catch (err) {
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-premium bg-gradient-to-r from-primary/5 to-transparent mb-8">
      <CardContent className="p-8">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <UserIcon className="text-primary"/> Nuevo Usuario
        </h2>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input required placeholder="Nombres" className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.first_name} onChange={e => setCreateFormData({...createFormData, first_name: e.target.value})} />
          <input required placeholder="Apellidos" className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.last_name} onChange={e => setCreateFormData({...createFormData, last_name: e.target.value})} />
          <input required type="email" placeholder="Correo Electrónico" className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.email} onChange={e => setCreateFormData({...createFormData, email: e.target.value})} />
          <input required type="password" placeholder="Contraseña Inicial" className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.password} onChange={e => setCreateFormData({...createFormData, password: e.target.value})} />
          <select className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.department_id} onChange={e => setCreateFormData({...createFormData, department_id: e.target.value})}>
            <option value="">Departamento (Opcional)</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="p-2 border rounded-xl bg-white/60 focus:bg-white outline-primary font-medium" value={createFormData.role} onChange={e => setCreateFormData({...createFormData, role: e.target.value})}>
            <option value="Staff">Staff (Regular)</option>
            <option value="Agent">Agent (Soporte)</option>
            <option value="Admin">Admin</option>
          </select>
          
          <div className="lg:col-span-3 flex justify-end gap-3 mt-4">
            <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
