
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Vision', href: '#about' },
    { name: 'Divisions', href: '#sectors' },
    { name: 'Legacy', href: '#approach' },
    { name: 'Global Assets', href: '#portfolio' },
    { name: 'Allocation', href: '#pricing' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 lg:px-12 flex items-center justify-between ${
          isScrolled 
            ? 'bg-novarc-dark/90 backdrop-blur-xl border-b border-white/5 py-3' 
            : 'bg-transparent py-6 lg:py-8'
        }`}
      >
        <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <svg viewBox="0 0 100 100" className={`w-7 h-7 lg:w-9 lg:h-9 transition-colors duration-500 fill-novarc-accent`}>
            <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" />
          </svg>
          <span className="text-base lg:text-xl font-bold tracking-[0.2em] lg:tracking-[0.3em] text-white">
            AL-FALAK
          </span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-14 text-[10px] uppercase tracking-[0.4em] font-medium">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-white/70 hover:text-novarc-accent transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-novarc-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={onLogin}
            className="hidden sm:block text-white/70 hover:text-white text-[10px] uppercase tracking-widest font-medium"
          >
            Terminal Login
          </button>
          <button 
            onClick={onSignup}
            className={`hidden sm:flex bg-novarc-accent text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-sm items-center gap-3 text-[9px] lg:text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95`}
          >
            Private Inquiry
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`w-full h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
              <span className={`w-full h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[55] bg-novarc-dark transition-all duration-700 lg:hidden flex flex-col items-center justify-center gap-10 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        {navLinks.map((link) => (
          <a 
            key={link.name}
            href={link.href} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-2xl font-light tracking-[0.2em] hover:text-novarc-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
        <button 
          onClick={() => { setIsMobileMenuOpen(false); onLogin?.(); }}
          className="text-white/70 text-lg tracking-[0.2em]"
        >
          Terminal Login
        </button>
        <button 
          onClick={() => { setIsMobileMenuOpen(false); onSignup?.(); }}
          className="mt-6 bg-novarc-accent text-white px-10 py-4 rounded-sm flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          Private Inquiry
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
    </>
  );
};

export default Navbar;
