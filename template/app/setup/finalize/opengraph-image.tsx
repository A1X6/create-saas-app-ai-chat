import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Setup Complete - {{APP_NAME}}';
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
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                d="M20 6L9 17l-5-5"
                stroke="white"
                strokeWidth="3"
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
            Setup Complete
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
            {'Your {{APP_NAME}} is ready to use!'}
          </p>

          {/* Success Message */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              padding: '16px 32px',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              border: '2px solid #10b981',
            }}
          >
            <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>
              ✓ All systems configured successfully
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '50px',
              fontSize: '20px',
              color: '#666666',
            }}
          >
            {'{{APP_NAME}} • Step 5 of 5'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
