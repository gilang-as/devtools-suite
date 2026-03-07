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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)',
          }} />
          
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
              opacity: 0.9
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
