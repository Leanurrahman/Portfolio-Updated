/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { ArrowUp, Github, Linkedin, Facebook, Mail, Shield } from "lucide-react";
import { motion } from "motion/react";
import CosmicBackground from "./CosmicBackground";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { siteSettings, profile, isAdmin } = usePortfolio();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Services", target: "services" },
    { label: "Projects", target: "projects" },
    { label: "Skills", target: "skills" },
    { label: "Contact", target: "contact" }
  ];

  const socialLinks = profile.socialLinks || {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    email: "mailto:techbulletcodeyt@gmail.com"
  };

  return (
    <footer className="bg-bg-secondary border-t border-border-primary py-16 relative overflow-hidden transition-colors duration-350">
      
      {/* Subtle continuous cosmic background */}
      <CosmicBackground intensity={0.20} variant="footer" />
      
      {/* Absolute Big Background Text from specs */}
      <div className="absolute bottom-[-10%] left-0 right-0 text-center select-none pointer-events-none opacity-[0.015] dark:opacity-[0.02]">
        <span className="font-sans font-black text-[12vw] tracking-tighter uppercase leading-none text-text-primary">
          LEANUR.DEV
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 pb-10">
        
        {/* Left Column: Branding */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 group cursor-default">
            <span className="font-sans font-black tracking-tighter uppercase text-xl text-text-primary group-hover:text-neon-purple transition-colors">
              {siteSettings.logoText || "Leanur.dev"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
          </div>
          <p className="text-text-secondary text-xs leading-relaxed max-w-sm font-light">
            Full-Stack Developer from Bangladesh building high-performance, conversion-focused web applications.
          </p>

          <div className="pt-4 space-y-2">
            <p className="text-text-muted text-[10px] font-mono">
              {siteSettings.footerText || "© 2026 Leanur Rahman. All rights reserved."}
            </p>
            <button
              onClick={() => onNavigate("admin")}
              className="text-left text-[10px] font-mono text-text-muted hover:text-neon-purple cursor-pointer transition-colors focus:outline-none flex items-center gap-1.5 py-1 px-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple/20 rounded-lg w-fit"
            >
              <Shield size={11} className="text-neon-purple" />
              <span>{isAdmin ? "Dashboard Portal" : "Admin Panel Access"}</span>
            </button>
          </div>
        </div>

        {/* Middle Column: Quick jump links with Underline animation on hover */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-secondary font-black">Quick Links</h4>
          <div className="grid grid-cols-2 gap-3">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => onNavigate(item.target)}
                className="text-left text-xs font-mono text-text-secondary hover:text-neon-purple cursor-pointer transition-colors focus:outline-none relative py-1 w-fit group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-purple to-neon-purple transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Socials & Back To Top */}
        <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-secondary font-black md:text-right">Social Channels</h4>
            <div className="flex gap-2">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-colors hover:-translate-y-0.5"
                >
                  <Github size={13} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-colors hover:-translate-y-0.5"
                >
                  <Linkedin size={13} />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-colors hover:-translate-y-0.5"
                >
                  <Facebook size={13} />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email.replace("mailto:", "")}`}
                  className="p-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple/40 text-text-secondary hover:text-neon-purple rounded-xl transition-colors hover:-translate-y-0.5"
                >
                  <Mail size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Up arrow to return top */}
          <button
            onClick={handleBackToTop}
            className="p-2.5 bg-bg-primary border border-border-primary hover:border-neon-purple hover:text-neon-purple rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-[10px] font-mono focus:outline-none hover:shadow-md hover:shadow-neon-purple/5"
            title="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp size={12} className="animate-pulse" />
          </button>
        </div>

      </div>
    </footer>
  );
}
