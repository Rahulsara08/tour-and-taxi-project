import React from 'react';
import { Plane, Map, Building2, Briefcase, Heart, Car } from 'lucide-react';
import { motion } from 'motion/react';
import CrowdCanvas from './CrowdCanvas';

const categories = [
  {
    title: 'Airport Transfers',
    icon: <Plane size={32} />,
    description: 'Jaipur, Udaipur, Jodhpur Airport Drops & Pickups.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Rajasthan Tour Packages',
    icon: <Map size={32} />,
    description: 'Jaipur, Ajmer, Pushkar, Udaipur, Jodhpur, Jaisalmer.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Pilgrimage Tours',
    icon: <Building2 size={32} />,
    description: 'Char Dham, Pushkar, Khatu Shyam Ji, Salasar Balaji.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Corporate Travel',
    icon: <Briefcase size={32} />,
    description: 'Executive cars for meetings & conferences.',
    color: 'bg-slate-50 text-slate-600',
  },
  {
    title: 'Wedding Transportation',
    icon: <Heart size={32} />,
    description: 'Luxury fleet for baraat and guest management.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    title: 'Luxury Car Rentals',
    icon: <Car size={32} />,
    description: 'Premium SUVs and luxury sedans for special occasions.',
    color: 'bg-purple-50 text-purple-600',
  },
];

export default function ServiceCategories() {
  return (
    <section id="services" className="relative py-24 bg-transparent overflow-hidden">
      {/* Background Crowd Walking Animation */}
      <CrowdCanvas opacity={0.15} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            From quick airport transfers to comprehensive Rajasthan tour packages, 
            experience the finest travel with Shri Gurukripa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.06)] hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] dark:shadow-[0_0_15px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] transition-shadow border border-white/5 dark:border-white/5"
            >
              <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 overflow-hidden`}>
                <motion.div
                  initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  animate={
                    category.title === 'Airport Transfers' ? { y: [0, -5, 0], rotate: [0, 4, -2, 0] } :
                    category.title === 'Rajasthan Tour Packages' ? { scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] } :
                    category.title === 'Pilgrimage Tours' ? { y: [0, -3, 0] } :
                    category.title === 'Corporate Travel' ? { rotate: [0, -4, 4, 0] } :
                    category.title === 'Wedding Transportation' ? { scale: [1, 1.12, 1] } :
                    category.title === 'Luxury Car Rentals' ? { x: [0, -4, 4, 0] } : {}
                  }
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: index * 0.05,
                    ...(category.title === 'Airport Transfers' ? { y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" } } :
                       category.title === 'Rajasthan Tour Packages' ? { scale: { repeat: Infinity, duration: 3.8, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 4.5, ease: "easeInOut" } } :
                       category.title === 'Pilgrimage Tours' ? { y: { repeat: Infinity, duration: 4, ease: "easeInOut" } } :
                       category.title === 'Corporate Travel' ? { rotate: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } } :
                       category.title === 'Wedding Transportation' ? { scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } } :
                       category.title === 'Luxury Car Rentals' ? { x: { repeat: Infinity, duration: 3.4, ease: "easeInOut" } } : {})
                  }}
                  className="flex items-center justify-center w-full h-full"
                >
                  {category.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{category.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed font-medium mb-6">
                {category.description}
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('select-service', { detail: category.title }));
                  const element = document.getElementById('booking-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-block px-6 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 transition-colors text-white font-semibold text-sm cursor-pointer w-full text-center"
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seamless blurring effect / gradient fade at the bottom to perfectly blend into the next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none" 
        style={{ 
          background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 100%)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)'
        }} 
      />
    </section>
  );
}
