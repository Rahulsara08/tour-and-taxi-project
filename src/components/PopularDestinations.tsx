import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation2, X, Compass, Car, DollarSign, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import gsap from 'gsap';

// Import local images directly from the assets folder
import jaipurImage from '../../assets/dest_jaipur_hawa_fog.png';
import jodhpurImage from '../../assets/dest_jodhpur_fort_blue.jpg';
import udaipurLakesImage from '../../assets/dest_udaipur_pavilions.jpg';
import jaisalmerImage from '../../assets/dest_jaisalmer_haveli_gadsisar.jpg';
import ranthamboreImage from '../../assets/dest_ranthambore_tiger.png';

// New imported images that the user sent
import ajmerImage from '../../assets/dest_ajmer.png';
import mountAbuImage from '../../assets/dest_mountabu.png';
import bikanerImage from '../../assets/dest_bikaner.png';

interface Hotspot {
  name: string;
  desc: string;
}

interface FareDetail {
  name: string;
  rate: string;
  base: string;
  total: string;
  calc: string;
}

interface Destination {
  id: string;
  name: string;
  image: string;
  tagline: string;
  desc: string;
  places: string;
  distance: string;
  baseFare: string;
  isLocal: boolean;
  distanceKm: number;
  about: string;
  hotspots: Hotspot[];
  fares: {
    hatchback: FareDetail;
    sedan: FareDetail;
    suv: FareDetail;
  };
}

