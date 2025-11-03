import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Features - {{APP_NAME}}';
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
            Powerful Features
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#a0a0a0',
              margin: '0',
              marginBottom: '50px',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            Everything you need for professional AI-powered conversations
          </p>

          {/* Feature Grid */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                width: '180px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
              <div style={{ fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
                15+ Models
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                width: '180px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
              <div style={{ fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
                Real-time Chat
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                width: '180px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
                Analytics
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                width: '180px',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💾</div>
              <div style={{ fontSize: '18px', color: '#ffffff', textAlign: 'center' }}>
                Save Prompts
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
            {'{{APP_NAME}} • Built for professionals'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
