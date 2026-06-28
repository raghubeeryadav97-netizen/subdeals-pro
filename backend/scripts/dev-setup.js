import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './seed.js';

dotenv.config();

const tryConnect = async (uri) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  const localUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subdeals-pro';
  let memoryServer = null;

  if (!(await tryConnect(localUri))) {
    await mongoose.disconnect().catch(() => {});
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri('subdeals-pro');
    process.env.MONGODB_URI = memUri;
    await mongoose.connect(memUri);
    console.log('Using in-memory MongoDB for setup');
  } else {
    console.log('Connected to MongoDB');
  }

  const User = (await import('../models/User.js')).default;
  if (await User.findOne({ email: 'admin@subdealspro.com' })) {
    console.log('Database already seeded — skipping.');
  } else {
    await seedDatabase({ disconnect: false });
    console.log('Setup complete! Admin: admin@subdealspro.com / Admin@123');
  }

  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
};

main().catch((e) => { console.error(e); process.exit(1); });