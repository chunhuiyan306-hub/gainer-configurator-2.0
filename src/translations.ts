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
    stepHandleSubtitleSeparate: '分体拉手：从下方选项中选择款式，再确认安装位置与尺寸。',
    stepHandleSubtitleCnc:
      'CNC 一体铣型拉手：金属色与型材一致，不可单独选拉手色；长度固定 160mm。填写安装位置（默认中心距底 960mm）。',
    stepHandleSubtitleFixed: '拉手款式固定：请确认拉手中心距底高度（下边距门底须大于 50mm）。',
    stepHandleMountTitle: '拉手安装示意与尺寸',
    stepHandleMountHintSeparate:
      '拉手长度固定 160mm。推荐中心距底 960mm；拉手下边距门底须大于 50mm；拉手中心距顶须≥120mm（系统已校验）。',
    stepHandleMountHintCnc:
      '拉手长度固定 160mm（此处为拉手中心距门底；下边距门底须大于 50mm）。推荐中心高度 960mm。',
    stepHandleMountHintFixed: '填写拉手中心距门底；下边距门底须大于 50mm。',
    labelHandleBottomMm: '拉手中心距门底 (mm)',
    labelHandleLengthMm: '拉手长度 (mm)',
    labelCncFullLength: '通长铣型拉手',
    stepHandleLengthFixed160: '拉手长度固定 160mm。',

    stepHingeTitle: '铰链',
    stepHingeSubtitlePivot: '请按提示选用天地轴（Pivot）方案。',
    stepHingeSubtitleMatch: (hw: string) => `五金：${hw}`,
    stepHingeSubtitleNone: '当前门框未指定铰链条目时可跳过颜色。',
    hingeColorLabel: '铰链颜色',
    hingeColorSkip: '无需选择铰链颜色。',
    hingeQtyLabel: '铰链数量',
    hingePivot: '天地轴（Pivot）',
    hingeEach: (n: number) => `${n} 只`,
    hingeSchematicTitle: '铰链与拉手开孔示意（比例示意，非加工图）',
    hingeSegmentD: (i: number) => `D${i + 1}`,
    hingeHoleFromBottom: (i: number) => `铰链 ${i + 1} 距门底 (mm)`,
    hingeFixedAirNote:
      '天地铰链：上下各 1 孔，位于铝框底端与顶端（相对门扇底边为 0 mm 与门高 H），位置固定不可调。',
    hingePinOptionalThird: '加选中间针式铰链（第 3 孔）',
    hingeFloatHint: '相对标配孔每孔可 ±50 mm；铰链中心距门顶、门底均须 ≥50 mm。',
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
    handleColorLabel: '拉手表面处理',
    handleColorHint:
      '仅「阳极氧化」与「金属喷涂」两类；默认与步骤 3 门框颜色一致，可另选色卡。',
    handleFinish: {
      anodize: '阳极氧化',
      metalSpray: '金属喷涂',
    },
    handleFinishCategoryLabel: '拉手工艺大类',
    handleFinishColorLabel: '颜色',
    pickHandleFinishCategoryFirst: '请先选择拉手工艺大类。',
    handleSchematicDoor: '立面示意（比例示意，非下料图）',
    handleSchematicHandle: '黑色条为拉手位置示意，随尺寸变化',
    handleReferencePhoto: '资料参考图',

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
      pet: 'PET',
    } satisfies Record<FinishCategory, string>,

    filler: {
      glass: '玻璃',
      leather: '皮革',
      woodVeneer: '木皮',
      quartzStone: '岩板',
    } satisfies Record<FillerType, string>,

    pivotWarning:
      '门高超过 2500 mm，需采用天地轴（Pivot）铰链，不再使用标准铰链数量规则。',
    pivotWarningBlumCq:
      '当前门高超过 2700 mm：百隆杯式 / Sensys / Salice CQ 铰链按规范需改用天地轴（Pivot）方案，不再使用多铰链分档规则。',

    price: {
      empty: '请完成全部选项以查看价格。',
      roomDoorNoPrice: '房门体系价格待完善，线上不显示金额；请咨询销售获取报价。',
      roomDoorPriceBarHint: '房门：询价',
      frameGlass: (f: string, g: string) => `门框 (${f}) + 玻璃 (${g})`,
      frameFiller: (f: string, g: string) => `门框 (${f}) + 填充 (${g})`,
      frameAwaitFiller: (f: string) => `门框 (${f}) — 待选填充物`,
      hingeLine: (name: string, qty: number) => `${name} × ${qty}`,
      pivotSet: (name: string) => `${name}（天地轴套装）`,
      pivotGeneric: '天地轴铰链',
      baseMaterial: (b: string) => `基材：${b}`,
      subtotalCustom: (n: string) => `小计：¥${n} + 定制项（另议）— 请联系销售。`,
      total: (n: string) => `合计：¥${n}`,
      minBillableAreaNote: (actual: string, billed: string) =>
        `展开面积 ${actual}㎡；不足 0.5㎡ 按 ${billed}㎡ 计费`,
      customGlassLeadTimeHint: '（特殊定制玻璃：在欧洲灰 G33 单价基础上 +¥300/㎡，货期约多 1 周）',
      customGlassTileBadge: '特殊定制 · 货期+约1周',
      petSurfaceLine: 'PET 表面处理（在欧洲灰 G33 平方价基础上 +¥150/㎡）',
      petSurfaceDetail: (billedM2: string, actualM2: string) =>
        `计费 ${billedM2}㎡（展开 ${actualM2}㎡；不足 0.5㎡ 按 0.5㎡）`,
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
      selectHandleColor: '请选择拉手表面颜色（色卡）。',
      selectHingeColor: '请选择铰链颜色。',
      selectHingeHardware: '请选择铰链型号。',
      handleMountFill: '请填写拉手距底高度（需已填门高）。',
      handleMountKickGuard: '为防止撞脚，拉手位置需距离底端大于50mm',
      handleMountTopClearance: '拉手中心距顶部须≥120mm，请调整距底高度或增大门高。',
      hingeAirMaxHeight:
        '天地铰链 / 重型天地铰链：门高须严格小于 2700 mm，请减小高度或更换门框。',
      hingePositionOutOfRange:
        '铰链孔位须距顶、距底各≥50 mm，且相对标配孔上下浮动不超过 ±50 mm。',
      glassNotForAluminumFrame: '该门框型材的报价表不包含此款玻璃（或厚度不匹配），不可选。',
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
    stepHandleSubtitleSeparate: 'Separate handle: pick a variant, then set position and dimensions.',
    stepHandleSubtitleCnc:
      'CNC integrated pull: same metal finish as the frame profile; length fixed 160mm. Set position (default 960mm from bottom).',
    stepHandleSubtitleFixed:
      'Fixed handle style: set handle center height from bottom (lower edge must be >50mm above door bottom).',
    stepHandleMountTitle: 'Handle position & dimensions',
    stepHandleMountHintSeparate:
      'Pull length is fixed at 160mm. Recommended 960mm center from bottom; lower edge >50mm above door bottom; handle center ≥120mm from top (validated).',
    stepHandleMountHintCnc:
      'Pull length is fixed at 160mm (center height from bottom; lower edge must stay >50mm above door bottom). Default center height 960mm.',
    stepHandleMountHintFixed:
      'Enter handle center height from bottom; lower edge must stay >50mm above the door bottom.',
    labelHandleBottomMm: 'Handle center height from bottom (mm)',
    labelHandleLengthMm: 'Handle length (mm)',
    labelCncFullLength: 'Full-length CNC pull',
    stepHandleLengthFixed160: 'Pull length is fixed at 160mm.',

    stepHingeTitle: 'Hinge',
    stepHingeSubtitlePivot: 'Use a pivot hinge set as indicated below.',
    stepHingeSubtitleMatch: (hw: string) => `Hardware: ${hw}`,
    stepHingeSubtitleNone: 'You can skip hinge color if the frame does not specify hardware.',
    hingeColorLabel: 'Hinge color',
    hingeColorSkip: 'No hinge color selection needed.',
    hingeQtyLabel: 'Hinge qty',
    hingePivot: 'Pivot hinge',
    hingeEach: (n: number) => `${n} pcs`,
    hingeSchematicTitle: 'Hinge & handle layout (schematic, not for fabrication)',
    hingeSegmentD: (i: number) => `D${i + 1}`,
    hingeHoleFromBottom: (i: number) => `Hinge ${i + 1} from bottom (mm)`,
    hingeFixedAirNote:
      'Air hinge: one hole at the bottom and one at the top of the aluminum frame (0 mm and door height H from the bottom edge) — fixed, not adjustable.',
    hingePinOptionalThird: 'Add optional middle pin hinge (3rd hole)',
    hingeFloatHint: '±50 mm vs standard hole each; hinge center must be ≥50 mm from top and bottom.',
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
    handleColorLabel: 'Handle surface finish',
    handleColorHint:
      'Only anodize and metal spray; defaults to the door finish from Step 3 — pick another swatch if needed.',
    handleFinish: {
      anodize: 'Anodize',
      metalSpray: 'Metal spray',
    },
    handleFinishCategoryLabel: 'Handle finish family',
    handleFinishColorLabel: 'Color',
    pickHandleFinishCategoryFirst: 'Select a handle finish family first.',
    handleSchematicDoor: 'Front elevation (schematic scale, not for fabrication)',
    handleSchematicHandle: 'Bar shows pull position; updates as dimensions change',
    handleReferencePhoto: 'Reference photo',

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
      pet: 'PET',
    } satisfies Record<FinishCategory, string>,

    filler: {
      glass: 'Glass',
      leather: 'Leather',
      woodVeneer: 'Wood veneer',
      quartzStone: 'Quartz / sintered stone',
    } satisfies Record<FillerType, string>,

    pivotWarning:
      'Door height exceeds 2500 mm — a pivot hinge is required instead of standard hinge counts.',
    pivotWarningBlumCq:
      'Door height exceeds 2700 mm — Blum cup / Sensys / Salice CQ layouts switch to a pivot hinge set (no multi-hinge banding per datasheet).',

    price: {
      empty: 'Complete all selections to see pricing.',
      roomDoorNoPrice:
        'Interior door pricing is not shown online yet. Contact sales for a formal quote.',
      roomDoorPriceBarHint: 'Interior door — request quote',
      frameGlass: (f: string, g: string) => `Frame (${f}) + glass (${g})`,
      frameFiller: (f: string, g: string) => `Frame (${f}) + infill (${g})`,
      frameAwaitFiller: (f: string) => `Frame (${f}) — select infill`,
      hingeLine: (name: string, qty: number) => `${name} × ${qty}`,
      pivotSet: (name: string) => `${name} (pivot set)`,
      pivotGeneric: 'Pivot hinge',
      baseMaterial: (b: string) => `Substrate: ${b}`,
      subtotalCustom: (n: string) => `Subtotal: ¥${n} + custom (TBA) — contact sales.`,
      total: (n: string) => `Total: ¥${n}`,
      minBillableAreaNote: (actual: string, billed: string) =>
        `Area ${actual} m²; orders below 0.5 m² are billed at ${billed} m²`,
      customGlassLeadTimeHint:
        '(Special-order glass: European grey G33 rate + ¥300/m²; lead time ≈ +1 week)',
      customGlassTileBadge: 'Special order · +~1 week',
      petSurfaceLine: 'PET finish (+¥150/m² on top of European grey G33 panel rate)',
      petSurfaceDetail: (billedM2: string, actualM2: string) =>
        `Billed ${billedM2} m² (actual ${actualM2} m²; minimum 0.5 m²)`,
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
      selectHandleColor: 'Select a handle finish swatch.',
      selectHingeColor: 'Select a hinge color.',
      selectHingeHardware: 'Select a hinge model.',
      handleMountFill: 'Enter handle height from bottom (door height required).',
      handleMountKickGuard:
        'To avoid toe strikes, the pull must sit more than 50 mm above the door bottom (lower edge clearance).',
      handleMountTopClearance: 'Handle center must be ≥120mm from top — adjust height from bottom or increase door height.',
      hingeAirMaxHeight:
        'Air / heavy-duty air hinge: door height must be strictly under 2700 mm — reduce height or change frame.',
      hingePositionOutOfRange:
        'Hinge holes must be ≥50 mm from top and bottom, and within ±50 mm of each standard position.',
      glassNotForAluminumFrame:
        'This frame has no list price for that glass (or thickness is not allowed).',
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
