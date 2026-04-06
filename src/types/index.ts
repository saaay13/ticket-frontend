export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Staff';
  department_id?: number;
  active: boolean;
  metadata?: Record<string, any>;
  department?: {
    id: number;
    name: string;
  };
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  requester: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  audit_logs?: AuditLog[];
}

export interface AuditLog {
  id: number;
  ticket_id: string;
  action: string;
  performed_by: string;
  details: string;
  created_at: string;
}
