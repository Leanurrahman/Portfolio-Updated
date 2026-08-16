import React, { useState, useEffect, useRef } from "react";
import { useExperience, EXPERIENCES, ExperienceId } from "../context/ExperienceContext";
import { Compass, Check, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ExperienceSwitcher() {
  const { currentExperience, transitionToExperience, isTransitioning, enabledExperiences } = useExperience();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard accessibility
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 px-3 flex items-center gap-1.5 border border-border-primary rounded-xl text-text-secondary opacity-50">
        <Compass size={14} />
        <span className="text-[10px] font-mono tracking-widest uppercase">Experience</span>
      </div>
    );
  }

  const activeExp = EXPERIENCES.find((e) => e.id === currentExperience) || EXPERIENCES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => !isTransitioning && setIsOpen(!isOpen)}
        disabled={isTransitioning}
        aria-haspopup="true"
        aria-expanded={isOpen}
        id="experience-switcher-button"
        className="h-9 px-3.5 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary text-text-primary rounded-xl flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer group hover:shadow-md hover:shadow-brand-orange/5 disabled:opacity-50"
      >
        <Compass size={14} className="text-brand-orange group-hover:rotate-45 transition-transform duration-300" />
        <span className="hidden sm:inline font-medium">{currentExperience === "gta6" ? "Experience" : activeExp.name}</span>
        <span className="sm:hidden font-medium">Experience</span>
        <ChevronDown
          size={12}
          className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Experience Selection Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-bg-secondary border border-border-primary p-2 shadow-2xl backdrop-blur-md z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="experience-switcher-button"
          >
            <div className="px-2.5 py-1.5 mb-1.5 border-b border-border-primary/50 flex flex-col">
              <span className="text-[9px] font-mono tracking-wider text-text-muted uppercase">Switch Dimension</span>
              <span className="text-[10px] text-text-secondary mt-0.5">Choose your portfolio experience</span>
            </div>

            <div className="space-y-1">
              {enabledExperiences.map((exp) => {
                const isSelected = currentExperience === exp.id;
                
                return (
                  <button
                    key={exp.id}
                    disabled={exp.comingSoon || isTransitioning}
                    onClick={() => {
                      if (!exp.comingSoon) {
                        transitionToExperience(exp.id);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-left flex flex-col transition-all duration-200 cursor-pointer focus:outline-none relative group/item ${
                      isSelected
                        ? "bg-brand-soft-bg text-brand-orange"
                        : exp.comingSoon
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                        : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{exp.emoji}</span>
                        <span className={`text-[11px] font-mono tracking-wider font-bold ${isSelected ? "text-brand-orange" : "text-text-primary"}`}>
                          {exp.name}
                        </span>
                      </div>

                      {isSelected ? (
                        <Check size={12} className="text-brand-orange animate-pulse" />
                      ) : exp.comingSoon ? (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-border-primary text-[8px] font-mono tracking-widest uppercase font-bold text-text-muted">
                          <Lock size={8} />
                          <span>Soon</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <p className="text-[9px] text-text-muted mt-1 leading-normal pl-7 group-hover/item:text-text-secondary transition-colors">
                      {exp.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
