import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, MapPin, Sparkles, Navigation, CheckCircle, ChevronRight, AlertCircle, Layers } from 'lucide-react';

// Elite Rajasthan tourist hotspots
const HOTSPOTS = [
  {
    id: 'jaipur',
    name: 'Jaipur (Pink City)',
    lat: 26.9124,
    lng: 75.7873,
    desc: 'UNESCO World Heritage site: Hawa Mahal, Amer Fort, and colorful bazaars',
    valKey: 'Jaipur City / Airport'
  },
  {
    id: 'udaipur',
    name: 'Udaipur (City of Lakes)',
    lat: 24.5854,
    lng: 73.7125,
    desc: 'The Venice of the East: Romantic Lake Pichola, Palace views, and gardens',
    valKey: 'Udaipur City'
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur (Blue City)',
    lat: 26.2389,
    lng: 73.0243,
    desc: 'Cobalt-blue home vistas under the watchful gaze of majestic Mehrangarh Fort',
    valKey: 'Jodhpur City'
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer (Golden City)',
    lat: 26.9157,
    lng: 70.9083,
    desc: 'Exotic Living Fort rising from Thar Desert, sunset dune camps, and safaris',
    valKey: 'Jaisalmer Desert Safari'
  },
  {
    id: 'ranthambore',
    name: 'Ranthambore Tiger Sanctuary',
    lat: 26.0173,
    lng: 76.5026,
    desc: 'Famed national park housing majestic Royal Bengal Tigers alongside 10th-century ruins',
    valKey: 'Ranthambore / Sawai Madhopur'
  },
  {
    id: 'ajmer',
    name: 'Ajmer Sharif Dargah',
    lat: 26.4499,
    lng: 74.6399,
    desc: 'The sacred Sufi shrine of Khwaja Moinuddin Chishti and beautiful Ana Sagar Lake',
    valKey: 'Ajmer City / Dargah'
  },
  {
    id: 'pushkar',
    name: 'Pushkar Lake & Temples',
    lat: 26.4897,
    lng: 74.5511,
    desc: 'Sacred lakeside ghats, ancient Brahma temple, and colorful desert caravans',
    valKey: 'Pushkar Devotional Base'
  },
  {
    id: 'kishangarh',
    name: 'Kishangarh (Marble City)',
    lat: 26.5746,
    lng: 74.8698,
    desc: 'The Marble City of India, famous for Kishangarh style painting (Bani Thani) and marble dump yard lake',
    valKey: 'Kishangarh City'
  },
  {
    id: 'bikaner',
    name: 'Bikaner (Camel Country)',
    lat: 28.0229,
    lng: 73.3119,
    desc: 'Known for Junagarh Fort, Karni Mata (Rat) temple, and delicious traditional Bikaneri bhujia',
    valKey: 'Bikaner City'
  },
  {
    id: 'mount_abu',
    name: 'Mount Abu (Hill Station)',
    lat: 24.5926,
    lng: 72.7156,
    desc: 'The only hill station in Rajasthan, featuring Dilwara Jain temples and scenic Nakki Lake',
    valKey: 'Mount Abu Hill Station'
  },
  {
    id: 'chittorgarh',
    name: 'Chittorgarh Fort',
    lat: 24.8879,
    lng: 74.6450,
    desc: 'India\'s largest fort complex, legendary for the tales of Queen Padmini and Vijay Stambha',
    valKey: 'Chittorgarh Fort'
  }
];

type LatLng = { lat: number; lng: number };
type RouteResult = { coords: [number, number][]; distanceMeters: number; durationSeconds: number };

// Free OpenStreetMap reverse geocoding
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    if (!res.ok) return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    const data = await res.json();
    if (data && data.display_name) {
      const parts = data.display_name.split(',').map((s: string) => s.trim());
      // Return a short version: first 3 elements
      return parts.slice(0, 3).join(', ');
    }
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  } catch (err) {
    return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  }
}

