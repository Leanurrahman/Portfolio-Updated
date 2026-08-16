import React, { createContext, useContext, useEffect, useState } from "react";
import { usePortfolio } from "./PortfolioContext";

export type ExperienceId = "cosmic" | "gta6" | "apple" | "neon-gaming" | "terminal";

export interface Experience {
  id: ExperienceId;
  name: string;
  emoji: string;
  description: string;
  comingSoon: boolean;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "cosmic",
    name: "Cosmic Developer",
    emoji: "🌌",
    description: "Deep space universe with orbits, starfields, and clean glowing cards",
    comingSoon: false,
  },
  {
    id: "gta6",
    name: "GTA VI",
    emoji: "🌴",
    description: "Vibrant neon pink sunset aesthetic inspired by Vice City",
    comingSoon: false,
  },
  {
    id: "apple",
    name: "Apple Glass",
    emoji: "🍎",
    description: "Ultra-minimal bento layouts, premium glassmorphism, and subtle clean shadows",
    comingSoon: false,
  },
  {
    id: "neon-gaming",
    name: "Neon Gaming",
    emoji: "🎮",
    description: "Retro-futuristic black canvas with neon cyan, green, and purple glows",
    comingSoon: false,
  },
  {
    id: "terminal",
    name: "Hacker Terminal",
    emoji: "💻",
    description: "Monochrome green phosphor terminal theme with retro CRT scans",
    comingSoon: true,
  },
];

interface ExperienceContextType {
  currentExperience: ExperienceId;
  isTransitioning: boolean;
  nextExperience: ExperienceId | null;
  transitionToExperience: (id: ExperienceId) => void;
  enabledExperiences: Experience[];
  isExperienceEnabled: (id: ExperienceId) => boolean;
  // Global preset settings for simple presentation changes in current components
  stylePreset: {
    fontClass: string;
    containerClass: string;
    buttonPrimaryClass: string;
    buttonSecondaryClass: string;
    cardClass: string;
  };
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const { siteSettings, experienceSettings, isAdmin } = usePortfolio();

  const isExperienceEnabled = (id: ExperienceId): boolean => {
    if (id === "cosmic") return true;
    if (!experienceSettings) return true;
    
    const keyMap: Record<ExperienceId, "gta6" | "appleGlass" | "neonGaming" | "hackerTerminal"> = {
      gta6: "gta6",
      apple: "appleGlass",
      "neon-gaming": "neonGaming",
      terminal: "hackerTerminal",
      cosmic: "cosmic" as any
    };

    const settingKey = keyMap[id];
    if (!settingKey) return false;
    
    const settings = experienceSettings[settingKey];
    if (!settings) return false;

    if (isAdmin) {
      return settings.enabled ?? false;
    } else {
      return (settings.enabled && settings.publicVisible) ?? false;
    }
  };

  const enabledExperiences = EXPERIENCES.filter(
    (exp) => exp.comingSoon || isExperienceEnabled(exp.id)
  );

