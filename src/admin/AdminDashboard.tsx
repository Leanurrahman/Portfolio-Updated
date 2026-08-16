/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  LayoutDashboard,
  User,
  Layers,
  Cpu,
  HeartHandshake,
  Star,
  MessageSquare,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Shield,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "../components/ThemeToggle";

// Sub-components import
import DashboardOverview from "./DashboardOverview";
import ManageProfile from "./ManageProfile";
import ManageProjects from "./ManageProjects";
import ManageSkills from "./ManageSkills";
import ManageServices from "./ManageServices";
import ManageTestimonials from "./ManageTestimonials";
import ManageMessages from "./ManageMessages";
import ManageSettings from "./ManageSettings";
import AdminChatsPage from "./AdminChatsPage";
import ManageExperienceSettings from "./ManageExperienceSettings";

interface AdminDashboardProps {
  onExit: () => void;
}

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { adminUser: user, isSandboxMode, logout, successMsg, errorMsg } = usePortfolio();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real-time admin site presence tracker
  useEffect(() => {
    const presenceRef = doc(db, "sitePresence", "admin");

    // Track active status on mount
    const markOnline = async () => {
      try {
        await setDoc(presenceRef, {
          online: true,
          lastSeen: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to mark admin online:", err);
      }
    };

    markOnline();

    // Heartbeat every 45 seconds to keep the updatedAt timestamp extremely fresh
    const heartbeatTimer = setInterval(async () => {
      try {
        await updateDoc(presenceRef, {
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Presence heartbeat failed:", err);
      }
    }, 45000);

    // Track offline status on unmount
    const markOffline = async () => {
      try {
        await setDoc(presenceRef, {
          online: false,
          lastSeen: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to mark admin offline:", err);
      }
    };

    // Before unload listener
    const handleBeforeUnload = () => {
      markOffline();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      markOffline();
    };
  }, []);

  const menuItems = [
    { id: "overview", label: "Dashboard Home", icon: LayoutDashboard },
    { id: "profile", label: "Edit Profile", icon: User },
    { id: "projects", label: "Manage Projects", icon: Layers },
    { id: "skills", label: "Skills Directory", icon: Cpu },
    { id: "services", label: "Offered Services", icon: HeartHandshake },
    { id: "testimonials", label: "Client Testimonials", icon: Star },
    { id: "messages", label: "Inquiries Inbox", icon: MessageSquare },
    { id: "chats", label: "Live Chats", icon: MessageCircle },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "experience-settings", label: "Experience Settings", icon: Sparkles }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview onSetActiveTab={setActiveTab} />;
      case "profile":
        return <ManageProfile />;
      case "projects":
        return <ManageProjects />;
      case "skills":
        return <ManageSkills />;
      case "services":
        return <ManageServices />;
      case "testimonials":
        return <ManageTestimonials />;
      case "messages":
        return <ManageMessages />;
      case "chats":
        return <AdminChatsPage />;
      case "settings":
        return <ManageSettings />;
      case "experience-settings":
        return <ManageExperienceSettings />;
      default:
        return <DashboardOverview onSetActiveTab={setActiveTab} />;
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex overflow-hidden transition-colors duration-350">
      
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none" />

      {/* 1. Sidebar Panel (Desktop Layout) */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-border-primary p-6 space-y-8 shrink-0 relative z-20">
        
        {/* Sidebar Header Title */}
        <div className="flex items-center gap-2 pb-6 border-b border-border-primary">
          <div className="p-2 bg-brand-orange/15 border border-brand-orange/20 text-brand-orange rounded-xl">
            <Shield size={18} />
          </div>
          <div>
            <h1 className="text-sm font-black text-text-primary tracking-tight">Leanur Rahman</h1>
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest block font-bold">ADMIN CMS</span>
          </div>
        </div>

        {/* Navigation Sidebar links */}
        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-mono tracking-wide transition-all cursor-pointer focus:outline-none ${
                  isActive
                    ? "bg-brand-orange text-white font-black shadow-md"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-primary/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={12} />}
              </button>
            );
          })}
        </nav>

        {/* Footer actions: user details and sign out */}
        <div className="pt-6 border-t border-border-primary space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-primary flex items-center justify-center text-xs font-mono font-bold text-brand-orange uppercase">
              {isSandboxMode ? "D" : user?.email?.substring(0, 1) || "A"}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-text-primary block truncate">
                {isSandboxMode ? "Demo Admin" : user?.email || "Authenticated"}
              </span>
              <span className="text-[9px] font-mono text-text-secondary block uppercase tracking-wider">
                {isSandboxMode ? "Sandbox mode" : "Production"}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-500 font-mono text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider focus:outline-none"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Header top-bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-bg-secondary border-b border-border-primary z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-brand-orange" />
          <span className="text-xs font-mono uppercase tracking-widest text-text-primary font-bold">Admin Panel</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-bg-primary border border-border-primary rounded-xl text-text-secondary"
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 top-[60px] z-20 bg-bg-primary lg:hidden flex flex-col p-6 space-y-6 border-t border-border-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex-grow space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-widest focus:outline-none ${
                      isActive ? "bg-brand-orange text-white font-black" : "text-text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-border-primary space-y-4">
              <button
                onClick={logout}
                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-xs font-mono focus:outline-none"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <main className="flex-grow flex flex-col min-w-0 h-screen pt-[60px] lg:pt-0 relative z-10">
        
        {/* Top bar headers (Desktop context) */}
        <header className="hidden lg:flex h-16 bg-bg-secondary border-b border-border-primary items-center justify-between px-8 relative z-10 shadow-sm">
          <div className="flex items-center gap-2">
            {isSandboxMode && (
              <span className="px-2.5 py-1 bg-brand-orange/10 border border-brand-orange/15 text-brand-orange text-[10px] font-mono rounded-full flex items-center gap-1.5 font-bold">
                <Sparkles size={11} className="animate-pulse" />
                <span>MEM-MUTABLE SANDBOX</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <button
              onClick={onExit}
              className="px-4 py-2 bg-bg-primary hover:bg-brand-soft-bg border border-border-primary hover:border-brand-orange/30 rounded-xl text-[10px] font-mono text-text-secondary hover:text-brand-orange flex items-center gap-1.5 cursor-pointer transition-colors focus:outline-none"
            >
              <span>Live Site Preview</span>
              <ExternalLink size={11} />
            </button>
          </div>
        </header>

        {/* Content Container Body */}
        <div className="flex-grow p-6 lg:p-8 overflow-y-auto relative z-10 bg-bg-primary">
          {renderActiveComponent()}
        </div>

      </main>

      {/* Toast Notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-400/20 font-mono text-xs"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 font-sans font-medium text-white pr-2">
              {successMsg}
            </div>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/10 border border-red-400/20 font-mono text-xs"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 font-sans font-medium text-white pr-2">
              {errorMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
