export const appleAnimations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for Apple feel
        delay: custom,
      },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: custom,
      },
    }),
  },
  scaleReveal: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: custom,
      },
    }),
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
  springTransition: {
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  },
};
