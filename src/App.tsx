import React, { useMemo, useState } from 'react';
import {
  BAG_TYPES_CATALOG,
  BagDimensions,
  BagTypeKey,
  BOTTOM_MODES_CATALOG,
  calculateMylarQuote,
  CNY_TO_EUR_RATE,
  CuttingType,
  DigitalPrintMode,
  FinishesOptions,
  FourSideOrientation,
  FREIGHT_ZONES_CATALOG,
  InvoiceType,
  LaminationMethod,
  MATERIAL_PRESETS,
  OrderUrgency,
  PRINT_LAYERS,
  BARRIER_LAYERS,
  SEAL_LAYERS,
  PrintTechnology,
  RollQuoteMode,
  ShippingMode,
  BottomMode
} from './pricingEngine';
import { StudioShowcase } from './components/StudioShowcase';
import { FinishesStudio } from './components/FinishesStudio';
import { UltraDetailedBreakdown } from './components/UltraDetailedBreakdown';
import { WorkshopToolsTab } from './components/WorkshopToolsTab';
import { ComparisonTiersTab } from './components/ComparisonTiersTab';
import { ProposalPrintModal } from './components/ProposalPrintModal';
import {
  BarChart3,
  Check,
  FileText,
  Layers,
  Package,
  PieChart,
  Printer,
  Sliders,
  Sparkles,
  TrendingUp,
  Truck,
  Wrench
} from 'lucide-react';

type DesktopTab = 'configurator' | 'tiers' | 'tools';
type MobileTab = 'sac' | 'finitions' | 'decomp' | 'paliers';

const FORMAT_PRESETS = [
  { label: 'Pocket 3,5g (9×13+6)', w: 9, h: 13, b: 6 },
  { label: 'Classique 28g (12×18+8)', w: 12, h: 18, b: 8 },
  { label: 'Café 250g (16×23+9)', w: 16, h: 23, b: 9 },
  { label: 'Format 1kg (20×30+10)', w: 20, h: 30, b: 10 }
];

