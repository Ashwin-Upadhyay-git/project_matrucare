import { connectMongo } from '../src/config/db.js';

describe('MongoDB configuration', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMongoUri = process.env.MONGO_URI;

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalMongoUri === undefined) {
      delete process.env.MONGO_URI;
    } else {
      process.env.MONGO_URI = originalMongoUri;
    }
  });

  it('requires a persistent MongoDB URI in production', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.MONGO_URI;

    await expect(connectMongo()).rejects.toThrow(
      'MONGO_URI must be set in production.'
    );
  });
});
