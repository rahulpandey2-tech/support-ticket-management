/**
 * End-to-end API smoke test (Phase 7.1).
 * Run: npm run smoke:test (requires backend on PORT, default 3001)
 */
import dotenv from 'dotenv';

dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 3001}/api`;

interface TestResult {
  step: string;
  passed: boolean;
  detail?: string;
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: object
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed: T;
  try {
    parsed = JSON.parse(text) as T;
  } catch {
    throw new Error(`${method} ${path} returned non-JSON (HTTP ${res.status})`);
  }
  return { status: res.status, body: parsed };
}

async function run(): Promise<void> {
  console.log('E2E smoke test — API flow\n');
  const results: TestResult[] = [];

  const record = (step: string, passed: boolean, detail?: string) => {
    results.push({ step, passed, detail });
    console.log(`${passed ? 'PASS' : 'FAIL'} — ${step}${detail ? `: ${detail}` : ''}`);
  };

  try {
    const health = await request<{ status: string }>('GET', '/health');
    record('Health check', health.status === 200 && health.body.status === 'ok');

    const users = await request<Array<{ id: string; email: string }>>('GET', '/users');
    const creator = users.body.find((u) => u.email === 'john@example.com') ?? users.body[0];
    record('Load users', users.status === 200 && !!creator, creator?.email);

    const unique = `E2E Smoke ${Date.now()}`;
    const created = await request<{ id: string; title: string; status: string }>(
      'POST',
      '/tickets',
      {
        title: unique,
        description: 'Created by automated smoke test',
        priority: 'medium',
        createdById: creator.id,
      }
    );
    record(
      'Create ticket',
      created.status === 201 && created.body.status === 'open',
      created.body.id
    );
    const ticketId = created.body.id;

    const list = await request<Array<{ id: string; title: string }>>('GET', '/tickets');
    const inList = list.body.some((t) => t.id === ticketId);
    record('Ticket appears in list', list.status === 200 && inList);

    const detail = await request<{ id: string; title: string }>('GET', `/tickets/${ticketId}`);
    record('Get ticket detail', detail.status === 200 && detail.body.title === unique);

    const updated = await request<{ title: string }>('PATCH', `/tickets/${ticketId}`, {
      title: `${unique} (edited)`,
      description: 'Updated description from smoke test',
    });
    record(
      'Edit ticket fields',
      updated.status === 200 && updated.body.title.includes('(edited)')
    );

    const statusChange = await request<{ status: string }>(
      'PATCH',
      `/tickets/${ticketId}/status`,
      { status: 'in_progress' }
    );
    record(
      'Change status open → in_progress',
      statusChange.status === 200 && statusChange.body.status === 'in_progress'
    );

    const comment = await request('POST', `/tickets/${ticketId}/comments`, {
      message: 'Smoke test comment',
      createdById: creator.id,
    });
    record('Add comment', comment.status === 201);

    const withComments = await request<{ comments?: Array<{ message: string }> }>(
      'GET',
      `/tickets/${ticketId}`
    );
    const hasComment = (withComments.body.comments ?? []).some(
      (c) => c.message === 'Smoke test comment'
    );
    record('Comment visible on detail', withComments.status === 200 && hasComment);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    record('Smoke test execution', false, message);
    console.error('\nIs the backend running? npm run dev');
  }

  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();
