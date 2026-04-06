import { ticketService, Ticket as ApiTicket, Comment as ApiComment } from '@/services/TicketService';

export type TicketStatus = "Open" | "In Progress" | "Pending" | "Resolved" | "Closed" | "Deleted";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketCategory =
  | "Hardware"
  | "Software"
  | "Network"
  | "Security"
  | "Access Request"
  | "Email"
  | "Other";

export interface Comment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  requester: string;
  requester_id?: string | number;
  requesterAvatar: string;
  assignee: string;
  assigned_to_id?: string | number;
  assigneeAvatar: string;
  department: string;
  department_id?: string | number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  comments: Comment[];
  tags: string[];
}

// Transforma el ticket de la API al formato del frontend
function transformApiTicket(apiTicket: any): Ticket {
  if (!apiTicket) throw new Error("API Ticket data is missing");

  // Maneja el envoltorio Resource de Laravel si esta presente
  const data = apiTicket.data ? apiTicket.data : apiTicket;

  // Extraccion robusta de datos
  const details = data.details || {};
  const requester = data.requester || {};
  const assignee = data.assigned_to || {};
  const category = data.category || {};

  return {
    id: String(data.id),
    ticketNumber: data.ticket_number || `#${data.id}`,
    title: data.title || 'Sin Título',
    description: details.description || '',
    status: mapApiStatus(data.status || 'open'),
    priority: mapApiPriority(details.priority || 'medium'),
    category: mapApiCategory(category.name || 'Other'),
    requester: requester.first_name ? `${requester.first_name} ${requester.last_name || ''}` : 'Usuario Desconocido',
    requester_id: data.requester_id,
    requesterAvatar: (requester.first_name ? requester.first_name[0] : 'U') + (requester.last_name ? requester.last_name[0] : ''),
    assignee: assignee.first_name ? `${assignee.first_name} ${assignee.last_name || ''}` : 'Sin Asignar',
    assigned_to_id: data.assigned_to_id,
    assigneeAvatar: (assignee.first_name ? assignee.first_name[0] : 'U') + (assignee.last_name ? assignee.last_name[0] : ''),
    department: details.department || 'General',
    department_id: data.category_id,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    dueDate: undefined,
    comments: data.comments ? data.comments.map(transformApiComment) : [],
    tags: Array.isArray(details.tags) ? details.tags : [],
  };
}

function transformApiComment(apiComment: ApiComment): Comment {
  return {
    id: apiComment.id.toString(),
    author: apiComment.user ? `${apiComment.user.first_name} ${apiComment.user.last_name}` : 'Unknown',
    role: 'User', // TODO: Add role to API
    avatar: apiComment.user ? `${apiComment.user.first_name[0]}${apiComment.user.last_name[0]}` : 'UK',
    text: apiComment.content,
    timestamp: apiComment.created_at,
  };
}

function mapApiStatus(status: string): TicketStatus {
  const statusMap: Record<string, TicketStatus> = {
    'open': 'Open',
    'in_progress': 'In Progress',
    'pending': 'Pending',
    'resolved': 'Resolved',
    'closed': 'Closed',
    'deleted': 'Deleted',
  };
  return statusMap[status] || 'Open';
}

function mapApiPriority(priority: string): TicketPriority {
  const priorityMap: Record<string, TicketPriority> = {
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
  };
  return priorityMap[priority] || 'Medium';
}

function mapApiCategory(category: string): TicketCategory {
  const categoryMap: Record<string, TicketCategory> = {
    'Hardware': 'Hardware',
    'Software': 'Software',
    'Network': 'Network',
    'Security': 'Security',
    'Access Request': 'Access Request',
    'Email': 'Email',
    'Other': 'Other',
  };
  return categoryMap[category] || 'Other';
}

// API functions
export async function getTickets(params?: Record<string, any>): Promise<Ticket[]> {
  const apiTickets = await ticketService.getAll(params);
  return apiTickets.map(transformApiTicket);
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const apiTicket = await ticketService.getById(id);
  return transformApiTicket(apiTicket);
}

export async function getComments(ticketId: string): Promise<Comment[]> {
  const apiComments = await ticketService.getComments(ticketId);
  return apiComments.map(c => ({
    id: c.id.toString(),
    author: c.user ? `${c.user.first_name} ${c.user.last_name}` : 'Unknown User',
    role: 'Staff', // Default or fetch from user
    text: c.content,
    timestamp: c.created_at,
    avatar: c.user ? `${c.user.first_name[0]}${c.user.last_name[0]}` : 'U',
  }));
}

export async function createTicket(data: {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  department?: string;
  requester_id: number;
}): Promise<Ticket> {
  try {
    const apiData = {
      title: data.title,
      details: {
        description: data.description,
        priority: data.priority.toLowerCase(),
        department: data.department,
        tags: [],
        custom_fields: {},
      },
      category_id: 1, // TODO: Map category name to ID
      requester_id: data.requester_id,
    };

    const apiTicket = await ticketService.create(apiData);
    return transformApiTicket(apiTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
  try {
    const apiData: any = {};

    if (data.title) apiData.title = data.title;
    if (data.status) apiData.status = data.status.toLowerCase().replace(' ', '_');
    if ('assigned_to_id' in data) apiData.assigned_to_id = data.assigned_to_id;

    // Manage dynamic details map
    if (data.description !== undefined || data.priority !== undefined || data.department !== undefined || data.tags !== undefined) {
      apiData.details = {};
      if (data.description !== undefined) apiData.details.description = data.description;
      if (data.priority !== undefined) apiData.details.priority = data.priority.toLowerCase();
      if (data.department !== undefined) apiData.details.department = data.department;
      if (data.tags !== undefined) apiData.details.tags = data.tags;
    }

    const apiTicket = await ticketService.update(id, apiData);
    return transformApiTicket(apiTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case "Open": return { bg: "var(--status-open)", text: "#ffffff", dot: "#ffffff" };
    case "In Progress": return { bg: "var(--status-progress)", text: "#ffffff", dot: "#ffffff" };
    case "Pending": return { bg: "var(--secondary-200)", text: "var(--secondary-700)", dot: "var(--secondary-700)" };
    case "Resolved": return { bg: "var(--status-resolved)", text: "#ffffff", dot: "#ffffff" };
    case "Closed": return { bg: "var(--status-closed)", text: "#ffffff", dot: "#ffffff" };
    case "Deleted" as any: return { bg: "var(--neutral-900)", text: "#ffffff", dot: "#ffffff" };
    default: return { bg: "var(--neutral-100)", text: "var(--neutral-600)", dot: "var(--neutral-400)" };
  }
};

export const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case "Critical": return { bg: "var(--priority-urgent)", text: "#ffffff", dot: "#ffffff" };
    case "High": return { bg: "var(--priority-high)", text: "#ffffff", dot: "#ffffff" };
    case "Medium": return { bg: "var(--priority-medium)", text: "#ffffff", dot: "#ffffff" };
    case "Low": return { bg: "var(--primary-600)", text: "#ffffff", dot: "#ffffff" };
    default: return { bg: "var(--neutral-100)", text: "var(--neutral-600)", dot: "var(--neutral-400)" };
  }
};
