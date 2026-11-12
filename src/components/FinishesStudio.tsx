import React from 'react';
import {
  ADHESIVE_VARIANTS_CATALOG,
  AdhesiveVariantKey,
  FINISHES_CATALOG,
  FinishesOptions,
  HANDLE_VARIANTS_CATALOG,
  HandleVariantKey,
  INK_COVERAGE_CATALOG,
  InkCoverageLevel,
  PANTONE_COLORS_CATALOG,
  PantoneColorKey,
  PrintTechnology,
  SpoutSizeKey
} from '../pricingEngine';
import { Check, Droplets, Layers, Palette, Scissors, Sparkles } from 'lucide-react';

interface FinishesStudioProps {
  technology: PrintTechnology;
  finishes: FinishesOptions;
  cuttingType: 'double_cut' | 'die_cut';
  onChangeFinishes: (updater: (prev: FinishesOptions) => FinishesOptions) => void;
  onChangeCuttingType: (next: 'double_cut' | 'die_cut') => void;
}

const VISUAL_SURFACE_FINISHES: {
  key: NonNullable<FinishesOptions['uvEnhancement']>;
  title: string;
  subtitle: string;
  rateNote: string;
  imageUrl: string;
  activeBorder: string;
  gravureOnly?: boolean;
}[] = [
  {
    key: 'none',
    title: 'Surface Standard',
    subtitle: 'Brillant / Mat de base sans vernis',
    rateNote: '0 ¥ inclus',
    imageUrl: '',
    activeBorder: 'border-cyan-400 bg-cyan-500/15 ring-1 ring-cyan-400/40'
  },
  {
    key: 'matte_varnish',
    title: 'Vernis Mat Intégral',
    subtitle: 'Soft-Touch anti-reflets (满版哑油)',
    rateNote: '+0.40 ¥/tour · min 100¥',
    imageUrl: '/images/finishes/matte.jpg',
    activeBorder: 'border-sky-400 bg-sky-500/15 ring-1 ring-sky-400/40'
  },
  {
    key: 'spot_uv',
    title: 'Vernis Sélectif Spot UV',
    subtitle: 'Contraste brillant tactile (局部UV)',
    rateNote: '+1.00 ¥/tour · min 400¥',
    imageUrl: '/images/finishes/spot-uv.jpg',
    activeBorder: 'border-purple-400 bg-purple-500/15 ring-1 ring-purple-400/40'
  },
  {
    key: 'thick_uv',
    title: 'Vernis 3D Relief Épais',
    subtitle: 'Effet goutte surélevé (厚UV)',
    rateNote: '+1.70 ¥/tour · min 500¥',
    imageUrl: '/images/finishes/spot-uv.jpg',
    activeBorder: 'border-pink-400 bg-pink-500/15 ring-1 ring-pink-400/40'
  },
  {
    key: 'hot_stamping',
    title: 'Dorure à Chaud Or',
    subtitle: 'Feuille métallisée à chaud (烫金)',
    rateNote: '+1.60 ¥/tour · min 400¥',
    imageUrl: '/images/finishes/hot-foil.jpg',
    activeBorder: 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/40'
  },
  {
    key: 'cold_foil',
    title: 'Dorure à Froid Hélio',
    subtitle: 'Haute finesse continu (冷烫)',
    rateNote: '+1.80 ¥/tour · min 500¥',
    imageUrl: '/images/finishes/hot-foil.jpg',
    activeBorder: 'border-indigo-400 bg-indigo-500/15 ring-1 ring-indigo-400/40',
    gravureOnly: true
  },
  {
    key: 'uv_and_hot_stamping',
    title: 'Combiné Spot UV + Or',
    subtitle: 'Double passage prestige (UV+烫金)',
    rateNote: '+1.80 ¥/tour · min 600¥',
    imageUrl: '/images/finishes/hot-foil.jpg',
    activeBorder: 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/40'
  }
];

const SPOUT_OPTIONS: { key: SpoutSizeKey; label: string; meta: string }[] = [
  { key: 'none', label: 'Aucun bec', meta: '—' },
  { key: 'spout_5mm', label: 'Ø 5 mm', meta: '0.12¥' },
  { key: 'spout_8_6mm', label: 'Ø 8,6 mm', meta: '0.13¥' },
  { key: 'spout_10mm', label: 'Ø 10 mm', meta: '0.195¥' },
  { key: 'spout_13mm', label: 'Ø 13 mm', meta: '0.20¥' },
  { key: 'spout_16mm', label: 'Ø 16 mm', meta: '0.22¥' },
  { key: 'spout_20mm', label: 'Ø 20 mm', meta: '0.28¥' },
  { key: 'spout_26mm', label: 'Ø 26 mm', meta: '0.38¥' },
  { key: 'spout_33mm', label: 'Ø 33 mm', meta: '0.44¥' }
];

