/**
 * CursorGlow — a luxurious radial glow that follows the cursor
 * and leaves soft ripple trails across the page background.
 * Works in both light and dark theme.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

interface Trail {
  id: number;
  x: number;
  y: number;
  born: number;
}

const TRAIL_LIFETIME = 900; // ms each ripple lives
const MAX_TRAILS     = 12;

export default function CursorGlow() {
  const mainGlow    = useRef<HTMLDivElement>(null);
  const outerRing   = useRef<HTMLDivElement>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const trailId     = useRef(0);
  const lastPos     = useRef({ x: -999, y: -999 });
  const animFrame   = useRef<number>(0);
  const targetPos   = useRef({ x: -999, y: -999 });
  const currentPos  = useRef({ x: -999, y: -999 });

  // Smooth main glow with lerp
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.12);
    currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.12);

    const outerX = lerp(currentPos.current.x, targetPos.current.x, 0.06);
    const outerY = lerp(currentPos.current.y, targetPos.current.y, 0.06);

    if (mainGlow.current) {
      mainGlow.current.style.transform =
        `translate(${currentPos.current.x - 200}px, ${currentPos.current.y - 200}px)`;
    }
    if (outerRing.current) {
      outerRing.current.style.transform =
        `translate(${outerX - 24}px, ${outerY - 24}px)`;
    }

    animFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [animate]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY + window.scrollY;
      targetPos.current = { x: e.clientX, y: e.clientY };

      // Only add trail if mouse moved enough
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 28) return;
      lastPos.current = { x, y };

      const now = Date.now();
      setTrails(prev => {
        const next = [...prev, { id: trailId.current++, x, y, born: now }];
        return next.slice(-MAX_TRAILS);
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Prune dead trails
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(t => now - t.born < TRAIL_LIFETIME));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Main following glow ──────────────────────────────── */}
      <div
        ref={mainGlow}
        aria-hidden="true"
        className="cursor-glow-main"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 400,
          height: 400,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.13) 0%, rgba(30,58,95,0.08) 40%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "screen",
          transition: "background 0.3s ease",
        }}
      />

      {/* ── Outer crisp ring ─────────────────────────────────── */}
      <div
        ref={outerRing}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 48,
          height: 48,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          border: "1.5px solid rgba(249,115,22,0.55)",
          willChange: "transform",
          boxShadow: "0 0 12px rgba(249,115,22,0.25)",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* ── Ripple trails ────────────────────────────────────── */}
      {trails.map(trail => {
        const age     = Date.now() - trail.born;
        const progress = Math.min(age / TRAIL_LIFETIME, 1);
        const size    = 10 + progress * 50;
        const opacity = (1 - progress) * 0.45;

        return (
          <div
            key={trail.id}
            aria-hidden="true"
            style={{
              position: "fixed",
              top: trail.y - window.scrollY - size / 2,
              left: trail.x - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 9997,
              background:
                `radial-gradient(circle, rgba(212,160,23,${opacity * 0.6}) 0%, rgba(249,115,22,${opacity}) 40%, transparent 70%)`,
              border: `1px solid rgba(249,115,22,${opacity * 0.8})`,
              willChange: "opacity, width, height",
            }}
          />
        );
      })}
    </>
  );
}
