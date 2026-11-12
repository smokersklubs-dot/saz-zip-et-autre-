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
import { WorkshopToolsTab } from './components/WorkshopToolsTab';
import { ComparisonTiersTab } from './components/ComparisonTiersTab';
import { FactoryAuditTab } from './components/FactoryAuditTab';
import { ProposalPrintModal } from './components/ProposalPrintModal';
import {
  Check,
  Copy,
  FileText,
  Layers,
  Package,
  Printer,
  Sliders,
  Sparkles,
  Truck,
  Wrench,
  BarChart3,
  Shield
} from 'lucide-react';

type ActiveTab = 'configurator' | 'tiers' | 'tools' | 'audit';

const FORMAT_PRESETS = [
  { label: 'Pocket 3,5g (9×13+6)', w: 9, h: 13, b: 6 },
  { label: 'Classique 28g (12×18+8)', w: 12, h: 18, b: 8 },
  { label: 'Café 250g (16×23+9)', w: 16, h: 23, b: 9 },
  { label: 'Format 1kg (20×30+10)', w: 20, h: 30, b: 10 }
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('configurator');
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

  // Structure Matériau
  const [materialPreset, setMaterialPreset] = useState<string>('mylar_standard');
  const [useCustomLayers, setUseCustomLayers] = useState<boolean>(false);
  const [customPrintLayerId, setCustomPrintLayerId] = useState<string>(PRINT_LAYERS[0].id);
  const [customBarrier1Id, setCustomBarrier1Id] = useState<string | null>(BARRIER_LAYERS[0].id);
  const [customBarrier2Id, setCustomBarrier2Id] = useState<string | null>(null);
  const [customSealLayerId, setCustomSealLayerId] = useState<string>(SEAL_LAYERS[0].id);
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('Tous');

  // Finitions
  const [finishes, setFinishes] = useState<FinishesOptions>({
    uvEnhancement: 'none',
    spoutSize: 'none',
    hasDegassingValve: false,
    hasHangingHole: false,
    hasWindow: false,
    windowCount: 1,
    hasEmbossing: false,
    hasAdhesiveStrip: false,
    fullInkCoverage: false
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
    customBarrier2Id, customSealLayerId, finishes, resalePricingMode, resaleMarginPercent,
    resaleMultiplier, resaleFixedUnitPriceEur
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

  // Proportions pour la barre visuelle empilée
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

  return (
    <div className="min-h-screen bg-maison-canvas text-maison-ink pb-24 lg:pb-12">
      {/* ================================================================= */}
      {/* EN-TÊTE ATELIER ÉDITORIAL                                         */}
      {/* ================================================================= */}
      <header className="no-print sticky top-0 z-40 bg-maison-canvas/90 backdrop-blur-md border-b border-maison-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Identité Maison */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#171614] flex items-center justify-center shadow-sm">
              <span className="font-serif text-lg font-semibold text-[#C29B61]">M</span>
            </div>
            <div>
              <div className="font-serif text-xl font-semibold tracking-tight text-maison-ink leading-none">
                Maison Mylar
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-maison-muted font-medium mt-1">
                Studio Tarifaire Packaging
              </div>
            </div>
          </div>

          {/* Navigation Principale Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-maison-stone/60 p-1 rounded-xl border border-maison-border">
            {[
              { id: 'configurator', label: 'Configurateur', icon: Sliders },
              { id: 'tiers', label: 'Paliers & Comparatif', icon: BarChart3 },
              { id: 'tools', label: 'Outils Atelier (7)', icon: Wrench },
              { id: 'audit', label: 'Audit Usine', icon: Shield }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-maison-ink shadow-sm border border-maison-border/70'
                      : 'text-maison-slate hover:text-maison-ink'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-maison-brass' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions Entête : Devise + Aperçu Devis */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="inline-flex rounded-lg bg-white border border-maison-border p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setDisplayCurrency('EUR')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  displayCurrency === 'EUR' ? 'bg-[#171614] text-white' : 'text-maison-slate'
                }`}
              >
                EUR €
              </button>
              <button
                type="button"
                onClick={() => setDisplayCurrency('CNY')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  displayCurrency === 'CNY' ? 'bg-[#171614] text-white' : 'text-maison-slate'
                }`}
              >
                CNY ¥
              </button>
            </div>

            <button
              type="button"
              onClick={() => setProposalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171614] text-white text-xs font-semibold hover:bg-maison-brass transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Devis PDF
            </button>
          </div>
        </div>

        {/* Navigation Mobile Ruban */}
        <div className="md:hidden border-t border-maison-border bg-maison-canvas px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'configurator', label: 'Configurateur' },
            { id: 'tiers', label: 'Paliers' },
            { id: 'tools', label: 'Outils (7)' },
            { id: 'audit', label: 'Audit Usine' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-[#171614] text-white'
                  : 'bg-white border border-maison-border text-maison-slate'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* ================================================================= */}
      {/* CONTENU PRINCIPAL                                                 */}
      {/* ================================================================= */}
      <main className="no-print max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'configurator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ------------------------------------------------------------- */}
            {/* COLONNE GAUCHE : STUDIO VISUEL & PARAMÈTRES (7 COLS)          */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-6">
              <StudioShowcase
                bagType={bagType}
                onSelectBagType={handleBagTypeChange}
                isSingleLayer={isSingleLayer}
                onToggleSingleLayer={setIsSingleLayer}
                technology={technology}
                onSelectTechnology={handleTechChange}
                widthCm={widthCm}
                heightCm={heightCm}
                bottomCm={bottomCm}
                sideGussetCm={sideGussetCm}
                hasZip={selectedZipObj.hasZip}
                quote={quote}
                presetName={presetObj.name}
              />

              {/* BLOC 1 : DIMENSIONS, QUANTITÉS & FAÇONNAGE */}
              <section className="bg-white border border-maison-border rounded-2xl p-5 sm:p-6 shadow-atelier space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-maison-brassLight flex items-center justify-center text-maison-brass">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-maison-ink">
                        1 · Gabarit, Volumétrie & Fermeture
                      </h3>
                      <p className="text-xs text-maison-muted">
                        Cotes finies extérieures et paramètres d'impression
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
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-maison-canvas border border-maison-border text-maison-slate hover:border-maison-brass hover:text-maison-ink transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grille Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-maison-slate">
                      {bagType === 'roll_film' ? 'Laize coupe (cm)' : 'Largeur (cm)'}
                    </span>
                    <input
                      type="number"
                      min={3}
                      max={100}
                      step="0.5"
                      value={widthCm}
                      onChange={e => setWidthCm(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-maison-border bg-maison-canvas/40 font-mono text-sm font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-maison-slate">
                      {bagType === 'roll_film' ? 'Pas répétition (cm)' : 'Hauteur (cm)'}
                    </span>
                    <input
                      type="number"
                      min={4}
                      max={100}
                      step="0.5"
                      value={heightCm}
                      onChange={e => setHeightCm(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-maison-border bg-maison-canvas/40 font-mono text-sm font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                    />
                  </label>

                  {activeBagDef.hasBottomGusset && (
                    <label className="space-y-1.5">
                      <span className="text-xs font-medium text-maison-slate">Soufflet fond (cm)</span>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.5"
                        value={bottomCm}
                        onChange={e => setBottomCm(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-maison-border bg-maison-canvas/40 font-mono text-sm font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                      />
                    </label>
                  )}

                  {activeBagDef.hasSideGusset && (
                    <label className="space-y-1.5">
                      <span className="text-xs font-medium text-maison-slate">Soufflet latéral (cm)</span>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.5"
                        value={sideGussetCm}
                        onChange={e => setSideGussetCm(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-maison-border bg-maison-canvas/40 font-mono text-sm font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                      />
                    </label>
                  )}

                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-maison-slate">Visuels / SKU</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={skuCount}
                      onChange={e => setSkuCount(Math.max(1, Math.round(Number(e.target.value))))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-maison-border bg-maison-canvas/40 font-mono text-sm font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                    />
                  </label>
                </div>

                {/* Volume & Quantité (avec mode bobine mètres/kg si roll_film) */}
                <div className="bg-maison-canvas/60 border border-maison-border rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-maison-ink">
                      {bagType === 'roll_film' ? 'Mode de Chiffrage Bobine' : 'Quantité Totale Commandée'}
                    </span>

                    {bagType === 'roll_film' ? (
                      <div className="inline-flex rounded-lg bg-white border border-maison-border p-0.5 text-[11px] font-semibold">
                        {(['pcs', 'meters', 'kg'] as const).map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setRollQuoteMode(m)}
                            className={`px-2.5 py-1 rounded-md ${rollQuoteMode === m ? 'bg-[#171614] text-white' : 'text-maison-slate'}`}
                          >
                            {m === 'pcs' ? 'Nb Coupes' : m === 'meters' ? 'Métrage (m)' : 'Poids (kg)'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {(technology === 'digital' ? [500, 1000, 2500, 5000, 10000] : [10000, 20000, 50000, 100000]).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuantity(q)}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-colors ${
                              quantity === q
                                ? 'bg-[#171614] text-white'
                                : 'bg-white border border-maison-border text-maison-slate hover:text-maison-ink'
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
                        className="w-40 px-3.5 py-2 rounded-xl border border-maison-border bg-white font-mono text-base font-semibold text-maison-ink"
                      />
                      <span className="text-xs text-maison-slate font-mono">
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
                        className="w-40 px-3.5 py-2 rounded-xl border border-maison-border bg-white font-mono text-base font-semibold text-maison-ink"
                      />
                      <span className="text-xs text-maison-slate font-mono">
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
                        className="w-full sm:w-44 px-3.5 py-2 rounded-xl border border-maison-border bg-white font-mono text-base font-semibold text-maison-ink focus:outline-none focus:border-maison-brass"
                      />
                      <input
                        type="range"
                        min={technology === 'digital' ? 250 : 5000}
                        max={technology === 'digital' ? 15000 : 120000}
                        step={technology === 'digital' ? 250 : 1000}
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        className="atelier-slider flex-1"
                      />
                    </div>
                  )}
                </div>

                {/* Sélecteur Fermeture Zip + Découpe + Impression */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-maison-border">
                  <div>
                    <span className="text-xs font-semibold text-maison-ink block mb-2">Type de fermeture / Zip</span>
                    <div className="space-y-1.5">
                      {activeBagDef.zipperOptions.map((z) => (
                        <button
                          key={z.instId}
                          type="button"
                          onClick={() => setZipperInstId(z.instId)}
                          className={`w-full px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            zipperInstId === z.instId
                              ? 'border-[#171614] bg-maison-canvas text-maison-ink font-semibold'
                              : 'border-maison-border bg-white text-maison-slate hover:border-maison-borderStrong'
                          }`}
                        >
                          <span>{z.labelFr}</span>
                          {zipperInstId === z.instId && <Check className="w-3.5 h-3.5 text-maison-brass shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-maison-ink block mb-2">Découpe du contour</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCuttingType('double_cut')}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                            cuttingType === 'double_cut'
                              ? 'border-[#171614] bg-[#171614] text-white'
                              : 'border-maison-border bg-white text-maison-slate'
                          }`}
                        >
                          Coupe Droite
                        </button>
                        <button
                          type="button"
                          onClick={() => setCuttingType('die_cut')}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                            cuttingType === 'die_cut'
                              ? 'border-[#171614] bg-[#171614] text-white'
                              : 'border-maison-border bg-white text-maison-slate'
                          }`}
                        >
                          Forme Spéciale
                        </button>
                      </div>
                    </div>

                    {bagType === 'four_side' && (
                      <div>
                        <span className="text-xs font-semibold text-maison-ink block mb-2">Sens sortie machine (Quad Seal)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFourSideOrientation('vertical')}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                              fourSideOrientation === 'vertical' ? 'border-[#171614] bg-maison-canvas text-maison-ink' : 'border-maison-border bg-white text-maison-slate'
                            }`}
                          >
                            Sortie Verticale
                          </button>
                          <button
                            type="button"
                            onClick={() => setFourSideOrientation('horizontal')}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                              fourSideOrientation === 'horizontal' ? 'border-[#171614] bg-maison-canvas text-maison-ink' : 'border-maison-border bg-white text-maison-slate'
                            }`}
                          >
                            Sortie Horizontale
                          </button>
                        </div>
                      </div>
                    )}

                    {(bagType === 'stand_up' || bagType === 'flat_bottom') && (
                      <div>
                        <span className="text-xs font-semibold text-maison-ink block mb-1.5">Assemblage du fond</span>
                        <select
                          value={bottomMode}
                          onChange={e => setBottomMode(Number(e.target.value) as BottomMode)}
                          className="w-full px-3 py-2 rounded-xl border border-maison-border bg-white text-xs font-medium text-maison-ink"
                        >
                          {BOTTOM_MODES_CATALOG.map((m) => (
                            <option key={m.value} value={m.value}>{m.labelFr}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Paramètres Spécifiques Filière (Numérique CMJN vs Héliogravure Cylindres) */}
                <div className="pt-4 border-t border-maison-border">
                  {technology === 'digital' ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-maison-emerald" />
                        <span className="text-xs font-semibold text-maison-ink">Passes d'impression Numérique</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'none', label: 'Neutre sans impression' },
                          { key: 'cmyk_white', label: 'CMJN + Blanc couvrant' },
                          { key: 'cmyk_white_inside', label: 'Recto/Verso + Intérieur' }
                        ].map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setDigitalPrintMode(m.key as DigitalPrintMode)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              digitalPrintMode === m.key
                                ? 'bg-[#171614] text-white'
                                : 'bg-maison-canvas border border-maison-border text-maison-slate hover:text-maison-ink'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-maison-brassLight/45 border border-[#E3D2B4] rounded-xl p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold text-maison-ink">Cylindres Cuivre Héliogravure</span>
                          <p className="text-[11px] text-maison-slate">
                            1 cylindre par couleur CMJN/Pantone/Blanc · {quote.imposition.singleCylinderCostCny} ¥ / cylindre (Ø {quote.imposition.cylinderCircumferenceCm} cm)
                          </p>
                        </div>
                        <span className="font-mono text-sm font-semibold text-maison-brass tabular-nums">
                          {cylinderCount} couleur{cylinderCount > 1 ? 's' : ''} ({(quote.cylindersCostCny * CNY_TO_EUR_RATE).toFixed(0)} €)
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
              </section>

              {/* BLOC 2 : STRUCTURE MATIÈRE & BARRIÈRE */}
              <section className="bg-white border border-maison-border rounded-2xl p-5 sm:p-6 shadow-atelier space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-maison-brassLight flex items-center justify-center text-maison-brass">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-maison-ink">
                        2 · Complexe Matière & Barrière Protectrice
                      </h3>
                      <p className="text-xs text-maison-muted">
                        {isSingleLayer
                          ? 'Mode Monocouche actif (sélectionnez le film mono-matériau ci-dessous)'
                          : 'Structures éprouvées en atelier ou composition libre jusqu’à 4 films'}
                      </p>
                    </div>
                  </div>

                  {!isSingleLayer && (
                    <button
                      type="button"
                      onClick={() => setUseCustomLayers(!useCustomLayers)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        useCustomLayers
                          ? 'bg-[#171614] text-white border-[#171614]'
                          : 'bg-maison-canvas text-maison-ink border-maison-border hover:border-maison-brass'
                      }`}
                    >
                      {useCustomLayers ? 'Revenir aux Préréglages' : 'Composer Sur-Mesure'}
                    </button>
                  )}
                </div>

                {isSingleLayer ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRINT_LAYERS.map((layer) => (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setCustomPrintLayerId(layer.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          customPrintLayerId === layer.id
                            ? 'border-[#171614] bg-maison-canvas ring-1 ring-[#171614]'
                            : 'border-maison-border bg-white hover:border-maison-borderStrong'
                        }`}
                      >
                        <div className="text-xs font-semibold text-maison-ink">{layer.nameFr}</div>
                        <div className="text-[11px] font-mono text-maison-muted mt-0.5">
                          {layer.thicknessUm} µm · Densité {layer.density} g/cm³
                        </div>
                      </button>
                    ))}
                  </div>
                ) : useCustomLayers ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-maison-canvas/50 p-4 rounded-xl border border-maison-border">
                    <label className="space-y-1 text-xs">
                      <span className="font-semibold text-maison-slate">Couche 1 · Impression Extérieure</span>
                      <select
                        value={customPrintLayerId}
                        onChange={e => setCustomPrintLayerId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-maison-border bg-white text-xs font-medium"
                      >
                        {PRINT_LAYERS.map(l => <option key={l.id} value={l.id}>{l.nameFr}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1 text-xs">
                      <span className="font-semibold text-maison-slate">Couche 2 · Barrière Principale</span>
                      <select
                        value={customBarrier1Id || ''}
                        onChange={e => setCustomBarrier1Id(e.target.value || null)}
                        className="w-full px-3 py-2 rounded-lg border border-maison-border bg-white text-xs font-medium"
                      >
                        <option value="">Aucune (Complexe 2 couches)</option>
                        {BARRIER_LAYERS.map(l => <option key={l.id} value={l.id}>{l.nameFr}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1 text-xs">
                      <span className="font-semibold text-maison-slate">Couche 3 · Renfort Optionnel (4 couches)</span>
                      <select
                        value={customBarrier2Id || ''}
                        onChange={e => setCustomBarrier2Id(e.target.value || null)}
                        className="w-full px-3 py-2 rounded-lg border border-maison-border bg-white text-xs font-medium"
                      >
                        <option value="">Aucune (Standard 2-3 couches)</option>
                        {BARRIER_LAYERS.map(l => <option key={l.id} value={l.id}>{l.nameFr}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1 text-xs">
                      <span className="font-semibold text-maison-slate">Couche Interne · Soudure Alimentaire</span>
                      <select
                        value={customSealLayerId}
                        onChange={e => setCustomSealLayerId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-maison-border bg-white text-xs font-medium"
                      >
                        {SEAL_LAYERS.map(l => <option key={l.id} value={l.id}>{l.nameFr}</option>)}
                      </select>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Filtres Famille Matière */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {materialCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setMaterialCategoryFilter(cat)}
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            materialCategoryFilter === cat
                              ? 'bg-[#171614] text-white'
                              : 'bg-maison-canvas border border-maison-border text-maison-slate hover:text-maison-ink'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {filteredPresets.map((preset) => {
                        const isSelected = materialPreset === preset.key;
                        return (
                          <button
                            key={preset.key}
                            type="button"
                            onClick={() => setMaterialPreset(preset.key)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-[#171614] bg-maison-canvas/80 ring-1 ring-[#171614]'
                                : 'border-maison-border bg-white hover:border-maison-borderStrong'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-semibold text-maison-ink leading-snug">
                                {preset.name}
                              </span>
                              {preset.badge && (
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-maison-brassLight text-[#7A5928] text-[10px] font-semibold">
                                  {preset.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-maison-muted mt-1 line-clamp-2">
                              {preset.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {technology === 'gravure' && !isSingleLayer && (
                  <div className="pt-3 border-t border-maison-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-maison-ink">Procédé de contrecollage</span>
                    <div className="inline-flex rounded-lg bg-maison-canvas p-0.5 border border-maison-border">
                      <button
                        type="button"
                        onClick={() => setLaminationMethod('dry')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          laminationMethod === 'dry' ? 'bg-white text-maison-ink shadow-sm' : 'text-maison-slate'
                        }`}
                      >
                        Sec Haute Barrière
                      </button>
                      <button
                        type="button"
                        onClick={() => setLaminationMethod('solvent_free')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          laminationMethod === 'solvent_free' ? 'bg-white text-maison-ink shadow-sm' : 'text-maison-slate'
                        }`}
                      >
                        Sans Solvant Alimentaire
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* BLOC 3 : FINITIONS & ACCESSOIRES PHOTO */}
              <section className="bg-white border border-maison-border rounded-2xl p-5 sm:p-6 shadow-atelier space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-maison-brassLight flex items-center justify-center text-maison-brass">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-maison-ink">
                      3 · Finitions Tactiles & Accessoires
                    </h3>
                    <p className="text-xs text-maison-muted">
                      Rendus macro atelier et options fonctionnelles haute valeur ajoutée
                    </p>
                  </div>
                </div>

                <FinishesStudio finishes={finishes} onChange={setFinishes} technology={technology} />
              </section>

              {/* BLOC 4 : LOGISTIQUE, DÉLAI & FISCALITÉ */}
              <section className="bg-white border border-maison-border rounded-2xl p-5 sm:p-6 shadow-atelier space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-maison-brassLight flex items-center justify-center text-maison-brass">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-maison-ink">
                      4 · Logistique, Délai & Fiscalité Usine
                    </h3>
                    <p className="text-xs text-maison-muted">
                      Transport intérieur vers transitaire (13 zones), fabrication prioritaire et TVA atelier
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-maison-ink block">Transport Usine (~{quote.weightTotalKg} kg)</span>
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
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                            shippingMode === m.key
                              ? 'border-[#171614] bg-[#171614] text-white'
                              : 'border-maison-border bg-white text-maison-slate hover:border-maison-borderStrong'
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
                        className="w-full px-3 py-2 rounded-xl border border-maison-border bg-maison-canvas/50 text-xs font-medium text-maison-ink"
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
                          className="w-full px-3 py-2 rounded-xl border border-maison-border font-mono text-xs"
                          placeholder="Montant fret en ¥"
                        />
                        <span className="text-xs font-mono text-maison-muted shrink-0">CNY ¥</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-maison-ink block mb-1.5">Délai de production</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderUrgency('normal')}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                            orderUrgency === 'normal' ? 'border-[#171614] bg-maison-canvas text-maison-ink' : 'border-maison-border bg-white text-maison-slate'
                          }`}
                        >
                          Standard ({technology === 'gravure' ? '12j' : '7j'})
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderUrgency('urgent')}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                            orderUrgency === 'urgent' ? 'border-maison-brass bg-maison-brassLight text-[#7A5928]' : 'border-maison-border bg-white text-maison-slate'
                          }`}
                        >
                          Express Prioritaire (4j)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold text-maison-ink block mb-1">Facturation Chine</span>
                        <select
                          value={invoiceType}
                          onChange={e => setInvoiceType(e.target.value as InvoiceType)}
                          className="w-full px-2.5 py-2 rounded-xl border border-maison-border bg-white text-xs font-medium"
                        >
                          <option value="no_invoice">Sans TVA Usine</option>
                          <option value="vat_invoice">Facture TVA (+8%)</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-maison-ink block mb-1">Frais divers (¥)</span>
                        <input
                          type="number"
                          min={0}
                          value={extraFeeCny}
                          onChange={e => setExtraFeeCny(Math.max(0, Number(e.target.value)))}
                          className="w-full px-2.5 py-2 rounded-xl border border-maison-border bg-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* COLONNE DROITE : COCKPIT EXÉCUTIF & MARGE CLIENT (5 COLS)     */}
            {/* ------------------------------------------------------------- */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              {/* CARTE TARIFAIRE PRINCIPALE */}
              <div className="bg-white border border-maison-border rounded-2xl shadow-atelier overflow-hidden">
                <div className="bg-[#171614] text-white p-6">
                  <div className="flex items-center justify-between gap-2 text-xs text-white/70">
                    <span className="uppercase tracking-[0.16em] font-semibold text-[#D6B178]">
                      Tarif Client Proposé
                    </span>
                    <span className="font-mono">
                      {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div>
                      <div className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">
                        {formatMainMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)}
                      </div>
                      <div className="text-xs text-white/65 font-mono mt-1 tabular-nums">
                        par unité · {displayCurrency === 'EUR' ? `${quote.resalePriceUnitCny.toFixed(3)} ¥/u` : `${quote.resalePriceUnitEur.toFixed(3)} €/u`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-white/60">Total Commande</div>
                      <div className="font-mono text-xl sm:text-2xl font-semibold text-[#E8CFA6] tabular-nums">
                        {formatMainMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 2)}
                      </div>
                    </div>
                  </div>

                  {/* Bandeau 3 KPIs Exécutifs */}
                  <div className="grid grid-cols-3 gap-2.5 mt-6 pt-4 border-t border-white/15 text-xs">
                    <div>
                      <span className="text-white/55 block text-[11px]">Marge Nette</span>
                      <span className="font-mono font-semibold text-[#7ED4A8] tabular-nums">
                        +{quote.grossProfitTotalEur.toFixed(0)} € ({quote.grossMarginPercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-white/55 block text-[11px]">Revient Usine</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {quote.factoryCostUnitEur.toFixed(3)} €/u
                      </span>
                    </div>
                    <div>
                      <span className="text-white/55 block text-[11px]">Expédition</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {quote.weightTotalKg} kg · {quote.imposition.leadTimeDays}j
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTRÔLE STRATÉGIE DE REVENTE */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-maison-slate">
                      Pilotage de Votre Marge
                    </span>
                    <div className="inline-flex rounded-lg bg-maison-canvas p-0.5 border border-maison-border text-[11px] font-semibold">
                      {[
                        { k: 'percentage', l: '% Marge' },
                        { k: 'multiplier', l: 'Coeff ×' },
                        { k: 'fixed_price', l: 'Prix Fixe' }
                      ].map((m) => (
                        <button
                          key={m.k}
                          type="button"
                          onClick={() => setResalePricingMode(m.k as any)}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            resalePricingMode === m.k ? 'bg-white text-maison-ink shadow-sm' : 'text-maison-slate'
                          }`}
                        >
                          {m.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {resalePricingMode === 'percentage' && (
                    <div className="space-y-3">
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
                        <div className="flex items-center border border-maison-border rounded-xl px-2.5 py-1.5 bg-maison-canvas/50 w-20">
                          <input
                            type="number"
                            min={1}
                            max={95}
                            value={resaleMarginPercent}
                            onChange={e => setResaleMarginPercent(Math.min(95, Math.max(1, Number(e.target.value))))}
                            className="w-full bg-transparent font-mono text-sm font-semibold text-right focus:outline-none"
                          />
                          <span className="text-xs text-maison-muted ml-1">%</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {[30, 40, 45, 55, 65].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setResaleMarginPercent(pct)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                              resaleMarginPercent === pct
                                ? 'bg-maison-emeraldLight text-maison-emerald border border-maison-emerald/30'
                                : 'bg-maison-canvas border border-maison-border text-maison-slate hover:text-maison-ink'
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
                      <div className="flex items-center border border-maison-border rounded-xl px-3 py-1.5 bg-maison-canvas/50 w-24">
                        <span className="text-xs text-maison-muted mr-1">×</span>
                        <input
                          type="number"
                          step="0.05"
                          min={1.01}
                          value={resaleMultiplier}
                          onChange={e => setResaleMultiplier(Math.max(1.01, Number(e.target.value)))}
                          className="w-full bg-transparent font-mono text-sm font-semibold text-right focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {resalePricingMode === 'fixed_price' && (
                    <div className="flex items-center justify-between gap-3 bg-maison-canvas/50 border border-maison-border rounded-xl p-3">
                      <span className="text-xs font-medium text-maison-slate">Prix Unitaire Cible (€ HT)</span>
                      <input
                        type="number"
                        step="0.01"
                        min={0.01}
                        value={resaleFixedUnitPriceEur}
                        onChange={e => setResaleFixedUnitPriceEur(Math.max(0.01, Number(e.target.value)))}
                        className="w-28 px-3 py-1.5 rounded-lg border border-maison-border bg-white font-mono text-sm font-semibold text-right"
                      />
                    </div>
                  )}

                  {/* Ventilation Structurelle du Prix */}
                  <div className="pt-3 border-t border-maison-border space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-maison-ink">Répartition du Prix de Vente</span>
                      <span className="font-mono text-maison-emerald font-semibold tabular-nums">
                        +{quote.grossProfitUnitEur.toFixed(3)} €/u net
                      </span>
                    </div>

                    <div className="h-3 w-full rounded-full overflow-hidden flex bg-maison-stone">
                      <div style={{ width: `${pctMaterial}%` }} className="bg-[#171614]" title={`Matières ${pctMaterial}%`} />
                      <div style={{ width: `${pctPrint}%` }} className="bg-[#9E7840]" title={`Impression & Cylindres ${pctPrint}%`} />
                      <div style={{ width: `${pctConv}%` }} className="bg-[#787166]" title={`Façonnage & Finitions ${pctConv}%`} />
                      <div style={{ width: `${pctMisc}%` }} className="bg-[#C8BFA9]" title={`Logistique & Taxes ${pctMisc}%`} />
                      <div style={{ width: `${pctProfit}%` }} className="bg-[#1B5E42]" title={`Votre Marge ${pctProfit}%`} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-2 text-[11px] text-maison-slate pt-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#171614]" /> Matière ({pctMaterial}%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9E7840]" /> Impr. ({pctPrint}%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#787166]" /> Façon. ({pctConv}%)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C8BFA9]" /> Logist. ({pctMisc}%)</div>
                      <div className="flex items-center gap-1.5 font-semibold text-maison-emerald"><span className="w-2 h-2 rounded-full bg-[#1B5E42]" /> Marge ({pctProfit}%)</div>
                    </div>
                  </div>

                  {/* Boutons d'Export & Action */}
                  <div className="pt-3 border-t border-maison-border space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setProposalOpen(true)}
                      className="w-full py-3 px-4 rounded-xl bg-[#171614] hover:bg-maison-brass text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Générer Proposition Client / PDF
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => copyQuoteText('fr')}
                        className="py-2.5 px-3 rounded-xl border border-maison-border bg-maison-canvas/60 hover:bg-maison-stone text-xs font-semibold text-maison-ink flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedBanner === 'fr' ? <Check className="w-3.5 h-3.5 text-maison-emerald" /> : <Copy className="w-3.5 h-3.5 text-maison-slate" />}
                        {copiedBanner === 'fr' ? 'Devis FR copié' : 'Copier Devis FR'}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyQuoteText('zh')}
                        className="py-2.5 px-3 rounded-xl border border-maison-border bg-maison-canvas/60 hover:bg-maison-stone text-xs font-semibold text-maison-ink flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedBanner === 'zh' ? <Check className="w-3.5 h-3.5 text-maison-emerald" /> : <Copy className="w-3.5 h-3.5 text-maison-slate" />}
                        {copiedBanner === 'zh' ? 'Fiche ZH copiée' : 'Bon Usine ZH'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'tiers' && (
          <ComparisonTiersTab
            baseDim={dimPayload}
            onSelectTier={(tech, q) => {
              setTechnology(tech);
              setQuantity(q);
              setActiveTab('configurator');
            }}
          />
        )}

        {activeTab === 'tools' && (
          <WorkshopToolsTab
            defaultBagType={bagType}
            defaultWidthCm={widthCm}
            defaultHeightCm={heightCm}
            defaultGussetCm={bottomCm}
            defaultThicknessSilk={quote.imposition.actualThicknessSilk}
            defaultQuantity={quantity}
            onApplyQuantityToQuote={(q) => {
              setQuantity(q);
              setActiveTab('configurator');
            }}
          />
        )}

        {activeTab === 'audit' && <FactoryAuditTab quote={quote} />}
      </main>

      {/* ================================================================= */}
      {/* BARRE MOBILE COLLANTE (EXPÉRIENCE MOBILE HAUTE FACTURE)           */}
      {/* ================================================================= */}
      <div className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-maison-border shadow-sticky-bar px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-maison-muted font-medium">
            {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs · Marge {quote.grossMarginPercent.toFixed(0)}%
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-maison-ink tabular-nums">
              {formatMainMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)}/u
            </span>
            <span className="font-mono text-xs font-semibold text-maison-brass tabular-nums">
              Total {formatMainMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 0)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setProposalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#171614] text-white text-xs font-semibold shrink-0 shadow-sm"
        >
          Devis PDF
        </button>
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
