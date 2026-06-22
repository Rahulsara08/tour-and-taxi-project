import React, { useState } from 'react';
import { Menu, X, Phone, User, MonitorSmartphone, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();
  
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shri Gurukripa
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
            <a href="#services" className="text-gray-700 hover:text-orange-600 font-medium">Services</a>
            <a href="#destinations" className="text-gray-700 hover:text-orange-600 font-medium">Destinations</a>
            <a href="#fleet" className="text-gray-700 hover:text-orange-600 font-medium">Fleet</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:9950072777" className="flex items-center gap-2 text-orange-600 font-bold mr-4">
              <Phone size={20} />
              9950072777
            </a>
            {userData ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold capitalize bg-gray-100 px-3 py-1.5 rounded-full">{userData.role}</span>
                {userData.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-semibold text-red-600 hover:text-red-700">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 p-2"><LogOut size={18}/></button>
              </div>
            ) : (
              <Link to="/login/customer" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors border border-orange-700">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 font-medium">Home</Link>
            <a href="#services" className="block px-3 py-2 text-gray-700 font-medium">Services</a>
            <a href="#destinations" className="block px-3 py-2 text-gray-700 font-medium">Destinations</a>
            <a href="#fleet" className="block px-3 py-2 text-gray-700 font-medium">Fleet</a>
            <a href="tel:9950072777" className="block px-3 py-2 text-orange-600 font-bold flex items-center gap-2">
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
