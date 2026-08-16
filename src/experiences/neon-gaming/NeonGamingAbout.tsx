import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion } from "motion/react";
import { Shield, Target, Award, Heart } from "lucide-react";

interface AboutProps {
  onNavigate?: (section: string) => void;
}

export default function NeonGamingAbout({ onNavigate }: AboutProps) {
  const { profile = {}, projects = [], skills = [] } = usePortfolio();

  const stats = [
    {
      label: "TOTAL_QUESTS",
      value: projects.length || "12",
      sub: "Projects Finished",
      color: "text-[#1CD8D2]"
    },
    {
      label: "SKILL_DECK",
      value: skills.length || "18",
      sub: "Tech Capabilities",
      color: "text-[#00BF8F]"
    },
    {
      label: "GUILD_RATING",
      value: "100%",
      sub: "Satisfaction",
      color: "text-purple-400"
    },
    {
      label: "EXP_LEVEL",
      value: "05+",
      sub: "Years Active",
      color: "text-yellow-400"
    }
  ];

  const cards = [
    {
      title: "Tactical Coding Style",
      desc: "Pragmatic, clean typescript design structures designed to survive high-load scale constraints.",
      icon: <Shield className="w-5 h-5 text-[#1CD8D2]" />
    },
    {
      title: "Dynamic Gameplay",
      desc: "Continuous integration, fast deployments, and optimized performance mechanics.",
      icon: <Target className="w-5 h-5 text-[#00BF8F]" />
    },
    {
      title: "Epic Standards",
      desc: "Pixel-perfect spacing rules, clean custom layouts, and flawless visual transitions.",
      icon: <Award className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <section id="about" className="py-32 bg-transparent relative z-10 overflow-hidden text-left text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1CD8D2] shadow-[0_0_8px_#1CD8D2]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#1CD8D2] uppercase font-black">
              [02] PLAYER_PROFILE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            ABOUT THE DEVELOPER.
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-4 max-w-xl font-normal">
            Get a tactical overview of my core engineering capabilities, stats database, and product philosophy.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Frosted Bio Canvas */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[24px] relative backdrop-blur-xl shadow-2xl">
              {/* Retro brackets accents */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">&lt;BIO&gt;</div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20">&lt;/BIO&gt;</div>
              
              <h3 className="text-lg font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] mb-4">
                {profile.title || "Full Stack Application Architect"}
              </h3>
              
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal mb-6">
                {profile.bio || "An adaptable software developer with deep capabilities in designing dynamic frontend interfaces, configuring robust backend microservices, and orchestrating flawless live environments. Focused on crafting responsive design code for creative agencies and scalable enterprises alike."}
              </p>

              <div className="pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 block mb-1">CURRENT_LOBBY</span>
                  <span className="text-xs font-bold uppercase text-white/95">{profile.location || "Remote / Worldwide"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 block mb-1">DEPLOYED_EMAIL</span>
                  <a href={`mailto:${profile.email}`} className="text-xs font-bold uppercase text-[#1CD8D2] hover:underline">
                    {profile.email || "techbulletcodeyt@gmail.com"}
                  </a>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 block mb-1">GUILD_STATUS</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00BF8F]/10 border border-[#00BF8F]/30 text-[#00BF8F] text-[9px] font-mono font-black uppercase">
                    ACTIVE_PLAY
                  </span>
                </div>
              </div>
            </div>

            {/* Sub cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#1CD8D2]/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3">
                    {card.icon}
                  </div>
                  <h4 className="text-xs font-bold uppercase text-white tracking-wide mb-1.5">{card.title}</h4>
                  <p className="text-white/50 text-[10px] leading-relaxed font-normal">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Player stats dashboard */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[24px] relative backdrop-blur-xl shadow-2xl space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                <div className="text-left">
                  <span className="text-[9px] font-mono text-white/30 block tracking-widest">PLAYER_STATS</span>
                  <h3 className="text-sm font-black uppercase text-white tracking-widest">LIVE_DASHBOARD</h3>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#1CD8D2]/10 text-[#1CD8D2] text-[9px] font-mono font-bold border border-[#1CD8D2]/25">
                  SYS_OK
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between text-left group hover:bg-white/[0.04] transition-all"
                  >
                    <span className="text-[8px] font-mono font-black text-white/30 tracking-widest uppercase">
                      {stat.label}
                    </span>
                    <div className="my-2 flex items-baseline gap-1">
                      <span className={`text-2xl sm:text-3xl font-black ${stat.color} font-mono tracking-tight`}>
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-white/60">
                      {stat.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Character Progress bar (aesthetic gaming touch) */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-white/40">NEXT_LEVEL_QUEST_REWARD</span>
                  <span className="text-[#1CD8D2] font-bold">85% COMPLETE</span>
                </div>
                <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
