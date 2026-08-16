import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function NeonGamingIntro() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);

  const bootMessages = [
    "INITIALIZING_SYS_KERNEL...",
    "MAPPING_VIRTUAL_DOM_NODES...",
    "DECRYPTING_PORTFOLIO_STATE...",
    "ESTABLISHING_FIRESTORE_LINK...",
    "GENERATING_CYBER_ATMOSPHERE...",
    "BOOT_SEQUENCE_COMPLETE"
  ];

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("neon-gaming-intro-seen");
    if (!hasSeenIntro) {
      setShow(true);

      // Increment progress smoothly from 0 to 100
      let startTime = Date.now();
      const duration = 2400; // 2.4 seconds loading experience

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
        setProgress(currentProgress);

        // Advance boot steps
        const step = Math.min(Math.floor((currentProgress / 100) * bootMessages.length), bootMessages.length - 1);
        setBootStep(step);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            sessionStorage.setItem("neon-gaming-intro-seen", "true");
          }, 300);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="neon-gaming-intro"
          className="fixed inset-0 bg-[#020204] z-[9999] flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Cybernetic Grid Layer */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(28,216,210,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,216,210,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"
            style={{
              maskImage: "radial-gradient(circle at center, black, transparent 90%)",
              WebkitMaskImage: "radial-gradient(circle at center, black, transparent 90%)",
            }}
          />

          {/* Retro scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(28,216,210,0.04),rgba(0,191,143,0.02),rgba(168,85,247,0.04))] bg-[size:100%_4px,4px_100%] pointer-events-none" />

          {/* Glitchy gaming outer corner brackets */}
          <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-[#1CD8D2] shadow-[0_0_10px_rgba(28,216,210,0.5)]" />
          <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-[#1CD8D2] shadow-[0_0_10px_rgba(28,216,210,0.5)]" />
          <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-[#00BF8F] shadow-[0_0_10px_rgba(0,191,143,0.5)]" />
          <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

          {/* Decorative side telemetry */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-10 hidden lg:flex font-mono text-[8px] text-white/10 text-left space-y-4">
            <div>
              <p className="text-[#1CD8D2]">HOST: PORT_3000</p>
              <p>PING: 14MS (SECURE)</p>
              <p>STATUS: ONLINE</p>
            </div>
            <div>
              <p className="text-[#00BF8F]">CORE: TS_V5.3</p>
              <p>RENDER: VITE_REACT</p>
              <p>ENGINE: ANTIMATTER_GFX</p>
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-10 hidden lg:flex font-mono text-[8px] text-white/10 text-right space-y-4">
            <div>
              <p className="text-purple-400">FPS: 144_SECURE</p>
              <p>GLYPHS: SPACE_GROTESK</p>
              <p>CURSOR: TARGET_DUAL</p>
            </div>
            <div>
              <p className="text-yellow-400">GUI: RECH_D3_V2</p>
              <p>SOUND: MUTED</p>
              <p>SESSION: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="space-y-8 max-w-xl w-full z-10">
            {/* Top pulse light */}
            <div className="flex items-center justify-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1CD8D2] animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-[#1CD8D2] font-black uppercase drop-shadow-[0_0_8px_rgba(28,216,210,0.5)]">
                BOOT_DECK_ESTABLISHED
              </span>
            </div>

            {/* Main brand heading */}
            <div className="space-y-2 relative">
              {/* Ghost background text */}
              <div className="absolute inset-0 flex items-center justify-center -z-10 select-none opacity-5">
                <span className="text-6xl sm:text-8xl font-black font-sans tracking-[0.4em]">NEON</span>
              </div>
              
              <motion.h1
                className="text-5xl sm:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#1CD8D2] via-[#00BF8F] to-[#a855f7] drop-shadow-[0_0_30px_rgba(28,216,210,0.4)] font-sans uppercase"
                initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.25em" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                LEANUR.DEV
              </motion.h1>
            </div>

            {/* Display panel box with diagnostics */}
            <div className="max-w-xs sm:max-w-sm mx-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl font-mono text-left space-y-2 text-[10px] text-white/50 backdrop-blur-md">
              <div className="flex justify-between items-center text-[#1CD8D2]">
                <span>SYS_DIAGNOSTIC:</span>
                <span className="font-bold">LVL_05_ARCHITECT</span>
              </div>
              <div className="h-px bg-white/5 my-1.5" />
              <div className="flex items-center gap-2">
                <span className="text-[#00BF8F]">&gt;&gt;</span>
                <span className="text-white/80 uppercase">{bootMessages[bootStep]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">&gt;&gt;</span>
                <span>RESOURCES_COMMITTED: 100% SECURE</span>
              </div>
            </div>

            {/* High fidelity loading percentage bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center max-w-xs sm:max-w-sm mx-auto text-[10px] font-mono text-[#00BF8F] font-bold">
                <span>SYSTEM_INITIALIZATION</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] font-black">{progress}%</span>
              </div>
              
              <div className="w-xs sm:w-sm h-2.5 bg-white/[0.03] rounded-full mx-auto p-[2px] border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] relative">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#1CD8D2] via-[#00BF8F] to-[#a855f7] relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing tip of progress bar */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#1CD8D2]" />
                </motion.div>
              </div>
            </div>

            <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
              © 2026 LEANUR.DEV • SECURED PORTAL GATEWAY
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
