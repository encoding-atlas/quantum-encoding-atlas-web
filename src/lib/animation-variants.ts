import type { Variants } from "motion/react";

/** Fade up with blur — quantum materialization effect */
export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

/** Simple fade up without blur */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

/** Scale in from slightly smaller */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

/** Container that staggers children entrance */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Direction-aware slide for wizard step transitions */
export const slideStep: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(2px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(2px)",
    transition: { duration: 0.2 },
  }),
};
