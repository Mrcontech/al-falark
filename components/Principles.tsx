
import React from 'react';

const PrincipleCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="bg-novarc-blue p-16 text-white flex flex-col h-full hover:bg-novarc-accent transition-all duration-700 cursor-default border-r border-white/5 last:border-r-0">
    <h3 className="text-3xl font-light mb-10 tracking-wide">{title}</h3>
    <div className="flex-1 flex items-center justify-center py-16 opacity-40 group-hover:opacity-100 transition-opacity">
      {icon}
    </div>
    <p className="text-[11px] text-white/50 leading-relaxed font-light mt-auto uppercase tracking-widest group-hover:text-white transition-colors">
      {desc}
    </p>
  </div>
);

const Principles: React.FC = () => {
  return (
    <section id="approach" className="bg-white py-32">
      <div className="px-8 max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-xl">
          <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">/ Core Values</span>
          <h2 className="text-5xl font-light text-novarc-dark leading-tight">Founded on Honor, Driven by Discovery</h2>
        </div>
        <p className="text-[12px] text-novarc-dark/40 max-w-sm text-right leading-loose">
          Our investment philosophy is an extension of our identity — balancing the preservation of capital with the bold pursuit of progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <PrincipleCard 
          title="Legacy"
          desc="Upholding the standard of excellence passed down through generations of visionary leadership."
          icon={
            <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-white fill-none stroke-[0.5]">
              <rect x="20" y="20" width="60" height="60" />
              <rect x="30" y="30" width="40" height="40" strokeDasharray="2 2" />
              <line x1="20" y1="20" x2="80" y2="80" />
              <line x1="80" y1="20" x2="20" y2="80" />
            </svg>
          }
        />
        <PrincipleCard 
          title="Prosperity"
          desc="Creating sustainable wealth that transcends borders and empowers global communities."
          icon={
            <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-white fill-none stroke-[0.5]">
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="10" />
              <path d="M50 15 V35 M50 65 V85 M15 50 H35 M65 50 H85" />
            </svg>
          }
        />
        <PrincipleCard 
          title="Stewardship"
          desc="Guarding the future of our planet through strategic investments in clean energy and ethics."
          icon={
            <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-white fill-none stroke-[0.5]">
              <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" />
              <circle cx="50" cy="50" r="15" />
            </svg>
          }
        />
      </div>
    </section>
  );
};

export default Principles;
