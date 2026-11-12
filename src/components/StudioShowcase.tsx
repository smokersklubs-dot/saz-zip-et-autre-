import React from 'react';
import {
  BAG_TYPES_CATALOG,
  BagTypeKey,
  PrintTechnology,
  SINGLE_LAYER_IMAGE_URL
} from '../pricingEngine';
import { Check, Layers, Sparkles } from 'lucide-react';

interface StudioShowcaseProps {
  bagType: BagTypeKey;
  technology: PrintTechnology;
  isSingleLayer: boolean;
  hasZip: boolean;
  widthCm: number;
  heightCm: number;
  bottomCm: number;
  sideGussetCm: number;
  thicknessMicrons: number;
  unitWeightG: number;
  leadTimeDays: number;
  presetName: string;
  onSelectBagType: (key: BagTypeKey) => void;
  onToggleSingleLayer: (single: boolean) => void;
  onChangeTechnology: (tech: PrintTechnology) => void;
}

export const StudioShowcase: React.FC<StudioShowcaseProps> = ({
  bagType,
  technology,
  isSingleLayer,
  hasZip,
  widthCm,
  heightCm,
  bottomCm,
  sideGussetCm,
  thicknessMicrons,
  unitWeightG,
  leadTimeDays,
  presetName,
  onSelectBagType,
  onToggleSingleLayer,
  onChangeTechnology
}) => {
  const activeBag = BAG_TYPES_CATALOG.find(b => b.key === bagType) || BAG_TYPES_CATALOG[0];
  const heroImage = isSingleLayer ? SINGLE_LAYER_IMAGE_URL : activeBag.imageUrl;
  const isGravure = technology === 'gravure';

  return (
    <div className="space-y-3">
      {/* PANNEAU VISUEL HÉRO + CONFIGURATION FILIÈRE */}
      <div className={`bg-[#0c1322] border rounded-2xl p-4 shadow-cockpit transition-colors ${
        isGravure ? 'border-indigo-500/35' : 'border-cyan-500/35'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Socle Studio Nano Banana (#F4F1EA pour sublimer le détourage studio) */}
          <div className="sm:col-span-5 bg-[#F4F1EA] rounded-xl border border-slate-700/60 overflow-hidden relative flex items-center justify-center p-3 h-48 sm:h-52 shadow-inner">
            <img
              src={heroImage}
              alt={isSingleLayer ? 'Sachet Monocouche Translucide' : activeBag.nameFr}
              className="max-h-full w-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
            />
            <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border ${
              isGravure
                ? 'bg-indigo-950/90 text-indigo-200 border-indigo-400/50'
                : 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isGravure ? 'bg-indigo-400' : 'bg-cyan-400'}`} />
              {isGravure ? 'Hélio Cylindres' : 'Numérique HD'}
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-center">
              <div className="bg-[#080d18]/90 backdrop-blur border border-slate-700 rounded-full px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 shadow-sm tabular-nums">
                {widthCm} × {heightCm}
                {activeBag.hasBottomGusset ? ` + ${bottomCm}` : ''}
                {activeBag.hasSideGusset && !activeBag.hasBottomGusset ? ` + ${sideGussetCm}` : ''} cm
              </div>
            </div>
          </div>

          {/* Fiche Identité & Commutateurs Principaux */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Structure Active
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight mt-0.5">
                    {isSingleLayer ? `${activeBag.shortFr} · Monocouche` : activeBag.nameFr}
                  </h2>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  hasZip
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}>
                  {hasZip ? 'Fermeture Zip' : 'Sans Zip'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activeBag.description}
              </p>
            </div>

            {/* 3 Tuiles Physiques Color-Coded */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#080d18] rounded-xl px-2.5 py-2 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Épaisseur</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-cyan-300 tabular-nums mt-0.5">
                  {thicknessMicrons} µm
                </div>
              </div>
              <div className="bg-[#080d18] rounded-xl px-2.5 py-2 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Poids / u</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-300 tabular-nums mt-0.5">
                  {unitWeightG.toFixed(2)} g
                </div>
              </div>
              <div className="bg-[#080d18] rounded-xl px-2.5 py-2 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Délai</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-300 tabular-nums mt-0.5">
                  {leadTimeDays} jours
                </div>
              </div>
            </div>

            {/* Commutateur Numérique vs Héliogravure */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#080d18] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeTechnology('digital')}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  !isGravure
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-[11px] leading-tight">Numérique HD</span>
                <span className={`block text-[9px] font-mono ${!isGravure ? 'text-slate-900' : 'text-slate-500'}`}>
                  250–10k · 0 cliché
                </span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTechnology('gravure')}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  isGravure
                    ? 'bg-indigo-500 text-white font-bold shadow-glow-indigo'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-[11px] leading-tight">Héliogravure</span>
                <span className={`block text-[9px] font-mono ${isGravure ? 'text-indigo-100' : 'text-slate-500'}`}>
                  5k+ · Cylindres cuivre
                </span>
              </button>
            </div>

            {/* Architecture Multicouche vs Monocouche */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
              <div className="inline-flex rounded-lg bg-[#080d18] p-0.5 border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleSingleLayer(false)}
                  className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    !isSingleLayer
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Multicouche (2–5)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSingleLayer(true)}
                  className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    isSingleLayer
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monocouche (1 film)
                </button>
              </div>
              <span className="min-w-0 max-w-full text-[10px] text-slate-300 bg-[#080d18] border border-slate-800 rounded-md px-2 py-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{isSingleLayer ? '0 passe colle' : presetName.split('(')[0].trim()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SÉLECTEUR VISUEL DES 8 FORMES NANO BANANA */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-cockpit">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              1. Sélection Visuelle des Formes
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">7 Formats + Monocouche</span>
        </div>

        <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 md:pb-0">
          {BAG_TYPES_CATALOG.map((item) => {
            const isSelected = !isSingleLayer && bagType === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onToggleSingleLayer(false);
                  onSelectBagType(item.key);
                }}
                className={`snap-start shrink-0 w-[108px] md:w-auto group text-left rounded-xl p-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? isGravure
                      ? 'border-indigo-400 bg-indigo-500/15 shadow-glow-indigo ring-1 ring-indigo-400/50'
                      : 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan ring-1 ring-cyan-400/50'
                    : 'border-slate-800 bg-[#080d18] hover:border-slate-600'
                }`}
              >
                <div className="aspect-[4/3] w-full rounded-lg bg-[#F4F1EA] overflow-hidden relative flex items-center justify-center p-1">
                  <img
                    src={item.imageUrl}
                    alt={item.shortFr}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                  {isSelected && (
                    <span className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                      isGravure ? 'bg-indigo-500 text-white' : 'bg-cyan-400 text-slate-950'
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="mt-1.5 px-0.5">
                  <div className={`text-[11px] font-semibold truncate ${
                    isSelected ? (isGravure ? 'text-indigo-200' : 'text-cyan-200') : 'text-slate-200'
                  }`}>
                    {item.shortFr}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">{item.nameZh}</div>
                </div>
              </button>
            );
          })}

          {/* 8ème carte : Sachet Monocouche Recyclable PE/OPP */}
          <button
            type="button"
            onClick={() => onToggleSingleLayer(true)}
            className={`snap-start shrink-0 w-[108px] md:w-auto group text-left rounded-xl p-1.5 border transition-all cursor-pointer ${
              isSingleLayer
                ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/50'
                : 'border-slate-800 bg-[#080d18] hover:border-slate-600'
            }`}
          >
            <div className="aspect-[4/3] w-full rounded-lg bg-[#F4F1EA] overflow-hidden relative flex items-center justify-center p-1">
              <img
                src={SINGLE_LAYER_IMAGE_URL}
                alt="Sachet Monocouche"
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
              {isSingleLayer && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="mt-1.5 px-0.5">
              <div className={`text-[11px] font-semibold truncate ${isSingleLayer ? 'text-amber-200' : 'text-slate-200'}`}>
                Monocouche
              </div>
              <div className="text-[9px] text-amber-400 truncate">0 passe colle</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
