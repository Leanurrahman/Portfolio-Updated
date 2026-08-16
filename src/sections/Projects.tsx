/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import ProjectCard from "../components/ProjectCard";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

export default function Projects() {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically extract categories from all existing projects
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filter projects by current category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350">
      
      {/* Very clean cosmic background to not distract from projects */}
      <CosmicBackground intensity={0.10} variant="projects" />
      
      {/* Background radial accent glowing */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading & Category Tabs Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          
          <AnimatedSectionHeading 
            number="03" 
            badge="Selected Creations" 
            title="Selected projects" 
            subtitle="Each project is a testament to rigorous design, precise layout spacing, and robust technical execution. Hover on standard cards to explore detailed case studies."
            className="mb-0 max-w-xl"
          />

          {/* Filtering Tabs - Sharp corner editorial blocks with orange active indicators */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-bg-secondary border border-border-primary rounded-xl self-start lg:self-end shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all cursor-pointer focus:outline-none relative ${
                  activeCategory === cat
                    ? "text-white font-black z-10"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="projectActiveTab"
                    className="absolute inset-0 bg-gradient-to-r from-brand-purple to-neon-purple rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SHOWCASES GRID (The projects list) */}
        <div className="space-y-10">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border-primary">
            <LayoutGrid size={16} className="text-neon-purple" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-primary font-black">
              Works & Case Studies
            </h3>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 border border-dashed border-border-primary rounded-xl bg-bg-secondary">
              <p className="text-text-secondary text-sm font-mono uppercase tracking-wider">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
