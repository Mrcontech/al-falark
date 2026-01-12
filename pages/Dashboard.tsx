
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const StatCard: React.FC<{ label: string; value: string; change?: string; isPositive?: boolean }> = ({ label, value, change, isPositive }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-sm h-full flex flex-col justify-between min-h-[140px]">
    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold block">{label}</span>
    <div className="mt-auto">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-white tracking-tighter leading-none tabular-nums truncate mb-2">{value}</h3>
      {change && (
        <div className={`text-[10px] font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span className="tracking-wider">{change}</span>
        </div>
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
  const [cryptoStep, setCryptoStep] = useState<'amount' | 'payment' | 'verify'>('amount');
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [cryptoCurrency, setCryptoCurrency] = useState<'USDT' | 'BTC'>('USDT');
  const [showHashGuide, setShowHashGuide] = useState(false);
  const [liveTickingValue, setLiveTickingValue] = useState<number>(liveData?.totalAssetValue || 0);

  const TREASURY_WALLETS = {
    USDT: "0x1001dd8f00a88b636bab1de862699a5ddb1a27bb",
    BTC: "bc1qhej6zutlzued0c67a7rx62a86c2z97g66xu7y8"
  };

  useEffect(() => {
    if (userData?.id) {
      const unsub = onSnapshot(doc(db, 'users', userData.id), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setLiveData({ id: doc.id, ...data });
        }
      });
      return () => unsub();
    }
  }, [userData]);

  // Real-time Growth Counter Logic
  useEffect(() => {
    const MONTHLY_GROWTH = 0.24;
    const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;

    const calculateLiveValue = () => {
      if (!liveData?.transactions) return liveData?.totalAssetValue || 0;

      const now = Date.now();
      let total = liveData.cashBalance || 0;

      liveData.transactions.forEach((tx: any) => {
        if (tx.type === 'allocation') {
          const startTime = new Date(tx.timestamp).getTime();
          const secondsElapsed = Math.max(0, (now - startTime) / 1000);
          const growth = tx.amount * (MONTHLY_GROWTH / SECONDS_PER_MONTH) * secondsElapsed;
          total += tx.amount + growth;
        } else if (tx.type === 'deposit') {
          // Deposits are already handled in cashBalance unless allocated
          // But we need to make sure we don't double count.
          // In our logic, 'allocation' transactions represent money MOVED from cash to sectors.
          // So we only count 'allocation' amounts + their growth.
          // The cashBalance covers whatever is left over.
        }
      });

      return total;
    };

    // Initial calculation
    setLiveTickingValue(calculateLiveValue());

    // Tick every 100ms for visual smoothness
    const interval = setInterval(() => {
      setLiveTickingValue(calculateLiveValue());
    }, 100);

    return () => clearInterval(interval);
  }, [liveData]);

  const navItems = [
    { name: 'Portfolio Overview' },
    { name: 'Sovereign Deposit' },
    { name: 'New Allocation' },
  ];

  const balances = liveData?.balances || {
    energy: 0,
    transition: 0,
    frontierTech: 0,
    realEstate: 0,
    orbitalEconomy: 0
  };

  const cashBalance = liveData?.cashBalance || 0;
  const growthRate = liveData?.monthlyGrowth || 24;
  const totalValue = liveTickingValue;
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
              {liveData?.encryptedId?.split('-').pop()?.substring(0, 2).toUpperCase() || 'SR'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold truncate">Rep {liveData?.encryptedId || 'SOVEREIGN'}</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Sovereign Tier</div>
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
                <button
                  onClick={() => setActiveTab('New Allocation')}
                  className="flex-1 md:flex-none bg-novarc-accent text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:brightness-110 transition-all font-bold"
                >
                  New Allocation
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard label="Principal Invested" value={`$${(liveData?.principalInvested || 0).toLocaleString()}`} />
              <StatCard label="Liquid Capital" value={`$${cashBalance?.toLocaleString()}`} />
              <StatCard
                label="Live Yield Velocity"
                value={(liveData?.principalInvested || 0) > 0 ? `+${growthRate}%` : "--"}
                isPositive={true}
              />
              <StatCard label="Total Value" value={`$${totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change={(liveData?.principalInvested || 0) > 0 ? `+${growthRate}%/mo` : undefined} isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Investment Growth Summary */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 p-6 md:p-10 rounded-sm overflow-hidden relative">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Investment Growth</h3>

                {(liveData?.principalInvested || 0) > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-black/30 p-6 border border-white/5">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">Your Investment</div>
                        <div className="text-2xl font-light text-white">${(liveData?.principalInvested || 0).toLocaleString()}</div>
                      </div>
                      <div className="bg-black/30 p-6 border border-novarc-accent/30">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-novarc-accent mb-2">Yield Velocity</div>
                        <div className="text-2xl font-light text-novarc-accent">+{growthRate}% / month</div>
                      </div>
                      <div className="bg-black/30 p-6 border border-emerald-500/30">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-emerald-400 mb-2">Current Value</div>
                        <div className="text-2xl font-light text-emerald-400 tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>

                    <div className="bg-novarc-accent/10 border border-novarc-accent/20 p-6">
                      <p className="text-[10px] text-novarc-accent uppercase tracking-[0.2em] leading-loose">
                        Sovereign yield is compounding in real-time. Your portfolio value increases gradually as global growth markers are hit.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">No Active Investments</p>
                      <p className="text-[9px] text-white/20 mt-2 uppercase tracking-widest">Deposit funds and allocate to start growing your portfolio</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Allocation Breakdown */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm h-full">
                  <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Asset Allocation</h3>
                  <div className="space-y-6">
                    {(liveData?.principalInvested || 0) > 0 ? (
                      [
                        { label: 'Energy & Transition', value: Math.round((balances.energy / (liveData?.principalInvested || 1)) * 100), color: 'bg-novarc-accent' },
                        { label: 'Frontier Tech', value: Math.round((balances.frontierTech / (liveData?.principalInvested || 1)) * 100), color: 'bg-indigo-500' },
                        { label: 'Global Real Estate', value: Math.round((balances.realEstate / (liveData?.principalInvested || 1)) * 100), color: 'bg-emerald-500' },
                        { label: 'Orbital Economy', value: Math.round((balances.orbitalEconomy / (liveData?.principalInvested || 1)) * 100), color: 'bg-white/20' },
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[9px] text-white/30 uppercase tracking-widest">No allocations yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-white/10">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60">Transaction History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] uppercase tracking-widest min-w-[700px]">
                  <thead className="text-white/20 border-b border-white/10">
                    <tr>
                      <th className="px-8 py-4 font-normal">Type</th>
                      <th className="px-8 py-4 font-normal">Details</th>
                      <th className="px-8 py-4 font-normal">Date</th>
                      <th className="px-8 py-4 font-normal text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {(liveData?.transactions || []).length > 0 ? (
                      [...(liveData?.transactions || [])].reverse().slice(0, 10).map((tx: any, idx: number) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">
                            <span className={tx.type === 'deposit' ? 'text-emerald-400' : 'text-indigo-400'}>
                              {tx.type === 'deposit' ? 'Deposit' : 'Allocation'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-white font-medium">
                            <div className="flex flex-col">
                              <span>{tx.type === 'deposit' ? (tx.method || 'Crypto Deposit') : (tx.sector || 'Sector Allocation')}</span>
                              {tx.txid && <span className="text-[7px] text-white/20 font-mono mt-1 opacity-50">TX: {tx.txid}</span>}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-white/40">
                            <div className="flex items-center gap-2">
                              {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {tx.status === 'pending' && (
                                <span className="text-[7px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">Verifying</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right text-novarc-accent">${tx.amount?.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-[10px] text-white/20 uppercase tracking-[0.3em]">
                          No transactions recorded yet
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
                    Instant liquidity via USDT (ERC20) or BTC sovereign gateway.
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
                            const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
                            await updateDoc(doc(db, 'users', liveData.id), {
                              cashBalance: (liveData.cashBalance || 0) + amount,
                              totalAssetValue: (liveData.totalAssetValue || 0) + amount,
                              transactions: arrayUnion({
                                type: 'deposit',
                                amount,
                                method: 'local',
                                timestamp: new Date().toISOString()
                              })
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
            ) : cryptoStep === 'amount' ? (
              <div className="max-w-2xl bg-white/5 border border-white/10 p-10 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8 pb-4 border-b border-white/5">Digital Asset Settlement</h3>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">Select Settlement Asset</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['USDT', 'BTC'].map((cur) => (
                        <div
                          key={cur}
                          onClick={() => setCryptoCurrency(cur as any)}
                          className={`p-6 border cursor-pointer transition-all ${cryptoCurrency === cur ? 'bg-indigo-500/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          <div className="text-sm font-bold text-white">{cur}</div>
                          <div className="text-[9px] text-white/40 uppercase mt-1">{cur === 'USDT' ? 'ERC20 Network' : 'Legacy Mainnet'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">Placement Amount (USD Equivalent)</label>
                    <input
                      type="number"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      placeholder="Enter amount in USD"
                      className="w-full bg-black/40 border border-white/10 p-4 text-white text-lg focus:border-indigo-400 outline-none font-light"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
                        alert("Please enter a valid amount.");
                        return;
                      }
                      setCryptoStep('payment');
                    }}
                    className="w-full bg-indigo-600 text-white py-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:brightness-110 shadow-lg"
                  >
                    Generate Settlement Protocol
                  </button>
                </div>
              </div>
            ) : cryptoStep === 'payment' ? (
              <div className="max-w-3xl bg-white/5 border border-white/10 p-10 rounded-sm">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1 space-y-8">
                    <div>
                      <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-6 pb-4 border-b border-white/5">Treasury Settlement</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-indigo-400 font-bold">Total to Send</label>
                          <div className="text-2xl text-white font-light tracking-tight">${parseFloat(cryptoAmount).toLocaleString()} <span className="text-xs text-white/40 uppercase ml-2">USD Equivalent</span></div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-indigo-400 font-bold">{cryptoCurrency} Wallet Address ({cryptoCurrency === 'USDT' ? 'ERC20' : 'Network'})</label>
                          <div className="bg-black/40 p-4 font-mono text-xs tracking-wider border border-white/5 break-all relative group">
                            {TREASURY_WALLETS[cryptoCurrency]}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(TREASURY_WALLETS[cryptoCurrency]);
                                alert("Address copied to clipboard");
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-indigo-400 hover:text-white"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 text-[9px] text-white/40 uppercase tracking-widest leading-loose">
                          Ensure you are sending via the correct network. Sending {cryptoCurrency} to a non-compatible address will result in permanent asset loss.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-64 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-white p-4 rounded-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${TREASURY_WALLETS[cryptoCurrency]}`}
                        alt="Deposit QR"
                        className="w-48 h-48"
                      />
                    </div>
                    <span className="text-[9px] text-white/20 uppercase tracking-widest text-center">Scan to authorize transfer</span>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button
                    onClick={() => setCryptoStep('amount')}
                    className="flex-1 border border-white/10 py-4 text-[10px] uppercase tracking-widest hover:bg-white/5"
                  >
                    Adjust Amount
                  </button>
                  <button
                    onClick={() => setCryptoStep('verify')}
                    className="flex-1 bg-indigo-600 text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:brightness-110"
                  >
                    Confirm Transfer Sent
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl bg-white/5 border border-white/10 p-10 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8 pb-4 border-b border-white/5">Protocol Verification</h3>
                <div className="space-y-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">Transaction Hash (TXID)</label>
                    <button
                      onClick={() => setShowHashGuide(true)}
                      className="text-[9px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      How to get hash?
                    </button>
                  </div>
                  <input
                    type="text"
                    id="txid-input"
                    placeholder="Enter 64-character hash"
                    className="w-full bg-black/40 border border-white/10 p-4 text-white font-mono text-sm focus:border-indigo-400 outline-none"
                  />
                  <p className="text-[9px] text-white/20 uppercase mt-2">Required for sovereign verification and block confirmation</p>
                </div>

                <button
                  onClick={async (e) => {
                    const txid = (document.getElementById('txid-input') as HTMLInputElement).value;
                    if (!txid || txid.length < 10) {
                      alert("Please provide a valid transaction hash.");
                      return;
                    }

                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerText = "Initiating Confirmation...";

                    try {
                      const amount = parseFloat(cryptoAmount);
                      const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
                      await updateDoc(doc(db, 'users', liveData.id), {
                        cashBalance: (liveData.cashBalance || 0) + amount,
                        transactions: arrayUnion({
                          type: 'deposit',
                          amount,
                          method: `crypto (${cryptoCurrency})`,
                          txid,
                          status: 'pending',
                          timestamp: new Date().toISOString()
                        })
                      });
                      alert("Settlement protocol initiated. Funds will reflect after network consensus.");
                      setCryptoStep('amount');
                      setCryptoAmount('');
                      setDepositMethod('selection');
                      setActiveTab('Portfolio Overview');
                    } catch (err) {
                      alert("Verification failed. Please contact your representative.");
                    } finally {
                      btn.disabled = false;
                      btn.innerText = "Finalize Settlement";
                    }
                  }}
                  className="w-full bg-indigo-600 text-white py-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:brightness-110 shadow-xl"
                >
                  Finalize Settlement
                </button>
              </div>
            )}
          </>
        ) : (
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

                        const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
                        await updateDoc(doc(db, 'users', liveData.id), {
                          balances: newBalances,
                          cashBalance: 0,
                          principalInvested: (liveData.principalInvested || 0) + amount,
                          transactions: arrayUnion({
                            type: 'allocation',
                            amount,
                            sector: 'auto-distributed',
                            timestamp: new Date().toISOString()
                          })
                        });
                        alert("Auto-allocation protocol successfully executed.");
                        setActiveTab('Portfolio Overview');
                      } catch (err) {
                        alert("Protocol execution failed.");
                      } finally {
                        btn.disabled = false;
                        btn.innerText = "Auto-Allocate Capital";
                      }
                    }}
                    className="w-full bg-novarc-accent text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all shadow-lg"
                  >
                    Auto-Allocate Capital
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Strategic Sector Deployment</h3>
                <div className="space-y-6">
                  {[
                    { id: 'energy', label: 'Energy & Transition' },
                    { id: 'transition', label: 'Sovereign Transition' },
                    { id: 'frontierTech', label: 'Frontier AI & Tech' },
                    { id: 'realEstate', label: 'Global Real Estate' },
                    { id: 'orbitalEconomy', label: 'Orbital Economy' },
                  ].map((sector) => (
                    <div key={sector.id} className="space-y-2">
                      <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40">
                        <span>{sector.label}</span>
                        <span>Amount (USD)</span>
                      </div>
                      <input
                        type="number"
                        id={`alloc-${sector.id}`}
                        placeholder="0.00"
                        className="w-full bg-black/40 border border-white/10 p-4 text-white focus:outline-none focus:border-novarc-accent transition-colors font-light"
                      />
                    </div>
                  ))}

                  <button
                    disabled={cashBalance <= 0}
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      const sectors = ['energy', 'transition', 'frontierTech', 'realEstate', 'orbitalEconomy'];
                      let totalAlloc = 0;
                      const updates: any = { ...liveData.balances };

                      sectors.forEach(s => {
                        const val = parseFloat((document.getElementById(`alloc-${s}`) as HTMLInputElement).value) || 0;
                        if (val > 0) {
                          totalAlloc += val;
                          updates[s] = (updates[s] || 0) + val;
                        }
                      });

                      if (totalAlloc <= 0) return;
                      if (totalAlloc > cashBalance) {
                        alert("Insufficient liquid capital for this allocation.");
                        return;
                      }

                      btn.disabled = true;
                      btn.innerText = "Deploying Capital...";

                      try {
                        const { updateDoc, doc, arrayUnion } = await import('firebase/firestore');
                        await updateDoc(doc(db, 'users', liveData.id), {
                          balances: updates,
                          cashBalance: cashBalance - totalAlloc,
                          principalInvested: (liveData.principalInvested || 0) + totalAlloc,
                          transactions: arrayUnion({
                            type: 'allocation',
                            amount: totalAlloc,
                            sector: 'manual-deployment',
                            timestamp: new Date().toISOString()
                          })
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
        )}

        {/* Hash Guide Modal */}
        {showHashGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0b0c10] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm p-8 md:p-12 relative">
              <button
                onClick={() => setShowHashGuide(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <header className="mb-10">
                <span className="text-novarc-accent text-[10px] font-bold uppercase tracking-[0.4em] block mb-3">Sovereign Tutorial</span>
                <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">How to locate your TXID</h2>
                <p className="text-[11px] text-white/40 uppercase tracking-widest mt-4 leading-relaxed">
                  The Transaction Hash (TXID) is a unique identifier required to verify your protocol settlement on the blockchain.
                </p>
              </header>

              <div className="space-y-10">
                {/* Binance */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400 font-bold text-xs">01</div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Binance</h4>
                  </div>
                  <ul className="space-y-3 text-[11px] text-white/60 uppercase tracking-wider pl-11">
                    <li className="flex gap-2"><span>•</span> Go to [Wallet] → [Transaction History]</li>
                    <li className="flex gap-2"><span>•</span> Select the specific withdrawal transaction</li>
                    <li className="flex gap-2"><span>•</span> Copy the string under [TxID] (it looks like a long mix of letters and numbers)</li>
                  </ul>
                </div>

                {/* MetaMask */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 font-bold text-xs">02</div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">MetaMask</h4>
                  </div>
                  <ul className="space-y-3 text-[11px] text-white/60 uppercase tracking-wider pl-11">
                    <li className="flex gap-2"><span>•</span> Click on the [Activity] tab in your wallet</li>
                    <li className="flex gap-2"><span>•</span> Click on the send transaction</li>
                    <li className="flex gap-2"><span>•</span> Select [View on Explorer] or copy the [Transaction ID] directly</li>
                  </ul>
                </div>

                {/* Trust Wallet */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 font-bold text-xs">03</div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Trust Wallet</h4>
                  </div>
                  <ul className="space-y-3 text-[11px] text-white/60 uppercase tracking-wider pl-11">
                    <li className="flex gap-2"><span>•</span> Open the asset page (USDT/BTC)</li>
                    <li className="flex gap-2"><span>•</span> Tap on the transaction in your history</li>
                    <li className="flex gap-2"><span>•</span> Copy the [Transaction ID] or [Hash] from the details screen</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <button
                  onClick={() => setShowHashGuide(false)}
                  className="w-full bg-white/5 border border-white/10 text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/10 transition-colors"
                >
                  I have my hash
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div >
  );
};

export default Dashboard;
