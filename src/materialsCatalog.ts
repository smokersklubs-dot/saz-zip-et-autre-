// CATALOGUE COMPLET DES MATÉRIAUX & STRUCTURES USINE MIAOBAOJIA (SHENZHEN BEIJINCAI)
// Source ground-truth : Table Aliwork clk (50 matières premières réelles)

export interface RawMaterial {
  id: string;
  nameZh: string;
  nameFr: string;
  code: string;
  role: 'print' | 'barrier' | 'seal';
  thicknessUm: number;
  density: number;
  pricePerKgCny: number;
}

export interface MaterialStructurePreset {
  key: string;
  category: string;
  name: string;
  description: string;
  printLayer: string; // ID instance clk (Couche 1)
  barrierLayer: string | null; // ID instance clk (Couche 2 ou null si 2 couches)
  barrierLayer2?: string | null; // ID instance clk (Couche 3 optionnelle - 4 couches)
  barrierLayer3?: string | null; // ID instance clk (Couche 4 optionnelle - 5 couches)
  sealLayer: string; // ID instance clk (Couche finale thermosoudable)
  totalThicknessSilk: number; // Épaisseur en丝 (1丝 = 10µm)
  badge?: string;
}

// 1. Les 9 Couches d'Impression (Couche 1 / Extérieure)
export const PRINT_LAYERS: RawMaterial[] = [
  {
    id: 'FINST-SBD660C1P314UIQ4HB1M98CUF1AQ23CB4NSMMSP3',
    nameZh: '聚酯PET1.9丝',
    nameFr: 'PET Brillant Standard 19µm (1.9丝)',
    code: 'PET19',
    role: 'print',
    thicknessUm: 19,
    density: 1.4,
    pricePerKgCny: 2
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1',
    nameZh: '聚酯PET1.5丝',
    nameFr: 'PET Brillant Fin 15µm (1.5丝)',
    code: 'PET15',
    role: 'print',
    thicknessUm: 15,
    density: 1.4,
    pricePerKgCny: 5
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMZ5A1',
    nameZh: '哑光OPP2.5丝',
    nameFr: 'MOPP Mat Soft-Touch 25µm (2.5丝)',
    code: 'MOPP25',
    role: 'print',
    thicknessUm: 25,
    density: 0.91,
    pricePerKgCny: 9
  },
  {
    id: 'FINST-XRA66G81UOZ3UI6MHIO306SYB0WQ3NLT8NSMM9TT',
    nameZh: '哑光OPP3.5丝',
    nameFr: 'MOPP Mat Épais 35µm (3.5丝)',
    code: 'MOPP35',
    role: 'print',
    thicknessUm: 35,
    density: 0.91,
    pricePerKgCny: 1
  },
  {
    id: 'FINST-0E966191OD94SKV6HNOB6B6HWB3P3Q13DF4NMZ28',
    nameZh: '哑光PET1.5丝',
    nameFr: 'PET Mat Direct 15µm (1.5丝)',
    code: '哑光PET15',
    role: 'print',
    thicknessUm: 15,
    density: 1.4,
    pricePerKgCny: 3
  },
  {
    id: 'FINST-ZLE66OD1IRJ4IT7KJN96B8XOM0AK2UODRSMNMWSV1',
    nameZh: '亮光OPP2.5丝',
    nameFr: 'BOPP Transparent Brillant 25µm (2.5丝)',
    code: 'BOPP25',
    role: 'print',
    thicknessUm: 25,
    density: 0.91,
    pricePerKgCny: 4
  },
  {
    id: 'FINST-HOE66X61EH24X6HEL84R97M96ASB301QNZTMMQ87',
    nameZh: '黄牛皮纸50g',
    nameFr: 'Papier Kraft Brun 50g (8.5丝)',
    code: '黄牛皮纸50g',
    role: 'print',
    thicknessUm: 85,
    density: 0.77,
    pricePerKgCny: 10
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM66A1',
    nameZh: '白牛皮纸50g',
    nameFr: 'Papier Kraft Blanc 50g (6.5丝)',
    code: '白牛皮纸50g',
    role: 'print',
    thicknessUm: 65,
    density: 0.77,
    pricePerKgCny: 11
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM56A1',
    nameZh: '印刷级尼龙PA2.5丝',
    nameFr: 'Nylon BOPA Indéchirable 25µm (2.5丝)',
    code: 'PA25',
    role: 'print',
    thicknessUm: 25,
    density: 1.15,
    pricePerKgCny: 7
  }
];

