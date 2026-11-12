import React from 'react';

// 1. SAC DEBOUT (DOYPACK)
export function StandUpBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="bagMylarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="bagGussetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        {/* Corps Doypack */}
        <path d="M 24 16 L 76 16 L 82 74 C 82 86, 18 86, 18 74 Z" fill="url(#bagMylarGrad)" stroke="#38bdf8" strokeWidth="2.5" />
        {/* Fond ovale déployé (Soufflet de fond) */}
        <ellipse cx="50" cy="74" rx="30" ry="10" fill="url(#bagGussetGrad)" stroke="#0284c7" strokeWidth="2" />
        <path d="M 20 74 C 30 68, 70 68, 80 74" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        {/* Zip Lock */}
        <line x1="26" y1="26" x2="74" y2="26" stroke="#f8fafc" strokeWidth="2" strokeDasharray="3 2" />
        {/* Encoche déchirable (Tear notch) */}
        <polygon points="22,23 25,26 22,29" fill="#38bdf8" />
        <polygon points="78,23 75,26 78,29" fill="#38bdf8" />
        {/* Reflet brillant */}
        <path d="M 30 22 L 38 22 L 32 72 L 24 72 Z" fill="#ffffff" fillOpacity="0.15" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">Sac Debout</span>
      <span className="text-[9px] font-mono text-cyan-400">Doypack (自立袋)</span>
    </div>
  );
}

// 2. SAC 3 SOUDURES PLAT
export function ThreeSideBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="flatBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* Corps plat */}
        <rect x="22" y="14" width="56" height="72" rx="3" fill="url(#flatBagGrad)" stroke="#818cf8" strokeWidth="2.5" />
        {/* Soudures 3 côtés hachurées */}
        <rect x="22" y="14" width="7" height="72" fill="#6366f1" fillOpacity="0.4" />
        <rect x="71" y="14" width="7" height="72" fill="#6366f1" fillOpacity="0.4" />
        <rect x="22" y="79" width="56" height="7" fill="#6366f1" fillOpacity="0.4" />
        <line x1="29" y1="14" x2="29" y2="79" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="71" y1="14" x2="71" y2="79" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="2 2" />
        {/* Zip */}
        <line x1="29" y1="28" x2="71" y2="28" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">3 Soudures</span>
      <span className="text-[9px] font-mono text-indigo-400">Plat (三边封)</span>
    </div>
  );
}

// 3. SAC OCTOGONAL (FOND PLAT / 8 CÔTÉS)
export function FlatBottomBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="boxBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* Face avant */}
        <polygon points="26,18 74,18 78,72 22,72" fill="url(#boxBagGrad)" stroke="#34d399" strokeWidth="2" />
        {/* Fond carré plat */}
        <polygon points="22,72 78,72 70,86 30,86" fill="#065f46" stroke="#34d399" strokeWidth="2" />
        {/* Soufflets latéraux pliés */}
        <line x1="34" y1="18" x2="30" y2="72" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="66" y1="18" x2="70" y2="72" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Zip latéral ou frontal */}
        <line x1="34" y1="28" x2="66" y2="28" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">8 Côtés Box</span>
      <span className="text-[9px] font-mono text-emerald-400">Fond Plat (八边封)</span>
    </div>
  );
}

// 4. FERMETURE CENTRALE / SACHET PILLOW
export function CenterSealBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="pillowBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="24" y="14" width="52" height="72" rx="4" fill="url(#pillowBagGrad)" stroke="#f59e0b" strokeWidth="2" />
        {/* Soudure centrale dorsale visible */}
        <line x1="50" y1="14" x2="50" y2="86" stroke="#fbbf24" strokeWidth="3" />
        {/* Finitions crantées haut et bas */}
        <line x1="24" y1="20" x2="76" y2="20" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="3 1" />
        <line x1="24" y1="80" x2="76" y2="80" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="3 1" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">Fermeture Dos</span>
      <span className="text-[9px] font-mono text-amber-400">Pillow (中封袋)</span>
    </div>
  );
}

