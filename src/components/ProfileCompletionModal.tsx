import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Phone, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function ProfileCompletionModal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic Validation
    if (name.trim().length < 3) {
      setError('Please enter your full name (minimum 3 characters).');
      return;
    }
    
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 12 || parsedAge > 110) {
      setError('Please enter a valid age between 12 and 110.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        name: name.trim(),
        age: parsedAge,
        phoneNumber: cleanPhone,
        updatedAt: Date.now()
      }, { merge: true });

      // Save local bypass cache flags
      localStorage.setItem(`sg_profile_completed_${user.uid}`, 'true');
      localStorage.setItem(`sg_profile_name_${user.uid}`, name.trim());
      localStorage.setItem(`sg_profile_phone_${user.uid}`, cleanPhone);

    } catch (err: any) {
      console.error("Error saving profile details:", err);
      if (err.code === 'permission-denied' || err.message?.includes('permission-denied')) {
        setError('Permission denied. Please ensure you have deployed the updated firestore.rules file to your Firebase Console.');
      } else {
        setError(err.message || 'Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-white"
      >
        {/* Glow Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-bl-[120px] blur-xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-500/15 border border-orange-500/30 text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">Complete Your Profile</h2>
          <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-xs mx-auto">
            Please enter your basic information to unlock round-trip booking discounts, support chats, and customized travel plans.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-1.5 pl-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-600 text-sm font-semibold text-white"
              />
            </div>
          </div>

          {/* Age Field */}
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-1.5 pl-1">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
              <input
                type="number"
                required
                min="12"
                max="110"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-600 text-sm font-semibold text-white"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-1.5 pl-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9950072777"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-600 text-sm font-semibold text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-650 text-slate-950 font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/10 disabled:opacity-75 flex justify-center items-center gap-2 cursor-pointer text-xs uppercase tracking-wider mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Save &amp; Continue <ArrowRight size={14} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
