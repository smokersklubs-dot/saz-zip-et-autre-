import React, { useState } from 'react';
import {
  BAG_TYPES_CATALOG,
  BagTypeKey,
  calcBagUnwindingBreakdown,
  calcDensityFromGsm,
  calcKgPriceFromSqm,
  calcMoqPieces,
  calcRollDiameterFromLength,
  calcRollLengthFromDiameter,
  calcRollLengthFromWeight,
  CNY_TO_EUR_RATE
} from '../pricingEngine';
import { Calculator, CircleDot, Layers, Ruler, Scale, ArrowRight } from 'lucide-react';

interface WorkshopToolsTabProps {
  defaultBagType: BagTypeKey;
  defaultWidthCm: number;
  defaultHeightCm: number;
  defaultGussetCm: number;
  defaultThicknessSilk: number;
  defaultQuantity: number;
  onApplyQuantityToQuote?: (qty: number) => void;
}

export const WorkshopToolsTab: React.FC<WorkshopToolsTabProps> = ({
  defaultBagType,
  defaultWidthCm,
  defaultHeightCm,
  defaultGussetCm,
  defaultThicknessSilk,
  defaultQuantity,
  onApplyQuantityToQuote
}) => {
  // 1. Poids Bobine -> Métrage
  const [rollWeightKg, setRollWeightKg] = useState(25);
  const [rollWidthCm, setRollWidthCm] = useState(74);
  const [rollLayerThicknessSilk, setRollLayerThicknessSilk] = useState(defaultThicknessSilk || 11.6);
  const [rollLayerDensity, setRollLayerDensity] = useState(1.04);

  // 2. Métrage -> Diamètre Extérieur
  const [coreDiaMm, setCoreDiaMm] = useState(76);
  const [lenToDiaThickness, setLenToDiaThickness] = useState(defaultThicknessSilk || 11.6);
  const [lenToDiaMeters, setLenToDiaMeters] = useState(1000);

  // 3. Diamètre Extérieur -> Métrage
  const [outerDiaMm, setOuterDiaMm] = useState(320);
  const [diaToLenCoreMm, setDiaToLenCoreMm] = useState(76);
  const [diaToLenThickness, setDiaToLenThickness] = useState(defaultThicknessSilk || 11.6);

  // 4. Prix m² -> Prix kg
  const [sqmPriceCny, setSqmPriceCny] = useState(2.2);
  const [priceConvDensity, setPriceConvDensity] = useState(1.4);
  const [priceConvThickness, setPriceConvThickness] = useState(1.9);

  // 5. Grammage -> Densité
  const [gsmValue, setGsmValue] = useState(50);
  const [gsmThicknessSilk, setGsmThicknessSilk] = useState(6.5);

  // 6. Calculateur MOQ Usine
  const [moqBagType, setMoqBagType] = useState<BagTypeKey>(defaultBagType);
  const [moqMinWidth, setMoqMinWidth] = useState(74);
  const [moqRunMeters, setMoqRunMeters] = useState(3000);
  const [moqW, setMoqW] = useState(defaultWidthCm);
  const [moqH, setMoqH] = useState(defaultHeightCm);
  const [moqG, setMoqG] = useState(defaultGussetCm);
  const [moqWaste, setMoqWaste] = useState(5);

  // 7. Calculateur Débit & Laize Atelier
  const [uwBagType, setUwBagType] = useState<BagTypeKey>(defaultBagType);
  const [uwQty, setUwQty] = useState(Math.max(5000, defaultQuantity));
  const [uwW, setUwW] = useState(defaultWidthCm);
  const [uwH, setUwH] = useState(defaultHeightCm);
  const [uwG, setUwG] = useState(defaultGussetCm);
  const [uwMinWeb, setUwMinWeb] = useState(74);
  const [uwPasses, setUwPasses] = useState(2);

  const resWeightToLen = calcRollLengthFromWeight(rollWeightKg, rollWidthCm, [
    { thicknessSilk: rollLayerThicknessSilk, density: rollLayerDensity }
  ]);
  const resLenToDia = calcRollDiameterFromLength(coreDiaMm, lenToDiaThickness, lenToDiaMeters);
  const resDiaToLen = calcRollLengthFromDiameter(outerDiaMm, diaToLenCoreMm, diaToLenThickness);
  const resSqmToKg = calcKgPriceFromSqm(sqmPriceCny, priceConvDensity, priceConvThickness);
  const resGsmToDensity = calcDensityFromGsm(gsmValue, gsmThicknessSilk);
  const resMoq = calcMoqPieces({
    bagType: moqBagType,
    minWebWidthCm: moqMinWidth,
    runMeters: moqRunMeters,
    widthCm: moqW,
    heightCm: moqH,
    gussetCm: moqG,
    wastePercent: moqWaste
  });
  const resUnwind = calcBagUnwindingBreakdown({
    bagType: uwBagType,
    quantity: uwQty,
    widthCm: uwW,
    heightCm: uwH,
    gussetCm: uwG,
    minWebWidthCm: uwMinWeb,
    laminationPasses: uwPasses
  });

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-700/80 bg-[#080d18] text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400';

  return (
    <div className="space-y-5">
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-cockpit">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-400 font-bold">
          Suite Technique Convertisseur (`suanfa` · `tools`)
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-1">
          7 Outils de Calcul Atelier & Laize Film
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Conversions directes issues des abaques de production pour bobines, masses volumiques, diamètres de mandrin, MOQ et métrage matière.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Outil 1 : Poids Bobine -> Métrage */}
        <div className="bg-[#0c1322] border border-cyan-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Scale className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">1 · Poids Bobine → Longueur</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Poids net (kg)</span>
                <input
                  type="number"
                  value={rollWeightKg}
                  onChange={e => setRollWeightKg(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Laize bobine (cm)</span>
                <input
                  type="number"
                  value={rollWidthCm}
                  onChange={e => setRollWidthCm(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Épaisseur (1丝=10µm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={rollLayerThicknessSilk}
                  onChange={e => setRollLayerThicknessSilk(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Densité moy. (g/cm³)</span>
                <input
                  type="number"
                  step="0.01"
                  value={rollLayerDensity}
                  onChange={e => setRollLayerDensity(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Longueur estimée</span>
              <span className="font-mono text-2xl font-bold text-cyan-300 tabular-nums">
                {resWeightToLen.lengthMeters.toLocaleString('fr-FR')} m
              </span>
            </div>
            <span className="text-xs font-mono text-amber-300">{resWeightToLen.basisGsm} g/m²</span>
          </div>
        </div>

        {/* Outil 2 : Longueur -> Diamètre Bobine */}
        <div className="bg-[#0c1322] border border-indigo-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-3">
              <CircleDot className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">2 · Longueur → Diamètre</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1 col-span-2">
                <span className="text-slate-400 font-medium">Métrage bobiné (m)</span>
                <input
                  type="number"
                  value={lenToDiaMeters}
                  onChange={e => setLenToDiaMeters(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Diam. mandrin (mm)</span>
                <input
                  type="number"
                  value={coreDiaMm}
                  onChange={e => setCoreDiaMm(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Épaisseur (丝)</span>
                <input
                  type="number"
                  step="0.1"
                  value={lenToDiaThickness}
                  onChange={e => setLenToDiaThickness(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Diamètre extérieur total</span>
              <span className="font-mono text-2xl font-bold text-indigo-300 tabular-nums">
                {resLenToDia.outerDiameterMm} mm
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300">Paroi {resLenToDia.wallThicknessMm} mm</span>
          </div>
        </div>

        {/* Outil 3 : Diamètre -> Longueur Bobine */}
        <div className="bg-[#0c1322] border border-purple-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Ruler className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">3 · Diamètre → Longueur</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1 col-span-2">
                <span className="text-slate-400 font-medium">Diamètre extérieur mesuré (mm)</span>
                <input
                  type="number"
                  value={outerDiaMm}
                  onChange={e => setOuterDiaMm(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Diam. mandrin (mm)</span>
                <input
                  type="number"
                  value={diaToLenCoreMm}
                  onChange={e => setDiaToLenCoreMm(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Épaisseur (丝)</span>
                <input
                  type="number"
                  step="0.1"
                  value={diaToLenThickness}
                  onChange={e => setDiaToLenThickness(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Métrage restant en bobine</span>
              <span className="font-mono text-2xl font-bold text-purple-300 tabular-nums">
                {resDiaToLen.lengthMeters.toLocaleString('fr-FR')} m
              </span>
            </div>
          </div>
        </div>

        {/* Outil 4 : Prix m² -> Prix kg */}
        <div className="bg-[#0c1322] border border-emerald-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">4 · Prix au m² → Prix au kg</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1 col-span-2">
                <span className="text-slate-400 font-medium">Tarif surface (¥ / m²)</span>
                <input
                  type="number"
                  step="0.05"
                  value={sqmPriceCny}
                  onChange={e => setSqmPriceCny(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Densité (g/cm³)</span>
                <input
                  type="number"
                  step="0.01"
                  value={priceConvDensity}
                  onChange={e => setPriceConvDensity(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Épaisseur (丝)</span>
                <input
                  type="number"
                  step="0.1"
                  value={priceConvThickness}
                  onChange={e => setPriceConvThickness(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Équivalent poids</span>
              <span className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
                {resSqmToKg.pricePerKgCny} ¥/kg
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {resSqmToKg.pricePerKgEur} €/kg · {resSqmToKg.gsm} gsm
            </span>
          </div>
        </div>

        {/* Outil 5 : Grammage -> Densité */}
        <div className="bg-[#0c1322] border border-amber-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">5 · Grammage → Densité</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Grammage (g/m²)</span>
                <input
                  type="number"
                  value={gsmValue}
                  onChange={e => setGsmValue(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Épaisseur (丝)</span>
                <input
                  type="number"
                  step="0.1"
                  value={gsmThicknessSilk}
                  onChange={e => setGsmThicknessSilk(Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Calibre les papiers Kraft (50g → 8,5丝) ou films spéciaux non standards dans l&apos;éditeur 5 couches.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Densité résultante</span>
              <span className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
                {resGsmToDensity.density} g/cm³
              </span>
            </div>
          </div>
        </div>

        {/* Outil 6 : Calculateur MOQ Héliogravure */}
        <div className="bg-[#0c1322] border border-rose-500/25 rounded-2xl p-5 shadow-cockpit flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">6 · Minimum Usine (MOQ)</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <label className="space-y-1 col-span-2">
                <span className="text-slate-400 font-medium">Forme du sac</span>
                <select
                  value={moqBagType}
                  onChange={e => setMoqBagType(e.target.value as BagTypeKey)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 text-xs font-medium"
                >
                  {BAG_TYPES_CATALOG.map(b => (
                    <option key={b.key} value={b.key}>{b.nameFr}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Passe min (m)</span>
                <input
                  type="number"
                  step="500"
                  value={moqRunMeters}
                  onChange={e => setMoqRunMeters(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Laize min (cm)</span>
                <input
                  type="number"
                  value={moqMinWidth}
                  onChange={e => setMoqMinWidth(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">L × H + F (cm)</span>
                <div className="flex gap-1">
                  <input type="number" value={moqW} onChange={e => setMoqW(Number(e.target.value) || 1)} className="w-1/3 px-1.5 py-1.5 rounded border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
                  <input type="number" value={moqH} onChange={e => setMoqH(Number(e.target.value) || 1)} className="w-1/3 px-1.5 py-1.5 rounded border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
                  <input type="number" value={moqG} onChange={e => setMoqG(Number(e.target.value) || 0)} className="w-1/3 px-1.5 py-1.5 rounded border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
                </div>
              </label>
              <label className="space-y-1">
                <span className="text-slate-400 font-medium">Perte (%)</span>
                <input
                  type="number"
                  value={moqWaste}
                  onChange={e => setMoqWaste(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono"
                />
              </label>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">MOQ ({resMoq.webPoses} poses/laize)</span>
              <span className="font-mono text-xl font-bold text-rose-300 tabular-nums">
                {resMoq.moqPieces.toLocaleString('fr-FR')} pcs
              </span>
            </div>
            {onApplyQuantityToQuote && (
              <button
                type="button"
                onClick={() => onApplyQuantityToQuote(resMoq.moqPieces)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[11px] font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Utiliser <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Outil 7 Pleine Largeur : Débit Matière & Consommation par Poste */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-cockpit">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              7 · Calculateur Débit Matière & Gâche Atelier (下料计算)
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-white mt-0.5">
              Planification des métrages nets et pertes de calage (Impression · Contrecollage · Façonnage)
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 self-start sm:self-auto">
            {resUnwind.webPoses} poses · Laize bobine {resUnwind.totalWebWidthCm} cm
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-5 text-xs">
          <label className="space-y-1 col-span-2 sm:col-span-2">
            <span className="text-slate-400 font-medium">Type de sac</span>
            <select
              value={uwBagType}
              onChange={e => setUwBagType(e.target.value as BagTypeKey)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-medium"
            >
              {BAG_TYPES_CATALOG.map(b => (
                <option key={b.key} value={b.key}>{b.nameFr}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-slate-400 font-medium">Quantité (pcs)</span>
            <input type="number" step="500" value={uwQty} onChange={e => setUwQty(Number(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono" />
          </label>
          <label className="space-y-1">
            <span className="text-slate-400 font-medium">Laize machine (cm)</span>
            <input type="number" value={uwMinWeb} onChange={e => setUwMinWeb(Number(e.target.value) || 50)} className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono" />
          </label>
          <label className="space-y-1">
            <span className="text-slate-400 font-medium">L × H × Fond (cm)</span>
            <div className="flex gap-1">
              <input type="number" value={uwW} onChange={e => setUwW(Number(e.target.value) || 1)} className="w-1/3 px-1.5 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
              <input type="number" value={uwH} onChange={e => setUwH(Number(e.target.value) || 1)} className="w-1/3 px-1.5 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
              <input type="number" value={uwG} onChange={e => setUwG(Number(e.target.value) || 0)} className="w-1/3 px-1.5 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono text-center" />
            </div>
          </label>
          <label className="space-y-1">
            <span className="text-slate-400 font-medium">Passes contrecollage</span>
            <input type="number" min={0} max={4} value={uwPasses} onChange={e => setUwPasses(Number(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-[#080d18] text-slate-100 font-mono" />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800">
            <div className="text-[11px] text-slate-400">Métrage Net Utile</div>
            <div className="font-mono text-lg font-bold text-cyan-300 mt-1 tabular-nums">
              {resUnwind.initialMeters.toLocaleString('fr-FR')} m
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800">
            <div className="text-[11px] text-slate-400">Gâche Impression</div>
            <div className="font-mono text-lg font-bold text-blue-300 mt-1 tabular-nums">
              +{resUnwind.printWasteMeters.toLocaleString('fr-FR')} m
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800">
            <div className="text-[11px] text-slate-400">Gâche Contrecollage</div>
            <div className="font-mono text-lg font-bold text-purple-300 mt-1 tabular-nums">
              +{resUnwind.laminationWasteMeters.toLocaleString('fr-FR')} m
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080d18] border border-slate-800">
            <div className="text-[11px] text-slate-400">Gâche Façonnage</div>
            <div className="font-mono text-lg font-bold text-pink-300 mt-1 tabular-nums">
              +{resUnwind.bagMakingWasteMeters.toLocaleString('fr-FR')} m
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-emerald-300 font-semibold">Total Film à Lancer</div>
            <div className="font-mono text-lg font-bold text-emerald-200 mt-1 tabular-nums">
              {resUnwind.totalMetersOrder.toLocaleString('fr-FR')} m
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-right font-mono">
        Taux de change de référence atelier : 1 € = {(1 / CNY_TO_EUR_RATE).toFixed(2)} CNY
      </p>
    </div>
  );
};
