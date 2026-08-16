import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import AppleProjectCard from "./AppleProjectCard";
import { motion } from "motion/react";

export default function AppleProjects() {
  const { projects = [] } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeTab === "All"
    ? projects
    : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl text-left">
            <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
              03 / FEATURED WORK
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Selected projects.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-3 max-w-lg font-normal">
              A curated selection of robust full stack platforms, developer tooling modules, and interactive user interfaces.
            </p>
          </div>

          {/* Minimalist Pill Selector for Categories */}
          <div className="flex flex-wrap gap-2 self-start md:self-end">
            {categories.map((category) => {
              const isActive = activeTab === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none cursor-pointer border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/15"
                      : "bg-white/60 text-slate-500 border-slate-900/5 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <AppleProjectCard project={project} index={idx} />
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/40 border border-slate-900/5 rounded-3xl backdrop-blur-md">
              <p className="text-slate-400 font-medium text-sm">No projects published under this category yet.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
