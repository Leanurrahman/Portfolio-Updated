import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Code, Layout, Database, Terminal, Settings, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function NeonGamingServices() {
  const { services = [] } = usePortfolio();

  const iconMap: Record<string, any> = {
    Code: <Code className="w-5 h-5" />,
    Layout: <Layout className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Terminal: <Terminal className="w-5 h-5" />,
    Settings: <Settings className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />
  };

  const getServiceIcon = (iconName: string, index: number) => {
    if (iconMap[iconName]) return iconMap[iconName];
    const defaultIcons = [<Code className="w-5 h-5" />, <Layout className="w-5 h-5" />, <Database className="w-5 h-5" />, <Globe className="w-5 h-5" />];
    return defaultIcons[index % defaultIcons.length];
  };

  const colors = [
    "from-[#1CD8D2]/20 to-[#00BF8F]/5 border-[#1CD8D2]/20 hover:border-[#1CD8D2]/50 hover:shadow-[0_0_20px_rgba(28,216,210,0.15)] text-[#1CD8D2]",
    "from-purple-500/20 to-[#302B63]/5 border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] text-purple-400",
    "from-[#00BF8F]/20 to-[#1CD8D2]/5 border-[#00BF8F]/20 hover:border-[#00BF8F]/50 hover:shadow-[0_0_20px_rgba(0,191,143,0.15)] text-[#00BF8F]",
  ];

  return (
    <section id="services" className="py-32 bg-transparent relative z-10 overflow-hidden text-left text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BF8F] shadow-[0_0_8px_#00BF8F]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#00BF8F] uppercase font-black">
              [03] ABILITIES_SYSTEM
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            SERVICES & SPECIALTIES.
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-4 max-w-xl font-normal">
            Specialized engineering capabilities tailored to meet pristine interface standards, scalable microservice architectures, and fluid animations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.filter(s => s.active !== false).map((service, index) => {
            const colorClass = colors[index % colors.length];

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`p-6 md:p-8 bg-gradient-to-br ${colorClass} bg-black/60 border rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  {/* Icon Frame */}
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center">
                    {getServiceIcon(service.icon, index)}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base font-bold uppercase text-white tracking-wide">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/70 text-xs leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {service.ctaText && (
                  <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase">
                    <span className="text-white/40">OPERATION:</span>
                    <span className="group-hover:underline cursor-pointer">{service.ctaText} &gt;</span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {services.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md">
              <p className="text-white/40 font-mono text-xs">NO SERVICES REGISTERED IN SYSTEM DATABASE.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
