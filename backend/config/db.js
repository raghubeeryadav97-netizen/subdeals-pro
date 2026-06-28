import mongoose from 'mongoose';

let memoryServer = null;

const tryConnect = async (uri, timeout = 4000) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: timeout });
    return true;
  } catch {
    return false;
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subdeals-pro';
  const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
  const isFirebase = process.env.FIREBASE_FUNCTION === 'true' || process.env.NODE_ENV === 'production';

  if (isAtlas || (isFirebase && uri !== 'mongodb://localhost:27017/subdeals-pro')) {
    await mongoose.connect(uri);
    console.log('MongoDB Connected (cloud)');
    const User = (await import('../models/User.js')).default;
    if (!(await User.findOne({ email: 'admin@subdealspro.com' }))) {
      console.log('Seeding cloud database...');
      const { seedDatabase } = await import('../scripts/seed.js');
      await seedDatabase({ disconnect: false });
    }
    return mongoose.connection;
  }

  const localUri = uri;
  if (await tryConnect(localUri)) {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MongoDB connection refused. Set MONGODB_URI in .env');
  }

  await mongoose.disconnect().catch(() => {});
  console.log('Local MongoDB not found — starting in-memory database...');

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri('subdeals-pro');
  process.env.MONGODB_URI = memUri;
  await mongoose.connect(memUri);
  console.log('[DEV] In-memory MongoDB ready (data resets when server stops)');

  const User = (await import('../models/User.js')).default;
  const admin = await User.findOne({ email: 'admin@subdealspro.com' });
  if (!admin) {
    console.log('Seeding database...');
    const { seedDatabase } = await import('../scripts/seed.js');
    await seedDatabase({ disconnect: false });
    console.log('Seed done — Admin: admin@subdealspro.com / Admin@123');
  }

  return mongoose.connection;
};

export default connectDB;