// 2. Les 12 Couches Barrières / Intermédiaires (Couche 2)
export const BARRIER_LAYERS: RawMaterial[] = [
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1',
    nameZh: '镀铝PET1.2丝',
    nameFr: 'PET Métallisé Aluminium (VMPET 12µm / 1.2丝) - Barrière classique',
    code: 'VMPET12',
    role: 'barrier',
    thicknessUm: 12,
    density: 1.4,
    pricePerKgCny: 1
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1',
    nameZh: '纯铝AL0.7丝',
    nameFr: 'Pure Feuille Aluminium (AL 7µm / 0.7丝) - Barrière Absolue 100%',
    code: 'AL7',
    role: 'barrier',
    thicknessUm: 7,
    density: 2.7,
    pricePerKgCny: 5
  },
  {
    id: 'FINST-XE7668C1F83462HCOE8Q661WP0I936MZZ6UMMLL3',
    nameZh: '镭射镀铝1.2丝',
    nameFr: 'Holographique Laser Rainbow VMPET (12µm / 1.2丝)',
    code: '镭射VMPET12',
    role: 'barrier',
    thicknessUm: 12,
    density: 1.4,
    pricePerKgCny: 8
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM86A1',
    nameZh: 'PET阴阳铝1.2丝',
    nameFr: 'Yin-Yang (Face Transparente + Dos Aluminisé 12µm / 1.2丝)',
    code: 'PET阴阳铝12',
    role: 'barrier',
    thicknessUm: 12,
    density: 1.4,
    pricePerKgCny: 2
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA6A1',
    nameZh: '聚酯PET1.2丝',
    nameFr: 'PET Transparent Haute Clarté (12µm / 1.2丝)',
    code: 'PET12',
    role: 'barrier',
    thicknessUm: 12,
    density: 1.4,
    pricePerKgCny: 4
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM96A1',
    nameZh: '复合级尼龙 1.5丝',
    nameFr: 'Nylon BOPA Renfort Anti-Crevaison (15µm / 1.5丝)',
    code: 'PA15',
    role: 'barrier',
    thicknessUm: 15,
    density: 1.15,
    pricePerKgCny: 3
  },
  {
    id: 'FINST-8NE6617168040R46OCBA6D4SA28E3GFJUZTMM1K01',
    nameZh: '触感膜1.8丝',
    nameFr: 'Toucher Velours Soft-Touch Tactile (18µm / 1.8丝)',
    code: '触感膜18',
    role: 'barrier',
    thicknessUm: 18,
    density: 1.0,
    pricePerKgCny: 7
  },
  {
    id: 'FINST-53E66ZB1NBD67HSRHRSFRA98FR8S37XG9Q1QMM07',
    nameZh: '珠光膜2.5丝',
    nameFr: 'Film Nacré Perlé Blanc (25µm / 2.5丝)',
    code: '珠光膜25',
    role: 'barrier',
    thicknessUm: 25,
    density: 0.7,
    pricePerKgCny: 12
  },
  {
    id: 'FINST-AZI66271NFI8INYALJYKX7QJ3O6732BI2P6TMCQW',
    nameZh: '黄牛皮纸35g',
    nameFr: 'Papier Kraft Brun 35g (6.5丝)',
    code: '黄牛皮纸35g',
    role: 'barrier',
    thicknessUm: 65,
    density: 0.77,
    pricePerKgCny: 14
  },
  {
    id: 'FINST-W27666A132M8U806JYHLH6V6CXU33JCQ0P6TMID',
    nameZh: '白牛皮纸35g',
    nameFr: 'Papier Kraft Blanc 35g (5丝)',
    code: '白牛皮纸35g',
    role: 'barrier',
    thicknessUm: 50,
    density: 0.77,
    pricePerKgCny: 13
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMD6A1',
    nameZh: '黄牛皮纸50g',
    nameFr: 'Papier Kraft Brun 50g (8.5丝)',
    code: '黄牛皮纸50g',
    role: 'barrier',
    thicknessUm: 85,
    density: 0.77,
    pricePerKgCny: 11
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMC6A1',
    nameZh: '白牛皮纸50g',
    nameFr: 'Papier Kraft Blanc 50g (6.5丝)',
    code: '白牛皮纸50g',
    role: 'barrier',
    thicknessUm: 65,
    density: 0.77,
    pricePerKgCny: 6
  }
];

