
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background Image: High-end UAE architectural landscape or desert sunset */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
          alt="Dubai Skyline"
          className="w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-novarc-dark via-transparent to-transparent opacity-90"></div>
      </div>

      <div className="relative z-10 w-full px-6 lg:px-8 pb-12 lg:pb-16 pt-32 lg:pt-40 max-w-7xl mx-auto flex flex-col justify-end">
        <div className="mb-6 lg:mb-8">
          <span className="text-novarc-accent text-[11px] lg:text-[12px] uppercase tracking-[0.5em] font-bold">المكتب الملكي — The Royal Office</span>
        </div>
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-10 lg:mb-14 tracking-tight">
          إرث من رأس المال <br />
          <span className="italic font-serif text-novarc-accent">الرؤيوي</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          <div className="lg:col-span-4 text-white/70 text-sm leading-relaxed border-l border-novarc-accent/50 pl-5 lg:pl-6">
            Guided by the strategic wisdom of the UAE Royal Family, Al-Falak Capital deploys sovereign wealth into transformative global ventures that define the 22nd century.
            <button className="mt-6 lg:mt-8 flex items-center gap-3 text-novarc-accent uppercase text-[10px] tracking-[0.3em] font-bold hover:translate-x-2 transition-transform">
              Explore Our Mandate
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </div>

          <div className="lg:col-span-5 hidden md:block">
            <div className="glass-card p-6 lg:p-8 rounded-sm flex gap-5 lg:gap-6 text-white border-l-4 border-l-novarc-accent">
              <div className="w-1/3 bg-novarc-accent h-24 lg:h-28 overflow-hidden rounded-sm flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=400"
                  alt="Future City"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-bold mb-2 tracking-wide text-novarc-accent uppercase">انتشار عالمي، روح سيادية</h3>
                <p className="text-[11px] text-white/60 leading-relaxed">Global Reach, Sovereign Spirit — Pioneering investments in sustainable cities, AI-driven infrastructure, and space exploration.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end text-white gap-6">
            <div className="text-left lg:text-right">
              <div className="text-3xl lg:text-4xl font-light text-novarc-accent tracking-tighter">$850B+</div>
              <div className="text-[9px] uppercase tracking-[0.3em] opacity-60 mt-1">Assets Under Stewardship</div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-novarc-dark bg-novarc-blue overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=royal${i}`} className="w-full h-full object-cover brightness-90 grayscale" alt="Advisor" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
