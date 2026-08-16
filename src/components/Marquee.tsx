/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
}

export default function Marquee({ items, speed = 20, reverse = false }: MarqueeProps) {
  // Multiply the items list to ensure smooth seamless infinite scrolling
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-4 bg-bg-secondary/70 border-y border-border-primary/80 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: speed * 2.5,
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 font-mono text-sm tracking-widest text-text-secondary select-none uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_var(--brand-orange)]" />
            <span>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
