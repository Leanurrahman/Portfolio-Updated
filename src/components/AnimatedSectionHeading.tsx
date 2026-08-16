/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface AnimatedSectionHeadingProps {
  number: string;
  badge: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function AnimatedSectionHeading({
  number,
  badge,
  title,
  subtitle,
  align = "left",
  className = "",
}: AnimatedSectionHeadingProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const words = title.split(" ");

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.08,
      },
    },
  };

  // Word variants
  const wordVariants = {
    hidden: {
      y: "110%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className={`mb-16 select-none ${align === "center" ? "text-center mx-auto" : ""} ${className}`}>
      {/* Badge & Number */}
      <div className={`flex items-center gap-3 mb-4 ${align === "center" ? "justify-center" : ""}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-1.5 px-3 py-1 bg-brand-soft-bg border border-brand-orange/15 rounded-full"
        >
          <span className="text-[10px] font-mono tracking-[0.15em] font-black uppercase text-brand-orange">
            {number}
          </span>
          <span className="w-1 h-1 rounded-full bg-brand-orange" />
          <span className="text-[10px] font-mono tracking-[0.15em] font-black uppercase text-text-primary">
            {badge}
          </span>
        </motion.div>
        
        {/* Sync'ed animated little indicator */}
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-brand-orange"
        >
          <ArrowUpRight size={13} />
        </motion.div>
      </div>

      {/* Main Title Word-by-Word Kinetic Reveal */}
      <motion.h2
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`text-3xl md:text-5xl font-black text-text-primary tracking-tighter uppercase font-sans flex flex-wrap gap-x-3 gap-y-1 ${
          align === "center" ? "justify-center" : "justify-start"
        }`}
      >
        {words.map((word, idx) => {
          // Highlight dynamic styling if italicized word or similar
          const isHighlight = word.toLowerCase() === "philosophy" || word.toLowerCase() === "story" || word.toLowerCase() === "services" || word.toLowerCase() === "projects" || word.toLowerCase() === "capabilities" || word.toLowerCase() === "touch";
          return (
            <span key={idx} className="inline-block overflow-hidden py-1">
              <motion.span
                variants={wordVariants}
                className={`inline-block ${
                  isHighlight 
                    ? "font-serif italic text-text-secondary lowercase font-normal" 
                    : ""
                }`}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`text-text-secondary text-sm max-w-xl mt-4 font-light leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
