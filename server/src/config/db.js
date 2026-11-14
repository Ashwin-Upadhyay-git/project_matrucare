import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (process.env.NODE_ENV === 'production' && !mongoUri) {
    throw new Error('MONGO_URI must be set in production.');
  }

  if (process.env.NODE_ENV === 'test' || !mongoUri) {
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri('matrucare-test');
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB for development/test.');
    return;
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Atlas.');
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
