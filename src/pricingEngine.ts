import dbRaw from './databases_clean.json';
import gravureRaw from './databases_gravure.json';
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

export type CuttingType = 'double_cut' | 'die_cut';
export type BottomMode = 1 | 2 | 3 | 4 | 5;
export type DigitalPrintMode = 'none' | 'cmyk_white' | 'cmyk_white_inside';
export type OrderUrgency = 'normal' | 'urgent';
export type InvoiceType = 'no_invoice' | 'vat_invoice';
export type ShippingMode = 'none' | 'guangdong_free' | 'china_domestic' | 'regional_zone' | 'custom';
export type LaminationMethod = 'dry' | 'solvent_free';
export type FourSideOrientation = 'vertical' | 'horizontal';
export type RollQuoteMode = 'pcs' | 'meters' | 'kg';

export interface FreightZone {
  id: string;
  nameFr: string;
  nameZh: string;
  carrier: string;
  firstKgCny: number;
  extraKgCny: number;
}

const rawFreightItems: any[] = ((gravureRaw as any)?.freight_digital?.items) || [];
const FREIGHT_NAME_MAP: Record<string, string> = {
  '广东省内': 'Guangdong (Zone Usine — Gratuit)',
  '福建、江苏、上海、浙江、江西': 'Côte Est & Sud-Est (Shanghai, Zhejiang, Jiangsu, Fujian, Jiangxi)',
  '广西、湖北、湖南、（汽车运线）': 'Centre-Sud (Guangxi, Hubei, Hunan)',
  '河南、山东、海南、安徽 （汽车运线）': 'Plaine Centrale & Est (Shandong, Henan, Anhui, Hainan)',
  '北京、天津、（汽车运线）': 'Pékin & Tianjin (Route)',
  '云南、四川、重庆、陕西 （汽车运线）': 'Sud-Ouest & Shaanxi (Sichuan, Chongqing, Yunnan)',
  '河北、辽宁、吉林、贵州、石家庄 （汽车运线）': 'Nord & Nord-Est (Hebei, Liaoning, Jilin, Guizhou)',
  '山西、内蒙、黑龙江 （汽车运线）': 'Grand Nord (Shanxi, Mongolie Int., Heilongjiang)',
  '甘肃、宁夏、青海、新疆 （汽车运线）': 'Grand Ouest (Gansu, Ningxia, Qinghai, Xinjiang)',
  '香港': 'Hong Kong SAR (Transit Hub)',
  '澳门': 'Macao SAR',
  '西藏（空运）': 'Tibet (Fret Aérien)',
  '台湾': 'Taïwan'
};

export const FREIGHT_ZONES_CATALOG: FreightZone[] = rawFreightItems
  .map((item) => {
    const d = item.data || item;
    const nameZh = String(d.textField_m3o8svch || '').trim();
    if (!nameZh) return null;
    return {
      id: nameZh,
      nameFr: FREIGHT_NAME_MAP[nameZh] || nameZh,
      nameZh,
      carrier: String(d.textField_5z57fys || '速腾优速'),
      firstKgCny: Number(d.numberField_we9udob) || 0,
      extraKgCny: Number(d.numberField_d4ylk7b) || 0
    };
  })
  .filter((z): z is FreightZone => Boolean(z))
  .sort((a, b) => a.firstKgCny - b.firstKgCny || a.extraKgCny - b.extraKgCny);

export interface BagTypeDefinition {
  key: BagTypeKey;
  nameFr: string;
  shortFr: string;
  nameZh: string;
  imageUrl: string;
  description: string;
  hasBottomGusset: boolean;
  hasSideGusset: boolean;
  defaultBottomMode: BottomMode;
  zipperOptions: { label: string; labelFr: string; labelZh: string; instId: string; hasZip: boolean }[];
}

export const BAG_TYPES_CATALOG: BagTypeDefinition[] = [
  {
    key: 'stand_up',
    nameFr: 'Sac Debout (Doypack)',
    shortFr: 'Doypack',
    nameZh: '自立袋',
    imageUrl: '/images/bags/stand-up.jpg',
    description: 'Pochette à soufflet de fond autonome. Présentation verticale premium en linéaire.',
    hasBottomGusset: true,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Zip standard (普通拉链)', labelFr: 'Zip pression standard', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822', hasZip: true },
      { label: 'Sans zip (无拉链)', labelFr: 'Soudé ouvert (sans zip)', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMW822', hasZip: false },
      { label: 'Zip Easy-Peel / Poche (易撕拉链)', labelFr: 'Zip Easy-Peel d\'ouverture facile', labelZh: '易撕拉链', instId: 'GRAVURE-STANDUP-EASYPEEL', hasZip: true },
      { label: 'Zip sécurité enfant (童锁拉链 Child-Lock)', labelFr: 'Zip sécurité enfant certifié', labelZh: '童锁拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMY822', hasZip: true },
      { label: 'Zip curseur Slider (滑块拉链)', labelFr: 'Zip curseur coulissant (Slider)', labelZh: '滑块拉链', instId: 'GRAVURE-STANDUP-SLIDER', hasZip: true }
    ]
  },
  {
    key: 'three_side',
    nameFr: 'Sac à 3 Soudures (Plat)',
    shortFr: '3 Soudures',
    nameZh: '三边封袋',
    imageUrl: '/images/bags/three-side.jpg',
    description: 'Pochette plate périmètre thermosoudé. Efficience matière maximale et format poche.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip (无拉链)', labelFr: 'Scellé 3 côtés sans zip', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMT822', hasZip: false },
      { label: 'Zip standard (普通拉链)', labelFr: 'Zip pression standard', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMU822', hasZip: true },
      { label: 'Zip Easy-Peel (易撕拉链)', labelFr: 'Zip Easy-Peel déchirable', labelZh: '易撕拉链', instId: 'GRAVURE-3SIDE-EASYPEEL', hasZip: true },
      { label: 'Zip sécurité enfant (童锁拉链 Child-Lock)', labelFr: 'Zip sécurité enfant certifié', labelZh: '童锁拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMV822', hasZip: true }
    ]
  },
  {
    key: 'flat_bottom',
    nameFr: 'Sac Octogonal (Box Pouch)',
    shortFr: 'Box Fond Plat',
    nameZh: '八边封袋',
    imageUrl: '/images/bags/flat-bottom.jpg',
    description: '8 arêtes soudées, fond plat architectural rectangulaire et grande contenance.',
    hasBottomGusset: true,
    hasSideGusset: true,
    defaultBottomMode: 4,
    zipperOptions: [
      { label: 'Zip standard (普通拉链)', labelFr: 'Zip frontal standard', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM0922', hasZip: true },
      { label: 'Zip latéral / Easy-peel (易撕拉链/侧拉链)', labelFr: 'Zip Easy-Peel / Poche latérale', labelZh: '易撕拉链/侧拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM1922', hasZip: true },
      { label: 'Sans zip (无拉链)', labelFr: 'Ouverture haute sans zip', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMZ822', hasZip: false }
    ]
  },
  {
    key: 'center_seal',
    nameFr: 'Fermeture Centrale (Pillow)',
    shortFr: 'Soudure Dos',
    nameZh: '中封袋',
    imageUrl: '/images/bags/center-seal.jpg',
    description: 'Ailette dorsale centrale continue, idéal pour barres, snacks et conditionnement rapide.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip standard (无拉链)', labelFr: 'Sachet coussin standard', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM2922', hasZip: false }
    ]
  },
  {
    key: 'gusset',
    nameFr: 'Sac Accordéon (Soufflets)',
    shortFr: 'Accordéon',
    nameZh: '风琴袋',
    imageUrl: '/images/bags/gusset.jpg',
    description: 'Plis accordéon latéraux haute expansion pour cafés en grains, thés et grands volumes.',
    hasBottomGusset: false,
    hasSideGusset: true,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip standard (背封折边)', labelFr: 'Accordéon soudure dos standard', labelZh: '背封折边', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM3922', hasZip: false }
    ]
  },
  {
    key: 'four_side',
    nameFr: 'Sac Scellé 4 Côtés (Quad Seal)',
    shortFr: 'Quad Seal',
    nameZh: '四边封袋',
    imageUrl: '/images/bags/four-side.jpg',
    description: '4 arêtes longitudinales soudées offrant une rigidité verticale irréprochable.',
    hasBottomGusset: false,
    hasSideGusset: true,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Sans zip classique (四边封无拉链)', labelFr: 'Quad Seal sans zip', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM5922', hasZip: false },
      { label: 'Zip standard (四边封带拉链)', labelFr: 'Quad Seal avec zip frontal', labelZh: '普通拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM6922', hasZip: true },
      { label: 'Machine Zip sans rail (四边封机-无拉链)', labelFr: 'Machine Quad avec soudure renforcée', labelZh: '无拉链(带拉链机)', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM4922', hasZip: false },
      { label: 'Zip curseur Slider Hélio (滑块拉链)', labelFr: 'Quad Seal Slider curseur (Hélio)', labelZh: '滑块拉链', instId: 'GRAVURE-4SIDE-SLIDER', hasZip: true }
    ]
  },
  {
    key: 'roll_film',
    nameFr: 'Bobine de Film Automatique',
    shortFr: 'Bobine Film',
    nameZh: '复合卷膜',
    imageUrl: '/images/bags/roll-film.jpg',
    description: 'Film barrière continu livré en bobine sur mandrin pour lignes FFS automatisées.',
    hasBottomGusset: false,
    hasSideGusset: false,
    defaultBottomMode: 1,
    zipperOptions: [
      { label: 'Bobine standard (无拉链)', labelFr: 'Bobine continue standard', labelZh: '无拉链', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM7922', hasZip: false }
    ]
  }
];

