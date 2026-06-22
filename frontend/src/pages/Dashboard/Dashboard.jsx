import React from 'react';
import { Wallet, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function Dashboard() {
  const { cards, getTotalBalance } = useFinance();
  const totalBalance = getTotalBalance();

  return (
    <div className="space-y-8">

      {/* Balance General - Toon Plastic Card */}
      <div 
        className="relative overflow-hidden rounded-[2.5rem] bg-indigo-500/80 backdrop-blur-xl border-4 border-white/20 p-8 shadow-[inset_0_6px_0_rgba(255,255,255,0.4),_inset_0_-6px_0_rgba(0,0,0,0.2),_0_20px_40px_rgba(0,0,0,0.3)] transition-all group hover:scale-[1.01]"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/40 rounded-full blur-3xl group-hover:bg-emerald-400/50 transition-colors"></div>
        {/* Toon Reflection */}
        <div className="absolute top-4 right-8 w-24 h-5 bg-white rounded-full opacity-30 rotate-[-12deg] pointer-events-none" />
        <div className="absolute top-12 right-6 w-5 h-5 bg-white rounded-full opacity-30 pointer-events-none" />
        <div className="absolute top-2 left-10 w-40 h-2 bg-white rounded-full opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-bold uppercase tracking-wider mb-1">Overall Total Balance</p>
            <h1 className="text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>
          </div>
          <div className="h-20 w-20 bg-emerald-500 rounded-3xl flex items-center justify-center border-4 border-white/30 relative overflow-hidden shadow-[inset_0_4px_0_rgba(255,255,255,0.5),_inset_0_-4px_0_rgba(0,0,0,0.2),_0_8px_16px_rgba(0,0,0,0.2)]">
            <div className="absolute top-1 left-2 w-8 h-1.5 bg-white rounded-full opacity-60 pointer-events-none" />
            <Wallet className="text-white w-10 h-10" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Tarjetas Grid */}
      <div>
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 drop-shadow-md">
          <div className="bg-indigo-500 p-2.5 rounded-xl border-2 border-white/20 shadow-[inset_0_3px_0_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0.5 left-1.5 w-4 h-1 bg-white rounded-full opacity-50 pointer-events-none" />
            <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          My Accounts & Cards
        </h2>

        {cards.filter(c => c.isActive !== false).length === 0 ? (
          <div className="rounded-[2rem] bg-white/5 border-2 border-dashed border-white/20 p-12 text-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]">
            <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-4" strokeWidth={2} />
            <p className="text-white/50 text-sm font-bold">No cards or accounts yet. Add one from the Finance section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.filter(c => c.isActive !== false).map((card) => (
              <div
                key={card.id}
                className="group relative rounded-[2rem] bg-white/10 hover:bg-white/15 transition-all duration-300 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 p-6 cursor-pointer overflow-hidden hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.2), 0 12px 24px rgba(0,0,0,0.2)'
                }}
              >
                {/* Background glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-400/40 transition-colors"></div>
                
                {/* Toon Reflection */}
                <div className="absolute top-3 right-4 w-12 h-2.5 bg-white rounded-full opacity-20 rotate-[-15deg] pointer-events-none group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-7 right-3 w-2.5 h-2.5 bg-white rounded-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-white/70 text-xs font-bold tracking-widest">{card.type?.toUpperCase()}</p>
                    <p className="text-white font-bold mt-1 text-lg">{card.bank || card.name}</p>
                  </div>
                  <div className="bg-white/20 px-4 py-1.5 rounded-full text-white font-bold text-sm border-2 border-white/20 shadow-[inset_0_2px_0_rgba(255,255,255,0.3)] relative overflow-hidden">
                    <div className="absolute top-0.5 left-2 w-4 h-0.5 bg-white rounded-full opacity-40 pointer-events-none" />
                    *{card.last4 || card.lastFour || '????'}
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-3xl font-black text-white drop-shadow-md">
                    ${Math.abs(card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${card.balance >= 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[inset_0_2px_0_rgba(255,255,255,0.1)]' : 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[inset_0_2px_0_rgba(255,255,255,0.1)]'}`}>
                    {card.balance >= 0 ? <TrendingUp className="w-4 h-4" strokeWidth={3} /> : <TrendingDown className="w-4 h-4" strokeWidth={3} />}
                    {card.balance >= 0 ? 'Positive Balance' : 'Active Debt'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
