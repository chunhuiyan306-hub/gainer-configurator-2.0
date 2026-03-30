import type { HandleWorkflow } from '../data';

/**
 * Schematic front elevation: white panel, double black frame, vertical handle on pull side.
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

  const margin = Math.max(28, Math.min(56, w * 0.06));
  const inner = margin * 0.45;
  const innerL = margin + inner;
  const innerR = w - margin - inner;
  const innerT = margin + inner;
  const innerB = h - margin - inner;

  /** Handle thickness (horizontal extent of the vertical bar). */
  const rail = Math.max(10, Math.min(22, w * 0.028));
  const rightInset = margin + w * 0.08;
  const cx = w - rightInset;
  const handleX = Math.min(Math.max(cx - rail / 2, innerL + 8), innerR - rail - 8);

  let y1: number;
  let y2: number;
  if (fullLength) {
    y1 = innerT + 16;
    y2 = innerB - 16;
  } else {
    let halfVert: number;
    if (workflow === 'separate' || workflow === 'fixed') {
      halfVert = Math.max(separateLengthMm / 2, 20);
    } else {
      halfVert = Math.max((lengthMm ?? 160) / 2, 40);
    }
    y1 = yCenter - halfVert;
    y2 = yCenter + halfVert;
    y1 = Math.max(innerT + rail, y1);
    y2 = Math.min(innerB - rail, y2);
    if (y2 <= y1) {
      y1 = innerT + 20;
      y2 = innerB - 20;
    }
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
                x={handleX}
                y={y1}
                width={rail}
                height={Math.max(y2 - y1, 8)}
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
