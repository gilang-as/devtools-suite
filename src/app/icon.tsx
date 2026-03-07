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
          background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
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
        {/* Subtle inner layering to match muted geometric style */}
        <div style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20%',
          transform: 'rotate(10deg)',
        }} />
        
        {/* Core Branding Character */}
        <span style={{ 
          position: 'relative', 
          zIndex: 1, 
          color: 'white',
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          opacity: 0.8
        }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
