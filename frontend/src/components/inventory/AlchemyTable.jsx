import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Settings, Play, Plus, X, ArrowDown, Droplets, AlertCircle } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { renderSVG } from './ContainerSVGs';

export default function AlchemyTable({ selectedProduct }) {
  const { inventory, saveRecipe, craftProduct } = useInventory();
  const [craftQuantity, setCraftQuantity] = useState(1);
  const [editingRecipe, setEditingRecipe] = useState(false);
  const [newIngredients, setNewIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const rawMaterials = inventory.filter(i => i.category === 'Materia Prima' || i.category === 'Consumible' || i.category === 'Empaque');

  const handleAddIngredient = () => {
    if (rawMaterials.length === 0) return;
    setNewIngredients([...newIngredients, { rawMaterialId: rawMaterials[0].id, quantity: 1 }]);
  };

  const handleUpdateIngredient = (index, field, value) => {
    const updated = [...newIngredients];
    updated[index][field] = value;
    setNewIngredients(updated);
  };

  const handleRemoveIngredient = (index) => {
    const updated = [...newIngredients];
    updated.splice(index, 1);
    setNewIngredients(updated);
  };

  const handleSaveRecipe = async () => {
    if (newIngredients.length === 0) return;
    setLoading(true);
    await saveRecipe(selectedProduct.id, newIngredients);
    setEditingRecipe(false);
    setLoading(false);
  };

  const handleCraft = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await craftProduct(selectedProduct.id, craftQuantity);
    if (!res.success) {
      setErrorMsg(res.error || 'Error al fabricar');
    } else {
      setCraftQuantity(1);
    }
    setLoading(false);
  };

  const startEditing = () => {
    setNewIngredients(selectedProduct.recipesAsFinal?.map(r => ({ rawMaterialId: r.rawMaterialId, quantity: r.quantity })) || []);
    setEditingRecipe(true);
  };

  if (!selectedProduct) {
    return (
      <div className="h-full bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Beaker size={64} className="mb-4 text-slate-300" strokeWidth={1.5} />
        <h3 className="text-xl font-bold text-slate-500 mb-2">Mesa de Producción</h3>
        <p className="max-w-xs text-sm">Selecciona un Producto Terminado del inventario para ver su receta y fabricarlo.</p>
      </div>
    );
  }

  const hasRecipe = selectedProduct.recipesAsFinal && selectedProduct.recipesAsFinal.length > 0;
  const isEditing = !hasRecipe || editingRecipe;

  return (
    <div className="h-full bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Beaker size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{selectedProduct.name}</h2>
            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">{hasRecipe ? 'Mesa de Fabricación' : 'Creación de Receta'}</p>
          </div>
        </div>
        {hasRecipe && !isEditing && (
          <button onClick={startEditing} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm" title="Editar Receta">
            <Settings size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 relative">
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="editing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <Droplets size={16} className="text-indigo-500" />
                    Ingredientes Necesarios
                  </h4>
                  <button onClick={handleAddIngredient} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <Plus size={14} /> Añadir
                  </button>
                </div>
                
                {newIngredients.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                    No hay ingredientes. Añade materia prima para crear la receta.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newIngredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl">
                        <select 
                          className="flex-1 bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                          value={ing.rawMaterialId}
                          onChange={(e) => handleUpdateIngredient(idx, 'rawMaterialId', e.target.value)}
                        >
                          {rawMaterials.map(rm => (
                            <option key={rm.id} value={rm.id}>{rm.name} ({rm.stock} {rm.unit} disp.)</option>
                          ))}
                        </select>
                        <input 
                          type="number" min="0.1" step="0.1"
                          className="w-24 bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                          value={ing.quantity}
                          onChange={(e) => handleUpdateIngredient(idx, 'quantity', e.target.value)}
                          placeholder="Cant."
                        />
                        <button onClick={() => handleRemoveIngredient(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="crafting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[300px]">
              
              {/* Visual Alchemy Tree */}
              <div className="relative w-full max-w-sm mx-auto">
                {/* Ingredients Row */}
                <div className="flex justify-center flex-wrap gap-4 mb-8">
                  {selectedProduct.recipesAsFinal.map((ing, idx) => {
                    const enoughStock = ing.rawMaterial.stock >= (ing.quantity * craftQuantity);
                    return (
                      <div key={idx} className="flex flex-col items-center group relative">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-white shadow-sm transition-all duration-300 ${enoughStock ? 'border-slate-100 group-hover:border-indigo-300' : 'border-red-200 bg-red-50'}`}>
                          <div className="w-12 h-12">
                            {renderSVG(ing.rawMaterial.containerType, ing.rawMaterial.color)}
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-[10px] font-bold text-slate-600 max-w-[80px] truncate">{ing.rawMaterial.name}</p>
                          <p className={`text-[10px] font-bold ${enoughStock ? 'text-indigo-600' : 'text-red-600'}`}>
                            {ing.quantity * craftQuantity} {ing.rawMaterial.unit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Arrow down */}
                <div className="flex justify-center mb-8 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-px h-full bg-indigo-200 absolute top-0 bottom-0" />
                  </div>
                  <div className="bg-slate-50 relative z-10 p-2 rounded-full">
                    <ArrowDown size={20} className="text-indigo-400" strokeWidth={3} />
                  </div>
                </div>

                {/* Result Product */}
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500" />
                    <div className="w-32 h-32 relative z-10 hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                      {renderSVG(selectedProduct.containerType, selectedProduct.color)}
                    </div>
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        +{craftQuantity} {selectedProduct.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-white shrink-0">
        {isEditing ? (
          <div className="flex gap-3">
            {hasRecipe && (
              <button onClick={() => setEditingRecipe(false)} className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
            )}
            <button 
              onClick={handleSaveRecipe} 
              disabled={loading || newIngredients.length === 0}
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Guardando...' : 'Guardar Receta'}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-slate-400">Qty</span>
              <input 
                type="number" min="1" 
                value={craftQuantity}
                onChange={(e) => setCraftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
            <button 
              onClick={handleCraft}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-sm hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? 'Fabricando...' : (
                <>
                  <Play size={16} className="fill-white group-hover:scale-110 transition-transform" />
                  FABRICAR
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
