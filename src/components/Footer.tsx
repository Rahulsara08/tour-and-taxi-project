import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
            Shri Gurukripa
          </h2>
          <p className="text-sm leading-relaxed mb-6">
            Safe, Trusted, and Comfortable Journey Across Rajasthan. Your premium travel partner.
          </p>
          <div className="text-sm space-y-2">
            <p><strong>Phone:</strong> 9950072777</p>
            <p><strong>WhatsApp:</strong> 9950071777</p>
            <p><strong>Email:</strong> shrigurukripaandtaxi@gmail.com</p>
            <p><strong>Availability:</strong> 24×7</p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Top Services</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Taxi Service in Ajmer</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Taxi Service in Jaipur</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Rajasthan Tour Packages</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Airport Taxi Jaipur</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Pushkar Taxi Service</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-orange-400 transition-colors">One Way Cab Rajasthan</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Outstation Cab Rajasthan</a></li>
            <li><a href="#destinations" className="hover:text-orange-400 transition-colors">Popular Destinations</a></li>
            <li><a href="#fleet" className="hover:text-orange-400 transition-colors">Our Fleet</a></li>
            <li><Link to="/login/customer" className="hover:text-orange-400 transition-colors">Passenger Portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Booking Support</h3>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-sm mb-4">Need help planning your itinerary? Our AI assistant and travel experts are here.</p>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Chat with Expert
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Shri Gurukripa Tours & Taxi. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
