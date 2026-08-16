export const neonGamingAnimations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 35 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1],
        delay: custom,
      },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: custom,
      },
    }),
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.1], // spring-like feeling
        delay: custom,
      },
    }),
  },
  glowPulse: {
    animate: {
      boxShadow: [
        "0 0 10px rgba(28, 216, 210, 0.3)",
        "0 0 25px rgba(28, 216, 210, 0.6)",
        "0 0 10px rgba(28, 216, 210, 0.3)",
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};
