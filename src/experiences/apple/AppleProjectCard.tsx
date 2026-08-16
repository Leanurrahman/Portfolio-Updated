import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { ExternalLink, Github, X, Calendar, User, CheckCircle, ArrowUpRight } from "lucide-react";
import { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function AppleProjectCard({ project, index }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Soft tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 18 });

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
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative bg-white/60 hover:bg-white/90 border border-slate-900/10 hover:border-blue-500/20 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-md transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-blue-500/[0.04] text-left"
        onClick={() => setIsOpen(true)}
      >
        {/* Blue hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-transparent to-blue-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thumbnail within a simulated elegant rounded device frame */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white border border-slate-900/5 shadow-inner">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            
            {/* Meta category badge */}
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[9px] font-bold tracking-wide uppercase bg-white/90 text-blue-600 border border-slate-900/5 rounded-lg backdrop-blur-md shadow-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6 flex flex-col flex-grow justify-between">
          <div className="space-y-2 group-hover:-translate-y-0.5 transition-transform duration-300">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold">{formattedIndex}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-400">{project.year}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-normal">
              {project.shortDescription}
            </p>
          </div>

          {/* Tech badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[9px] font-semibold text-slate-500 bg-slate-50 border border-slate-900/5 rounded-lg"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-900/5 rounded-lg">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>

          {/* Lower interactive row */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wide font-bold text-blue-500 flex items-center gap-1">
              <span>View Case Study</span>
              <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* Apple-Style Modal Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="relative w-full max-w-3xl bg-white border border-slate-900/10 rounded-3xl overflow-hidden shadow-2xl z-10 text-left"
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer focus:outline-none"
              >
                <X size={15} />
              </button>

              <div className="relative aspect-video w-full bg-slate-50 border-b border-slate-100">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-wide bg-blue-500/10 text-blue-600 rounded-lg">
                      {project.category}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-3xl font-extrabold text-slate-950 uppercase tracking-tight leading-none">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Inner detail blocks */}
              <div className="p-6 md:p-8 max-h-[calc(100vh-220px)] overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                  <div>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Client</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase">
                      <User size={12} className="text-blue-500" />
                      <span>{project.client || "Freelance / Personal"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Year</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase">
                      <Calendar size={12} className="text-blue-500" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Tech Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[9px] font-semibold text-slate-500 bg-white border border-slate-100 rounded-lg">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Project Narrative</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-normal">
                    {project.longDescription}
                  </p>
                </div>

                {project.problemSolved && (
                  <div className="p-5 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl text-left space-y-1.5">
                    <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">The Core Challenge</h5>
                    <p className="text-slate-600 text-xs font-normal leading-relaxed">{project.problemSolved}</p>
                  </div>
                )}

                {/* Launch Links */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl border border-slate-900/10 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer"
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
                      className="px-6 py-2.5 rounded-xl text-white bg-[#007AFF] hover:bg-blue-600 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-blue-500/10"
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
