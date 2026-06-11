import React from 'react';
import { Building2, Wallet } from 'lucide-react';

/* ─────────────────────────────────────────────
   SVG logos — pixel-accurate brand reproductions
───────────────────────────────────────────── */

// Chase: blue square with octagon negative-space mark
const ChaseLogo = () => (
  <div className="flex items-center gap-2">
    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
      <rect width="40" height="40" rx="4" fill="white" fillOpacity="0.15" />
      {/* Chase "Octagon" symbol — 4 quadrant squares with gap */}
      <rect x="4"  y="4"  width="14" height="14" rx="1.5" fill="white" />
      <rect x="22" y="4"  width="14" height="14" rx="1.5" fill="white" />
      <rect x="22" y="22" width="14" height="14" rx="1.5" fill="white" />
      <rect x="4"  y="22" width="14" height="14" rx="1.5" fill="white" />
    </svg>
    <span
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: 1, color: 'white' }}
    >CHASE</span>
  </div>
);

// Bank of America: flag stripe + wordmark
const BofALogo = () => (
  <div className="flex flex-col gap-1">
    {/* BofA "flag" — 3 interlocked curves rendered as arcs */}
    <svg viewBox="0 0 72 24" className="w-16 h-5">
      {/* Red swoosh */}
      <path d="M2 20 C14 4 28 4 36 12 C28 20 14 20 2 20Z" fill="#e31837" />
      {/* White swoosh */}
      <path d="M36 12 C44 4 58 4 70 20 L54 20 C46 20 38 16 36 12Z" fill="white" fillOpacity="0.9" />
      {/* Dark blue strip */}
      <path d="M2 20 C14 20 28 20 36 12 C38 16 46 20 54 20 Z" fill="#00308f" />
    </svg>
    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.3, color: 'white', lineHeight: 1 }}>
      Bank of America
    </span>
  </div>
);

// American Express: centurion silhouette + wordmark
const AmexLogo = () => (
  <div className="flex flex-col items-start gap-0.5">
    <svg viewBox="0 0 90 32" className="w-24 h-8">
      {/* Blue background pill */}
      <rect x="0" y="0" width="90" height="32" rx="3" fill="white" fillOpacity="0.12" />
      {/* Centurion head silhouette (simplified) */}
      <g fill="white" fillOpacity="0.9">
        <circle cx="14" cy="10" r="5" />
        <path d="M9 16 Q14 13 19 16 L21 28 L7 28Z" />
        {/* Helmet plume */}
        <path d="M11 7 Q14 2 17 7 Q15 6 14 6 Q13 6 11 7Z" fill="white" />
      </g>
      {/* AMERICAN EXPRESS text */}
      <text x="26" y="12" fill="white" fontSize="7.5" fontWeight="800" letterSpacing="0.6"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>AMERICAN</text>
      <text x="26" y="23" fill="white" fontSize="7.5" fontWeight="800" letterSpacing="0.6"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>EXPRESS</text>
    </svg>
  </div>
);

