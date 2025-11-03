import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dashboard - {{APP_NAME}}';
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
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
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
            Dashboard
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
            Your AI chat control center
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                minWidth: '150px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                15+
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0', marginTop: '5px' }}>
                AI Models
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                minWidth: '150px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                24/7
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0', marginTop: '5px' }}>
                Available
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                minWidth: '150px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                ∞
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0', marginTop: '5px' }}>
                Possibilities
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '50px',
              fontSize: '18px',
              color: '#666666',
            }}
          >
            {'{{APP_NAME}} • Monitor your usage'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
