import type { CSSProperties } from 'react';
import type { Frame } from '../data';
import {
  HANDLE_CENTER_MIN_FROM_BOTTOM_MM,
  HANDLE_PULL_LENGTH_MM,
  isHandleKickGuardViolated,
} from '../handleRules';
import { msg } from '../translations';
import { MediaThumb } from './MediaThumb';
import { HandlePositionSchematic } from './HandlePositionSchematic';

type CatalogMsg = ReturnType<typeof msg>;

function finiteMm(v: number | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function HandleMountPanel({
  frame,
  widthMm,
  heightMm,
  bottomMm,
  lengthMm,
  cncFull,
  onChange,
  t,
}: {
  frame: Frame;
  widthMm: number | null;
  heightMm: number | null;
  bottomMm: number | null;
  lengthMm: number | null;
  cncFull: boolean;
  onChange: (bottom: number | null, length: number | null, full: boolean) => void;
  t: CatalogMsg;
}) {
  const wf = frame.handleWorkflow;
  const pic = frame.handleDiagramPicture;
  const bottomVal = finiteMm(bottomMm);
  const heightVal = finiteMm(heightMm);
  const kickInvalid =
    bottomVal != null && isHandleKickGuardViolated(bottomVal, HANDLE_PULL_LENGTH_MM);
  const topClearInvalid =
    wf === 'separate' &&
    bottomVal != null &&
    heightVal != null &&
    heightVal - bottomVal < 120;
  const bottomInvalid = kickInvalid || topClearInvalid;
  const bottomErrorText = kickInvalid
    ? t.validation.handleMountKickGuard
    : topClearInvalid
      ? t.validation.handleMountTopClearance
      : null;

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

  const thumbWrap: CSSProperties = {
    width: '100%',
    maxWidth: 220,
    marginBottom: 8,
  };

  return (
    <div
      style={{
        marginTop: 20,
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'minmax(180px, 1fr) minmax(220px, 300px)',
        alignItems: 'start',
      }}
    >
      <div>
        {pic ? (
          <div style={thumbWrap}>
            <p
              style={{
                margin: '0 0 6px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {t.handleReferencePhoto}
            </p>
            <MediaThumb
              picture={pic}
              alt="handle reference"
              style={{ maxWidth: 220, maxHeight: 150, aspectRatio: '4 / 3' }}
            />
          </div>
        ) : null}
        <HandlePositionSchematic
          widthMm={widthMm}
          heightMm={heightMm}
          bottomMm={bottomMm}
          lengthMm={lengthMm}
          fullLength={cncFull}
          separateLengthMm={160}
          workflow={wf}
          labels={{ door: t.handleSchematicDoor, handle: t.handleSchematicHandle }}
        />
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
          min={HANDLE_CENTER_MIN_FROM_BOTTOM_MM}
          value={bottomMm ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === '' ? null : Number(v), lengthMm, cncFull);
          }}
          aria-invalid={bottomInvalid}
          style={{
            ...inputStyle,
            ...(bottomInvalid
              ? {
                  borderColor: '#c62828',
                  outline: '1px solid #ffcdd2',
                  background: '#fff8f8',
                }
              : {}),
          }}
        />
        {bottomErrorText ? (
          <p
            role="alert"
            style={{
              margin: '6px 0 0',
              fontSize: 12,
              color: '#c62828',
              lineHeight: 1.4,
            }}
          >
            {bottomErrorText}
          </p>
        ) : null}

        {wf === 'separate' || wf === 'cnc' ? (
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
            {t.stepHandleLengthFixed160}
          </p>
        ) : null}
      </div>
    </div>
  );
}
