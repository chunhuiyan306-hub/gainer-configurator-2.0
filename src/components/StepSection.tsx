import type { ReactNode } from 'react';

export function StepSection({
  step,
  stepPrefix = 'Step',
  title,
  subtitle,
  children,
}: {
  step: number;
  stepPrefix?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: 48,
        scrollMarginTop: 24,
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {stepPrefix} {step}
        </p>
        <h2
          style={{
            margin: '4px 0 0',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 15,
              color: 'var(--text-secondary)',
              maxWidth: 560,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
