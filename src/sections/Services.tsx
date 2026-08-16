/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import ServiceTiltCard from "../components/ServiceTiltCard";
import { motion } from "motion/react";
import CosmicBackground from "../components/CosmicBackground";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

export default function Services() {
  const { services } = usePortfolio();
  const activeServices = services.filter((s) => s.active !== false);

  return (
    <section id="services" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350">
      
      {/* Subtle continuous cosmic background */}
      <CosmicBackground intensity={0.30} variant="subtle" />
      
      {/* Background glow flares */}
      <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-neon-purple/5 blur-[100px] pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cinematic Section Heading with staggered reveal and section number */}
        <AnimatedSectionHeading 
          number="02" 
          badge="Expertise" 
          title="Core capabilities" 
          subtitle="Delivering high-performance backend pipelines and premium frontend layouts styled with mathematical visual rigor."
        />

        {/* Services bento-grid showcase with rotate-on-scroll and stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 60, rotate: -3, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1] // premium cinematic easing
              }}
              className="h-full"
            >
              <ServiceTiltCard service={service} index={idx} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
