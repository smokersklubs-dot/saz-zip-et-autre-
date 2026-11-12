import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sparkles,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  Lock,
  EyeOff,
  Box,
  Calculator,
  BarChart3,
  Info,
  Check,
  Scale,
  Ruler,
  Layers,
  Settings2,
  Truck,
  Clock,
  FileText,
  Copy,
  AlertTriangle,
  Scissors,
  Palette,
  PackageCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  calculateMylarQuote,
  calculateTierMatrix,
  MATERIAL_PRESETS,
  BAG_TYPES_CATALOG,
  BOTTOM_MODES_CATALOG,
  BagDimensions,
  BagTypeKey,
  PrintTechnology,
  CuttingType,
  BottomMode,
  DigitalPrintMode,
  OrderUrgency,
  InvoiceType,
  ShippingMode,
  CNY_TO_EUR_RATE
} from './pricingEngine';
import {
  PRINT_LAYERS,
  BARRIER_LAYERS,
  SEAL_LAYERS
} from './materialsCatalog';
import {
  StandUpBagIcon,
  ThreeSideBagIcon,
  ZipperPouchIcon,
  FlatBottomBagIcon,
  GussetBagIcon,
  FourSideBagIcon,
  CenterSealBagIcon,
  RollFilmIcon
} from './components/BagVisuals';
import {
  MatteVarnishIcon,
  SpotUvIcon,
  ThickUv3DIcon,
  HotFoilIcon,
  DegassingValveIcon,
  HangingHoleIcon,
  SpoutFitmentIcon,
  ZipLockIcon,
  DieCutShapeIcon
} from './components/VisualFinishes';

