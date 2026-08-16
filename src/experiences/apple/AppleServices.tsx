import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion } from "motion/react";
import { Layout, Server, Gauge, Smartphone, Monitor, Code } from "lucide-react";

export default function AppleServices() {
  const { services = [] } = usePortfolio();

  // Dynamic fallback service list if Firebase contains none
  const fallbackServices = [
    {
      title: "Frontend Engineering",
      description: "Implementing fluid, interactive, and responsive user interfaces with modern React, Next.js, and Tailwind CSS.",
      icon: <Layout className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Backend Architecture",
      description: "Building powerful rest APIs, structured database routing, real-time sync systems and microservice controls.",
      icon: <Server className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "Performance Optimization",
      description: "Fine-tuning asset bundles, pre-rendering, lazy loads, caching architectures to boost Core Web Vitals to 100%.",
      icon: <Gauge className="w-5 h-5 text-cyan-500" />
    }
  ];

  const activeServices = services.length > 0 ? services : fallbackServices;

  const iconMapping: Record<string, React.ReactNode> = {
    "Frontend Engineering": <Layout className="w-5 h-5 text-blue-500" />,
    "Backend Architecture": <Server className="w-5 h-5 text-indigo-500" />,
    "Performance Optimization": <Gauge className="w-5 h-5 text-cyan-500" />,
    "Mobile Applications": <Smartphone className="w-5 h-5 text-emerald-500" />,
    "UI/UX Design": <Monitor className="w-5 h-5 text-rose-500" />,
    "Custom Softwares": <Code className="w-5 h-5 text-amber-500" />,
  };

  return (
    <section id="services" className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
            02 / CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Integrated engineering solutions.
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-4 max-w-2xl font-normal">
            Covering all stages of modern product cycles from conceptual design blueprints to robust cloud server deployments.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, idx) => {
            const isFallback = !service.id;
            const mappedIcon = iconMapping[service.title] || service.icon || <Code className="w-5 h-5 text-blue-500" />;

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="relative bg-white/60 hover:bg-white/90 border border-slate-900/10 hover:border-blue-500/10 p-8 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/[0.03] group hover:-translate-y-1 overflow-hidden flex flex-col justify-between text-left h-[260px]"
              >
                {/* Soft reflection swept overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/[0.015] to-transparent pointer-events-none" />

                <div className="space-y-6">
                  {/* Soft circular glass icon bubbles */}
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-900/5 shadow-sm flex items-center justify-center">
                    {mappedIcon}
                  </div>

                  {/* Title & Copywriting */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom indicator badge */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
                  <span>Full Standard SLA</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
