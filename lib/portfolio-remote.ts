type RecordRow = { value: unknown; revision: string | null };

export function usesRemoteStorage() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (Boolean(url) !== Boolean(key)) {
    throw new Error('Set both SUPABASE_URL and SUPABASE_SECRET_KEY to enable portfolio persistence.');
  }
  return Boolean(url && key);
}

async function records(query: Record<string, string>, init: RequestInit = {}) {
  const endpoint = new URL('/rest/v1/portfolio_records', process.env.SUPABASE_URL);
  endpoint.search = new URLSearchParams(query).toString();
  const response = await fetch(endpoint, {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
    headers: {
      apikey: process.env.SUPABASE_SECRET_KEY!,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error('Portfolio storage request failed with status ' + response.status + '.');
  }
  return response;
}

export async function readRecord(key: string): Promise<RecordRow | undefined> {
  const response = await records({ key: 'eq.' + key, select: 'value,revision', limit: '1' });
  const [row]: RecordRow[] = await response.json();
  return row;
}

export async function publishRecord(value: unknown, revision: string, previousRevision: string | null) {
  if (previousRevision === null) {
    const response = await records({ on_conflict: 'key' }, {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({ key: 'content', value, revision }),
    });
    const rows: RecordRow[] = await response.json();
    return rows.length === 1;
  }

  const response = await records({ key: 'eq.content', revision: 'eq.' + previousRevision }, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ value, revision }),
  });
  const rows: RecordRow[] = await response.json();
  return rows.length === 1;
}

export async function writeImageRecord(key: string, value: string) {
  await records({ on_conflict: 'key' }, {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ key, value }),
  });
}
