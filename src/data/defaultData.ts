/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile, Project, Skill, Service, Testimonial, SiteSettings, ExperienceSettings } from "../types";

export const defaultProfile: Profile = {
  name: "Leanur Rahman",
  role: "Full Stack Developer",
  title: "I Build Full-Stack Web Experiences That Help Brands Grow",
  tagline: "I’m Leanur Rahman, a Full Stack Developer from Bangladesh helping businesses build fast, modern, scalable, and conversion-focused web applications.",
  bio: "Hi, I’m Leanur Rahman, a passionate CSE student at International Islamic University Chittagong and a Full Stack Developer focused on building clean, responsive, and scalable web applications. I enjoy solving real-world problems through code and creating digital products that are fast, user-friendly, and business-focused. I work with React, Next.js, Tailwind CSS, Node.js, Express, MongoDB, MySQL, and modern web technologies. I’m open to freelance projects, remote internships, and collaboration opportunities.",
  location: "Chattogram, Bangladesh",
  email: "techbulletcodeyt@gmail.com",
  phone: "+880 1800-000000",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80", // High quality placeholder
  cvUrl: "#",
  availabilityStatus: "available",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    email: "mailto:techbulletcodeyt@gmail.com"
  },
  education: {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "International Islamic University Chittagong (IIUC)",
    year: "2023 - Present"
  }
};

export const defaultProjects: Project[] = [
  {
    id: "food-delivery",
    title: "BiteSpeed - Premium Food Delivery Web App",
    shortDescription: "A multi-vendor food ordering and delivery system with real-time tracking, secure checkout, and full vendor/rider panels.",
    longDescription: "BiteSpeed is a fully responsive, enterprise-grade food delivery application. It bridges the gap between local food joints, hungry clients, and independent delivery drivers. The application includes dynamic carts, geo-location mapping, and a robust admin dashboard for monitoring real-time logistics and sales summaries.",
    techStack: ["React", "Next.js", "Tailwind CSS", "Node.js", "MongoDB", "Socket.io"],
    category: "Full Stack",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://example.com/bitespeed",
    githubLink: "https://github.com",
    featured: true,
    client: "BiteSpeed Inc.",
    year: "2025",
    problemSolved: "Local food vendors struggled to reach off-premise clients without paying heavy 30% commissions to legacy corporate aggregators. BiteSpeed provides a localized, low-overhead direct ordering solution.",
    keyFeatures: [
      "Live order-status tracking with map routing",
      "Comprehensive vendor dashboard for menu, staff, and pricing control",
      "Stripe checkout integration with customizable promo code gates",
      "Rider tracking engine using Geolocation APIs"
    ],
    results: "Enabled 45 local restaurants to process over $120,000 in direct orders within Chattogram within the first 3 months of launch, cutting service costs by 60%.",
    gallery: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
    ],
    order: 1
  },
  {
    id: "learning-platform",
    title: "Academia - Interactive Learning Management System",
    shortDescription: "A modern, responsive LMS enabling instructors to sell courses, track student progression, and host live assignments.",
    longDescription: "Academia is an elegant e-learning platform with comprehensive support for rich text courses, embedded streaming videos, student gradebooks, interactive quizzes, and custom certificates. Includes complete admin CMS panels to facilitate simple content upload.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Mux Video"],
    category: "Full Stack",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://example.com/academia",
    githubLink: "https://github.com",
    featured: true,
    client: "Academia Ltd.",
    year: "2025",
    problemSolved: "Instructors needed an intuitive interface to build courses with automated video transcripts and direct student quizzes without technical over-complications.",
    keyFeatures: [
      "On-demand video streaming with custom playback speed controls",
      "Automated custom certificate generation upon course completion",
      "Quiz constructor with support for multiple-choice and code sandbox assignments",
      "Real-time student progress analytics"
    ],
    results: "Currently used by 3 separate online training bootcamps, hosting over 5,000 active students and generating consistent subscription revenues.",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    ],
    order: 2
  },
  {
    id: "ecommerce-dashboard",
    title: "Apex - Multi-Tenant E-commerce Dashboard",
    shortDescription: "A lightning-fast store manager equipped with comprehensive charts, inventory trackers, and dynamic invoicing systems.",
    longDescription: "Apex is a glassmorphism admin template built specifically to handle complex high-volume retail logistics. It allows store owners to track sales, manage multiple physical locations, view active customer shopping sessions, and automate shipping calculations in real-time.",
    techStack: ["React", "Vite", "Tailwind CSS", "Recharts", "Express.js", "MySQL"],
    category: "Frontend/UI",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://example.com/apex-dashboard",
    githubLink: "https://github.com",
    featured: false,
    client: "Apex Brands",
    year: "2024",
    problemSolved: "Legacy retail systems were cluttered, slow, and non-responsive. Apex provides a mobile-first, lightweight dashboard that responds in sub-100ms.",
    keyFeatures: [
      "Custom interactive sales charts with daily/weekly filters",
      "Low-stock alert thresholds with automated email procurement notifications",
      "Multi-currency conversion system",
      "PDF invoicing export module"
    ],
    results: "Reduced the time store managers spent on inventory updates by 40% and simplified sales tracking for non-technical staff.",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    ],
    order: 3
  },
  {
    id: "task-manager",
    title: "Flow - Collaborative Task Management Platform",
    shortDescription: "A drag-and-drop Kanban board tool built for high-performance development teams, featuring real-time state sync.",
    longDescription: "Flow brings modern remote workspace collaboration to the browser. Designed with ultra-smooth drag-and-drop interfaces, direct comments, file attachments, and direct sprint planning logs, it keeps agile teams completely in sync.",
    techStack: ["React", "Framer Motion", "Tailwind CSS", "Firebase Firestore", "Firebase Auth"],
    category: "Full Stack",
    thumbnail: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://example.com/flow-tasks",
    githubLink: "https://github.com",
    featured: false,
    client: "Flow Workspace S.A.",
    year: "2024",
    problemSolved: "Traditional Kanban boards were heavy, loaded slowly, and suffered from poor real-time mobile optimization.",
    keyFeatures: [
      "Smooth physics-based drag-and-drop column transfers",
      "Real-time multi-user status and cursor presence indications",
      "Robust project filters by priority levels and assignee tags",
      "Weekly team velocity calculations"
    ],
    results: "Adopted by 12 client engineering teams in Bangladesh as their daily driver scrum companion, boosting task completion rates by 15%.",
    gallery: [
      "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=800&q=80"
    ],
    order: 4
  }
];

