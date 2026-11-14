import request from 'supertest';

const renderOrigin = 'https://project-matrucare.onrender.com';
process.env.RENDER_EXTERNAL_URL = renderOrigin;

const { default: app } = await import('../src/app.js');

describe('CORS configuration', () => {
  it('allows the Render service origin', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', renderOrigin);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(renderOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});
