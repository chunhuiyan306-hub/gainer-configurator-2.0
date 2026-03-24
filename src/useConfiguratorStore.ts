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

export interface HingeCalculation {
  qty: number;
  usePivot: boolean;
  pivotWarning: string | null;
  availableColors: string[];
  matchedHardware: Hardware[];
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

// =============================================================================
// Standard Glass Pricing Map (frame code → sqm price by glass tier)
//
// Extracted from the original Excel "price" column. These are *combined*
// frame + standard-glass prices. Frames not listed here have per-piece
// or TBA pricing and fall through to the custom branch.
// =============================================================================

interface FrameGlassPricing {
  normalGlass: number | null;
  blackGlass: number | null;
  coatedGlass: number | null;
}

const STANDARD_GLASS_CODES = new Set(['G01', 'G33', 'G36']);

const frameGlassPriceMap: Record<string, FrameGlassPricing> = {
  GM004:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  GM090:  { normalGlass: 380,  blackGlass: 460,  coatedGlass: 530  },
  GM023:  { normalGlass: 480,  blackGlass: 560,  coatedGlass: 630  },
  MK118:  { normalGlass: 580,  blackGlass: 660,  coatedGlass: 730  },
  MK336:  { normalGlass: 850,  blackGlass: 930,  coatedGlass: 1000 },
  GM054:  { normalGlass: 580,  blackGlass: 660,  coatedGlass: 730  },
  MK162:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  GM106:  { normalGlass: 580,  blackGlass: 660,  coatedGlass: 730  },
  MK169:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  MK073:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  GM073:  { normalGlass: 780,  blackGlass: 860,  coatedGlass: 930  },
  GM072:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  MK304:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  GM060:  { normalGlass: 580,  blackGlass: 660,  coatedGlass: 730  },
  GM043:  { normalGlass: 680,  blackGlass: 760,  coatedGlass: 830  },
  GM094:  { normalGlass: 380,  blackGlass: 460,  coatedGlass: 530  },
};

function resolveStandardGlassPrice(
  frameCode: string,
  glassCode: string,
): number | null {
  const tier = frameGlassPriceMap[frameCode];
  if (!tier) return null;
  if (glassCode === 'G01') return tier.normalGlass;
  if (glassCode === 'G33') return tier.normalGlass;
  if (glassCode === 'G36') return tier.blackGlass;
  return null;
}

// =============================================================================
// Store State Interface
// =============================================================================

interface ConfiguratorState {
  uiLocale: UiLocale;

  // --- Step 1: Dimensions ---
  width: number | null;
  height: number | null;

  // --- Step 2: Frame ---
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

  // --- Step 6: Hinge ---
  selectedHingeColor: string | null;
}

// =============================================================================
// Store Actions Interface
// =============================================================================

interface ConfiguratorActions {
  setUiLocale: (locale: UiLocale) => void;
  setDimensions: (w: number | null, h: number | null) => void;
  selectFrame: (code: string | null) => void;
  selectFinishCategory: (category: FinishCategory | null) => void;
  selectFinishColor: (code: string | null) => void;
  selectFillerType: (type: FillerType | null) => void;
  selectFiller: (code: string | null) => void;
  selectHandle: (code: string | null) => void;
  selectHingeColor: (color: string | null) => void;
  reset: () => void;
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
}

// Combine into full store type
export type ConfiguratorStore = ConfiguratorState & ConfiguratorActions & ConfiguratorSelectors;

// =============================================================================
// Initial State
// =============================================================================

const initialState: ConfiguratorState = {
  uiLocale: readStoredLocale(),
  width: null,
  height: null,
  selectedFrameCode: null,
  selectedFinishCategory: null,
  selectedFinishColorCode: null,
  selectedFillerType: null,
  selectedFillerCode: null,
  lockedFillerThickness: null,
  baseMaterial: null,
  selectedHandleCode: null,
  selectedHingeColor: null,
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
  selectedHingeColor: null,
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

function findFrame(code: string | null): Frame | null {
  if (!code) return null;
  const found = frames.find((f) => f.code === code);
  return found ?? null;
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
  if (!frame.matchedHandle) return false;
  const raw = frame.matchedHandle.toLowerCase();
  const tokens = raw.split(/[\n/]/).map((s) => s.trim()).filter(Boolean);
  const hCode = handle.code.toLowerCase();
  const hName = handle.name.toLowerCase();
  return tokens.some(
    (t) => t === hCode || t === hName || hCode.includes(t) || t.includes(hCode),
  );
}

// =============================================================================
// Hardware Matching Helper
// =============================================================================

function findMatchedHardware(frame: Frame): Hardware[] {
  if (!frame.matchedHardware) return [];
  const raw = frame.matchedHardware.toLowerCase();
  return hardwareList
    .filter((hw) => {
      const name = hw.name.toLowerCase();
      return raw.includes(name) || name.split(/[/(]/).some((part) => {
        const p = part.trim();
        return p.length > 3 && raw.includes(p);
      });
    })
    ;
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
        set(updates, undefined, 'setDimensions');
      },

      // =====================================================================
      // ACTION: selectFrame
      // Selects a frame and CASCADE CLEARS all downstream state.
      // =====================================================================
      selectFrame: (code) => {
        const state = get();
        if (code === state.selectedFrameCode) return;

        if (!code) {
          set({ selectedFrameCode: null, ...clearFromFinish }, undefined, 'selectFrame/clear');
          return;
        }

        const frame = findFrame(code);
        if (!frame) return;

        const { disabled } = checkFrameFitsSize(frame, state.width, state.height);
        if (disabled) return;

        set(
          { selectedFrameCode: code, ...clearFromFinish },
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
          { selectedFinishCategory: category, selectedFinishColorCode: null },
          undefined,
          'selectFinishCategory',
        );
      },

      // =====================================================================
      // ACTION: selectFinishColor
      // =====================================================================
      selectFinishColor: (code) => {
        set({ selectedFinishColorCode: code }, undefined, 'selectFinishColor');
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
            { selectedFillerCode: null, lockedFillerThickness: null, baseMaterial: null },
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
          },
          undefined,
          'selectFiller',
        );
      },

