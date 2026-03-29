import type { CSSProperties } from 'react';
import type { Frame } from '../data';
import { msg } from '../translations';
import { MediaThumb } from './MediaThumb';

type CatalogMsg = ReturnType<typeof msg>;

export function HandleMountPanel({
  frame,
  bottomMm,
  lengthMm,
  cncFull,
  onChange,
  t,
}: {
  frame: Frame;
  bottomMm: number | null;
  lengthMm: number | null;
  cncFull: boolean;
  onChange: (bottom: number | null, length: number | null, full: boolean) => void;
  t: CatalogMsg;
}) {
  const wf = frame.handleWorkflow;
  const pic = frame.handleDiagramPicture;
  const showLen = wf === 'cnc';

  const inputStyle: CSSProperties = {
    width: '100%',
    maxWidth: 160,
    padding: '10px 12px',
    fontSize: 15,
    borderRadius: 10,
    border: '1px solid var(--border-strong)',
    background: 'var(--surface)',
    color: 'var(--text)',
  };

  const hint =
    wf === 'separate'
      ? t.stepHandleMountHintSeparate
      : wf === 'cnc'
        ? t.stepHandleMountHintCnc
        : t.stepHandleMountHintFixed;

  return (
    <div
      style={{
        marginTop: 20,
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'minmax(200px, 1fr) minmax(220px, 300px)',
        alignItems: 'start',
      }}
    >
      <div>
        <MediaThumb picture={pic} alt="handle diagram" />
        <p
          style={{
            marginTop: 10,
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
          }}
        >
          {hint}
        </p>
      </div>
      <div style={{ padding: '4px 0' }}>
        <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>{t.stepHandleMountTitle}</p>
        <label
          style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}
        >
          {t.labelHandleBottomMm}
        </label>
        <input
          type="number"
          min={wf === 'separate' ? 200 : 50}
          value={bottomMm ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === '' ? null : Number(v), lengthMm, cncFull);
          }}
          style={inputStyle}
        />

        {showLen ? (
          <>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 16,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={cncFull}
                onChange={(e) => onChange(bottomMm, lengthMm, e.target.checked)}
              />
              {t.labelCncFullLength}
            </label>
            {!cncFull ? (
              <>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    marginTop: 14,
                    marginBottom: 6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t.labelHandleLengthMm}
                </label>
                <input
                  type="number"
                  min={50}
                  value={lengthMm ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    onChange(bottomMm, v === '' ? null : Number(v), cncFull);
                  }}
                  style={inputStyle}
                />
              </>
            ) : null}
          </>
        ) : wf === 'separate' ? (
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
            {t.stepHandleLengthFixed160}
          </p>
        ) : null}
      </div>
    </div>
  );
}
