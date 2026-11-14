import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import HackathonRegistration from '../src/models/HackathonRegistration.js';
import { connectMongo, disconnectMongo } from '../src/config/db.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectMongo();
});

beforeEach(async () => {
  await HackathonRegistration.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnectMongo();
});

describe('Hackathon registration API', () => {
  const createLoggedUser = async (email = 'student@example.com') => {
    const user = await User.create({
      fullName: 'Student User',
      email,
      password: await bcrypt.hash('StrongPass1', 12),
      isVerified: true
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email,
      password: 'StrongPass1'
    });

    return { user, cookie: loginRes.headers['set-cookie'][0] };
  };

  it('registers the hackathon entry successfully', async () => {
    const { cookie } = await createLoggedUser();

    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [cookie])
      .send({
        fullName: 'Student User',
        email: 'student@example.com',
        mobileNumber: '9876543210',
        collegeName: 'VIT Vellore',
        course: 'B.Tech',
        branch: 'CSE',
        yearOfStudy: '3rd year',
        domain: 'AI/ML',
        projectName: 'AI Health Tracker',
        pptLink: 'https://drive.google.com/file/d/example/view',
        prototypeLink: 'https://github.com/example/project',
        demoVideoLink: 'https://www.youtube.com/watch?v=123',
        teamSize: 2,
        teamMembers: [{ name: 'Team Member', email: 'team@example.com' }]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(await HackathonRegistration.countDocuments()).toBe(1);
  });

  it('rejects invalid mobile number and team size mismatch', async () => {
    const { cookie } = await createLoggedUser('student2@example.com');

    const invalidMobile = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [cookie])
      .send({
        fullName: 'Student User',
        email: 'student2@example.com',
        mobileNumber: '123',
        collegeName: 'Other',
        course: 'B.Tech',
        branch: 'CSE',
        yearOfStudy: '2nd year',
        domain: 'AI/ML',
        projectName: 'Project name',
        pptLink: 'https://drive.google.com/file/d/example/view',
        prototypeLink: 'https://github.com/example/project',
        teamSize: 1,
        teamMembers: []
      });

    expect(invalidMobile.status).toBe(400);

    const mismatch = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [cookie])
      .send({
        fullName: 'Student User',
        email: 'student2@example.com',
        mobileNumber: '9876543210',
        collegeName: 'Other',
        course: 'B.Tech',
        branch: 'CSE',
        yearOfStudy: '2nd year',
        domain: 'AI/ML',
        projectName: 'Project name',
        pptLink: 'https://drive.google.com/file/d/example/view',
        prototypeLink: 'https://github.com/example/project',
        teamSize: 3,
        teamMembers: [{ name: 'One', email: 'one@example.com' }]
      });

    expect(mismatch.status).toBe(400);
  });

  it('prevents duplicate registration and returns the user entry', async () => {
    const { cookie, user } = await createLoggedUser('student3@example.com');

    await HackathonRegistration.create({
      userId: user._id,
      fullName: 'Student User',
      email: 'student3@example.com',
      mobileNumber: '9876543210',
      collegeName: 'VIT Vellore',
      course: 'B.Tech',
      branch: 'CSE',
      yearOfStudy: '3rd year',
      domain: 'AI/ML',
      projectName: 'Project Demo',
      pptLink: 'https://drive.google.com/file/d/example/view',
      prototypeLink: 'https://github.com/example/project',
      teamSize: 1,
      teamMembers: []
    });

    const duplicate = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [cookie])
      .send({
        fullName: 'Student User',
        email: 'student3@example.com',
        mobileNumber: '9876543210',
        collegeName: 'VIT Vellore',
        course: 'B.Tech',
        branch: 'CSE',
        yearOfStudy: '3rd year',
        domain: 'AI/ML',
        projectName: 'Project Demo',
        pptLink: 'https://drive.google.com/file/d/example/view',
        prototypeLink: 'https://github.com/example/project',
        teamSize: 1,
        teamMembers: []
      });

    expect(duplicate.status).toBe(409);

    const getRes = await request(app).get('/api/hackathon/my-entry').set('Cookie', [cookie]);
    expect(getRes.status).toBe(200);
    expect(getRes.body.registration.email).toBe('student3@example.com');
  });

  it('rejects unauthorized deletion attempts', async () => {
    const { cookie, user } = await createLoggedUser('student4@example.com');
    await HackathonRegistration.create({
      userId: user._id,
      fullName: 'Student User',
      email: 'student4@example.com',
      mobileNumber: '9876543210',
      collegeName: 'VIT Vellore',
      course: 'B.Tech',
      branch: 'CSE',
      yearOfStudy: '3rd year',
      domain: 'AI/ML',
      projectName: 'Project Demo',
      pptLink: 'https://drive.google.com/file/d/example/view',
      prototypeLink: 'https://github.com/example/project',
      teamSize: 1,
      teamMembers: []
    });

    const deleteRes = await request(app).delete('/api/hackathon/').set('Cookie', [cookie]);
    expect(deleteRes.status).toBe(200);

    const secondDelete = await request(app).delete('/api/hackathon/').set('Cookie', [cookie]);
    expect(secondDelete.status).toBe(404);
  });
});
