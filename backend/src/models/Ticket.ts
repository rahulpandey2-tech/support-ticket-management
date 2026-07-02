import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Priority,
  type TicketStatus,
} from '../types';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITicket extends Document {
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: TICKET_PRIORITIES,
        message: 'Priority must be low, medium, or high',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: TICKET_STATUSES,
        message:
          'Status must be open, in_progress, resolved, closed, or cancelled',
      },
      default: 'open',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  { timestamps: true }
);

ticketSchema.index({ status: 1 });
ticketSchema.index({ updatedAt: -1 });
ticketSchema.index({ title: 'text', description: 'text' });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
