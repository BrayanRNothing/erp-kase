import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const InventoryContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function InventoryProvider({ children }) {
  const { token, user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiCall = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const fetchInventory = useCallback(() => {
    apiCall('/inventory')
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading inventory:", err);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchInventory();

      const socket = io(API_URL.replace('/api', ''), { transports: ['websocket', 'polling'] });
      
      socket.emit('joinRoom', user.ownerId);

      socket.on('updateData', () => {
        fetchInventory();
      });

      return () => {
        socket.disconnect();
      };
    } else {
      setLoading(false);
    }
  }, [token, user, fetchInventory]);

  const addInventoryItem = async (item) => {
    try {
      const newItem = await apiCall('/inventory', { method: 'POST', body: JSON.stringify(item) });
      setInventory([newItem, ...inventory]);
    } catch (e) { console.error(e); }
  };

  const updateInventoryItem = async (id, updates) => {
    try {
      const updated = await apiCall(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
      setInventory(inventory.map(item => item.id === id ? updated : item));
    } catch (e) { console.error(e); }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await apiCall(`/inventory/${id}`, { method: 'DELETE' });
      setInventory(inventory.filter(item => item.id !== id));
    } catch (e) { console.error(e); }
  };

  const adjustStock = async (id, newStock, reason = 'Ajuste manual') => {
    if (newStock < 0) return;
    try {
      const updated = await apiCall(`/inventory/${id}/movements`, { 
        method: 'POST', 
        body: JSON.stringify({ type: 'ADJUST', quantity: newStock, reason }) 
      });
      setInventory(inventory.map(item => item.id === id ? updated : item));
    } catch (e) { console.error(e); }
  };

  const addMovement = async (id, type, quantity, reason) => {
    if (quantity <= 0) return;
    try {
      const updated = await apiCall(`/inventory/${id}/movements`, { 
        method: 'POST', 
        body: JSON.stringify({ type, quantity, reason }) 
      });
      setInventory(inventory.map(item => item.id === id ? updated : item));
    } catch (e) { console.error(e); }
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      adjustStock,
      addMovement,
      loading
    }}>
      {!loading && children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
