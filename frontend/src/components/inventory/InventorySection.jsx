import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinance } from '../../context/FinanceContext';
import { 
  Package, Plus, Minus, Trash2, Edit2, 
  AlertCircle, X, Search, History, DollarSign, MapPin, Tag, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoteSVG, TamborSVG, PinturaSVG, GalonSVG } from './ContainerSVGs';

const CONTAINER_TYPES = [
  { id: 'Bote', component: BoteSVG },
  { id: 'Tambor', component: TamborSVG },
  { id: 'Cubeta', component: PinturaSVG },
  { id: 'Galón', component: GalonSVG },
];

const PRESET_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#64748B', '#06B6D4',
  '#14B8A6', '#F97316', '#EAB308', '#FFFFFF'
];

export function InventorySection({ title }) {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, addMovement } = useInventory();
  const { clients } = useFinance(); // for providers
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isKardexOpen, setIsKardexOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    containerType: 'Tambor',
    capacity: '',
    unit: 'L',
    stock: 0,
    minStock: 0,
    providerId: '',
    category: 'Materia Prima',
    color: '#3B82F6',
    location: '',
    unitCost: ''
  });

  const providers = clients.filter(c => c.type === 'provider');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.containerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = inventory.reduce((sum, item) => sum + (Number(item.unitCost) * item.stock), 0);
  const lowStockCount = inventory.filter(item => item.stock <= item.minStock).length;

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
        providerId: item.providerId || '',
        category: item.category || 'Materia Prima',
        color: item.color || '#3B82F6',
        location: item.location || '',
        unitCost: item.unitCost || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        containerType: 'Tambor',
        capacity: '',
        unit: 'L',
        stock: 0,
        minStock: 0,
        providerId: '',
        category: 'Materia Prima',
        color: '#3B82F6',
        location: '',
        unitCost: ''
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
      // Update selected item in kardex if it's open
      if (selectedItem && selectedItem.id === editingItem.id) {
        setSelectedItem({ ...selectedItem, ...formData });
      }
    } else {
      await addInventoryItem(formData);
    }
    closeModal();
  };

  const renderSVG = (type, color) => {
    const found = CONTAINER_TYPES.find(c => c.id === type);
    const SvgComponent = found ? found.component : BoteSVG;
    return <SvgComponent color={color} className="w-full h-full drop-shadow-md" />;
  };

  const openKardex = (item) => {
    // Find latest item version from inventory to ensure movements are updated
    const updatedItem = inventory.find(i => i.id === item.id) || item;
    setSelectedItem(updatedItem);
    setIsKardexOpen(true);
  };

  const handleQuickMovement = async (item, type, qty, reason) => {
    await addMovement(item.id, type, qty, reason);
    const updated = inventory.find(i => i.id === item.id);
    if (selectedItem && selectedItem.id === item.id) {
      // It will auto-update because we re-fetch context, but for immediate UI feel:
      // In next render, openKardex finds the updated one anyway if re-rendered.
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Box size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total de Artículos</p>
            <p className="text-2xl font-black text-slate-800">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Valor de Inventario</p>
            <p className="text-2xl font-black text-slate-800">
              ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Alertas de Stock</p>
            <p className="text-2xl font-black text-slate-800">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar químicos, categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Nuevo Artículo
        </button>
      </div>

      {/* INVENTORY GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredInventory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Package size={48} className="opacity-20" />
            <p>No hay artículos registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-6">
            {filteredInventory.map((item) => {
              const isLowStock = item.stock <= item.minStock;

              return (
                <div key={item.id} className="bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all p-3 flex flex-col relative group cursor-pointer" onClick={() => openKardex(item)}>
                  
                  {/* Category Tag & Edit Button */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100/80 backdrop-blur-sm text-slate-500 rounded-md">
                      {item.category}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(item); }} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white hover:bg-slate-50 rounded-lg shadow-sm border border-slate-100 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>

                  {/* Visual SVG - Protagonist */}
                  <div className="w-full h-28 flex items-center justify-center mt-5 mb-2">
                    <div className="w-28 h-28 hover:scale-110 transition-transform duration-300">
                      {renderSVG(item.containerType, item.color)}
                    </div>
                  </div>

                  <div className="text-center mb-2">
                    <h3 className="font-bold text-sm text-slate-800 truncate" title={item.name}>{item.name}</h3>
                  </div>

                  {/* Info & Stock Row */}
                  <div className="mt-auto flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Left: Capacity and Type */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-600">{Number(item.capacity)}{item.unit}</span>
                      <span className="text-[9px] text-slate-400">{item.containerType}</span>
                    </div>

                    {/* Right: Stock Controls */}
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-0.5">
                      <button 
                        onClick={() => handleQuickMovement(item, 'OUT', 1, 'Salida rápida')}
                        disabled={item.stock <= 0}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm disabled:opacity-50 transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      
                      <div className="w-7 flex flex-col items-center justify-center relative">
                        {isLowStock && <span className="absolute -top-1 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" title="Stock Bajo"></span>}
                        <span className={`text-[11px] font-black ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                          {item.stock}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleQuickMovement(item, 'IN', 1, 'Entrada rápida')}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KARDEX DRAWER */}
      <AnimatePresence>
        {isKardexOpen && selectedItem && (() => {
          // ensure we have the most up to date item from context
          const currentItem = inventory.find(i => i.id === selectedItem.id) || selectedItem;
          
          return (
          <div className="fixed inset-0 z-40 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsKardexOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl relative z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10">
                    {renderSVG(currentItem.containerType, currentItem.color)}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">{currentItem.name}</h2>
                    <p className="text-xs text-slate-500">{currentItem.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsKardexOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Actual</p>
                    <p className="text-3xl font-black text-slate-800">{currentItem.stock} <span className="text-sm font-medium text-slate-400">/ {currentItem.capacity}{currentItem.unit}</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Total</p>
                    <p className="text-3xl font-black text-indigo-600">${(Number(currentItem.unitCost) * currentItem.stock).toLocaleString('es-MX')}</p>
                  </div>
                </div>

                {/* Kardex List */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History size={18} className="text-slate-400"/> Historial de Movimientos
                  </h3>
                  
                  {(!currentItem.movements || currentItem.movements.length === 0) ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No hay movimientos registrados.</p>
                  ) : (
                    <div className="space-y-3">
                      {currentItem.movements.map((mov) => (
                        <div key={mov.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{mov.reason}</p>
                            <p className="text-xs text-slate-400">{new Date(mov.date).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-sm font-bold ${mov.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Movement Action */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Registrar Movimiento Manual</p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const qty = parseInt(e.target.qty.value);
                    const reason = e.target.reason.value;
                    const type = e.nativeEvent.submitter.value; // 'IN' or 'OUT'
                    handleQuickMovement(currentItem, type, qty, reason);
                    e.target.reset();
                  }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <input name="qty" required type="number" min="1" placeholder="Cant." className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    <input name="reason" required type="text" placeholder="Motivo (ej. Venta, Merma)" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" value="IN" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors">
                      Entrada (+)
                    </button>
                    <button type="submit" value="OUT" className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors">
                      Salida (-)
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
          );
        })()}
      </AnimatePresence>

      {/* CREATE/EDIT MODAL */}
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Package className="text-indigo-600"/>
                  {editingItem ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h3>
                <div className="flex items-center gap-2">
                  {editingItem && (
                    <button 
                      onClick={() => { 
                        if(window.confirm('¿Estás seguro de que deseas eliminar este artículo permanentemente?')) { 
                          deleteInventoryItem(editingItem.id); 
                          closeModal(); 
                        } 
                      }} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Eliminar artículo"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button onClick={closeModal} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors" title="Cerrar">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="inventory-form" onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nombre del Artículo</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. Ácido Sulfúrico, Bote Vacío..." />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categoría</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="Materia Prima">Materia Prima</option>
                        <option value="Producto Terminado">Producto Terminado</option>
                        <option value="Empaque">Empaque</option>
                        <option value="Consumible">Consumible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ubicación Físia</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. Almacén 1, Pasillo B" />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Visuals */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Diseño del Contenedor</label>
                    <div className="flex gap-4 mb-4">
                      {CONTAINER_TYPES.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => setFormData({...formData, containerType: c.id})}
                          className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${formData.containerType === c.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="w-12 h-12">
                            {<c.component color={formData.containerType === c.id ? formData.color : '#cbd5e1'} />}
                          </div>
                          <span className={`text-xs font-bold ${formData.containerType === c.id ? 'text-indigo-700' : 'text-slate-500'}`}>{c.id}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color:</span>
                      <div className="flex gap-2">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color} type="button"
                            onClick={() => setFormData({...formData, color})}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-110'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contenido</label>
                        <input required type="number" step="0.01" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. 200" />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unidad</label>
                        <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                          <option value="L">L</option><option value="kg">kg</option><option value="g">g</option><option value="ml">ml</option><option value="gal">gal</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Costo Unit. ($)</label>
                      <input type="number" step="0.01" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {!editingItem && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Stock Inicial</label>
                        <input type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      </div>
                    )}
                    <div className={editingItem ? 'col-span-2' : ''}>
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

              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl text-sm font-semibold transition-colors">
                  Cancelar
                </button>
                <button type="submit" form="inventory-form" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  {editingItem ? 'Guardar Cambios' : 'Crear Artículo'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
