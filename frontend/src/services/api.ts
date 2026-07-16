import type {
  AllowedTransitionsResponse,
  CreateCommentInput,
  CreateTicketInput,
  ErrorResponse,
  HealthResponse,
  TicketResponse,
  TicketStatus,
  UpdateTicketInput,
  UserSummary,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  readonly status: number;
  readonly details?: ErrorResponse['details'];

  constructor(status: number, message: string, details?: ErrorResponse['details']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  let body: ErrorResponse | T;
  try {
    body = (await response.json()) as ErrorResponse | T;
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, 'Network request failed');
    }
    throw new ApiError(response.status, 'Invalid response from server');
  }

  if (!response.ok) {
    const errorBody = body as ErrorResponse;
    throw new ApiError(
      response.status,
      errorBody.error || 'Request failed',
      errorBody.details
    );
  }

  return body as T;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health');
}

export async function listTickets(params?: {
  status?: TicketStatus;
  q?: string;
}): Promise<TicketResponse[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.q) search.set('q', params.q);
  const query = search.toString();
  return request<TicketResponse[]>(`/tickets${query ? `?${query}` : ''}`);
}

export async function getTicket(id: string): Promise<TicketResponse> {
  return request<TicketResponse>(`/tickets/${id}`);
}

export async function createTicket(input: CreateTicketInput): Promise<TicketResponse> {
  return request<TicketResponse>('/tickets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateTicket(
  id: string,
  input: UpdateTicketInput
): Promise<TicketResponse> {
  return request<TicketResponse>(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<TicketResponse> {
  return request<TicketResponse>(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getAllowedTransitions(
  id: string
): Promise<AllowedTransitionsResponse> {
  return request<AllowedTransitionsResponse>(`/tickets/${id}/allowed-transitions`);
}

export async function createComment(
  ticketId: string,
  input: CreateCommentInput
): Promise<unknown> {
  return request(`/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listUsers(): Promise<UserSummary[]> {
  return request<UserSummary[]>('/users');
}
