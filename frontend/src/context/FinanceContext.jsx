import React, { createContext, useContext, useState } from 'react';
import { useActivity, ACTIVITY_TYPES } from './ActivityContext';

const FinanceContext = createContext(null);

// Datos iniciales de prueba
const initialCards = [
  { id: '1', bank: 'Bank', type: 'Debit', currency: 'USD', balance: 0.00, color: 'from-slate-700 to-slate-900', isActive: true },
];

const initialMovements = [
  { id: '1', cardId: '1', type: 'expense', amount: 450.00, description: 'Amazon Prime', date: '2026-06-08', category: 'Subscriptions' },
  { id: '2', cardId: '3', type: 'income', amount: 1500.00, description: 'Freelance Payment', date: '2026-06-05', category: 'Income' },
  { id: '3', cardId: '2', type: 'expense', amount: 85.00, description: 'Uber', date: '2026-06-09', category: 'Transportation' },
];

// Gastos Esperados Mensuales (Sustituye a "Budgets")
const initialExpectedExpenses = [
  { id: '1', description: 'Payroll Period 1', amount: 25000, expectedDate: '2026-06-15', category: 'Payroll', status: 'pending' },
  { id: '2', description: 'Commercial Space Rent', amount: 12000, expectedDate: '2026-06-05', category: 'Operations', status: 'paid' },
  { id: '3', description: 'Utilities (Power, Internet)', amount: 3500, expectedDate: '2026-06-20', category: 'Operations', status: 'pending' },
  { id: '4', description: 'Subscriptions (AWS, GSuite)', amount: 1500, expectedDate: '2026-06-12', category: 'Technology', status: 'pending' },
];

const initialReceivables = [
  { id: '1', description: 'Sales Bonus Client A', amount: 3500.00, expectedDate: '2026-06-15', status: 'pending' }
];

const initialPayables = [
  { id: '1', description: 'Commercial Rent Payment', amount: 8000.00, expectedDate: '2026-06-20', status: 'pending' }
];

const initialClients = [
  { id: '1', name: 'Acme Corp', email: 'contact@acme.com', phone: '555-1234', address: '123 Main Street', type: 'client' },
  { id: '2', name: 'Global Distributors', email: 'sales@globaldist.com', phone: '555-9876', address: '742 Evergreen Terrace', type: 'provider' }
];

const initialDocuments = [
  { id: '1', name: 'Contract_Office.pdf', type: 'application/pdf', category: 'Others', date: '2026-06-01', size: 1024500, url: null },
  { id: '2', name: 'Gas_Receipt.jpg', type: 'image/jpeg', category: 'Receipt', date: '2026-06-09', size: 250000, url: null }
];

const initialBudgets = [
  { id: '1', category: 'Subscriptions', limit: 2000, color: 'text-indigo-400' },
  { id: '2', category: 'Operations', limit: 15000, color: 'text-amber-400' },
  { id: '3', category: 'Transportation', limit: 3000, color: 'text-emerald-400' },
  { id: '4', category: 'Technology', limit: 8000, color: 'text-sky-400' },
];

