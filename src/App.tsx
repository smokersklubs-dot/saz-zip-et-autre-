import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
  ArrowUpRight,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
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

export default function App() {
  // 1. Technologie active
  const [printTechnology, setPrintTechnology] = useState<PrintTechnology>('digital');
  const [gravureTab, setGravureTab] = useState<'composite' | 'single' | 'tools'>('composite');

  // 2. Configuration du sac & Stratégie de revente
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
    // Système de Revente & Marges Flexibles
    resalePricingMode: 'percentage', // 'percentage' | 'multiplier' | 'fixed_price'
    resaleMarginPercent: 45,        // 45% de marge commerciale par défaut
    resaleMultiplier: 1.85,         // x1.85 du coût de revient
    resaleFixedUnitPriceEur: 0.35,  // 0.35 € unitaire fixe
    finishes: {
      uvEnhancement: 'none',
      spoutSize: 'none',
      hasDegassingValve: false,
      hasHangingHole: false
    }
  });

  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'CNY'>('EUR');
  const [showAdminDetails, setShowAdminDetails] = useState(true);

  // Bag Definition active
  const currentBagDef = useMemo(() => {
    return BAG_TYPES_CATALOG.find(b => b.key === dimensions.bagType) || BAG_TYPES_CATALOG[0];
  }, [dimensions.bagType]);

  // Synchronisation Technologie (Numérique vs Gravure)
  const handleTechnologyChange = (tech: PrintTechnology) => {
    setPrintTechnology(tech);
    setDimensions(prev => ({
      ...prev,
      technology: tech,
      quantity: tech === 'gravure' ? Math.max(10000, prev.quantity) : (prev.quantity > 10000 ? 1000 : prev.quantity)
    }));
  };

  // 3. Calcul instantané
  const quote = useMemo(() => {
    return calculateMylarQuote({ ...dimensions, technology: printTechnology });
  }, [dimensions, printTechnology]);

  // 4. Dégressivité par paliers
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

  // 5. Répartition Donut
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

  // Handlers
  const handleDimChange = (field: keyof BagDimensions, value: any) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const handleBagTypeSelect = (typeKey: BagTypeKey) => {
    const bagDef = BAG_TYPES_CATALOG.find(b => b.key === typeKey);
    setDimensions(prev => ({
      ...prev,
      bagType: typeKey,
      zipperInstId: bagDef?.zipperOptions[0].instId,
      hasZip: bagDef?.zipperOptions[0].label.includes('Zip') ?? false
    }));
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

  const bagSelectorList = [
    { key: 'three_side', name: 'Sac à 3 soudures', sub: '三边封' },
    { key: 'stand_up', name: 'Sac debout (Doypack)', sub: '自立袋' },
    { key: 'center_seal', name: 'Fermeture centrale', sub: '中封袋' },
    { key: 'gusset', name: 'Sac accordéon', sub: '风琴袋' },
    { key: 'flat_bottom', name: 'Sac octogonal (8 scellés)', sub: '八边封' },
    { key: 'four_side', name: 'Sac scellé 4 côtés', sub: '四边封' },
    { key: 'roll_film', name: 'Film en rouleau', sub: '卷膜' }
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar Cyber/Admin */}
      <header className="border-b border-slate-800/80 bg-[#090f1d]/90 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Cpu className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                ANTIGRAVITY // PRICING & MARGIN COMMAND CENTER
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                ● Live Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Rétro-ingénierie d'usine & Gestionnaire de Prix de Revente Ultra-Précis</p>
          </div>
        </div>

        {/* Currency Switcher & Confidentialité */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900/90 border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setActiveCurrency('EUR')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeCurrency === 'EUR' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EUR (€)
            </button>
            <button
              onClick={() => setActiveCurrency('CNY')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeCurrency === 'CNY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CNY (¥)
            </button>
          </div>

          <button
            onClick={() => setShowAdminDetails(!showAdminDetails)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:border-slate-700 transition"
          >
            {showAdminDetails ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>{showAdminDetails ? 'Masquer Coûts Usine' : 'Afficher Coûts Usine'}</span>
          </button>
        </div>
      </header>

      {/* BANDEAU CATALOGUE DES FORMATS (REPRODUCTION DE VOTRE CAPTURE D'ÉCRAN) */}
      <div className="border-b border-slate-800/60 bg-[#080d1a] px-6 py-3.5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Bloc Numérique */}
          <div className={`lg:col-span-5 bg-[#0c1322] border rounded-2xl p-3.5 shadow-md transition ${printTechnology === 'digital' ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-slate-800/80'}`}>
            <div className="flex items-center justify-between mb-2.5">
              <button
                onClick={() => handleTechnologyChange('digital')}
                className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 text-left"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Outil de tarification numérique</span>
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                250 à 10k pcs (0¥ cylindre)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {bagSelectorList.slice(0, 4).map(item => (
                <button
                  key={item.key}
                  onClick={() => { handleTechnologyChange('digital'); handleBagTypeSelect(item.key as BagTypeKey); }}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    printTechnology === 'digital' && dimensions.bagType === item.key
                      ? 'bg-cyan-500/20 border-cyan-500/70 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-tight">{item.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {bagSelectorList.slice(4).map(item => (
                <button
                  key={item.key}
                  onClick={() => { handleTechnologyChange('digital'); handleBagTypeSelect(item.key as BagTypeKey); }}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    printTechnology === 'digital' && dimensions.bagType === item.key
                      ? 'bg-cyan-500/20 border-cyan-500/70 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-tight">{item.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bloc Héliogravure */}
          <div className={`lg:col-span-7 bg-[#0c1322] border rounded-2xl p-3.5 shadow-md transition ${printTechnology === 'gravure' ? 'border-indigo-500/70 ring-1 ring-indigo-500/30' : 'border-slate-800/80'}`}>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => handleTechnologyChange('gravure')}
                className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 text-left"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Outil de tarification de gravure (Hélio)</span>
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Grands Tirages: 10 000+ pcs
              </span>
            </div>

            {/* Onglets Gravure */}
            <div className="flex items-center gap-4 text-xs font-medium border-b border-slate-800/80 pb-1.5 mb-2.5">
              <button
                onClick={() => { handleTechnologyChange('gravure'); setGravureTab('composite'); }}
                className={`transition pb-1 relative ${gravureTab === 'composite' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sacs composites
                {gravureTab === 'composite' && <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-500 rounded" />}
              </button>
              <button
                onClick={() => { handleTechnologyChange('gravure'); setGravureTab('single'); }}
                className={`transition pb-1 relative ${gravureTab === 'single' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sac à une seule couche
                {gravureTab === 'single' && <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-500 rounded" />}
              </button>
              <button
                onClick={() => { handleTechnologyChange('gravure'); setGravureTab('tools'); }}
                className={`transition pb-1 relative ${gravureTab === 'tools' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Outils de calcul
                {gravureTab === 'tools' && <span className="absolute bottom-[-7px] left-0 right-0 h-0.5 bg-indigo-500 rounded" />}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {bagSelectorList.slice(0, 4).map(item => (
                <button
                  key={`gravure-${item.key}`}
                  onClick={() => { handleTechnologyChange('gravure'); handleBagTypeSelect(item.key as BagTypeKey); }}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    printTechnology === 'gravure' && dimensions.bagType === item.key
                      ? 'bg-indigo-500/20 border-indigo-500/70 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-tight">{item.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {bagSelectorList.slice(4).map(item => (
                <button
                  key={`gravure-${item.key}`}
                  onClick={() => { handleTechnologyChange('gravure'); handleBagTypeSelect(item.key as BagTypeKey); }}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                    printTechnology === 'gravure' && dimensions.bagType === item.key
                      ? 'bg-indigo-500/20 border-indigo-500/70 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-semibold leading-tight">{item.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===================== VOLET GAUCHE : CONFIGURATEUR + GESTION DES TARIFS DE REVENTE ===================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. MODULE MODERNE DE PILOTAGE DE VOS TARIFS DE REVENTE */}
          <div className="bg-gradient-to-br from-[#101b33] via-[#0d1628] to-[#0a101d] border border-cyan-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-cyan-200 tracking-wide uppercase">
                  VOS TARIFS DE REVENTE & MARGES
                </span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Configurable en direct
              </span>
            </div>

            {/* Sélecteur de méthode de marge */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'percentage')}
                className={`py-2 px-2.5 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                  dimensions.resalePricingMode === 'percentage'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>% Marge Brute</span>
                <span className="text-[10px] opacity-80">(ex: 50%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'multiplier')}
                className={`py-2 px-2.5 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                  dimensions.resalePricingMode === 'multiplier'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Multiplicateur</span>
                <span className="text-[10px] opacity-80">(ex: x2.0)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDimChange('resalePricingMode', 'fixed_price')}
                className={`py-2 px-2.5 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                  dimensions.resalePricingMode === 'fixed_price'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Prix Fixe €</span>
                <span className="text-[10px] opacity-80">(par pièce)</span>
              </button>
            </div>

            {/* Inputs Dynamiques selon le mode de tarification */}
            {dimensions.resalePricingMode === 'percentage' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Taux de Marge Brute sur Vente:</span>
                  <span className="text-base font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {dimensions.resaleMarginPercent}%
                  </span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>20% (Prix agressif)</span>
                  <span>45% (Standard)</span>
                  <span>65% (Luxe / Petite série)</span>
                </div>
              </div>
            )}

            {dimensions.resalePricingMode === 'multiplier' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Coefficient Multiplicateur du Coût Usine:</span>
                  <span className="text-base font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    x{dimensions.resaleMultiplier || 1.85}
                  </span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>x1.3 (Grossiste)</span>
                  <span>x1.85 (B2B)</span>
                  <span>x3.0 (Détail e-commerce)</span>
                </div>
              </div>
            )}

            {dimensions.resalePricingMode === 'fixed_price' && (
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">
                  Définir votre prix de vente unitaire cible (€ HT / sac) :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.05"
                    max="5.0"
                    step="0.01"
                    value={dimensions.resaleFixedUnitPriceEur || 0.35}
                    onChange={e => handleDimChange('resaleFixedUnitPriceEur', parseFloat(e.target.value) || 0.05)}
                    className="w-full bg-[#090d18] border border-cyan-500/40 rounded-xl px-3 py-2 text-base text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">€ / unité</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. SPÉCIFICATIONS DU SAC */}
          <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Sliders className="w-4 h-4" />
                <span>SPÉCIFICATIONS : {currentBagDef.nameFr.toUpperCase()}</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {currentBagDef.nameZh}
              </span>
            </div>

            {/* Inputs Dimensions */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2 flex items-center justify-between">
                  <span>Dimensions du sac (cm)</span>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {dimensions.widthCm} × {dimensions.heightCm} {currentBagDef.hasBottomGusset ? `+ ${dimensions.bottomCm}cm` : ''}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Largeur</span>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="50"
                        step="0.5"
                        value={dimensions.widthCm}
                        onChange={e => handleDimChange('widthCm', parseFloat(e.target.value) || 5)}
                        className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition font-mono"
                      />
                      <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">cm</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Hauteur</span>
                    <div className="relative">
                      <input
                        type="number"
                        min="8"
                        max="60"
                        step="0.5"
                        value={dimensions.heightCm}
                        onChange={e => handleDimChange('heightCm', parseFloat(e.target.value) || 8)}
                        className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition font-mono"
                      />
                      <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">cm</span>
                    </div>
                  </div>

                  {currentBagDef.hasBottomGusset && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Soufflet Fond</span>
                      <div className="relative">
                        <input
                          type="number"
                          min="2"
                          max="20"
                          step="0.5"
                          value={dimensions.bottomCm}
                          onChange={e => handleDimChange('bottomCm', parseFloat(e.target.value) || 2)}
                          className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition font-mono"
                        />
                        <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">cm</span>
                      </div>
                    </div>
                  )}

                  {currentBagDef.hasSideGusset && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Soufflet Côté</span>
                      <div className="relative">
                        <input
                          type="number"
                          min="2"
                          max="15"
                          step="0.5"
                          value={dimensions.sideGussetCm || 4}
                          onChange={e => handleDimChange('sideGussetCm', parseFloat(e.target.value) || 2)}
                          className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition font-mono"
                        />
                        <span className="absolute right-2.5 top-2.5 text-xs text-slate-500">cm</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slider Quantité */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">
                    Quantité commandée :
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    printTechnology === 'gravure' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    {dimensions.quantity.toLocaleString()} unités
                  </span>
                </div>

                <input
                  type="range"
                  min={printTechnology === 'gravure' ? 5000 : 250}
                  max={printTechnology === 'gravure' ? 100000 : 10000}
                  step={printTechnology === 'gravure' ? 5000 : 250}
                  value={dimensions.quantity}
                  onChange={e => handleDimChange('quantity', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex items-center justify-between gap-1 mt-2">
                  {(printTechnology === 'gravure' ? [5000, 10000, 20000, 50000, 100000] : [250, 500, 1000, 2500, 5000]).map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleDimChange('quantity', q)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-mono border transition ${
                        dimensions.quantity === q
                          ? (printTechnology === 'gravure' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40')
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {q >= 1000 ? `${q / 1000}k` : q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Si Héliogravure : Sélecteur de Cylindres */}
              {printTechnology === 'gravure' && (
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Cylindres en cuivre gravés (版支数)</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {dimensions.cylinderCount || 6} cylindres ({((dimensions.cylinderCount || 6) * 400).toLocaleString()} ¥)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={dimensions.cylinderCount || 6}
                    onChange={e => handleDimChange('cylinderCount', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                  <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>Base CMJN + 2 Blancs (6 cyl.)</span>
                    <span>Amorti: {quote.cylinderFeePerUnitCny} ¥/sac</span>
                  </div>
                </div>
              )}

              {/* Type de Fermeture / Zip */}
              {currentBagDef.zipperOptions.length > 1 && (
                <div className="pt-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Système de fermeture / Zip
                  </label>
                  <select
                    value={dimensions.zipperInstId || currentBagDef.zipperOptions[0].instId}
                    onChange={e => {
                      const sel = currentBagDef.zipperOptions.find(z => z.instId === e.target.value);
                      setDimensions(prev => ({
                        ...prev,
                        zipperInstId: e.target.value,
                        hasZip: sel ? !sel.label.includes('Sans') : false
                      }));
                    }}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                  >
                    {currentBagDef.zipperOptions.map(opt => (
                      <option key={opt.instId} value={opt.instId}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Matériau Structure */}
              <div className="pt-2">
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Matériau & Barrière
                </label>
                <select
                  value={dimensions.materialPreset}
                  onChange={e => handleDimChange('materialPreset', e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                >
                  {Object.entries(MATERIAL_PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  {MATERIAL_PRESETS[dimensions.materialPreset || 'mylar_standard'].description}
                </p>
              </div>

              {/* Finitions & Accessoires */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <span className="text-xs font-medium text-slate-300 block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Finitions & Accessoires (Catalogue Réel)</span>
                  </span>
                </span>

                {/* Vernis */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Vernis & Effets de surface</span>
                  <select
                    value={dimensions.finishes?.uvEnhancement || 'none'}
                    onChange={e => handleFinishChange('uvEnhancement', e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="none">Aucun vernis spécial (+0 €)</option>
                    <option value="matte_varnish">Vernis mat plein (+0.40 ¥/m²)</option>
                    <option value="spot_uv">Vernis sélectif standard UV (+1.00 ¥/m²)</option>
                    <option value="thick_uv">Vernis sélectif épais 3D (+1.70 ¥/m²)</option>
                    <option value="hot_stamping">Dorure à chaud / Hot Stamping (+1.60 ¥/m²)</option>
                    <option value="uv_and_hot_stamping">Vernis UV + Dorure combinée (+1.80 ¥/m²)</option>
                  </select>
                </div>

                {/* Bouchons */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Bouchon / Bec verseur</span>
                  <select
                    value={dimensions.finishes?.spoutSize || 'none'}
                    onChange={e => handleFinishChange('spoutSize', e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="none">Sans bouchon (+0 €)</option>
                    <option value="spout_10mm">Bouchon verseur 10mm (+0.195 ¥/pc | +3.5g)</option>
                    <option value="spout_16mm">Bouchon verseur 16mm (+0.220 ¥/pc | +6.1g)</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dimensions.finishes?.hasDegassingValve}
                      onChange={e => handleFinishChange('hasDegassingValve', e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-300 block font-medium">Valve Dégazage</span>
                      <span className="text-[10px] text-slate-500">+0.22 ¥/pc (+0.6g)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dimensions.finishes?.hasHangingHole}
                      onChange={e => handleFinishChange('hasHangingHole', e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-slate-300 block font-medium">Poignée Découpée</span>
                      <span className="text-[10px] text-slate-500">+0.105 ¥/pc (+7.6g)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== VOLET DROIT : ANALYSE DES MARGES & GRAPHIQUES ===================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cartes Métriques Clés */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Prix de Vente Client */}
            <div className="bg-gradient-to-b from-[#111e38] to-[#0c1424] border border-cyan-500/40 rounded-2xl p-4 shadow-lg shadow-cyan-950/20 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-300">Votre Prix Revente</span>
                <DollarSign className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {activeCurrency === 'EUR' ? `${quote.resalePriceTotalEur.toFixed(2)} €` : `${quote.resalePriceTotalCny.toFixed(2)} ¥`}
              </div>
              <div className="text-xs text-cyan-300 font-mono mt-1 flex items-center justify-between border-t border-cyan-500/20 pt-1.5">
                <span>Prix unitaire:</span>
                <strong className="text-sm font-bold text-cyan-200">
                  {activeCurrency === 'EUR' ? `${quote.resalePriceUnitEur.toFixed(3)} €` : `${quote.resalePriceUnitCny.toFixed(3)} ¥`}
                </strong>
              </div>
            </div>

            {/* 2. Coût Réel Usine (Secret) */}
            <div className="bg-gradient-to-b from-[#191e2b] to-[#0d121c] border border-rose-500/25 rounded-2xl p-4 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-rose-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Coût Réel Usine</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 font-semibold">
                  Achat Net
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-200">
                {activeCurrency === 'EUR' ? `${quote.factoryCostTotalEur.toFixed(2)} €` : `${quote.factoryCostTotalCny.toFixed(2)} ¥`}
              </div>
              <div className="text-xs text-rose-400/90 font-mono mt-1 flex items-center justify-between border-t border-rose-500/20 pt-1.5">
                <span>Coût usine/pc:</span>
                <strong>
                  {activeCurrency === 'EUR' ? `${quote.factoryCostUnitEur.toFixed(3)} €` : `${quote.factoryCostUnitCny.toFixed(3)} ¥`}
                </strong>
              </div>
            </div>

            {/* 3. Votre Marge Brute */}
            <div className="bg-gradient-to-b from-[#102528] to-[#0b1619] border border-emerald-500/40 rounded-2xl p-4 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300">Votre Bénéfice Net</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-300">
                {activeCurrency === 'EUR' ? `+${quote.grossProfitTotalEur.toFixed(2)} €` : `+${quote.grossProfitTotalCny.toFixed(2)} ¥`}
              </div>
              <div className="text-xs text-emerald-300 font-mono mt-1 flex items-center justify-between border-t border-emerald-500/20 pt-1.5">
                <span>Marge: <strong>{quote.grossMarginPercent}%</strong></span>
                <span>Markup: <strong>+{quote.markupPercent}%</strong></span>
              </div>
            </div>
          </div>

          {/* Graphique de Marge & Rentabilité (Barres Comparatives Vente vs Coût) */}
          <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Simulation de Dégressivité & Marges ({activeCurrency})</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Marge moyenne : ~{quote.grossMarginPercent}%
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1b253b" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val.toFixed(3)} ${activeCurrency === 'EUR' ? '€' : '¥'}`,
                      name === 'salePriceEur' ? 'Votre Prix de Vente' : name === 'factoryCostEur' ? 'Coût d\'Achat Usine' : 'Votre Marge Nette'
                    ]}
                    contentStyle={{ backgroundColor: '#090f1d', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend
                    formatter={(val) => val === 'salePriceEur' ? 'Prix de Vente' : val === 'factoryCostEur' ? 'Coût Usine' : 'Bénéfice Net'}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  />
                  <Bar dataKey="factoryCostEur" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grossProfitEur" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="salePriceEur" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphiques Doubles : Donut + Courbe Dégressivité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Donut Répartition Usine */}
            <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Décomposition Coût Usine</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">¥ CNY</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c1322" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val} ¥`, '']}
                      contentStyle={{ backgroundColor: '#090f1d', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                {costBreakdownData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name}:</span>
                    <strong className="text-slate-200">{d.value}¥</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Courbe Évolution du Prix Unitaire */}
            <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Courbe Dégressivité Unitaire</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Prix / Sac</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tierData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="qty" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: number) => [`${val.toFixed(3)} ${activeCurrency === 'EUR' ? '€' : '¥'}`, 'Prix Unitaire']}
                      contentStyle={{ backgroundColor: '#090f1d', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey={activeCurrency === 'EUR' ? 'salePriceEur' : 'unitPriceCny'}
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#06b6d4' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="factoryCostEur"
                      stroke="#f43f5e"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-cyan-400" /> Votre Revente
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-rose-500 border-dashed" /> Coût Usine
                </span>
                <span className="text-emerald-400 font-semibold">{printTechnology === 'gravure' ? 'Grand tirage' : 'Court tirage'}</span>
              </div>
            </div>
          </div>

          {/* Tableau Admin Détaillé */}
          {showAdminDetails && (
            <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">DÉTAIL DES POSTES DE COÛT USINE ({currentBagDef.nameZh})</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Beijincai Matrix
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Film & Matière (cl)</span>
                  <strong className="text-slate-200 text-sm">{quote.materialCostCny} ¥</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Impression (ys)</span>
                  <strong className="text-slate-200 text-sm">{quote.printCostCny} ¥</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Lamination (fh)</span>
                  <strong className="text-slate-200 text-sm">{quote.laminationCostCny} ¥</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Façonnage/Zip (zd)</span>
                  <strong className="text-slate-200 text-sm">{quote.bagMakingCostCny} ¥</strong>
                </div>
              </div>

              {printTechnology === 'gravure' && (
                <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <span>Frais de gravure cylindres (版费) :</span>
                    <strong className="text-white">{quote.cylinderCount} couleurs × 400 ¥ = {quote.cylindersCostCny} ¥</strong>
                  </div>
                  <div className="text-indigo-400">
                    Impact unitaire: +{quote.cylinderFeePerUnitCny} ¥/sac
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Cyber / Stealth Status */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] px-6 py-3 mt-auto flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-emerald-400 font-semibold">
            SÉCURITÉ : Mode furtif actif (0 requêtes externes / cache local)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono">
          <span>Moteur exécuté en mémoire client</span>
          <span>•</span>
          <span>DingTalk Yida V5.0.2 Emulated</span>
        </div>
      </footer>
    </div>
  );
}
