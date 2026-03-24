import { useConfiguratorStore } from '../useConfiguratorStore';
import { msg } from '../translations';

export function CartDrawer() {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const cartOpen = useConfiguratorStore((s) => s.cartOpen);
  const cartItems = useConfiguratorStore((s) => s.cartItems);
  const setCartOpen = useConfiguratorStore((s) => s.setCartOpen);
  const removeFromCart = useConfiguratorStore((s) => s.removeFromCart);
  const updateCartItemQty = useConfiguratorStore((s) => s.updateCartItemQty);
  const clearCart = useConfiguratorStore((s) => s.clearCart);
  const getCartTotal = useConfiguratorStore((s) => s.getCartTotal);

  const t = msg(uiLocale);
  const cartTotals = getCartTotal();
  const currencyLocale = uiLocale === 'zh' ? 'zh-CN' : 'en-US';

  if (!cartOpen) return null;

  const fmt = (n: number | null) =>
    n !== null
      ? `¥${n.toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setCartOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.3)',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Drawer */}
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(440px, 92vw)', zIndex: 200,
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{t.cartTitle}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              {t.cartItemCount(cartTotals.count)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid var(--border-strong)', background: 'var(--surface)',
              fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginTop: 40 }}>
              {t.cartEmpty}
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* SKU */}
                <p
                  style={{
                    margin: 0, fontSize: 13, fontWeight: 700,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: 'var(--accent)', wordBreak: 'break-all',
                  }}
                >
                  {item.generatedSku}
                </p>

                {/* Config summary chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '8px 0' }}>
                  {item.snapshot.frameCode && <Chip>{item.snapshot.frameCode}</Chip>}
                  {item.snapshot.fillerCode && <Chip>{item.snapshot.fillerCode}</Chip>}
                  {item.snapshot.finishExcelCode && <Chip>{item.snapshot.finishExcelCode}</Chip>}
                  {item.snapshot.handleCode && <Chip>{item.snapshot.handleCode}</Chip>}
                  {item.snapshot.hingeColor && <Chip>{item.snapshot.hingeColor}</Chip>}
                  {item.snapshot.widthMm != null && item.snapshot.heightMm != null && (
                    <Chip>{item.snapshot.widthMm}×{item.snapshot.heightMm}mm</Chip>
                  )}
                </div>

                {/* Qty + Price row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        width: 28, height: 28, fontSize: 16, fontWeight: 600,
                        borderRadius: 8, border: '1px solid var(--border-strong)',
                        background: 'var(--surface)', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        opacity: item.quantity <= 1 ? 0.4 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                      style={{
                        width: 28, height: 28, fontSize: 16, fontWeight: 600,
                        borderRadius: 8, border: '1px solid var(--border-strong)',
                        background: 'var(--surface)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {item.quantity > 1 && (
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>
                        {fmt(item.unitTotal)} × {item.quantity}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{fmt(item.lineTotal)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      padding: '4px 10px', fontSize: 12, fontWeight: 600,
                      borderRadius: 8, border: '1px solid #e0e0e0',
                      background: '#fff', color: '#c62828', cursor: 'pointer',
                    }}
                  >
                    {t.cartRemove}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: '16px 24px 20px',
            borderTop: '1px solid var(--border-strong)',
            background: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{t.cartTotal}</span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{fmt(cartTotals.total)}</span>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              style={{
                width: '100%', padding: '10px 0',
                fontSize: 14, fontWeight: 600,
                borderRadius: 10,
                border: '1px solid #e0e0e0',
                background: '#fff', color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {t.cartClearAll}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        fontSize: 11, fontWeight: 600,
        borderRadius: 980,
        background: 'rgba(0,113,227,0.08)',
        color: 'var(--accent)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
