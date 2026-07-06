import React, { useState, useEffect } from 'react';
import { Users, Briefcase, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_INDIAN_FLEET = [
  {
    id: "fleet-hatchback",
    category: "Hatchback Comfort",
    models: "Maruti Suzuki Swift, Baleno, Tata Altroz",
    seats: 4,
    luggage: 2,
    fare: "₹11/km (Base ₹999)",
    image: "https://images.unsplash.com/photo-1620021614059-e31ab381a170?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "fleet-sedan",
    category: "Compact Sedan",
    models: "Maruti Suzuki Dzire, Honda Amaze, Hyundai Aura",
    seats: 4,
    luggage: 3,
    fare: "₹12/km (Base ₹1,200)",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "fleet-suv",
    category: "Premium SUV Crysta",
    models: "Toyota Innova Crysta, Mahindra XUV700, Tata Safari",
    seats: 7,
    luggage: 5,
    fare: "₹18/km (Base ₹2,800)",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "fleet-traveller",
    category: "Executive Traveller",
    models: "Force Traveller, Tata Winger Luxury Bus",
    seats: 12,
    luggage: 10,
    fare: "₹26/km (Base ₹5,500)",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
  }
];

export default function FleetSection() {
  const [fleet, setFleet] = useState<any[]>(DEFAULT_INDIAN_FLEET);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeaderGlowing, setIsHeaderGlowing] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem('sg_fleets');
    if (cached) {
      setFleet(JSON.parse(cached));
      setLoading(false);
    }

    const unsub = onSnapshot(collection(db, 'fleets'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (items.length > 0) {
        setFleet(items);
        localStorage.setItem('sg_fleets', JSON.stringify(items));
      } else {
        setFleet(DEFAULT_INDIAN_FLEET);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Error loading fleets from Firestore, using local cache:", err);
      const local = localStorage.getItem('sg_fleets');
      setFleet(local ? JSON.parse(local) : DEFAULT_INDIAN_FLEET);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleNext = () => {
    if (fleet.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % fleet.length);
  };

  const handlePrev = () => {
    if (fleet.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + fleet.length) % fleet.length);
  };

  const triggerHeaderGlow = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setIsHeaderGlowing(true);
    setTimeout(() => setIsHeaderGlowing(false), 1500);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 1500);
  };

  const activeVehicle = fleet[activeIndex] || fleet[0] || DEFAULT_INDIAN_FLEET[0];

  return (
    <section id="fleet" className="py-24 bg-transparent overflow-hidden relative" style={{ color: 'var(--text-primary)' }}>
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-650/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="relative inline-block select-none cursor-pointer group" onClick={triggerHeaderGlow}>
            <motion.h2 
              className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase"
              style={{ color: 'var(--text-primary)' }}
              animate={isHeaderGlowing ? {
                textShadow: [
                  "0 0 0px rgba(249, 115, 22, 0)",
                  "0 0 15px rgba(249, 115, 22, 0.8)",
                  "0 0 30px rgba(249, 115, 22, 1)",
                  "0 0 15px rgba(249, 115, 22, 0.8)",
                  "0 0 0px rgba(249, 115, 22, 0)"
                ],
                color: ["var(--text-primary)", "#f97316", "var(--text-primary)"]
              } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              Our Premium Indian Fleet
            </motion.h2>

            {/* Glowing background aura layer */}
            <AnimatePresence>
              {isHeaderGlowing && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.5, scale: 1.15 }}
                  exit={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full -z-10"
                />
              )}
            </AnimatePresence>

            {/* Micro-sparkle particles burst */}
            {sparkles.map((sp) => (
              <motion.span
                key={sp.id}
                initial={{ opacity: 1, scale: 0.5, x: sp.x, y: sp.y }}
                animate={{ 
                  opacity: 0, 
                  scale: [1, 1.4, 0.6], 
                  x: sp.x + (Math.random() - 0.5) * 200, 
                  y: sp.y + (Math.random() - 0.5) * 160,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute pointer-events-none text-orange-400 z-50 text-lg font-bold"
              >
                ★
              </motion.span>
            ))}
          </div>

          <p className="text-sm md:text-base font-semibold leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
            Immaculately maintained Indian-manufactured tourist vehicles equipped with high-performance dual-zone AC and live tracking. Tap heading to activate glow!
          </p>
        </div>

        {loading && fleet.length === 0 ? (
          <div className="py-24 text-center text-gray-400 font-bold text-sm">Loading Fleet Details...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            
            {/* LEFT COLUMN: Spotlight specifications panel (Desktop: 5 cols, Mobile: full) */}
            <div className="lg:col-span-5 flex flex-col justify-center min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-[0_0_20px_rgba(249,115,22,0.25)] dark:shadow-[0_0_35px_rgba(249,115,22,0.6)] relative z-10"
                >
                  {/* Subtle Top corner highlight */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-[100px] blur-[15px] pointer-events-none" />

                  {/* Active Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-orange-650/15 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-6">
                    <Sparkles size={11} className="animate-pulse" /> active selection
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 leading-none">
                    {activeVehicle.category}
                  </h3>

                  <p className="text-orange-500 text-sm font-black tracking-wider uppercase mb-6 bg-orange-500/5 py-2 px-4 rounded-xl inline-block border border-orange-500/10">
                    {activeVehicle.fare}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-1">Recommended Models</span>
                      <p className="text-gray-300 text-sm font-semibold leading-relaxed">
                        {activeVehicle.models}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-orange-400 mb-1">
                          <Users size={16} />
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Seats</span>
                        </div>
                        <p className="text-white text-sm font-black">{activeVehicle.seats} Passengers</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-orange-400 mb-1">
                          <Briefcase size={16} />
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Luggage</span>
                        </div>
                        <p className="text-white text-sm font-black">{activeVehicle.luggage} Bags</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                          <CheckCircle size={15} />
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">AC</span>
                        </div>
                        <p className="text-white text-sm font-black">Climate Dual</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('select-fleet', { 
                        detail: { category: activeVehicle.category, models: activeVehicle.models, passengers: activeVehicle.seats } 
                      }));
                      const element = document.getElementById('booking-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-650 text-slate-950 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center select-none shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]"
                  >
                    Book This Fleet
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Custom 3D Card Stack Animation Stage (Desktop: 7 cols, Mobile: full) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* Card Container Stage */}
              <div className="relative w-full max-w-[340px] md:max-w-[380px] h-[340px] md:h-[380px] flex items-center justify-center">
                <div className="relative w-[280px] md:w-[320px] h-[320px] md:h-[360px]">
                  {fleet.map((item, index) => {
                    const relativeIndex = (index - activeIndex + fleet.length) % fleet.length;
                    const isTop = relativeIndex === 0;

                    // Compute Stack coordinates and transformations
                    const scale = 1 - relativeIndex * 0.07;
                    const y = -relativeIndex * 24;
                    const rotate = isTop ? 0 : (relativeIndex % 2 === 0 ? 3.5 : -3.5) * relativeIndex;
                    const opacity = relativeIndex > 2 ? 0 : 1 - relativeIndex * 0.35;

                    return (
                      <motion.div
                        key={item.id}
                        style={{
                          zIndex: fleet.length - relativeIndex,
                          transformOrigin: "bottom center",
                        }}
                        animate={{
                          scale,
                          y,
                          rotate,
                          opacity,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        }}
                        drag={isTop ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (isTop) {
                            if (info.offset.x > 80) {
                              handlePrev();
                            } else if (info.offset.x < -80) {
                              handleNext();
                            }
                          }
                        }}
                        className={`absolute inset-0 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-2xl transition-colors duration-300 ${
                          isTop ? "border-orange-500/40 cursor-grab active:cursor-grabbing hover:border-orange-500/80" : "pointer-events-none"
                        }`}
                      >
                        {/* Image Banner */}
                        <div className="h-[60%] w-full overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.category} 
                            className="w-full h-full object-cover select-none pointer-events-none"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute top-4 right-4 bg-orange-650 text-slate-950 font-black text-[9px] px-3 py-1 rounded-full shadow-md uppercase">
                            {item.fare}
                          </div>
                        </div>

                        {/* Title & Details footer of card */}
                        <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950">
                          <div>
                            <h4 className="text-base font-black tracking-tight text-white mb-1 select-none">
                              {item.category}
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-snug font-semibold line-clamp-2 select-none">
                              {item.models}
                            </p>
                          </div>
                          
                          {/* Mini stats */}
                          <div className="flex justify-between items-center text-[9px] text-gray-400 border-t border-slate-800/80 pt-2.5 mt-2 font-bold uppercase tracking-wider select-none">
                            <span className="flex items-center gap-1">
                              <Users size={12} className="text-orange-500" /> {item.seats} Seats
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={12} className="text-orange-500" /> {item.luggage} Bags
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 bg-slate-900 hover:bg-orange-500 text-white hover:text-slate-950 border border-slate-800 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  title="Previous Fleet"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Bullets Indicator Dots */}
                <div className="flex gap-2">
                  {fleet.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIndex ? "bg-orange-500 w-6" : "bg-slate-700 w-2 hover:bg-gray-500"
                      }`}
                      title={`Go to fleet ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-12 h-12 bg-slate-900 hover:bg-orange-500 text-white hover:text-slate-950 border border-slate-800 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  title="Next Fleet"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Swipe Guidance Tip */}
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4 animate-pulse">
                ← Swipe card or drag left/right to browse →
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
