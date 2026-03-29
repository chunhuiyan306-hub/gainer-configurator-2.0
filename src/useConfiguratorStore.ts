import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  type Frame,
  type Filler,
  type SurfaceColor,
  type Hardware,
  type Handle,
  frames,
  glassList,
  leatherList,
  woodVeneerList,
  quartzStoneList,
  surfaceFinishes,
  hardwareList,
  handleList,
  frameStandardGlassPricingByCode,
  getHardwareByCode,
  getMatchedHandles,
} from './data';
import { msg, readStoredLocale, writeStoredLocale, type UiLocale } from './translations';

// =============================================================================
// Type Definitions
// =============================================================================

export type FinishCategory = 'anodize' | 'spraySoftTouch' | 'sprayMetallic';
export type FillerType = 'glass' | 'leather' | 'woodVeneer' | 'quartzStone';

export interface FrameOption {
  frame: Frame;
  disabled: boolean;
  disabledReason: string | null;
}

export interface FinishCategoryOption {
  category: FinishCategory;
  label: string;
  disabled: boolean;
}

export interface FinishColorOption {
  color: SurfaceColor;
  disabled: boolean;
}

export interface FillerTypeOption {
  type: FillerType;
  label: string;
  disabled: boolean;
}

export interface FillerOption {
  filler: Filler;
  disabled: boolean;
  disabledReason: string | null;
  lockedThickness: number | null;
}

export interface HandleOption {
  handle: Handle;
  disabled: boolean;
}

export interface HandleColorOption {
  color: string;
  disabled: boolean;
}

export interface HingeCalculation {
  qty: number;
  usePivot: boolean;
  pivotWarning: string | null;
  availableColors: string[];
  matchedHardware: Hardware[];
  /** Resolved from selectedHingeHardwareCode, else first match. */
  effectiveHardware: Hardware | null;
}

export type PriceLineStatus = 'calculated' | 'tba' | 'included';

export interface PriceLine {
  label: string;
  amount: number | null;
  status: PriceLineStatus;
}

export interface PriceBreakdown {
  area: number;
  lines: PriceLine[];
  total: number | null;
  hasCustomItems: boolean;
  summary: string;
}

export interface QuotationSnapshot {
  widthMm: number | null;
  heightMm: number | null;
  areaM2: number | null;
  frameCode: string | null;
  frameDoorType: string | null;
  finishName: string | null;
  finishExcelCode: string | null;
  finishCategory: FinishCategory | null;
  fillerCode: string | null;
  fillerName: string | null;
  handleCode: string | null;
  handleName: string | null;
  handleColor: string | null;
  hingeHardwareCode: string | null;
  hingeHardwareName: string | null;
  hingeQtyLabel: string;
  hingeColor: string | null;
  handleBottomMm: number | null;
  handleLengthMm: number | null;
  handleCncFullLength: boolean;
  generatedSku: string;
  fullConfigSku: string | null;
  priceLines: PriceLine[];
  total: number | null;
  hasCustomItems: boolean;
  summary: string;
}

export interface CartItem {
  id: string;
  generatedSku: string;
  fullConfigSku: string | null;
  quantity: number;
  unitTotal: number | null;
  lineTotal: number | null;
  snapshot: QuotationSnapshot;
}

// =============================================================================
// Store State Interface
// =============================================================================

interface ConfiguratorState {
  uiLocale: UiLocale;

  // --- Step 1: Dimensions + Quantity ---
  width: number | null;
  height: number | null;
  quantity: number;

  // --- Step 2: Frame (stores Frame.id, e.g. cabinet-GM004) ---
  selectedFrameCode: string | null;

  // --- Step 3: Surface Finish ---
  selectedFinishCategory: FinishCategory | null;
  selectedFinishColorCode: string | null;

  // --- Step 4: Filler ---
  selectedFillerType: FillerType | null;
  selectedFillerCode: string | null;
  lockedFillerThickness: number | null;
  baseMaterial: string | null;

  // --- Step 5: Handle ---
  selectedHandleCode: string | null;
  selectedHandleColor: string | null;

  // --- Step 6: Hinge ---
  selectedHingeColor: string | null;
  /** hardwareList code when multiple hinges (e.g. HG-BLUM vs HG-SEN). */
  selectedHingeHardwareCode: string | null;

  /** Handle center (or datum) height from door bottom, mm — default 960. */
  handleBottomMm: number | null;
  /** CNC / custom pull length, mm — default 160; ignored when handleCncFullLength. */
  handleLengthMm: number | null;
  /** CNC 通长拉手 */
  handleCncFullLength: boolean;

  configurationConfirmed: boolean;

  // --- Cart ---
  cartItems: CartItem[];
  cartOpen: boolean;
}

// =============================================================================
// Store Actions Interface
// =============================================================================

interface ConfiguratorActions {
  setUiLocale: (locale: UiLocale) => void;
  setDimensions: (w: number | null, h: number | null) => void;
  setQuantity: (qty: number) => void;
  selectFrame: (code: string | null) => void;
  selectFinishCategory: (category: FinishCategory | null) => void;
  selectFinishColor: (code: string | null) => void;
  selectFillerType: (type: FillerType | null) => void;
  selectFiller: (code: string | null) => void;
  selectHandle: (code: string | null) => void;
  selectHandleColor: (color: string | null) => void;
  setHandleMount: (bottomMm: number | null, lengthMm: number | null, cncFull: boolean) => void;
  selectHingeColor: (color: string | null) => void;
  selectHingeHardware: (hardwareCode: string | null) => void;
  reset: () => void;
  resetConfiguration: () => void;
  confirmConfiguration: () => void;
  addToCart: () => boolean;
  removeFromCart: (id: string) => void;
  updateCartItemQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
}

// =============================================================================
// Store Selectors Interface (computed views)
// =============================================================================

interface ConfiguratorSelectors {
  getSelectedFrame: () => Frame | null;
  getFrameOptions: () => FrameOption[];
  getFinishCategoryOptions: () => FinishCategoryOption[];
  getFinishColorOptions: () => FinishColorOption[];
  getFillerTypeOptions: () => FillerTypeOption[];
  getFillerOptions: () => FillerOption[];
  getHandleOptions: () => HandleOption[];
  getHingeCalculation: () => HingeCalculation;
  getPriceBreakdown: () => PriceBreakdown;
  getValidationErrors: () => string[];
  getConfigurationSku: () => string | null;
  getGeneratedSku: () => string;
  getHandleColorOptions: () => HandleColorOption[];
  getQuotationSnapshot: () => QuotationSnapshot;
  getCartTotal: () => { count: number; total: number | null };
}

// Combine into full store type
export type ConfiguratorStore = ConfiguratorState & ConfiguratorActions & ConfiguratorSelectors;

// =============================================================================
// Initial State
// =============================================================================

const CART_STORAGE_KEY = 'gainer-cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; }
  } catch { /* ignore */ }
  return [];
}

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

function cartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const initialState: ConfiguratorState = {
  uiLocale: readStoredLocale(),
  width: null,
  height: null,
  quantity: 1,
  selectedFrameCode: null,
  selectedFinishCategory: null,
  selectedFinishColorCode: null,
  selectedFillerType: null,
  selectedFillerCode: null,
  lockedFillerThickness: null,
  baseMaterial: null,
  selectedHandleCode: null,
  selectedHandleColor: null,
  handleBottomMm: 960,
  handleLengthMm: 160,
  handleCncFullLength: false,
  selectedHingeColor: null,
  selectedHingeHardwareCode: null,
  configurationConfirmed: false,
  cartItems: loadCart(),
  cartOpen: false,
};

// =============================================================================
// Cascade Clear Helpers
// =============================================================================

const clearFromFinish: Partial<ConfiguratorState> = {
  selectedFinishCategory: null,
  selectedFinishColorCode: null,
  selectedFillerType: null,
  selectedFillerCode: null,
  lockedFillerThickness: null,
  baseMaterial: null,
  selectedHandleCode: null,
  selectedHandleColor: null,
  handleBottomMm: 960,
  handleLengthMm: 160,
  handleCncFullLength: false,
  selectedHingeColor: null,
  selectedHingeHardwareCode: null,
  configurationConfirmed: false,
};

const clearFromFiller: Partial<ConfiguratorState> = {
  selectedFillerType: null,
  selectedFillerCode: null,
  lockedFillerThickness: null,
  baseMaterial: null,
};

// =============================================================================
// Frame Lookup Helper
// =============================================================================

function findFrame(idOrLegacyCode: string | null): Frame | null {
  if (!idOrLegacyCode) return null;
  const byId = frames.find((f) => f.id === idOrLegacyCode);
  if (byId) return byId;
  const sameCode = frames.filter((f) => f.code === idOrLegacyCode);
  return sameCode.length === 1 ? sameCode[0] : null;
}

// Standard glass G01/G33/G36 tier prices — from Excel via generate_data.py
const STANDARD_GLASS_CODES = new Set(['G01', 'G33', 'G36']);

function resolveStandardGlassPrice(
  selectedFrameKey: string | null,
  glassCode: string,
): number | null {
  if (!selectedFrameKey) return null;
  const f = findFrame(selectedFrameKey);
  const frameCode = f?.code ?? selectedFrameKey;
  const tier = frameStandardGlassPricingByCode[frameCode];
  if (!tier) return null;
  if (glassCode === 'G01') return tier.normalGlass;
  if (glassCode === 'G33') return tier.normalGlass;
  if (glassCode === 'G36') return tier.blackGlass;
  return null;
}

// =============================================================================
// Size Validation Helper
// =============================================================================

function checkFrameFitsSize(
  frame: Frame,
  w: number | null,
  h: number | null,
): { disabled: boolean; reason: string | null } {
  if (w === null || h === null) return { disabled: false, reason: null };
  const { minW, maxW, minH, maxH } = frame.sizeLimits;

  if (minW !== null && w < minW)
    return { disabled: true, reason: `Width ${w}mm < min ${minW}mm` };
  if (maxW !== null && w > maxW)
    return { disabled: true, reason: `Width ${w}mm > max ${maxW}mm` };
  if (minH !== null && h < minH)
    return { disabled: true, reason: `Height ${h}mm < min ${minH}mm` };
  if (maxH !== null && h > maxH)
    return { disabled: true, reason: `Height ${h}mm > max ${maxH}mm` };

  return { disabled: false, reason: null };
}

const FILLER_TYPE_TO_ALLOWED: Record<FillerType, string[]> = {
  glass: ['glass'],
  leather: ['leather'],
  woodVeneer: ['wood veneer', 'woodVeneer'],
  quartzStone: ['quartz stone', 'quartzStone'],
};

// =============================================================================
// Handle Matching Helper
// =============================================================================

function isHandleMatchedToFrame(handle: Handle, frame: Frame): boolean {
  if (frame.handleOptions.length > 0) {
    return frame.handleOptions.some(
      (o) => o.code.toLowerCase() === handle.code.toLowerCase(),
    );
  }
  if (frame.handleWorkflow === 'cnc' && frame.handleOptions.length === 0 && handle.code === 'CNC') {
    return true;
  }
  if (!frame.matchedHandle) return false;
  const raw = frame.matchedHandle.toLowerCase();
  const tokens = raw.split(/[\n/]/).map((s) => s.trim()).filter(Boolean);
  const hCode = handle.code.toLowerCase();
  const hName = handle.name.toLowerCase();
  if (raw.includes('routed') && raw.includes('cnc')) {
    if (hName.includes('铣') || hName.includes('cnc') || hName.includes('定尺')) return true;
  }
  return tokens.some(
    (t) => t === hCode || t === hName || hCode.includes(t) || t.includes(hCode),
  );
}

function frameSkipsHandleUi(frame: Frame | null): boolean {
  if (!frame) return true;
  return frame.handleWorkflow === 'none' || frame.handleWorkflow === 'vshape';
}

function frameShowsHandleMountPanel(frame: Frame | null): boolean {
  if (!frame) return false;
  const w = frame.handleWorkflow;
  return w === 'separate' || w === 'cnc' || w === 'fixed';
}

function frameUsesHandleColorStep(frame: Frame | null): boolean {
  if (!frame) return false;
  return !frameSkipsHandleUi(frame);
}

// =============================================================================
// Hardware Matching Helper
// =============================================================================

const HW_SYNONYMS: [string, string][] = [
  ['top and bottom hinge', 'air hinge'],
  ['top and bottom hinges', 'air hinge'],
  ['air hinges', 'air hinge'],
];

function _normalizeHwText(s: string): string {
  let t = s.toLowerCase().replace(/[()（）°℃]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [from, to] of HW_SYNONYMS) {
    while (t.includes(from)) t = t.replace(from, to);
  }
  return t;
}

const _HW_STOP = new Set([
  'hinge', 'hinges', 'door', 'assembly', 'concealed', 'cover',
  'overlay', 'type', 'with', 'for', 'and', 'the', 'inset',
  'full', 'half', 'quick', 'soft', 'close', 'pin', 'pivot',
  'heavy', 'duty', 'metal', 'base', 'sleeve', 'wooden',
]);

function _sigBigrams(text: string): Set<string> {
  const w = text.split(/\s+/).filter(Boolean);
  const s = new Set<string>();
  for (let i = 0; i < w.length - 1; i++) {
    if (!_HW_STOP.has(w[i]) || !_HW_STOP.has(w[i + 1])) {
      s.add(`${w[i]} ${w[i + 1]}`);
    }
  }
  return s;
}

