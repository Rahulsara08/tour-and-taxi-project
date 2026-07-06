import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-transparent py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
            Shri Gurukripa
          </h2>
          <p
            className="text-sm font-medium leading-relaxed mb-5"
            style={{ color: 'var(--text-primary)', opacity: 0.8 }}
          >
            Safe, Trusted, and Comfortable Journey Across Rajasthan. Your premium travel partner.
          </p>
          <div className="text-sm space-y-2" style={{ color: 'var(--text-primary)', opacity: 0.85 }}>
            <p>
              <strong className="font-black" style={{ color: 'var(--text-primary)' }}>Phone: </strong>
              9950072777
            </p>
            <p>
              <strong className="font-black" style={{ color: 'var(--text-primary)' }}>WhatsApp: </strong>
              9950071777
            </p>
            <p>
              <strong className="font-black" style={{ color: 'var(--text-primary)' }}>Email: </strong>
              shrigurukripaandtaxi@gmail.com
            </p>
            <p>
              <strong className="font-black" style={{ color: 'var(--text-primary)' }}>Availability: </strong>
              24×7
            </p>
          </div>
        </div>

        {/* Top Services */}
        <div>
          <h3
            className="font-black text-xs uppercase tracking-widest mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Top Services
          </h3>
          <ul className="space-y-3 text-sm font-semibold" style={{ color: 'var(--text-primary)', opacity: 0.75 }}>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Taxi Service in Ajmer</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Taxi Service in Jaipur</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Rajasthan Tour Packages</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Airport Taxi Jaipur</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Pushkar Taxi Service</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="font-black text-xs uppercase tracking-widest mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm font-semibold" style={{ color: 'var(--text-primary)', opacity: 0.75 }}>
            <li><a href="#" className="hover:text-orange-500 transition-colors">One Way Cab Rajasthan</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Outstation Cab Rajasthan</a></li>
            <li><a href="#destinations" className="hover:text-orange-500 transition-colors">Popular Destinations</a></li>
            <li><a href="#fleet" className="hover:text-orange-500 transition-colors">Our Fleet</a></li>
            <li><Link to="/login/customer" className="hover:text-orange-500 transition-colors">Passenger Portal</Link></li>
          </ul>
        </div>

        {/* Booking Support */}
        <div>
          <h3
            className="font-black text-xs uppercase tracking-widest mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Booking Support
          </h3>
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-md" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <p
              className="text-sm font-medium mb-4 leading-relaxed"
              style={{ color: 'var(--text-primary)', opacity: 0.8 }}
            >
              Need help planning your itinerary? Our AI assistant and travel experts are here.
            </p>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-ai-chat-assistant'));
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all cursor-pointer uppercase text-xs tracking-wider shadow-md hover:shadow-orange-500/20"
            >
              Chat with Expert
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 text-sm text-center font-semibold"
        style={{
          borderTop: '1px solid rgba(128,128,128,0.2)',
          color: 'var(--text-primary)',
          opacity: 0.55,
        }}
      >
        <p>&copy; {new Date().getFullYear()} Shri Gurukripa Tours &amp; Taxi. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
