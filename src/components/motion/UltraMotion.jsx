import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

// ==========================================
// EASING PRESETS
// ==========================================
export const easings = {
  smooth: [0.22, 1, 0.36, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.1, 0.25, 1],
  dramatic: [0.87, 0, 0.13, 1],
};

// ==========================================
// PAGE TRANSITIONS
// ==========================================

export const PageTransition = ({ children, mode = 'slide' }) => {
  const variants = {
    slide: {
      initial: { opacity: 0, x: 100, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -100, scale: 0.95 }
    },
    slideUp: {
      initial: { opacity: 0, y: 60, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -40, scale: 0.98 }
    },
    fade: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
      animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
      exit: { opacity: 0, filter: 'blur(20px)', scale: 0.95 }
    },
    zoom: {
      initial: { opacity: 0, scale: 0.5, rotate: -10 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      exit: { opacity: 0, scale: 1.2, rotate: 10 }
    },
    flip: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 }
    }
  };

  const selectedVariant = variants[mode] || variants.slide;

  return (
    <motion.div
      variants={selectedVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: easings.smooth }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// SCROLL REVEAL
// ==========================================

export const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  distance = 60,
  blur = true,
  scale = null,
  rotate = null,
  className = '',
  once = true,
  threshold = 0.1
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      default: return { y: distance, x: 0 };
    }
  };

  const initial = getInitialPosition();
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: initial.x,
        y: initial.y,
        scale: scale || 1,
        rotate: rotate || 0,
        filter: blur ? 'blur(10px)' : 'blur(0px)'
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once, margin: `-${Math.round(threshold * 100)}px` }}
      transition={{ 
        duration, 
        delay: delay / 1000, 
        ease: easings.smooth 
      }}
      className={className}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// STAGGER CONTAINER
// ==========================================

export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.08, 
  className = '',
  once = true,
  threshold = 0.1
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: `-${Math.round(threshold * 100)}px` }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ 
  children, 
  direction = 'up',
  distance = 40,
  blur = true,
  className = '' 
}) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'scale': return { scale: 0.85 };
      default: return { y: distance };
    }
  };

  const offset = getDirectionOffset();

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          ...offset,
          filter: blur ? 'blur(8px)' : 'blur(0px)'
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.5,
            ease: easings.smooth
          }
        }
      }}
      className={className}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// HOVER EFFECTS
// ==========================================

export const HoverScale = ({ 
  children, 
  scale = 1.05,
  hoverScale = 1.08,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale }}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: easings.smooth }}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

export const HoverLift = ({ 
  children, 
  y = -10, 
  shadow = true,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ 
        y, 
        boxShadow: shadow ? "0 24px 48px -12px rgba(26, 48, 34, 0.2)" : undefined 
      }}
      transition={{ duration: 0.3, ease: easings.smooth }}
      className={className}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {children}
    </motion.div>
  );
};

export const HoverGlow = ({
  children,
  color = 'rgba(104, 166, 125, 0.4)',
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: `0 0 30px ${color}` 
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// PARALLAX
// ==========================================

export const ParallaxContainer = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      className={className}
      style={{ 
        transform: `translateY(${offset}px)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// MODAL ANIMATIONS
// ==========================================

export const ModalOverlay = ({ 
  children, 
  isOpen, 
  onClose,
  className = '' 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${className}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: easings.smooth }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// NOTIFICATION / TOAST
// ==========================================

export const Toast = ({ 
  children, 
  isVisible, 
  position = 'bottom-right',
  className = '' 
}) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: easings.smooth }}
          className={`fixed z-50 ${positions[position]} ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// SPECIAL EFFECTS
// ==========================================

export const Confetti = ({ trigger, count = 50 }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (trigger) {
      const colors = ['#68A67D', '#EBA332', '#1A3022', '#D99A29', '#2D6A4F', '#FFB800'];
      const newPieces = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: -Math.random() * 300 - 100,
        rotation: Math.random() * 720 - 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 6,
        shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)]
      }));
      setPieces(newPieces);

      setTimeout(() => setPieces([]), 3000);
    }
  }, [trigger, count]);

  const getShape = (shape, size) => {
    switch (shape) {
      case 'circle': return { borderRadius: '50%' };
      case 'triangle': 
        return { 
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          borderRadius: 0 
        };
      default: return { borderRadius: '2px' };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ 
              x: '50vw', 
              y: '50vh', 
              rotate: 0, 
              opacity: 1,
              scale: 0.5
            }}
            animate={{ 
              x: `calc(50vw + ${piece.x}px)`, 
              y: `calc(50vh + ${piece.y}px)`, 
              rotate: piece.rotation,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2 + Math.random(), 
              ease: easings.smooth
            }}
            style={{
              position: 'absolute',
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              ...getShape(piece.shape, piece.size)
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// SPRING PHYSICS
// ==========================================

export const SpringBox = ({ children, className = '', stiffness = 300, damping = 20 }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness,
        damping
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// MAGNETIC BUTTON
// ==========================================

export const MagneticButton = ({ children, className = '', strength = 0.3 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// TEXT SCRAMBLE EFFECT
// ==========================================

export const TextScramble = ({ text, className = '', duration = 1500 }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    let iteration = 0;
    const totalIterations = text.length * 3;
    const intervalTime = duration / totalIterations;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= totalIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration++;
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, duration]);

  return <span className={className}>{displayText}</span>;
};

// ==========================================
// MORPHING SHAPE
// ==========================================

export const MorphingShape = ({ children, className = '' }) => {
  return (
    <motion.div
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%'
        ]
      }}
      transition={{
        duration: 8,
        ease: 'easeInOut',
        repeat: Infinity
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// CURSOR FOLLOWER
// ==========================================

export const CursorFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, [role="button"], input, textarea')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Only show on desktop
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed w-3 h-3 bg-[#68A67D] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 2.5 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      <motion.div
        className="fixed w-8 h-8 border border-[#68A67D]/50 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.8 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 20,
          mass: 0.8
        }}
      />
    </>
  );
};

// ==========================================
// PARTICLE FIELD
// ==========================================

export const ParticleField = ({ count = 30, className = '' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#68A67D]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [particle.opacity, particle.opacity * 2, particle.opacity],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// ANIMATED COUNTER
// ==========================================

export const AnimatedCounter = ({ 
  value, 
  duration = 2,
  prefix = '',
  suffix = '',
  className = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ==========================================
// EXPORTS
// ==========================================

export default {
  easings,
  PageTransition,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  HoverLift,
  HoverGlow,
  SpringBox,
  MagneticButton,
  TextScramble,
  MorphingShape,
  CursorFollower,
  ParticleField,
  Confetti,
  ModalOverlay,
  Toast,
  ParallaxContainer,
  AnimatedCounter,
};
