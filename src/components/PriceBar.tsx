import { useState } from 'react';
import { useConfiguratorStore, type FinishCategory } from '../useConfiguratorStore';
import { msg } from '../translations';

function fmtFinish(locale: 'zh' | 'en', cat: FinishCategory | null): string {
  if (!cat) return '';
  return msg(locale).finish[cat];
}

export function PriceBar() {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const quantity = useConfiguratorStore((s) => s.quantity);
  const getQuotationSnapshot = useConfiguratorStore((s) => s.getQuotationSnapshot);
  const getValidationErrors = useConfiguratorStore((s) => s.getValidationErrors);
  const getCartTotal = useConfiguratorStore((s) => s.getCartTotal);
  const addToCart = useConfiguratorStore((s) => s.addToCart);
  const setCartOpen = useConfiguratorStore((s) => s.setCartOpen);
  const cartOpen = useConfiguratorStore((s) => s.cartOpen);

  const t = msg(uiLocale);
  const snap = getQuotationSnapshot();
  const cartInfo = getCartTotal();

  const [toast, setToast] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);

  const currencyLocale = uiLocale === 'zh' ? 'zh-CN' : 'en-US';

  const unitDisplay =
    snap.total !== null
      ? `¥${snap.total.toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  const lineDisplay =
    snap.total !== null
      ? `¥${(snap.total * quantity).toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  const chips: string[] = [];
  if (snap.frameCode) chips.push(snap.frameCode);
  if (snap.fillerCode) chips.push(snap.fillerCode);
  if (snap.finishCategory) {
    const label = fmtFinish(uiLocale, snap.finishCategory);
    chips.push(snap.finishExcelCode ? `${label}·${snap.finishExcelCode}` : label);
  }
  if (snap.handleCode) chips.push(snap.handleCode);
  if (snap.hingeColor) chips.push(`${t.stepHingeTitle}·${snap.hingeColor}`);
  if (quantity > 1) chips.push(`×${quantity}`);

  const handleAdd = () => {
    const errs = getValidationErrors();
    if (errs.length > 0) {
      setErrorHint(t.confirmBlocked);
      setTimeout(() => setErrorHint(null), 3000);
      return;
    }
    const ok = addToCart();
    if (ok) {
      setErrorHint(null);
      setToast(t.addToCartSuccess);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        padding: '0 max(16px, calc((100vw - 1040px) / 2))',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: '1px solid var(--border-strong)',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Summary chips row */}
      {chips.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            padding: '10px 0 0',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', lineHeight: '24px', marginRight: 4 }}>
            {t.configChips}
          </span>
          {chips.map((c) => (
            <span
              key={c}
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 980,
                background: 'rgba(0,113,227,0.08)',
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Main action row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 0 12px',
          flexWrap: 'wrap',
        }}
      >
        {/* SKU */}
        <div style={{ minWidth: 0, flex: '1 1 200px' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            SKU
          </p>
          <p
            style={{
              margin: '2px 0 0', fontSize: 13, fontWeight: 600,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              wordBreak: 'break-all',
              color: snap.fullConfigSku ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {snap.generatedSku}
          </p>
        </div>

        {/* Price (unit × qty) */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {quantity > 1 && (
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
              {unitDisplay} × {quantity}
            </p>
          )}
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {lineDisplay}
          </p>
        </div>

        {/* Add to Cart + Cart badge */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleAdd}
            style={{
              padding: '10px 20px',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 12,
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t.addToCart}
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(!cartOpen)}
            style={{
              position: 'relative',
              width: 44, height: 44,
              borderRadius: 12,
              border: '1px solid var(--border-strong)',
              background: cartOpen ? 'rgba(0,113,227,0.08)' : 'var(--surface)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}
            title={t.cartTitle}
          >
            🛒
            {cartInfo.count > 0 && (
              <span
                style={{
                  position: 'absolute', top: -6, right: -6,
                  minWidth: 20, height: 20, borderRadius: 10,
                  background: '#e53935', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 5px',
                }}
              >
                {cartInfo.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'absolute', top: -48, left: '50%', transform: 'translateX(-50%)',
            padding: '10px 20px', borderRadius: 12,
            background: '#1b5e20', color: '#fff',
            fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {toast}
        </div>
      )}
      {errorHint && (
        <div
          style={{
            position: 'absolute', top: -48, left: '50%', transform: 'translateX(-50%)',
            padding: '10px 20px', borderRadius: 12,
            background: '#c62828', color: '#fff',
            fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {errorHint}
        </div>
      )}
    </footer>
  );
}
