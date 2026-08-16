/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { ExternalLink, Github, X, Calendar, User, CheckCircle, ArrowUpRight } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mild card mouse move tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const formattedIndex = (index + 1).toString().padStart(2, "0");

  return (
    <>
      {/* High-End Motion Project Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group clickable relative bg-bg-secondary hover:bg-brand-purple/[0.03] border border-border-primary hover:border-neon-purple/40 rounded-xl overflow-hidden cursor-pointer backdrop-blur-sm transition-all duration-500 ease-out flex flex-col h-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_16px_36px_rgba(168,85,247,0.08)] dark:hover:shadow-[0_20px_40px_rgba(24,8,42,0.85)]"
        onClick={() => setIsOpen(true)}
      >
        {/* Glow Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/0 via-transparent to-brand-purple/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Thumbnail Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-bg-primary">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            referrerPolicy="no-referrer"
          />
          {/* Gradients and sliding dark overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-45" />
          
          {/* Floating Index on top */}
          <span className="absolute top-4 left-4 font-mono text-[10px] text-text-secondary font-black group-hover:text-neon-purple transition-colors duration-500">
            {formattedIndex}
          </span>

          {/* Metadata Badges */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1 text-[9px] font-mono tracking-widest uppercase bg-bg-primary/95 text-neon-purple border border-brand-purple/20 rounded-xl backdrop-blur-md font-bold shadow-sm shadow-brand-purple/5">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider bg-brand-purple/[0.08] text-neon-purple border border-brand-purple/20 rounded-xl">
              {project.year}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6 flex flex-col flex-grow" style={{ transform: "translateZ(10px)" }}>
          {/* Animated lift on hover details */}
          <div className="space-y-2 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
            <h3 className="text-base font-black uppercase tracking-tight text-text-primary group-hover:text-neon-purple transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 font-light">
              {project.shortDescription}
            </p>
          </div>

          {/* Tech stack pills reveal with slide fade */}
          <div className="mt-4 flex flex-wrap gap-1.5 flex-grow content-start group-hover:text-neon-purple transition-colors duration-500">
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[9px] font-mono text-text-secondary bg-bg-primary border border-border-primary rounded-xl"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-0.5 text-[9px] font-mono text-text-secondary bg-bg-primary rounded-xl border border-border-primary">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Lower interactive row */}
          <div className="mt-6 pt-4 border-t border-border-primary flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-mono text-neon-purple font-black flex items-center gap-1">
              <span>View Details</span>
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-secondary hover:text-neon-purple hover:bg-brand-purple/[0.08] rounded-xl border border-border-primary transition-all"
                  title="View Source Code"
                >
                  <Github size={13} />
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-secondary hover:text-neon-purple hover:bg-brand-purple/[0.08] rounded-xl border border-border-primary transition-all"
                  title="View Live Demo"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Case Study Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
            {/* Backdrop blur overlay */}
            <motion.div
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-4xl bg-bg-primary border border-border-primary rounded-2xl overflow-hidden shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-bg-secondary hover:bg-brand-purple/[0.08] text-text-secondary hover:text-neon-purple rounded-xl border border-border-primary backdrop-blur-md transition-colors"
                title="Close Case Study"
              >
                <X size={16} />
              </button>

              {/* Cover Banner */}
              <div className="relative aspect-video w-full bg-bg-secondary max-h-[350px]">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider bg-brand-purple/[0.08] text-neon-purple border border-brand-purple/20 rounded-xl font-bold">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider bg-bg-primary/95 text-text-secondary border border-border-primary rounded-xl">
                      {project.year}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tighter uppercase leading-none font-sans">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Description Details Layout */}
              <div className="p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto space-y-8">
                
                {/* Info row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-bg-secondary border border-border-primary shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">Client</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                      <User size={13} className="text-neon-purple" />
                      <span>{project.client || "Freelance / Personal"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">Year</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                      <Calendar size={13} className="text-neon-purple" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">Tech Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[9px] font-mono text-text-secondary bg-bg-primary border border-border-primary rounded-xl"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Narrative split column */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Story overview */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-black uppercase tracking-wider text-text-primary flex items-center gap-2 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" /> Project Overview
                      </h4>
                      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line font-light">
                        {project.longDescription}
                      </p>
                    </div>

                    {project.problemSolved && (
                      <div className="space-y-3 p-5 rounded-xl bg-brand-purple/[0.06] border border-brand-purple/20">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-neon-purple flex items-center gap-2 font-black">
                          The Challenge
                        </h4>
                        <p className="text-text-primary text-xs leading-relaxed font-light">
                          {project.problemSolved}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Impact lists */}
                  <div className="space-y-6">
                    {project.keyFeatures && project.keyFeatures.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-black uppercase tracking-wider text-text-primary flex items-center gap-2 font-sans">
                          <CheckCircle size={15} className="text-neon-purple" /> Key Features
                        </h4>
                        <ul className="space-y-2">
                          {project.keyFeatures.map((feat, idx) => (
                            <li key={idx} className="flex gap-2 text-text-secondary text-xs leading-normal font-light">
                              <span className="text-neon-purple select-none">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.results && (
                      <div className="space-y-3 p-5 rounded-xl bg-bg-secondary border border-border-primary">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center gap-2 font-black">
                          Impact / Results
                        </h4>
                        <p className="text-text-primary text-xs leading-relaxed font-mono">
                          {project.results}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Launch action links */}
                <div className="pt-6 border-t border-border-primary flex flex-wrap gap-4 items-center justify-end">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl text-text-secondary hover:text-neon-purple bg-bg-secondary hover:bg-brand-purple/[0.06] border border-border-primary flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-200 focus:outline-none"
                    >
                      <Github size={13} />
                      <span>Source Code</span>
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-brand-purple to-neon-purple hover:brightness-110 flex items-center gap-2 text-[10px] tracking-widest uppercase shadow-md shadow-brand-purple/20 hover:shadow-brand-purple/35 transition-all duration-200 focus:outline-none"
                    >
                      <ExternalLink size={13} />
                      <span>Live Website</span>
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
