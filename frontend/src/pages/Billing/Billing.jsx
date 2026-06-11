import React from 'react';
import { FileText, Download } from 'lucide-react';

export function Billing() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="glass-panel p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
              <FileText className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Facturación Aislada</h2>
              <p className="text-white/60 text-sm">Genera y exporta facturas a PDF</p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20 transition-all">
            <Download size={18} />
            Exportar PDF
          </button>
        </div>

        <div className="text-center py-12 text-white/50">
          <p>Módulo de facturación en construcción.</p>
          <p className="text-sm mt-2">Aquí irá el formulario para llenar los datos del cliente, conceptos y exportación a PDF (ej. jspdf o react-pdf).</p>
        </div>
      </div>
    </div>
  );
}
