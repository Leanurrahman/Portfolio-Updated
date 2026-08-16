/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  dribbble?: string;
  email: string;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  year: string;
}

export interface Profile {
  name: string;
  role: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  profileImage: string;
  heroImage?: string;
  cvUrl?: string;
  availabilityStatus: "available" | "busy" | "looking-for-offers";
  socialLinks: SocialLinks;
  education: EducationInfo;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  category: string;
  thumbnail: string;
  liveLink: string;
  githubLink: string;
  featured: boolean;
  client: string;
  year: string;
  problemSolved: string;
  keyFeatures: string[];
  results: string;
  gallery?: string[];
  order: number;
}

export type SkillCategory = "Frontend" | "Backend" | "Tools" | "Programming";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency?: number;
  icon?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  ctaText?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  message: string;
  rating: number;
  clientImage?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: any; // Timestamp or ISO string
}

export interface SiteSettings {
  logoText: string;
  themeColor: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  footerText: string;
  contactEmail: string;
  maintenanceMode: boolean;
  welcomeMessage?: string;
  defaultExperience?: string;
  defaultThemePreset?: string;
  allowPublicExperienceSwitching?: boolean;
  showSpecialExperiences?: boolean;
  fallbackTheme?: string;
}

export interface CosmicSettings {
  enabled: boolean;
  profileImageOverride?: string;
  heroImageOverride?: string;
  accentColor?: string;
  backgroundIntensity?: string;
}

export interface Gta6Settings {
  enabled: boolean;
  publicVisible: boolean;
  displayName: string;
  description: string;
  profileImageOverride?: string;
  heroImageOverride?: string;
  primaryPink?: string;
  secondaryOrange?: string;
  backgroundPurple?: string;
  cinematicEffectsEnabled?: boolean;
}

export interface AppleGlassSettings {
  enabled: boolean;
  publicVisible: boolean;
  displayName: string;
  description: string;
  profileImageOverride?: string;
  heroImageOverride?: string;
  accentBlue?: string;
  glassIntensity?: number;
  blurStrength?: number;
  reflectionEffectsEnabled?: boolean;
}

export interface NeonGamingSettings {
  enabled: boolean;
  publicVisible: boolean;
  displayName: string;
  description: string;
  profileImageOverride?: string;
  heroImageOverride?: string;
  cyanAccent?: string;
  greenAccent?: string;
  purpleAccent?: string;
  particlesEnabled?: boolean;
  introAnimationEnabled?: boolean;
}

export interface HackerTerminalSettings {
  enabled: boolean;
  publicVisible: boolean;
  displayName: string;
  description: string;
  profileImageOverride?: string;
  terminalGreen?: string;
  terminalBackground?: string;
  scanlineEnabled?: boolean;
  typingAnimationEnabled?: boolean;
  matrixEffectEnabled?: boolean;
}

export interface ExperienceSettings {
  cosmic?: CosmicSettings;
  gta6: Gta6Settings;
  appleGlass: AppleGlassSettings;
  neonGaming: NeonGamingSettings;
  hackerTerminal: HackerTerminalSettings;
}

export interface ChatConversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  projectType?: string;
  status: "open" | "closed" | "offline_pending";
  adminOnline?: boolean;
  adminTyping?: boolean;
  visitorTyping?: boolean;
  unreadByAdmin: number;
  unreadByVisitor: number;
  lastMessage?: string;
  lastMessageSender?: "visitor" | "admin" | "system" | "admin_auto";
  lastMessageAt?: any; // Firestore Timestamp
  createdAt: any;      // Firestore Timestamp
  updatedAt: any;      // Firestore Timestamp
}

export interface ChatMessage {
  id: string;
  sender: "visitor" | "admin" | "system" | "admin_auto";
  text: string;
  createdAt: any;      // Firestore Timestamp
  read: boolean;
  type?: "text" | "welcome" | "offline";
}

export interface AdminPresence {
  online: boolean;
  lastSeen: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
