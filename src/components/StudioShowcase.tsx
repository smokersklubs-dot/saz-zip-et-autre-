import React from 'react';
import {
  BAG_TYPES_CATALOG,
  BagTypeKey,
  PrintTechnology,
  QuoteBreakdown,
  SINGLE_LAYER_IMAGE_URL
} from '../pricingEngine';
import { Layers, Maximize2, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface StudioShowcaseProps {
  bagType: BagTypeKey;
  onSelectBagType: (key: BagTypeKey) => void;
  isSingleLayer: boolean;
  onToggleSingleLayer: (val: boolean) => void;
  technology: PrintTechnology;
  onSelectTechnology: (tech: PrintTechnology) => void;
  widthCm: number;
  heightCm: number;
  bottomCm: number;
  sideGussetCm: number;
  hasZip: boolean;
  quote: QuoteBreakdown;
  presetName: string;
}

export const StudioShowcase: React.FC<StudioShowcaseProps> = ({
  bagType,
  onSelectBagType,
  isSingleLayer,
  onToggleSingleLayer,
  technology,
  onSelectTechnology,
  widthCm,
  heightCm,
  bottomCm,
  sideGussetCm,
  hasZip,
  quote,
  presetName
}) => {
  const activeBag = BAG_TYPES_CATALOG.find(b => b.key === bagType) || BAG_TYPES_CATALOG[0];
  const heroImageUrl = isSingleLayer ? SINGLE_LAYER_IMAGE_URL : activeBag.imageUrl;

  const activeGussetLabel = activeBag.hasBottomGusset && activeBag.hasSideGusset
    ? `${widthCm} × ${heightCm} + ${bottomCm}/${sideGussetCm} cm`
    : activeBag.hasBottomGusset
      ? `${widthCm} × ${heightCm} + ${bottomCm} cm`
      : activeBag.hasSideGusset
        ? `${widthCm} × ${heightCm} × ${sideGussetCm} cm`
        : `${widthCm} × ${heightCm} cm`;

  return (
    <div className="space-y-5">
      {/* Carte Vitrine Principale — Fond Albâtre Atelier */}
      <div className="bg-white border border-maison-border rounded-2xl shadow-atelier overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Colonne Visuel Studio Nano Banana */}
          <div className="md:col-span-5 relative bg-[#F3EFE7] flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-maison-border min-h-[290px]">
            <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-sm border border-maison-border text-maison-ink shadow-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${technology === 'digital' ? 'bg-maison-emerald' : 'bg-maison-brass'}`} />
                {technology === 'digital' ? 'Numérique HD' : 'Héliogravure'}
              </span>
              {isSingleLayer && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#171614] text-white">
                  Monocouche
                </span>
              )}
            </div>

            <div className="w-full max-w-[230px] aspect-square rounded-xl overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-[1.03]">
              <img
                src={heroImageUrl}
                alt={activeBag.nameFr}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Cote dimensionnelle architecturale */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 border border-maison-border text-xs font-mono text-maison-ink tabular-nums">
              <Maximize2 className="w-3.5 h-3.5 text-maison-brass" />
              <span>{activeGussetLabel}</span>
            </div>
          </div>

          {/* Colonne Spécifications Éditoriales & Mode Production */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-maison-brass font-semibold">
                    Structure Sélectionnée
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-maison-ink mt-0.5 leading-tight">
                    {isSingleLayer ? `${activeBag.shortFr} — Éco Monocouche` : activeBag.nameFr}
                  </h2>
                </div>
                {hasZip && (
                  <span className="shrink-0 px-2.5 py-1 rounded-md bg-maison-brassLight border border-[#E3D2B4] text-[#7A5928] text-[11px] font-semibold">
                    Fermeture Zip
                  </span>
                )}
              </div>

              <p className="text-sm text-maison-slate mt-2 leading-relaxed">
                {activeBag.description}
              </p>

              {/* Télémétrie Atelier Synthétique */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div className="bg-maison-canvas/70 border border-maison-border rounded-xl p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-maison-muted font-medium">
                    <Layers className="w-3.5 h-3.5 text-maison-brass" />
                    Épaisseur
                  </div>
                  <div className="font-mono text-sm font-semibold text-maison-ink mt-1 tabular-nums">
                    {quote.imposition.actualThicknessMicrons} µm
                  </div>
                </div>
                <div className="bg-maison-canvas/70 border border-maison-border rounded-xl p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-maison-muted font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-maison-emerald" />
                    Poids / u
                  </div>
                  <div className="font-mono text-sm font-semibold text-maison-ink mt-1 tabular-nums">
                    {quote.weightUnitGrams.toFixed(1)} g
                  </div>
                </div>
                <div className="bg-maison-canvas/70 border border-maison-border rounded-xl p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-maison-muted font-medium">
                    <Clock className="w-3.5 h-3.5 text-maison-slate" />
                    Délai
                  </div>
                  <div className="font-mono text-sm font-semibold text-maison-ink mt-1 tabular-nums">
                    {quote.imposition.leadTimeDays} jours
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteurs Filière & Complexité Matière */}
            <div className="space-y-3 pt-3 border-t border-maison-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-maison-ink">Filière d'impression</span>
                <div className="inline-flex rounded-xl bg-maison-canvas p-1 border border-maison-border">
                  <button
                    type="button"
                    onClick={() => onSelectTechnology('digital')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      technology === 'digital'
                        ? 'bg-[#171614] text-white shadow-sm'
                        : 'text-maison-slate hover:text-maison-ink'
                    }`}
                  >
                    Numérique (0 cliché)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTechnology('gravure')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      technology === 'gravure'
                        ? 'bg-maison-brass text-white shadow-sm'
                        : 'text-maison-slate hover:text-maison-ink'
                    }`}
                  >
                    Héliogravure (Cylindres)
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-maison-ink">Architecture film</span>
                <div className="inline-flex rounded-xl bg-maison-canvas p-1 border border-maison-border">
                  <button
                    type="button"
                    onClick={() => onToggleSingleLayer(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      !isSingleLayer
                        ? 'bg-white text-maison-ink shadow-sm border border-maison-border'
                        : 'text-maison-slate hover:text-maison-ink'
                    }`}
                  >
                    Multicouche Barrière
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSingleLayer(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSingleLayer
                        ? 'bg-white text-maison-ink shadow-sm border border-maison-border'
                        : 'text-maison-slate hover:text-maison-ink'
                    }`}
                  >
                    Monocouche (1 film)
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-maison-muted flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-maison-brass shrink-0" />
                <span className="truncate">{isSingleLayer ? 'Film mono-matériau sans contrecollage' : presetName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galerie Visuelle Sélecteur de Formats (Photos Studio Nano Banana) */}
      <div className="bg-white border border-maison-border rounded-2xl p-4 sm:p-5 shadow-atelier">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-sm font-semibold text-maison-ink">Catalogue des Formes</h3>
            <p className="text-xs text-maison-muted">Sélection visuelle — cliquez sur une silhouette</p>
          </div>
          <span className="text-[11px] font-mono text-maison-muted tabular-nums">
            7 Formats + Monocouche
          </span>
        </div>

        <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 no-scrollbar snap-x">
          {BAG_TYPES_CATALOG.map((bag) => {
            const isSelected = bagType === bag.key && !isSingleLayer;
            return (
              <button
                key={bag.key}
                type="button"
                onClick={() => {
                  onToggleSingleLayer(false);
                  onSelectBagType(bag.key);
                }}
                className={`group shrink-0 w-[132px] md:w-auto snap-start text-left rounded-xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'border-[#171614] ring-1 ring-[#171614] bg-maison-canvas/60 shadow-sm'
                    : 'border-maison-border bg-white hover:border-maison-borderStrong hover:shadow-sm'
                }`}
              >
                <div className="aspect-[4/3] w-full bg-[#F4F0E8] overflow-hidden p-2 flex items-center justify-center relative">
                  <img
                    src={bag.imageUrl}
                    alt={bag.nameFr}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-maison-brass" />
                  )}
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-maison-ink leading-snug">
                    {bag.shortFr}
                  </div>
                  <div className="text-[10px] text-maison-muted mt-0.5 truncate">
                    {bag.key === 'roll_film' ? 'Bobine continue' : bag.hasBottomGusset ? 'Fond soufflet' : bag.hasSideGusset ? 'Soufflets latéraux' : 'Format plat'}
                  </div>
                </div>
              </button>
            );
          })}

          {/* 8ème Carte Visuelle : Mode Monocouche PE/BOPP */}
          <button
            type="button"
            onClick={() => {
              onToggleSingleLayer(true);
              if (bagType === 'flat_bottom') {
                onSelectBagType('stand_up');
              }
            }}
            className={`group shrink-0 w-[132px] md:w-auto snap-start text-left rounded-xl border transition-all overflow-hidden ${
              isSingleLayer
                ? 'border-maison-brass ring-1 ring-maison-brass bg-maison-brassLight/40 shadow-sm'
                : 'border-maison-border bg-white hover:border-maison-borderStrong hover:shadow-sm'
            }`}
          >
            <div className="aspect-[4/3] w-full bg-[#F4F0E8] overflow-hidden p-2 flex items-center justify-center relative">
              <img
                src={SINGLE_LAYER_IMAGE_URL}
                alt="Sac Monocouche PE/BOPP"
                loading="lazy"
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              />
              {isSingleLayer && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-maison-brass" />
              )}
            </div>
            <div className="p-2.5">
              <div className="text-xs font-semibold text-maison-ink leading-snug">
                Monocouche
              </div>
              <div className="text-[10px] text-maison-muted mt-0.5 truncate">
                PE / BOPP Recyclable
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
