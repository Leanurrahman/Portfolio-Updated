/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Layers, MessageSquare, Star, Cpu, HeartHandshake, Database, Trash2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface DashboardOverviewProps {
  onSetActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ onSetActiveTab }: DashboardOverviewProps) {
  const {
    projects,
    messages,
    skills,
    services,
    testimonials,
    seedDatabase,
    clearDatabase,
    isSandboxMode
  } = usePortfolio();

  // Find unread count
  const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;

  const stats = [
    { label: "Total Projects", count: projects.length, icon: Layers, color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Client Inquiries", count: messages.length, unread: unreadMessagesCount, icon: MessageSquare, color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Testimonials", count: testimonials.length, icon: Star, color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Registered Skills", count: skills.length, icon: Cpu, color: "text-brand-orange", bg: "bg-brand-orange/10" }
  ];

  const recentMessages = messages.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans">CMS Overview</h2>
          <p className="text-text-secondary text-xs mt-1">Real-time status metrics and content summary statistics.</p>
        </div>

        {/* Action button triggers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={seedDatabase}
            className="px-4 py-2 bg-bg-secondary hover:bg-brand-soft-bg border border-border-primary rounded-xl text-brand-orange font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors focus:outline-none"
            title="Populate Firebase collections with initial defaults"
          >
            <Database size={13} />
            <span>Seed Default Data</span>
          </button>
          
          <button
            onClick={clearDatabase}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors focus:outline-none"
            title="Remove records"
          >
            <Trash2 size={13} />
            <span>Clear Database</span>
          </button>
        </div>
      </div>

      {/* Sandbox Alert Notice */}
      {isSandboxMode && (
        <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex items-start gap-3 text-brand-orange text-xs">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Sandbox Mode Activated:</span> You can safely test edits, write records, or populate data. Modifications are held in active memory state and won't affect live production Firestore collections.
          </div>
        </div>
      )}

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-bg-secondary border border-border-primary rounded-xl backdrop-blur-sm relative overflow-hidden group shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-text-primary font-sans">{stat.count}</span>
                    {stat.unread !== undefined && stat.unread > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-mono rounded-full font-bold animate-pulse">
                        {stat.unread} NEW
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border border-border-primary/50`}>
                  <Icon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed rows: Recent inquiries & projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Messages Area */}
        <div className="lg:col-span-7 p-6 bg-bg-secondary border border-border-primary rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border-primary pb-3">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-wide">Recent Messages</h3>
            <button
              onClick={() => onSetActiveTab("messages")}
              className="text-xs font-mono text-brand-orange hover:text-brand-orange-hover hover:underline cursor-pointer focus:outline-none"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onSetActiveTab("messages")}
                className="p-4 bg-bg-primary hover:bg-brand-soft-bg/30 border border-border-primary rounded-xl cursor-pointer transition-all flex justify-between items-start gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{msg.name}</span>
                    {msg.status === "unread" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-text-secondary text-[10px] font-mono">{msg.email}</p>
                  <p className="text-text-secondary text-xs leading-normal line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-[9px] font-mono text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border-primary shrink-0">
                  {msg.budgetRange}
                </span>
              </div>
            ))}

            {recentMessages.length === 0 && (
              <div className="text-center py-8 text-text-secondary text-xs font-mono">
                No client inquiries recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects area */}
        <div className="lg:col-span-5 p-6 bg-bg-secondary border border-border-primary rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border-primary pb-3">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-wide">Featured Projects</h3>
            <button
              onClick={() => onSetActiveTab("projects")}
              className="text-xs font-mono text-brand-orange hover:text-brand-orange-hover hover:underline cursor-pointer focus:outline-none"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => onSetActiveTab("projects")}
                className="flex gap-3 p-2 bg-bg-primary/50 border border-border-primary rounded-xl cursor-pointer hover:bg-brand-soft-bg/30 transition-all items-center"
              >
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-12 h-12 rounded-lg object-cover bg-bg-secondary border border-border-primary"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-primary truncate">{p.title}</h4>
                  <p className="text-[10px] font-mono text-brand-orange uppercase tracking-widest mt-0.5 font-bold">{p.category}</p>
                </div>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <div className="text-center py-8 text-text-secondary text-xs font-mono">
                No projects found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