export const FinishesStudio: React.FC<FinishesStudioProps> = ({
  technology,
  finishes,
  cuttingType,
  onChangeFinishes,
  onChangeCuttingType
}) => {
  const activeUv = finishes.uvEnhancement || 'none';
  const activeSpout = finishes.spoutSize || 'none';
  const activeCoverage: InkCoverageLevel = finishes.inkCoverageLevel || (finishes.fullInkCoverage ? 'single_full' : '20_50');
  const activePantones = finishes.pantoneColors || [];
  const activeHandle: HandleVariantKey = finishes.handleVariant || 'standard';
  const activeAdhesive: AdhesiveVariantKey = finishes.adhesiveVariant || (finishes.hasAdhesiveStrip ? 'standard' : 'none');

  const togglePantone = (pKey: PantoneColorKey) => {
    onChangeFinishes(prev => {
      const curr = prev.pantoneColors || [];
      const exists = curr.includes(pKey);
      return {
        ...prev,
        pantoneColors: exists ? curr.filter(k => k !== pKey) : [...curr, pKey]
      };
    });
  };

  return (
    <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 shadow-cockpit space-y-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            3. Finitions Tactiles & Accessoires (`gxcb`)
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {technology === 'gravure' ? '44 procédés hélio' : '12 procédés numériques'}
        </span>
      </div>

      {/* CARTES MACRO NANO BANANA : VERNIS, SPOT UV, DORURE */}
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Traitements de Surface & Dorures Métalliques
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VISUAL_SURFACE_FINISHES.filter(f => !f.gravureOnly || technology === 'gravure').map((finish) => {
            const isSelected = activeUv === finish.key;
            return (
              <button
                key={finish.key}
                type="button"
                onClick={() => onChangeFinishes(prev => ({
                  ...prev,
                  uvEnhancement: finish.key,
                  hasMatteVarnish: finish.key === 'matte_varnish' ? true : prev.hasMatteVarnish
                }))}
                className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? finish.activeBorder
                    : 'bg-[#080d18] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-[#F4F1EA] border border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                  {finish.imageUrl ? (
                    <img
                      src={finish.imageUrl}
                      alt={finish.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Layers className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-100 truncate">
                      {finish.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{finish.subtitle}</div>
                  <div className="text-[10px] font-mono text-amber-300 mt-0.5 tabular-nums">{finish.rateNote}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOGGLES ACCESSOIRES FONCTIONNELS (VALVE Nano Banana + FENÊTRE + POIGNÉE + COUPE + GAUFRAGE + ADHÉSIF) */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
          Accessoires Fonctionnels & Ouvertures
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Valve café avec photo Nano Banana */}
          <button
            type="button"
            onClick={() => onChangeFinishes(prev => ({ ...prev, hasDegassingValve: !prev.hasDegassingValve }))}
            className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
              finishes.hasDegassingValve
                ? 'border-cyan-400 bg-cyan-500/15 ring-1 ring-cyan-400/40'
                : 'border-slate-800 bg-[#080d18] hover:border-slate-700'
            }`}
          >
            <div className="w-11 h-11 rounded-lg bg-[#F4F1EA] border border-slate-700/60 overflow-hidden shrink-0">
              <img src={FINISHES_CATALOG.valve.imageUrl} alt="Valve café" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-100 truncate">Valve Arôme Café</span>
                {finishes.hasDegassingValve && <Check className="w-3.5 h-3.5 text-cyan-300" />}
              </div>
              <span className="text-[10px] font-mono text-cyan-300 tabular-nums">+0.22 ¥/u · +0.6g</span>
            </div>
          </button>

          {/* Découpe Spéciale (Forme Die-Cut 模切) */}
          <button
            type="button"
            onClick={() => onChangeCuttingType(cuttingType === 'die_cut' ? 'double_cut' : 'die_cut')}
            className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
              cuttingType === 'die_cut'
                ? 'border-rose-400 bg-rose-500/15 ring-1 ring-rose-400/40'
                : 'border-slate-800 bg-[#080d18] hover:border-slate-700'
            }`}
          >
            <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
              <Scissors className={`w-5 h-5 ${cuttingType === 'die_cut' ? 'text-rose-400' : 'text-slate-400'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-100 truncate">Forme Spéciale (模切)</span>
                {cuttingType === 'die_cut' && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <span className="text-[10px] font-mono text-rose-300">+450 ¥ moule · +0.01¥/u</span>
            </div>
          </button>
        </div>

        {/* Poignée / Suspension + 3 variantes (Standard 10*5.5 + Riz Grand/Petit) */}
        <div className="p-2.5 rounded-xl bg-[#080d18] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(finishes.hasHangingHole)}
                onChange={() => onChangeFinishes(prev => ({ ...prev, hasHangingHole: !prev.hasHangingHole }))}
                className="accent-emerald-400"
              />
              <span>Poignée / Trou de suspension (手提扣)</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-300">
              {HANDLE_VARIANTS_CATALOG[activeHandle].unitCost}¥/u · {HANDLE_VARIANTS_CATALOG[activeHandle].weightG}g
            </span>
          </div>
          {finishes.hasHangingHole && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(Object.keys(HANDLE_VARIANTS_CATALOG) as HandleVariantKey[]).map(hKey => (
                <button
                  key={hKey}
                  type="button"
                  onClick={() => onChangeFinishes(prev => ({ ...prev, handleVariant: hKey }))}
                  className={`py-1 px-2 rounded-lg text-[10px] font-medium border text-center transition ${
                    activeHandle === hKey
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {hKey === 'standard' ? 'Standard 10×5.5' : hKey === 'rice_small' ? 'Poignée Riz (7g)' : 'Grande Poignée (8g)'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Badges complémentaires : Fenêtre Kraft (1 ou 2) + Gaufrage + Bande Adhésive (Normal / Destructif) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onChangeFinishes(prev => ({ ...prev, hasWindow: !prev.hasWindow }))}
            className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
              finishes.hasWindow
                ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                : 'border-slate-800 bg-[#080d18] text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[11px]">Fenêtre Kraft (`开窗`)</span>
              {finishes.hasWindow && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeFinishes(prev => ({ ...prev, windowCount: prev.windowCount === 2 ? 1 : 2 }));
                  }}
                  className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-bold"
                >
                  {finishes.windowCount === 2 ? '2 fen.' : '1 fen.'}
                </span>
              )}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Découpe + film transparent</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeFinishes(prev => ({ ...prev, hasEmbossing: !prev.hasEmbossing }))}
            className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
              finishes.hasEmbossing
                ? 'border-purple-400 bg-purple-500/15 text-purple-200'
                : 'border-slate-800 bg-[#080d18] text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-[11px]">Gaufrage Relief (`压纹`)</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Grain & texture embossée</span>
          </button>
        </div>

        {/* Bande adhésive (Aucune / Standard 18mm / Destructive inviolable) */}
        <div className="p-2.5 rounded-xl bg-[#080d18] border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-300 uppercase">Bande Adhésive (`自粘`) :</span>
            <span className="font-mono text-cyan-300">{ADHESIVE_VARIANTS_CATALOG[activeAdhesive].nameZh}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(ADHESIVE_VARIANTS_CATALOG) as AdhesiveVariantKey[]).map(aKey => (
              <button
                key={aKey}
                type="button"
                onClick={() => onChangeFinishes(prev => ({
                  ...prev,
                  adhesiveVariant: aKey,
                  hasAdhesiveStrip: aKey !== 'none'
                }))}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border transition ${
                  activeAdhesive === aKey
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {aKey === 'none' ? 'Aucune' : aKey === 'standard' ? 'Refermable 18mm' : 'Inviolable Blanche'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COUVERTURE ENCRE (5 PALIERS) & COULEURS PANTONE SPÉCIALES (OR / ARGENT / VIOLET / MAGENTA) */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Couverture d'encre (`满版印刷` gxcb_gravure)</span>
            </span>
            <span className="font-mono text-indigo-300">×{INK_COVERAGE_CATALOG.find(c => c.key === activeCoverage)?.rateMultiplier.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
            {INK_COVERAGE_CATALOG.map(cov => (
              <button
                key={cov.key}
                type="button"
                onClick={() => onChangeFinishes(prev => ({
                  ...prev,
                  inkCoverageLevel: cov.key,
                  fullInkCoverage: cov.key === 'single_full' || cov.key === 'double_full'
                }))}
                className={`py-1.5 px-1.5 rounded-lg text-[10px] font-medium border text-center transition ${
                  activeCoverage === cov.key
                    ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100 font-bold'
                    : 'bg-[#080d18] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="block truncate">{cov.labelZh}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tons Directs Pantone Spéciaux (Or / Argent / Violet / Rose) */}
        {technology === 'gravure' && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Encres Spéciales Pantone (`特殊专色`)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {PANTONE_COLORS_CATALOG.map(p => {
                const on = activePantones.includes(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => togglePantone(p.key)}
                    className={`py-1.5 px-2 rounded-lg border flex items-center gap-1.5 text-[10px] transition ${
                      on
                        ? 'border-amber-400 bg-amber-500/15 text-amber-100 font-bold'
                        : 'border-slate-800 bg-[#080d18] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: p.hex }} />
                    <span className="truncate">{p.labelZh}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 8 DIAMÈTRES DE BECS VERSEURS (SPOUT POUCH) */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bec Verseur & Goulot Doypack (5 → 33 mm)</span>
          </span>
          <span className="text-[10px] font-mono text-amber-300 tabular-nums">
            {activeSpout === 'none' ? 'Sans bec' : `${FINISHES_CATALOG.spouts[activeSpout].name} (${FINISHES_CATALOG.spouts[activeSpout].weightG}g)`}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {SPOUT_OPTIONS.map((sp) => {
            const isSelected = activeSpout === sp.key;
            return (
              <button
                key={sp.key}
                type="button"
                onClick={() => onChangeFinishes(prev => ({ ...prev, spoutSize: sp.key }))}
                className={`px-2 py-1.5 rounded-lg border text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100 font-bold shadow-glow-cyan'
                    : 'border-slate-800 bg-[#080d18] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] leading-tight">{sp.label}</div>
                <div className="text-[9px] font-mono text-amber-300/90 tabular-nums">{sp.meta}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
