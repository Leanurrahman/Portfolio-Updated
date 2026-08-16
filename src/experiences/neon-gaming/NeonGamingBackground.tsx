import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function NeonGamingBackground() {
  const { experienceSettings } = usePortfolio();
  const gamingSettings = experienceSettings?.neonGaming;
  
  const cyanGlow = gamingSettings?.accentCyan || "#1CD8D2";
  const greenGlow = gamingSettings?.accentGreen || "#00BF8F";
  const purpleGlow = gamingSettings?.accentPurple || "#a855f7";
  const bgImage = gamingSettings?.backgroundImage;
  const rawIntensity = gamingSettings?.particleIntensity !== undefined ? gamingSettings.particleIntensity : 50;

  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const densityFactor = isMobile ? 0.3 : 1;
  const particleCount = Math.floor((rawIntensity / 100) * 36 * densityFactor) + (rawIntensity > 0 ? 5 : 0);
  const particles = Array.from({ length: particleCount });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#020204]">
      {/* 1. Immersive Deep Space Mesh Gradient or Custom Background Image */}
      {bgImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-screen"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <div 
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            background: "radial-gradient(circle at 50% 50%, #0d0b21 0%, #020205 80%)",
          }}
        />
      )}

      {/* 2. Cybernetic Perspective Grid (Gaming Floor effect) */}
      <div 
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${cyanGlow}26 1px, transparent 1px),
            linear-gradient(to bottom, ${cyanGlow}26 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(800px) rotateX(60deg) translateY(-200px) scale(2.2)",
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* Ceiling perspective grid */}
      <div 
        className="absolute inset-x-0 top-0 h-[40vh] opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${purpleGlow}26 1px, transparent 1px),
            linear-gradient(to bottom, ${purpleGlow}26 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: "perspective(800px) rotateX(-60deg) translateY(0) scale(1.8)",
          transformOrigin: "bottom center",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* 3. Real-time Scrolling Scanlines & HUD Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />

      {/* 4. Giant Slow Floating Neon Bulbs (Cyan / Emerald / Amethyst) */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[140px] top-[15%] left-[-15%] mix-blend-screen"
        style={{ backgroundColor: `${cyanGlow}14` }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[140px] bottom-[20%] right-[-10%] mix-blend-screen"
        style={{ backgroundColor: `${greenGlow}14` }}
        animate={prefersReducedMotion ? {} : {
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full blur-[120px] top-[45%] right-[25%] mix-blend-screen"
        style={{ backgroundColor: `${purpleGlow}0d` }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 20, -40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 5. Glowing Grid Corner Anchors for immersive UI */}
      <div 
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r"
        style={{ backgroundImage: `linear-gradient(to right, transparent, ${cyanGlow}40, transparent)` }}
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r"
        style={{ backgroundImage: `linear-gradient(to right, transparent, ${greenGlow}40, transparent)` }}
      />

      {/* 6. Glowing Digital Particles */}
      {!prefersReducedMotion && particles.length > 0 && (
        <div className="absolute inset-0">
          {particles.map((_, i) => {
            const size = Math.random() * 3 + 2;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const colors = [cyanGlow, greenGlow, purpleGlow];
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  left: `${startX}%`,
                  top: `${startY}%`,
                  boxShadow: `0 0 10px ${color}`,
                  opacity: Math.random() * 0.35 + 0.1,
                }}
                animate={{
                  y: [0, -120, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                }}
                transition={{
                  duration: Math.random() * 12 + 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
