import React from 'react';
import { Plane, Map, Building2, Briefcase, Heart, Car } from 'lucide-react';
import { motion } from 'motion/react';

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
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-600">
            From quick airport transfers to comprehensive Rajasthan tour packages, 
            experience the finest travel with Shri Gurukripa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
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
                className="inline-block px-6 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 transition-colors text-white font-semibold text-sm cursor-pointer w-full text-center"
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
