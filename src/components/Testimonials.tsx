import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "motion/react";
import React, { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import { Star, Quote, X, MapPin, Calendar, Car, Clock, ChevronRight, BadgeCheck } from "lucide-react";
import { cn } from "../lib/utils";

/* ─── Local Assets ─────────────────────────────────────────────────────────── */
import jaipurImage     from "../../assets/jaipur_hawa_mahal.jpg";
import jodhpurImage    from "../../assets/jodhpur_city.png";
import udPavilionImage from "../../assets/udaipur_pavilion.png";
import pushkarImage    from "../../assets/pushkar_lake.png";

// AI-generated HD Rajasthan photos
import aiJaisalmer  from "../../assets/ai_jaisalmer_sunset.png";
import aiDesert     from "../../assets/ai_thar_desert.png";
import aiStepwell   from "../../assets/ai_stepwell.png";
import aiAmerFort   from "../../assets/ai_amer_fort.png";
import udaipurPalace from "../../assets/udaipur_palace.png";
import aiAlwar from "../../assets/ai_alwar.png";
import aiBikaner from "../../assets/ai_bikaner_fort.png";
import aiBundi from "../../assets/ai_bundi.png";
import aiChittorgarh from "../../assets/ai_chittorgarh.png";
import aiKota from "../../assets/ai_kota.png";
import aiKumbhalgarh from "../../assets/ai_kumbhalgarh.png";
import aiMandawa from "../../assets/ai_mandawa.png";
import aiMountAbu from "../../assets/ai_mount_abu.png";
import aiRanakpur from "../../assets/ai_ranakpur.png";

import newMosaic1 from "../../assets/gen_haveli.png";
import newMosaic2 from "../../assets/gen_luxury_taxi.png";

// User-provided cultural photos
import storyDance   from "../../assets/story_dance.jpg";
import storyThali   from "../../assets/story_thali.jpg";
import storyPuppets from "../../assets/story_puppets.jpg";

import p1 from "../../assets/promo_scene_1.png";
import p2 from "../../assets/promo_scene_2.png";
import p3 from "../../assets/promo_scene_3.png";
import p4 from "../../assets/promo_scene_4.png";
import p5 from "../../assets/promo_scene_5.png";
import p6 from "../../assets/promo_scene_6.png";
import p7 from "../../assets/promo_scene_7.png";
import p8 from "../../assets/promo_scene_8.png";

/* ─── High-Quality Local images ─────────────────────────────────────────── */
const IMG = {
  jaipurPalace:  p1,
  udaipurLake:   p2,
  jodhpurFort:   p3,
  ajmerDargah:   p4,
  jaipurAmber:   p5,
  bikaFort:      p6,
  ranthambore:   p7,
  extra:         p8,
};

/* ─── Testimonials data — full blog-style stories ────────────────────────── */
const TESTIMONIALS = [
  {
    src: IMG.udaipurLake,
    alt: "Udaipur Tour",
    name: "Rahul Sarawat",
    role: "Udaipur Tour",
    code: "Udaipur Trip",
    location: "Jaipur → Udaipur → Jaipur",
    date: "March 2026",
    vehicle: "Toyota Innova Crysta",
    duration: "3 Days",
    rating: 5,
    text: "Incredible 3-day trip to Udaipur! Driver Ramesh was professional, knew all the best spots, and the Innova Crysta was super comfortable.",
    fullStory: `My family of five had been planning our Udaipur trip for months and we were nervous about arranging transport. A colleague recommended Shri Gurukripa Tours & Taxi and it turned out to be the best decision of our trip.\n\nOur driver, Ramesh ji, arrived 20 minutes early at our Jaipur home. The Innova Crysta was spotlessly clean, air-conditioned perfectly, and had charging ports for all our devices. Ramesh greeted us warmly and even had a small bouquet of marigolds for my mother!\n\nThroughout the journey he shared fascinating stories about the history of each place we passed. At City Palace, he waited patiently for over 4 hours without a single complaint. He knew every shortcut, every clean restaurant, and even helped us find a last-minute lakeside table for dinner.\n\nOn our return, he stopped at Chittorgarh Fort without us even asking — because he had overheard us say we always wanted to visit it. That kind of initiative and care is rare.\n\nI have already recommended Shri Gurukripa to three of my colleagues. If you're planning a Rajasthan trip, stop looking — just call them.`,
    highlights: ["Chittorgarh Fort surprise stop", "Lakeside dinner arrangement", "20 min early pickup", "Spotless Innova Crysta"],
    avatar: "RS",
    avatarColor: "#f97316",
  },
  {
    src: IMG.jaipurPalace,
    alt: "Jaipur Heritage",
    name: "Priya Sharma",
    role: "Jaipur Sightseeing",
    code: "Jaipur Heritage",
    location: "Jaipur City Tour",
    date: "January 2026",
    vehicle: "Swift Dzire",
    duration: "1 Day (8 Hours)",
    rating: 5,
    text: "Booked a local rental for Jaipur heritage tour. Service was prompt, driver courteous, and pricing completely transparent. Highly recommended!",
    fullStory: `I was visiting Jaipur solo for a corporate conference and had one free day to explore the Pink City. I booked an 8-hour local rental through Shri Gurukripa's website at 11 PM the previous night — and was genuinely surprised when I got a confirmation call within minutes!\n\nThe next morning, my driver Suresh was waiting in the hotel lobby with a smile and a printed itinerary based on my interests that I had mentioned on the phone. How thoughtful!\n\nWe covered Amer Fort (he arranged a jeep ride since elephants weren't available), Jal Mahal, Hawa Mahal, Jantar Mantar, City Palace and Johari Bazaar — all in 8 hours without feeling rushed. At Hawa Mahal, Suresh knew exactly which corner gives the best photograph and the perfect time to avoid crowds.\n\nThe pricing was exactly what was quoted — no surprise charges, no pressure to extend or add extras. As a solo female traveler, I felt completely safe and respected throughout the day.\n\nI returned to my hotel with beautiful memories, amazing photographs, and a deep appreciation for Jaipur's rich history. This service is a 10 out of 10.`,
    highlights: ["Solo female traveler — felt safe", "Pre-planned printed itinerary", "No hidden charges", "Covered 7 sites in 8 hours"],
    avatar: "PS",
    avatarColor: "#8b5cf6",
  },
  {
    src: storyDance,
    alt: "Rajasthani Cultural Evening",
    name: "Vikram Singh",
    role: "Jodhpur Outstation",
    code: "Blue City Drive",
    location: "Jaipur → Jodhpur → Jaipur",
    date: "February 2026",
    vehicle: "Mahindra Scorpio",
    duration: "2 Days",
    rating: 5,
    text: "Shri Gurukripa is the best outstation taxi service in Rajasthan. Safe night driving, punctual pickup, and seamless booking.",
    fullStory: `We booked an outstation cab for a weekend trip to Jodhpur — a group of six friends looking for an adventure in the Blue City. From the very first call, the Shri Gurukripa team was professional and helpful.\n\nOur driver Mahendra had an excellent knowledge of all of Jodhpur's hidden gems. He took us to Mehrangarh Fort at sunrise — and the view of the blue city glowing in morning light was absolutely breathtaking. Worth waking up at 5 AM for!\n\nIn the evening, on Mahendra's recommendation, we attended a traditional Rajasthani cultural show with Ghoomar dancers at a heritage haveli. The experience was unforgettable — the vibrant swirling costumes, the crystal chandeliers, and the rhythm of the folk music transported us centuries back in time.\n\nFor our night drive back to Jaipur, Mahendra drove expertly and safely — playing soothing music and stopping midway for chai. He knew every good dhaba on the highway.\n\nThis wasn't just a taxi service — it was a curated experience. Thank you Shri Gurukripa!`,
    highlights: ["Sunrise at Mehrangarh Fort", "Heritage Ghoomar cultural show", "Safe expert night driving", "Highway dhaba stops"],
    avatar: "VS",
    avatarColor: "#3b82f6",
  },
  {
    src: storyThali,
    alt: "Rajasthani Thali Experience",
    name: "Amit & Neha Joshi",
    role: "Couples Package",
    code: "Desert Romance",
    location: "Jaipur → Jaisalmer → Jaipur",
    date: "December 2025",
    vehicle: "Toyota Innova Crysta",
    duration: "4 Days",
    rating: 5,
    text: "Desert safari in Jaisalmer was magical. Shri Gurukripa managed our travel, camel safari, and camp stay flawlessly!",
    fullStory: `Neha and I had our first anniversary trip planned to Jaisalmer and we wanted everything to be perfect. After reading several reviews, we chose Shri Gurukripa and they exceeded every expectation.\n\nOur driver Dilip was not just a cab driver — he was like a local friend. He arranged our camel safari on the Sam Sand Dunes at sunset, the luxury desert camp booking, and even surprised Neha with rose petals in the cab on our anniversary morning. I had mentioned it casually on the call and they remembered!\n\nDilip took us to a family-owned restaurant where we had the most authentic Rajasthani dal-baati-churma and a traditional brass thali with 12 dishes — a food experience we will talk about for years. He waited 2.5 hours without any extra charge!\n\nThe Patwon Ki Haveli, Jaisalmer Fort, and Gadisar Lake were all covered beautifully. Dilip even brought a portable Bluetooth speaker for the dunes so we could dance under the stars.\n\nFor our anniversary, this trip was perfect — and Shri Gurukripa made it happen. We are already planning our next trip with them to Udaipur.`,
    highlights: ["Anniversary rose petal surprise", "Authentic 12-dish brass thali", "Sunset camel safari arranged", "Dancing under stars on dunes"],
    avatar: "AJ",
    avatarColor: "#ec4899",
  },
  {
    src: storyPuppets,
    alt: "Rajasthani Puppet Show",
    name: "Mohammad Ali Khan",
    role: "Pilgrimage Tour",
    code: "Ajmer Journey",
    location: "Jaipur → Ajmer → Pushkar → Jaipur",
    date: "April 2026",
    vehicle: "Ertiga",
    duration: "2 Days",
    rating: 5,
    text: "Very reliable service for family pilgrimage tours. Smooth roundtrip from Jaipur to Ajmer Sharif Dargah and Pushkar.",
    fullStory: `Our family of seven — three generations — undertook a pilgrimage to Ajmer Sharif Dargah and Pushkar. Finding a reliable, comfortable service for elderly grandparents and young children is always a challenge, but Shri Gurukripa made it effortless.\n\nThey arranged an Ertiga with extra legroom and ensured the vehicle was equipped with a first aid kit. Our driver Salim was patient, respectful, and made frequent stops for elderly members of our family without any hesitation.\n\nAt Ajmer Sharif, Salim knew exactly which entrance to use to avoid the crowds and arranged for a guide to assist us. At Pushkar Lake, he found wheelchair access for my grandmother, which I had not even asked for.\n\nOn the way back, we stopped at a small Rajput village where craftsmen create traditional puppets by hand. Watching these artisans at work — the intricate stitching, the hand-painted faces, the silk costumes — was a magical unexpected experience that Salim had added to our journey as a gift.\n\nShri Gurukripa understands that travel is not just about reaching a destination — it is about the journey. They have a customer for life in our family.`,
    highlights: ["Arranged wheelchair access", "First aid kit in vehicle", "Traditional puppet craft village visit", "3-generation family handled perfectly"],
    avatar: "MK",
    avatarColor: "#10b981",
  },
];

/* ─── Hero mosaic images — carefully curated, all HD ───────────────────────── */
const HERO_IMAGES = [
  { src: jaipurImage,    label: "Jaipur – Hawa Mahal",    pos: "center 30%" },
  { src: udaipurPalace,  label: "Udaipur – City Palace",  pos: "center center" },
  { src: jodhpurImage,   label: "Jodhpur – Blue City",    pos: "center 40%" },
  { src: aiAmerFort,     label: "Jaipur – Amer Fort",     pos: "center 60%" },
  { src: udPavilionImage,label: "Udaipur – Pavilion",     pos: "center top" },
  { src: aiJaisalmer,    label: "Jaisalmer – Golden Fort",pos: "center center" },
  { src: pushkarImage,   label: "Pushkar – Sacred Lake",  pos: "center 30%" },
  { src: aiDesert,       label: "Thar Desert – Dunes",    pos: "center center" },
  { src: newMosaic1,     label: "Rajasthan – Heritage",   pos: "center center" },
  { src: newMosaic2,     label: "Luxury – Taxi Tour",     pos: "center center" },
];

/* ─── Parallax columns — 4 cols × 3 images each ────────────────────────────── */
const COL_IMGS = [
  // Col 1
  [aiAlwar, aiBikaner, aiBundi, aiStepwell, newMosaic1],
  // Col 2
  [aiChittorgarh, aiKota, aiKumbhalgarh, aiAmerFort, pushkarImage],
  // Col 3
  [aiMandawa, aiMountAbu, aiRanakpur, jaipurImage, jodhpurImage],
  // Col 4 — user cultural photos
  [storyDance, storyThali, storyPuppets, newMosaic2, udaipurPalace],
];

/* ══════════════════════════════════════════════════════════════════════════════
   HERO MOSAIC — Full-viewport background with strong readability overlay
══════════════════════════════════════════════════════════════════════════════ */
const HeroMosaic = memo(function HeroMosaic() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Gentle parallax scale — GPU friendly
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>

      {/* ── Mosaic background grid ── */}
      <motion.div
        style={shouldReduce ? {} : { scale }}
        className="absolute inset-0 grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3"
        aria-hidden="true"
      >
        {HERO_IMAGES.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
            className={cn(
              "relative overflow-hidden bg-slate-800 rounded-xl sm:rounded-2xl",
              // Make first and middle images taller for visual variety
              i === 0 ? "row-span-2" : 
              i === 5 ? "row-span-2" : ""
            )}
          >
            <img
              src={img.src}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: img.pos, minHeight: "100%" }}
              loading={i < 4 ? "eager" : "lazy"}
              decoding="async"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Primary strong overlay — ensures text is ALWAYS readable and merges seamlessly with Hero gap ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              var(--bg-primary) 0%,
              rgba(2, 6, 23, 0.50) 20%,
              rgba(2, 6, 23, 0.45) 50%,
              rgba(2, 6, 23, 0.50) 80%,
              var(--bg-primary) 100%
            )
          `
        }}
      />

      {/* ── Bottom section fade into bg ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)"
        }}
      />

      {/* ── Foreground text — always readable ── */}
      <motion.div
        style={shouldReduce ? {} : { opacity }}
        className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pb-32 pt-24 text-center"
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/15 border border-orange-500/30 px-4 py-1.5 rounded-full mb-7 shadow-lg shadow-orange-500/10"
        >
          ✦ Comfort &amp; Reliability ✦
        </motion.span>

        {/* Heading — white base + orange accent, heavy drop-shadow for contrast */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05]"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 40px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.8)"
          }}
        >
          Every Turn,
          <br />
          <span
            style={{
              color: "#F97316",
              textShadow: "0 2px 30px rgba(249,115,22,0.5), 0 1px 10px rgba(0,0,0,0.9)"
            }}
          >
            Guided by Comfort
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 max-w-md sm:max-w-lg text-sm sm:text-base font-medium leading-relaxed text-white/85"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
        >
          Follow the winding paths of Rajasthan's heritage. Experience the journey of thousands of our happy travelers.
        </motion.p>

        {/* Destination city chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          {["Jaipur", "Jodhpur", "Udaipur", "Pushkar", "Jaisalmer", "Ajmer"].map(city => (
            <span
              key={city}
              className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 backdrop-blur-sm hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-300 transition-colors cursor-default"
            >
              {city}
            </span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.45 }}
          className="flex items-center gap-6 sm:gap-10 mt-10 flex-wrap justify-center"
        >
          {[
            { val: "5000+", label: "Happy Travelers" },
            { val: "8", label: "Cities Covered" },
            { val: "4.9★", label: "Avg Rating" },
          ].map(s => (
            <div key={s.val} className="text-center">
              <p className="text-xl sm:text-2xl font-black text-orange-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>{s.val}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════════════════════════
   PARALLAX COLUMN — Single column, GPU-accelerated
══════════════════════════════════════════════════════════════════════════════ */
const ParallaxColumn = memo(function ParallaxColumn({ images, y, reverse }: {
  images: string[];
  y: any;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="flex flex-col gap-2 sm:gap-3 w-full"
      style={{ y, willChange: "transform" }}
    >
      {(reverse ? [...images].reverse() : images).map((src, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-700 shadow-md"
          style={{ aspectRatio: "3/4" }}
        >
          <img
            src={src}
            alt="Rajasthan Tourism"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
      ))}
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════════════════════════════
   STORY MODAL COMPONENT (Blog Style)
   ══════════════════════════════════════════════════════════════════════════════ */
const StoryModal = ({ story, onClose }: { story: any; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-text">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-4xl max-h-[85vh] rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 shadow-2xl flex flex-col overflow-hidden z-10 text-slate-900 dark:text-white"
      >
        {/* Banner Section */}
        <div className="relative h-[200px] md:h-[260px] shrink-0 overflow-hidden">
          <img src={story.src} alt={story.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-slate-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 bg-slate-900/80 hover:bg-orange-500 text-white hover:text-slate-950 p-2.5 rounded-full transition-all border border-slate-700/50 cursor-pointer shadow-md"
          >
            <X size={18} />
          </button>
          
          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-0.5 rounded-full">
                {story.role}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2.5 py-0.5 rounded-full">
                {story.code}
              </span>
            </div>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {story.name}'s Travel Experience
            </h3>
          </div>
        </div>

        {/* Inner Content Grid */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-8">
          {/* Main Story Column */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: story.rating }).map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-4 border-orange-500 pl-4">
              "{story.text}"
            </p>
            <div className="space-y-4 text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
              {story.fullStory.split('\n\n').map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Details Sidebar Panel */}
          <div className="w-full md:w-[280px] space-y-6 shrink-0 md:border-l md:border-slate-100 dark:md:border-slate-900 md:pl-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Tour Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider leading-none">Route</span>
                    <span className="text-xs font-extrabold text-slate-755 dark:text-slate-250 mt-1 block">{story.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Car size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider leading-none">Vehicle</span>
                    <span className="text-xs font-extrabold text-slate-755 dark:text-slate-250 mt-1 block">{story.vehicle}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider leading-none">Duration</span>
                    <span className="text-xs font-extrabold text-slate-755 dark:text-slate-250 mt-1 block">{story.duration}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider leading-none">Date of Journey</span>
                    <span className="text-xs font-extrabold text-slate-755 dark:text-slate-250 mt-1 block">{story.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {story.highlights && story.highlights.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Highlights
                </h4>
                <ul className="space-y-2">
                  {story.highlights.map((hl: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-350">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function Testimonials() {
  const galleryRef  = useRef<HTMLDivElement>(null);
  const [isMobile,  setIsMobile]  = useState(false);
  const [activeImage, setActiveImage]   = useState<number | null>(0);
  const [storyModalIdx, setStoryModalIdx] = useState<number | null>(null);
  const [winH, setWinH]  = useState(700);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWinH(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parallax scroll values
  const { scrollYProgress: galleryProg } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  // Different speeds per column — subtle, GPU-friendly
  const speed = shouldReduce ? 0 : 1;
  const y1 = useTransform(galleryProg, [0, 1], [0,  winH * 0.4  * speed]);
  const y2 = useTransform(galleryProg, [0, 1], [0, -winH * 0.3  * speed]);
  const y3 = useTransform(galleryProg, [0, 1], [0,  winH * 0.25 * speed]);
  const y4 = useTransform(galleryProg, [0, 1], [0, -winH * 0.35 * speed]);

  return (
    <section className="flex w-full flex-col items-center overflow-hidden relative">

      {/* ── Phase 1: Hero with photo mosaic background ── */}
      <HeroMosaic />

      {/* ── Transition divider ── */}
      <div className="w-full h-16 sm:h-24 -mt-2" style={{ background: "transparent" }} />

      {/* ── Phase 2: Parallax photo columns + Customer Experiences (combined) ── */}
      <div className="w-full relative" style={{ backgroundColor: "transparent" }}>

        {/* Section label */}
        <div className="text-center pt-4 pb-8 sm:pb-12 px-4">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-500">
            ★ Rajasthan Through Our Lens ★
          </span>
          <h3
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            Every Destination, a Story
          </h3>
          <p className="text-sm font-semibold leading-relaxed mt-2 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Scroll through our journeys across the royal landscapes of Rajasthan.
          </p>
        </div>

        {/* Parallax columns grid */}
        <div
          ref={galleryRef}
          className="relative w-full overflow-hidden px-2 sm:px-4 pb-16"
          style={{ height: isMobile ? "70vh" : "120vh" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 h-full">
            <ParallaxColumn images={COL_IMGS[0]} y={y1} />
            <ParallaxColumn images={COL_IMGS[1]} y={y2} reverse />
            {!isMobile && <ParallaxColumn images={COL_IMGS[2]} y={y3} />}
            {!isMobile && <ParallaxColumn images={COL_IMGS[3]} y={y4} reverse />}
          </div>

          {/* Bottom fade into next section */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 h-32"
            style={{ background: "transparent" }}
          />
        </div>
      </div>

      {/* ── Phase 3: Customer Experiences ── */}
      <div
        className="w-full px-3 sm:px-4 pt-4 pb-16 sm:pb-24"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 text-center">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-500">
            ★ Customer Experiences ★
          </span>
          <h3
            className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            Real Stories from Real Travelers
          </h3>
          <p className="text-sm sm:text-base font-semibold leading-relaxed mt-2" style={{ color: "var(--text-secondary)" }}>
            Tap any card to read their full story about our cabs and expert local drivers.
          </p>
        </div>

        {/* Testimonial accordion */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          <TestimonialsAccordion isMobile={isMobile} active={activeImage} setActive={setActiveImage} onReadMore={setStoryModalIdx} />
        </div>
      </div>

      {/* Story Modal — portal-like fullscreen overlay */}
      <AnimatePresence>
        {storyModalIdx !== null && (
          <StoryModal story={TESTIMONIALS[storyModalIdx]} onClose={() => setStoryModalIdx(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS ACCORDION (skiper52)
══════════════════════════════════════════════════════════════════════════════ */
const TestimonialsAccordion = memo(function TestimonialsAccordion({ isMobile, active, setActive, onReadMore }: {
  isMobile: boolean;
  active: number | null;
  setActive: (i: number) => void;
  onReadMore: (i: number) => void;
}) {
  return (
    <div className="w-full max-w-6xl px-0 sm:px-4">
      <div className={cn(
        "flex w-full items-center justify-center gap-2 sm:gap-3",
        isMobile ? "flex-col" : "flex-row"
      )}>
        {TESTIMONIALS.map((t, idx) => {
          const isActive = active === idx;
          return (
            <motion.div
              key={idx}
              className={cn(
                "relative cursor-pointer overflow-hidden border bg-slate-900 select-none",
                isActive ? "border-orange-500/30 shadow-lg shadow-orange-500/10" : "border-white/10 hover:border-white/20"
              )}
              style={{ borderRadius: "1.5rem sm:2rem" }}
              animate={{
                width:  isMobile ? "100%" : isActive ? "28rem" : "5.5rem",
                height: isMobile ? (isActive ? "18rem" : "4.5rem") : "26rem",
                borderRadius: "1.75rem"
              }}
              transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setActive(idx)}
              onMouseEnter={() => !isMobile && setActive(idx)}
            >
              {/* Background image */}
              <img
                src={t.src}
                alt={t.alt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.85 }}
                loading="lazy"
                decoding="async"
              />

              {/* Dark tint */}
              <div className={cn(
                "absolute inset-0 transition-colors duration-300 z-10",
                isActive ? "bg-transparent" : "bg-slate-950/50"
              )} />

              {/* Active gradient */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10"
                    style={{ background: "linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.5) 40%, transparent 100%)" }}
                  />
                )}
              </AnimatePresence>

              {/* Quote icon */}
              <AnimatePresence>
                {isActive && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.18, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}
                    className="absolute top-6 left-6 text-white z-20 pointer-events-none"
                  >
                    <Quote size={44} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.28 }}
                    className={cn(
                      "absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col justify-end text-left z-20",
                      isMobile ? "max-h-[14rem]" : "h-full pt-16"
                    )}
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {/* Review */}
                    <p className={cn("text-white/90 text-xs md:text-sm font-semibold leading-relaxed italic", isMobile ? "mb-2 line-clamp-2" : "mb-4")}>
                      "{t.text}"
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReadMore(idx);
                      }}
                      className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-400/10 hover:bg-orange-500 hover:text-slate-950 px-3.5 py-1.5 md:py-2 rounded-full transition-all border border-orange-400/20 mb-3 md:mb-4 self-start cursor-pointer flex items-center gap-1 group/btn"
                    >
                      Read Full Story
                      <ChevronRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    {/* Author */}
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-black text-white leading-none">{t.name}</p>
                        <p className="text-[10px] text-orange-400 font-bold uppercase mt-0.5 tracking-wider">{t.role}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        Verified ✓
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inactive label — desktop */}
              {!isActive && !isMobile && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <p className="text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap rotate-90 drop-shadow">
                    {t.code}
                  </p>
                </div>
              )}

              {/* Inactive label — mobile */}
              {!isActive && isMobile && (
                <div className="absolute inset-0 flex items-center justify-between px-5 z-20 pointer-events-none">
                  <p className="text-white font-black text-xs uppercase tracking-wider">{t.code}</p>
                  <span className="text-orange-400 text-[9px] font-bold uppercase tracking-widest">Tap ➔</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
