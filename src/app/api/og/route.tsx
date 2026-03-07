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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '40px',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 80%, #fff 1px, transparent 1px)',
              backgroundSize: '100px 100px',
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
            {/* Icon */}
            <div
              style={{
                fontSize: 80,
                marginBottom: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                marginBottom: 20,
                maxWidth: '90%',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 28,
                  opacity: 0.9,
                  maxWidth: '90%',
                  lineHeight: 1.3,
                }}
              >
                {description}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                marginTop: 50,
                fontSize: 20,
                opacity: 0.7,
                display: 'flex',
                gap: 20,
              }}
            >
              <span>devtools-suite.app</span>
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
