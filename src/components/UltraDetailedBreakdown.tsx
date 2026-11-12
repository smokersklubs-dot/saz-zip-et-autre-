import React from 'react';
import { CNY_TO_EUR_RATE, QuoteBreakdown } from '../pricingEngine';
import {
  Check,
  Copy,
  FileText,
  Layers,
  PackageCheck,
  PieChart,
  Ruler,
  Scale,
  ShieldAlert
} from 'lucide-react';

interface UltraDetailedBreakdownProps {
  quote: QuoteBreakdown;
  displayCurrency: 'EUR' | 'CNY';
  copiedBanner: 'fr' | 'zh' | null;
  onCopyQuote: (lang: 'fr' | 'zh') => void;
  onOpenProposal: () => void;
}

export const UltraDetailedBreakdown: React.FC<UltraDetailedBreakdownProps> = ({
  quote,
  displayCurrency,
  copiedBanner,
  onCopyQuote,
  onOpenProposal
}) => {
  const preTaxFactoryCny = Math.max(1, quote.factoryCostTotalCny - quote.taxCostCny);
  const pct = (val: number) => ((val / preTaxFactoryCny) * 100).toFixed(1);

  const fmtEur = (v: number, dec = 2) =>
    `${v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec })} €`;
  const fmtCny = (v: number, dec = 2) =>
    `${v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec })} ¥`;

  const cards = [
    {
      num: '1',
      title: 'Films Matières (`js_cl`)',
      cny: quote.materialCostCny,
      colorText: 'text-cyan-300',
      borderClass: 'border-cyan-500/25',
      badgeBg: 'bg-cyan-500/10 text-cyan-300',
      note: `${quote.imposition.linearMeters} m × ${quote.gacheBreakdown.webWidthUsedCm} cm (${quote.imposition.activeLayersCount} c.)`
    },
    {
      num: '2',
      title: 'Impression & UV (`js_ys`)',
      cny: quote.printCostCny,
      colorText: 'text-blue-300',
      borderClass: 'border-blue-500/25',
      badgeBg: 'bg-blue-500/10 text-blue-300',
      note: `${quote.imposition.webPoses}×${quote.imposition.cylinderPoses} poses · ${quote.technology === 'gravure' ? `${quote.cylinderCount} coul.` : 'Indigo'}`
    },
    {
      num: '3',
      title: 'Contrecollage (`js_fh`)',
      cny: quote.laminationCostCny,
      colorText: 'text-purple-300',
      borderClass: 'border-purple-500/25',
      badgeBg: 'bg-purple-500/10 text-purple-300',
      note: `${quote.imposition.laminationPasses} passe(s) · ${quote.imposition.laminationMethodLabel.split(' ')[1] || 'sec'}`
    },
    {
      num: '4',
      title: 'Façonnage & Zip (`js_zd`)',
      cny: quote.bagMakingCostCny,
      colorText: 'text-pink-300',
      borderClass: 'border-pink-500/25',
      badgeBg: 'bg-pink-500/10 text-pink-300',
      note: `${quote.imposition.bagMakingMeters} m · ${quote.imposition.unwindingMode}`
    },
    {
      num: '5',
      title: 'Accessoires & Cartons (`js_qt`)',
      cny: quote.accessoriesCostCny,
      colorText: 'text-amber-300',
      borderClass: 'border-amber-500/25',
      badgeBg: 'bg-amber-500/10 text-amber-300',
      note: `${quote.accessoryBreakdown.length} poste(s) · ${quote.weightTotalKg} kg`
    },
    {
      num: '6',
      title: 'Moules & Cylindres (`版费/mjf`)',
      cny: quote.dieCutPlateCostCny + quote.cylindersCostCny,
      colorText: 'text-rose-400',
      borderClass: 'border-rose-500/25',
      badgeBg: 'bg-rose-500/10 text-rose-300',
      note: quote.cylindersCostCny > 0
        ? `${quote.cylinderCount}×${quote.imposition.singleCylinderCostCny}¥`
        : quote.dieCutPlateCostCny > 0 ? `Moule 463.5¥` : '0 ¥ cliché'
    },
    {
      num: '7',
      title: 'Urgence, Fret & Manuel (`yf`)',
      cny: quote.rushFeeCny + quote.shippingCostCny + quote.extraFeeCny,
      colorText: 'text-emerald-300',
      borderClass: 'border-emerald-500/25',
      badgeBg: 'bg-emerald-500/10 text-emerald-300',
      note: `Urg: ${quote.rushFeeCny}¥ · Port: ${quote.shippingCostCny}¥`
    },
    {
      num: '8',
      title: 'TVA (+8%) & Plancher Usine',
      cny: quote.taxCostCny,
      colorText: 'text-indigo-300',
      borderClass: 'border-indigo-500/25',
      badgeBg: 'bg-indigo-500/10 text-indigo-300',
      note: `Plancher: +${quote.imposition.factoryMinProfitCny}¥ (×${quote.imposition.factoryTierMultiplier})`
    }
  ];

  return (
    <div className="space-y-4">
      {/* ================================================================= */}
      {/* BLOC A : GRILLE ULTRA-DÉTAILLÉE DES 8 POSTES USINE                */}
      {/* ================================================================= */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Décomposition Exacte Usine (`suanfa.js` & Hélio)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/25 tabular-nums">
              {quote.imposition.totalRotations.toLocaleString('fr-FR')} tours
            </span>
            <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/25 tabular-nums">
              {quote.totalBasisGsm} g/m² · {quote.weightUnitGrams.toFixed(2)} g/u · {quote.weightTotalKg} kg
            </span>
          </div>
        </div>

        {/* 8 Cartes Postes Color-Coded */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cards.map((c) => {
            const eur = c.cny * CNY_TO_EUR_RATE;
            return (
              <div key={c.num} className={`bg-[#080d18] p-2.5 sm:p-3 rounded-xl border ${c.borderClass} flex flex-col justify-between`}>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-medium text-slate-400 leading-snug">
                    {c.num}. {c.title}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${c.badgeBg}`}>
                    {pct(c.cny)}%
                  </span>
                </div>
                <div className="mt-1.5">
                  <div className={`font-mono text-sm sm:text-base font-bold tabular-nums ${c.colorText}`}>
                    {displayCurrency === 'CNY' ? fmtCny(c.cny) : fmtEur(eur)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {displayCurrency === 'CNY' ? fmtEur(eur) : fmtCny(c.cny)} · {(eur / quote.resolvedQuantity).toFixed(4)} €/u
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 mt-1.5 truncate" title={c.note}>
                  {c.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* SOUS-DÉTAIL 1 : VENTILATION MATIÈRES COUCHE PAR COUCHE (`clk`) */}
        <div className="bg-[#080d18] border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Ventilation Matières Premières Couche par Couche (`clk` +3% perte)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Total Surface : {quote.imposition.totalFilmSqm} m² · Grammage : {quote.totalBasisGsm} g/m²
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase text-slate-500 border-b border-slate-800">
                  <th className="py-1.5 text-left">Couche</th>
                  <th className="py-1.5 text-left">Film (`clk`)</th>
                  <th className="py-1.5 text-right">Ép.</th>
                  <th className="py-1.5 text-right">g/m²</th>
                  <th className="py-1.5 text-right">¥/kg</th>
                  <th className="py-1.5 text-right">Masse</th>
                  <th className="py-1.5 text-right">Coût (+3%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 tabular-nums">
                {quote.layerBreakdown.map((layer) => (
                  <tr key={layer.slot + layer.code} className="hover:bg-slate-900/50">
                    <td className="py-1.5 pr-2 text-slate-400 font-sans text-[10px]">
                      <span className="text-slate-200 font-semibold">{layer.slot}</span> · {layer.roleFr}
                    </td>
                    <td className="py-1.5 pr-2 text-cyan-200 font-semibold">{layer.code}</td>
                    <td className="py-1.5 text-right text-slate-300">{layer.thicknessUm}µm</td>
                    <td className="py-1.5 text-right text-slate-300">{layer.gsm.toFixed(1)}</td>
                    <td className="py-1.5 text-right text-slate-400">{layer.pricePerKgCny}¥</td>
                    <td className="py-1.5 text-right text-amber-300">{layer.weightTotalKg} kg</td>
                    <td className="py-1.5 text-right font-bold text-cyan-300">
                      {layer.costWithWasteCny.toFixed(2)} ¥ <span className="text-slate-500 font-normal">({layer.costEur.toFixed(2)}€)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SOUS-DÉTAIL 2 : ACCESSOIRES & EMBALLAGE (`js_qt`) SI ACTIFS */}
        {quote.accessoryBreakdown.length > 0 && (
          <div className="bg-[#080d18] border border-amber-500/20 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300">
                Ventilation Accessoires, Options & Emballage (`js_qt` · {fmtCny(quote.accessoriesCostCny)})
              </span>
              <span className="text-[10px] font-mono text-slate-400">+3% marge perte incl.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quote.accessoryBreakdown.map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-[#0c1322] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px]">
                  <div className="min-w-0 pr-2">
                    <div className="text-slate-200 font-medium truncate">{item.label}</div>
                    <div className="text-[9px] font-mono text-slate-500 truncate">{item.formulaNote}</div>
                  </div>
                  <div className="text-right font-mono shrink-0 tabular-nums">
                    <span className="text-amber-300 font-bold">{item.costCny.toFixed(2)} ¥</span>
                    <span className="text-[9px] text-slate-500 block">{item.costEur.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOUS-DÉTAIL 3 : IMPOSITION MACHINE & GÂCHE DÉTAILLÉE (`sh_jchs` / `gg_lzs`) */}
        <div className="bg-[#080d18] border border-slate-800 rounded-xl p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              <span>Imposition Machine, Gâche & Cylindres</span>
            </span>
            {!quote.imposition.isSizeValid && (
              <span className="text-[10px] text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {quote.imposition.sizeAlert}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono tabular-nums">
            <div className="bg-[#0c1322] border border-slate-800 rounded-lg p-2">
              <span className="text-[9px] text-slate-500 block font-sans">Poses / Tour Machine</span>
              <span className="text-cyan-300 font-bold">{quote.imposition.webPoses} laize × {quote.imposition.cylinderPoses} cyl</span>
            </div>
            <div className="bg-[#0c1322] border border-slate-800 rounded-lg p-2">
              <span className="text-[9px] text-slate-500 block font-sans">Laize Bobine & Métrage</span>
              <span className="text-indigo-300 font-bold">{quote.gacheBreakdown.webWidthUsedCm} cm · {quote.imposition.linearMeters} m</span>
            </div>
            <div className="bg-[#0c1322] border border-slate-800 rounded-lg p-2">
              <span className="text-[9px] text-slate-500 block font-sans">Gâche Totale Atelier</span>
              <span className="text-amber-300 font-bold">+{quote.gacheBreakdown.wasteMetersTotal} m</span>
            </div>
            <div className="bg-[#0c1322] border border-slate-800 rounded-lg p-2">
              <span className="text-[9px] text-slate-500 block font-sans">Livraison Estimée</span>
              <span className="text-emerald-300 font-bold">{quote.imposition.estimatedShipDate} ({quote.imposition.leadTimeDays}j)</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-slate-800/60 tabular-nums">
            <span>• Tours utiles : <strong className="text-slate-200">{quote.gacheBreakdown.baseRotations}</strong></span>
            <span>• Démarrage (`sh_jchs`) : <strong className="text-slate-200">+{quote.gacheBreakdown.startupRotations} tr</strong></span>
            <span>• Calage impr. (`sh_ys`) : <strong className="text-slate-200">+{quote.gacheBreakdown.printSetupRotations} tr</strong></span>
            <span>• Multi-SKU (`sh_ks`) : <strong className="text-slate-200">+{quote.gacheBreakdown.multiSkuRotations} tr</strong></span>
            <span>• Façonnage (`sh_zd`) : <strong className="text-slate-200">+{quote.gacheBreakdown.bagWasteRotations} tr</strong></span>
            {quote.technology === 'gravure' && (
              <span>• Cylindre hélio : <strong className="text-rose-300">{quote.imposition.cylinderWidthCm} × {quote.imposition.cylinderCircumferenceCm} cm × 0.15¥ = {quote.imposition.singleCylinderCostCny} ¥/coul.</strong></span>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* BLOC B : FICHES AUTOMATIQUES COPIABLES (FR & ZH) + BOUTON PDF      */}
        {/* ================================================================= */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Fiches Automatisées (`报价单 Spec`)</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onCopyQuote('fr')}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/25 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedBanner === 'fr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBanner === 'fr' ? 'Devis FR Copié !' : 'Copier Devis (FR)'}</span>
              </button>
              <button
                type="button"
                onClick={() => onCopyQuote('zh')}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-[11px] font-bold text-indigo-200 hover:bg-indigo-500/25 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedBanner === 'zh' ? <Check className="w-3.5 h-3.5" /> : <PackageCheck className="w-3.5 h-3.5" />}
                <span>{copiedBanner === 'zh' ? 'Bon ZH Copié !' : 'Bon Usine (ZH)'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenProposal}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold hover:bg-emerald-400 flex items-center gap-1.5 transition shadow-glow-emerald cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Devis Client PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
            <pre className="bg-[#060913] border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {quote.imposition.quoteSpecFr}
            </pre>
            <pre className="bg-[#060913] border border-indigo-500/25 rounded-xl p-3 text-[10px] font-mono text-indigo-200/90 whitespace-pre-wrap leading-relaxed">
              {quote.imposition.quoteSpecZh}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

