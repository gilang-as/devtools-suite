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
        {/* Outer Hexagon */}
        <div
          style={{
            width: '120px',
            height: '120px',
            background: '#3b82f6',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Inner Core */}
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
          marginTop: '10px', 
          color: '#3b82f6', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
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
