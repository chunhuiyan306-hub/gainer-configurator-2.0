import { useConfiguratorStore, type FinishCategory } from '../useConfiguratorStore';
import { msg } from '../translations';

function fmtFinishCategory(locale: 'zh' | 'en', cat: string | null): string {
  if (!cat) return '—';
  const L = msg(locale).finish;
  if (cat === 'anodize') return L.anodize;
  if (cat === 'spraySoftTouch') return L.spraySoftTouch;
  if (cat === 'sprayMetallic') return L.sprayMetallic;
  return cat;
}

export function QuotationSheet() {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const configurationConfirmed = useConfiguratorStore((s) => s.configurationConfirmed);
  const getQuotationSnapshot = useConfiguratorStore((s) => s.getQuotationSnapshot);

  const t = msg(uiLocale);
  const q = t.q;
  const snap = getQuotationSnapshot();

  const currencyLocale = uiLocale === 'zh' ? 'zh-CN' : 'en-US';

  const totalDisplay =
    snap.total !== null
      ? `¥${snap.total.toLocaleString(currencyLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '—';

  const finishSpec =
    snap.finishExcelCode && snap.finishName
      ? `${snap.finishExcelCode} · ${snap.finishName.replace(/\n/g, ' ')}`
      : snap.finishName?.replace(/\n/g, ' ') ?? '—';

  const tdLabel: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 14,
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'top',
    width: '35%',
  };
  const tdVal: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 500,
    borderBottom: '1px solid var(--border)',
    wordBreak: 'break-word',
  };

  const row = (label: string, value: string) => (
    <tr key={label}>
      <td style={tdLabel}>{label}</td>
      <td style={tdVal}>{value}</td>
    </tr>
  );

  return (
    <section
      style={{
        marginTop: 56,
        marginBottom: 32,
        padding: '32px 28px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border-strong)',
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          {t.quotationTitle}
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-secondary)' }}>
          {t.quotationSubtitle}
        </p>
        {configurationConfirmed ? (
          <p
            style={{
              margin: '12px 0 0',
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 980,
              background: 'rgba(0, 113, 227, 0.1)',
              color: 'var(--accent)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {t.configurationConfirmed}
          </p>
        ) : null}
      </header>

      {/* SKU Box */}
      <div
        style={{
          padding: '18px 20px',
          borderRadius: 14,
          background: 'rgba(0, 113, 227, 0.05)',
          border: '1px solid rgba(0, 113, 227, 0.18)',
          marginBottom: 24,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {t.generatedSkuLabel}
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            wordBreak: 'break-all',
            letterSpacing: '0.02em',
          }}
        >
          {snap.generatedSku}
        </p>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(0,113,227,0.2)' }}>
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
            {t.fullSkuLabel}
          </p>
          {snap.fullConfigSku ? (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                wordBreak: 'break-all',
                color: 'var(--accent)',
              }}
            >
              {snap.fullConfigSku}
            </p>
          ) : (
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              {t.skuIncomplete}
            </p>
          )}
        </div>
      </div>

      {/* Configuration Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                borderBottom: '2px solid var(--border-strong)',
                width: '35%',
              }}
            >
              {t.tblItem}
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                borderBottom: '2px solid var(--border-strong)',
              }}
            >
              {t.tblSpec}
            </th>
          </tr>
        </thead>
        <tbody>
          {row(q.width, snap.widthMm != null ? `${snap.widthMm} mm` : '—')}
          {row(q.height, snap.heightMm != null ? `${snap.heightMm} mm` : '—')}
          {row(q.area, snap.areaM2 != null ? `${snap.areaM2.toFixed(2)} m²` : '—')}
          {row(
            q.frame,
            snap.frameCode
              ? `${snap.frameCode}${snap.frameDoorType ? ` · ${snap.frameDoorType}` : ''}`
              : '—',
          )}
          {row(q.finish, `${fmtFinishCategory(uiLocale, snap.finishCategory)} · ${finishSpec}`)}
          {row(
            q.filler,
            snap.fillerCode
              ? `${snap.fillerCode}${snap.fillerName ? ` · ${snap.fillerName}` : ''}`
              : '—',
          )}
          {row(
            q.handle,
            snap.handleCode
              ? `${snap.handleCode}${snap.handleName ? ` · ${snap.handleName}` : ''}`
              : '—',
          )}
          {row(
            q.handleColor,
            snap.handleColor
              ? snap.handleColor.charAt(0).toUpperCase() + snap.handleColor.slice(1)
              : '—',
          )}
          {row(
            q.hinge,
            snap.hingeHardwareName
              ? `${snap.hingeHardwareName}${snap.hingeHardwareCode ? ` (${snap.hingeHardwareCode})` : ''}`
              : '—',
          )}
          {row(q.hingeQty, snap.hingeQtyLabel)}
          {row(q.hingeColor, snap.hingeColor ?? '—')}
        </tbody>
      </table>

      {/* Price Lines */}
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {t.tblLinePrice}
        </p>
        {snap.priceLines.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t.completeForPricing}</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
            {snap.priceLines.map((line, i) => (
              <li key={`${line.label}-${i}`}>
                <span>{line.label}</span>
                {line.amount != null ? (
                  <strong style={{ marginLeft: 8 }}>
                    ¥{line.amount.toLocaleString(currencyLocale, { minimumFractionDigits: 2 })}
                  </strong>
                ) : line.status === 'tba' ? (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 12,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(255,149,0,0.12)',
                      color: '#b36b00',
                    }}
                  >
                    TBA
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Total */}
      <div
        style={{
          paddingTop: 20,
          borderTop: '2px solid var(--border-strong)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', maxWidth: 480 }}>
          {snap.summary}
        </p>
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
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
              margin: '6px 0 0',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            {totalDisplay}
          </p>
          {snap.hasCustomItems ? (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
              {t.customPricingNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
