
import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <section id="about" className="py-40 px-8 bg-white text-center max-w-5xl mx-auto border-x border-novarc-light">
      <div className="mb-14">
        <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em]">/ The Mandate</span>
      </div>
      <h2 className="text-4xl md:text-6xl font-light text-novarc-dark leading-[1.2] tracking-tight">
        Al-Falak serves as the <span className="text-novarc-accent italic font-serif">sovereign gateway</span> for innovation, bridging our rich <span className="font-bold">Emirati heritage</span> with a boundless global future.
      </h2>
      <p className="mt-12 text-novarc-dark/50 text-sm max-w-2xl mx-auto leading-loose">
        From the dunes of the Arabian Peninsula to the financial hubs of the West and the rising markets of the East, we invest with a centuries-long perspective.
      </p>
      <button className="mt-16 bg-novarc-dark text-white px-12 py-4 rounded-sm flex items-center gap-4 mx-auto text-[10px] uppercase tracking-[0.3em] hover:bg-novarc-accent transition-all duration-500 shadow-2xl">
        Our Vision 2050
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </button>
    </section>
  );
};

export default IntroSection;
