import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';
import User from '../src/models/User.model.js';

dotenv.config();

// Unique email prefix for test isolation
const testId = Date.now();
const testEmail = `testuser_${testId}@test.com`;
const testPassword = 'Test@12345';
const testName = 'Test User';

let registeredToken = null;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Cleanup test users
  await User.deleteMany({ email: { $regex: /^testuser_/ } });
  await mongoose.connection.close();
});

// ─────────────────────────────────────────────
// REGISTRATION TESTS
// ─────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  test('should register a new user successfully and return token + user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe(testName);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.role).toBe('user');
    // Password should NOT be in the response
    expect(res.body.user).not.toHaveProperty('password');

    registeredToken = res.body.token;
  });

  test('should always assign role "user" even if "admin" is passed in body', async () => {
    const adminEmail = `testuser_admin_${testId}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Malicious Admin',
        email: adminEmail,
        password: testPassword,
        role: 'admin', // Attempting privilege escalation — stripped by validate middleware (stripUnknown)
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe('user'); // Must be "user" regardless
  });

  test('should return 409 if email already exists', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/email already in use/i);
  });

  test('should return 400 with field errors if name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: `testuser_noname_${testId}@test.com`, password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/validation failed/i);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
      ])
    );
  });

  test('should return 400 with field errors if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  test('should return 400 with field errors if password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, email: `testuser_nopw_${testId}@test.com` });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'password' }),
      ])
    );
  });

  test('should return 400 if body is empty', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(3); // name, email, password
  });

  test('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, email: `testuser_short_${testId}@test.com`, password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'password',
          message: expect.stringMatching(/at least 6 characters/i),
        }),
      ])
    );
  });

  test('should return 400 if email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: testName, email: 'not-an-email', password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
          message: expect.stringMatching(/invalid email/i),
        }),
      ])
    );
  });
});

// ─────────────────────────────────────────────
// LOGIN TESTS
// ─────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  test('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.name).toBe(testName);
    expect(res.body.user.role).toBe('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('should return JWT token that is a valid non-empty string', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(0);
    // JWT format: xxx.yyy.zzz
    expect(res.body.token.split('.')).toHaveLength(3);
  });

  test('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'WrongPassword123' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  test('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@fake.com', password: testPassword });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  test('should return 400 with field errors if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  test('should return 400 with field errors if password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'password' }),
      ])
    );
  });

  test('should return 400 if body is empty', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2); // email, password
  });
});

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────

describe('GET /api/health', () => {
  test('should return health status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ─────────────────────────────────────────────
// ERROR HANDLING INFRASTRUCTURE TESTS
// ─────────────────────────────────────────────

describe('Error handling infrastructure', () => {
  test('validate middleware returns consistent error shape', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
    res.body.errors.forEach((err) => {
      expect(err).toHaveProperty('field');
      expect(err).toHaveProperty('message');
    });
  });

  test('AppError produces correct status code and message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@none.com', password: 'anything123' });

    // 401 from AppError thrown in login controller
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message');
  });

  test('unknown routes return 404 (Express default)', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.statusCode).toBe(404);
  });
});