// 5. SAC ACCORDÉON (SOUFFLETS LATÉRAUX CAFÉ)
export function GussetBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="gussetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#db2777" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#831843" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path d="M 28 14 L 72 14 L 76 86 L 24 86 Z" fill="url(#gussetGrad)" stroke="#ec4899" strokeWidth="2" />
        {/* Pli accordéon gauche & droit */}
        <path d="M 28 14 L 34 50 L 24 86" stroke="#fbcfe8" strokeWidth="2" fill="none" />
        <path d="M 72 14 L 66 50 L 76 86" stroke="#fbcfe8" strokeWidth="2" fill="none" />
        {/* Valve café au centre */}
        <circle cx="50" cy="40" r="4" fill="#ffffff" stroke="#be185d" strokeWidth="1.5" />
        <circle cx="50" cy="40" r="1.5" fill="#be185d" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">Sac Accordéon</span>
      <span className="text-[9px] font-mono text-pink-400">Soufflets (风琴袋)</span>
    </div>
  );
}

// 6. SAC SCELLÉ 4 CÔTÉS (QUAD SEAL)
export function FourSideBagImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="quadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#9333ea" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#581c87" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="24" y="14" width="52" height="72" rx="2" fill="url(#quadGrad)" stroke="#a855f7" strokeWidth="2" />
        {/* 4 arrêtes verticales scellées rigides */}
        <line x1="28" y1="14" x2="28" y2="86" stroke="#e9d5ff" strokeWidth="2.5" />
        <line x1="72" y1="14" x2="72" y2="86" stroke="#e9d5ff" strokeWidth="2.5" />
        <line x1="40" y1="14" x2="40" y2="86" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="60" y1="14" x2="60" y2="86" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">4 Soudures</span>
      <span className="text-[9px] font-mono text-purple-400">Quad Seal (四边封)</span>
    </div>
  );
}

// 7. BOBINE DE FILM (ROULEAU CONTINU)
export function RollFilmImage({ selected = false }: { selected?: boolean }) {
  return (
    <div className={`relative w-full aspect-square max-w-[110px] mx-auto rounded-xl p-2 flex flex-col items-center justify-center transition-all ${
      selected ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800'
    }`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="rollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Rouleau bobine */}
        <ellipse cx="32" cy="50" rx="14" ry="26" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="32" cy="50" rx="5" ry="10" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.5" />
        {/* Bobine corps */}
        <path d="M 32 24 L 70 24 C 84 24, 84 76, 70 76 L 32 76" fill="url(#rollGrad)" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="70" cy="50" rx="12" ry="26" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" fillOpacity="0.6" />
        {/* Bande de film qui se déroule */}
        <path d="M 50 76 L 86 86" stroke="#bae6fd" strokeWidth="3" strokeDasharray="3 2" />
      </svg>
      <span className="text-[11px] font-bold text-slate-200 mt-1.5 text-center leading-tight">Film Rouleau</span>
      <span className="text-[9px] font-mono text-sky-400">Bobine (卷膜)</span>
    </div>
  );
}

// 8. VIGNETTES DES FINITIONS EN IMAGES
export function FinishVisualThumbnail({ type, active }: { type: 'matte' | 'spot_uv' | 'foil' | 'spout' | 'valve' | 'handle'; active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
      active ? 'bg-cyan-500/25 ring-1 ring-cyan-400 text-cyan-300' : 'bg-slate-800/80 text-slate-400'
    }`}>
      {type === 'matte' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          <path d="M12 7v10" />
        </svg>
      )}
      {type === 'spot_uv' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      )}
      {type === 'foil' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400" fill="currentColor">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      )}
      {type === 'spout' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3h6v4H9zM7 7h10v3H7zM10 10v10M14 10v10" />
        </svg>
      )}
      {type === 'valve' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="4" />
        </svg>
      )}
      {type === 'handle' && (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="8" width="14" height="8" rx="4" />
        </svg>
      )}
    </div>
  );
}