// 3. Les 29 Couches de Scellage Thermique (Couche 3 / Intérieure PE & CPP)
export const SEAL_LAYERS: RawMaterial[] = [
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1',
    nameZh: '聚乙烯PE8.5丝',
    nameFr: 'PE Standard Alimentaire 85µm (8.5丝) - Recommandé n°1',
    code: 'PE85',
    role: 'seal',
    thicknessUm: 85,
    density: 0.92,
    pricePerKgCny: 10
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMML5A1',
    nameZh: '聚乙烯PE6丝',
    nameFr: 'PE Souple 60µm (6丝)',
    code: 'PE60',
    role: 'seal',
    thicknessUm: 60,
    density: 0.92,
    pricePerKgCny: 5
  },
  {
    id: 'FINST-AZ766F91NG24T4FXJF77O9CNFKPO3VAMS1UMMJI1',
    nameZh: '聚乙烯PE7丝',
    nameFr: 'PE Intermédiaire 70µm (7丝)',
    code: 'PE70',
    role: 'seal',
    thicknessUm: 70,
    density: 0.92,
    pricePerKgCny: 7
  },
  {
    id: 'FINST-1PD66L91OA34WB8GMGA4D5AV6NRA3ZS8V1UMM0G',
    nameZh: '聚乙烯PE8丝',
    nameFr: 'PE Renforcé 80µm (8丝)',
    code: 'PE80',
    role: 'seal',
    thicknessUm: 80,
    density: 0.92,
    pricePerKgCny: 9
  },
  {
    id: 'FINST-7C8668D1FH24VS11KJ1J0C0R49RW2ENLW1UMMD36',
    nameZh: '聚乙烯PE9丝',
    nameFr: 'PE Épais 90µm (9丝)',
    code: 'PE90',
    role: 'seal',
    thicknessUm: 90,
    density: 0.92,
    pricePerKgCny: 11
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMN5A1',
    nameZh: '聚乙烯PE10丝',
    nameFr: 'PE Rigide 100µm (10丝)',
    code: 'PE100',
    role: 'seal',
    thicknessUm: 100,
    density: 0.92,
    pricePerKgCny: 13
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMO5A1',
    nameZh: '聚乙烯PE11丝',
    nameFr: 'PE Extra Rigide 110µm (11丝)',
    code: 'PE110',
    role: 'seal',
    thicknessUm: 110,
    density: 0.92,
    pricePerKgCny: 15
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMP5A1',
    nameZh: '聚乙烯PE12丝',
    nameFr: 'PE Haute Résistance 120µm (12丝)',
    code: 'PE120',
    role: 'seal',
    thicknessUm: 120,
    density: 0.92,
    pricePerKgCny: 16
  },
  {
    id: 'FINST-HOE66Q81DB348J7EKNJ4X84Y1G802KWF12UMMC9',
    nameZh: '聚乙烯PE13丝',
    nameFr: 'PE Robuste 130µm (13丝)',
    code: 'PE130',
    role: 'seal',
    thicknessUm: 130,
    density: 0.92,
    pricePerKgCny: 18
  },
  {
    id: 'FINST-GOE66BC1C824RSYTL5U5S5D36YO926M332UMMJPD',
    nameZh: '聚乙烯PE15丝',
    nameFr: 'PE Blindé 150µm (15丝)',
    code: 'PE150',
    role: 'seal',
    thicknessUm: 150,
    density: 0.92,
    pricePerKgCny: 20
  },
  {
    id: 'FINST-B5G66KD11LG9SUP1JL7MC5IRLL7D31ZL0TDUMUA1',
    nameZh: '聚乙烯PE19丝',
    nameFr: 'PE Ultra Blindé Maximum 190µm (19丝)',
    code: 'PE190',
    role: 'seal',
    thicknessUm: 190,
    density: 0.92,
    pricePerKgCny: 29
  },
  {
    id: 'FINST-3HC66NA1CXP41VSKGU2J0A9UFXJ72J3BKTPNMPD',
    nameZh: '乳白PE7丝',
    nameFr: 'PE Blanc Opaque Laiteux 70µm (7丝) - Opacité 100%',
    code: '乳白PE70',
    role: 'seal',
    thicknessUm: 70,
    density: 0.93,
    pricePerKgCny: 31
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMQ5A1',
    nameZh: '乳白低温PE10丝',
    nameFr: 'PE Blanc Soudure Basse Température 100µm (10丝)',
    code: '乳白低温PE100',
    role: 'seal',
    thicknessUm: 100,
    density: 0.93,
    pricePerKgCny: 29
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMV5A1',
    nameZh: '普通CPP4丝',
    nameFr: 'CPP Cast Polypropylène 40µm (4丝) - Cristallin & rigide',
    code: 'CPP40',
    role: 'seal',
    thicknessUm: 40,
    density: 0.9,
    pricePerKgCny: 23
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMX5A1',
    nameZh: '普通CPP6丝',
    nameFr: 'CPP Stérilisable Autoclave 60µm (6丝) - Haute température 121°C',
    code: 'CPP60',
    role: 'seal',
    thicknessUm: 60,
    density: 0.9,
    pricePerKgCny: 25
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMY5A1',
    nameZh: '普通CPP8丝',
    nameFr: 'CPP Autoclave Épais 80µm (8丝)',
    code: 'CPP80',
    role: 'seal',
    thicknessUm: 80,
    density: 0.9,
    pricePerKgCny: 26
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMT5A1',
    nameZh: 'CPP铝VMCPP3.5丝',
    nameFr: 'CPP Métallisé Aluminium VMCPP 35µm (3.5丝)',
    code: 'VMCPP35',
    role: 'seal',
    thicknessUm: 35,
    density: 0.91,
    pricePerKgCny: 30
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMK5A1',
    nameZh: '聚乙烯PE5丝',
    nameFr: 'PE Éco Léger 50µm (5丝)',
    code: 'PE50',
    role: 'seal',
    thicknessUm: 50,
    density: 0.92,
    pricePerKgCny: 4
  },
  {
    id: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMJ5A1',
    nameZh: '聚乙烯PE4丝',
    nameFr: 'PE Ultra Fin 40µm (4丝)',
    code: 'PE40',
    role: 'seal',
    thicknessUm: 40,
    density: 0.92,
    pricePerKgCny: 2
  }
];

