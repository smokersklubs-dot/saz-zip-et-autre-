# CLAUDE.md — Mylar Pro Cockpit (`mylar-pricing-app`)

Guide technique et contexte complet pour **Claude Code** afin d'auditer, maintenir et faire évoluer l'application de chiffrage packaging **Mylar Pro Cockpit** (données extraites de l'usine *Shenzhen Beijincai / Miaobaojia V5.0.2*, filières **Numérique HP Indigo** et **Héliogravure**).

---

## 1. Commandes & Environnement

```bash
npm install
npm run dev      # Serveur Vite local (port 5173 par défaut)
npm run build    # Compilation TypeScript (tsc) + bundle Vite (dist/)
```

* **URL de production** : https://mylar-pricing-app.vercel.app
* **Dépôt GitHub** : https://github.com/smokersklubs-dot/saz-zip-et-autre-.git (`main`)
* **Dossier de travail local miroir** : `D:\bag mylar extraction de prix`
* **Déploiement Vercel** : `vercel --prod --yes` (à exécuter après `npm run build` et push GitHub)

---

## 2. Architecture du Projet

```
src/
├── databases_clean.json        # Export brut Aliwork Numérique (dxcs, clk, qtcs, gxcb, ggdw, hddw, lryc)
├── databases_gravure.json      # Export brut Aliwork Héliogravure (gxcb_gravure, zdcb_gravure, qtcs_gravure, clk_gravure, dxcx_gravure, freight_digital)
├── materialsCatalog.ts         # 49 matières réelles actives (9 print + 12 barrier + 28 seal PE/CPP/ALU) + 25 préréglages composites
├── pricingEngine.ts            # Moteur de calcul complet (HP Indigo + Hélio + 7 outils convertisseur bobines/MOQ)
├── index.css                   # Thème Obsidian Cockpit (#060913 / #0c1322 / #080d18) + styles @media print
├── App.tsx                     # Dashboard principal : 12 cols Desktop + 4 onglets Mobile + barre sticky + Pilotage marge + Export JSON IA
└── components/
    ├── StudioShowcase.tsx      # Galerie des 8 formes + Monocouche avec rendus Nano Banana sur socles #F4F1EA
    ├── FinishesStudio.tsx      # Finitions tactiles (Nano Banana), 8 goulots, valve, poignées, fenêtres, 5 encrages, 4 Pantones
    ├── UltraDetailedBreakdown.tsx # Décomposition 8 postes, table couche par couche, accessoires, gâche, FR/ZH + JSON IA + PDF
    ├── ComparisonTiersTab.tsx  # Graphiques Recharts + tableaux paliers (100–100k pcs) + point mort Indigo vs Hélio
    ├── WorkshopToolsTab.tsx    # 7 calculateurs d'atelier (métrage/poids, Ø mandrin, prix m²↔kg, densité, MOQ, débit)
    └── ProposalPrintModal.tsx  # Fiche devis client A4 blanche imprimable / PDF
public/
└── images/
    ├── bags/                   # 8 rendus studio Nano Banana (.jpg, 1024×1024)
    └── finishes/               # 4 macros finitions Nano Banana (.jpg, 1024×1024)
claude-handoff/                 # Dossier d'audit et passation vers Claude Code (lire les 4 fichiers dans l'ordre)
```

---

## 3. Dossier de Passation & Audit (`claude-handoff/`)

Lis ces 4 documents en priorité lors de toute session d'audit ou d'extension :

1. [claude-handoff/01_WHAT_WAS_BUILT.md](./claude-handoff/01_WHAT_WAS_BUILT.md) — Ce qui a été extrait, corrigé, implémenté et vérifié.
2. [claude-handoff/02_KNOWN_GAPS_AND_RISKS.md](./claude-handoff/02_KNOWN_GAPS_AND_RISKS.md) — **Ce qui manque encore**, les écarts connus Hélio/Monocouche/Import UE, la dette technique et ce que tu dois vérifier.
3. [claude-handoff/03_DATA_DICTIONARY_ALIWORK.md](./claude-handoff/03_DATA_DICTIONARY_ALIWORK.md) — Dictionnaire exact des champs obfusqués Aliwork (`textField_xxx`, `numberField_xxx`, `tableField_xxx`) pour éviter toute erreur de mapping.
4. [claude-handoff/04_CLAUDE_CODE_AUDIT_PROMPT.md](./claude-handoff/04_CLAUDE_CODE_AUDIT_PROMPT.md) — Protocole d'audit et checklist exécutable par Claude Code.
