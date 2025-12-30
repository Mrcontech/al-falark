
import React from 'react';

const ProjectCard: React.FC<{ 
  title: string; 
  img: string; 
  assetType: string; 
  location: string; 
  division: string; 
}> = ({ title, img, assetType, location, division }) => (
  <div className="group cursor-pointer">
    <div className="aspect-[16/10] relative overflow-hidden rounded-sm mb-10 shadow-2xl">
      <img src={img} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]" />
      <div className="absolute inset-0 bg-novarc-dark/20 group-hover:bg-transparent transition-colors"></div>
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-white p-3 rounded-sm border border-white/20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8l4 4-4 4M8 12h8" />
        </svg>
      </div>
    </div>
    <h3 className="text-3xl font-light mb-14 group-hover:text-novarc-accent transition-colors leading-snug">{title}</h3>
    <div className="grid grid-cols-2 gap-y-6 border-t border-novarc-light pt-8 text-[11px] uppercase tracking-[0.2em] font-medium">
      <div className="text-novarc-dark/30">Asset Class</div>
      <div className="text-right text-novarc-dark/70">{assetType}</div>
      <div className="text-novarc-dark/30">Primary Hub</div>
      <div className="text-right text-novarc-dark/70">{location}</div>
      <div className="text-novarc-dark/30">Strategic Division</div>
      <div className="text-right text-novarc-dark/70 text-novarc-accent">{division}</div>
    </div>
  </div>
);

const ProjectsSection: React.FC = () => {
  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="px-8 max-w-7xl mx-auto mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
        <div>
          <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-6">/ Global Portfolio</span>
          <h2 className="text-5xl font-light text-novarc-dark">Icons of the Future</h2>
        </div>
        <button className="bg-novarc-blue text-white px-12 py-4 rounded-sm flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] hover:bg-novarc-accent transition-all duration-300 shadow-xl">
          Asset Directory
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-7xl mx-auto px-8">
        <ProjectCard 
          title="The Al-Nour Global Hydrogen Corridor"
          img="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200"
          assetType="Critical Infrastructure"
          location="Abu Dhabi / Global"
          division="Energy Transition"
        />
        <ProjectCard 
          title="Meridian District: A Living Laboratory for AI Cities"
          img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200"
          assetType="Urban Technology Hub"
          location="Dubai Creek"
          division="Frontier Tech"
        />
      </div>
    </section>
  );
};

export default ProjectsSection;
