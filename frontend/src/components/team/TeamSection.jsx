import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Plus, Trash2, Mail, Save, AlertCircle, Info, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function TeamSection() {
  const { token, user, updateUser } = useAuth();
  const { language } = useSettings();
  const t = getT(language);
  const tt = t.team;

  const [isOwner, setIsOwner] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for new member
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_URL}/team`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsOwner(data.isOwner);
        setCompanyName(data.companyName || '');
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async () => {
    try {
      setError(''); setSuccess('');
      const res = await fetch(`${API_URL}/team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyName })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(tt.saved || 'Guardado exitosamente');
        updateUser({ companyName: data.companyName });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al actualizar la empresa');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setError(''); setSuccess('');
      const res = await fetch(`${API_URL}/team/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });
      const data = await res.json();
      if (res.ok) {
        setMembers([...members, data]);
        setShowAddForm(false);
        setNewMember({ name: '', email: '', password: '' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al crear miembro');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('¿Estás seguro de eliminar a este miembro?')) return;
    try {
      const res = await fetch(`${API_URL}/team/members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER INFO */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Building2 size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">{tt.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{tt.subtitle}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-red-100">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm flex items-center gap-2 border border-emerald-100">
          <Info size={16} /> {success}
        </div>
      )}

      {/* COMPAÑÍA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h4 className="text-base font-bold text-slate-800 mb-4">{tt.companyName}</h4>
        
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={!isOwner}
            placeholder={tt.companyNamePlaceholder}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          {isOwner && (
            <button
              onClick={handleUpdateCompany}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} /> {tt.saveCompany}
            </button>
          )}
        </div>
        
        {!isOwner && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <Lock size={12} /> {tt.childView}
          </p>
        )}
      </div>

      {/* MIEMBROS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" /> {tt.members}
          </h4>
          
          {isOwner && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-sm font-medium bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> {tt.addMember}
            </button>
          )}
        </div>

        {/* ADD MEMBER FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 overflow-hidden"
              onSubmit={handleAddMember}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{tt.memberName}</label>
                  <input
                    required
                    type="text"
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{tt.memberEmail}</label>
                  <input
                    required
                    type="email"
                    value={newMember.email}
                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{tt.memberPassword}</label>
                  <input
                    required
                    type="password"
                    value={newMember.password}
                    onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  {tt.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {tt.add}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* MEMBERS LIST */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">{tt.ownerOnly || 'Sin miembros'}</p>
          ) : (
            members.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                    {m.name ? m.name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{m.name || m.email}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail size={12} /> {m.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-slate-600 bg-slate-200/50 px-2.5 py-1 rounded-md inline-block">
                      {m.role === 'ADMIN' ? 'Administrador' : tt.memberRole || 'Miembro'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                      {tt.memberSince} {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title={tt.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
