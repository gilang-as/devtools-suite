import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          padding: '20px',
        }}
      >
        {/* Hexagon Shell with Muted Gradient */}
        <div
          style={{
            width: '130px',
            height: '130px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
          }}
        >
          {/* Inner Core */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.05)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '64px',
              fontWeight: '900',
            }}
          >
            D
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
