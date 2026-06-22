import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Car, MapPin, Plus, Trash2, Edit, Home, LogOut, History, Clock, CheckCircle, Database, Upload, FileSpreadsheet, Check } from 'lucide-react';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';

// Live homepage component imports for the interactive experience
import Hero from './Hero';
import ServiceCategories from './ServiceCategories';
import PopularDestinations from './PopularDestinations';
import FleetSection from './FleetSection';
import MapSection from './MapSection';
import CustomerReviews from './CustomerReviews';

export default function AdminDashboard() {
  const { userData, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'fleets' | 'destinations' | 'bookings' | 'home-preview'>('fleets');
  
  const [fleets, setFleets] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSeeding, setIsSeeding] = useState(false);

  // Excel Importer states
  const [isExcelImporterOpen, setIsExcelImporterOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'fleets' | 'destinations'>('fleets');
  const [excelPreviewData, setExcelPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Silent auto-seeding if fleets or destinations are empty on mount (without dialog confirm)
  useEffect(() => {
    if (userData?.role !== 'admin') return;
    
    // Once snapshot listeners populate state and verify both collections are complete empty, auto-seed
    const autoSeedIfEmpty = async () => {
      // Check local loading state when fetched, if both are empty and we aren't seeding already
      if (fleets.length === 0 && destinations.length === 0 && !isSeeding) {
        setIsSeeding(true);
        try {
          const defaultDestinations = [
            {
              name: "Jaipur (Pink City)",
              image: "https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=80&w=800",
              desc: "Explore majestic palaces, pink sandstones, and royal heritage.",
              places: "Hawa Mahal, Amer Fort, City Palace, Jantar Mantar, Chokhi Dhani",
              distance: "Base headquarters starting city",
              fare: "From ₹1,800/Day"
            },
            {
              name: "Udaipur (City of Lakes)",
              image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800",
              desc: "Vibrant romance in the Venice of the East with beautiful boat cruises.",
              places: "Lake Pichola, City Palace Udaipur, Jag Mandir, Sajjangarh Fort",
              distance: "395 km from Jaipur",
              fare: "From ₹7,500 Full Tour"
            },
            {
              name: "Jodhpur (The Blue City)",
              image: "https://images.unsplash.com/photo-1594132890528-97fcbbed921f?auto=format&fit=crop&q=80&w=800",
              desc: "Imposing Mehrangarh Fort towering over indigo colored houses.",
              places: "Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace, Mandore Gardens",
              distance: "330 km from Jaipur",
              fare: "From ₹6,200 Full Tour"
            }
          ];

          const defaultFleets = [
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

          const seededDests = defaultDestinations.map((d, idx) => ({ id: `dest-seed-${idx}`, ...d }));
          const seededFleets = defaultFleets.map((f, idx) => ({ id: `fleet-seed-${idx}`, ...f }));

          for (const dest of seededDests) {
            try {
              const data = { ...dest };
              delete (data as any).id;
              await setDoc(doc(db, 'destinations', dest.id), data);
            } catch (e) {
              console.warn("Firestore destination seed failed:", e);
            }
          }
          for (const fl of seededFleets) {
            try {
              const data = { ...fl };
              delete (data as any).id;
              await setDoc(doc(db, 'fleets', fl.id), data);
            } catch (e) {
              console.warn("Firestore fleet seed failed:", e);
            }
          }

          localStorage.setItem('sg_destinations', JSON.stringify(seededDests));
          localStorage.setItem('sg_fleets', JSON.stringify(seededFleets));
          setDestinations(seededDests);
          setFleets(seededFleets);
          console.log("Local and remote seeding check completed successfully.");
        } catch (err) {
          console.error("Auto seeding check warning:", err);
        } finally {
          setIsSeeding(false);
        }
      }
    };

    const timer = setTimeout(() => {
      autoSeedIfEmpty();
    }, 1500);

    return () => clearTimeout(timer);
  }, [userData, fleets.length, destinations.length]);

  useEffect(() => {
    if (userData?.role !== 'admin') return;

    // Load initial fallbacks from localStorage
    const savedFleets = localStorage.getItem('sg_fleets');
    if (savedFleets) setFleets(JSON.parse(savedFleets));

    const savedDest = localStorage.getItem('sg_destinations');
    if (savedDest) setDestinations(JSON.parse(savedDest));

    const savedBookings = localStorage.getItem('sg_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));

    const unsubFleets = onSnapshot(collection(db, 'fleets'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFleets(items);
      localStorage.setItem('sg_fleets', JSON.stringify(items));
    }, (err) => {
      console.warn("Firestore fleets restricted. Using local cache:", err.message);
    });

    const unsubDest = onSnapshot(collection(db, 'destinations'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDestinations(items);
      localStorage.setItem('sg_destinations', JSON.stringify(items));
    }, (err) => {
      console.warn("Firestore destinations restricted. Using local cache:", err.message);
    });

    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(items);
      localStorage.setItem('sg_bookings', JSON.stringify(items));
    }, (err) => {
      console.warn("Firestore bookings restricted. Using local cache:", err.message);
    });

    return () => {
      unsubFleets();
      unsubDest();
      unsubBookings();
    };
  }, [userData]);

  if (loading) return <div className="p-8 text-center font-semibold text-gray-500">Loading Admin Dashboard...</div>;
  if (!userData || userData.role !== 'admin') {
    return <Navigate to="/login/admin" />;
  }

  // Pre-populate actual Indian tourist destinations and premium Indian fleet categories
  const seedSampleData = async () => {
    if (!confirm('This will seed the official Indian places in Rajasthan (Jaipur, Udaipur, Jodhpur, Jaisalmer, Ajmer/Pushkar) and premium Indian fleets (Maruti, Tata, Mahindra, Force) into your live Firestore database collections. Continue?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const defaultDestinations = [
        {
          name: "Jaipur (Pink City)",
          image: "https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=80&w=800",
          desc: "Explore majestic palaces, pink sandstones, and royal heritage.",
          places: "Hawa Mahal, Amer Fort, City Palace, Jantar Mantar, Chokhi Dhani",
          distance: "Base headquarters starting city",
          fare: "From ₹1,800/Day"
        },
        {
          name: "Udaipur (City of Lakes)",
          image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800",
          desc: "Vibrant romance in the Venice of the East with beautiful boat cruises.",
          places: "Lake Pichola, City Palace Udaipur, Jag Mandir, Sajjangarh Fort",
          distance: "395 km from Jaipur",
          fare: "From ₹7,500 Full Tour"
        },
        {
          name: "Jodhpur (The Blue City)",
          image: "https://images.unsplash.com/photo-1594132890528-97fcbbed921f?auto=format&fit=crop&q=80&w=800",
          desc: "Imposing Mehrangarh Fort towering over indigo colored houses.",
          places: "Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace, Mandore Gardens",
          distance: "330 km from Jaipur",
          fare: "From ₹6,200 Full Tour"
        },
        {
          name: "Jaisalmer (The Golden City)",
          image: "https://images.unsplash.com/photo-1504128117511-3be9cf8e5114?auto=format&fit=crop&q=80&w=800",
          desc: "Mystical desert safaris, yellow sandstone forts, and overnight camping.",
          places: "Jaisalmer Fort, Sam Sand Dunes, Patwon ki Haveli, Gadisar Lake",
          distance: "550 km from Jaipur",
          fare: "From ₹9,800 Family Package"
        },
        {
          name: "Ajmer & Pushkar (Sacred Pilgrimage)",
          image: "https://images.unsplash.com/photo-1616790518770-07bfca531b79?auto=format&fit=crop&q=80&w=800",
          desc: "Sufi shrine of Khwaja Gharib Nawaz and holy Brahma Lake.",
          places: "Ajmer Sharif Dargah, Ana Sagar, Brahma Temple, Pushkar Lake Ghats",
          distance: "135 km from Jaipur",
          fare: "From ₹2,800 Roundtrip"
        }
      ];

      const defaultFleets = [
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
        },
        {
          category: "Executive Traveller",
          models: "Force Traveller, Tata Winger Luxury Bus",
          seats: 12,
          luggage: 10,
          fare: "₹26/km (Base ₹5,500)",
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
        }
      ];

      const seededDests = defaultDestinations.map((d, idx) => ({ id: `dest-seed-${idx}`, ...d }));
      const seededFleets = defaultFleets.map((f, idx) => ({ id: `fleet-seed-${idx}`, ...f }));

      // Save each to Firestore (with try/catch fallback)
      for (const dest of seededDests) {
        try {
          const data = { ...dest };
          delete (data as any).id;
          await setDoc(doc(db, 'destinations', dest.id), data);
        } catch (e) {
          console.warn("Firestore destination seed failed:", e);
        }
      }
      for (const fl of seededFleets) {
        try {
          const data = { ...fl };
          delete (data as any).id;
          await setDoc(doc(db, 'fleets', fl.id), data);
        } catch (e) {
          console.warn("Firestore fleet seed failed:", e);
        }
      }

      localStorage.setItem('sg_destinations', JSON.stringify(seededDests));
      localStorage.setItem('sg_fleets', JSON.stringify(seededFleets));
      setDestinations(seededDests);
      setFleets(seededFleets);

      alert("Data successfully seeded locally and synchronized to database (if permitted)!");
    } catch (err: any) {
      alert("Error seeding: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const colName = activeTab === 'fleets' ? 'fleets' : activeTab === 'destinations' ? 'destinations' : 'bookings';
    const id = formData.id || (activeTab === 'bookings' ? 'SG-' + Math.floor(100000 + Math.random() * 900000) : Date.now().toString());
    const dataToSave = { ...formData };
    delete dataToSave.id;

    // Fill in default values if saving a booking
    if (activeTab === 'bookings') {
      if (!dataToSave.userId) dataToSave.userId = 'admin-created';
      if (!dataToSave.status) dataToSave.status = 'pending';
      if (!dataToSave.createdAt) dataToSave.createdAt = Date.now();
      dataToSave.updatedAt = Date.now();
      dataToSave.fare = Number(dataToSave.fare) || 1200;
    }

    try {
      await setDoc(doc(db, colName, id), dataToSave);
      setIsFormOpen(false);
      setFormData({});
    } catch (err: any) {
      console.warn("Failed to write to remote Firestore, writing locally:", err.message);
      // Fallback to updating localStorage
      const localKey = activeTab === 'fleets' ? 'sg_fleets' : activeTab === 'destinations' ? 'sg_destinations' : 'sg_bookings';
      const existingData = localStorage.getItem(localKey);
      const items = existingData ? JSON.parse(existingData) : [];
      const index = items.findIndex((item: any) => item.id === id);
      const updatedItem = { id, ...dataToSave };
      if (index > -1) {
        items[index] = updatedItem;
      } else {
        items.push(updatedItem);
      }
      localStorage.setItem(localKey, JSON.stringify(items));
      
      // Update UI state directly
      if (activeTab === 'fleets') setFleets([...items]);
      else if (activeTab === 'destinations') setDestinations([...items]);
      else setBookings([...items]);

      setIsFormOpen(false);
      setFormData({});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource permanently?')) return;
    const colName = activeTab === 'fleets' ? 'fleets' : activeTab === 'destinations' ? 'destinations' : 'bookings';
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (err: any) {
      console.warn("Failed to delete from remote Firestore, deleting locally:", err.message);
      const localKey = activeTab === 'fleets' ? 'sg_fleets' : activeTab === 'destinations' ? 'sg_destinations' : 'sg_bookings';
      const existingData = localStorage.getItem(localKey);
      if (existingData) {
        const items = JSON.parse(existingData);
        const filtered = items.filter((item: any) => item.id !== id);
        localStorage.setItem(localKey, JSON.stringify(filtered));
        if (activeTab === 'fleets') setFleets(filtered);
        else if (activeTab === 'destinations') setDestinations(filtered);
        else setBookings(filtered);
      }
    }
  };

  const openForm = (item?: any) => {
    setFormData(item || {});
    setIsFormOpen(true);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          alert("The uploaded Excel sheet is empty or invalid. Please check layout format.");
          return;
        }

        const parsedRows = rawJson.map((row: any, idx) => {
          const normRow: any = {};
          Object.keys(row).forEach((k) => {
            normRow[k.trim().toLowerCase()] = row[k];
          });

          if (importType === 'fleets') {
            return {
              category: normRow.category || normRow.name || normRow.title || `Category ${idx + 1}`,
              models: normRow.models || normRow.model || normRow.vehicles || 'Swift Tour, Suzuki Ertiga',
              seats: Number(normRow.seats || normRow.passenger || normRow.capacity || 4),
              luggage: Number(normRow.luggage || normRow.bags || 3),
              fare: normRow.fare || normRow.price || normRow.fee || '₹12/km',
              image: normRow.image || normRow.img || normRow.url || 'https://images.unsplash.com/photo-1620021614059-e31ab381a170?auto=format&fit=crop&q=80&w=800'
            };
          } else {
            return {
              name: normRow.name || normRow.destination || normRow.title || `Destination ${idx + 1}`,
              desc: normRow.desc || normRow.description || normRow.info || 'Beautiful historic sightseeing package.',
              places: normRow.places || normRow.attractions || normRow.spots || 'Local heritage attractions',
              distance: normRow.distance || normRow.km || 'Hub Headquarter Index',
              fare: normRow.fare || normRow.price || normRow.cost || 'From ₹1,800/Day',
              image: normRow.image || normRow.img || normRow.url || 'https://images.unsplash.com/photo-1477584322813-fc3a09b30c3b?auto=format&fit=crop&q=80&w=800'
            };
          }
        });

        setExcelPreviewData(parsedRows);
      } catch (err: any) {
        alert("Failed to parse file: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const startExcelImport = async () => {
    if (excelPreviewData.length === 0) {
      alert("No valid rows parsed yet. Please check format structure.");
      return;
    }
    setIsImporting(true);
    try {
      const colName = importType;
      for (let i = 0; i < excelPreviewData.length; i++) {
        const item = excelPreviewData[i];
        const docId = `bulk-excel-${Date.now()}-${i}`;
        await setDoc(doc(db, colName, docId), item);
      }
      alert(`Beautiful! Successfully imported ${excelPreviewData.length} records into your live Firestore '${colName}' collection.`);
      setIsExcelImporterOpen(false);
      setExcelPreviewData([]);
      setExcelFile(null);
    } catch (err: any) {
      alert("Fail while saving items: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-68 bg-slate-900 text-white min-h-screen flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 pb-2">
            <h1 className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1 font-bold tracking-wider">SHRI GURUKRIPA VEHICLES</p>
          </div>
          <nav className="mt-8 space-y-1">
            <button 
              onClick={() => setActiveTab('fleets')}
              type="button"
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm font-semibold ${activeTab === 'fleets' ? 'bg-slate-800 border-l-4 border-orange-500 text-white font-bold' : 'text-slate-400 hover:bg-slate-850 hover:text-white'}`}
            >
              <Car size={18} /> Fleet Management
            </button>
            <button 
              onClick={() => setActiveTab('destinations')}
              type="button"
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm font-semibold ${activeTab === 'destinations' ? 'bg-slate-800 border-l-4 border-orange-500 text-white font-bold' : 'text-slate-400 hover:bg-slate-850 hover:text-white'}`}
            >
              <MapPin size={18} /> Destinations
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              type="button"
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm font-semibold ${activeTab === 'bookings' ? 'bg-slate-800 border-l-4 border-orange-500 text-white font-bold' : 'text-slate-400 hover:bg-slate-850 hover:text-white'}`}
            >
              <History size={18} /> Bookings Manager
            </button>
            <button 
              onClick={() => setActiveTab('home-preview')}
              type="button"
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm font-semibold ${activeTab === 'home-preview' ? 'bg-slate-800 border-l-4 border-orange-500 text-white font-bold' : 'text-slate-400 hover:bg-slate-850 hover:text-white'}`}
            >
              <Home size={18} /> Live Client View
            </button>
          </nav>
        </div>

        {/* Global actions at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold"
          >
            <Home size={18} /> Go To Website
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('is_mock_admin');
              auth.signOut();
              window.location.reload();
            }} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-semibold text-left"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-x-hidden max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-gray-900 capitalize">
              {activeTab === 'bookings' ? 'Secure Cab Bookings' : 
               activeTab === 'home-preview' ? 'Interactive Passenger Frontpage' :
               `${activeTab} Management`}
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">
              {activeTab === 'home-preview' 
                ? 'Test exact passenger visual workflows, reviews, map routing & booking dispatcher forms in real-time!'
                : 'Real-time status tracking, database seeding, and dispatcher controls'}
            </p>
          </div>
          
          <div className="flex gap-2.5 items-center flex-wrap">
            {activeTab !== 'bookings' && activeTab !== 'home-preview' && (
              <>
                <button
                  type="button"
                  disabled={isSeeding}
                  onClick={seedSampleData}
                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Database size={14} /> Seed Indian Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportType(activeTab as 'fleets' | 'destinations');
                    setExcelPreviewData([]);
                    setExcelFile(null);
                    setIsExcelImporterOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-750 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <FileSpreadsheet size={14} /> Bulk Excel/CSV Import
                </button>
              </>
            )}
            {activeTab !== 'home-preview' && (
              <button 
                onClick={() => openForm()}
                className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus size={18} /> Add New {activeTab === 'fleets' ? 'Fleet' : activeTab === 'destinations' ? 'Destination' : 'Booking'}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Views */}
        {activeTab === 'home-preview' ? (
          <div className="border-4 border-slate-300 rounded-3xl bg-white shadow-2xl overflow-hidden min-h-[85vh]">
            <div className="bg-slate-850 bg-slate-800 text-white p-3.5 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="ml-2 font-mono font-bold tracking-tight text-slate-300 select-none">shrigurukripa.in/passenger-preview</span>
              </div>
              <span className="bg-orange-600 text-white font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] animate-pulse">Admin Simulation Mode</span>
            </div>
            
            <div className="relative">
              <Hero />
              <ServiceCategories />
              <PopularDestinations />
              <FleetSection />
              <MapSection />
              <CustomerReviews />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  {activeTab === 'bookings' ? (
                    <tr>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Ref ID</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Contact Detail</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Trip Route</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Schedule</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Fare</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Image</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{activeTab === 'fleets' ? 'Category' : 'Name'}</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{activeTab === 'fleets' ? 'Models / Options' : 'Places & Highlights'}</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{activeTab === 'fleets' ? 'Configuration' : 'Distance Index'}</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Price / Fare</th>
                      <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeTab === 'bookings' ? (
                    bookings.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-mono font-black text-slate-800 text-sm">{item.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-gray-950 text-sm">{item.customerEmail}</div>
                          <div className="text-xs text-gray-500 font-bold">{item.customerPhone || 'No Phone'}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-semibold text-gray-400">From: <span className="text-gray-850 font-bold text-gray-800">{item.pickup}</span></div>
                          <div className="text-xs font-semibold text-gray-400">To: <span className="text-gray-850 font-bold text-gray-800">{item.drop}</span></div>
                          <div className="text-[10px] mt-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-extrabold inline-block">{item.tripType} - {item.serviceType || 'Taxi'}</div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-700">
                          <div>📅 {item.date}</div>
                          <div>⏰ {item.time}</div>
                          <div className="text-slate-400 font-bold mt-0.5">{item.passengers}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${
                            item.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            item.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                            item.status === 'completed' ? 'bg-blue-105 bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-4 font-black text-slate-900 text-sm">₹{item.fare}</td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          <button onClick={() => openForm(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    (activeTab === 'fleets' ? fleets : destinations).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <img src={item.image} alt="thumbnail img" className="w-16 h-12 object-cover rounded-xl shadow-sm border border-gray-100" referrerPolicy="no-referrer" />
                        </td>
                        <td className="p-4 font-bold text-gray-950 text-sm">{activeTab === 'fleets' ? item.category : item.name}</td>
                        <td className="p-4 text-xs text-gray-550 text-gray-600 font-semibold">{activeTab === 'fleets' ? item.models : item.desc || item.places}</td>
                        <td className="p-4 text-xs text-gray-600 font-bold">
                          {activeTab === 'fleets' ? (
                            <span>👥 {item.seats} Seats / 🧳 {item.luggage} Bags</span>
                          ) : (
                            <span>🗺️ {item.distance}</span>
                          )}
                        </td>
                        <td className="p-4 font-black text-gray-950 text-sm">{item.fare}</td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          <button onClick={() => openForm(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {(activeTab === 'fleets' ? fleets : activeTab === 'destinations' ? destinations : bookings).length === 0 && (
               <div className="p-12 text-center text-gray-400 font-semibold text-sm">No items found in Firestore. Seed default values or click 'Add New' to begin.</div>
            )}
          </div>
        )}

        {/* Modal Form Popup */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {formData.id ? 'Modify Existing' : 'Create New'} {activeTab === 'fleets' ? 'Fleet' : activeTab === 'destinations' ? 'Destination' : 'Cab Booking'}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold">Ensure accurate validation formats</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-650 font-bold hover:bg-gray-200/50 w-7 h-7 rounded-full flex items-center justify-center">✕</button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {activeTab === 'fleets' && (
                  <>
                    <label className="block text-xs font-bold uppercase text-gray-400">Category Name</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Category (e.g. Premium SUV)" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} required/>
                    
                    <label className="block text-xs font-bold uppercase text-gray-400">Available Indian Models</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Models (e.g. Toyota Innova Crysta, Mahindra XUV700)" value={formData.models || ''} onChange={e => setFormData({...formData, models: e.target.value})} required/>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Seats Count</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="number" placeholder="Seats" value={formData.seats || ''} onChange={e => setFormData({...formData, seats: Number(e.target.value)})} required/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Luggage Bags</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="number" placeholder="Bags" value={formData.luggage || ''} onChange={e => setFormData({...formData, luggage: Number(e.target.value)})} required/>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'destinations' && (
                  <>
                    <label className="block text-xs font-bold uppercase text-gray-400">Destination Name</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Destination Name (e.g. Jaipur (Pink City))" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                    
                    <label className="block text-xs font-bold uppercase text-gray-400">Visual Caption / Short Description</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Description (e.g. Heritage palaces & pink sandstone forts)" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} required/>
                    
                    <label className="block text-xs font-bold uppercase text-gray-400">Key Tourist Attractions & Places to Visit</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Places (e.g. Hawa Mahal, Amber Fort, City Palace)" value={formData.places || ''} onChange={e => setFormData({...formData, places: e.target.value})} required/>
                    
                    <label className="block text-xs font-bold uppercase text-gray-400">Distance Index from Hub</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Distance (e.g. 135 km from Jaipur)" value={formData.distance || ''} onChange={e => setFormData({...formData, distance: e.target.value})} required/>
                  </>
                )}

                {activeTab === 'bookings' && (
                  <>
                    <label className="block text-xs font-bold uppercase text-gray-400">Customer Email</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="email" placeholder="Customer Email address" value={formData.customerEmail || ''} onChange={e => setFormData({...formData, customerEmail: e.target.value})} required/>

                    <label className="block text-xs font-bold uppercase text-gray-400">Customer Contact Number</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="tel" placeholder="Contact number" value={formData.customerPhone || ''} onChange={e => setFormData({...formData, customerPhone: e.target.value})} required/>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Trip Type</label>
                        <select className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold" value={formData.tripType || 'One Way'} onChange={e => setFormData({...formData, tripType: e.target.value})} required>
                          <option value="One Way">One Way</option>
                          <option value="Round Trip">Round Trip</option>
                          <option value="Multi City">Multi City</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Service Package Type</label>
                        <select className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold" value={formData.serviceType || 'General Taxi Services'} onChange={e => setFormData({...formData, serviceType: e.target.value})} required>
                          <option value="Airport Transfers">Airport Transfers</option>
                          <option value="Rajasthan Tour Packages">Rajasthan Tour Packages</option>
                          <option value="Pilgrimage Tours">Pilgrimage Tours</option>
                          <option value="Corporate Travel">Corporate Travel</option>
                          <option value="Wedding Transportation">Wedding Transportation</option>
                          <option value="Luxury Car Rentals">Luxury Car Rentals</option>
                          <option value="General Taxi Services">General Taxi Services</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pickup Location</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="e.g. Jaipur Airport" value={formData.pickup || ''} onChange={e => setFormData({...formData, pickup: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Drop / Destination Location</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="e.g. Udaipur" value={formData.drop || ''} onChange={e => setFormData({...formData, drop: e.target.value})} required/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Date</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Time</label>
                        <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="time" value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} required/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Passenger Class</label>
                        <select className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold" value={formData.passengers || '1-2 Passengers'} onChange={e => setFormData({...formData, passengers: e.target.value})} required>
                          <option>1-2 Passengers</option>
                          <option>3-4 Passengers</option>
                          <option>5-7 Passengers</option>
                          <option>8+ Passengers (Traveller)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Dispatcher Booking Status</label>
                        <select className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold" value={formData.status || 'pending'} onChange={e => setFormData({...formData, status: e.target.value})} required>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab !== 'bookings' && (
                  <>
                    <label className="block text-xs font-bold uppercase text-gray-400">Price / Fare Model</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Fare details (e.g. ₹18/km or From ₹6,500)" value={formData.fare || ''} onChange={e => setFormData({...formData, fare: e.target.value})} required/>

                    <label className="block text-xs font-bold uppercase text-gray-400">Primary Landscape Image URL</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" placeholder="Image URL (e.g. Unsplash link)" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} required/>
                  </>
                )}

                {activeTab === 'bookings' && (
                  <>
                    <label className="block text-xs font-bold uppercase text-gray-400">Override Booking Fare Estimate (INR ₹)</label>
                    <input className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium" type="number" placeholder="Override amount in ₹" value={formData.fare || ''} onChange={e => setFormData({...formData, fare: Number(e.target.value)})} required/>
                  </>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-6">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition-all focus:outline-none">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl text-sm transition-all shadow-md focus:outline-none">Save Details</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Bulk Excel/CSV Importer Modal */}
        {isExcelImporterOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Bulk Excel/CSV Importer
                    </h3>
                    <p className="text-xs text-gray-500 font-bold">Import spreadsheet lists directly into your Firestore catalog</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsExcelImporterOpen(false);
                    setExcelPreviewData([]);
                    setExcelFile(null);
                  }} 
                  className="text-gray-400 hover:text-gray-650 font-bold hover:bg-gray-200/50 w-7 h-7 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Selector */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">1. Choose Database Destination</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setImportType('fleets');
                        setExcelPreviewData([]);
                      }}
                      className={`p-3.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        importType === 'fleets' 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Car size={16} /> Fleet Collection
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImportType('destinations');
                        setExcelPreviewData([]);
                      }}
                      className={`p-3.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        importType === 'destinations' 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin size={16} /> Destinations Collection
                    </button>
                  </div>
                </div>

                {/* Templates instruction */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-700">
                  <span className="font-extrabold text-orange-600 uppercase text-[10px] block mb-1">Standard Headers Format</span>
                  {importType === 'fleets' ? (
                    <p>Format expectations: <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">category</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">models</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">seats</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">luggage</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">fare</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">image</code></p>
                  ) : (
                    <p>Format expectations: <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">name</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">desc</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">places</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">distance</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">fare</code>, <code className="bg-slate-200/70 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">image</code></p>
                  )}
                  <p className="mt-1.5 text-slate-500 text-[11px]">Note: Capitals inside headers are automatically resolved. Fallbacks are automatically provided if some fields are absent.</p>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">2. Upload File (.xlsx, .xls, .csv)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50 hover:bg-emerald-50/20 rounded-2xl p-8 cursor-pointer transition-all text-center">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm font-extrabold text-gray-700">
                      {excelFile ? excelFile.name : 'Choose file or drag here'}
                    </span>
                    <span className="text-xs text-gray-400 font-bold mt-1">Accepts standard spreadsheets & CSV files</span>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      onChange={handleExcelUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Parsing Previews */}
                {excelPreviewData.length > 0 && (
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-slate-800 text-white p-3 text-xs font-bold flex justify-between items-center">
                      <span>Preview Parsed Records ({excelPreviewData.length})</span>
                      <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-extrabold uppercase animate-pulse">Parsed successfully</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 text-xs bg-gray-50 font-semibold text-gray-700">
                      {excelPreviewData.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-4">
                          <div className="truncate">
                            <span className="text-slate-400 font-mono text-[10px] mr-2">#{idx+1}</span>
                            <span className="text-slate-950 font-bold">{importType === 'fleets' ? item.category : item.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold block truncate mt-0.5">{importType === 'fleets' ? item.models : item.desc}</span>
                          </div>
                          <span className="shrink-0 text-orange-600 font-extrabold text-[11px] font-mono bg-orange-50 px-2 py-1 rounded">{item.fare}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 p-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsExcelImporterOpen(false);
                    setExcelPreviewData([]);
                    setExcelFile(null);
                  }} 
                  className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition-all focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  disabled={excelPreviewData.length === 0 || isImporting}
                  onClick={startExcelImport}
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl text-sm transition-all shadow-md focus:outline-none flex items-center gap-1.5 cursor-pointer"
                >
                  {isImporting ? 'Importing...' : `Import ${excelPreviewData.length || ''} Rows`} <Check size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