export function App() {
  const [desktopTab, setDesktopTab] = useState<DesktopTab>('configurator');
  const [mobileTab, setMobileTab] = useState<MobileTab>('sac');
  const [mobileExtraView, setMobileExtraView] = useState<'tiers' | 'tools'>('tiers');
  const [displayCurrency, setDisplayCurrency] = useState<'EUR' | 'CNY'>('EUR');
  const [proposalOpen, setProposalOpen] = useState(false);
  const [copiedBanner, setCopiedBanner] = useState<'fr' | 'zh' | null>(null);

  // État principal du configurateur
  const [technology, setTechnology] = useState<PrintTechnology>('digital');
  const [bagType, setBagType] = useState<BagTypeKey>('stand_up');
  const [zipperInstId, setZipperInstId] = useState<string>(BAG_TYPES_CATALOG[0].zipperOptions[0].instId);
  const [isSingleLayer, setIsSingleLayer] = useState<boolean>(false);

  const [widthCm, setWidthCm] = useState<number>(13);
  const [heightCm, setHeightCm] = useState<number>(20);
  const [bottomCm, setBottomCm] = useState<number>(7);
  const [sideGussetCm, setSideGussetCm] = useState<number>(6);
  const [quantity, setQuantity] = useState<number>(2500);
  const [skuCount, setSkuCount] = useState<number>(1);

  const [rollQuoteMode, setRollQuoteMode] = useState<RollQuoteMode>('pcs');
  const [rollTargetMeters, setRollTargetMeters] = useState<number>(1500);
  const [rollTargetKg, setRollTargetKg] = useState<number>(100);

  const [cuttingType, setCuttingType] = useState<CuttingType>('double_cut');
  const [bottomMode, setBottomMode] = useState<BottomMode>(1);
  const [fourSideOrientation, setFourSideOrientation] = useState<FourSideOrientation>('vertical');
  const [digitalPrintMode, setDigitalPrintMode] = useState<DigitalPrintMode>('cmyk_white');
  const [cylinderCount, setCylinderCount] = useState<number>(6);
  const [laminationMethod, setLaminationMethod] = useState<LaminationMethod>('dry');

  // Structure Matériau (jusqu'à 5 couches complètes + Monocouche)
  const [materialPreset, setMaterialPreset] = useState<string>('mylar_standard');
  const [useCustomLayers, setUseCustomLayers] = useState<boolean>(false);
  const [customPrintLayerId, setCustomPrintLayerId] = useState<string>(PRINT_LAYERS[0].id);
  const [customBarrier1Id, setCustomBarrier1Id] = useState<string | null>(BARRIER_LAYERS[0].id);
  const [customBarrier2Id, setCustomBarrier2Id] = useState<string | null>(null);
  const [customBarrier3Id, setCustomBarrier3Id] = useState<string | null>(null);
  const [customSealLayerId, setCustomSealLayerId] = useState<string>(SEAL_LAYERS[0].id);
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('Tous');

  // Finitions complètes (données clean + gravure)
  const [finishes, setFinishes] = useState<FinishesOptions>({
    uvEnhancement: 'none',
    spoutSize: 'none',
    hasDegassingValve: false,
    hasHangingHole: false,
    handleVariant: 'standard',
    hasWindow: false,
    windowCount: 1,
    hasEmbossing: false,
    hasAdhesiveStrip: false,
    adhesiveVariant: 'none',
    fullInkCoverage: false,
    inkCoverageLevel: '20_50',
    pantoneColors: []
  });

  // Logistique & Fiscalité
  const [shippingMode, setShippingMode] = useState<ShippingMode>('guangdong_free');
  const [shippingRegionId, setShippingRegionId] = useState<string>('福建、江苏、上海、浙江、江西');
  const [customShippingCny, setCustomShippingCny] = useState<number>(0);
  const [orderUrgency, setOrderUrgency] = useState<OrderUrgency>('normal');
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('no_invoice');
  const [extraFeeCny, setExtraFeeCny] = useState<number>(0);

  // Stratégie de Revente
  const [resalePricingMode, setResalePricingMode] = useState<'percentage' | 'multiplier' | 'fixed_price'>('percentage');
  const [resaleMarginPercent, setResaleMarginPercent] = useState<number>(45);
  const [resaleMultiplier, setResaleMultiplier] = useState<number>(1.85);
  const [resaleFixedUnitPriceEur, setResaleFixedUnitPriceEur] = useState<number>(0.35);

  const activeBagDef = BAG_TYPES_CATALOG.find(b => b.key === bagType) || BAG_TYPES_CATALOG[0];

  const handleBagTypeChange = (nextKey: BagTypeKey) => {
    setBagType(nextKey);
    const nextDef = BAG_TYPES_CATALOG.find(b => b.key === nextKey) || BAG_TYPES_CATALOG[0];
    setZipperInstId(nextDef.zipperOptions[0].instId);
    setBottomMode(nextDef.defaultBottomMode);
  };

  const handleTechChange = (nextTech: PrintTechnology) => {
    setTechnology(nextTech);
    if (nextTech === 'gravure' && quantity < 5000) {
      setQuantity(10000);
    } else if (nextTech === 'digital' && quantity > 15000) {
      setQuantity(2500);
    }
  };

  const handleSwitchMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const materialCategories = useMemo(() => {
    const cats = Array.from(new Set(Object.values(MATERIAL_PRESETS).map(p => p.category)));
    return ['Tous', ...cats];
  }, []);

  const filteredPresets = useMemo(() => {
    const list = Object.values(MATERIAL_PRESETS);
    if (materialCategoryFilter === 'Tous') return list;
    return list.filter(p => p.category === materialCategoryFilter);
  }, [materialCategoryFilter]);

  const dimPayload: BagDimensions = useMemo(() => ({
    technology,
    bagType,
    zipperInstId,
    widthCm,
    heightCm,
    bottomCm,
    sideGussetCm,
    quantity,
    skuCount,
    cuttingType,
    bottomMode,
    fourSideOrientation,
    rollQuoteMode,
    rollTargetMeters,
    rollTargetKg,
    digitalPrintMode,
    cylinderCount,
    laminationMethod,
    orderUrgency,
    invoiceType,
    shippingMode,
    shippingRegionId,
    customShippingCny,
    extraFeeCny,
    materialPreset,
    customLayers: isSingleLayer
      ? {
          isSingleLayer: true,
          printLayerId: customPrintLayerId
        }
      : useCustomLayers
        ? {
            isSingleLayer: false,
            printLayerId: customPrintLayerId,
            barrierLayerId: customBarrier1Id,
            barrierLayer2Id: customBarrier2Id,
            barrierLayer3Id: customBarrier3Id,
            sealLayerId: customSealLayerId
          }
        : undefined,
    finishes,
    resalePricingMode,
    resaleMarginPercent,
    resaleMultiplier,
    resaleFixedUnitPriceEur
  }), [
    technology, bagType, zipperInstId, widthCm, heightCm, bottomCm, sideGussetCm,
    quantity, skuCount, cuttingType, bottomMode, fourSideOrientation, rollQuoteMode,
    rollTargetMeters, rollTargetKg, digitalPrintMode, cylinderCount, laminationMethod,
    orderUrgency, invoiceType, shippingMode, shippingRegionId, customShippingCny, extraFeeCny,
    materialPreset, isSingleLayer, useCustomLayers, customPrintLayerId, customBarrier1Id,
    customBarrier2Id, customBarrier3Id, customSealLayerId, finishes, resalePricingMode,
    resaleMarginPercent, resaleMultiplier, resaleFixedUnitPriceEur
  ]);

  const quote = useMemo(() => calculateMylarQuote(dimPayload), [dimPayload]);

  const selectedZipObj = activeBagDef.zipperOptions.find(z => z.instId === zipperInstId) || activeBagDef.zipperOptions[0];
  const presetObj = MATERIAL_PRESETS[materialPreset] || MATERIAL_PRESETS.mylar_standard;

  const formatMainMoney = (eurVal: number, cnyVal: number, decimals = 2) => {
    if (displayCurrency === 'CNY') {
      return `${cnyVal.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ¥`;
    }
    return `${eurVal.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} €`;
  };

  // Proportions barre visuelle multi-postes
  const resaleTotalSafe = Math.max(0.01, quote.resalePriceTotalCny);
  const pctMaterial = Math.round((quote.materialCostCny / resaleTotalSafe) * 100);
  const pctPrint = Math.round(((quote.printCostCny + quote.cylindersCostCny) / resaleTotalSafe) * 100);
  const pctConv = Math.round(((quote.laminationCostCny + quote.bagMakingCostCny + quote.accessoriesCostCny + quote.dieCutPlateCostCny) / resaleTotalSafe) * 100);
  const pctMisc = Math.round(((quote.shippingCostCny + quote.rushFeeCny + quote.taxCostCny + quote.extraFeeCny) / resaleTotalSafe) * 100);
  const pctProfit = Math.max(0, 100 - (pctMaterial + pctPrint + pctConv + pctMisc));

  const copyQuoteText = (lang: 'fr' | 'zh') => {
    const content = lang === 'fr' ? quote.imposition.quoteSpecFr : quote.imposition.quoteSpecZh;
    navigator.clipboard?.writeText(content);
    setCopiedBanner(lang);
    setTimeout(() => setCopiedBanner(null), 2200);
  };

  // =========================================================================
  // SECTIONS RÉUTILISABLES (MOBILE 4 ONGLETS + DESKTOP 12 COLONNES)
  // =========================================================================
  const renderSectionSacEtFilms = (
    <div className="space-y-4">
      <StudioShowcase
        bagType={bagType}
        technology={technology}
        isSingleLayer={isSingleLayer}
        hasZip={selectedZipObj.hasZip}
        widthCm={widthCm}
        heightCm={heightCm}
        bottomCm={bottomCm}
        sideGussetCm={sideGussetCm}
        thicknessMicrons={quote.imposition.actualThicknessMicrons}
        unitWeightG={quote.weightUnitGrams}
        leadTimeDays={quote.imposition.leadTimeDays}
        presetName={presetObj.name}
        onSelectBagType={handleBagTypeChange}
        onToggleSingleLayer={setIsSingleLayer}
        onChangeTechnology={handleTechChange}
      />

      {/* BLOC 1 : GABARIT, VOLUMÉTRIE & FERMETURE */}
      <section className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                1 · Gabarit, Quantité & Zip
              </h3>
              <p className="text-[11px] text-slate-400">
                Dimensions finies (cm), poses machine et système de fermeture
              </p>
            </div>
          </div>

          {bagType !== 'roll_film' && (
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setWidthCm(p.w);
                    setHeightCm(p.h);
                    setBottomCm(p.b);
                    setSideGussetCm(p.b);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#080d18] border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grille Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400">
              {bagType === 'roll_film' ? 'Laize coupe (cm)' : 'Largeur (cm)'}
            </span>
            <input
              type="number"
              min={3}
              max={100}
              step="0.5"
              value={widthCm}
              onChange={e => setWidthCm(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] font-mono text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400">
              {bagType === 'roll_film' ? 'Pas répétition (cm)' : 'Hauteur (cm)'}
            </span>
            <input
              type="number"
              min={4}
              max={100}
              step="0.5"
              value={heightCm}
              onChange={e => setHeightCm(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] font-mono text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </label>

          {activeBagDef.hasBottomGusset && (
            <label className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Soufflet fond (cm)</span>
              <input
                type="number"
                min={0}
                max={30}
                step="0.5"
                value={bottomCm}
                onChange={e => setBottomCm(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] font-mono text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </label>
          )}

          {activeBagDef.hasSideGusset && (
            <label className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Soufflet latéral (cm)</span>
              <input
                type="number"
                min={0}
                max={30}
                step="0.5"
                value={sideGussetCm}
                onChange={e => setSideGussetCm(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] font-mono text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </label>
          )}

          <label className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400">Visuels / SKU</span>
            <input
              type="number"
              min={1}
              max={50}
              value={skuCount}
              onChange={e => setSkuCount(Math.max(1, Math.round(Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] font-mono text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            />
          </label>
        </div>

        {/* Volume & Quantité (avec mode bobine mètres/kg si roll_film) */}
        <div className="bg-[#080d18] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200">
              {bagType === 'roll_film' ? 'Mode de Chiffrage Bobine' : 'Quantité Totale Commandée'}
            </span>

            {bagType === 'roll_film' ? (
              <div className="inline-flex rounded-lg bg-[#0c1322] border border-slate-700 p-0.5 text-[11px] font-semibold">
                {(['pcs', 'meters', 'kg'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRollQuoteMode(m)}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${rollQuoteMode === m ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    {m === 'pcs' ? 'Nb Coupes' : m === 'meters' ? 'Métrage (m)' : 'Poids (kg)'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(technology === 'digital' ? [100, 250, 500, 1000, 2500, 5000, 10000] : [10000, 20000, 50000, 100000]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                      quantity === q
                        ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                        : 'bg-[#0c1322] border border-slate-700 text-slate-300 hover:border-cyan-400/50'
                    }`}
                  >
                    {q >= 1000 ? `${q / 1000}k` : q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {bagType === 'roll_film' && rollQuoteMode === 'meters' ? (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={100}
                step={100}
                value={rollTargetMeters}
                onChange={e => setRollTargetMeters(Math.max(50, Number(e.target.value)))}
                className="w-36 px-3 py-2 rounded-xl border border-slate-700 bg-[#0c1322] font-mono text-base font-bold text-cyan-300"
              />
              <span className="text-xs text-slate-400 font-mono">
                mètres linéaires (≈ {quote.resolvedQuantity.toLocaleString('fr-FR')} poses)
              </span>
            </div>
          ) : bagType === 'roll_film' && rollQuoteMode === 'kg' ? (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={10}
                step={10}
                value={rollTargetKg}
                onChange={e => setRollTargetKg(Math.max(1, Number(e.target.value)))}
                className="w-36 px-3 py-2 rounded-xl border border-slate-700 bg-[#0c1322] font-mono text-base font-bold text-cyan-300"
              />
              <span className="text-xs text-slate-400 font-mono">
                kg de film (≈ {quote.resolvedQuantity.toLocaleString('fr-FR')} poses)
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="number"
                min={100}
                step={100}
                value={quantity}
                onChange={e => setQuantity(Math.max(100, Number(e.target.value)))}
                className="w-full sm:w-40 px-3 py-2 rounded-xl border border-slate-700 bg-[#0c1322] font-mono text-base font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="range"
                min={technology === 'digital' ? 100 : 5000}
                max={technology === 'digital' ? 15000 : 120000}
                step={technology === 'digital' ? 50 : 1000}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="atelier-slider flex-1"
              />
            </div>
          )}
        </div>

        {/* Sélecteur Fermeture Zip + Mode Fond / Orientation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] font-bold text-slate-300 block mb-2">Type de fermeture / Zip (`zdcb`)</span>
            <div className="space-y-1.5">
              {activeBagDef.zipperOptions.map((z) => (
                <button
                  key={z.instId}
                  type="button"
                  onClick={() => setZipperInstId(z.instId)}
                  className={`w-full px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    zipperInstId === z.instId
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 font-semibold'
                      : 'border-slate-800 bg-[#080d18] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{z.labelFr}</span>
                  {zipperInstId === z.instId && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {bagType === 'four_side' && (
              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Sens sortie machine (Quad Seal)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFourSideOrientation('vertical')}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                      fourSideOrientation === 'vertical'
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-800 bg-[#080d18] text-slate-400'
                    }`}
                  >
                    Sortie Verticale
                  </button>
                  <button
                    type="button"
                    onClick={() => setFourSideOrientation('horizontal')}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                      fourSideOrientation === 'horizontal'
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-800 bg-[#080d18] text-slate-400'
                    }`}
                  >
                    Sortie Horizontale
                  </button>
                </div>
              </div>
            )}

            {(bagType === 'stand_up' || bagType === 'flat_bottom') && (
              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Assemblage du fond (`df`)</span>
                <select
                  value={bottomMode}
                  onChange={e => setBottomMode(Number(e.target.value) as BottomMode)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] text-xs font-medium text-slate-200"
                >
                  {BOTTOM_MODES_CATALOG.map((m) => (
                    <option key={m.value} value={m.value}>{m.labelFr}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Paramètres Spécifiques Filière (Numérique CMJN vs Héliogravure Cylindres) */}
            {technology === 'digital' ? (
              <div className="bg-[#080d18] border border-cyan-500/25 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-bold text-cyan-200">Mode Impression HP Indigo</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { key: 'none', label: 'Neutre sans impression (0 ¥)', badge: '0¥' },
                    { key: 'cmyk_white', label: 'CMJN + Blanc couvrant (2.7¥/tr)', badge: 'Std' },
                    { key: 'cmyk_white_inside', label: 'Recto/Verso + Intérieur (5.35¥)', badge: 'R/V' }
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setDigitalPrintMode(m.key as DigitalPrintMode)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        digitalPrintMode === m.key
                          ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-100'
                          : 'bg-[#0c1322] border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="font-mono text-[10px] opacity-80">{m.badge}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-indigo-950/30 border border-indigo-500/35 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-200 block">Cylindres Cuivre Hélio (`版费`)</span>
                    <span className="text-[10px] text-slate-400">
                      {quote.imposition.singleCylinderCostCny} ¥/coul. (Ø {quote.imposition.cylinderCircumferenceCm}cm)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-300 tabular-nums">
                    {cylinderCount} coul. ({(quote.cylindersCostCny * CNY_TO_EUR_RATE).toFixed(0)} €)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={cylinderCount}
                  onChange={e => setCylinderCount(Number(e.target.value))}
                  className="atelier-slider w-full"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOC 2 : STRUCTURE MATIÈRE & 5 COUCHES SUR-MESURE (`clk` 49 films) */}
      <section className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                2 · Films Barrière (`clk` · 49 films)
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSingleLayer
                  ? 'Mode Monocouche actif (sélection directe ci-dessous)'
                  : 'Préréglages usine ou composition libre jusqu’à 5 couches avec tarifs ¥/kg'}
              </p>
            </div>
          </div>

          {!isSingleLayer && (
            <button
              type="button"
              onClick={() => setUseCustomLayers(!useCustomLayers)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                useCustomLayers
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan'
                  : 'bg-[#080d18] text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15'
              }`}
            >
              {useCustomLayers ? 'Voir Préréglages' : 'Composer 5 Couches'}
            </button>
          )}
        </div>

        {isSingleLayer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRINT_LAYERS.map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setCustomPrintLayerId(layer.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  customPrintLayerId === layer.id
                    ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/40'
                    : 'border-slate-800 bg-[#080d18] hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-white">{layer.nameFr}</div>
                <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                  {layer.thicknessUm} µm · d={layer.density} · {layer.pricePerKgCny} ¥/kg
                </div>
              </button>
            ))}
          </div>
        ) : useCustomLayers ? (
          <div className="bg-[#080d18] p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="font-bold text-cyan-300">Couche 1 · Impression (`ysc01` · {PRINT_LAYERS.length})</span>
                <select
                  value={customPrintLayerId}
                  onChange={e => setCustomPrintLayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0c1322] text-slate-100 text-xs"
                >
                  {PRINT_LAYERS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameFr} — {l.pricePerKgCny} ¥/kg</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-bold text-indigo-300">Couche 2 · Barrière 1 (`zgc01` · {BARRIER_LAYERS.length})</span>
                <select
                  value={customBarrier1Id || ''}
                  onChange={e => setCustomBarrier1Id(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0c1322] text-slate-100 text-xs"
                >
                  <option value="">Aucune (Complexe 2 couches)</option>
                  {BARRIER_LAYERS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameFr} — {l.pricePerKgCny} ¥/kg</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-bold text-purple-300">Couche 3 · Renfort 2 (`zgc02`)</span>
                <select
                  value={customBarrier2Id || ''}
                  onChange={e => setCustomBarrier2Id(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0c1322] text-slate-100 text-xs"
                >
                  <option value="">Aucune (2 ou 3 couches)</option>
                  {BARRIER_LAYERS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameFr} — {l.pricePerKgCny} ¥/kg</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-bold text-pink-300">Couche 4 · Ultra-Barrière 3 (`zgc03`)</span>
                <select
                  value={customBarrier3Id || ''}
                  onChange={e => setCustomBarrier3Id(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0c1322] text-slate-100 text-xs"
                >
                  <option value="">Aucune (Complexe 2–4 couches)</option>
                  {BARRIER_LAYERS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameFr} — {l.pricePerKgCny} ¥/kg</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="font-bold text-emerald-300">Couche Finale · Soudure Alimentaire (`rfc01` · {SEAL_LAYERS.length} films PE/CPP/RCPP/ALU)</span>
                <select
                  value={customSealLayerId}
                  onChange={e => setCustomSealLayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#0c1322] text-slate-100 text-xs"
                >
                  {SEAL_LAYERS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameFr} — {l.pricePerKgCny} ¥/kg</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {materialCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMaterialCategoryFilter(cat)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    materialCategoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-[#080d18] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {filteredPresets.map((preset) => {
                const isSelected = materialPreset === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setMaterialPreset(preset.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-[#080d18] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-100 leading-snug">
                        {preset.name}
                      </span>
                      {preset.badge && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {technology === 'gravure' && !isSingleLayer && (
          <div className="pt-2.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200">Procédé de contrecollage (`fh`)</span>
            <div className="inline-flex rounded-lg bg-[#080d18] p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLaminationMethod('dry')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  laminationMethod === 'dry' ? 'bg-indigo-500 text-white' : 'text-slate-400'
                }`}
              >
                Sec Haute Barrière
              </button>
              <button
                type="button"
                onClick={() => setLaminationMethod('solvent_free')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  laminationMethod === 'solvent_free' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Sans Solvant Alimentaire
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  const renderSectionFinitionsEtPort = (
    <div className="space-y-4">
      <section className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              3 · Finitions Tactiles, Valves, Becs & Encrage
            </h3>
            <p className="text-[11px] text-slate-400">
              Rendus macro Nano Banana, 8 diamètres de goulots, Pantones & découpe
            </p>
          </div>
        </div>

        <FinishesStudio
          technology={technology}
          finishes={finishes}
          cuttingType={cuttingType}
          onChangeFinishes={setFinishes}
          onChangeCuttingType={setCuttingType}
        />
      </section>

      <section className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              4 · Logistique (13 Provinces), Urgence & TVA Usine
            </h3>
            <p className="text-[11px] text-slate-400">
              Fret par poids (~{quote.weightTotalKg} kg), priorité atelier 4j et facture TVA +8%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block">Mode de Transport (`yf`)</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'none', label: 'EXW Usine (0 ¥)' },
                { key: 'guangdong_free', label: 'Guangdong Franco' },
                { key: 'regional_zone', label: 'Par Province Chine' },
                { key: 'custom', label: 'Fret Personnalisé' }
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setShippingMode(m.key as ShippingMode)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    shippingMode === m.key
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                      : 'border-slate-800 bg-[#080d18] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {shippingMode === 'regional_zone' && (
              <select
                value={shippingRegionId}
                onChange={e => setShippingRegionId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] text-xs font-medium text-slate-100"
              >
                {FREIGHT_ZONES_CATALOG.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nameFr} — {z.firstKgCny}¥ (1er kg) + {z.extraKgCny}¥/kg
                  </option>
                ))}
              </select>
            )}

            {shippingMode === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={customShippingCny}
                  onChange={e => setCustomShippingCny(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#080d18] text-emerald-300 font-mono text-xs"
                  placeholder="Montant fret en ¥"
                />
                <span className="text-xs font-mono text-slate-400 shrink-0">CNY ¥</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-1.5">Délai de fabrication (`jq`)</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderUrgency('normal')}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                    orderUrgency === 'normal'
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-800 bg-[#080d18] text-slate-400'
                  }`}
                >
                  Standard ({technology === 'gravure' ? '12j' : '7j'})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderUrgency('urgent')}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                    orderUrgency === 'urgent'
                      ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                      : 'border-slate-800 bg-[#080d18] text-slate-400'
                  }`}
                >
                  Express Prioritaire (4j)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">Facturation Chine</span>
                <select
                  value={invoiceType}
                  onChange={e => setInvoiceType(e.target.value as InvoiceType)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-700 bg-[#080d18] text-slate-100 text-xs font-medium"
                >
                  <option value="no_invoice">Sans TVA Usine</option>
                  <option value="vat_invoice">Facture TVA (+8%)</option>
                </select>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">Frais divers (`qt00` ¥)</span>
                <input
                  type="number"
                  min={0}
                  value={extraFeeCny}
                  onChange={e => setExtraFeeCny(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSectionDecompUltra = (
    <div className="space-y-4">
      {/* 4 CARTES KPI HÉRO COLOR-CODED + PILOTAGE DE VOTRE MARGE */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Cockpit Exécutif · Synthèse & Pilotage Marge
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md tabular-nums">
            {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs · {quote.imposition.leadTimeDays}j
          </span>
        </div>

        {/* 4 Cartes Héro Sémantiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Emerald : Prix Vente */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 shadow-glow-emerald">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              Prix Vente Client
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
              {formatMainMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)}
              <span className="text-[11px] text-emerald-300 font-normal">/u</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-200/80 tabular-nums mt-0.5">
              Total {formatMainMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 0)}
            </div>
          </div>

          {/* Amber : Marge Nette */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 shadow-glow-amber">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              Marge Nette
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-amber-200 tabular-nums mt-1">
              +{quote.grossProfitTotalEur.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
            </div>
            <div className="text-[10px] font-mono text-amber-300/90 tabular-nums mt-0.5">
              {quote.grossMarginPercent.toFixed(1)}% ({quote.grossProfitUnitEur.toFixed(3)} €/u)
            </div>
          </div>

          {/* Indigo : Catalogue Usine bj03 */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
              Catalogue (`bj03`)
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-indigo-200 tabular-nums mt-1">
              {formatMainMoney(quote.beijincaiCatalogUnitEur, quote.beijincaiCatalogUnitCny, 3)}
              <span className="text-[11px] text-indigo-300 font-normal">/u</span>
            </div>
            <div className="text-[10px] font-mono text-indigo-300/80 tabular-nums mt-0.5">
              Plancher +{quote.imposition.factoryMinProfitCny}¥ (×{quote.imposition.factoryTierMultiplier})
            </div>
          </div>

          {/* Rose : Coût Pur Atelier js_zcb */}
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
              Coût Pur (`js_zcb`)
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-rose-200 tabular-nums mt-1">
              {formatMainMoney(quote.factoryCostUnitEur, quote.factoryCostUnitCny, 3)}
              <span className="text-[11px] text-rose-300 font-normal">/u</span>
            </div>
            <div className="text-[10px] font-mono text-rose-300/80 tabular-nums mt-0.5">
              Total {formatMainMoney(quote.factoryCostTotalEur, quote.factoryCostTotalCny, 0)}
            </div>
          </div>
        </div>

        {/* Pilotage de la Marge */}
        <div className="bg-[#080d18] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pilotage de Votre Marge
            </span>
            <div className="inline-flex rounded-lg bg-[#0c1322] p-0.5 border border-slate-700 text-[11px] font-semibold">
              {[
                { k: 'percentage', l: '% Marge' },
                { k: 'multiplier', l: 'Coeff ×' },
                { k: 'fixed_price', l: 'Prix Fixe' }
              ].map((m) => (
                <button
                  key={m.k}
                  type="button"
                  onClick={() => setResalePricingMode(m.k as any)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    resalePricingMode === m.k ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>

          {resalePricingMode === 'percentage' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={1}
                  value={resaleMarginPercent}
                  onChange={e => setResaleMarginPercent(Number(e.target.value))}
                  className="atelier-slider flex-1"
                />
                <div className="flex items-center border border-slate-700 rounded-xl px-2.5 py-1.5 bg-[#0c1322] w-20">
                  <input
                    type="number"
                    min={1}
                    max={95}
                    value={resaleMarginPercent}
                    onChange={e => setResaleMarginPercent(Math.min(95, Math.max(1, Number(e.target.value))))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-emerald-300 text-right focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 ml-1">%</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {[30, 40, 45, 55, 65].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setResaleMarginPercent(pct)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                      resaleMarginPercent === pct
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                        : 'bg-[#0c1322] border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {resalePricingMode === 'multiplier' && (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1.1}
                max={4.0}
                step={0.05}
                value={resaleMultiplier}
                onChange={e => setResaleMultiplier(Number(e.target.value))}
                className="atelier-slider flex-1"
              />
              <div className="flex items-center border border-slate-700 rounded-xl px-3 py-1.5 bg-[#0c1322] w-24">
                <span className="text-xs text-slate-400 mr-1">×</span>
                <input
                  type="number"
                  step="0.05"
                  min={1.01}
                  value={resaleMultiplier}
                  onChange={e => setResaleMultiplier(Math.max(1.01, Number(e.target.value)))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-emerald-300 text-right focus:outline-none"
                />
              </div>
            </div>
          )}

          {resalePricingMode === 'fixed_price' && (
            <div className="flex items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 rounded-xl p-2.5">
              <span className="text-xs font-medium text-slate-300">Prix Unitaire Cible (€ HT)</span>
              <input
                type="number"
                step="0.01"
                min={0.01}
                value={resaleFixedUnitPriceEur}
                onChange={e => setResaleFixedUnitPriceEur(Math.max(0.01, Number(e.target.value)))}
                className="w-28 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-emerald-300 font-mono text-sm font-bold text-right"
              />
            </div>
          )}

          {/* Barre Proportionnelle Colorée */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-900 border border-slate-800">
              <div style={{ width: `${pctMaterial}%` }} className="bg-cyan-400" title={`Matières ${pctMaterial}%`} />
              <div style={{ width: `${pctPrint}%` }} className="bg-blue-500" title={`Impression & Cylindres ${pctPrint}%`} />
              <div style={{ width: `${pctConv}%` }} className="bg-purple-500" title={`Contrecollage & Façonnage ${pctConv}%`} />
              <div style={{ width: `${pctMisc}%` }} className="bg-amber-400" title={`Port & Taxes ${pctMisc}%`} />
              <div style={{ width: `${pctProfit}%` }} className="bg-emerald-400" title={`Marge Nette ${pctProfit}%`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Films {pctMaterial}%</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Impr. {pctPrint}%</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Façon. {pctConv}%</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Taxes {pctMisc}%</div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Marge {pctProfit}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* DÉCOMPOSITION ULTRA-DÉTAILLÉE USINE (`UltraDetailedBreakdown`) */}
      <UltraDetailedBreakdown
        quote={quote}
        displayCurrency={displayCurrency}
        copiedBanner={copiedBanner}
        onCopyQuote={copyQuoteText}
        onOpenProposal={() => setProposalOpen(true)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 pb-36 lg:pb-12">
      {/* ================================================================= */}
      {/* EN-TÊTE OBSIDIAN COCKPIT                                          */}
      {/* ================================================================= */}
      <header className="no-print sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Logo Mylar Cockpit */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-glow-cyan">
              <span className="font-serif text-base sm:text-lg font-bold text-slate-950">M</span>
            </div>
            <div>
              <div className="font-serif text-base sm:text-xl font-semibold tracking-tight text-white leading-none">
                Mylar Pro Cockpit
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-cyan-400 font-semibold mt-0.5">
                Atelier Numérique & Hélio
              </div>
            </div>
          </div>

          {/* Navigation Principale Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0c1322] p-1 rounded-xl border border-slate-800">
            {[
              { id: 'configurator', label: 'Configurateur & Décomp.', icon: Sliders },
              { id: 'tiers', label: 'Paliers & Break-Even', icon: BarChart3 },
              { id: 'tools', label: 'Outils Atelier (7)', icon: Wrench }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = desktopTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDesktopTab(item.id as DesktopTab)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions Entête : Devise + Aperçu Devis */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-lg bg-[#0c1322] border border-slate-800 p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setDisplayCurrency('EUR')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  displayCurrency === 'EUR' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                EUR €
              </button>
              <button
                type="button"
                onClick={() => setDisplayCurrency('CNY')}
                className={`px-2 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  displayCurrency === 'CNY' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                CNY ¥
              </button>
            </div>

            <button
              type="button"
              onClick={() => setProposalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-glow-emerald cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Devis PDF
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* CONTENU PRINCIPAL DESKTOP (`lg+` Spatial 12-Col)                  */}
      {/* ================================================================= */}
      <main className="no-print max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* VUE DESKTOP */}
        <div className="hidden lg:block">
          {desktopTab === 'configurator' && (
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-5 space-y-5">
                {renderSectionSacEtFilms}
                {renderSectionFinitionsEtPort}
              </div>
              <div className="col-span-7 sticky top-20 space-y-5">
                {renderSectionDecompUltra}
              </div>
            </div>
          )}

          {desktopTab === 'tiers' && (
            <ComparisonTiersTab
              baseDim={dimPayload}
              currentQuantity={quantity}
              currentTechnology={technology}
              displayCurrency={displayCurrency}
              onApplyQuantityAndTech={(q, tech) => {
                setTechnology(tech);
                setQuantity(q);
                setDesktopTab('configurator');
              }}
            />
          )}

          {desktopTab === 'tools' && (
            <WorkshopToolsTab
              defaultBagType={bagType}
              defaultWidthCm={widthCm}
              defaultHeightCm={heightCm}
              defaultGussetCm={bottomCm}
              defaultThicknessSilk={quote.imposition.actualThicknessSilk}
              defaultQuantity={quantity}
              onApplyQuantityToQuote={(q) => {
                setQuantity(q);
                setDesktopTab('configurator');
              }}
            />
          )}
        </div>

        {/* VUE MOBILE 4 ONGLETS (`< lg`) */}
        <div className="lg:hidden space-y-4">
          {mobileTab === 'sac' && renderSectionSacEtFilms}
          {mobileTab === 'finitions' && renderSectionFinitionsEtPort}
          {mobileTab === 'decomp' && renderSectionDecompUltra}
          {mobileTab === 'paliers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-[#0c1322] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMobileExtraView('tiers')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    mobileExtraView === 'tiers' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Paliers & Break-Even
                </button>
                <button
                  type="button"
                  onClick={() => setMobileExtraView('tools')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    mobileExtraView === 'tools' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  7 Outils Atelier
                </button>
              </div>

              {mobileExtraView === 'tiers' ? (
                <ComparisonTiersTab
                  baseDim={dimPayload}
                  currentQuantity={quantity}
                  currentTechnology={technology}
                  displayCurrency={displayCurrency}
                  onApplyQuantityAndTech={(q, tech) => {
                    setTechnology(tech);
                    setQuantity(q);
                    handleSwitchMobileTab('decomp');
                  }}
                />
              ) : (
                <WorkshopToolsTab
                  defaultBagType={bagType}
                  defaultWidthCm={widthCm}
                  defaultHeightCm={heightCm}
                  defaultGussetCm={bottomCm}
                  defaultThicknessSilk={quote.imposition.actualThicknessSilk}
                  defaultQuantity={quantity}
                  onApplyQuantityToQuote={(q) => {
                    setQuantity(q);
                    handleSwitchMobileTab('decomp');
                  }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* ================================================================= */}
      {/* BARRE MOBILE STICKY : SYNTHÈSE PRIX + 4 ONGLETS INFÉRIEURS        */}
      {/* ================================================================= */}
      <div className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080d18]/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
        {/* Bandeau compact total + Devis PDF */}
        <div className="px-3.5 py-2 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs · Marge {quote.grossMarginPercent.toFixed(0)}% · Usine {quote.factoryCostUnitEur.toFixed(3)}€
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-emerald-300 tabular-nums">
                {formatMainMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)}/u
              </span>
              <span className="font-mono text-[11px] font-semibold text-amber-300 tabular-nums">
                Total {formatMainMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 0)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProposalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shrink-0 shadow-glow-emerald"
          >
            Devis PDF
          </button>
        </div>

        {/* 4 Onglets Bottom Navigation Tactiles */}
        <nav className="grid grid-cols-4 px-1 py-1">
          {[
            { id: 'sac', label: 'Sac & Films', icon: Package },
            { id: 'finitions', label: 'Finitions & Port', icon: Sparkles },
            { id: 'decomp', label: 'Décomp. Ultra', icon: PieChart },
            { id: 'paliers', label: 'Paliers & Outils', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSwitchMobileTab(tab.id as MobileTab)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                  active ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${active ? 'text-cyan-400' : ''}`} />
                <span className="truncate max-w-full px-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* MODALE PROPOSITION COMMERCIALE IMPRIMABLE */}
      <ProposalPrintModal
        open={proposalOpen}
        onClose={() => setProposalOpen(false)}
        dim={dimPayload}
        quote={quote}
      />
    </div>
  );
}

export default App;
