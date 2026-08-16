/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ExperienceProvider, useExperience } from "./context/ExperienceContext";
import ExperienceLoader from "./components/ExperienceLoader";
import ExperienceTransitionOverlay from "./components/ExperienceTransitionOverlay";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import Footer from "./components/Footer";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ChatWidget from "./components/chat/ChatWidget";
import About from "./sections/About";
import Services from "./sections/Services";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import WorkProcess from "./sections/WorkProcess";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
const AppleExperience = React.lazy(() => import("./experiences/apple/AppleExperience"));
const NeonGamingExperience = React.lazy(() => import("./experiences/neon-gaming/NeonGamingExperience"));
import { ShieldAlert, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function PortfolioApp() {
  const { siteSettings, isAdmin } = usePortfolio();
  const { currentExperience } = useExperience();
  
  // Preloader session-track or simple refresh state
  const [loading, setLoading] = useState(true);

  // Custom router state: 'public' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<"public" | "admin">("public");
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position to update navbar active state automatically
  useEffect(() => {
    if (currentRoute !== "public") return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ["home", "about", "services", "projects", "skills", "contact"];
          const scrollPosition = window.scrollY + 200;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentRoute]);

  // Master navigation orchestrator
  const handleNavigate = (target: string) => {
    if (target === "admin") {
      setCurrentRoute("admin");
      window.scrollTo({ top: 0 });
      return;
    }

    // Switch route to public first if in admin dashboard
    setCurrentRoute("public");

    // Allow state shift to finish before finding DOM element
    setTimeout(() => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // 1. Mount Cinematic preloader if loading
  if (loading && currentRoute === "public") {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  // 2. Mount Admin Dashboard panel if requested
  if (currentRoute === "admin") {
    if (isAdmin) {
      return (
        <AdminDashboard
          onExit={() => {
            setCurrentRoute("public");
            window.scrollTo({ top: 0 });
          }}
        />
      );
    }
    return (
      <AdminLogin
        onBack={() => {
          setCurrentRoute("public");
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  // 3. Mount Maintenance mode intercept if activated (excluding logged in admin previews)
  if (siteSettings.maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative text-text-primary">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-neon-purple/5 blur-[120px]" />
        
        <motion.div
          className="relative max-w-md bg-bg-secondary border border-border-primary p-8 rounded-3xl text-center space-y-6 backdrop-blur-md shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="inline-flex p-4 bg-brand-purple/10 border border-brand-purple/25 text-neon-purple rounded-2xl animate-pulse">
            <ShieldAlert size={36} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight font-sans">Under Construction</h2>
            <p className="text-text-secondary text-xs leading-relaxed">
              {siteSettings.logoText || "Leanur.dev"} is currently undergoing routine maintenance and database upgrades to improve layout response. Please check back shortly!
            </p>
          </div>

          <div className="pt-4 border-t border-border-primary flex justify-center gap-4">
            <button
              onClick={() => handleNavigate("admin")}
              className="px-4 py-2 bg-bg-primary hover:bg-brand-soft-bg border border-border-primary text-text-secondary rounded-xl text-[10px] font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={12} className="text-neon-purple" />
              <span>Admin Access Gate</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Render Public Landing Page with premium motion layout
  return (
    <ExperienceLoader>
      {({ Navbar: ActiveNavbar, Hero: ActiveHero, Background: ActiveBackground, CustomCursor: ActiveCursor }) => (
        <div className="bg-bg-primary min-h-screen relative text-text-primary selection:bg-brand-purple/30 selection:text-text-primary overflow-x-hidden transition-colors duration-350">
          
          {/* Real-time Cinematic Dimension Transition overlay */}
          <ExperienceTransitionOverlay />

          {/* Scroll Progress Indicator */}
          <ScrollProgress />

          {/* Experience-specific Visual Cursor follower */}
          <ActiveCursor />

          {/* Experience-specific moving glows, grid overlays & particles */}
          <ActiveBackground />

          {/* Experience-specific Responsive floating top-nav */}
          <ActiveNavbar currentSection={activeSection} onNavigate={handleNavigate} />

          {/* Main Home Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <React.Suspense fallback={
              <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 py-20">
                <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-neon-purple rounded-full animate-spin" />
                <span className="text-xs font-mono text-text-muted tracking-widest uppercase">Initializing Canvas...</span>
              </div>
            }>
              {currentExperience === "apple" ? (
                <>
                  <ActiveHero onNavigate={handleNavigate} />
                  <AppleExperience onNavigate={handleNavigate} />
                </>
              ) : currentExperience === "neon-gaming" ? (
                <>
                  <ActiveHero onNavigate={handleNavigate} />
                  <NeonGamingExperience onNavigate={handleNavigate} />
                </>
              ) : (
                <>
                  <ActiveHero onNavigate={handleNavigate} />
                  <About />
                  <Services />
                  <Projects />
                  <Skills />
                  <WorkProcess />
                  <Testimonials />
                  <Contact />
                </>
              )}
            </React.Suspense>
          </motion.div>
          
          {/* Global page footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Floating Chat System */}
          <ChatWidget />

        </div>
      )}
    </ExperienceLoader>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <ExperienceProvider>
          <PortfolioApp />
        </ExperienceProvider>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