function findMatchedHardware(frame: Frame): Hardware[] {
  const fromCodes: Hardware[] = [];
  const seen = new Set<string>();
  for (const c of frame.hingeCodes) {
    const h = getHardwareByCode(c);
    if (!h?.code) continue;
    const k = String(h.code).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    fromCodes.push(h);
  }
  if (fromCodes.length > 0) return fromCodes;

  if (!frame.matchedHardware) return [];
  const rawNorm = _normalizeHwText(frame.matchedHardware);
  const rawTokens = rawNorm.split(/[/&,]/).map((s) => s.trim()).filter(Boolean);

  type ScoredHw = { hw: Hardware; score: number };
  const scored: ScoredHw[] = [];

  for (const hw of hardwareList) {
    const nameNorm = _normalizeHwText(hw.name);
    const codeNorm = hw.code ? hw.code.toLowerCase().replace(/^hg-/, '') : '';
    let score = 0;

    if (rawNorm.includes(nameNorm) || nameNorm.includes(rawNorm)) {
      score = Math.max(score, 100);
    }

    if (codeNorm.length >= 4 && rawNorm.includes(codeNorm)) {
      score = Math.max(score, 90);
    }

    const nameIds = (nameNorm.match(/[a-z0-9][-a-z0-9]{3,}/g) ?? [])
      .filter((t) => !_HW_STOP.has(t) && t.length > 4);
    if (nameIds.some((t) => rawNorm.includes(t))) {
      score = Math.max(score, 80);
    }

    for (const rt of rawTokens) {
      if (!rt || rt.length < 4) continue;
      if (nameNorm.includes(rt)) { score = Math.max(score, 85); break; }
      const ids = (rt.match(/[a-z0-9][-a-z0-9]{3,}/g) ?? [])
        .filter((t) => !_HW_STOP.has(t) && t.length > 4);
      if (ids.some((t) => nameNorm.includes(t))) { score = Math.max(score, 75); break; }
    }

    if (score === 0) {
      const rawBg = _sigBigrams(rawNorm);
      for (const bg of _sigBigrams(nameNorm)) {
        if (rawBg.has(bg)) { score = 50; break; }
      }
    }

    if (score > 0) scored.push({ hw, score });
  }

  if (scored.length === 0) return [];
  const maxScore = Math.max(...scored.map((s) => s.score));
  const threshold = maxScore >= 75 ? 50 : 40;
  return scored
    .filter((s) => s.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.hw);
}

function resolvePickedHingeHardware(
  frame: Frame | null,
  selectedCode: string | null,
): Hardware | null {
  if (!frame) return null;
  const list = findMatchedHardware(frame);
  if (list.length === 0) return null;
  if (selectedCode) {
    const hit = list.find(
      (h) => h.code != null && String(h.code).toLowerCase() === selectedCode.toLowerCase(),
    );
    if (hit) return hit;
  }
  return list[0] ?? null;
}

function skuSanitize(part: string): string {
  return part.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'X';
}

/** Stored id: `finishCategory::excelCodeOrEmpty::colorName` (see ConfiguratorPage.finishColorId). */
function parseFinishColorSelectionId(id: string | null): {
  category: FinishCategory;
  excelCode: string | null;
  name: string;
} | null {
  if (!id) return null;
  const [cat, codePart, ...nameParts] = id.split('::');
  const name = nameParts.join('::');
  if (cat !== 'anodize' && cat !== 'spraySoftTouch' && cat !== 'sprayMetallic') return null;
  return {
    category: cat as FinishCategory,
    excelCode: codePart === '' ? null : codePart,
    name,
  };
}

/** Distinguish process family in SKU; Excel color codes live in the sheets (e.g. YPF01, PAE06). */
const FINISH_FAMILY_SKU_PREFIX: Record<FinishCategory, string> = {
  anodize: 'A',
  spraySoftTouch: 'T',
  sprayMetallic: 'M',
};

function finishProcessSkuSegment(
  parsed: NonNullable<ReturnType<typeof parseFinishColorSelectionId>>,
): string {
  const fam = FINISH_FAMILY_SKU_PREFIX[parsed.category];
  const body = parsed.excelCode
    ? skuSanitize(parsed.excelCode)
    : skuSanitize(parsed.name);
  return `${fam}${body}`;
}

// ---------------------------------------------------------------------------
// Handle color (aligned with surface finish where possible)
// ---------------------------------------------------------------------------

const GLOBAL_HANDLE_COLOR_PALETTE = [
  'black',
  'gray',
  'gold',
  'champagne',
  'silver',
  'bronze',
  'white',
] as const;

function effectiveHandleAllowedColorSet(handle: Handle, frame: Frame | null): Set<string> {
  const set = new Set<string>();
  const ac = handle.allowedColors;
  const swatch = ac.some((x) => String(x).toLowerCase() === 'color swatch colors');
  if (swatch) {
    for (const c of GLOBAL_HANDLE_COLOR_PALETTE) set.add(c);
    if (frame?.hardwareColors?.length) {
      for (const c of frame.hardwareColors) {
        set.add(String(c).toLowerCase().trim());
      }
    }
    return set;
  }
  for (const x of ac) set.add(String(x).toLowerCase().trim());
  return set;
}

function handleColorOptionRows(handle: Handle, frame: Frame | null): HandleColorOption[] {
  const allowed = effectiveHandleAllowedColorSet(handle, frame);
  const ordered: string[] = [...GLOBAL_HANDLE_COLOR_PALETTE];
  for (const c of allowed) {
    if (!ordered.includes(c)) ordered.push(c);
  }
  return ordered.map((color) => ({
    color,
    disabled: !allowed.has(color),
  }));
}

/** Map surface finish name / code to a handle swatch token. */
function colorTokenFromFinish(finishName: string, excelCode: string | null | undefined): string | null {
  const text = `${finishName} ${excelCode ?? ''}`.toLowerCase();
  if (/champagne|香槟/.test(text)) return 'champagne';
  if (/(\b|_)black|matte\s*black|墨黑|磨砂黑/.test(text)) return 'black';
  if (/\bgold|luxury\s*gold|金色/.test(text)) return 'gold';
  if (/bronze|青铜|古铜/.test(text)) return 'bronze';
  if (/silver|银白|silver-white|雪白/.test(text)) return 'silver';
  if (/\bwhite\b|乳白|纯白/.test(text)) return 'white';
  if (/gray|grey|灰|roman/.test(text)) return 'gray';
  return null;
}

function computeHandleColorAfterUpdate(state: ConfiguratorState): string | null {
  if (!state.selectedHandleCode) return null;
  const frame = findFrame(state.selectedFrameCode);
  const handle = handleList.find((h) => h.code === state.selectedHandleCode);
  if (!frame?.matchedHandle || !handle) return null;
  const allowed = effectiveHandleAllowedColorSet(handle, frame);
  const parsed = parseFinishColorSelectionId(state.selectedFinishColorCode);
  if (parsed) {
    const token = colorTokenFromFinish(parsed.name, parsed.excelCode);
    if (token && allowed.has(token)) return token;
  }
  const cur = state.selectedHandleColor?.toLowerCase() ?? '';
  if (cur && allowed.has(cur)) return cur;
  return null;
}

