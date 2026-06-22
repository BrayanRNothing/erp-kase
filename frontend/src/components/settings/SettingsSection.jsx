import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Globe, Save, Check, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n/translations';
import toast from 'react-hot-toast';

const THEMES = [
  { id: 'indigo', name: 'Indigo (Default)', class: 'bg-indigo-500', border: 'ring-indigo-300' },
  { id: 'violet', name: 'Violet', class: 'bg-violet-500', border: 'ring-violet-300' },
  { id: 'emerald', name: 'Emerald', class: 'bg-emerald-500', border: 'ring-emerald-300' },
  { id: 'rose', name: 'Rose', class: 'bg-rose-500', border: 'ring-rose-300' },
  { id: 'amber', name: 'Amber', class: 'bg-amber-500', border: 'ring-amber-300' },
  { id: 'blue', name: 'Blue', class: 'bg-blue-500', border: 'ring-blue-300' },
  { id: 'cyan', name: 'Cyan', class: 'bg-cyan-500', border: 'ring-cyan-300' },
  { id: 'fuchsia', name: 'Fuchsia', class: 'bg-fuchsia-500', border: 'ring-fuchsia-300' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-500', border: 'ring-orange-300' }
];

export function SettingsSection() {
  const { user, updateUser } = useAuth();
  const { backgroundUrl, setBackgroundUrl, language, setLanguage, themeColor, setThemeColor } = useSettings();

  const t = getT(language);
  const ts = t.settings;

  const [activeTab, setActiveTab] = useState('profile');

  // Local state for profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Local state for appearance form
  const [appData, setAppData] = useState({
    backgroundUrl: backgroundUrl || '',
    language: language || 'es',
    themeColor: themeColor || 'indigo',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAppChange = (e) => {
    setAppData({ ...appData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    updateUser({ name: profileData.name, email: profileData.email });
    toast.success(t.settings.profile.title + ' ' + 'guardado');
  };

  const handleSaveApp = () => {
    setBackgroundUrl(appData.backgroundUrl);
    setLanguage(appData.language); // This triggers re-render of everything using useSettings
    setThemeColor(appData.themeColor);
    toast.success(t.settings.appearance.title + ' ' + 'guardado');
  };

  const tabs = [
    { id: 'profile',       icon: User,     label: ts.tabs.profile },
    { id: 'appearance',    icon: ImageIcon, label: ts.tabs.appearance },
    { id: 'security',      icon: Shield,   label: ts.tabs.security },
    { id: 'notifications', icon: Bell,     label: ts.tabs.notifications },
  ];

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar de Ajustes */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido de Ajustes */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 overflow-y-auto custom-scrollbar relative shadow-sm">
        <div className="max-w-2xl">

          {/* ── PERFIL ── */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{ts.profile.title}</h3>
                <p className="text-sm text-slate-500">{ts.profile.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{ts.profile.fullName}</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{ts.profile.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{ts.profile.currentRole}</label>
                  <input
                    type="text"
                    value={user?.role === 'ADMIN' ? t.sidebar.admin : t.sidebar.user}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed shadow-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">{ts.profile.roleNote}</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                {/* Removed saved state visual since we use toast */ }
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors"
                >
                  <Save size={16} /> {ts.profile.save}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── APARIENCIA ── */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{ts.appearance.title}</h3>
                <p className="text-sm text-slate-500">{ts.appearance.subtitle}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
                    <Globe size={16} /> {ts.appearance.language}
                  </label>
                  <div className="relative">
                    <select
                      name="language"
                      value={appData.language}
                      onChange={handleAppChange}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer shadow-sm"
                    >
                      <option value="es">Español (Latinoamérica)</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-3">
                    <ImageIcon size={16} /> Color del Tema
                  </label>
                  <div className="flex items-center gap-4">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setAppData({...appData, themeColor: theme.id});
                          setThemeColor(theme.id);
                        }}
                        className={`w-10 h-10 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center ${theme.class} ${appData.themeColor === theme.id ? `ring-4 ${theme.border} scale-110` : 'hover:scale-105'}`}
                        title={theme.name}
                      >
                        {appData.themeColor === theme.id && <Check size={16} className="text-white" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
                    <ImageIcon size={16} /> {ts.appearance.backgroundUrl}
                  </label>
                  <input
                    type="text"
                    name="backgroundUrl"
                    value={appData.backgroundUrl}
                    onChange={handleAppChange}
                    placeholder={ts.appearance.backgroundPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors shadow-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">{ts.appearance.backgroundNote}</p>

                  {appData.backgroundUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 h-32 relative pointer-events-none shadow-sm">
                      {appData.backgroundUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                        <video src={appData.backgroundUrl} autoPlay loop muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={appData.backgroundUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                        <span className="text-white text-xs font-bold drop-shadow-md bg-black/40 px-3 py-1.5 rounded-lg">{ts.appearance.preview}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                {/* Removed saved state visual since we use toast */ }
                <button
                  onClick={handleSaveApp}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors"
                >
                  <Save size={16} /> {ts.appearance.save}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── PRÓXIMAMENTE ── */}
          {(activeTab === 'security' || activeTab === 'notifications') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                {activeTab === 'security'
                  ? <Shield size={32} className="text-slate-400" />
                  : <Bell size={32} className="text-slate-400" />
                }
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{ts.comingSoon.title}</h3>
              <p className="text-sm text-slate-500 max-w-xs">{ts.comingSoon.subtitle}</p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
