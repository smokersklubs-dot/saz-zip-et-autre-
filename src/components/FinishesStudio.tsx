import React from 'react';
import {
  CNY_TO_EUR_RATE,
  FINISHES_CATALOG,
  FinishesOptions,
  PrintTechnology,
  SpoutSizeKey
} from '../pricingEngine';
import { Check, Sparkles } from 'lucide-react';

interface FinishesStudioProps {
  finishes: FinishesOptions;
  onChange: (next: FinishesOptions) => void;
  technology: PrintTechnology;
}

type UvOptionKey = NonNullable<FinishesOptions['uvEnhancement']>;

const UV_OPTIONS: {
  key: UvOptionKey;
  title: string;
  subtitle: string;
  imageUrl?: string;
  tag?: string;
}[] = [
  { key: 'none', title: 'Standard Brut', subtitle: 'Rendu film natif sans vernis additionnel' },
  { key: 'matte_varnish', title: 'Vernis Mat Soft-Touch', subtitle: 'Toucher velouté intégral anti-reflets', imageUrl: '/images/finishes/matte.jpg' },
  { key: 'spot_uv', title: 'Vernis Sélectif (Spot UV)', subtitle: 'Surbrillance localisée sur zones graphiques', imageUrl: '/images/finishes/spot-uv.jpg' },
  { key: 'thick_uv', title: 'Vernis Relief 3D (Épais)', subtitle: 'Surépaisseur tactile haut relief sur logo', imageUrl: '/images/finishes/spot-uv.jpg', tag: '3D Tactile' },
  { key: 'hot_stamping', title: 'Dorure à Chaud', subtitle: 'Frappe film métallisé or, cuivre ou argent', imageUrl: '/images/finishes/hot-foil.jpg', tag: 'Luxe' },
  { key: 'cold_foil', title: 'Dorure à Froid (Hélio)', subtitle: 'Finesse micro-détails en ligne continue', imageUrl: '/images/finishes/hot-foil.jpg' },
  { key: 'uv_and_hot_stamping', title: 'Spot UV + Dorure à Chaud', subtitle: 'Double ennoblissement prestige combiné', imageUrl: '/images/finishes/hot-foil.jpg', tag: 'Signature' },
];

const SPOUT_SIZES: { key: SpoutSizeKey; label: string; diameter: string }[] = [
  { key: 'none', label: 'Aucun', diameter: '—' },
  { key: 'spout_5mm', label: '5 mm', diameter: '5mm' },
  { key: 'spout_8_6mm', label: '8,6 mm', diameter: '8.6mm' },
  { key: 'spout_10mm', label: '10 mm', diameter: '10mm' },
  { key: 'spout_13mm', label: '13 mm', diameter: '13mm' },
  { key: 'spout_16mm', label: '16 mm', diameter: '16mm' },
  { key: 'spout_20mm', label: '20 mm', diameter: '20mm' },
  { key: 'spout_26mm', label: '26 mm', diameter: '26mm' },
  { key: 'spout_33mm', label: '33 mm', diameter: '33mm' }
];