function findFillerByCode(code: string | null): { code: string; name: string } | null {
  if (!code) return null;
  const g = glassList.find((x) => x.code === code);
  if (g) return { code: g.code, name: g.name };
  const l = leatherList.find((x) => x.code === code);
  if (l) return { code: l.code, name: l.name };
  const w = woodVeneerList.find((x) => x.code === code);
  if (w) return { code: w.code, name: w.name };
  const q = quartzStoneList.find((x) => x.code === code);
  if (q) return { code: q.code, name: q.name };
  return { code, name: code };
}

// =============================================================================
// Zustand Store Creation
// =============================================================================

export const useConfiguratorStore = create<ConfiguratorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // =====================================================================
      // ACTION: setUiLocale
      // =====================================================================
      setUiLocale: (locale) => {
        writeStoredLocale(locale);
        set({ uiLocale: locale }, undefined, 'setUiLocale');
      },

      // =====================================================================
      // ACTION: setDimensions
      // Sets W and H. If the currently selected frame no longer fits,
      // we clear the frame selection (which cascades everything).
      // =====================================================================
      setDimensions: (w, h) => {
        const state = get();
        const updates: Partial<ConfiguratorState> = { width: w, height: h };

        if (state.selectedFrameCode) {
          const frame = findFrame(state.selectedFrameCode);
          if (frame) {
            const { disabled } = checkFrameFitsSize(frame, w, h);
            if (disabled) {
              Object.assign(updates, {
                selectedFrameCode: null,
                ...clearFromFinish,
              });
            }
          }
        }
        set({ ...updates, configurationConfirmed: false }, undefined, 'setDimensions');
      },

      // =====================================================================
      // ACTION: setQuantity
      // =====================================================================
      setQuantity: (qty) => {
        set({ quantity: Math.max(1, Math.floor(qty)) }, undefined, 'setQuantity');
      },

      // =====================================================================
      // ACTION: selectFrame
      // Selects a frame and CASCADE CLEARS all downstream state.
      // =====================================================================
      selectFrame: (code) => {
        const state = get();
        if (code === state.selectedFrameCode) return;

        if (!code) {
          set(
            { selectedFrameCode: null, ...clearFromFinish, configurationConfirmed: false },
            undefined,
            'selectFrame/clear',
          );
          return;
        }

        const frame = findFrame(code);
        if (!frame) return;

        const { disabled } = checkFrameFitsSize(frame, state.width, state.height);
        if (disabled) return;

        let autoHandleCode: string | null = null;
        const wf = frame.handleWorkflow;
        if (wf === 'none') {
          autoHandleCode = null;
        } else if (wf === 'vshape' || wf === 'fixed') {
          autoHandleCode = frame.fixedHandleCode ?? null;
        } else if (wf === 'cnc' && frame.handleOptions.length === 0) {
          autoHandleCode = 'CNC';
        } else {
          const mh = getMatchedHandles(frame);
          if (mh.length > 0) {
            autoHandleCode = mh[0].code;
          } else if (frame.matchedHandle) {
            const matched = handleList.filter((h) => isHandleMatchedToFrame(h, frame));
            if (matched.length > 0) autoHandleCode = matched[0].code;
          }
        }

        // Auto-select the first hinge color
        const hingeColors =
          frame.hardwareColors.length > 0
            ? [...frame.hardwareColors]
            : frame.matchedHardware ? ['black', 'gray', 'gold'] : [];
        const autoHingeColor = hingeColors.length > 0 ? hingeColors[0] : null;

        const mhList = findMatchedHardware(frame);
        const autoHingeHw =
          mhList[0]?.code != null ? String(mhList[0].code) : null;

        set(
          {
            selectedFrameCode: code,
            ...clearFromFinish,
            selectedHandleCode: autoHandleCode,
            handleBottomMm: 960,
            handleLengthMm: 160,
            handleCncFullLength: false,
            selectedHingeColor: autoHingeColor,
            selectedHingeHardwareCode: autoHingeHw,
            configurationConfirmed: false,
          },
          undefined,
          'selectFrame',
        );
      },

      // =====================================================================
      // ACTION: selectFinishCategory
      // Picks Anodize / SpraySoftTouch / SprayMetallic.
      // Clears the specific color if category changes.
      // =====================================================================
      selectFinishCategory: (category) => {
        const state = get();
        if (category === state.selectedFinishCategory) return;
        set(
          {
            selectedFinishCategory: category,
            selectedFinishColorCode: null,
            configurationConfirmed: false,
          },
          undefined,
          'selectFinishCategory',
        );
      },

      // =====================================================================
      // ACTION: selectFinishColor
      // =====================================================================
      selectFinishColor: (code) => {
        set((s) => {
          const newHandleColor = computeHandleColorAfterUpdate({ ...s, selectedFinishColorCode: code });

          // Auto-match hinge color to finish when possible
          let autoHingeColor = s.selectedHingeColor;
          if (code) {
            const parsed = parseFinishColorSelectionId(code);
            if (parsed) {
              const frame = findFrame(s.selectedFrameCode);
              const hingeColors =
                frame?.hardwareColors?.length
                  ? frame.hardwareColors.map((c) => String(c).toLowerCase().trim())
                  : frame?.matchedHardware ? ['black', 'gray', 'gold'] : [];
              const token = colorTokenFromFinish(parsed.name, parsed.excelCode);
              if (token) {
                const match = hingeColors.find((c) => c === token);
                if (match) autoHingeColor = match;
              }
            }
          }

          return {
            selectedFinishColorCode: code,
            configurationConfirmed: false,
            selectedHandleColor: newHandleColor,
            selectedHingeColor: autoHingeColor,
          };
        }, undefined, 'selectFinishColor');
      },

      // =====================================================================
      // ACTION: selectFillerType
      // Clears specific filler when type changes.
      // =====================================================================
      selectFillerType: (type) => {
        const state = get();
        if (type === state.selectedFillerType) return;
        set(
          {
            selectedFillerType: type,
            selectedFillerCode: null,
            lockedFillerThickness: null,
            baseMaterial: null,
            configurationConfirmed: false,
          },
          undefined,
          'selectFillerType',
        );
      },

      // =====================================================================
      // ACTION: selectFiller
      // Selects a specific filler. Computes locked thickness and
      // auto-binds baseMaterial for leather.
      // =====================================================================
      selectFiller: (code) => {
        if (!code) {
          set(
            {
              selectedFillerCode: null,
              lockedFillerThickness: null,
              baseMaterial: null,
              configurationConfirmed: false,
            },
            undefined,
            'selectFiller/clear',
          );
          return;
        }

        const state = get();
        const frame = findFrame(state.selectedFrameCode);

        let lockedThickness: number | null = null;
        let baseMat: string | null = null;

        if (frame && frame.fillerThicknessLimit.length > 0) {
          lockedThickness = frame.fillerThicknessLimit[0];
        }

        // Auto-bind leather → Honeycomb Aluminum
        const leather = leatherList.find((l) => l.code === code);
        if (leather) {
          baseMat = leather.baseMaterial;
        }

        set(
          {
            selectedFillerCode: code,
            lockedFillerThickness: lockedThickness,
            baseMaterial: baseMat,
            configurationConfirmed: false,
          },
          undefined,
          'selectFiller',
        );
      },

      // =====================================================================
      // ACTION: selectHandle
      // =====================================================================
      selectHandle: (code) => {
        if (!code) {
          set(
            { selectedHandleCode: null, selectedHandleColor: null, configurationConfirmed: false },
            undefined,
            'selectHandle/clear',
          );
          return;
        }
        set((s) => ({
          selectedHandleCode: code,
          configurationConfirmed: false,
          selectedHandleColor: computeHandleColorAfterUpdate({ ...s, selectedHandleCode: code }),
        }), undefined, 'selectHandle');
      },

      // =====================================================================
      // ACTION: selectHandleColor
      // =====================================================================
      selectHandleColor: (color) => {
        set({ selectedHandleColor: color, configurationConfirmed: false }, undefined, 'selectHandleColor');
      },

      setHandleMount: (bottomMm, lengthMm, cncFull) => {
        set(
          {
            handleBottomMm: bottomMm,
            handleLengthMm: lengthMm,
            handleCncFullLength: cncFull,
            configurationConfirmed: false,
          },
          undefined,
          'setHandleMount',
        );
      },

      // =====================================================================
      // ACTION: selectHingeColor
      // =====================================================================
      selectHingeColor: (color) => {
        set({ selectedHingeColor: color, configurationConfirmed: false }, undefined, 'selectHingeColor');
      },

      selectHingeHardware: (hardwareCode) => {
        set(
          { selectedHingeHardwareCode: hardwareCode, configurationConfirmed: false },
          undefined,
          'selectHingeHardware',
        );
      },

      // =====================================================================
      // ACTION: reset
      // =====================================================================
      reset: () => {
        const { uiLocale, cartItems } = get();
        set({ ...initialState, uiLocale, cartItems, cartOpen: false }, undefined, 'reset');
      },

      // =====================================================================
      // ACTION: resetConfiguration — alias for full reset (keeps language)
      // =====================================================================
      resetConfiguration: () => {
        const { uiLocale, cartItems } = get();
        set({ ...initialState, uiLocale, cartItems, cartOpen: false }, undefined, 'resetConfiguration');
      },

      // =====================================================================
      // ACTION: confirmConfiguration
      // =====================================================================
      confirmConfiguration: () => {
        if (get().getValidationErrors().length > 0) return;
        set({ configurationConfirmed: true }, undefined, 'confirmConfiguration');
      },

      // =====================================================================
      // ACTION: addToCart — snapshot current config + qty, add to cart, reset form
      // =====================================================================
      addToCart: () => {
        const s = get();
        if (s.getValidationErrors().length > 0) return false;
        const snap = s.getQuotationSnapshot();
        const qty = s.quantity;
        const item: CartItem = {
          id: cartItemId(),
          generatedSku: snap.generatedSku,
          fullConfigSku: snap.fullConfigSku,
          quantity: qty,
          unitTotal: snap.total,
          lineTotal: snap.total !== null ? snap.total * qty : null,
          snapshot: snap,
        };
        const next = [...s.cartItems, item];
        saveCart(next);
        const locale = s.uiLocale;
        set({
          ...initialState,
          uiLocale: locale,
          cartItems: next,
          cartOpen: false,
        }, undefined, 'addToCart');
        return true;
      },

      // =====================================================================
      // ACTION: removeFromCart
      // =====================================================================
      removeFromCart: (id) => {
        const next = get().cartItems.filter((i) => i.id !== id);
        saveCart(next);
        set({ cartItems: next }, undefined, 'removeFromCart');
      },

      // =====================================================================
      // ACTION: updateCartItemQty
      // =====================================================================
      updateCartItemQty: (id, qty) => {
        const clamped = Math.max(1, Math.floor(qty));
        const next = get().cartItems.map((i) =>
          i.id === id
            ? { ...i, quantity: clamped, lineTotal: i.unitTotal !== null ? i.unitTotal * clamped : null }
            : i,
        );
        saveCart(next);
        set({ cartItems: next }, undefined, 'updateCartItemQty');
      },

      // =====================================================================
      // ACTION: clearCart
      // =====================================================================
      clearCart: () => {
        saveCart([]);
        set({ cartItems: [] }, undefined, 'clearCart');
      },

      // =====================================================================
      // ACTION: setCartOpen
      // =====================================================================
      setCartOpen: (open) => {
        set({ cartOpen: open }, undefined, 'setCartOpen');
      },

      // =====================================================================
      // SELECTOR: getSelectedFrame
      // =====================================================================
      getSelectedFrame: (): Frame | null => {
        return findFrame(get().selectedFrameCode);
      },

      // =====================================================================
      // SELECTOR: getFrameOptions
      // Returns all frames annotated with disabled status based on W/H.
      // =====================================================================
      getFrameOptions: (): FrameOption[] => {
        const { width, height } = get();
        return frames.map((frame) => {
          const { disabled, reason } = checkFrameFitsSize(frame, width, height);
          return { frame, disabled, disabledReason: reason };
        });
      },

      // =====================================================================
      // SELECTOR: getFinishCategoryOptions
      // Returns the three finish categories with disabled status
      // based on the selected frame's allowedFinishing.
      // =====================================================================
      getFinishCategoryOptions: (): FinishCategoryOption[] => {
        const frame = findFrame(get().selectedFrameCode);
        const allCategories: FinishCategory[] = ['anodize', 'spraySoftTouch', 'sprayMetallic'];

        const L = msg(get().uiLocale);
        return allCategories.map((cat) => ({
          category: cat,
          label: L.finish[cat],
          disabled: frame ? !frame.allowedFinishing.includes(cat) : true,
        }));
      },

      // =====================================================================
      // SELECTOR: getFinishColorOptions
      // Returns colors in the selected category, respecting
      // frame-level specificColors constraints.
      // =====================================================================
      getFinishColorOptions: (): FinishColorOption[] => {
        const { selectedFinishCategory, selectedFrameCode } = get();
        if (!selectedFinishCategory) return [];

        const frame = findFrame(selectedFrameCode);
        if (!frame) return [];

        const pool = surfaceFinishes[selectedFinishCategory];

        const specificSet = frame.specificColors
          ? new Set(frame.specificColors)
          : null;

        return pool.map((color) => {
          const disabled = specificSet !== null && color.code !== null
            ? !specificSet.has(color.code)
            : false;
          return { color, disabled };
        });
      },

      // =====================================================================
      // SELECTOR: getFillerTypeOptions
      // Returns filler material categories with disabled status
      // based on frame's allowedFillers.
      // =====================================================================
      getFillerTypeOptions: (): FillerTypeOption[] => {
        const frame = findFrame(get().selectedFrameCode);
        const allTypes: FillerType[] = ['glass', 'leather', 'woodVeneer', 'quartzStone'];

        const L = msg(get().uiLocale);
        return allTypes.map((ft) => {
          const matchKeys = FILLER_TYPE_TO_ALLOWED[ft];
          const allowed = frame
            ? frame.allowedFillers.some((af) => matchKeys.includes(af))
            : false;
          return {
            type: ft,
            label: L.filler[ft],
            disabled: !allowed,
          };
        });
      },

      // =====================================================================
      // SELECTOR: getFillerOptions
      // Returns individual fillers in the selected type, with:
      // - disabled: true if no compatible thickness exists
      // - lockedThickness: the auto-locked thickness value
      // =====================================================================
      getFillerOptions: (): FillerOption[] => {
        const { selectedFillerType } = get();
        if (!selectedFillerType) return [];

        const frame = findFrame(get().selectedFrameCode);
        const thicknessLimit = frame?.fillerThicknessLimit ?? [];

        let pool: readonly Filler[];
        switch (selectedFillerType) {
          case 'glass':       pool = glassList; break;
          case 'leather':     pool = leatherList; break;
          case 'woodVeneer':  pool = woodVeneerList; break;
          case 'quartzStone': pool = quartzStoneList; break;
          default: return [];
        }

        return pool.map((filler) => {

          if (thicknessLimit.length === 0) {
            return { filler, disabled: false, disabledReason: null, lockedThickness: null };
          }

          const compatible = filler.thicknesses.filter((t: number) =>
            thicknessLimit.includes(t),
          );

          if (compatible.length === 0) {
            return {
              filler,
              disabled: true,
              disabledReason: `No compatible thickness (frame requires ${thicknessLimit.join('/')})`,
              lockedThickness: null,
            };
          }

          return {
            filler,
            disabled: false,
            disabledReason: null,
            lockedThickness: compatible[0],
          };
        });
      },

      // =====================================================================
      // SELECTOR: getHandleOptions
      // Returns handles with disabled status based on matchedHandle.
      // Handles not matching the frame's matchedHandle are disabled.
      // =====================================================================
      getHandleOptions: (): HandleOption[] => {
        const frame = findFrame(get().selectedFrameCode);

        return handleList.map((handle) => {
          if (!frame) return { handle, disabled: true };
          if (frameSkipsHandleUi(frame) || frame.handleWorkflow === 'fixed') {
            return { handle, disabled: true };
          }
          if (frame.handleWorkflow === 'cnc' && frame.handleOptions.length === 0) {
            return { handle, disabled: handle.code !== 'CNC' };
          }
          const matched = isHandleMatchedToFrame(handle, frame);
          return { handle, disabled: !matched };
        });
      },

      // =====================================================================
      // SELECTOR: getHingeCalculation
      // Computes hinge quantity based on height, determines if pivot
      // hinge is needed, and resolves available colors.
      // =====================================================================
      getHingeCalculation: (): HingeCalculation => {
        const { height, selectedHingeHardwareCode } = get();
        const frame = findFrame(get().selectedFrameCode);

        const matched = frame ? findMatchedHardware(frame) : [];
        const effectiveHardware = resolvePickedHingeHardware(frame, selectedHingeHardwareCode);

        const availableColors =
          frame && matched.length > 0
            ? frame.hardwareColors.length > 0
              ? [...frame.hardwareColors]
              : ['black', 'gray', 'gold']
            : [];

        if (!frame) {
          return {
            qty: 0,
            usePivot: false,
            pivotWarning: null,
            availableColors: [],
            matchedHardware: [],
            effectiveHardware: null,
          };
        }

        let qty: number;
        let usePivot = false;
        let pivotWarning: string | null = null;

        if (!height || height <= 0) {
          qty = 0;
        } else if (height <= 2000) {
          qty = 2;
        } else if (height <= 2500) {
          qty = 4;
        } else {
          qty = 0;
          usePivot = true;
          pivotWarning = msg(get().uiLocale).pivotWarning;
        }

        return {
          qty,
          usePivot,
          pivotWarning,
          availableColors,
          matchedHardware: matched,
          effectiveHardware,
        };
      },

      // =====================================================================
      // SELECTOR: getPriceBreakdown
      // Full pricing engine.
      // =====================================================================
      getPriceBreakdown: (): PriceBreakdown => {
        const state = get();
        const L = msg(state.uiLocale).price;
        const { width, height, selectedFrameCode, selectedFillerCode } = state;

        const emptyBreakdown: PriceBreakdown = {
          area: 0,
          lines: [],
          total: null,
          hasCustomItems: false,
          summary: L.empty,
        };

        if (!width || !height) return emptyBreakdown;

        const area = (width / 1000) * (height / 1000);
        const lines: PriceLine[] = [];
        let hasCustom = false;
        let runningTotal = 0;

        // --- Frame + Standard Filler combined price ---
        if (selectedFrameCode && selectedFillerCode) {
          const frame = findFrame(selectedFrameCode);
          const labelCode = frame?.code ?? selectedFrameCode;
          const isStandard = STANDARD_GLASS_CODES.has(selectedFillerCode);
          if (isStandard) {
            const sqmPrice = resolveStandardGlassPrice(selectedFrameCode, selectedFillerCode);
            if (sqmPrice !== null) {
              const lineTotal = Math.round(area * sqmPrice * 100) / 100;
              lines.push({
                label: L.frameGlass(labelCode, selectedFillerCode),
                amount: lineTotal,
                status: 'calculated',
              });
              runningTotal += lineTotal;
            } else {
              lines.push({
                label: L.frameGlass(labelCode, selectedFillerCode),
                amount: null,
                status: 'tba',
              });
              hasCustom = true;
            }
          } else {
            lines.push({
              label: L.frameFiller(labelCode, selectedFillerCode),
              amount: null,
              status: 'tba',
            });
            hasCustom = true;
          }
        } else if (selectedFrameCode) {
          const frame = findFrame(selectedFrameCode);
          const labelCode = frame?.code ?? selectedFrameCode;
          lines.push({
            label: L.frameAwaitFiller(labelCode),
            amount: null,
            status: 'tba',
          });
          hasCustom = true;
        }

        // --- Hardware / Hinge price ---
        const hingeCalc = get().getHingeCalculation();
        if (hingeCalc.matchedHardware.length > 0 && hingeCalc.qty > 0) {
          const hw = hingeCalc.effectiveHardware ?? hingeCalc.matchedHardware[0];
          if (hw.pricePerPiece !== null) {
            const hwTotal = hw.pricePerPiece * hingeCalc.qty;
            lines.push({
              label: L.hingeLine(hw.name, hingeCalc.qty),
              amount: hwTotal,
              status: 'calculated',
            });
            runningTotal += hwTotal;
          } else {
            lines.push({
              label: L.hingeLine(hw.name, hingeCalc.qty),
              amount: null,
              status: 'tba',
            });
            hasCustom = true;
          }
        } else if (hingeCalc.usePivot) {
          const pivotHw = hardwareList.find((hw) =>
            hw.name.toLowerCase().includes('pivot'),
          );
          if (pivotHw && pivotHw.pricePerPiece !== null) {
            lines.push({
              label: L.pivotSet(pivotHw.name),
              amount: pivotHw.pricePerPiece,
              status: 'calculated',
            });
            runningTotal += pivotHw.pricePerPiece;
          } else {
            lines.push({
              label: L.pivotGeneric,
              amount: null,
              status: 'tba',
            });
            hasCustom = true;
          }
        }

        // --- Leather base material note ---
        if (state.baseMaterial) {
          lines.push({
            label: L.baseMaterial(state.baseMaterial),
            amount: null,
            status: 'included',
          });
        }

        // --- Summary ---
        const total = hasCustom ? null : runningTotal;
        const summary = hasCustom
          ? L.subtotalCustom(runningTotal.toFixed(2))
          : L.total(runningTotal.toFixed(2));

        return { area, lines, total, hasCustomItems: hasCustom, summary };
      },

      // =====================================================================
      // SELECTOR: getValidationErrors
      // Returns a list of issues with the current configuration.
      // =====================================================================
      getValidationErrors: (): string[] => {
        const s = get();
        const V = msg(s.uiLocale).validation;
        const errors: string[] = [];

        if (s.width === null || s.height === null) {
          errors.push(V.widthHeight);
        }
        if (s.width !== null && s.width <= 0) errors.push(V.widthPositive);
        if (s.height !== null && s.height <= 0) errors.push(V.heightPositive);

        if (!s.selectedFrameCode) {
          errors.push(V.selectFrame);
        } else {
          const frame = findFrame(s.selectedFrameCode);
          if (frame) {
            const { disabled, reason } = checkFrameFitsSize(frame, s.width, s.height);
            if (disabled && reason)
              errors.push(V.frameNoFit(frame.code, reason));
          }
        }

        if (!s.selectedFinishCategory) errors.push(V.selectFinishCategory);
        if (!s.selectedFinishColorCode) errors.push(V.selectFinishColor);
        if (!s.selectedFillerCode) errors.push(V.selectFiller);

        const frame = findFrame(s.selectedFrameCode);
        if (frame && frameUsesHandleColorStep(frame)) {
          const choices = getMatchedHandles(frame);
          const mustPickFromGrid =
            frame.handleWorkflow === 'separate' ||
            frame.handleWorkflow === 'legacy_catalog' ||
            (frame.handleWorkflow === 'cnc' && frame.handleOptions.length > 1);
          if (mustPickFromGrid && choices.length > 0 && !s.selectedHandleCode) {
            errors.push(V.selectHandle);
          }
          if (
            (frame.handleWorkflow === 'cnc' && frame.handleOptions.length === 0) ||
            frame.handleWorkflow === 'fixed'
          ) {
            if (!s.selectedHandleCode) errors.push(V.selectHandle);
          }
          if (s.selectedHandleCode) {
            const h = handleList.find((x) => x.code === s.selectedHandleCode);
            const allowed = h ? effectiveHandleAllowedColorSet(h, frame) : new Set<string>();
            if (allowed.size > 0 && !s.selectedHandleColor) {
              errors.push(V.selectHandleColor);
            }
          }
        }

        if (frame && frameShowsHandleMountPanel(frame)) {
          const h = s.height;
          const b = s.handleBottomMm;
          if (h == null || b == null) {
            errors.push(V.handleMountFill);
          } else {
            if (frame.handleWorkflow === 'separate') {
              const half = 80;
              if (b < 200) errors.push(V.handleMountBottomMinSeparate);
              if (b + half > h - 120) errors.push(V.handleMountTopClearance);
            } else {
              if (b < 50) errors.push(V.handleMountBottomMin50);
            }
            if (frame.handleWorkflow === 'cnc' && !s.handleCncFullLength) {
              const len = s.handleLengthMm;
              if (len == null || len < 50) errors.push(V.handleMountLength);
            }
          }
        }

        const hingeCalc = get().getHingeCalculation();
        if (
          frame?.matchedHardware &&
          hingeCalc.matchedHardware.length > 0 &&
          !hingeCalc.usePivot &&
          hingeCalc.availableColors.length > 0 &&
          !s.selectedHingeColor
        ) {
          errors.push(V.selectHingeColor);
        }
        return errors;
      },

      // =====================================================================
      // SELECTOR: getConfigurationSku
      // Frame + infill + surface finish (Excel process/color code) + handle +
      // hinge (hardware code + color) + W×H (mm).
      // =====================================================================
      getConfigurationSku: (): string | null => {
        const s = get();
        const {
          width,
          height,
          selectedFrameCode,
          selectedFillerCode,
          selectedFinishColorCode,
          selectedHandleCode,
          selectedHingeColor,
        } = s;
        if (!width || !height || !selectedFrameCode || !selectedFillerCode) return null;
        const frame = findFrame(selectedFrameCode);
        if (!frame) return null;

        const finishParsed = parseFinishColorSelectionId(selectedFinishColorCode);
        if (!finishParsed) return null;
        const finishSeg = finishProcessSkuSegment(finishParsed);

        let handleSeg = 'NOHNDL';
        const wf = frame.handleWorkflow;
        if (wf === 'none') {
          handleSeg = 'NOHNDL';
        } else if (wf === 'vshape') {
          handleSeg = skuSanitize(frame.fixedHandleCode ?? 'VSHAPE');
        } else if (selectedHandleCode && s.selectedHandleColor) {
          handleSeg = `${skuSanitize(selectedHandleCode)}${skuSanitize(s.selectedHandleColor)}`;
        } else if (wf === 'legacy_catalog' && frame.matchedHandle) {
          const matchedHandles = handleList.filter((h) => isHandleMatchedToFrame(h, frame));
          if (matchedHandles.length > 0) {
            return null;
          }
          handleSeg = skuSanitize(frame.matchedHandle);
        } else {
          return null;
        }

        const hingeCalc = get().getHingeCalculation();
        let hingeSeg = 'NOHW';
        if (hingeCalc.usePivot) {
          const pivotHw = hardwareList.find((hw) =>
            hw.name.toLowerCase().includes('pivot'),
          );
          const c = pivotHw?.code != null ? String(pivotHw.code) : 'PIVOT';
          hingeSeg = `${skuSanitize(c)}PIVOT`;
        } else if (frame.matchedHardware && hingeCalc.matchedHardware.length > 0) {
          if (!selectedHingeColor) return null;
          const hw = hingeCalc.effectiveHardware ?? hingeCalc.matchedHardware[0];
          const hwCode = hw.code != null ? String(hw.code) : skuSanitize(hw.name);
          hingeSeg = `${skuSanitize(hwCode)}${skuSanitize(selectedHingeColor)}`;
        } else if (frame.matchedHardware && selectedHingeColor) {
          hingeSeg = `HW${skuSanitize(selectedHingeColor)}`;
        }

        const dim = `${String(width).padStart(4, '0')}x${String(height).padStart(4, '0')}`;
        return `G-${frame.code}-${selectedFillerCode}-${finishSeg}-${handleSeg}-${hingeSeg}-${dim}`;
      },

      // =====================================================================
      // SELECTOR: getGeneratedSku — 5-part code, empty → 000 (user-facing)
      // =====================================================================
      getGeneratedSku: (): string => {
        const s = get();
        const fr = findFrame(s.selectedFrameCode);
        const frame = fr?.code ?? s.selectedFrameCode ?? '000';
        const fin = parseFinishColorSelectionId(s.selectedFinishColorCode);
        const finishSeg =
          fin?.excelCode && String(fin.excelCode).trim() !== ''
            ? String(fin.excelCode).trim()
            : '000';
        const filler = s.selectedFillerCode ?? '000';
        let handle = '000';
        const wf = fr?.handleWorkflow;
        if (wf === 'none') {
          handle = '000';
        } else if (wf === 'vshape') {
          handle = skuSanitize(fr?.fixedHandleCode ?? 'VSHAPE');
        } else if (s.selectedHandleCode) {
          handle = skuSanitize(s.selectedHandleCode);
          if (s.selectedHandleColor) {
            handle = `${handle}-${skuSanitize(s.selectedHandleColor)}`;
          }
        } else if (fr?.matchedHandle) {
          handle = skuSanitize(fr.matchedHandle);
        } else if (fr?.fixedHandleCode) {
          handle = skuSanitize(fr.fixedHandleCode);
        }
        const hingeCalc = get().getHingeCalculation();
        let hinge = '000';
        if (hingeCalc.matchedHardware.length > 0) {
          const hw = hingeCalc.effectiveHardware ?? hingeCalc.matchedHardware[0];
          hinge = hw.code != null
            ? skuSanitize(String(hw.code))
            : skuSanitize(hw.name);
          if (s.selectedHingeColor) {
            hinge = `${hinge}-${skuSanitize(s.selectedHingeColor)}`;
          }
        } else if (hingeCalc.usePivot) {
          const pivotHw = hardwareList.find((hw) => hw.name.toLowerCase().includes('pivot'));
          hinge = pivotHw?.code != null ? skuSanitize(String(pivotHw.code)) : 'PIVOT';
        }
        return [frame, finishSeg, filler, handle, hinge].join('-');
      },

      // =====================================================================
      // SELECTOR: getHandleColorOptions
      // =====================================================================
      getHandleColorOptions: (): HandleColorOption[] => {
        const frame = findFrame(get().selectedFrameCode);
        const handle = handleList.find((h) => h.code === get().selectedHandleCode);
        if (!frame || !handle || !frameUsesHandleColorStep(frame)) return [];
        return handleColorOptionRows(handle, frame);
      },

      // =====================================================================
      // SELECTOR: getQuotationSnapshot
      // =====================================================================
      // =====================================================================
      // SELECTOR: getCartTotal
      // =====================================================================
      getCartTotal: () => {
        const items = get().cartItems;
        let total: number | null = 0;
        let count = 0;
        for (const item of items) {
          count += item.quantity;
          if (item.lineTotal !== null && total !== null) total += item.lineTotal;
          else total = null;
        }
        return { count, total };
      },

      // =====================================================================
      // SELECTOR: getQuotationSnapshot
      // =====================================================================
      getQuotationSnapshot: (): QuotationSnapshot => {
        const s = get();
        const L = msg(s.uiLocale);
        const frame = findFrame(s.selectedFrameCode);
        const fin = parseFinishColorSelectionId(s.selectedFinishColorCode);
        const filler = findFillerByCode(s.selectedFillerCode);
        const handle = handleList.find((h) => h.code === s.selectedHandleCode);
        const hingeCalc = get().getHingeCalculation();
        const price = get().getPriceBreakdown();

        const w = s.width;
        const h = s.height;
        const area =
          w != null && h != null && w > 0 && h > 0
            ? Math.round((w / 1000) * (h / 1000) * 100) / 100
            : null;

        let hingeQtyLabel = '—';
        if (hingeCalc.usePivot) hingeQtyLabel = L.hingePivot;
        else if (hingeCalc.qty > 0) hingeQtyLabel = L.hingeEach(hingeCalc.qty);

        const hw0 = hingeCalc.effectiveHardware ?? hingeCalc.matchedHardware[0];

        return {
          widthMm: w,
          heightMm: h,
          areaM2: area,
          frameCode: frame?.code ?? null,
          frameDoorType: frame?.doorType ?? null,
          finishName: fin?.name ?? null,
          finishExcelCode: fin?.excelCode ?? null,
          finishCategory: fin?.category ?? s.selectedFinishCategory,
          fillerCode: s.selectedFillerCode,
          fillerName: filler?.name ?? null,
          handleCode:
            s.selectedHandleCode ??
            frame?.fixedHandleCode ??
            frame?.matchedHandle ??
            null,
          handleName:
            handle?.name ?? frame?.fixedHandleCode ?? frame?.matchedHandle ?? null,
          handleColor: s.selectedHandleColor,
          handleBottomMm: s.handleBottomMm,
          handleLengthMm: s.handleLengthMm,
          handleCncFullLength: s.handleCncFullLength,
          hingeHardwareCode: hw0?.code != null ? String(hw0.code) : null,
          hingeHardwareName: hw0?.name ?? frame?.matchedHardware ?? null,
          hingeQtyLabel,
          hingeColor: s.selectedHingeColor,
          generatedSku: get().getGeneratedSku(),
          fullConfigSku: get().getConfigurationSku(),
          priceLines: price.lines,
          total: price.total,
          hasCustomItems: price.hasCustomItems,
          summary: price.summary,
        };
      },
    }),
    { name: 'GainerConfigurator' },
  ),
);

