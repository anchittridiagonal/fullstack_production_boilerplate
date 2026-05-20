import mongoose from 'mongoose';

import { createApp } from '../src/app';
import { User } from '../src/models/user.model';

export const setupTestDB = (): void => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/fullstack_test';
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
};

export const app = createApp();

export const createTestUser = async (overrides = {}) => {
  return User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@1234',
    role: 'user',
    isActive: true,
    ...overrides,
  });
};

export const createTestAdmin = async (overrides = {}) => {
  return User.create({
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'Admin@1234',
    role: 'admin',
    isActive: true,
    ...overrides,
  });
};
