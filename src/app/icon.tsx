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
        {/* Simple geometric block matching the brand's muted aesthetic */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }} />
        
        <span style={{ 
          position: 'relative', 
          zIndex: 1, 
          color: 'white',
          fontSize: '18px',
          fontWeight: 900,
          opacity: 0.9
        }}>D</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