  const [currentExperience, setCurrentExperience] = useState<ExperienceId>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-experience") as ExperienceId;
      if (saved && EXPERIENCES.some((exp) => exp.id === saved && !exp.comingSoon)) {
        return saved;
      }
    }
    return "cosmic";
  });

  // Sync with defaultExperience and handle disabled experience fallbacks
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("portfolio-experience") as ExperienceId) : null;
    const defaultId = (siteSettings?.defaultExperience === "apple-glass" || siteSettings?.defaultExperience === "appleGlass" ? "apple" : siteSettings?.defaultExperience === "neonGaming" ? "neon-gaming" : siteSettings?.defaultExperience === "hackerTerminal" ? "terminal" : siteSettings?.defaultExperience) as ExperienceId || "cosmic";
    
    if (saved && saved !== "cosmic") {
      if (!isExperienceEnabled(saved)) {
        // Clear invalid saved value
        if (typeof window !== "undefined") {
          localStorage.removeItem("portfolio-experience");
        }
        
        // Fallback to cosmic
        setCurrentExperience("cosmic");
        
        // Fall back to admin-selected default theme preset
        const defaultTheme = siteSettings?.defaultThemePreset || siteSettings?.fallbackTheme || "cosmic-orange";
        if (typeof window !== "undefined") {
          const root = window.document.documentElement;
          root.setAttribute("data-theme-preset", defaultTheme);
          localStorage.setItem("portfolio-theme-preset", defaultTheme);
        }
      } else {
        setCurrentExperience(saved);
      }
    } else {
      // If no saved preference, or saved is "cosmic", honor defaultExperience from site settings if enabled
      if (defaultId && defaultId !== "cosmic" && isExperienceEnabled(defaultId)) {
        setCurrentExperience(defaultId);
      } else {
        setCurrentExperience("cosmic");
      }
    }
  }, [siteSettings, experienceSettings, isAdmin]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextExperience, setNextExperience] = useState<ExperienceId | null>(null);

  // Define dynamic style tokens to pass down easily to components
  const [stylePreset, setStylePreset] = useState({
    fontClass: "font-sans",
    containerClass: "bg-bg-primary text-text-primary",
    buttonPrimaryClass: "bg-gradient-to-r from-brand-orange to-brand-orange-hover text-white shadow-md shadow-brand-orange/20",
    buttonSecondaryClass: "border border-border-primary hover:bg-brand-soft-bg text-text-secondary hover:text-text-primary",
    cardClass: "bg-bg-secondary border border-border-primary backdrop-blur-sm",
  });

  // Keep dynamic stylesheet data-theme synced
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-experience", currentExperience);
    localStorage.setItem("portfolio-experience", currentExperience);

    // Update preset values based on selected experience
    if (currentExperience === "cosmic") {
      setStylePreset({
        fontClass: "font-sans",
        containerClass: "bg-bg-primary text-text-primary",
        buttonPrimaryClass: "bg-gradient-to-r from-brand-orange to-brand-orange-hover text-white shadow-lg shadow-brand-orange/20",
        buttonSecondaryClass: "border border-border-primary hover:bg-brand-soft-bg text-text-secondary hover:text-text-primary",
        cardClass: "bg-bg-secondary border border-border-primary backdrop-blur-sm",
      });
    } else if (currentExperience === "gta6") {
      setStylePreset({
        fontClass: "font-sans",
        containerClass: "bg-[#0d0118] text-[#ffffff]",
        buttonPrimaryClass: "bg-gradient-to-r from-[#ff007f] via-[#ff5e00] to-[#ffaa00] text-white shadow-lg shadow-pink-500/25 border border-pink-400/30 uppercase tracking-widest font-black",
        buttonSecondaryClass: "border border-pink-500/35 bg-pink-500/5 hover:bg-pink-500/20 text-[#ffb8e4] hover:text-white uppercase tracking-widest font-bold backdrop-blur-sm",
        cardClass: "bg-[#1e0834]/50 border border-pink-500/30 backdrop-blur-md shadow-xl shadow-pink-500/5",
      });
    } else if (currentExperience === "apple") {
      setStylePreset({
        fontClass: "font-sans",
        containerClass: "bg-[#F8FAFC] text-[#0F172A]",
        buttonPrimaryClass: "bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white shadow-lg shadow-blue-500/10 font-semibold tracking-wide rounded-xl hover:brightness-105",
        buttonSecondaryClass: "border border-slate-900/10 bg-white/60 hover:bg-slate-900/5 text-[#475569] hover:text-[#0F172A] font-semibold tracking-wide backdrop-blur-md rounded-xl shadow-sm",
        cardClass: "bg-white/68 border border-slate-900/10 backdrop-blur-xl shadow-xl shadow-slate-100/50 rounded-2xl",
      });
    } else if (currentExperience === "neon-gaming") {
      setStylePreset({
        fontClass: "font-sans",
        containerClass: "bg-black text-[#FFFFFF]",
        buttonPrimaryClass: "bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] text-black font-black tracking-widest uppercase rounded-xl hover:brightness-110 shadow-lg shadow-emerald-500/10",
        buttonSecondaryClass: "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold tracking-widest uppercase rounded-xl backdrop-blur-md shadow-sm",
        cardClass: "bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/80 rounded-2xl",
      });
    }
  }, [currentExperience]);

  const transitionToExperience = (id: ExperienceId) => {
    const targetExp = EXPERIENCES.find((e) => e.id === id);
    if (!targetExp || targetExp.comingSoon) return; // Prevent transitioning to coming soon themes

    if (id === currentExperience) return;

    setNextExperience(id);
    setIsTransitioning(true);

    // Simulated multi-stage game-like load transition
    // Stage 1: Fade out / Loader enters (0ms - 1200ms)
    // Stage 2: Swap state to next experience (1500ms)
    // Stage 3: Fade in next experience / Exit loader (2500ms)
    setTimeout(() => {
      setCurrentExperience(id);
    }, 1500);

    setTimeout(() => {
      setIsTransitioning(false);
      setNextExperience(null);
    }, 3200);
  };

  return (
    <ExperienceContext.Provider
      value={{
        currentExperience,
        isTransitioning,
        nextExperience,
        transitionToExperience,
        enabledExperiences,
        isExperienceEnabled,
        stylePreset,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
}
