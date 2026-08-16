import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function NeonGamingCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "project">("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 240, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Avoid running on mobile/touch screens
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer") ||
        target.closest(".project-card-trigger");

      const isProjectCard = target.closest(".project-card-trigger") !== null;

      if (isProjectCard) {
        setIsHovered(true);
        setHoverType("project");
      } else if (isInteractive) {
        setIsHovered(true);
        setHoverType("default");
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Precise Inner HUD Target Cross/Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#1CD8D2] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{
          x: mouseX,
          y: mouseY,
          boxShadow: "0 0 10px #1CD8D2, 0 0 20px rgba(28,216,210,0.5)",
        }}
      />

      {/* 2. Soft Outer Glowing Target Reticle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-dashed border-[#1CD8D2]/40 bg-[#1CD8D2]/5 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
          boxShadow: isHovered 
            ? "0 0 25px rgba(28, 216, 210, 0.55), inset 0 0 10px rgba(28, 216, 210, 0.2)" 
            : "0 0 12px rgba(28, 216, 210, 0.15)",
        }}
        animate={{
          width: isHovered ? (hoverType === "project" ? 56 : 42) : 26,
          height: isHovered ? (hoverType === "project" ? 56 : 42) : 26,
          rotate: isHovered ? 180 : 0,
        }}
        transition={{ 
          width: { type: "spring", stiffness: 300, damping: 25 },
          height: { type: "spring", stiffness: 300, damping: 25 },
          rotate: { duration: 0.8, ease: "easeInOut" }
        }}
      >
        {isHovered && hoverType === "project" && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-black uppercase tracking-widest text-[#1CD8D2] drop-shadow-[0_0_5px_rgba(28,216,210,0.7)] font-mono"
          >
            PLAY
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
