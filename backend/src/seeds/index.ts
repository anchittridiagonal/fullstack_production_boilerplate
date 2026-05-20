import 'dotenv/config';

import mongoose from 'mongoose';

import { config } from '../config';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

const seed = async (): Promise<void> => {
  await mongoose.connect(config.mongo.uri);
  logger.info('Connected to MongoDB for seeding...');

  await User.deleteMany({});
  logger.info('Cleared existing users');

  const users = await User.create([
    {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin@1234',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    },
    {
      name: 'John User',
      email: 'user@example.com',
      password: 'User@1234',
      role: 'user',
      isActive: true,
      isEmailVerified: true,
    },
  ]);

  logger.info(`Seeded ${users.length} users:`);
  users.forEach((u) => logger.info(`  - ${u.email} (${u.role})`));

  await mongoose.disconnect();
  logger.info('Seeding complete');
};

seed().catch((err) => {
  logger.error('Seeding failed', { error: err });
  process.exit(1);
});