// =========================================================================
// 4. CATALOGUE EXHAUSTIF DES STRUCTURES PRÉDÉFINIES (PAR FAMILLES USINE)
// =========================================================================
export const ALL_STRUCTURE_PRESETS: Record<string, MaterialStructurePreset> = {
  // --- FAMILLE 1 : MYLAR MÉTALLISÉ OPAQUE (VMPET - ANTI-ODEURS & ANTI-UV) ---
  mylar_standard: {
    key: 'mylar_standard',
    category: 'Mylar Métallisé (VMPET)',
    name: 'Mylar Standard (PET19 + VMPET12 + PE85)',
    description: 'Format n°1 mondial Mylar : 3 couches haute barrière opaque, hermétique et étanche odeurs.',
    printLayer: 'FINST-SBD660C1P314UIQ4HB1M98CUF1AQ23CB4NSMMSP3', // PET19
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 11.6,
    badge: 'Best-Seller'
  },
  mylar_eco: {
    key: 'mylar_eco',
    category: 'Mylar Métallisé (VMPET)',
    name: 'Mylar Éco Léger (PET15 + VMPET12 + PE60)',
    description: 'Format économique pour snacks, bonbons ou échantillons légers.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMML5A1', // PE60
    totalThicknessSilk: 8.7,
    badge: 'Éco'
  },
  mylar_heavy_duty: {
    key: 'mylar_heavy_duty',
    category: 'Mylar Métallisé (VMPET)',
    name: 'Mylar Renforcé Épais (PET19 + VMPET12 + PE120)',
    description: 'Structure rigide et épaisse pour conservation longue durée et grands formats 500g/1kg.',
    printLayer: 'FINST-SBD660C1P314UIQ4HB1M98CUF1AQ23CB4NSMMSP3', // PET19
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMP5A1', // PE120
    totalThicknessSilk: 15.1,
    badge: 'Épais'
  },
  mylar_armored: {
    key: 'mylar_armored',
    category: 'Mylar Métallisé (VMPET)',
    name: 'Mylar Blindé Maximum (PET19 + VMPET12 + PE150)',
    description: 'Structure ultra rigide indéchirable anti-perforation.',
    printLayer: 'FINST-SBD660C1P314UIQ4HB1M98CUF1AQ23CB4NSMMSP3', // PET19
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-GOE66BC1C824RSYTL5U5S5D36YO926M332UMMJPD', // PE150
    totalThicknessSilk: 18.1,
    badge: 'Ultra Résistant'
  },

  // --- FAMILLE 2 : PURE FEUILLE D'ALUMINIUM (AL 7µm - BARRIÈRE ABSOLUE 100%) ---
  pure_alu_standard: {
    key: 'pure_alu_standard',
    category: 'Pure Feuille d\'Aluminium (AL)',
    name: 'Pure Alu Médical / Pharma (PET15 + AL7 + PE85)',
    description: 'Véritable feuille d\'aluminium pur : zéro transmission d\'oxygène, d\'humidité et de lumière.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 10.7,
    badge: '100% Hermétique'
  },
  pure_alu_matt: {
    key: 'pure_alu_matt',
    category: 'Pure Feuille d\'Aluminium (AL)',
    name: 'Pure Alu Noir Mat de Luxe (MOPP25 + AL7 + PE85)',
    description: 'Toucher velours mat combiné à la pure barrière aluminium. Haut de gamme café de spécialité.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMZ5A1', // MOPP25
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 11.7,
    badge: 'Luxe'
  },
  pure_alu_heavy: {
    key: 'pure_alu_heavy',
    category: 'Pure Feuille d\'Aluminium (AL)',
    name: 'Pure Alu Renforcé (PET15 + AL7 + PE120)',
    description: 'Protection maximale sous atmosphère modifiée ou sous vide.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMP5A1', // PE120
    totalThicknessSilk: 14.2,
    badge: 'Industriel'
  },

  // --- FAMILLE 3 : PAPIER KRAFT NATUREL & ÉCO ---
  kraft_mylar: {
    key: 'kraft_mylar',
    category: 'Papier Kraft Naturel',
    name: 'Kraft Brun Naturel + Mylar (Kraft35g + VMPET12 + PE70)',
    description: 'Aspect kraft brut authentique à l\'extérieur avec barrière aluminium hermétique à l\'intérieur.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA5A1', // Kraft35
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-AZ766F91NG24T4FXJF77O9CNFKPO3VAMS1UMMJI1', // PE70
    totalThicknessSilk: 14.7,
    badge: 'Naturel'
  },
  kraft_white_mylar: {
    key: 'kraft_white_mylar',
    category: 'Papier Kraft Naturel',
    name: 'Kraft Blanc Premium + Mylar (Kraft Blanc 50g + VMPET12 + PE85)',
    description: 'Papier kraft blanc lisse haute définition d\'impression avec barrière intérieure métallisée.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM66A1', // Kraft Blanc 50g
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 16.2,
    badge: 'Premium'
  },
  kraft_window: {
    key: 'kraft_window',
    category: 'Papier Kraft Naturel',
    name: 'Kraft Brun avec Fenêtre Transparente (Kraft35g + PET12 + PE60)',
    description: 'Permet une découpe de fenêtre transparente pour visualiser le contenu à l\'intérieur.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA5A1', // Kraft35
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA6A1', // PET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMML5A1', // PE60
    totalThicknessSilk: 13.7,
    badge: 'Avec Fenêtre'
  },
  kraft_eco_2layers: {
    key: 'kraft_eco_2layers',
    category: 'Papier Kraft Naturel',
    name: 'Kraft Éco 2 Couches sans Alu (Kraft50g + PE60)',
    description: 'Structure papier simple et écologique sans aluminium pour thé, café ou biscuits secs.',
    printLayer: 'FINST-HOE66X61EH24X6HEL84R97M96ASB301QNZTMMQ87', // Kraft50
    barrierLayer: null,
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMML5A1', // PE60
    totalThicknessSilk: 14.5,
    badge: 'Bio / Éco'
  },

  // --- FAMILLE 4 : HOLOGRAPHIQUE & LASER RAINBOW ---
  holo_mylar: {
    key: 'holo_mylar',
    category: 'Holographique / Laser',
    name: 'Holographique / Laser Rainbow (PET19 + LaserVMPET12 + PE85)',
    description: 'Film de diffraction laser réfléchissant arc-en-ciel avec protection UV et barrière étanche.',
    printLayer: 'FINST-SBD660C1P314UIQ4HB1M98CUF1AQ23CB4NSMMSP3', // PET19
    barrierLayer: 'FINST-XE7668C1F83462HCOE8Q661WP0I936MZZ6UMMLL3', // LaserVMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 11.6,
    badge: 'Effet Waouh'
  },
  holo_kraft: {
    key: 'holo_kraft',
    category: 'Holographique / Laser',
    name: 'Kraft + Laser Holographique (Kraft35g + LaserVMPET12 + PE70)',
    description: 'Contraste unique entre la texture brute du papier kraft et la brillance holographique.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA5A1', // Kraft35
    barrierLayer: 'FINST-XE7668C1F83462HCOE8Q661WP0I936MZZ6UMMLL3', // LaserVMPET12
    sealLayer: 'FINST-AZ766F91NG24T4FXJF77O9CNFKPO3VAMS1UMMJI1', // PE70
    totalThicknessSilk: 14.7,
    badge: 'Design'
  },

  // --- FAMILLE 5 : FINITIONS MATES & TOUCHER VELOURS SOFT-TOUCH ---
  matt_soft_touch: {
    key: 'matt_soft_touch',
    category: 'Mat & Soft-Touch Luxe',
    name: 'Noir Mat Velours Soft-Touch (MOPP25 + VMPET12 + PE85)',
    description: 'Toucher doux anti-reflets ultra luxueux, résistant aux traces de doigts.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMZ5A1', // MOPP25
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 12.2,
    badge: 'Soft-Touch'
  },
  matt_tactile_velvet: {
    key: 'matt_tactile_velvet',
    category: 'Mat & Soft-Touch Luxe',
    name: 'Toucher Velours Tactile Suédé (PET15 + ToucherVelours18 + PE80)',
    description: 'Effet peau de pêche / suédine sensoriel ultra haut de gamme.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-8NE6617168040R46OCBA6D4SA28E3GFJUZTMM1K01', // 触感膜18
    sealLayer: 'FINST-1PD66L91OA34WB8GMGA4D5AV6NRA3ZS8V1UMM0G', // PE80
    totalThicknessSilk: 11.3,
    badge: 'Peau de Pêche'
  },

  // --- FAMILLE 6 : TRANSPARENTS & BRILLANTS ---
  transparent_eco: {
    key: 'transparent_eco',
    category: 'Transparents & Haute Clarté',
    name: 'Transparent Éco 2 Couches (BOPP25 + PE70)',
    description: 'Sachet 2 couches ultra limpide et transparent pour visualiser le produit.',
    printLayer: 'FINST-ZLE66OD1IRJ4IT7KJN96B8XOM0AK2UODRSMNMWSV1', // BOPP25
    barrierLayer: null,
    sealLayer: 'FINST-AZ766F91NG24T4FXJF77O9CNFKPO3VAMS1UMMJI1', // PE70
    totalThicknessSilk: 9.5,
    badge: 'Transparent'
  },
  transparent_barrier_3layers: {
    key: 'transparent_barrier_3layers',
    category: 'Transparents & Haute Clarté',
    name: 'Transparent Barrière 3 Couches (PET15 + PET12 + PE80)',
    description: 'Transparence totale mais avec 3 couches pour meilleure tenue et étanchéité.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMA6A1', // PET12
    sealLayer: 'FINST-1PD66L91OA34WB8GMGA4D5AV6NRA3ZS8V1UMM0G', // PE80
    totalThicknessSilk: 10.7,
    badge: 'Clarté +'
  },
  white_pearl: {
    key: 'white_pearl',
    category: 'Transparents & Haute Clarté',
    name: 'Blanc Nacré Perlé Lumineux (BOPP25 + Nacré25 + PE70)',
    description: 'Effet blanc scintillant nacré perlé pour cosmétiques et gourmandises.',
    printLayer: 'FINST-ZLE66OD1IRJ4IT7KJN96B8XOM0AK2UODRSMNMWSV1', // BOPP25
    barrierLayer: 'FINST-53E66ZB1NBD67HSRHRSFRA98FR8S37XG9Q1QMM07', // 珠光膜25
    sealLayer: 'FINST-AZ766F91NG24T4FXJF77O9CNFKPO3VAMS1UMMJI1', // PE70
    totalThicknessSilk: 12.0,
    badge: 'Nacré'
  },

  // --- FAMILLE 7 : YIN-YANG DÉGUSTATION (FACE VISIBLE + DOS MÉTAL) ---
  yinyang_sample: {
    key: 'yinyang_sample',
    category: 'Yin-Yang Translucide / Métal',
    name: 'Yin-Yang Translucide / Argent (PET15 + YinYang12 + PE85)',
    description: 'Face avant transparente pour voir la fleur / le contenu, dos aluminium métallisé miroir.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM86A1', // PET阴阳铝12
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 11.2,
    badge: 'Yin-Yang'
  },

  // --- FAMILLE 8 : NYLON BOPA ANTI-PERFORATION (SOUS-VIDE & CONGÉLATION) ---
  nylon_vacuum: {
    key: 'nylon_vacuum',
    category: 'Nylon Sous-Vide Indéchirable',
    name: 'Nylon Sous-Vide Anti-Perforation (PA25 + PE100)',
    description: 'Film BOPA indéchirable : résiste aux produits pointus, à la congélation et au sous-vide.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM56A1', // PA25
    barrierLayer: null,
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMN5A1', // PE100
    totalThicknessSilk: 12.5,
    badge: 'Indéchirable'
  },
  nylon_alu_barrier: {
    key: 'nylon_alu_barrier',
    category: 'Nylon Sous-Vide Indéchirable',
    name: 'Nylon + Pure Feuille Alu (PA25 + AL7 + PE85)',
    description: 'Le complexe le plus solide et le plus étanche de l\'industrie.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM56A1', // PA25
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMM5A1', // PE85
    totalThicknessSilk: 11.7,
    badge: 'Blindage +'
  },

  // --- FAMILLE 9 : AUTOCLAVE & RÉTORSION HAUTE TEMPÉRATURE (CPP) ---
  cpp_retort: {
    key: 'cpp_retort',
    category: 'Autoclave & Rétorsion (CPP)',
    name: 'CPP Stérilisable Autoclave 121°C (PET15 + AL7 + CPP60)',
    description: 'Résiste à la pasteurisation et cuisson sous pression (plats préparés, sauces, soupes).',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMX5A1', // CPP60
    totalThicknessSilk: 8.2,
    badge: '121°C'
  },

  // --- FAMILLE 10 : MULTI-COUCHES EXTRÊMES (4 ET 5 COUCHES) ---
  quad_pet_al_pa_pe: {
    key: 'quad_pet_al_pa_pe',
    category: 'Multi-Couches Extrêmes (4 & 5 Couches)',
    name: '4 Couches Militaire / Café Grain Pro (PET15 + AL7 + PA15 + PE100)',
    description: 'Quadruple lamination (3 passes) combinant Aluminium pur et Nylon anti-perforation.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM36A1', // PET15
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    barrierLayer2: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM96A1', // PA15
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMN5A1', // PE100
    totalThicknessSilk: 13.7,
    badge: '4 Couches'
  },
  quad_kraft_vmpet_pa_pe: {
    key: 'quad_kraft_vmpet_pa_pe',
    category: 'Multi-Couches Extrêmes (4 & 5 Couches)',
    name: '4 Couches Kraft Blindé (Kraft50g + VMPET12 + PA15 + PE100)',
    description: 'Kraft naturel renforcé par du Nylon et de l\'aluminium métallisé pour charges lourdes (1kg-5kg).',
    printLayer: 'FINST-HOE66X61EH24X6HEL84R97M96ASB301QNZTMMQ87', // Kraft50g
    barrierLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM76A1', // VMPET12
    barrierLayer2: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM96A1', // PA15
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMN5A1', // PE100
    totalThicknessSilk: 21.2,
    badge: '4 Couches Kraft'
  },
  penta_extreme_barrier: {
    key: 'penta_extreme_barrier',
    category: 'Multi-Couches Extrêmes (4 & 5 Couches)',
    name: '5 Couches Blindage Absolu (MOPP25 + Kraft35g + AL7 + PA15 + PE120)',
    description: 'Quintuple structure (4 passes de lamination) : toucher mat, rigidité kraft, alu pur, nylon et PE120.',
    printLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMZ5A1', // MOPP25
    barrierLayer: 'FINST-AZI66271NFI8INYALJYKX7QJ3O6732BI2P6TMCQW', // Kraft35g
    barrierLayer2: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMB6A1', // AL7
    barrierLayer3: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMM96A1', // PA15
    sealLayer: 'FINST-4XC66W81J943YA9OOKC0ODX7Y7RY28BU4PEMMP5A1', // PE120
    totalThicknessSilk: 23.2,
    badge: '5 Couches Max'
  }
};

