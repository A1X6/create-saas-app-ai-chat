import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker/Cloud Run
 * Used by load balancers and container orchestrators to verify service health
 *
 * Returns 200 OK if the service is healthy
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        status: 'healthy',
        service: 'api',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

// Also support HEAD requests for simple health checks
export async function HEAD() {
  return new Response(null, { status: 200 });
}
