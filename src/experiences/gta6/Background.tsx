import React, { useEffect, useRef, useState } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation Loop for Sunset Mesh Gradient, Neon Haze, and Twinkling City Lights
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isVisible = true;
    let isTabActive = true;

    // IntersectionObserver to pause loop when canvas is off-screen
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

    const handleWindowResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleWindowResize);

    // Dynamic ambient drift particles
    interface AmbientParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }

    const particles: AmbientParticle[] = [];
    const colors = ["rgba(255, 0, 127, 0.15)", "rgba(255, 94, 0, 0.12)", "rgba(0, 245, 255, 0.08)"];

    const pCount = isMobile ? 12 : 30;
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Static skyline building definitions to prevent shaking on resize
    interface Building {
      xPercent: number; // position from left in %
      widthPercent: number; // width in %
      heightPercent: number; // height from horizon in %
      windows: { rxPercent: number; ryPercent: number; color: string; speed: number; offset: number }[];
    }

    const buildings: Building[] = [];
    const buildingColors = ["#f8fafc", "#ffd600", "#ff00a8", "#00ffff"];
    
    // Generate static skyline buildings centered around the horizon
    const bCount = 18;
    let currentXPercent = 10;
    for (let i = 0; i < bCount; i++) {
      const bWidthPercent = Math.random() * 4 + 2; // 2% to 6% of screen width
      const bHeightPercent = Math.random() * 12 + 4; // 4% to 16% height relative to screen height
      
      const windows = [];
      const rows = Math.floor(Math.random() * 4) + 3;
      const cols = Math.floor(Math.random() * 3) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.4) {
            windows.push({
              rxPercent: (c + 1) / (cols + 1),
              ryPercent: (r + 1) / (rows + 1),
              color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
              speed: Math.random() * 0.02 + 0.005,
              offset: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      buildings.push({
        xPercent: currentXPercent,
        widthPercent: bWidthPercent,
        heightPercent: bHeightPercent,
        windows,
      });

      currentXPercent += bWidthPercent + (Math.random() * 2 - 0.5);
      if (currentXPercent > 90) break;
    }

    let time = 0;

    const render = () => {
      if (!isVisible || !isTabActive) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. SUNSET MESH GRADIENT BACKDROP
      // Create a smooth, rich multi-stop linear gradient for the backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#080112"); // Deepest navy purple night
      bgGrad.addColorStop(0.35, "#150228"); // Twilight violet
      bgGrad.addColorStop(0.6, "#2c043b"); // Sunset magenta-indigo
      bgGrad.addColorStop(0.75, "#4c053c"); // Sunset crimson-pink
      bgGrad.addColorStop(0.9, "#3a0633"); // Soft warm mauve
      bgGrad.addColorStop(1, "#0f011c"); // Bottom dark purple
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. SOFT NEON HAZE (Overlapping large radial glowing blobs)
      // Pulsing Pink Neon Glow in the center-left
      const leftGlowRadius = Math.min(width, height) * 0.6;
      const leftGlowX = width * 0.25 + Math.sin(time * 0.5) * 30;
      const leftGlowY = height * 0.5 + Math.cos(time * 0.5) * 20;
      const leftGlow = ctx.createRadialGradient(leftGlowX, leftGlowY, 0, leftGlowX, leftGlowY, leftGlowRadius);
      leftGlow.addColorStop(0, "rgba(255, 0, 127, 0.08)");
      leftGlow.addColorStop(0.5, "rgba(255, 0, 127, 0.03)");
      leftGlow.addColorStop(1, "rgba(255, 0, 127, 0)");
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, width, height);

      // Warm Orange Neon Haze in the center-right
      const rightGlowRadius = Math.min(width, height) * 0.5;
      const rightGlowX = width * 0.75 + Math.cos(time * 0.4) * 40;
      const rightGlowY = height * 0.4 + Math.sin(time * 0.4) * 30;
      const rightGlow = ctx.createRadialGradient(rightGlowX, rightGlowY, 0, rightGlowX, rightGlowY, rightGlowRadius);
      rightGlow.addColorStop(0, "rgba(255, 94, 0, 0.06)");
      rightGlow.addColorStop(0.6, "rgba(255, 94, 0, 0.02)");
      rightGlow.addColorStop(1, "rgba(255, 94, 0, 0)");
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, width, height);

      // Horizon sunset glow (simulating the soft low sun haze)
      const sunHazeRadius = Math.min(width, height) * 0.4;
      const sunHazeX = width * 0.5;
      const sunHazeY = height * 0.7;
      const sunHaze = ctx.createRadialGradient(sunHazeX, sunHazeY, 0, sunHazeX, sunHazeY, sunHazeRadius);
      sunHaze.addColorStop(0, "rgba(255, 170, 0, 0.07)");
      sunHaze.addColorStop(0.4, "rgba(255, 94, 0, 0.03)");
      sunHaze.addColorStop(1, "rgba(255, 94, 0, 0)");
      ctx.fillStyle = sunHaze;
      ctx.fillRect(0, 0, width, height);

      // 3. FAINT CITY-LIGHT GLOW & SKYLINE
      const horizonY = height * 0.72;

      // Draw distant, soft city silhouetted skyline
      ctx.save();
      buildings.forEach((b) => {
        const bX = (b.xPercent / 100) * width;
        const bW = (b.widthPercent / 100) * width;
        const bH = (b.heightPercent / 100) * height;
        const bY = horizonY - bH;

        // Soft gradient for silhouetted building merging with background
        const bGrad = ctx.createLinearGradient(bX, bY, bX, horizonY);
        bGrad.addColorStop(0, "#0e021c"); // Silhouette top
        bGrad.addColorStop(1, "#07000e"); // Deep silhouette bottom
        ctx.fillStyle = bGrad;
        
        // Soft building outline
        ctx.fillRect(bX, bY, bW, bH);

        // Faint border to give a premium subtle neon rim light to the buildings
        ctx.strokeStyle = "rgba(255, 0, 127, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bX, bY, bW, bH);

        // Draw twinkling windows (faint city-lights)
        b.windows.forEach((win) => {
          const winX = bX + win.rxPercent * bW;
          const winY = bY + win.ryPercent * bH;
          const size = isMobile ? 1 : 1.5;

          // Twinkling animation based on time
          const twinkle = Math.abs(Math.sin(time * win.speed * 100 + win.offset));
          ctx.fillStyle = win.color;
          ctx.globalAlpha = twinkle * 0.35 + 0.15; // keep it faint and premium
          ctx.fillRect(winX, winY, size, size);
        });
        ctx.globalAlpha = 1.0; // reset
      });
      ctx.restore();

      // 4. EXTRA SUBTLE PERSPECTIVE HORIZON GRID (Faint city-light glow)
      const gridHeight = height - horizonY;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 0, 127, 0.03)"; // extremely faint for luxury look
      ctx.lineWidth = 0.8;

      // Vanishing lines
      const vanishingX = width / 2;
      const vanishingY = horizonY - 120;
      const linesCount = isMobile ? 10 : 20;
      for (let i = 0; i <= linesCount; i++) {
        const xOffset = (width / linesCount) * i;
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY + 120);
        ctx.lineTo(xOffset, height);
        ctx.stroke();
      }

      // Horizontal lines with exponential spacing
      const hLinesCount = 8;
      for (let i = 0; i < hLinesCount; i++) {
        const ratio = i / hLinesCount;
        const currentY = horizonY + Math.pow(ratio, 2.0) * gridHeight;
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(width, currentY);
        ctx.stroke();
      }
      ctx.restore();

      // 5. AMBIENT DRIFT PARTICLES (Soft stars/embers floating)
      ctx.save();
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.y * 0.005) * 0.1; // gentle swaying

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.restore();

      // Horizontal subtle glowing streak (shooting light trail) at the bottom
      ctx.fillStyle = "rgba(255, 0, 127, 0.015)";
      ctx.fillRect(0, horizonY, width, 1.5);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleWindowResize);
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0"
    >
      {/* Dynamic Animated Canvas Backdrop */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* SVG Silhouetted Palm Trees (Vice City Style) - Made ultra subtle */}
      <div className="absolute inset-x-0 bottom-0 h-[280px] w-full flex justify-between pointer-events-none select-none z-[1]">
        {/* Left Palm cluster */}
        <svg
          className="w-[140px] sm:w-[260px] h-full fill-[#06000d] drop-shadow-[0_0_10px_rgba(255,0,127,0.06)] opacity-65 self-end transform -scale-x-100 transition-opacity duration-500"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M10,100 Q15,60 22,25 Q23,20 25,10 C25,10 32,15 30,22 C29,26 23,28 22,25 M22,25 Q35,28 32,36 C30,40 23,34 22,25 M22,25 Q38,18 42,26 C44,30 35,32 22,25 M22,25 Q38,8 35,0 C34,0 28,12 22,25 M22,25 Q18,8 10,2 C10,2 14,12 22,25 M22,25 Q5,22 0,14 C0,14 8,24 22,25 M22,25 Q2,35 0,44 C0,44 10,32 22,25" />
          <path d="M40,100 Q43,75 48,50 Q49,46 51,38 C51,38 57,41 55,47 C54,51 49,52 48,50 M48,50 Q58,52 55,59 C54,62 49,57 48,50 M48,50 Q61,45 64,51 C66,54 58,56 48,50 M48,50 Q61,36 59,30 C58,30 53,39 48,50 M48,50 Q45,36 38,31 C38,31 41,39 48,50" />
        </svg>

        {/* Right Palm cluster */}
        <svg
          className="w-[140px] sm:w-[260px] h-full fill-[#06000d] drop-shadow-[0_0_10px_rgba(255,0,127,0.06)] opacity-65 self-end transition-opacity duration-500"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M10,100 Q15,60 22,25 Q23,20 25,10 C25,10 32,15 30,22 C29,26 23,28 22,25 M22,25 Q35,28 32,36 C30,40 23,34 22,25 M22,25 Q38,18 42,26 C44,30 35,32 22,25 M22,25 Q38,8 35,0 C34,0 28,12 22,25 M22,25 Q18,8 10,2 C10,2 14,12 22,25 M22,25 Q5,22 0,14 C0,14 8,24 22,25 M22,25 Q2,35 0,44 C0,44 10,32 22,25" />
          <path d="M40,100 Q43,75 48,50 Q49,46 51,38 C51,38 57,41 55,47 C54,51 49,52 48,50 M48,50 Q58,52 55,59 C54,62 49,57 48,50 M48,50 Q61,45 64,51 C66,54 58,56 48,50 M48,50 Q61,36 59,30 C58,30 53,39 48,50 M48,50 Q45,36 38,31 C38,31 41,39 48,50" />
        </svg>
      </div>

      {/* Cyber VHS scanlines and noise layer overlay - optimized */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#ff007f]/[0.008] to-transparent pointer-events-none animate-pulse duration-[5000ms]" />

      {/* Subtle lens flare reflection glow in corners */}
      <div className="absolute top-[-10%] left-[5%] w-[35vw] h-[35vw] bg-pink-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[2%] w-[30vw] h-[30vw] bg-[#ff5e00]/[0.03] rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
