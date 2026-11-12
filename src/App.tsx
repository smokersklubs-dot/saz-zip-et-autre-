import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  Package,
  Weight,
  Lock,
  EyeOff,
  Flame,
  CheckCircle2,
  Box,
  Percent,
  Calculator,
  BarChart3,
  Smartphone,
  Info,
  Check
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
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
  FINISHES_CATALOG,
  BagDimensions,
  BagTypeKey,
  PrintTechnology
} from './pricingEngine';
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
      spoutSize: 'none',
      hasDegassingValve: false,
      hasHangingHole: false
    }
  });

  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'CNY'>('EUR');
  const [showAdminDetails, setShowAdminDetails] = useState(true);

  const currentBagDef = useMemo(() => {
    return BAG_TYPES_CATALOG.find(b => b.key === dimensions.bagType) || BAG_TYPES_CATALOG[0];
  }, [dimensions.bagType]);

  const handleTechnologyChange = (tech: PrintTechnology) => {
    setPrintTechnology(tech);
    setDimensions(prev => ({
      ...prev,
      technology: tech,
      quantity: tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity)
    }));
  };

  const handleBagSelection = (typeKey: BagTypeKey, tech: PrintTechnology, withZip: boolean = false) => {
    setPrintTechnology(tech);
    const bagDef = BAG_TYPES_CATALOG.find(b => b.key === typeKey);
    setDimensions(prev => ({
      ...prev,
      technology: tech,
      bagType: typeKey,
      hasZip: withZip ? true : prev.hasZip,
      quantity: tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity),
      zipperInstId: bagDef?.zipperOptions[0].instId
    }));
  };

  const quote = useMemo(() => {
    return calculateMylarQuote({ ...dimensions, technology: printTechnology });
  }, [dimensions, printTechnology]);

  const tierData = useMemo(() => {
    const base = { ...dimensions, technology: printTechnology };
    const tiers = printTechnology === 'gravure'
      ? [5000, 10000, 20000, 50000, 100000]
      : [250, 500, 1000, 2500, 5000, 10000];
    const results = calculateTierMatrix(base, tiers);
    return results.map((r, i) => ({
      qty: tiers[i],
      label: tiers[i] >= 1000 ? `${tiers[i] / 1000}k` : `${tiers[i]}`,
      salePriceEur: r.resalePriceUnitEur,
      factoryCostEur: r.factoryCostUnitEur,
      grossProfitEur: r.grossProfitUnitEur,
      marginPct: r.grossMarginPercent
    }));
  }, [dimensions, printTechnology]);

  const costBreakdownData = useMemo(() => {
    return [
      { name: 'Matières Films (cl)', value: quote.materialCostCny, color: '#06b6d4' },
      { name: 'Impression (ys)', value: quote.printCostCny, color: '#3b82f6' },
      { name: 'Lamination (fh)', value: quote.laminationCostCny, color: '#8b5cf6' },
      { name: 'Façonnage & Zip (zd)', value: quote.bagMakingCostCny, color: '#ec4899' },
      { name: 'Accessoires (qt)', value: quote.accessoriesCostCny, color: '#f59e0b' },
      ...(quote.cylindersCostCny > 0 ? [{ name: 'Cylindres Gravure', value: quote.cylindersCostCny, color: '#ef4444' }] : [])
    ].filter(item => item.value > 0);
  }, [quote]);

  const handleDimChange = (field: keyof BagDimensions, value: any) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const handleFinishChange = (field: keyof NonNullable<BagDimensions['finishes']>, value: any) => {
    setDimensions(prev => ({
      ...prev,
      finishes: {
        ...prev.finishes,
        [field]: value
      }
    }));
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
                Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Chiffrage usine direct & sélection visuelle de sacs</p>
          </div>
        </div>

        {/* Currency & Secret Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveCurrency('EUR')}
              className={`px-2.5 py-1 rounded-md transition ${activeCurrency === 'EUR' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              €
            </button>
            <button
              onClick={() => setActiveCurrency('CNY')}
              className={`px-2.5 py-1 rounded-md transition ${activeCurrency === 'CNY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'}`}
            >
              ¥
            </button>
          </div>

          <button
            onClick={() => setShowAdminDetails(!showAdminDetails)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:border-slate-700"
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
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700 opacity-80'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleTechnologyChange('digital')}>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>Outil de tarification numérique</span>
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
                  onClick={() => handleBagSelection('three_side', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'three_side' && !dimensions.hasZip
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('stand_up', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'stand_up' && !dimensions.hasZip
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('stand_up', 'digital', true)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'stand_up' && dimensions.hasZip
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('gusset', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'gusset'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('flat_bottom', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'flat_bottom'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('four_side', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'four_side'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('center_seal', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'center_seal'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                  onClick={() => handleBagSelection('roll_film', 'digital', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'digital' && dimensions.bagType === 'roll_film'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
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
                : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700 opacity-80'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-800/80 gap-1.5">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleTechnologyChange('gravure')}>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>Outil de tarification de gravure</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  10 000 pcs min • Cylindres cuivre
                </span>
              </div>

              {/* Sous-onglets de gravure comme sur l'image 1 */}
              <div className="flex items-center gap-4 text-xs font-semibold mb-3 border-b border-slate-800/60 pb-1.5">
                <button
                  onClick={() => setGravureTab('composite')}
                  className={`pb-1 transition flex items-center gap-1 ${
                    gravureTab === 'composite'
                      ? 'text-indigo-400 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sacs composites
                </button>
                <button
                  onClick={() => setGravureTab('single')}
                  className={`pb-1 transition flex items-center gap-1 ${
                    gravureTab === 'single'
                      ? 'text-indigo-400 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sac à une seule couche
                </button>
                <button
                  onClick={() => setGravureTab('tools')}
                  className={`pb-1 transition flex items-center gap-1 ${
                    gravureTab === 'tools'
                      ? 'text-indigo-400 border-b-2 border-orange-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Outils de calcul
                </button>
              </div>

              {/* Grille des sacs de gravure */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {/* 1. Sac 3 soudures */}
                <button
                  onClick={() => handleBagSelection('three_side', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'three_side' && !dimensions.hasZip
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('stand_up', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'stand_up' && !dimensions.hasZip
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('flat_bottom', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'flat_bottom'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('stand_up', 'gravure', true)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'stand_up' && dimensions.hasZip
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('gusset', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'gusset'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('center_seal', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'center_seal'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('four_side', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'four_side'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
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
                  onClick={() => handleBagSelection('roll_film', 'gravure', false)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                    printTechnology === 'gravure' && dimensions.bagType === 'roll_film'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-indigo-400 shrink-0">
                    <RollFilmIcon className="w-5 h-5" />
                  </div>
                  <span className="truncate text-[11px] font-medium">Film en rouleau (a...</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== ONGLETS MOBILE (SMARTPHONE) ===================== */}
      <div className="sm:hidden border-b border-slate-800 bg-[#090f1d] px-2 py-2 flex items-center justify-between text-[11px] font-semibold sticky top-[57px] z-40">
        <button
          onClick={() => setMobileTab('config')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition ${
            mobileTab === 'config' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Dimensions</span>
        </button>
        <button
          onClick={() => setMobileTab('finishes')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition ${
            mobileTab === 'finishes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Finitions</span>
        </button>
        <button
          onClick={() => setMobileTab('pricing')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition ${
            mobileTab === 'pricing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Marges</span>
        </button>
        <button
          onClick={() => setMobileTab('charts')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition ${
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

            {/* Complexe Matériau Mylar */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Structure Films & Barrière (Mylar) :
              </label>
              <select
                value={dimensions.materialPreset}
                onChange={e => handleDimChange('materialPreset', e.target.value)}
                className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
              >
                {Object.entries(MATERIAL_PRESETS).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
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
              <span className="text-[10px] text-slate-400">Cliquez pour activer</span>
            </div>

            {/* Grille visuelle de toutes les finitions avec cartes interactives */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              
              {/* 1. Vernis Mat Global */}
              <div
                onClick={() => handleFinishChange('uvEnhancement', dimensions.finishes?.uvEnhancement === 'matte_varnish' ? 'none' : 'matte_varnish')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.uvEnhancement === 'matte_varnish'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <MatteVarnishIcon active={dimensions.finishes?.uvEnhancement === 'matte_varnish'} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Vernis Mat Global</span>
                  <span className="text-[10px] text-slate-400 block">+0.40 ¥/m²</span>
                </div>
              </div>

              {/* 2. Vernis Sélectif UV */}
              <div
                onClick={() => handleFinishChange('uvEnhancement', dimensions.finishes?.uvEnhancement === 'spot_uv' ? 'none' : 'spot_uv')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.uvEnhancement === 'spot_uv'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <SpotUvIcon active={dimensions.finishes?.uvEnhancement === 'spot_uv'} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Vernis Sélectif UV</span>
                  <span className="text-[10px] text-slate-400 block">+1.00 ¥/m²</span>
                </div>
              </div>

              {/* 3. Dorure à Chaud */}
              <div
                onClick={() => handleFinishChange('uvEnhancement', dimensions.finishes?.uvEnhancement === 'hot_stamping' ? 'none' : 'hot_stamping')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.uvEnhancement === 'hot_stamping'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <HotFoilIcon active={dimensions.finishes?.uvEnhancement === 'hot_stamping'} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Dorure à Chaud</span>
                  <span className="text-[10px] text-slate-400 block">+1.60 ¥/m²</span>
                </div>
              </div>

              {/* 4. Valve de Dégazage Café */}
              <div
                onClick={() => handleFinishChange('hasDegassingValve', !dimensions.finishes?.hasDegassingValve)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.hasDegassingValve
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <DegassingValveIcon active={!!dimensions.finishes?.hasDegassingValve} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Valve Dégazage</span>
                  <span className="text-[10px] text-slate-400 block">+0.22 ¥/pc</span>
                </div>
              </div>

              {/* 5. Trou de Suspension */}
              <div
                onClick={() => handleFinishChange('hasHangingHole', !dimensions.finishes?.hasHangingHole)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.hasHangingHole
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <HangingHoleIcon active={!!dimensions.finishes?.hasHangingHole} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Trou Suspension</span>
                  <span className="text-[10px] text-slate-400 block">+0.03 ¥/pc</span>
                </div>
              </div>

              {/* 6. Bouchon / Bec Verseur */}
              <div
                onClick={() => handleFinishChange('spoutSize', dimensions.finishes?.spoutSize === 'spout_10mm' ? 'none' : 'spout_10mm')}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.finishes?.spoutSize && dimensions.finishes.spoutSize !== 'none'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <SpoutFitmentIcon active={dimensions.finishes?.spoutSize && dimensions.finishes.spoutSize !== 'none'} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Bouchon / Bec</span>
                  <span className="text-[10px] text-slate-400 block">+0.20 ¥/pc</span>
                </div>
              </div>

              {/* 7. Zip Lock */}
              <div
                onClick={() => handleDimChange('hasZip', !dimensions.hasZip)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                  dimensions.hasZip
                    ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="shrink-0">
                  <ZipLockIcon active={dimensions.hasZip} />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-[11px] truncate">Fermeture Zip</span>
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
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
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
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
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
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
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
