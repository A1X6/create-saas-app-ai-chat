import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Pricing Plans - SaaS Complete';
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
            Flexible Pricing Plans
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#a0a0a0',
              margin: '0',
              marginBottom: '50px',
              textAlign: 'center',
            }}
          >
            Choose the perfect plan for your needs
          </p>

          {/* Pricing Cards Preview */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '20px',
            }}
          >
            {/* Base Plan */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                backgroundColor: '#1a1a1a',
                borderRadius: '16px',
                border: '2px solid #2a2a2a',
                width: '280px',
              }}
            >
              <div style={{ fontSize: '24px', color: '#ffffff', marginBottom: '10px' }}>
                Base
              </div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '10px',
                }}
              >
                $8
                <span style={{ fontSize: '20px', color: '#a0a0a0' }}>/mo</span>
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0' }}>
                Perfect for individuals
              </div>
            </div>

            {/* Plus Plan */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                backgroundColor: '#1a1a1a',
                borderRadius: '16px',
                border: '2px solid #3b82f6',
                width: '280px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div style={{ fontSize: '24px', color: '#ffffff' }}>Plus</div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#3b82f6',
                    backgroundColor: '#1e3a8a',
                    padding: '4px 12px',
                    borderRadius: '6px',
                  }}
                >
                  Popular
                </div>
              </div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '10px',
                }}
              >
                $30
                <span style={{ fontSize: '20px', color: '#a0a0a0' }}>/mo</span>
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0' }}>
                For growing businesses
              </div>
            </div>

            {/* Pro Plan */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                backgroundColor: '#1a1a1a',
                borderRadius: '16px',
                border: '2px solid #2a2a2a',
                width: '280px',
              }}
            >
              <div style={{ fontSize: '24px', color: '#ffffff', marginBottom: '10px' }}>
                Pro
              </div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  marginBottom: '10px',
                }}
              >
                $50
                <span style={{ fontSize: '20px', color: '#a0a0a0' }}>/mo</span>
              </div>
              <div style={{ fontSize: '16px', color: '#a0a0a0' }}>
                For power users
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '18px',
              color: '#666666',
            }}
          >
            SaaS Complete • All plans include AI credits
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
