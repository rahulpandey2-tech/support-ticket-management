import { TICKET_PRIORITIES, type Priority } from '../types';

export type FieldErrors = Record<string, string>;

const TITLE_MAX = 200;

function trim(value: string): string {
  return value.trim();
}

export function validateTitle(title: string): string | undefined {
  const value = trim(title);
  if (!value) return 'Title is required';
  if (value.length > TITLE_MAX) return `Title cannot exceed ${TITLE_MAX} characters`;
  return undefined;
}

export function validateDescription(description: string): string | undefined {
  if (!trim(description)) return 'Description is required';
  return undefined;
}

export function validateRequiredId(id: string, label: string): string | undefined {
  if (!id?.trim()) return `${label} is required`;
  return undefined;
}

export function validateCommentMessage(message: string): string | undefined {
  if (!trim(message)) return 'Message is required';
  return undefined;
}

export interface CreateTicketForm {
  title: string;
  description: string;
  priority: Priority;
  createdById: string;
  assignedToId: string;
}

export function validateCreateTicketForm(data: CreateTicketForm): FieldErrors {
  const errors: FieldErrors = {};
  const titleError = validateTitle(data.title);
  const descError = validateDescription(data.description);
  const creatorError = validateRequiredId(data.createdById, 'Created by');

  if (titleError) errors.title = titleError;
  if (descError) errors.description = descError;
  if (creatorError) errors.createdById = creatorError;
  if (!TICKET_PRIORITIES.includes(data.priority)) {
    errors.priority = 'Priority is required';
  }

  return errors;
}

export interface UpdateTicketForm {
  title: string;
  description: string;
  priority: Priority;
}

export function validateUpdateTicketForm(data: UpdateTicketForm): FieldErrors {
  const errors: FieldErrors = {};
  const titleError = validateTitle(data.title);
  const descError = validateDescription(data.description);

  if (titleError) errors.title = titleError;
  if (descError) errors.description = descError;
  if (!TICKET_PRIORITIES.includes(data.priority)) {
    errors.priority = 'Priority is required';
  }

  return errors;
}

export interface CommentForm {
  message: string;
  createdById: string;
}

export function validateCommentForm(data: CommentForm): FieldErrors {
  const errors: FieldErrors = {};
  const messageError = validateCommentMessage(data.message);
  const authorError = validateRequiredId(data.createdById, 'Author');

  if (messageError) errors.message = messageError;
  if (authorError) errors.createdById = authorError;

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function mergeApiFieldErrors(
  details?: { field: string; message: string }[]
): FieldErrors {
  if (!details) return {};
  return Object.fromEntries(details.map((d) => [d.field, d.message]));
}
