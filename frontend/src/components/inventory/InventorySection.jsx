import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinance } from '../../context/FinanceContext';
import { 
  Package, Plus, Minus, Trash2, Beaker, 
  Droplet, Cylinder, AlertCircle, X, Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTAINER_TYPES = [
  { id: 'Bote', icon: Package },
  { id: 'Tina', icon: Droplet },
  { id: 'Tambor', icon: Cylinder },
  { id: 'Cubeta', icon: Beaker },
];

export function InventorySection({ title }) {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustStock } = useInventory();
  const { clients } = useFinance(); // for providers
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    containerType: 'Bote',
    capacity: '',
    unit: 'L',
    stock: 0,
    minStock: 0,
    providerId: ''
  });

  const providers = clients.filter(c => c.type === 'provider');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.containerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        containerType: item.containerType,
        capacity: item.capacity,
        unit: item.unit,
        stock: item.stock,
        minStock: item.minStock,
        providerId: item.providerId || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        containerType: 'Bote',
        capacity: '',
        unit: 'L',
        stock: 0,
        minStock: 0,
        providerId: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateInventoryItem(editingItem.id, formData);
    } else {
      await addInventoryItem(formData);
    }
    closeModal();
  };

  const getContainerIcon = (type) => {
    const found = CONTAINER_TYPES.find(c => c.id === type);
    return found ? found.icon : Package;
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar químicos, empaques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Nuevo Objeto
        </button>
      </div>

      {/* INVENTORY GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredInventory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Package size={48} className="opacity-20" />
            <p>No hay contenedores registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {filteredInventory.map((item) => {
              const Icon = getContainerIcon(item.containerType);
              const isLowStock = item.stock <= item.minStock;

              return (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col relative group">
                  
                  {/* Edit/Delete Actions overlay on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg">
                      <Package size={14} />
                    </button>
                    <button onClick={() => deleteInventoryItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isLowStock ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Icon size={24} />
                    </div>
                    <div className="min-w-0 pr-8">
                      <h3 className="font-bold text-slate-800 truncate" title={item.name}>{item.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{item.containerType} - {Number(item.capacity)} {item.unit}</p>
                    </div>
                  </div>

                  {/* Stock Controls */}
                  <div className="mt-auto bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                          {item.stock}
                        </span>
                        {isLowStock && <AlertCircle size={14} className="text-red-500" title="Stock bajo" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => adjustStock(item.id, item.stock - 1)}
                        disabled={item.stock <= 0}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <button 
                        onClick={() => adjustStock(item.id, item.stock + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-lg text-slate-800">
                  {editingItem ? 'Editar Objeto' : 'Crear Objeto'}
                </h3>
                <button onClick={closeModal} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="inventory-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nombre del Químico/Producto</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. Pintura Azul, Base Acrílica..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipo Empaque</label>
                      <select value={formData.containerType} onChange={e => setFormData({...formData, containerType: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        {CONTAINER_TYPES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Capacidad</label>
                        <input required type="number" step="0.01" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. 20" />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unidad</label>
                        <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                          <option value="L">L</option>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="gal">gal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Stock Inicial</label>
                      <input type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Alerta Min. Stock</label>
                      <input type="number" min="0" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Proveedor (Opcional)</label>
                    <select value={formData.providerId} onChange={e => setFormData({...formData, providerId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                      <option value="">Ninguno</option>
                      {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <button type="submit" form="inventory-form" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  {editingItem ? 'Guardar Cambios' : 'Crear Objeto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