      // =====================================================================
      // ACTION: selectHandle
      // =====================================================================
      selectHandle: (code) => {
        set({ selectedHandleCode: code }, undefined, 'selectHandle');
      },

      // =====================================================================
      // ACTION: selectHingeColor
      // =====================================================================
      selectHingeColor: (color) => {
        set({ selectedHingeColor: color }, undefined, 'selectHingeColor');
      },

      // =====================================================================
      // ACTION: reset
      // =====================================================================
      reset: () => {
        const locale = get().uiLocale;
        set({ ...initialState, uiLocale: locale }, undefined, 'reset');
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
          if (!frame.matchedHandle) return { handle, disabled: true };
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
        const { height } = get();
        const frame = findFrame(get().selectedFrameCode);

        if (!height || !frame) {
          return {
            qty: 0,
            usePivot: false,
            pivotWarning: null,
            availableColors: [],
            matchedHardware: [],
          };
        }

        let qty: number;
        let usePivot = false;
        let pivotWarning: string | null = null;

        if (height <= 2000) {
          qty = 2;
        } else if (height <= 2500) {
          qty = 4;
        } else {
          qty = 0;
          usePivot = true;
          pivotWarning = msg(get().uiLocale).pivotWarning;
        }

        const matched = findMatchedHardware(frame);
        const availableColors = frame.hardwareColors.length > 0
          ? [...frame.hardwareColors]
          : ['black', 'gray', 'gold'];

        return { qty, usePivot, pivotWarning, availableColors, matchedHardware: matched };
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
          const isStandard = STANDARD_GLASS_CODES.has(selectedFillerCode);
          if (isStandard) {
            const sqmPrice = resolveStandardGlassPrice(selectedFrameCode, selectedFillerCode);
            if (sqmPrice !== null) {
              const lineTotal = Math.round(area * sqmPrice * 100) / 100;
              lines.push({
                label: L.frameGlass(selectedFrameCode, selectedFillerCode),
                amount: lineTotal,
                status: 'calculated',
              });
              runningTotal += lineTotal;
            } else {
              lines.push({
                label: L.frameGlass(selectedFrameCode, selectedFillerCode),
                amount: null,
                status: 'tba',
              });
              hasCustom = true;
            }
          } else {
            lines.push({
              label: L.frameFiller(selectedFrameCode, selectedFillerCode),
              amount: null,
              status: 'tba',
            });
            hasCustom = true;
          }
        } else if (selectedFrameCode) {
          lines.push({
            label: L.frameAwaitFiller(selectedFrameCode),
            amount: null,
            status: 'tba',
          });
          hasCustom = true;
        }

        // --- Hardware / Hinge price ---
        const hingeCalc = get().getHingeCalculation();
        if (hingeCalc.matchedHardware.length > 0 && hingeCalc.qty > 0) {
          const hw = hingeCalc.matchedHardware[0];
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
              errors.push(V.frameNoFit(s.selectedFrameCode, reason));
          }
        }

        if (!s.selectedFinishCategory) errors.push(V.selectFinishCategory);
        if (!s.selectedFinishColorCode) errors.push(V.selectFinishColor);
        if (!s.selectedFillerCode) errors.push(V.selectFiller);

        const frame = findFrame(s.selectedFrameCode);
        if (frame?.matchedHandle && !s.selectedHandleCode) {
          errors.push(V.selectHandle);
        }
        if (frame?.matchedHardware && !s.selectedHingeColor) {
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
        if (frame.matchedHandle) {
          if (!selectedHandleCode) return null;
          handleSeg = skuSanitize(selectedHandleCode);
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
          const hw = hingeCalc.matchedHardware[0];
          const hwCode = hw.code != null ? String(hw.code) : skuSanitize(hw.name);
          hingeSeg = `${skuSanitize(hwCode)}${skuSanitize(selectedHingeColor)}`;
        }

        const dim = `${String(width).padStart(4, '0')}x${String(height).padStart(4, '0')}`;
        return `G-${selectedFrameCode}-${selectedFillerCode}-${finishSeg}-${handleSeg}-${hingeSeg}-${dim}`;
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