export function FinanceProvider({ children }) {
  const { logActivity } = useActivity();
  const [cards, setCards] = useState(initialCards);
  const [movements, setMovements] = useState(initialMovements);
  const [expectedExpenses, setExpectedExpenses] = useState(initialExpectedExpenses);
  const [receivables, setReceivables] = useState(initialReceivables);
  const [payables, setPayables] = useState(initialPayables);
  const [clients, setClients] = useState(initialClients);
  const [documents, setDocuments] = useState(initialDocuments);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [budgetCardIds, setBudgetCardIds] = useState(initialCards.map(c => c.id));

  const toggleBudgetCard = (id) => {
    setBudgetCardIds(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const getBudgetTotalBalance = () => {
    return cards.filter(c => c.isActive !== false && budgetCardIds.includes(c.id)).reduce((acc, card) => acc + card.balance, 0);
  };

  const addBudget = (budget) => {
    setBudgets([...budgets, { ...budget, id: Date.now().toString() }]);
    logActivity({ type: ACTIVITY_TYPES.BUDGET_ADDED, title: 'Budget created', description: `Category: ${budget.category} — Limit: $${Number(budget.limit).toFixed(2)}` });
  };

  const updateBudget = (id, updates) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBudget = (id) => {
    const b = budgets.find(bgt => bgt.id === id);
    setBudgets(budgets.filter(bgt => bgt.id !== id));
    if (b) logActivity({ type: ACTIVITY_TYPES.BUDGET_DELETED, title: 'Budget deleted', description: `Category: ${b.category}` });
  };

  const addCard = (card) => {
    const newCard = { ...card, id: Date.now().toString() };
    setCards(prev => [...prev, newCard]);
    logActivity({ type: ACTIVITY_TYPES.CARD_ADDED, title: 'Card added', description: `${card.bank} **** ${card.last4 || '????'}` });
  };

  const deleteCard = (id) => {
    const card = cards.find(c => c.id === id);
    setCards(cards.filter(c => c.id !== id));
    setMovements(movements.filter(m => m.cardId !== id));
    if (card) logActivity({ type: ACTIVITY_TYPES.CARD_DELETED, title: 'Card deleted', description: `${card.bank} **** ${card.last4 || '????'}` });
  };

  const addMovement = (movement) => {
    // Validate funds for expense
    if (movement.type === 'expense') {
      const card = cards.find(c => c.id === movement.cardId);
      if (!card || card.balance < movement.amount) {
        return { success: false, error: 'Insufficient funds on the card.' };
      }
    }

    setMovements([{ ...movement, id: Date.now().toString(), date: movement.date || new Date().toISOString().split('T')[0] }, ...movements]);

    // Actualizar saldo de la tarjeta
    setCards(cards.map(c => {
      if (c.id === movement.cardId) {
        const newBalance = movement.type === 'income'
          ? c.balance + movement.amount
          : c.balance - movement.amount;
        return { ...c, balance: newBalance };
      }
      return c;
    }));

    const card = cards.find(c => c.id === movement.cardId);
    logActivity({
      type: ACTIVITY_TYPES.MOVEMENT_ADDED,
      title: movement.type === 'income' ? 'Income recorded' : 'Expense recorded',
      description: `${movement.description || movement.category} — $${Number(movement.amount).toFixed(2)} (${card?.bank ?? '?'})`
    });

    return { success: true };
  };

  // --- Expected Expenses (Cashflow Forecast) ---
  const addExpectedExpense = (expense) => {
    setExpectedExpenses([...expectedExpenses, { ...expense, id: Date.now().toString(), status: 'pending' }]);
  };

  const deleteExpectedExpense = (id) => {
    setExpectedExpenses(expectedExpenses.filter(e => e.id !== id));
  };

  const payExpectedExpense = (id, cardId) => {
    const expense = expectedExpenses.find(e => e.id === id);
    if (!expense) return { success: false, error: 'Expected expense not found.' };
    if (expense.status === 'paid') return { success: false, error: 'This expense has already been marked as paid.' };

    const res = addMovement({
      cardId,
      type: 'expense',
      amount: expense.amount,
      date: new Date().toISOString().split('T')[0],
      description: `Payment Made: ${expense.description}`,
      category: expense.category,
      status: 'completed'
    });

    if (res.success) {
      setExpectedExpenses(expectedExpenses.map(e => e.id === id ? { ...e, status: 'paid' } : e));
    }
    return res;
  };

  // --- Receivables & Payables ---
  const addReceivable = (receivable) => {
    setReceivables([{ ...receivable, id: Date.now().toString(), status: 'pending' }, ...receivables]);
  };

  const collectReceivable = (id, cardId) => {
    const receivable = receivables.find(r => r.id === id);
    if (!receivable) return { success: false, error: 'Account not found.' };

    const res = addMovement({
      cardId,
      type: 'income',
      amount: receivable.amount,
      date: new Date().toISOString().split('T')[0],
      description: `Collection: ${receivable.description}`,
      category: 'Accounts Receivable',
      status: 'completed'
    });

    if (res.success) {
      setReceivables(receivables.map(r => r.id === id ? { ...r, status: 'paid', paidDate: new Date().toISOString().split('T')[0], cardId } : r));
    }
    return res;
  };

  const addPayable = (payable) => {
    setPayables([{ ...payable, id: Date.now().toString(), status: 'pending' }, ...payables]);
  };

  const payPayable = (id, cardId) => {
    const payable = payables.find(p => p.id === id);
    if (!payable) return { success: false, error: 'Account not found.' };

    const res = addMovement({
      cardId,
      type: 'expense',
      amount: payable.amount,
      date: new Date().toISOString().split('T')[0],
      description: `Payment: ${payable.description}`,
      category: 'Accounts Payable',
      status: 'completed'
    });

    if (res.success) {
      setPayables(payables.map(p => p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0], cardId } : p));
    }
    return res;
  };

  const transferBetweenCards = (sourceId, targetId, amount, description = 'Transferencia') => {
    const sourceCard = cards.find(c => c.id === sourceId);
    if (!sourceCard || sourceCard.balance < amount) {
      return { success: false, error: 'Insufficient funds in the source card.' };
    }

    const date = new Date().toISOString().split('T')[0];

    const expenseMovement = {
      id: Date.now().toString() + '-1',
      cardId: sourceId,
      type: 'expense',
      amount,
      date,
      description: `${description} to another account`,
      category: 'Transfers',
      status: 'completed'
    };

    const incomeMovement = {
      id: Date.now().toString() + '-2',
      cardId: targetId,
      type: 'income',
      amount,
      date,
      description: `${description} from another account`,
      category: 'Transfers',
      status: 'completed'
    };

    setMovements([expenseMovement, incomeMovement, ...movements]);

    setCards(cards.map(c => {
      if (c.id === sourceId) return { ...c, balance: c.balance - amount };
      if (c.id === targetId) return { ...c, balance: c.balance + amount };
      return c;
    }));

    const src = cards.find(c => c.id === sourceId);
    const tgt = cards.find(c => c.id === targetId);
    logActivity({ type: ACTIVITY_TYPES.TRANSFER, title: 'Transfer completed', description: `$${amount.toFixed(2)} from ${src?.bank ?? '?'} to ${tgt?.bank ?? '?'}` });

    return { success: true };
  };

  const addDocument = (doc) => {
    setDocuments([{ ...doc, id: Date.now().toString() }, ...documents]);
    logActivity({ type: ACTIVITY_TYPES.DOCUMENT_ADDED, title: 'Document saved', description: doc.name });
  };

  // --- Clients & Providers ---
  const addClient = (client) => {
    setClients([{ ...client, id: Date.now().toString() }, ...clients]);
  };

  const deleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const updateClient = (id, updates) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    setDocuments(documents.filter(d => d.id !== id));
    if (doc) logActivity({ type: ACTIVITY_TYPES.DOCUMENT_DELETED, title: 'Document deleted', description: doc.name });
  };

  const updateDocument = (id, updates) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const toggleCardStatus = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c));
  };

  const getTotalBalance = () => {
    return cards.filter(c => c.isActive !== false).reduce((acc, card) => acc + card.balance, 0);
  };

  return (
    <FinanceContext.Provider value={{
      cards, addCard, deleteCard, toggleCardStatus,
      movements, addMovement, transferBetweenCards,
      expectedExpenses, addExpectedExpense, payExpectedExpense, deleteExpectedExpense,
      receivables, addReceivable, collectReceivable,
      payables, addPayable, payPayable,
      documents, addDocument, deleteDocument, updateDocument,
      budgets, addBudget, updateBudget, deleteBudget,
      budgetCardIds, toggleBudgetCard, getBudgetTotalBalance,
      clients, addClient, deleteClient, updateClient,
      getTotalBalance
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
