import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let memoryServer = null;

const tryConnect = async (uri) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    return true;
  } catch {
    return false;
  }
};

const start = async () => {
  console.log('\n========================================');
  console.log('  SubDeals Pro - Starting Backend');
  console.log('========================================\n');

  const localUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subdeals-pro';

  if (await tryConnect(localUri)) {
    console.log('[OK] Connected to MongoDB');
  } else {
    await mongoose.disconnect().catch(() => {});
    console.log('[..] Local MongoDB not found, starting in-memory DB...');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri('subdeals-pro');
    process.env.MONGODB_URI = memUri;
    await mongoose.connect(memUri);
    console.log('[OK] In-memory MongoDB ready');
  }

  const User = (await import('./models/User.js')).default;
  const admin = await User.findOne({ email: 'admin@subdealspro.com' });
  if (!admin) {
    console.log('[..] Seeding database...');
    const { seedDatabase } = await import('./scripts/seed.js');
    await seedDatabase({ disconnect: false });
    console.log('[OK] Seed complete — Admin: admin@subdealspro.com / Admin@123');
  } else {
    console.log('[OK] Database already seeded');
  }

  console.log('\n[..] Starting API on http://localhost:5000\n');
  await import('./server.js');
};

start().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});

process.on('SIGINT', async () => {
  if (memoryServer) await memoryServer.stop();
  process.exit(0);
});