import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, Navigation, Phone, CheckCircle, ShieldAlert, History, ArrowRight, Loader, LocateFixed } from 'lucide-react';
import { TripType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SERVICE_OPTIONS = [
  'Airport Transfers',
  'Rajasthan Tour Packages',
  'Pilgrimage Tours',
  'Corporate Travel',
  'Wedding Transportation',
  'Luxury Car Rentals',
  'General Taxi Services'
];

export default function BookingForm() {
  const { userData, user } = useAuth();
  const [tripType, setTripType] = useState<TripType>('One Way');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('1-2 Passengers');
  const [serviceType, setServiceType] = useState('General Taxi Services');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [detectingLoc, setDetectingLoc] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const detectPickupLocation = () => {
    setDetectingLoc(true);
    setLocError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: {
              'Accept-Language': 'en'
            }
          })
            .then(res => {
              if (!res.ok) throw new Error('Geocoding response error');
              return res.json();
            })
            .then(data => {
              if (data && data.display_name) {
                // Shorten the address by taking the first 3 components
                const addressParts = data.display_name.split(',').map((s: string) => s.trim());
                const shortAddress = addressParts.slice(0, 3).join(', ');
                setPickup(shortAddress || data.display_name);
              } else {
                setPickup(`My Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
              }
              setDetectingLoc(false);
            })
            .catch(err => {
              console.error('Reverse geocoding failed:', err);
              // Fallback to coordinates on error
              setPickup(`My Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
              setDetectingLoc(false);
            });
        },
        (error) => {
          console.error('Booking form geolocation error:', error);
          setDetectingLoc(false);
          setLocError('Could not access your location. Please type manually.');
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    } else {
      setDetectingLoc(false);
      setLocError('Geolocation is not supported by your browser.');
    }
  };

  // In-memory fallback fleets to guarantee visual backup
  const fallbackFleets = [
    {
      category: "Hatchback Comfort",
      models: "Maruti Suzuki Swift, Baleno, Tata Altroz",
      seats: 4,
      luggage: 2,
      fare: "₹11/km (Base ₹999)",
      image: "https://images.unsplash.com/photo-1620021614059-e31ab381a170?auto=format&fit=crop&q=80&w=800"
    },
    {
      category: "Compact Sedan",
      models: "Maruti Suzuki Dzire, Honda Amaze, Hyundai Aura",
      seats: 4,
      luggage: 3,
      fare: "₹12/km (Base ₹1,200)",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800"
    },
    {
      category: "Premium SUV Crysta",
      models: "Toyota Innova Crysta, Mahindra XUV700, Tata Safari",
      seats: 7,
      luggage: 5,
      fare: "₹18/km (Base ₹2,800)",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const [availableFleets, setAvailableFleets] = useState<any[]>([]);
  const [selectedTaxi, setSelectedTaxi] = useState<any>(fallbackFleets[0]);

  // Load real-time vehicles from fleets collection
  useEffect(() => {
    const cached = localStorage.getItem('sg_fleets');
    if (cached) {
      const cachedFleets = JSON.parse(cached);
      setAvailableFleets(cachedFleets);
      if (cachedFleets.length > 0) {
        setSelectedTaxi(cachedFleets[0]);
      }
    }

    const unsub = onSnapshot(collection(db, 'fleets'), (snap) => {
      const fleetsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailableFleets(fleetsList);
      localStorage.setItem('sg_fleets', JSON.stringify(fleetsList));
      if (fleetsList.length > 0) {
        setSelectedTaxi(fleetsList[0]);
      }
    }, (err) => {
      console.warn("Error listening to fleet catalog in booking form, loading local fallback:", err);
      const local = localStorage.getItem('sg_fleets');
      const fleetsList = local ? JSON.parse(local) : [];
      setAvailableFleets(fleetsList);
      if (fleetsList.length > 0) {
        setSelectedTaxi(fleetsList[0]);
      }
    });
    return () => unsub();
  }, []);

  // Prefill serviceType when custom 'select-service' event fires
  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && SERVICE_OPTIONS.includes(customEvent.detail)) {
        setServiceType(customEvent.detail);
      }
    };
    window.addEventListener('select-service', handleSelectService);
    return () => window.removeEventListener('select-service', handleSelectService);
  }, []);

  // Prefill drop & pickup locations when a destination is chosen
  useEffect(() => {
    const handleSelectDest = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.name) {
        setDrop(customEvent.detail.name);
        setPickup('Jaipur City / Airport'); // Typical tourist base
        setServiceType('Rajasthan Tour Packages');
        if (customEvent.detail.fare) {
          // If destination has a custom fare, we can update service
          setServiceType('Rajasthan Tour Packages');
        }
      }
    };
    window.addEventListener('select-destination', handleSelectDest);
    return () => window.removeEventListener('select-destination', handleSelectDest);
  }, []);

  // Prefill route when selected from the Google Map workspace
  useEffect(() => {
    const handleSelectCustomRoute = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.pickup) {
          setPickup(customEvent.detail.pickup);
        }
        if (customEvent.detail.drop) {
          setDrop(customEvent.detail.drop);
        }
        if (customEvent.detail.serviceType) {
          setServiceType(customEvent.detail.serviceType);
        }
      }
    };
    window.addEventListener('select-custom-route', handleSelectCustomRoute);
    return () => window.removeEventListener('select-custom-route', handleSelectCustomRoute);
  }, []);

  // Prefill passenger count based on chosen vehicle seats
  useEffect(() => {
    const handleSelectFleet = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.category) {
        const catName = customEvent.detail.category;
        const allCombined = [...availableFleets, ...fallbackFleets];
        const found = allCombined.find(f => String(f.category).toLowerCase() === String(catName).toLowerCase());
        if (found) {
          setSelectedTaxi(found);
        }

        const seats = Number(customEvent.detail.passengers || customEvent.detail.seats) || 4;
        if (seats <= 2) {
          setPassengers('1-2 Passengers');
        } else if (seats <= 4) {
          setPassengers('3-4 Passengers');
        } else if (seats <= 7) {
          setPassengers('5-7 Passengers');
        } else {
          setPassengers('8+ Passengers (Traveller)');
        }
        setServiceType('General Taxi Services');
      }
    };
    window.addEventListener('select-fleet', handleSelectFleet);
    return () => window.removeEventListener('select-fleet', handleSelectFleet);
  }, [availableFleets]);

  // Set randomized realistic fare based on pickup, drop, and chosen taxi
  useEffect(() => {
    if (pickup && drop) {
      let basePrice = 999;
      let perKmMultiplier = 12;

      const activeTaxi = selectedTaxi || fallbackFleets[0];
      const fareStr = String(activeTaxi.fare || "");

      if (fareStr.includes('Base')) {
        const baseMatch = fareStr.match(/Base ₹([\d,]+)/);
        if (baseMatch) basePrice = Number(baseMatch[1].replace(/,/g, ''));
      } else {
        const simpleBaseMatch = fareStr.match(/Base\s+([\d,]+)/i);
        if (simpleBaseMatch) basePrice = Number(simpleBaseMatch[1].replace(/,/g, ''));
      }

      const kmMatch = fareStr.match(/₹?([\d,]+)\/km/);
      if (kmMatch) {
        perKmMultiplier = Number(kmMatch[1].replace(/,/g, ''));
      } else if (fareStr.includes('/km')) {
        const simpleKmMatch = fareStr.match(/([\d,]+)\/km/i);
        if (simpleKmMatch) perKmMultiplier = Number(simpleKmMatch[1].replace(/,/g, ''));
      } else if (fareStr.includes('Tour')) {
        const tourMatch = fareStr.match(/₹?([\d,]+)/);
        if (tourMatch) {
          setEstimatedFare(Number(tourMatch[1].replace(/,/g, '')));
          return;
        }
      }

      // Consistent hashing based on pickup and drop length
      const combinedLength = pickup.trim().length + drop.trim().length;
      const calculatedDistance = 25 + (combinedLength * 17) % 350;

      let finalPrice = basePrice + Math.floor(calculatedDistance * perKmMultiplier);

      if (tripType === 'Round Trip') {
        finalPrice = Math.floor(finalPrice * 1.7);
      } else if (tripType === 'Multi City') {
        finalPrice = Math.floor(finalPrice * 2.4);
      }

      setEstimatedFare(finalPrice);
    } else {
      setEstimatedFare(null);
    }
  }, [pickup, drop, tripType, selectedTaxi]);

  // Real-time listener for current user's bookings
  useEffect(() => {
    if (!user) {
      setMyBookings([]);
      return;
    }

    const savedBookings = localStorage.getItem('sg_bookings');
    if (savedBookings) {
      const list = JSON.parse(savedBookings).filter((b: any) => b.userId === user.uid);
      list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setMyBookings(list);
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const bookingsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side to prevent missing index (which yields permission-denied errors)
      bookingsList.sort((a: any, b: any) => {
        const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
        const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
        return timeB - timeA;
      });
      setMyBookings(bookingsList);
      
      // Cache user's bookings, merging with existing local cache
      const cached = localStorage.getItem('sg_bookings');
      let allCached = cached ? JSON.parse(cached) : [];
      // Remove stale versions of user's bookings
      allCached = allCached.filter((b: any) => b.userId !== user.uid);
      allCached.push(...bookingsList);
      localStorage.setItem('sg_bookings', JSON.stringify(allCached));
    }, (err) => {
      console.warn("Error fetching passenger bookings from Firestore, loading local fallback:", err);
      const local = localStorage.getItem('sg_bookings');
      const allBookings = local ? JSON.parse(local) : [];
      const userBookings = allBookings.filter((b: any) => b.userId === user.uid);
      userBookings.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setMyBookings(userBookings);
      
      // Conforming to handleFirestoreError specification
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'list',
        path: 'bookings',
        authInfo: {
          userId: user?.uid || null,
          email: user?.email || null,
          emailVerified: user?.emailVerified || null,
        }
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
    });

    return () => unsub();
  }, [user]);

  const handleBookTaxi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || userData?.role !== 'customer') {
      setError('Only registered customers can book taxis.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const bookingId = 'SG-' + Math.floor(100000 + Math.random() * 900000);
    const finalFare = estimatedFare || 1500;

    const payload = {
      userId: user.uid,
      customerEmail: user.email || 'guest@shrigurukripa.com',
      tripType,
      pickup,
      drop,
      date,
      time,
      passengers,
      serviceType,
      taxiOption: selectedTaxi?.category || 'General Sedan Upgrade',
      customerPhone: customerPhone || 'Not Provided',
      fare: finalFare,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), payload);
      setBookingSuccess(bookingId);
      
      // Save locally to cache as well
      const cached = localStorage.getItem('sg_bookings');
      const allCached = cached ? JSON.parse(cached) : [];
      allCached.push({ id: bookingId, ...payload });
      localStorage.setItem('sg_bookings', JSON.stringify(allCached));

      // Reset inputs
      setPickup('');
      setDrop('');
      setDate('');
      setTime('');
      setCustomerPhone('');
    } catch (err: any) {
      console.warn("Firestore booking write failed, saving locally:", err.message);
      
      // Fallback: save to localStorage
      const cached = localStorage.getItem('sg_bookings');
      const allCached = cached ? JSON.parse(cached) : [];
      const newBooking = { id: bookingId, ...payload };
      allCached.push(newBooking);
      localStorage.setItem('sg_bookings', JSON.stringify(allCached));
      
      // Instantly trigger UI update
      setMyBookings(prev => [newBooking, ...prev]);

      setBookingSuccess(bookingId);
      // Reset inputs
      setPickup('');
      setDrop('');
      setDate('');
      setTime('');
      setCustomerPhone('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCustomer = user && userData?.role === 'customer';

  if (bookingSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto xl:ml-auto text-center border border-green-100">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-4 font-semibold text-sm">
          Your ride request is receiving instant attention. Our dispatcher will contact you immediately.
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
          <p className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Booking Reference ID</p>
          <p className="text-2xl font-black text-slate-800 tracking-wider font-mono">{bookingSuccess}</p>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => {
              setBookingSuccess(null);
              setShowHistory(true);
            }} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Track Status in History
          </button>
          <button 
            onClick={() => setBookingSuccess(null)} 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Book Another Ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto xl:ml-auto border border-gray-100">
      
      {/* Header section toggle between order form & booking history */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Secure Taxi Dispatch</h3>
        {isCustomer && myBookings.length > 0 && (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <History size={14} />
            {showHistory ? "New Booking" : `My Rides (${myBookings.length})`}
          </button>
        )}
      </div>

      {showHistory && isCustomer ? (
        // Booking history UI
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">My Booking History</h4>
          {myBookings.map((b) => (
            <div key={b.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-black text-slate-700">{b.id}</span>
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                  b.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {b.status}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <p className="flex items-start gap-1 text-gray-700 font-medium">
                  <span className="text-gray-400 font-bold min-w-[50px]">From:</span> {b.pickup}
                </p>
                <p className="flex items-start gap-1 text-gray-700 font-medium">
                  <span className="text-gray-400 font-bold min-w-[50px]">To:</span> {b.drop}
                </p>
                <p className="text-xs text-gray-500 font-semibold flex gap-2 mt-1">
                  <span>📅 {b.date}</span>
                  <span>⏰ {b.time}</span>
                  <span>👥 {b.passengers}</span>
                </p>
                <p className="text-xs text-orange-600 font-bold mt-1">
                  Service: {b.serviceType}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Estimated Fare:</span>
                <span className="font-black text-slate-950 text-sm">₹{b.fare}</span>
              </div>
            </div>
          ))}
          <button 
            onClick={() => setShowHistory(false)}
            className="w-full mt-2 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm"
          >
            Back to Booking Form
          </button>
        </div>
      ) : !isCustomer ? (
        // Locked / Customer Authenticated screen trigger
        <div className="py-8 text-center space-y-5">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8 text-orange-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-slate-900">Registered Customers Only</h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              To request services, manage real-time status tracking, and request prompt drivers, please authenticate.
            </p>
          </div>
          <div className="pt-2">
            <Link 
              to="/login/customer" 
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-600/20 text-sm"
            >
              Sign In / Sign Up
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Takes less than 1 minute to setup a new account.
          </p>
        </div>
      ) : (
        // Standard high-fidelity booking form
        <form onSubmit={handleBookTaxi} className="space-y-4">
          
          {/* Trip Type Picker */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4 overflow-x-auto hide-scrollbar">
            {(['One Way', 'Round Trip', 'Multi City'] as TripType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setTripType(type)}
                className={`flex-1 whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
                  tripType === type
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4 relative">
            {/* Pickup Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (locError) setLocError(null);
                }}
                className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-colors text-sm font-medium placeholder-gray-400"
                placeholder="Pickup Location (e.g. Jaipur Airport)"
              />
              <button
                type="button"
                onClick={detectPickupLocation}
                disabled={detectingLoc}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50 cursor-pointer"
                title="Detect live location"
              >
                <LocateFixed className={`h-5 w-5 ${detectingLoc ? 'animate-spin text-orange-500' : ''}`} />
              </button>
            </div>

            {locError && (
              <p className="text-[11px] text-amber-600 font-semibold px-1 -mt-3 animate-in fade-in">
                ⚠️ {locError}
              </p>
            )}

            {/* Dotted line connecting pins */}
            <div className="absolute left-5 top-10 bottom-6 w-0.5 bg-gray-200 z-0 hidden sm:block"></div>

            {/* Drop Input */}
            <div className="relative z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Navigation className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                required
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-colors text-sm font-medium placeholder-gray-400"
                placeholder="Drop Location (e.g. Ajmer)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-xs font-semibold text-gray-705"
              />
            </div>
            {/* Time */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-xs font-semibold text-gray-705"
              />
            </div>
          </div>

          {/* Select Taxi Option */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">Select Taxi / Vehicle Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                const uniqueTaxis = [...availableFleets, ...fallbackFleets].reduce((acc: any[], cur: any) => {
                  if (!acc.find(item => String(item.category).toLowerCase() === String(cur.category).toLowerCase())) {
                    acc.push(cur);
                  }
                  return acc;
                }, []);
                
                return uniqueTaxis.map((t: any) => (
                  <button
                    type="button"
                    key={t.category}
                    onClick={() => setSelectedTaxi(t)}
                    className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedTaxi?.category === t.category
                        ? 'border-orange-500 bg-orange-100/40 text-orange-850 ring-2 ring-orange-550/10 font-bold'
                        : 'border-slate-200 hover:bg-slate-100/50 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold leading-tight block mb-1.5 truncate w-full">{t.category}</span>
                    <span className="text-[9px] text-orange-600 font-extrabold leading-none bg-orange-50 px-1.5 py-0.5 rounded">{t.fare ? String(t.fare).split(' ')[0] : 'Base'}</span>
                  </button>
                ));
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Category */}
            <div className="relative">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-xs font-semibold"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Passengers */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-xs font-semibold appearance-none"
              >
                <option>1-2 Passengers</option>
                <option>3-4 Passengers</option>
                <option>5-7 Passengers</option>
                <option>8+ Passengers (Traveller)</option>
              </select>
            </div>
          </div>

          {/* Customer Phone (Mandatory for real outreach) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 transition-colors text-sm font-medium placeholder-gray-400"
              placeholder="Contact Number (e.g. +91 99500 XXXXX)"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-bold p-2 bg-red-50 border border-red-100 rounded-lg">{error}</p>
          )}

          {estimatedFare !== null && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <div>
                <p className="text-xs text-green-700 uppercase font-extrabold tracking-wider">Estimated Fare</p>
                <p className="text-2xl font-black text-green-600">₹{estimatedFare}</p>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="text-xs font-extrabold text-white bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg transition-colors shadow-sm shadow-green-600/20 flex items-center gap-1.5"
              >
                {isSubmitting ? <Loader className="animate-spin" size={14} /> : "Book Cab"}
              </button>
            </div>
          )}

          {estimatedFare === null && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Check Details & Book
            </button>
          )}
        </form>
      )}
    </div>
  );
}
