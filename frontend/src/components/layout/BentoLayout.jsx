import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowRightLeft, FileText, BarChart3,
  Settings, CreditCard, Users, Calculator, HelpCircle, X,
  Bell, CheckCircle2, AlertCircle, Info, Star, Shield,
  Calendar, TrendingUp, Wallet, FolderLock, Sparkles, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useSettings } from '../../context/SettingsContext';
import { useActivity, ACTIVITY_TYPES } from '../../context/ActivityContext';
import { getT } from '../../i18n/translations';
import { UsersSection } from '../admin/UsersSection';
import { CardsSection } from '../finance/CardsSection';
import { MovementsSection } from '../finance/MovementsSection';
import { BudgetsSection } from '../finance/BudgetsSection';
import { ReportsSection } from '../finance/ReportsSection';
import { InvoiceSection } from '../finance/InvoiceSection';
import { VaultSection } from '../finance/VaultSection';
import { ClientsSection } from '../finance/ClientsSection';
import { SettingsSection } from '../settings/SettingsSection';

// ── Placeholder ──
function Placeholder({ title, t }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-300">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Settings className="w-8 h-8 text-slate-300 animate-[spin_4s_linear_infinite]" />
      </div>
      <p className="text-xl font-medium tracking-wide text-slate-400">{t.placeholder.title}</p>
      <p className="text-sm text-slate-300 text-center max-w-xs">{t.placeholder.content}</p>
    </div>
  );
}

