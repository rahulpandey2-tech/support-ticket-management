import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  ticketId: Types.ObjectId;
  message: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

commentSchema.index({ ticketId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