// =============================================================================
// Convenience Selector Hooks (standalone, for component usage)
// =============================================================================

export const useWidth = () => useConfiguratorStore((s) => s.width);
export const useHeight = () => useConfiguratorStore((s) => s.height);
export const useSelectedFrameCode = () => useConfiguratorStore((s) => s.selectedFrameCode);
export const useSelectedFinishCategory = () => useConfiguratorStore((s) => s.selectedFinishCategory);
export const useSelectedFinishColorCode = () => useConfiguratorStore((s) => s.selectedFinishColorCode);
export const useSelectedFillerType = () => useConfiguratorStore((s) => s.selectedFillerType);
export const useSelectedFillerCode = () => useConfiguratorStore((s) => s.selectedFillerCode);
export const useLockedFillerThickness = () => useConfiguratorStore((s) => s.lockedFillerThickness);
export const useBaseMaterial = () => useConfiguratorStore((s) => s.baseMaterial);
export const useSelectedHandleCode = () => useConfiguratorStore((s) => s.selectedHandleCode);
export const useSelectedHingeColor = () => useConfiguratorStore((s) => s.selectedHingeColor);
export const useUiLocale = () => useConfiguratorStore((s) => s.uiLocale);
export const useSetUiLocale = () => useConfiguratorStore((s) => s.setUiLocale);
export const useSelectedHandleColor = () => useConfiguratorStore((s) => s.selectedHandleColor);
export const useConfigurationConfirmed = () =>
  useConfiguratorStore((s) => s.configurationConfirmed);
