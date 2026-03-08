import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { SITE_CONFIG } from '@/lib/seo';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || SITE_CONFIG.name;
    const description = searchParams.get('description') || 'Premium online developer tools';

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
            fontFamily: 'sans-serif',
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
            {/* Hexagonal Branding Icon (replicated inline for OG) */}
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
                fontSize: 80,
                color: '#3b82f6',
                fontWeight: 'bold',
              }}
            >
              D
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                marginBottom: 20,
                maxWidth: '90%',
                lineHeight: 1.1,
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
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>D</div>
              <span style={{ fontSize: 24, fontWeight: 'bold', opacity: 0.9 }}>{SITE_CONFIG.url.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
