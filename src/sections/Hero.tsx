/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Github, Linkedin, Facebook, Mail, FileText, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import MagneticButton from "../components/MagneticButton";
import Marquee from "../components/Marquee";
import CosmicBackground from "../components/CosmicBackground";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { profile } = usePortfolio();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const socialLinks = profile.socialLinks || {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    email: "mailto:techbulletcodeyt@gmail.com"
  };

  const marqueeSkills = [
    "Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Framer Motion",
    "Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs", "Git", "GitHub"
  ];

  // Mouse move parallax variables
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 12;
      const y = (e.clientY - innerHeight / 2) / 12;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll Linked Transformations using useScroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Title elements translate upwards and fade
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Visual/Avatar container scales down and drifts slightly
  const avatarScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const avatarOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Background floating tag parallax & scroll drift
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Split lines for kinetic typography
  const line1 = "I BUILD";
  const line2 = "FULL-STACK WEB";
  const line3 = "EXPERIENCES";
  const line4 = "THAT HELP BRANDS GROW";

  const renderKineticLine = (text: string, isOutlined: boolean, delay: number) => {
    const words = text.split(" ");
    return (
      <div className="overflow-hidden flex flex-wrap gap-x-4 py-1">
        {words.map((word, wIdx) => (
          <motion.span
            key={wIdx}
            className={`block font-black tracking-tighter uppercase font-sans text-4xl sm:text-6xl md:text-8xl leading-[0.95] ${
              isOutlined
                ? "text-transparent stroke-text"
                : "text-text-primary"
            }`}
            style={isOutlined ? { WebkitTextStroke: "1px var(--text-primary)" } : {}}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.85,
              delay: delay + wIdx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-hidden bg-bg-primary transition-colors duration-350"
    >
      
      {/* Animated satisfying universe background overlay (strongest 100% cosmic effect) */}
      <CosmicBackground intensity={1.0} variant="hero" />

      {/* Subtle purple radial glow behind hero text for enhanced contrast and premium look */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-purple/[0.12] dark:bg-brand-purple/[0.08] blur-[140px] pointer-events-none select-none z-0" />

      {/* Floating decorative tags with scroll drift */}
      {!isMobile && (
        <>
          <motion.div 
            style={{ y: floatY1, rotate: -6 }}
            className="absolute top-1/4 left-10 p-3 bg-bg-card/85 backdrop-blur-md border border-brand-purple/30 text-neon-purple text-xs font-mono tracking-widest uppercase rounded-xl select-none pointer-events-none z-10 shadow-lg shadow-brand-purple/5"
          >
            ✦ ULTRA-PERFORMANCE
          </motion.div>
          <motion.div 
            style={{ y: floatY2, rotate: 6 }}
            className="absolute bottom-1/4 right-10 p-3 bg-bg-card/85 backdrop-blur-md border border-brand-purple/20 text-text-secondary text-xs font-mono tracking-widest uppercase rounded-xl select-none pointer-events-none z-10 shadow-lg"
          >
            ✦ RIGOROUS CRAFTSMANSHIP
          </motion.div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Kinetic typography and actions */}
        <motion.div 
          style={{ y: isMobile ? 0 : titleY, opacity: isMobile ? 1 : titleOpacity }}
          className="lg:col-span-8 space-y-8"
        >
          
          {/* Availability Status Indicator Badge */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-text-secondary italic font-serif">
                Based in Chattogram, Bangladesh
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="block"
            >
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neon-purple font-black border border-brand-purple/35 px-3 py-1 rounded-full bg-brand-purple/[0.06] backdrop-blur-sm">
                {profile.availabilityStatus === "available" ? "Open for Remote Full-Stack Work" : "Engineering Lead"}
              </span>
            </motion.div>
          </div>

          {/* Kinetic Typography Headings */}
          <div className="flex flex-col space-y-1">
            {renderKineticLine(line1, false, 0.1)}
            {renderKineticLine(line2, true, 0.25)}
            {renderKineticLine(line3, false, 0.4)}
            {renderKineticLine(line4, true, 0.55)}
          </div>

          {/* Tagline Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl font-light font-sans"
          >
            {profile.tagline || "CSE at IIUC. Solving real-world problems through high-performance Full-Stack applications using Next.js & Firebase."}
          </motion.p>

          {/* Social Icons with Premium Floating Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-wrap gap-3"
          >
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary hover:border-brand-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                title="GitHub Profile"
              >
                <Github size={15} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary hover:border-brand-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                title="LinkedIn Profile"
              >
                <Linkedin size={15} />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary hover:border-brand-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                title="Facebook Profile"
              >
                <Facebook size={15} />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email.replace("mailto:", "")}`}
                className="p-3 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary hover:border-brand-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                title="Direct Email"
              >
                <Mail size={15} />
              </a>
            )}
          </motion.div>

          {/* Premium CTA Buttons with Magnetic pull effects */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <MagneticButton
              onClick={() => onNavigate("contact")}
              className="px-8 py-4.5 bg-gradient-to-r from-brand-purple to-neon-purple text-white hover:brightness-110 font-bold uppercase text-[10px] tracking-widest transition-all rounded-xl shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/35 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Hire Me</span>
                <ArrowRight size={13} />
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate("projects")}
              className="px-8 py-4.5 border border-brand-purple hover:bg-brand-purple/[0.08] text-brand-purple font-bold uppercase text-[10px] tracking-widest transition-all rounded-xl cursor-pointer"
            >
              <span>View Projects</span>
            </MagneticButton>

            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-text-secondary hover:text-neon-purple flex items-center gap-1.5 text-xs font-mono tracking-widest transition-colors uppercase ml-2"
              >
                <FileText size={13} className="text-neon-purple" />
                <span>CV File</span>
              </a>
            )}
          </motion.div>

        </motion.div>

        {/* Right Column: Visual Portrait Avatar & Stats Deck */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <motion.div
            style={{ 
              scale: isMobile ? 1 : avatarScale, 
              y: isMobile ? 0 : avatarY, 
              opacity: isMobile ? 1 : avatarOpacity 
            }}
            className="relative w-[280px] h-[340px] sm:w-[300px] sm:h-[370px]"
          >
            {/* Ambient glows */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-purple/25 to-transparent blur-xl animate-pulse" />
            
            {/* Avatar container frame */}
            <div className="absolute inset-0 bg-bg-secondary border border-border-primary rounded-2xl p-2.5 shadow-2xl">
              <div className="w-full h-full rounded-xl overflow-hidden bg-bg-primary relative border border-border-primary">
                <img
                  src={profile.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"}
                  alt={profile.name || "Leanur Rahman"}
                  className="w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-bg-primary border border-border-primary backdrop-blur-md flex items-center justify-between shadow-lg">
                  <div>
                    <h4 className="text-xs font-black text-text-primary tracking-tight">{profile.name || "Leanur Rahman"}</h4>
                    <p className="text-[9px] font-mono text-neon-purple uppercase tracking-widest font-bold">{profile.role || "Full Stack Engineer"}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                </div>
              </div>
            </div>
            
            {/* Floating Admin Stats Panel */}
            <div className="absolute -bottom-6 -left-10 w-[210px] bg-bg-card border border-border-primary p-4.5 rounded-xl shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 hidden sm:block z-20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">Admin Stats</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-bg-secondary p-3 rounded-lg border border-border-primary">
                  <div className="text-[8px] text-text-secondary mb-0.5 uppercase tracking-tighter font-semibold">Stack Performance</div>
                  <div className="text-sm font-bold font-serif italic text-text-primary leading-none">Fast / Optimized</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-r from-brand-purple to-neon-purple p-2.5 rounded-lg text-white">
                    <div className="text-[8px] font-bold mb-0.5 uppercase">Uptime</div>
                    <div className="text-xs font-black tracking-tight leading-none">99.9%</div>
                  </div>
                  <div className="bg-bg-secondary p-2.5 rounded-lg border border-border-primary text-text-primary">
                    <div className="text-[8px] text-text-secondary mb-0.5 uppercase">CSE</div>
                    <div className="text-xs font-bold tracking-tight leading-none">IIUC</div>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Floating Client Badge */}
            <div className="absolute -bottom-10 -right-4 text-right">
              <div className="text-[44px] font-black font-serif italic tracking-tighter text-neon-purple leading-none">24+</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Clients Assisted</div>
            </div>
            
          </motion.div>
        </div>
 
      </div>
 
      {/* Elegant mouse scroll indicator at the bottom of hero */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none hidden md:flex">
        <span className="text-[8px] font-mono tracking-widest text-text-secondary uppercase">Scroll Down</span>
        <div className="w-5 h-9 rounded-full border border-border-primary flex justify-center p-1.5">
          <motion.div
            className="w-1.5 h-2 rounded-full bg-neon-purple"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>
 
      {/* Slide skill marquee at Hero footer */}
      <div className="mt-20 w-full border-t border-border-primary py-3 bg-bg-secondary relative z-20">
        <Marquee items={marqueeSkills} speed={30} />
      </div>
    </section>
  );
}