// Capital One: swoosh arc logo + wordmark
const CapitalOneLogo = () => (
  <div className="flex items-center gap-2">
    <svg viewBox="0 0 28 28" className="w-7 h-7">
      {/* Red swoosh ring */}
      <circle cx="14" cy="14" r="13" fill="none" stroke="#d03027" strokeWidth="5.5" strokeDasharray="60 25" strokeDashoffset="-5" strokeLinecap="round" />
    </svg>
    <span style={{ fontFamily: "'Optimist', 'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 17, color: 'white', letterSpacing: 0 }}>
      Capital One
    </span>
  </div>
);

// Wells Fargo: stagecoach + banner (iconic Wells Fargo branding)
const WellsFargoLogo = () => (
  <div className="flex flex-col gap-0.5">
    <svg viewBox="0 0 110 22" className="w-28 h-5">
      {/* Yellow top rule */}
      <rect x="0" y="0" width="110" height="3" fill="#f5c518" />
      {/* Stage coach silhouette */}
      <g fill="#f5c518">
        {/* Coach body */}
        <rect x="2" y="5" width="24" height="12" rx="2" />
        {/* Wheels */}
        <circle cx="7" cy="18" r="3.5" fill="none" stroke="#f5c518" strokeWidth="1.5" />
        <circle cx="21" cy="18" r="3.5" fill="none" stroke="#f5c518" strokeWidth="1.5" />
        {/* Spoke lines */}
        <line x1="7" y1="14.5" x2="7" y2="21.5" stroke="#f5c518" strokeWidth="1" />
        <line x1="3.5" y1="18" x2="10.5" y2="18" stroke="#f5c518" strokeWidth="1" />
        <line x1="21" y1="14.5" x2="21" y2="21.5" stroke="#f5c518" strokeWidth="1" />
        <line x1="17.5" y1="18" x2="24.5" y2="18" stroke="#f5c518" strokeWidth="1" />
        {/* Horses */}
        <path d="M26 13 L34 10 L38 13 L36 17 L26 17Z" />
        <path d="M38 10 L46 7 L50 10 L48 15 L38 15Z" />
      </g>
      {/* Wordmark */}
      <text x="56" y="16" fill="#f5c518" fontSize="12" fontWeight="800" letterSpacing="0.4"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>WELLS FARGO</text>
      {/* Yellow bottom rule */}
      <rect x="0" y="19" width="110" height="3" fill="#f5c518" />
    </svg>
  </div>
);

// Citi: wordmark with iconic red arc above
const CitiLogo = () => (
  <div className="flex items-center">
    <svg viewBox="0 0 80 36" className="w-20 h-9">
      {/* Red arc */}
      <path d="M28 14 Q40 2 52 14" fill="none" stroke="#e31837" strokeWidth="4.5" strokeLinecap="round" />
      {/* "citi" wordmark */}
      <text x="8" y="30" fill="white" fontSize="22" fontWeight="700" letterSpacing="0.5"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>citi</text>
    </svg>
  </div>
);

// Discover: wordmark + glowing orange circle
const DiscoverLogo = () => (
  <div className="flex items-center gap-1">
    <svg viewBox="0 0 110 30" className="w-28 h-7">
      {/* "discover" text — dark/white */}
      <text x="2" y="22" fill="white" fontSize="19" fontWeight="700" letterSpacing="0.5"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>discover</text>
      {/* Iconic orange glowing dot */}
      <defs>
        <radialGradient id="discoverDot" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      <circle cx="96" cy="15" r="13" fill="url(#discoverDot)" />
    </svg>
  </div>
);

// Generic account wallet icon
const CuentaLogo = () => (
  <div className="flex items-center gap-2 text-white">
    <Wallet className="w-6 h-6" />
    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
      Cuenta
    </span>
  </div>
);

// Generic "other bank" logo
const OtroLogo = ({ name }) => (
  <div className="flex items-center gap-2 text-white">
    <Building2 className="w-6 h-6 shrink-0" />
    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 17 }}
      className="truncate max-w-[120px]" title={name || 'Banco'}>
      {name || 'Banco'}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   Bank registry
───────────────────────────────────────────── */
export const PREDEFINED_BANKS = [
  {
    id: 'account',
    name: 'Cuenta',
    color: 'from-slate-800 to-slate-950',
    isAccount: true,
    logo: () => <CuentaLogo />,
  },
  {
    id: 'chase',
    name: 'Chase',
    color: 'from-[#1a8fe3] to-[#00529b]',
    logo: () => <ChaseLogo />,
  },
  {
    id: 'bofa',
    name: 'Bank of America',
    color: 'from-[#c8102e] to-[#8b0000]',
    logo: () => <BofALogo />,
  },
  {
    id: 'amex',
    name: 'American Express',
    color: 'from-[#1a3a6b] to-[#0c2240]',
    logo: () => <AmexLogo />,
  },
  {
    id: 'capitalone',
    name: 'Capital One',
    color: 'from-[#1c2b4a] to-[#0a1628]',
    logo: () => <CapitalOneLogo />,
  },
  {
    id: 'wellsfargo',
    name: 'Wells Fargo',
    color: 'from-[#c8102e] to-[#8b0000]',
    logo: () => <WellsFargoLogo />,
  },
  {
    id: 'citi',
    name: 'Citi',
    color: 'from-[#003087] to-[#001a5c]',
    logo: () => <CitiLogo />,
  },
  {
    id: 'discover',
    name: 'Discover',
    color: 'from-[#231f20] to-[#111111]',
    logo: () => <DiscoverLogo />,
  },
  {
    id: 'other',
    name: 'Otro Banco',
    color: 'from-slate-700 to-slate-900',
    logo: (name) => <OtroLogo name={name} />,
  },
];

export const getBankData = (bankName) => {
  const bank = PREDEFINED_BANKS.find(b => b.name === bankName || b.id === bankName);
  return bank || PREDEFINED_BANKS[PREDEFINED_BANKS.length - 1];
};
