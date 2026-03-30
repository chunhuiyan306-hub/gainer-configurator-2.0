import { useMemo } from 'react';
import { useConfiguratorStore } from '../useConfiguratorStore';
import { HingeHandleSchematic } from './HingeHandleSchematic';

type CatalogMsg = ReturnType<typeof import('../translations').msg>;

export function HingeLayoutPanel({ t }: { t: CatalogMsg }) {
  const frame = useConfiguratorStore((s) => s.getSelectedFrame());
  const width = useConfiguratorStore((s) => s.width);
  const height = useConfiguratorStore((s) => s.height);
  const handleBottomMm = useConfiguratorStore((s) => s.handleBottomMm);
  const handleLengthMm = useConfiguratorStore((s) => s.handleLengthMm);
  const handleCncFullLength = useConfiguratorStore((s) => s.handleCncFullLength);
  const pinThirdHingeEnabled = useConfiguratorStore((s) => s.pinThirdHingeEnabled);
  const hingePositionsFromBottomMm = useConfiguratorStore((s) => s.hingePositionsFromBottomMm);
  const selectedHingeHardwareCode = useConfiguratorStore((s) => s.selectedHingeHardwareCode);
  const selectedFrameCode = useConfiguratorStore((s) => s.selectedFrameCode);
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const setHingePositionIndex = useConfiguratorStore((s) => s.setHingePositionIndex);
  const setPinThirdHinge = useConfiguratorStore((s) => s.setPinThirdHinge);

  const hingeCalc = useMemo(
    () => useConfiguratorStore.getState().getHingeCalculation(),
    [
      hingePositionsFromBottomMm,
      pinThirdHingeEnabled,
      height,
      selectedFrameCode,
      selectedHingeHardwareCode,
      uiLocale,
    ],
  );

  if (!frame || hingeCalc.usePivot || hingeCalc.positionsFromBottomMm.length === 0) {
    return null;
  }

  const { positionsFromBottomMm, positionsEditable, pinThirdHingeAvailable, hingeRuleset } =
    hingeCalc;

  return (
    <div
      style={{
        marginTop: 24,
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'minmax(200px, 1fr) minmax(220px, 320px)',
        alignItems: 'start',
      }}
    >
      <div>
        <HingeHandleSchematic
          widthMm={width}
          heightMm={height}
          hingePositionsFromBottomMm={positionsFromBottomMm}
          handleWorkflow={frame.handleWorkflow}
          handleBottomMm={handleBottomMm}
          handleLengthMm={handleLengthMm}
          handleFullLength={handleCncFullLength}
          separateLengthMm={160}
          labels={{
            title: t.hingeSchematicTitle,
            handleAria: t.handleSchematicHandle,
            segmentD: t.hingeSegmentD,
          }}
        />
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
          }}
        >
          {hingeRuleset === 'air' ? t.hingeFixedAirNote : t.hingeFloatHint}
        </p>
      </div>
      <div style={{ padding: '4px 0' }}>
        {pinThirdHingeAvailable ? (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={pinThirdHingeEnabled}
              onChange={(e) => setPinThirdHinge(e.target.checked)}
            />
            {t.hingePinOptionalThird}
          </label>
        ) : null}

        {positionsEditable ? (
          <>
            <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>{t.hingeQtyLabel}</p>
            {positionsFromBottomMm.map((mm, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    marginBottom: 4,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t.hingeHoleFromBottom(i)}
                </label>
                <input
                  type="number"
                  value={Math.round(mm)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setHingePositionIndex(i, v === '' ? mm : Number(v));
                  }}
                  style={{
                    width: '100%',
                    maxWidth: 160,
                    padding: '8px 10px',
                    fontSize: 15,
                    borderRadius: 10,
                    border: '1px solid var(--border-strong)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />
              </div>
            ))}
          </>
        ) : hingeRuleset === 'air' ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {t.hingeFixedAirNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
