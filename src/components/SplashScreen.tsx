import { useEffect, useState } from 'react';

interface SplashScreenProps {
  /** Called once the splash has fully faded out. Use this to mount your real app. */
  onComplete?: () => void;
  /** How long the splash stays on screen before it starts fading, in ms. Default matches the animation length. */
  minDurationMs?: number;
}

/**
 * Shri Gurukripa Tours & Taxi — animated splash / preloader.
 * Sequence: spinning globe zooms in -> Rajasthan route map draws itself with
 * a car tracing the tour circuit -> logo, Hindi welcome line and tagline settle in.
 *
 * Drop this in as <SplashScreen onComplete={() => setReady(true)} /> while your
 * Firebase/Firestore data loads, then unmount it (or stop rendering it) once
 * onComplete fires.
 */
export default function SplashScreen({ onComplete, minDurationMs = 5800 }: SplashScreenProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setHidden(true), minDurationMs);
    return () => clearTimeout(hideTimer);
  }, [minDurationMs]);

  useEffect(() => {
    if (!hidden) return;
    const completeTimer = setTimeout(() => onComplete?.(), 650); // matches the fade-out transition
    return () => clearTimeout(completeTimer);
  }, [hidden, onComplete]);

  return (
    <div className={`sgs-root${hidden ? ' sgs-hide' : ''}`} role="status" aria-live="polite">
      <span className="sgs-sr-only">Loading Shri Gurukripa Tours &amp; Taxi…</span>

      <div className="sgs-frame" aria-hidden="true">
        <span className="sgs-corner tl" />
        <span className="sgs-corner tr" />
        <span className="sgs-corner bl" />
        <span className="sgs-corner br" />
      </div>

      {/* Stage 1: spinning globe, zooms in */}
      <div className="sgs-stage sgs-stage-earth" aria-hidden="true">
        <div className="sgs-globe">
          {/* Ocean Radial Shader */}
          <div className="sgs-globe-ocean" />

          {/* Continents Layer (spins infinitely) */}
          <div className="sgs-globe-map-wrap">
            <svg className="sgs-globe-map" viewBox="0 0 400 130">
              <g id="sgs-world-map">
                {/* Antarctica */}
                <path d="M15,115 C50,112 100,112 185,115 C175,122 125,124 15,122 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* North America */}
                <path d="M25,20 C35,15 50,18 55,25 C58,30 52,38 48,42 C44,46 38,40 32,48 C28,52 25,48 28,35 C30,25 20,25 25,20 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* South America */}
                <path d="M45,52 C50,55 52,65 48,75 C44,85 38,95 35,100 C32,95 34,85 38,75 C42,65 40,58 45,52 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* Eurasia (Europe + Asia) */}
                <path d="M110,25 C120,20 135,15 155,20 C175,25 185,35 180,45 C175,55 160,50 155,60 C150,70 145,65 140,55 C135,45 125,50 120,45 C115,40 105,30 110,25 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* Africa */}
                <path d="M100,50 C110,50 125,55 125,65 C125,75 120,85 115,95 C110,105 105,100 102,95 C100,90 98,80 95,75 C92,70 95,60 98,55 C100,50 100,50 100,50 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* Australia */}
                <path d="M145,75 C155,75 162,78 160,85 C158,92 148,90 145,85 C142,80 140,75 145,75 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* Greenland */}
                <path d="M45,10 C50,8 55,12 50,18 C45,22 40,15 45,10 Z" fill="var(--sgs-land)" opacity="0.85" />
                {/* Country Borders */}
                <g stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.45" fill="none">
                  {/* USA / Canada border */}
                  <path d="M30,28 L46,26 L52,24" />
                  {/* USA / Mexico border */}
                  <path d="M35,38 L40,40" />
                  {/* Brazil borders */}
                  <path d="M42,65 L48,68 L50,75" />
                  {/* Russia / China border */}
                  <path d="M125,25 L145,28 L160,30 L170,33" />
                  {/* India borders */}
                  <path d="M128,44 L125,48 L128,51" />
                  {/* Egypt border */}
                  <path d="M108,62 L115,62" />
                </g>
                {/* India (Highlighted in gold!) */}
                <path d="M128,44 L132,44 L134,51 L131,55 L129,51 Z" fill="var(--sgs-gold-500)" opacity="0.95" className="sgs-globe-india-glow" />
                {/* Rajasthan glowing boundary */}
                <path d="M128,44 L130,44 L131,47 L129,48 Z" fill="#ff7300" opacity="0" className="sgs-globe-rajasthan-glow" />
                {/* Rajasthan Pulsing Dot */}
                <circle cx="130" cy="46" r="1.5" fill="#ff7300" className="sgs-globe-rajasthan-dot" />
              </g>
              <use href="#sgs-world-map" x="200" />
            </svg>
          </div>

          {/* Cloud Layer (Spins at different speed) */}
          <div className="sgs-globe-clouds-wrap">
            <svg className="sgs-globe-clouds" viewBox="0 0 400 130">
              <g id="sgs-clouds">
                <path d="M25,25 Q35,15 50,22 T80,25 T110,32 T140,25 T170,22 Z" fill="#ffffff" opacity="0.35" />
                <path d="M15,70 Q25,82 45,70 T85,75 T125,65 T165,70 T185,75 Z" fill="#ffffff" opacity="0.25" />
              </g>
              <use href="#sgs-clouds" x="200" />
            </svg>
          </div>

          {/* Globe Grid lines (longitude/latitude curves) */}
          <div className="sgs-globe-grid" />
          
          {/* Spherical Glare/Atmosphere Overlay */}
          <div className="sgs-globe-shading" />
        </div>
      </div>

      {/* Stage 2: Rajasthan outline, route draw, car */}
      <div className="sgs-stage sgs-stage-map" aria-hidden="true">
        <svg className="sgs-map-svg" viewBox="0 0 300 300">
          <path
            className="sgs-state-outline"
            d="M150,18 C198,24 232,58 248,98 C266,142 262,192 232,228 C206,259 170,288 138,278 C98,266 62,236 47,196 C28,150 33,98 64,64 C90,33 121,12 150,18 Z"
          />
          <path className="sgs-route" d="M82,140 L108,168 L142,228 L206,188 L184,114 L150,150" />

          <g className="sgs-city c1"><circle cx={82} cy={140} r={3.4} /><text x={82} y={132}>Jaisalmer</text></g>
          <g className="sgs-city c2"><circle cx={108} cy={168} r={3.4} /><text x={92} y={180}>Jodhpur</text></g>
          <g className="sgs-city c3"><circle cx={142} cy={228} r={3.4} /><text x={128} y={242}>Udaipur</text></g>
          <g className="sgs-city c4"><circle cx={206} cy={188} r={3.4} /><text x={196} y={180}>Ranthambore</text></g>
          <g className="sgs-city c5"><circle cx={184} cy={114} r={3.4} /><text x={176} y={105}>Jaipur</text></g>
          <g className="sgs-city c6"><circle cx={150} cy={150} r={3.4} /><text x={138} y={143}>Pushkar</text></g>

          <g className="sgs-car">
            <rect x={-8} y={-3} width={16} height={5} rx={2} />
            <path d="M-4,-3 L-2,-6 L4,-6 L6,-3 Z" />
            <circle cx={-4} cy={2} r={1.8} />
            <circle cx={4} cy={2} r={1.8} />
          </g>
        </svg>
      </div>

      {/* Stage 3: logo + tagline + loader */}
      <div className="sgs-stage sgs-stage-logo">
        <div className="sgs-emblem">
          <svg className="sgs-emblem-ring" viewBox="0 0 64 64">
            <circle cx={32} cy={32} r={30} fill="none" stroke="#d4af37" strokeWidth={1.4} />
            <circle cx={32} cy={32} r={24} fill="none" stroke="#d4af37" strokeWidth={1} />
            <g stroke="#f0d27a" strokeWidth={1.2}>
              <line x1={32} y1={10} x2={32} y2={20} />
              <line x1={32} y1={44} x2={32} y2={54} />
              <line x1={10} y1={32} x2={20} y2={32} />
              <line x1={44} y1={32} x2={54} y2={32} />
              <line x1={16.9} y1={16.9} x2={23.8} y2={23.8} />
              <line x1={40.2} y1={40.2} x2={47.1} y2={47.1} />
              <line x1={47.1} y1={16.9} x2={40.2} y2={23.8} />
              <line x1={23.8} y1={40.2} x2={16.9} y2={47.1} />
            </g>
            <circle cx={32} cy={32} r={4} fill="#d4af37" />
          </svg>
        </div>

        <h1 className="sgs-logo-text">
          Shri Gurukripa
          <span className="sgs-sub">Tours &amp; Taxi</span>
        </h1>

        <div className="sgs-divider" />

        <p className="sgs-tagline-hi">आपका स्वागत है</p>
        <p className="sgs-tagline-en">Your royal journey through the Land of Kings begins now.</p>

        <div className="sgs-loader-dots"><span /><span /><span /></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cormorant+Garamond:ital@1&family=Noto+Sans+Devanagari:wght@500&family=Poppins:wght@300;400;500&display=swap');

        .sgs-root {
          --sgs-maroon-900:#330a16;
          --sgs-maroon-700:#6e1228;
          --sgs-maroon-600:#8a1a35;
          --sgs-gold-500:#d4af37;
          --sgs-gold-300:#f0d27a;
          --sgs-cream-100:#f7e8c9;
          --sgs-ocean-700:#123a57;
          --sgs-ocean-300:#2f7fae;
          --sgs-land:#8a9a5b;
          --sgs-ink:#2a0a12;

          position:fixed; inset:0; z-index:9999; overflow:hidden;
          background:
            radial-gradient(circle at 50% 28%, var(--sgs-maroon-600) 0%, var(--sgs-maroon-700) 45%, var(--sgs-maroon-900) 100%);
          display:flex; align-items:center; justify-content:center;
          transition:opacity .6s ease;
        }
        .sgs-root.sgs-hide { opacity:0; pointer-events:none; }

        .sgs-frame { position:absolute; inset:16px; border:1px solid rgba(212,175,55,.4); pointer-events:none; }
        .sgs-frame .sgs-corner {
          position:absolute; width:9px; height:9px;
          border:1px solid var(--sgs-gold-500); transform:rotate(45deg);
          background:var(--sgs-maroon-700);
        }
        .sgs-corner.tl { top:-5px; left:-5px; }
        .sgs-corner.tr { top:-5px; right:-5px; }
        .sgs-corner.bl { bottom:-5px; left:-5px; }
        .sgs-corner.br { bottom:-5px; right:-5px; }

        .sgs-stage { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }

        .sgs-stage-earth { animation: sgsEarthZoom 1.5s ease-in forwards; will-change:transform,opacity; }
        @keyframes sgsEarthZoom {
          0%   { transform:scale(1);   opacity:1; }
          65%  { transform:scale(1.6); opacity:1; }
          100% { transform:scale(7);   opacity:0; }
        }
        .sgs-globe {
          width: clamp(120px, 32vmin, 180px);
          height: clamp(120px, 32vmin, 180px);
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at 35% 35%, var(--sgs-ocean-300) 0%, var(--sgs-ocean-700) 70%, #030a12 100%);
          /* Glow / Atmosphere aura */
          box-shadow: 
            0 0 35px rgba(212, 175, 55, 0.3), 
            0 0 15px rgba(47, 127, 174, 0.5),
            inset 0 0 30px rgba(0, 0, 0, 0.8),
            inset 8px 8px 15px rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .sgs-globe-map-wrap {
          position: absolute;
          inset: 0;
          animation: sgsMapZoomIn 5.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          width: 200%;
          height: 100%;
        }

        .sgs-globe-map {
          width: 100%;
          height: 100%;
        }

        .sgs-globe-clouds-wrap {
          position: absolute;
          inset: 0;
          animation: sgsCloudsZoomIn 5.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          width: 200%;
          height: 100%;
        }

        .sgs-globe-clouds {
          width: 100%;
          height: 100%;
        }

        .sgs-globe-shading {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          /* Glare on top-left, deep shadow on bottom-right to create 3D sphere shape */
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 90%);
          pointer-events: none;
        }

        .sgs-globe-grid {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }
        .sgs-globe-grid::before, .sgs-globe-grid::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sgs-globe-grid::before { transform: scaleX(0.4); }
        .sgs-globe-grid::after { transform: scaleX(0.7) rotate(90deg); }

        .sgs-globe-india-glow {
          filter: drop-shadow(0 0 2px var(--sgs-gold-300));
        }

        .sgs-globe-rajasthan-glow {
          animation: sgsRajasthanGlowFade 5.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes sgsRajasthanGlowFade {
          0%   { opacity: 0; filter: drop-shadow(0 0 0px #ff7300); }
          50%  { opacity: 0; filter: drop-shadow(0 0 0px #ff7300); }
          68%  { opacity: 1; fill: #ff5500; filter: drop-shadow(0 0 4px #ff5500) drop-shadow(0 0 8px #ffaa00); }
          82%  { opacity: 1; fill: #ffd700; filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #ff5500); }
          100% { opacity: 0; }
        }

        .sgs-globe-rajasthan-dot {
          animation: sgsDotPulseGlow 1.8s infinite alternate;
        }
        @keyframes sgsDotPulseGlow {
          0% { r: 1.3; fill: #ff5500; filter: drop-shadow(0 0 1px #ff5500); }
          100% { r: 2.3; fill: #ffd700; filter: drop-shadow(0 0 3px #ffd700); }
        }

        @keyframes sgsMapZoomIn {
          0%   { transform: translate3d(0, 23.5px, 0) scale(1); }
          45%  { transform: translate3d(-100px, 23.5px, 0) scale(1); }
          60%  { transform: translate3d(-90px, 23.5px, 0) scale(1.2); }
          82%  { transform: translate3d(-90px, 23.5px, 0) scale(7.5); }
          100% { transform: translate3d(-90px, 23.5px, 0) scale(14); opacity: 0; }
        }

        @keyframes sgsCloudsZoomIn {
          0%   { transform: translate3d(0, 23.5px, 0) scale(1); }
          45%  { transform: translate3d(-150px, 23.5px, 0) scale(1); }
          60%  { transform: translate3d(-90px, 23.5px, 0) scale(1.2); }
          82%  { transform: translate3d(-90px, 23.5px, 0) scale(7.5); }
          100% { transform: translate3d(-90px, 23.5px, 0) scale(14); opacity: 0; }
        }

        .sgs-stage-map { animation: sgsMapTimeline 5.4s ease-out forwards; will-change:transform,opacity; }
        @keyframes sgsMapTimeline {
          0%   { opacity:0;   transform:scale(.82); }
          20%  { opacity:0;   transform:scale(.82); }
          38%  { opacity:1;   transform:scale(1); }
          66%  { opacity:1;   transform:scale(1); }
          85%  { opacity:.13; transform:scale(1.04); }
          100% { opacity:.13; transform:scale(1.04); }
        }
        .sgs-map-svg { width:min(78vmin,440px); height:min(78vmin,440px); overflow:visible; }
        .sgs-state-outline {
          fill:rgba(212,175,55,.07); stroke:var(--sgs-gold-500); stroke-width:2;
          stroke-dasharray:900; stroke-dashoffset:900;
          animation: sgsDraw 1.2s ease-out 1.15s forwards;
        }
        .sgs-route {
          fill:none; stroke:var(--sgs-gold-300); stroke-width:1.6; stroke-linecap:round;
          stroke-dasharray:340; stroke-dashoffset:340;
          animation: sgsDraw 1.8s ease-in-out 1.9s forwards;
        }
        @keyframes sgsDraw { to { stroke-dashoffset:0; } }

        .sgs-city circle { fill:var(--sgs-gold-500); }
        .sgs-city text { fill:var(--sgs-cream-100); font-family:'Poppins',sans-serif; font-size:7.5px; letter-spacing:.3px; }
        .sgs-city { opacity:0; transform-box:fill-box; transform-origin:center; animation: sgsPopIn .45s ease-out forwards; }
        .sgs-city.c1 { animation-delay:2.05s; }
        .sgs-city.c2 { animation-delay:2.26s; }
        .sgs-city.c3 { animation-delay:2.62s; }
        .sgs-city.c4 { animation-delay:2.98s; }
        .sgs-city.c5 { animation-delay:3.34s; }
        .sgs-city.c6 { animation-delay:3.65s; }
        @keyframes sgsPopIn { from { opacity:0; transform:scale(0); } to { opacity:1; transform:scale(1); } }

        .sgs-car { opacity:0; transform-box:fill-box; transform-origin:center; animation: sgsCarMove 1.8s ease-in-out 1.9s forwards; }
        .sgs-car rect, .sgs-car path { fill:var(--sgs-gold-300); }
        .sgs-car circle { fill:var(--sgs-ink); }
        @keyframes sgsCarMove {
          0%   { opacity:0; transform:translate(82px,140px)  rotate(47deg); }
          6%   { opacity:1; }
          20%  { transform:translate(108px,168px) rotate(61deg); }
          40%  { transform:translate(142px,228px) rotate(-32deg); }
          60%  { transform:translate(206px,188px) rotate(-100deg); }
          80%  { transform:translate(184px,114px) rotate(133deg); }
          100% { transform:translate(150px,150px) rotate(133deg); opacity:1; }
        }

        .sgs-stage-logo {
          flex-direction:column; gap:10px; text-align:center; padding:0 24px;
          opacity:0; animation: sgsLogoIn .9s ease-out 3.8s forwards;
        }
        @keyframes sgsLogoIn {
          from { opacity:0; transform:scale(.92) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .sgs-emblem { width:64px; height:64px; margin:0 auto 4px; }
        .sgs-emblem-ring { animation: sgsSlowSpin 16s linear infinite; transform-origin:50% 50%; }
        @keyframes sgsSlowSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

        .sgs-logo-text {
          font-family:'Cinzel', serif; font-weight:700;
          font-size:clamp(1.5rem, 5vw, 2.1rem);
          line-height:1.15;
          background:linear-gradient(180deg, var(--sgs-gold-300), var(--sgs-gold-500));
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .sgs-logo-text .sgs-sub {
          display:block; font-size:.36em; letter-spacing:4px; font-weight:600;
          margin-top:6px; color:var(--sgs-gold-300); -webkit-text-fill-color:var(--sgs-gold-300);
        }
        .sgs-divider { width:84px; height:1px; background:linear-gradient(90deg,transparent,var(--sgs-gold-500),transparent); margin:2px auto; }

        .sgs-tagline-hi {
          opacity:0; animation: sgsFadeUp .6s ease-out 4.3s forwards;
          font-family:'Noto Sans Devanagari', sans-serif; font-size:1rem; color:var(--sgs-cream-100);
        }
        .sgs-tagline-en {
          opacity:0; animation: sgsFadeUp .6s ease-out 4.5s forwards;
          font-family:'Cormorant Garamond', serif; font-style:italic; font-size:1.02rem;
          color:rgba(247,232,201,.85); max-width:320px; margin:0 auto;
        }
        @keyframes sgsFadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

        .sgs-loader-dots {
          opacity:0; animation: sgsFadeUp .5s ease-out 4.8s forwards;
          display:flex; gap:6px; justify-content:center; margin-top:6px;
        }
        .sgs-loader-dots span {
          width:6px; height:6px; border-radius:50%; background:var(--sgs-gold-500);
          animation: sgsDotPulse 1.2s ease-in-out infinite;
        }
        .sgs-loader-dots span:nth-child(2) { animation-delay:.2s; }
        .sgs-loader-dots span:nth-child(3) { animation-delay:.4s; }
        @keyframes sgsDotPulse {
          0%,80%,100% { transform:scale(.6); opacity:.4; }
          40% { transform:scale(1); opacity:1; }
        }

        .sgs-sr-only {
          position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .sgs-stage-earth, .sgs-stage-map { display:none; }
          .sgs-globe-surface, .sgs-emblem-ring { animation:none; }
          .sgs-stage-logo { animation:sgsFadeUp .4s ease-out 0s forwards; }
          .sgs-tagline-hi, .sgs-tagline-en, .sgs-loader-dots { animation-delay:.15s; }
        }

        /* ---- Tablets ---- */
        @media (min-width:600px) and (max-width:1024px) {
          .sgs-map-svg { width:min(64vmin,460px); height:min(64vmin,460px); }
          .sgs-logo-text { font-size:clamp(1.75rem,4.2vw,2.4rem); }
          .sgs-tagline-en { font-size:1.08rem; max-width:380px; }
        }

        /* ---- Phones ---- */
        @media (max-width:599px) {
          .sgs-frame { inset:10px; }
          .sgs-emblem { width:54px; height:54px; }
          .sgs-logo-text { font-size:clamp(1.3rem,7.2vw,1.75rem); }
          .sgs-logo-text .sgs-sub { letter-spacing:2.5px; }
          .sgs-tagline-hi { font-size:.92rem; }
          .sgs-tagline-en { font-size:.88rem; max-width:260px; }
          .sgs-map-svg { width:min(84vmin,340px); height:min(84vmin,340px); }
          .sgs-stage-logo { gap:8px; padding:0 18px; }
        }

        /* ---- Very small phones ---- */
        @media (max-width:360px) {
          .sgs-emblem { width:46px; height:46px; }
          .sgs-logo-text { font-size:clamp(1.1rem,7.5vw,1.45rem); }
          .sgs-tagline-en { font-size:.8rem; }
        }

        /* ---- Short viewports (landscape phones) ---- */
        @media (max-height:500px) {
          .sgs-stage-logo { gap:5px; }
          .sgs-emblem { width:40px; height:40px; margin-bottom:0; }
          .sgs-logo-text { font-size:clamp(1.1rem,5vw,1.4rem); line-height:1.05; }
          .sgs-tagline-en { font-size:.78rem; }
          .sgs-loader-dots { margin-top:2px; }
          .sgs-map-svg { width:min(60vmin,260px); height:min(60vmin,260px); }
          .sgs-globe { width:clamp(80px,22vmin,120px); height:clamp(80px,22vmin,120px); }
        }
      `}</style>
    </div>
  );
}
