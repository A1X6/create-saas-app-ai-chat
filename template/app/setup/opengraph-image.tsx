import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Setup Wizard - {{APP_NAME}}';
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              marginBottom: '40px',
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
              fontSize: '64px',
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #ffffff, #a0a0a0)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Setup Wizard
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#a0a0a0',
              margin: '0',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {'Configure your {{APP_NAME}} environment'}
          </p>

          {/* Steps */}
          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#ffffff',
              }}
            >
              1. Environment
            </div>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#ffffff',
              }}
            >
              2. Database
            </div>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#ffffff',
              }}
            >
              3. Stripe
            </div>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#ffffff',
              }}
            >
              4. Prompts
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '60px',
              fontSize: '20px',
              color: '#666666',
            }}
          >
            {'{{APP_NAME}} • Development mode only'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
