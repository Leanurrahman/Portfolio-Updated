import React from "react";
import NeonGamingIntro from "./NeonGamingIntro";
import NeonGamingAbout from "./NeonGamingAbout";
import NeonGamingServices from "./NeonGamingServices";
import NeonGamingProjects from "./NeonGamingProjects";
import NeonGamingSkills from "./NeonGamingSkills";
import NeonGamingProcess from "./NeonGamingProcess";
import NeonGamingContact from "./NeonGamingContact";

interface NeonGamingExperienceProps {
  onNavigate: (section: string) => void;
}

export default function NeonGamingExperience({ onNavigate }: NeonGamingExperienceProps) {
  return (
    <>
      <NeonGamingIntro />
      <NeonGamingAbout onNavigate={onNavigate} />
      <NeonGamingServices />
      <NeonGamingProjects />
      <NeonGamingSkills />
      <NeonGamingProcess />
      <NeonGamingContact />
    </>
  );
}

export { default as NeonGamingAbout } from "./NeonGamingAbout";
export { default as NeonGamingServices } from "./NeonGamingServices";
export { default as NeonGamingProjects } from "./NeonGamingProjects";
export { default as NeonGamingSkills } from "./NeonGamingSkills";
export { default as NeonGamingProcess } from "./NeonGamingProcess";
export { default as NeonGamingContact } from "./NeonGamingContact";
