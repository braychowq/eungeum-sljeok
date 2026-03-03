export const dynamic = 'force-dynamic';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

async function getBackendHealth() {
  const backendUrl =
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://backend:8080';

  try {
    const response = await fetch(`${backendUrl}/api/health`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as HealthResponse;
    return { ok: true as const, backendUrl, data };
  } catch (error) {
    return {
      ok: false as const,
      backendUrl,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default async function HomePage() {
  const health = await getBackendHealth();

  return (
    <main className="page">
      <section className="card">
        <h1>eungeun-sljeok</h1>
        <p>Next.js 16 + Spring Boot 4 Railway Monorepo Starter</p>

        <div className="status">
          <strong>Backend URL:</strong> <code>{health.backendUrl}</code>
        </div>

        {health.ok ? (
          <div className="ok">
            <p>Backend status: {health.data.status}</p>
            <p>Service: {health.data.service}</p>
            <p>Timestamp: {health.data.timestamp}</p>
          </div>
        ) : (
          <div className="error">
            <p>Backend connection failed.</p>
            <p>{health.error}</p>
          </div>
        )}
      </section>
    </main>
  );
}
