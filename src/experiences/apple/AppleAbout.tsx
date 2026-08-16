import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { MapPin, Mail, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";

function SimpleCounter({ value, startCounter }: { value: number; startCounter: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounter) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.5;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, startCounter]);

  return <span>{count}</span>;
}

export default function AppleAbout() {
  const { profile } = usePortfolio();
  const [startCounter, setStartCounter] = useState(false);

  const stats = [
    { value: 35, label: "Projects Completed" },
    { value: 18, label: "Tech Modules" },
    { value: 24, label: "Satisfied Clients" },
    { value: 4, label: "Years Coding" },
  ];

  const pillars = [
    {
      title: "Meticulous Planning",
      desc: "Every module and database schema is architected cleanly before writing a single line of client code.",
    },
    {
      title: "Pixel-Perfect Visuals",
      desc: "Deep obsession with layout alignment, proportional spacing, clean typography, and interactive feedback.",
    },
    {
      title: "High-Performance Logic",
      desc: "Optimized server responses, static builds, local caching, and asset pre-fetching strategies.",
    },
  ];

  return (
    <section id="about" className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-20 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
            01 / DESIGN PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Crafting digital systems with clean structures.
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Glass Card Identity Block */}
          <motion.div
            className="lg:col-span-5 bg-white/60 border border-slate-900/15 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={() => {
              setStartCounter(true);
              return {};
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Block */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-900/5">
              <img
                src={profile.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={profile.name || "Leanur Rahman"}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-950 uppercase tracking-tight">
                  {profile.name || "Leanur Rahman"}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  {profile.role || "Full Stack Developer"}
                </p>
              </div>
            </div>

            {/* Counters Capsules */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/70 border border-slate-900/5 rounded-2xl text-left"
                >
                  <div className="text-2xl font-extrabold text-blue-600 tracking-tight leading-none">
                    <SimpleCounter value={stat.value} startCounter={startCounter} />+
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Contacts & Location */}
            <div className="space-y-3.5 pt-6 border-t border-slate-900/5 text-xs text-slate-500 font-sans font-medium text-left">
              <div className="flex items-center gap-3">
                <MapPin size={13} className="text-blue-500" />
                <span>{profile.location || "Chattogram, Bangladesh"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={13} className="text-blue-500" />
                <a href={`mailto:${profile.email}`} className="hover:text-blue-600 transition-colors truncate">
                  {profile.email || "techbulletcodeyt@gmail.com"}
                </a>
              </div>
            </div>

          </motion.div>

          {/* Right: Personal Narratives and Specialization blocks */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Story Paragraph */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-500" />
                <span className="text-[10px] font-mono tracking-widest text-blue-500 uppercase font-bold">Philosophy</span>
              </div>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal whitespace-pre-line">
                {profile.bio || "Hi, I’m Leanur Rahman, a CSE student at International Islamic University Chittagong and a Full Stack Developer. I design and build highly performant, accessible and aesthetically sound applications using modern architectures."}
              </p>
            </div>

            {/* Specialization cards */}
            <div className="space-y-4 pt-4">
              <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-black">Methodology Pillars</h4>
              <div className="grid grid-cols-1 gap-4">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white/50 hover:bg-white/80 border border-slate-900/5 rounded-2xl transition-all shadow-sm flex flex-col space-y-1 text-left"
                  >
                    <span className="text-xs font-bold text-slate-950 uppercase tracking-tight">{pillar.title}</span>
                    <span className="text-slate-500 text-xs leading-relaxed font-normal">{pillar.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Capsule */}
            <div className="p-5 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl flex items-start gap-4 text-left">
              <BookOpen size={18} className="text-blue-500 mt-0.5" />
              <div>
                <span className="text-[8px] font-mono text-blue-600 uppercase tracking-widest font-extrabold block mb-1">Education</span>
                <span className="text-xs font-bold text-slate-900 uppercase block">{profile.education?.degree || "B.Sc. in Computer Science & Engineering"}</span>
                <span className="text-xs text-slate-500 block font-normal">{profile.education?.institution || "International Islamic University Chittagong"}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
