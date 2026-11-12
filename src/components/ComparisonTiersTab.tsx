import React, { useMemo } from 'react';
import {
  BagDimensions,
  calculateMylarQuote,
  calculateTierMatrix,
  PrintTechnology
} from '../pricingEngine';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ArrowUpRight, TrendingDown } from 'lucide-react';

interface ComparisonTiersTabProps {
  baseDim: BagDimensions;
  onSelectTier: (technology: PrintTechnology, quantity: number) => void;
}

const CROSSOVER_VOLUMES = [500, 1000, 2500, 5000, 7500, 10000, 15000, 25000, 50000, 100000];

export const ComparisonTiersTab: React.FC<ComparisonTiersTabProps> = ({
  baseDim,
  onSelectTier
}) => {
  const digitalTiers = useMemo(
    () => calculateTierMatrix({ ...baseDim, technology: 'digital' }, [250, 500, 1000, 2500, 5000, 10000]),
    [baseDim]
  );

  const gravureTiers = useMemo(
    () => calculateTierMatrix({ ...baseDim, technology: 'gravure' }, [5000, 10000, 20000, 30000, 50000, 100000]),
    [baseDim]
  );

  const chartData = useMemo(() => {
    return CROSSOVER_VOLUMES.map((qty) => {
      const dig = calculateMylarQuote({ ...baseDim, technology: 'digital', quantity: qty });
      const grav = calculateMylarQuote({ ...baseDim, technology: 'gravure', quantity: qty });
      return {
        label: qty >= 1000 ? `${qty / 1000}k` : String(qty),
        qty,
        digitalUnit: Number(dig.resalePriceUnitEur.toFixed(3)),
        gravureUnit: Number(grav.resalePriceUnitEur.toFixed(3)),
        digitalCost: Number(dig.factoryCostUnitEur.toFixed(3)),
        gravureCost: Number(grav.factoryCostUnitEur.toFixed(3))
      };
    });
  }, [baseDim]);

  const breakEvenPoint = chartData.find((d) => d.gravureUnit <= d.digitalUnit);

  return (
    <div className="space-y-6">
      {/* En-tête Stratégique & Courbe de Seuil de Rentabilité */}
      <div className="bg-white border border-maison-border rounded-2xl p-6 shadow-atelier">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-maison-brass font-semibold">
              Arbitrage Industriel
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-maison-ink mt-1">
              Point de Bascule : Numérique vs Héliogravure
            </h2>
            <p className="text-sm text-maison-slate mt-1">
              Comparaison du prix unitaire client (cylindres cuivre amortis inclus) selon la volumétrie commandée.
            </p>
          </div>
          {breakEvenPoint && (
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-maison-brassLight/70 border border-[#E3D2B4] shrink-0">
              <TrendingDown className="w-5 h-5 text-maison-brass shrink-0" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5928]">
                  Seuil Héliogravure Rentable
                </div>
                <div className="font-mono text-base font-semibold text-maison-ink tabular-nums">
                  À partir de {breakEvenPoint.qty.toLocaleString('fr-FR')} pièces ({breakEvenPoint.gravureUnit.toFixed(3)} €/u)
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="digGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#171614" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#171614" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gravGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9E7840" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#9E7840" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DFD3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#5A564E', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `${v.toFixed(2)}€`}
                tick={{ fill: '#5A564E', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E4DFD3',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(23,22,20,0.08)',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: any) => [`${Number(val).toFixed(3)} €/u`, name]}
                labelFormatter={(l) => `Volume : ${l} sacs`}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Area
                type="monotone"
                dataKey="digitalUnit"
                name="Numérique HD (€/u)"
                stroke="#171614"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#digGrad)"
              />
              <Area
                type="monotone"
                dataKey="gravureUnit"
                name="Héliogravure Cuivre (€/u)"
                stroke="#9E7840"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gravGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grilles Comparatives Cliquables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grille Numérique */}
        <div className="bg-white border border-maison-border rounded-2xl overflow-hidden shadow-atelier">
          <div className="px-5 py-4 border-b border-maison-border flex items-center justify-between bg-maison-canvas/40">
            <div>
              <h3 className="text-sm font-semibold text-maison-ink">Grille Numérique HP Indigo</h3>
              <p className="text-xs text-maison-muted">0 € de frais de cliché · Multi-SKU flexible</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-maison-emeraldLight text-maison-emerald text-[11px] font-semibold">
              Courtes & Moyennes Séries
            </span>
          </div>
          <div className="divide-y divide-maison-border">
            {digitalTiers.map((t) => (
              <button
                key={t.resolvedQuantity}
                type="button"
                onClick={() => onSelectTier('digital', t.resolvedQuantity)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-maison-canvas/60 transition-colors group"
              >
                <div>
                  <div className="font-mono text-sm font-semibold text-maison-ink tabular-nums">
                    {t.resolvedQuantity.toLocaleString('fr-FR')} pcs
                  </div>
                  <div className="text-[11px] text-maison-muted">
                    Usine {t.factoryCostUnitEur.toFixed(3)} €/u · Marge +{t.grossProfitTotalEur.toFixed(0)} €
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="font-mono text-sm font-semibold text-maison-ink tabular-nums">
                      {t.resalePriceUnitEur.toFixed(3)} € / u
                    </div>
                    <div className="text-[11px] font-mono text-maison-slate tabular-nums">
                      Total {t.resalePriceTotalEur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-maison-muted group-hover:text-maison-brass transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Grille Héliogravure */}
        <div className="bg-white border border-maison-border rounded-2xl overflow-hidden shadow-atelier">
          <div className="px-5 py-4 border-b border-maison-border flex items-center justify-between bg-maison-brassLight/40">
            <div>
              <h3 className="text-sm font-semibold text-maison-ink">Grille Héliogravure Industrielle</h3>
              <p className="text-xs text-maison-muted">
                {gravureTiers[0]?.cylinderCount || 6} cylindres ({(gravureTiers[0]?.cylindersCostCny || 0).toFixed(0)} ¥ inclus dans total)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-maison-brassLight border border-[#E3D2B4] text-[#7A5928] text-[11px] font-semibold">
              Grandes Séries
            </span>
          </div>
          <div className="divide-y divide-maison-border">
            {gravureTiers.map((t) => (
              <button
                key={t.resolvedQuantity}
                type="button"
                onClick={() => onSelectTier('gravure', t.resolvedQuantity)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-maison-canvas/60 transition-colors group"
              >
                <div>
                  <div className="font-mono text-sm font-semibold text-maison-ink tabular-nums">
                    {t.resolvedQuantity.toLocaleString('fr-FR')} pcs
                  </div>
                  <div className="text-[11px] text-maison-muted">
                    Usine {t.factoryCostUnitEur.toFixed(3)} €/u · Marge +{t.grossProfitTotalEur.toFixed(0)} €
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="font-mono text-sm font-semibold text-maison-brass tabular-nums">
                      {t.resalePriceUnitEur.toFixed(3)} € / u
                    </div>
                    <div className="text-[11px] font-mono text-maison-slate tabular-nums">
                      Total {t.resalePriceTotalEur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-maison-muted group-hover:text-maison-brass transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
