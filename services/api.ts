import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://api.smartestate.me/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `Request failed: ${response.status}`);
  }

  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: { id: string; name: string; email: string; role: string };
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: 'technician' }),
  });
}

export async function getMe() {
  return request<{ success: boolean; data: { userId: string; email: string; role: string } }>('/auth/me');
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  ticketId: string;
  issueCategory: string;
  aiConfidence?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  building: string;
  unit: string;
  tenant: string;
  assignedTechnician?: string;
  technicianId?: string;
  slaDeadline?: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'escalated';
  description: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  actualCost?: number;
  notes?: string;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  meta: { page: number; limit: number; total: number; hasMore: boolean };
}

export async function getJobs(params?: {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<JobsResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.priority) query.append('priority', params.priority);
  if (params?.search) query.append('search', params.search);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  const qs = query.toString();
  return request<JobsResponse>(`/jobs${qs ? `?${qs}` : ''}`);
}

export async function getJobById(id: string): Promise<{ success: boolean; data: Job }> {
  return request<{ success: boolean; data: Job }>(`/jobs/${id}`);
}

export async function updateJobStatus(
  id: string,
  status: string,
  notes?: string
): Promise<{ success: boolean; data: Job }> {
  return request<{ success: boolean; data: Job }>(`/jobs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes }),
  });
}

export async function completeJob(
  id: string,
  payload: { actualDuration?: number; actualCost?: number; notes?: string; images?: string[] }
): Promise<{ success: boolean; data: Job }> {
  return request<{ success: boolean; data: Job }>(`/jobs/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ─── Technician ───────────────────────────────────────────────────────────────

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  availability: 'available' | 'busy' | 'offline';
  skills: string[];
  assignedBuildings: string[];
  rating: number;
  totalJobsCompleted: number;
  averageResponseTime?: number;
  isVerified?: boolean;
  avatarUrl?: string;
  technicianId?: string;
}

export async function getMyProfile(): Promise<{ success: boolean; data: Technician }> {
  return request<{ success: boolean; data: Technician }>('/technicians/me');
}

export async function updateAvailability(
  id: string,
  availability: string
): Promise<{ success: boolean; data: Technician }> {
  return request<{ success: boolean; data: Technician }>(`/technicians/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ availability }),
  });
}

export async function getTechnicianStats(id: string) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/technicians/${id}/stats`);
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface ApiConversation {
  id: string;
  participants: Array<{ id: string; name: string; role: string }>;
  lastMessage: { content: string; timestamp: string; senderId: string };
  unreadCount: number;
  ticketId?: string;
  jobTitle?: string;
}

export interface ApiMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  type: string;
  timestamp: string;
  status: string;
}

export async function getConversations(): Promise<{
  success: boolean;
  data: { conversations: ApiConversation[] };
}> {
  return request('/messages/conversations');
}

export async function getMessagesByTicket(ticketId: string): Promise<{
  success: boolean;
  data: ApiMessage[];
}> {
  return request(`/messages/ticket/${ticketId}`);
}

export async function getMessages(conversationId: string): Promise<{
  success: boolean;
  data: ApiMessage[];
}> {
  return request(`/messages?conversationId=${conversationId}`);
}

export async function sendMessage(payload: {
  conversationId?: string;
  receiverId?: string;
  ticketId?: string;
  message: string;
  type?: string;
}): Promise<{ success: boolean; data: ApiMessage }> {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ ...payload, type: payload.type || 'text' }),
  });
}
