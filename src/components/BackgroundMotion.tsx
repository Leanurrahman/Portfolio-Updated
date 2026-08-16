/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function BackgroundMotion() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Compute inverses using useTransform to avoid nested useSpring type errors
  const transformXInverse = useTransform(mouseX, (x) => x * -1.2);
  const transformYInverse = useTransform(mouseY, (y) => y * -1.2);

  const springXInverse = useSpring(transformXInverse, { stiffness: 30, damping: 15 });
  const springYInverse = useSpring(transformYInverse, { stiffness: 30, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 8;
      const y = (e.clientY - innerHeight / 2) / 8;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Moving Ambient Glow Gradients (Responsive parallax) */}
      <motion.div
        className="absolute top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-brand-orange/[0.04] dark:bg-brand-orange/[0.03] blur-[150px]"
        style={{ x: springX, y: springY }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/[0.03] dark:bg-brand-orange/[0.02] blur-[120px]"
        style={{
          x: springXInverse,
          y: springYInverse
        }}
      />

      {/* Grid Pattern Dots */}
      <div 
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15]" 
        style={{ 
          backgroundImage: "radial-gradient(var(--border-primary) 1.5px, transparent 1.5px)", 
          backgroundSize: "32px 32px" 
        }}
      />

      {/* Organic Noise Overlay Texture (Pure CSS) */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
    </div>
  );
}
