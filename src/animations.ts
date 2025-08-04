import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export const tilt3D: Variants = {
  rest: { rotateX: 0, rotateY: 0 },
  hover: {
    rotateX: -5,
    rotateY: 5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};
