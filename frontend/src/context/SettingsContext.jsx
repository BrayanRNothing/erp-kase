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

  useEffect(() => {
    localStorage.setItem('erp_background', backgroundUrl);
  }, [backgroundUrl]);

  useEffect(() => {
    localStorage.setItem('erp_language', language);
  }, [language]);

  return (
    <SettingsContext.Provider value={{ backgroundUrl, setBackgroundUrl, language, setLanguage }}>
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
