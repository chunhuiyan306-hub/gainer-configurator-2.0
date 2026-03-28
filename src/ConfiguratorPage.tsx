import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useConfiguratorStore, type FinishCategory, type FrameOption } from './useConfiguratorStore';
import { StepSection } from './components/StepSection';
import { SelectableTile } from './components/SelectableTile';
import { MediaThumb } from './components/MediaThumb';
import { PriceBar } from './components/PriceBar';
import { QuotationSheet } from './components/QuotationSheet';
import { CartDrawer } from './components/CartDrawer';
import { msg, type UiLocale } from './translations';

type UiMessages = ReturnType<typeof msg>;

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
  const uiLocale = useConfiguratorStore((s) => s.uiLocale);
  const setUiLocale = useConfiguratorStore((s) => s.setUiLocale);
  const t = msg(uiLocale);

  const width = useConfiguratorStore((s) => s.width);
  const height = useConfiguratorStore((s) => s.height);
  const quantity = useConfiguratorStore((s) => s.quantity);
  const selectedFrameCode = useConfiguratorStore((s) => s.selectedFrameCode);
  const selectedFinishCategory = useConfiguratorStore((s) => s.selectedFinishCategory);
  const selectedFinishColorCode = useConfiguratorStore((s) => s.selectedFinishColorCode);
  const selectedFillerType = useConfiguratorStore((s) => s.selectedFillerType);
  const selectedFillerCode = useConfiguratorStore((s) => s.selectedFillerCode);
  const lockedFillerThickness = useConfiguratorStore((s) => s.lockedFillerThickness);
  const baseMaterial = useConfiguratorStore((s) => s.baseMaterial);
  const selectedHandleCode = useConfiguratorStore((s) => s.selectedHandleCode);
  const selectedHandleColor = useConfiguratorStore((s) => s.selectedHandleColor);
  const selectedHingeColor = useConfiguratorStore((s) => s.selectedHingeColor);
  const selectedHingeHardwareCode = useConfiguratorStore((s) => s.selectedHingeHardwareCode);
  const configurationConfirmed = useConfiguratorStore((s) => s.configurationConfirmed);

  const setDimensions = useConfiguratorStore((s) => s.setDimensions);
  const setQuantity = useConfiguratorStore((s) => s.setQuantity);
  const selectFrame = useConfiguratorStore((s) => s.selectFrame);
  const selectFinishCategory = useConfiguratorStore((s) => s.selectFinishCategory);
  const selectFinishColor = useConfiguratorStore((s) => s.selectFinishColor);
  const selectFillerType = useConfiguratorStore((s) => s.selectFillerType);
  const selectFiller = useConfiguratorStore((s) => s.selectFiller);
  const selectHandle = useConfiguratorStore((s) => s.selectHandle);
  const selectHandleColor = useConfiguratorStore((s) => s.selectHandleColor);
  const selectHingeColor = useConfiguratorStore((s) => s.selectHingeColor);
  const selectHingeHardware = useConfiguratorStore((s) => s.selectHingeHardware);
  const resetConfiguration = useConfiguratorStore((s) => s.resetConfiguration);
  const confirmConfiguration = useConfiguratorStore((s) => s.confirmConfiguration);

  const getFrameOptions = useConfiguratorStore((s) => s.getFrameOptions);
  const getFinishCategoryOptions = useConfiguratorStore((s) => s.getFinishCategoryOptions);
  const getFinishColorOptions = useConfiguratorStore((s) => s.getFinishColorOptions);
  const getFillerTypeOptions = useConfiguratorStore((s) => s.getFillerTypeOptions);
  const getFillerOptions = useConfiguratorStore((s) => s.getFillerOptions);
  const getHandleOptions = useConfiguratorStore((s) => s.getHandleOptions);
  const getHingeCalculation = useConfiguratorStore((s) => s.getHingeCalculation);
  const getSelectedFrame = useConfiguratorStore((s) => s.getSelectedFrame);
  const getHandleColorOptions = useConfiguratorStore((s) => s.getHandleColorOptions);
  const getValidationErrors = useConfiguratorStore((s) => s.getValidationErrors);

  const [confirmHint, setConfirmHint] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{ src: string; title: string } | null>(null);

  const frameOptions = getFrameOptions();
  const finishCategories = getFinishCategoryOptions();
  const finishColors = getFinishColorOptions();
  const fillerTypes = getFillerTypeOptions();
  const fillerOptions = getFillerOptions();
  const handleOptions = getHandleOptions();
  const handleColorOptions = getHandleColorOptions();
  const hingeCalc = getHingeCalculation();
  const frame = getSelectedFrame();

  const cabinetFrameOpts = frameOptions.filter((o) => o.frame.frameCategory === 'cabinet');
  const roomFrameOpts = frameOptions.filter((o) => o.frame.frameCategory === 'room');

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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ minWidth: 0, flex: '1 1 280px' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 40,
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                {t.appTitle}
              </h1>
              <p style={{ margin: '12px 0 0', fontSize: 19, color: 'var(--text-secondary)' }}>
                {t.appSubtitle}
              </p>
            </div>
            <LanguageToggle locale={uiLocale} onChange={setUiLocale} labels={{ zh: t.langZh, en: t.langEn }} />
          </div>
        </header>

        {/* Step 1 — Dimensions */}
        <StepSection
          step={1}
          stepPrefix={t.stepPrefix}
          title={t.stepDimensionsTitle}
          subtitle={t.stepDimensionsSubtitle}
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
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.widthLabel}</span>
              <input
                type="number"
                min={1}
                placeholder={t.widthPlaceholder}
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
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.heightLabel}</span>
              <input
                type="number"
                min={1}
                placeholder={t.heightPlaceholder}
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
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 100 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.qtyLabel}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{
                    width: 40, height: 44, fontSize: 20, fontWeight: 600,
                    borderRadius: 10, border: '1px solid var(--border-strong)',
                    background: 'var(--surface)', cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    opacity: quantity <= 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isFinite(n) && n >= 1) setQuantity(n);
                  }}
                  style={{
                    width: 64, padding: '12px 8px', fontSize: 17, textAlign: 'center',
                    borderRadius: 12, border: '1px solid var(--border-strong)',
                    background: 'var(--surface)', outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40, height: 44, fontSize: 20, fontWeight: 600,
                    borderRadius: 10, border: '1px solid var(--border-strong)',
                    background: 'var(--surface)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t.qtyUnit}</span>
              </div>
            </label>
          </div>
        </StepSection>

        {/* Step 2 — Frame */}
        <StepSection
          step={2}
          stepPrefix={t.stepPrefix}
          title={t.stepFrameTitle}
          subtitle={t.stepFrameSubtitle}
        >
          <FrameSectionBlock
            title={t.frameSectionCabinet}
            options={cabinetFrameOpts}
            gridStyle={gridStyle}
            selectedFrameCode={selectedFrameCode}
            selectFrame={selectFrame}
            onPreviewImage={(src, title) => setImagePreview({ src, title })}
            t={t}
          />
          <FrameSectionBlock
            title={t.frameSectionRoom}
            options={roomFrameOpts}
            gridStyle={gridStyle}
            selectedFrameCode={selectedFrameCode}
            selectFrame={selectFrame}
            onPreviewImage={(src, title) => setImagePreview({ src, title })}
            t={t}
          />
        </StepSection>

        {/* Step 3 — Surface */}
        <StepSection
          step={3}
          stepPrefix={t.stepPrefix}
          title={t.stepSurfaceTitle}
          subtitle={t.stepSurfaceSubtitle}
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
            {t.finishCategoryLabel}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {finishCategories.map(({ category, label, disabled }) => {
              const selected = selectedFinishCategory === category;
              return (
                <PillButton
                  key={category}
                  selected={selected}
                  disabled={disabled}
                  disabledTitle={t.disabledMismatch}
                  onClick={() => selectFinishCategory(category)}
                >
                  {label}
                </PillButton>
              );
            })}
          </div>

          {selectedFinishCategory ? (
            <>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
                {t.finishColorLabel}
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{t.pickFinishCategoryFirst}</p>
          )}
        </StepSection>

        {/* Step 4 — Filler */}
        <StepSection
          step={4}
          stepPrefix={t.stepPrefix}
          title={t.stepFillerTitle}
          subtitle={t.stepFillerSubtitle}
        >
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
            {t.fillerCategoryLabel}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {fillerTypes.map(({ type, disabled, label }) => {
              const selected = selectedFillerType === type;
              return (
                <PillButton
                  key={type}
                  selected={selected}
                  disabled={disabled}
                  disabledTitle={t.disabledMismatch}
                  onClick={() => selectFillerType(type)}
                >
                  {label}
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
                            {t.thicknessLocked(lockedThickness)}
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
                  {t.leatherBasePrefix}
                  <strong style={{ color: 'var(--text)' }}>{baseMaterial}</strong>
                </p>
              ) : null}
              {lockedFillerThickness !== null ? (
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  {t.lockedThicknessPrefix}
                  <strong style={{ color: 'var(--text)' }}>{lockedFillerThickness} mm</strong>
                </p>
              ) : null}
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{t.pickFillerCategoryFirst}</p>
          )}
        </StepSection>

        {/* Step 5 — Handle */}
        <StepSection
          step={5}
          stepPrefix={t.stepPrefix}
          title={t.stepHandleTitle}
          subtitle={
            frame?.matchedHandle
              ? t.stepHandleSubtitleMatch(frame.matchedHandle)
              : t.stepHandleSubtitleNone
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
          ) : null}
          {frame?.matchedHandle && selectedHandleCode ? (
            <>
              <p
                style={{
                  margin: '20px 0 8px',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                }}
              >
                {t.handleColorLabel}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)' }}>
                {t.handleColorHint}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {handleColorOptions.map(({ color, disabled }) => {
                  const key = color.toLowerCase();
                  const selected = selectedHandleColor?.toLowerCase() === key;
                  return (
                    <PillButton
                      key={color}
                      selected={selected}
                      disabled={disabled}
                      disabledTitle={t.disabledMismatch}
                      onClick={() => selectHandleColor(color)}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </PillButton>
                  );
                })}
              </div>
            </>
          ) : null}
          {!frame?.matchedHandle ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{t.stepHandleSkip}</p>
          ) : null}
        </StepSection>

        {/* Step 6 — Hinge */}
        <StepSection
          step={6}
          stepPrefix={t.stepPrefix}
          title={t.stepHingeTitle}
          subtitle={
            hingeCalc.pivotWarning
              ? t.stepHingeSubtitlePivot
              : frame?.matchedHardware
                ? t.stepHingeSubtitleMatch(frame.matchedHardware)
                : t.stepHingeSubtitleNone
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

          {frame?.hingeCodes && frame.hingeCodes.length > 0 ? (
            <p
              style={{
                margin: '0 0 12px',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: 'var(--text)' }}>{t.hingeCodesLabel}:</strong>{' '}
              {frame.hingeCodes.join(' / ')}
            </p>
          ) : null}

          {hingeCalc.matchedHardware.length > 1 && !hingeCalc.usePivot ? (
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
              {t.hingePickVariantHint}
            </p>
          ) : null}

          {hingeCalc.matchedHardware.length > 0 && !hingeCalc.usePivot ? (
            <div style={gridStyle}>
              {hingeCalc.matchedHardware.map((hw) => {
                const codeKey = hw.code != null ? String(hw.code) : hw.name;
                const hwCode = hw.code != null ? String(hw.code) : null;
                const isSelected =
                  hwCode != null &&
                  selectedHingeHardwareCode != null &&
                  selectedHingeHardwareCode.toLowerCase() === hwCode.toLowerCase();
                const thumb =
                  hw.picture ??
                  (hingeCalc.matchedHardware.length === 1 ? frame?.hingePicture : null) ??
                  null;
                return (
                  <SelectableTile
                    key={codeKey}
                    selected={isSelected}
                    disabled={false}
                    onClick={() => selectHingeHardware(hwCode)}
                  >
                    <MediaThumb picture={thumb} alt={hw.code ?? hw.name} />
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{hw.code ?? '—'}</div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.35,
                        }}
                      >
                        {hw.name}
                      </div>
                      {hw.pricePerPiece != null ? (
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                          ¥{hw.pricePerPiece}/pc
                        </div>
                      ) : null}
                    </div>
                  </SelectableTile>
                );
              })}
            </div>
          ) : null}

          {frame?.matchedHardware && hingeCalc.availableColors.length > 0 && !hingeCalc.usePivot ? (
            <>
              <p style={{ margin: '16px 0 12px', fontSize: 14, color: 'var(--text-secondary)' }}>
                {t.hingeColorLabel}
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
                      disabledTitle={t.disabledMismatch}
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
              {frame?.matchedHardware && !hingeCalc.usePivot ? '' : t.hingeColorSkip}
            </p>
          )}

          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const errs = getValidationErrors();
                if (errs.length > 0) {
                  setConfirmHint(t.confirmBlocked);
                  return;
                }
                setConfirmHint(null);
                confirmConfiguration();
              }}
              style={{
                padding: '12px 22px',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {t.confirmConfiguration}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmHint(null);
                resetConfiguration();
              }}
              style={{
                padding: '12px 22px',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              {t.resetSelection}
            </button>
            {configurationConfirmed ? (
              <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
                {t.configurationConfirmed}
              </span>
            ) : null}
          </div>
          {confirmHint ? (
            <p style={{ marginTop: 12, fontSize: 14, color: '#c41e3a' }}>{confirmHint}</p>
          ) : null}
        </StepSection>

        {/* Quotation Sheet — rendered inline below Step 6 */}
        <QuotationSheet />
      </main>

      <PriceBar />
      <CartDrawer />

      {imagePreview ? (
        <ImageLightbox
          src={imagePreview.src}
          title={imagePreview.title}
          closeLabel={t.imagePreviewClose}
          onClose={() => setImagePreview(null)}
        />
      ) : null}

      {/* Keep finish color id in sync when category changes — store clears color on category change; ensure id format matches */}
      <FinishColorSync />
    </>
  );
}

