import React from "react";
import AppleAbout from "./AppleAbout";
import AppleServices from "./AppleServices";
import AppleProjects from "./AppleProjects";
import AppleSkills from "./AppleSkills";
import AppleProcess from "./AppleProcess";
import AppleContact from "./AppleContact";

interface AppleExperienceProps {
  onNavigate: (section: string) => void;
}

export default function AppleExperience({ onNavigate }: AppleExperienceProps) {
  return (
    <>
      <AppleAbout />
      <AppleServices />
      <AppleProjects />
      <AppleSkills />
      <AppleProcess />
      <AppleContact />
    </>
  );
}
export { default as AppleAbout } from "./AppleAbout";
export { default as AppleServices } from "./AppleServices";
export { default as AppleProjects } from "./AppleProjects";
export { default as AppleSkills } from "./AppleSkills";
export { default as AppleProcess } from "./AppleProcess";
export { default as AppleContact } from "./AppleContact";
