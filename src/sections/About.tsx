/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { MapPin, Mail, BookOpen, Briefcase, Award, CheckCircle2, Trophy, Clock } from "lucide-react";
import { motion } from "motion/react";
import CosmicBackground from "../components/CosmicBackground";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

// Viewport-Triggered Counter Animation Helper
function AnimatedCounter({ value, duration = 2, startCounter }: { value: number; duration?: number; startCounter: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounter) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 25);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, startCounter]);

  return <span>{count}</span>;
}

export default function About() {
  const { profile } = usePortfolio();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [activeBlock, setActiveBlock] = useState(0);

  const coreFocuses = [
    {
      title: "Frontend Mastery",
      desc: "Delivering fully responsive, highly performant, and premium visual interfaces using React, Next.js, and styled with Tailwind CSS."
    },
    {
      title: "Scalable Backends",
      desc: "Designing robust REST APIs and database structures with Node.js/Express, MongoDB, SQL, and secure Firebase integrations."
    },
    {
      title: "Interactive UX Design",
      desc: "Architecting clean, responsive layout guides, bento systems, and smooth page/component micro-interactions with Framer Motion."
    }
  ];

  const floatingTags = [
    "Clean Code", "Pixel Perfect", "SEO Ready", "Secure Auth", "CI/CD Setup", "Performance Tuning"
  ];

  return (
    <section 
      id="about" 
      className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350 overflow-hidden"
    >
      {/* Subtle continuous cosmic background */}
      <CosmicBackground intensity={0.35} variant="subtle" />
      
      {/* Background visual elements */}
      <div className="absolute top-1/4 right-5 w-80 h-80 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-5 w-80 h-80 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cinematic Section Heading with staggered reveal and section number */}
        <AnimatedSectionHeading 
          number="01" 
          badge="About" 
          title="Crafting Digital solutions" 
          subtitle="Combining meticulous architectural planning with high-fidelity creative UI implementations to build the next-generation web."
        />

        {/* Sticky Layout Grid with Scroll Storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 1. Left Sticky Profile/Identity Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6">
            <div className="relative">
              
              {/* Spinning cosmic/orbit accent behind the sticky profile card */}
              <div className="absolute -inset-10 pointer-events-none overflow-visible flex items-center justify-center -z-10 opacity-30 dark:opacity-40">
                <div className="absolute w-[115%] h-[115%] border border-dashed border-brand-purple/20 rounded-full animate-[spin_45s_linear_infinite]" />
                <div className="absolute w-[85%] h-[85%] border border-dashed border-neon-purple/15 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute w-2 h-2 bg-neon-purple rounded-full blur-[1px] top-6 left-1/4 animate-[pulse_2s_infinite]" />
                <div className="absolute w-1.5 h-1.5 bg-neon-purple/60 rounded-full bottom-10 right-1/4" />
              </div>

              {/* Elegant Profile Card Frame */}
              <motion.div 
                className="relative p-6 bg-bg-secondary border border-border-primary rounded-2xl shadow-xl overflow-hidden group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                whileInView={() => {
                  setHasEnteredViewport(true);
                  return {};
                }}
              >
                {/* Glowing border line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                <div className="space-y-6">
                  
                  {/* Profile Header Block */}
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={profile.name || "Leanur Rahman"}
                      className="w-16 h-16 rounded-xl object-cover border border-border-primary grayscale group-hover:grayscale-0 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-base font-black text-text-primary tracking-tight uppercase">
                        {profile.name || "Leanur Rahman"}
                      </h3>
                      <p className="text-[10px] font-mono text-neon-purple uppercase tracking-wider font-bold mt-0.5">
                        {profile.role || "Full Stack Developer"}
                      </p>
                    </div>
                  </div>

                  {/* Counter Stats Deck (Counts up on entering viewport) */}
                  <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-border-primary">
                    
                    <div className="p-4 bg-bg-primary border border-border-primary rounded-xl">
                      <div className="text-2xl font-black font-sans text-neon-purple tracking-tight leading-none">
                        <AnimatedCounter value={35} startCounter={hasEnteredViewport} />+
                      </div>
                      <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block mt-1.5 font-bold">Projects Built</span>
                    </div>
    
                    <div className="p-4 bg-bg-primary border border-border-primary rounded-xl">
                      <div className="text-2xl font-black font-sans text-neon-purple tracking-tight leading-none">
                        <AnimatedCounter value={18} startCounter={hasEnteredViewport} />+
                      </div>
                      <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block mt-1.5 font-bold">Tech Modules</span>
                    </div>
    
                    <div className="p-4 bg-bg-primary border border-border-primary rounded-xl">
                      <div className="text-2xl font-black font-sans text-neon-purple tracking-tight leading-none">
                        <AnimatedCounter value={24} startCounter={hasEnteredViewport} />+
                      </div>
                      <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block mt-1.5 font-bold">Clients Assisted</span>
                    </div>
    
                    <div className="p-4 bg-bg-primary border border-border-primary rounded-xl">
                      <div className="text-2xl font-black font-sans text-neon-purple tracking-tight leading-none">
                        <AnimatedCounter value={4} startCounter={hasEnteredViewport} />+
                      </div>
                      <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block mt-1.5 font-bold">Years Coding</span>
                    </div>
    
                  </div>

                  {/* Location and Contacts */}
                  <div className="space-y-4 pt-4 border-t border-border-primary text-xs text-text-secondary font-mono">
                    <div className="flex items-center gap-3">
                      <MapPin size={13} className="text-neon-purple" />
                      <span>{profile.location || "Chattogram, Bangladesh"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={13} className="text-neon-purple" />
                      <a href={`mailto:${profile.email}`} className="hover:text-neon-purple transition-colors truncate">
                        {profile.email || "techbulletcodeyt@gmail.com"}
                      </a>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>

          {/* 2. Right Scrollable Story Blocks with Active Highlight feedback */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Story Block 1: Bio Narrative */}
            <motion.div
              onViewportEnter={() => setActiveBlock(0)}
              viewport={{ amount: 0.5 }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${
                activeBlock === 0 
                  ? "bg-bg-secondary border-brand-purple/40 shadow-md scale-[1.01]" 
                  : "bg-transparent border-transparent opacity-55"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all ${activeBlock === 0 ? "bg-neon-purple scale-125" : "bg-text-muted"}`} />
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neon-purple font-bold">Biography</h4>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight leading-snug">
                Building High-Speed Interfaces & Robust Architectures with Absolute Precision.
              </h3>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed whitespace-pre-line font-light">
                {profile.bio || "Hi, I’m Leanur Rahman, a passionate CSE student at International Islamic University Chittagong and a Full Stack Developer focused on building clean, responsive, and scalable web applications. I enjoy solving real-world problems through code and creating digital products that are fast, user-friendly, and business-focused."}
              </p>
            </motion.div>

            {/* Story Block 2: Core Specializations */}
            <motion.div
              onViewportEnter={() => setActiveBlock(1)}
              viewport={{ amount: 0.5 }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${
                activeBlock === 1 
                  ? "bg-bg-secondary border-brand-purple/40 shadow-md scale-[1.01]" 
                  : "bg-transparent border-transparent opacity-55"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all ${activeBlock === 1 ? "bg-neon-purple scale-125" : "bg-text-muted"}`} />
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neon-purple font-bold">Core Capabilities</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {coreFocuses.map((focus, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-bg-primary border border-border-primary rounded-xl hover:border-neon-purple/30 transition-all space-y-1.5 shadow-sm"
                  >
                    <h5 className="font-black text-text-primary text-sm uppercase tracking-wide">
                      {focus.title}
                    </h5>
                    <p className="text-text-secondary text-xs leading-relaxed font-light">
                      {focus.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Story Block 3: Methodology Values */}
            <motion.div
              onViewportEnter={() => setActiveBlock(2)}
              viewport={{ amount: 0.5 }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${
                activeBlock === 2 
                  ? "bg-bg-secondary border-brand-purple/40 shadow-md scale-[1.01]" 
                  : "bg-transparent border-transparent opacity-55"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all ${activeBlock === 2 ? "bg-neon-purple scale-125" : "bg-text-muted"}`} />
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neon-purple font-bold">Core values</h4>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {floatingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-2 bg-bg-primary border border-border-primary text-text-secondary font-mono text-[10px] uppercase tracking-wider rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Story Block 4: Academic Background */}
            <motion.div
              onViewportEnter={() => setActiveBlock(3)}
              viewport={{ amount: 0.5 }}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${
                activeBlock === 3 
                  ? "bg-bg-secondary border-brand-purple/40 shadow-md scale-[1.01]" 
                  : "bg-transparent border-transparent opacity-55"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all ${activeBlock === 3 ? "bg-neon-purple scale-125" : "bg-text-muted"}`} />
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neon-purple font-bold">Education</h4>
              </div>

              <div className="p-6 bg-bg-primary border border-border-primary rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-border-primary">
                  <BookOpen size={16} className="text-neon-purple" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-primary font-black">Academic Background</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-black text-text-primary block uppercase">
                    {profile.education?.degree || "B.Sc. in Computer Science & Engineering"}
                  </span>
                  <span className="text-xs text-text-secondary block font-light">
                    {profile.education?.institution || "International Islamic University Chittagong"}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
