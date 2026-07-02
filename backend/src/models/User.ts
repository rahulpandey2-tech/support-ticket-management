import mongoose, { Document, Schema } from 'mongoose';

export const USER_ROLES = ['admin', 'agent', 'user'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: USER_ROLES,
        message: 'Role must be admin, agent, or user',
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
