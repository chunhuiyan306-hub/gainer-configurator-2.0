import { useConfiguratorStore } from '../useConfiguratorStore';
import { msg } from '../translations';

function fmtFinishCategory(
  locale: 'zh' | 'en',
  cat: string | null,
): string {
  if (!cat) return '—';
  const L = msg(locale).finish;
  if (cat === 'anodize') return L.anodize;
  if (cat === 'spraySoftTouch') return L.spraySoftTouch;
  if (cat === 'sprayMetallic') return L.sprayMetallic;
  return cat;
}

export function PriceBar() {
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const configurationConfirmed = useConfiguratorStore((s) => s.configurationConfirmed);

  const getQuotationSnapshot = useConfiguratorStore((s) => s.getQuotationSnapshot);
  const getHingeCalculation = useConfiguratorStore((s) => s.getHingeCalculation);

  const t = msg(uiLocale);
  const q = t.q;
  const snap = getQuotationSnapshot();
  const hinge = getHingeCalculation();

  const currencyLocale = uiLocale === 'zh' ? 'zh-CN' : 'en-US';

  const totalDisplay =
    snap.total !== null
      ? `¥${snap.total.toLocaleString(currencyLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '—';

  const row = (label: string, value: string) => (
    <tr>
      <td
        style={{
          padding: '10px 12px',
          fontSize: 14,
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border)',
          verticalAlign: 'top',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '10px 12px',
          fontSize: 14,
          fontWeight: 500,
          borderBottom: '1px solid var(--border)',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </td>
    </tr>
  );

  const finishSpec =
    snap.finishExcelCode && snap.finishName
      ? `${snap.finishExcelCode} · ${snap.finishName.replace(/\n/g, ' ')}`
      : snap.finishName?.replace(/\n/g, ' ') ?? '—';

  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        maxHeight: 'var(--bar-height)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: '1px solid var(--border-strong)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          overflowY: 'auto',
          padding: '14px max(24px, calc((100vw - 980px) / 2)) 16px',
          maxWidth: 980,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            {t.quotationTitle}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            {t.quotationSubtitle}
          </p>
          {configurationConfirmed ? (
            <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              {t.configurationConfirmed}
            </p>
          ) : null}
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(0, 113, 227, 0.06)',
            border: '1px solid rgba(0, 113, 227, 0.2)',
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {t.generatedSkuLabel}
          </p>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              wordBreak: 'break-all',
            }}
          >
            {snap.generatedSku}
          </p>
          {snap.fullConfigSku ? (
            <>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}
              >
                {t.fullSkuLabel}
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  wordBreak: 'break-all',
                  color: 'var(--text-secondary)',
                }}
              >
                {snap.fullConfigSku}
              </p>
            </>
          ) : (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
              {t.skuIncomplete}
            </p>
          )}
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 12,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-strong)',
                  width: '34%',
                }}
              >
                {t.tblItem}
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-strong)',
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
            {row(
              q.finish,
              `${fmtFinishCategory(uiLocale, snap.finishCategory)} · ${finishSpec}`,
            )}
            {row(
              q.filler,
              snap.fillerCode ? `${snap.fillerCode}${snap.fillerName ? ` · ${snap.fillerName}` : ''}` : '—',
            )}
            {row(
              q.handle,
              snap.handleCode ? `${snap.handleCode}${snap.handleName ? ` · ${snap.handleName}` : ''}` : '—',
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
            {row(
              q.hingeColor,
              snap.hingeColor ? snap.hingeColor : hinge.availableColors.length ? '—' : '—',
            )}
          </tbody>
        </table>

        <p
          style={{
            margin: '0 0 6px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {t.tblLinePrice}
        </p>
        <ul style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
          {snap.priceLines.length === 0 ? (
            <li>{t.completeForPricing}</li>
          ) : (
            snap.priceLines.map((line, i) => (
              <li key={`${line.label}-${i}`} style={{ marginBottom: 4 }}>
                {line.label}
                {line.amount != null
                  ? ` — ¥${line.amount.toLocaleString(currencyLocale, { minimumFractionDigits: 2 })}`
                  : line.status === 'tba'
                    ? ' (TBA)'
                    : ''}
              </li>
            ))
          )}
        </ul>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 8,
            borderTop: '1px solid var(--border-strong)',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{snap.summary}</p>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}
            >
              {t.totalLabel}
            </p>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              {totalDisplay}
            </p>
            {snap.hasCustomItems ? (
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>
                {t.customPricingNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
