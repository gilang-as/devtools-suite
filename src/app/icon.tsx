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
          background: 'transparent',
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
        {/* Layered hexagonal brand icon matching the Logo component design */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }} />
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          clipPath: 'polygon(50% 0%, 100% 25%, 50% 100%, 0% 25%)',
        }} />

        <span style={{ 
          position: 'relative', 
          zIndex: 1, 
          color: 'white',
          fontSize: '18px',
          fontWeight: 900,
          opacity: 0.95
        }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
