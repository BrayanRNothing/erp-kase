import React, { createContext, useContext, useState, useCallback } from 'react';

const ActivityContext = createContext(null);

// IDs de íconos como strings para evitar problemas de serialización
export const ACTIVITY_TYPES = {
  MOVEMENT_ADDED:   'movement_added',
  CARD_ADDED:       'card_added',
  CARD_DELETED:     'card_deleted',
  CARD_TOGGLED:     'card_toggled',
  DOCUMENT_ADDED:   'document_added',
  DOCUMENT_DELETED: 'document_deleted',
  INVOICE_SAVED:    'invoice_saved',
  BUDGET_ADDED:     'budget_added',
  BUDGET_DELETED:   'budget_deleted',
  TRANSFER:         'transfer',
};

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([
    {
      id: 'mock-1',
      type: ACTIVITY_TYPES.INVOICE_SAVED,
      title: 'Invoice generated',
      description: 'Invoice #F-001 for Client X generated successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: 'mock-2',
      type: ACTIVITY_TYPES.MOVEMENT_ADDED,
      title: 'Income recorded',
      description: 'Income of $1,500.00 for consulting.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 'mock-3',
      type: ACTIVITY_TYPES.DOCUMENT_ADDED,
      title: 'Document uploaded',
      description: 'Monthly_Report.pdf has been uploaded.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: 'mock-4',
      type: ACTIVITY_TYPES.BUDGET_ADDED,
      title: 'Budget created',
      description: 'New Q3 budget assigned to Marketing.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    }
  ]);

  const logActivity = useCallback(({ type, title, description }) => {
    const entry = {
      id: Date.now().toString() + Math.random(),
      type,
      title,
      description,
      timestamp: new Date(),
    };
    setActivities(prev => [entry, ...prev].slice(0, 50)); // Max 50 entradas
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
};
