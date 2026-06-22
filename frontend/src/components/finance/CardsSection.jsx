import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, X, Wallet, PowerOff } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { PREDEFINED_BANKS, getBankData } from '../../utils/bankData';
import { CreditCard as CardComponent } from '../common/CreditCard';

const CUSTOM_COLORS = [
  { id: 'gray', class: 'from-slate-700 to-slate-900', name: 'Gray' },
  { id: 'blue', class: 'from-blue-600 to-blue-900', name: 'Blue' },
  { id: 'emerald', class: 'from-emerald-500 to-emerald-800', name: 'Emerald' },
  { id: 'purple', class: 'from-purple-600 to-purple-900', name: 'Purple' },
  { id: 'rose', class: 'from-rose-500 to-rose-800', name: 'Rose' },
  { id: 'amber', class: 'from-amber-500 to-amber-700', name: 'Amber' },
  { id: 'black', class: 'from-slate-900 to-black', name: 'Black' },
];

export function CardsSection({ title }) {
  const { cards, addCard, deleteCard, toggleCardStatus } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cardToToggle, setCardToToggle] = useState(null);
  const [customBankName, setCustomBankName] = useState('');
  const [customColor, setCustomColor] = useState(CUSTOM_COLORS[0].class);

  // Form State
  const [newCard, setNewCard] = useState({
    bankId: PREDEFINED_BANKS[0].id,
    type: 'Debit',
    currency: 'USD',
    balance: '',
    last4: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCard.balance) return;
    
    const bankData = getBankData(newCard.bankId);
    const finalBankName = newCard.bankId === 'other' && customBankName.trim() 
      ? customBankName.trim() 
      : bankData.name;
    const finalColor = newCard.bankId === 'other' ? customColor : bankData.color;

    addCard({
      ...newCard,
      bank: finalBankName,
      color: finalColor,
      balance: parseFloat(newCard.balance)
    });
    
    setIsAdding(false);
    setNewCard({
      bankId: PREDEFINED_BANKS[0].id,
      type: 'Debit',
      currency: 'USD',
      balance: '',
      last4: ''
    });
    setCustomBankName('');
    setCustomColor(CUSTOM_COLORS[0].class);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* Header & Actions */}
      <div className="flex justify-end shrink-0">
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl transition-colors border border-slate-200 shadow-sm"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">Add Card</span>
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4 custom-scrollbar">
        <AnimatePresence>
          {cards.map((card) => {
            const bankData = getBankData(card.bank);
            return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className={`transition-all duration-300 ${card.isActive === false ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <CardComponent card={card} size="md" className="h-56 shadow-md">
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => setCardToToggle(card)}
                      className="p-1.5 bg-white/80 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-amber-200 shadow-sm backdrop-blur-md"
                      title={card.isActive === false ? "Reactivate Card" : "Deactivate Card"}
                    >
                      <PowerOff size={16} />
                    </button>
                    <button
                      onClick={() => setCardToDelete(card)}
                      className="p-1.5 bg-white/80 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-200 shadow-sm backdrop-blur-md"
                      title="Delete card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </CardComponent>
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
        
        {cards.length === 0 && (
          <div className="col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
            <Wallet size={32} className="mb-2 opacity-50" />
            <p>No cards registered yet.</p>
          </div>
        )}
      </div>

      {/* Modal Añadir Tarjeta */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-indigo-600" /> New Card
                </h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-medium">Bank / Institution</label>
                    <select
                      value={newCard.bankId}
                      onChange={e => setNewCard({...newCard, bankId: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                    >
                      {PREDEFINED_BANKS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-medium">Last 4 digits (Optional)</label>
                    <input
                      type="text"
                      maxLength="4"
                      pattern="\d{4}"
                      placeholder="1234"
                      value={newCard.last4}
                      onChange={e => setNewCard({...newCard, last4: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-center tracking-widest font-mono"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {newCard.bankId === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="text-xs text-slate-500 font-medium">Bank Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter the bank name..."
                          value={customBankName}
                          onChange={e => setCustomBankName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 pt-4 pb-2">
                        <label className="text-xs text-slate-500 font-medium">Card Color</label>
                        <div className="flex gap-3 flex-wrap p-1">
                          {CUSTOM_COLORS.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setCustomColor(c.class)}
                              className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-br ${c.class} border-2 transition-transform ${customColor === c.class ? 'border-indigo-500 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-medium">Type</label>
                    <select
                      value={newCard.type}
                      onChange={e => setNewCard({...newCard, type: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                    >
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-medium">Opening Balance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input
                        type="number"
                        required
                        step="0.01"
                        placeholder="0.00"
                        value={newCard.balance}
                        onChange={e => setNewCard({...newCard, balance: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-md"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Eliminación */}
      <AnimatePresence>
        {cardToDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white border border-red-100 rounded-2xl p-6 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="p-2 bg-red-50 rounded-full">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold">Delete Card?</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                You are about to delete your card <strong className="text-slate-900">{cardToDelete.bank} ending in {(cardToDelete.cardNumber || cardToDelete.last4 || '0000').slice(-4)}</strong>. This action cannot be undone and may affect associated transaction history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCardToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteCard(cardToDelete.id);
                    setCardToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Desactivación/Reactivación */}
      <AnimatePresence>
        {cardToToggle && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`bg-white border ${cardToToggle.isActive === false ? 'border-emerald-200 shadow-emerald-50' : 'border-amber-200 shadow-amber-50'} rounded-2xl p-6 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar`}
            >
              <div className={`flex items-center gap-3 mb-4 ${cardToToggle.isActive === false ? 'text-emerald-600' : 'text-amber-600'}`}>
                <div className={`p-2 rounded-full ${cardToToggle.isActive === false ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <PowerOff size={24} />
                </div>
                <h3 className="text-xl font-bold">{cardToToggle.isActive === false ? 'Reactivate' : 'Deactivate'} Card?</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                You are about to {cardToToggle.isActive === false ? 'reactivate' : 'deactivate'} your card <strong className="text-slate-900">{cardToToggle.bank} ending in {(cardToToggle.cardNumber || cardToToggle.last4 || '0000').slice(-4)}</strong>. {cardToToggle.isActive === false ? 'It will appear again in your balance and transactions.' : 'It will be removed from your total balance and you will not be able to make transactions with it temporarily.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCardToToggle(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toggleCardStatus(cardToToggle.id);
                    setCardToToggle(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold transition-colors shadow-md ${cardToToggle.isActive === false ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  Yes, {cardToToggle.isActive === false ? 'Reactivate' : 'Deactivate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
