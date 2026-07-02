import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase, syncIndexes } from '../config/database';
import { User, Ticket, Comment } from '../models';
import type { TicketStatus } from '../types';

dotenv.config();

const seedUsers = [
  { name: 'John User', email: 'john@example.com', role: 'user' as const },
  { name: 'Jane Agent', email: 'jane@example.com', role: 'agent' as const },
  { name: 'Admin User', email: 'admin@example.com', role: 'admin' as const },
  { name: 'Mike Agent', email: 'mike@example.com', role: 'agent' as const },
  { name: 'Sarah User', email: 'sarah@example.com', role: 'user' as const },
];

interface SeedTicket {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: TicketStatus;
  assignedToIndex: number | null;
  createdByIndex: number;
}

const seedTickets: SeedTicket[] = [
  {
    title: 'Cannot reset password',
    description: 'Users report password reset email never arrives.',
    priority: 'high',
    status: 'open',
    assignedToIndex: 1,
    createdByIndex: 0,
  },
  {
    title: 'Dashboard loading slowly',
    description: 'Main dashboard takes over 10 seconds to load for some users.',
    priority: 'medium',
    status: 'in_progress',
    assignedToIndex: 1,
    createdByIndex: 4,
  },
  {
    title: 'Export CSV broken',
    description: 'Export button returns an empty file for ticket reports.',
    priority: 'high',
    status: 'in_progress',
    assignedToIndex: 3,
    createdByIndex: 0,
  },
  {
    title: 'Typo on login page',
    description: 'Button label says "Sing in" instead of "Sign in".',
    priority: 'low',
    status: 'resolved',
    assignedToIndex: 3,
    createdByIndex: 4,
  },
  {
    title: 'Mobile menu overlap',
    description: 'Navigation menu overlaps content on small screens.',
    priority: 'medium',
    status: 'resolved',
    assignedToIndex: 1,
    createdByIndex: 0,
  },
  {
    title: 'Duplicate notifications',
    description: 'Users receive the same email notification twice.',
    priority: 'medium',
    status: 'closed',
    assignedToIndex: 1,
    createdByIndex: 4,
  },
  {
    title: 'Feature request: dark mode',
    description: 'Several users requested a dark theme for the portal.',
    priority: 'low',
    status: 'open',
    assignedToIndex: null,
    createdByIndex: 0,
  },
  {
    title: 'API timeout on search',
    description: 'Search endpoint times out when querying large datasets.',
    priority: 'high',
    status: 'cancelled',
    assignedToIndex: 3,
    createdByIndex: 2,
  },
  {
    title: 'Incorrect timezone on comments',
    description: 'Comment timestamps display in UTC instead of local time.',
    priority: 'medium',
    status: 'open',
    assignedToIndex: 1,
    createdByIndex: 4,
  },
  {
    title: 'Assignee dropdown empty',
    description: 'Create ticket form shows no users in assignee dropdown.',
    priority: 'high',
    status: 'in_progress',
    assignedToIndex: 3,
    createdByIndex: 2,
  },
];

interface SeedComment {
  ticketIndex: number;
  message: string;
  createdByIndex: number;
}

const seedComments: SeedComment[] = [
  {
    ticketIndex: 0,
    message: 'Checked mail server logs — emails are queued but not sent.',
    createdByIndex: 1,
  },
  {
    ticketIndex: 0,
    message: 'Escalated to infrastructure team.',
    createdByIndex: 2,
  },
  {
    ticketIndex: 1,
    message: 'Profiling shows slow database query on dashboard stats.',
    createdByIndex: 1,
  },
  {
    ticketIndex: 2,
    message: 'Reproduced in staging. Working on a fix.',
    createdByIndex: 3,
  },
  {
    ticketIndex: 3,
    message: 'Fix deployed to staging — please verify copy update.',
    createdByIndex: 3,
  },
  {
    ticketIndex: 5,
    message: 'Root cause fixed and verified in production.',
    createdByIndex: 1,
  },
  {
    ticketIndex: 7,
    message: 'Cancelled — duplicate of an existing infrastructure ticket.',
    createdByIndex: 2,
  },
  {
    ticketIndex: 9,
    message: 'Investigating users API response in the frontend.',
    createdByIndex: 3,
  },
];

async function seed(): Promise<void> {
  console.log('Seeding database...\n');

  await connectDatabase();
  await syncIndexes();

  await Promise.all([
    Comment.deleteMany({}),
    Ticket.deleteMany({}),
    User.deleteMany({}),
  ]);

  const users = await User.insertMany(seedUsers);
  console.log(`  Users:   ${users.length}`);

  const tickets = await Ticket.insertMany(
    seedTickets.map((ticket) => ({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo:
        ticket.assignedToIndex !== null
          ? users[ticket.assignedToIndex]._id
          : null,
      createdBy: users[ticket.createdByIndex]._id,
    }))
  );
  console.log(`  Tickets: ${tickets.length}`);

  const comments = await Comment.insertMany(
    seedComments.map((comment) => ({
      ticketId: tickets[comment.ticketIndex]._id,
      message: comment.message,
      createdBy: users[comment.createdByIndex]._id,
    }))
  );
  console.log(`  Comments: ${comments.length}`);

  await disconnectDatabase();
  console.log('\nSeed complete.');
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
