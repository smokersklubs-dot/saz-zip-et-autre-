# 01 — Ce Qui a Été Construit & Vérifié

## 1. Sources de Données Usine Exploitées
* **`src/databases_clean.json`** (Numérique HP Indigo `suanfa.js` V5.0.2) :
  * `dxcs` : 15 gabarits de sacs × zips avec laizes, tolérances de coupe (`双切`/`模切`), démarrages, tarifs façonnage de base.
  * `clk` : 49 matières premières actives (après filtrage de l'enregistrement de test `"测试"`), avec prix réels `¥/kg` (`textField_nohaph9`), densité (`textField_2xfswer`), épaisseur en `丝` = 10 µm (`textField_09zzudc`) et code réel (`textField_e5iy0au`).
  * `qtcs` : Paramètres machine généraux (laize utile `74 cm`, bobine `76 cm`, développement `110/112 cm`, taux de perte `qt19 = 3%`, matrice contrecollage 1–4 passes `tableField_mglxnkde`, paliers bénéfice plancher `tableField_mo9fep07` de `150` à `800 ¥`, TVA `+8%`).
  * `gxcb` : 12 options de finition & passes d'impression (IDs `FINST-` vérifiés 1 par 1).
* **`src/databases_gravure.json`** (Héliogravure & Logistique Chine) :
  * `freight_digital` : **13 zones provinciales** chinoises (`广东省内` Franco jusqu'aux provinces/Taïwan/HK/Tibet avec tarif 1er kg + kg supp.).
  * `qtcs_gravure` : Formule cylindres cuivre (`largeur × circonférence snappée × 0,15 ¥/cm²`).
  * `gxcb_gravure` & `zdcb_gravure` : Encres 0–10 couleurs (`0,305` à `0,955 ¥/m²`), contrecollage Sec (`0,225 ¥/m²`) vs Sans Solvant (`0,14 ¥/m²`), goulots `5–33 mm`, niveaux d'encrage et Pantones.

## 2. Correctifs Critiques Déjà Effectués
1. **Mapping Aliwork `clk`** : remplacement de `textField_m3n9285l` (inexistant) par `textField_e5iy0au` (sinon les codes matières étaient vides et le nombre de passes de contrecollage était faussé).
2. **Grammage & Poids unitaire** : ajout du facteur `× 10` manquant (`g/m² = densité × épaisseur_丝 × 10`), donnant le poids réel (`~8,54 g/sac` au lieu de `0,9 g`).
3. **11 IDs `FINST-` réparés** :
   * Modes Numérique `none` (`PEMMU8U1`), `cmyk_white` (`PEMMO8U1`), `cmyk_white_inside` (`1S2NMQTB`) + suppression du risque `NaN` via `!Number.isNaN(Number(rawRate))`.
   * Finitions `matte_varnish`, `spot_uv`, `thick_uv`, `hot_stamping`, `uv_and_hot_stamping`, `valve`, et tarif `spout_10mm` (`0,195 ¥` / `3,6 g`).
   * Correction du Kraft 35g (`FINST-AZI66271NFI8INYALJYKX7QJ3O6732BI2P6TMCQW`) dans les préréglages Kraft & Holo-Kraft.
4. **Ajout des 9 films PE manquants (`PE25` à `PE160`)** : `SEAL_LAYERS` contient désormais tous les **28 films thermosoudables**.
5. **Restauration du palier `100 pcs`** en Numérique (bouton rapide, slider `min=100`, badge `100–10k`, tableau comparatif).

## 3. Interface & Expérience Utilisateur
* **Palette Obsidian Cockpit** (`#060913` / `#0c1322` / `#080d18`) avec code couleur sémantique (`Cyan`, `Indigo`, `Émeraude`, `Ambre`, `Rose`, `Pourpre`) et socles clairs `#F4F1EA` pour les **12 visuels Nano Banana** (`1024×1024`).
* **Décomposition Ultra-Détaillée** directement visible à l'écran : 8 cartes de coûts avec `%`, tableau matières couche par couche (`clk` +3%), accessoires itemisés (`js_qt`), imposition & gâche détaillée, fiches copiables **FR / ZH**, **Export JSON (IA)** et **Devis Client PDF** A4.
* **Format Mobile 4 Onglets (`< lg`)** : Navigation basse fixe (`Sac & Films`, `Finitions & Port`, `Décomp. Ultra`, `Paliers & Outils`) + bandeau total collant avec `0` débordement horizontal (`scrollWidth <= 390`).
* **7 Outils Atelier** : Calculs bobine poids/métrage, diamètre extérieur, tarif m²↔kg, densité, MOQ usine et débit multi-postes.

## 4. Tests & QA Effectués avant Passation
* `npm run build` (`tsc && vite build`) : OK (`0` erreur).
* Audit combinatoire automatisé (`2` filières × `7` formats × tous zips × `25` préréglages × complexe 5 couches + monocouche) : `0` erreur, aucun `NaN`, aucune valeur négative.
* QA navigateur Desktop (`1440×900`) et Mobile (`390×844`) sur `https://mylar-pricing-app.vercel.app` : `0` erreur console, `0` requête HTTP `>= 400`, `24/24` images chargées (`1024×1024`).
