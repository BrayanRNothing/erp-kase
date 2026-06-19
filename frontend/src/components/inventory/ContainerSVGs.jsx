import React from 'react';

export const BoteSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tapa */}
    <path d="M35 25V20C35 17.2386 37.2386 15 40 15H60C62.7614 15 65 17.2386 65 20V25" fill="#e2e8f0"/>
    <path d="M35 20H65V25H35V20Z" fill="#cbd5e1"/>
    {/* Cuello */}
    <path d="M40 25H60V30H40V25Z" fill={color} opacity="0.9"/>
    {/* Cuerpo principal */}
    <path d="M25 40C25 34.4772 29.4772 30 35 30H65C70.5228 30 75 34.4772 75 40V80C75 85.5228 70.5228 90 65 90H35C29.4772 90 25 85.5228 25 80V40Z" fill={color}/>
    {/* Reflejos / Sombreado */}
    <path d="M30 40C30 35.5817 33.5817 32 38 32H45V88H38C33.5817 88 30 84.4183 30 80V40Z" fill="white" fillOpacity="0.2"/>
    {/* Etiqueta */}
    <rect x="35" y="50" width="30" height="25" rx="2" fill="white" fillOpacity="0.9"/>
    <rect x="40" y="55" width="20" height="4" rx="2" fill="#cbd5e1"/>
    <rect x="40" y="63" width="12" height="4" rx="2" fill="#cbd5e1"/>
  </svg>
);

export const TamborSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cuerpo */}
    <path d="M20 20C20 17.2386 22.2386 15 25 15H75C77.7614 15 80 17.2386 80 20V85C80 87.7614 77.7614 90 75 90H25C22.2386 90 20 87.7614 20 85V20Z" fill={color}/>
    {/* Anillos horizontales del tambor */}
    <rect x="18" y="30" width="64" height="6" rx="2" fill="black" fillOpacity="0.15"/>
    <rect x="18" y="60" width="64" height="6" rx="2" fill="black" fillOpacity="0.15"/>
    <rect x="20" y="15" width="60" height="4" fill="black" fillOpacity="0.2"/>
    <rect x="20" y="86" width="60" height="4" fill="black" fillOpacity="0.2"/>
    {/* Reflejos laterales */}
    <path d="M25 20C25 17.2386 27.2386 15 30 15H38V90H30C27.2386 90 25 87.7614 25 85V20Z" fill="white" fillOpacity="0.15"/>
    <path d="M68 15H75C77.7614 15 80 17.2386 80 20V85C80 87.7614 77.7614 90 75 90H68V15Z" fill="black" fillOpacity="0.15"/>
    {/* Tapas de arriba */}
    <circle cx="35" cy="12" r="3" fill="#cbd5e1"/>
    <circle cx="65" cy="12" r="2" fill="#cbd5e1"/>
  </svg>
);

export const CubetaSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Asa (metal) */}
    <path d="M15 35V25C15 13.9543 23.9543 5 35 5H65C76.0457 5 85 13.9543 85 25V35" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
    {/* Cuerpo (forma cónica invertida) */}
    <path d="M20 25L28 85C28.5 88 31 90 34 90H66C69 90 71.5 88 72 85L80 25H20Z" fill={color}/>
    {/* Borde superior */}
    <rect x="16" y="20" width="68" height="8" rx="3" fill={color}/>
    <rect x="16" y="20" width="68" height="8" rx="3" fill="black" fillOpacity="0.1"/>
    {/* Reflejos laterales */}
    <path d="M25 28L31 85C31.2 87 32 88 34 88H42L35 28H25Z" fill="white" fillOpacity="0.2"/>
    <path d="M75 28L69 85C68.8 87 68 88 66 88H58L65 28H75Z" fill="black" fillOpacity="0.15"/>
    {/* Anillo de refuerzo del cuerpo */}
    <path d="M22 40H78" stroke="black" strokeOpacity="0.1" strokeWidth="3"/>
  </svg>
);

export const TinaSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cuerpo de la tina (más ancha que alta) */}
    <path d="M10 35C10 32.2386 12.2386 30 15 30H85C87.7614 30 90 32.2386 90 35V75C90 83.2843 83.2843 90 75 90H25C16.7157 90 10 83.2843 10 75V35Z" fill={color}/>
    {/* Borde superior */}
    <rect x="6" y="25" width="88" height="10" rx="4" fill={color}/>
    <rect x="6" y="25" width="88" height="10" rx="4" fill="black" fillOpacity="0.1"/>
    {/* Reflejo horizontal */}
    <path d="M10 40H90V50H10V40Z" fill="white" fillOpacity="0.15"/>
    {/* Reflejos laterales */}
    <path d="M15 35V75C15 80.5228 19.4772 85 25 85H35V35H15Z" fill="white" fillOpacity="0.15"/>
    <path d="M85 35V75C85 80.5228 80.5228 85 75 85H65V35H85Z" fill="black" fillOpacity="0.15"/>
    {/* Asas laterales */}
    <rect x="2" y="38" width="8" height="14" rx="3" fill="#cbd5e1"/>
    <rect x="90" y="38" width="8" height="14" rx="3" fill="#cbd5e1"/>
  </svg>
);
