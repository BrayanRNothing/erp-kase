import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, X, Calculator, Wallet, Trash2, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard as CardComponent } from '../common/CreditCard';

const COLOR_MAP = {
  'text-indigo-400': '#6366f1',
  'text-amber-400': '#f59e0b',
  'text-emerald-400': '#10b981',
  'text-sky-400': '#0ea5e9',
  'text-red-400': '#ef4444',
  'text-purple-400': '#a855f7',
  'text-pink-400': '#ec4899',
  'text-gray-400': '#9ca3af',
};

const COLOR_OPTIONS = Object.keys(COLOR_MAP);

function formatMoney(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function BudgetsSection({ title }) {
  const { 
    cards, 
    budgets, 
    movements, 
    addBudget, 
    deleteBudget,
    budgetCardIds,
    toggleBudgetCard,
    getBudgetTotalBalance 
  } = useFinance();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);

  const totalBalance = getBudgetTotalBalance();

  const enrichedBudgets = useMemo(() => {
    return budgets.map(budget => {
      const spent = movements
        .filter(m => m.type?.toUpperCase() === 'EXPENSE' && m.category === budget.category && budgetCardIds.includes(m.cardId))
        .reduce((sum, m) => sum + Number(m.amount), 0);
      return { ...budget, spent };
    });
  }, [budgets, movements, budgetCardIds]);

  const totalBudgeted = enrichedBudgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const totalSpent = enrichedBudgets.reduce((sum, b) => sum + Number(b.spent), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const unassigned = totalBalance - totalBudgeted;

  const chartData = enrichedBudgets.map(b => ({
    name: b.category,
    value: Number(b.limit),
    color: COLOR_MAP[b.color] || COLOR_MAP['text-gray-400']
  }));

  if (unassigned > 0) {
    chartData.push({
      name: 'Unassigned',
      value: unassigned,
      color: '#f3f4f6' // slate-100 for unassigned in light theme
    });
  }

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newCategory || !newLimit) return;
    addBudget({
      category: newCategory,
      limit: parseFloat(newLimit),
      color: newColor
    });
    setShowAddModal(false);
    setNewCategory('');
    setNewLimit('');
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      
      {/* ── HEADER RESUMEN (SIMPLE) ── */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Wallet size={14} /> Linked Balance
          </p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatMoney(totalBalance)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
            Budgeted
          </p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatMoney(totalBudgeted)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
          <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider mb-2">
            Remaining Available
          </p>
          <p className="text-2xl font-bold text-emerald-600 tracking-tight">{formatMoney(totalRemaining)}</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${unassigned < 0 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
          <p className={`${unassigned < 0 ? 'text-red-600' : 'text-amber-600'} text-xs font-medium uppercase tracking-wider mb-2`}>
            {unassigned < 0 ? 'Over budget' : 'Unassigned'}
          </p>
          <p className={`text-2xl font-bold tracking-tight ${unassigned < 0 ? 'text-red-600' : 'text-amber-600'}`}>
            {formatMoney(unassigned)}
          </p>
        </div>
      </div>

      {/* ── CUENTAS ENLAZADAS (SCROLL HORIZONTAL) ── */}
      <div className="shrink-0 flex flex-col gap-3">
        <h3 className="text-slate-800 font-medium text-sm flex items-center gap-2">
          Accounts Linked to Budget
        </h3>
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          {cards.filter(c => c.isActive !== false).map(card => {
            const isSelected = budgetCardIds.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => toggleBudgetCard(card.id)}
                className={`text-left shrink-0 w-64 transition-all duration-300 hover:scale-[1.02] ${!isSelected ? 'opacity-40 grayscale hover:opacity-70' : ''}`}
              >
                <CardComponent card={card} size="sm" showType={false} className="!h-36 shadow-sm border border-slate-200">
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                      ${isSelected ? 'bg-indigo-600 border-indigo-500' : 'bg-white/80 border-slate-300 backdrop-blur-md'}
                    `}>
                      {isSelected && <Check size={12} className="text-white" />}
                   </div>
                </CardComponent>
              </button>
            );
          })}
          {cards.filter(c => c.isActive !== false).length === 0 && (
            <div className="text-slate-400 text-sm italic py-4">You have no active cards.</div>
          )}
        </div>
      </div>

      {/* ── CUERPO PRINCIPAL (GRÁFICO Y LISTA) ── */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Columna Izquierda: Gráfico */}
        <div className="w-[40%] rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center relative shadow-sm">
          <h3 className="absolute top-6 left-6 text-slate-500 font-medium text-sm tracking-wide uppercase">Distribution</h3>
          <div className="w-full h-full min-h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatMoney(value)}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Total Spent</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{formatMoney(totalSpent)}</span>
          </div>
        </div>

        {/* Columna Derecha: Lista de Categorías */}
        <div className="w-[60%] rounded-2xl bg-white border border-slate-200 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h3 className="text-slate-800 font-bold text-lg">Budget Categories</h3>
              <p className="text-slate-500 text-sm mt-0.5">Control limits per category.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} /> New Limit
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {enrichedBudgets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Calculator size={48} className="mb-4 opacity-20" />
                <p>You haven't created any budgets yet.</p>
              </div>
            ) : (
              enrichedBudgets.map(budget => {
                const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                const isOverBudget = budget.spent > budget.limit;

                return (
                  <div key={budget.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: COLOR_MAP[budget.color] }} />
                          <h4 className="text-slate-800 font-bold text-base">{budget.category}</h4>
                        </div>
                        <p className="text-slate-500 text-xs ml-5.5 flex gap-1 font-medium">
                          {formatMoney(budget.spent)} <span className="text-slate-300">/</span> {formatMoney(budget.limit)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <p className={`text-xs font-medium ${isOverBudget ? 'text-red-500' : 'text-slate-500'}`}>
                            {isOverBudget ? 'Over by' : 'Available'}
                          </p>
                          <p className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-700'}`}>
                            {formatMoney(Math.abs(budget.limit - budget.spent))}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteBudget(budget.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2 border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden ml-[22px] w-[calc(100%-22px)] shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : percentage > 85 ? 'bg-amber-400' : ''}`}
                        style={{ backgroundColor: (!isOverBudget && percentage <= 85) ? COLOR_MAP[budget.color] : undefined }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL AGREGAR PRESUPUESTO ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-3xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">New Budget Limit</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddBudget} className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-2">Category</label>
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="e.g. Transport, Food..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-2">Monthly Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input 
                      type="number" 
                      value={newLimit}
                      onChange={e => setNewLimit(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-600 font-medium mb-3">Label Color</label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${newColor === c ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: COLOR_MAP[c] }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
