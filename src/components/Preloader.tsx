/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Increment progress line quickly over 1.2s
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    // After 1.5s, trigger exit transition
    const timeout = setTimeout(() => {
      setShouldExit(true);
      // Wait for exit animation to complete before calling onComplete
      setTimeout(onComplete, 600);
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  const textLetters = "LEANUR.DEV".split("");

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          id="preloader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-colors duration-350"
          exit={{ 
            y: "-100%",
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Noise background simulation */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center max-w-md w-full px-6">
            
            {/* Split Text Reveal */}
            <div className="overflow-hidden flex justify-center">
              <div className="flex gap-[0.05em]">
                {textLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    className="text-4xl md:text-5xl font-black tracking-tight text-white font-sans"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Subtext tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300 font-bold"
            >
              Creative Full-Stack Developer
            </motion.div>

            {/* Animated Progress Line */}
            <div className="relative h-[2px] w-48 mx-auto bg-slate-900 rounded-full overflow-hidden mt-2">
              <motion.div
                className="absolute top-0 left-0 h-full bg-brand-orange"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
