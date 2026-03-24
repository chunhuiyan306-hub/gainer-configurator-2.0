import { useEffect, type ReactNode } from 'react';
import { useConfiguratorStore, type FinishCategory, type FillerType } from './useConfiguratorStore';
import { StepSection } from './components/StepSection';
import { SelectableTile } from './components/SelectableTile';
import { MediaThumb } from './components/MediaThumb';
import { PriceBar } from './components/PriceBar';

const FINISH_LABELS: Record<FinishCategory, string> = {
  anodize: '阳极氧化',
  spraySoftTouch: '亲肤喷涂',
  sprayMetallic: '金属喷涂',
};

const FILLER_LABELS: Record<FillerType, string> = {
  glass: '玻璃',
  leather: '皮革',
  woodVeneer: '木皮',
  quartzStone: '岩板',
};

const DISABLED_TOOLTIP = '与当前门框参数不匹配';

function finishColorId(category: FinishCategory, code: string | null, name: string) {
  return `${category}::${code ?? ''}::${name}`;
}

function parseFinishColorId(id: string): { category: FinishCategory; code: string | null; name: string } {
  const [category, codePart, ...nameParts] = id.split('::');
  const name = nameParts.join('::');
  return {
    category: category as FinishCategory,
    code: codePart === '' ? null : codePart,
    name,
  };
}

function fillerLabel(f: { name: string; code: string }) {
  return `${f.code} · ${f.name}`;
}

