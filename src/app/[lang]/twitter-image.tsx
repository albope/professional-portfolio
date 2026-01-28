import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Alberto Bort - Web Developer & PWA Architect';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { lang: string } }) {
  const isSpanish = params.lang === 'es';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Name */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: 'white',
              margin: 0,
              marginBottom: '16px',
              letterSpacing: '-2px',
            }}
          >
            Alberto Bort
          </h1>

          {/* Title */}
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.8)',
              margin: 0,
              marginBottom: '40px',
            }}
          >
            {isSpanish
              ? 'Desarrollador Web & Arquitecto PWA'
              : 'Web Developer & PWA Architect'}
          </p>

          {/* Tech stack badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {['React', 'Next.js', 'TypeScript', 'PWA'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          albertobort.com
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