export const FinishesStudio: React.FC<FinishesStudioProps> = ({
  finishes,
  onChange,
  technology
}) => {
  const activeUv = finishes.uvEnhancement || 'none';
  const activeSpout = finishes.spoutSize || 'none';

  return (
    <div className="space-y-6">
      {/* 1. Ennoblissements Surface & Vernis (Cartes Photo Macro Nano Banana) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-maison-slate">
              Ennoblissements de Surface & Marquages
            </h4>
            <p className="text-xs text-maison-muted mt-0.5">
              Sélectionnez le traitement de surface appliqué après impression
            </p>
          </div>
          {activeUv !== 'none' && (
            <span className="text-[11px] font-mono text-maison-brass font-medium">
              Forfait min. {FINISHES_CATALOG.uv[activeUv]?.minFee || 0} ¥
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {UV_OPTIONS.filter(opt => technology === 'gravure' || opt.key !== 'cold_foil').map((opt) => {
            const isSelected = activeUv === opt.key;
            const cfg = FINISHES_CATALOG.uv[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  onChange({
                    ...finishes,
                    uvEnhancement: opt.key,
                    hasMatteVarnish: opt.key === 'matte_varnish' ? true : finishes.hasMatteVarnish
                  })
                }
                className={`group flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                    : 'border-maison-border bg-white hover:border-maison-borderStrong'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#EFEBE2] border border-maison-border flex items-center justify-center">
                  {opt.imageUrl ? (
                    <img
                      src={opt.imageUrl}
                      alt={opt.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-maison-muted/50" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-maison-ink truncate">
                      {opt.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#171614] shrink-0" />}
                  </div>
                  <p className="text-[11px] text-maison-muted leading-snug mt-0.5 line-clamp-2">
                    {opt.subtitle}
                  </p>
                  {cfg && cfg.minFee > 0 && (
                    <div className="mt-1 text-[10px] font-mono text-maison-brass tabular-nums">
                      Dès {(cfg.minFee * CNY_TO_EUR_RATE).toFixed(0)} € ({cfg.unitCost.toFixed(2)} ¥/m ou tour)
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Accessoires Techniques & Façonnage Sur-Mesure */}
      <div className="pt-4 border-t border-maison-border">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-maison-slate mb-3">
          Accessoires Fonctionnels & Découpes Techniques
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Valve café (Photo Macro Nano Banana) */}
          <button
            type="button"
            onClick={() => onChange({ ...finishes, hasDegassingValve: !finishes.hasDegassingValve })}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              finishes.hasDegassingValve
                ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                : 'border-maison-border bg-white hover:border-maison-borderStrong'
            }`}
          >
            <img
              src="/images/finishes/valve.jpg"
              alt="Valve dégazage café"
              className="w-12 h-12 rounded-lg object-cover border border-maison-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-maison-ink">Valve Dégazage Arôme</span>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${finishes.hasDegassingValve ? 'bg-[#171614] border-[#171614] text-white' : 'border-maison-borderStrong'}`}>
                  {finishes.hasDegassingValve && <Check className="w-2.5 h-2.5" />}
                </span>
              </div>
              <p className="text-[11px] text-maison-muted mt-0.5">
                Valve unidirectionnelle café · +0,028 €/pc (+0,6 g)
              </p>
            </div>
          </button>

          {/* Fenêtre Transparente Kraft */}
          <div
            className={`flex flex-col justify-center p-3 rounded-xl border transition-all ${
              finishes.hasWindow
                ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                : 'border-maison-border bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...finishes, hasWindow: !finishes.hasWindow, windowCount: finishes.windowCount || 1 })}
                className="flex items-center gap-2.5 text-left flex-1"
              >
                <div className="w-10 h-10 rounded-lg bg-[#DFD2BC] border border-[#C6B394] flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 rounded bg-white/80 border border-[#9E8865]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-maison-ink">Fenêtre Découpée Kraft</div>
                  <div className="text-[11px] text-maison-muted">Découpe laissant apparaître le film interne</div>
                </div>
              </button>
              {finishes.hasWindow && (
                <div className="flex items-center gap-1 bg-white border border-maison-border rounded-lg p-0.5 shrink-0">
                  {([1, 2] as const).map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => onChange({ ...finishes, windowCount: cnt })}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md ${
                        (finishes.windowCount || 1) === cnt
                          ? 'bg-[#171614] text-white'
                          : 'text-maison-slate'
                      }`}
                    >
                      {cnt}×
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gaufrage / Embossage */}
          <button
            type="button"
            onClick={() => onChange({ ...finishes, hasEmbossing: !finishes.hasEmbossing })}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all ${
              finishes.hasEmbossing
                ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                : 'border-maison-border bg-white hover:border-maison-borderStrong'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-maison-canvas border border-maison-border flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-maison-brass" />
              </div>
              <div>
                <div className="text-xs font-semibold text-maison-ink">Gaufrage / Embossage</div>
                <div className="text-[11px] text-maison-muted">Texturation mécanique en relief</div>
              </div>
            </div>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${finishes.hasEmbossing ? 'bg-[#171614] border-[#171614] text-white' : 'border-maison-borderStrong'}`}>
              {finishes.hasEmbossing && <Check className="w-2.5 h-2.5" />}
            </span>
          </button>

          {/* Poignée Découpée 10x5.5 */}
          <button
            type="button"
            onClick={() => onChange({ ...finishes, hasHangingHole: !finishes.hasHangingHole })}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all ${
              finishes.hasHangingHole
                ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                : 'border-maison-border bg-white hover:border-maison-borderStrong'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-maison-canvas border border-maison-border flex items-center justify-center">
                <div className="w-5 h-2.5 rounded-full border-2 border-maison-ink" />
              </div>
              <div>
                <div className="text-xs font-semibold text-maison-ink">Poignée Découpée (10 × 5,5 cm)</div>
                <div className="text-[11px] text-maison-muted">Prise en main grands formats (+0,105 ¥/u)</div>
              </div>
            </div>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${finishes.hasHangingHole ? 'bg-[#171614] border-[#171614] text-white' : 'border-maison-borderStrong'}`}>
              {finishes.hasHangingHole && <Check className="w-2.5 h-2.5" />}
            </span>
          </button>

          {/* Bande Adhésive & Plein Encrage */}
          <button
            type="button"
            onClick={() => onChange({ ...finishes, hasAdhesiveStrip: !finishes.hasAdhesiveStrip })}
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all ${
              finishes.hasAdhesiveStrip
                ? 'border-[#171614] bg-maison-canvas/70 ring-1 ring-[#171614]'
                : 'border-maison-border bg-white hover:border-maison-borderStrong'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-maison-ink">Bande Adhésive (Rabat)</div>
              <div className="text-[11px] text-maison-muted">Fermeture autocollante 10/18 mm</div>
            </div>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${finishes.hasAdhesiveStrip ? 'bg-[#171614] border-[#171614] text-white' : 'border-maison-borderStrong'}`}>
              {finishes.hasAdhesiveStrip && <Check className="w-2.5 h-2.5" />}
            </span>
          </button>

          {technology === 'gravure' && (
            <button
              type="button"
              onClick={() => onChange({ ...finishes, fullInkCoverage: !finishes.fullInkCoverage })}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all ${
                finishes.fullInkCoverage
                  ? 'border-maison-brass bg-maison-brassLight/40 ring-1 ring-maison-brass'
                  : 'border-maison-border bg-white hover:border-maison-borderStrong'
              }`}
            >
              <div>
                <div className="text-xs font-semibold text-maison-ink">Plein Encrage 100 % Recto/Verso</div>
                <div className="text-[11px] text-maison-muted">Majoration encre forte densité (+20 % encre)</div>
              </div>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${finishes.fullInkCoverage ? 'bg-maison-brass border-maison-brass text-white' : 'border-maison-borderStrong'}`}>
                {finishes.fullInkCoverage && <Check className="w-2.5 h-2.5" />}
              </span>
            </button>
          )}
        </div>

        {/* Sélecteur Complet Becs Verseurs (8 diamètres catalogue usine) */}
        <div className="mt-4 bg-maison-canvas/60 border border-maison-border rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-maison-ink">Bec Verseur & Bouchon Vissé (Spout)</span>
            {activeSpout !== 'none' && (
              <span className="text-[11px] font-mono text-maison-brass font-medium tabular-nums">
                +{(FINISHES_CATALOG.spouts[activeSpout].unitCost * CNY_TO_EUR_RATE).toFixed(3)} €/u · {FINISHES_CATALOG.spouts[activeSpout].weightG} g
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPOUT_SIZES.map((sp) => (
              <button
                key={sp.key}
                type="button"
                onClick={() => onChange({ ...finishes, spoutSize: sp.key })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSpout === sp.key
                    ? 'bg-[#171614] text-white shadow-sm'
                    : 'bg-white border border-maison-border text-maison-slate hover:border-maison-borderStrong hover:text-maison-ink'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
