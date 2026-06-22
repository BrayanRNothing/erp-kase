import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Plus, Search, Mail, Phone, MapPin, Trash2, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function ClientsSection() {
  const { clients, addClient, deleteClient } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'client', 'provider'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-[1.25rem] border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${filterType === 'all' ? 'bg-indigo-500 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)] scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'}`}
          >
            {filterType === 'all' && <div className="absolute top-1 left-2 w-6 h-1 bg-white rounded-full opacity-40 pointer-events-none" />}
            All
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${filterType === 'client' ? 'bg-indigo-500 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)] scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'}`}
          >
            {filterType === 'client' && <div className="absolute top-1 left-2 w-6 h-1 bg-white rounded-full opacity-40 pointer-events-none" />}
            Clients
          </button>
          <button
            onClick={() => setFilterType('provider')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${filterType === 'provider' ? 'bg-indigo-500 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)] scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'}`}
          >
            {filterType === 'provider' && <div className="absolute top-1 left-2 w-6 h-1 bg-white rounded-full opacity-40 pointer-events-none" />}
            Providers
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-white rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-[inset_0_4px_6px_rgba(0,0,0,0.03),_0_2px_8px_rgba(0,0,0,0.02)]"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-2xl font-bold transition-all shrink-0 relative overflow-hidden active:scale-95 group"
            style={{
              boxShadow: 'inset 0 4px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2), 0 6px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            <div className="absolute top-1.5 left-2 w-8 h-1.5 bg-white rounded-full opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity" />
            <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredClients.map(client => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50/50 border-2 border-white rounded-[2rem] p-5 relative group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{
                    boxShadow: 'inset 0 6px 0 rgba(255, 255, 255, 1), inset 0 -6px 0 rgba(0, 0, 0, 0.04), 0 12px 24px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Toon Reflection */}
                  <div className="absolute top-3 right-4 w-12 h-3 bg-white rounded-full opacity-70 rotate-[-15deg] pointer-events-none" />
                  <div className="absolute top-7 right-3 w-3 h-3 bg-white rounded-full opacity-70 pointer-events-none" />

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3 min-w-0 w-full pr-8">
                      <div className={`w-12 h-12 rounded-[1.25rem] border-2 border-white flex items-center justify-center shrink-0 relative overflow-hidden ${client.type === 'client' ? 'bg-indigo-50 text-indigo-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.8),_inset_0_-3px_0_rgba(0,0,0,0.05)]' : 'bg-emerald-50 text-emerald-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.8),_inset_0_-3px_0_rgba(0,0,0,0.05)]'}`}>
                        <div className="absolute top-1 left-1.5 w-4 h-1.5 bg-white rounded-full opacity-60 pointer-events-none" />
                        {client.type === 'client' ? <Users size={22} /> : <Briefcase size={22} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-slate-800 font-bold text-base truncate" title={client.name}>{client.name}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold block truncate ${client.type === 'client' ? 'text-indigo-500' : 'text-emerald-500'}`}>
                          {client.type === 'client' ? 'Client' : 'Provider'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all absolute -top-1 -right-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate min-w-0 flex-1">{client.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate min-w-0 flex-1">{client.phone || '—'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600 min-w-0">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 min-w-0 flex-1">{client.address || '—'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Users size={64} className="opacity-20" />
            <p className="text-lg">No contacts found.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addClient} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'client'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="relative bg-slate-50 border-4 border-white p-7 rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{
          boxShadow: 'inset 0 8px 0 rgba(255, 255, 255, 1), inset 0 -8px 0 rgba(0, 0, 0, 0.04), 0 25px 50px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Modal Toon Reflection */}
        <div className="absolute top-5 right-8 w-20 h-4 bg-white rounded-full opacity-80 rotate-[-12deg] pointer-events-none" />
        <div className="absolute top-12 right-5 w-4 h-4 bg-white rounded-full opacity-80 pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">New Contact</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-100 p-2 rounded-xl hover:bg-red-50 transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2 relative z-10">
          {/* Tabs for Type */}
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl relative border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'client' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden z-10 ${form.type === 'client' ? 'bg-indigo-500 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {form.type === 'client' && <div className="absolute top-1 left-2 w-8 h-1 bg-white rounded-full opacity-30 pointer-events-none" />}
              <Users size={16} strokeWidth={2.5} /> Client
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'provider' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden z-10 ${form.type === 'provider' ? 'bg-emerald-500 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {form.type === 'provider' && <div className="absolute top-1 left-2 w-8 h-1 bg-white rounded-full opacity-30 pointer-events-none" />}
              <Briefcase size={16} strokeWidth={2.5} /> Provider
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-2">Name / Company *</label>
            <input required type="text" placeholder="e.g. Acme Corp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-[inset_0_3px_6px_rgba(0,0,0,0.02)] hover:border-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-2">Email</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-[inset_0_3px_6px_rgba(0,0,0,0.02)] hover:border-slate-200" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-2">Phone</label>
              <input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-[inset_0_3px_6px_rgba(0,0,0,0.02)] hover:border-slate-200" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-2">Physical Address</label>
            <input type="text" placeholder="Street, City, Country..." value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-[inset_0_3px_6px_rgba(0,0,0,0.02)] hover:border-slate-200" />
          </div>

          <div className="pt-3">
            <button 
              type="submit" 
              className={`w-full py-4 text-white rounded-2xl font-black text-lg tracking-wide relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 group ${form.type === 'client' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
              style={{
                boxShadow: 'inset 0 4px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="absolute top-1.5 left-4 w-16 h-1.5 bg-white rounded-full opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity" />
              Save {form.type === 'client' ? 'Client' : 'Provider'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
