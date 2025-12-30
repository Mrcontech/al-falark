
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-white py-40 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto border-x border-novarc-light">
        <div className="text-center mb-32 max-w-4xl mx-auto px-16">
           <h2 className="text-5xl md:text-7xl font-light text-novarc-dark leading-tight tracking-tight">
            The Magnitude of <span className="text-novarc-accent">Collective</span> Ambition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-novarc-light">
          <div className="p-20 border-r border-novarc-light flex flex-col lg:flex-row items-center justify-between gap-12 group">
             <div>
               <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">Generational Experience</span>
               <div className="text-9xl font-light text-novarc-dark group-hover:text-novarc-accent transition-colors">50+</div>
             </div>
             <div className="max-w-[220px] space-y-8">
                <p className="text-[12px] text-novarc-dark/50 leading-loose">Built upon a half-century of strategic nation-building, our expertise is deeply rooted in the successful transformation of the UAE into a global powerhouse.</p>
                <div className="w-16 h-16 border border-novarc-accent flex items-center justify-center rotate-45 group-hover:bg-novarc-accent transition-all">
                   <div className="-rotate-45 font-bold text-novarc-accent group-hover:text-white">AF</div>
                </div>
             </div>
          </div>
          
          <div className="p-20 flex flex-col lg:flex-row items-center justify-between gap-12 group">
             <div className="max-w-[180px]">
                <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-novarc-accent fill-none stroke-[0.5] opacity-30 group-hover:opacity-100 transition-opacity">
                   <circle cx="50" cy="50" r="40" />
                   <path d="M50 10 Q70 50 50 90 Q30 50 50 10" />
                   <path d="M10 50 Q50 30 90 50 Q50 70 10 50" />
                </svg>
             </div>
             <div className="text-right">
               <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">Capital Stewardship</span>
               <div className="text-9xl font-light text-novarc-dark group-hover:text-novarc-accent transition-colors">$850B</div>
               <p className="text-[12px] text-novarc-dark/50 mt-8 max-w-[280px] ml-auto leading-loose">Managing a diverse sovereign-linked portfolio that secures the prosperity of future generations through resilient and ethical asset management.</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-novarc-light">
           <div className="p-20 border-r border-novarc-light">
              <p className="text-[12px] text-novarc-dark/50 max-w-sm leading-loose uppercase tracking-widest">Our global reach extends across 120 nations, partnering with the world's most innovative founders and institutions.</p>
           </div>
           <div className="p-20 flex items-center justify-between group">
              <div>
                 <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">Global Partnerships</span>
                 <div className="text-9xl font-light text-novarc-dark group-hover:text-novarc-accent transition-colors">120+</div>
              </div>
              <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-novarc-accent fill-none stroke-[0.5] opacity-20">
                <path d="M20 20 L80 80 M80 20 L20 80" />
                <rect x="35" y="35" width="30" height="30" />
              </svg>
           </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
