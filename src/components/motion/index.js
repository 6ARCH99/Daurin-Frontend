// Motion Components Index
// All animation components exported from here

// Base Components
export { default as Reveal } from './Reveal.jsx';
export { default as RevealGrid } from './RevealGrid.jsx';
export { default as AnimatedPage } from './AnimatedPage.jsx';
export { default as AnimatedRoute } from './AnimatedRoute.jsx';

// Ultra Motion - Advanced Animations
export {
  // Easing presets
  easings,
  // Page transitions
  PageTransition,
  // Scroll reveal
  ScrollReveal,
  // Stagger animations
  StaggerContainer,
  StaggerItem,
  // Hover effects
  HoverScale,
  HoverLift,
  HoverGlow,
  // Physics & interactions
  SpringBox,
  MagneticButton,
  // Text effects
  TextScramble,
  // Shapes & particles
  MorphingShape,
  // Background effects
  ParticleField,
  // Special effects
  Confetti,
  // Modals & overlays
  ModalOverlay,
  Toast,
  // Parallax
  ParallaxContainer,
  // Counters
  AnimatedCounter,
} from './UltraMotion.jsx';

// Default export for convenience
export { default } from './UltraMotion.jsx';
