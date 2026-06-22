import React, { useState } from 'react';
import { History, X, AlertTriangle } from 'lucide-react';
import { renderSVG } from './ContainerSVGs';
import { useInventory } from '../../context/InventoryContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function KardexPanel({ item, onClose, onMovement }) {
  const { inventory } = useInventory();
  const [confirmData, setConfirmData] = useState({ isOpen: false, qty: 0, reason: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!item) return null;
  const currentItem = inventory.find(i => i.id === item.id) || item;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      if(onMovement) {
        await onMovement(currentItem, confirmData.type, confirmData.qty, confirmData.reason);
      }
      toast.success('Movimiento registrado con éxito');
      setConfirmData({ isOpen: false, qty: 0, reason: '', type: '' });
      document.getElementById('movement-form').reset();
    } catch (error) {
      toast.error('Error al registrar el movimiento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              {renderSVG(currentItem.containerType, currentItem.color)}
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800 leading-tight">{currentItem.name}</h2>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{currentItem.category}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Cerrar Panel">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Actual</p>
              <p className="text-3xl font-black text-slate-800">{currentItem.stock} <span className="text-sm font-medium text-slate-400">/ {currentItem.capacity}{currentItem.unit}</span></p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Total</p>
              <p className="text-3xl font-black text-indigo-600">${(Number(currentItem.unitCost) * currentItem.stock).toLocaleString('es-MX')}</p>
            </div>
          </div>

          {/* Kardex List */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
              <History size={16} className="text-slate-400"/> Historial de Movimientos
            </h3>
            
            {(!currentItem.movements || currentItem.movements.length === 0) ? (
              <p className="text-sm text-slate-400 text-center py-6 bg-white border border-slate-100 border-dashed rounded-xl">No hay movimientos registrados.</p>
            ) : (
              <div className="space-y-3">
                {currentItem.movements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{mov.reason}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">{new Date(mov.date).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-black ${mov.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Movement Action */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Registrar Movimiento Manual</p>
          <form 
            id="movement-form"
            onSubmit={(e) => {
              e.preventDefault();
              const qty = parseInt(e.target.qty.value);
              const reason = e.target.reason.value;
              const type = e.nativeEvent.submitter.value; // 'IN' or 'OUT'
              setConfirmData({ isOpen: true, qty, reason, type });
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-2">
              <input name="qty" required type="number" min="1" placeholder="Cant." className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              <input name="reason" required type="text" placeholder="Motivo (ej. Venta, Merma)" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="flex gap-2">
              <button type="submit" value="IN" className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold transition-colors">
                Entrada (+)
              </button>
              <button type="submit" value="OUT" className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-sm font-bold transition-colors">
                Salida (-)
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmData.isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isProcessing && setConfirmData({ ...confirmData, isOpen: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col"
            >
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmData.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  <AlertTriangle size={32} />
                </div>
                <h3 className="font-black text-xl text-slate-800 mb-2">Confirmar {confirmData.type === 'IN' ? 'Entrada' : 'Salida'}</h3>
                <p className="text-slate-500 text-sm mb-4">
                  ¿Estás seguro de registrar una <strong>{confirmData.type === 'IN' ? 'entrada' : 'salida'}</strong> de <strong className="text-slate-800">{confirmData.qty} {confirmData.qty === 1 ? 'unidad' : 'unidades'}</strong> ({confirmData.qty * Number(currentItem.capacity)}{currentItem.unit} en total) del producto <strong>{currentItem.name}</strong>?
                </p>
                <div className="bg-slate-50 rounded-xl p-3 text-left">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Motivo:</p>
                  <p className="text-sm font-medium text-slate-800">"{confirmData.reason}"</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setConfirmData({ ...confirmData, isOpen: false })}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={`flex-1 py-3 text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center ${confirmData.type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