export const defaultSkills: Skill[] = [
  // Frontend
  { id: "s1", name: "React", category: "Frontend", proficiency: 90 },
  { id: "s2", name: "Next.js", category: "Frontend", proficiency: 85 },
  { id: "s3", name: "TypeScript", category: "Frontend", proficiency: 85 },
  { id: "s4", name: "Tailwind CSS", category: "Frontend", proficiency: 95 },
  { id: "s5", name: "JavaScript", category: "Frontend", proficiency: 90 },
  { id: "s6", name: "Framer Motion", category: "Frontend", proficiency: 80 },
  // Backend
  { id: "s7", name: "Node.js", category: "Backend", proficiency: 80 },
  { id: "s8", name: "Express.js", category: "Backend", proficiency: 85 },
  { id: "s9", name: "MongoDB", category: "Backend", proficiency: 80 },
  { id: "s10", name: "Firebase", category: "Backend", proficiency: 90 },
  { id: "s11", name: "MySQL", category: "Backend", proficiency: 75 },
  { id: "s12", name: "REST APIs", category: "Backend", proficiency: 90 },
  // Tools
  { id: "s13", name: "Git & GitHub", category: "Tools", proficiency: 88 },
  { id: "s14", name: "VS Code", category: "Tools", proficiency: 95 },
  { id: "s15", name: "Figma", category: "Tools", proficiency: 75 },
  { id: "s16", name: "Postman", category: "Tools", proficiency: 85 },
  { id: "s17", name: "Vercel", category: "Tools", proficiency: 90 },
  // Programming
  { id: "s18", name: "C / C++", category: "Programming", proficiency: 85 },
  { id: "s19", name: "Data Structures", category: "Programming", proficiency: 80 },
  { id: "s20", name: "Algorithms", category: "Programming", proficiency: 78 },
  { id: "s21", name: "Problem Solving", category: "Programming", proficiency: 82 }
];

