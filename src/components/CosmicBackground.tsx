/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

interface Star {
  x: number;
  y: number;
  size: number;
  depth: number;
  alpha: number;
  twinkleSpeed: number;
  vx: number; // horizontal drift speed
  vy: number; // vertical drift speed
  colorType: "white" | "blue" | "orange";
  pulseGlow?: boolean; // dynamic pulsing glow
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  alpha: number;
  active: boolean;
}

interface CosmicBackgroundProps {
  intensity?: number; // 0 to 1, default is 1
  variant?: "hero" | "subtle" | "projects" | "footer"; // default is "hero"
  className?: string;
}

export default function CosmicBackground({ 
  intensity = 1, 
  variant = "hero", 
  className = "" 
}: CosmicBackgroundProps) {
  const { theme, preset } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Mouse move parallax values (using framer-motion springs for premium smoothness)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  // Floating pills parallax transforms - slightly boosted for interactive satisfaction
  const pillX1 = useTransform(springX, (x) => x * 2.2);
  const pillY1 = useTransform(springY, (y) => y * 2.2);
  const pillX2 = useTransform(springX, (x) => x * -1.8);
  const pillY2 = useTransform(springY, (y) => y * -1.8);
  const pillX3 = useTransform(springX, (x) => x * 1.2);
  const pillY3 = useTransform(springY, (y) => y * 1.2);

  // Determine mobile client side to adjust particle density
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Window mouse move listener for parallax
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 10;
      const y = (e.clientY - innerHeight / 2) / 10;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Main Canvas Rendering Loop (Drifting starfield, cosmic dust, orbital rings & shooting stars)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let orbitAngle = 0;
    let isVisible = true;
    let isTabActive = true;

    // Use IntersectionObserver to pause loop when canvas is off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (canvas) {
      io.observe(canvas);
    }

    const handleVisibility = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Resize canvas to parent bounds
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initStars();
    };

    // Initialize stars with varied depth, slow drifting speeds, and interactive glows
    const initStars = () => {
      let baseCount = 75; // Optimized from 130
      if (preset === "clean-light") baseCount = 15; // minimal particles for Clean Light
      else if (variant === "subtle") baseCount = 40;
      else if (variant === "projects") baseCount = 20;
      else if (variant === "footer") baseCount = 25;

      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      let count = baseCount;
      if (isMobile) {
        count = Math.min(12, Math.floor(baseCount * 0.25)); // Mobile: max 12
      } else if (isTablet) {
        count = Math.min(35, Math.floor(baseCount * 0.5));  // Tablet: max 35
      } else {
        count = Math.min(75, baseCount); // Desktop: max 75
      }

      stars = [];
      const colorTypes: ("white" | "blue" | "orange")[] = ["white", "white", "white", "blue", "orange"];

      for (let i = 0; i < count; i++) {
        const depth = Math.random() * 0.75 + 0.1; // depth factor for 3D parallax
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Premium sizing variety
          size: Math.random() * (depth > 0.6 ? 2.2 : 1.2) + 0.4,
          depth,
          alpha: Math.random() * 0.8 + 0.15,
          twinkleSpeed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
          // Drift velocity for a breathing universe
          vx: (Math.random() * 0.06 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
          vy: (Math.random() * 0.04 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
          colorType: colorTypes[Math.floor(Math.random() * colorTypes.length)],
          pulseGlow: Math.random() > 0.82 // 18% of stars have high-end neon glowing halos
        });
      }
    };

    // Create a ResizeObserver for responsive bounds
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    resizeCanvas();

    // Shooting star trigger interval (every 7-11 seconds for more delight)
    const spawnShootingStar = () => {
      if (isMobile || prefersReducedMotion || variant === "projects") return;
      if (!isVisible || !isTabActive) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      shootingStarRef.current = {
        x: Math.random() * (width * 0.4),
        y: Math.random() * (height * 0.3),
        dx: 9 + Math.random() * 5,
        dy: 4 + Math.random() * 3,
        length: 120 + Math.random() * 100,
        speed: 1.8 + Math.random() * 1.6,
        alpha: 1.0,
        active: true
      };
    };

    const shootingStarTimer = setInterval(() => {
      spawnShootingStar();
    }, 7500);

    // Initial delay trigger for a quick satisfying entry
    setTimeout(() => {
      spawnShootingStar();
    }, 2500);

    // Interpolated smooth mouse coordinates for parallax updates inside the requestAnimationFrame loop
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    // Render loop
    const render = () => {
      // Pause updates completely if not in viewport or background tab
      if (!isVisible || !isTabActive) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse coordinates towards target
      if (!prefersReducedMotion) {
        smoothMouseX += (mouseX.get() - smoothMouseX) * 0.06;
        smoothMouseY += (mouseY.get() - smoothMouseY) * 0.06;
      }

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Satisfying Ambient Space Dust Nebula (Cosmic Glow)
      const nebulaCenterX = width * (isMobile ? 0.5 : 0.72) + smoothMouseX * 1.5;
      const nebulaCenterY = height * (isMobile ? 0.38 : 0.45) + smoothMouseY * 1.5;
      
      ctx.save();
      const nebulaGrad = ctx.createRadialGradient(
        nebulaCenterX, nebulaCenterY, 20,
        nebulaCenterX, nebulaCenterY, isMobile ? 250 : 500
      );
      
      if (preset === "cosmic-orange") {
        nebulaGrad.addColorStop(0, `rgba(255, 106, 0, ${0.12 * intensity})`); // Richer orange center glow
        nebulaGrad.addColorStop(0.35, `rgba(255, 106, 0, ${0.04 * intensity})`);
        nebulaGrad.addColorStop(0.7, `rgba(14, 165, 233, ${0.015 * intensity})`); // Deep blue/cyan outer edge
        nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else if (preset === "neon-purple") {
        nebulaGrad.addColorStop(0, `rgba(168, 85, 247, ${0.14 * intensity})`); // Neon purple cosmic glow
        nebulaGrad.addColorStop(0.35, `rgba(139, 92, 246, ${0.05 * intensity})`);
        nebulaGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.02 * intensity})`); // Cyan halo edge
        nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        nebulaGrad.addColorStop(0, `rgba(255, 106, 0, ${0.05 * intensity})`); // Soft elegant amber peach in light mode
        nebulaGrad.addColorStop(0.5, `rgba(255, 106, 0, ${0.01 * intensity})`);
        nebulaGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Draw Twinkling & Drifting Stars with parallax depth
      stars.forEach((star) => {
        // Drift movement
        if (!prefersReducedMotion) {
          star.x += star.vx;
          star.y += star.vy;
          
          // Wrap screen boundaries elegantly
          if (star.x < 0) star.x += width;
          if (star.x > width) star.x -= width;
          if (star.y < 0) star.y += height;
          if (star.y > height) star.y -= height;
          
          // Twinkle alpha updates
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 1.0 || star.alpha < 0.1) {
            star.twinkleSpeed = -star.twinkleSpeed;
          }
        }

        // Parallax projection offset based on star depth (closer stars move more)
        const offsetX = smoothMouseX * star.depth * 4;
        const offsetY = smoothMouseY * star.depth * 4;

        let renderX = star.x + offsetX;
        let renderY = star.y + offsetY;

        // Ensure rendering positions wrap nicely
        if (renderX < 0) renderX += width;
        if (renderX > width) renderX -= width;
        if (renderY < 0) renderY += height;
        if (renderY > height) renderY -= height;

        // Dynamic theme-specific alpha styling
        const modeAlpha = (theme === "dark" ? star.alpha : star.alpha * 0.38) * intensity;

        // Draw pulsing star halo glow if designated
        if (star.pulseGlow && theme === "dark" && modeAlpha > 0.4) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size * 3.8, 0, Math.PI * 2);
          const glowColor = star.colorType === "orange" 
            ? (preset === "neon-purple" ? "168, 85, 247" : "255, 106, 0") 
            : star.colorType === "blue" ? "56, 189, 248" : "255, 255, 255";
          ctx.fillStyle = `rgba(${glowColor}, ${modeAlpha * 0.16})`;
          ctx.fill();
        }

        // Draw core star particle
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);

        // Theme-aware high fidelity colors
        if (theme === "dark") {
          if (star.colorType === "blue") {
            ctx.fillStyle = `rgba(56, 189, 248, ${modeAlpha})`; // Electric Cyan/Blue
          } else if (star.colorType === "orange") {
            if (preset === "neon-purple") {
              ctx.fillStyle = `rgba(168, 85, 247, ${modeAlpha * 1.1})`; // Bright cosmic purple/lavender
            } else {
              ctx.fillStyle = `rgba(255, 106, 0, ${modeAlpha * 1.1})`; // Cosmic orange
            }
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${modeAlpha})`; // Pure star white
          }
        } else {
          // Soft visible particles in light mode
          if (star.colorType === "orange") {
            ctx.fillStyle = `rgba(255, 106, 0, ${modeAlpha * 0.95})`;
          } else {
            ctx.fillStyle = `rgba(15, 23, 42, ${modeAlpha * 0.55})`;
          }
        }
        ctx.fill();
      });

      // 3. Draw Rotating Orbital Rings (More defined, thicker & glowing)
      const centerX = width * (isMobile ? 0.5 : 0.72);
      const centerY = height * (isMobile ? 0.38 : 0.45);

      // Define orbital style attributes dynamically based on the preset
      let orbitStrokeColor = "rgba(255, 106, 0, 0.15)";
      let orbitGlowColor = "rgba(255, 106, 0, 0.04)";
      let orbitNodeColor = "rgba(255, 255, 255, 0.9)";
      let nodeAuraColor = "rgba(255, 106, 0, 0.2)";

      if (preset === "cosmic-orange") {
        orbitStrokeColor = `rgba(255, 106, 0, ${0.2 * intensity})`;
        orbitGlowColor = `rgba(255, 106, 0, ${0.06 * intensity})`;
        orbitNodeColor = `rgba(255, 255, 255, ${0.9 * intensity})`;
        nodeAuraColor = `rgba(255, 106, 0, ${0.25 * intensity})`;
      } else if (preset === "neon-purple") {
        orbitStrokeColor = `rgba(168, 85, 247, ${0.22 * intensity})`;
        orbitGlowColor = `rgba(168, 85, 247, ${0.08 * intensity})`;
        orbitNodeColor = `rgba(255, 255, 255, ${0.9 * intensity})`;
        nodeAuraColor = `rgba(168, 85, 247, ${0.28 * intensity})`;
      } else { // clean-light
        orbitStrokeColor = `rgba(255, 106, 0, ${0.04 * intensity})`;
        orbitGlowColor = "rgba(0, 0, 0, 0)";
        orbitNodeColor = `rgba(255, 106, 0, ${0.6 * intensity})`;
        nodeAuraColor = `rgba(255, 106, 0, ${0.08 * intensity})`;
      }

      // Boosted orbit parameters for higher visual satisfaction
      const allOrbits = [
        { 
          rx: isMobile ? 140 : 230, 
          ry: isMobile ? 48 : 82, 
          tilt: -10 * Math.PI / 180, 
          speedMult: 0.22, 
          stroke: orbitStrokeColor, 
          glow: orbitGlowColor,
          dash: [6, 12],
          nodeCount: 1
        },
        { 
          rx: isMobile ? 230 : 380, 
          ry: isMobile ? 78 : 130, 
          tilt: 20 * Math.PI / 180, 
          speedMult: -0.14, 
          stroke: orbitStrokeColor, 
          glow: orbitGlowColor,
          dash: [12, 18],
          nodeCount: 2
        },
        { 
          rx: isMobile ? 340 : 540, 
          ry: isMobile ? 115 : 185, 
          tilt: -4 * Math.PI / 180, 
          speedMult: 0.09, 
          stroke: orbitStrokeColor, 
          glow: orbitGlowColor,
          dash: [4, 15],
          nodeCount: 1
        },
      ];

      const orbits = variant === "hero" 
        ? allOrbits 
        : variant === "subtle" 
          ? [allOrbits[1]] 
          : [];

      orbitAngle += prefersReducedMotion ? 0.00015 : 0.0012; // slightly faster rotating dynamics

      orbits.forEach((orb) => {
        const currentTilt = orb.tilt;

        // Immersive parallax shifts coordinates of the orbital grid
        const pxCenterX = centerX + smoothMouseX * 0.9;
        const pxCenterY = centerY + smoothMouseY * 0.9;

        // Draw ambient glow ellipse beneath in dark mode
        if (theme === "dark" && preset !== "clean-light") {
          ctx.beginPath();
          ctx.ellipse(pxCenterX, pxCenterY, orb.rx, orb.ry, currentTilt, 0, Math.PI * 2);
          ctx.strokeStyle = orb.glow;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Draw fine crisp orbit border
        ctx.beginPath();
        ctx.ellipse(pxCenterX, pxCenterY, orb.rx, orb.ry, currentTilt, 0, Math.PI * 2);
        ctx.strokeStyle = orb.stroke;
        ctx.lineWidth = 1.2;
        ctx.setLineDash(orb.dash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw multiple orbiting satellites/nodes per ring for dramatic cinematic touch
        for (let n = 0; n < orb.nodeCount; n++) {
          const nodeAngle = (orbitAngle * orb.speedMult * 4) + (n * Math.PI) + (orb.rx * 2.3);
          const cosT = Math.cos(nodeAngle);
          const sinT = Math.sin(nodeAngle);
          const cosTheta = Math.cos(currentTilt);
          const sinTheta = Math.sin(currentTilt);

          // Calculate precise tilted planetary coordinate
          const nodeX = pxCenterX + orb.rx * cosT * cosTheta - orb.ry * sinT * sinTheta;
          const nodeY = pxCenterY + orb.rx * cosT * sinTheta + orb.ry * sinT * cosTheta;

          // Planet aura glow
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, theme === "dark" ? 6.5 : 4.5, 0, Math.PI * 2);
          ctx.fillStyle = nodeAuraColor;
          ctx.fill();

          // Planet solid core
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, theme === "dark" ? 2.5 : 2.0, 0, Math.PI * 2);
          ctx.fillStyle = orbitNodeColor;
          ctx.fill();
        }
      });

      // 4. Draw shooting star
      const ss = shootingStarRef.current;
      if (ss && ss.active) {
        if (!prefersReducedMotion) {
          ss.x += ss.dx * ss.speed;
          ss.y += ss.dy * ss.speed;
          ss.alpha -= 0.014; // smooth fading trailing tail
        }

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          ss.active = false;
        } else {
          // Draw trail gradient with boosted cosmic glow colors
          const grad = ctx.createLinearGradient(
            ss.x,
            ss.y,
            ss.x - ss.dx * (ss.length / 10),
            ss.y - ss.dy * (ss.length / 10)
          );
          
          const alphaMult = theme === "dark" ? ss.alpha : ss.alpha * 0.5;
          let colorHead = "255, 106, 0"; // Orange
          let colorMid = "255, 166, 77";
          let colorTail = "255, 106, 0";
          
          if (preset === "neon-purple") {
            colorHead = "168, 85, 247"; // Purple
            colorMid = "192, 132, 252";
            colorTail = "139, 92, 246";
          }
          
          grad.addColorStop(0, `rgba(${colorHead}, ${alphaMult * 0.9})`);
          grad.addColorStop(0.2, `rgba(${colorMid}, ${alphaMult * 0.65})`);
          grad.addColorStop(0.6, `rgba(${colorTail}, ${alphaMult * 0.3})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - ss.dx * (ss.length / 10), ss.y - ss.dy * (ss.length / 10));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Draw bright core head
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alphaMult})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(shootingStarTimer);
    };
  }, [theme, isMobile, prefersReducedMotion, intensity, variant]);

  // Definition of Floating orbital code pills (React, Next.js, Firebase, API, Dashboard)
  const floatingPills = [
    { text: "<React />", x: "8%", y: "24%", transform: { x: pillX1, y: pillY1 }, color: "text-brand-orange border-brand-orange/20 dark:border-brand-orange/30 shadow-brand-orange/5", dot: true, animateY: [-6, 6, -6] },
    { text: "Next.js", x: "74%", y: "17%", transform: { x: pillX2, y: pillY2 }, color: "text-text-secondary border-border-primary", dot: false, animateY: [5, -5, 5] },
    { text: "Firebase", x: "42%", y: "13%", transform: { x: pillX3, y: pillY3 }, color: "text-text-secondary border-border-primary", dot: false, animateY: [-4, 4, -4] },
    { text: "API Router", x: "85%", y: "62%", transform: { x: pillX1, y: pillY3 }, color: "text-brand-orange border-brand-orange/20 dark:border-brand-orange/30 shadow-brand-orange/5", dot: false, animateY: [6, -6, 6] },
    { text: "UI Motion", x: "13%", y: "78%", transform: { x: pillX2, y: pillY1 }, color: "text-text-secondary border-border-primary", dot: false, animateY: [-5, 5, -5] },
  ];

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {/* HTML5 Canvas starfield */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Floating Code Pills Layer with gentle orbital floating motion + parallax */}
      {variant === "hero" && (
        <div className="absolute inset-0 hidden md:block z-10 select-none">
          {floatingPills.map((pill, idx) => (
            <motion.div
              key={idx}
              style={{ 
                left: pill.x, 
                top: pill.y,
                x: pill.transform.x,
                y: pill.transform.y
              }}
              className="absolute"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { y: pill.animateY }}
                transition={{
                  duration: 5 + idx,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`px-3.5 py-1.5 bg-bg-secondary/75 border rounded-xl font-mono text-[10px] flex items-center gap-1.5 backdrop-blur-sm shadow-md transition-all duration-350 ${pill.color}`}
              >
                {pill.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                )}
                <span>{pill.text}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Outer surrounding atmospheric soft glows overlay */}
      <div 
        style={{ 
          opacity: preset === "clean-light" ? intensity * 0.025 : intensity * 0.05, 
          backgroundColor: "var(--brand-orange)" 
        }}
        className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full blur-[140px] pointer-events-none" 
      />
      <div 
        style={{ 
          opacity: preset === "clean-light" ? intensity * 0.015 : intensity * 0.035, 
          backgroundColor: "var(--brand-orange)" 
        }}
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none" 
      />
    </div>
  );
}

