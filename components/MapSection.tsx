
import React from 'react';

const MapSection: React.FC = () => {
  return (
    <section className="bg-novarc-dark py-32 text-white overflow-hidden border-y border-white/5">
      <div className="px-8 max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">/ Presence</span>
          <h2 className="text-5xl font-light tracking-tight">Global Influence, One Origin</h2>
        </div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-white/40 flex items-center gap-4">
          Headquartered in Abu Dhabi
          <div className="w-12 h-[1px] bg-novarc-accent"></div>
        </div>
      </div>

      <div className="relative px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-4 space-y-10 relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="flex items-center gap-6 mb-8">
               <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=200" className="w-24 h-24 object-cover grayscale rounded-sm border border-white/20" />
               <div>
                  <h3 className="text-2xl font-light text-novarc-accent">The Oasis Hub</h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Global HQ</span>
               </div>
            </div>
            <p className="text-[12px] text-white/60 leading-loose">
              Operating from the heart of the UAE, our strategic location allows us to bridge Western capital markets with the vibrant growth engines of Asia and Africa.
            </p>
          </div>

          <div className="bg-novarc-blue/80 border border-white/5 p-8 rounded-sm flex justify-between items-center group cursor-pointer hover:bg-novarc-accent transition-colors duration-500">
            <div>
              <div className="text-[10px] uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100">Global Hubs</div>
              <div className="text-sm font-medium">London · Singapore · NYC</div>
            </div>
            <div className="text-4xl font-light tracking-tighter text-novarc-accent group-hover:text-white transition-colors">INTL</div>
          </div>
        </div>

        <div className="lg:col-span-8 relative">
           {/* Abstract World Map focusing on UAE / MENA area */}
           <svg viewBox="0 0 800 500" className="w-full h-auto opacity-40">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="450" cy="230" r="100" fill="url(#glow)" />
              
              <path d="M50 150 Q150 100 250 130 T450 110 T650 150 T750 250" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
              <path d="M100 350 Q200 300 350 330 T450 230 T600 350 T750 300" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
              
              {/* Highlighted Hubs */}
              <circle cx="450" cy="230" r="6" fill="#C5A059" /> {/* UAE */}
              <text x="465" y="235" fill="#C5A059" fontSize="12" fontWeight="bold">ABU DHABI</text>
              
              <circle cx="380" cy="140" r="3" fill="white" /> {/* Europe */}
              <text x="310" y="135" fill="white" fontSize="10" opacity="0.5">LONDON</text>
              
              <circle cx="150" cy="180" r="3" fill="white" /> {/* NYC */}
              <text x="120" y="200" fill="white" fontSize="10" opacity="0.5">NEW YORK</text>
              
              <circle cx="680" cy="280" r="3" fill="white" /> {/* Asia */}
              <text x="690" y="285" fill="white" fontSize="10" opacity="0.5">SINGAPORE</text>

              {/* Connecting Lines */}
              <path d="M450 230 L380 140" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M450 230 L150 180" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M450 230 L680 280" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />
           </svg>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