export default function App() {
  const [printTechnology, setPrintTechnology] = useState<PrintTechnology>('digital');
  const [gravureTab, setGravureTab] = useState<'composite' | 'single' | 'tools'>('composite');
  const [mobileTab, setMobileTab] = useState<'config' | 'finishes' | 'pricing' | 'charts'>('config');

  // Identifiant unique du bouton de sac sélectionné
  const [selectedModelId, setSelectedModelId] = useState<string>('dig_zipper');

  // Mode structure sur-mesure (jusqu'à 5 couches comme dans didMount.js / suanfa.js)
  const [isCustomStructure, setIsCustomStructure] = useState<boolean>(false);
  const [customLayers, setCustomLayers] = useState({
    printLayerId: PRINT_LAYERS[0].id,
    barrierLayerId: BARRIER_LAYERS[0].id as string | null,
    barrierLayer2Id: null as string | null,
    barrierLayer3Id: null as string | null,
    sealLayerId: SEAL_LAYERS[0].id as string | null,
    isSingleLayer: false
  });

  // États indépendants des finitions pour pouvoir les combiner librement
  const [finishesState, setFinishesState] = useState({
    matteVarnish: false,
    spotUv: false,
    thickUv: false,
    hotStamping: false,
    degassingValve: false,
    hangingHole: false,
    spout: 'none' as 'none' | 'spout_10mm' | 'spout_16mm',
    hasWindow: false,
    hasEmbossing: false,
    hasAdhesiveStrip: false,
    fullInkCoverage: false
  });

  const [copiedLang, setCopiedLang] = useState<'FR' | 'ZH' | null>(null);

  const [dimensions, setDimensions] = useState<BagDimensions>({
    technology: 'digital',
    bagType: 'stand_up',
    zipperInstId: 'FINST-U0H66D817563AUNFHE07PAXXY6MA30N34PEMMX822',
    widthCm: 15,
    heightCm: 25,
    bottomCm: 6,
    sideGussetCm: 4,
    quantity: 1000,
    skuCount: 1,
    cuttingType: 'double_cut',
    bottomMode: 1,
    digitalPrintMode: 'cmyk_white',
    orderUrgency: 'normal',
    invoiceType: 'no_invoice',
    shippingMode: 'none',
    customShippingCny: 0,
    extraFeeCny: 0,
    hasZip: true,
    materialPreset: 'mylar_standard',
    cylinderCount: 6,
    resalePricingMode: 'percentage',
    resaleMarginPercent: 45,
    resaleMultiplier: 1.85,
    resaleFixedUnitPriceEur: 0.35
  });

  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'CNY'>('EUR');
  const [showAdminDetails, setShowAdminDetails] = useState(true);

  // Regroupement des 25 structures par familles
  const structureCategories = useMemo(() => {
    const cats: Record<string, { key: string; name: string; badge?: string; silk: number }[]> = {};
    Object.entries(MATERIAL_PRESETS).forEach(([key, preset]) => {
      const cat = preset.category || 'Autres Complexes';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push({
        key,
        name: preset.name,
        badge: preset.badge,
        silk: preset.totalThicknessSilk
      });
    });
    return cats;
  }, []);

  // Résolution de la finition UV / 3D UV / Dorure combinée selon la table gxcb
  const computedUvEnhancement = useMemo((): 'none' | 'matte_varnish' | 'spot_uv' | 'thick_uv' | 'hot_stamping' | 'uv_and_hot_stamping' => {
    if ((finishesState.spotUv || finishesState.thickUv) && finishesState.hotStamping) return 'uv_and_hot_stamping';
    if (finishesState.thickUv) return 'thick_uv';
    if (finishesState.spotUv) return 'spot_uv';
    if (finishesState.hotStamping) return 'hot_stamping';
    if (finishesState.matteVarnish) return 'matte_varnish';
    return 'none';
  }, [finishesState.spotUv, finishesState.thickUv, finishesState.hotStamping, finishesState.matteVarnish]);

  // Synchronisation complète des paramètres avec le moteur
  const activeDimensions = useMemo((): BagDimensions => {
    return {
      ...dimensions,
      technology: printTechnology,
      customLayers: (isCustomStructure || customLayers.isSingleLayer) ? customLayers : undefined,
      finishes: {
        uvEnhancement: computedUvEnhancement,
        hasMatteVarnish: finishesState.matteVarnish,
        hasThickUv: finishesState.thickUv,
        spoutSize: finishesState.spout,
        hasDegassingValve: finishesState.degassingValve,
        hasHangingHole: finishesState.hangingHole,
        hasWindow: finishesState.hasWindow,
        hasEmbossing: finishesState.hasEmbossing,
        hasAdhesiveStrip: finishesState.hasAdhesiveStrip,
        fullInkCoverage: finishesState.fullInkCoverage
      }
    };
  }, [dimensions, printTechnology, isCustomStructure, customLayers, computedUvEnhancement, finishesState]);

  const currentBagDef = useMemo(() => {
    return BAG_TYPES_CATALOG.find(b => b.key === dimensions.bagType) || BAG_TYPES_CATALOG[0];
  }, [dimensions.bagType]);

  // Sélection d'un sac (Numérique ou Gravure)
  const handleBagSelection = (config: {
    id: string;
    tech: PrintTechnology;
    bagType: BagTypeKey;
    hasZip: boolean;
    materialPreset?: string;
    singleLayerPrintId?: string;
  }) => {
    setSelectedModelId(config.id);
    setPrintTechnology(config.tech);
    const bagDef = BAG_TYPES_CATALOG.find(b => b.key === config.bagType) || BAG_TYPES_CATALOG[0];
    const matchedZip = bagDef.zipperOptions.find(z => config.hasZip ? z.hasZip : !z.hasZip) || bagDef.zipperOptions[0];

    if (config.singleLayerPrintId) {
      setCustomLayers(prev => ({
        ...prev,
        printLayerId: config.singleLayerPrintId!,
        isSingleLayer: true
      }));
    } else {
      setCustomLayers(prev => ({
        ...prev,
        isSingleLayer: false
      }));
    }

    setDimensions(prev => ({
      ...prev,
      technology: config.tech,
      bagType: config.bagType,
      hasZip: matchedZip.hasZip,
      zipperInstId: matchedZip.instId,
      bottomMode: bagDef.defaultBottomMode,
      quantity: config.tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity),
      materialPreset: config.materialPreset || prev.materialPreset
    }));
  };

  // Bascule entre Numérique et Gravure
  const handleTechnologyChange = (tech: PrintTechnology) => {
    setPrintTechnology(tech);
    setDimensions(prev => ({
      ...prev,
      technology: tech,
      quantity: tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity)
    }));
    if (tech === 'digital') {
      setCustomLayers(prev => ({ ...prev, isSingleLayer: false }));
      if (selectedModelId.startsWith('grv_')) {
        setSelectedModelId('dig_' + selectedModelId.replace('grv_', ''));
      }
    } else if (tech === 'gravure' && selectedModelId.startsWith('dig_')) {
      setSelectedModelId('grv_' + selectedModelId.replace('dig_', ''));
    }
  };

  const quote = useMemo(() => {
    return calculateMylarQuote(activeDimensions);
  }, [activeDimensions]);

  const tierData = useMemo(() => {
    const tiers = printTechnology === 'gravure'
      ? [5000, 10000, 20000, 50000, 100000]
      : [250, 500, 1000, 2500, 5000, 10000];
    const results = calculateTierMatrix(activeDimensions, tiers);
    return results.map((r, i) => ({
      qty: tiers[i],
      label: tiers[i] >= 1000 ? `${tiers[i] / 1000}k` : `${tiers[i]}`,
      salePriceEur: r.resalePriceUnitEur,
      catalogPriceEur: r.beijincaiCatalogUnitEur,
      factoryCostEur: r.factoryCostUnitEur,
      grossProfitEur: r.grossProfitUnitEur,
      marginPct: r.grossMarginPercent
    }));
  }, [activeDimensions, printTechnology]);

  const handleDimChange = (field: keyof BagDimensions, value: any) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const handleZipSelect = (instId: string) => {
    const opt = currentBagDef.zipperOptions.find(z => z.instId === instId);
    setDimensions(prev => ({
      ...prev,
      zipperInstId: instId,
      hasZip: opt ? opt.hasZip : prev.hasZip
    }));
  };

  const toggleFinish = (key: keyof typeof finishesState) => {
    if (key === 'spout') {
      setFinishesState(prev => ({
        ...prev,
        spout: prev.spout === 'none' ? 'spout_10mm' : prev.spout === 'spout_10mm' ? 'spout_16mm' : 'none'
      }));
    } else if (key === 'thickUv') {
      setFinishesState(prev => ({
        ...prev,
        thickUv: !prev.thickUv,
        spotUv: !prev.thickUv ? false : prev.spotUv
      }));
    } else if (key === 'spotUv') {
      setFinishesState(prev => ({
        ...prev,
        spotUv: !prev.spotUv,
        thickUv: !prev.spotUv ? false : prev.thickUv
      }));
    } else {
      setFinishesState(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleCopyQuote = (lang: 'FR' | 'ZH') => {
    const text = lang === 'FR' ? quote.imposition.quoteSpecFr : quote.imposition.quoteSpecZh;
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2500);
  };

  const formatMoney = (eur: number, cny: number, decimals = 2) => {
    return activeCurrency === 'EUR'
      ? `${eur.toFixed(decimals)} €`
      : `${cny.toFixed(decimals)} ¥`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 pb-20 sm:pb-8">
      {/* ===================== NAVBAR ===================== */}
      <header className="border-b border-slate-800 bg-[#0a101f]/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-xs sm:text-sm bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                ANTIGRAVITY MYLAR V5.0.2
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                100% Usine Beijincai
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Moteur intégral suanfa.js (5 couches, 25 structures, découpe forme, variantes, imposition & marges)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveCurrency('EUR')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${activeCurrency === 'EUR' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              € EUR
            </button>
            <button
              type="button"
              onClick={() => setActiveCurrency('CNY')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${activeCurrency === 'CNY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              ¥ CNY
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdminDetails(!showAdminDetails)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:border-slate-700 cursor-pointer"
          >
            {showAdminDetails ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{showAdminDetails ? 'Masquer Détails Usine' : 'Afficher Détails Usine'}</span>
          </button>
        </div>
      </header>

      {/* ===================== SECTION 1 : PANNEAUX USINE ORIGINAUX ===================== */}
      <section className="border-b border-slate-800/80 bg-[#090e1c] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* PANNEAU GAUCHE : Outil de tarification numérique */}
            <div className={`lg:col-span-5 rounded-2xl border transition-all p-3.5 sm:p-4 ${
              printTechnology === 'digital'
                ? 'bg-gradient-to-br from-[#0c1a30] to-[#08101e] border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                : 'bg-[#0a0f1d] border-slate-800/80 hover:border-slate-700 opacity-75'
            }`}>
              <div
                className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 cursor-pointer"
                onClick={() => handleTechnologyChange('digital')}
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span className={printTechnology === 'digital' ? 'text-cyan-300' : 'text-slate-300'}>
                    Outil de tarification numérique (数码)
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  100 à 10 000 pcs • 0 € cliché
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_three_side', tech: 'digital', bagType: 'three_side', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_three_side'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><ThreeSideBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac à 3 soudures</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_stand_up', tech: 'digital', bagType: 'stand_up', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_stand_up'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><StandUpBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac debout (Sans zip)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_zipper', tech: 'digital', bagType: 'stand_up', hasZip: true })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_zipper'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><ZipperPouchIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sachet Zip (Doypack)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_gusset', tech: 'digital', bagType: 'gusset', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_gusset'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><GussetBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac accordéon</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_flat_bottom', tech: 'digital', bagType: 'flat_bottom', hasZip: true })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_flat_bottom'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><FlatBottomBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac octogonal (8 côtés)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_four_side', tech: 'digital', bagType: 'four_side', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_four_side'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><FourSideBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac scellé 4 côtés</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_center_seal', tech: 'digital', bagType: 'center_seal', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_center_seal'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><CenterSealBagIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Sac soudure dos</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_roll_film', tech: 'digital', bagType: 'roll_film', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_roll_film'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0"><RollFilmIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <span className="truncate text-[11px] font-medium">Film en rouleau</span>
                </button>
              </div>
            </div>

            {/* PANNEAU DROITE : Outil de tarification de gravure */}
            <div className={`lg:col-span-7 rounded-2xl border transition-all p-3.5 sm:p-4 ${
              printTechnology === 'gravure'
                ? 'bg-gradient-to-br from-[#12142e] to-[#0a0d1f] border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400/50'
                : 'bg-[#0a0f1d] border-slate-800/80 hover:border-slate-700 opacity-75'
            }`}>
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-800/80 gap-1.5 cursor-pointer"
                onClick={() => handleTechnologyChange('gravure')}
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span className={printTechnology === 'gravure' ? 'text-indigo-300' : 'text-slate-300'}>
                    Outil de tarification de gravure (凹版 Héliogravure)
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  10 000 pcs min • Cylindres cuivre (1 à 10 couleurs)
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold mb-3 border-b border-slate-800/60 pb-1.5">
                <button
                  type="button"
                  onClick={() => { setGravureTab('composite'); handleTechnologyChange('gravure'); }}
                  className={`pb-1 transition flex items-center gap-1 cursor-pointer ${
                    gravureTab === 'composite'
                      ? 'text-indigo-300 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sacs composites (复合袋)
                </button>
                <button
                  type="button"
                  onClick={() => { setGravureTab('single'); handleTechnologyChange('gravure'); }}
                  className={`pb-1 transition flex items-center gap-1 cursor-pointer ${
                    gravureTab === 'single'
                      ? 'text-indigo-300 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sac à une seule couche (单层袋)
                </button>
                <button
                  type="button"
                  onClick={() => { setGravureTab('tools'); handleTechnologyChange('gravure'); }}
                  className={`pb-1 transition flex items-center gap-1 cursor-pointer ${
                    gravureTab === 'tools'
                      ? 'text-indigo-300 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Outils de calcul & Imposition
                </button>
              </div>

              {gravureTab === 'composite' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_three_side', tech: 'gravure', bagType: 'three_side', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_three_side'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><ThreeSideBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac à 3 soudures</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_stand_up', tech: 'gravure', bagType: 'stand_up', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_stand_up'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><StandUpBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac debout (Sans zip)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_flat_bottom', tech: 'gravure', bagType: 'flat_bottom', hasZip: true })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_flat_bottom'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><FlatBottomBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac octogonal scellé</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_zipper', tech: 'gravure', bagType: 'stand_up', hasZip: true })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_zipper'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><ZipperPouchIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sachet Zip (Doypack)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_gusset', tech: 'gravure', bagType: 'gusset', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_gusset'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><GussetBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac accordéon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_center_seal', tech: 'gravure', bagType: 'center_seal', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_center_seal'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><CenterSealBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac soudure dos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_four_side', tech: 'gravure', bagType: 'four_side', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_four_side'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><FourSideBagIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Sac scellé 4 côtés</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_roll_film', tech: 'gravure', bagType: 'roll_film', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_roll_film'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0"><RollFilmIcon className="w-5 h-5" /></div>
                    <span className="truncate text-[11px] font-medium">Film en rouleau (auto)</span>
                  </button>
                </div>
              )}

              {/* ONGLET 2 : SACS MONOCOUCHE (0 passe de lamination) */}
              {gravureTab === 'single' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleBagSelection({
                        id: 'grv_single_pe',
                        tech: 'gravure',
                        bagType: 'three_side',
                        hasZip: false,
                        singleLayerPrintId: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1' // PE85
                      })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_pe'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium text-[11px] truncate">Sachet PE Pur</span>
                        <span className="text-[9px] text-emerald-400">0 ¥ Lamination</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({
                        id: 'grv_single_opp',
                        tech: 'gravure',
                        bagType: 'three_side',
                        hasZip: false,
                        singleLayerPrintId: 'FINST-ZLE66OD1IRJ4IT7KJN96B8XOM0AK2UODRSMNMWSV1' // BOPP25
                      })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_opp'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium text-[11px] truncate">Sachet BOPP 25µm</span>
                        <span className="text-[9px] text-emerald-400">Monocouche clair</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({
                        id: 'grv_single_roll',
                        tech: 'gravure',
                        bagType: 'roll_film',
                        hasZip: false,
                        singleLayerPrintId: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1' // PE85
                      })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_roll'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <RollFilmIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium text-[11px] truncate">Gaine / Bobine PE</span>
                        <span className="text-[9px] text-emerald-400">Ensachage direct</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({
                        id: 'grv_single_kraft',
                        tech: 'gravure',
                        bagType: 'three_side',
                        hasZip: false,
                        singleLayerPrintId: 'FINST-HOE66X61EH24X6HEL84R97M96ASB301QNZTMMQ87' // Kraft50g
                      })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_kraft'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium text-[11px] truncate">Kraft Pur 50g</span>
                        <span className="text-[9px] text-amber-400">100% Papier Bio</span>
                      </div>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    💡 <strong>Mode Monocouche (1 seule couche active, 0 passe de contrecollage)</strong> : Supprime intégralement le coût de lamination (`js_fh = 0 ¥`).
                  </p>
                </div>
              )}

              {/* ONGLET 3 : OUTILS DE CALCUL & IMPOSITION ATELIER */}
              {gravureTab === 'tools' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Ruler className="w-4 h-4 text-indigo-400" />
                      <span>Imposition Bobine 760mm</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Poses Laize/Cyl : <span className="text-cyan-300">{quote.imposition.webPoses} × {quote.imposition.cylinderPoses} poses</span></div>
                      <div>Tours machine : <span className="text-cyan-300">{quote.imposition.totalRotations.toLocaleString('fr-FR')} tours</span></div>
                      <div>Métrage film : <span className="text-cyan-300">{quote.imposition.linearMeters} m ({quote.imposition.totalFilmSqm} m²)</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <span>Poids & Déroulage</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Poids unitaire : <span className="text-amber-300">{quote.weightUnitGrams.toFixed(2)} g/sac</span></div>
                      <div>Poids total : <span className="text-amber-300">{quote.weightTotalKg} kg</span></div>
                      <div>Déroulage : <span className="text-emerald-300">{quote.imposition.unwindingMode}</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Lamination & Cylindres</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Passes colle : <span className="text-purple-300">{quote.imposition.laminationPasses} passe(s) ({quote.imposition.activeLayersCount} couches)</span></div>
                      <div>Épaisseur : <span className="text-purple-300">{quote.imposition.actualThicknessSilk} 丝 ({quote.imposition.actualThicknessMicrons} µm)</span></div>
                      <div>Cylindres cuivre : <span className="text-rose-300">{quote.cylinderCount} ({quote.cylindersCostCny} ¥)</span></div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ===================== ONGLETS MOBILE (SMARTPHONE) ===================== */}
      <div className="sm:hidden border-b border-slate-800 bg-[#090f1d] px-2 py-2 flex items-center justify-between text-[11px] font-semibold sticky top-[57px] z-40">
        <button
          type="button"
          onClick={() => setMobileTab('config')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
            mobileTab === 'config' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Config & Film</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('finishes')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
            mobileTab === 'finishes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Finitions</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('pricing')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
            mobileTab === 'pricing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Tarifs & Devis</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('charts')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
            mobileTab === 'charts' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Paliers</span>
        </button>
      </div>

      {/* ===================== CORPS PRINCIPAL DU DASHBOARD ===================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===================== COLONNE GAUCHE : CONFIGURATEUR COMPLET USINE ===================== */}
        <div className={`lg:col-span-5 space-y-4 ${
          mobileTab === 'config' || mobileTab === 'finishes' ? 'block' : 'hidden sm:block'
        }`}>

          {/* BLOC 1 : DIMENSIONS, QUANTITÉ, VARIANTES (款数), ZIP, DÉCOUPE (双切/模切) & FOND (底部方式) */}
          <div className={`${mobileTab === 'finishes' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>1. Format & Confection : {currentBagDef.nameFr}</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {dimensions.widthCm}×{dimensions.heightCm}{currentBagDef.hasBottomGusset ? `+${dimensions.bottomCm}` : ''} cm
              </span>
            </div>

            {/* Alerte si sac dépasse la laize machine */}
            {!quote.imposition.isSizeValid && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Attention Usine (`袋型过大`) :</strong> La hauteur développée dépasse la laize utile de 74 cm. Réduisez la hauteur ou passez en mode Fond séparé (2 ou 3 bobines).</span>
              </div>
            )}

            {/* Dimensions L x H x Fond/Soufflet */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Largeur (宽 cm)</span>
                <input
                  type="number"
                  min="4"
                  max="70"
                  step="0.5"
                  value={dimensions.widthCm}
                  onChange={e => handleDimChange('widthCm', parseFloat(e.target.value) || 4)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Hauteur (高 cm)</span>
                <input
                  type="number"
                  min="5"
                  max="80"
                  step="0.5"
                  value={dimensions.heightCm}
                  onChange={e => handleDimChange('heightCm', parseFloat(e.target.value) || 5)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              {currentBagDef.hasBottomGusset ? (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Fond / Soufflet (底 cm)</span>
                  <input
                    type="number"
                    min="2"
                    max="25"
                    step="0.5"
                    value={dimensions.bottomCm}
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 2;
                      handleDimChange('bottomCm', val);
                      handleDimChange('sideGussetCm', val);
                    }}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              ) : currentBagDef.hasSideGusset ? (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Soufflet Côté (风琴 cm)</span>
                  <input
                    type="number"
                    min="2"
                    max="25"
                    step="0.5"
                    value={dimensions.sideGussetCm || 4}
                    onChange={e => handleDimChange('sideGussetCm', parseFloat(e.target.value) || 2)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Soufflet</span>
                  <div className="w-full bg-[#080d18]/50 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-500">
                    Sans (Plat 2D)
                  </div>
                </div>
              )}
            </div>

            {/* Quantité totale + Nombre de modèles / designs (款数 gg_ks) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-8">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Quantité totale (总数量) :</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="100"
                      max="500000"
                      step="100"
                      value={dimensions.quantity}
                      onChange={e => handleDimChange('quantity', Math.max(100, parseInt(e.target.value) || 100))}
                      className="w-24 bg-[#080d18] border border-cyan-500/40 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 text-right outline-none"
                    />
                    <span className="text-[10px] text-slate-400">pcs</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={printTechnology === 'gravure' ? 5000 : 100}
                  max={printTechnology === 'gravure' ? 100000 : 15000}
                  step={printTechnology === 'gravure' ? 2500 : 100}
                  value={dimensions.quantity}
                  onChange={e => handleDimChange('quantity', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="sm:col-span-4">
                <span className="text-[10px] text-slate-400 block mb-1">Nb Designs / Parfums (款数)</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={dimensions.skuCount || 1}
                    onChange={e => handleDimChange('skuCount', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1 text-sm text-amber-300 font-mono outline-none focus:border-amber-400"
                  />
                </div>
                {(dimensions.skuCount || 1) > 1 && (
                  <span className="text-[9px] text-amber-400/90 block mt-0.5">
                    Soit {Math.round(dimensions.quantity / (dimensions.skuCount || 1))} pcs / design
                  </span>
                )}
              </div>
            </div>

            {/* Type de Fermeture Zip (拉链类型 dxcs) & Type de Découpe (双切 vs 模切) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Type de Fermeture Zip (拉链类型) :</label>
                <select
                  value={dimensions.zipperInstId || currentBagDef.zipperOptions[0].instId}
                  onChange={e => handleZipSelect(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-cyan-200 outline-none focus:border-cyan-400"
                >
                  {currentBagDef.zipperOptions.map(z => (
                    <option key={z.instId} value={z.instId}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-rose-400" />
                  <span>Type de Découpe (切袋方式) :</span>
                </label>
                <select
                  value={dimensions.cuttingType || 'double_cut'}
                  onChange={e => handleDimChange('cuttingType', e.target.value as CuttingType)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-rose-200 outline-none focus:border-rose-400"
                >
                  <option value="double_cut">Coupe Droite Classique (双切 - 0 ¥ moule)</option>
                  <option value="die_cut">Découpe Forme Spéciale / Die-Cut (模切/异形袋 +450 ¥)</option>
                </select>
              </div>
            </div>

            {/* Mode de Construction du Fond (底部方式 kg_dbfs 1 à 5) */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Mode de Construction du Fond & Bobines (底部方式 / 放料) :
              </label>
              <select
                value={dimensions.bottomMode || currentBagDef.defaultBottomMode}
                onChange={e => handleDimChange('bottomMode', parseInt(e.target.value) as BottomMode)}
                className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
              >
                {BOTTOM_MODES_CATALOG.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.labelFr}
                  </option>
                ))}
              </select>
            </div>

            {/* SÉLECTEUR DE STRUCTURE FILMS & BARRIÈRE (25 Presets + Constructeur 5 Couches) */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Structure Matériaux (Jusqu'à 5 Couches) :</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomStructure(!isCustomStructure);
                    setCustomLayers(prev => ({ ...prev, isSingleLayer: false }));
                  }}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                    isCustomStructure
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  <Settings2 className="w-3 h-3" />
                  <span>{isCustomStructure ? 'Revenir aux 25 Structures' : 'Composer 1 à 5 Couches'}</span>
                </button>
              </div>

              {!isCustomStructure ? (
                <div className="space-y-1.5">
                  <select
                    value={dimensions.materialPreset}
                    onChange={e => {
                      setCustomLayers(prev => ({ ...prev, isSingleLayer: false }));
                      handleDimChange('materialPreset', e.target.value);
                    }}
                    className="w-full bg-[#080d18] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium outline-none focus:border-cyan-400"
                  >
                    {Object.entries(structureCategories).map(([category, items]) => (
                      <optgroup key={category} label={`━━━ ${category.toUpperCase()} ━━━`}>
                        {items.map(item => (
                          <option key={item.key} value={item.key}>
                            {item.name} — {item.silk}丝 ({Math.round(item.silk * 10)}µm) {item.badge ? `[${item.badge}]` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Structure active : <strong className="text-cyan-300">{quote.imposition.layersSummaryZh}</strong></span>
                    <span>Lamination : <strong className="text-purple-300">{quote.imposition.laminationPasses} passe(s) ({quote.imposition.activeLayersCount} couches)</strong></span>
                  </div>
                </div>
              ) : (
                /* Constructeur Sur-Mesure 1 à 5 Couches (ysc01, zgc01, zgc02, zgc03, rfc01) */
                <div className="p-3 bg-slate-900/95 rounded-xl border border-cyan-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300 pb-1 border-b border-slate-800">
                    <span className="font-bold">Constructeur Usine 5 Couches (`clk` 50 films)</span>
                    <span className="font-mono">{quote.imposition.actualThicknessSilk}丝 ({quote.imposition.actualThicknessMicrons}µm) • {quote.imposition.laminationPasses} passe(s)</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Couche 1 — Impression Extérieure (`印刷层 ysc01`) :</span>
                    <select
                      value={customLayers.printLayerId}
                      onChange={e => setCustomLayers(prev => ({ ...prev, printLayerId: e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-cyan-300 outline-none"
                    >
                      {PRINT_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.nameFr} ({m.pricePerKgCny} ¥/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Couche 2 — Barrière 1 (`阻隔层1 zgc01`) :</span>
                    <select
                      value={customLayers.barrierLayerId || 'none'}
                      onChange={e => setCustomLayers(prev => ({ ...prev, barrierLayerId: e.target.value === 'none' ? null : e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-indigo-300 outline-none"
                    >
                      <option value="none">Aucune (Structure 2 couches)</option>
                      {BARRIER_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.nameFr} ({m.pricePerKgCny} ¥/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Couche 3 — Barrière 2 Optionnelle (`阻隔层2 zgc02` - 4 couches) :</span>
                    <select
                      value={customLayers.barrierLayer2Id || 'none'}
                      onChange={e => setCustomLayers(prev => ({ ...prev, barrierLayer2Id: e.target.value === 'none' ? null : e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-purple-300 outline-none"
                    >
                      <option value="none">Aucune</option>
                      {BARRIER_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.nameFr} ({m.pricePerKgCny} ¥/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Couche 4 — Barrière 3 Optionnelle (`阻隔层3 zgc03` - 5 couches) :</span>
                    <select
                      value={customLayers.barrierLayer3Id || 'none'}
                      onChange={e => setCustomLayers(prev => ({ ...prev, barrierLayer3Id: e.target.value === 'none' ? null : e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-pink-300 outline-none"
                    >
                      <option value="none">Aucune</option>
                      {BARRIER_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.nameFr} ({m.pricePerKgCny} ¥/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Couche 5 — Scellage Thermique Intérieur (`热封层 rfc01`) :</span>
                    <select
                      value={customLayers.sealLayerId || 'none'}
                      onChange={e => setCustomLayers(prev => ({
                        ...prev,
                        sealLayerId: e.target.value === 'none' ? null : e.target.value,
                        isSingleLayer: e.target.value === 'none'
                      }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-emerald-300 outline-none"
                    >
                      <option value="none">Aucune (Sac Monocouche sans contrecollage)</option>
                      {SEAL_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.nameFr} ({m.pricePerKgCny} ¥/kg)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* MODE D'IMPRESSION (Numérique ys01 vs Héliogravure 0-10 couleurs) */}
            <div className="pt-2 border-t border-slate-800/80">
              {printTechnology === 'digital' ? (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mode d'Impression Numérique (`印刷方式 ys01`) :</span>
                  </label>
                  <select
                    value={dimensions.digitalPrintMode || 'cmyk_white'}
                    onChange={e => handleDimChange('digitalPrintMode', e.target.value as DigitalPrintMode)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-cyan-200 outline-none focus:border-cyan-400"
                  >
                    <option value="cmyk_white">CMJN + Blanc Standard (CMYK单白 : 2.70 ¥/tour, min 100 ¥)</option>
                    <option value="cmyk_white_inside">CMJN + Blanc + Impression Interne Recto/Verso (CMYK单白+里印 : 5.35 ¥/tour)</option>
                    <option value="none">Sans Impression / Sachet Neutre (不印刷 : 0 ¥)</option>
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Couleurs & Cylindres Hélio (`凹版印刷`) :</span>
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {dimensions.cylinderCount ?? 6} coul. ({(dimensions.cylinderCount ?? 6) * 400} ¥ clichés)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={dimensions.cylinderCount ?? 6}
                    onChange={e => handleDimChange('cylinderCount', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Calage : {(dimensions.cylinderCount ?? 6) * 200} ¥ + Encre au m²</span>
                    <label className="flex items-center gap-1.5 text-indigo-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={finishesState.fullInkCoverage}
                        onChange={() => toggleFinish('fullInkCoverage')}
                        className="accent-indigo-400"
                      />
                      <span>Plein encrage (`满版印刷`)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===================== BLOC 2 : FINITIONS & ACCESSOIRES EN IMAGES ===================== */}
          <div className={`${mobileTab === 'config' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>3. Finitions & Accessoires en Images (`gxcb`)</span>
              </span>
              <span className="text-[10px] text-slate-400">Combinables en temps réel</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* 1. Vernis Mat Global */}
              <div
                onClick={() => toggleFinish('matteVarnish')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.matteVarnish
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><MatteVarnishIcon active={finishesState.matteVarnish} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Vernis Mat (满版哑油)</span>
                    {finishesState.matteVarnish && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.40 ¥/tour (min 100¥)</span>
                </div>
              </div>

              {/* 2. Vernis Sélectif UV */}
              <div
                onClick={() => toggleFinish('spotUv')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.spotUv
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><SpotUvIcon active={finishesState.spotUv} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Vernis Sélectif (UV)</span>
                    {finishesState.spotUv && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+1.00 ¥/tour (min 400¥)</span>
                </div>
              </div>

              {/* 3. Vernis Sélectif Épais 3D (厚UV) */}
              <div
                onClick={() => toggleFinish('thickUv')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.thickUv
                    ? 'bg-pink-500/20 border-pink-400 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.25)] ring-1 ring-pink-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><ThickUv3DIcon active={finishesState.thickUv} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Vernis 3D Épais (厚UV)</span>
                    {finishesState.thickUv && <Check className="w-3.5 h-3.5 text-pink-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+1.70 ¥/tour (min 500¥)</span>
                </div>
              </div>

              {/* 4. Dorure à Chaud (烫金) */}
              <div
                onClick={() => toggleFinish('hotStamping')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.hotStamping
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><HotFoilIcon active={finishesState.hotStamping} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Dorure à Chaud (烫金)</span>
                    {finishesState.hotStamping && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {(finishesState.spotUv || finishesState.thickUv) && finishesState.hotStamping
                      ? 'Combiné UV+Or (1.80¥)'
                      : '+1.60 ¥/tour (min 400¥)'}
                  </span>
                </div>
              </div>

              {/* 5. Valve de Dégazage Café */}
              <div
                onClick={() => toggleFinish('degassingValve')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.degassingValve
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><DegassingValveIcon active={finishesState.degassingValve} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Valve Café (透气阀)</span>
                    {finishesState.degassingValve && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.22 ¥/pc (+0.6g)</span>
                </div>
              </div>

              {/* 6. Poignée / Trou de Suspension */}
              <div
                onClick={() => toggleFinish('hangingHole')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.hangingHole
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><HangingHoleIcon active={finishesState.hangingHole} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Poignée / Euro-Hole</span>
                    {finishesState.hangingHole && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.105 ¥/pc (+7.6g)</span>
                </div>
              </div>

              {/* 7. Bouchon / Bec Verseur (10mm / 16mm) */}
              <div
                onClick={() => toggleFinish('spout')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.spout !== 'none'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.25)] ring-1 ring-orange-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><SpoutFitmentIcon active={finishesState.spout !== 'none'} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">
                      {finishesState.spout === 'spout_16mm' ? 'Bouchon 16mm' : finishesState.spout === 'spout_10mm' ? 'Bouchon 10mm' : 'Bouchon / Bec'}
                    </span>
                    {finishesState.spout !== 'none' && <Check className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {finishesState.spout === 'spout_16mm' ? '+0.22 ¥/pc (6.1g)' : '+0.195 ¥/pc (10/16mm)'}
                  </span>
                </div>
              </div>

              {/* 8. Découpe Forme Spéciale / Die-Cut (模切 / 异形袋) */}
              <div
                onClick={() => handleDimChange('cuttingType', dimensions.cuttingType === 'die_cut' ? 'double_cut' : 'die_cut')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.cuttingType === 'die_cut'
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0"><DieCutShapeIcon active={dimensions.cuttingType === 'die_cut'} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Forme Spéciale (模切)</span>
                    {dimensions.cuttingType === 'die_cut' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+450 ¥ moule +0.01¥/pc</span>
                </div>
              </div>
            </div>

            {/* Sélecteur rapide diamètre bouchon si actif + Options Hélio (Fenêtre, Gaufrage, Adhésif) */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={finishesState.hasWindow}
                  onChange={() => toggleFinish('hasWindow')}
                  className="accent-cyan-400"
                />
                <span>Fenêtre (`开窗`)</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={finishesState.hasEmbossing}
                  onChange={() => toggleFinish('hasEmbossing')}
                  className="accent-cyan-400"
                />
                <span>Gaufrage (`压纹`)</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={finishesState.hasAdhesiveStrip}
                  onChange={() => toggleFinish('hasAdhesiveStrip')}
                  className="accent-cyan-400"
                />
                <span>Bande adhésive (`自粘`)</span>
              </label>
            </div>
          </div>

          {/* ===================== BLOC 3 : URGENCE, DÉLAI, FACTURE TVA & LOGISTIQUE (suanfa.js) ===================== */}
          <div className={`${mobileTab === 'finishes' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>4. Délai, Facturation TVA & Frais de Port</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Départ : {quote.imposition.estimatedShipDate} ({quote.imposition.leadTimeDays}j)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Urgence Commande (`是否加急`) :</label>
                <select
                  value={dimensions.orderUrgency || 'normal'}
                  onChange={e => handleDimChange('orderUrgency', e.target.value as OrderUrgency)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-400"
                >
                  <option value="normal">Standard (`常规订单` : 7-10j, 0 ¥)</option>
                  <option value="urgent">Express Urgent (`加急订单` : 4-7j, +800 ¥)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Facturation & TVA (`发票类型`) :</label>
                <select
                  value={dimensions.invoiceType || 'no_invoice'}
                  onChange={e => handleDimChange('invoiceType', e.target.value as InvoiceType)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-400"
                >
                  <option value="no_invoice">Hors Taxe / Sans facture (`不开票` 0%)</option>
                  <option value="vat_invoice">Facture Spéciale TVA (`专用发票` +8%)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Frais de Port (`运费` — {quote.weightTotalKg} kg) :</label>
                <select
                  value={dimensions.shippingMode || 'none'}
                  onChange={e => handleDimChange('shippingMode', e.target.value as ShippingMode)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-400"
                >
                  <option value="none">Départ Usine EXW / Franco (0 ¥)</option>
                  <option value="china_domestic">Logistique Chine (12¥ + 1¥/kg = {12 + Math.max(0, quote.weightTotalKg - 1)} ¥)</option>
                  <option value="custom">Forfait Port Personnalisé (¥)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  {dimensions.shippingMode === 'custom' ? 'Montant Port (¥ CNY) :' : 'Autres Frais Manuels (`其他费用 qt00` ¥) :'}
                </label>
                {dimensions.shippingMode === 'custom' ? (
                  <input
                    type="number"
                    min="0"
                    value={dimensions.customShippingCny || 0}
                    onChange={e => handleDimChange('customShippingCny', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono outline-none"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={dimensions.extraFeeCny || 0}
                    onChange={e => handleDimChange('extraFeeCny', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono outline-none"
                  />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ===================== COLONNE DROITE : PILOTAGE MARGES, DÉTAIL USINE, DEVIS & GRAPHIQUES ===================== */}
        <div className={`lg:col-span-7 space-y-4 ${
          mobileTab === 'pricing' || mobileTab === 'charts' ? 'block' : 'hidden sm:block'
        }`}>

          {/* MODULE DE PILOTAGE DE VOS TARIFS & MARGES REVENTE */}
          <div className={`${mobileTab === 'charts' ? 'hidden sm:block' : 'block'} bg-gradient-to-br from-[#101b33] via-[#0d1628] to-[#0a101d] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-xl`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/20 mb-3">
              <span className="text-xs font-bold text-cyan-200 tracking-wide uppercase flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>PILOTAGE DE VOS TARIFS DE REVENTE & MARGES</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                1 € = {(1 / CNY_TO_EUR_RATE).toFixed(2)} ¥
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'percentage')}
                className={`py-1.5 px-2 rounded-xl border text-center transition cursor-pointer ${
                  dimensions.resalePricingMode === 'percentage'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                % Marge Brute
              </button>
              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'multiplier')}
                className={`py-1.5 px-2 rounded-xl border text-center transition cursor-pointer ${
                  dimensions.resalePricingMode === 'multiplier'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Multiplicateur (x)
              </button>
              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'fixed_price')}
                className={`py-1.5 px-2 rounded-xl border text-center transition cursor-pointer ${
                  dimensions.resalePricingMode === 'fixed_price'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Prix Fixe / pc
              </button>
            </div>

            {dimensions.resalePricingMode === 'percentage' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Votre Taux de Marge Brute sur Prix de Vente :</span>
                  <span className="text-base font-bold font-mono text-cyan-300">{dimensions.resaleMarginPercent}% (Coef x{(1 / (1 - (dimensions.resaleMarginPercent || 45) / 100)).toFixed(2)})</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="1"
                  value={dimensions.resaleMarginPercent || 45}
                  onChange={e => handleDimChange('resaleMarginPercent', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}

            {dimensions.resalePricingMode === 'multiplier' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Multiplicateur du Coût Usine :</span>
                  <span className="text-base font-bold font-mono text-cyan-300">x{dimensions.resaleMultiplier}</span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="5.0"
                  step="0.05"
                  value={dimensions.resaleMultiplier || 1.85}
                  onChange={e => handleDimChange('resaleMultiplier', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}

            {dimensions.resalePricingMode === 'fixed_price' && (
              <div>
                <label className="text-xs text-slate-300 block mb-1">Votre Prix Unitaire Cible (€ HT / pièce) :</label>
                <input
                  type="number"
                  min="0.02"
                  max="10.0"
                  step="0.01"
                  value={dimensions.resaleFixedUnitPriceEur || 0.35}
                  onChange={e => handleDimChange('resaleFixedUnitPriceEur', parseFloat(e.target.value) || 0.05)}
                  className="w-full bg-[#080d18] border border-cyan-500/40 rounded-xl px-3 py-1.5 text-base text-cyan-300 font-mono outline-none"
                />
              </div>
            )}

            {/* 4 CARTES PRINCIPALES DE RÉSULTATS FINANCIERS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-cyan-500/20">
              <div className="bg-[#080d1a] border border-emerald-500/30 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Votre Prix Vente</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {formatMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 0)}
                </span>
                <span className="text-[10px] text-emerald-300/80 block font-mono">
                  {formatMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)} / pc
                </span>
              </div>

              <div className="bg-[#080d1a] border border-amber-500/30 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Votre Marge Nette</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-300">
                  +{formatMoney(quote.grossProfitTotalEur, quote.grossProfitTotalCny, 0)}
                </span>
                <span className="text-[10px] text-amber-400 block font-bold">
                  {quote.grossMarginPercent}% (+{quote.markupPercent}% markup)
                </span>
              </div>

              <div className="bg-[#080d1a] border border-indigo-500/30 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Catalogue Usine (`bj03`)</span>
                <span className="text-base sm:text-lg font-bold font-mono text-indigo-300">
                  {formatMoney(quote.beijincaiCatalogTotalEur, quote.beijincaiCatalogTotalCny, 0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {formatMoney(quote.beijincaiCatalogUnitEur, quote.beijincaiCatalogUnitCny, 3)} / pc (x{quote.imposition.factoryTierMultiplier})
                </span>
              </div>

              <div className="bg-[#080d1a] border border-rose-500/30 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Coût Pur Atelier (`js_zcb`)</span>
                <span className="text-base sm:text-lg font-bold font-mono text-rose-400">
                  {formatMoney(quote.factoryCostTotalEur, quote.factoryCostTotalCny, 0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {formatMoney(quote.factoryCostUnitEur, quote.factoryCostUnitCny, 3)} / pc
                </span>
              </div>
            </div>
          </div>

          {/* DÉTAIL COMPLET DES COÛTS USINE & IMPOSITION MACHINE */}
          {showAdminDetails && (
            <div className={`${mobileTab === 'charts' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3`}>
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800/80 gap-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-cyan-400" />
                  <span>Décomposition Exacte Usine Miaobaojia (`suanfa.js`)</span>
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {quote.imposition.totalRotations} tours (`gg_lzs`)
                  </span>
                  <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {quote.weightUnitGrams}g/pc • {quote.weightTotalKg} kg
                  </span>
                </div>
              </div>

              {/* Grille complète de tous les postes de coûts suanfa.js */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">1. Films Matières (`js_cl`)</span>
                  <span className="font-mono font-bold text-cyan-300">{quote.materialCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">{quote.imposition.linearMeters}m ({quote.imposition.activeLayersCount} couches)</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">2. Impression & UV (`js_ys`)</span>
                  <span className="font-mono font-bold text-blue-300">{quote.printCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">{quote.imposition.webPoses}×{quote.imposition.cylinderPoses} poses/tour</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">3. Lamination (`js_fh`)</span>
                  <span className="font-mono font-bold text-purple-300">{quote.laminationCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">{quote.imposition.laminationPasses} passe(s) de colle</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">4. Façonnage & Zip (`js_zd`)</span>
                  <span className="font-mono font-bold text-pink-300">{quote.bagMakingCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">{quote.imposition.unwindingMode}</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">5. Accessoires & Cartons (`js_qt`)</span>
                  <span className="font-mono font-bold text-amber-300">{quote.accessoriesCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">Dont carton 0.7¥/kg</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">6. Moule / Clichés (`mjf/版费`)</span>
                  <span className="font-mono font-bold text-rose-400">
                    {(quote.dieCutPlateCostCny + quote.cylindersCostCny).toFixed(0)} ¥
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {quote.dieCutPlateCostCny > 0 ? `Moule 463.5¥ ` : ''}
                    {quote.cylindersCostCny > 0 ? `Cyl. ${quote.cylindersCostCny}¥` : '0 ¥ cliché'}
                  </span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">7. Urgence & Port (`jjf/yf`)</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {(quote.rushFeeCny + quote.shippingCostCny + quote.extraFeeCny).toFixed(0)} ¥
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    Urg: {quote.rushFeeCny}¥ | Port: {quote.shippingCostCny}¥
                  </span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">8. Fiscalité TVA & Plancher</span>
                  <span className="font-mono font-bold text-indigo-300">{quote.taxCostCny} ¥</span>
                  <span className="text-[9px] text-slate-500 block">
                    Profit min usine: +{quote.imposition.factoryMinProfitCny}¥
                  </span>
                </div>
              </div>

              {/* FICHE DEVIS COPIABLE EN 1 CLIC (spec FR & ZH) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fiche Devis Automatique (`报价单 spec`) :</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyQuote('FR')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-bold text-cyan-200 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLang === 'FR' ? 'Devis FR Copié !' : 'Copier Devis Client (FR)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyQuote('ZH')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-bold text-indigo-200 hover:bg-indigo-500/30 flex items-center gap-1 cursor-pointer"
                    >
                      <PackageCheck className="w-3 h-3" />
                      <span>{copiedLang === 'ZH' ? 'Fiche Usine ZH Copiée !' : 'Copier Fiche Usine (ZH)'}</span>
                    </button>
                  </div>
                </div>
                <pre className="bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {quote.imposition.quoteSpecFr}
                </pre>
              </div>
            </div>
          )}

          {/* GRAPHIQUES DE DÉGRESSIVITÉ PAR VOLUME */}
          <div className={`${mobileTab === 'pricing' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Simulation de Dégressivité par Volume (Vente vs Catalogue Usine vs Coût Pur)</span>
              </span>
              <span className="text-[10px] text-slate-400">Prix unitaire en €</span>
            </div>

            <div className="h-52 sm:h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}€`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${Number(val).toFixed(3)} € / pc`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="salePriceEur" name="Votre Prix Vente / pc" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="catalogPriceEur" name="Prix Catalogue Usine / pc" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="factoryCostEur" name="Coût Pur Atelier / pc" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

      {/* ===================== BARRE FLOTTANTE MOBILE DE PRIX ===================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#090f1d]/95 backdrop-blur border-t border-slate-800 px-4 py-2.5 flex items-center justify-between z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.5)]">
        <div>
          <span className="text-[9px] text-slate-400 block uppercase">Total Revente ({dimensions.quantity} pcs)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-mono text-emerald-400">
              {formatMoney(quote.resalePriceTotalEur, quote.resalePriceTotalCny, 0)}
            </span>
            <span className="text-xs font-mono text-cyan-300">
              ({formatMoney(quote.resalePriceUnitEur, quote.resalePriceUnitCny, 3)}/pc)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 block uppercase">Votre Marge Brute</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            +{formatMoney(quote.grossProfitTotalEur, quote.grossProfitTotalCny, 0)} ({quote.grossMarginPercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
