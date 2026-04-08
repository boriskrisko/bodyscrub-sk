import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'bodyscrub.sk — Prírodné body scrubs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4A6741 0%, #2E4229 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
            }}
          />
          <span style={{ fontSize: 48, color: '#F5F0E8', fontWeight: 500, letterSpacing: 2 }}>
            bodyscrub.sk
          </span>
        </div>
        <p style={{ fontSize: 24, color: '#B5D1A8', letterSpacing: 1 }}>
          Prírodné body scrubs vyrobené na Slovensku
        </p>
      </div>
    ),
    { ...size }
  );
}
