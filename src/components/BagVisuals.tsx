import React from 'react';

// 1. SAC DEBOUT (自立袋 / Stand-up Doypack)
export function StandUpBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Stand-up pouch outline with oval bottom gusset */}
      <path d="M10 7 L26 7 L29 27 C29 31, 7 31, 7 27 Z" />
      {/* Zipper line */}
      <line x1="11" y1="11" x2="25" y2="11" strokeDasharray="1.5 1.5" strokeOpacity="0.8" />
      {/* Bottom gusset curve */}
      <path d="M7 27 C13 24.5, 23 24.5, 29 27" strokeOpacity="0.6" />
      <path d="M7 27 C13 31.5, 23 31.5, 29 27" />
    </svg>
  );
}

// 2. SAC À TROIS SOUDURES (三边封 / 3-Side Seal Flat Pouch)
export function ThreeSideBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Flat rectangular pouch with 3 sealed margins */}
      <rect x="9" y="6" width="18" height="25" rx="1.5" />
      <line x1="12" y1="6" x2="12" y2="31" strokeOpacity="0.5" strokeDasharray="1 1.5" />
      <line x1="24" y1="6" x2="24" y2="31" strokeOpacity="0.5" strokeDasharray="1 1.5" />
      <line x1="9" y1="28.5" x2="27" y2="28.5" strokeOpacity="0.5" strokeDasharray="1 1.5" />
    </svg>
  );
}

// 3. SACHET À FERMETURE ÉCLAIR (拉链袋 / Zipper Pouch)
export function ZipperPouchIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="6" width="18" height="25" rx="1.5" />
      {/* Distinct zipper track */}
      <line x1="9" y1="12" x2="27" y2="12" strokeWidth="2.2" />
      <line x1="9" y1="14" x2="27" y2="14" strokeDasharray="1.5 1.5" strokeOpacity="0.8" />
      {/* Tear notch on sides */}
      <polygon points="7,10 9,12 7,14" fill="currentColor" />
      <polygon points="29,10 27,12 29,14" fill="currentColor" />
    </svg>
  );
}

// 4. SAC OCTOGONAL SCELLÉ / FOND PLAT (八边封 / Flat Bottom Box Pouch)
export function FlatBottomBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* 3D Box pouch / Octagonal structure */}
      <polygon points="11,7 25,7 28,27 8,27" />
      <polygon points="8,27 28,27 25,32 11,32" strokeOpacity="0.8" />
      {/* Vertical edge seals */}
      <line x1="14" y1="7" x2="12" y2="27" strokeOpacity="0.6" strokeDasharray="1.5 1.5" />
      <line x1="22" y1="7" x2="24" y2="27" strokeOpacity="0.6" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

// 5. SAC ACCORDÉON (风琴袋 / Side Gusset Pouch)
export function GussetBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Coffee side gusset pouch with visible pleats */}
      <path d="M11,7 L25,7 L27,30 L9,30 Z" />
      {/* Left pleated gusset */}
      <path d="M11,7 L14,18 L9,30" strokeOpacity="0.75" />
      {/* Right pleated gusset */}
      <path d="M25,7 L22,18 L27,30" strokeOpacity="0.75" />
    </svg>
  );
}

// 6. SAC SCELLÉ SUR QUATRE CÔTÉS (四边封 / Quad Seal Pouch)
export function FourSideBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="6" width="18" height="25" rx="1" />
      {/* 4 distinct vertical corner welds */}
      <line x1="11.5" y1="6" x2="11.5" y2="31" strokeWidth="1.5" strokeOpacity="0.85" />
      <line x1="24.5" y1="6" x2="24.5" y2="31" strokeWidth="1.5" strokeOpacity="0.85" />
      <line x1="15.5" y1="6" x2="15.5" y2="31" strokeDasharray="1.5 1.5" strokeOpacity="0.3" />
      <line x1="20.5" y1="6" x2="20.5" y2="31" strokeDasharray="1.5 1.5" strokeOpacity="0.3" />
    </svg>
  );
}

// 7. SAC SCELLÉ SUR LE DOS / CÔTÉS (背封袋 / Center Seal Pillow Pouch)
export function CenterSealBagIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="6" width="16" height="25" rx="1.5" />
      {/* Vertical center fin seal */}
      <line x1="18" y1="6" x2="18" y2="31" strokeWidth="2.2" />
      {/* Top and bottom horizontal sealing bands */}
      <line x1="10" y1="9" x2="26" y2="9" strokeOpacity="0.6" />
      <line x1="10" y1="28" x2="26" y2="28" strokeOpacity="0.6" />
    </svg>
  );
}

// 8. FILM EN ROULEAU (卷膜 / Roll Film Bobine)
export function RollFilmIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Packaging film spool */}
      <ellipse cx="12" cy="18" rx="5" ry="9" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      <path d="M12 9 L26 9 C29 9, 29 27, 26 27 L12 27" />
      <ellipse cx="26" cy="18" rx="3" ry="9" strokeOpacity="0.5" />
      {/* Unrolling film strip */}
      <path d="M18 27 L31 31" strokeWidth="1.8" strokeDasharray="2 1.5" />
    </svg>
  );
}
