import React, { useEffect, useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Github, Linkedin, Twitter, ArrowRight, Play, FileText, Plus, Minus, Zap, Shield, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "../../components/MagneticButton";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function NeonGamingHero({ onNavigate }: HeroProps) {
  const { profile = {}, siteSettings = {}, experienceSettings, loading } = usePortfolio();
  const gamingSettings = experienceSettings?.neonGaming;

  const cyanGlow = gamingSettings?.accentCyan || "#1CD8D2";
  const greenGlow = gamingSettings?.accentGreen || "#00BF8F";
  const purpleGlow = gamingSettings?.accentPurple || "#a855f7";

  const resolvedAvatar = 
    gamingSettings?.profileImageOverride || 
    gamingSettings?.heroAvatarImage || 
    (profile as any)?.avatarImage || 
    profile?.profileImage || 
    (profile as any)?.imageUrl || 
    "";

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [experienceSettings, profile]);

  useEffect(() => {
    if (!loading) {
      if (!resolvedAvatar || imgError) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("No CMS profile image found for Neon Gaming; using fallback.");
        }
      }
    }
  }, [loading, resolvedAvatar, imgError]);

  const roles = [
    profile.title || "Full Stack Developer",
    "Web App Builder",
    "Firebase Developer",
    "Creative Frontend Engineer",
    "Gaming UI Designer"
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Typewriter effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = roles[currentRoleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(60);

        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 1600);
          return;
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(40);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed]);

  // Interactive RPG Attributes State
  const [attributes, setAttributes] = useState({
    str: 18,
    agi: 22,
    int: 28,
    luk: 15
  });
  const [skillPoints, setSkillPoints] = useState(6);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleStatIncrease = (stat: "str" | "agi" | "int" | "luk") => {
    if (skillPoints > 0) {
      setAttributes(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
      setSkillPoints(prev => prev - 1);
      
      const messages = {
        str: "STR increased! Render throughput boosted.",
        agi: "AGI increased! Load times reduced by 0.05s.",
        int: "INT increased! Code quality improved to pristine.",
        luk: "LUK increased! Production deployment bugs prevented."
      };
      triggerToast(messages[stat]);
    }
  };

  const handleResetStats = () => {
    setAttributes({ str: 18, agi: 22, int: 28, luk: 15 });
    setSkillPoints(6);
    triggerToast("Stats reset! Skill points refunded.");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const socialIcons = {
    github: <Github size={16} />,
    linkedin: <Linkedin size={16} />,
    twitter: <Twitter size={16} />
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-28 pb-16 relative z-10 overflow-hidden bg-black text-white">
      {/* Absolute positioning neon dust */}
      <div className="absolute top-1/4 left-10 w-[35vw] h-[35vw] bg-[#1CD8D2]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[35vw] h-[35vw] bg-[#00BF8F]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Core Gaming Command Center */}
        <div className="lg:col-span-7 text-left space-y-6 flex flex-col justify-center">
          
          {/* Real-time Telemetry Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 hover:border-[#1CD8D2]/30 rounded-full w-fit backdrop-blur-md transition-all">
            <span className="w-2 h-2 rounded-full bg-[#00BF8F] animate-pulse shadow-[0_0_8px_#00BF8F]" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#00BF8F] uppercase">
              CONSOLE_GATEWAY: ONLINE
            </span>
          </div>

          {/* Epic Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase font-sans">
              <span>CRAFTING THE</span> <br />
              <span 
                className="text-transparent bg-clip-text font-sans"
                style={{
                  backgroundImage: `linear-gradient(to right, ${cyanGlow}, ${greenGlow}, ${purpleGlow})`,
                  filter: `drop-shadow(0 0 25px ${cyanGlow}55)`
                }}
              >
                ULTIMATE WEB
              </span>
            </h1>

            {/* Sub-role Typer with controller indicators */}
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs sm:text-base font-mono font-bold shadow-inner"
              style={{ color: cyanGlow }}
            >
              <span className="text-[#00BF8F] font-bold">&gt;_</span>
              <span>{currentText}</span>
              <span className="w-2.5 h-4 bg-[#1CD8D2] animate-[blink_1.1s_infinite]" />
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            Building robust full-stack software architecture with high-fidelity visuals. Powered by clean type safety, optimized database layers, and immersive gaming-level responsive micro-interactions.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <MagneticButton
              onClick={() => onNavigate("contact")}
              className="px-6 py-3.5 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, ${cyanGlow}, ${greenGlow})`,
                boxShadow: `0 0 20px ${cyanGlow}4d`
              }}
            >
              <Play size={11} className="fill-black text-black" />
              <span>LAUNCH_PROJECT</span>
            </MagneticButton>

            <MagneticButton
              onClick={() => onNavigate("projects")}
              className="px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW_MISSION_LOGS</span>
              <ArrowRight size={13} style={{ color: cyanGlow }} />
            </MagneticButton>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 text-white/40 hover:text-[#1CD8D2] flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                <FileText size={13} />
                <span>DOWNLOAD_CV</span>
              </a>
            )}
          </div>

          {/* Social Channels Row */}
          <div className="pt-5 border-t border-white/[0.05] flex items-center gap-4">
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">CONNECT_CHANNELS:</span>
            <div className="flex gap-2">
              {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => {
                const icon = socialIcons[platform as keyof typeof socialIcons];
                if (!icon || !url) return null;
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/[0.02] hover:bg-[#1CD8D2]/10 border border-white/5 hover:border-[#1CD8D2]/40 rounded-xl text-white/50 hover:text-[#1CD8D2] transition-all hover:scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Gaming HUD Controller Card */}
        <div className="lg:col-span-5 flex justify-center relative">
          
          {/* Ambient Glow behind card */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#1CD8D2]/8 via-[#a855f7]/8 to-transparent rounded-[36px] blur-xl -z-10" />

          {/* HUD Panel Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[370px] bg-white/[0.02] border border-white/10 rounded-[30px] p-5 relative backdrop-blur-xl shadow-2xl flex flex-col"
          >
            {/* Header Telemetry */}
            <div className="w-full flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4 font-mono text-[9px] text-white/40">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/30" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/30" />
                <span className="w-2 h-2 rounded-full bg-[#00BF8F] animate-pulse" />
              </div>
              <span className="tracking-widest uppercase">AVATAR_MODULE.CFG</span>
            </div>

            {/* Character Info Card Grid */}
            <div className="flex gap-4 items-center mb-5">
              <div 
                className="relative w-20 h-20 rounded-full p-[2px] shrink-0"
                style={{
                  backgroundImage: `linear-gradient(to tr, ${cyanGlow}, ${greenGlow}, ${purpleGlow})`,
                  boxShadow: `0 0 15px ${cyanGlow}4d`
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#040406] border-2 border-[#040406] flex items-center justify-center">
                  {loading ? (
                    <div className="w-full h-full bg-white/10 animate-pulse flex items-center justify-center font-mono text-[10px] text-white/40">
                      LDR...
                    </div>
                  ) : imgError || !resolvedAvatar ? (
                    <div 
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1a2e] to-[#040406] text-xl font-black tracking-wider text-white select-none"
                      style={{ textShadow: `0 0 8px ${cyanGlow}` }}
                    >
                      LR
                    </div>
                  ) : (
                    <img
                      src={resolvedAvatar}
                      alt={profile.name || "Developer"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>
                {/* Active Level Badge */}
                <div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-black font-black text-[9px] flex items-center justify-center border border-black"
                  style={{
                    backgroundColor: greenGlow,
                    boxShadow: `0 0 6px ${greenGlow}`
                  }}
                >
                  {profile.yearsOfExperience || 5}
                </div>
              </div>

              <div className="text-left space-y-0.5">
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  {profile.name || "Leanur"}
                </h3>
                <p 
                  className="font-mono font-bold text-[9px] tracking-widest uppercase"
                  style={{ color: cyanGlow }}
                >
                  SYSTEMS_ARCHITECT_LVL_{profile.yearsOfExperience || 5}
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[9px] font-mono text-white/50">
                  <Trophy size={10} className="text-yellow-500" />
                  <span>XP: 85% to Level Up</span>
                </div>
              </div>
            </div>

            {/* Character Vitals (HP, MP, AP) */}
            <div className="space-y-2 mb-5 font-mono text-[9px]">
              {/* HP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1"><Shield size={10} className="text-red-400" /> HP (CODE_HEALTH)</span>
                  <span className="font-bold text-red-400">100 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* MP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1"><Zap size={10} className="text-[#1CD8D2]" /> MP (MANA_POINTS)</span>
                  <span className="font-bold text-[#1CD8D2]">98 / 98</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div className="h-full bg-[#1CD8D2] rounded-full" style={{ width: "98%" }} />
                </div>
              </div>
            </div>

            {/* Stat Allocation Game Screen */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/60">
                <span className="uppercase text-[#00BF8F] font-bold">Allocatable points:</span>
                <span className="px-1.5 py-0.5 bg-[#00BF8F]/10 text-[#00BF8F] border border-[#00BF8F]/20 rounded font-black">
                  {skillPoints} PT
                </span>
              </div>

              {/* Stat grid */}
              <div className="space-y-2 font-mono text-xs">
                {/* STR */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px]">STR (Render Power):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1CD8D2]">{attributes.str}</span>
                    <button
                      onClick={() => handleStatIncrease("str")}
                      disabled={skillPoints === 0}
                      className="p-1 bg-white/[0.04] hover:bg-[#1CD8D2]/20 border border-white/10 hover:border-[#1CD8D2]/50 text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* AGI */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px]">AGI (Velocity Speed):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00BF8F]">{attributes.agi}</span>
                    <button
                      onClick={() => handleStatIncrease("agi")}
                      disabled={skillPoints === 0}
                      className="p-1 bg-white/[0.04] hover:bg-[#00BF8F]/20 border border-white/10 hover:border-[#00BF8F]/50 text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* INT */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px]">INT (Code Quality):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-400">{attributes.int}</span>
                    <button
                      onClick={() => handleStatIncrease("int")}
                      disabled={skillPoints === 0}
                      className="p-1 bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* LUK */}
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px]">LUK (Anti-Bug Fate):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-500">{attributes.luk}</span>
                    <button
                      onClick={() => handleStatIncrease("luk")}
                      disabled={skillPoints === 0}
                      className="p-1 bg-white/[0.04] hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset link */}
              {skillPoints < 6 && (
                <div className="text-right pt-1.5 border-t border-white/[0.04]">
                  <button
                    onClick={handleResetStats}
                    className="text-[9px] font-mono text-white/30 hover:text-white uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    RESET_ATTRIBUTES
                  </button>
                </div>
              )}
            </div>

            {/* Custom interactive floating toast */}
            <div className="h-6 mt-3 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {toastMessage && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-[8px] font-mono text-[#1CD8D2] tracking-wider uppercase font-bold text-center"
                  >
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