// Self-contained SVG pin icon
function createPinIcon(color: string, scale = 1): L.DivIcon {
  const size = Math.round(34 * scale);
  return L.divIcon({
    className: '',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
      <path d="M12 0C7.2 0 3.3 3.9 3.3 8.7c0 6.1 7.2 14.2 8.1 15.1.3.3.9.3 1.2 0 .9-.9 8.1-9 8.1-15.1C20.7 3.9 16.8 0 12 0z" fill="${color}" stroke="#ffffff" stroke-width="1"/>
      <circle cx="12" cy="8.7" r="3.4" fill="#ffffff"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

// Free routing via OSRM's public demo server
async function fetchRoute(origin: LatLng, destination: LatLng): Promise<RouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || !data.routes.length) return null;
    const route = data.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]]
    );
    return { coords, distanceMeters: route.distance, durationSeconds: route.duration };
  } catch (err) {
    console.error('OSRM routing failed:', err);
    return null;
  }
}

export default function MapSection() {
  const [userLocation, setUserLocation] = useState<LatLng | null>({ lat: 26.9124, lng: 75.7873 }); // Default to Jaipur
  const [pickupName, setPickupName] = useState('Jaipur City / Airport');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<any>(HOTSPOTS[1]); // Default to Udaipur
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; error?: string } | null>(null);
  const [bookingSynced, setBookingSynced] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activePinMode, setActivePinMode] = useState<'pickup' | 'drop'>('drop');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const hotspotMarkersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);
  
  const activePinModeRef = useRef<'pickup' | 'drop'>('drop');

  // Keep Ref in sync with activePinMode
  useEffect(() => {
    activePinModeRef.current = activePinMode;
  }, [activePinMode]);

  // Listen to outer events to change pin mode (e.g. from Booking Form map icon clicks)
  useEffect(() => {
    const handleSetPinMode = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.mode) {
        setActivePinMode(customEvent.detail.mode);
      }
    };
    window.addEventListener('set-map-pin-mode', handleSetPinMode);
    return () => window.removeEventListener('set-map-pin-mode', handleSetPinMode);
  }, []);

  // 1. Create the map ONCE, plus static hotspot markers and tile layers control.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.8, 74.5], // Centered to view entire Rajasthan
      zoom: 7,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    // Detailed Streets
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    });

    // Elegant Voyager
    const voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    // High-Res Satellite Map
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, and the GIS User Community',
      maxZoom: 19,
    });

    // Default tile
    streets.addTo(map);

    const baseMaps = {
      "Detailed Street Map": streets,
      "Classic Voyager Map": voyager,
      "Satellite Map": satellite,
    };

    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map);

    // Click anywhere on map to position current active pin
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setBookingSynced(false);
      const address = await reverseGeocode(lat, lng);
      
      if (activePinModeRef.current === 'pickup') {
        setUserLocation({ lat, lng });
        setPickupName(address);
      } else {
        setSelectedHotspot({
          id: 'custom',
          name: address,
          lat,
          lng,
          desc: 'Manually placed drop pin',
          valKey: address
        });
      }
    });

    // Hotspot static markers
    HOTSPOTS.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createPinIcon('#2563eb', 0.8), // static blue pins
        title: spot.name,
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:170px"><strong style="font-size:12px;color:#0f172a">${spot.name}</strong><p style="margin:4px 0 0;font-size:11px;color:#475569;line-height:1.4">${spot.desc}</p></div>`
      );

      marker.on('click', () => {
        setSelectedHotspot(spot);
        setBookingSynced(false);
      });

      hotspotMarkersRef.current[spot.id] = marker;
    });

    map.fitBounds(L.latLngBounds(HOTSPOTS.map((s) => [s.lat, s.lng] as [number, number])), {
      padding: [40, 40],
    });

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    const resizeTimer = setTimeout(() => map.invalidateSize(), 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      hotspotMarkersRef.current = {};
      startMarkerRef.current = null;
      destMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, []);

  // 2. Keep the "start point" marker (pickup) in sync & draggable.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const pos = userLocation || { lat: 26.9124, lng: 75.7873 };

    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
    }

    const marker = L.marker([pos.lat, pos.lng], {
      icon: createPinIcon('#ea4335', 1.1),
      draggable: true,
      title: 'Drag me to set pickup location',
    }).addTo(map);

    marker.bindPopup(
      `<div style="min-width:150px"><strong style="font-size:12px;color:#0f172a">Pickup Point (Draggable)</strong><p style="margin:4px 0 0;font-size:11px;color:#475569">${pickupName}</p></div>`
    );

    marker.on('dragend', async (e) => {
      const newLatLng = e.target.getLatLng();
      const lat = newLatLng.lat;
      const lng = newLatLng.lng;
      setUserLocation({ lat, lng });
      const address = await reverseGeocode(lat, lng);
      setPickupName(address);
      setBookingSynced(false);
    });

    startMarkerRef.current = marker;
  }, [userLocation, pickupName]);

  // 3. Keep the "destination point" marker (drop) in sync & draggable.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
    }

    const pos = { lat: selectedHotspot.lat, lng: selectedHotspot.lng };

    const marker = L.marker([pos.lat, pos.lng], {
      icon: createPinIcon('#f97316', 1.25),
      draggable: true,
      title: 'Drag me to set drop location',
    }).addTo(map);

    marker.bindPopup(
      `<div style="min-width:150px"><strong style="font-size:12px;color:#0f172a">Drop Point (Draggable)</strong><p style="margin:4px 0 0;font-size:11px;color:#475569">${selectedHotspot.name}</p></div>`
    );

    marker.on('dragend', async (e) => {
      const newLatLng = e.target.getLatLng();
      const lat = newLatLng.lat;
      const lng = newLatLng.lng;
      const address = await reverseGeocode(lat, lng);
      setSelectedHotspot({
        id: 'custom',
        name: address,
        lat,
        lng,
        desc: 'Manually dragged drop pin',
        valKey: address
      });
      setBookingSynced(false);
    });

    destMarkerRef.current = marker;
  }, [selectedHotspot]);

  // 4. Recompute the free OSRM route whenever pins move.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    setRouteInfo(null);

    const origin = userLocation || { lat: 26.9124, lng: 75.7873 };
    const destination = { lat: selectedHotspot.lat, lng: selectedHotspot.lng };

    fetchRoute(origin, destination).then((result) => {
      if (cancelled) return;

      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }

      if (!result) {
        setRouteInfo({ distance: '—', duration: '—', error: 'Route computation error.' });
        return;
      }

      const line = L.polyline(result.coords, {
        color: '#f97316',
        weight: 6,
        opacity: 0.85,
      }).addTo(map);
      routeLineRef.current = line;

      // Pan viewport boundaries to fit route line
      map.fitBounds(line.getBounds(), { padding: [50, 50] });

      const km = (result.distanceMeters / 1000).toFixed(1);
      const totalMins = Math.round(result.durationSeconds / 60);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      const durationStr = hrs > 0 ? `${hrs} hrs ${mins} mins` : `${totalMins} mins`;

      setRouteInfo({ distance: `${km} km`, duration: durationStr });
    });

    return () => {
      cancelled = true;
    };
  }, [userLocation, selectedHotspot]);

  // Detect and indicate current geolocation values
  const locateUser = () => {
    setLoadingLocation(true);
    setLocationError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLoadingLocation(false);
          setBookingSynced(false);
          const address = await reverseGeocode(lat, lng);
          setPickupName(address);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
          setLocationError('Could not access your location. Defaulting to Jaipur.');
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    } else {
      setLoadingLocation(false);
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Dispatch custom event to Booking Form state
  const handleBookSelectedRoute = () => {
    const event = new CustomEvent('select-custom-route', {
      detail: {
        pickup: pickupName,
        drop: selectedHotspot.valKey,
        serviceType: 'Rajasthan Tour Packages'
      }
    });
    window.dispatchEvent(event);
    setBookingSynced(true);

    const formElement = document.getElementById('booking-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="location" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Detailed Route Planner
          </h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-base font-semibold mt-2">
            Click on the map, select preset hotspots, or drag the red and orange pins to set custom pickup and drop locations. Choose between Detailed Streets, Classic, or Satellite viewports!
          </p>
        </div>

        {/* Master Flex Grid panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Controls & Metrics Side bar panel */}
          <div className="lg:col-span-4 flex flex-col bg-white border border-slate-150 rounded-3xl p-6 shadow-xl space-y-5">

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Manual Pin Placement</span>
              <h3 className="text-lg font-black text-slate-900 leading-none">Map Pin Mode</h3>

              {/* Pin Selection Mode Toggle */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 space-y-1.5">
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500">Click Map to set:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePinMode('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePinMode === 'pickup'
                        ? 'bg-slate-900 text-white shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    🔴 Pickup Pin
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePinMode('drop')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePinMode === 'drop'
                        ? 'bg-slate-900 text-white shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    🟠 Drop Pin
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Pickup Location</span>
              
              <button
                onClick={locateUser}
                disabled={loadingLocation}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl shadow-sm font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-75 cursor-pointer mb-2"
              >
                <LocateFixed size={15} className={loadingLocation ? "animate-spin text-orange-400" : "text-orange-400"} />
                {loadingLocation ? 'Locating Coordinate...' : 'Detect GPS Location'}
              </button>

              {locationError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-semibold text-amber-800">{locationError}</p>
                </div>
              )}

              {userLocation && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-xl flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-emerald-550 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold text-emerald-850 text-left">
                    <span className="font-extrabold block text-emerald-900 leading-none mb-1 text-[10px] uppercase">Selected Pickup</span>
                    <p className="text-slate-800 leading-tight">{pickupName}</p>
                    <span className="text-[9px] text-slate-450 block mt-1">Coords: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E</span>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Drop Location</span>
              
              <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl flex items-start gap-2.5">
                <MapPin size={15} className="text-orange-500 mt-0.5 shrink-0" />
                <div className="text-xs font-semibold text-orange-850 text-left">
                  <span className="font-extrabold block text-orange-900 leading-none mb-1 text-[10px] uppercase">Selected Drop</span>
                  <p className="text-slate-800 leading-tight">{selectedHotspot.name}</p>
                  {selectedHotspot.desc && (
                    <p className="text-[10px] text-slate-500 font-medium leading-normal mt-1 italic">{selectedHotspot.desc}</p>
                  )}
                  <span className="text-[9px] text-slate-450 block mt-1">Coords: {selectedHotspot.lat.toFixed(4)}°N, {selectedHotspot.lng.toFixed(4)}°E</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Quick Sights Picker list */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Quick Destination Picker</span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedHotspot(spot);
                      setBookingSynced(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg border transition-all text-[11px] truncate flex items-center gap-1.5 ${
                      selectedHotspot.id === spot.id
                        ? 'border-orange-500 bg-orange-50 text-slate-900 font-extrabold'
                        : 'border-slate-100 hover:bg-slate-50 bg-white text-slate-600 font-semibold'
                    }`}
                  >
                    <MapPin size={11} className={selectedHotspot.id === spot.id ? "text-orange-500" : "text-slate-400"} />
                    <span className="truncate">{spot.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Computed distance card overlay */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Route Stats</span>
                <span className="text-[9px] bg-orange-500 text-slate-950 font-black px-1.5 py-0.5 rounded leading-none uppercase">Computed</span>
              </div>

              {routeInfo ? (
                routeInfo.error ? (
                  <div className="text-red-400 font-extrabold text-xs flex items-center gap-1.5 py-2">
                    <AlertCircle size={14} /> {routeInfo.error}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 divide-x divide-slate-800 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Distance</span>
                      <span className="text-base font-black text-white">{routeInfo.distance}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Drive Time</span>
                      <span className="text-base font-black text-white">{routeInfo.duration}</span>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-slate-500 text-xs font-bold py-1 animate-pulse">Calculating road overlay...</div>
              )}

              <hr className="border-slate-850 border-slate-800 my-1" />

              <button
                onClick={handleBookSelectedRoute}
                className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 p-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-98"
              >
                {bookingSynced ? (
                  <>
                    <CheckCircle size={14} /> Synced with Desk!
                  </>
                ) : (
                  <>
                    <Navigation size={14} className="fill-slate-950" /> Sync with Booking Form
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Free Leaflet map viewport */}
          <div className="lg:col-span-8 relative w-full h-[400px] lg:h-auto min-h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white z-0">
            <div ref={mapContainerRef} className="absolute inset-0" />
            
            {/* Overlay mode helper text */}
            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider z-[1000] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              {activePinMode === 'pickup' ? '🔴 Click map to place Pickup Pin' : '🟠 Click map to place Drop Pin'}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