export const SINGLE_LAYER_IMAGE_URL = '/images/bags/single-layer.jpg';

export const BOTTOM_MODES_CATALOG: { value: BottomMode; labelFr: string; labelZh: string; unwinding: string }[] = [
  { value: 1, labelFr: '1. Fond continu (1 bobine)', labelZh: '连底', unwinding: '单放料 (1 bobine)' },
  { value: 2, labelFr: '2. Fond rapporté imprimé (2 bobines)', labelZh: '贴底(底印刷)', unwinding: '双放料 (2 bobines)' },
  { value: 3, labelFr: '3. Fond rapporté neutre (2 bobines)', labelZh: '贴底(底不印)', unwinding: '双放料 (2 bobines)' },
  { value: 4, labelFr: '4. Face, Dos & Fond imprimé (3 bobines)', labelZh: '正背底分开(底印刷)', unwinding: '三放料 (3 bobines)' },
  { value: 5, labelFr: '5. Face, Dos & Fond neutre (3 bobines)', labelZh: '正背底分开(底不印)', unwinding: '三放料 (3 bobines)' }
];

export type SpoutSizeKey =
  | 'none'
  | 'spout_5mm'
  | 'spout_8_6mm'
  | 'spout_10mm'
  | 'spout_13mm'
  | 'spout_16mm'
  | 'spout_20mm'
  | 'spout_26mm'
  | 'spout_33mm';

export type InkCoverageLevel = 'lt20' | '20_50' | '50_100' | 'single_full' | 'double_full';
export type PantoneColorKey = 'gold' | 'silver' | 'purple' | 'magenta';
export type HandleVariantKey = 'standard' | 'rice_large' | 'rice_small';
export type AdhesiveVariantKey = 'none' | 'standard' | 'destructive';

export const INK_COVERAGE_CATALOG: { key: InkCoverageLevel; labelFr: string; labelZh: string; inkGsmAdd: number; rateMultiplier: number }[] = [
  { key: 'lt20', labelFr: '< 20% surface (Économique)', labelZh: '20%以内', inkGsmAdd: 0, rateMultiplier: 0.92 },
  { key: '20_50', labelFr: '20% – 50% surface (Standard)', labelZh: '20%-50%', inkGsmAdd: 0, rateMultiplier: 1.0 },
  { key: '50_100', labelFr: '50% – 100% surface (Dense)', labelZh: '50%-100%', inkGsmAdd: 0, rateMultiplier: 1.08 },
  { key: 'single_full', labelFr: 'Plein encrage simple (单满版)', labelZh: '单满版', inkGsmAdd: 0.5, rateMultiplier: 1.20 },
  { key: 'double_full', labelFr: 'Double plein encrage (双满版)', labelZh: '双满版', inkGsmAdd: 1.5, rateMultiplier: 1.38 }
];

export const PANTONE_COLORS_CATALOG: { key: PantoneColorKey; labelFr: string; labelZh: string; hex: string; sqmSurchargeCny: number }[] = [
  { key: 'gold', labelFr: 'Pantone Or Métal (金色)', labelZh: '金色', hex: '#D4AF37', sqmSurchargeCny: 0.12 },
  { key: 'silver', labelFr: 'Pantone Argent (银色)', labelZh: '银色', hex: '#C0C5CE', sqmSurchargeCny: 0.10 },
  { key: 'purple', labelFr: 'Pantone Violet Spécial (紫色)', labelZh: '紫色', hex: '#8B5CF6', sqmSurchargeCny: 0.08 },
  { key: 'magenta', labelFr: 'Pantone Rose / Magenta (桃红色)', labelZh: '桃红色', hex: '#EC4899', sqmSurchargeCny: 0.08 }
];

export const HANDLE_VARIANTS_CATALOG: Record<HandleVariantKey, { nameFr: string; nameZh: string; unitCost: number; minFee: number; weightG: number }> = {
  standard: { nameFr: 'Poignée découpée 10 × 5,5 cm', nameZh: '10*5.5手提', unitCost: 0.105, minFee: 100, weightG: 7.6 },
  rice_small: { nameFr: 'Poignée rigide petit format (7g)', nameZh: '大米袋小手提', unitCost: 0.180, minFee: 120, weightG: 7.0 },
  rice_large: { nameFr: 'Poignée rigide grand format (8g)', nameZh: '大米袋大手提', unitCost: 0.240, minFee: 150, weightG: 8.0 }
};

export const ADHESIVE_VARIANTS_CATALOG: Record<AdhesiveVariantKey, { nameFr: string; nameZh: string; meterRateCny: number; unitCostCny: number; minFee: number }> = {
  none: { nameFr: 'Aucune bande adhésive', nameZh: '无', meterRateCny: 0, unitCostCny: 0, minFee: 0 },
  standard: { nameFr: 'Bande adhésive 18/10mm refermable', nameZh: '自粘大号18MM/10MM', meterRateCny: 0.05, unitCostCny: 0.012, minFee: 100 },
  destructive: { nameFr: 'Colle blanche inviolable destructive 18/10mm', nameZh: '破环性白胶18MM/10MM', meterRateCny: 0.09, unitCostCny: 0.022, minFee: 140 }
};

export interface FinishesOptions {
  uvEnhancement?: 'none' | 'matte_varnish' | 'spot_uv' | 'thick_uv' | 'hot_stamping' | 'cold_foil' | 'uv_and_hot_stamping';
  hasMatteVarnish?: boolean;
  hasThickUv?: boolean;
  spoutSize?: SpoutSizeKey;
  hasDegassingValve?: boolean;
  hasHangingHole?: boolean;
  handleVariant?: HandleVariantKey;
  hasWindow?: boolean;         // 开窗 (Fenêtre transparente découpée)
  windowCount?: 1 | 2;         // 1 ou 2 fenêtres kraft
  hasEmbossing?: boolean;      // 压纹 (Gaufrage / Embossage)
  hasAdhesiveStrip?: boolean;  // 自粘 (Bande adhésive)
  adhesiveVariant?: AdhesiveVariantKey;
  fullInkCoverage?: boolean;   // Rétrocompat plein encrage
  inkCoverageLevel?: InkCoverageLevel;
  pantoneColors?: PantoneColorKey[];
}

