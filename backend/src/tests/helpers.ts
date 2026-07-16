import { User, Ticket } from '../models';
import type { TicketStatus } from '../types';
import type { IUser } from '../models/User';
import type { ITicket } from '../models/Ticket';

export async function createTestUser(
  overrides: Partial<{ name: string; email: string; role: IUser['role'] }> = {}
): Promise<IUser> {
  return User.create({
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  });
}

export async function createTestTicket(
  createdById: string,
  overrides: Partial<{
    title: string;
    description: string;
    status: TicketStatus;
    priority: ITicket['priority'];
    assignedToId: string | null;
  }> = {}
): Promise<ITicket> {
  return Ticket.create({
    title: 'Test ticket',
    description: 'Test description for support issue',
    priority: 'medium',
    status: 'open',
    createdBy: createdById,
    assignedTo: overrides.assignedToId ?? null,
    ...overrides,
  });
}

export async function seedUsersAndTickets() {
  const user = await createTestUser();
  const agent = await createTestUser({
    name: 'Test Agent',
    email: 'agent@example.com',
    role: 'agent',
  });

  await createTestTicket(user._id.toString(), {
    title: 'Password reset broken',
    description: 'Users cannot reset password via email',
    status: 'open',
  });
  await createTestTicket(user._id.toString(), {
    title: 'Dashboard slow',
    description: 'Dashboard loading issue on login',
    status: 'in_progress',
    assignedToId: agent._id.toString(),
  });
  await createTestTicket(user._id.toString(), {
    title: 'Export CSV issue',
    description: 'CSV export returns empty file',
    status: 'closed',
  });

  return { user, agent };
}
