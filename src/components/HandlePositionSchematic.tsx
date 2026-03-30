import type { HandleWorkflow } from '../data';

/**
 * Schematic front elevation: white panel, double black frame, horizontal handle bar.
 * Geometry uses real W×H (mm) in viewBox so scale is consistent (~1:40…1:50 on screen via max size).
 */
export function HandlePositionSchematic({
  widthMm,
  heightMm,
  bottomMm,
  lengthMm,
  fullLength,
  separateLengthMm,
  workflow,
  labels,
}: {
  widthMm: number | null;
  heightMm: number | null;
  bottomMm: number | null;
  lengthMm: number | null;
  fullLength: boolean;
  separateLengthMm: number;
  workflow: HandleWorkflow;
  labels: { door: string; handle: string };
}) {
  const w0 = widthMm && widthMm > 0 ? widthMm : 600;
  const h0 = heightMm && heightMm > 0 ? heightMm : 2200;
  const w = Math.min(Math.max(w0, 200), 1200);
  const h = Math.min(Math.max(h0, 400), 3000);

  const b = bottomMm ?? (workflow === 'separate' ? 960 : 960);
  const yCenter = Math.min(Math.max(h - b, 60), h - 60);

  let halfLen: number;
  if (workflow === 'separate' || workflow === 'fixed') {
    halfLen = separateLengthMm / 2;
  } else if (fullLength) {
    halfLen = (w - 100) / 2;
  } else {
    halfLen = Math.max((lengthMm ?? 160) / 2, 40);
  }

  const margin = Math.max(28, Math.min(56, w * 0.06));
  const inner = margin * 0.45;
  const rail = Math.max(10, Math.min(22, w * 0.028));
  const rightInset = margin + w * 0.08;
  const cx = w - rightInset;
  let x1 = cx - halfLen;
  let x2 = cx + halfLen;
  const innerL = margin + inner;
  const innerR = w - margin - inner;
  const innerT = margin + inner;
  const innerB = h - margin - inner;
  x1 = Math.max(innerL + rail, x1);
  x2 = Math.min(innerR - rail, x2);
  if (workflow === 'cnc' && fullLength) {
    x1 = innerL + 16;
    x2 = innerR - 16;
  }

  const showHandle = workflow !== 'none' && workflow !== 'vshape';

  return (
    <div style={{ marginTop: 12 }}>
      <p
        style={{
          margin: '0 0 8px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        {labels.door}
      </p>
      <div
        style={{
          borderRadius: 10,
          padding: 10,
          background: '#fafafa',
          border: '1px solid var(--border-strong)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={labels.handle}
          style={{
            width: '100%',
            maxWidth: 200,
            height: 'auto',
            maxHeight: 320,
            display: 'block',
          }}
        >
          <rect
            x={4}
            y={4}
            width={w - 8}
            height={h - 8}
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth={6}
          />
          <rect
            x={margin}
            y={margin}
            width={w - 2 * margin}
            height={h - 2 * margin}
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth={3}
          />
          <rect
            x={innerL}
            y={innerT}
            width={innerR - innerL}
            height={innerB - innerT}
            fill="#ffffff"
            stroke="none"
          />
          {showHandle ? (
            <g>
              <rect
                x={x1}
                y={yCenter - rail / 2}
                width={Math.max(x2 - x1, 8)}
                height={rail}
                rx={rail / 4}
                fill="#2a2a2a"
                stroke="#000"
                strokeWidth={1}
              />
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
