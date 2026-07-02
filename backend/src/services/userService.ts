import { User } from '../models';
import { badRequest, notFound } from '../errors/AppError';
import type { UserSummary } from '../types';

export async function listUsers(): Promise<UserSummary[]> {
  const users = await User.find().sort({ name: 1 });

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }));
}

export async function ensureUserExists(userId: string): Promise<void> {
  const exists = await User.exists({ _id: userId });
  if (!exists) {
    throw badRequest(`User not found: ${userId}`);
  }
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw badRequest(`User not found: ${userId}`);
  }
  return user;
}