const CURATED_DESTINATIONS: Destination[] = [
  {
    id: "dest-jaipur",
    name: "Jaipur",
    image: jaipurImage,
    tagline: "The Pink City. Honeycomb windows at Hawa Mahal, bazaars stitched from block-print cotton, and the taxi rank where every route starts.",
    desc: "Honeycomb windows at Hawa Mahal, bazaars stitched from block-print cotton, and local sightseeing.",
    places: "Hawa Mahal, Amer Fort, City Palace, Jal Mahal, Chokhi Dhani",
    distance: "KM 000",
    baseFare: "From ₹1,800/Day",
    isLocal: true,
    distanceKm: 0,
    about: "Jaipur, the capital of Rajasthan, is a marvelous blend of royal history, culture, and architecture. Known as the Pink City, it features majestic hill forts, sprawling palaces, and vibrant bazaars full of heritage crafts.",
    hotspots: [
      { name: "Hawa Mahal", desc: "The Palace of Winds, a five-story pyramidal shaped monument with 953 small windows." },
      { name: "Amer Fort", desc: "Majestic hilltop fort known for its artistic style elements, overlooks Maota Lake." },
      { name: "City Palace", desc: "A royal residence showing an exquisite fusion of Rajasthani and Mughal architecture." },
      { name: "Chokhi Dhani", desc: "An ethnic village resort offering traditional Rajasthani culture, dances, and cuisine." },
      { name: "Jantar Mantar", desc: "A UNESCO heritage astronomical observatory featuring the world's largest stone sundial." },
      { name: "Jal Mahal", desc: "The gorgeous palace situated in the middle of Man Sagar Lake." },
      { name: "Albert Hall Museum", desc: "The oldest museum in the state, exhibiting royal artefacts and heritage weaponry." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹1,800", calc: "8 hrs / 80km package rate" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹2,100", calc: "8 hrs / 80km package rate" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹3,500", calc: "8 hrs / 80km package rate" }
    }
  },
  {
    id: "dest-ranthambore",
    name: "Ranthambore",
    image: ranthamboreImage,
    tagline: "Where the road ends and the jeep tracks begin. Ruined hunting lodges, dry forest, and a tiger crossing the trail ahead.",
    desc: "Dry forest jungle, historic hill fort, Ganesh temple, and Bengal tiger safaris.",
    places: "Ranthambore Fort, Wildlife Jungle Safari, Trinetra Ganesh Temple, Padam Talao",
    distance: "KM 190",
    baseFare: "₹4,180 Roundtrip",
    isLocal: false,
    distanceKm: 190,
    about: "Ranthambore National Park is one of the biggest and most renowned national parks in Northern India. Located in the Karauli and Sawai Madhopur districts, it was once a famous royal hunting ground, and remains a prime spot for viewing Bengal tigers in their natural habitat.",
    hotspots: [
      { name: "Ranthambore Fort", desc: "A UNESCO World Heritage site standing majestically atop a hill overlooking the national park." },
      { name: "Wildlife Jungle Safari", desc: "Open jeep safaris through the dry forest zones to spot majestic tigers, leopards, and crocodiles." },
      { name: "Trinetra Ganesh Temple", desc: "One of the oldest and most famous temples in Rajasthan, housing a three-eyed idol of Lord Ganesha." },
      { name: "Padam Talao", desc: "The largest of the lakes in the park, featuring the beautiful red sandstone Jogi Mahal on its shore." },
      { name: "Raj Bagh Ruins", desc: "Ancient stone ruins of palaces and arches situated along the lake shore." },
      { name: "Kachida Valley", desc: "A scenic valley characterized by rugged hills, populated by leopards and panthers." },
      { name: "Jogi Mahal", desc: "The iconic red sandstone hunting lodge standing beside Padam Talao, housing an ancient banyan tree." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹4,180", calc: "₹999 Base + (380 km * ₹11/km)" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹5,760", calc: "₹1,200 Base + (380 km * 12 * ₹12/km)" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹9,640", calc: "₹2,800 Base + (380 km * 18 * ₹18/km)" }
    }
  },
  {
    id: "dest-ajmer",
    name: "Ajmer",
    image: ajmerImage,
    tagline: "The Sanctum of Peace. Home of the venerable Khwaja Gharib Nawaz Dargah and scenic Ana Sagar Lake.",
    desc: "Sufi shrine of Dargah Sharif, historic Taragarh fort, and Ana Sagar lake boat cruises.",
    places: "Ajmer Sharif Dargah, Ana Sagar Lake, Adhai Din Ka Jhopra, Taragarh Fort",
    distance: "KM 135",
    baseFare: "₹3,969 Roundtrip",
    isLocal: false,
    distanceKm: 135,
    about: "Ajmer is a historic city surrounded by the Aravalli mountains. It is a major pilgrimage center, housing the famous shrine of Sufi Saint Khwaja Moinuddin Chishti, which welcomes millions of devotees of all faiths.",
    hotspots: [
      { name: "Ajmer Sharif Dargah", desc: "The holy shrine of Sufi saint Moinuddin Chishti, famous for its divine blessings and qawwalis." },
      { name: "Ana Sagar Lake", desc: "A scenic artificial lake built in 1135 AD, featuring beautiful marble pavilions (Baradari)." },
      { name: "Adhai Din Ka Jhopra", desc: "An extraordinary ruined ancient mosque displaying a fusion of early Indo-Islamic architecture." },
      { name: "Taragarh Fort", desc: "One of the oldest hill forts in India, offering spectacular views of the Ajmer city skyline." },
      { name: "Nareli Jain Temple", desc: "A modern marble temple showing beautiful architecture and structural pillars." },
      { name: "Akbar's Palace & Museum", desc: "A strong fortress housing royal historical weapons and ancient stone carvings." },
      { name: "Foy Sagar Lake", desc: "A serene lake constructed in 1892 as a famine relief project, perfect for birdwatching." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹3,969", calc: "₹999 Base + (270 km * ₹11/km)" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹4,440", calc: "₹1,200 Base + (270 km * 12 * ₹12/km)" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹7,660", calc: "₹2,800 Base + (270 km * 18 * ₹18/km)" }
    }
  },
  {
    id: "dest-bikaner",
    name: "Bikaner",
    image: bikanerImage,
    tagline: "Red Sandstone Fortresses. Desert arts, unconquered fortresses, and world-famous heritage crafts.",
    desc: "Junagarh Fort palaces, desert safaris, Camel Research center, and rat temple.",
    places: "Junagarh Fort, Karni Mata Temple, Lalgarh Palace, Camel Research Center",
    distance: "KM 335",
    baseFare: "₹8,369 Roundtrip",
    isLocal: false,
    distanceKm: 335,
    about: "Bikaner is a vibrant desert city surrounded by the Thar Desert. Known for its imposing red sandstone palaces, authentic desert arts, and delicious Bikaneri bhujia, it offers a rich royal experience away from main tourist crowds.",
    hotspots: [
      { name: "Junagarh Fort", desc: "An unconquered fort built in 1589, boasting ornate courtyards, gold leaf artwork, and historic weaponry." },
      { name: "Karni Mata Temple", desc: "The world-famous 'Rat Temple' in Deshnoke, where over 25,000 black rats are worshiped as holy deities." },
      { name: "Lalgarh Palace", desc: "A magnificent royal palace displaying a mixture of Rajput, Mughal, and European design styles." },
      { name: "National Research Center on Camels", desc: "A unique camel breeding farm where you can taste delicious fresh camel milk ice cream." },
      { name: "Gajner Palace & Wildlife Lake", desc: "A lakeside heritage hunting lodge palace hotel surrounded by wildlife forests." },
      { name: "Bhandasar Jain Temple", desc: "A historic 15th-century temple famous for yellow stone carvings." },
      { name: "Rampuria Havelis", desc: "Gorgeously carved red sandstone townhouses exhibiting intricate wooden doors." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹8,369", calc: "₹999 Base + (670 km * ₹11/km)" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹9,240", calc: "₹1,200 Base + (670 km * 12 * ₹12/km)" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹14,860", calc: "₹2,800 Base + (670 km * 18 * ₹18/km)" }
    }
  },
  {
    id: "dest-jodhpur",
    name: "Jodhpur",
    image: jodhpurImage,
    tagline: "The Blue City, seen properly only from above Mehrangarh Fort — the streets below arranged like they were dyed on purpose, which, mostly, they were.",
    desc: "Blue-colored houses, Mehrangarh fort, royal cenotaphs, and zip line adventures.",
    places: "Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace, Mandore Gardens",
    distance: "KM 330",
    baseFare: "₹8,259 Roundtrip",
    isLocal: false,
    distanceKm: 330,
    about: "Jodhpur, the second-largest city in Rajasthan, is dominated by the majestic Mehrangarh Fort. The old city is a mesmerizing labyrinth of indigo-colored houses stretching as far as the eye can see, giving it the name 'The Blue City'.",
    hotspots: [
      { name: "Mehrangarh Fort", desc: "One of the largest forts in India, built around 1459, standing 410 feet above the skyline." },
      { name: "Jaswant Thada", desc: "A cenotaph built of intricately carved sheets of white marble, serving as a crematorium for royals." },
      { name: "Umaid Bhawan Palace", desc: "One of the world's largest private residences, part of which is managed by Taj Hotels." },
      { name: "Mandore Gardens", desc: "Featuring high rock terraces, cenotaphs resembling temples, and lush green lawns." },
      { name: "Toorji Ka Jhalra", desc: "An ancient, beautifully designed stepped stepwell showing classic stone carving." },
      { name: "Kaylana Lake", desc: "A scenic artificial lake offering excellent boating and sunset viewing spots." },
      { name: "Bao Jiraj Stepwell", desc: "A gorgeous hidden stepwell featuring classic Rajasthani structural stone steps." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹8,259", calc: "₹999 Base + (660 km * ₹11/km)" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹9,120", calc: "₹1,200 Base + (660 km * 12 * ₹12/km)" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹14,680", calc: "₹2,800 Base + (660 km * 18 * ₹18/km)" }
    }
  },
  {
    id: "dest-udaipur",
    name: "Udaipur",
    image: udaipurLakesImage,
    tagline: "City of Lakes. Marble palaces that double themselves in the water, which is either very romantic or very convenient for photographs. Both, honestly.",
    desc: "Romantic boat cruises, floating pavilions, City Palace, and Saheliyon-ki-Bari.",
    places: "City Palace, Lake Pichola, Jag Mandir Palace, Saheliyon-ki-Bari",
    distance: "KM 395",
    baseFare: "₹9,689 Roundtrip",
    isLocal: false,
    distanceKm: 395,
    about: "Udaipur, the romantic 'City of Lakes', is famous for its blue water lakes, majestic white marble palaces, and beautiful historic gardens. It offers a majestic blend of architectural wonders and scenic boat cruises.",
    hotspots: [
      { name: "Udaipur City Palace", desc: "A monumental palace complex built over 400 years on the east bank of Lake Pichola." },
      { name: "Lake Pichola & Boat Cruises", desc: "An artificial fresh water lake created in 1362, home to Lake Palace and Jag Mandir." },
      { name: "Jag Mandir", desc: "A gorgeous lake garden palace built on an island in Lake Pichola, noted for its marble elephant sculptures." },
      { name: "Saheliyon-ki-Bari", desc: "A historic garden featuring marble fountains, lotus pools, and pavilions built for royal maidens." },
      { name: "Monsoon Palace (Sajjangarh)", desc: "A hilltop palace offering panoramic sunset views of the lakes and Udaipur city." },
      { name: "Jagdish Temple", desc: "A large Hindu temple displaying classic Indo-Aryan architectural details." },
      { name: "Fateh Sagar Lake", desc: "A scenic lake hosting Nehru Park island and astronomical observatories." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹9,689", calc: "₹999 Base + (790 km * ₹11/km)" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹10,680", calc: "₹1,200 Base + (790 km * 12 * ₹12/km)" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹17,020", calc: "₹2,800 Base + (790 km * 18 * ₹18/km)" }
    }
  },
  {
    id: "dest-mountabu",
    name: "Mount Abu",
    image: mountAbuImage,
    tagline: "Mist-Covered Peaks & Ancient Dilwara Temples. Cooler breezes and boating on the high Nakki lake.",
    desc: "Cool climate hill station, Nakki Lake boating, and Dilwara marble carvings.",
    places: "Dilwara Temples, Nakki Lake, Guru Shikhar, Sunset Point",
    distance: "KM 490",
    baseFare: "₹11,779 Roundtrip",
    isLocal: false,
    distanceKm: 490,
    about: "Mount Abu is the sole hill station in the desert state of Rajasthan. Set on a high rocky plateau in the Aravalli range and surrounded by forest, it offers a cool climate, beautiful lake vistas, and some of the world's most intricate marble temples.",
    hotspots: [
      { name: "Dilwara Jain Temples", desc: "A group of Jain temples dating back to the 11th century, world-famous for incredible marble carvings." },
      { name: "Nakki Lake", desc: "A serene lake where you can enjoy boating, surrounded by unique rock formations." },
      { name: "Guru Shikhar Peak", desc: "The highest peak of the Aravalli range (1,722m), offering panoramic views of the hills." },
      { name: "Sunset Point", desc: "A popular spot providing a spectacular view of the sun setting behind the green Aravalli hills." },
      { name: "Achalgarh Fort", desc: "Fort ruins built by Paramara dynasty rulers, featuring historic temples." },
      { name: "Toad Rock", desc: "A massive rock formation overlooking the lake, resembling a giant toad." },
      { name: "Trevor's Tank", desc: "A wildlife park home to crocodiles, forest birds, and nature paths." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹11,779", calc: "₹999 Base + (980 km * 11 * '₹11/km')" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹12,960", calc: "₹1,200 Base + (980 km * 12 * '₹12/km')" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹20,440", calc: "₹2,800 Base + (980 km * 18 * '₹18/km')" }
    }
  },
  {
    id: "dest-jaisalmer",
    name: "Jaisalmer",
    image: jaisalmerImage,
    tagline: "The last fort before the Thar Desert takes over. Golden sandstone by day, a sky full of more stars than seems reasonable by night.",
    desc: "Living sandstone fort, camel desert dunes, heritage havelis, and star camping.",
    places: "Jaisalmer Fort, Sam Sand Dunes, Patwon Ki Haveli, Gadisar Lake",
    distance: "KM 570",
    baseFare: "₹13,539 Roundtrip",
    isLocal: false,
    distanceKm: 570,
    about: "Jaisalmer, known as 'The Golden City', stands in the heart of the Thar Desert. Its yellow sandstone architecture glows like gold under the sun. The city is famous for its living fort, stunning heritage Havelis, and mesmerizing sand dunes.",
    hotspots: [
      { name: "Jaisalmer living Fort", desc: "A massive UNESCO World Heritage living fort where a quarter of the city's population still resides." },
      { name: "Sam Sand Dunes", desc: "Desert dunes perfect for camel rides, jeep safaris, and overnight luxury camps under the stars." },
      { name: "Patwon Ki Haveli", desc: "A cluster of five grand havelis featuring intricate carvings and golden sandstone balconies." },
      { name: "Gadisar Lake", desc: "A historic rainwater reservoir surrounded by shrines, temples, and arches, ideal for boating." },
      { name: "Bada Bagh Cenotaphs", desc: "Royal cenotaphs overlooking the desert landscape, offering beautiful sunset photography." },
      { name: "Kuldhara Ghost Village", desc: "A mysterious abandoned village near Jaisalmer, said to be cursed and haunted." },
      { name: "Thar Heritage Museum", desc: "A private museum showcasing historical fossils, folk art, and traditional desert tools." }
    ],
    fares: {
      hatchback: { name: "Hatchback Comfort", rate: "₹11/km", base: "₹999", total: "₹13,539", calc: "₹999 Base + (1140 km * 11 * '₹11/km')" },
      sedan: { name: "Compact Sedan", rate: "₹12/km", base: "₹1,200", total: "₹14,880", calc: "₹1,200 Base + (1140 km * 12 * '₹12/km')" },
      suv: { name: "Premium SUV Crysta", rate: "₹18/km", base: "₹2,800", total: "₹23,320", calc: "₹2,800 Base + (1140 km * 18 * '₹18/km')" }
    }
  }
];

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>(CURATED_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const railProgressRef = useRef<HTMLDivElement>(null);
  const railTaxiRef = useRef<SVGSVGElement>(null);
  const stopsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selectedDest) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDest]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'destinations'), (snap) => {
      const items = [...CURATED_DESTINATIONS];
      
      snap.docs.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        
        // Find matching curated item by ID or name
        const idx = items.findIndex(c => c.id === id || c.name.toLowerCase() === (data.name || '').toLowerCase());
        if (idx !== -1) {
          // Only update baseFare if it exists in DB, do NOT override name, tagline, or about!
          if (data.baseFare) {
            items[idx] = {
              ...items[idx],
              baseFare: data.baseFare
            };
          }
        }
      });
      setDestinations(items);
      setLoading(false);
    }, (err) => {
      console.error("Error loading destinations from Firestore:", err);
      setDestinations(CURATED_DESTINATIONS);
      setLoading(false);
    });
    return unsub;
  }, []);

  // GSAP Scroll Itinerary Stacking Animation
  useEffect(() => {
    if (destinations.length === 0 || loading) return;

    let ctx: gsap.Context;

    // Use a delayed safe constructor to guarantee React finished hydration and DOM calculations
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);

          const cardElements = cardsRef.current.filter(Boolean);
          const stopElements = stopsRef.current.filter(Boolean);
          const taxi = railTaxiRef.current;
          const progressLine = railProgressRef.current;
          const total = cardElements.length;
          if (total === 0) return;

          gsap.killTweensOf(cardElements);
          
          // Stacking zIndex setup: Stop 01 (Jaipur) gets the highest zIndex so it is in front!
          gsap.set(cardElements, {
            yPercent: (i) => i === 0 ? 0 : 6,
            scale: (i) => 1 - Math.min(i, 3) * 0.045,
            rotate: (i) => i === 0 ? 0 : (i % 2 === 0 ? 2.5 : -2.5) * Math.min(i, 1),
            transformOrigin: '50% 100%',
            zIndex: (i) => total - i
          });

          const railEl = document.querySelector('.rail') as HTMLDivElement;
          const railHeight = railEl ? railEl.offsetHeight : 0;

          const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${total * 100}%`,
            pin: true,
            scrub: 0.6,
            pinSpacing: true,
            onUpdate: (self) => {
              const progress = self.progress * total; // 0..total
              const activeIndex = Math.min(total - 1, Math.floor(progress));

              cardElements.forEach((card, i) => {
                const local = progress - i;
                if (local <= 0) {
                  const depth = Math.min(-local, 3);
                  // Only show the active card (depth=0) and the next card in the stack (depth=1).
                  // Hide any card deeper in the stack (depth > 1) to prevent any overlapping text or images!
                  const isStackVisible = i === activeIndex || i === activeIndex + 1;

                  gsap.set(card, {
                    y: depth * 22,
                    scale: 1 - Math.min(depth, 3) * 0.045,
                    rotate: 0,
                    opacity: isStackVisible ? 1 : 0,
                    pointerEvents: i === activeIndex ? 'auto' : 'none'
                  });
                } else if (local >= 1) {
                  gsap.set(card, { opacity: 0, pointerEvents: 'none' });
                } else {
                  const ease = local;
                  gsap.set(card, {
                    y: -ease * 260,
                    x: (i % 2 === 0 ? 1 : -1) * ease * 90,
                    rotate: (i % 2 === 0 ? 1 : -1) * ease * 14,
                    scale: 1 - ease * 0.08,
                    opacity: 1 - ease,
                    pointerEvents: i === activeIndex ? 'auto' : 'none'
                  });
                }
              });

              const pct = Math.min(1, self.progress);
              if (progressLine) progressLine.style.height = (pct * 100) + '%';
              if (taxi) taxi.style.transform = `translateY(${pct * (railHeight - 40)}px)`;

              stopElements.forEach((s, i) => {
                if (i === activeIndex) {
                  s.classList.add('active');
                } else {
                  s.classList.remove('active');
                }
              });
            }
          });

          // Refresh ScrollTrigger to align coords
          ScrollTrigger.refresh();
        });
      }, containerRef);
    }, 600); // Safe delay to wait until the DOM layout settles completely

    return () => {
      clearTimeout(initTimer);
      if (ctx) ctx.revert();
    };
  }, [destinations, loading]);

  return (
    <section id="destinations" className="relative overflow-hidden select-none" style={{ backgroundColor: 'var(--void)' }}>
      <style>{`
        :root {
          --void: #0f1115;
          --panel: #171b23;
          --panel-2: #1e232d;
          --marigold: #f5a623;
          --maroon: #9a3341;
          --teal: #1f6e73;
          --sand: #d8c39d;
          --ivory: #f3efe6;
          --ivory-dim: rgba(243,239,230,0.62);
          --hairline: rgba(243,239,230,0.14);
        }

        .route-section {
          position: relative;
          background: var(--void);
        }
        .stage {
          height: 100vh;
          display: grid;
          grid-template-columns: 220px 1fr;
          align-items: center;
          padding: 0 8vw;
          gap: 6vw;
          overflow: hidden;
        }

        /* Left rail: the highway */
        .rail {
          position: relative;
          height: 72vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .rail-line {
          position: absolute;
          left: 19px; top: 0; bottom: 0;
          width: 2px;
          background-image: linear-gradient(var(--hairline) 60%, transparent 0%);
          background-size: 2px 14px;
          background-repeat: repeat-y;
        }
        .rail-progress {
          position: absolute;
          left: 19px; top: 0;
          width: 2px; height: 0%;
          background: linear-gradient(var(--marigold), var(--teal));
        }
        .rail-taxi {
          position: absolute;
          left: 0; top: 0;
          width: 40px; height: 40px;
          transform: translateY(0);
          filter: drop-shadow(0 4px 10px rgba(245,166,35,0.35));
        }
        .rail-stop {
          position: relative;
          padding-left: 52px;
          min-height: 1px;
        }
        .rail-stop .dot {
          position: absolute; left: 12px; top: 2px;
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid var(--hairline);
          background: var(--void);
          transition: border-color .3s ease, background .3s ease;
        }
        .rail-stop.active .dot {
          border-color: var(--marigold);
          background: var(--marigold);
          box-shadow: 0 0 0 5px rgba(245,166,35,0.15);
        }
        .rail-stop .km {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--ivory-dim);
          display: block;
        }
        .rail-stop .name {
          font-family: 'Fraunces', serif;
          font-size: 15px;
          color: var(--ivory-dim);
          transition: color .3s ease;
        }
        .rail-stop.active .name { color: var(--ivory); }

        /* Card viewport */
        .card-viewport {
          position: relative;
          height: 74vh;
          max-height: 640px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card {
          position: absolute;
          width: min(78vw, 560px);
          aspect-ratio: 4/5;
          max-height: 100%;
          border-radius: 18px;
          background-color: #171b23 !important;
          border: 1px solid var(--hairline);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 34px 34px 30px;
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
          will-change: transform, opacity;
        }
        .card-top, .card-bottom { position: relative; z-index: 1; }
        .card-stop {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .card-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          margin: 10px 0 8px;
        }
        .card-tagline {
          font-size: 14px;
          color: var(--ivory-dim);
          max-width: 34ch;
          line-height: 1.5;
        }
        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid var(--hairline);
          padding-top: 16px;
        }
        .card-meta {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--ivory-dim);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .card-meta span { display: block; color: var(--ivory); font-size: 13px; margin-top: 2px; letter-spacing: 0; text-transform: none; font-family: 'Work Sans', sans-serif; }
        .card-icon { width: 46px; height: 46px; opacity: 0.9; }

        @media (max-width: 860px) {
          .stage { grid-template-columns: 1fr; gap: 4vh; padding: 0 6vw; }
          .rail { display: none; }
          .card-viewport { height: 64vh; }
          .card { width: min(86vw, 460px); padding: 26px 26px 22px; }
        }
      `}</style>

      {/* Intro section */}
      <section className="intro select-none relative flex flex-col justify-center min-h-[100vh] py-16 px-6 md:px-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-sky-500/5 to-transparent pointer-events-none" />
        <div className="eyebrow flex items-center gap-2.5 text-xs font-bold text-orange-400 uppercase tracking-widest">
          A road-trip itinerary, in eight stops
        </div>
        <h1 className="font-serif font-light text-4xl sm:text-6xl md:text-8xl leading-tight mt-6 mb-4 max-w-xl text-white">
          The desert doesn't <em>rush</em>.<br />Neither should the route.
        </h1>
        <p className="max-w-[46ch] text-slate-400 text-sm md:text-base leading-relaxed mt-2">
          Explore the ultimate Rajasthani road trip. Eight heritage stops, one highway. Scroll to follow the route — each stop stacking onto the last, with direct taxi booking at every stop.
        </p>
        <div className="scroll-cue mt-12 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <svg className="animate-bounce" width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 1V19M7 19L1 13M7 19L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Scroll to begin
        </div>
      </section>

      {/* Route section */}
      {loading && destinations.length === 0 ? (
        <div className="py-24 text-center text-slate-400 font-bold text-sm">
          Loading destinations...
        </div>
      ) : (
        <section className="route-section relative">
          <div ref={containerRef} className="stage">
            <div className="rail">
              <div className="rail-line" />
              <div ref={railProgressRef} className="rail-progress" />
              <svg ref={railTaxiRef} className="rail-taxi" viewBox="0 0 40 40" fill="none">
                <rect x="7" y="17" width="26" height="11" rx="3" fill="#0f1115" stroke="#f5a623" strokeWidth="1.4" />
                <path d="M11 17 L14 10 H26 L29 17" fill="none" stroke="#f5a623" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="13" cy="28" r="2.6" fill="#f5a623" />
                <circle cx="27" cy="28" r="2.6" fill="#f5a623" />
                <rect x="17" y="12.5" width="6" height="3.2" fill="#f5a623" opacity="0.5" />
              </svg>

              {destinations.map((dest, idx) => (
                <div
                  key={dest.id}
                  ref={(el) => {
                    stopsRef.current[idx] = el;
                  }}
                  className="rail-stop"
                  data-stop={idx}
                >
                  <span className="dot" />
                  <span className="km">{dest.distance}</span>
                  <span className="name">{dest.name}</span>
                </div>
              ))}
            </div>

            <div className="card-viewport" id="cardViewport">
              {destinations.map((dest, idx) => {
                const getStopColor = () => {
                  if (idx % 3 === 0) return 'var(--marigold)';
                  if (idx % 3 === 1) return 'var(--teal)';
                  return 'var(--maroon)';
                };

                const getBestByText = () => {
                  if (idx === 0) return "Early morning, before the heat";
                  if (idx === 1) return "First safari of the day";
                  if (idx === 2) return "Late morning, for prayers";
                  if (idx === 3) return "Evening bazaar strolls";
                  if (idx === 4) return "Late afternoon light";
                  if (idx === 5) return "Boat ride, just before dusk";
                  if (idx === 6) return "Evening sunset point view";
                  return "After dark, away from town";
                };

                const getCardIcon = () => {
                  const strokeColor = idx % 3 === 0 ? '#f5a623' : (idx % 3 === 1 ? 'var(--teal)' : 'var(--maroon)');
                  return (
                    <svg className="card-icon" viewBox="0 0 46 46" fill="none">
                      <path d="M8 34h30M12 34V18l4-4h14l4 4v16" stroke={strokeColor} strokeWidth="1.6" />
                      <path d="M18 34V24h10v10" stroke={strokeColor} strokeWidth="1.6" />
                    </svg>
                  );
                };

                return (
                  <div
                    key={dest.id}
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    onClick={() => setSelectedDest(dest)}
                    className="card bg-[#171b23] cursor-pointer hover:border-orange-500/30 transition-all duration-300 select-text overflow-hidden relative group/card"
                    data-index={idx}
                  >
                    {/* Background image of the city inside the card itself (opacity-85 for high visibility) */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#171b23]">
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-full h-full object-cover opacity-85 group-hover/card:scale-105 transition-transform duration-700" 
                        loading="lazy"
                      />
                      {/* Subtly darkened overlay to preserve text readability while keeping the photo fully visible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60" />
                    </div>

                    <div className="card-top relative z-10">
                      <div className="card-stop font-bold text-xs" style={{ color: getStopColor() }}>
                        Stop {idx < 9 ? `0${idx + 1}` : idx + 1} — {dest.name} Stop
                      </div>
                      <div className="card-title text-3xl font-serif text-white mt-2">
                        {dest.name}
                      </div>
                      <div className="card-tagline text-xs md:text-sm text-slate-200 mt-3.5 leading-relaxed font-semibold">
                        {dest.tagline}
                      </div>
                    </div>
                    <div className="card-bottom flex justify-between items-end border-t border-white/10 pt-4 mt-6 relative z-10">
                      <div className="card-meta text-[10px] uppercase text-slate-400 font-mono tracking-wider">
                        Best by
                        <span className="block text-white text-xs font-semibold normal-case mt-1">{getBestByText()}</span>
                      </div>
                      {getCardIcon()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Outro section */}
      <section className="outro select-none relative flex flex-col justify-center min-h-[70vh] py-16 px-6 md:px-24 border-t border-white/10 bg-slate-950/40">
        <div className="eyebrow flex items-center gap-2.5 text-xs font-bold text-orange-400 uppercase tracking-widest">
          End of the line — for now
        </div>
        <h2 className="font-serif font-light text-2xl sm:text-4xl md:text-5xl leading-tight text-white mt-6 mb-6 max-w-lg">
          Eight stops down. One highway, endless detours left to take.
        </h2>
        <button 
          onClick={() => {
            const element = document.getElementById('booking-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="cta font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full bg-orange-400 hover:bg-orange-500 text-slate-950 cursor-pointer shadow-lg shadow-orange-400/20 hover:scale-[1.03] transition-all"
        >
          Plan this route
        </button>
      </section>

      {/* Details modal popup with blurred background ( backdrop-blur-md ) */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Blurred backdrop screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] bg-slate-950 border border-slate-850 text-white shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Top Banner Image with close button */}
              <div className="relative h-[220px] md:h-[280px] shrink-0 overflow-hidden">
                <img 
                  src={selectedDest.image} 
                  alt={selectedDest.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                <button
                  onClick={() => setSelectedDest(null)}
                  className="absolute top-5 right-5 z-20 bg-slate-900/80 hover:bg-orange-500 text-white hover:text-slate-950 p-2.5 rounded-full transition-all border border-slate-700/50 cursor-pointer shadow-md hover:scale-105"
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-5 left-6 right-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full">
                    {selectedDest.distance}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black text-white mt-3.5 tracking-tight">
                    {selectedDest.name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-350 font-bold italic mt-1 font-sans">
                    "{selectedDest.tagline}"
                  </p>
                </div>
              </div>

              {/* Scrollable details panel */}
              <div className="overflow-y-auto p-6 md:p-8 flex-1 space-y-8 select-text">
                {/* About Section */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Compass size={14} className="text-orange-500" />
                    About this Journey
                  </h4>
                  <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-medium">
                    {selectedDest.about}
                  </p>
                </div>

                {/* Hot spots grid list */}
                {selectedDest.hotspots && selectedDest.hotspots.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={14} className="text-orange-500" />
                      Must-Visit Attractions & Hot Spots
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDest.hotspots.map((h, idx) => (
                        <div key={idx} className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-start hover:border-orange-500/10 transition-colors">
                          <span className="text-xs font-extrabold text-orange-400 block mb-1">
                            {idx + 1}. {h.name}
                          </span>
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                            {h.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calculated Fares Desk */}
                <div className="space-y-4 pt-4 border-t border-slate-900">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={14} className="text-orange-500" />
                      Transparent Fleet Pricing (From Jaipur)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      {selectedDest.isLocal 
                        ? "Local sightseeing pricing matches standard flat-rate 8 hr / 80 km package limits." 
                        : "Outstation pricing is calculated roundtrip: Base Fare + (Roundtrip distance * rate/km). Tolls/parking extra."
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hatchback */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500/25 transition-all">
                      <div>
                        <div className="flex items-center gap-2 text-orange-400">
                          <Car size={15} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {selectedDest.fares.hatchback.name}
                          </span>
                        </div>
                        <p className="text-2xl font-black text-white mt-3">
                          {selectedDest.fares.hatchback.total}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-950/60 px-2 py-1 rounded border border-slate-850">
                          <CheckCircle2 size={10} className="text-orange-400 shrink-0" />
                          <span className="text-[9px] font-bold text-slate-300">
                            Rate: {selectedDest.fares.hatchback.rate}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-2.5 leading-relaxed">
                          Formula: {selectedDest.fares.hatchback.calc}
                        </p>
                      </div>
                    </div>

                    {/* Sedan */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500/25 transition-all">
                      <div>
                        <div className="flex items-center gap-2 text-orange-400">
                          <Car size={15} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {selectedDest.fares.sedan.name}
                          </span>
                        </div>
                        <p className="text-2xl font-black text-white mt-3">
                          {selectedDest.fares.sedan.total}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-950/60 px-2 py-1 rounded border border-slate-850">
                          <CheckCircle2 size={10} className="text-orange-400 shrink-0" />
                          <span className="text-[9px] font-bold text-slate-300">
                            Rate: {selectedDest.fares.sedan.rate}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-2.5 leading-relaxed">
                          Formula: {selectedDest.fares.sedan.calc}
                        </p>
                      </div>
                    </div>

                    {/* SUV Crysta */}
                    <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500/25 transition-all">
                      <div>
                        <div className="flex items-center gap-2 text-orange-400">
                          <Car size={15} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {selectedDest.fares.suv.name}
                          </span>
                        </div>
                        <p className="text-2xl font-black text-white mt-3">
                          {selectedDest.fares.suv.total}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-950/60 px-2 py-1 rounded border border-slate-850">
                          <CheckCircle2 size={10} className="text-orange-400 shrink-0" />
                          <span className="text-[9px] font-bold text-slate-300">
                            Rate: {selectedDest.fares.suv.rate}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-2.5 leading-relaxed">
                          Formula: {selectedDest.fares.suv.calc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Estimated Base Fare
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-orange-400 mt-1">
                        {selectedDest.baseFare}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('select-destination', {
                          detail: { name: selectedDest.name, fare: selectedDest.baseFare }
                        }));
                        setSelectedDest(null);
                        const element = document.getElementById('booking-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-slate-950 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-500/25 hover:scale-[1.03]"
                    >
                      Book Tour Package
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
