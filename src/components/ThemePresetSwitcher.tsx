import React, { useState, useEffect, useRef } from "react";
import { useTheme, ThemePreset } from "../context/ThemeContext";
import { useExperience, EXPERIENCES, ExperienceId } from "../context/ExperienceContext";
import { usePortfolio } from "../context/PortfolioContext";
import { Palette, Check, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ThemePresetSwitcher() {
  const { preset, setPreset } = useTheme();
  const { currentExperience, transitionToExperience, isTransitioning, isExperienceEnabled } = useExperience();
  const { siteSettings, experienceSettings, isAdmin } = usePortfolio();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Escape key to close
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
        <Palette size={14} />
        <span className="text-[10px] font-mono tracking-widest uppercase">Theme</span>
      </div>
    );
  }

  // Simple themes
  const themePresets = [
    {
      id: "neon-purple" as ThemePreset,
      name: "Neon Purple",
      icon: "🟣",
      description: "Purple futuristic theme with neon violet glow, purple orbit effects, dark background, and white typography.",
      colors: ["#090014", "#8B5CF6"]
    },
    {
      id: "cosmic-orange" as ThemePreset,
      name: "Cosmic Orange",
      icon: "🌌",
      description: "Current black/orange universe theme with stars, orbit lines, orange glow, white typography, and cinematic motion.",
      colors: ["#050505", "#FF6A00"]
    },
    {
      id: "clean-light" as ThemePreset,
      name: "Clean Light",
      icon: "☀️",
      description: "White/off-white professional theme with black text, orange accent, subtle particles, clean cards, and minimal motion.",
      colors: ["#FFFFFF", "#FF6A00"]
    }
  ];

  // Advanced experiences registered mapping
  const advancedExpMap = [
    {
      id: "gta6" as ExperienceId,
      settingKey: "gta6",
      icon: "🌴",
      colors: ["#ff007f", "#ff5e00"]
    },
    {
      id: "apple" as ExperienceId,
      settingKey: "appleGlass",
      icon: "🍎",
      colors: ["#007AFF", "#ffffff"]
    },
    {
      id: "neon-gaming" as ExperienceId,
      settingKey: "neonGaming",
      icon: "🎮",
      colors: ["#1CD8D2", "#9B51E0"]
    },
    {
      id: "terminal" as ExperienceId,
      settingKey: "hackerTerminal",
      icon: "💻",
      colors: ["#00FF66", "#050B05"]
    }
  ];

  // Filter advanced experiences by settings & availability
  const activeSpecialExperiences = advancedExpMap.filter((exp) => {
    const settings = experienceSettings?.[exp.settingKey as keyof typeof experienceSettings];
    if (!settings) return false;
    // Admin can see disabled/hidden experiences for preview, visitors only see if enabled AND publicVisible
    if (isAdmin) {
      return settings.enabled ?? false;
    } else {
      return (settings.enabled && settings.publicVisible) ?? false;
    }
  }).map((exp) => {
    const settings = experienceSettings?.[exp.settingKey as keyof typeof experienceSettings];
    return {
      id: exp.id,
      name: settings?.displayName || (exp.id === "gta6" ? "GTA VI" : exp.id === "apple" ? "Apple Glass" : exp.id === "neon-gaming" ? "Neon Gaming" : "Hacker Terminal"),
      description: settings?.description || "",
      icon: exp.icon,
      colors: exp.colors
    };
  });

  // Calculate if we should show the "Special Experiences" section
  const showSpecialExperiences = (siteSettings?.showSpecialExperiences ?? true) && activeSpecialExperiences.length > 0;

  // Active label finder
  let activeLabel = "Cosmic Orange";
  if (currentExperience === "cosmic") {
    const currentPreset = themePresets.find((t) => t.id === preset);
    if (currentPreset) activeLabel = currentPreset.name;
  } else {
    const activeExp = activeSpecialExperiences.find((e) => e.id === currentExperience);
    if (activeExp) {
      activeLabel = activeExp.name;
    } else {
      // Fallback
      const defaultExp = EXPERIENCES.find((e) => e.id === currentExperience);
      if (defaultExp) activeLabel = defaultExp.name;
    }
  }

  return (
    <div className="relative inline-block text-left animate-fade-in" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => !isTransitioning && setIsOpen(!isOpen)}
        disabled={isTransitioning}
        aria-haspopup="true"
        aria-expanded={isOpen}
        id="theme-preset-switcher"
        className="h-9 px-3.5 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary text-text-primary rounded-xl flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer group hover:shadow-md hover:shadow-brand-orange/5 disabled:opacity-50"
      >
        <Palette size={14} className="text-brand-orange group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium">Theme: {activeLabel}</span>
        <ChevronDown
          size={12}
          className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-[#0c051a]/95 border border-pink-500/20 md:border-border-primary p-2.5 shadow-2xl backdrop-blur-md z-[100] max-h-[85vh] overflow-y-auto"
            role="menu"
          >
            {/* Theme Presets Section */}
            <div className="px-2.5 py-1.5 mb-1.5 border-b border-white/5 flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-pink-300 uppercase font-black">Theme Presets</span>
              <span className="text-[8px] text-text-secondary/70 mt-0.5 font-sans">Simple visual design presets</span>
            </div>
            
            <div className="space-y-1 mb-3">
              {themePresets.map((themeItem) => {
                const isSelected = currentExperience === "cosmic" && preset === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    onClick={() => {
                      setPreset(themeItem.id);
                      if (currentExperience !== "cosmic") {
                        transitionToExperience("cosmic");
                      }
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left flex flex-col transition-all duration-200 cursor-pointer focus:outline-none hover:bg-white/5 border ${
                      isSelected
                        ? "bg-white/10 border-pink-500/20"
                        : "border-transparent"
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{themeItem.icon}</span>
                        <span className={`text-[11px] font-mono tracking-wider font-bold ${isSelected ? "text-pink-400 font-extrabold" : "text-white"}`}>
                          {themeItem.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {/* Color preview dots */}
                        <div className="flex items-center gap-1">
                          {themeItem.colors.map((c, i) => (
                            <span key={i} className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        {isSelected && <Check size={12} className="text-pink-500 animate-pulse" />}
                      </div>
                    </div>
                    <p className="text-[9px] text-pink-200/60 mt-1 leading-normal pl-7">
                      {themeItem.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Special Experiences Section */}
            {showSpecialExperiences && (
              <>
                <div className="px-2.5 py-1.5 mb-1.5 border-b border-white/5 flex flex-col">
                  <span className="text-[10px] font-mono tracking-wider text-pink-300 uppercase font-black flex items-center gap-1">
                    <Sparkles size={10} className="text-pink-400" />
                    <span>Special Experiences</span>
                  </span>
                  <span className="text-[8px] text-text-secondary/70 mt-0.5 font-sans">Full interactive dynamic layouts</span>
                </div>

                <div className="space-y-1">
                  {activeSpecialExperiences.map((exp) => {
                    const isSelected = currentExperience === exp.id;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => {
                          transitionToExperience(exp.id);
                          setIsOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-xl text-left flex flex-col transition-all duration-200 cursor-pointer focus:outline-none hover:bg-white/5 border ${
                          isSelected
                            ? "bg-white/10 border-pink-500/20"
                            : "border-transparent"
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{exp.icon}</span>
                            <span className={`text-[11px] font-mono tracking-wider font-bold ${isSelected ? "text-pink-400 font-extrabold" : "text-white"}`}>
                              {exp.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Color preview dots */}
                            <div className="flex items-center gap-1">
                              {exp.colors.map((c, i) => (
                                <span key={i} className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                            {isSelected && <Check size={12} className="text-pink-500 animate-pulse" />}
                          </div>
                        </div>
                        <p className="text-[9px] text-pink-200/60 mt-1 leading-normal pl-7">
                          {exp.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
