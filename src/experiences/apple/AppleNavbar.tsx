import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemePresetSwitcher from "../../components/ThemePresetSwitcher";

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function AppleNavbar({ currentSection, onNavigate }: NavbarProps) {
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex justify-center ${
          isScrolled ? "pt-3" : "pt-6"
        }`}
      >
        {/* Floating rounded pill with backdrop-blur */}
        <div
          className={`mx-6 max-w-7xl w-full px-6 py-2.5 rounded-full transition-all duration-500 flex items-center justify-between ${
            isScrolled
              ? "bg-white/70 border border-slate-900/5 backdrop-blur-xl shadow-lg shadow-slate-100/40"
              : "bg-white/20 border border-transparent backdrop-blur-sm"
          }`}
        >
          {/* Elegant Slate Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="group cursor-pointer flex items-center gap-1.5 focus:outline-none"
          >
            <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 hover:text-blue-600 transition-colors duration-300">
              {siteSettings.logoText || "Leanur.dev"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = currentSection === item.target;
              return (
                <button
                  key={item.target}
                  onClick={() => handleNavClick(item.target)}
                  className={`text-[11px] font-semibold font-sans tracking-wide transition-all duration-300 cursor-pointer relative py-1 px-3 focus:outline-none ${
                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 bg-blue-500/5 rounded-full -z-10"
                      layoutId="appleActivePill"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Switcher & Theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemePresetSwitcher />
          </div>

          {/* Mobile Toggles */}
          <div className="md:hidden flex items-center gap-2">
            <ThemePresetSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white/80 border border-slate-900/5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[70px] z-30 bg-white/95 backdrop-blur-2xl md:hidden flex flex-col p-6 space-y-6 border-t border-slate-900/5 shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentSection === item.target;
                return (
                  <button
                    key={item.target}
                    onClick={() => handleNavClick(item.target)}
                    className={`text-left text-lg font-bold tracking-tight py-2.5 border-b border-slate-100 flex items-center justify-between ${
                      isActive ? "text-blue-600" : "text-slate-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
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
