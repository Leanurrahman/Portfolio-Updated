import React from "react";
import { motion } from "motion/react";
import { ExternalLink, Github, X, Calendar, User, CheckCircle } from "lucide-react";
import { Project } from "../../types";

interface ShowcaseProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function NeonGamingProjectShowcase({ project, isOpen, onClose }: ShowcaseProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
      {/* 1. Backdrop Glow Layer */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* 2. Main Game Cabinet Display Cabinet */}
      <motion.div
        className="relative w-full max-w-3xl bg-[#08080c] border border-[#1CD8D2]/30 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(28,216,210,0.15)] z-10 text-left text-white"
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Retro scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

        {/* Decorative corner indicators */}
        <div className="absolute top-4 left-4 text-[9px] font-mono text-white/20 z-10">&lt;SYS_SHOWCASE&gt;</div>
        <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20 z-10">&lt;/SYS_SHOWCASE&gt;</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/[0.05] hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 text-white hover:text-red-500 rounded-full transition-all cursor-pointer focus:outline-none"
        >
          <X size={15} />
        </button>

        {/* Top Banner Image Screen */}
        <div className="relative aspect-video w-full bg-black/40 border-b border-[#1CD8D2]/25">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-black/30" />
          
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <span className="px-2.5 py-0.5 text-[9px] font-mono font-black tracking-widest bg-[#1CD8D2]/10 border border-[#1CD8D2]/30 text-[#1CD8D2] rounded-md uppercase">
              {project.category}
            </span>
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider leading-none mt-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Scrollable details desk */}
        <div className="p-6 md:p-8 max-h-[calc(100vh-220px)] overflow-y-auto space-y-6">
          
          {/* Mission specs panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
            <div>
              <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-1">CLIENT_OR_TAG</span>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white/95">
                <User size={12} className="text-[#1CD8D2]" />
                <span>{project.client || "Self-Initiated Quest"}</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-1">YEAR_LAUNCHED</span>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-white/95">
                <Calendar size={12} className="text-[#1CD8D2]" />
                <span>{project.year}</span>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest block mb-1">CAPABILITIES</span>
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[8px] font-mono font-bold text-white/70 bg-white/[0.04] border border-white/5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project description briefing */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">MISSION_BRIEFING</h4>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed whitespace-pre-line font-normal">
              {project.longDescription}
            </p>
          </div>

          {/* Problem solved briefing */}
          {project.problemSolved && (
            <div className="p-5 bg-[#00BF8F]/5 border border-[#00BF8F]/20 rounded-2xl text-left space-y-1.5">
              <h5 className="text-[9px] font-mono font-black text-[#00BF8F] uppercase tracking-widest">CORE_CHALLENGE_SOLVED</h5>
              <p className="text-white/80 text-xs font-normal leading-relaxed">{project.problemSolved}</p>
            </div>
          )}

          {/* Actions / External links */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-wrap gap-3 justify-end">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Github size={13} />
                <span>SOURCE_CODE</span>
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-black bg-[#1CD8D2] hover:brightness-110 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(28,216,210,0.3)]"
              >
                <ExternalLink size={13} />
                <span>LIVE_SYSTEM</span>
              </a>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
