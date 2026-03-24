import type { FinishCategory, FillerType } from './useConfiguratorStore';

export type UiLocale = 'zh' | 'en';

export const UI_LOCALES: UiLocale[] = ['zh', 'en'];

const M = {
  zh: {
    appTitle: 'Gainer 铝框门',
    appSubtitle: '按步骤配置您的门板。选项已与门框参数联动。',
    langZh: '中文',
    langEn: 'English',
    language: '语言',
    stepPrefix: '步骤',

    stepDimensionsTitle: '门板尺寸',
    stepDimensionsSubtitle: '请先输入宽度 W 与高度 H（毫米）。后续门框与填充物将按此尺寸校验。',
    widthLabel: '宽度 W (mm)',
    heightLabel: '高度 H (mm)',
    widthPlaceholder: '例如 600',
    heightPlaceholder: '例如 2200',

    stepFrameTitle: '门框型材',
    stepFrameSubtitle: '不符合当前 W×H 的门框已置灰，且不可选择。',

    stepSurfaceTitle: '表面处理',
    stepSurfaceSubtitle: '先选工艺大类，再选具体颜色。与门框不兼容的类别与色样已置灰。',
    finishCategoryLabel: '工艺大类',
    finishColorLabel: '颜色',
    pickFinishCategoryFirst: '请先选择工艺大类。',

    stepFillerTitle: '填充物',
    stepFillerSubtitle: '材质需与门型匹配；玻璃厚度由门框锁定，不兼容的玻璃已置灰。',
    fillerCategoryLabel: '材质大类',
    pickFillerCategoryFirst: '请先选择材质大类。',
    thicknessLocked: (mm: number) => `厚度锁定 ${mm} mm`,
    leatherBasePrefix: '基材（皮革）：',
    lockedThicknessPrefix: '当前锁定厚度：',

    stepHandleTitle: '拉手',
    stepHandleSubtitleMatch: (spec: string) => `当前门框指定拉手规格：${spec}`,
    stepHandleSubtitleNone: '当前门框无需选择拉手。',
    stepHandleSkip: '此步骤可跳过。',

    stepHingeTitle: '铰链',
    stepHingeSubtitlePivot: '请按提示选用天地轴（Pivot）方案。',
    stepHingeSubtitleMatch: (hw: string) => `五金：${hw}`,
    stepHingeSubtitleNone: '当前门框未指定铰链条目时可跳过颜色。',
    hingeColorLabel: '铰链颜色',
    hingeColorSkip: '无需选择铰链颜色。',
    hingeQtyLabel: '铰链数量',
    hingePivot: '天地轴（Pivot）',
    hingeEach: (n: number) => `${n} 只`,
    totalLabel: '合计',
    areaLabel: (a: string) => `展开面积 ${a}`,
    customPricingNote: '价格计算中包含定制项，需联系客服',
    completeForPricing: '请完成全部选项以查看价格。',
    skuLabel: 'SKU',
    skuIncomplete: '完成尺寸、型材、填充、拉手与铰链选项后生成',

    disabledMismatch: '与当前门框参数不匹配',

    finish: {
      anodize: '阳极氧化',
      spraySoftTouch: '亲肤喷涂',
      sprayMetallic: '金属喷涂',
    } satisfies Record<FinishCategory, string>,

    filler: {
      glass: '玻璃',
      leather: '皮革',
      woodVeneer: '木皮',
      quartzStone: '岩板',
    } satisfies Record<FillerType, string>,

    pivotWarning:
      '门高超过 2500 mm，需采用天地轴（Pivot）铰链，不再使用标准铰链数量规则。',

    price: {
      empty: '请完成全部选项以查看价格。',
      frameGlass: (f: string, g: string) => `门框 (${f}) + 玻璃 (${g})`,
      frameFiller: (f: string, g: string) => `门框 (${f}) + 填充 (${g})`,
      frameAwaitFiller: (f: string) => `门框 (${f}) — 待选填充物`,
      hingeLine: (name: string, qty: number) => `${name} × ${qty}`,
      pivotSet: (name: string) => `${name}（天地轴套装）`,
      pivotGeneric: '天地轴铰链',
      baseMaterial: (b: string) => `基材：${b}`,
      subtotalCustom: (n: string) => `小计：¥${n} + 定制项（另议）— 请联系销售。`,
      total: (n: string) => `合计：¥${n}`,
    },

    validation: {
      widthHeight: '请输入门板宽度 W 与高度 H。',
      widthPositive: '宽度须为正数。',
      heightPositive: '高度须为正数。',
      selectFrame: '请选择门框型材。',
      frameNoFit: (code: string, reason: string) => `门框 ${code} 不适用：${reason}`,
      selectFinishCategory: '请选择表面处理大类。',
      selectFinishColor: '请选择表面颜色。',
      selectFiller: '请选择填充物。',
      selectHandle: '请选择拉手。',
      selectHingeColor: '请选择铰链颜色。',
    },
  },
  en: {
    appTitle: 'Gainer Aluminum Frame Doors',
    appSubtitle: 'Configure your door step by step. Options are filtered from your frame and size.',
    langZh: '中文',
    langEn: 'English',
    language: 'Language',
    stepPrefix: 'Step',

    stepDimensionsTitle: 'Door size',
    stepDimensionsSubtitle: 'Enter width W and height H in millimeters first. Frame and filler options validate against these dimensions.',
    widthLabel: 'Width W (mm)',
    heightLabel: 'Height H (mm)',
    widthPlaceholder: 'e.g. 600',
    heightPlaceholder: 'e.g. 2200',

    stepFrameTitle: 'Frame profile',
    stepFrameSubtitle: 'Frames that do not fit the current W×H are dimmed and cannot be selected.',

    stepSurfaceTitle: 'Surface finish',
    stepSurfaceSubtitle: 'Choose a finish family, then a color. Incompatible options are dimmed.',
    finishCategoryLabel: 'Finish family',
    finishColorLabel: 'Color',
    pickFinishCategoryFirst: 'Select a finish family first.',

    stepFillerTitle: 'Infill',
    stepFillerSubtitle: 'Material must match the door type; glass thickness is constrained by the frame profile.',
    fillerCategoryLabel: 'Material family',
    pickFillerCategoryFirst: 'Select a material family first.',
    thicknessLocked: (mm: number) => `Thickness locked: ${mm} mm`,
    leatherBasePrefix: 'Leather substrate: ',
    lockedThicknessPrefix: 'Locked thickness: ',

    stepHandleTitle: 'Handle',
    stepHandleSubtitleMatch: (spec: string) => `Handle specification for this frame: ${spec}`,
    stepHandleSubtitleNone: 'No handle selection is required for this frame.',
    stepHandleSkip: 'You can skip this step.',

    stepHingeTitle: 'Hinge',
    stepHingeSubtitlePivot: 'Use a pivot hinge set as indicated below.',
    stepHingeSubtitleMatch: (hw: string) => `Hardware: ${hw}`,
    stepHingeSubtitleNone: 'You can skip hinge color if the frame does not specify hardware.',
    hingeColorLabel: 'Hinge color',
    hingeColorSkip: 'No hinge color selection needed.',
    hingeQtyLabel: 'Hinge qty',
    hingePivot: 'Pivot hinge',
    hingeEach: (n: number) => `${n} pcs`,
    totalLabel: 'Total',
    areaLabel: (a: string) => `Area ${a}`,
    customPricingNote: 'Estimate includes custom items — contact sales',
    completeForPricing: 'Complete all steps to see pricing.',
    skuLabel: 'SKU',
    skuIncomplete: 'Complete size, frame, infill, handle, and hinge selections to generate',

    disabledMismatch: 'Does not match current frame constraints',

    finish: {
      anodize: 'Anodize',
      spraySoftTouch: 'Spray soft-touch',
      sprayMetallic: 'Spray metallic',
    } satisfies Record<FinishCategory, string>,

    filler: {
      glass: 'Glass',
      leather: 'Leather',
      woodVeneer: 'Wood veneer',
      quartzStone: 'Quartz / sintered stone',
    } satisfies Record<FillerType, string>,

    pivotWarning:
      'Door height exceeds 2500 mm — a pivot hinge is required instead of standard hinge counts.',

    price: {
      empty: 'Complete all selections to see pricing.',
      frameGlass: (f: string, g: string) => `Frame (${f}) + glass (${g})`,
      frameFiller: (f: string, g: string) => `Frame (${f}) + infill (${g})`,
      frameAwaitFiller: (f: string) => `Frame (${f}) — select infill`,
      hingeLine: (name: string, qty: number) => `${name} × ${qty}`,
      pivotSet: (name: string) => `${name} (pivot set)`,
      pivotGeneric: 'Pivot hinge',
      baseMaterial: (b: string) => `Substrate: ${b}`,
      subtotalCustom: (n: string) => `Subtotal: ¥${n} + custom (TBA) — contact sales.`,
      total: (n: string) => `Total: ¥${n}`,
    },

    validation: {
      widthHeight: 'Enter door width W and height H.',
      widthPositive: 'Width must be positive.',
      heightPositive: 'Height must be positive.',
      selectFrame: 'Select a frame profile.',
      frameNoFit: (code: string, reason: string) => `Frame ${code} does not fit: ${reason}`,
      selectFinishCategory: 'Select a surface finish family.',
      selectFinishColor: 'Select a finish color.',
      selectFiller: 'Select an infill material.',
      selectHandle: 'Select a handle.',
      selectHingeColor: 'Select a hinge color.',
    },
  },
} as const;

export function msg(locale: UiLocale) {
  return M[locale];
}

const LOCALE_STORAGE_KEY = 'gainer-ui-locale';

export function readStoredLocale(): UiLocale {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (v === 'en' || v === 'zh') return v;
  } catch {
    /* ignore */
  }
  return 'zh';
}

export function writeStoredLocale(locale: UiLocale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