export function ConfiguratorPage() {
  const width = useConfiguratorStore((s) => s.width);
  const height = useConfiguratorStore((s) => s.height);
  const selectedFrameCode = useConfiguratorStore((s) => s.selectedFrameCode);
  const selectedFinishCategory = useConfiguratorStore((s) => s.selectedFinishCategory);
  const selectedFinishColorCode = useConfiguratorStore((s) => s.selectedFinishColorCode);
  const selectedFillerType = useConfiguratorStore((s) => s.selectedFillerType);
  const selectedFillerCode = useConfiguratorStore((s) => s.selectedFillerCode);
  const lockedFillerThickness = useConfiguratorStore((s) => s.lockedFillerThickness);
  const baseMaterial = useConfiguratorStore((s) => s.baseMaterial);
  const selectedHandleCode = useConfiguratorStore((s) => s.selectedHandleCode);
  const selectedHingeColor = useConfiguratorStore((s) => s.selectedHingeColor);

  const setDimensions = useConfiguratorStore((s) => s.setDimensions);
  const selectFrame = useConfiguratorStore((s) => s.selectFrame);
  const selectFinishCategory = useConfiguratorStore((s) => s.selectFinishCategory);
  const selectFinishColor = useConfiguratorStore((s) => s.selectFinishColor);
  const selectFillerType = useConfiguratorStore((s) => s.selectFillerType);
  const selectFiller = useConfiguratorStore((s) => s.selectFiller);
  const selectHandle = useConfiguratorStore((s) => s.selectHandle);
  const selectHingeColor = useConfiguratorStore((s) => s.selectHingeColor);

  const getFrameOptions = useConfiguratorStore((s) => s.getFrameOptions);
  const getFinishCategoryOptions = useConfiguratorStore((s) => s.getFinishCategoryOptions);
  const getFinishColorOptions = useConfiguratorStore((s) => s.getFinishColorOptions);
  const getFillerTypeOptions = useConfiguratorStore((s) => s.getFillerTypeOptions);
  const getFillerOptions = useConfiguratorStore((s) => s.getFillerOptions);
  const getHandleOptions = useConfiguratorStore((s) => s.getHandleOptions);
  const getHingeCalculation = useConfiguratorStore((s) => s.getHingeCalculation);
  const getSelectedFrame = useConfiguratorStore((s) => s.getSelectedFrame);

  const frameOptions = getFrameOptions();
  const finishCategories = getFinishCategoryOptions();
  const finishColors = getFinishColorOptions();
  const fillerTypes = getFillerTypeOptions();
  const fillerOptions = getFillerOptions();
  const handleOptions = getHandleOptions();
  const hingeCalc = getHingeCalculation();
  const frame = getSelectedFrame();

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
    gap: 14,
  } as const;

  return (
    <>
      <main
        style={{
          maxWidth: 980,
          margin: '0 auto',
          padding: '48px 24px calc(48px + var(--bar-height))',
        }}
      >
        <header style={{ marginBottom: 56 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Gainer 铝框门
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: 19, color: 'var(--text-secondary)' }}>
            按步骤配置您的门板。选项已与门框参数联动。
          </p>
        </header>

        {/* Step 1 — Dimensions */}
        <StepSection
          step={1}
          title="门板尺寸"
          subtitle="请先输入宽度 W 与高度 H（毫米）。后续门框与填充物将按此尺寸校验。"
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'flex-end',
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>宽度 W (mm)</span>
              <input
                type="number"
                min={1}
                placeholder="例如 600"
                value={width === null ? '' : width}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    setDimensions(null, height);
                    return;
                  }
                  const n = Number(v);
                  if (!Number.isFinite(n)) return;
                  setDimensions(n, height);
                }}
                style={{
                  padding: '12px 14px',
                  fontSize: 17,
                  borderRadius: 12,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  outline: 'none',
                }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>高度 H (mm)</span>
              <input
                type="number"
                min={1}
                placeholder="例如 2200"
                value={height === null ? '' : height}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    setDimensions(width, null);
                    return;
                  }
                  const n = Number(v);
                  if (!Number.isFinite(n)) return;
                  setDimensions(width, n);
                }}
                style={{
                  padding: '12px 14px',
                  fontSize: 17,
                  borderRadius: 12,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  outline: 'none',
                }}
              />
            </label>
          </div>
        </StepSection>

        {/* Step 2 — Frame */}
        <StepSection
          step={2}
          title="门框型材"
          subtitle="不符合当前 W×H 的门框已置灰，且不可选择。"
        >
          <div style={gridStyle}>
            {frameOptions.map(({ frame: f, disabled }) => {
              const selected = selectedFrameCode === f.code;
              return (
                <SelectableTile
                  key={f.code}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => selectFrame(f.code)}
                >
                  <MediaThumb picture={f.picture} alt={f.code} disabled={disabled} />
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{f.code}</div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {f.doorType}
                    </div>
                  </div>
                </SelectableTile>
              );
            })}
          </div>
        </StepSection>

        {/* Step 3 — Surface */}
        <StepSection
          step={3}
          title="表面处理"
          subtitle="先选工艺大类，再选具体颜色。与门框不兼容的类别与色样已置灰。"
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
            工艺大类
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {finishCategories.map(({ category, label, disabled }) => {
              const selected = selectedFinishCategory === category;
              return (
                <PillButton
                  key={category}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => selectFinishCategory(category)}
                >
                  {FINISH_LABELS[category] ?? label}
                </PillButton>
              );
            })}
          </div>

          {selectedFinishCategory ? (
            <>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
                颜色
              </p>
              <div style={gridStyle}>
                {finishColors.map(({ color, disabled }) => {
                  const id = finishColorId(
                    selectedFinishCategory,
                    color.code,
                    color.name,
                  );
                  const selected = selectedFinishColorCode === id;
                  return (
                    <SelectableTile
                      key={id}
                      selected={selected}
                      disabled={disabled}
                      onClick={() => selectFinishColor(id)}
                    >
                      <MediaThumb picture={color.picture} alt={color.name} disabled={disabled} />
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                          {color.name.replace(/\n/g, ' ')}
                        </div>
                        {color.code ? (
                          <div
                            style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}
                          >
                            {color.code}
                          </div>
                        ) : null}
                      </div>
                    </SelectableTile>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>请先选择工艺大类。</p>
          )}
        </StepSection>

        {/* Step 4 — Filler */}
        <StepSection
          step={4}
          title="填充物"
          subtitle="材质需与门型匹配；玻璃厚度由门框锁定，不兼容的玻璃已置灰。"
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
            材质大类
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {fillerTypes.map(({ type, disabled }) => {
              const selected = selectedFillerType === type;
              return (
                <PillButton
                  key={type}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => selectFillerType(type)}
                >
                  {FILLER_LABELS[type]}
                </PillButton>
              );
            })}
          </div>

          {selectedFillerType ? (
            <>
              <div style={gridStyle}>
                {fillerOptions.map(({ filler, disabled, lockedThickness }) => {
                  const selected = selectedFillerCode === filler.code;
                  return (
                    <SelectableTile
                      key={filler.code}
                      selected={selected}
                      disabled={disabled}
                      onClick={() => selectFiller(filler.code)}
                    >
                      <MediaThumb picture={filler.picture} alt={filler.code} disabled={disabled} />
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {fillerLabel(filler)}
                        </div>
                        {!disabled && lockedThickness !== null ? (
                          <div
                            style={{ marginTop: 6, fontSize: 11, color: 'var(--accent)' }}
                          >
                            厚度锁定 {lockedThickness} mm
                          </div>
                        ) : null}
                      </div>
                    </SelectableTile>
                  );
                })}
              </div>
              {baseMaterial ? (
                <p
                  style={{
                    marginTop: 16,
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}
                >
                  基材（皮革）：<strong style={{ color: 'var(--text)' }}>{baseMaterial}</strong>
                </p>
              ) : null}
              {lockedFillerThickness !== null ? (
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  当前锁定厚度：<strong style={{ color: 'var(--text)' }}>{lockedFillerThickness} mm</strong>
                </p>
              ) : null}
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>请先选择材质大类。</p>
          )}
        </StepSection>

        {/* Step 5 — Handle */}
        <StepSection
          step={5}
          title="拉手"
          subtitle={
            frame?.matchedHandle
              ? `当前门框指定拉手规格：${frame.matchedHandle}`
              : '当前门框无需选择拉手。'
          }
        >
          {frame?.matchedHandle ? (
            <div style={gridStyle}>
              {handleOptions.map(({ handle: h, disabled }) => {
                const selected = selectedHandleCode === h.code;
                return (
                  <SelectableTile
                    key={h.code}
                    selected={selected}
                    disabled={disabled}
                    onClick={() => selectHandle(h.code)}
                  >
                    <MediaThumb picture={h.picture} alt={h.code} disabled={disabled} />
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{h.code}</div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.35,
                        }}
                      >
                        {h.name}
                      </div>
                    </div>
                  </SelectableTile>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>此步骤可跳过。</p>
          )}
        </StepSection>

        {/* Step 6 — Hinge */}
        <StepSection
          step={6}
          title="铰链"
          subtitle={
            hingeCalc.pivotWarning
              ? '请按提示选用天地轴（Pivot）方案。'
              : frame?.matchedHardware
                ? `五金：${frame.matchedHardware}`
                : '当前门框未指定铰链条目时可跳过颜色。'
          }
        >
          {hingeCalc.pivotWarning ? (
            <p
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255, 149, 0, 0.12)',
                fontSize: 15,
                margin: '0 0 16px',
              }}
            >
              {hingeCalc.pivotWarning}
            </p>
          ) : null}

          {frame?.matchedHardware && hingeCalc.availableColors.length > 0 ? (
            <>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
                铰链颜色
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {hingeCalc.availableColors.map((c) => {
                  const key = c.toLowerCase();
                  const selected = selectedHingeColor?.toLowerCase() === key;
                  return (
                    <PillButton
                      key={c}
                      selected={selected}
                      disabled={false}
                      onClick={() => selectHingeColor(c)}
                    >
                      {c}
                    </PillButton>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              {frame?.matchedHardware ? '' : '无需选择铰链颜色。'}
            </p>
          )}
        </StepSection>
      </main>

      <PriceBar />

      {/* Keep finish color id in sync when category changes — store clears color on category change; ensure id format matches */}
      <FinishColorSync />
    </>
  );
}

/** Clears finish color if stored id does not match current category (defensive). */
function FinishColorSync() {
  const selectedFinishCategory = useConfiguratorStore((s) => s.selectedFinishCategory);
  const selectedFinishColorCode = useConfiguratorStore((s) => s.selectedFinishColorCode);
  const selectFinishColor = useConfiguratorStore((s) => s.selectFinishColor);

  useEffect(() => {
    if (!selectedFinishCategory || !selectedFinishColorCode) return;
    try {
      const parsed = parseFinishColorId(selectedFinishColorCode);
      if (parsed.category !== selectedFinishCategory) {
        selectFinishColor(null);
      }
    } catch {
      selectFinishColor(null);
    }
  }, [selectedFinishCategory, selectedFinishColorCode, selectFinishColor]);

  return null;
}

function PillButton({
  children,
  selected,
  disabled,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={selected}
      title={disabled ? DISABLED_TOOLTIP : undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 18px',
        fontSize: 15,
        fontWeight: 500,
        borderRadius: 980,
        border: selected ? '2px solid var(--accent)' : '1px solid var(--border-strong)',
        background: selected ? 'rgba(0, 113, 227, 0.08)' : 'var(--surface)',
        color: disabled ? 'var(--text-secondary)' : 'var(--text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}
