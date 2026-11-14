import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectMongo, disconnectMongo } from '../src/config/db.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectMongo();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnectMongo();
});

describe('Authentication API', () => {
  it('creates a user and sends an OTP', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'user@example.com',
      password: 'StrongPass1'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const user = await User.findOne({ email: 'user@example.com' });
    expect(user).toBeTruthy();
    expect(user.isVerified).toBe(false);
  });

  it('rejects duplicate emails', async () => {
    await User.create({
      fullName: 'Existing User',
      email: 'duplicate@example.com',
      password: 'hashedPass1',
      isVerified: false
    });

    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Another User',
      email: 'duplicate@example.com',
      password: 'StrongPass1'
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('rejects weak passwords', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Weak User',
      email: 'weak@example.com',
      password: 'weak'
    });

    expect(res.status).toBe(400);
  });

  it('verifies OTP and rejects invalid OTP', async () => {
    const createdUser = await User.create({
      fullName: 'OTP User',
      email: 'otp@example.com',
      password: 'hashedPass',
      isVerified: false,
      otpHash: await bcrypt.hash('123456', 10),
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const validRes = await request(app).post('/api/auth/verify-otp').send({
      email: 'otp@example.com',
      otp: '123456'
    });

    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);

    createdUser.otpHash = await bcrypt.hash('654321', 10);
    createdUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await createdUser.save();

    const invalidRes = await request(app).post('/api/auth/verify-otp').send({
      email: 'otp@example.com',
      otp: '000000'
    });

    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.message).toMatch(/incorrect otp/i);
  });

  it('logs in successfully and rejects invalid credentials', async () => {
    const password = 'StrongPass1';
    const hashed = await bcrypt.hash(password, 12);
    await User.create({
      fullName: 'Login User',
      email: 'login@example.com',
      password: hashed,
      isVerified: true
    });

    const success = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password
    });

    expect(success.status).toBe(200);
    expect(success.body.user.email).toBe('login@example.com');

    const badPassword = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'WrongPass1'
    });

    expect(badPassword.status).toBe(401);
  });

  it('rejects unverified account login and requires auth on protected routes', async () => {
    const password = 'StrongPass1';
    const hashed = await bcrypt.hash(password, 12);
    await User.create({
      fullName: 'Unverified User',
      email: 'unverified@example.com',
      password: hashed,
      isVerified: false
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'unverified@example.com',
      password
    });

    expect(loginRes.status).toBe(403);

    const protectedRes = await request(app).get('/api/auth/me');
    expect(protectedRes.status).toBe(401);
  });

  it('supports logout', async () => {
    const hashed = await bcrypt.hash('StrongPass1', 12);
    await User.create({
      fullName: 'Logout User',
      email: 'logout@example.com',
      password: hashed,
      isVerified: true
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'logout@example.com',
      password: 'StrongPass1'
    });

    const cookie = loginRes.headers['set-cookie'][0].split(';')[0];
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [cookie]);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toMatch(/logged out/i);
  });
});
