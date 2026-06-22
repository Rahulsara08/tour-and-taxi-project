"use client";

import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon, Sparkles, Navigation } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination, Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "../lib/utils";

// Royal destinations and fleet images featuring "Shri Gurukripa" services
const GURUKRIPA_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=80&w=1200",
    alt: "Shri Gurukripa Palace Tours - Jaipur Hawa Mahal",
    title: "Pink City Heritage Tour",
    subtitle: "Explore magnificent forts and bazaars with professional drivers",
    tag: "Jaipur Special"
  },
  {
    src: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1200",
    alt: "Shri Gurukripa Lake Tours - Udaipur City Palace",
    title: "Venice of the East",
    subtitle: "Experience majestic lakeside drives and romantic sunset tours",
    tag: "Udaipur Romance"
  },
  {
    src: "https://images.unsplash.com/photo-1594132890528-97fcbbed921f?auto=format&fit=crop&q=80&w=1200",
    alt: "Shri Gurukripa Indigo Tours - Jodhpur Blue City",
    title: "The Indigo Skyline",
    subtitle: "Witness towering Mehrangarh Fort and heritage blue alleyways",
    tag: "Mehrangarh Tour"
  },
  {
    src: "https://images.unsplash.com/photo-1504128117511-3be9cf8e5114?auto=format&fit=crop&q=80&w=1200",
    alt: "Shri Gurukripa Thar Safari - Jaisalmer Dunes",
    title: "Thar Golden Desert Camps",
    subtitle: "Thrill yourselves with sunset camel rides and sand dunes safaris",
    tag: "Desert Adventure"
  },
  {
    src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    alt: "Shri Gurukripa Luxury Fleet - Premium SUV Innova",
    title: "Super-Comfort Luxury Fleet",
    subtitle: "Dual-zone high-performance AC cabs for all-weather convenience",
    tag: "Gurukripa Premium"
  }
];

const Skiper50 = () => {
  return (
    <section className="relative py-16 bg-slate-50 border-b border-slate-100 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title branding custom for Shri Gurukripa */}
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-1 bg-orange-100 border border-orange-200 text-orange-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3.5 shadow-sm">
            <Sparkles size={11} className="text-orange-500 animate-pulse" /> Royal Rajasthan Gallery
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Shri Gurukripa Experience
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-semibold leading-relaxed mt-2.5">
            Sweep through beautiful high-definition glimpses of Rajasthani sights covered under our premium tours and trusted taxi service. Custom craft your grand travel today!
          </p>
        </div>

        {/* The slideshow component */}
        <div className="flex w-full items-center justify-center overflow-hidden">
          <Carousel_004 className="" images={GURUKRIPA_SLIDES} showPagination loop autoplay />
        </div>

        {/* Navigation prompt button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              const element = document.getElementById("booking-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs md:text-sm px-7 py-3.5 rounded-full uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-98"
          >
            <Navigation size={15} className="fill-slate-950" /> Start Booking Your Cab Now
          </button>
        </div>

      </div>
    </section>
  );
};

interface SlideItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}

const Carousel_004 = ({
  images,
  className,
  showPagination = false,
  showNavigation = true,
  loop = true,
  autoplay = true,
  spaceBetween = 0,
}: {
  images: SlideItem[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_004 {
    width: 100%;
    height: 480px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_004 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px;
    height: 400px;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    transition: transform 0.3s ease;
  }

  .Carousal_004 .swiper-pagination-bullet-active {
    background-color: #f97316 !important;
  }

  .Carousal_004 .swiper-pagination-bullet {
    background-color: #94a3b8;
  }

  .Carousal_004 .swiper-button-disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-5xl px-4", className)}
    >
      <style>{css}</style>

      <div className="w-full relative">
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                }
              : false
          }
          effect="creative"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: ".skip-next-btn",
            prevEl: ".skip-prev-btn",
          }}
          className="Carousal_004"
          creativeEffect={{
            prev: {
              shadow: true,
              origin: "left center",
              translate: ["-12%", 0, -250],
              rotate: [0, 8, 0],
            },
            next: {
              origin: "right center",
              translate: ["12%", 0, -250],
              rotate: [0, -8, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay, SwiperNavigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="swiper-slide group border border-slate-200">
              {/* Image Frame */}
              <div className="w-full h-full relative overflow-hidden">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  src={image.src}
                  alt={image.alt}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                
                {/* Royal aesthetic gradient overlay matching dark blue brand elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                
                {/* Floating Content overlays */}
                <div className="absolute top-4 left-4">
                  {image.tag && (
                    <span className="text-[9px] font-black uppercase bg-orange-600/90 text-slate-950 border border-orange-500/30 px-3 py-1 rounded-full shadow-lg">
                      {image.tag}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-5 inset-x-5 text-left text-white space-y-1 z-10">
                  <h4 className="text-lg font-black tracking-tight leading-tight uppercase text-orange-450 text-white drop-shadow">
                    {image.title || "Shri Gurukripa"}
                  </h4>
                  <p className="text-[11px] font-bold text-gray-200 leading-snug">
                    {image.subtitle || image.alt}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left & Right navigation triggers styled extremely premium */}
        <button className="skip-prev-btn absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 -translate-y-[25px] z-20 w-11 h-11 bg-white hover:bg-orange-500 text-slate-900 hover:text-slate-950 border border-slate-200 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button className="skip-next-btn absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 -translate-y-[25px] z-20 w-11 h-11 bg-white hover:bg-orange-500 text-slate-900 hover:text-slate-950 border border-slate-200 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export { Skiper50, Carousel_004 };
export default Skiper50;
