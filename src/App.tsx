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
  ChevronRight,
  Settings2
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
  BagDimensions,
  BagTypeKey,
  PrintTechnology
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
  HotFoilIcon,
  DegassingValveIcon,
  HangingHoleIcon,
  SpoutFitmentIcon,
  ZipLockIcon
} from './components/VisualFinishes';

export default function App() {
  const [printTechnology, setPrintTechnology] = useState<PrintTechnology>('digital');
  const [gravureTab, setGravureTab] = useState<'composite' | 'single' | 'tools'>('composite');
  const [mobileTab, setMobileTab] = useState<'config' | 'finishes' | 'pricing' | 'charts'>('config');

  // Identifiant unique du modèle actif pour un clic 100% fiable et immédiat
  const [selectedModelId, setSelectedModelId] = useState<string>('dig_stand_up');

  // Mode structure sur-mesure (couche par couche)
  const [isCustomStructure, setIsCustomStructure] = useState<boolean>(false);
  const [customLayers, setCustomLayers] = useState({
    printLayerId: PRINT_LAYERS[0].id,
    barrierLayerId: BARRIER_LAYERS[0].id as string | null,
    sealLayerId: SEAL_LAYERS[0].id
  });

  // États indépendants des finitions pour pouvoir les combiner sans conflit
  const [finishesState, setFinishesState] = useState({
    matteVarnish: false,
    spotUv: false,
    hotStamping: false,
    degassingValve: false,
    hangingHole: false,
    spout: 'none' as 'none' | 'spout_10mm' | 'spout_16mm'
  });

  const [dimensions, setDimensions] = useState<BagDimensions>({
    technology: 'digital',
    bagType: 'stand_up',
    widthCm: 15,
    heightCm: 25,
    bottomCm: 6,
    sideGussetCm: 4,
    quantity: 1000,
    hasZip: true,
    materialPreset: 'mylar_standard',
    cylinderCount: 6,
    resalePricingMode: 'percentage',
    resaleMarginPercent: 45,
    resaleMultiplier: 1.85,
    resaleFixedUnitPriceEur: 0.35,
    finishes: {
      uvEnhancement: 'none',
      hasMatteVarnish: false,
      spoutSize: 'none',
      hasDegassingValve: false,
      hasHangingHole: false
    }
  });

  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'CNY'>('EUR');
  const [showAdminDetails, setShowAdminDetails] = useState(true);

  // Regroupement par catégories pour le sélecteur de structure
  const structureCategories = useMemo(() => {
    const cats: Record<string, { key: string; name: string; badge?: string }[]> = {};
    Object.entries(MATERIAL_PRESETS).forEach(([key, preset]) => {
      const cat = preset.category || 'Autres Complexes';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push({ key, name: preset.name, badge: preset.badge });
    });
    return cats;
  }, []);

  // Résolution propre de la finition UV / Dorure combinée
  const computedUvEnhancement = useMemo((): 'none' | 'matte_varnish' | 'spot_uv' | 'thick_uv' | 'hot_stamping' | 'uv_and_hot_stamping' => {
    if (finishesState.spotUv && finishesState.hotStamping) return 'uv_and_hot_stamping';
    if (finishesState.spotUv) return 'spot_uv';
    if (finishesState.hotStamping) return 'hot_stamping';
    if (finishesState.matteVarnish) return 'matte_varnish';
    return 'none';
  }, [finishesState.spotUv, finishesState.hotStamping, finishesState.matteVarnish]);

  // Synchronisation des dimensions avec les couches et finitions
  const activeDimensions = useMemo(() => {
    return {
      ...dimensions,
      technology: printTechnology,
      customLayers: isCustomStructure ? customLayers : undefined,
      finishes: {
        uvEnhancement: computedUvEnhancement,
        hasMatteVarnish: finishesState.matteVarnish,
        spoutSize: finishesState.spout,
        hasDegassingValve: finishesState.degassingValve,
        hasHangingHole: finishesState.hangingHole
      }
    };
  }, [dimensions, printTechnology, isCustomStructure, customLayers, computedUvEnhancement, finishesState]);

  const currentBagDef = useMemo(() => {
    return BAG_TYPES_CATALOG.find(b => b.key === dimensions.bagType) || BAG_TYPES_CATALOG[0];
  }, [dimensions.bagType]);

  // Gestionnaire de clic unifié et infaillible pour la sélection d'un sac
  const handleBagSelection = (config: {
    id: string;
    tech: PrintTechnology;
    bagType: BagTypeKey;
    hasZip: boolean;
    materialPreset?: string;
  }) => {
    setSelectedModelId(config.id);
    setPrintTechnology(config.tech);
    const bagDef = BAG_TYPES_CATALOG.find(b => b.key === config.bagType) || BAG_TYPES_CATALOG[0];

    setDimensions(prev => ({
      ...prev,
      technology: config.tech,
      bagType: config.bagType,
      hasZip: config.hasZip,
      quantity: config.tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity),
      materialPreset: config.materialPreset || prev.materialPreset,
      zipperInstId: bagDef.zipperOptions.find(z => config.hasZip ? !z.label.includes('Sans') : z.label.includes('Sans'))?.instId || bagDef.zipperOptions[0].instId
    }));
  };

  // Bascule rapide entre Numérique et Gravure
  const handleTechnologyChange = (tech: PrintTechnology) => {
    setPrintTechnology(tech);
    setDimensions(prev => ({
      ...prev,
      technology: tech,
      quantity: tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity)
    }));
    if (tech === 'digital' && selectedModelId.startsWith('grv_')) {
      setSelectedModelId('dig_' + selectedModelId.replace('grv_', ''));
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
      factoryCostEur: r.factoryCostUnitEur,
      grossProfitEur: r.grossProfitUnitEur,
      marginPct: r.grossMarginPercent
    }));
  }, [activeDimensions, printTechnology]);

  const handleDimChange = (field: keyof BagDimensions, value: any) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const toggleFinish = (key: keyof typeof finishesState) => {
    if (key === 'spout') {
      setFinishesState(prev => ({
        ...prev,
        spout: prev.spout === 'none' ? 'spout_10mm' : 'none'
      }));
    } else {
      setFinishesState(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
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
                ANTIGRAVITY MYLAR
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Chiffrage usine direct & sélection visuelle de sacs</p>
          </div>
        </div>

        {/* Currency & Secret Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveCurrency('EUR')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${activeCurrency === 'EUR' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              €
            </button>
            <button
              type="button"
              onClick={() => setActiveCurrency('CNY')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${activeCurrency === 'CNY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              ¥
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdminDetails(!showAdminDetails)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:border-slate-700 cursor-pointer"
          >
            {showAdminDetails ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{showAdminDetails ? 'Masquer Usine' : 'Voir Usine'}</span>
          </button>
        </div>
      </header>

      {/* ===================== SECTION 1 : PANNEAUX USINE ORIGINAUX (IMAGE 1) ===================== */}
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
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span className={printTechnology === 'digital' ? 'text-cyan-300' : 'text-slate-300'}>
                      Outil de tarification numérique
                    </span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  250 à 10 000 pcs (0 € cliché)
                </span>
              </div>

              {/* Boutons sacs numériques avec icônes de l'image 1 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* 1. Sac 3 soudures */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_three_side', tech: 'digital', bagType: 'three_side', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_three_side'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <ThreeSideBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">sac à trois soud...</span>
                </button>

                {/* 2. Sac debout */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_stand_up', tech: 'digital', bagType: 'stand_up', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_stand_up'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <StandUpBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Sac debout</span>
                </button>

                {/* 3. Sachet à fermeture éclair */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_zipper', tech: 'digital', bagType: 'stand_up', hasZip: true })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_zipper'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <ZipperPouchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Sachet à fermet...</span>
                </button>

                {/* 4. Sac accordéon */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_gusset', tech: 'digital', bagType: 'gusset', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_gusset'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <GussetBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Sac accordéon</span>
                </button>

                {/* 5. Sac octogonal */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_flat_bottom', tech: 'digital', bagType: 'flat_bottom', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_flat_bottom'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <FlatBottomBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">sac octogonal s...</span>
                </button>

                {/* 6. Sac scellé sur quatre côtés */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_four_side', tech: 'digital', bagType: 'four_side', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_four_side'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <FourSideBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Sac scellé sur q...</span>
                </button>

                {/* 7. Sac scellé sur le dos / côtés */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_center_seal', tech: 'digital', bagType: 'center_seal', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_center_seal'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <CenterSealBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Sac scellé sur l...</span>
                </button>

                {/* 8. Film en rouleau */}
                <button
                  type="button"
                  onClick={() => handleBagSelection({ id: 'dig_roll_film', tech: 'digital', bagType: 'roll_film', hasZip: false })}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    selectedModelId === 'dig_roll_film'
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-cyan-400 shrink-0">
                    <RollFilmIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
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
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span className={printTechnology === 'gravure' ? 'text-indigo-300' : 'text-slate-300'}>
                      Outil de tarification de gravure
                    </span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  10 000 pcs min • Cylindres cuivre
                </span>
              </div>

              {/* Sous-onglets interactifs de gravure */}
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
                  Sacs composites
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
                  Sac à une seule couche
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
                  Outils de calcul
                </button>
              </div>

              {/* CONTENU ONGLET 1 : SACS COMPOSITES */}
              {gravureTab === 'composite' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {/* 1. Sac 3 soudures */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_three_side', tech: 'gravure', bagType: 'three_side', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_three_side'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <ThreeSideBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">sac à trois soudures</span>
                  </button>

                  {/* 2. Sac debout */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_stand_up', tech: 'gravure', bagType: 'stand_up', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_stand_up'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <StandUpBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Sac debout</span>
                  </button>

                  {/* 3. Sac octogonal */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_flat_bottom', tech: 'gravure', bagType: 'flat_bottom', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_flat_bottom'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <FlatBottomBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">sac octogonal scellé</span>
                  </button>

                  {/* 4. Sachet à fermeture éclair */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_zipper', tech: 'gravure', bagType: 'stand_up', hasZip: true })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_zipper'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <ZipperPouchIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Sachet à fermetur...</span>
                  </button>

                  {/* 5. Sac accordéon */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_gusset', tech: 'gravure', bagType: 'gusset', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_gusset'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <GussetBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Sac accordéon</span>
                  </button>

                  {/* 6. Sac scellé sur le dos / côtés */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_center_seal', tech: 'gravure', bagType: 'center_seal', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_center_seal'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <CenterSealBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Sac scellé sur les ...</span>
                  </button>

                  {/* 7. Sac scellé sur quatre côtés */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_four_side', tech: 'gravure', bagType: 'four_side', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_four_side'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <FourSideBagIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Sac scellé sur qu...</span>
                  </button>

                  {/* 8. Film en rouleau auto */}
                  <button
                    type="button"
                    onClick={() => handleBagSelection({ id: 'grv_roll_film', tech: 'gravure', bagType: 'roll_film', hasZip: false })}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                      selectedModelId === 'grv_roll_film'
                        ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-indigo-400 shrink-0">
                      <RollFilmIcon className="w-5 h-5" />
                    </div>
                    <span className="truncate text-[11px] font-medium">Film en rouleau (a...</span>
                  </button>
                </div>
              )}

              {/* CONTENU ONGLET 2 : SACS MONOCOUCHE (UNE SEULE COUCHE SANS CONTRECOLLAGE) */}
              {gravureTab === 'single' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleBagSelection({ id: 'grv_single_pe', tech: 'gravure', bagType: 'three_side', hasZip: false, materialPreset: 'transparent_eco' })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_pe'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-md'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <span className="block font-medium text-[11px] truncate">Sachet PE Transparent</span>
                        <span className="text-[9px] text-slate-400">Monocouche sans alu</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({ id: 'grv_single_opp', tech: 'gravure', bagType: 'three_side', hasZip: false, materialPreset: 'transparent_eco' })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_opp'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-md'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <span className="block font-medium text-[11px] truncate">Sachet OPP Brillant</span>
                        <span className="text-[9px] text-slate-400">Confiserie / Textile</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({ id: 'grv_single_roll', tech: 'gravure', bagType: 'roll_film', hasZip: false, materialPreset: 'transparent_eco' })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_roll'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-md'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <RollFilmIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <span className="block font-medium text-[11px] truncate">Gaine / Rouleau PE</span>
                        <span className="text-[9px] text-slate-400">Film d'ensachage direct</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBagSelection({ id: 'grv_single_kraft', tech: 'gravure', bagType: 'three_side', hasZip: false, materialPreset: 'kraft_eco_2layers' })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                        selectedModelId === 'grv_single_kraft'
                          ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 ring-1 ring-indigo-400/60 shadow-md'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <ThreeSideBagIcon className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="block font-medium text-[11px] truncate">Sachet Kraft Simple</span>
                        <span className="text-[9px] text-slate-400">100% Recyclable / Bio</span>
                      </div>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    💡 <strong>Sacs monocouches</strong> : Films simples sans complexe d'aluminium ni contrecollage lourd, parfaits pour emballage sec, boulangerie ou protection industrielle économique.
                  </p>
                </div>
              )}

              {/* CONTENU ONGLET 3 : OUTILS DE CALCUL ATELIER */}
              {gravureTab === 'tools' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Ruler className="w-4 h-4 text-indigo-400" />
                      <span>Surface & Format Développé</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Surface/sac : <span className="text-cyan-300">{((dimensions.widthCm * dimensions.heightCm * 2) / 10000).toFixed(4)} m²</span></div>
                      <div>Total commande : <span className="text-cyan-300">{(((dimensions.widthCm * dimensions.heightCm * 2) / 10000) * dimensions.quantity).toFixed(1)} m²</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <span>Logistique & Poids Fret</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Poids unitaire : <span className="text-amber-300">{quote.weightUnitGrams.toFixed(2)} g</span></div>
                      <div>Poids commande : <span className="text-amber-300">{quote.weightTotalKg.toFixed(1)} kg</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Cylindres Gravure Cuivre</span>
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      <div>Clichés nécessaires : <span className="text-rose-300">{dimensions.cylinderCount || 6} cylindres</span></div>
                      <div>Coût cylindres : <span className="text-rose-300">{quote.cylindersCostCny.toFixed(0)} ¥</span></div>
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
          <span>Dimensions</span>
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
          <span>Marges</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('charts')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
            mobileTab === 'charts' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Graphiques</span>
        </button>
      </div>

      {/* ===================== CORPS PRINCIPAL DU DASHBOARD ===================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===================== COLONNE GAUCHE : CONFIGURATEUR DIMENSIONS & MATÉRIAUX ===================== */}
        <div className={`lg:col-span-5 space-y-4 ${
          mobileTab === 'config' || mobileTab === 'finishes' ? 'block' : 'hidden sm:block'
        }`}>

          {/* SECTION DIMENSIONS & MATÉRIAUX */}
          <div className={`${mobileTab === 'finishes' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Dimensions : {currentBagDef.nameFr}</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {dimensions.widthCm}×{dimensions.heightCm}{currentBagDef.hasBottomGusset ? `+${dimensions.bottomCm}` : ''} cm
              </span>
            </div>

            {/* Inputs Dimensions numériques */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Largeur (cm)</span>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="0.5"
                  value={dimensions.widthCm}
                  onChange={e => handleDimChange('widthCm', parseFloat(e.target.value) || 5)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Hauteur (cm)</span>
                <input
                  type="number"
                  min="8"
                  max="80"
                  step="0.5"
                  value={dimensions.heightCm}
                  onChange={e => handleDimChange('heightCm', parseFloat(e.target.value) || 8)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              {currentBagDef.hasBottomGusset ? (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Fond (cm)</span>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    step="0.5"
                    value={dimensions.bottomCm}
                    onChange={e => handleDimChange('bottomCm', parseFloat(e.target.value) || 2)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              ) : currentBagDef.hasSideGusset ? (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Soufflet Côté</span>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    step="0.5"
                    value={dimensions.sideGussetCm || 4}
                    onChange={e => handleDimChange('sideGussetCm', parseFloat(e.target.value) || 2)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Format</span>
                  <div className="w-full bg-[#080d18]/50 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-500">
                    Plat 2D
                  </div>
                </div>
              )}
            </div>

            {/* Slider Quantité */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300">Quantité commandée :</span>
                <span className="font-bold font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {dimensions.quantity.toLocaleString('fr-FR')} pcs
                </span>
              </div>
              <input
                type="range"
                min={printTechnology === 'gravure' ? 10000 : 250}
                max={printTechnology === 'gravure' ? 100000 : 10000}
                step={printTechnology === 'gravure' ? 2500 : 250}
                value={dimensions.quantity}
                onChange={e => handleDimChange('quantity', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* SÉLECTEUR DE STRUCTURE FILMS & BARRIÈRE */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Structure Films & Barrière :</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomStructure(!isCustomStructure)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                    isCustomStructure
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings2 className="w-3 h-3" />
                  <span>{isCustomStructure ? 'Mode Sur-Mesure Actif' : 'Personnaliser Couche par Couche'}</span>
                </button>
              </div>

              {!isCustomStructure ? (
                /* Liste complète de tous les 21 complexes groupés par familles */
                <select
                  value={dimensions.materialPreset}
                  onChange={e => handleDimChange('materialPreset', e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                >
                  {Object.entries(structureCategories).map(([category, items]) => (
                    <optgroup key={category} label={`━━━ ${category.toUpperCase()} ━━━`}>
                      {items.map(item => (
                        <option key={item.key} value={item.key}>
                          {item.name} {item.badge ? `[${item.badge}]` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                /* Mode Sur Mesure Couche par Couche avec les 50 matières usine */
                <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Couche 1 (Extérieure / Impression) :</span>
                    <select
                      value={customLayers.printLayerId}
                      onChange={e => setCustomLayers(prev => ({ ...prev, printLayerId: e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-cyan-300 outline-none"
                    >
                      {PRINT_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} - {m.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Couche 2 (Barrière Intermédiaire) :</span>
                    <select
                      value={customLayers.barrierLayerId || 'none'}
                      onChange={e => setCustomLayers(prev => ({ ...prev, barrierLayerId: e.target.value === 'none' ? null : e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-indigo-300 outline-none"
                    >
                      <option value="none">Sans couche barrière (Structure 2 couches)</option>
                      {BARRIER_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} - {m.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Couche 3 (Intérieure Thermosoudable PE/CPP) :</span>
                    <select
                      value={customLayers.sealLayerId}
                      onChange={e => setCustomLayers(prev => ({ ...prev, sealLayerId: e.target.value }))}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-lg p-1.5 text-xs text-emerald-300 outline-none"
                    >
                      {SEAL_LAYERS.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.code} - {m.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Si Gravure : Sélection du nombre de cylindres cuivre */}
            {printTechnology === 'gravure' && (
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-indigo-300 font-semibold">Cylindres d'impression cuivre :</span>
                  <span className="font-mono font-bold text-amber-300">
                    {dimensions.cylinderCount || 6} cylindres ({(dimensions.cylinderCount || 6) * 400} ¥)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={dimensions.cylinderCount || 6}
                  onChange={e => handleDimChange('cylinderCount', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  400 ¥ par couleur (cliché réutilisable pour vos réassorts sans surcoût).
                </span>
              </div>
            )}
          </div>

          {/* ===================== SECTION 2 : FINITIONS & ACCESSOIRES VISUELS (IMAGE 3) ===================== */}
          <div className={`${mobileTab === 'config' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Finitions & Accessoires en Images</span>
              </span>
              <span className="text-[10px] text-slate-400">Cliquez pour activer / combiner</span>
            </div>

            {/* Grille visuelle de toutes les finitions avec cartes interactives fiables */}
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
                <div className="shrink-0">
                  <MatteVarnishIcon active={finishesState.matteVarnish} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Vernis Mat Global</span>
                    {finishesState.matteVarnish && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.40 ¥/m²</span>
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
                <div className="shrink-0">
                  <SpotUvIcon active={finishesState.spotUv} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Vernis Sélectif UV</span>
                    {finishesState.spotUv && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+1.00 ¥/m²</span>
                </div>
              </div>

              {/* 3. Dorure à Chaud */}
              <div
                onClick={() => toggleFinish('hotStamping')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.hotStamping
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <HotFoilIcon active={finishesState.hotStamping} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Dorure à Chaud</span>
                    {finishesState.hotStamping && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+1.60 ¥/m²</span>
                </div>
              </div>

              {/* 4. Valve de Dégazage Café */}
              <div
                onClick={() => toggleFinish('degassingValve')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.degassingValve
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <DegassingValveIcon active={finishesState.degassingValve} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Valve Dégazage</span>
                    {finishesState.degassingValve && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.22 ¥/pc</span>
                </div>
              </div>

              {/* 5. Trou de Suspension */}
              <div
                onClick={() => toggleFinish('hangingHole')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.hangingHole
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <HangingHoleIcon active={finishesState.hangingHole} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Trou Suspension</span>
                    {finishesState.hangingHole && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.03 ¥/pc</span>
                </div>
              </div>

              {/* 6. Bouchon / Bec Verseur */}
              <div
                onClick={() => toggleFinish('spout')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  finishesState.spout !== 'none'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.25)] ring-1 ring-orange-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <SpoutFitmentIcon active={finishesState.spout !== 'none'} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Bouchon / Bec</span>
                    {finishesState.spout !== 'none' && <Check className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">+0.20 ¥/pc</span>
                </div>
              </div>

              {/* 7. Zip Lock */}
              <div
                onClick={() => handleDimChange('hasZip', !dimensions.hasZip)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.hasZip
                    ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/50'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <ZipLockIcon active={dimensions.hasZip} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">Fermeture Zip</span>
                    {dimensions.hasZip && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{dimensions.hasZip ? 'Actif' : 'Désactivé'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ===================== COLONNE DROITE : PILOTAGE MARGES, TOTAUX & GRAPHIQUES ===================== */}
        <div className={`lg:col-span-7 space-y-4 ${
          mobileTab === 'pricing' || mobileTab === 'charts' ? 'block' : 'hidden sm:block'
        }`}>

          {/* MODULE DE PILOTAGE DE VOS TARIFS & MARGES REVENTE */}
          <div className={`${mobileTab === 'charts' ? 'hidden sm:block' : 'block'} bg-gradient-to-br from-[#101b33] via-[#0d1628] to-[#0a101d] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-xl`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/20 mb-3">
              <span className="text-xs font-bold text-cyan-200 tracking-wide uppercase flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>PILOTAGE DE VOS TARIFS & MARGES</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Mise à jour en temps réel
              </span>
            </div>

            {/* Sélecteur de méthode de marge */}
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
                % Marge
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
                Multiplicateur
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
                Prix Fixe €
              </button>
            </div>

            {/* Slider % Marge */}
            {dimensions.resalePricingMode === 'percentage' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Votre Taux de Marge Brute :</span>
                  <span className="text-base font-bold font-mono text-cyan-300">{dimensions.resaleMarginPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={dimensions.resaleMarginPercent || 45}
                  onChange={e => handleDimChange('resaleMarginPercent', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}

            {/* Slider Multiplicateur */}
            {dimensions.resalePricingMode === 'multiplier' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Multiplicateur du Coût Usine :</span>
                  <span className="text-base font-bold font-mono text-cyan-300">x{dimensions.resaleMultiplier}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="4.0"
                  step="0.05"
                  value={dimensions.resaleMultiplier || 1.85}
                  onChange={e => handleDimChange('resaleMultiplier', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}

            {/* Input Prix Fixe */}
            {dimensions.resalePricingMode === 'fixed_price' && (
              <div>
                <label className="text-xs text-slate-300 block mb-1">Votre Prix Unitaire Cible (€ HT) :</label>
                <input
                  type="number"
                  min="0.05"
                  max="5.0"
                  step="0.01"
                  value={dimensions.resaleFixedUnitPriceEur || 0.35}
                  onChange={e => handleDimChange('resaleFixedUnitPriceEur', parseFloat(e.target.value) || 0.05)}
                  className="w-full bg-[#080d18] border border-cyan-500/40 rounded-xl px-3 py-1.5 text-base text-cyan-300 font-mono outline-none"
                />
              </div>
            )}

            {/* 4 GRANDES CARTES DE RÉSULTATS FINANCIERS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-cyan-500/20">
              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Prix Revente HT</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {quote.resalePriceTotalEur.toFixed(0)} €
                </span>
                <span className="text-[10px] text-slate-500 block">Total commande</span>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Unitaire Revente</span>
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-300">
                  {quote.resalePriceUnitEur.toFixed(3)} €
                </span>
                <span className="text-[10px] text-slate-500 block">/ pièce</span>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Marge Brute</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-300">
                  +{quote.grossProfitTotalEur.toFixed(0)} €
                </span>
                <span className="text-[10px] text-amber-400/80 block font-bold">({quote.grossMarginPercent}%)</span>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Coût Usine</span>
                <span className="text-base sm:text-lg font-bold font-mono text-rose-400">
                  {quote.factoryCostTotalEur.toFixed(0)} €
                </span>
                <span className="text-[10px] text-slate-500 block">{quote.factoryCostUnitEur.toFixed(3)} € / pc</span>
              </div>
            </div>
          </div>

          {/* DÉTAIL USINE & DÉCOMPOSITION DU COÛT */}
          {showAdminDetails && (
            <div className={`${mobileTab === 'charts' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-cyan-400" />
                  <span>Détail Usine Miaobaojia (Shenzhen Beijincai)</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Poids total : {quote.weightTotalKg.toFixed(1)} kg
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Films Matières (cl)</span>
                  <span className="font-mono font-bold text-cyan-300">{quote.materialCostCny.toFixed(1)} ¥</span>
                </div>
                <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Impression (ys)</span>
                  <span className="font-mono font-bold text-blue-300">{quote.printCostCny.toFixed(1)} ¥</span>
                </div>
                <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Lamination (fh)</span>
                  <span className="font-mono font-bold text-purple-300">{quote.laminationCostCny.toFixed(1)} ¥</span>
                </div>
                <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Façonnage & Zip (zd)</span>
                  <span className="font-mono font-bold text-pink-300">{quote.bagMakingCostCny.toFixed(1)} ¥</span>
                </div>
                <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Finitions Spéciales (qt)</span>
                  <span className="font-mono font-bold text-amber-300">{quote.accessoriesCostCny.toFixed(1)} ¥</span>
                </div>
                {quote.cylindersCostCny > 0 && (
                  <div className="bg-[#080d18] p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Cylindres Gravure</span>
                    <span className="font-mono font-bold text-rose-400">{quote.cylindersCostCny.toFixed(0)} ¥</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GRAPHIQUES DE DÉGRESSIVITÉ TIER & DONUT */}
          <div className={`${mobileTab === 'pricing' ? 'hidden sm:block' : 'block'} bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Simulation de Dégressivité par Volume (Grille Tarifaire)</span>
              </span>
              <span className="text-[10px] text-slate-400">Barres Vente vs Coût</span>
            </div>

            <div className="h-48 sm:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}€`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${Number(val).toFixed(3)} €`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="salePriceEur" name="Prix Vente / pc" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="factoryCostEur" name="Coût Usine / pc" fill="#ec4899" radius={[4, 4, 0, 0]} />
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
              {quote.resalePriceTotalEur.toFixed(0)} €
            </span>
            <span className="text-xs font-mono text-cyan-300">
              ({quote.resalePriceUnitEur.toFixed(3)} €/pc)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 block uppercase">Marge brute</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            +{quote.grossProfitTotalEur.toFixed(0)} € ({quote.grossMarginPercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
