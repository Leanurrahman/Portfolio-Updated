/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Position motion values (avoiding React state updates)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for outer ring
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28, mass: 0.4 });

  // Spring physics for inner dot
  const innerSpringX = useSpring(cursorX, { stiffness: 800, damping: 35 });
  const innerSpringY = useSpring(cursorY, { stiffness: 800, damping: 35 });

  useEffect(() => {
    // Disable custom cursor on mobile / tablets
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

      const clickableEl = target.closest("a, button, [role='button'], .clickable");
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
      {/* Outer Circle with spring physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-neon-purple mix-blend-difference flex items-center justify-center font-mono"
        style={{
          x: springX,
          y: springY,
          width: 32,
          height: 32,
          left: -16,
          top: -16,
        }}
        animate={{
          scale: hovered ? 1.4 : 1,
          backgroundColor: hovered ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0)",
          borderColor: hovered ? "rgba(168, 85, 247, 0.8)" : "rgba(168, 85, 247, 0.4)",
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Inner glowing core dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-neon-purple pointer-events-none z-50 shadow-[0_0_8px_rgba(168,85,247,0.8)] mix-blend-difference"
        style={{
          x: innerSpringX,
          y: innerSpringY,
          left: -3,
          top: -3,
        }}
        animate={{
          scale: hovered ? 0.3 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
