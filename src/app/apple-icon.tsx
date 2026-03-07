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
        {/* Hexagon Shell with Muted Gradient matching natural integration */}
        <div
          style={{
            width: '130px',
            height: '130px',
            background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Inner Core */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.02)',
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
