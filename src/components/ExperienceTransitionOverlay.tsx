import React, { useEffect, useState } from "react";
import { useExperience, EXPERIENCES } from "../context/ExperienceContext";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Loader2 } from "lucide-react";

export default function ExperienceTransitionOverlay() {
  const { isTransitioning, nextExperience, currentExperience } = useExperience();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing warp...");

  const targetExpId = nextExperience || currentExperience;
  const targetExp = EXPERIENCES.find((e) => e.id === targetExpId) || EXPERIENCES[0];

  // Progression steps for cinematic feel
  useEffect(() => {
    if (!isTransitioning) {
      setProgress(0);
      return;
    }

    // Progress counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 22);

    // Text transition timing
    const textIntervals = [
      { t: 0, text: "DECOMPRESSING CHRONO-METERS..." },
      { t: 400, text: "ESTABLISHING QUANTUM COGNITIVE LINK..." },
      { t: 900, text: "SYNCHRONIZING ENCRYPTED PORTFOLIO CMS..." },
      { t: 1400, text: "STABILIZING MULTIVERSE RIPPLES..." },
      { t: 2000, text: "COMPILING SHADERS & INTERFACE LAYOUTS..." },
      { t: 2600, text: "DIMENSION WARP COMPLETED SUCCESSFULLY." },
    ];

    const timeouts = textIntervals.map((step) => {
      return setTimeout(() => {
        setLoadingText(step.text);
      }, step.t);
    });

    return () => {
      clearInterval(interval);
      timeouts.forEach((to) => clearTimeout(to));
    };
  }, [isTransitioning, nextExperience]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#020205] z-[9999] flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
        >
          {/* Neon Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,30,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,30,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

          {/* Core Spinner & Logo layout */}
          <div className="relative flex flex-col items-center justify-center max-w-sm w-full text-center space-y-10">
            {/* Outer spinning ring */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand-orange/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute inset-1.5 border border-brand-orange/10 rounded-full"
              />
              
              {/* Central experience emblem */}
              <motion.div
                initial={{ scale: 0.7, rotate: -15 }}
                animate={{ scale: [0.95, 1.05, 0.95], rotate: 0 }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-20 h-20 bg-[#08080c] border border-brand-orange/30 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-brand-orange/10 z-10"
              >
                {targetExp.emoji}
              </motion.div>
            </div>

            {/* Dynamic Dimension title */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono tracking-[0.4em] text-brand-orange uppercase font-black">
                Dimension Shift
              </span>
              <h2 className="text-xl font-bold font-sans text-white tracking-tight flex items-center justify-center gap-2">
                <span>Entering: {targetExp.name}</span>
              </h2>
            </div>

            {/* Loading Progression system */}
            <div className="w-full space-y-3">
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#101015] border border-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-hover"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Stats and text info */}
              <div className="flex items-center justify-between font-mono text-[9px] text-text-muted tracking-widest uppercase">
                <div className="flex items-center gap-1.5 min-w-[200px] text-left">
                  <Loader2 className="w-3 h-3 animate-spin text-brand-orange" />
                  <span className="text-text-secondary truncate">{loadingText}</span>
                </div>
                <span className="font-bold text-white">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Corner Decors */}
          <div className="absolute top-10 left-10 font-mono text-[8px] text-white/20 tracking-wider">
            SYSTEM_PORT_3000 // CORE_ONLINE
          </div>
          <div className="absolute bottom-10 right-10 font-mono text-[8px] text-white/20 tracking-wider">
            EXPERIENCE_ENGINE_v2.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
