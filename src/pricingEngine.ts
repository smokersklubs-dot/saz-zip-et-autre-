import dbRaw from './databases_clean.json';
import {
  ALL_STRUCTURE_PRESETS,
  PRINT_LAYERS,
  BARRIER_LAYERS,
  SEAL_LAYERS,
  MaterialStructurePreset
} from './materialsCatalog';

export type PrintTechnology = 'digital' | 'gravure';

export type BagTypeKey =
  | 'stand_up'      // 自立袋 (Sac debout / Doypack)
  | 'three_side'    // 三边封袋 (Sac à trois soudures)
  | 'flat_bottom'   // 八边封袋 (Sac octogonal / Box pouch)
  | 'center_seal'   // 中封袋 (Sachet à fermeture centrale)
  | 'gusset'        // 风琴袋 (Sac accordéon / soufflets)
  | 'four_side'     // 四边封袋 (Sac scellé 4 côtés)
  | 'roll_film';    // 卷膜 (Film en rouleau)

export type CuttingType = 'double_cut' | 'die_cut'; // 双切 (Coupe droite) | 模切 (Découpe forme spéciale / Die-Cut)
export type BottomMode = 1 | 2 | 3 | 4 | 5;
export type DigitalPrintMode = 'none' | 'cmyk_white' | 'cmyk_white_inside';
export type OrderUrgency = 'normal' | 'urgent';
export type InvoiceType = 'no_invoice' | 'vat_invoice';
export type ShippingMode = 'none' | 'guangdong_free' | 'china_domestic' | 'custom';

export interface BagTypeDefinition {
  key: BagTypeKey;
  nameFr: string;
  nameZh: string;
  description: string;
  hasBottomGusset: boolean;
  hasSideGusset: boolean;
  defaultBottomMode: BottomMode;
  zipperOptions: { label: string; labelZh: string; instId: string; hasZip: boolean }[];
}

export const BAG_TYPES_CATALOG: BagTypeDefinition[] = [
  {
    key: 'stand_up',
    nameFr: 'Sac Debout (Doypack)',
    nameZh: '自立袋',
    description: 'Pochette avec soufflet de fond, tient debout en rayon. Format n°1 Mylar.',
    hasBottomGusset: true,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Zip standard (普通拉链)', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822', hasZip: true },
      { label: 'Sans zip (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMW822', hasZip: false },
      { label: 'Zip sécurité enfant (童锁拉链 Child-Lock)', labelZh: '童锁拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMY822', hasZip: true }
    ]
  },
  {
    key: 'three_side',
    nameFr: 'Sac à 3 Soudures (Plat)',
    nameZh: '三边封袋',
    description: 'Pochette plate scellée sur 3 côtés. Compacte et économique.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMT822', hasZip: false },
      { label: 'Zip standard (普通拉链)', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMU822', hasZip: true },
      { label: 'Zip sécurité enfant (童锁拉链 Child-Lock)', labelZh: '童锁拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMV822', hasZip: true }
    ]
  },
  {
    key: 'flat_bottom',
    nameFr: 'Sac Octogonal (Fond Plat 8 Soudures)',
    nameZh: '八边封袋',
    description: '8 côtés scellés, fond plat rectangulaire haute capacité (Box Pouch).',
    hasBottomGusset: true,
    hasSideGusset: true,
    defaultBottomMode: 4,
    zipperOptions: [
      { label: 'Zip standard (普通拉链)', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM0922', hasZip: true },
      { label: 'Zip latéral / Easy-peel (易撕拉链/侧拉链)', labelZh: '易撕拉链/侧拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM1922', hasZip: true },
      { label: 'Sans zip (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMZ822', hasZip: false }
    ]
  },
  {
    key: 'center_seal',
    nameFr: 'Fermeture Centrale (Dos / Pillow)',
    nameZh: '中封袋',
    description: 'Soudure dorsale centrale au dos. Sachet classique snacks / barres / poudres.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip standard (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM2922', hasZip: false }
    ]
  },
  {
    key: 'gusset',
    nameFr: 'Sac Accordéon (Soufflets Latéraux)',
    nameZh: '风琴袋',
    description: 'Soufflets sur les 2 côtés avec scellage arrière, pour café/thé/vrac.',
    hasBottomGusset: false,
    hasSideGusset: true,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip standard (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM3922', hasZip: false }
    ]
  },
  {
    key: 'four_side',
    nameFr: 'Sac Scellé 4 Côtés (Quad Seal)',
    nameZh: '四边封袋',
    description: '4 arêtes scellées, excellente tenue et rigidité.',
    hasBottomGusset: false,
    hasSideGusset: true,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip classique (四边封无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM5922', hasZip: false },
      { label: 'Zip standard (四边封带拉链)', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM6922', hasZip: true },
      { label: 'Machine Zip sans rail (四边封机-无拉链)', labelZh: '无拉链(带拉链机)', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM4922', hasZip: false }
    ]
  },
  {
    key: 'roll_film',
    nameFr: 'Bobine de Film (Rouleau Automatique)',
    nameZh: '复合卷膜',
    description: 'Film continu imprimé en bobine pour ensacheuses automatiques.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Bobine standard (无拉链)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM7922', hasZip: false }
    ]
  }
];

export const BOTTOM_MODES_CATALOG: { value: BottomMode; labelFr: string; labelZh: string; unwinding: string }[] = [
  { value: 1, labelFr: '1. Fond continu (连底 - 1 bobine)', labelZh: '连底', unwinding: '单放料 (1 bobine)' },
  { value: 2, labelFr: '2. Fond rapporté imprimé (贴底-底印刷 - 2 bobines)', labelZh: '贴底(底印刷)', unwinding: '双放料 (2 bobines)' },
  { value: 3, labelFr: '3. Fond rapporté non imprimé (贴底-底不印 - 2 bobines)', labelZh: '贴底(底不印)', unwinding: '双放料 (2 bobines)' },
  { value: 4, labelFr: '4. Face, Dos & Fond séparés - Fond imprimé (正背底分开-底印刷 - 3 bobines)', labelZh: '正背底分开(底印刷)', unwinding: '三放料 (3 bobines)' },
  { value: 5, labelFr: '5. Face, Dos & Fond séparés - Fond non imprimé (正背底分开-底不印 - 3 bobines)', labelZh: '正背底分开(底不印)', unwinding: '三放料 (3 bobines)' }
];

export interface FinishesOptions {
  uvEnhancement?: 'none' | 'matte_varnish' | 'spot_uv' | 'thick_uv' | 'hot_stamping' | 'uv_and_hot_stamping';
  hasMatteVarnish?: boolean;
  hasThickUv?: boolean;
  spoutSize?: 'none' | 'spout_10mm' | 'spout_16mm';
  hasDegassingValve?: boolean;
  hasHangingHole?: boolean;
  // Options supplémentaires Héliogravure / Façonnage
  hasWindow?: boolean;         // 开窗 (Fenêtre transparente découpée)
  hasEmbossing?: boolean;      // 压纹 (Gaufrage / Embossage)
  hasAdhesiveStrip?: boolean;  // 自粘 (Bande adhésive)
  fullInkCoverage?: boolean;   // 满版印刷 (Plein encrage 100%)
}

