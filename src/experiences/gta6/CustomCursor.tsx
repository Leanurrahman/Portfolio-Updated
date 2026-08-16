import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Position motion values (avoiding React state updates)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for outer ring
  const springX = useSpring(cursorX, { stiffness: 400, damping: 25, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 25, mass: 0.5 });

  // Spring physics for inner dot
  const innerSpringX = useSpring(cursorX, { stiffness: 850, damping: 30 });
  const innerSpringY = useSpring(cursorY, { stiffness: 850, damping: 30 });

  useEffect(() => {
    // Disable on mobile/tablets
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobile) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const clickableEl = target.closest("a, button, [role='button'], .clickable, input, textarea, select");
      setHovered(!!clickableEl);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Gaming Reticle Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#ff007f] flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          width: 40,
          height: 40,
          left: -20,
          top: -20,
        }}
        animate={{
          scale: hovered ? 1.3 : 1,
          rotate: hovered ? 135 : 0,
          backgroundColor: hovered ? "rgba(255, 0, 127, 0.15)" : "rgba(0, 0, 0, 0)",
          borderColor: hovered ? "#ffaa00" : "#ff007f",
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Reticle Tick Lines (top, bottom, left, right) */}
        <div className="absolute top-0 w-0.5 h-1.5 bg-[#ff007f]" />
        <div className="absolute bottom-0 w-0.5 h-1.5 bg-[#ff007f]" />
        <div className="absolute left-0 h-0.5 w-1.5 bg-[#ff007f]" />
        <div className="absolute right-0 h-0.5 w-1.5 bg-[#ff007f]" />
      </motion.div>

      {/* Inner glowing laser dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#ffaa00] pointer-events-none z-50 shadow-[0_0_10px_#ff007f]"
        style={{
          x: innerSpringX,
          y: innerSpringY,
          left: -4,
          top: -4,
        }}
        animate={{
          scale: hovered ? 0.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
