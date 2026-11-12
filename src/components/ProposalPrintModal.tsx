import React, { useState } from 'react';
import { BAG_TYPES_CATALOG, BagDimensions, QuoteBreakdown, SINGLE_LAYER_IMAGE_URL } from '../pricingEngine';
import { Printer, X, Copy, Check } from 'lucide-react';

interface ProposalPrintModalProps {
  open: boolean;
  onClose: () => void;
  dim: BagDimensions;
  quote: QuoteBreakdown;
}

export const ProposalPrintModal: React.FC<ProposalPrintModalProps> = ({
  open,
  onClose,
  dim,
  quote
}) => {
  const [clientName, setClientName] = useState('Maison Cliente');
  const [projectRef, setProjectRef] = useState(() => `DEV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}`);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const bagDef = BAG_TYPES_CATALOG.find(b => b.key === dim.bagType) || BAG_TYPES_CATALOG[0];
  const imgUrl = dim.customLayers?.isSingleLayer ? SINGLE_LAYER_IMAGE_URL : bagDef.imageUrl;

  const handleCopyText = () => {
    const header = `DEVIS ${projectRef} — Pour ${clientName}\n`;
    navigator.clipboard?.writeText(header + '\n' + quote.imposition.quoteSpecFr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden my-auto print-only-sheet">
        {/* Barre d'actions modal Obsidian (cachée à l'impression) */}
        <div className="no-print px-5 py-3.5 bg-[#0c1322] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Nom du client"
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-xs font-medium text-slate-100 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={projectRef}
              onChange={e => setProjectRef(e.target.value)}
              placeholder="Référence devis"
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-xs font-mono text-cyan-300 w-36 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-xs font-semibold text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              {copied ? 'Copié' : 'Copier texte'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feuille Éditoriale Client Blanche (optimisée impression A4) */}
        <div className="p-6 sm:p-10 space-y-6 bg-white text-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 font-bold">
                Mylar Pro · Proposition Packaging Sur-Mesure
              </p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 mt-1">
                Devis n° {projectRef}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                À l&apos;attention de <strong className="text-slate-900">{clientName}</strong>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 font-mono">
              <div>Émis le {new Date().toLocaleDateString('fr-FR')}</div>
              <div>Validité de l&apos;offre : 15 jours</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 bg-[#F4F1EA] rounded-xl p-4 border border-slate-200 flex items-center justify-center aspect-square">
              <img src={imgUrl} alt={bagDef.nameFr} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="sm:col-span-8 space-y-2.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Format</span>
                <span className="font-semibold text-slate-900">{bagDef.nameFr}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Dimensions</span>
                <span className="font-mono font-semibold text-slate-900">
                  L {dim.widthCm} × H {dim.heightCm} {bagDef.hasBottomGusset ? `+ Fond ${dim.bottomCm}` : bagDef.hasSideGusset ? `× Soufflet ${dim.sideGussetCm ?? dim.bottomCm}` : ''} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Impression</span>
                <span className="font-semibold text-slate-900">
                  {dim.technology === 'gravure' ? `Héliogravure (${quote.cylinderCount} couleurs)` : 'Numérique Haute Définition'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 gap-4">
                <span className="text-slate-500 shrink-0">Complexe Barrière</span>
                <span className="font-medium text-slate-900 text-right">{quote.imposition.layersSummaryFr}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Volume & Variantes</span>
                <span className="font-mono font-semibold text-slate-900">
                  {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs ({dim.skuCount || 1} visuel{(dim.skuCount || 1) > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Délai de fabrication</span>
                <span className="font-semibold text-slate-900">
                  {quote.imposition.leadTimeDays} jours ouvrés (expédition est. {quote.imposition.estimatedShipDate})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Prix Unitaire HT</span>
              <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {quote.resalePriceUnitEur.toFixed(3)} € <span className="text-sm font-normal text-slate-500">/ sac</span>
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-slate-500 block">Montant Total Commande HT</span>
              <span className="font-serif text-3xl font-bold text-emerald-700 tabular-nums">
                {quote.resalePriceTotalEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
            Poids estimé de la production : ~{quote.weightTotalKg} kg ({quote.weightUnitGrams.toFixed(2)} g/unité · {quote.totalBasisGsm} g/m²). Tolérance industrielle de livraison ±10 %. Les visuels fournis doivent être préparés au format vectoriel (AI / PDF CMJN avec 3 mm de fond perdu).
          </div>
        </div>
      </div>
    </div>
  );
};
