import React, { lazy } from "react";
import { ExperienceId } from "../context/ExperienceContext";

export interface ExperienceLayoutComponents {
  Navbar: React.ComponentType<any>;
  Hero: React.ComponentType<any>;
  Background: React.ComponentType<any>;
  CustomCursor: React.ComponentType<any>;
}

// Define dynamic loading registry for all current & future experiences
export const ExperienceRegistry: Record<
  ExperienceId,
  () => Promise<ExperienceLayoutComponents>
> = {
  cosmic: async () => {
    const Navbar = (await import("../components/Navbar")).default;
    const Hero = (await import("../sections/Hero")).default;
    const Background = (await import("../components/CosmicBackground")).default;
    const CustomCursor = (await import("../components/CustomCursor")).default;
    return { Navbar, Hero, Background, CustomCursor };
  },
  gta6: async () => {
    const Navbar = (await import("./gta6/Navbar")).default;
    const Hero = (await import("./gta6/Hero")).default;
    const Background = (await import("./gta6/Background")).default;
    const CustomCursor = (await import("./gta6/CustomCursor")).default;
    return { Navbar, Hero, Background, CustomCursor };
  },
  apple: async () => {
    const Navbar = (await import("./apple/AppleNavbar")).default;
    const Hero = (await import("./apple/AppleHero")).default;
    const Background = (await import("./apple/AppleBackground")).default;
    const CustomCursor = (await import("../components/CustomCursor")).default;
    return { Navbar, Hero, Background, CustomCursor };
  },
  "neon-gaming": async () => {
    const Navbar = (await import("./neon-gaming/NeonGamingNavbar")).default;
    const Hero = (await import("./neon-gaming/NeonGamingHero")).default;
    const Background = (await import("./neon-gaming/NeonGamingBackground")).default;
    const CustomCursor = (await import("./neon-gaming/NeonGamingCursor")).default;
    return { Navbar, Hero, Background, CustomCursor };
  },
  terminal: async () => {
    throw new Error("Hacker Terminal Experience is not yet implemented.");
  },
};
