import { useConfiguratorStore } from '../useConfiguratorStore';
import { msg } from '../translations';

export function PriceBar() {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const getQuotationSnapshot = useConfiguratorStore((s) => s.getQuotationSnapshot);

  const t = msg(uiLocale);
  const snap = getQuotationSnapshot();

  const currencyLocale = uiLocale === 'zh' ? 'zh-CN' : 'en-US';

  const totalDisplay =
    snap.total !== null
      ? `¥${snap.total.toLocaleString(currencyLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '—';

  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        height: 'var(--bar-height)',
        padding: '0 max(24px, calc((100vw - 980px) / 2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: '1px solid var(--border-strong)',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {t.skuLabel}
        </p>
        <p
          style={{
            margin: '3px 0 0',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            wordBreak: 'break-all',
            color: snap.fullConfigSku ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          {snap.fullConfigSku ?? snap.generatedSku}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {t.totalLabel}
        </p>
        <p
          style={{
            margin: '3px 0 0',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {totalDisplay}
        </p>
      </div>
    </footer>
  );
}
