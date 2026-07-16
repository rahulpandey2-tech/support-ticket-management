import request from 'supertest';
import { app } from '../app';
import { createTestTicket, createTestUser } from './helpers';

describe('Valid status transitions', () => {
  it('open → in_progress', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), { status: 'open' });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('in_progress → resolved', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), {
      status: 'in_progress',
    });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'resolved' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('resolved');
  });

  it('resolved → closed', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), {
      status: 'resolved',
    });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'closed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('closed');
  });

  it('open → cancelled', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), { status: 'open' });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'cancelled' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });

  it('in_progress → cancelled', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), {
      status: 'in_progress',
    });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'cancelled' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });
});

describe('Invalid status transitions', () => {
  it('open → closed returns 400', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), { status: 'open' });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'closed' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cannot transition from open to closed');
  });

  it('open → resolved returns 400', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), { status: 'open' });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'resolved' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cannot transition from open to resolved');
  });

  it('resolved → in_progress returns 400', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), {
      status: 'resolved',
    });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'in_progress' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cannot transition from resolved to in_progress');
  });

  it('closed → open returns 400', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), { status: 'closed' });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'open' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cannot transition from closed to open');
  });

  it('cancelled → open returns 400', async () => {
    const user = await createTestUser();
    const ticket = await createTestTicket(user._id.toString(), {
      status: 'cancelled',
    });

    const res = await request(app)
      .patch(`/api/tickets/${ticket._id}/status`)
      .send({ status: 'open' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Cannot transition from cancelled to open');
  });
});
