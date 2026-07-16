import request from 'supertest';
import { app } from '../app';
import { createTestUser } from './helpers';

describe('Create ticket validation', () => {
  it('returns 400 when title is missing', async () => {
    const user = await createTestUser();

    const res = await request(app).post('/api/tickets').send({
      description: 'Valid description',
      priority: 'medium',
      createdById: user._id.toString(),
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title' }),
      ])
    );
  });

  it('returns 400 when description is missing', async () => {
    const user = await createTestUser();

    const res = await request(app).post('/api/tickets').send({
      title: 'Valid title',
      priority: 'medium',
      createdById: user._id.toString(),
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'description' }),
      ])
    );
  });

  it('returns 201 for valid payload', async () => {
    const user = await createTestUser();

    const res = await request(app).post('/api/tickets').send({
      title: 'New support ticket',
      description: 'Something is broken',
      priority: 'high',
      createdById: user._id.toString(),
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'New support ticket',
      description: 'Something is broken',
      priority: 'high',
      status: 'open',
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdBy.id).toBe(user._id.toString());
  });
});
