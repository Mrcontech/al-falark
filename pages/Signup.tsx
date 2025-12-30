
import React from 'react';

const Signup: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-novarc-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="w-full max-w-2xl relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-sm shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div 
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-novarc-accent">
                <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="15" />
              </svg>
              <span className="text-lg font-bold tracking-[0.3em] text-white">AL-FALAK</span>
            </div>
            <h1 className="text-white text-3xl font-light tracking-tight">Institutional Application</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Begin your sovereign investment journey</p>
          </div>
          <button 
            onClick={() => onNavigate('login')}
            className="text-[10px] uppercase tracking-widest text-novarc-accent border border-novarc-accent/30 px-6 py-2 hover:bg-novarc-accent hover:text-white transition-all"
          >
            Log In
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Institution Name</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Jurisdiction</label>
            <select className="w-full bg-white/5 border border-white/10 p-4 text-white/50 text-sm focus:border-novarc-accent outline-none rounded-sm appearance-none">
              <option>United Arab Emirates</option>
              <option>United Kingdom</option>
              <option>Singapore</option>
              <option>United States</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Contact Representative</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Institutional Email</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Planned Allocation (USD)</label>
            <input type="text" placeholder="$10,000,000 +" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none rounded-sm" />
          </div>
          
          <div className="md:col-span-2 py-6">
            <label className="flex items-start gap-4 text-[10px] text-white/40 tracking-widest leading-relaxed cursor-pointer">
              <input type="checkbox" className="mt-1 accent-novarc-accent" required />
              <span>I hereby certify that all information provided is accurate and representative of the named institution. I acknowledge that Al-Falak Capital operates under the Royal Decree of Abu Dhabi and adheres to strict sovereign compliance protocols.</span>
            </label>
          </div>

          <button className="md:col-span-2 bg-novarc-accent text-white py-5 text-[11px] uppercase tracking-[0.5em] font-bold hover:brightness-110 transition-all shadow-2xl">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
