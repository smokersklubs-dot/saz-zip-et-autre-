# 03 — Dictionnaire Exact des Champs Aliwork (`databases_clean.json` & `databases_gravure.json`)

Référence indispensable pour éviter toute confusion lors de l'inspection ou de l'extension du moteur.

---

## 1. Base Numérique (`src/databases_clean.json`)

### `clk.data[]` -> `.formData` (49 matières actives + 1 `"测试"` ignorée)
| Clé JSON Aliwork | Signification Métier | Exemple (`PET19`) |
| :--- | :--- | :--- |
| `textField_e5iy0au` | **Code court matière** (UTILISER CE CHAMP, `m3n9285l` est obsolète) | `"PET19"` |
| `textField_a0wryjb` | Nom complet chinois | `"聚酯PET1.9丝"` |
| `textField_nohaph9` | Prix au kilo (`¥/kg`) | `"11.8"` |
| `textField_2xfswer` | Densité (`g/cm³`) | `"1.4"` |
| `textField_09zzudc` | Épaisseur en `丝` (`1丝 = 10 µm`) | `"1.9"` |
| `numberField_m1vue6qs` | Ordre de tri catalogue | `1..49` |
| `selectField_2x0w66a` | Catégorie rôle (`印刷层` / `阻隔层` / `热封层`) | `"印刷层"` |

### `dxcs.data[]` -> `.formData` (15 structures sac × fermeture)
| Clé JSON Aliwork | Variable `suanfa.js` | Signification |
| :--- | :--- | :--- |
| `numberField_m3mpyv0d` | `dx02` | Délai standard (jours) |
| `numberField_m3mpyv0f` | `dx03` | Délai express (jours) |
| `numberField_m3mpyv0g` | `dx04` | Surcoût express usine (`¥`) |
| `numberField_sr3it9l` | `cx01` | Marge coupe largeur/hauteur (`cm`) |
| `numberField_jp4n9ji` | `cx02` | Marge coupe longueur (`cm`) |
| `numberField_c9d9r7p` | `cx03` | Marge coupe fond (`cm`) |
| `numberField_m3mpyv0h` | `cx04` | Perte coupe droite `双切` |
| `numberField_m3mpyv0j` | `cx05` | Perte découpe forme spéciale `模切` |
| `numberField_m3mpyv0i` | `cx06` | Tolérance latérale |
| `numberField_p484hca` | `sh01` | Gâche démarrage machine (mètres) |
| `numberField_y92oli1` | `sh02` | % gâche impression |
| `numberField_5c5a74i` | `sh03` | Gâche par SKU supp. (tours) |
| `numberField_04m4hcc` | `zd01` | Forfait min façonnage (`¥`) |
| `numberField_6mnwv9s` | `zd02_base` | Tarif façonnage base (`¥/m`) |
| `numberField_wngzhey` | `zd06` | Coût coupe droite / unité |
| `numberField_m3mpyv0o` | `zd07` | Coût découpe forme / unité |

### `gxcb.data[]` -> `.formData` (12 procédés & accessoires numériques)
| `formInstId` exact | Nom ZH | Tarif `numberField_w5opr46` | Min `numberField_c2jyl6f` |
| :--- | :--- | :---: | :---: |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMU8U1` | `不印刷` (Sans impr.) | `0` | `0` |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMO8U1` | `CMYK单白` | `2.7` ¥/tour | `100` ¥ |
| `FINST-GOE669A1TB944FKNPGBCI9ZTUP5V3PJY1S2NMQTB` | `CMYK单白+里印` | `5.35` ¥/tour | `100` ¥ |
| `FINST-YLD66U81JB95U1P5I3P2Q5RVC8NF28BJN2HOMRG` | `满版哑油` | `0.4` ¥/tour | `100` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMW8U1` | `UV` (Spot UV) | `1.0` ¥/tour | `400` ¥ |
| `FINST-XE7668C19VP65KFKPETL3CQCX6KX3P9DOXIQMC51` | `厚UV` (3D Relief) | `1.7` ¥/tour | `500` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMV8U1` | `烫金` (Dorure) | `1.6` ¥/tour | `400` ¥ |
| `FINST-H9E66171BSG4MK34IMWNQ9U9LF7G2S8078ENMXL3` | `UV+烫金` | `1.8` ¥/tour | `600` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMM09U1` | `吸嘴10mm` | `0.195` ¥/u | `100` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMM19U1` | `吸嘴16mm` | `0.22` ¥/u | `100` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMY8U1` | `单向透气阀` | `0.22` ¥/u | `100` ¥ |
| `FINST-S2666U81G8637K87P1PXB4B72O313U0E6PEMMZ8U1` | `普通手提` | `0.105` ¥/u | `100` ¥ |

### `qtcs.data[0].formData` (Constantes Numérique)
* `tableField_mglxnkde` : Coût contrecollage `1次..4次` (`selectField_mglxnkda`, `numberField_mglxnkdb = 150..250`, `c = 700m`, `d = 0.25..0.85`).
* `tableField_mo9fep07` : Bénéfice plancher usine `qt09` (`mo9fep08..09` = plage tours, `mo9fep0a` = `150..800 ¥`). Note : utiliser `mo9fep0a`, pas `mo9fep0b` (inexistant).
* `numberField_menzxc5c` = `3` (% perte usine `qt19`).

---

## 2. Base Héliogravure & Fret (`src/databases_gravure.json`)

* `gxcb_gravure.items[]` : Structure plate directe (sans `.formData` wrapper) :
  * `selectField_ilv5vso` : Catégorie (`印刷方式`, `满版印刷`, `特殊专色`, `特殊表印`, `复合工序`, `开窗`, `压纹`, `自粘`, `手提扣`, `吸嘴`, `单向透气阀`, `烫金`).
  * `textField_cmdnsnh` : Libellé option (`0`–`10色`, `20%以内`..`双满版`, `金色`..`桃红色`, `5mm`..`33mm`, etc.).
  * `numberField_miwr912` : Tarif unitaire (`¥/m²`, `¥/m` ou `¥/u`).
  * `numberField_61u766s` : Forfait minimum (`¥`).
  * `numberField_2hp19np` : Poids ajouté (`g/u` ou `g/m²`).
* `zdcb_gravure.items[]` : Barèmes confection Hélio (inclut `单层` Monocouche et `四边封-滑块拉链` non encore câblés en direct — voir `02_KNOWN_GAPS_AND_RISKS.md`).
* `qtcs_gravure.items[0].formData` : `tableField_m8zjfiph` (circonférences standards des cylindres `55, 65, 75, 85, 95 cm`), `numberField_lchhi68o = 0.15` (`¥/cm²`).
* `freight_digital.items[]` : 13 zones chinoises (`textField_m3o8svch`, `numberField_we9udob` = 1er kg, `numberField_d4ylk7b` = kg supp.).
