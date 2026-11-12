# 04 — Prompt Prêt-à-l'Emploi pour Audit & Évolution dans Claude Code

Copie-colle ce prompt directement dans **Claude Code** ouvert sur ce dossier :

---

```text
Lis d'abord CLAUDE.md puis les fichiers dans claude-handoff/ (01_WHAT_WAS_BUILT.md, 02_KNOWN_GAPS_AND_RISKS.md, 03_DATA_DICTIONARY_ALIWORK.md).

Mission d'audit complet et d'amélioration sans régression :
1. Vérifie mathématiquement `src/pricingEngine.ts` et `src/materialsCatalog.ts` contre les données brutes de `src/databases_clean.json` et `src/databases_gravure.json` :
   - Confirme s'il existe d'autres champs mal mappés ou valeurs fallback discutables.
   - Analyse `tableField_me14n36x` et `tableField_me2fge68` dans `clean.qtcs.data[0].formData`.
   - Branche les éléments encore manquants listés dans `02_KNOWN_GAPS_AND_RISKS.md` :
     * Barèmes exacts Monocouche / Découpe électrique (`电割袋`) dans `zdcb_gravure`
     * Option `Slider` sur `four_side` (`四边封-滑块拉链`)
     * Vernis `透明色印刷` et `哑油+透明色` (`gxcb_gravure`)
     * Tarifs exacts Hélio pour valve (`0.25¥`) et poignées (`0.132/0.142¥`)
2. Ajoute les fonctionnalités Business manquantes :
   - Taux EUR/CNY configurable dans le header (au lieu de `1/7.8` figé)
   - Simulateur Transport International Chine -> France/UE (Express, Air DDP, Maritime LCL + Douanes ~6.5% + TVA 20%)
   - Historique / comparateur de devis multi-configurations sauvegardé en localStorage
   - Assistant contenance produit (g/ml -> dimensions recommandées)
3. Qualité & Fiabilité :
   - Ajoute Vitest avec des tests unitaires complets sur `pricingEngine.ts` (Numérique 100-10k, Hélio 5k-100k, 5 couches, monocouche, bobines, outils atelier).
   - Découpe `pricingEngine.ts` proprement et configure `manualChunks` dans `vite.config.ts` pour réduire la taille du bundle JS.
   - Corrige les attributs `id`/`name` manquants sur les formulaires.
   - Valide avec `npx tsc --noEmit`, `npm test`, `npm run build` et vérifie visuellement sur Desktop & Mobile sans aucune erreur console.
```
