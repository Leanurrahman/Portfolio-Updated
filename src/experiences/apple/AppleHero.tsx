import React, { useRef, useEffect, useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle, Code2, Layers, Cpu } from "lucide-react";
import MagneticButton from "../../components/MagneticButton";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function AppleHero({ onNavigate }: HeroProps) {
  const { profile } = usePortfolio();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse tilt mechanics for the Glass Device Mockup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-300, 300], [10, -10]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-10, 10]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const el = e.currentTarget.getBoundingClientRect();
    const width = el.width;
    const height = el.height;
    const clientX = e.clientX - el.left - width / 2;
    const clientY = e.clientY - el.top - height / 2;
    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const techChips = [
    { name: "React", icon: <Code2 size={12} className="text-blue-500" /> },
    { name: "Next.js", icon: <Cpu size={12} className="text-slate-800" /> },
    { name: "Firebase", icon: <Layers size={12} className="text-amber-500" /> },
    { name: "TypeScript", icon: <Sparkles size={12} className="text-blue-600" /> },
    { name: "Tailwind", icon: <CheckCircle size={12} className="text-cyan-500" /> },
    { name: "Dashboard", icon: <Sparkles size={12} className="text-indigo-500" /> },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-transparent z-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left: Premium Typography */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/70 border border-slate-900/5 rounded-full shadow-sm text-[11px] font-semibold text-slate-600 tracking-wide backdrop-blur-md"
          >
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            <span>EXQUISITE MULTIVERSE EXPERIENCE</span>
          </motion.div>

          {/* Large Clean Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-[68px] font-extrabold text-slate-900 leading-[1.08] tracking-tight"
            >
              Build fast. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#007AFF] to-[#5AC8FA] drop-shadow-sm">
                Scale beautifully.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl font-normal"
            >
              I’m <strong className="text-slate-900 font-semibold">{profile.name || "Leanur Rahman"}</strong>, a Full Stack Developer building clean, scalable, and high-performance web experiences for modern businesses.
            </motion.p>
          </div>

          {/* Floating interactive Tech Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-2.5 max-w-xl"
          >
            {techChips.map((chip, idx) => (
              <motion.div
                key={chip.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 + idx * 0.05 }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/60 border border-slate-900/5 rounded-xl shadow-sm text-xs text-slate-700 font-medium hover:bg-white hover:border-blue-500/20 hover:shadow-md transition-all backdrop-blur-md cursor-default"
              >
                {chip.icon}
                <span>{chip.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <MagneticButton
              onClick={() => onNavigate("contact")}
              className="px-7 py-3.5 bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs tracking-wide rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer flex items-center gap-1.5"
            >
              <span>Start a Project</span>
              <ArrowRight size={14} />
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate("projects")}
              className="px-7 py-3.5 border border-slate-900/10 bg-white/70 hover:bg-white hover:border-blue-500/20 text-slate-600 hover:text-slate-900 font-semibold text-xs tracking-wide rounded-xl shadow-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <span>View Work</span>
            </MagneticButton>
          </motion.div>

        </div>

        {/* Right: Apple 3D Frosted Glass Device Mockup */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <motion.div
            style={{
              rotateX: isMobile ? 0 : rotateX,
              rotateY: isMobile ? 0 : rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] aspect-[4/5] bg-white/60 border border-slate-900/10 rounded-3xl p-4 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl group overflow-hidden"
          >
            {/* Soft inner glow reflection animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 opacity-70 pointer-events-none" />
            <motion.div
              className="absolute -top-[100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-12 pointer-events-none"
              animate={{
                top: ["-100%", "100%"],
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />

            {/* Simulated Glass Browser Header */}
            <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-900/5 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900/10" />
              </div>
              <div className="px-5 py-0.5 bg-slate-900/[0.03] border border-slate-900/5 rounded-md text-[9px] font-mono tracking-widest uppercase text-slate-400">
                leanur.dev
              </div>
              <div className="w-8" />
            </div>

            {/* Inner Dashboard View */}
            <div className="h-[80%] rounded-2xl bg-white/90 border border-slate-900/5 p-4 flex flex-col justify-between shadow-inner">
              <div className="space-y-4">
                {/* Simulated profile block */}
                <div className="flex items-center gap-3.5 p-2 bg-slate-50 border border-slate-900/5 rounded-xl">
                  <img
                    src={profile.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"}
                    alt={profile.name || "Leanur Rahman"}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{profile.name || "Leanur Rahman"}</h3>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{profile.role || "Full Stack Developer"}</p>
                  </div>
                </div>

                {/* Performance stats simulated system */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-900/5 text-left">
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">LOAD TIME</span>
                    <span className="text-lg font-black text-blue-600 leading-none">0.8s</span>
                    <span className="text-[8px] text-emerald-500 font-medium block mt-1">Excellent</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-900/5 text-left">
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">DEPLOY SPEED</span>
                    <span className="text-lg font-black text-slate-800 leading-none">100%</span>
                    <span className="text-[8px] text-slate-400 font-medium block mt-1">Automated</span>
                  </div>
                </div>
              </div>

              {/* Dynamic decorative visual waves representing telemetry or analytics */}
              <div className="h-20 flex items-end gap-1 px-1 mt-4">
                {[40, 60, 45, 80, 55, 90, 75, 60, 40, 70, 85, 95].map((val, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-blue-500/10 to-blue-500/40 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.05, ease: "easeOut" }}
                  />
                ))}
              </div>
            </div>

            {/* Glowing Apple Orb Accent element */}
            <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
