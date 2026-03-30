import type { HandleWorkflow } from '../data';

/**
 * Front elevation: double black frame, blue hinge centers (left), yellow handle (right).
 * Hinge y from bottom → SVG y = h - fromBottom.
 */
export function HingeHandleSchematic({
  widthMm,
  heightMm,
  hingePositionsFromBottomMm,
  handleWorkflow,
  handleBottomMm,
  handleLengthMm,
  handleFullLength,
  separateLengthMm,
  labels,
}: {
  widthMm: number | null;
  heightMm: number | null;
  hingePositionsFromBottomMm: number[];
  handleWorkflow: HandleWorkflow;
  handleBottomMm: number | null;
  handleLengthMm: number | null;
  handleFullLength: boolean;
  separateLengthMm: number;
  labels: { title: string; handleAria: string; segmentD: (i: number) => string };
}) {
  const w0 = widthMm && widthMm > 0 ? widthMm : 600;
  const h0 = heightMm && heightMm > 0 ? heightMm : 2200;
  const w = Math.min(Math.max(w0, 200), 1200);
  const h = Math.min(Math.max(h0, 400), 3000);

  const margin = Math.max(28, Math.min(56, w * 0.06));
  const inner = margin * 0.45;
  const innerL = margin + inner;
  const innerR = w - margin - inner;
  const innerT = margin + inner;
  const innerB = h - margin - inner;

  const sortedHinges = [...hingePositionsFromBottomMm].sort((a, b) => a - b);
  const hingeX = innerL + Math.max(14, w * 0.04);
  const hingeR = Math.max(8, Math.min(16, w * 0.022));

  const b = handleBottomMm ?? 960;
  const yCenter = Math.min(Math.max(h - b, 60), h - 60);
  const rail = Math.max(10, Math.min(22, w * 0.028));
  const rightInset = margin + w * 0.08;
  const cx = w - rightInset;
  const handleX = Math.min(Math.max(cx - rail / 2, innerL + 8), innerR - rail - 8);

  let y1: number;
  let y2: number;
  if (handleFullLength) {
    y1 = innerT + 16;
    y2 = innerB - 16;
  } else {
    let halfVert: number;
    if (handleWorkflow === 'separate' || handleWorkflow === 'fixed') {
      halfVert = Math.max(separateLengthMm / 2, 20);
    } else {
      halfVert = Math.max((handleLengthMm ?? 160) / 2, 40);
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

  const showHandle = handleWorkflow !== 'none' && handleWorkflow !== 'vshape';
  const fs = Math.max(20, Math.min(44, h * 0.02));

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
        {labels.title}
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
          aria-label={labels.handleAria}
          style={{
            width: '100%',
            maxWidth: 220,
            height: 'auto',
            maxHeight: 340,
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

          {sortedHinges.map((fromBottom, idx) => {
            const cy = h - fromBottom;
            return (
              <g key={`${fromBottom}-${idx}`}>
                <circle
                  cx={hingeX}
                  cy={cy}
                  r={hingeR}
                  fill="#1e5bb8"
                  stroke="#0d3d82"
                  strokeWidth={2}
                />
                <rect
                  x={hingeX - hingeR * 0.35}
                  y={cy - hingeR * 1.2}
                  width={hingeR * 0.7}
                  height={hingeR * 0.55}
                  rx={2}
                  fill="#1e5bb8"
                  stroke="#0d3d82"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {sortedHinges.length >= 2
            ? sortedHinges.slice(0, -1).map((fromBottom, i) => {
                const next = sortedHinges[i + 1]!;
                const gap = Math.round(next - fromBottom);
                const yA = h - fromBottom;
                const yB = h - next;
                const midY = (yA + yB) / 2;
                const midX = (innerL + innerR) / 2;
                return (
                  <text
                    key={`seg-${i}`}
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#444"
                    fontSize={fs}
                    fontWeight={600}
                  >
                    {`${labels.segmentD(i)} ${gap}`}
                  </text>
                );
              })
            : null}

          {showHandle ? (
            <rect
              x={handleX}
              y={y1}
              width={rail}
              height={Math.max(y2 - y1, 8)}
              rx={rail / 4}
              fill="#e6b800"
              stroke="#b8860b"
              strokeWidth={2}
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}
