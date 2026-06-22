import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Activity, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

  const css = `
  .FleetSwiper {
    width: 100%;
    height: 520px;
    padding-bottom: 50px !important;
  }
  
  .FleetSwiper .swiper-slide {
    background: transparent;
    width: 320px;
    height: auto;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
  }

  .FleetSwiper .swiper-pagination-bullet-active {
    background-color: #f97316 !important;
  }

  .FleetSwiper .swiper-pagination-bullet {
    background-color: #4b5563;
  }
  `;

  return (
    <section id="fleet" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <style>{css}</style>
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles size={11} /> Executive Garage Fleet
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Our Premium Indian Fleet
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-semibold leading-relaxed">
            Immaculately maintained Indian-manufactured tourist vehicles equipped with high-performance dual-zone AC and live tracking. Slide to explore options!
          </p>
        </div>

        {loading && fleet.length === 0 ? (
          <div className="py-24 text-center text-gray-400 font-bold text-sm">Loading Fleet Details...</div>
        ) : (
          <div className="relative w-full max-w-5xl mx-auto px-4">
            
            <Swiper
              effect="creative"
              grabCursor={true}
              slidesPerView="auto"
              centeredSlides={true}
              spaceBetween={20}
              loop={fleet.length > 2}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.fleet-next',
                prevEl: '.fleet-prev',
              }}
              creativeEffect={{
                prev: {
                  shadow: true,
                  origin: "left center",
                  translate: ["-10%", 0, -200],
                  rotate: [0, 8, 0],
                },
                next: {
                  origin: "right center",
                  translate: ["10%", 0, -200],
                  rotate: [0, -8, 0],
                },
              }}
              modules={[EffectCreative, Pagination, Autoplay, Navigation]}
              className="FleetSwiper"
            >
              {fleet.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="h-full bg-slate-850 rounded-3xl overflow-hidden border border-slate-850 hover:border-orange-500/80 transition-all flex flex-col justify-between shadow-2xl">
                    <div>
                      {/* Image Frame */}
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.category} 
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute top-4 right-4 bg-orange-600 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
                          {item.fare}
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5.5">
                        <h3 className="text-lg font-black tracking-tight mb-1 inline-flex items-center gap-1.5">{item.category}</h3>
                        <p className="text-[11px] text-gray-400 leading-snug font-semibold h-11 overflow-hidden">
                          {item.models}
                        </p>
                      </div>
                    </div>

                    {/* Stats Footer Details */}
                    <div className="p-5.5 pt-0">
                      <div className="flex justify-between items-center text-[10px] text-gray-350 border-t border-slate-800 pt-3.5 mb-4 font-black uppercase tracking-wider">
                        <div className="flex items-center gap-1" title="Passengers">
                          <Users size={14} className="text-orange-500" /> {item.seats} Seats
                        </div>
                        <div className="flex items-center gap-1" title="Luggage">
                          <Briefcase size={14} className="text-orange-500" /> {item.luggage} Bags
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400" title="All-Weather AC">
                          <CheckCircle size={12} /> Climate AC
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('select-fleet', { 
                            detail: { category: item.category, models: item.models, passengers: item.seats } 
                          }));
                          const element = document.getElementById('booking-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center select-none shadow-md"
                      >
                        Book This Fleet
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation trigger buttons */}
            <button className="fleet-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[20px] md:-translate-x-[40px] z-20 w-11 h-11 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 border border-slate-700 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl">
              <ChevronLeft size={20} />
            </button>
            <button className="fleet-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20px] md:translate-x-[40px] z-20 w-11 h-11 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 border border-slate-700 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl">
              <ChevronRight size={20} />
            </button>

          </div>
        )}

      </div>
    </section>
  );
}
