
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
    { name: 'Reports & Audits' },
  ];

  const balances = liveData?.balances || {
    energy: 0,
    transition: 0,
    frontierTech: 0,
    realEstate: 0,
    orbitalEconomy: 0
  };

  const totalValue = liveData?.totalAssetValue || 0;
  const hasFunds = totalValue > 0;

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
              <StatCard label="Annualized Yield" value={hasFunds ? "12.4%" : "0.0%"} change={hasFunds ? "0.8%" : undefined} isPositive={true} />
              <StatCard label="Realized Gains" value={hasFunds ? "$18,490,000" : "$0"} />
              <StatCard label="Direct Stakes" value={hasFunds ? "12 Entities" : "0 Entities"} />
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
                      { label: 'Energy & Transition', value: Math.round((balances.energy / totalValue) * 100) || 0, color: 'bg-novarc-accent' },
                      { label: 'Frontier Tech', value: Math.round((balances.frontierTech / totalValue) * 100) || 0, color: 'bg-indigo-500' },
                      { label: 'Global Real Estate', value: Math.round((balances.realEstate / totalValue) * 100) || 0, color: 'bg-emerald-500' },
                      { label: 'Orbital Economy', value: Math.round((balances.orbitalEconomy / totalValue) * 100) || 0, color: 'bg-white/20' },
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
