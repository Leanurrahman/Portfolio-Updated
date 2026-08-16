/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

export default function Testimonials() {
  const { testimonials } = usePortfolio();

  return (
    <section id="testimonials" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading with Editorial Font Pairings */}
        <div className="space-y-3 mb-20 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neon-purple font-black">Endorsements</span>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter uppercase font-sans">
            Client <span className="font-serif italic text-text-secondary lowercase">testimonials</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mt-3 font-light">
            Read direct feedback from international product managers and startup founders who have leveraged my full-stack web solutions.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-neon-purple mt-4 rounded-full mx-auto md:mx-0" />
        </div>

        {/* Testimonials Grid (Premium floating stagger cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 bg-bg-secondary border border-border-primary rounded-xl flex flex-col justify-between backdrop-blur-sm relative group hover:border-neon-purple/30 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden"
            >
              {/* Glow top line indicator */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {/* Huge Quote Mark Icon rotating slightly */}
              <Quote className="absolute top-6 right-6 text-text-secondary/[0.03] group-hover:text-neon-purple/[0.08] group-hover:rotate-12 transition-all duration-500 pointer-events-none" size={64} />

              <div className="space-y-4 relative z-10">
                {/* Rating Stars staggering */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <motion.div
                      key={starIdx}
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + starIdx * 0.05 }}
                    >
                      <Star
                        size={13}
                        className={starIdx < test.rating ? "text-neon-purple fill-neon-purple" : "text-border-primary"}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Feedback Message */}
                <p className="text-text-primary text-sm md:text-base leading-relaxed italic font-serif font-light">
                  "{test.message}"
                </p>
              </div>

              {/* Client Profile Info layout */}
              <div className="mt-8 pt-6 border-t border-border-primary flex items-center gap-4 relative z-10">
                <img
                  src={test.clientImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"}
                  alt={test.clientName}
                  className="w-11 h-11 rounded-xl object-cover border border-border-primary grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-text-primary">{test.clientName}</h4>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">
                    {test.clientRole}, <span className="text-neon-purple font-bold">{test.clientCompany}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border-primary rounded-xl bg-bg-secondary">
            <p className="text-text-secondary text-sm font-mono uppercase tracking-wider">No feedback logged yet.</p>
          </div>
        )}

      </div>
    </section>
  );
}