export const FINISHES_CATALOG = {
  uv: {
    none: { name: 'Aucune finition spéciale', nameZh: '无', instId: '', unitCost: 0, minFee: 0, weightG: 0, imageUrl: '' },
    matte_varnish: { name: 'Vernis mat intégral Soft-Touch', nameZh: '满版哑油', instId: 'FINST-YLD66U81JB95U1P5I3P2Q5RVC8NF28BJN2HOMRG', unitCost: 0.40, minFee: 100, weightG: 0, imageUrl: '/images/finishes/matte.jpg' },
    spot_uv: { name: 'Vernis sélectif brillant (Spot UV)', nameZh: 'UV', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMW8U1', unitCost: 1.00, minFee: 400, weightG: 0, imageUrl: '/images/finishes/spot-uv.jpg' },
    thick_uv: { name: 'Vernis 3D tactile relief (Épais UV)', nameZh: '厚UV', instId: 'FINST-XE7668C19VP65KFKPETL3CQCX6KX3P9DOXIQMC51', unitCost: 1.70, minFee: 500, weightG: 0, imageUrl: '/images/finishes/spot-uv.jpg' },
    hot_stamping: { name: 'Dorure à chaud métallisée', nameZh: '烫金', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMV8U1', unitCost: 1.60, minFee: 400, weightG: 0, imageUrl: '/images/finishes/hot-foil.jpg' },
    cold_foil: { name: 'Dorure à froid haute précision', nameZh: '烫金（冷烫）', instId: 'GRAVURE-COLD-FOIL', unitCost: 1.80, minFee: 500, weightG: 0, imageUrl: '/images/finishes/hot-foil.jpg' },
    uv_and_hot_stamping: { name: 'Combiné Spot UV + Dorure à chaud', nameZh: 'UV+烫金', instId: 'FINST-H9E66171BSG4MK34IMWNQ9U9LF7G2S8078ENMXL3', unitCost: 1.80, minFee: 600, weightG: 0, imageUrl: '/images/finishes/hot-foil.jpg' }
  },
  spouts: {
    none: { name: 'Sans bec verseur', nameZh: '无', instId: '', unitCost: 0, minFee: 0, weightG: 0 },
    spout_5mm: { name: 'Micro-bec 5 mm', nameZh: '5mm', instId: 'GRAVURE-SPOUT-5', unitCost: 0.120, minFee: 80, weightG: 1.79 },
    spout_8_6mm: { name: 'Bec fin 8,6 mm', nameZh: '8.6mm', instId: 'GRAVURE-SPOUT-8.6', unitCost: 0.130, minFee: 80, weightG: 2.76 },
    spout_10mm: { name: 'Bouchon / Bec 10 mm', nameZh: '10mm', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMM09U1', unitCost: 0.195, minFee: 100, weightG: 3.6 },
    spout_13mm: { name: 'Bec 13 mm', nameZh: '13mm', instId: 'GRAVURE-SPOUT-13', unitCost: 0.200, minFee: 100, weightG: 4.1 },
    spout_16mm: { name: 'Bouchon / Bec 16 mm', nameZh: '16mm', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMM19U1', unitCost: 0.220, minFee: 100, weightG: 6.1 },
    spout_20mm: { name: 'Large goulot 20 mm', nameZh: '20mm', instId: 'GRAVURE-SPOUT-20', unitCost: 0.280, minFee: 120, weightG: 8.3 },
    spout_26mm: { name: 'Goulot XL 26 mm', nameZh: '26mm', instId: 'GRAVURE-SPOUT-26', unitCost: 0.380, minFee: 140, weightG: 9.0 },
    spout_33mm: { name: 'Goulot XXL 33 mm', nameZh: '33mm', instId: 'GRAVURE-SPOUT-33', unitCost: 0.440, minFee: 150, weightG: 14.5 }
  },
  valve: {
    name: 'Valve dégazage arôme unidirectionnelle',
    nameZh: '单向透气阀',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMY8U1',
    unitCost: 0.220,
    minFee: 100,
    weightG: 0.6,
    imageUrl: '/images/finishes/valve.jpg'
  },
  handle: {
    name: 'Poignée découpée 10 × 5,5 cm',
    nameZh: '10*5.5',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMZ8U1',
    unitCost: 0.105,
    minFee: 100,
    weightG: 7.6
  }
};

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
  skuCount?: number;
  cuttingType?: CuttingType;
  bottomMode?: BottomMode;
  digitalPrintMode?: DigitalPrintMode;
  laminationMethod?: LaminationMethod;
  fourSideOrientation?: FourSideOrientation;
  rollQuoteMode?: RollQuoteMode;
  rollTargetMeters?: number;
  rollTargetKg?: number;
  orderUrgency?: OrderUrgency;
  invoiceType?: InvoiceType;
  shippingMode?: ShippingMode;
  shippingRegionId?: string;
  customShippingCny?: number;
  extraFeeCny?: number;
  thicknessSi?: number;
  hasZip?: boolean;
  materialPreset?: string;
  customLayers?: CustomLayersConfig;
  cylinderCount?: number;
  finishes?: FinishesOptions;
  resalePricingMode?: 'percentage' | 'multiplier' | 'fixed_price';
  resaleMarginPercent?: number;
  resaleMultiplier?: number;
  resaleFixedUnitPriceEur?: number;
}

export interface MachineImpositionMetrics {
  webPoses: number;
  cylinderPoses: number;
  totalRotations: number;
  linearMeters: number;
  bagMakingMeters: number;
  totalFilmSqm: number;
  unwindingMode: string;
  laminationPasses: number;
  laminationMethodLabel: string;
  activeLayersCount: number;
  actualThicknessSilk: number;
  actualThicknessMicrons: number;
  layersSummaryFr: string;
  layersSummaryZh: string;
  sizeAlert: string;
  isSizeValid: boolean;
  thicknessAlert: string;
  leadTimeDays: number;
  estimatedShipDate: string;
  factoryTierMultiplier: number;
  factoryMinProfitCny: number;
  cylinderCircumferenceCm: number;
  cylinderWidthCm: number;
  singleCylinderCostCny: number;
  quoteSpecFr: string;
  quoteSpecZh: string;
}

export interface LayerCostDetail {
  slot: string;
  roleFr: string;
  code: string;
  nameFr: string;
  thicknessSilk: number;
  thicknessUm: number;
  density: number;
  pricePerKgCny: number;
  gsm: number;
  weightTotalKg: number;
  rawCostCny: number;
  costWithWasteCny: number;
  costEur: number;
}

export interface AccessoryCostDetail {
  key: string;
  label: string;
  formulaNote: string;
  costCny: number;
  costEur: number;
}

export interface GacheBreakdown {
  baseRotations: number;
  bottomExtraRotations: number;
  startupRotations: number;
  printSetupRotations: number;
  multiSkuRotations: number;
  dieCutRotations: number;
  bagWasteRotations: number;
  extraWebRotations: number;
  wasteMetersTotal: number;
  totalPrintMeters: number;
  bagMakingMeters: number;
  webWidthUsedCm: number;
}

export interface QuoteBreakdown {
  technology: PrintTechnology;
  resolvedQuantity: number;
  materialCostCny: number;
  printCostCny: number;
  laminationCostCny: number;
  bagMakingCostCny: number;
  dieCutPlateCostCny: number;
  skuSurchargeCny: number;
  cylindersCostCny: number;
  accessoriesCostCny: number;
  rushFeeCny: number;
  shippingCostCny: number;
  taxCostCny: number;
  extraFeeCny: number;

  factoryCostTotalCny: number;
  factoryCostTotalEur: number;
  factoryCostUnitCny: number;
  factoryCostUnitEur: number;

  beijincaiCatalogTotalCny: number;
  beijincaiCatalogTotalEur: number;
  beijincaiCatalogUnitCny: number;
  beijincaiCatalogUnitEur: number;

  resalePriceTotalEur: number;
  resalePriceUnitEur: number;
  resalePriceTotalCny: number;
  resalePriceUnitCny: number;

  grossProfitTotalEur: number;
  grossProfitUnitEur: number;
  grossProfitTotalCny: number;
  grossMarginPercent: number;
  markupPercent: number;

  weightUnitGrams: number;
  weightTotalKg: number;
  totalBasisGsm: number;
  cylinderCount: number;
  cylinderFeePerUnitCny: number;
  layerBreakdown: LayerCostDetail[];
  accessoryBreakdown: AccessoryCostDetail[];
  gacheBreakdown: GacheBreakdown;
  imposition: MachineImpositionMetrics;
}

export const CNY_TO_EUR_RATE = 1 / 7.8;

const uData = {
  utils: {
    Sum: (val: number[]) => (val || []).reduce((p, n) => p + n, 0),
    Max: (...args: number[]) => Math.max(...args.map(a => Number.isNaN(a) || a === undefined || a === null ? 0 : Number(a))),
    Int: (val: any) => parseInt(val || '0', 10),
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
    qtcs: (dbRaw as any).qtcs.data[0].formData,
    qtcsGravure: ((gravureRaw as any)?.qtcs_gravure?.items?.[0]) || {}
  }
};

function getSnappedCylinderCircumferenceCm(rawRepeatCm: number): number {
  const table = uData.organConfig.qtcsGravure?.tableField_m8zjfiph || [
    { numberField_m8zjfipi: 0, numberField_m8zjfipl: 54, numberField_m8zjfipk: 55 },
    { numberField_m8zjfipi: 54, numberField_m8zjfipl: 64, numberField_m8zjfipk: 65 },
    { numberField_m8zjfipi: 64, numberField_m8zjfipl: 74, numberField_m8zjfipk: 75 },
    { numberField_m8zjfipi: 74, numberField_m8zjfipl: 84, numberField_m8zjfipk: 85 },
    { numberField_m8zjfipi: 84, numberField_m8zjfipl: 94, numberField_m8zjfipk: 95 }
  ];
  for (const row of table) {
    const min = Number(row.numberField_m8zjfipi) || 0;
    const max = Number(row.numberField_m8zjfipl) || 999;
    if (rawRepeatCm >= min && rawRepeatCm <= max) {
      return Number(row.numberField_m8zjfipk) || 55;
    }
  }
  return Math.max(55, Math.ceil(rawRepeatCm));
}

export function calculateMylarQuote(dim: BagDimensions): QuoteBreakdown {
  const isGravure = dim.technology === 'gravure';
  const bagDef = BAG_TYPES_CATALOG.find(b => b.key === dim.bagType) || BAG_TYPES_CATALOG[0];
  const presetKey = dim.materialPreset || 'mylar_standard';
  const preset = MATERIAL_PRESETS[presetKey] || MATERIAL_PRESETS.mylar_standard;

  const widthCm = Math.max(1, Number(dim.widthCm) || 15);
  const heightCm = Math.max(1, Number(dim.heightCm) || 25);
  const bottomCm = bagDef.hasBottomGusset ? Math.max(0, Number(dim.bottomCm) || 6) : 0;
  const sideGussetCm = bagDef.hasSideGusset ? Math.max(0, Number(dim.sideGussetCm ?? bottomCm) || 4) : 0;

  const gg_k = widthCm;
  const gg_g = heightCm;
  const gg_d = bagDef.hasBottomGusset ? bottomCm : (bagDef.hasSideGusset ? sideGussetCm : 0);

  const gg_ks = Math.max(1, Math.round(Number(dim.skuCount) || 1));
  const cuttingType: CuttingType = dim.cuttingType || 'double_cut';
  const kg_sqmq = cuttingType === 'die_cut' ? '模切' : '双切';
  const bottomMode: BottomMode = dim.bottomMode || bagDef.defaultBottomMode || 1;
  const digitalPrintMode: DigitalPrintMode = dim.digitalPrintMode || 'cmyk_white';
  const laminationMethod: LaminationMethod = dim.laminationMethod || 'dry';
  const fourSideOrientation: FourSideOrientation = dim.fourSideOrientation || 'vertical';
  const orderUrgency: OrderUrgency = dim.orderUrgency || 'normal';
  const invoiceType: InvoiceType = dim.invoiceType || 'no_invoice';
  const shippingMode: ShippingMode = dim.shippingMode || 'none';
  const qt00 = Math.max(0, Number(dim.extraFeeCny) || 0);

  // 1. Résolution dxcs (et mapping variantes Hélio Easy-Peel / Slider sur leurs gabarits dxcs)
  let zipId = dim.zipperInstId;
  const validZipIdsForBag = bagDef.zipperOptions.map(z => z.instId);
  if (!zipId || !validZipIdsForBag.includes(zipId)) {
    const matchedOption = bagDef.zipperOptions.find(z => dim.hasZip ? z.hasZip : !z.hasZip);
    zipId = matchedOption ? matchedOption.instId : bagDef.zipperOptions[0].instId;
  }
  const GRAVURE_ZIP_FALLBACK: Record<string, string> = {
    'GRAVURE-STANDUP-EASYPEEL': 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822',
    'GRAVURE-STANDUP-SLIDER': 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822',
    'GRAVURE-3SIDE-EASYPEEL': 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMU822',
    'GRAVURE-4SIDE-SLIDER': 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM6922'
  };
  const resolvedDxcsId = GRAVURE_ZIP_FALLBACK[zipId] || zipId;
  const isSliderZip = zipId === 'GRAVURE-STANDUP-SLIDER' || zipId === 'GRAVURE-4SIDE-SLIDER';
  const isEasyPeelZip = zipId === 'GRAVURE-STANDUP-EASYPEEL' || zipId === 'GRAVURE-3SIDE-EASYPEEL';
  const dxcsItem = uData.utils.getPickerData({ instanceId: resolvedDxcsId, arr: uData.organConfig.dxcs, key: 'id' });

  // 2. Couches matériaux (Monocouche 1 couche vs Composite 2-5 couches)
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

  const yc_dj01 = Number(yscItem.textField_nohaph9) || 0;
  const yc_md01 = Number(yscItem.textField_2xfswer) || 0;
  const yc_hd01 = Number(yscItem.textField_09zzudc) || 0;
  const yc_jc01 = yscItem.textField_e5iy0au || yscItem.textField_m3n9285l || '';

  const zc1_dj01 = Number(zgc1Item.textField_nohaph9) || 0;
  const zc1_md01 = Number(zgc1Item.textField_2xfswer) || 0;
  const zc1_hd01 = Number(zgc1Item.textField_09zzudc) || 0;
  const zc1_jc01 = zgc1Item.textField_e5iy0au || zgc1Item.textField_m3n9285l || '';

  const zc2_dj01 = Number(zgc2Item.textField_nohaph9) || 0;
  const zc2_md01 = Number(zgc2Item.textField_2xfswer) || 0;
  const zc2_hd01 = Number(zgc2Item.textField_09zzudc) || 0;
  const zc2_jc01 = zgc2Item.textField_e5iy0au || zgc2Item.textField_m3n9285l || '';

  const zc3_dj01 = Number(zgc3Item.textField_nohaph9) || 0;
  const zc3_md01 = Number(zgc3Item.textField_2xfswer) || 0;
  const zc3_hd01 = Number(zgc3Item.textField_09zzudc) || 0;
  const zc3_jc01 = zgc3Item.textField_e5iy0au || zgc3Item.textField_m3n9285l || '';

  const rc_dj01 = Number(rfcItem.textField_nohaph9) || 0;
  const rc_md01 = Number(rfcItem.textField_2xfswer) || 0;
  const rc_hd01 = Number(rfcItem.textField_09zzudc) || 0;
  const rc_jc01 = rfcItem.textField_e5iy0au || rfcItem.textField_m3n9285l || '';

  const activeLayerCodes = [yc_jc01, zc1_jc01, zc2_jc01, zc3_jc01, rc_jc01].filter(Boolean);
  const activeLayersCount = Math.max(1, activeLayerCodes.length);
  const laminationPasses = isSingleLayer ? 0 : Math.max(0, activeLayersCount - 1);

  const actualThicknessSilk = parseFloat((yc_hd01 + zc1_hd01 + zc2_hd01 + zc3_hd01 + rc_hd01).toFixed(2));
  const actualThicknessMicrons = Math.round(actualThicknessSilk * 10);
  const targetThicknessSilk = dim.thicknessSi !== undefined && dim.thicknessSi > 0 ? dim.thicknessSi : actualThicknessSilk;

  let thicknessAlert = 'Épaisseur conforme';
  if (Math.abs(targetThicknessSilk - actualThicknessSilk) > 0.25) {
    thicknessAlert = targetThicknessSilk > actualThicknessSilk
      ? 'Épaisseur cumulée inférieure à la cible'
      : 'Épaisseur cumulée supérieure à la cible';
  }

  // Résolution de la quantité effective (y compris modes Bobine au mètre ou au kg)
  const totalBasisWeight =
    yc_md01 * yc_hd01 +
    zc1_md01 * zc1_hd01 +
    zc2_md01 * zc2_hd01 +
    zc3_md01 * zc3_hd01 +
    rc_md01 * rc_hd01;

  let qty = Math.max(1, Number(dim.quantity) || 1000);
  if (dim.bagType === 'roll_film') {
    const rollMode: RollQuoteMode = dim.rollQuoteMode || 'pcs';
    if (rollMode === 'meters' && dim.rollTargetMeters && dim.rollTargetMeters > 0) {
      const posesWidth = Math.max(1, Math.floor(74 / Math.max(1, gg_k)));
      qty = Math.max(1, Math.round(((dim.rollTargetMeters * 100) / Math.max(1, gg_g)) * posesWidth));
    } else if (rollMode === 'kg' && dim.rollTargetKg && dim.rollTargetKg > 0) {
      const kgPerSqm = Math.max(0.01, (totalBasisWeight * 10) / 1000);
      const unitSqm = (gg_k * gg_g) / 10000;
      qty = Math.max(1, Math.round(dim.rollTargetKg / (unitSqm * kgPerSqm)));
    }
  }

  // 3. Mode d'impression (IDs exacts validés sur databases_clean.json -> gxcb)
  const printModeInstMap: Record<DigitalPrintMode, string> = {
    none: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMU8U1',
    cmyk_white: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMO8U1',
    cmyk_white_inside: 'FINST-GOE669A1TB944FKNPGBCI9ZTUP5V3PJY1S2NMQTB'
  };
  const ysItem = uData.utils.getPickerData({
    instanceId: printModeInstMap[digitalPrintMode],
    arr: uData.organConfig.gxcb,
    key: 'id'
  });

  // 4. Finitions & Accessoires
  const uvKey = dim.finishes?.uvEnhancement || 'none';
  const uvConfig = FINISHES_CATALOG.uv[uvKey] || FINISHES_CATALOG.uv.none;
  const spoutKey: SpoutSizeKey = dim.finishes?.spoutSize || 'none';
  const spoutConfig = FINISHES_CATALOG.spouts[spoutKey] || FINISHES_CATALOG.spouts.none;
  const valveConfig = dim.finishes?.hasDegassingValve ? FINISHES_CATALOG.valve : null;
  const handleVariantKey: HandleVariantKey = dim.finishes?.handleVariant || 'standard';
  const handleConfig = dim.finishes?.hasHangingHole ? HANDLE_VARIANTS_CATALOG[handleVariantKey] : null;
  const adhesiveKey: AdhesiveVariantKey = dim.finishes?.adhesiveVariant || (dim.finishes?.hasAdhesiveStrip ? 'standard' : 'none');
  const adhesiveConfig = ADHESIVE_VARIANTS_CATALOG[adhesiveKey] || ADHESIVE_VARIANTS_CATALOG.none;
  const inkCoverageKey: InkCoverageLevel = dim.finishes?.inkCoverageLevel || (dim.finishes?.fullInkCoverage ? 'single_full' : '20_50');
  const inkCoverageObj = INK_COVERAGE_CATALOG.find(c => c.key === inkCoverageKey) || INK_COVERAGE_CATALOG[1];
  const pantoneList: PantoneColorKey[] = dim.finishes?.pantoneColors || [];

  // 5. Paramètres globaux usine (qtcs & dxcs)
  const qtcs = uData.organConfig.qtcs;
  const INT = uData.utils.Int;
  const MAX = uData.utils.Max;
  const M = uData.utils.Fixed;

  const qt01 = Number(qtcs.numberField_c2jyl6f) || 0;
  const qt02 = Number(qtcs.numberField_m3mpyv0p) || 450;
  const qt03 = Number(qtcs.numberField_m3mqbp4j) || 74;
  const qt04 = Number(qtcs.numberField_m3r8ld40) || 76;
  const qt05 = Number(qtcs.numberField_m3r8ld41) || 110;
  const qt06 = Number(qtcs.numberField_m3r8ld42) || 112;
  const qt07 = Number(qtcs.numberField_m3mqrw28) || 0.7;
  const qt08 = Number(qtcs.numberField_m3r8ld44) || 10;
  const qt11 = Number(qtcs.numberField_mdtz679b) || 500;
  const qt19 = Number(qtcs.numberField_menzxc5c) || 3;
  const qt24 = qtcs.tableField_menzxc5j || [];
  const qt25 = qtcs.tableField_mo9fep07 || [];
  const fhcsTable = qtcs.tableField_mglxnkde || qtcs.tableField_mgka3e9d || [];

  const dx02 = Number(dxcsItem.numberField_m3mpyv0d) || 7;
  const dx03 = Number(dxcsItem.numberField_m3mpyv0f) || 4;
  const dx04 = Number(dxcsItem.numberField_m3mpyv0g) || 300;
  const cx01 = Number(dxcsItem.numberField_sr3it9l) || 0;
  const cx02 = Number(dxcsItem.numberField_jp4n9ji) || 0;
  const cx03 = Number(dxcsItem.numberField_c9d9r7p) || 0;
  const cx04 = Number(dxcsItem.numberField_m3mpyv0h) || 0.4;
  const cx05 = Number(dxcsItem.numberField_m3mpyv0j) || 1.2;
  const cx06 = Number(dxcsItem.numberField_m3mpyv0i) || 1.2;

  const sh01 = Number(dxcsItem.numberField_p484hca) || 100;
  const sh02 = Number(dxcsItem.numberField_y92oli1) || 2;
  const sh03 = Number(dxcsItem.numberField_5c5a74i) || 15;
  const sh04 = Number(dxcsItem.numberField_m3mpyv0k) || 1;
  const sh05 = Number(dxcsItem.numberField_m3mpyv0l) || 2;
  const sh06 = Number(dxcsItem.numberField_m3mpyv0m) || 150;

  const zd01 = Number(dxcsItem.numberField_04m4hcc) || 350;
  const zd02_base = Number(dxcsItem.numberField_6mnwv9s) || 0.3;
  const zd03 = Number(dxcsItem.numberField_p1bf4ns) || 0.025;
  const zd04 = Number(dxcsItem.numberField_g43sr0l) || 0;
  const zd05 = Number(dxcsItem.numberField_m3mpyv0n) || 0;
  const zd06 = Number(dxcsItem.numberField_wngzhey) || 0.005;
  const zd07 = Number(dxcsItem.numberField_m3mpyv0o) || 0.01;

  // 6. Imposition exacte
  let gg_mkz1 = 0;
  let gg_mcz1 = 0;
  let gg_mkz2 = 0;
  let gg_mcz2 = 0;

  if (dim.bagType === 'stand_up') {
    gg_mkz1 = gg_g * 2 + gg_d + cx01 + (kg_sqmq === '模切' ? cx05 : 0);
    gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'three_side') {
    gg_mkz1 = gg_g * 2 + cx01 + (kg_sqmq === '模切' ? cx05 : 0);
    gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
  } else if (dim.bagType === 'flat_bottom') {
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
    if (fourSideOrientation === 'horizontal' || zipId === 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM6922') {
      gg_mkz1 = gg_g * 2 + gg_d + cx01;
      gg_mcz1 = gg_k + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
    } else {
      gg_mkz1 = (gg_k + gg_d) * 2 + cx01 * 2;
      gg_mcz1 = gg_g + cx02 + (kg_sqmq === '双切' ? cx04 : cx06);
    }
  } else if (dim.bagType === 'roll_film') {
    gg_mkz1 = gg_k;
    gg_mcz1 = gg_g;
  }

  const maxUsefulWidth = isGravure ? 95 : qt03;
  let gg_mkpb1 = Math.max(0, INT(maxUsefulWidth / (gg_mkz1 || 1)));
  const gg_mcpb1 = Math.max(1, INT(qt05 / (gg_mcz1 || 1)));

  let gg_fljy = '单放料 (1 bobine)';
  if (bottomMode === 1 && gg_mkpb1 >= 1) {
    gg_fljy = '单放料 (1 bobine)';
  } else if (bottomMode === 1 && gg_mkpb1 < 1) {
    gg_mkz1 = gg_g + gg_d * 0.5 + cx01;
    gg_mkpb1 = INT(maxUsefulWidth / (gg_mkz1 || 1));
    gg_fljy = '双放料 (2 bobines)';
  } else if (bottomMode === 2 || bottomMode === 3) {
    gg_fljy = '双放料 (2 bobines)';
  } else if (bottomMode === 4 || bottomMode === 5) {
    gg_fljy = '三放料 (3 bobines)';
  }

  const isSizeValid = gg_mkpb1 >= 1;
  const sizeAlert = isSizeValid ? 'Dimensions conformes aux laizes atelier' : 'Hors gabarit laize maximale';
  const safeMkpb1 = Math.max(1, gg_mkpb1);

  let gg_lzs1 = Math.ceil(qty / (safeMkpb1 * gg_mcpb1));
  if (bottomMode === 1 && gg_fljy.startsWith('双放料')) {
    gg_lzs1 = gg_lzs1 * 2;
  }

  let gg_lzs2 = 0;
  let gg_lzs3 = 0;
  if (dim.bagType === 'flat_bottom') {
    const mkpb2 = Math.max(1, INT(maxUsefulWidth / (gg_mkz2 || 1)));
    const mcpb2 = Math.max(1, INT(qt05 / (gg_mcz2 || 1)));
    const secondWebRotations = Math.ceil(qty / (mkpb2 * mcpb2));
    if (bottomMode === 2 || bottomMode === 4) {
      gg_lzs2 = secondWebRotations;
    } else if (bottomMode === 3 || bottomMode === 5) {
      gg_lzs3 = secondWebRotations;
    }
  }

  const gg_lzs = gg_lzs1 + gg_lzs2;

  // 7. Gâche & Métrage
  const sh_jchs = Math.ceil(sh01 / (qt06 / 100));
  const sh_ys = Math.ceil(gg_lzs * sh02 / 100);
  const sh_ks = (gg_ks - 1) * sh03;
  const sh_mq = kg_sqmq === '模切' ? Math.ceil(gg_lzs * sh04 / 100) : 0;
  const sh_zd = Math.ceil((gg_lzs + gg_lzs3) * sh05 / 100);
  const sh_zdzs = (bottomMode === 4 || bottomMode === 5) ? Math.ceil(sh06 / (qt06 / 100)) : 0;

  const sh_hs = isGravure ? Math.max(120, sh_jchs) : (sh_jchs + sh_zd + sh_zdzs);
  const sh_cs = sh_ys + sh_ks + sh_mq;

  const clms = M((gg_lzs + gg_lzs3 + sh_hs + sh_cs) * (qt06 / 100), 2);
  let zdms = M((gg_lzs + sh_cs + sh_zd) * (qt06 / 100), 2);
  if (bottomMode === 1 && gg_fljy.startsWith('双放料')) {
    zdms = M(zdms * 0.5, 2);
  }
  const webWidthUsedCm = isGravure ? Math.min(100, Math.max(40, safeMkpb1 * gg_mkz1 + 2)) : qt04;
  const totalFilmSqm = M((clms * webWidthUsedCm) / 100, 2);

  // 8. Coûts par poste — avec ventilation détaillée couche par couche
  const js_cl01 = webWidthUsedCm * qt06 * (sh_hs + gg_lzs + gg_lzs3 + sh_cs);
  const rawLayerSlots = [
    { slot: 'Couche 1', roleFr: 'Impression Ext.', item: yscItem, dj: yc_dj01, md: yc_md01, hd: yc_hd01, jc: yc_jc01 },
    { slot: 'Couche 2', roleFr: 'Barrière 1', item: zgc1Item, dj: zc1_dj01, md: zc1_md01, hd: zc1_hd01, jc: zc1_jc01 },
    { slot: 'Couche 3', roleFr: 'Barrière 2', item: zgc2Item, dj: zc2_dj01, md: zc2_md01, hd: zc2_hd01, jc: zc2_jc01 },
    { slot: 'Couche 4', roleFr: 'Barrière 3', item: zgc3Item, dj: zc3_dj01, md: zc3_md01, hd: zc3_hd01, jc: zc3_jc01 },
    { slot: 'Couche 5', roleFr: 'Scellage Int.', item: rfcItem, dj: rc_dj01, md: rc_md01, hd: rc_hd01, jc: rc_jc01 }
  ].filter(l => Boolean(l.jc));

  const layerBreakdown: LayerCostDetail[] = rawLayerSlots.map(l => {
    const gsm = parseFloat((l.md * l.hd * 10).toFixed(2));
    const weightTotalKg = parseFloat(((totalFilmSqm * gsm) / 1000).toFixed(2));
    const rawCostCny = (js_cl01 * (l.dj * l.md * l.hd)) / 1000000;
    const costWithWasteCny = parseFloat((rawCostCny * (1 + qt19 / 100)).toFixed(2));
    return {
      slot: l.slot,
      roleFr: l.roleFr,
      code: l.jc,
      nameFr: l.item.textField_a0wryjb || l.jc,
      thicknessSilk: l.hd,
      thicknessUm: Math.round(l.hd * 10),
      density: l.md,
      pricePerKgCny: l.dj,
      gsm,
      weightTotalKg,
      rawCostCny: parseFloat(rawCostCny.toFixed(2)),
      costWithWasteCny,
      costEur: parseFloat((costWithWasteCny * CNY_TO_EUR_RATE).toFixed(2))
    };
  });

  const costPerSqm5Layers =
    yc_dj01 * yc_md01 * yc_hd01 +
    zc1_dj01 * zc1_md01 * zc1_hd01 +
    zc2_dj01 * zc2_md01 * zc2_hd01 +
    zc3_dj01 * zc3_md01 * zc3_hd01 +
    rc_dj01 * rc_md01 * rc_hd01;

  const js_cl = INT((js_cl01 * costPerSqm5Layers) / 1000000 * (1 + qt19 / 100));

  const yslz_cs = sh_cs + gg_lzs;
  const gx_uv01 = uvConfig.unitCost;
  const gx_uv02 = uvConfig.minFee;
  const hasMatte = dim.finishes?.hasMatteVarnish ?? (uvKey === 'matte_varnish');
  const matteExtraCost = (hasMatte && uvKey !== 'matte_varnish') ? MAX(100, yslz_cs * 0.40) : 0;
  const uvTotalCost = gx_uv01 > 0 ? MAX(gx_uv02, yslz_cs * gx_uv01) : 0;

  let js_ys = 0;
  const cylinderCount = isGravure ? (dim.cylinderCount !== undefined ? dim.cylinderCount : 6) : 0;

  if (!isGravure) {
    const rawRate = ysItem.numberField_w5opr46;
    const rawMin = ysItem.numberField_c2jyl6f;
    const gx_ys01 = rawRate !== undefined && rawRate !== null && !Number.isNaN(Number(rawRate)) ? Number(rawRate) : (digitalPrintMode === 'none' ? 0 : digitalPrintMode === 'cmyk_white_inside' ? 5.35 : 2.7);
    const gx_ys02 = rawMin !== undefined && rawMin !== null && !Number.isNaN(Number(rawMin)) ? Number(rawMin) : (digitalPrintMode === 'none' ? 0 : 100);
    const baseDigitalPrint = gx_ys01 === 0 ? 0 : MAX(gx_ys02, yslz_cs * gx_ys01 + sh_hs * qt01);
    const inkMultDigital = inkCoverageObj.key === 'single_full' ? 1.15 : inkCoverageObj.key === 'double_full' ? 1.30 : 1.0;
    js_ys = M((baseDigitalPrint * inkMultDigital + uvTotalCost + matteExtraCost) * (1 + qt19 / 100), 2);
  } else {
    const gravureSetupCny = cylinderCount === 0 ? 0 : cylinderCount * 200;
    const gravureInkPerSqmTable: Record<number, number> = {
      0: 0.500, 1: 0.305, 2: 0.355, 3: 0.405, 4: 0.455, 5: 0.505,
      6: 0.705, 7: 0.805, 8: 0.855, 9: 0.905, 10: 0.955
    };
    const inkRatePerSqm = gravureInkPerSqmTable[cylinderCount] ?? 0.705;
    const pantoneExtraSqm = pantoneList.reduce((acc, pKey) => {
      const pObj = PANTONE_COLORS_CATALOG.find(c => c.key === pKey);
      return acc + (pObj ? pObj.sqmSurchargeCny : 0);
    }, 0);
    const baseGravurePrint = cylinderCount === 0 && pantoneList.length === 0
      ? 0
      : MAX(gravureSetupCny, totalFilmSqm * (inkRatePerSqm * inkCoverageObj.rateMultiplier + pantoneExtraSqm));
    js_ys = M((baseGravurePrint + uvTotalCost + matteExtraCost) * (1 + qt19 / 100), 2);
  }

  // Poste 3 : Contrecollage (Sec 常规干复 vs Sans solvant 无溶剂复合)
  let js_fh = 0;
  let laminationMethodLabel = isSingleLayer ? 'Aucune (Monocouche)' : 'Contrecollage sec standard';
  if (laminationPasses > 0) {
    if (isGravure && laminationMethod === 'solvent_free') {
      laminationMethodLabel = 'Contrecollage sans solvant (Alimentaire)';
      const sfCost = MAX(400, totalFilmSqm * 0.14 * laminationPasses);
      js_fh = M(sfCost * (1 + qt19 / 100), 2);
    } else if (isGravure) {
      laminationMethodLabel = 'Contrecollage sec haute barrière';
      const dryCost = MAX(200, totalFilmSqm * 0.225 * laminationPasses);
      js_fh = M(dryCost * (1 + qt19 / 100), 2);
    } else {
      const passLabel = `${laminationPasses}次`;
      const fhRow = fhcsTable.find((r: any) =>
        (r.selectField_mglxnkda === passLabel) || (r.selectField_mglxnkdf === passLabel) || (r.selectField_mgka3e9e === passLabel)
      ) || fhcsTable[Math.min(laminationPasses - 1, fhcsTable.length - 1)] || {};

      const fhcs01 = Number(fhRow.numberField_mglxnkdb ?? fhRow.numberField_mglxnkdg ?? fhRow.numberField_mgka3e9f) || (laminationPasses === 1 ? 150 : laminationPasses === 2 ? 150 : laminationPasses === 3 ? 200 : 250);
      const fhcs02 = Number(fhRow.numberField_mglxnkdc ?? fhRow.numberField_mglxnkdh ?? fhRow.numberField_mgka3e9g) || 700;
      const fhcs03 = Number(fhRow.numberField_mglxnkdd ?? fhRow.numberField_mglxnkdi ?? fhRow.numberField_mgka3e9h) || (laminationPasses === 1 ? 0.25 : laminationPasses === 2 ? 0.50 : laminationPasses === 3 ? 0.70 : 0.85);
      js_fh = M((clms <= fhcs02 ? fhcs01 : fhcs01 + (clms - fhcs02) * fhcs03) * (1 + qt19 / 100), 2);
    }
  }

  // Poste 4 : Façonnage (Allégé automatiquement en mode monocouche / bobine, majoré pour Slider/Easy-Peel)
  const singleLayerBagDiscount = isSingleLayer ? 0.55 : 1.0;
  const rollConversionDiscount = dim.bagType === 'roll_film' ? 0.28 : 1.0;
  const effectiveZdBase = isSliderZip ? Math.max(zd02_base, isGravure ? 0.65 : 0.75) : isEasyPeelZip ? Math.max(zd02_base, 0.55) : zd02_base;
  const effectiveZdMin = isSliderZip ? Math.max(zd01, 450) : isEasyPeelZip ? Math.max(zd01, 380) : zd01;
  const zd02 = M(MAX(effectiveZdBase, (qty / (zdms || 1)) * zd03), 3);
  const unwindingMultiplier = (bottomMode === 2 || bottomMode === 3 || (bottomMode === 1 && gg_fljy.startsWith('双放料')))
    ? 1
    : (bottomMode === 4 || bottomMode === 5) ? 2 : 0;

  const baseBagMaking =
    (MAX(effectiveZdMin * singleLayerBagDiscount * rollConversionDiscount, zdms * zd02 * singleLayerBagDiscount * rollConversionDiscount) +
    unwindingMultiplier * zdms * zd05 +
    ((gg_k * zd04) / 100 + (kg_sqmq === '双切' ? zd06 : zd07)) * qty * rollConversionDiscount);

  const js_zd = M(baseBagMaking * (1 + qt19 / 100), 2);
  const js_mjf = kg_sqmq === '模切' ? M(qt02 * (1 + qt19 / 100), 2) : 0;
  const skuSurchargeCny = gg_ks >= 4 ? M((gg_ks - 3) * qt08 * (1 + qt19 / 100), 2) : 0;

  // Poste 5 : Poids + Accessoires (avec détail poste par poste)
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

  const totalBasisGsm = parseFloat((totalBasisWeight * 10).toFixed(1));
  const wasteFactorWeight = dim.bagType === 'roll_film' ? 1.02 : 1.15;
  const singleWeightG = M(((unfoldedAreaCm2 / 10000) * totalBasisGsm * wasteFactorWeight) + accessoryWeightG, 2);
  const totalWeightKg = Math.max(1, Math.round((singleWeightG * qty) / 1000));

  const xz_cost = spoutConfig.unitCost > 0 ? MAX(spoutConfig.minFee, spoutConfig.unitCost * qty) : 0;
  const stk_cost = handleConfig ? MAX(handleConfig.minFee, handleConfig.unitCost * qty) : 0;
  const tqf_cost = valveConfig ? MAX(handleConfig ? handleConfig.minFee : valveConfig.minFee, valveConfig.unitCost * qty) : 0;

  const winCount = dim.finishes?.windowCount === 2 ? 2 : 1;
  const windowCost = dim.finishes?.hasWindow
    ? MAX(winCount === 2 ? 900 : 700, zdms * (winCount === 2 ? 0.06 : 0.05)) * (isGravure ? 1 : 0.35)
    : 0;
  const embossingCost = dim.finishes?.hasEmbossing ? MAX(300, zdms * 0.10 + qty * 0.015) : 0;
  const adhesiveCost = adhesiveKey !== 'none'
    ? MAX(adhesiveConfig.minFee, zdms * adhesiveConfig.meterRateCny + qty * adhesiveConfig.unitCostCny)
    : 0;
  const cartonCostRaw = qt07 * totalWeightKg;
  const rawSkuExtra = gg_ks >= 4 ? (gg_ks - 3) * qt08 : 0;

  const accessoryBreakdown: AccessoryCostDetail[] = [
    xz_cost > 0 ? { key: 'spout', label: spoutConfig.name, formulaNote: `max(${spoutConfig.minFee}¥, ${spoutConfig.unitCost}×${qty})`, costCny: M(xz_cost * (1 + qt19 / 100), 2), costEur: M(xz_cost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    tqf_cost > 0 ? { key: 'valve', label: 'Valve dégazage arôme', formulaNote: `max(${valveConfig?.minFee}¥, 0.22×${qty})`, costCny: M(tqf_cost * (1 + qt19 / 100), 2), costEur: M(tqf_cost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    stk_cost > 0 && handleConfig ? { key: 'handle', label: handleConfig.nameFr, formulaNote: `max(${handleConfig.minFee}¥, ${handleConfig.unitCost}×${qty})`, costCny: M(stk_cost * (1 + qt19 / 100), 2), costEur: M(stk_cost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    windowCost > 0 ? { key: 'window', label: `Fenêtre Kraft découpée (${winCount}×)`, formulaNote: `${zdms}m découpés`, costCny: M(windowCost * (1 + qt19 / 100), 2), costEur: M(windowCost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    embossingCost > 0 ? { key: 'emboss', label: 'Gaufrage / Embossage (压纹)', formulaNote: `max(300¥, métrage+qté)`, costCny: M(embossingCost * (1 + qt19 / 100), 2), costEur: M(embossingCost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    adhesiveCost > 0 ? { key: 'adhesive', label: adhesiveConfig.nameFr, formulaNote: `${zdms}m + ${qty} pcs`, costCny: M(adhesiveCost * (1 + qt19 / 100), 2), costEur: M(adhesiveCost * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    cartonCostRaw > 0 ? { key: 'cartons', label: 'Cartons & emballage export', formulaNote: `${totalWeightKg} kg × ${qt07} ¥/kg (+3% perte)`, costCny: M(cartonCostRaw * (1 + qt19 / 100), 2), costEur: M(cartonCostRaw * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null,
    rawSkuExtra > 0 ? { key: 'sku', label: `Surcoût multi-visuels (${gg_ks} SKU)`, formulaNote: `(${gg_ks}-3) × ${qt08}¥`, costCny: M(rawSkuExtra * (1 + qt19 / 100), 2), costEur: M(rawSkuExtra * (1 + qt19 / 100) * CNY_TO_EUR_RATE, 2) } : null
  ].filter((x): x is AccessoryCostDetail => Boolean(x));

  const js_qt = M(
    (xz_cost + stk_cost + tqf_cost + windowCost + embossingCost + adhesiveCost + cartonCostRaw + rawSkuExtra) *
      (1 + qt19 / 100),
    2
  );

  // Poste 6 : Cylindres cuivre (Formule exacte zb04 * zb05 * 0.15)
  const rawRepeatCm = gg_mcz1 * 1;
  const cylinderCircumferenceCm = getSnappedCylinderCircumferenceCm(rawRepeatCm);
  const minCylinderLen = Number(uData.organConfig.qtcsGravure?.numberField_lchhi68n) || 40;
  const unitHeightWrap = Math.max(1, gg_mkz1);
  const cylinderWidthCm = M((INT((minCylinderLen - 0.01) / unitHeightWrap) + 1) * unitHeightWrap, 1);
  const ratePerSqCm = Number(uData.organConfig.qtcsGravure?.numberField_lchhi68o) || 0.15;
  const singleCylinderCostCny = isGravure && cylinderCount > 0 ? M(cylinderWidthCm * cylinderCircumferenceCm * ratePerSqCm, 0) : 0;
  const totalCylindersCost = isGravure ? singleCylinderCostCny * cylinderCount : 0;

  // Poste 7 : Urgence & Délai
  const isUrgent = orderUrgency === 'urgent';
  const js_jjf = isUrgent ? qt11 : 0;
  const js_gcjjf = isUrgent ? dx04 : 0;
  const rushFeeCny = js_jjf + js_gcjjf;
  const leadTimeDays = isUrgent ? dx03 : (isGravure ? dx02 + 5 : dx02);
  const estimatedShipDate = uData.utils.getDateAfterDays(leadTimeDays);

  // Poste 8 : Frais de port (Zone régionale 速腾优速 / Guangdong / Personnalisé)
  let shippingCostCny = 0;
  if (shippingMode === 'china_domestic') {
    shippingCostCny = 12 + Math.max(0, totalWeightKg - 1) * 1.4;
  } else if (shippingMode === 'regional_zone') {
    const zone = FREIGHT_ZONES_CATALOG.find(z => z.id === dim.shippingRegionId) || FREIGHT_ZONES_CATALOG[1];
    if (zone && zone.firstKgCny > 0) {
      shippingCostCny = M(zone.firstKgCny + Math.max(0, totalWeightKg - 1) * zone.extraKgCny, 2);
    }
  } else if (shippingMode === 'custom') {
    shippingCostCny = Math.max(0, Number(dim.customShippingCny) || 0);
  }

  // 9. Coût total usine vs Catalogue
  const baseProductionCostCny = js_cl + js_ys + js_fh + js_zd + js_qt;

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
      qt09 = Number(row.numberField_mo9fep0a ?? row.numberField_mo9fep0b) || 150;
      break;
    }
  }

  const preTaxFactoryCostCny = baseProductionCostCny + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00;
  const bj01 = M(
    MAX(
      baseProductionCostCny + qt09 + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00,
      baseProductionCostCny * xs02 + js_mjf + totalCylindersCost + rushFeeCny + shippingCostCny + qt00
    ),
    2
  );

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

  // 10. Prix de revente
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

  // 11. Devis FR & Fiche Production ZH
  const layersSummaryZh = `${activeLayerCodes.join('+')} (${actualThicknessSilk}丝)`;
  const layersSummaryFr = `${activeLayerCodes.join(' + ')} (${actualThicknessMicrons} µm · ${activeLayersCount} couche${activeLayersCount > 1 ? 's' : ''})`;
  const zipOpt = bagDef.zipperOptions.find(z => z.instId === zipId) || bagDef.zipperOptions[0];

  const finishesListFr = [
    uvKey !== 'none' ? uvConfig.name : null,
    hasMatte && uvKey !== 'matte_varnish' ? 'Vernis mat Soft-Touch' : null,
    pantoneList.length > 0 ? `Pantone: ${pantoneList.map(k => PANTONE_COLORS_CATALOG.find(p => p.key === k)?.labelFr).filter(Boolean).join(' + ')}` : null,
    spoutKey !== 'none' ? spoutConfig.name : null,
    valveConfig ? 'Valve dégazage café' : null,
    handleConfig ? handleConfig.nameFr : null,
    dim.finishes?.hasWindow ? `Fenêtre transparente (${winCount})` : null,
    dim.finishes?.hasEmbossing ? 'Gaufrage texture relief' : null,
    adhesiveKey !== 'none' ? adhesiveConfig.nameFr : null
  ].filter(Boolean).join(', ') || 'Finition standard brute';

  const quoteSpecFr = [
    `PROPOSITION COMMERCIALE — ${isGravure ? 'HÉLIOGRAVURE INDUSTRIELLE' : 'IMPRESSION NUMÉRIQUE HD'}${isSingleLayer ? ' (MONOCOUCHE)' : ''}`,
    `• Format : ${bagDef.nameFr} — ${zipOpt.labelFr}`,
    `• Dimensions : L ${widthCm} × H ${heightCm}${bagDef.hasBottomGusset ? ` + Fond ${bottomCm}` : ''}${bagDef.hasSideGusset ? ` + Soufflet ${sideGussetCm}` : ''} cm`,
    `• Volume : ${qty.toLocaleString('fr-FR')} ex. (${gg_ks} visuel${gg_ks > 1 ? 's' : ''})`,
    `• Complexe Matière : ${layersSummaryFr}`,
    `• Façonnage : ${cuttingType === 'die_cut' ? 'Découpe sur-mesure (Forme)' : 'Coupe droite'} · Mode #${bottomMode}`,
    `• Finitions & Accessoires : ${finishesListFr}`,
    `• Logistique & Délai : ~${totalWeightKg} kg · ${isUrgent ? 'Production Prioritaire' : 'Standard'} (${leadTimeDays} j — départ estimé ${estimatedShipDate})`,
    `• Prix Unitaire : ${resalePriceUnitEur.toFixed(3)} € HT / pièce`,
    `• Total Commande : ${resalePriceTotalEur.toFixed(2)} € ${invoiceType === 'vat_invoice' ? '(TVA Usine incluse)' : 'HT'}`
  ].join('\n');

  const quoteSpecZh = [
    `袋型：${bagDef.nameZh}${isSingleLayer ? '(单层)' : '(复合)'}(${zipOpt.labelZh})(${kg_sqmq})`,
    `尺寸：宽${gg_k}*高${gg_g}${gg_d > 0 ? `*底/琴${gg_d}` : ''}cm`,
    `材质结构：${layersSummaryZh}`,
    `印刷工艺：${isGravure ? `凹版${cylinderCount}色(${inkCoverageObj.labelZh}${pantoneList.length ? `+专色${pantoneList.map(k => PANTONE_COLORS_CATALOG.find(p => p.key === k)?.labelZh).join('/')}` : ''},版费${totalCylindersCost}元)` : (ysItem.textField_dzk31za || (digitalPrintMode === 'none' ? '不印刷' : digitalPrintMode === 'cmyk_white_inside' ? 'CMYK单白+里印' : 'CMYK单白'))}+${uvConfig.nameZh}`,
    `配件：吸嘴(${spoutConfig.nameZh})、手提扣(${handleConfig ? handleConfig.nameZh : '无'})、透气阀(${valveConfig ? '有' : '无'})${adhesiveKey !== 'none' ? `、${adhesiveConfig.nameZh}` : ''}`,
    `数量：${qty}个 (${gg_ks}款)`,
    `单价：${resalePriceUnitCny.toFixed(3)}元/个 | 总价：${resalePriceTotalCny.toFixed(0)}元`,
    `预计重量：${totalWeightKg}kg | 预计出货：${estimatedShipDate} (${leadTimeDays}天)`
  ].join('\n');

  const wasteMetersTotal = M((sh_hs + sh_cs) * (qt06 / 100), 2);
  const gacheBreakdown: GacheBreakdown = {
    baseRotations: gg_lzs,
    bottomExtraRotations: gg_lzs3,
    startupRotations: sh_jchs,
    printSetupRotations: sh_ys,
    multiSkuRotations: sh_ks,
    dieCutRotations: sh_mq,
    bagWasteRotations: sh_zd,
    extraWebRotations: sh_zdzs,
    wasteMetersTotal,
    totalPrintMeters: clms,
    bagMakingMeters: zdms,
    webWidthUsedCm
  };

  return {
    technology: dim.technology,
    resolvedQuantity: qty,
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
    totalBasisGsm,
    cylinderCount,
    cylinderFeePerUnitCny: isGravure ? parseFloat((totalCylindersCost / qty).toFixed(3)) : 0,
    layerBreakdown,
    accessoryBreakdown,
    gacheBreakdown,
    imposition: {
      webPoses: gg_mkpb1,
      cylinderPoses: gg_mcpb1,
      totalRotations: gg_lzs,
      linearMeters: clms,
      bagMakingMeters: zdms,
      totalFilmSqm,
      unwindingMode: gg_fljy,
      laminationPasses,
      laminationMethodLabel,
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
      cylinderCircumferenceCm,
      cylinderWidthCm,
      singleCylinderCostCny,
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

// =========================================================================
// LES 7 OUTILS CALCULATEURS ATELIER (FORMULES EXACTES ALIWORK SCRAPÉES)
// =========================================================================

// 1. Poids Bobine (kg) -> Longueur Film (m)
export function calcRollLengthFromWeight(
  weightKg: number,
  webWidthCm: number,
  layers: { thicknessSilk: number; density: number }[]
): { sumDensityThickness: number; lengthMeters: number; basisGsm: number } {
  const sumDT = layers.reduce((acc, l) => acc + (Number(l.thicknessSilk) || 0) * (Number(l.density) || 0), 0);
  if (weightKg <= 0 || webWidthCm <= 0 || sumDT <= 0) {
    return { sumDensityThickness: 0, lengthMeters: 0, basisGsm: 0 };
  }
  const lengthMeters = Math.round((weightKg / webWidthCm) * 10000 / sumDT);
  const basisGsm = parseFloat((sumDT * 10).toFixed(1));
  return { sumDensityThickness: parseFloat(sumDT.toFixed(2)), lengthMeters, basisGsm };
}

// 2. Longueur Bobine (m) -> Diamètre Extérieur (mm)
export function calcRollDiameterFromLength(
  coreOuterMm: number,
  thicknessSilk: number,
  lengthMeters: number
): { outerDiameterMm: number; wallThicknessMm: number } {
  if (thicknessSilk <= 0 || lengthMeters < 0 || coreOuterMm <= 0) {
    return { outerDiameterMm: coreOuterMm, wallThicknessMm: 0 };
  }
  const outerDiameterMm = Math.round(Math.pow((4 * thicknessSilk * 10 * lengthMeters) / Math.PI + Math.pow(coreOuterMm, 2), 0.5));
  const wallThicknessMm = parseFloat(((outerDiameterMm - coreOuterMm) / 2).toFixed(1));
  return { outerDiameterMm, wallThicknessMm };
}

// 3. Diamètre Extérieur (mm) -> Longueur Bobine (m)
export function calcRollLengthFromDiameter(
  outerDiameterMm: number,
  coreOuterMm: number,
  thicknessSilk: number
): { lengthMeters: number } {
  if (thicknessSilk <= 0 || outerDiameterMm <= coreOuterMm) {
    return { lengthMeters: 0 };
  }
  const lengthMeters = Math.round((3.141592 * (outerDiameterMm * outerDiameterMm - coreOuterMm * coreOuterMm)) / (40 * thicknessSilk));
  return { lengthMeters };
}

// 4. Prix au m² -> Prix au kg
export function calcKgPriceFromSqm(
  sqmPriceCny: number,
  density: number,
  thicknessSilk: number
): { pricePerKgCny: number; pricePerKgEur: number; gsm: number } {
  if (density <= 0 || thicknessSilk <= 0) {
    return { pricePerKgCny: 0, pricePerKgEur: 0, gsm: 0 };
  }
  const pricePerKgCny = parseFloat(((sqmPriceCny / (density * thicknessSilk)) * 100).toFixed(2));
  const pricePerKgEur = parseFloat((pricePerKgCny * CNY_TO_EUR_RATE).toFixed(2));
  const gsm = parseFloat((density * thicknessSilk * 10).toFixed(1));
  return { pricePerKgCny, pricePerKgEur, gsm };
}

// 5. Grammage (g/m²) -> Densité (g/cm³)
export function calcDensityFromGsm(gsm: number, thicknessSilk: number): { density: number } {
  if (gsm <= 0 || thicknessSilk <= 0) return { density: 0 };
  return { density: parseFloat((gsm / thicknessSilk / 10).toFixed(2)) };
}

// 6. Calculateur MOQ (Quantité Minimum selon largeur laize & métrage minimum)
export function calcMoqPieces(params: {
  bagType: BagTypeKey;
  minWebWidthCm: number;
  runMeters: number;
  widthCm: number;
  heightCm: number;
  gussetCm: number;
  wastePercent: number;
}): { moqPieces: number; webPoses: number } {
  const { bagType, minWebWidthCm, runMeters, widthCm, heightCm, gussetCm, wastePercent } = params;
  const w = Math.max(1, widthCm);
  const h = Math.max(1, heightCm);
  const g = Math.max(0, gussetCm);
  let webPoses = 1;
  let pitchCm = w;

  if (bagType === 'three_side') {
    webPoses = Math.floor(minWebWidthCm / (h * 2)) + 1;
    pitchCm = w;
  } else if (bagType === 'stand_up' || bagType === 'flat_bottom') {
    webPoses = Math.floor(minWebWidthCm / (h * 2 + g)) + 1;
    pitchCm = w;
  } else if (bagType === 'center_seal') {
    webPoses = Math.floor(minWebWidthCm / (w * 2)) + 1;
    pitchCm = h;
  } else {
    webPoses = Math.floor(minWebWidthCm / (w * 2 + g)) + 1;
    pitchCm = h;
  }

  const rawPcs = (runMeters / pitchCm) * 100 * Math.max(1, webPoses) * (1 - wastePercent / 100);
  return { moqPieces: Math.max(1, Math.round(rawPcs)), webPoses: Math.max(1, webPoses) };
}

// 7. Calculateur Débit Matière / Laize Atelier (下料计算)
export function calcBagUnwindingBreakdown(params: {
  bagType: BagTypeKey;
  quantity: number;
  widthCm: number;
  heightCm: number;
  gussetCm: number;
  minWebWidthCm: number;
  laminationPasses: number;
  printWasteMeters?: number;
  printWastePct?: number;
  lamWasteMeters?: number;
  lamWastePct?: number;
  bagWasteMeters?: number;
  bagWastePct?: number;
}): {
  unitUnfoldedWidthCm: number;
  unitLengthCm: number;
  webPoses: number;
  totalWebWidthCm: number;
  initialMeters: number;
  printWasteMeters: number;
  laminationWasteMeters: number;
  bagMakingWasteMeters: number;
  totalMetersOrder: number;
} {
  const w = Math.max(1, params.widthCm);
  const h = Math.max(1, params.heightCm);
  const g = Math.max(0, params.gussetCm);

  let unitUnfoldedWidthCm = h * 2;
  let unitLengthCm = w;
  if (params.bagType === 'stand_up') {
    unitUnfoldedWidthCm = h * 2 + g * 2;
  } else if (params.bagType === 'flat_bottom') {
    unitUnfoldedWidthCm = h * 2 + g;
  } else if (params.bagType === 'center_seal') {
    unitUnfoldedWidthCm = w * 2;
    unitLengthCm = h;
  } else if (params.bagType === 'gusset' || params.bagType === 'four_side') {
    unitUnfoldedWidthCm = w * 2 + g * 2;
    unitLengthCm = h;
  } else if (params.bagType === 'roll_film') {
    unitUnfoldedWidthCm = w;
    unitLengthCm = h;
  }

  const bleedWidth = 1.6;
  const bleedLen = 0.4;
  const webPoses = Math.max(1, Math.floor(params.minWebWidthCm / (unitUnfoldedWidthCm + bleedWidth)) + 1);
  const totalWebWidthCm = parseFloat(((unitUnfoldedWidthCm + bleedWidth) * webPoses).toFixed(1));
  const effUnitLen = unitLengthCm + bleedLen;
  const initialMeters = Math.round((params.quantity * effUnitLen) / webPoses / 100);

  const printW = Math.round(initialMeters * ((params.printWastePct ?? 2) / 100) + (params.printWasteMeters ?? 100));
  const lamW = params.laminationPasses > 0
    ? Math.round((initialMeters * ((params.lamWastePct ?? 1.5) / 100) + (params.lamWasteMeters ?? 60)) * params.laminationPasses)
    : 0;
  const bagW = Math.round(initialMeters * ((params.bagWastePct ?? 2) / 100) + (params.bagWasteMeters ?? 120));

  return {
    unitUnfoldedWidthCm: parseFloat(unitUnfoldedWidthCm.toFixed(1)),
    unitLengthCm: parseFloat(effUnitLen.toFixed(1)),
    webPoses,
    totalWebWidthCm,
    initialMeters,
    printWasteMeters: printW,
    laminationWasteMeters: lamW,
    bagMakingWasteMeters: bagW,
    totalMetersOrder: initialMeters + printW + lamW + bagW
  };
}

export { PRINT_LAYERS, BARRIER_LAYERS, SEAL_LAYERS };
