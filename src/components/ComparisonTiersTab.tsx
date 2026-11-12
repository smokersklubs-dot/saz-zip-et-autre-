import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { BagDimensions, calculateMylarQuote, calculateTierMatrix, QuoteBreakdown } from '../pricingEngine';
import { ArrowRightLeft, BarChart3, CheckCircle2, TrendingDown } from 'lucide-react';

interface ComparisonTiersTabProps {
  baseDim: Omit<BagDimensions, 'quantity'>;
  currentQuantity: number;
  currentTechnology: 'digital' | 'gravure';
  displayCurrency: 'EUR' | 'CNY';
  onApplyQuantityAndTech: (qty: number, tech: 'digital' | 'gravure') => void;
}

export const ComparisonTiersTab: React.FC<ComparisonTiersTabProps> = ({
  baseDim,
  currentQuantity,
  currentTechnology,
  displayCurrency,
  onApplyQuantityAndTech
}) => {
  const digitalTiers = useMemo(
    () => calculateTierMatrix({ ...baseDim, technology: 'digital' }, [250, 500, 1000, 2500, 5000, 10000]),
    [baseDim]
  );

  const gravureTiers = useMemo(
    () => calculateTierMatrix({ ...baseDim, technology: 'gravure' }, [5000, 10000, 20000, 30000, 50000, 100000]),
    [baseDim]
  );

  const currentBarTiers = currentTechnology === 'gravure' ? gravureTiers : digitalTiers;

  const breakEvenData = useMemo(() => {
    const quantities = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 35000, 50000];
    return quantities.map((q) => {
      const dig = calculateMylarQuote({ ...baseDim, technology: 'digital', quantity: q });
      const grav = calculateMylarQuote({ ...baseDim, technology: 'gravure', quantity: q });
      return {
        qty: q,
        label: q >= 1000 ? `${(q / 1000).toFixed(q % 1000 === 0 ? 0 : 1)}k` : `${q}`,
        digitalUnitEur: parseFloat(dig.resalePriceUnitEur.toFixed(3)),
        gravureUnitEur: parseFloat(grav.resalePriceUnitEur.toFixed(3)),
        digitalUnitCny: parseFloat(dig.resalePriceUnitCny.toFixed(3)),
        gravureUnitCny: parseFloat(grav.resalePriceUnitCny.toFixed(3))
      };
    });
  }, [baseDim]);

  const breakEvenPoint = useMemo(() => {
    return breakEvenData.find((d) => d.gravureUnitEur < d.digitalUnitEur) || null;
  }, [breakEvenData]);

  const barData = useMemo(() => {
    return currentBarTiers.map((q) => ({
      label: q.resolvedQuantity >= 1000 ? `${q.resolvedQuantity / 1000}k` : `${q.resolvedQuantity}`,
      saleEur: parseFloat(q.resalePriceUnitEur.toFixed(3)),
      catalogEur: parseFloat(q.beijincaiCatalogUnitEur.toFixed(3)),
      factoryEur: parseFloat(q.factoryCostUnitEur.toFixed(3))
    }));
  }, [currentBarTiers]);

  const renderTierTable = (title: string, tech: 'digital' | 'gravure', rows: QuoteBreakdown[], accent: 'cyan' | 'indigo') => (
    <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl overflow-hidden shadow-cockpit">
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${accent === 'cyan' ? 'text-cyan-400' : 'text-indigo-400'}`}>
            {tech === 'digital' ? 'HP Indigo · Sans Cliché' : 'Rotative Hélio · Cylindres'}
          </span>
          <h3 className="font-serif text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Cliquer pour appliquer</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-[#080d18] text-[10px] uppercase text-slate-400 font-semibold">
              <th className="py-2.5 px-3">Volume</th>
              <th className="py-2.5 px-3 text-right">Coût Usine</th>
              <th className="py-2.5 px-3 text-right">Prix Vente</th>
              <th className="py-2.5 px-3 text-right">Total HT</th>
              <th className="py-2.5 px-3 text-right">Marge Nette</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 tabular-nums">
            {rows.map((r) => {
              const isSelected = currentTechnology === tech && currentQuantity === r.resolvedQuantity;
              const isCny = displayCurrency === 'CNY';
              return (
                <tr
                  key={`${tech}-${r.resolvedQuantity}`}
                  onClick={() => onApplyQuantityAndTech(r.resolvedQuantity, tech)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? accent === 'cyan'
                        ? 'bg-cyan-500/15 text-cyan-100'
                        : 'bg-indigo-500/15 text-indigo-100'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold flex items-center gap-1.5">
                    {isSelected && <CheckCircle2 className={`w-3.5 h-3.5 ${accent === 'cyan' ? 'text-cyan-400' : 'text-indigo-400'}`} />}
                    {r.resolvedQuantity.toLocaleString('fr-FR')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">
                    {isCny ? `${r.factoryCostUnitCny.toFixed(3)} ¥` : `${r.factoryCostUnitEur.toFixed(3)} €`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-300">
                    {isCny ? `${r.resalePriceUnitCny.toFixed(3)} ¥` : `${r.resalePriceUnitEur.toFixed(3)} €`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                    {isCny ? `${r.resalePriceTotalCny.toFixed(0)} ¥` : `${r.resalePriceTotalEur.toFixed(0)} €`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                    +{isCny ? `${r.grossProfitTotalCny.toFixed(0)} ¥` : `${r.grossProfitTotalEur.toFixed(0)} €`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* GRAPHIQUE BARRES DÉGRESSIVITÉ ACTIVE */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Dégressivité Unitaire ({currentTechnology === 'gravure' ? 'Héliogravure' : 'Numérique'})
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Vente vs Catalogue `bj03` vs Coût Usine (€/pc)</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#080d18', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#e2e8f0' }}
                formatter={(val: any) => [`${Number(val).toFixed(3)} €/pc`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Bar dataKey="saleEur" name="Votre Prix Vente" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="catalogEur" name="Catalogue Usine bj03" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="factoryEur" name="Coût Pur Atelier" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COURBE SEUIL DE RENTABILITÉ NUMÉRIQUE VS HÉLIOGRAVURE */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-cockpit">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5" /> Seuil de Bascule Industriel
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-white">
              Courbe Croisée : Numérique HD vs Héliogravure
            </h3>
          </div>
          {breakEvenPoint && (
            <div className="bg-emerald-500/15 border border-emerald-500/35 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <TrendingDown className="w-4 h-4" />
              <span>Hélio rentable dès {breakEvenPoint.qty.toLocaleString('fr-FR')} pcs ({breakEvenPoint.gravureUnitEur.toFixed(3)}€/u)</span>
            </div>
          )}
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={breakEvenData} margin={{ top: 10, right: 12, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="digGradDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gravGradDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => (displayCurrency === 'CNY' ? `${v}¥` : `${v}€`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#080d18', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#e2e8f0' }}
                formatter={(val: any, name: string) => [
                  `${Number(val).toFixed(3)} ${displayCurrency === 'CNY' ? '¥' : '€'}/pc`,
                  name
                ]}
              />
              <Area
                type="monotone"
                dataKey={displayCurrency === 'CNY' ? 'digitalUnitCny' : 'digitalUnitEur'}
                name="Numérique (0 cliché)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#digGradDark)"
              />
              <Area
                type="monotone"
                dataKey={displayCurrency === 'CNY' ? 'gravureUnitCny' : 'gravureUnitEur'}
                name="Héliogravure (cyl. inclus)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gravGradDark)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEUX TABLES CLIQUABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {renderTierTable('Grille Numérique HP Indigo', 'digital', digitalTiers, 'cyan')}
        {renderTierTable('Grille Héliogravure Industrielle', 'gravure', gravureTiers, 'indigo')}
      </div>
    </div>
  );
};
