import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [backgroundUrl, setBackgroundUrl] = useState(() => {
    const saved = localStorage.getItem('erp_background');
    if (saved && saved !== "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064209_0cb7d815-ff61-4caa-a6d5-bbff145ab272.mp4") {
      return saved;
    }
    return "/background_video.mp4";
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('erp_language') || 'en';
  });

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('erp_theme_color') || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('erp_background', backgroundUrl);
  }, [backgroundUrl]);

  useEffect(() => {
    localStorage.setItem('erp_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('erp_theme_color', themeColor);
    
    const palettes = {
      violet: {
        50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
        500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065'
      },
      emerald: {
        50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399',
        500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22'
      },
      rose: {
        50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
        500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519'
      },
      amber: {
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
        500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03'
      },
      blue: {
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
        500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
      },
      cyan: {
        50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
        500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344'
      },
      fuchsia: {
        50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9',
        500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e'
      },
      orange: {
        50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
        500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407'
      }
    };

    if (themeColor !== 'indigo' && palettes[themeColor]) {
      const p = palettes[themeColor];
      let styleEl = document.getElementById('theme-override');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-override';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `
        :root {
          --color-indigo-50: ${p[50]};
          --color-indigo-100: ${p[100]};
          --color-indigo-200: ${p[200]};
          --color-indigo-300: ${p[300]};
          --color-indigo-400: ${p[400]};
          --color-indigo-500: ${p[500]};
          --color-indigo-600: ${p[600]};
          --color-indigo-700: ${p[700]};
          --color-indigo-800: ${p[800]};
          --color-indigo-900: ${p[900]};
          --color-indigo-950: ${p[950]};
        }
      `;
    } else {
      const styleEl = document.getElementById('theme-override');
      if (styleEl) styleEl.innerHTML = '';
    }
  }, [themeColor]);

  return (
    <SettingsContext.Provider value={{ backgroundUrl, setBackgroundUrl, language, setLanguage, themeColor, setThemeColor }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
