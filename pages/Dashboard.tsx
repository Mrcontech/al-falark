
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const StatCard: React.FC<{ label: string; value: string; change?: string; isPositive?: boolean }> = ({ label, value, change, isPositive }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-sm h-full flex flex-col justify-between min-h-[140px]">
    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold block">{label}</span>
    <div className="flex items-end justify-between gap-3">
      <h3 className="text-2xl md:text-3xl font-light text-white tracking-tighter truncate leading-none">{value}</h3>
      {change && (
        <span className={`text-[10px] font-bold whitespace-nowrap mb-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
  </div>
);

const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Portfolio Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liveData, setLiveData] = useState<any>(userData);
  const [depositMethod, setDepositMethod] = useState<'selection' | 'local' | 'crypto'>('selection');

  useEffect(() => {
    if (userData?.id) {
      const unsub = onSnapshot(doc(db, 'users', userData.id), (doc) => {
        if (doc.exists()) {
          setLiveData({ id: doc.id, ...doc.data() });
        }
      });
      return () => unsub();
    }
  }, [userData]);

  const navItems = [
    { name: 'Portfolio Overview' },
    { name: 'Sovereign Deposit' },
    { name: 'New Allocation' },
    { name: 'Reports & Audits' },
  ];

  const balances = liveData?.balances || {
    energy: 0,
    transition: 0,
    frontierTech: 0,
    realEstate: 0,
    orbitalEconomy: 0
  };

  const cashBalance = liveData?.cashBalance || 0;
  const growthRate = liveData?.monthlyGrowth || 24.5;
  const totalValue = liveData?.totalAssetValue || 0;
  const hasFunds = totalValue > 0 || cashBalance > 0;

  return (
    <div className="min-h-screen bg-novarc-dark text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-novarc-dark sticky top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-novarc-accent">
            <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" />
          </svg>
          <span className="text-sm font-bold tracking-[0.2em]">AL-FALAK</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white/60 hover:text-white"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 border-r border-white/5 bg-novarc-dark flex flex-col p-8 z-[60]
        transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div
          className="flex items-center gap-3 mb-16 cursor-pointer hidden lg:flex"
          onClick={() => onNavigate('landing')}
        >
          <svg viewBox="0 0 100 100" className="w-8 h-8 fill-novarc-accent">
            <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" />
          </svg>
          <span className="text-lg font-bold tracking-[0.3em]">AL-FALAK</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left block px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${activeTab === item.name ? 'text-novarc-accent bg-white/5 border-r-2 border-novarc-accent' : 'text-white/40 hover:text-white'
                }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-novarc-accent/20 flex items-center justify-center text-novarc-accent font-bold">
              {liveData?.encryptedId?.split('-').pop()?.substring(0, 2) || 'SR'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold truncate">Rep {liveData?.encryptedId || 'Sovereign'}</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Legacy Tier</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-6 text-[10px] uppercase tracking-[0.3em] text-rose-400 py-3 border border-rose-400/20 hover:bg-rose-400/10 transition-colors"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
        {activeTab === 'Portfolio Overview' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16">
              <div>
                <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-2">Live Mandate Status</span>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter">Portfolio Intelligence</h1>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white/5 border border-white/10 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">Export Ledger</button>
                <button className="flex-1 md:flex-none bg-novarc-accent text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:brightness-110 transition-all font-bold">New Allocation</button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard label="Total Asset Value" value={`$${totalValue?.toLocaleString()}`} change={hasFunds ? "4.2%" : undefined} isPositive={true} />
              <StatCard label="Liquid Capital" value={`$${cashBalance?.toLocaleString()}`} />
              <StatCard
                label="Monthly Growth"
                value={totalValue > cashBalance ? `${growthRate.toFixed(1)}%` : "0.0%"}
                change={totalValue > cashBalance ? "1.2%" : undefined}
                isPositive={true}
              />
              <StatCard label="Direct Stakes" value={totalValue > cashBalance ? "12 Entities" : "0 Entities"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Performance Chart Simulation */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 p-6 md:p-10 rounded-sm overflow-hidden relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60">Portfolio Performance</h3>
                  <div className="flex gap-4 md:gap-6 text-[10px] text-white/40 uppercase tracking-widest">
                    <span className="text-novarc-accent border-b-2 border-novarc-accent pb-1">1 Year</span>
                    <span className="hover:text-white cursor-pointer transition-colors">5 Year</span>
                    <span className="hover:text-white cursor-pointer transition-colors">All Time</span>
                  </div>
                </div>

                <div className={`h-64 relative flex items-end gap-1 min-w-[300px] ${!hasFunds ? 'opacity-20' : ''}`}>
                  {hasFunds ? (
                    [40, 60, 45, 70, 85, 80, 95, 110, 100, 120, 140, 130].map((h, i) => (
                      <div key={i} className="flex-1 bg-novarc-accent/20 hover:bg-novarc-accent transition-all duration-500 relative group" style={{ height: `${h}%` }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-novarc-dark text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          ${h}M
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-[1px] bg-white/20 self-center"></div>
                  )}
                </div>

                {!hasFunds && (
                  <div className="absolute inset-0 flex items-center justify-center bg-novarc-dark/40 backdrop-blur-[2px]">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-medium">Awaiting Initial Capital Injection</p>
                      <p className="text-[9px] text-white/30 mt-2 uppercase tracking-widest">Performance metrics will initialize upon funding</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6 text-[9px] text-white/20 uppercase tracking-widest">
                  <span>JAN 24</span>
                  <span>JUL 24</span>
                  <span>DEC 24</span>
                </div>
              </div>

              {/* Allocation Breakdown */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm h-full">
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Asset Allocation</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Energy & Transition', value: Math.round((balances.energy / (totalValue - cashBalance)) * 100) || 0, color: 'bg-novarc-accent' },
                      { label: 'Frontier Tech', value: Math.round((balances.frontierTech / (totalValue - cashBalance)) * 100) || 0, color: 'bg-indigo-500' },
                      { label: 'Global Real Estate', value: Math.round((balances.realEstate / (totalValue - cashBalance)) * 100) || 0, color: 'bg-emerald-500' },
                      { label: 'Orbital Economy', value: Math.round((balances.orbitalEconomy / (totalValue - cashBalance)) * 100) || 0, color: 'bg-white/20' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-white/60">{item.label}</span>
                          <span className="font-bold">{item.value}%</span>
                        </div>
                        <div className="h-1 bg-white/5 overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-white/10">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60">Recent Sovereign Movements</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] uppercase tracking-widest min-w-[700px]">
                  <thead className="text-white/20 border-b border-white/10">
                    <tr>
                      <th className="px-8 py-4 font-normal">Transaction</th>
                      <th className="px-8 py-4 font-normal">Entity</th>
                      <th className="px-8 py-4 font-normal">Status</th>
                      <th className="px-8 py-4 font-normal text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {hasFunds ? (
                      <>
                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">Allocation Stake</td>
                          <td className="px-8 py-6 text-white font-medium">Hyperion Solar II</td>
                          <td className="px-8 py-6"><span className="text-emerald-400">Completed</span></td>
                          <td className="px-8 py-6 text-right text-novarc-accent">$12,400,000</td>
                        </tr>
                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">Yield Distribution</td>
                          <td className="px-8 py-6 text-white font-medium">London Regency Portfolio</td>
                          <td className="px-8 py-6"><span className="text-emerald-400">Credited</span></td>
                          <td className="px-8 py-6 text-right text-novarc-accent">$1,240,000</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">Venture Seed</td>
                          <td className="px-8 py-6 text-white font-medium">NeuralStream AI</td>
                          <td className="px-8 py-6"><span className="text-indigo-400">Processing</span></td>
                          <td className="px-8 py-6 text-right text-novarc-accent">$4,500,000</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-[10px] text-white/20 uppercase tracking-[0.3em]">
                          No recent sovereign movements recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'Sovereign Deposit' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16">
              <div>
                <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-2">Protocol Authorization</span>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter">Sovereign Deposit</h1>
              </div>
              {depositMethod !== 'selection' && (
                <button
                  onClick={() => setDepositMethod('selection')}
                  className="bg-white/5 border border-white/10 px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  ← Back to Selection
                </button>
              )}
            </header>

            {depositMethod === 'selection' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div
                  onClick={() => setDepositMethod('local')}
                  className="group bg-white/5 border border-white/10 p-10 rounded-sm cursor-pointer hover:border-novarc-accent/50 transition-all hover:bg-white/[0.07]"
                >
                  <div className="w-12 h-12 bg-novarc-accent/20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-novarc-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light mb-4 text-white">Local Institutional Transfer</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                    Direct wire transfer via Al-Falak Corporate Treasury. Supported in AED and USD.
                  </p>
                </div>

                <div
                  onClick={() => setDepositMethod('crypto')}
                  className="group bg-white/5 border border-white/10 p-10 rounded-sm cursor-pointer hover:border-indigo-500/50 transition-all hover:bg-white/[0.07]"
                >
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light mb-4 text-white">Digital Asset Settlement</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                    Instant liquidity via USDT (ERC20/TRC20) or BTC sovereign gateway.
                  </p>
                </div>
              </div>
            ) : depositMethod === 'local' ? (
              <div className="max-w-2xl bg-white/5 border border-white/10 p-10 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8 pb-4 border-b border-white/5">Banking Credentials</h3>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Bank Name</label>
                      <div className="text-sm text-white">First Abu Dhabi Bank (FAB)</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Account Holder</label>
                      <div className="text-sm text-white font-medium uppercase tracking-wider">Al-Falak Capital LLC</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">IBAN (AED/USD)</label>
                    <div className="bg-black/40 p-4 font-mono text-sm tracking-widest border border-white/5">AE45 0010 0000 1234 5678 9012</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">SWIFT / BIC</label>
                      <div className="text-sm text-white font-mono uppercase">FABUAEAD</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Reference Code</label>
                      <div className="text-sm text-emerald-400 font-mono uppercase tracking-widest">{liveData?.encryptedId?.split('-').pop()}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] leading-loose italic">
                    Note: Institutional transfers undergo 12-stage sovereign verification. Estimated settlement: 2-4 business hours.
                  </p>

                  <div className="bg-white/5 p-6 rounded-sm space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">Record Initiated Transfer</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        placeholder="Amount (USD)"
                        id="local-deposit-input"
                        className="flex-1 bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-novarc-accent outline-none"
                      />
                      <button
                        onClick={async (e) => {
                          const val = (document.getElementById('local-deposit-input') as HTMLInputElement).value;
                          const amount = parseFloat(val);
                          if (!amount || amount <= 0) return;

                          const btn = e.currentTarget;
                          btn.disabled = true;
                          btn.innerText = "Processing...";

                          try {
                            const { updateDoc, doc } = await import('firebase/firestore');
                            await updateDoc(doc(db, 'users', liveData.id), {
                              cashBalance: (liveData.cashBalance || 0) + amount,
                              totalAssetValue: (liveData.totalAssetValue || 0) + amount
                            });
                            alert(`Deposit of $${amount.toLocaleString()} recorded. Your liquid balance will be updated.`);
                            setDepositMethod('selection');
                            setActiveTab('Portfolio Overview');
                          } catch (err) {
                            alert("Failed to record deposit.");
                          } finally {
                            btn.disabled = false;
                            btn.innerText = "Record Transfer";
                          }
                        }}
                        className="bg-novarc-accent text-white px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:brightness-110"
                      >
                        Record Transfer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl bg-white/5 border border-white/10 p-10 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8 pb-4 border-b border-white/5">Digital Vault Addresses</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-indigo-400 font-bold">USDT (ERC20 / TRC20)</label>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">Recommended</span>
                    </div>
                    <div className="bg-black/40 p-4 font-mono text-xs tracking-wider border border-white/5 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-indigo-400 font-bold">Bitcoin (BTC) Network</label>
                    <div className="bg-black/40 p-4 font-mono text-xs tracking-wider border border-white/5 break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                  </div>
                </div>
                <div className="mt-12 p-6 bg-indigo-500/5 border border-indigo-500/10 space-y-6">
                  <p className="text-[9px] text-indigo-300 uppercase tracking-[0.2em] leading-loose">
                    Security Update: Cold storage architecture active. Large settlements may require additional MFA authorization via your institutional representative.
                  </p>

                  <div className="bg-black/40 p-6 rounded-sm space-y-4 border border-indigo-500/10">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">Confirm Asset Placement</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        placeholder="USD Equivalent"
                        id="crypto-deposit-input"
                        className="flex-1 bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-indigo-400 outline-none"
                      />
                      <button
                        onClick={async (e) => {
                          const val = (document.getElementById('crypto-deposit-input') as HTMLInputElement).value;
                          const amount = parseFloat(val);
                          if (!amount || amount <= 0) return;

                          const btn = e.currentTarget;
                          btn.disabled = true;
                          btn.innerText = "Processing...";

                          try {
                            const { updateDoc, doc } = await import('firebase/firestore');
                            await updateDoc(doc(db, 'users', liveData.id), {
                              cashBalance: (liveData.cashBalance || 0) + amount,
                              totalAssetValue: (liveData.totalAssetValue || 0) + amount
                            });
                            alert(`Digital asset placement of $${amount.toLocaleString()} confirmed.`);
                            setDepositMethod('selection');
                            setActiveTab('Portfolio Overview');
                          } catch (err) {
                            alert("Failed to confirm placement.");
                          } finally {
                            btn.disabled = false;
                            btn.innerText = "Confirm Placement";
                          }
                        }}
                        className="bg-indigo-600 text-white px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:brightness-110"
                      >
                        Confirm Placement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'New Allocation' ? (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16">
              <div>
                <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-2">Capital Deployment</span>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter">New Allocation</h1>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-6">Available Liquid Capital</h3>
                  <div className="text-4xl font-light text-novarc-accent tracking-tighter">${cashBalance.toLocaleString()}</div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-4">Unallocated sovereign funds ready for deployment</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-sm space-y-6">
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60">Sovereign Distribution Engine</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest leading-loose">
                    Utilize our proprietary auto-allocation protocol to distribute liquid capital across authorized sectors based on current geopolitical risk metrics.
                  </p>
                  <button
                    disabled={cashBalance <= 0}
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      btn.disabled = true;
                      btn.innerText = "Processing Protocol...";

                      try {
                        const amount = cashBalance;
                        const dist = {
                          energy: amount * 0.25,
                          transition: amount * 0.15,
                          frontierTech: amount * 0.10,
                          realEstate: amount * 0.40,
                          orbitalEconomy: amount * 0.10
                        };

                        const newBalances = {
                          energy: (liveData.balances?.energy || 0) + dist.energy,
                          transition: (liveData.balances?.transition || 0) + dist.transition,
                          frontierTech: (liveData.balances?.frontierTech || 0) + dist.frontierTech,
                          realEstate: (liveData.balances?.realEstate || 0) + dist.realEstate,
                          orbitalEconomy: (liveData.balances?.orbitalEconomy || 0) + dist.orbitalEconomy
                        };

                        const { updateDoc, doc } = await import('firebase/firestore');
                        await updateDoc(doc(db, 'users', liveData.id), {
                          balances: newBalances,
                          cashBalance: 0,
                          totalAssetValue: liveData.totalAssetValue // Keep same, it's just moving from cash to sectors
                        });
                        alert("Auto-allocation protocol successfully executed.");
                        setActiveTab('Portfolio Overview');
                      } catch (err) {
                        alert("Allocation failed.");
                      } finally {
                        btn.disabled = false;
                        btn.innerText = "Auto-Allocate Capital";
                      }
                    }}
                    className="w-full bg-indigo-600 text-white py-4 text-[10px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    Auto-Allocate Capital
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-10">Manual Sector Deployment</h3>
                <div className="space-y-8">
                  {[
                    { id: 'energy', label: 'Energy & Transition' },
                    { id: 'frontierTech', label: 'Frontier Tech' },
                    { id: 'realEstate', label: 'Global Real Estate' },
                    { id: 'orbitalEconomy', label: 'Orbital Economy' },
                    { id: 'transition', label: 'Legacy Transition' }
                  ].map((sector) => (
                    <div key={sector.id} className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent font-bold">{sector.label}</label>
                      <input
                        type="number"
                        id={`alloc-${sector.id}`}
                        placeholder="0.00"
                        className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none"
                      />
                    </div>
                  ))}

                  <button
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      const sectorIds = ['energy', 'frontierTech', 'realEstate', 'orbitalEconomy', 'transition'];
                      let totalAlloc = 0;
                      const updates: any = { ...liveData.balances };

                      sectorIds.forEach(id => {
                        const val = parseFloat((document.getElementById(`alloc-${id}`) as HTMLInputElement).value) || 0;
                        updates[id] = (updates[id] || 0) + val;
                        totalAlloc += val;
                      });

                      if (totalAlloc <= 0) return;
                      if (totalAlloc > cashBalance) {
                        alert("Insufficient liquid capital for this allocation.");
                        return;
                      }

                      btn.disabled = true;
                      btn.innerText = "Deploying Capital...";

                      try {
                        const { updateDoc, doc } = await import('firebase/firestore');
                        await updateDoc(doc(db, 'users', liveData.id), {
                          balances: updates,
                          cashBalance: cashBalance - totalAlloc
                        });
                        alert("Manual deployment successful.");
                        setActiveTab('Portfolio Overview');
                      } catch (err) {
                        alert("Deployment failed.");
                      } finally {
                        btn.disabled = false;
                        btn.innerText = "Deploy Capital";
                      }
                    }}
                    className="w-full bg-novarc-accent text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all shadow-xl"
                  >
                    Deploy Capital
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16">
              <div>
                <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-2">Compliance & Verification</span>
                <h1 className="text-3xl md:text-5xl font-light tracking-tighter">Reports & Audits</h1>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white/5 border border-white/10 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">Request Audit</button>
                <button className="flex-1 md:flex-none bg-novarc-accent text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:brightness-110 transition-all font-bold">Archive Reports</button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard label="Total Reports" value="128" />
              <StatCard label="Pending Review" value="3" change="2" isPositive={false} />
              <StatCard label="Compliance Score" value="98.2%" change="0.5%" isPositive={true} />
              <StatCard label="Last Audit" value="12 Days Ago" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-white/10">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60">Available Documents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] uppercase tracking-widest min-w-[700px]">
                  <thead className="text-white/20 border-b border-white/10">
                    <tr>
                      <th className="px-8 py-4 font-normal">Document Name</th>
                      <th className="px-8 py-4 font-normal">Type</th>
                      <th className="px-8 py-4 font-normal">Date</th>
                      <th className="px-8 py-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {[
                      { name: 'Q4 2024 Financial Audit', type: 'External Audit', date: 'Dec 15, 2024' },
                      { name: 'Annual Sovereign Risk Assessment', type: 'Compliance', date: 'Nov 20, 2024' },
                      { name: 'Hyperion Solar II - ESG Report', type: 'ESG Verification', date: 'Oct 12, 2024' },
                      { name: 'London Regency Asset Valuation', type: 'Tax Report', date: 'Sep 05, 2024' },
                    ].map((doc, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6 text-white font-medium">{doc.name}</td>
                        <td className="px-8 py-6">{doc.type}</td>
                        <td className="px-8 py-6 text-white/40">{doc.date}</td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-novarc-accent hover:underline">Download PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