export const defaultServices: Service[] = [
  {
    id: "ser1",
    title: "Full Stack Web Application Development",
    description: "End-to-end engineering of modern web applications. Utilizing React/Next.js for pixel-perfect, highly responsive frontends, paired with secure, performant, and scalable APIs and databases.",
    icon: "Layers",
    active: true,
    ctaText: "Let's Build It"
  },
  {
    id: "ser2",
    title: "Business Landing Pages & UI/UX Design",
    description: "High-conversion, stunningly polished landing pages specifically designed to attract customers, present products clearly, and convert traffic into leads and recurring revenues.",
    icon: "Layout",
    active: true,
    ctaText: "Boost Sales"
  },
  {
    id: "ser3",
    title: "Custom Admin Dashboards & CMS Platforms",
    description: "Tailored content management solutions and data dashboards that grant you full control over your client records, catalog items, and analytics metrics without requiring code knowledge.",
    icon: "TrendingUp",
    active: true,
    ctaText: "Get Dashboard"
  },
  {
    id: "ser4",
    title: "Website Redesign & Performance Optimization",
    description: "Optimizing slow loading times and upgrading legacy user experiences. I tune search performance scores and adapt code architectures to satisfy the latest web core vitals standards.",
    icon: "Gauge",
    active: true,
    ctaText: "Optimize Now"
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    clientName: "Sarah Jenkins",
    clientRole: "Co-founder",
    clientCompany: "DevScale Solutions",
    message: "Working with Leanur was an absolute pleasure. He delivered our business landing page in record time with a level of animation polish we hadn't seen before. Our conversion rates have soared by 25% since launch!",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "t2",
    clientName: "Michael Chen",
    clientRole: "Director of Product",
    clientCompany: "LearnFlow Platform",
    message: "Leanur completely overhauled our student dashboard UI. His understanding of full-stack integration with Firebase meant he was able to debug complex real-time socket syncing on his own. Absolute professional.",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
];

export const defaultSiteSettings: SiteSettings = {
  logoText: "Leanur.dev",
  themeColor: "#3b82f6",
  seoTitle: "Leanur Rahman | Full-Stack Developer Portfolio",
  seoDescription: "Hi, I am Leanur Rahman, a Full Stack Developer from Bangladesh. I help brands grow by creating lightning-fast, highly responsive, and beautiful custom web applications.",
  footerText: "© 2026 Leanur Rahman. All rights reserved. Chattogram, Bangladesh.",
  contactEmail: "techbulletcodeyt@gmail.com",
  maintenanceMode: false,
  welcomeMessage: "Hi! I’m Leanur. Tell me about your project and I’ll reply soon.",
  defaultExperience: "cosmic",
  defaultThemePreset: "cosmic-orange",
  allowPublicExperienceSwitching: true,
  showSpecialExperiences: true,
  fallbackTheme: "cosmic-orange"
};

export const defaultExperienceSettings: ExperienceSettings = {
  cosmic: {
    enabled: true,
    profileImageOverride: "",
    heroImageOverride: "",
    accentColor: "#1cd8d2",
    backgroundIntensity: "medium"
  },
  gta6: {
    enabled: true,
    publicVisible: true,
    displayName: "GTA VI",
    description: "Vibrant neon pink sunset aesthetic inspired by Vice City",
    profileImageOverride: "",
    heroImageOverride: "",
    primaryPink: "#ff007f",
    secondaryOrange: "#ff5e00",
    backgroundPurple: "#0d0118",
    cinematicEffectsEnabled: true
  },
  appleGlass: {
    enabled: true,
    publicVisible: true,
    displayName: "Apple Glass",
    description: "Ultra-minimal bento layouts, premium glassmorphism, and subtle clean shadows",
    profileImageOverride: "",
    heroImageOverride: "",
    accentBlue: "#007AFF",
    glassIntensity: 68,
    blurStrength: 20,
    reflectionEffectsEnabled: true
  },
  neonGaming: {
    enabled: true,
    publicVisible: true,
    displayName: "Neon Gaming",
    description: "Retro-futuristic black canvas with neon cyan, green, and purple glows",
    profileImageOverride: "",
    heroImageOverride: "",
    cyanAccent: "#1CD8D2",
    greenAccent: "#00BF8F",
    purpleAccent: "#9B51E0",
    particlesEnabled: true,
    introAnimationEnabled: true
  },
  hackerTerminal: {
    enabled: false,
    publicVisible: false,
    displayName: "Hacker Terminal",
    description: "Monochrome green phosphor terminal theme with retro CRT scans",
    profileImageOverride: "",
    terminalGreen: "#00FF66",
    terminalBackground: "#050B05",
    scanlineEnabled: true,
    typingAnimationEnabled: true,
    matrixEffectEnabled: true
  }
};
