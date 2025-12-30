
import React, { useState } from 'react';

const sectorsData = [
  { id: '01', title: 'Energy & Transition', content: 'Leading the global shift toward decarbonization through massive solar arrays, green hydrogen, and advanced fusion research.' },
  { id: '02', title: 'Frontier Technology', content: 'Aggressively deploying capital into artificial general intelligence, quantum computing, and the next generation of semiconductors.' },
  { id: '03', title: 'Space Exploration', content: 'Investing in the infrastructure of the orbital economy — from satellite constellations to long-range planetary discovery missions.' },
  { id: '04', title: 'Global Real Estate', content: 'Curating a portfolio of iconic luxury assets and sustainable urban developments in the world\'s most resilient gateway cities.' },
];

const Sectors: React.FC = () => {
  const [activeId, setActiveId] = useState('02');

  return (
    <section id="sectors" className="py-32 bg-white border-b border-novarc-light">
      <div className="px-8 max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">/ Strategic Pillars</span>
          <h2 className="text-5xl font-light text-novarc-dark">Sovereign Focus Areas</h2>
        </div>
        <button className="bg-novarc-blue text-white px-10 py-3 rounded-sm flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] hover:bg-novarc-accent transition-all duration-300">
          Request Prospectus
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto px-8 gap-16">
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] bg-novarc-light overflow-hidden rounded-sm relative group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000" 
              alt="Sector focus" 
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-novarc-accent/10 mix-blend-overlay"></div>
            <div className="absolute bottom-8 left-8 text-white">
               <span className="text-[10px] uppercase tracking-[0.4em] opacity-70">Focusing on</span>
               <div className="text-2xl font-light mt-2 tracking-wide">The Next Century</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-10 mb-16 text-[11px] text-novarc-dark/40 leading-loose uppercase tracking-[0.1em]">
            <p>Our mandate is to identify and nurture the industries that will sustain humanity through the coming era of rapid transformation.</p>
            <p>By leveraging our unique position as a sovereign investor, we provide the patient capital necessary for moonshot projects to thrive.</p>
          </div>

          <div className="border-t border-novarc-light">
            {sectorsData.map((sector) => (
              <div 
                key={sector.id} 
                className={`border-b border-novarc-light transition-all duration-700 overflow-hidden cursor-pointer ${activeId === sector.id ? 'bg-novarc-blue text-white' : 'hover:bg-novarc-light'}`}
                onClick={() => setActiveId(sector.id)}
              >
                <div className="px-8 py-10 flex items-center justify-between">
                  <div className="flex items-center gap-10">
                    <span className={`text-[10px] font-bold ${activeId === sector.id ? 'text-novarc-accent' : 'opacity-30'}`}>{sector.id}</span>
                    <h3 className="text-3xl font-light tracking-wide">{sector.title}</h3>
                  </div>
                  <div className="text-xl font-light">
                    {activeId === sector.id ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M5 12h14" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </div>
                </div>
                {activeId === sector.id && (
                  <div className="px-8 pb-10 ml-20 max-w-xl">
                    <p className="text-sm text-white/60 leading-loose font-light">{sector.content}</p>
                    <button className="mt-8 text-novarc-accent uppercase text-[9px] tracking-widest font-bold border-b border-novarc-accent/30 pb-1">
                      View Sector Strategy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sectors;
