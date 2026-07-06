import React, { useState, useRef, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  MapPin, Clock, Users, CheckCircle2, XCircle, Car, ChevronDown,
  ChevronUp, Phone, Star, Camera, Landmark, Compass, Zap, Calendar
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TOUR PACKAGE DATA
══════════════════════════════════════════════════════════════════ */
interface FareTier { vehicle: string; icon: string; capacity: string; fare: string; perKm: string; highlight?: boolean; }
interface TourPackage {
  id: string;
  city: string;
  tagline: string;
  badge: string;
  color: string;
  accent: string;
  image: string;
  duration: string;
  distance: string;
  highlights: string[];
  itinerary: { time: string; place: string; desc: string }[];
  inclusions: string[];
  exclusions: string[];
  fares: FareTier[];
  rating: number;
  bookings: string;
}

const PACKAGES: TourPackage[] = [
  {
    id: 'jaipur',
    city: 'Jaipur',
    tagline: 'The Pink City — Royal Palaces & Forts',
    badge: 'Most Popular',
    color: '#f97316',
    accent: 'from-orange-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=90&w=1400',
    duration: '8 hrs',
    distance: '0 km (Local)',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    itinerary: [
      { time: '08:00 AM', place: 'Amber Fort', desc: 'Start your day at the magnificent 16th-century Amber Fort with its stunning elephant ride path and ornate palace interiors.' },
      { time: '10:30 AM', place: 'Hawa Mahal', desc: 'Visit the iconic Palace of Winds — 953 windows crafted for royal ladies to watch the city below without being seen.' },
      { time: '12:00 PM', place: 'City Palace', desc: 'Explore the royal family residence and museum housing rare weapons, textiles, and Rajput-Mughal artworks.' },
      { time: '02:00 PM', place: 'Jantar Mantar', desc: 'UNESCO World Heritage Site — the world\'s largest stone sundial and 19 astronomical instruments built in 1734.' },
      { time: '03:30 PM', place: 'Johri Bazaar', desc: 'Shop for Rajasthani gems, Kundan jewellery, and traditional handicrafts in the famous old market.' },
      { time: '05:00 PM', place: 'Nahargarh Fort', desc: 'Sunset viewpoint above the Pink City — panoramic view of all of Jaipur\'s skyline.' },
    ],
    inclusions: ['Dedicated air-conditioned cab', 'Experienced local driver-guide', 'All toll & parking charges', 'Bottled water onboard', '24×7 helpline support', 'GST included in fare'],
    exclusions: ['Entry tickets to forts & palaces', 'Elephant / horse ride charges', 'Meals & food expenses', 'Guide fees at monuments', 'Personal shopping expenses'],
    fares: [
      { vehicle: 'Hatchback', icon: '🚗', capacity: '4 Seater', fare: '₹1,499', perKm: '₹11/km', },
      { vehicle: 'Sedan (Swift Dzire)', icon: '🚙', capacity: '4 Seater', fare: '₹1,799', perKm: '₹13/km', highlight: true },
      { vehicle: 'SUV Crysta / Ertiga', icon: '🚐', capacity: '6–7 Seater', fare: '₹2,499', perKm: '₹18/km' },
    ],
    rating: 4.9,
    bookings: '1,200+',
  },
  {
    id: 'jodhpur',
    city: 'Jodhpur',
    tagline: 'The Blue City — Mehrangarh & Spice Markets',
    badge: 'Heritage Tour',
    color: '#3b82f6',
    accent: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1594132890528-97fcbbed921f?auto=format&fit=crop&q=90&w=1400',
    duration: '8 hrs',
    distance: '240 km from Kishangarh',
    highlights: ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan', 'Clock Tower'],
    itinerary: [
      { time: '08:30 AM', place: 'Mehrangarh Fort', desc: 'One of India\'s largest forts — 400 ft above the city with 7 gates, an ornate museum, and breathtaking city views.' },
      { time: '11:00 AM', place: 'Jaswant Thada', desc: 'Stunning white marble cenotaph with intricate jaali work — the Taj Mahal of Marwar, built in 1899.' },
      { time: '12:30 PM', place: 'Umaid Bhawan Palace', desc: 'One of the world\'s largest private residences — part museum, part luxury hotel, part royal home.' },
      { time: '02:30 PM', place: 'Ghanta Ghar (Clock Tower)', desc: 'The old city\'s landmark surrounded by the famous Sardar Market with spices, handicrafts, and street food.' },
      { time: '04:00 PM', place: 'Mandore Gardens', desc: 'Ancient royal cenotaphs amid lush gardens — lesser known but exceptionally beautiful.' },
      { time: '05:30 PM', place: 'Rao Jodha Desert Rock Park', desc: 'Unique ecological park at the fort\'s base — sunset views over the blue-painted old city.' },
    ],
    inclusions: ['Dedicated AC cab Kishangarh → Jodhpur → Kishangarh', 'Professional driver', 'All tolls & state taxes', 'Comfortable return journey', 'Water bottles', '24×7 customer support'],
    exclusions: ['Fort / museum entry tickets', 'Meals & refreshments', 'Guide fees', 'Personal expenses', 'Camel / horse rides'],
    fares: [
      { vehicle: 'Hatchback', icon: '🚗', capacity: '4 Seater', fare: '₹4,499', perKm: '₹11/km' },
      { vehicle: 'Sedan (Swift Dzire)', icon: '🚙', capacity: '4 Seater', fare: '₹5,299', perKm: '₹13/km', highlight: true },
      { vehicle: 'SUV Crysta / Ertiga', icon: '🚐', capacity: '6–7 Seater', fare: '₹7,499', perKm: '₹18/km' },
    ],
    rating: 4.8,
    bookings: '850+',
  },
  {
    id: 'udaipur',
    city: 'Udaipur',
    tagline: 'The City of Lakes — Venice of the East',
    badge: 'Romantic Pick',
    color: '#8b5cf6',
    accent: 'from-violet-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=90&w=1400',
    duration: '8 hrs',
    distance: '300 km from Kishangarh',
    highlights: ['City Palace', 'Lake Pichola', 'Jagdish Temple', 'Saheliyon Ki Bari'],
    itinerary: [
      { time: '08:00 AM', place: 'City Palace', desc: '400-year-old palace complex with stunning lake views — an architectural marvel of Rajput-Mughal-European design.' },
      { time: '10:30 AM', place: 'Lake Pichola Boat Ride', desc: 'Ride across the shimmering lake to the famous Jag Mandir and Jag Niwas (Lake Palace) — pure magic.' },
      { time: '12:30 PM', place: 'Jagdish Temple', desc: 'India\'s largest Vishnu temple with intricate sculptures — built in 1651, a masterpiece of Indo-Aryan architecture.' },
      { time: '02:00 PM', place: 'Saheliyon Ki Bari', desc: 'Garden of Maids of Honour — beautiful ornamental garden with marble elephants and lotus pools.' },
      { time: '03:30 PM', place: 'Shilpgram', desc: 'Rural arts and crafts village — live demonstrations of Rajasthan\'s traditional arts, dance, and crafts.' },
      { time: '05:30 PM', place: 'Fateh Sagar Lake', desc: 'Sunset boat ride on the serene Fateh Sagar Lake — don\'t miss the Nehru Island park in the middle.' },
    ],
    inclusions: ['AC cab Kishangarh → Udaipur → Kishangarh', 'Reliable professional driver', 'All state entry taxes & tolls', 'Mineral water', 'Night driving facility', '24×7 helpdesk'],
    exclusions: ['Entry tickets & boat ride charges', 'Meals & hotel stays', 'Guide charges at monuments', 'Personal expenses', 'Shopping'],
    fares: [
      { vehicle: 'Hatchback', icon: '🚗', capacity: '4 Seater', fare: '₹5,499', perKm: '₹11/km' },
      { vehicle: 'Sedan (Swift Dzire)', icon: '🚙', capacity: '4 Seater', fare: '₹6,499', perKm: '₹13/km', highlight: true },
      { vehicle: 'SUV Crysta / Ertiga', icon: '🚐', capacity: '6–7 Seater', fare: '₹9,199', perKm: '₹18/km' },
    ],
    rating: 4.9,
    bookings: '960+',
  },
  {
    id: 'jaisalmer',
    city: 'Jaisalmer',
    tagline: 'The Golden City — Desert & Dunes',
    badge: 'Adventure Tour',
    color: '#eab308',
    accent: 'from-yellow-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1504128117511-3be9cf8e5114?auto=format&fit=crop&q=90&w=1400',
    duration: '2 Days / 1 Night',
    distance: '565 km from Kishangarh',
    highlights: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli', 'Gadisar Lake'],
    itinerary: [
      { time: 'Day 1 — 09:00 AM', place: 'Jaisalmer Fort', desc: 'Living fort — one of only a few in the world. 99 bastions, four massive gates, and entire neighbourhoods inside.' },
      { time: 'Day 1 — 11:30 AM', place: 'Patwon Ki Haveli', desc: 'Cluster of 5 interconnected mansions with stunning golden sandstone jharokha carvings — built 1800–1860.' },
      { time: 'Day 1 — 01:00 PM', place: 'Gadisar Lake', desc: 'Rainwater conservation lake with ornate shrines and chhatris around the banks — ideal for photography.' },
      { time: 'Day 1 — 04:30 PM', place: 'Sam Sand Dunes', desc: 'Camel safari across the golden Thar Desert — watch the world\'s most spectacular desert sunset.' },
      { time: 'Day 1 — 08:00 PM', place: 'Desert Camp', desc: 'Rajasthani folk music & dinner under the stars at a traditional desert camp — an unforgettable night.' },
      { time: 'Day 2 — 08:00 AM', place: 'Kuldhara Village', desc: 'Abandoned ghost village — 200-year-old mystery of its overnight exodus. A hauntingly beautiful sight.' },
    ],
    inclusions: ['AC cab roundtrip Kishangarh ↔ Jaisalmer', 'Driver accommodation (Night 1)', 'All state taxes & tolls', 'Water bottles throughout', 'Flexible pickup time', '24×7 support'],
    exclusions: ['Desert camp booking & camel ride', 'Hotel stays & meals', 'Fort & monument entries', 'Jeep safari charges', 'Personal expenses'],
    fares: [
      { vehicle: 'Hatchback', icon: '🚗', capacity: '4 Seater', fare: '₹9,999', perKm: '₹11/km' },
      { vehicle: 'Sedan (Swift Dzire)', icon: '🚙', capacity: '4 Seater', fare: '₹11,999', perKm: '₹13/km', highlight: true },
      { vehicle: 'SUV Crysta / Ertiga', icon: '🚐', capacity: '6–7 Seater', fare: '₹16,999', perKm: '₹18/km' },
    ],
    rating: 4.8,
    bookings: '620+',
  },
];

/* ══════════════════════════════════════════════════════════════════
   PACKAGE CARD
══════════════════════════════════════════════════════════════════ */
const PackageCard = memo(function PackageCard({ pkg, index }: { pkg: TourPackage; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'itinerary' | 'inclusions' | 'fares'>('itinerary');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleBook = () => {
    window.dispatchEvent(new CustomEvent('select-destination', {
      detail: { name: pkg.city, fare: pkg.fares[1].fare }
    }));
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden border shadow-xl flex flex-col"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.08)'
      }}
    >
      {/* ── Hero Image ── */}
      <div className="relative h-52 sm:h-60 overflow-hidden shrink-0">
        <img
          src={pkg.image}
          alt={pkg.city}
          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full bg-gradient-to-r ${pkg.accent} shadow-md`}>
          {pkg.badge}
        </span>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          {pkg.rating} · {pkg.bookings} trips
        </div>

        {/* City name & tagline */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {pkg.highlights.map(h => (
              <span key={h} className="text-[9px] font-bold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                {h}
              </span>
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow">
            {pkg.city} Sightseeing
          </h3>
          <p className="text-xs text-white/75 font-semibold mt-0.5 leading-relaxed">{pkg.tagline}</p>
        </div>
      </div>

      {/* ── Quick Info Strip ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b text-xs font-bold" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <Clock size={13} style={{ color: pkg.color }} />
          {pkg.duration}
        </div>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <MapPin size={13} style={{ color: pkg.color }} />
          {pkg.distance}
        </div>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <Users size={13} style={{ color: pkg.color }} />
          Up to 7 pax
        </div>
      </div>

      {/* ── Price summary row ── */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Starting From</p>
          <p className="text-2xl font-black" style={{ color: pkg.color }}>{pkg.fares[0].fare}</p>
          <p className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Hatchback · Incl. all taxes</p>
        </div>
        <div className="flex gap-2">
          <a
            href="tel:9950072777"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-colors hover:border-orange-400 hover:text-orange-500 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Phone size={13} /> Call
          </a>
          <button
            onClick={handleBook}
            className={`px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${pkg.accent} shadow-md hover:shadow-lg hover:opacity-90 transition-all cursor-pointer`}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ── Expand/Collapse ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="mx-4 mb-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider py-2.5 rounded-xl border transition-all cursor-pointer hover:opacity-80"
        style={{
          color: pkg.color,
          borderColor: `${pkg.color}30`,
          backgroundColor: `${pkg.color}08`
        }}
      >
        {expanded ? (
          <><ChevronUp size={14} /> Hide Details</>
        ) : (
          <><ChevronDown size={14} /> View Full Itinerary & Pricing</>
        )}
      </button>

      {/* ── Expanded Content ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Tab switcher */}
            <div className="flex border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
              {(['itinerary', 'inclusions', 'fares'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  style={{
                    color: tab === t ? pkg.color : 'var(--text-secondary)',
                    borderBottom: tab === t ? `2px solid ${pkg.color}` : '2px solid transparent',
                    backgroundColor: tab === t ? `${pkg.color}08` : 'transparent',
                  }}
                >
                  {t === 'itinerary' ? '📍 Itinerary' : t === 'inclusions' ? '✅ What\'s Included' : '💰 Pricing'}
                </button>
              ))}
            </div>

            <div className="px-4 pb-4 pt-3">
              {/* ── Itinerary Tab ── */}
              {tab === 'itinerary' && (
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div
                    className="absolute left-[22px] top-4 bottom-4 w-[2px]"
                    style={{ backgroundColor: `${pkg.color}25` }}
                  />
                  <div className="space-y-4">
                    {pkg.itinerary.map((stop, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 items-start"
                      >
                        {/* Timeline dot */}
                        <div
                          className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md z-10"
                          style={{ backgroundColor: pkg.color }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>
                              {stop.place}
                            </span>
                            <span className="text-[9px] font-bold text-white/90 px-2 py-0.5 rounded-full" style={{ backgroundColor: pkg.color }}>
                              {stop.time}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {stop.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Inclusions / Exclusions Tab ── */}
              {tab === 'inclusions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2.5">✅ Included</p>
                    <div className="space-y-2">
                      {pkg.inclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2.5">❌ Not Included</p>
                    <div className="space-y-2">
                      {pkg.exclusions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Fares Tab ── */}
              {tab === 'fares' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Roundtrip · All taxes included · Kishangarh pickup
                  </p>
                  {pkg.fares.map((fare, i) => (
                    <div
                      key={i}
                      className="relative flex items-center justify-between p-3.5 rounded-2xl border transition-all"
                      style={{
                        borderColor: fare.highlight ? pkg.color : 'var(--border-color)',
                        backgroundColor: fare.highlight ? `${pkg.color}08` : 'var(--bg-secondary)',
                        boxShadow: fare.highlight ? `0 0 0 1px ${pkg.color}30` : 'none'
                      }}
                    >
                      {fare.highlight && (
                        <span className="absolute -top-2.5 left-3 text-[9px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: pkg.color }}>
                          Most Booked
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{fare.icon}</span>
                        <div>
                          <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{fare.vehicle}</p>
                          <p className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{fare.capacity} · {fare.perKm}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black" style={{ color: pkg.color }}>{fare.fare}</p>
                        <button
                          onClick={handleBook}
                          className="text-[9px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full mt-1 cursor-pointer"
                          style={{ backgroundColor: pkg.color }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>💡 Note:</strong> Prices are for roundtrip from Kishangarh. One-way fares available on request. Extra km charged at per-km rate after package limit.
                  </div>
                </div>
              )}
            </div>

            {/* Final CTA */}
            <div className="mx-4 mb-4 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ backgroundColor: `${pkg.color}10`, border: `1px solid ${pkg.color}25` }}
            >
              <div>
                <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>Ready to explore {pkg.city}?</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>Book your cab in 60 seconds — no advance payment needed</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="https://wa.me/919950072777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
                >
                  💬 WhatsApp
                </a>
                <button
                  onClick={handleBook}
                  className={`px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${pkg.accent} shadow-md hover:opacity-90 transition-opacity cursor-pointer`}
                >
                  Book Online →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════════════════ */
export default function TourPackages() {
  const [activeCity, setActiveCity] = useState<string>('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(sectionRef, { once: true });

  const filtered = activeCity === 'all' ? PACKAGES : PACKAGES.filter(p => p.id === activeCity);

  return (
    <section
      id="tour-packages"
      ref={sectionRef}
      className="w-full py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, #f9731620 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #8b5cf620 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-5">
            <Compass size={12} /> Curated Rajasthan Tours
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Tour Packages for
            <br />
            <span className="text-orange-500">Every Traveler</span>
          </h2>
          <p className="text-sm sm:text-base font-semibold max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Complete sightseeing packages from Kishangarh — comfortable cabs, experienced drivers, transparent pricing. No hidden charges, ever.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: <CheckCircle2 size={14} />, label: 'No Hidden Charges' },
              { icon: <Zap size={14} />, label: 'Instant Booking' },
              { icon: <Car size={14} />, label: 'AC Vehicles' },
              { icon: <Calendar size={14} />, label: 'No Advance Payment' },
            ].map(b => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border"
                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
              >
                <span className="text-orange-500">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── City Filter Tabs ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'all', label: '🗺️ All Cities' },
            { id: 'jaipur', label: '🏯 Jaipur' },
            { id: 'jodhpur', label: '🔵 Jodhpur' },
            { id: 'udaipur', label: '🏰 Udaipur' },
            { id: 'jaisalmer', label: '🏜️ Jaisalmer' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveCity(f.id)}
              className="px-4 py-2 rounded-full text-xs font-black border transition-all cursor-pointer"
              style={{
                color: activeCity === f.id ? '#fff' : 'var(--text-secondary)',
                borderColor: activeCity === f.id ? '#f97316' : 'var(--border-color)',
                backgroundColor: activeCity === f.id ? '#f97316' : 'var(--bg-secondary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Package Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCity}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {filtered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Background glow */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
          <div className="absolute left-0 bottom-0 w-60 h-60 rounded-full blur-[80px] opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />

          <div className="relative z-10 text-center sm:text-left">
            <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-2">Custom Packages Also Available</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Need a Custom Rajasthan Tour?</h3>
            <p className="text-sm text-slate-400 font-semibold mt-2 max-w-md">
              Multi-city Golden Triangle, Pilgrimage circuits, Wedding convoys, Corporate travel — we handle everything.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
            <a
              href="tel:9950072777"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-black text-sm hover:bg-white/15 transition-colors cursor-pointer"
            >
              <Phone size={16} /> 9950072777
            </a>
            <a
              href="https://wa.me/919950072777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-sm transition-colors cursor-pointer"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
