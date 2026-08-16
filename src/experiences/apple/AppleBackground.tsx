import React from "react";
import { motion } from "motion/react";

export default function AppleBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#F8FAFC]">
      {/* Light Mesh Soft Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#f1f5f9] via-white to-[#eff6ff] opacity-80" />

      {/* Floating Soft Blur Orbs with Calm Motion */}
      <motion.div
        className="absolute w-[45vw] h-[45vw] rounded-full bg-blue-100/40 blur-[120px] top-[-10%] right-[5%]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full bg-cyan-100/30 blur-[110px] bottom-[-5%] left-[10%]"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full bg-slate-100/50 blur-[90px] top-[30%] left-[30%]"
        animate={{
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very faint Grid lines overlay to give structure */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:100px_100px] opacity-70" />
    </div>
  );
}
