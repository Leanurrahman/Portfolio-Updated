/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Code, Server, Wrench, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { SkillCategory } from "../types";
import Marquee from "../components/Marquee";
import CosmicBackground from "../components/CosmicBackground";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

export default function Skills() {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">("All");

  const categories: { name: SkillCategory; label: string; icon: any }[] = [
    { name: "Frontend", label: "Frontend Dev", icon: Code },
    { name: "Backend", label: "Backend / API", icon: Server },
    { name: "Tools", label: "Workflow Tools", icon: Wrench },
    { name: "Programming", label: "Computer Science", icon: GraduationCap }
  ];

  // Grouping skills
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat.name] = skills.filter((s) => s.category === cat.name);
    return acc;
  }, {} as Record<SkillCategory, typeof skills>);

  // Infinite marquee items
  const marquee1 = ["React", "Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Node.js", "Express", "D3.js", "MongoDB", "SQL"];
  const marquee2 = ["Vite", "Framer Motion", "GSAP", "REST APIs", "PostgreSQL", "Git", "GitHub", "Vercel", "Linux", "UI Motion"];

  return (
    <section id="skills" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350 overflow-hidden">
      
      {/* Subtle continuous cosmic background */}
      <CosmicBackground intensity={0.40} variant="subtle" />
      
      {/* Background visual element */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      {/* 1. TOP MARQUEE ROW (Leftwards) */}
      <div className="mb-12 w-full">
        <Marquee items={marquee1} speed={25} reverse={false} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left column: Text Headers */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatedSectionHeading 
            number="04" 
            badge="Skills" 
            title="Technical arsenal" 
            subtitle="A comprehensive overview of my software skills, spanning modular frontend visual architectures, server APIs, cloud databases, and core computer science fundamentals."
            className="mb-0"
          />
        </div>

        {/* Right column: Filter selections */}
        <div className="lg:col-span-6 space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neon-purple font-black">
            Domain Focus Filters
          </h4>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-xl border text-[9px] font-mono uppercase tracking-widest cursor-pointer transition-all focus:outline-none relative ${
                activeCategory === "All"
                  ? "text-white font-black z-10"
                  : "bg-bg-secondary border-border-primary text-text-secondary hover:text-text-primary"
              }`}
            >
              Show All
              {activeCategory === "All" && (
                <motion.span
                  layoutId="skillsActiveTab"
                  className="absolute inset-0 bg-gradient-to-r from-brand-purple to-neon-purple rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl border text-[9px] font-mono uppercase tracking-widest cursor-pointer flex items-center gap-1.5 transition-all focus:outline-none relative ${
                    activeCategory === cat.name
                      ? "text-white font-black z-10"
                      : "bg-bg-secondary border-border-primary text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon size={12} />
                  <span>{cat.label}</span>
                  {activeCategory === cat.name && (
                    <motion.span
                      layoutId="skillsActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-brand-purple to-neon-purple rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 bg-bg-secondary border border-border-primary rounded-xl font-light text-xs text-text-secondary italic">
            💡 Selecting any domain filter isolates corresponding skill cards with active progress dials.
          </div>
        </div>

      </div>

      {/* Skills Categories Display Deck Grid */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {categories
          .filter((c) => activeCategory === "All" || activeCategory === c.name)
          .map((cat, idx) => {
            const Icon = cat.icon;
            const skillList = groupedSkills[cat.name] || [];

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                className="p-6 bg-bg-secondary border border-border-primary rounded-xl backdrop-blur-sm space-y-6 shadow-sm hover:border-neon-purple/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-border-primary">
                  <div className="p-2.5 bg-bg-primary rounded-xl text-neon-purple border border-border-primary">
                    <Icon size={14} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary">{cat.label}</h3>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4">
                  {skillList.map((skill) => (
                    <div key={skill.id} className="space-y-1.5 group">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-primary group-hover:text-neon-purple transition-colors font-semibold">
                          {skill.name}
                        </span>
                        {skill.proficiency && (
                          <span className="text-text-secondary font-mono text-[9px]">
                            {skill.proficiency}%
                          </span>
                        )}
                      </div>

                      {skill.proficiency ? (
                        <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border-primary">
                          <motion.div
                            className="h-full bg-gradient-to-r from-brand-purple to-neon-purple shadow-[0_0_8px_rgba(168,85,247,0.4)] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      ) : (
                        <div className="h-1.5 w-full bg-bg-primary rounded-full border border-border-primary opacity-50" />
                      )}
                    </div>
                  ))}

                  {skillList.length === 0 && (
                    <p className="text-text-secondary text-[10px] font-mono py-4">No skills registered.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* 2. BOTTOM MARQUEE ROW (Rightwards) */}
      <div className="mt-12 w-full">
        <Marquee items={marquee2} speed={25} reverse={true} />
      </div>

    </section>
  );
}
