import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, Eye, ArrowUpRight, Award, Compass } from "lucide-react";
import NeonGamingProjectShowcase from "./NeonGamingProjectShowcase";
import { Project } from "../../types";

export default function NeonGamingProjects() {
  const { projects = [] } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeTab === "All"
    ? projects
    : projects.filter((p) => p.category === activeTab);

  // Set the first project as active when tab changes
  useEffect(() => {
    if (filteredProjects.length > 0) {
      setActiveProject(filteredProjects[0]);
    } else {
      setActiveProject(null);
    }
  }, [activeTab, projects]);

  return (
    <section id="projects" className="py-24 bg-transparent relative z-10 overflow-hidden text-left text-white">
      
      {/* Background radial glows */}
      <div className="absolute top-1/3 left-1/10 w-[40vw] h-[40vw] bg-[#1CD8D2]/3 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/10 w-[40vw] h-[40vw] bg-[#00BF8F]/3 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1CD8D2] shadow-[0_0_8px_#1CD8D2]" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#1CD8D2] uppercase font-black">
                [05] COMPLETED_MISSIONS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              SELECTED QUESTS.
            </h2>
            <p className="text-white/55 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              A curated ledger of full stack deployments, automated schemas, smart-logic widgets, and pixel-perfect design patterns.
            </p>
          </div>

          {/* Tab Selector System */}
          <div className="flex flex-wrap gap-2 self-start md:self-end">
            {categories.map((category) => {
              const isActive = activeTab === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest transition-all duration-250 focus:outline-none cursor-pointer border ${
                    isActive
                      ? "bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] text-black border-[#1CD8D2] shadow-[0_0_15px_rgba(28,216,210,0.3)]"
                      : "bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {category}.sys
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. DESKTOP STICKY DOUBLE-PANE SHOWCASE */}
        <div className="hidden lg:grid grid-cols-12 gap-10 items-start relative min-h-[580px]">
          
          {/* STICKY LEFT PANEL: Active project display cabinet */}
          <div className="col-span-5 sticky top-28 space-y-6">
            <AnimatePresence mode="wait">
              {activeProject ? (
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 bg-white/[0.02] border border-white/10 rounded-[28px] backdrop-blur-xl shadow-2xl relative space-y-5"
                >
                  {/* Backdrop glowing aura synced to project item */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#1CD8D2]/4 via-[#00BF8F]/4 to-transparent rounded-[30px] blur-xl -z-10 animate-pulse" />

                  {/* Glass Frame Screenshot */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#040406] border border-white/10 shadow-inner group/scr">
                    <img
                      src={activeProject.thumbnail}
                      alt={activeProject.title}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover/scr:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Level / Tier Tag */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[8px] font-mono font-black tracking-widest bg-black/80 text-[#1CD8D2] border border-[#1CD8D2]/30 rounded-md shadow-md">
                      MISSION_SUCCESS
                    </span>

                    {/* View overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/scr:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setSelectedProjectForModal(activeProject)}
                        className="px-4 py-2.5 bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] hover:brightness-110 text-black font-black text-[9px] tracking-widest font-mono rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#1CD8D2]/20 transition-transform group-hover/scr:translate-y-0 translate-y-3 duration-300"
                      >
                        <Eye size={12} className="stroke-[3]" />
                        <span>TACTICAL_BRIEF</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 font-bold">
                      <Award size={12} className="text-[#00BF8F]" />
                      <span className="uppercase text-[#00BF8F]">MISSION_RECORD</span>
                      <span>•</span>
                      <span>{activeProject.year}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-white tracking-wider">
                      {activeProject.title}
                    </h3>
                    <p className="text-white/65 text-xs leading-relaxed line-clamp-3 font-normal">
                      {activeProject.shortDescription}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProject.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-[8px] font-mono font-bold text-white/60 bg-white/[0.03] border border-white/5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {activeProject.techStack.length > 4 && (
                      <span className="px-2 py-1 text-[8px] font-mono font-bold text-white/30 bg-white/[0.03] border border-white/5 rounded">
                        +{activeProject.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Interactive Footer buttons */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProjectForModal(activeProject)}
                      className="text-[10px] font-mono font-black text-[#1CD8D2] tracking-widest uppercase flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
                    >
                      <span>ANALYZE_METRICS_LOG &gt;</span>
                    </button>
                    
                    <div className="flex gap-2">
                      {activeProject.githubLink && (
                        <a
                          href={activeProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 rounded-xl text-white/60 hover:text-white transition-all cursor-pointer"
                        >
                          <Github size={13} />
                        </a>
                      )}
                      {activeProject.liveLink && (
                        <a
                          href={activeProject.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/[0.02] hover:bg-[#1CD8D2]/25 border border-white/10 hover:border-[#1CD8D2]/50 rounded-xl text-white/60 hover:text-[#1CD8D2] transition-all cursor-pointer"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-md">
                  <p className="text-white/30 font-mono text-xs uppercase tracking-widest animate-pulse">CONNECTING INTEL DECK...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* SCROLLABLE RIGHT PANEL: Branching quest timeline */}
          <div className="col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-3 custom-scrollbar relative pl-7 select-none">
            
            {/* Timeline thread line connecting waypoints */}
            <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#1CD8D2]/30 via-white/5 to-transparent pointer-events-none" />

            {filteredProjects.map((project) => {
              const isActive = activeProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setActiveProject(project)}
                  onClick={() => setSelectedProjectForModal(project)}
                  className={`p-4.5 rounded-2xl border transition-all duration-350 cursor-pointer text-left flex items-center justify-between gap-5 relative group project-card-trigger ${
                    isActive
                      ? "bg-white/[0.04] border-[#1CD8D2]/40 shadow-[0_0_20px_rgba(28,216,210,0.06)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.025]"
                  }`}
                >
                  {/* Glowing vertical node anchor indicator on timeline thread */}
                  <div className="absolute left-[-23px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/10 bg-[#020204] z-10 flex items-center justify-center transition-all group-hover:border-[#1CD8D2]/60">
                    <div 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive 
                          ? "bg-[#1CD8D2] scale-110 shadow-[0_0_10px_#1CD8D2]" 
                          : "bg-white/10 group-hover:bg-[#1CD8D2]/40"
                      }`} 
                    />
                  </div>

                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-white/40 font-bold">{project.year}</span>
                      <span className="text-white/20">•</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-white/[0.04] border border-white/5 text-white/50 uppercase tracking-widest">
                        {project.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-[#1CD8D2] transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-white/50 text-[11px] font-normal line-clamp-1 max-w-sm">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-black border border-white/10 transition-transform group-hover:scale-102">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="py-20 text-center bg-white/[0.01] border border-white/5 rounded-[24px]">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">NO QUESTS SECURED IN REGISTRY.</p>
              </div>
            )}
          </div>

        </div>

        {/* 2. MOBILE FALLBACK BENTO GRID */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl relative backdrop-blur-md flex flex-col justify-between h-full project-card-trigger"
              onClick={() => setSelectedProjectForModal(project)}
            >
              <div className="space-y-4">
                {/* Thumbnail snapshot */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[8px] font-mono font-black tracking-widest bg-black/80 text-[#1CD8D2] border border-white/10 rounded-md">
                    {project.category}
                  </span>
                </div>

                {/* Info details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40 font-bold">
                    <span>LAUNCH_LOG</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    {project.title}
                  </h4>
                  <p className="text-white/65 text-xs leading-relaxed line-clamp-2 font-normal">
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              {/* Tags & Action log */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[9px] font-mono font-black text-[#1CD8D2] tracking-widest uppercase flex items-center gap-1">
                  LAUNCH_PROJECT &gt;
                </span>
                
                <div className="flex gap-1.5">
                  {project.githubLink && (
                    <span className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-white/40">
                      <Github size={12} />
                    </span>
                  )}
                  {project.liveLink && (
                    <span className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-[#1CD8D2]">
                      <ExternalLink size={12} />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">NO ARCHIVED WORK FOUND.</p>
            </div>
          )}
        </div>

      </div>

      {/* Detail Showcase Modal Overlay */}
      {selectedProjectForModal && (
        <NeonGamingProjectShowcase
          project={selectedProjectForModal}
          isOpen={selectedProjectForModal !== null}
          onClose={() => setSelectedProjectForModal(null)}
        />
      )}

      <style>{`
        /* Custom scrollbar for desktop deck */
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(28, 216, 210, 0.35);
        }
      `}</style>
    </section>
  );
}
