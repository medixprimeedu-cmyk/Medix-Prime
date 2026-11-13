import React from 'react';
import { AnimatePresence, motion, Variants } from 'motion/react';

export type TransitionDirection = 'toTool' | 'toHome' | 'lateral';

interface PageTransitionProps {
  routeKey: string;
  direction: TransitionDirection;
  children: React.ReactNode;
}

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_CUBIC: [number, number, number, number] = [0.4, 0, 1, 1];

const pageVariants: Variants = {
  initial: (direction: TransitionDirection) => {
    if (direction === 'toTool') {
      return {
        opacity: 0,
        y: 18,
        scale: 0.99,
      };
    }
    if (direction === 'toHome') {
      return {
        opacity: 0,
        y: -10,
        scale: 0.985,
      };
    }
    return {
      opacity: 0,
      x: 16,
      scale: 0.995,
    };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: EASE_OUT_QUINT,
    },
  },
  exit: (direction: TransitionDirection) => {
    if (direction === 'toTool') {
      return {
        opacity: 0,
        y: -10,
        scale: 0.985,
        transition: {
          duration: 0.17,
          ease: EASE_IN_CUBIC,
        },
      };
    }
    if (direction === 'toHome') {
      return {
        opacity: 0,
        y: 14,
        scale: 0.99,
        transition: {
          duration: 0.17,
          ease: EASE_IN_CUBIC,
        },
      };
    }
    return {
      opacity: 0,
      x: -14,
      scale: 0.995,
      transition: {
        duration: 0.16,
        ease: EASE_IN_CUBIC,
      },
    };
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  routeKey,
  direction,
  children,
}) => {
  const handleExitComplete = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      custom={direction}
      onExitComplete={handleExitComplete}
    >
      <motion.div
        key={routeKey}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
