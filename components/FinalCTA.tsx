
import React from 'react';

const FinalCTA: React.FC<{ onContact?: () => void }> = ({ onContact }) => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
          alt="Earth from Space" 
          className="w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-novarc-blue/30 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 px-8 max-w-4xl">
        <div className="mb-10">
           <svg viewBox="0 0 100 100" className="w-16 h-16 fill-novarc-accent mx-auto mb-6 opacity-80">
              <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="10" />
           </svg>
           <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.6em]">The Invitation</span>
        </div>
        <h2 className="text-white text-6xl md:text-8xl font-light mb-12 tracking-tighter leading-none">
          Shape the Legacy of <br /><span className="italic font-serif text-novarc-accent">Discovery</span>
        </h2>
        <p className="text-white/60 text-[14px] mb-16 max-w-2xl mx-auto leading-loose font-light tracking-wide">
          Al-Falak Capital invites institutions and visionaries of shared caliber to explore exclusive opportunities in our sovereign-tier investment ecosystem. Together, we define the standard for the century ahead.
        </p>
        <button 
          onClick={onContact}
          className="bg-white text-novarc-dark px-16 py-5 rounded-sm flex items-center gap-4 mx-auto text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-novarc-accent hover:text-white transition-all duration-500 shadow-2xl"
        >
          Private Inquiry
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
