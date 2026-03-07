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
        {/* Outer Hexagon Shell */}
        <div
          style={{
            width: '130px',
            height: '130px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
          }}
        >
          {/* Inner Core with Brand Letter */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: '#1e293b',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '60px',
              fontWeight: '900',
            }}
          >
            D
          </div>
        </div>
        <div style={{ 
          marginTop: '15px', 
          color: '#3b82f6', 
          fontSize: '14px', 
          fontWeight: '800', 
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          opacity: 0.9
        }}>
          DevTools Suite
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
