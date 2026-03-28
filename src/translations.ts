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

    stepDimensionsTitle: '门板尺寸与数量',
    stepDimensionsSubtitle: '请先输入宽度 W 与高度 H（毫米），并填写数量。后续门框与填充物将按此尺寸校验。',
    widthLabel: '宽度 W (mm)',
    heightLabel: '高度 H (mm)',
    widthPlaceholder: '例如 600',
    heightPlaceholder: '例如 2200',
    qtyLabel: '数量',
    qtyUnit: '扇',

    stepFrameTitle: '门框型材',
    stepFrameSubtitle: '不符合当前 W×H 的门框已置灰，且不可选择。',
    frameSectionCabinet: '柜门',
    frameSectionRoom: '房门',
    frameDoorThickness: (d: number) => `门厚 ${d} mm`,
    frameProfilePrefix: '型材规格：',
    frameMountingInsert: '安装：卡槽（Insert）',
    frameMountingCover: '安装：贴面（Cover）',
    frameBtnSideView: '侧视图',
    frameBtnProfile: '型材照片',
    imagePreviewClose: '关闭',
    hingeCodesLabel: '铰链编码',
    hingePictureSheetLabel: '铰链示意图（资料表）',
    hingePickVariantHint: '请点选一款铰链（多款可选时以所选为准）。',

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
    skuIncomplete: '完成全部必填项（含拉手颜色）后显示完整 SKU',
    generatedSkuLabel: '配置编码（五段式）',
    fullSkuLabel: '完整 SKU（含尺寸）',
    quotationTitle: '配置确认与报价单',
    quotationSubtitle: '核对下列参数与金额；确认后可用于下单与报价存档。',
    tblItem: '项目',
    tblSpec: '规格 / 编码',
    tblLinePrice: '分项',
    confirmConfiguration: '确认配置',
    resetSelection: '重新选择',
    confirmBlocked: '请先完成所有必填选项，再点击确认。',
    configurationConfirmed: '已确认配置',
    handleColorLabel: '拉手颜色',
    handleColorHint:
      '与门框表面处理接近的颜色会自动选中；不支持的颜色已置灰。',

    addToCart: '加入订单',
    addToCartSuccess: '已加入订单，可继续配置下一款',
    cartTitle: '订单列表',
    cartEmpty: '暂无订单项',
    cartTotal: '订单总计',
    cartClearAll: '清空全部',
    cartRemove: '移除',
    cartUnitPrice: '单价',
    cartQty: '数量',
    cartItemCount: (n: number) => `${n} 项`,
    configChips: '当前配置',

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
      selectHandleColor: '请选择拉手颜色。',
      selectHingeColor: '请选择铰链颜色。',
      selectHingeHardware: '请选择铰链型号。',
    },
    q: {
      width: '宽度 W',
      height: '高度 H',
      area: '展开面积',
      frame: '门框型材',
      finish: '表面处理',
      filler: '填充物',
      handle: '拉手',
      handleColor: '拉手颜色',
      hinge: '铰链五金',
      hingeQty: '铰链数量',
      hingeColor: '铰链颜色',
    },
  },
  en: {
    appTitle: 'Gainer Aluminum Frame Doors',
    appSubtitle: 'Configure your door step by step. Options are filtered from your frame and size.',
    langZh: '中文',
    langEn: 'English',
    language: 'Language',
    stepPrefix: 'Step',

    stepDimensionsTitle: 'Door size & quantity',
    stepDimensionsSubtitle: 'Enter width W and height H in millimeters, and the quantity needed. Frame and filler options validate against these dimensions.',
    widthLabel: 'Width W (mm)',
    heightLabel: 'Height H (mm)',
    widthPlaceholder: 'e.g. 600',
    heightPlaceholder: 'e.g. 2200',
    qtyLabel: 'Quantity',
    qtyUnit: 'pcs',

    stepFrameTitle: 'Frame profile',
    stepFrameSubtitle: 'Frames that do not fit the current W×H are dimmed and cannot be selected.',
    frameSectionCabinet: 'Cabinet doors',
    frameSectionRoom: 'Interior / room doors',
    frameDoorThickness: (d: number) => `Door thickness ${d} mm`,
    frameProfilePrefix: 'Profile: ',
    frameMountingInsert: 'Mounting: insert (groove)',
    frameMountingCover: 'Mounting: cover (overlay)',
    frameBtnSideView: 'Side view',
    frameBtnProfile: 'Profile photo',
    imagePreviewClose: 'Close',
    hingeCodesLabel: 'Hinge codes',
    hingePictureSheetLabel: 'Hinge reference (from datasheet)',
    hingePickVariantHint: 'Tap a hinge option below when more than one is listed.',

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
    skuIncomplete: 'Complete all required fields (including handle color) for full SKU',
    generatedSkuLabel: 'Configuration code (5-part)',
    fullSkuLabel: 'Full SKU (with size)',
    quotationTitle: 'Quotation & configuration summary',
    quotationSubtitle: 'Review specs and pricing; use after confirmation for orders and records.',
    tblItem: 'Item',
    tblSpec: 'Spec / code',
    tblLinePrice: 'Line',
    confirmConfiguration: 'Confirm configuration',
    resetSelection: 'Reset',
    confirmBlocked: 'Complete all required selections before confirming.',
    configurationConfirmed: 'Configuration confirmed',
    handleColorLabel: 'Handle color',
    handleColorHint:
      'Color is auto-matched to surface finish when supported; unsupported swatches are dimmed.',

    addToCart: 'Add to order',
    addToCartSuccess: 'Added to order — continue configuring the next door',
    cartTitle: 'Order list',
    cartEmpty: 'No items in order',
    cartTotal: 'Order total',
    cartClearAll: 'Clear all',
    cartRemove: 'Remove',
    cartUnitPrice: 'Unit price',
    cartQty: 'Qty',
    cartItemCount: (n: number) => `${n} item${n !== 1 ? 's' : ''}`,
    configChips: 'Current config',

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
      selectHandleColor: 'Select a handle color.',
      selectHingeColor: 'Select a hinge color.',
      selectHingeHardware: 'Select a hinge model.',
    },
    q: {
      width: 'Width W',
      height: 'Height H',
      area: 'Area',
      frame: 'Frame profile',
      finish: 'Surface finish',
      filler: 'Infill',
      handle: 'Handle',
      handleColor: 'Handle color',
      hinge: 'Hinge hardware',
      hingeQty: 'Hinge qty',
      hingeColor: 'Hinge color',
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
