import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Shield, User, Loader2 } from 'lucide-react';

export function UsersSection({ title }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
      
      setForm({ name: '', email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-white/50"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Lista de Usuarios */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-white font-semibold mb-4 text-lg">Total de Usuarios ({users.length})</h3>
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-colors border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/50 to-violet-500/50 flex items-center justify-center text-white font-bold">
                  {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{u.name}</p>
                  <p className="text-white/50 text-xs">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {u.role === 'ADMIN' ? <Shield size={12} className="text-indigo-400" /> : <User size={12} className="text-emerald-400" />}
                <span className="text-white/70 text-xs">{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de Creación */}
      <div className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col shrink-0">
        <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
          <UserPlus size={18} className="text-indigo-400" /> Nuevo Usuario
        </h3>
        
        {error && <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label className="text-xs text-white/50 ml-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full mt-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 ml-1">Email / Usuario *</label>
            <input
              type="text"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full mt-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="brayan"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 ml-1">Contraseña *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full mt-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 ml-1">Rol</label>
            <select
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
              className="w-full mt-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 [&>option]:bg-gray-900"
            >
              <option value="USER">Usuario Normal</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </button>
        </form>
      </div>
    </div>
  );
}
