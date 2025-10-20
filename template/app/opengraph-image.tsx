import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SaaS Complete - Production-ready SaaS Starter';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              marginBottom: '40px',
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #ffffff, #a0a0a0)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0',
              marginBottom: '20px',
              textAlign: 'center',
              lineHeight: '1.1',
            }}
          >
            SaaS Complete
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#a0a0a0',
              margin: '0',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: '1.4',
            }}
          >
            Production-ready SaaS starter with Auth, Payments, AI & Database
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                fontSize: '20px',
                color: '#ffffff',
              }}
            >
              🔐 Supabase Auth
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                fontSize: '20px',
                color: '#ffffff',
              }}
            >
              💳 Stripe Payments
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                fontSize: '20px',
                color: '#ffffff',
              }}
            >
              🤖 AI Chat
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
