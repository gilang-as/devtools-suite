import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Executed on the server to generate the favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#3b82f6',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          color: 'white',
          fontWeight: 'black',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract geometric pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          <div style={{ width: '150%', height: '1px', background: 'white', transform: 'rotate(45deg)' }} />
          <div style={{ width: '150%', height: '1px', background: 'white', transform: 'rotate(-45deg)' }} />
        </div>
        
        {/* Branding Character */}
        <span style={{ position: 'relative', zIndex: 1, letterSpacing: '-0.05em' }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
