import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import TopDownTaxi from "./TopDownTaxi";

/**
 * ScrollTaxiIndicator
 * Fixed vertical "road" on the right edge with a top-down taxi that
 * drives down as the user scrolls the page.
 * Drop it in ONCE at the root of your app — no props required.
 */
const ScrollTaxiIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Tight spring — car tracks scroll almost 1:1 (buttery, no lag)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.1,
  });

  // Dynamic calc() so it interpolates cleanly at every frame.
  // Travel range = full viewport height minus (car height + tiny padding).
  const carTop = useTransform(
    smoothProgress,
    (v) => `calc(${v} * (100vh - 90px) + 4px)`,
  );

  // Dashed lane markings scroll upward with the scroll to sell motion
  const laneOffset = useTransform(smoothProgress, [0, 1], [0, -1200]);

  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-50 h-screen w-12 md:w-16"
      aria-hidden="true"
    >
      {/* Track background (glass) */}
      <div className="absolute inset-0 border-l border-black/5 bg-[#F6F5F2]/70 backdrop-blur-md dark:bg-[#111222]/70 dark:border-white/5" />

      {/* Asphalt road */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 md:w-8 rounded-full bg-gradient-to-b from-[#2b2a27] via-[#1c1b19] to-[#2b2a27] shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]" />

      {/* Dashed yellow lane markings (animated) */}
      <motion.div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #F5C518 0 14px, transparent 14px 28px)",
          backgroundSize: "2px 28px",
          backgroundPositionY: laneOffset,
        }}
      />

      {/* Top / bottom fades */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      {/* The taxi */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 will-change-transform"
        style={{ top: carTop }}
      >
        <motion.div
          animate={{ y: [0, -1.5, 0, 1.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="drop-shadow-[0_6px_14px_rgba(233,184,36,0.55)]"
        >
          <TopDownTaxi size={26} className="md:hidden" />
          <TopDownTaxi size={34} className="hidden md:block" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScrollTaxiIndicator;
