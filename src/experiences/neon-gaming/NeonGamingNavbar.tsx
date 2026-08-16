import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemePresetSwitcher from "../../components/ThemePresetSwitcher";

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function NeonGamingNavbar({ currentSection, onNavigate }: NavbarProps) {
  const { siteSettings, experienceSettings } = usePortfolio();
  const gamingSettings = experienceSettings?.neonGaming;

  const cyanGlow = gamingSettings?.accentCyan || "#1CD8D2";
  const greenGlow = gamingSettings?.accentGreen || "#00BF8F";

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
    { label: "[01] HOME", target: "home" },
    { label: "[02] ABOUT", target: "about" },
    { label: "[03] SERVICES", target: "services" },
    { label: "[04] PROJECTS", target: "projects" },
    { label: "[05] SKILLS", target: "skills" },
    { label: "[06] CONTACT", target: "contact" }
  ];

  const handleNavClick = (target: string) => {
    onNavigate(target);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex justify-center ${
          isScrolled ? "pt-3" : "pt-6"
        }`}
      >
        {/* Gaming glass-panel styled navigation deck */}
        <div
          className="mx-6 max-w-7xl w-full px-6 py-2.5 rounded-2xl transition-all duration-500 flex items-center justify-between backdrop-blur-xl border"
          style={{
            backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.02)",
            borderColor: isScrolled ? `${cyanGlow}33` : "rgba(255, 255, 255, 0.05)",
            boxShadow: isScrolled ? `0 0 20px ${cyanGlow}26` : "none"
          }}
        >
          {/* Cybernetic Neon Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="group cursor-pointer flex items-center gap-2 focus:outline-none text-left"
          >
            <span 
              className="font-mono font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text group-hover:brightness-115 transition-all"
              style={{ backgroundImage: `linear-gradient(to right, ${cyanGlow}, ${greenGlow})` }}
            >
              {siteSettings.logoText || "Leanur.dev"}
            </span>
            <span 
              className="w-2 h-2 rounded-full bg-[#1CD8D2] animate-pulse"
              style={{
                backgroundColor: cyanGlow,
                boxShadow: `0 0 8px ${cyanGlow}`
              }}
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className="text-[10px] font-bold font-mono tracking-widest transition-all duration-300 cursor-pointer relative py-1.5 px-4 rounded-lg border"
                  style={{
                    color: isActive ? cyanGlow : "rgba(255, 255, 255, 0.6)",
                    borderColor: isActive ? `${cyanGlow}59` : "transparent",
                    backgroundColor: isActive ? `${cyanGlow}0d` : "transparent",
                    boxShadow: isActive ? `0 0 12px ${cyanGlow}26` : "none"
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemePresetSwitcher />
          </div>

          {/* Mobile Toggles */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemePresetSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white/[0.05] border border-white/10 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.1] transition-all focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[70px] z-30 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col p-6 space-y-6 border-t border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = currentSection === item.target;
                return (
                  <button
                    key={item.target}
                    onClick={() => handleNavClick(item.target)}
                    className="text-left font-mono font-bold tracking-widest text-sm py-3.5 px-4 rounded-xl border flex items-center justify-between"
                    style={{
                      color: isActive ? cyanGlow : "rgba(255, 255, 255, 0.7)",
                      borderColor: isActive ? `${cyanGlow}66` : "rgba(255, 255, 255, 0.05)",
                      backgroundColor: isActive ? `${cyanGlow}0d` : "rgba(255, 255, 255, 0.02)",
                      boxShadow: isActive ? `0 0 15px ${cyanGlow}26` : "none"
                    }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{
                          backgroundColor: cyanGlow,
                          boxShadow: `0 0 6px ${cyanGlow}`
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
