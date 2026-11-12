import React from 'react';

// 1. Vernis Mat Global (Finition mate soyeuse / anti-reflet)
export function MatteVarnishIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <radialGradient id="matteSoft" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={active ? '#38bdf8' : '#94a3b8'} stopOpacity="0.35" />
          <stop offset="100%" stopColor={active ? '#0284c7' : '#475569'} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#matteSoft)" stroke={active ? '#38bdf8' : '#475569'} strokeWidth="1.8" />
      {/* Texture dépolie mat micro-points */}
      <circle cx="12" cy="12" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="20" cy="14" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="28" cy="12" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="15" cy="22" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="25" cy="22" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="12" cy="28" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="20" cy="28" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      <circle cx="28" cy="28" r="1.5" fill={active ? '#7dd3fc' : '#94a3b8'} />
      {/* Vague douce mat */}
      <path d="M8 20 C 14 16, 26 24, 32 20" stroke={active ? '#bae6fd' : '#cbd5e1'} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 2. Vernis Sélectif UV (Brillance miroir avec éclat lumineux)
export function SpotUvIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id="uvGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={active ? '#38bdf8' : '#38bdf8'} stopOpacity="0.9" />
          <stop offset="50%" stopColor={active ? '#a855f7' : '#818cf8'} stopOpacity="0.8" />
          <stop offset="100%" stopColor={active ? '#ec4899' : '#c084fc'} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#a855f7' : '#475569'} strokeWidth="1.8" />
      {/* Zone avec vernis brillant spot */}
      <polygon points="20,8 24,16 33,17 26,23 28,32 20,27 12,32 14,23 7,17 16,16" fill="url(#uvGlossGrad)" stroke={active ? '#f472b6' : '#a855f7'} strokeWidth="1.5" />
      {/* Rayons lumineux */}
      <circle cx="20" cy="20" r="3" fill="#ffffff" />
      <line x1="20" y1="5" x2="20" y2="2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="20" x2="38" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 3. Dorure à Chaud (Metallic Gold Hot Foil Stamping)
export function HotFoilIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(234, 179, 8, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#eab308' : '#475569'} strokeWidth="1.8" />
      {/* Lingot ou sceau de dorure étincelant */}
      <path d="M10 16 L20 10 L30 16 L20 22 Z" fill="url(#goldGrad)" stroke="#fde047" strokeWidth="1.5" />
      <path d="M10 16 L20 22 L20 30 L10 24 Z" fill="#b45309" stroke="#fde047" strokeWidth="1.5" />
      <path d="M30 16 L20 22 L20 30 L30 24 Z" fill="#ca8a04" stroke="#fde047" strokeWidth="1.5" />
      {/* Étoile de brillance dorée */}
      <path d="M32 9 L33.5 12 L36.5 13.5 L33.5 15 L32 18 L30.5 15 L27.5 13.5 L30.5 12 Z" fill="#fef08a" />
    </svg>
  );
}

// 4. Valve de Dégazage Café (One-way degassing aroma valve)
export function DegassingValveIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#06b6d4' : '#475569'} strokeWidth="1.8" />
      {/* Corps rond de la valve */}
      <circle cx="20" cy="20" r="12" fill={active ? '#0e7490' : '#334155'} stroke={active ? '#22d3ee' : '#94a3b8'} strokeWidth="2" />
      <circle cx="20" cy="20" r="8" fill={active ? '#155e75' : '#1e293b'} stroke={active ? '#67e8f9' : '#64748b'} strokeWidth="1.5" />
      {/* 3 micro-trous d'évacuation de gaz CO2 */}
      <circle cx="20" cy="16" r="1.8" fill="#ffffff" />
      <circle cx="16" cy="22" r="1.8" fill="#ffffff" />
      <circle cx="24" cy="22" r="1.8" fill="#ffffff" />
      {/* Flèches ou ondes d'arôme */}
      <path d="M20 7 C 22 5, 23 4, 25 3" stroke={active ? '#a5f3fc' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 6 C 18 4, 19 3, 21 2" stroke={active ? '#a5f3fc' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 5. Trou de Suspension (Euro-hole / Sombrero slot)
export function HangingHoleIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#10b981' : '#475569'} strokeWidth="1.8" />
      {/* En-tête de sachet perforé */}
      <rect x="8" y="11" width="24" height="18" rx="2" fill={active ? '#064e3b' : '#1e293b'} stroke={active ? '#34d399' : '#64748b'} strokeWidth="1.5" />
      {/* Découpe trou Sombrero Européen */}
      <path d="M14 20 C14 18, 16 16, 18 16 L22 16 C24 16, 26 18, 26 20 L27 21 C27 22, 26 23, 25 23 L15 23 C14 23, 13 22, 13 21 Z" fill="#ffffff" stroke={active ? '#10b981' : '#94a3b8'} strokeWidth="1.2" />
      <circle cx="20" cy="18" r="2" fill="#047857" />
    </svg>
  );
}

