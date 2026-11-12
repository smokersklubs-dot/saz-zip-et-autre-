import React, { useState } from 'react';
import { CNY_TO_EUR_RATE, QuoteBreakdown } from '../pricingEngine';
import { Check, Copy, Factory, Lock, Layers, AlertTriangle } from 'lucide-react';

interface FactoryAuditTabProps {
  quote: QuoteBreakdown;
}

export const FactoryAuditTab: React.FC<FactoryAuditTabProps> = ({ quote }) => {
  const [copiedKey, setCopiedKey] = useState<'fr' | 'zh' | null>(null);

  const handleCopy = (text: string, key: 'fr' | 'zh') => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows = [
    { label: 'Matières Premières Films (js_cl)', cny: quote.materialCostCny },
    { label: 'Impression & Vernis / Dorure (js_ys)', cny: quote.printCostCny },
    { label: `Contrecollage (${quote.imposition.laminationPasses} passe${quote.imposition.laminationPasses > 1 ? 's' : ''} · ${quote.imposition.laminationMethodLabel})`, cny: quote.laminationCostCny },
    { label: 'Façonnage, Zip & Coupe (js_zd)', cny: quote.bagMakingCostCny },
    { label: 'Accessoires & Emballage Carton (js_qt)', cny: quote.accessoriesCostCny },
    { label: 'Plaque Découpe Sur-Mesure (js_mjf)', cny: quote.dieCutPlateCostCny },
    { label: `Cylindres Cuivre (${quote.cylinderCount} × ${quote.imposition.singleCylinderCostCny} ¥)`, cny: quote.cylindersCostCny },
    { label: 'Frais Urgence Express', cny: quote.rushFeeCny },
    { label: 'Fret Logistique', cny: quote.shippingCostCny },
    { label: 'Frais Annexes Manuels', cny: quote.extraFeeCny },
    { label: 'TVA Usine (+8%)', cny: quote.taxCostCny }
  ].filter(r => r.cny > 0);

  return (
    <div className="space-y-6">
      {/* Alerte Accès Confidentiel */}
      <div className="bg-white border border-maison-border rounded-2xl p-5 sm:p-6 shadow-atelier flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-maison-canvas border border-maison-border flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-maison-brass" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-maison-brass font-semibold">
              Audit Confidentiel Atelier
            </p>
            <h2 className="font-serif text-2xl font-semibold text-maison-ink">
              Décomposition Coûts Usine & Imposition Machines
            </h2>
            <p className="text-xs text-maison-slate mt-0.5">
              Vue interne courtier — expose les coûts réels Shenzhen Beijincai et les paramètres machine (à ne pas partager au client final).
            </p>
          </div>
        </div>
        <div className="bg-maison-canvas border border-maison-border rounded-xl px-4 py-2.5 text-right shrink-0">
          <div className="text-[11px] text-maison-muted">Catalogue Officiel Usine (avec marge usine ×{quote.imposition.factoryTierMultiplier})</div>
          <div className="font-mono text-base font-semibold text-maison-ink tabular-nums">
            {quote.beijincaiCatalogTotalCny.toFixed(0)} ¥ · {quote.beijincaiCatalogTotalEur.toFixed(2)} €
          </div>
        </div>
      </div>

      {!quote.imposition.isSizeValid && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>{quote.imposition.sizeAlert} — Bascule automatique en double bobine ou vérification laize requise.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tableau Coûts Usine Réels */}
        <div className="lg:col-span-7 bg-white border border-maison-border rounded-2xl shadow-atelier overflow-hidden">
          <div className="px-5 py-4 border-b border-maison-border flex items-center justify-between bg-maison-canvas/50">
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-maison-brass" />
              <h3 className="text-sm font-semibold text-maison-ink">Postes de Coûts Atelier</h3>
            </div>
            <span className="font-mono text-xs text-maison-muted">Taux : 1 € = {(1 / CNY_TO_EUR_RATE).toFixed(2)} ¥</span>
          </div>

          <div className="divide-y divide-maison-border">
            {rows.map((row) => (
              <div key={row.label} className="px-5 py-3 flex items-center justify-between text-sm">
                <span className="text-maison-slate">{row.label}</span>
                <div className="font-mono text-right tabular-nums">
                  <span className="text-maison-ink font-semibold">{row.cny.toFixed(2)} ¥</span>
                  <span className="text-xs text-maison-muted ml-2.5">
                    ({(row.cny * CNY_TO_EUR_RATE).toFixed(2)} €)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 bg-[#171614] text-white flex items-center justify-between">
            <div>
              <div className="text-xs text-white/70">Coût de Revient Net Usine</div>
              <div className="text-[11px] font-mono text-white/60">
                {quote.factoryCostUnitCny.toFixed(3)} ¥/pc ({quote.factoryCostUnitEur.toFixed(3)} €/pc)
              </div>
            </div>
            <div className="text-right font-mono tabular-nums">
              <div className="text-lg font-semibold text-maison-brassLight">{quote.factoryCostTotalCny.toFixed(2)} ¥</div>
              <div className="text-xs text-white/80">{quote.factoryCostTotalEur.toFixed(2)} €</div>
            </div>
          </div>
        </div>

        {/* Télémétrie Imposition Machine & Spécifications Copiables */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-maison-border rounded-2xl p-5 shadow-atelier">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-maison-brass" />
              <h3 className="text-sm font-semibold text-maison-ink">Paramètres d'Imposition & Machine</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-maison-canvas/60 border border-maison-border">
                <span className="text-maison-muted block">Poses en Laize</span>
                <span className="font-mono text-base font-semibold text-maison-ink tabular-nums">
                  {quote.imposition.webPoses} pistes
                </span>
              </div>
              <div className="p-3 rounded-xl bg-maison-canvas/60 border border-maison-border">
                <span className="text-maison-muted block">Poses Circonférence</span>
                <span className="font-mono text-base font-semibold text-maison-ink tabular-nums">
                  {quote.imposition.cylinderPoses} / tour
                </span>
              </div>
              <div className="p-3 rounded-xl bg-maison-canvas/60 border border-maison-border">
                <span className="text-maison-muted block">Métrage Matière</span>
                <span className="font-mono text-base font-semibold text-maison-ink tabular-nums">
                  {quote.imposition.linearMeters.toLocaleString('fr-FR')} m
                </span>
              </div>
              <div className="p-3 rounded-xl bg-maison-canvas/60 border border-maison-border">
                <span className="text-maison-muted block">Surface Film Totale</span>
                <span className="font-mono text-base font-semibold text-maison-ink tabular-nums">
                  {quote.imposition.totalFilmSqm.toLocaleString('fr-FR')} m²
                </span>
              </div>
              {quote.technology === 'gravure' && (
                <div className="p-3 rounded-xl bg-maison-brassLight/40 border border-[#E3D2B4] col-span-2">
                  <span className="text-[#7A5928] font-medium block">Format Cylindre Cuivre Gravure</span>
                  <span className="font-mono text-sm font-semibold text-maison-ink tabular-nums">
                    Table {quote.imposition.cylinderWidthCm} cm × Ø Répétition {quote.imposition.cylinderCircumferenceCm} cm ({quote.imposition.singleCylinderCostCny} ¥/cyl.)
                  </span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-maison-canvas/60 border border-maison-border col-span-2">
                <span className="text-maison-muted block">Déroulage / Structure</span>
                <span className="font-mono text-xs font-medium text-maison-ink">
                  {quote.imposition.unwindingMode} · {quote.imposition.layersSummaryFr}
                </span>
              </div>
            </div>
          </div>

          {/* Fiches à Copier FR / ZH */}
          <div className="bg-white border border-maison-border rounded-2xl p-5 shadow-atelier space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-maison-ink">Bon de Production Usine (Chinois ZH)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(quote.imposition.quoteSpecZh, 'zh')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-maison-canvas hover:bg-maison-stone border border-maison-border text-[11px] font-semibold text-maison-ink transition-colors"
                >
                  {copiedKey === 'zh' ? <Check className="w-3 h-3 text-maison-emerald" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'zh' ? 'Copié' : 'Copier ZH'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-maison-canvas/70 border border-maison-border text-[11px] font-mono text-maison-slate whitespace-pre-wrap leading-relaxed">
                {quote.imposition.quoteSpecZh}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
