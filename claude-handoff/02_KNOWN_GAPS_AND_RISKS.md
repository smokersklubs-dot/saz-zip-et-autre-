# 02 — Ce Qui Manque Encore, Risques & Pistes d'Amélioration (Pour Claude Code)

Ce document recense **sans complaisance** tout ce qui reste à auditer, affiner ou ajouter pour passer d'un calculateur usine fidèle à un outil d'exploitation import/vente complet.

---

## A. Écarts & Données Usine Non Encore 100% Exploités (`databases_clean.json` & `databases_gravure.json`)

1. **Héliogravure Monocouche & Découpe Électrique (`zdcb_gravure` -> `单层` / `电割袋`)** :
   * Dans `databases_gravure.json`, `zdcb_gravure.items` contient 5 entrées spécifiques monocouche (`三边封袋(单层)` / `电割袋` à `0.13 ¥/m`, `电割袋-带拉链` à `0.14 ¥/m` + `0.065 ¥`, `电割拉链-带滑块` à `0.21 ¥/m`, `中封袋(单层)`, `风琴袋(单层)`).
   * **État actuel** : `pricingEngine.ts` applique un coefficient forfaitaire (`singleLayerBagDiscount = 0.55`) en mode monocouche au lieu de lire ces barèmes exacts lorsque `technology === 'gravure' && isSingleLayer`.
2. **Zip Curseur (`滑块拉链` Slider) sur `four_side` Horizontal** :
   * Présent dans `zdcb_gravure` (`四边封-滑块拉链`, `0.90 ¥/m` + zip `34 ¥`, min `1 200 ¥`, `lbgb1g19 = 34`, `lbg95ggf = 3`).
   * **État actuel** : `Slider` n'est proposé dans `BAG_TYPES_CATALOG` que sur `stand_up`, pas encore sur `four_side`.
3. **2 Finitions "Vernis Spécial" (`特殊表印`) de `gxcb_gravure`** :
   * `透明色印刷` (vernis brillant transparent, `numberField_2hp19np = 1.0`, `miwr912 = 0.2`) et `哑油+透明色` (`3.5` / `0.4`) ne sont pas encore dans `FINISHES_CATALOG.uv` / `FinishesStudio.tsx`.
   * En outre, `数码UV` (`1.84 ¥/m²`, min `600 ¥`) et `数码厚UV` (`2.63 ¥/m²`, min `800 ¥`) existent côté `gxcb_gravure` en tarification au `m²` (distincte de la tarification au `tour` dans `clean.gxcb`).
4. **Écart mineur d'accessoires entre `clean.gxcb` et `grav.gxcb_gravure`** :
   * Valve unidirectionnelle : `0.22 ¥/u` dans `clean.gxcb` vs `0.25 ¥/u` dans `gxcb_gravure`.
   * Poignées riz : `大米袋大手提` = `0.142 ¥/u` et `大米袋小手提` = `0.132 ¥/u` dans `gxcb_gravure` (vs `0.240` et `0.180` actuellement dans `HANDLE_VARIANTS_CATALOG`).
   * Colle destructive (`破环性白胶`) : `0.10 ¥/m` + poids `3.5 g/m` dans `gxcb_gravure` vs `0.09 ¥/m` dans `ADHESIVE_VARIANTS_CATALOG`.
5. **Tables masquées / non documentées dans `databases_clean.json`** :
   * `lryc` est `"HIDDEN"` dans l'export Aliwork : `qt24` (`tableField_menzxc5j` dans le script `suanfa.js` d'origine) est donc absent de `clean.qtcs`, ce qui active le fallback `xs02 = 1.25` dans `pricingEngine.ts`.
   * `clean.qtcs.data[0].formData` contient deux autres sous-tables non câblées :
     * `tableField_me14n36x` (13 tranches de `0` à `16501+` avec valeurs `40..120` et `15..30`) — probablement liées aux paliers ou forfaits d'emballage/marge.
     * `tableField_me2fge68` (valeurs `60/80`, `70/80`, `100/130`, `200/260` par type de sac) — probablement la tare carton ou le temps/forfait machine.
   * Il serait utile que **Claude Code** vérifie si `me14n36x` / `me2fge68` doivent être intégrées ou documentées.

---

## B. Fonctionnalités Business / Import Europe Manquantes

1. **Calculateur Fret International Chine → Europe / France (DDP) & Douanes** :
   * L'app calcule le coût **EXW / Chine Intérieure (`13 provinces`)**.
   * À ajouter : Express Aérien (DHL/UPS/FedEx ~6–9 €/kg), Air Cargo DDP (~4,5–6 €/kg), Maritime LCL (~1,2–2,2 €/kg) basé sur `quote.weightTotalKg` + poids volumétrique, droits de douane UE (code SH `3923.21` / `3923.29`, ~6,5%) et TVA France `20%` déductible ou TTC.
2. **Taux de change `CNY / EUR` éditable** :
   * Aujourd'hui codé en dur (`export const CNY_TO_EUR_RATE = 1 / 7.8;`). À transformer en paramètre dynamique dans l'état (`exchangeRateCnyPerEur`, défaut `7.80`) passé à `calculateMylarQuote(dim)`.
3. **Historique / Comparateur Multi-Devis & Export CSV / Multi-lignes PDF** :
   * Pouvoir épingler 2 à 4 configurations (ex. *Doypack 500 pcs* vs *Box Pouch 2 500 pcs*) dans `localStorage`, les comparer côte à côte, et générer un PDF multi-SKU.
4. **Assistant Contenance / Dimensions (g / ml → L×H×Fond)** :
   * Aide au choix des cotes selon la densité produit (ex. 3,5g / 28g / 100g / 250g / 1kg de fleurs, café, poudre ou liquide) + alerte si le sac est trop étroit pour un bec verseur (`Ø 26 mm` sur largeur `< 9 cm`, etc.).

---

## C. Qualité Logicielle & Refactoring Recommandés pour Claude Code

1. **Tests Automatisés (`Vitest`)** : Aucun dossier `tests/` n'existe actuellement (seul un script `esbuild` ad-hoc a été utilisé). Ajouter une suite Vitest couvrant :
   * Non-régression de `suanfa.js` (Digital 100 → 10 000 pcs, 2–5 couches, monocouche, bobine mètres/kg).
   * Héliogravure (cylindres `400/800/1200+`, circonférence snappée `55/65/75/85/95`, sans solvant).
   * Zéro `NaN` / `Infinity` / ID `FINST-` orphelin sur toutes combinaisons.
2. **Découpage de `src/pricingEngine.ts` (1 407 lignes)** : Séparer en modules (`types.ts`, `catalogs.ts`, `freight.ts`, `engineDigital.ts`, `engineGravure.ts`, `workshopTools.ts`).
3. **Optimisation Bundle (`dist/assets/index-*.js` = 1,20 Mo)** : Configurer `build.rollupOptions.output.manualChunks` (séparer `recharts`, `lucide-react`, et `databases_*.json` en lazy-load ou chunks distincts) pour passer sous la limite Vite des `500 kB`.
4. **Accessibilité formulaires** : Ajouter des `id` / `name` explicites sur certains `<input>` / `<select>` pour supprimer la notice DevTools sur les champs de formulaire sans `id/name`.
5. **Mode IA avancé (Copilot / API optionnelle)** : Un bouton **"Copier JSON (IA)"** existe déjà dans `UltraDetailedBreakdown.tsx` pour exporter le contexte structuré complet ; Claude Code peut enrichir cela avec une vue "Analyse IA locale" ou import/restauration d'un devis depuis un JSON collé !