// 6. Bouchon & Bec Verseur (Spout fitment 10mm / 16mm pour liquides & gels)
export function SpoutFitmentIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(249, 115, 22, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#f97316' : '#475569'} strokeWidth="1.8" />
      {/* Bouchon à vis cranté */}
      <rect x="15" y="8" width="10" height="7" rx="1.5" fill={active ? '#ea580c' : '#475569'} stroke={active ? '#fb923c' : '#94a3b8'} strokeWidth="1.5" />
      <line x1="18" y1="8" x2="18" y2="15" stroke="#ffffff" strokeWidth="1" />
      <line x1="22" y1="8" x2="22" y2="15" stroke="#ffffff" strokeWidth="1" />
      {/* Collerette et bague d'inviolabilité */}
      <path d="M13 15 L27 15 L25 20 L15 20 Z" fill={active ? '#c2410c' : '#334155'} stroke={active ? '#fdba74' : '#94a3b8'} strokeWidth="1.5" />
      {/* Ailettes de thermosoudure dans le film */}
      <path d="M11 20 L29 20 L26 28 L14 28 Z" fill={active ? '#7c2d12' : '#1e293b'} stroke={active ? '#fb923c' : '#64748b'} strokeWidth="1.5" />
      <line x1="8" y1="28" x2="32" y2="28" stroke={active ? '#fdba74' : '#94a3b8'} strokeWidth="2" />
    </svg>
  );
}

// 7. Fermeture Zip Hermétique (Interlocking Zip Lock)
export function ZipLockIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#3b82f6' : '#475569'} strokeWidth="1.8" />
      {/* Rails de zip dentelés */}
      <line x1="8" y1="17" x2="32" y2="17" stroke={active ? '#60a5fa' : '#94a3b8'} strokeWidth="2.5" />
      <line x1="8" y1="23" x2="32" y2="23" stroke={active ? '#60a5fa' : '#94a3b8'} strokeWidth="2.5" />
      {/* Dents alternées de fermeture */}
      <path d="M10 17 L12 23 M15 17 L17 23 M20 17 L22 23 M25 17 L27 23 M30 17 L32 23" stroke="#ffffff" strokeWidth="1.5" />
      {/* Curseur de fermeture zip */}
      <rect x="17" y="14" width="7" height="12" rx="2" fill={active ? '#2563eb' : '#475569'} stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

// 8. Vernis Sélectif Épais 3D (Thick 3D Embossed UV - 厚UV)
export function ThickUv3DIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(236, 72, 153, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#ec4899' : '#475569'} strokeWidth="1.8" />
      {/* Couche basse 3D */}
      <path d="M9 24 L20 30 L31 24 L20 18 Z" fill={active ? '#831843' : '#1e293b'} stroke={active ? '#f472b6' : '#64748b'} strokeWidth="1.4" />
      {/* Couche intermédiaire relief */}
      <path d="M9 20 L20 26 L31 20 L20 14 Z" fill={active ? '#be185d' : '#334155'} stroke={active ? '#f9a8d4' : '#94a3b8'} strokeWidth="1.4" />
      {/* Dôme supérieur brillant 3D */}
      <path d="M9 16 L20 22 L31 16 L20 10 Z" fill={active ? '#ec4899' : '#475569'} stroke="#ffffff" strokeWidth="1.5" />
      <text x="20" y="18" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">3D</text>
    </svg>
  );
}

// 9. Découpe sur-mesure / Sac de Forme Spéciale (Die-Cut 模切 / 异形袋)
export function DieCutShapeIcon({ active = false, className = 'w-7 h-7' }: { active?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill={active ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.6)'} stroke={active ? '#f43f5e' : '#475569'} strokeWidth="1.8" />
      {/* Contour de découpe créatif en pointillés + silhouette bouteille/forme */}
      <path d="M16 8 L24 8 L24 13 C28 15, 30 19, 29 25 C28 29, 26 32, 20 32 C14 32, 12 29, 11 25 C10 19, 12 15, 16 13 Z" fill={active ? '#881337' : '#1e293b'} stroke={active ? '#fb7185' : '#94a3b8'} strokeWidth="1.8" strokeDasharray="3 1.5" />
      <circle cx="20" cy="22" r="3" fill={active ? '#fda4af' : '#64748b'} />
    </svg>
  );
}


