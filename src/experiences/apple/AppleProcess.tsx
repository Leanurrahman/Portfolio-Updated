import React from "react";
import { motion } from "motion/react";
import { Search, PenTool, Terminal, Settings, Rocket, HelpCircle } from "lucide-react";

export default function AppleProcess() {
  const steps = [
    {
      phase: "01 / INITIATION",
      title: "Discover",
      desc: "Deep research, client sync calls, market study, and formulating high-fidelity engineering blueprints.",
      icon: <Search className="w-4 h-4 text-blue-500" />
    },
    {
      phase: "02 / ARCHITECTURE",
      title: "Design",
      desc: "Creating pixel-perfect layout schemes, custom wireframes, interactive motion maps, and component structure maps.",
      icon: <PenTool className="w-4 h-4 text-indigo-500" />
    },
    {
      phase: "03 / SYSTEM RUN",
      title: "Develop",
      desc: "Coding performant TypeScript, integrating responsive client React systems, and setting secure backends.",
      icon: <Terminal className="w-4 h-4 text-cyan-500" />
    },
    {
      phase: "04 / CALIBRATION",
      title: "Optimize",
      desc: "Core Web Vitals fine-tuning, static file caching, pre-fetching, bundle-size minimization, and lighthouse auditing.",
      icon: <Settings className="w-4 h-4 text-teal-500" />
    },
    {
      phase: "05 / INGRESS GO",
      title: "Launch",
      desc: "Continuous integration automation, DNS configurations, database seeding, and production container deployment.",
      icon: <Rocket className="w-4 h-4 text-emerald-500" />
    },
    {
      phase: "06 / CONTINUITY",
      title: "Support",
      desc: "Continuous telemetry tracking, proactive updates, security patching, and ongoing performance improvements.",
      icon: <HelpCircle className="w-4 h-4 text-rose-500" />
    }
  ];

  return (
    <section id="process" className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-24 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
            05 / METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The engineering process.
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-4 max-w-2xl font-normal">
            A meticulous step-by-step product workflow optimized for high fidelity, structural scalability, and flawless user experiences.
          </p>
        </div>

        {/* Product Roadmap Timeline Layout */}
        <div className="relative mt-12 pl-6 sm:pl-0">
          
          {/* Thin blue vertical center progress line for desktop / left for mobile */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 w-[1.5px] bg-blue-100/70 -translate-x-1/2 z-0" />
          
          <div className="space-y-16 relative z-10">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row items-start sm:items-center w-full z-10 ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* Left Side Content (Desktop) / Full content (Mobile) */}
                  <div className="w-full sm:w-1/2 flex justify-start sm:justify-center px-0 sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full max-w-[420px] bg-white/60 hover:bg-white/90 border border-slate-900/10 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-blue-500/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <span className="text-[9px] font-mono font-black text-blue-500 tracking-widest uppercase">
                          {step.phase}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-900/5 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* Bullet center Node */}
                  <div className="absolute left-4 sm:left-1/2 w-3.5 h-3.5 bg-blue-600 border-[3px] border-white rounded-full -translate-x-1/2 shadow-md shadow-blue-500/30 z-20" />

                  {/* Empty Spacer column for desktop symmetry */}
                  <div className="hidden sm:block w-1/2" />

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
