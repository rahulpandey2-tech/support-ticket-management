/**
 * Manual state machine API test script (Step 5.4).
 * Run: npm run test:state-machine
 * Requires: backend NOT running on PORT (uses supertest-style via fetch to running server)
 *
 * Or run with server up: npm run dev (separate terminal) then npm run test:state-machine
 */
import dotenv from 'dotenv';

dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 3001}/api`;

interface TestResult {
  name: string;
  passed: boolean;
  status: number;
  body: unknown;
}

async function request(
  method: string,
  path: string,
  body?: object
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // keep raw text
  }
  return { status: res.status, body: parsed };
}

async function patchStatus(ticketId: string, status: string) {
  return request('PATCH', `/tickets/${ticketId}/status`, { status });
}

async function run(): Promise<void> {
  console.log('State machine manual API tests\n');

  const listRes = await request('GET', '/tickets?status=open');
  const tickets = listRes.body as { id: string; status: string }[];

  if (!Array.isArray(tickets) || tickets.length === 0) {
    console.error('No open tickets found. Run npm run seed first.');
    process.exit(1);
  }

  const openId = tickets[0].id;
  const results: TestResult[] = [];

  const record = (
    name: string,
    res: { status: number; body: unknown },
    expectStatus: number
  ) => {
    results.push({
      name,
      passed: res.status === expectStatus,
      status: res.status,
      body: res.body,
    });
  };

  // --- Valid transitions on a fresh open ticket ---
  let r = await patchStatus(openId, 'in_progress');
  record('T1: open → in_progress', r, 200);

  r = await patchStatus(openId, 'resolved');
  record('T2: in_progress → resolved', r, 200);

  r = await patchStatus(openId, 'closed');
  record('T3: resolved → closed', r, 200);

  // New open ticket for cancelled path
  const open2 = (await request('GET', '/tickets?status=open')).body as {
    id: string;
  }[];
  const open2Id = open2[0]?.id ?? openId;

  r = await patchStatus(open2Id, 'cancelled');
  record('T4: open → cancelled', r, 200);

  // in_progress → cancelled
  const inProgress = (await request('GET', '/tickets?status=in_progress')).body as {
    id: string;
  }[];
  if (inProgress.length > 0) {
    r = await patchStatus(inProgress[0].id, 'cancelled');
    record('T5: in_progress → cancelled', r, 200);
  }

  // --- Invalid transitions ---
  const openForInvalid = (await request('GET', '/tickets?status=open')).body as {
    id: string;
  }[];
  const invalidId = openForInvalid[0]?.id;

  if (invalidId) {
    r = await patchStatus(invalidId, 'closed');
    record('Invalid: open → closed', r, 400);

    r = await patchStatus(invalidId, 'resolved');
    record('Invalid: open → resolved', r, 400);
  }

  const closed = (await request('GET', '/tickets?status=closed')).body as {
    id: string;
  }[];
  if (closed.length > 0) {
    r = await patchStatus(closed[0].id, 'open');
    record('Invalid: closed → open', r, 400);
  }

  // Allowed transitions helper
  if (invalidId) {
    r = await request('GET', `/tickets/${invalidId}/allowed-transitions`);
    record('GET allowed-transitions (open ticket)', r, 200);
  }

  console.log('Results:\n');
  for (const t of results) {
    console.log(`${t.passed ? 'PASS' : 'FAIL'} — ${t.name} (HTTP ${t.status})`);
    if (!t.passed) {
      console.log('  ', JSON.stringify(t.body));
    }
  }

  const failed = results.filter((t) => !t.passed).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test run failed:', err.message);
  console.error('Is the server running? npm run dev');
  process.exit(1);
});
