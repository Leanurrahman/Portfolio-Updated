import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Code, Server, Wrench, GraduationCap, Flame, Target } from "lucide-react";
import { motion } from "motion/react";
import { SkillCategory } from "../../types";

export default function NeonGamingSkills() {
  const { skills = [] } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">("All");

  const categories: { name: SkillCategory; label: string; icon: any; color: string }[] = [
    { name: "Frontend", label: "Frontend Engines", icon: Code, color: "#1CD8D2" },
    { name: "Backend", label: "Backend Core", icon: Server, color: "#00BF8F" },
    { name: "Tools", label: "DevOps & Systems", icon: Wrench, color: "#a855f7" },
    { name: "Programming", label: "Languages", icon: GraduationCap, color: "#eab308" }
  ];

  // Grouping skills dynamically
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat.name] = skills.filter((s) => s.category === cat.name);
    return acc;
  }, {} as Record<SkillCategory, typeof skills>);

  // Helper to resolve gaming tiers
  const getGamingTier = (prof: number | undefined) => {
    if (!prof) return "[S_TIER]";
    if (prof >= 90) return "[S_TIER]";
    if (prof >= 80) return "[A_TIER]";
    if (prof >= 70) return "[B_TIER]";
    return "[C_TIER]";
  };

  const getTierColor = (prof: number | undefined) => {
    if (!prof) return "text-[#1CD8D2]";
    if (prof >= 90) return "text-red-400 drop-shadow-[0_0_4px_rgba(239,110,110,0.4)]";
    if (prof >= 80) return "text-[#1CD8D2]";
    if (prof >= 70) return "text-[#00BF8F]";
    return "text-gray-400";
  };

  const skillNames = skills.map((s) => s.name).filter(Boolean);
  const defaultMarquee1 = ["React", "TypeScript", "Firebase", "Next.js", "Tailwind CSS", "Node.js", "Express", "D3.js", "Vite", "WebSockets"];
  const defaultMarquee2 = ["PostgreSQL", "MongoDB", "Cloud SQL", "Firestore", "Git", "GitHub Actions", "Docker", "Framer Motion", "GSAP", "REST APIs"];

  const marquee1 = skillNames.length >= 4
    ? skillNames.slice(0, Math.ceil(skillNames.length / 2))
    : defaultMarquee1;
  const marquee2 = skillNames.length >= 4
    ? skillNames.slice(Math.ceil(skillNames.length / 2))
    : defaultMarquee2;

  return (
    <section id="skills" className="py-24 bg-transparent relative z-10 overflow-hidden text-left text-white">
      
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#1CD8D2]/3 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#a855f7]/3 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* 1. TOP MARQUEE ROW (Leftwards scroll) - Interactive Pause */}
      <div className="mb-12 overflow-hidden w-full relative select-none group/marquee">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020204] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020204] to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-[200%] gap-4 animate-[neonMarquee_75s_linear_infinite] group-hover/marquee:[animation-play-state:paused] cursor-pointer">
          {[...marquee1, ...marquee1].map((item, idx) => (
            <span
              key={idx}
              className="px-6 py-3 bg-white/[0.02] border border-white/10 hover:border-[#1CD8D2]/40 rounded-2xl shadow-sm backdrop-blur-md text-xs font-mono font-bold text-[#1CD8D2] uppercase tracking-widest whitespace-nowrap transition-colors hover:bg-[#1CD8D2]/5"
              style={{ boxShadow: "0 0 12px rgba(28, 216, 210, 0.03)" }}
            >
              🚀 {item}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        
        {/* Left Column: Heading */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1CD8D2] shadow-[0_0_8px_#1CD8D2]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#1CD8D2] uppercase font-black">
              [04] ABILITIES_INDEX
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            ENGINEERING ARMORY.
          </h2>
          <p className="text-white/55 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
            A granular catalog of programming languages, state systems, real-time channels, and layout libraries mapped out as playable skill slots.
          </p>
        </div>

        {/* Right Column: Interactive Filter Selects */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-black block">
            SELECT_SKILL_CATEGORY:
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest cursor-pointer transition-all focus:outline-none border relative ${
                activeCategory === "All"
                  ? "text-black border-[#1CD8D2] shadow-[0_0_15px_rgba(28,216,210,0.3)] bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F]"
                  : "bg-white/[0.02] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              ALL_DOMAINS.sys
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none border ${
                    isSelected
                      ? "text-black border-[#1CD8D2] shadow-[0_0_15px_rgba(28,216,210,0.3)] bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F]"
                      : "bg-white/[0.02] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon size={12} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Skills Categories Display Deck Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {categories
          .filter((c) => activeCategory === "All" || activeCategory === c.name)
          .map((cat, idx) => {
            const Icon = cat.icon;
            const skillList = groupedSkills[cat.name] || [];

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md space-y-5 hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Radial glow background on card hover */}
                <div 
                  className="absolute -inset-20 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" 
                  style={{
                    background: `radial-gradient(circle at center, ${cat.color}08 0%, transparent 60%)`
                  }}
                />

                {/* Card Header */}
                <div className="flex items-center gap-3 pb-3.5 border-b border-white/[0.06]">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white border"
                    style={{
                      borderColor: `${cat.color}30`,
                      backgroundColor: `${cat.color}10`,
                      textShadow: `0 0 10px ${cat.color}`
                    }}
                  >
                    <Icon size={13} />
                  </div>
                  <h3 className="text-[10px] font-mono font-black uppercase tracking-wider text-white/90">{cat.label}</h3>
                </div>

                {/* Skill Lists */}
                <div className="space-y-4">
                  {skillList.map((skill) => (
                    <div key={skill.id} className="space-y-1.5 group/item">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/80 group-hover/item:text-[#1CD8D2] transition-colors font-medium">
                          {skill.name}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Gaming Tier Label */}
                          <span className={`font-mono text-[8px] font-black tracking-tighter ${getTierColor(skill.proficiency)}`}>
                            {getGamingTier(skill.proficiency)}
                          </span>
                          {skill.proficiency && (
                            <span className="text-white/30 font-mono font-bold text-[8px]">
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>
                      </div>

                      {skill.proficiency ? (
                        <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden p-[1px] border border-white/5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${cat.color}bb, ${cat.color})`,
                              boxShadow: `0 0 6px ${cat.color}80`
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                      ) : (
                        <div className="h-1.5 w-full bg-white/[0.03] rounded-full" />
                      )}
                    </div>
                  ))}

                  {skillList.length === 0 && (
                    <p className="text-white/30 text-[9px] font-mono py-4 uppercase">NO SLOTS ALLOCATED.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* 2. BOTTOM MARQUEE ROW (Rightwards scroll) - Interactive Pause */}
      <div className="overflow-hidden w-full relative select-none group/marquee2">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020204] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020204] to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-[200%] gap-4 animate-[neonMarquee_75s_linear_infinite_reverse] group-hover/marquee2:[animation-play-state:paused] cursor-pointer">
          {[...marquee2, ...marquee2].map((item, idx) => (
            <span
              key={idx}
              className="px-6 py-3 bg-white/[0.02] border border-white/10 hover:border-[#00BF8F]/40 rounded-2xl shadow-sm backdrop-blur-md text-xs font-mono font-bold text-[#00BF8F] uppercase tracking-widest whitespace-nowrap transition-colors hover:bg-[#00BF8F]/5"
              style={{ boxShadow: "0 0 12px rgba(0, 191, 143, 0.03)" }}
            >
              ⚙️ {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes neonMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </section>
  );
}
