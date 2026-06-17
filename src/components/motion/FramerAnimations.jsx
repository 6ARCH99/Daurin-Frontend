import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// 🎬 PREMIUM EASING CURVES (inspired by Stripe, Framer, Vercel)
export const easingCurves = {
  smooth: [0.25, 0.46, 0.45, 0.94],      // Natural, smooth motion
  silky: [0.25, 0.6, 0.6, 0.98],         // Very smooth and polished
  bounce: [0.34, 1.56, 0.64, 1],         // Playful bounce
  spring: [0.175, 0.885, 0.32, 1.275],   // Spring-like
  easeOut: [0.16, 1, 0.3, 1],            // Subtle ease out
  sharp: [0.4, 0, 0.2, 1],               // Quick and sharp
};

// PAGE TRANSITIONS - Slower and smoother
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easingCurves.silky,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      duration: 0.6,
      ease: easingCurves.sharp,
    },
  },
};

// SCROLL REVEAL ANIMATIONS - Staggered and smooth
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: easingCurves.silky,
    },
  },
};

// CARD HOVER ANIMATIONS - Subtle and premium
export const cardHoverVariants = {
  rest: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    y: 0,
  },
  hover: {
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    y: -8,
    transition: {
      duration: 0.4,
      ease: easingCurves.smooth,
    },
  },
};

// BUTTON ANIMATIONS - Smooth and responsive
export const buttonVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: easingCurves.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// ICON ANIMATIONS - Playful pop
export const iconVariants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.15,
    rotate: -5,
    transition: {
      duration: 0.4,
      ease: easingCurves.bounce,
    },
  },
};

// MODAL ANIMATIONS - Smooth entrance
export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easingCurves.silky,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: {
      duration: 0.3,
      ease: easingCurves.sharp,
    },
  },
};

// BACKDROP ANIMATIONS - Fade in/out
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easingCurves.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easingCurves.sharp,
    },
  },
};

// NAVBAR ANIMATIONS - Subtle entrance
export const navbarVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easingCurves.silky,
    },
  },
};

// MENU ITEM ANIMATIONS - Smooth scale
export const menuItemVariants = {
  rest: {
    scale: 1,
    color: '#888',
  },
  hover: {
    scale: 1.05,
    color: '#1A3022',
    transition: {
      duration: 0.4,
      ease: easingCurves.smooth,
    },
  },
};

// LIST ITEM STAGGER - Professional cascading
export const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easingCurves.silky,
    },
  },
};

// LOADING SPINNER - Smooth rotation
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// PROGRESS BAR ANIMATIONS - Smooth fill
export const progressVariants = {
  animate: {
    width: '100%',
    transition: {
      duration: 1.2,
      ease: easingCurves.silky,
    },
  },
};

// BADGE ENTRANCE - Pop in effect
export const badgeVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: easingCurves.bounce,
    },
  },
};

// SECTION HEADER ANIMATIONS - Elegant slide
export const sectionHeaderVariants = {
  initial: {
    opacity: 0,
    x: -30,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: easingCurves.silky,
    },
  },
};

// COMPONENT: Smooth Page Wrapper
export const SmoothPage = ({ children }) => (
  <motion.div
    variants={pageTransitionVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

// COMPONENT: Staggered Container for lists
export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);

// COMPONENT: Animated card with hover effect
export const AnimatedCard = ({ children, className = '' }) => (
  <motion.div
    variants={cardHoverVariants}
    initial="rest"
    whileHover="hover"
    className={className}
  >
    {children}
  </motion.div>
);

// COMPONENT: Smooth button with animations
export const SmoothButton = ({ children, className = '', onClick, disabled = false, ...props }) => (
  <motion.button
    variants={buttonVariants}
    initial="rest"
    whileHover={!disabled ? 'hover' : 'rest'}
    whileTap={!disabled ? 'tap' : 'rest'}
    onClick={onClick}
    disabled={disabled}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

// COMPONENT: Animated icon
export const AnimatedIcon = ({ children, className = '' }) => (
  <motion.div
    variants={iconVariants}
    initial="rest"
    whileHover="hover"
    className={className}
  >
    {children}
  </motion.div>
);
