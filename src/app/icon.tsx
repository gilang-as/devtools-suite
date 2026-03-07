import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle inner layering */}
        <div style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20%',
          transform: 'rotate(10deg)',
        }} />
        
        {/* Core Branding Character */}
        <span style={{ 
          position: 'relative', 
          zIndex: 1, 
          color: 'white',
          fontSize: '20px',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          opacity: 0.95
        }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
