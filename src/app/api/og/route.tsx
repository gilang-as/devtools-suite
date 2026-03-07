import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'DevTools Suite';
    const description = searchParams.get('description') || 'Premium online developer tools';
    const icon = searchParams.get('icon') || '🛠️';

    return new ImageResponse(
      (
        <div
          style={{
            background: '#0f172a',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px), radial-gradient(circle at 80% 80%, #3b82f6 1px, transparent 1px)',
              backgroundSize: '100px 100px',
            }}
          />

          {/* Abstract background shape */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
              opacity: 0.2,
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {/* Hexagonal Branding Icon */}
            <div
              style={{
                width: 140,
                height: 140,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 80 }}>{icon}</div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: '900',
                marginBottom: 20,
                maxWidth: '90%',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 28,
                  opacity: 0.7,
                  maxWidth: '80%',
                  lineHeight: 1.4,
                  fontWeight: '500',
                }}
              >
                {description}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                marginTop: 60,
                display: 'flex',
                alignItems: 'center',
                gap: 15,
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                background: '#3b82f6',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>D</div>
              <span style={{ fontSize: 24, fontWeight: 'bold', opacity: 0.9 }}>devtools-suite.app</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'cache-control': 'public, max-age=3600, s-maxage=86400',
        },
      }
    );
  } catch (error) {
    console.error('[v0] OG image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
