import React, { useEffect, useState, Suspense } from "react";
import { useExperience } from "../context/ExperienceContext";
import { ExperienceRegistry, ExperienceLayoutComponents } from "../experiences/ExperienceRegistry";

// Static pre-imports for the core Cosmic experience to prevent flash-of-unstyled-content on initial load
import CosmicNavbar from "../components/Navbar";
import CosmicHero from "../sections/Hero";
import CosmicBackground from "../components/CosmicBackground";
import CosmicCursor from "../components/CustomCursor";

interface ExperienceLoaderProps {
  children: (components: ExperienceLayoutComponents) => React.ReactNode;
}

export default function ExperienceLoader({ children }: ExperienceLoaderProps) {
  const { currentExperience } = useExperience();
  
  // Start with default Cosmic layouts
  const [components, setComponents] = useState<ExperienceLayoutComponents>({
    Navbar: CosmicNavbar,
    Hero: CosmicHero,
    Background: CosmicBackground,
    CustomCursor: CosmicCursor,
  });

  useEffect(() => {
    let isMounted = true;

    // Skip dynamic import for default cosmic since it's already pre-loaded
    if (currentExperience === "cosmic") {
      setComponents({
        Navbar: CosmicNavbar,
        Hero: CosmicHero,
        Background: CosmicBackground,
        CustomCursor: CosmicCursor,
      });
      return;
    }

    async function loadExperience() {
      try {
        const loader = ExperienceRegistry[currentExperience];
        if (loader) {
          const loaded = await loader();
          if (isMounted) {
            setComponents(loaded);
          }
        }
      } catch (error) {
        console.warn(`[ExperienceLoader] Failed loading experience "${currentExperience}", reverting to Cosmic.`, error);
        if (isMounted) {
          setComponents({
            Navbar: CosmicNavbar,
            Hero: CosmicHero,
            Background: CosmicBackground,
            CustomCursor: CosmicCursor,
          });
        }
      }
    }

    loadExperience();

    return () => {
      isMounted = false;
    };
  }, [currentExperience]);

  return (
    <Suspense fallback={null}>
      {children(components)}
    </Suspense>
  );
}
