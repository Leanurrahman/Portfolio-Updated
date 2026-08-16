import React, { useRef, useEffect, useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Github, Linkedin, Facebook, Mail, FileText, ArrowRight, Star, Briefcase, Code, CheckCircle, Users } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import MagneticButton from "../../components/MagneticButton";
import Marquee from "../../components/Marquee";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { profile, projects, testimonials, experienceSettings } = usePortfolio();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const socialLinks = profile.socialLinks || {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    email: "mailto:techbulletcodeyt@gmail.com"
  };

  const marqueeSkills = [
    "REACT", "NEXT.JS", "TYPESCRIPT", "TAILWIND CSS", "FIREBASE", "FRAMER MOTION",
    "NODE.JS", "EXPRESS", "POSTGRESQL", "REST APIS", "D3.JS", "RECHARTS"
  ];

  // Mouse Parallax movement for background layers
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 25;
      const y = (e.clientY - innerHeight / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  // Card 3D tilt effect variables
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const cardSpringX = useSpring(cardRotateX, { stiffness: 150, damping: 22 });
  const cardSpringY = useSpring(cardRotateY, { stiffness: 150, damping: 22 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Cap tilts to max 8 degrees for clean look
    cardRotateX.set(-y / (rect.height / 16));
    cardRotateY.set(x / (rect.width / 16));
  };

  const handleCardMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Dynamic values
  const profileImage = experienceSettings?.gta6?.profileImageOverride || profile.profileImage;
  const projectCount = projects?.length || 12;
  const clientsCount = testimonials?.length || 6;
  const availabilityText = profile.availabilityStatus === "available" ? "Available for Work" : "Open to Collaborate";

  // Initials fallback helper
  const getInitials = () => {
    if (!profile.name) return "LR";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Container motion stagger definitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-hidden bg-[#070112] transition-colors duration-500"
    >
      {/* Cinematic Horizontal Light Streak */}
      <div className="absolute inset-x-0 bottom-44 h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent select-none pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Content Hierarchy Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: isMobile ? 0 : contentY, opacity: isMobile ? 1 : contentOpacity }}
          className="lg:col-span-7 flex flex-col space-y-6"
        >
          {/* Eyebrow badge with premium pulse */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-pink-400 uppercase italic">
              ★ Available for freelance & remote work ★
            </span>
          </motion.div>

          {/* Headline and Identity */}
          <div className="space-y-2">
            {/* Identity Title: LEANUR RAHMAN */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              {profile.name ? profile.name.toUpperCase() : "LEANUR RAHMAN"}
            </motion.h1>

            {/* Role Title: FULL STACK DEVELOPER */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black italic tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]"
            >
              {profile.role ? profile.role.toUpperCase() : "FULL STACK DEVELOPER"}
            </motion.h2>

            {/* Main Value Statement */}
            <motion.h3
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-pink-100 max-w-2xl pt-2 leading-snug font-sans"
            >
              I build fast, scalable, and conversion-focused web applications.
            </motion.h3>
          </div>

          {/* Supporting Text with optimized line length and visual hierarchy */}
          <motion.p
            variants={itemVariants}
            className="text-pink-100/80 text-sm sm:text-base leading-relaxed max-w-xl font-normal font-sans"
          >
            I help businesses turn ideas into modern web products using React, Next.js, Firebase, Node.js, and clean user-focused development.
          </motion.p>

          {/* Social Links Panel */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 pt-1"
          >
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#170529]/80 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/80 text-pink-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-pink-500/10 hover:scale-105"
                title="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#170529]/80 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/80 text-pink-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-pink-500/10 hover:scale-105"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#170529]/80 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/80 text-pink-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-pink-500/10 hover:scale-105"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email.replace("mailto:", "")}`}
                className="p-2.5 bg-[#170529]/80 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/80 text-pink-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-pink-500/10 hover:scale-105"
                title="Email"
              >
                <Mail size={16} />
              </a>
            )}
          </motion.div>

          {/* Action Call-to-Actions (CTAs) with professional styling */}
          <div className="space-y-3 pt-2">
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center"
            >
              <MagneticButton
                onClick={() => onNavigate("contact")}
                className="px-7 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-md shadow-pink-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Start a Project</span>
                  <ArrowRight size={14} />
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => onNavigate("projects")}
                className="px-7 py-3.5 border border-pink-500/30 bg-pink-500/[0.05] text-pink-200 hover:text-white hover:bg-pink-500/10 font-black uppercase text-xs tracking-widest rounded-xl transition-all cursor-pointer"
              >
                <span>View Projects</span>
              </MagneticButton>

              {profile.cvUrl && profile.cvUrl !== "#" && (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-pink-300 hover:text-white flex items-center gap-1.5 text-xs font-mono font-black tracking-widest transition-colors uppercase ml-1"
                >
                  <FileText size={14} className="text-pink-500" />
                  <span>Download CV</span>
                </a>
              )}
            </motion.div>

            {/* Small trust indicator line */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-pink-300/60 font-mono tracking-wider italic pt-1"
            >
              Available for freelance, remote work, and startup projects.
            </motion.p>
          </div>

        </motion.div>

        {/* Right: Dynamic Profile Stats Card with 3D Tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-6"
        >
          {/* Card Body with perspective and mouse tilt */}
          <motion.div
            style={{
              rotateX: isMobile ? 0 : cardSpringX,
              rotateY: isMobile ? 0 : cardSpringY,
              transformStyle: "preserve-3d"
            }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="relative w-full max-w-[340px] bg-[#120324]/90 border border-pink-500/20 rounded-2xl p-4 shadow-2xl shadow-black/80 transition-shadow duration-300 hover:shadow-pink-500/10 cursor-pointer group"
          >
            {/* Glowing neon halo behind card */}
            <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 opacity-20 blur-[6px] group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

            {/* Avatar Frame */}
            <div className="relative w-full h-[250px] rounded-xl overflow-hidden bg-[#070010] border border-pink-500/10 mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile.name || "Leanur Rahman"}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-pink-500/20 via-purple-500/10 to-transparent">
                  <span className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">
                    {getInitials()}
                  </span>
                </div>
              )}

              {/* Glowing gradient visual rim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0114]/80 via-transparent to-transparent pointer-events-none" />

              {/* Identity tag overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-[#070112]/90 border border-pink-500/15 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white tracking-tight italic uppercase">
                    {profile.name || "Leanur Rahman"}
                  </h4>
                  <p className="text-[9px] font-mono text-pink-400 uppercase tracking-widest font-black">
                    {profile.role || "Full Stack Developer"}
                  </p>
                </div>
                <span className="text-sm">🌴</span>
              </div>
            </div>

            {/* Dynamic Interactive Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Stat tile: EXPERIENCE */}
              <div className="bg-[#19062d]/90 border border-pink-500/10 p-2.5 rounded-xl flex items-center gap-2 hover:border-pink-500/30 transition-colors">
                <Briefcase size={14} className="text-pink-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-mono text-pink-300/60 uppercase tracking-widest font-extrabold">EXPERIENCE</span>
                  <span className="text-xs font-black italic text-white tracking-tight">2+ Years</span>
                </div>
              </div>

              {/* Stat tile: PROJECTS */}
              <div className="bg-[#19062d]/90 border border-pink-500/10 p-2.5 rounded-xl flex items-center gap-2 hover:border-pink-500/30 transition-colors">
                <Code size={14} className="text-rose-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-mono text-pink-300/60 uppercase tracking-widest font-extrabold">PROJECTS</span>
                  <span className="text-xs font-black italic text-white tracking-tight">{projectCount} Completed</span>
                </div>
              </div>

              {/* Stat tile: CLIENTS */}
              <div className="bg-[#19062d]/90 border border-pink-500/10 p-2.5 rounded-xl flex items-center gap-2 hover:border-pink-500/30 transition-colors">
                <Users size={14} className="text-amber-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-mono text-pink-300/60 uppercase tracking-widest font-extrabold">CLIENTS</span>
                  <span className="text-xs font-black italic text-white tracking-tight">{clientsCount}+ Active</span>
                </div>
              </div>

              {/* Stat tile: STATUS */}
              <div className="bg-[#19062d]/90 border border-pink-500/10 p-2.5 rounded-xl flex items-center gap-2 hover:border-pink-500/30 transition-colors">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-mono text-pink-300/60 uppercase tracking-widest font-extrabold">STATUS</span>
                  <span className="text-xs font-black italic text-emerald-400 tracking-tight leading-none truncate">{availabilityText}</span>
                </div>
              </div>

            </div>

            {/* Micro progress/stat bar reveal */}
            <div className="w-full bg-pink-950/40 h-1 rounded-full overflow-hidden mt-3">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-amber-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              />
            </div>

          </motion.div>

          {/* Premium Mission-Style Interactive Tile below profile card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-[340px] bg-gradient-to-r from-pink-950/20 to-purple-950/10 border border-pink-500/10 rounded-xl p-3.5 backdrop-blur-md hover:border-pink-500/20 transition-all flex flex-col space-y-2"
          >
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-pink-300 font-extrabold">Current Mission</span>
            </div>
            <p className="text-xs text-pink-100/70 leading-relaxed font-sans">
              Building clean, scalable web products for startups and growing businesses.
            </p>
            <button
              onClick={() => onNavigate("contact")}
              className="text-[9px] font-mono tracking-widest uppercase text-pink-400 font-black flex items-center gap-1 hover:text-pink-300 transition-colors cursor-pointer self-start focus:outline-none"
            >
              <span>Discuss a Project</span>
              <ArrowRight size={10} className="text-pink-400" />
            </button>
          </motion.div>

        </motion.div>

      </div>

      {/* Mouse Scroll Assist Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none hidden md:flex">
        <span className="text-[8px] font-mono tracking-widest text-pink-300/60 uppercase font-black">Scroll Down</span>
        <div className="w-4.5 h-8 rounded-full border border-pink-500/20 flex justify-center p-1">
          <motion.div
            className="w-1 h-1 rounded-full bg-pink-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Sunset Skill Marquee Ticker */}
      <div className="mt-20 w-full border-t border-b border-pink-500/10 py-2.5 bg-[#140428]/40 relative z-20 backdrop-blur-md">
        <Marquee items={marqueeSkills} speed={25} />
      </div>
    </section>
  );
}
