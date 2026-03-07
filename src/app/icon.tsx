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
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
        {/* Background Hex Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '140%',
            height: '140%',
            border: '2px solid white',
            transform: 'rotate(45deg)',
          }} />
        </div>
        
        {/* Core Branding Character */}
        <span style={{ 
          position: 'relative', 
          zIndex: 1, 
          color: 'white',
          fontSize: '20px',
          fontWeight: 900,
          letterSpacing: '-0.05em' 
        }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
