import React from "react";
import { motion } from "motion/react";
import { Search, PenTool, Terminal, CheckCircle2, Rocket, HeartHandshake } from "lucide-react";

export default function NeonGamingProcess() {
  const steps = [
    {
      phase: "PHASE_01",
      title: "Discover",
      desc: "Deep research, sync conversations, target analysis, and building tactical product blueprints.",
      icon: <Search className="w-4 h-4 text-[#1CD8D2]" />,
      color: "border-[#1CD8D2]/30 text-[#1CD8D2] hover:shadow-[0_0_15px_rgba(28,216,210,0.15)]"
    },
    {
      phase: "PHASE_02",
      title: "Design",
      desc: "Architecting pixel-perfect layout wireframes, custom bento structures, and animated motion schemes.",
      icon: <PenTool className="w-4 h-4 text-purple-400" />,
      color: "border-purple-500/30 text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
    },
    {
      phase: "PHASE_03",
      title: "Develop",
      desc: "Coding pristine TypeScript, integrating dynamic React components, and initializing secure backends.",
      icon: <Terminal className="w-4 h-4 text-[#00BF8F]" />,
      color: "border-[#00BF8F]/30 text-[#00BF8F] hover:shadow-[0_0_15px_rgba(0,191,143,0.15)]"
    },
    {
      phase: "PHASE_04",
      title: "Test",
      desc: "Running thorough unit testing, core layout reviews, lighthouse evaluations, and bundle optimizations.",
      icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
      color: "border-blue-500/30 text-blue-400 hover:shadow-[0_0_15px_rgba(96,165,250,0.15)]"
    },
    {
      phase: "PHASE_05",
      title: "Launch",
      desc: "Automating cloud container deployments, configuring DNS mapping, and verifying global operations.",
      icon: <Rocket className="w-4 h-4 text-[#1CD8D2]" />,
      color: "border-[#1CD8D2]/30 text-[#1CD8D2] hover:shadow-[0_0_15px_rgba(28,216,210,0.15)]"
    },
    {
      phase: "PHASE_06",
      title: "Support",
      desc: "Proactive performance tracking, telemetry monitoring, security patches, and structural maintenance.",
      icon: <HeartHandshake className="w-4 h-4 text-yellow-400" />,
      color: "border-yellow-500/30 text-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]"
    }
  ];

  return (
    <section id="process" className="py-32 bg-transparent relative z-10 overflow-hidden text-left text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1CD8D2] shadow-[0_0_8px_#1CD8D2]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#1CD8D2] uppercase font-black">
              [06] PRODUCT_PIPELINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            DEVELOPMENT PROCESS.
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-4 max-w-xl font-normal">
            A chronological step-by-step product walkthrough optimized for high precision, clean layouts, and secure deployment.
          </p>
        </div>

        {/* Timeline Grid layout */}
        <div className="relative mt-12 pl-6 sm:pl-0">
          
          {/* Cyber rail center line */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 w-[1.5px] bg-white/[0.06] -translate-x-1/2 z-0" />
          
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
                  
                  {/* Left panel */}
                  <div className="w-full sm:w-1/2 flex justify-start sm:justify-center px-0 sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 25 : -25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`w-full max-w-[420px] bg-white/[0.02] hover:bg-white/[0.04] border ${step.color} rounded-3xl p-6 text-left transition-all duration-300 relative`}
                    >
                      {/* Scanline indicator line */}
                      <div className="absolute top-3 right-3 text-[8px] font-mono text-white/20">{step.phase}</div>

                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06] mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          {step.icon}
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-white/70 text-xs leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* Node Connector dot */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-black border-2 border-[#1CD8D2] rounded-full -translate-x-1/2 shadow-[0_0_8px_#1CD8D2] z-20" />

                  {/* Spacer column */}
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
