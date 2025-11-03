import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Chat - {{APP_NAME}}';
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
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10h.01M12 10h.01M16 10h.01"
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
            }}
          >
            AI Chat
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#a0a0a0',
              margin: '0',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            Chat with Claude, Gemini, Llama & more
          </p>

          {/* Models */}
          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
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
              Claude 3.5
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
              Gemini Pro
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
              Llama 3.3
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
              +12 more
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
            {'{{APP_NAME}} • Real-time streaming'}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
