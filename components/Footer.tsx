
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-novarc-dark text-white pt-32 pb-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
        <div className="lg:col-span-5">
          <div className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.3em] max-w-xs">
            <span className="text-novarc-accent font-bold block mb-4">المقر الملكي — Sovereign Headquarters</span>
            Al-Falak Tower, Level 102<br />
            Global Market Square, Al Maryah Island<br />
            Abu Dhabi, United Arab Emirates
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-novarc-accent font-bold mb-10">The Office</div>
          <ul className="text-[11px] space-y-4 uppercase tracking-widest font-light">
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Our Vision</a></li>
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Investment Mandate</a></li>
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Global Presence</a></li>
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Strategic Assets</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-novarc-accent font-bold mb-10">Governance</div>
          <ul className="text-[11px] space-y-4 uppercase tracking-widest font-light">
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Royal Decree</a></li>
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Ethics & Sharia</a></li>
            <li><a href="#" className="hover:text-novarc-accent transition-colors">Transparency</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-10">
          <div className="text-[10px] uppercase tracking-[0.4em] text-novarc-accent font-bold mb-10">Relations</div>
          <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-wider mb-4">
            For diplomatic or institutional inquiries, please contact our Secretariat office directly.
          </p>
          <a href="mailto:Aifalakroyalemirates@gmail.com" className="text-novarc-accent text-[11px] font-bold tracking-wide hover:underline">Aifalakroyalemirates@gmail.com</a>
          <div className="flex gap-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all mt-6">
            <a href="#" className="text-xs uppercase tracking-widest">LinkedIn</a>
            <a href="#" className="text-xs uppercase tracking-widest">Bloomberg</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between pt-16 border-t border-white/5">
        <div className="flex items-center gap-6 mb-12 lg:mb-0">
          <svg viewBox="0 0 100 100" className="w-14 h-14 fill-novarc-accent">
            <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" />
          </svg>
          <span className="text-3xl font-bold tracking-[0.4em]">الفلك — AL-FALAK</span>
        </div>

        <div className="flex flex-wrap justify-center gap-12 text-[9px] uppercase tracking-[0.4em] opacity-30">
          <span>© 2025 AL-FALAK CAPITAL. ROYAL INVESTMENT OFFICE.</span>
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Decree</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Asset Terms</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Cyber Shield</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
