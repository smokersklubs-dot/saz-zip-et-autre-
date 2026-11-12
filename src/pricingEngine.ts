import dbRaw from './databases_clean.json';
import { ALL_STRUCTURE_PRESETS } from './materialsCatalog';

export type PrintTechnology = 'digital' | 'gravure';

export type BagTypeKey = 
  | 'stand_up'      // 自立袋 (Sac debout / Doypack)
  | 'three_side'    // 三边封袋 (Sac à trois soudures)
  | 'flat_bottom'   // 八边封袋 (Sac octogonal / Box pouch)
  | 'center_seal'   // 中封袋 (Sachet à fermeture centrale)
  | 'gusset'        // 风琴袋 (Sac accordéon / soufflets)
  | 'four_side'     // 四边封袋 (Sac scellé 4 côtés)
  | 'roll_film';    // 卷膜 (Film en rouleau)

export interface BagTypeDefinition {
  key: BagTypeKey;
  nameFr: string;
  nameZh: string;
  description: string;
  hasBottomGusset: boolean;
  hasSideGusset: boolean;
  zipperOptions: { label: string; instId: string }[];
}

export const BAG_TYPES_CATALOG: BagTypeDefinition[] = [
  {
    key: 'stand_up',
    nameFr: 'Sac Debout (Doypack)',
    nameZh: '自立袋',
    description: 'Pochette avec soufflet de fond, tient debout en rayon. Format n°1 Mylar.',
    hasBottomGusset: true,
    hasSideGusset: false,
    zipperOptions: [
      { label: 'Zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822' },
      { label: 'Sans zip', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMW822' },
      { label: 'Zip sécurité enfant (Child-resistant)', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMY822' }
    ]
  },
  {
    key: 'three_side',
    nameFr: 'Sac à 3 Soudures (Plat)',
    nameZh: '三边封袋',
    description: 'Pochette plate scellée sur 3 côtés. Compacte et économique.',
    hasBottomGusset: false,
    hasSideGusset: false,
    zipperOptions: [
      { label: 'Sans zip', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMT822' },
      { label: 'Zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMU822' },
      { label: 'Zip sécurité enfant', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMV822' }
    ]
  },
  {
    key: 'flat_bottom',
    nameFr: 'Sac Octogonal (Fond Plat)',
    nameZh: '八边封袋',
    description: '8 côtés scellés, fond plat rectangulaire haute capacité (Box Pouch).',
    hasBottomGusset: true,
    hasSideGusset: true,
    zipperOptions: [
      { label: 'Zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM0922' },
      { label: 'Zip latéral / Easy-peel', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM1922' },
      { label: 'Sans zip', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMZ822' }
    ]
  },
  {
    key: 'center_seal',
    nameFr: 'Fermeture Centrale (Pillow)',
    nameZh: '中封袋',
    description: 'Soudure dorsale centrale au dos. Sachet classique snacks / poudres.',
    hasBottomGusset: false,
    hasSideGusset: false,
    zipperOptions: [
      { label: 'Sans zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM2922' }
    ]
  },
  {
    key: 'gusset',
    nameFr: 'Sac Accordéon (Soufflets Latéraux)',
    nameZh: '风琴袋',
    description: 'Soufflets sur les 2 côtés avec scellage arrière, pour café/thé/vrac.',
    hasBottomGusset: false,
    hasSideGusset: true,
    zipperOptions: [
      { label: 'Sans zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM3922' }
    ]
  },
  {
    key: 'four_side',
    nameFr: 'Sac Scellé 4 Côtés (Quad Seal)',
    nameZh: '四边封袋',
    description: '4 arrêtes scellées, excellente tenue et rigidité.',
    hasBottomGusset: false,
    hasSideGusset: true,
    zipperOptions: [
      { label: 'Zip standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM6922' },
      { label: 'Sans zip', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM5922' }
    ]
  },
  {
    key: 'roll_film',
    nameFr: 'Bobine de Film (Rouleau)',
    nameZh: '卷膜',
    description: 'Film continu imprimé en bobine pour ensacheuses automatiques.',
    hasBottomGusset: false,
    hasSideGusset: false,
    zipperOptions: [
      { label: 'Bobine standard', instId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMM7922' }
    ]
  }
];

export interface FinishesOptions {
  uvEnhancement?: 'none' | 'matte_varnish' | 'spot_uv' | 'thick_uv' | 'hot_stamping' | 'uv_and_hot_stamping';
  hasMatteVarnish?: boolean;
  spoutSize?: 'none' | 'spout_10mm' | 'spout_16mm';
  hasDegassingValve?: boolean;
  hasHangingHole?: boolean;
}

export const FINISHES_CATALOG = {
  uv: {
    none: { name: 'Aucun vernis spécial', instId: null, unitCost: 0, minFee: 0, weightG: 0 },
    matte_varnish: { name: 'Vernis mat plein (满版哑油)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMF8U1', unitCost: 0.40, minFee: 100, weightG: 0 },
    spot_uv: { name: 'Vernis sélectif standard (UV)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMJ8U1', unitCost: 1.00, minFee: 400, weightG: 0 },
    thick_uv: { name: 'Vernis sélectif épais 3D (厚UV)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMME8U1', unitCost: 1.70, minFee: 500, weightG: 0 },
    hot_stamping: { name: 'Dorure à chaud (烫金)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMK8U1', unitCost: 1.60, minFee: 400, weightG: 0 },
    uv_and_hot_stamping: { name: 'Vernis UV + Dorure combinée (UV+烫金)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMG8U1', unitCost: 1.80, minFee: 600, weightG: 0 }
  },
  spouts: {
    none: { name: 'Sans bouchon/bec', instId: null, unitCost: 0, minFee: 0, weightG: 0 },
    spout_10mm: { name: 'Bouchon/Bec 10mm (吸嘴10mm)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMML8U1', unitCost: 0.195, minFee: 100, weightG: 3.5 },
    spout_16mm: { name: 'Bouchon/Bec 16mm (吸嘴16mm)', instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMM8U1', unitCost: 0.220, minFee: 100, weightG: 6.1 }
  },
  valve: {
    name: 'Valve dégazage café (单向透气阀)',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMN8U1',
    unitCost: 0.220,
    minFee: 100,
    weightG: 0.6
  },
  handle: {
    name: 'Poignée découpée (普通手提)',
    instId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMZ8U1',
    unitCost: 0.105,
    minFee: 100,
    weightG: 7.6
  }
};

export interface BagDimensions {
  technology: PrintTechnology;
  bagType: BagTypeKey;
  zipperInstId?: string;
  widthCm: number;
  heightCm: number;
  bottomCm: number;
  sideGussetCm?: number;
  quantity: number;
  thicknessSi?: number;
  hasZip?: boolean;
  materialPreset?: string;
  customLayers?: {
    printLayerId?: string;
    barrierLayerId?: string | null;
    sealLayerId?: string;
  };
  cylinderCount?: number;
  finishes?: FinishesOptions;
  // Stratégie de revente personnalisable
  resalePricingMode?: 'percentage' | 'multiplier' | 'fixed_price';
  resaleMarginPercent?: number;  // Ex: 50% de marge brute
  resaleMultiplier?: number;     // Ex: Coût x 2.0
  resaleFixedUnitPriceEur?: number; // Ex: Forcer à 0.45 € / pièce
}

export interface QuoteBreakdown {
  technology: PrintTechnology;
  // Coûts Usine Réels (Shenzhen Beijincai)
  materialCostCny: number;
  printCostCny: number;
  laminationCostCny: number;
  bagMakingCostCny: number;
  cylindersCostCny: number;
  accessoriesCostCny: number;
  factoryCostTotalCny: number;
  factoryCostTotalEur: number;
  factoryCostUnitCny: number;
  factoryCostUnitEur: number;

  // Prix de Revente Personnalisé (Vos Tarifs)
  resalePriceTotalEur: number;
  resalePriceUnitEur: number;
  resalePriceTotalCny: number;
  resalePriceUnitCny: number;

  // Marges et Profits
  grossProfitTotalEur: number;
  grossProfitUnitEur: number;
  grossProfitTotalCny: number;
  grossMarginPercent: number; // Marge Brute en % du prix de vente
  markupPercent: number;      // Taux de marque / coefficient multiplicateur (%)

  // Métriques de Production
  weightUnitGrams: number;
  weightTotalKg: number;
  cylinderCount: number;
  cylinderFeePerUnitCny: number;
}

export const MATERIAL_PRESETS = ALL_STRUCTURE_PRESETS;

export const CNY_TO_EUR_RATE = 1 / 7.8; // 1 € = 7.80 CNY

const uData = {
  utils: {
    Sum: (val: number[]) => (val || []).reduce((p, n) => p + n, 0),
    Max: (...args: number[]) => Math.max(...args.map(a => Number.isNaN(a) || a === undefined || a === null ? 0 : Number(a))),
    Int: (val: any) => parseInt(val || "0", 10),
    Fixed: (val: any, f: number) => parseFloat(Number(val).toFixed(f)),
    getPickerData: (conf: { instanceId: any; arr: any[]; key: string; val?: any }) => {
      const findItem = (conf.arr || []).find(item => {
        return (conf.val && item.formData && item.formData[conf.key] == conf.val) || (item.formInstId == conf.instanceId);
      });
      return findItem ? findItem.formData : {};
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

  const widthMm = dim.widthCm * 10;
  const heightMm = dim.heightCm * 10;
  const bottomMm = bagDef.hasBottomGusset ? (dim.bottomCm * 10) : 0;
  const sideGussetMm = bagDef.hasSideGusset ? ((dim.sideGussetCm || 4) * 10) : 0;
  const qty = dim.quantity;

  // Zipper ID
  let zipId = dim.zipperInstId;
  if (!zipId) {
    const defaultZip = bagDef.zipperOptions.find(z => dim.hasZip ? !z.label.includes('Sans') : z.label.includes('Sans'));
    zipId = defaultZip ? defaultZip.instId : bagDef.zipperOptions[0].instId;
  }

  // Finitions
  const uvKey = dim.finishes?.uvEnhancement || 'none';
  const uvConfig = FINISHES_CATALOG.uv[uvKey] || FINISHES_CATALOG.uv.none;
  const spoutKey = dim.finishes?.spoutSize || 'none';
  const spoutConfig = FINISHES_CATALOG.spouts[spoutKey] || FINISHES_CATALOG.spouts.none;
  const valveConfig = dim.finishes?.hasDegassingValve ? FINISHES_CATALOG.valve : null;
  const handleConfig = dim.finishes?.hasHangingHole ? FINISHES_CATALOG.handle : null;

  // Données usine
  const dxcsItem = uData.utils.getPickerData({ instanceId: zipId, arr: uData.organConfig.dxcs, key: 'id' });
    const printLayerId = dim.customLayers?.printLayerId || preset.printLayer;
  const barrierLayerId = dim.customLayers ? dim.customLayers.barrierLayerId : preset.barrierLayer;
  const sealLayerId = dim.customLayers?.sealLayerId || preset.sealLayer;

  const yscItem = uData.utils.getPickerData({ instanceId: printLayerId, arr: uData.organConfig.clk, key: 'id' });
  const zgcItem = barrierLayerId ? uData.utils.getPickerData({ instanceId: barrierLayerId, arr: uData.organConfig.clk, key: 'id' }) : {};
  const rfcItem = uData.utils.getPickerData({ instanceId: sealLayerId, arr: uData.organConfig.clk, key: 'id' });
  const ysItem = uData.utils.getPickerData({ instanceId: 'FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMO8U1', arr: uData.organConfig.gxcb, key: 'id' });

  const qtcs = uData.organConfig.qtcs;
  const INT = uData.utils.Int;
  const MAX = uData.utils.Max;
  const M = uData.utils.Fixed;

  const qt01 = Number(qtcs.numberField_c2jyl6f) || 0;
  const qt04 = Number(qtcs.numberField_m3r8ld40) || 76;
  const qt07 = Number(qtcs.numberField_m3mqrw28) || 0.7;
  const qt19 = Number(qtcs.numberField_menzxc5c) || 3;
  const fhcs = qtcs.tableField_mgka3e9d || [];

  const cx01 = Number(dxcsItem.numberField_sr3it9l) || 1.8;
  const cx02 = Number(dxcsItem.numberField_jp4n9ji) || 0.8;

  // Imposition
  let gg_mlzmc1 = 0;
  if (dim.bagType === 'stand_up') {
    gg_mlzmc1 = Math.round((heightMm * 2 + bottomMm + cx01 * 10) / 10) / 100;
  } else if (dim.bagType === 'three_side') {
    gg_mlzmc1 = Math.round((heightMm * 2 + cx01 * 10) / 10) / 100;
  } else if (dim.bagType === 'flat_bottom') {
    gg_mlzmc1 = Math.round((heightMm * 2 + bottomMm + sideGussetMm + cx01 * 10) / 10) / 100;
  } else {
    gg_mlzmc1 = Math.round((heightMm * 2 + sideGussetMm * 2 + cx01 * 10) / 10) / 100;
  }

  const pb_w = Math.floor(740 / (widthMm + cx02 * 10)) || 1;
  const gg_lzs = Math.ceil(qty / pb_w);

  const sh_hs = isGravure ? 80 : 20;
  const sh_cs = isGravure ? 50 : 10;
  const clms = (gg_lzs + sh_hs + sh_cs) * (qt04 / 100);

  // 1. Matériaux (cl)
  const yc_dj01 = Number(yscItem.textField_nohaph9) || 11.8;
  const yc_md01 = Number(yscItem.textField_2xfswer) || 1.4;
  const yc_hd01 = Number(yscItem.textField_09zzudc) || 1.9;

  const zc1_dj01 = Number(zgcItem.textField_nohaph9) || 0;
  const zc1_md01 = Number(zgcItem.textField_2xfswer) || 0;
  const zc1_hd01 = Number(zgcItem.textField_09zzudc) || 0;

  const rc_dj01 = Number(rfcItem.textField_nohaph9) || 12.1;
  const rc_md01 = Number(rfcItem.textField_2xfswer) || 0.92;
  const rc_hd01 = Number(rfcItem.textField_09zzudc) || 8.5;

  const js_cl01 = qt04 * gg_mlzmc1 * (sh_hs + gg_lzs + sh_cs);
  const costPerSqm = (yc_dj01 * yc_md01 * yc_hd01 + zc1_dj01 * zc1_md01 * zc1_hd01 + rc_dj01 * rc_md01 * rc_hd01);
  const js_cl = INT(js_cl01 * costPerSqm / 1000000 * (1 + qt19 / 100));

  // 2. Impression (ys)
  const gx_ys01 = isGravure ? 0.85 : (Number(ysItem.numberField_w5opr46) || 2.7);
  const gx_ys02 = isGravure ? 800 : (Number(ysItem.numberField_c2jyl6f) || 100);
  const yslz_cs = sh_cs + gg_lzs;
  const gx_uv01 = uvConfig.unitCost;
  const gx_uv02 = uvConfig.minFee;
  const hasMatte = dim.finishes?.hasMatteVarnish ?? (uvKey === 'matte_varnish');
  const matteCost = (hasMatte && uvKey !== 'matte_varnish') ? MAX(100, yslz_cs * 0.40) : 0;
  const js_ys = (MAX(gx_ys02, yslz_cs * gx_ys01 + sh_hs * qt01) + MAX(gx_uv02, yslz_cs * gx_uv01) + matteCost) * (1 + qt19 / 100);

  // 3. Contrecollage (fh)
  const fhRow = fhcs[0] || { numberField_mgka3e9f: 80, numberField_mgka3e9g: 700, numberField_mgka3e9h: 0.25 };
  const fhcs01 = Number(fhRow.numberField_mgka3e9f) || 80;
  const fhcs02 = Number(fhRow.numberField_mgka3e9g) || 700;
  const fhcs03 = Number(fhRow.numberField_mgka3e9h) || 0.25;
  const js_fh = (clms <= fhcs02 ? fhcs01 : fhcs01 + (clms - fhcs02) * fhcs03) * (1 + qt19 / 100);

  // 4. Façonnage (zd)
  const zd01 = Number(dxcsItem.numberField_04m4hcc) || 350;
  const zd02_base = Number(dxcsItem.numberField_6mnwv9s) || 0.3;
  const zd03 = Number(dxcsItem.numberField_p1bf4ns) || 0.025;
  const zd04 = Number(dxcsItem.numberField_g43sr0l) || 0;
  const zd06 = Number(dxcsItem.numberField_wngzhey) || 0.005;
  const zdms = gg_lzs * (qt04 / 100);
  const zd02 = MAX(zd02_base, qty / zdms * zd03);
  let js_zd = MAX(zd01, zdms * zd02) + (widthMm * zd04 / 100 + zd06) * qty;
  js_zd = js_zd * (1 + qt19 / 100);

  // 5. Accessoires & Finitions
  const xz_cost = spoutConfig.unitCost > 0 ? MAX(spoutConfig.minFee, spoutConfig.unitCost * qty) : 0;
  const stk_cost = handleConfig ? MAX(handleConfig.minFee, handleConfig.unitCost * qty) : 0;
  const tqf_cost = valveConfig ? MAX(valveConfig.minFee, valveConfig.unitCost * qty) : 0;

  const accessoryWeightG = spoutConfig.weightG + (valveConfig ? valveConfig.weightG : 0) + (handleConfig ? handleConfig.weightG : 0);
  const singleWeightG = M(((widthMm * (heightMm * 2 + bottomMm + sideGussetMm) / 1000000) * (yc_md01 * yc_hd01 + zc1_md01 * zc1_hd01 + rc_md01 * rc_hd01) * 1.15) + accessoryWeightG, 3);
  const totalWeightKg = Math.max(1, Math.round(singleWeightG * qty / 1000));

  const js_qt = (xz_cost + stk_cost + tqf_cost + qt07 * totalWeightKg) * (1 + qt19 / 100);

  // 6. Cylindres
  const cylinderCount = isGravure ? (dim.cylinderCount || 6) : 0;
  const totalCylindersCost = cylinderCount * 400;

  // COÛT USINE TOTAL (BEIJINCAI)
  const factoryCostTotalCny = js_cl + js_ys + js_fh + js_zd + js_qt + (isGravure ? totalCylindersCost : 0);
  const factoryCostTotalEur = factoryCostTotalCny * CNY_TO_EUR_RATE;
  const factoryCostUnitCny = factoryCostTotalCny / qty;
  const factoryCostUnitEur = factoryCostTotalEur / qty;

  // ==========================================
  // CALCUL DES PRIX DE REVENTE PERSONNALISÉS
  // ==========================================
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
    // Mode Pourcentage : Marge commerciale sur le prix de vente
    // Formule : Prix Vente = Coût / (1 - Marge%)
    // Ex: 50% de marge -> Prix Vente = Coût / 0.5 = Coût x 2
    const targetMargin = (dim.resaleMarginPercent !== undefined ? dim.resaleMarginPercent : 40) / 100;
    const clampedMargin = Math.min(0.95, Math.max(0.01, targetMargin));
    resalePriceTotalEur = factoryCostTotalEur / (1 - clampedMargin);
    resalePriceUnitEur = resalePriceTotalEur / qty;
  }

  const resalePriceTotalCny = resalePriceTotalEur / CNY_TO_EUR_RATE;
  const resalePriceUnitCny = resalePriceUnitEur / CNY_TO_EUR_RATE;

  // Profits nets & Ratios
  const grossProfitTotalEur = resalePriceTotalEur - factoryCostTotalEur;
  const grossProfitUnitEur = resalePriceUnitEur - factoryCostUnitEur;
  const grossProfitTotalCny = resalePriceTotalCny - factoryCostTotalCny;
  const grossMarginPercent = (grossProfitTotalEur / resalePriceTotalEur) * 100;
  const markupPercent = (grossProfitTotalEur / factoryCostTotalEur) * 100;

  return {
    technology: dim.technology,
    materialCostCny: Math.round(js_cl),
    printCostCny: parseFloat(js_ys.toFixed(2)),
    laminationCostCny: parseFloat(js_fh.toFixed(2)),
    bagMakingCostCny: parseFloat(js_zd.toFixed(2)),
    cylindersCostCny: totalCylindersCost,
    accessoriesCostCny: parseFloat(js_qt.toFixed(2)),
    factoryCostTotalCny: parseFloat(factoryCostTotalCny.toFixed(2)),
    factoryCostTotalEur: parseFloat(factoryCostTotalEur.toFixed(2)),
    factoryCostUnitCny: parseFloat(factoryCostUnitCny.toFixed(3)),
    factoryCostUnitEur: parseFloat(factoryCostUnitEur.toFixed(3)),

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
    cylinderFeePerUnitCny: isGravure ? parseFloat((totalCylindersCost / qty).toFixed(3)) : 0
  };
}

export function calculateTierMatrix(baseDim: Omit<BagDimensions, 'quantity'>, tiers?: number[]): QuoteBreakdown[] {
  const defaultTiers = baseDim.technology === 'gravure'
    ? [5000, 10000, 20000, 50000, 100000]
    : [250, 500, 1000, 2500, 5000, 10000];
  const activeTiers = tiers || defaultTiers;
  return activeTiers.map(q => calculateMylarQuote({ ...baseDim, quantity: q }));
}