function ImageLightbox({
  src,
  title,
  closeLabel,
  onClose,
}: {
  src: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.78)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: 'min(960px, 96vw)',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            zIndex: 2,
            padding: '8px 14px',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: 'none',
            background: 'var(--surface)',
            color: 'var(--text)',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}
        >
          {closeLabel}
        </button>
        <img
          src={src}
          alt={title}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: 'min(82vh, 800px)',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: 12,
            background: '#111',
          }}
        />
        <p
          style={{
            margin: '12px 0 0',
            fontSize: 14,
            color: '#eee',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function FrameSectionBlock({
  title,
  options,
  gridStyle,
  selectedFrameCode,
  selectFrame,
  onPreviewImage,
  t,
}: {
  title: string;
  options: FrameOption[];
  gridStyle: CSSProperties;
  selectedFrameCode: string | null;
  selectFrame: (id: string | null) => void;
  onPreviewImage: (src: string, title: string) => void;
  t: UiMessages;
}) {
  if (options.length === 0) return null;

  const btnStyle: CSSProperties = {
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 8,
    border: '1px solid var(--border-strong)',
    background: 'var(--surface)',
    color: 'var(--text)',
    cursor: 'pointer',
  };

  return (
    <section style={{ marginBottom: 28 }}>
      <h3
        style={{
          margin: '0 0 14px',
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>
      <div style={gridStyle}>
        {options.map(({ frame: f, disabled }) => {
          const selected = selectedFrameCode === f.id;
          return (
            <SelectableTile
              key={f.id}
              selected={selected}
              disabled={disabled}
              onClick={() => selectFrame(f.id)}
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
                  {f.doorType.replace(/\n/g, ' ')}
                </div>
                {f.frameProfileLabel ? (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {t.frameProfilePrefix}
                    {f.frameProfileLabel.replace(/\n/g, ' ')}
                  </div>
                ) : null}
                {f.doorThickness != null ? (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {t.frameDoorThickness(f.doorThickness)}
                  </div>
                ) : null}
                {f.mountingType === 'insert' ? (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {t.frameMountingInsert}
                  </div>
                ) : null}
                {f.mountingType === 'cover' ? (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                    {t.frameMountingCover}
                  </div>
                ) : null}
                {f.frameCategory === 'cabinet' && (f.pictureSideView || f.pictureProfile) ? (
                  <div
                    role="group"
                    aria-label={`${f.code} reference photos`}
                    style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {f.pictureSideView ? (
                      <button
                        type="button"
                        style={btnStyle}
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) onPreviewImage(f.pictureSideView!, `${f.code} · ${t.frameBtnSideView}`);
                        }}
                      >
                        {t.frameBtnSideView}
                      </button>
                    ) : null}
                    {f.pictureProfile ? (
                      <button
                        type="button"
                        style={btnStyle}
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) onPreviewImage(f.pictureProfile!, `${f.code} · ${t.frameBtnProfile}`);
                        }}
                      >
                        {t.frameBtnProfile}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </SelectableTile>
          );
        })}
      </div>
    </section>
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

function LanguageToggle({
  locale,
  onChange,
  labels,
}: {
  locale: UiLocale;
  onChange: (l: UiLocale) => void;
  labels: { zh: string; en: string };
}) {
  const btn = (active: boolean) =>
    ({
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 980,
      border: active ? '2px solid var(--accent)' : '1px solid var(--border-strong)',
      background: active ? 'rgba(0, 113, 227, 0.08)' : 'var(--surface)',
      color: 'var(--text)',
      cursor: 'pointer',
      outline: 'none',
    }) as const;

  return (
    <div
      role="group"
      style={{ display: 'inline-flex', gap: 8, flexShrink: 0, alignItems: 'center' }}
    >
      <button type="button" style={btn(locale === 'zh')} onClick={() => onChange('zh')}>
        {labels.zh}
      </button>
      <button type="button" style={btn(locale === 'en')} onClick={() => onChange('en')}>
        {labels.en}
      </button>
    </div>
  );
}

function PillButton({
  children,
  selected,
  disabled,
  disabledTitle,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  disabled: boolean;
  disabledTitle?: string;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={selected}
      title={disabled && disabledTitle ? disabledTitle : undefined}
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