// ── Card base (reemplaza GlassBox) ──
function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white ${className}`}
      style={{
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.06)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function BentoLayout() {
  const { user, logout } = useAuth();
  const { cards, getTotalBalance } = useFinance();
  const { language } = useSettings();
  const { activities } = useActivity();
  const [selectedId, setSelectedId] = useState(null);

  const t = getT(language);
  const totalBalance = getTotalBalance();

  const themeStyles = {
    sky: { text: 'group-hover:text-sky-500', border: 'hover:border-sky-300' },
    emerald: { text: 'group-hover:text-emerald-500', border: 'hover:border-emerald-300' },
    amber: { text: 'group-hover:text-amber-500', border: 'hover:border-amber-300' },
    indigo: { text: 'group-hover:text-indigo-500', border: 'hover:border-indigo-300' },
    violet: { text: 'group-hover:text-violet-500', border: 'hover:border-violet-300' },
    fuchsia: { text: 'group-hover:text-fuchsia-500', border: 'hover:border-fuchsia-300' },
    pink: { text: 'group-hover:text-pink-500', border: 'hover:border-pink-300' },
    teal: { text: 'group-hover:text-teal-500', border: 'hover:border-teal-300' },
    slate: { text: 'group-hover:text-slate-800', border: 'hover:border-slate-300' },
    blue: { text: 'group-hover:text-blue-500', border: 'hover:border-blue-300' },
  };

  const SECTIONS = [
    { id: 'reports',   title: t.sections.reports,   icon: BarChart3,      component: ReportsSection, theme: 'sky' },
    { id: 'movements', title: t.sections.movements, icon: ArrowRightLeft, component: MovementsSection, theme: 'emerald' },
    { id: 'cards',     title: t.sections.cards,     icon: CreditCard,     component: CardsSection, theme: 'amber' },
    { id: 'billing',   title: t.sections.billing,   icon: FileText,       component: InvoiceSection, theme: 'indigo' },
    { id: 'vault',     title: t.sections.vault,     icon: FolderLock,     component: VaultSection, theme: 'violet' },
    { id: 'budgets',   title: t.sections.budgets,   icon: Calculator,     component: BudgetsSection, theme: 'fuchsia' },
    { id: 'ai',        title: t.sections.ai,        icon: Sparkles,       component: (props) => <Placeholder {...props} t={t} />, theme: 'pink' },
    { id: 'clients',   title: t.sections.clients,   icon: Users,          component: ClientsSection, theme: 'teal' },
    { id: 'settings',  title: t.sections.settings,  icon: Settings,       component: SettingsSection, theme: 'slate' },
  ];

  const activeSections = user?.role === 'ADMIN'
    ? [...SECTIONS, { id: 'users', title: t.sections.users, icon: Users, component: UsersSection, theme: 'blue' }]
    : SECTIONS;

  const selected = activeSections.find(s => s.id === selectedId);
  const avatar = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="h-screen w-full flex overflow-hidden p-6 gap-6">

      {/* ── SIDEBAR IZQUIERDO ── */}
      <div className="w-72 flex flex-col gap-4 shrink-0 h-full">

        {/* Perfil */}
        <Card className="p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-base shrink-0">
              {avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              title={t.sidebar.logout}
            >
              <LogOut size={16} />
            </button>
          </div>
        </Card>

        {/* Balance rápido */}
        <Card className="p-5 shrink-0">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-5 rounded bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 relative overflow-hidden shadow-sm">
              <div className="absolute top-1/2 left-0 w-full h-px bg-black/15" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-black/15" />
            </div>
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">{t.sidebar.totalAccumulated}</span>
          </div>
          <div>
            <p className="text-slate-900 text-3xl font-bold tracking-tight">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">{cards?.length || 0} {t.sidebar.linkedAccounts}</p>
              <Wallet size={16} className="text-slate-300" />
            </div>
          </div>
        </Card>

        {/* Actividad Reciente */}
        <Card className="flex-1 p-5 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              <TrendingUp size={13} className="text-emerald-500" /> Recent Activity
            </span>
            {activities.length > 0 && (
              <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-px rounded-full">
                {activities.length}
              </span>
            )}
          </div>
          <div className="overflow-y-auto flex-1 space-y-1 custom-scrollbar">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300 py-6">
                <TrendingUp size={28} className="opacity-40" />
                <p className="text-xs text-center">Actions you perform<br/>will appear here.</p>
              </div>
            ) : (
              activities.map(a => {
                const activityMeta = {
                  [ACTIVITY_TYPES.MOVEMENT_ADDED]:   { color: 'text-emerald-500', icon: ArrowRightLeft },
                  [ACTIVITY_TYPES.CARD_ADDED]:       { color: 'text-sky-500',     icon: CreditCard },
                  [ACTIVITY_TYPES.CARD_DELETED]:     { color: 'text-red-500',     icon: CreditCard },
                  [ACTIVITY_TYPES.CARD_TOGGLED]:     { color: 'text-amber-500',   icon: CreditCard },
                  [ACTIVITY_TYPES.DOCUMENT_ADDED]:   { color: 'text-violet-500',  icon: FileText },
                  [ACTIVITY_TYPES.DOCUMENT_DELETED]: { color: 'text-red-500',     icon: FileText },
                  [ACTIVITY_TYPES.INVOICE_SAVED]:    { color: 'text-sky-500',     icon: FileText },
                  [ACTIVITY_TYPES.BUDGET_ADDED]:     { color: 'text-amber-500',   icon: Calculator },
                  [ACTIVITY_TYPES.BUDGET_DELETED]:   { color: 'text-red-500',     icon: Calculator },
                  [ACTIVITY_TYPES.TRANSFER]:         { color: 'text-indigo-500',  icon: ArrowRightLeft },
                }[a.type] ?? { color: 'text-slate-400', icon: Info };

                const Icon = activityMeta.icon;
                const timeAgo = (() => {
                  const diff = Math.floor((Date.now() - a.timestamp.getTime()) / 1000);
                  if (diff < 60) return 'now';
                  if (diff < 3600) return `${Math.floor(diff/60)}m`;
                  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
                  return `${Math.floor(diff/86400)}d`;
                })();

                return (
                  <div key={a.id} className="flex items-start gap-2.5 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Icon size={13} className={`${activityMeta.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{a.title}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{a.description}</p>
                    </div>
                    <span className="text-xs text-slate-300 shrink-0 mt-0.5">{timeAgo}</span>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>


      {/* ── ÁREA PRINCIPAL DERECHA ── */}
      <div className="flex-1 relative h-full flex flex-col items-center justify-center min-w-0">
        <AnimatePresence>
          {!selectedId ? (

            /* ── ESTADO 1: GRID 3x3 ── */
            <motion.div
              key="grid-view"
              className="absolute flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              style={{ width: 'min(85vh, 85vw)', height: 'min(85vh, 85vw)' }}
            >
              <div className="grid grid-cols-3 auto-rows-fr gap-5 w-full h-full overflow-y-auto no-scrollbar p-6 -m-6">
                {activeSections.map((section) => {
                  const Icon = section.icon;
                  const theme = themeStyles[section.theme];
                  return (
                    <motion.button
                      layoutId={`card-${section.id}`}
                      key={section.id}
                      onClick={() => setSelectedId(section.id)}
                      className={`relative overflow-hidden flex flex-col items-center justify-center gap-3 rounded-3xl cursor-pointer bg-white group transition-colors duration-200 hover:bg-slate-50 ${theme.border}`}
                      style={{
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.05)',
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -3,
                        boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div layoutId={`icon-${section.id}`} className={`text-slate-400 transition-colors duration-200 ${theme.text}`}>
                        <Icon size={32} strokeWidth={1.5} />
                      </motion.div>

                      <motion.span layoutId={`title-${section.id}`} className={`text-sm font-semibold text-slate-500 transition-colors duration-200 ${theme.text}`}>
                        {section.title}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

          ) : (

            /* ── ESTADO 2: SECCIÓN EXPANDIDA ── */
            <motion.div
              key="expanded-view"
              layoutId={`card-${selected.id}`}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] z-10 bg-white"
              style={{
                boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header Expandido */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <motion.div layoutId={`icon-${selected.id}`} className="text-slate-500">
                    {React.createElement(selected.icon, { size: 26, strokeWidth: 1.5 })}
                  </motion.div>
                  <motion.h2 layoutId={`title-${selected.id}`} className="text-xl font-bold text-slate-800 tracking-tight">
                    {selected.title}
                  </motion.h2>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all hover:rotate-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                {React.createElement(selected.component, { title: selected.title })}
              </div>
            </motion.div>

          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