export const FINISHES_CATALOG = {
  uv: {
    none: { name: 'Aucun vernis spécial (无)', nameZh: '无', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMH8U1', unitCost: 0, minFee: 0, weightG: 0 },
    matte_varnish: { name: 'Vernis mat plein (满版哑油)', nameZh: '满版哑油', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMF8U1', unitCost: 0.40, minFee: 100, weightG: 0 },
    spot_uv: { name: 'Vernis sélectif standard (UV)', nameZh: 'UV', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMJ8U1', unitCost: 1.00, minFee: 400, weightG: 0 },
    thick_uv: { name: 'Vernis sélectif épais 3D (厚UV)', nameZh: '厚UV', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMME8U1', unitCost: 1.70, minFee: 500, weightG: 0 },
    hot_stamping: { name: 'Dorure à chaud (烫金)', nameZh: '烫金', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMK8U1', unitCost: 1.60, minFee: 400, weightG: 0 },
    uv_and_hot_stamping: { name: 'Vernis UV + Dorure combinée (UV+烫金)', nameZh: 'UV+烫金', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMG8U1', unitCost: 1.80, minFee: 600, weightG: 0 }
  },
  spouts: {
    none: { name: 'Sans bouchon/bec (无)', nameZh: '无', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMM09U1', unitCost: 0, minFee: 0, weightG: 0 },
    spout_10mm: { name: 'Bouchon/Bec 10mm (吸嘴10mm)', nameZh: '10mm', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMML8U1', unitCost: 0.195, minFee: 100, weightG: 3.5 },
    spout_16mm: { name: 'Bouchon/Bec 16mm (吸嘴16mm)', nameZh: '16mm', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMM8U1', unitCost: 0.220, minFee: 100, weightG: 6.1 }
  },
  valve: {
    name: 'Valve dégazage café (单向透气阀)',
    nameZh: '单向透气阀',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMN8U1',
    unitCost: 0.220,
    minFee: 100,
    weightG: 0.6
  },
  handle: {
    name: 'Poignée découpée 10x5.5 (普通手提)',
    nameZh: '10*5.5',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMZ8U1',
    unitCost: 0.105,
    minFee: 100,
    weightG: 7.6
  }
};

// Connecte l'intégralité des 25 structures prédéfinies du catalogue !
export const MATERIAL_PRESETS: Record<string, MaterialStructurePreset> = ALL_STRUCTURE_PRESETS;

export interface CustomLayersConfig {
  printLayerId?: string;
  barrierLayerId?: string | null;
  barrierLayer2Id?: string | null;
  barrierLayer3Id?: string | null;
  sealLayerId?: string | null;
  isSingleLayer?: boolean;
}

export interface BagDimensions {
  technology: PrintTechnology;
  bagType: BagTypeKey;
  zipperInstId?: string;
  widthCm: number;
  heightCm: number;
  bottomCm: number;
  sideGussetCm?: number;
  quantity: number;
  skuCount?: number;              // 款数 (gg_ks : Nombre de modèles/designs dans la commande)
  cuttingType?: CuttingType;      // 双切 (double_cut) | 模切 (die_cut - forme spéciale)
  bottomMode?: BottomMode;        // 底部方式 (1: 连底, 2: 贴底印, 3: 贴底不印, 4: 正背底分开印, 5: 正背底分开不印)
  digitalPrintMode?: DigitalPrintMode; // 不印刷 | CMYK单白 | CMYK单白+里印
  orderUrgency?: OrderUrgency;    // 常规订单 | 加急订单
  invoiceType?: InvoiceType;      // 不开票 | 专用发票 (+8%)
  shippingMode?: ShippingMode;    // Mode de calcul des frais de port
  customShippingCny?: number;     // Frais de port personnalisés (CNY)
  extraFeeCny?: number;           // 其他费用 (qt00 : Frais divers manuels en CNY)
  thicknessSi?: number;
  hasZip?: boolean;
  materialPreset?: string;
  customLayers?: CustomLayersConfig;
  cylinderCount?: number;         // Nombre de couleurs / cylindres en Héliogravure (0 à 10)
  finishes?: FinishesOptions;
  // Stratégie de revente personnalisable
  resalePricingMode?: 'percentage' | 'multiplier' | 'fixed_price';
  resaleMarginPercent?: number;
  resaleMultiplier?: number;
  resaleFixedUnitPriceEur?: number;
}

export interface MachineImpositionMetrics {
  webPoses: number;              // gg_mkpb1 : Poses en laize (760mm)
  cylinderPoses: number;         // gg_mcpb1 : Poses sur tour de cylindre
  totalRotations: number;        // gg_lzs : Nombre de tours d'impression (流转数)
  linearMeters: number;          // clms : Métrage linéaire de film (材料米数)
  bagMakingMeters: number;       // zdms : Métrage façonnage
  totalFilmSqm: number;          // Surface totale de film (m²)
  unwindingMode: string;         // gg_fljy : 单放料 / 双放料 / 三放料
  laminationPasses: number;      // fhcs : 0 à 4 passes de contrecollage
  activeLayersCount: number;     // Nombre de couches de film (1 à 5)
  actualThicknessSilk: number;   // Épaisseur réelle cumulée en 丝 (1丝 = 10µm)
  actualThicknessMicrons: number;// Épaisseur réelle cumulée en µm
  layersSummaryFr: string;       // Résumé FR des couches
  layersSummaryZh: string;       // Résumé ZH des couches (cljg)
  sizeAlert: string;             // 袋型尺寸正常 | 袋型过大
  isSizeValid: boolean;
  thicknessAlert: string;        // 厚度正常 | 厚度不足 | 厚度过高
  leadTimeDays: number;          // js_chts : Délai de production (jours)
  estimatedShipDate: string;     // js_chrq : Date d'expédition prévue (YYYY-MM-DD)
  factoryTierMultiplier: number; // xs02 : Coefficient multiplicateur palier usine
  factoryMinProfitCny: number;   // qt09 : Profit plancher usine (150 à 800 ¥)
  quoteSpecFr: string;           // Fiche devis prête à copier (FR)
  quoteSpecZh: string;           // Fiche devis originale usine (ZH)
}

export interface QuoteBreakdown {
  technology: PrintTechnology;
  // Coûts Usine Réels Détaillés (Shenzhen Beijincai - suanfa.js)
  materialCostCny: number;       // js_cl : Coût films matières premières
  printCostCny: number;          // js_ys : Coût impression + UV/Dorure
  laminationCostCny: number;     // js_fh : Coût contrecollage (1 à 4 passes)
  bagMakingCostCny: number;      // js_zd : Coût façonnage & soudure zip
  dieCutPlateCostCny: number;    // js_mjf : Frais de moule découpe forme spéciale (450 ¥ + 3%)
  skuSurchargeCny: number;       // Surcoût multi-modèles (gg_ks >= 4)
  cylindersCostCny: number;      // Coût des cylindres cuivre (Héliogravure)
  accessoriesCostCny: number;    // js_qt : Accessoires (Valve, Bec, Poignée, Emballage carton)
  rushFeeCny: number;            // js_jjf + js_gcjjf : Frais de commande urgente Express
  shippingCostCny: number;       // js_yf : Frais de port logistique
  taxCostCny: number;            // bj02 : Coût fiscal Facture TVA (+8%)
  extraFeeCny: number;           // qt00 : Autres frais manuels

  // Coût de revient atelier pur (js_zcb + extras)
  factoryCostTotalCny: number;
  factoryCostTotalEur: number;
  factoryCostUnitCny: number;
  factoryCostUnitEur: number;

  // Prix Catalogue Officiel Usine Beijincai (bj03 : avec marge palier usine xs02)
  beijincaiCatalogTotalCny: number;
  beijincaiCatalogTotalEur: number;
  beijincaiCatalogUnitCny: number;
  beijincaiCatalogUnitEur: number;

  // Prix de Revente Personnalisé (Vos Tarifs Client)
  resalePriceTotalEur: number;
  resalePriceUnitEur: number;
  resalePriceTotalCny: number;
  resalePriceUnitCny: number;

  // Marges et Profits
  grossProfitTotalEur: number;
  grossProfitUnitEur: number;
  grossProfitTotalCny: number;
  grossMarginPercent: number;
  markupPercent: number;

  // Métriques de Production & Imposition
  weightUnitGrams: number;
  weightTotalKg: number;
  cylinderCount: number;
  cylinderFeePerUnitCny: number;
  imposition: MachineImpositionMetrics;
}

export const CNY_TO_EUR_RATE = 1 / 7.8; // 1 € = 7.80 CNY

const uData = {
  utils: {
    Sum: (val: number[]) => (val || []).reduce((p, n) => p + n, 0),
    Max: (...args: number[]) => Math.max(...args.map(a => Number.isNaN(a) || a === undefined || a === null ? 0 : Number(a))),
    Int: (val: any) => parseInt(val || "0", 10),
    Fixed: (val: any, f: number) => parseFloat(Number(val).toFixed(f)),
    getPickerData: (conf: { instanceId?: any; arr: any[]; key: string; val?: any }) => {
      const findItem = (conf.arr || []).find(item => {
        return (conf.val && item.formData && item.formData[conf.key] == conf.val) || (conf.instanceId && item.formInstId == conf.instanceId);
      });
      return findItem ? findItem.formData : {};
    },
    getDateAfterDays: (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + (Number(days) || 0));
      return d.toISOString().slice(0, 10);
    }
  },
  organConfig: {
    dxcs: (dbRaw as any).dxcs.data,
    clk: (dbRaw as any).clk.data,
    gxcb: (dbRaw as any).gxcb.data,
    qtcs: (dbRaw as any).qtcs.data[0].formData
  }
};

export function calculateMylarQuote(dim: BagDimensions): QuoteBreakdown {
  const isGravure = dim.technology === 'gravure';
  const bagDef = BAG_TYPES_CATALOG.find(b => b.key === dim.bagType) || BAG_TYPES_CATALOG[0];
  const presetKey = dim.materialPreset || 'mylar_standard';
  const preset = MATERIAL_PRESETS[presetKey] || MATERIAL_PRESETS.mylar_standard;

  const widthCm = Math.max(1, Number(dim.widthCm) || 15);
  const heightCm = Math.max(1, Number(dim.heightCm) || 25);
  const bottomCm = bagDef.hasBottomGusset ? Math.max(0, Number(dim.bottomCm) || 6) : 0;
  const sideGussetCm = bagDef.hasSideGusset ? Math.max(0, Number(dim.sideGussetCm ?? bottomCm) || 4) : 0;

  // Dimensions en cm pour les formules exactes suanfa.js (gg_k, gg_g, gg_d)
  const gg_k = widthCm;
  const gg_g = heightCm;
  const gg_d = bagDef.hasBottomGusset ? bottomCm : (bagDef.hasSideGusset ? sideGussetCm : 0);

  const widthMm = widthCm * 10;
  const heightMm = heightCm * 10;
  const bottomMm = bottomCm * 10;
  const sideGussetMm = sideGussetCm * 10;

  const qty = Math.max(1, Number(dim.quantity) || 1000);
  const gg_ks = Math.max(1, Math.round(Number(dim.skuCount) || 1)); // 款数 (Nombre de designs/variantes)
  const cuttingType: CuttingType = dim.cuttingType || 'double_cut';
  const kg_sqmq = cuttingType === 'die_cut' ? '模切' : '双切';
  const bottomMode: BottomMode = dim.bottomMode || bagDef.defaultBottomMode || 1;
  const digitalPrintMode: DigitalPrintMode = dim.digitalPrintMode || 'cmyk_white';
  const orderUrgency: OrderUrgency = dim.orderUrgency || 'normal';
  const invoiceType: InvoiceType = dim.invoiceType || 'no_invoice';
  const shippingMode: ShippingMode = dim.shippingMode || 'none';
  const qt00 = Math.max(0, Number(dim.extraFeeCny) || 0);

  // 1. Résolution exacte de l'enregistrement dxcs (Modèle de sac + Type de Zip)
  let zipId = dim.zipperInstId;
  const validZipIdsForBag = bagDef.zipperOptions.map(z => z.instId);
  if (!zipId || !validZipIdsForBag.includes(zipId)) {
    const matchedOption = bagDef.zipperOptions.find(z => dim.hasZip ? z.hasZip : !z.hasZip);
    zipId = matchedOption ? matchedOption.instId : bagDef.zipperOptions[0].instId;
  }
  const dxcsItem = uData.utils.getPickerData({ instanceId: zipId, arr: uData.organConfig.dxcs, key: 'id' });

  // 2. Résolution des couches de matériaux (Jusqu'à 5 couches : Impression + 3 Barrières + Scellage)
  const isSingleLayer = Boolean(dim.customLayers?.isSingleLayer);
  const layer1Id = dim.customLayers?.printLayerId !== undefined ? dim.customLayers.printLayerId : preset.printLayer;
  const layer2Id = isSingleLayer ? null : (dim.customLayers?.barrierLayerId !== undefined ? dim.customLayers.barrierLayerId : preset.barrierLayer);
  const layer3Id = isSingleLayer ? null : (dim.customLayers?.barrierLayer2Id !== undefined ? dim.customLayers.barrierLayer2Id : (preset.barrierLayer2 || null));
  const layer4Id = isSingleLayer ? null : (dim.customLayers?.barrierLayer3Id !== undefined ? dim.customLayers.barrierLayer3Id : (preset.barrierLayer3 || null));
  const layer5Id = isSingleLayer ? null : (dim.customLayers?.sealLayerId !== undefined ? dim.customLayers.sealLayerId : preset.sealLayer);

  const yscItem = layer1Id ? uData.utils.getPickerData({ instanceId: layer1Id, arr: uData.organConfig.clk, key: 'id' }) : {};
  const zgc1Item = layer2Id ? uData.utils.getPickerData({ instanceId: layer2Id, arr: uData.organConfig.clk, key: 'id' }) : {};
  const zgc2Item = layer3Id ? uData.utils.getPickerData({ instanceId: layer3Id, arr: uData.organConfig.clk, key: 'id' }) : {};
  const zgc3Item = layer4Id ? uData.utils.getPickerData({ instanceId: layer4Id, arr: uData.organConfig.clk, key: 'id' }) : {};
  const rfcItem = layer5Id ? uData.utils.getPickerData({ instanceId: layer5Id, arr: uData.organConfig.clk, key: 'id' }) : {};

  // Propriétés physiques (Prix ¥/kg, Densité g/cm³, Épaisseur en 丝) des 5 couches
  const yc_dj01 = Number(yscItem.textField_nohaph9) || 0;
  const yc_md01 = Number(yscItem.textField_2xfswer) || 0;
  const yc_hd01 = Number(yscItem.textField_09zzudc) || 0;
  const yc_jc01 = yscItem.textField_m3n9285l || '';

  const zc1_dj01 = Number(zgc1Item.textField_nohaph9) || 0;
  const zc1_md01 = Number(zgc1Item.textField_2xfswer) || 0;
  const zc1_hd01 = Number(zgc1Item.textField_09zzudc) || 0;
  const zc1_jc01 = zgc1Item.textField_m3n9285l || '';

  const zc2_dj01 = Number(zgc2Item.textField_nohaph9) || 0;
  const zc2_md01 = Number(zgc2Item.textField_2xfswer) || 0;
  const zc2_hd01 = Number(zgc2Item.textField_09zzudc) || 0;
  const zc2_jc01 = zgc2Item.textField_m3n9285l || '';

  const zc3_dj01 = Number(zgc3Item.textField_nohaph9) || 0;
  const zc3_md01 = Number(zgc3Item.textField_2xfswer) || 0;
  const zc3_hd01 = Number(zgc3Item.textField_09zzudc) || 0;
  const zc3_jc01 = zgc3Item.textField_m3n9285l || '';

  const rc_dj01 = Number(rfcItem.textField_nohaph9) || 0;
  const rc_md01 = Number(rfcItem.textField_2xfswer) || 0;
  const rc_hd01 = Number(rfcItem.textField_09zzudc) || 0;
  const rc_jc01 = rfcItem.textField_m3n9285l || '';

  const activeLayerCodes = [yc_jc01, zc1_jc01, zc2_jc01, zc3_jc01, rc_jc01].filter(Boolean);
  const activeLayersCount = Math.max(1, activeLayerCodes.length);
  const laminationPasses = Math.max(0, activeLayersCount - 1);

  const actualThicknessSilk = parseFloat((yc_hd01 + zc1_hd01 + zc2_hd01 + zc3_hd01 + rc_hd01).toFixed(2));
  const actualThicknessMicrons = Math.round(actualThicknessSilk * 10);
  const targetThicknessSilk = dim.thicknessSi !== undefined && dim.thicknessSi > 0 ? dim.thicknessSi : actualThicknessSilk;

  let thicknessAlert = '厚度正常 (Épaisseur conforme)';
  if (Math.abs(targetThicknessSilk - actualThicknessSilk) > 0.25) {
    thicknessAlert = targetThicknessSilk > actualThicknessSilk
      ? '厚度不足 (Somme des couches inférieure à la cible)'
      : '厚度过高 (Somme des couches supérieure à la cible)';
  }

  // 3. Mode d'impression (ys01)
  const printModeInstMap: Record<DigitalPrintMode, string> = {
    none: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMD8U1',              // 不印刷 (0 ¥)
    cmyk_white: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMO8U1',        // CMYK单白 (2.70 ¥/tour, min 100 ¥)
    cmyk_white_inside: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMI8U1'  // CMYK单白+里印 (5.35 ¥/tour, min 100 ¥)
  };
  const ysItem = uData.utils.getPickerData({
    instanceId: printModeInstMap[digitalPrintMode],
    arr: uData.organConfig.gxcb,
    key: 'id'
  });

  // 4. Finitions & Accessoires
  const uvKey = dim.finishes?.uvEnhancement || 'none';
  const uvConfig = FINISHES_CATALOG.uv[uvKey] || FINISHES_CATALOG.uv.none;
  const spoutKey = dim.finishes?.spoutSize || 'none';
  const spoutConfig = FINISHES_CATALOG.spouts[spoutKey] || FINISHES_CATALOG.spouts.none;
  const valveConfig = dim.finishes?.hasDegassingValve ? FINISHES_CATALOG.valve : null;
  const handleConfig = dim.finishes?.hasHangingHole ? FINISHES_CATALOG.handle : null;

  // 5. Paramètres globaux usine (qtcs) & paramètres du sac (dxcs)
  const qtcs = uData.organConfig.qtcs;
  const INT = uData.utils.Int;
  const MAX = uData.utils.Max;
  const M = uData.utils.Fixed;

  const qt01 = Number(qtcs.numberField_c2jyl6f) || 0;      // 1.35 ¥
  const qt02 = Number(qtcs.numberField_m3mpyv0p) || 450;   // 450 ¥ (Frais de moule découpe 模切)
  const qt03 = Number(qtcs.numberField_m3mqbp4j) || 74;    // 74 cm (Laize utile max)
  const qt04 = Number(qtcs.numberField_m3r8ld40) || 76;    // 76 cm (Laize bobine)
  const qt05 = Number(qtcs.numberField_m3r8ld41) || 110;   // 110 cm (Tour cylindre max)
  const qt06 = Number(qtcs.numberField_m3r8ld42) || 112;   // 112 cm (Développé cylindre)
  const qt07 = Number(qtcs.numberField_m3mqrw28) || 0.7;   // 0.7 ¥/kg (Emballage carton)
  const qt08 = Number(qtcs.numberField_m3r8ld44) || 10;    // 10 ¥ (Surcoût par modèle suppl. > 3)
  const qt11 = Number(qtcs.numberField_mdtz679b) || 500;   // 500 ¥ (Frais urgence commercial)
  const qt19 = Number(qtcs.numberField_menzxc5c) || 3;     // 3% (Taxe interne sur coûts)
  const qt24 = qtcs.tableField_menzxc5j || [];             // Grille de coefficients multiplicateurs
  const qt25 = qtcs.tableField_mo9fep07 || [];             // Grille de profits planchers (150 à 800 ¥)
  const fhcsTable = qtcs.tableField_mglxnkde || qtcs.tableField_mgka3e9d || [];

  // Paramètres dxcs du modèle sélectionné
  const dx02 = Number(dxcsItem.numberField_m3mpyv0d) || 7; // Jours délai normal
  const dx03 = Number(dxcsItem.numberField_m3mpyv0f) || 4; // Jours délai urgent
  const dx04 = Number(dxcsItem.numberField_m3mpyv0g) || 300; // Frais urgence atelier (300 à 500 ¥)
  const cx01 = Number(dxcsItem.numberField_sr3it9l) || 0;  // Marge soudure hauteur
  const cx02 = Number(dxcsItem.numberField_jp4n9ji) || 0;  // Marge soudure largeur
  const cx03 = Number(dxcsItem.numberField_c9d9r7p) || 0;  // Marge fond séparé
  const cx04 = Number(dxcsItem.numberField_m3mpyv0h) || 0.4; // Marge double coupe (双切)
  const cx05 = Number(dxcsItem.numberField_m3mpyv0j) || 1.2; // Marge découpe forme hauteur (模切)
  const cx06 = Number(dxcsItem.numberField_m3mpyv0i) || 1.2; // Marge découpe forme largeur (模切)

  const sh01 = Number(dxcsItem.numberField_p484hca) || 100; // Gâche fixe métrage (m)
  const sh02 = Number(dxcsItem.numberField_y92oli1) || 2;   // % gâche impression
  const sh03 = Number(dxcsItem.numberField_5c5a74i) || 15;  // Gâche par variante supplémentaire (tours)
  const sh04 = Number(dxcsItem.numberField_m3mpyv0k) || 1;  // % gâche découpe forme (模切)
  const sh05 = Number(dxcsItem.numberField_m3mpyv0l) || 2;  // % gâche façonnage sac
  const sh06 = Number(dxcsItem.numberField_m3mpyv0m) || 150;// Gâche fixe façonnage (m)

  const zd01 = Number(dxcsItem.numberField_04m4hcc) || 350; // Forfait min façonnage
  const zd02_base = Number(dxcsItem.numberField_6mnwv9s) || 0.3; // Coût façonnage / m
  const zd03 = Number(dxcsItem.numberField_p1bf4ns) || 0.025; // Coût façonnage / pose
  const zd04 = Number(dxcsItem.numberField_g43sr0l) || 0;   // Coût rail zip / m
  const zd05 = Number(dxcsItem.numberField_m3mpyv0n) || 0;  // Surcoût déroulage multi-bobines / m
  const zd06 = Number(dxcsItem.numberField_wngzhey) || 0.005; // Coût double coupe / sac
  const zd07 = Number(dxcsItem.numberField_m3mpyv0o) || 0.01; // Coût découpe forme / sac

  // =========================================================
  // 6. IMPOSITION EXACTE SUANFA.JS (Poses Laize & Cylindre)
  // =========================================================
  let gg_mkz1 = 0; // Pas unitaire en laize (cm)
  let gg_mcz1 = 0; // Pas unitaire en circonférence (cm)
  let gg_mkz2 = 0;
  let gg_mcz2 = 0;

  if (dim.bagType === 'stand_up') {
    gg_mkz1 = gg_g * 2 + gg_d + cx01 + (kg_sqmq === '模切' ? cx05 : 0);
    gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'three_side') {
    gg_mkz1 = gg_g * 2 + cx01 + (kg_sqmq === '模切' ? cx05 : 0);
    gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'flat_bottom') {
    // Sac octogonal (八边封袋) : Face/Dos + Soufflets/Fond
    gg_mkz1 = gg_g * 2 + cx01;
    gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
    gg_mkz2 = gg_d * 2 + gg_k + cx03;
    gg_mcz2 = gg_g + cx02;
  } else if (dim.bagType === 'center_seal') {
    gg_mkz1 = (gg_k + cx01) * 2;
    gg_mcz1 = gg_g + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'gusset') {
    gg_mkz1 = (gg_k + gg_d + cx01) * 2;
    gg_mcz1 = gg_g + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'four_side') {
    if (zipId === 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM5922') {
      gg_mkz1 = (gg_k + gg_d) * 2 + cx01 * 2;
      gg_mcz1 = gg_g + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
    } else {
      gg_mkz1 = gg_g * 2 + gg_d + cx01;
      gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
    }
  } else if (dim.bagType === 'roll_film') {
    gg_mkz1 = gg_k;
    gg_mcz1 = gg_g;
  }

  let gg_mkpb1 = Math.max(0, INT(qt03 / (gg_mkz1 || 1)));
  const gg_mcpb1 = Math.max(1, INT(qt05 / (gg_mcz1 || 1)));

  // Ajustement du nombre de poses en laize selon le mode de fond (kg_dbfs)
  let gg_fljy = '单放料 (1 bobine)';
  if (bottomMode === 1 && gg_mkpb1 >= 1) {
    gg_fljy = '单放料 (1 bobine)';
  } else if (bottomMode === 1 && gg_mkpb1 < 1) {
    // Bascule automatique en 2 bobines si le sac est trop haut pour 1 seule bande
    gg_mkz1 = gg_g + gg_d * 0.5 + cx01;
    gg_mkpb1 = INT(qt03 / (gg_mkz1 || 1));
    gg_fljy = '双放料 (2 bobines)';
  } else if (bottomMode === 2 || bottomMode === 3) {
    gg_fljy = '双放料 (2 bobines)';
  } else if (bottomMode === 4 || bottomMode === 5) {
    gg_fljy = '三放料 (3 bobines)';
  }

  const isSizeValid = gg_mkpb1 >= 1;
  const sizeAlert = isSizeValid ? '袋型尺寸正常 (Dimensions conformes)' : '袋型过大 (Dépasse la laize max 74cm)';
  const safeMkpb1 = Math.max(1, gg_mkpb1);

  // Calcul du nombre de tours d'impression (gg_lzs)
  let gg_lzs1 = Math.ceil(qty / (safeMkpb1 * gg_mcpb1));
  if (bottomMode === 1 && gg_fljy.startsWith('双放料')) {
    gg_lzs1 = gg_lzs1 * 2;
  }

  let gg_lzs2 = 0;
  let gg_lzs3 = 0;
  if (dim.bagType === 'flat_bottom') {
    const mkpb2 = Math.max(1, INT(qt03 / (gg_mkz2 || 1)));
    const mcpb2 = Math.max(1, INT(qt05 / (gg_mcz2 || 1)));
    const secondWebRotations = Math.ceil(qty / (mkpb2 * mcpb2));
    if (bottomMode === 2 || bottomMode === 4) {
      gg_lzs2 = secondWebRotations;
    } else if (bottomMode === 3 || bottomMode === 5) {
      gg_lzs3 = secondWebRotations;
    }
  }

  const gg_lzs = gg_lzs1 + gg_lzs2;

  // =========================================================
  // 7. CALCUL DE LA GÂCHE & DU MÉTRAGE DE FILM (suanfa.js)
  // =========================================================
  const sh_jchs = Math.ceil(sh01 / (qt06 / 100)); // ~90 tours
  const sh_ys = Math.ceil(gg_lzs * sh02 / 100);
  const sh_ks = (gg_ks - 1) * sh03;
  const sh_mq = kg_sqmq === '模切' ? Math.ceil(gg_lzs * sh04 / 100) : 0;
  const sh_zd = Math.ceil((gg_lzs + gg_lzs3) * sh05 / 100);
  const sh_zdzs = (bottomMode === 4 || bottomMode === 5) ? Math.ceil(sh06 / (qt06 / 100)) : 0;

  const sh_hs = isGravure ? Math.max(120, sh_jchs) : (sh_jchs + sh_zd + sh_zdzs);
  const sh_cs = sh_ys + sh_ks + sh_mq;

  // Métrage linéaire total de film (clms) et métrage façonnage (zdms)
  const clms = M((gg_lzs + gg_lzs3 + sh_hs + sh_cs) * (qt06 / 100), 2);
  let zdms = M((gg_lzs + sh_cs + sh_zd) * (qt06 / 100), 2);
  if (bottomMode === 1 && gg_fljy.startsWith('双放料')) {
    zdms = M(zdms * 0.5, 2);
  }
  const totalFilmSqm = M((clms * qt04) / 100, 2);

  // =========================================================
  // 8. COÛTS PAR POSTE (1. Matière, 2. Impression, 3. Lamination, 4. Façonnage, 5. Accessoires)
  // =========================================================
  // Poste 1 : Coût Matières Premières (js_cl) sur jusqu'à 5 couches
  const js_cl01 = qt04 * qt06 * (sh_hs + gg_lzs + gg_lzs3 + sh_cs);
  const costPerSqm5Layers =
    yc_dj01 * yc_md01 * yc_hd01 +
    zc1_dj01 * zc1_md01 * zc1_hd01 +
    zc2_dj01 * zc2_md01 * zc2_hd01 +
    zc3_dj01 * zc3_md01 * zc3_hd01 +
    rc_dj01 * rc_md01 * rc_hd01;

  const js_cl = INT((js_cl01 * costPerSqm5Layers) / 1000000 * (1 + qt19 / 100));

  // Poste 2 : Coût d'Impression + Vernis UV / Dorure (js_ys)
  const yslz_cs = sh_cs + gg_lzs;
  const gx_uv01 = uvConfig.unitCost;
  const gx_uv02 = uvConfig.minFee;
  const hasMatte = dim.finishes?.hasMatteVarnish ?? (uvKey === 'matte_varnish');
  const matteExtraCost = (hasMatte && uvKey !== 'matte_varnish') ? MAX(100, yslz_cs * 0.40) : 0;
  const uvTotalCost = gx_uv01 > 0 ? MAX(gx_uv02, yslz_cs * gx_uv01) : 0;

  let js_ys = 0;
  const cylinderCount = isGravure ? (dim.cylinderCount !== undefined ? dim.cylinderCount : 6) : 0;

  if (!isGravure) {
    // Filière Numérique (数码)
    const gx_ys01 = Number(ysItem.numberField_w5opr46) ?? 2.7;
    const gx_ys02 = Number(ysItem.numberField_c2jyl6f) ?? 100;
    const baseDigitalPrint = gx_ys01 === 0 ? 0 : MAX(gx_ys02, yslz_cs * gx_ys01 + sh_hs * qt01);
    js_ys = M((baseDigitalPrint + uvTotalCost + matteExtraCost) * (1 + qt19 / 100), 2);
  } else {
    // Filière Héliogravure (凹版 - FORM-AC4C86A2336A44D2A258F36B747FE4AE58DB)
    // Barème officiel par nombre de couleurs : calage 200 ¥/couleur + encre au m²
    const gravureSetupCny = cylinderCount === 0 ? 0 : cylinderCount * 200;
    const gravureInkPerSqmTable: Record<number, number> = {
      0: 0.500, // Sans impression (vernis / passage blanc)
      1: 0.305,
      2: 0.355,
      3: 0.405,
      4: 0.455,
      5: 0.505,
      6: 0.705,
      7: 0.785,
      8: 0.865,
      9: 0.945,
      10: 1.025
    };
    const inkRatePerSqm = gravureInkPerSqmTable[cylinderCount] ?? 0.705;
    const fullInkMultiplier = dim.finishes?.fullInkCoverage ? 1.25 : 1.0;
    const baseGravurePrint = MAX(gravureSetupCny, totalFilmSqm * inkRatePerSqm * fullInkMultiplier);
    js_ys = M((baseGravurePrint + uvTotalCost + matteExtraCost) * (1 + qt19 / 100), 2);
  }

  // Poste 3 : Contrecollage / Lamination (js_fh : 0 à 4 passes selon le nombre de couches)
  let js_fh = 0;
  if (laminationPasses > 0) {
    const passLabel = `${laminationPasses}次`;
    const fhRow = fhcsTable.find((r: any) =>
      (r.selectField_mglxnkdf === passLabel) || (r.selectField_mgka3e9e === passLabel)
    ) || fhcsTable[Math.min(laminationPasses - 1, fhcsTable.length - 1)] || {};

    const fhcs01 = Number(fhRow.numberField_mglxnkdg ?? fhRow.numberField_mgka3e9f) || (laminationPasses === 1 ? 150 : laminationPasses === 2 ? 150 : laminationPasses === 3 ? 200 : 250);
    const fhcs02 = Number(fhRow.numberField_mglxnkdh ?? fhRow.numberField_mgka3e9g) || 700;
    const fhcs03 = Number(fhRow.numberField_mglxnkdi ?? fhRow.numberField_mgka3e9h) || (laminationPasses === 1 ? 0.25 : laminationPasses === 2 ? 0.50 : laminationPasses === 3 ? 0.70 : 0.85);

    js_fh = M((clms <= fhcs02 ? fhcs01 : fhcs01 + (clms - fhcs02) * fhcs03) * (1 + qt19 / 100), 2);
  }

  // Poste 4 : Façonnage, Soudure, Zip, Découpe & Multi-Bobines (js_zd)
  const zd02 = M(MAX(zd02_base, (qty / (zdms || 1)) * zd03), 3);
  const unwindingMultiplier = (bottomMode === 2 || bottomMode === 3 || (bottomMode === 1 && gg_fljy.startsWith('双放料')))
    ? 1
    : (bottomMode === 4 || bottomMode === 5) ? 2 : 0;

  const baseBagMaking =
    MAX(zd01, zdms * zd02) +
    unwindingMultiplier * zdms * zd05 +
    ((gg_k * zd04) / 100 + (kg_sqmq === '双切' ? zd06 : zd07)) * qty;

  const js_zd = M(baseBagMaking * (1 + qt19 / 100), 2);

  // Frais de plaque de découpe forme spéciale (js_mjf : 450 ¥ + 3% si 模切)
  const js_mjf = kg_sqmq === '模切' ? M(qt02 * (1 + qt19 / 100), 2) : 0;

  // Surcoût multi-designs / variantes (au-delà de 3 designs : (gg_ks - 3) * 10 ¥)
  const skuSurchargeCny = gg_ks >= 4 ? M((gg_ks - 3) * qt08 * (1 + qt19 / 100), 2) : 0;

  // Poste 5 : Poids unitaire & total (en grammes et kg) + Accessoires (js_qt)
  const accessoryWeightG =
    spoutConfig.weightG +
    (valveConfig ? valveConfig.weightG : 0) +
    (handleConfig ? handleConfig.weightG : 0);

  let unfoldedAreaCm2 = gg_k * (gg_g * 2 + gg_d);
  if (dim.bagType === 'three_side') {
    unfoldedAreaCm2 = gg_k * (gg_g * 2);
  } else if (dim.bagType === 'flat_bottom') {
    unfoldedAreaCm2 = gg_k * (gg_g * 2 + gg_d) + gg_d * gg_g * 2;
  } else if (dim.bagType === 'center_seal') {
    unfoldedAreaCm2 = gg_k * 2 * gg_g;
  } else if (dim.bagType === 'gusset') {
    unfoldedAreaCm2 = (gg_k + gg_d) * 2 * gg_g;
  } else if (dim.bagType === 'roll_film') {
    unfoldedAreaCm2 = gg_k * gg_g;
  }

  const totalBasisWeight =
    yc_md01 * yc_hd01 +
    zc1_md01 * zc1_hd01 +
    zc2_md01 * zc2_hd01 +
    zc3_md01 * zc3_hd01 +
    rc_md01 * rc_hd01;

  const singleWeightG = M(((unfoldedAreaCm2 / 10000) * totalBasisWeight * 1.15) + accessoryWeightG, 3);
  const totalWeightKg = Math.max(1, Math.round((singleWeightG * qty) / 1000));

  const xz_cost = spoutConfig.unitCost > 0 ? MAX(spoutConfig.minFee, spoutConfig.unitCost * qty) : 0;
  const stk_cost = handleConfig ? MAX(handleConfig.minFee, handleConfig.unitCost * qty) : 0;
  const tqf_cost = valveConfig ? MAX(valveConfig.minFee, valveConfig.unitCost * qty) : 0;

  // Options spéciales supplémentaires (Fenêtre, Gaufrage, Bande adhésive)
  const windowCost = dim.finishes?.hasWindow ? MAX(150, qty * 0.03) : 0;
  const embossingCost = dim.finishes?.hasEmbossing ? MAX(300, qty * 0.04) : 0;
  const adhesiveCost = dim.finishes?.hasAdhesiveStrip ? MAX(100, qty * 0.02) : 0;

  const js_qt = M(
    (xz_cost + stk_cost + tqf_cost + windowCost + embossingCost + adhesiveCost + qt07 * totalWeightKg + (gg_ks >= 4 ? (gg_ks - 3) * qt08 : 0)) *
      (1 + qt19 / 100),
    2
  );

  // Poste 6 : Cylindres de cuivre (Héliogravure)
  const totalCylindersCost = isGravure ? cylinderCount * 400 : 0;

  // Poste 7 : Urgence Express (js_jjf + js_gcjjf) & Délai d'expédition
  const isUrgent = orderUrgency === 'urgent';
  const js_jjf = isUrgent ? qt11 : 0;
  const js_gcjjf = isUrgent ? dx04 : 0;
  const rushFeeCny = js_jjf + js_gcjjf;
  const leadTimeDays = isUrgent ? dx03 : dx02;
  const estimatedShipDate = uData.utils.getDateAfterDays(leadTimeDays);

  // Poste 8 : Frais de port logistique (js_yf)
  let shippingCostCny = 0;
  if (shippingMode === 'china_domestic') {
    // Formule officielle suanfa.js : 12 ¥ (1er kg) + 1 ¥ par kg supplémentaire
    shippingCostCny = 12 + Math.max(0, totalWeightKg - 1) * 1;
  } else if (shippingMode === 'custom') {
    shippingCostCny = Math.max(0, Number(dim.customShippingCny) || 0);
  }

  // =========================================================
  // 9. COÛT DE REVIENT USINE PUR (js_zcb) vs PRIX CATALOGUE BEIJINCAI (bj03)
  // =========================================================
  // Coût de production de base (hors moule / urgence / port / TVA)
  const baseProductionCostCny = js_cl + js_ys + js_fh + js_zd + js_qt;

  // Recherche du coefficient multiplicateur palier usine (xs02 dans qt24) et profit plancher (qt09 dans qt25)
  let xs02 = 1.25;
  for (let i = 0; i < qt24.length; i++) {
    const row = qt24[i];
    const minRot = Number(row.numberField_menzxc5e) || 0;
    const maxRot = Number(row.numberField_menzxc5f) || 999999;
    if (gg_lzs >= minRot && gg_lzs <= maxRot) {
      xs02 = Number(row.numberField_menzxc5g) || 1.25;
      break;
    }
  }

  let qt09 = 150;
  for (let j = 0; j < qt25.length; j++) {
    const row = qt25[j];
    const minRot = Number(row.numberField_mo9fep08) || 0;
    const maxRot = Number(row.numberField_mo9fep09) || 999999;
    if (gg_lzs >= minRot && gg_lzs <= maxRot) {
      qt09 = Number(row.numberField_mo9fep0b) || 150;
      break;
    }
  }

  // Coût total usine incluant moule, cylindres, urgence, port et frais manuels
  const preTaxFactoryCostCny = baseProductionCostCny + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00;

  // Prix catalogue officiel Beijincai HT (bj01)
  const bj01 = M(
    MAX(
      baseProductionCostCny + qt09 + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00,
      baseProductionCostCny * xs02 + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00
    ),
    2
  );

  // Facturation TVA (+8% sur le total si 专用发票)
  const taxRate = invoiceType === 'vat_invoice' ? 0.08 : 0;
  const taxCostCny = M(preTaxFactoryCostCny * taxRate, 2);
  const catalogTaxCny = M(bj01 * taxRate, 2);

  const factoryCostTotalCny = M(preTaxFactoryCostCny + taxCostCny, 2);
  const factoryCostTotalEur = factoryCostTotalCny * CNY_TO_EUR_RATE;
  const factoryCostUnitCny = factoryCostTotalCny / qty;
  const factoryCostUnitEur = factoryCostTotalEur / qty;

  const beijincaiCatalogTotalCny = M(bj01 + catalogTaxCny, 2);
  const beijincaiCatalogTotalEur = beijincaiCatalogTotalCny * CNY_TO_EUR_RATE;
  const beijincaiCatalogUnitCny = beijincaiCatalogTotalCny / qty;
  const beijincaiCatalogUnitEur = beijincaiCatalogTotalEur / qty;

  // =========================================================
  // 10. CALCUL DE VOS PRIX DE REVENTE PERSONNALISÉS
  // =========================================================
  const pricingMode = dim.resalePricingMode || 'percentage';
  let resalePriceTotalEur = 0;
  let resalePriceUnitEur = 0;

  if (pricingMode === 'fixed_price' && dim.resaleFixedUnitPriceEur && dim.resaleFixedUnitPriceEur > 0) {
    resalePriceUnitEur = dim.resaleFixedUnitPriceEur;
    resalePriceTotalEur = resalePriceUnitEur * qty;
  } else if (pricingMode === 'multiplier' && dim.resaleMultiplier && dim.resaleMultiplier > 0) {
    resalePriceTotalEur = factoryCostTotalEur * dim.resaleMultiplier;
    resalePriceUnitEur = resalePriceTotalEur / qty;
  } else {
    const targetMargin = (dim.resaleMarginPercent !== undefined ? dim.resaleMarginPercent : 45) / 100;
    const clampedMargin = Math.min(0.95, Math.max(0.01, targetMargin));
    resalePriceTotalEur = factoryCostTotalEur / (1 - clampedMargin);
    resalePriceUnitEur = resalePriceTotalEur / qty;
  }

  const resalePriceTotalCny = resalePriceTotalEur / CNY_TO_EUR_RATE;
  const resalePriceUnitCny = resalePriceUnitEur / CNY_TO_EUR_RATE;

  const grossProfitTotalEur = resalePriceTotalEur - factoryCostTotalEur;
  const grossProfitUnitEur = resalePriceUnitEur - factoryCostUnitEur;
  const grossProfitTotalCny = resalePriceTotalCny - factoryCostTotalCny;
  const grossMarginPercent = resalePriceTotalEur > 0 ? (grossProfitTotalEur / resalePriceTotalEur) * 100 : 0;
  const markupPercent = factoryCostTotalEur > 0 ? (grossProfitTotalEur / factoryCostTotalEur) * 100 : 0;

  // =========================================================
  // 11. GÉNÉRATION DU DEVIS COPIABLE (spec FR & ZH)
  // =========================================================
  const layersSummaryZh = `${activeLayerCodes.join('+')} (${actualThicknessSilk}丝)`;
  const layersSummaryFr = `${activeLayerCodes.join(' + ')} (${actualThicknessSilk} 丝 / ${actualThicknessMicrons} µm - ${activeLayersCount} couche${activeLayersCount > 1 ? 's' : ''})`;
  const zipOpt = bagDef.zipperOptions.find(z => z.instId === zipId) || bagDef.zipperOptions[0];

  const quoteSpecFr = [
    `【Fiche Devis Emballage Mylar — ${isGravure ? 'Héliogravure (凹版)' : 'Impression Numérique (数码)'}】`,
    `• Type de sac : ${bagDef.nameFr} (${bagDef.nameZh}) — ${zipOpt.label}`,
    `• Dimensions : L ${widthCm} × H ${heightCm}${bagDef.hasBottomGusset ? ` + Fond ${bottomCm}` : ''}${bagDef.hasSideGusset ? ` + Soufflet ${sideGussetCm}` : ''} cm`,
    `• Quantité : ${qty.toLocaleString('fr-FR')} pcs (${gg_ks} modèle${gg_ks > 1 ? 's' : ''})`,
    `• Structure & Épaisseur : ${layersSummaryFr}`,
    `• Découpe & Fond : ${cuttingType === 'die_cut' ? 'Découpe Forme Spéciale (模切)' : 'Coupe Droite (双切)'} | Mode fond #${bottomMode} (${gg_fljy})`,
    `• Finitions : ${uvConfig.name}${spoutKey !== 'none' ? `, ${spoutConfig.name}` : ''}${valveConfig ? ', Valve café' : ''}${handleConfig ? ', Poignée/Suspension' : ''}`,
    `• Poids estimé : ${singleWeightG.toFixed(2)} g/sac (Total : ${totalWeightKg} kg)`,
    `• Délai & Expédition : ${ isUrgent ? 'EXPRESS URGENT' : 'Standard'} (${leadTimeDays} jours — départ prévu le ${estimatedShipDate})`,
    `• Prix Unitaire HT : ${resalePriceUnitEur.toFixed(3)} € / pc (${resalePriceUnitCny.toFixed(3)} ¥)`,
    `• Total Commande : ${resalePriceTotalEur.toFixed(2)} € (${resalePriceTotalCny.toFixed(0)} ¥) ${invoiceType === 'vat_invoice' ? '[Facture TVA incluse]' : '[Hors Taxe]'}`
  ].join('\n');

  const quoteSpecZh = [
    `袋型：${bagDef.nameZh}(${zipOpt.labelZh})(${kg_sqmq})`,
    `尺寸：宽${gg_k}*高${gg_g}${gg_d > 0 ? `*底/琴${gg_d}` : ''}cm`,
    `材质结构：${layersSummaryZh}`,
    `印刷及工艺：${isGravure ? `凹版${cylinderCount}色` : (ysItem.selectField_l791w79 || 'CMYK单白')}+${uvConfig.nameZh}`,
    `配件：吸嘴(${spoutConfig.nameZh})、手提扣(${handleConfig ? handleConfig.nameZh : '无'})、透气阀(${valveConfig ? '单向透气阀' : '无'})`,
    `数量：${qty}个 (${gg_ks}款)`,
    `单价：${resalePriceUnitCny.toFixed(3)}元/个`,
    `总价：${resalePriceTotalCny.toFixed(0)}元 (${invoiceType === 'vat_invoice' ? '专票含税' : '不含税'})`,
    `预计重量：约${totalWeightKg}kg | 预计出货：${estimatedShipDate} (${leadTimeDays}天)`
  ].join('\n');

  return {
    technology: dim.technology,
    materialCostCny: Math.round(js_cl),
    printCostCny: parseFloat(js_ys.toFixed(2)),
    laminationCostCny: parseFloat(js_fh.toFixed(2)),
    bagMakingCostCny: parseFloat(js_zd.toFixed(2)),
    dieCutPlateCostCny: parseFloat(js_mjf.toFixed(2)),
    skuSurchargeCny: parseFloat(skuSurchargeCny.toFixed(2)),
    cylindersCostCny: totalCylindersCost,
    accessoriesCostCny: parseFloat(js_qt.toFixed(2)),
    rushFeeCny: parseFloat(rushFeeCny.toFixed(2)),
    shippingCostCny: parseFloat(shippingCostCny.toFixed(2)),
    taxCostCny: parseFloat(taxCostCny.toFixed(2)),
    extraFeeCny: parseFloat(qt00.toFixed(2)),

    factoryCostTotalCny: parseFloat(factoryCostTotalCny.toFixed(2)),
    factoryCostTotalEur: parseFloat(factoryCostTotalEur.toFixed(2)),
    factoryCostUnitCny: parseFloat(factoryCostUnitCny.toFixed(3)),
    factoryCostUnitEur: parseFloat(factoryCostUnitEur.toFixed(3)),

    beijincaiCatalogTotalCny: parseFloat(beijincaiCatalogTotalCny.toFixed(2)),
    beijincaiCatalogTotalEur: parseFloat(beijincaiCatalogTotalEur.toFixed(2)),
    beijincaiCatalogUnitCny: parseFloat(beijincaiCatalogUnitCny.toFixed(3)),
    beijincaiCatalogUnitEur: parseFloat(beijincaiCatalogUnitEur.toFixed(3)),

    resalePriceTotalEur: parseFloat(resalePriceTotalEur.toFixed(2)),
    resalePriceUnitEur: parseFloat(resalePriceUnitEur.toFixed(3)),
    resalePriceTotalCny: parseFloat(resalePriceTotalCny.toFixed(2)),
    resalePriceUnitCny: parseFloat(resalePriceUnitCny.toFixed(3)),

    grossProfitTotalEur: parseFloat(grossProfitTotalEur.toFixed(2)),
    grossProfitUnitEur: parseFloat(grossProfitUnitEur.toFixed(3)),
    grossProfitTotalCny: parseFloat(grossProfitTotalCny.toFixed(2)),
    grossMarginPercent: parseFloat(grossMarginPercent.toFixed(1)),
    markupPercent: parseFloat(markupPercent.toFixed(1)),

    weightUnitGrams: singleWeightG,
    weightTotalKg: totalWeightKg,
    cylinderCount,
    cylinderFeePerUnitCny: isGravure ? parseFloat((totalCylindersCost / qty).toFixed(3)) : 0,
    imposition: {
      webPoses: gg_mkpb1,
      cylinderPoses: gg_mcpb1,
      totalRotations: gg_lzs,
      linearMeters: clms,
      bagMakingMeters: zdms,
      totalFilmSqm,
      unwindingMode: gg_fljy,
      laminationPasses,
      activeLayersCount,
      actualThicknessSilk,
      actualThicknessMicrons,
      layersSummaryFr,
      layersSummaryZh,
      sizeAlert,
      isSizeValid,
      thicknessAlert,
      leadTimeDays,
      estimatedShipDate,
      factoryTierMultiplier: xs02,
      factoryMinProfitCny: qt09,
      quoteSpecFr,
      quoteSpecZh
    }
  };
}

export function calculateTierMatrix(baseDim: Omit<BagDimensions, 'quantity'>, tiers?: number[]): QuoteBreakdown[] {
  const defaultTiers = baseDim.technology === 'gravure'
    ? [5000, 10000, 20000, 50000, 100000]
    : [250, 500, 1000, 2500, 5000, 10000];
  const activeTiers = tiers || defaultTiers;
  return activeTiers.map(q => calculateMylarQuote({ ...baseDim, quantity: q }));
}

export { PRINT_LAYERS, BARRIER_LAYERS, SEAL_LAYERS };
