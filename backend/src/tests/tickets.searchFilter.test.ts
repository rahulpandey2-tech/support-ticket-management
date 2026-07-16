import request from 'supertest';
import { app } from '../app';
import { seedUsersAndTickets } from './helpers';

describe('Search and filter', () => {
  beforeEach(async () => {
    await seedUsersAndTickets();
  });

  it('keyword search returns matching tickets', async () => {
    const res = await request(app).get('/api/tickets').query({ q: 'password' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.some((ticket: { title: string }) =>
        ticket.title.toLowerCase().includes('password')
      )
    ).toBe(true);
  });

  it('status filter returns only matching status', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .query({ status: 'closed' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.every((ticket: { status: string }) => ticket.status === 'closed')
    ).toBe(true);
    expect(
      res.body.some((ticket: { title: string }) => ticket.title === 'Export CSV issue')
    ).toBe(true);
  });

  it('combined search and status filter', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .query({ status: 'open', q: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Password reset broken');
    expect(res.body[0].status).toBe('open');
  });
});
