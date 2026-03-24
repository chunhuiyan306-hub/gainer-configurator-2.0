import { useShallow } from 'zustand/shallow';
import { useConfiguratorStore } from '../useConfiguratorStore';

export function PriceBar() {
  const { width, height, frame, filler, base } = useConfiguratorStore(
    useShallow((s) => ({
      width: s.width,
      height: s.height,
      frame: s.selectedFrameCode,
      filler: s.selectedFillerCode,
      base: s.baseMaterial,
    })),
  );

  const getPriceBreakdown = useConfiguratorStore((s) => s.getPriceBreakdown);
  const getHingeCalculation = useConfiguratorStore((s) => s.getHingeCalculation);

  const price = getPriceBreakdown();
  const hinge = getHingeCalculation();

  const areaText =
    width != null && height != null && width > 0 && height > 0
      ? `${((width / 1000) * (height / 1000)).toFixed(2)} m²`
      : null;

  const totalDisplay =
    price.total !== null
      ? `¥${price.total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  let hingeLabel: string;
  if (hinge.usePivot) {
    hingeLabel = '天地轴（Pivot）';
  } else if (hinge.qty > 0) {
    hingeLabel = `${hinge.qty} 只`;
  } else {
    hingeLabel = '—';
  }

  const selectionHint = [frame, filler].filter(Boolean).join(' · ') || null;

  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        minHeight: 'var(--bar-height)',
        padding: '12px max(24px, calc((100vw - 980px) / 2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -1px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          铰链数量
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 600 }}>{hingeLabel}</p>
        {areaText ? (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            展开面积 {areaText}
            {base ? ` · ${base}` : ''}
          </p>
        ) : base ? (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{base}</p>
        ) : null}
      </div>
      <div style={{ textAlign: 'right', minWidth: 0, flex: '0 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          合计
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {totalDisplay}
        </p>
        {selectionHint ? (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 11,
              color: 'var(--text-secondary)',
              maxWidth: 320,
              marginLeft: 'auto',
            }}
          >
            {selectionHint}
          </p>
        ) : null}
        {price.hasCustomItems ? (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 11,
              color: 'var(--text-secondary)',
              maxWidth: 280,
              marginLeft: 'auto',
            }}
          >
            价格计算中包含定制项，需联系客服
          </p>
        ) : null}
      </div>
    </footer>
  );
}
