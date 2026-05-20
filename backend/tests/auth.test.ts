import request from 'supertest';

import { app, setupTestDB, createTestUser } from './helpers';

setupTestDB();

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Secure@123',
        confirmPassword: 'Secure@123',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      await createTestUser({ email: 'dup@example.com' });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Dup User',
        email: 'dup@example.com',
        password: 'Secure@123',
        confirmPassword: 'Secure@123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Weak Pass',
        email: 'weak@example.com',
        password: 'password',
        confirmPassword: 'password',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({ email: 'login@example.com', password: 'Test@1234' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'Test@1234',
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPassword!1',
      });

      expect(res.status).toBe(401);
    });

    it('should reject unknown email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'ghost@example.com',
        password: 'Test@1234',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should return new tokens with valid refresh token', async () => {
      const loginRes = await request(app).post('/api/v1/auth/register').send({
        name: 'Refresh Test',
        email: 'refresh@example.com',
        password: 'Refresh@123',
        confirmPassword: 'Refresh@123',
      });

      const { refreshToken } = loginRes.body.data as {
        refreshToken: string;
      };

      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const registerRes = await request(app).post('/api/v1/auth/register').send({
        name: 'Me User',
        email: 'me@example.com',
        password: 'MeUser@123',
        confirmPassword: 'MeUser@123',
      });

      const { accessToken } = registerRes.body.data as { accessToken: string };

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('me@example.com');
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
