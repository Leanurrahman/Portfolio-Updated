import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemePresetSwitcher from "../../components/ThemePresetSwitcher";

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
    available: { label: "AVAILABLE FOR WORK", color: "bg-pink-500 shadow-pink-500/50" },
    busy: { label: "ENGAGED IN PROJECTS", color: "bg-amber-500 shadow-amber-500/50" },
    "looking-for-offers": { label: "OPEN TO OFFERS", color: "bg-cyan-500 shadow-cyan-500/50" }
  };

  const activeStatus = statusMap[profile.availabilityStatus || "available"];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? "py-3 bg-[#0d0118]/85 border-b border-pink-500/35 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,0,127,0.15)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Neon Branded Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="group cursor-pointer flex items-center gap-2 focus:outline-none"
          >
            <span className="font-sans font-black italic tracking-tighter uppercase text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)] group-hover:scale-[1.03] transition-all duration-300">
              {siteSettings.logoText || "Leanur.dev"}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
          </button>

          {/* Desktop Navigation with Neon Underlines */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = currentSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className={`text-[11px] font-bold font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer relative py-1.5 px-1 focus:outline-none ${
                    isActive
                      ? "text-white drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]"
                      : "text-[#ffd5fb]/70 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,94,0,0.5)]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                      layoutId="gtaActiveIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Dynamic Switcher, Theme & Status */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Miami Mission Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1 bg-[#1e0834]/65 border border-pink-500/30 rounded-full shadow-[0_0_10px_rgba(255,0,127,0.1)]">
              <span className={`w-2 h-2 rounded-full animate-pulse ${activeStatus.color} shadow-[0_0_8px_rgba(236,72,153,0.8)]`} />
              <span className="text-[9px] font-mono tracking-widest uppercase text-pink-300 font-extrabold">
                {activeStatus.label}
              </span>
            </div>

            {/* Theme & Experience Switcher */}
            <ThemePresetSwitcher />
          </div>

          {/* Mobile Hamburg menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemePresetSwitcher />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 bg-[#16032a]/80 border border-pink-500/30 rounded-xl text-pink-300 hover:text-white transition-all focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Full-screen Mobile Drawer with Blurred Retro Glass UI */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[62px] z-30 bg-[#0d0118]/95 backdrop-blur-2xl md:hidden flex flex-col p-6 space-y-8 border-t border-pink-500/30 shadow-2xl shadow-pink-500/10"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Links */}
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = currentSection === item.target;
                return (
                  <button
                    key={item.target}
                    onClick={() => handleNavClick(item.target)}
                    className={`text-left text-xl font-black italic uppercase tracking-wider py-2.5 border-b border-pink-500/10 flex items-center justify-between ${
                      isActive 
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" 
                        : "text-[#ffd5fb]/80"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-pink-500">🌴</span>}
                  </button>
                );
              })}
            </div>

            {/* Mission status mobile view */}
            <div className="pt-6 border-t border-pink-500/20">
              <div className="flex items-center gap-2.5 bg-[#1a0830] p-4.5 rounded-2xl border border-pink-500/25">
                <span className={`w-2.5 h-2.5 rounded-full ${activeStatus.color} shadow-[0_0_10px_rgba(255,0,127,0.8)] animate-pulse`} />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-pink-300 uppercase tracking-widest font-black">Status update</span>
                  <span className="text-[11px] font-sans text-white font-bold tracking-widest uppercase">
                    {activeStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
