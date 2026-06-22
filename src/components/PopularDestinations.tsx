import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const DEFAULT_INDIAN_DESTINATIONS = [
  {
    id: "dest-jaipur",
    name: "Jaipur (Pink City)",
    image: "https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=80&w=800",
    desc: "Explore majestic palaces, pink sandstones, and royal heritage.",
    places: "Hawa Mahal, Amer Fort, City Palace, Jantar Mantar, Chokhi Dhani",
    distance: "Base headquarters starting point",
    fare: "From ₹1,800/Day"
  },
  {
    id: "dest-udaipur",
    name: "Udaipur (City of Lakes)",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800",
    desc: "Vibrant romance in the Venice of the East with beautiful boat cruises.",
    places: "Lake Pichola, City Palace Udaipur, Jag Mandir, Sajjangarh Fort",
    distance: "395 km from Jaipur",
    fare: "From ₹7,500 Full Tour"
  },
  {
    id: "dest-jodhpur",
    name: "Jodhpur (The Blue City)",
    image: "https://images.unsplash.com/photo-1594132890528-97fcbbed921f?auto=format&fit=crop&q=80&w=800",
    desc: "Imposing Mehrangarh Fort towering over indigo colored houses.",
    places: "Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace, Mandore Gardens",
    distance: "330 km from Jaipur",
    fare: "From ₹6,200 Full Tour"
  },
  {
    id: "dest-jaisalmer",
    name: "Jaisalmer (The Golden City)",
    image: "https://images.unsplash.com/photo-1504128117511-3be9cf8e5114?auto=format&fit=crop&q=80&w=800",
    desc: "Mystical desert safaris, yellow sandstone forts, and overnight camping.",
    places: "Jaisalmer Fort, Sam Sand Dunes, Patwon ki Haveli, Gadisar Lake",
    distance: "550 km from Jaipur",
    fare: "From ₹9,800 Family Package"
  },
  {
    id: "dest-ajmer",
    name: "Ajmer & Pushkar (Sacred Pilgrimage)",
    image: "https://images.unsplash.com/photo-1616790518770-07bfca531b79?auto=format&fit=crop&q=80&w=800",
    desc: "Sufi shrine of Khwaja Gharib Nawaz and the holy Brahma Lake.",
    places: "Ajmer Sharif Dargah, Ana Sagar, Brahma Temple, Pushkar Lake Ghats",
    distance: "135 km from Jaipur",
    fare: "From ₹2,800 Roundtrip"
  },
  {
    id: "dest-ranthambore",
    name: "Ranthambore (Wild Tiger Safari)",
    image: "https://images.unsplash.com/photo-1581852013149-1449b2513f5c?auto=format&fit=crop&q=80&w=800",
    desc: "Thrill to the sight of wild Bengal tigers amongst historic fort ruins.",
    places: "Ranthambore National Park, Ranthambore Fort, Trinetra Ganesh Temple",
    distance: "160 km from Jaipur",
    fare: "From ₹4,500 Full Package"
  },
  {
    id: "dest-mountabu",
    name: "Mount Abu (Scenic Hill Retreat)",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800",
    desc: "The only green hill station in the rugged deserts of Rajasthan.",
    places: "Dilwara Jain Temples, Nakki Lake, Sunset Point, Guru Shikhar",
    distance: "490 km from Jaipur",
    fare: "From ₹8,900 Premium Tour"
  },
  {
    id: "dest-bikaner",
    name: "Bikaner (Desert Fort & Food)",
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&q=80&w=800",
    desc: "Discover colossal forts, camel breeding farms, and legendary desert spices.",
    places: "Junagarh Fort, Karni Mata Temple, Lalgarh Palace, Camel Research Centre",
    distance: "330 km from Jaipur",
    fare: "From ₹5,800 Family Deal"
  }
];

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<any[]>(DEFAULT_INDIAN_DESTINATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'destinations'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (items.length > 0) {
        setDestinations(items);
      } else {
        setDestinations(DEFAULT_INDIAN_DESTINATIONS);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error loading destinations:", err);
      setDestinations(DEFAULT_INDIAN_DESTINATIONS);
      setLoading(false);
    });
    return unsub;
  }, []);

  const css = `
  .DestinationSwiper {
    width: 100%;
    height: 580px;
    padding-bottom: 50px !important;
  }
  
  .DestinationSwiper .swiper-slide {
    background: transparent;
    width: 330px;
    height: auto;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
  }

  .DestinationSwiper .swiper-pagination-bullet-active {
    background-color: #f97316 !important;
  }

  .DestinationSwiper .swiper-pagination-bullet {
    background-color: #cbd5e1;
  }
  `;

  return (
    <section id="destinations" className="py-24 bg-white relative overflow-hidden">
      <style>{css}</style>
      
      {/* Dynamic background accents */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-orange-100 border border-orange-200 text-orange-700 font-extrabold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full mb-3 shadow-sm">
              <Sparkles size={11} className="text-orange-500 animate-pulse" /> Iconic Tourism Spots
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-semibold leading-relaxed mt-2">
              Explore the rich royal history and beautiful lakes with our comfortable and trusted outstation rentals.
            </p>
          </div>
          
          <button 
            onClick={() => {
              const element = document.getElementById('booking-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-orange-600 font-extrabold hover:text-orange-700 flex items-center gap-1.5 group cursor-pointer text-sm"
          >
            Check Out Packages 
            <Navigation2 size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel slide window */}
        {loading && destinations.length === 0 ? (
          <div className="py-24 text-center text-slate-400 font-bold text-sm">Loading destinations portal...</div>
        ) : (
          <div className="relative w-full max-w-5xl mx-auto px-4">
            
            <Swiper
              effect="creative"
              grabCursor={true}
              slidesPerView="auto"
              centeredSlides={true}
              spaceBetween={24}
              loop={destinations.length > 2}
              autoplay={{
                delay: 4200,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.dest-next',
                prevEl: '.dest-prev',
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
              className="DestinationSwiper"
            >
              {destinations.map((dest) => (
                <SwiperSlide key={dest.id}>
                  <div className="h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-400/80 transition-all flex flex-col justify-between shadow-xl">
                    <div>
                      {/* Image Frame featuring name / desc overlay */}
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-extrabold mb-1">{dest.name}</h3>
                          <p className="text-[11px] text-gray-300 font-medium leading-relaxed">{dest.desc}</p>
                        </div>
                      </div>

                      {/* Landmarks lists */}
                      <div className="p-5.5">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="text-orange-500 shrink-0 mt-0.5" size={16} />
                            <div>
                              <span className="font-extrabold block text-slate-900 text-xs mb-1">Key Attractions</span>
                              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                                {dest.places}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fare card footer and book button */}
                    <div className="p-5.5 pt-0">
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                        <div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Est. Tour Fare</p>
                          <p className="text-base font-black text-slate-900 leading-none mt-0.5">{dest.fare}</p>
                        </div>
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('select-destination', { detail: { name: dest.name, fare: dest.fare } }));
                            const element = document.getElementById('booking-section');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-slate-950 hover:bg-orange-500 text-white hover:text-slate-950 px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom navigation arrows */}
            <button className="dest-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[20px] md:-translate-x-[40px] z-20 w-11 h-11 bg-white hover:bg-orange-500 text-slate-900 hover:text-slate-950 border border-slate-200 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg">
              <ChevronLeft size={20} />
            </button>
            <button className="dest-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20px] md:translate-x-[40px] z-20 w-11 h-11 bg-white hover:bg-orange-500 text-slate-900 hover:text-slate-950 border border-slate-200 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg">
              <ChevronRight size={20} />
            </button>

          </div>
        )}

      </div>
    </section>
  );
}
