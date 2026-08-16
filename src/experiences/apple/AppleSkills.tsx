import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Code, Server, Wrench, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { SkillCategory } from "../../types";

export default function AppleSkills() {
  const { skills = [] } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">("All");

  const categories: { name: SkillCategory; label: string; icon: any }[] = [
    { name: "Frontend", label: "Frontend", icon: Code },
    { name: "Backend", label: "Backend", icon: Server },
    { name: "Tools", label: "Tools & DevOps", icon: Wrench },
    { name: "Programming", label: "Core Dev", icon: GraduationCap }
  ];

  // Grouping skills dynamically
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat.name] = skills.filter((s) => s.category === cat.name);
    return acc;
  }, {} as Record<SkillCategory, typeof skills>);

  // Horizontal infinite scroll strings
  const marquee1 = ["React", "Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Node.js", "Express", "D3.js", "MongoDB", "SQL"];
  const marquee2 = ["Vite", "Framer Motion", "GSAP", "REST APIs", "PostgreSQL", "Git", "GitHub", "Vercel", "Linux", "UI Motion"];

  return (
    <section id="skills" className="py-32 bg-transparent relative z-10 overflow-hidden">
      
      {/* 1. TOP MARQUEE ROW (Leftwards scroll) */}
      <div className="mb-14 overflow-hidden w-full relative">
        {/* Shadow masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />
        
        <div className="flex w-[200%] gap-4 animate-[marquee_25s_linear_infinite]">
          {[...marquee1, ...marquee1].map((item, idx) => (
            <span
              key={idx}
              className="px-6 py-3 bg-white/70 border border-slate-900/5 rounded-2xl shadow-sm backdrop-blur-md text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left column: Text Headers */}
        <div className="lg:col-span-6 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
            04 / TOOLING & STANDARDS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Technical mastery.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-lg font-normal">
            Covering professional engineering capabilities across layout design interfaces, backend architectures, databases, and general system deployment automation.
          </p>
        </div>

        {/* Right column: Filter selections */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-black block">
            Domain Segments
          </span>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all focus:outline-none border relative ${
                activeCategory === "All"
                  ? "text-white z-10 border-blue-600 shadow-md shadow-blue-500/10"
                  : "bg-white/60 border-slate-900/5 text-slate-500 hover:text-slate-900 hover:bg-white"
              }`}
            >
              All Skills
              {activeCategory === "All" && (
                <motion.span
                  layoutId="appleSkillsActiveTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none border relative ${
                    activeCategory === cat.name
                      ? "text-white z-10 border-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-white/60 border-slate-900/5 text-slate-500 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                  {activeCategory === cat.name && (
                    <motion.span
                      layoutId="appleSkillsActiveTab"
                      className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Skills Categories Display Deck Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {categories
          .filter((c) => activeCategory === "All" || activeCategory === c.name)
          .map((cat, idx) => {
            const Icon = cat.icon;
            const skillList = groupedSkills[cat.name] || [];

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 bg-white/60 border border-slate-900/10 rounded-3xl backdrop-blur-md space-y-6 text-left hover:border-blue-500/10 hover:shadow-xl hover:shadow-blue-500/[0.02] transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-900/5 flex items-center justify-center text-blue-500">
                    <Icon size={14} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">{cat.label}</h3>
                </div>

                {/* Skill items */}
                <div className="space-y-4">
                  {skillList.map((skill) => (
                    <div key={skill.id} className="space-y-1 group">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-medium">
                          {skill.name}
                        </span>
                        {skill.proficiency && (
                          <span className="text-slate-400 font-semibold text-[9px]">
                            {skill.proficiency}%
                          </span>
                        )}
                      </div>

                      {skill.proficiency ? (
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden border border-transparent">
                          <motion.div
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      ) : (
                        <div className="h-1 w-full bg-slate-100 rounded-full" />
                      )}
                    </div>
                  ))}

                  {skillList.length === 0 && (
                    <p className="text-slate-400 text-[10px] font-sans py-4">No skills registered.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* 2. BOTTOM MARQUEE ROW (Rightwards scroll) */}
      <div className="overflow-hidden w-full relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />
        
        <div className="flex w-[200%] gap-4 animate-[marquee_25s_linear_infinite_reverse]">
          {[...marquee2, ...marquee2].map((item, idx) => (
            <span
              key={idx}
              className="px-6 py-3 bg-white/70 border border-slate-900/5 rounded-2xl shadow-sm backdrop-blur-md text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Custom keyframe styled definitions for sliding marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </section>
  );
}
