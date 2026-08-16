/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, PencilRuler, Code, ShieldCheck, Rocket, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

export default function WorkProcess() {
  const steps = [
    {
      index: "01",
      title: "Discovery & Requirements",
      description: "We initiate the collaboration by aligning with your core objectives, mapping existing brand guides, and defining detailed technical benchmarks.",
      icon: Compass,
    },
    {
      index: "02",
      title: "UI/UX Planning",
      description: "I construct initial interactive wireframes, user journeys, and component diagrams to solidify visual hierarchies before writing any lines of code.",
      icon: PencilRuler,
    },
    {
      index: "03",
      title: "Full Stack Development",
      description: "The core engineering phase where I implement pixel-perfect, lightning-fast frontends and build fully secured, scalable backend APIs.",
      icon: Code,
    },
    {
      index: "04",
      title: "Testing & Optimization",
      description: "Rigorous quality audits including responsiveness testing across multiple viewports, lighthouse score tunings, and code syntax validations.",
      icon: ShieldCheck,
    },
    {
      index: "05",
      title: "Deployment & Launch",
      description: "Transferring and launching products onto lightning-fast edge infrastructure, setting up correct SSL certificates and SEO scripts.",
      icon: Rocket,
    },
    {
      index: "06",
      title: "Continuous Support",
      description: "Post-launch maintenance including system monitoring, performance health checks, and minor layout modifications to keep your product flawless.",
      icon: HeartHandshake,
    }
  ];

  return (
    <section id="process" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350">
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading with cinematic titles */}
        <AnimatedSectionHeading 
          number="04" 
          badge="Methodology" 
          title="Work philosophy" 
          subtitle="A transparent, organized development roadmap structured specifically to guarantee predictable releases and high-end results."
        />

        {/* Clean, stable grid-based step cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-8 bg-bg-secondary border border-border-primary rounded-2xl transition-all duration-300 hover:border-neon-purple/30 hover:-translate-y-1 flex flex-col justify-between shadow-sm hover:shadow-lg h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono font-black text-2xl text-text-secondary group-hover:text-neon-purple transition-colors">
                      {step.index}
                    </span>
                    <div className="p-2.5 rounded-xl border border-border-primary bg-bg-primary text-text-secondary group-hover:bg-brand-purple/10 group-hover:text-neon-purple group-hover:border-neon-purple/20 transition-all shadow-sm">
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wide text-text-primary group-hover:text-neon-purple transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
