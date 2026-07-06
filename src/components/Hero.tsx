import React from 'react';
import BookingForm from './BookingForm';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 lg:pb-32 overflow-hidden min-h-[85vh] flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop"
          alt="Rajasthan Palace and luxury travel"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 font-semibold tracking-wide text-sm">
              Shri Gurukripa Tours & Taxi
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Book Trusted Taxi Services Across Rajasthan
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl">
              Local & Outstation Cabs, Airport Transfers, Rajasthan Tours, 
              Char Dham Tours, One-Way & Round Trips.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => {
                  const element = document.getElementById('booking-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                  const input = document.querySelector('input[placeholder*="Pickup"]') as HTMLInputElement;
                  if (input) setTimeout(() => input.focus(), 400);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                Book Now
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('booking-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                  const input = document.querySelector('input[placeholder*="Pickup"]') as HTMLInputElement;
                  if (input) setTimeout(() => input.focus(), 400);
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all cursor-pointer"
              >
                Get Quote
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-8 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  ✓
                </div>
                Safe & Trusted
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  ★
                </div>
                Premium Fleet
              </div>
            </div>
          </motion.div>

          <motion.div
            id="booking-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BookingForm />
          </motion.div>

        </div>
      </div>

      {/* Seamless blurry transition gap at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none" 
        style={{ 
          background: 'linear-gradient(to top, #020617 0%, transparent 100%)', // matches a dark slate-950 tone
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)'
        }} 
      />
    </div>
  );
}
