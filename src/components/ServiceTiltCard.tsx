/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import * as Icons from "lucide-react";

// Dynamic Lucide icon lookup component
const LucideIcon = ({ name, className = "", size = 24 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Layers className={className} size={size} />;
  return <IconComponent className={className} size={size} />;
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  ctaText?: string;
  active: boolean;
}

interface ServiceTiltCardProps {
  service: Service;
  index: number;
}

export default function ServiceTiltCard({ service, index }: ServiceTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt rotations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const formattedIndex = (index + 1).toString().padStart(2, "0");

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative p-8 bg-bg-secondary hover:bg-brand-purple/5 border border-border-primary hover:border-neon-purple/40 rounded-xl transition-all duration-300 backdrop-blur-sm flex flex-col justify-between h-full shadow-sm hover:shadow-xl cursor-pointer overflow-hidden"
    >
      {/* Floating Big Index Number behind layout */}
      <span className="absolute bottom-4 right-6 font-mono font-black text-7xl select-none pointer-events-none text-text-secondary/[0.03] group-hover:text-neon-purple/[0.08] transition-colors duration-500">
        {formattedIndex}
      </span>

      {/* Decorative Glow accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/0 via-transparent to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Content */}
      <div className="space-y-6" style={{ transform: "translateZ(30px)" }}>
        {/* Animated Icon Casing */}
        <div className="inline-flex p-3.5 bg-bg-primary border border-border-primary rounded-xl text-neon-purple group-hover:border-neon-purple/40 transition-all duration-300 shadow-sm group-hover:scale-110">
          <LucideIcon name={service.icon} size={22} />
        </div>

        <h3 className="text-xl font-black uppercase tracking-tight text-text-primary group-hover:text-neon-purple transition-colors duration-200">
          {service.title}
        </h3>

        <p className="text-text-secondary text-sm leading-relaxed font-light">
          {service.description}
        </p>
      </div>

      {/* Action CTA Prompt */}
      <div 
        className="mt-10 pt-4 border-t border-border-primary flex items-center justify-between"
        style={{ transform: "translateZ(15px)" }}
      >
        <span className="text-xs font-mono uppercase tracking-widest text-text-secondary group-hover:text-neon-purple transition-colors font-bold">
          {service.ctaText || "Start Project"}
        </span>
        <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-primary text-text-secondary group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-brand-purple group-hover:to-neon-purple group-hover:border-neon-purple flex items-center justify-center transition-all duration-300">
          <span className="text-sm font-bold leading-none select-none group-hover:translate-x-[1px]">→</span>
        </div>
      </div>
    </motion.div>
  );
}
