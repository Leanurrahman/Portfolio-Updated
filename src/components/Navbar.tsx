/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemePresetSwitcher from "./ThemePresetSwitcher";

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function Navbar({ currentSection, onNavigate }: NavbarProps) {
  const { siteSettings, profile } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Services", target: "services" },
    { label: "Projects", target: "projects" },
    { label: "Skills", target: "skills" },
    { label: "Contact", target: "contact" }
  ];

  const handleNavClick = (target: string) => {
    onNavigate(target);
    setIsMobileMenuOpen(false);
  };

  const statusMap = {
    available: { label: "Available for work", color: "bg-emerald-500 shadow-emerald-500/50" },
    busy: { label: "Booked Out", color: "bg-amber-500 shadow-amber-500/50" },
    "looking-for-offers": { label: "Seeking Roles", color: "bg-cyan-500 shadow-cyan-500/50" }
  };

  const activeStatus = statusMap[profile.availabilityStatus || "available"];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? "py-3.5 bg-bg-primary/95 border-b border-border-primary backdrop-blur-md shadow-sm"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="group cursor-pointer flex items-center gap-1.5 focus:outline-none"
          >
            <span className="font-sans font-black tracking-tighter uppercase text-xl text-text-primary group-hover:text-neon-purple transition-colors">
              {siteSettings.logoText || "Leanur.dev"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple group-hover:scale-125 transition-transform" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNavClick(item.target)}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-1 focus:outline-none ${
                  currentSection === item.target
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
                {currentSection === item.target && (
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-purple"
                    layoutId="activeIndicator"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Availability and Theme Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Availability status badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-bg-secondary border border-border-primary rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeStatus.color} shadow-[0_0_8px]`} />
              <span className="text-[10px] font-mono tracking-wider uppercase text-text-secondary">
                {activeStatus.label}
              </span>
            </div>

            {/* Theme & Experience Switcher */}
            <ThemePresetSwitcher />
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden flex items-center gap-2">
            
            {/* Mobile Theme & Experience Switcher */}
            <ThemePresetSwitcher />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-bg-secondary border border-border-primary rounded-xl text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[65px] z-30 bg-bg-primary md:hidden flex flex-col p-6 space-y-8 border-t border-border-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Nav links */}
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className={`text-left text-lg font-bold py-2 border-b border-border-primary ${
                    currentSection === item.target ? "text-neon-purple" : "text-text-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Availability status (mobile context) */}
            <div className="pt-6 border-t border-border-primary">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeStatus.color} shadow-[0_0_10px] animate-pulse`} />
                <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                  {activeStatus.label}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
