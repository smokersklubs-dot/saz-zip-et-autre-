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
    <div className="fixed inset-0 z-50 bg-[#171614]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-maison-border rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden my-auto print-only-sheet">
        {/* Barre d'actions modal (cachée à l'impression) */}
        <div className="no-print px-5 py-3.5 bg-maison-canvas border-b border-maison-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Nom du client"
              className="px-3 py-1.5 rounded-lg border border-maison-border bg-white text-xs font-medium text-maison-ink"
            />
            <input
              type="text"
              value={projectRef}
              onChange={e => setProjectRef(e.target.value)}
              placeholder="Référence devis"
              className="px-3 py-1.5 rounded-lg border border-maison-border bg-white text-xs font-mono text-maison-ink w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maison-border bg-white text-xs font-semibold text-maison-ink hover:bg-maison-stone"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-maison-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié' : 'Copier texte'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#171614] text-white text-xs font-semibold hover:bg-maison-brass transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-maison-slate hover:text-maison-ink hover:bg-maison-stone"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feuille Éditoriale Client */}
        <div className="p-7 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-maison-border">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-maison-brass font-semibold">
                Maison Mylar · Proposition Packaging
              </p>
              <h2 className="font-serif text-3xl font-semibold text-maison-ink mt-1">
                Devis n° {projectRef}
              </h2>
              <p className="text-sm text-maison-slate mt-1">
                À l'attention de <strong className="text-maison-ink">{clientName}</strong>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-maison-muted font-mono">
              <div>Émis le {new Date().toLocaleDateString('fr-FR')}</div>
              <div>Validité de l'offre : 15 jours</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 bg-[#F4F1EA] rounded-xl p-4 border border-maison-border flex items-center justify-center aspect-square">
              <img src={imgUrl} alt={bagDef.nameFr} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="sm:col-span-8 space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-maison-border">
                <span className="text-maison-muted">Format</span>
                <span className="font-semibold text-maison-ink">{bagDef.nameFr}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-maison-border">
                <span className="text-maison-muted">Dimensions</span>
                <span className="font-mono font-semibold text-maison-ink">
                  L {dim.widthCm} × H {dim.heightCm} {bagDef.hasBottomGusset ? `+ Fond ${dim.bottomCm}` : bagDef.hasSideGusset ? `× Soufflet ${dim.sideGussetCm ?? dim.bottomCm}` : ''} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-maison-border">
                <span className="text-maison-muted">Impression</span>
                <span className="font-semibold text-maison-ink">
                  {dim.technology === 'gravure' ? `Héliogravure (${quote.cylinderCount} couleurs)` : 'Numérique Haute Définition'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-maison-border">
                <span className="text-maison-muted">Complexe Barrière</span>
                <span className="font-medium text-maison-ink text-right">{quote.imposition.layersSummaryFr}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-maison-border">
                <span className="text-maison-muted">Volume & Variantes</span>
                <span className="font-mono font-semibold text-maison-ink">
                  {quote.resolvedQuantity.toLocaleString('fr-FR')} pcs ({dim.skuCount || 1} visuel{(dim.skuCount || 1) > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-maison-muted">Délai de fabrication</span>
                <span className="font-semibold text-maison-ink">
                  {quote.imposition.leadTimeDays} jours ouvrés (expédition est. {quote.imposition.estimatedShipDate})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-maison-canvas border border-maison-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-maison-muted block">Prix Unitaire</span>
              <span className="font-mono text-2xl font-semibold text-maison-ink tabular-nums">
                {quote.resalePriceUnitEur.toFixed(3)} € <span className="text-sm font-normal text-maison-slate">/ sac HT</span>
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-maison-muted block">Montant Total Commande</span>
              <span className="font-serif text-3xl font-semibold text-maison-ink tabular-nums">
                {quote.resalePriceTotalEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          </div>

          <div className="text-[11px] text-maison-muted leading-relaxed pt-2 border-t border-maison-border">
            Poids estimé de la production : ~{quote.weightTotalKg} kg ({quote.weightUnitGrams.toFixed(2)} g/unité). Tolérance industrielle de livraison ±10 %. Les visuels fournis doivent être préparés au format vectoriel (AI / PDF CMJN avec 3 mm de fond perdu).
          </div>
        </div>
      </div>
    </div>
  );
};
