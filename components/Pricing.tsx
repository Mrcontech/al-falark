
import React from 'react';

const PricingCard: React.FC<{ 
  tier: string; 
  price: string; 
  description: string; 
  features: string[]; 
  isFeatured?: boolean;
}> = ({ tier, price, description, features, isFeatured }) => (
  <div className={`p-10 border transition-all duration-500 flex flex-col h-full ${
    isFeatured 
      ? 'bg-novarc-blue border-novarc-accent scale-105 z-10 shadow-2xl shadow-novarc-accent/20' 
      : 'bg-white border-novarc-light hover:border-novarc-accent/50'
  }`}>
    <div className="mb-10">
      <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isFeatured ? 'text-novarc-accent' : 'text-novarc-dark/40'}`}>
        {tier} Mandate
      </span>
      <h3 className={`text-4xl font-light mt-4 ${isFeatured ? 'text-white' : 'text-novarc-dark'}`}>{price}</h3>
      <p className={`text-[11px] mt-4 leading-relaxed ${isFeatured ? 'text-white/60' : 'text-novarc-dark/50'}`}>
        {description}
      </p>
    </div>
    
    <div className="flex-1 space-y-6 mb-12">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isFeatured ? "#C5A059" : "#0A0C14"} strokeWidth="2" className="flex-shrink-0">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span className={`text-[11px] uppercase tracking-widest font-medium ${isFeatured ? 'text-white/80' : 'text-novarc-dark/70'}`}>
            {feature}
          </span>
        </div>
      ))}
    </div>

    <button className={`w-full py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${
      isFeatured 
        ? 'bg-novarc-accent text-white hover:brightness-110' 
        : 'bg-novarc-dark text-white hover:bg-novarc-accent'
    }`}>
      Request Allocation
    </button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-40 bg-white">
      <div className="px-8 max-w-7xl mx-auto mb-20 text-center">
        <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">/ Capital Entry</span>
        <h2 className="text-5xl font-light text-novarc-dark tracking-tight">Investment Tiers</h2>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-0">
        <PricingCard 
          tier="Sovereign"
          price="$10M+"
          description="Direct access to core sovereign-linked infrastructure and global real estate funds."
          features={[
            "Infrastructure Access",
            "Quarterly Reporting",
            "UAE Visa Sponsorship",
            "Concierge Support"
          ]}
        />
        <PricingCard 
          tier="Legacy"
          price="$50M+"
          isFeatured={true}
          description="Comprehensive wealth management including private equity and frontier technology ventures."
          features={[
            "All Sovereign Benefits",
            "Direct PE Allocations",
            "Monthly Strategy Reviews",
            "Family Office Integration",
            "VIP Event Access"
          ]}
        />
        <PricingCard 
          tier="Royal"
          price="Bespeke"
          description="Exclusive mandate for multi-generational legacy preservation and deep-tech lunar infrastructure."
          features={[
            "All Legacy Benefits",
            "Custom Mandate Strategy",
            "Board Observer Rights",
            "Orbital Asset Access",
            "Dedicated Secretariat"
          ]}
        />
      </div>
    </section>
  );
};

export default Pricing;
