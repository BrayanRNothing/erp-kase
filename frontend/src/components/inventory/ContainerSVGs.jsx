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

export const PinturaSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Asa */}
    <path d="M20 35C20 15 80 15 80 35" stroke="#94a3b8" strokeWidth="3" fill="none" />
    <circle cx="20" cy="35" r="2" fill="#64748b"/>
    <circle cx="80" cy="35" r="2" fill="#64748b"/>
    {/* Cuerpo (Cilindro ligeramente cónico) */}
    <path d="M20 35L24 85C24.5 88 28 90 35 90H65C72 90 75.5 88 76 85L80 35H20Z" fill={color}/>
    {/* Borde Superior / Tapa */}
    <rect x="18" y="30" width="64" height="6" rx="2" fill="white" fillOpacity="0.9"/>
    <rect x="18" y="30" width="64" height="6" rx="2" fill="black" fillOpacity="0.1"/>
    <rect x="20" y="27" width="60" height="3" rx="1" fill="white" fillOpacity="0.95"/>
    {/* Reflejos Laterales */}
    <path d="M25 40L28 85C28.2 87 29 88 32 88H40L32 40H25Z" fill="white" fillOpacity="0.15"/>
    <path d="M75 40L72 85C71.8 87 71 88 68 88H60L68 40H75Z" fill="black" fillOpacity="0.15"/>
    {/* Etiqueta Frontal */}
    <rect x="35" y="45" width="30" height="25" rx="2" fill="white" fillOpacity="0.9"/>
    <rect x="40" y="50" width="20" height="4" rx="2" fill={color} fillOpacity="0.8"/>
  </svg>
);

export const GalonSVG = ({ color = "#3B82F6", className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cuerpo del galón */}
    <path d="M20 40C20 35 25 35 30 35H45V20H55V35H70C75 35 80 35 80 40V85C80 90 75 90 70 90H30C25 90 20 90 20 85V40Z" fill={color}/>
    {/* Asa del galón (integrada al cuerpo) */}
    <path d="M30 20H45C50 20 50 25 50 30V35H25C25 25 25 20 30 20Z" fill={color}/>
    <path d="M32 25H43C45 25 45 28 45 30V35H30V28C30 25 30 25 32 25Z" fill="white" fillOpacity="0.9"/>
    {/* Tapa (Pico inclinado) */}
    <path d="M60 25L68 20L72 25L65 30Z" fill="#e2e8f0"/>
    <path d="M62 23L67 20L69 22L64 25Z" fill="#cbd5e1"/>
    {/* Base cuerpo derecha */}
    <path d="M50 35L75 25C78 25 80 28 80 32V40H50V35Z" fill={color}/>
    {/* Reflejos Laterales */}
    <path d="M25 40V85C25 88 27 88 30 88H40V40H25Z" fill="white" fillOpacity="0.15"/>
    <path d="M75 40V85C75 88 73 88 70 88H60V40H75Z" fill="black" fillOpacity="0.15"/>
    {/* Líneas de relieve */}
    <rect x="35" y="55" width="30" height="3" rx="1" fill="black" fillOpacity="0.1"/>
    <rect x="35" y="65" width="30" height="3" rx="1" fill="black" fillOpacity="0.1"/>
    <rect x="35" y="75" width="30" height="3" rx="1" fill="black" fillOpacity="0.1"/>
  </svg>
);
