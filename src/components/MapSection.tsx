import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, MapPin, Sparkles, Navigation, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

// Elite Rajasthan tourist hostspots
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
];

type LatLng = { lat: number; lng: number };
type RouteResult = { coords: [number, number][]; distanceMeters: number; durationSeconds: number };

// Self-contained SVG pin icon — no external image files, no API key.
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

// Free routing via OSRM's public demo server — no API key required.
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
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<typeof HOTSPOTS[0]>(HOTSPOTS[1]); // Default to Udaipur
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; error?: string } | null>(null);
  const [bookingSynced, setBookingSynced] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const hotspotMarkersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  // 1. Create the map ONCE, plus all the static hotspot markers.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.8, 74.5], // Centered to view entire Rajasthan
      zoom: 7,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    HOTSPOTS.forEach((spot) => {
      const isSelected = spot.id === selectedHotspot.id;
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createPinIcon(isSelected ? '#f97316' : '#2563eb', isSelected ? 1.25 : 0.95),
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
      routeLineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Re-style hotspot pins whenever the selection changes.
  useEffect(() => {
    Object.entries(hotspotMarkersRef.current).forEach(([id, marker]: [string, L.Marker]) => {
      const isSelected = id === selectedHotspot.id;
      marker.setIcon(createPinIcon(isSelected ? '#f97316' : '#2563eb', isSelected ? 1.25 : 0.95));
    });
  }, [selectedHotspot]);

  // 3. Keep the "start point" marker in sync with GPS / default Jaipur base.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const pos = userLocation || { lat: 26.9124, lng: 75.7873 };

    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
    }

    const marker = L.marker([pos.lat, pos.lng], {
      icon: createPinIcon('#ea4335', 1.1),
      title: userLocation ? 'Your GPS Location' : 'Starting Point (Jaipur Base)',
    }).addTo(map);

    marker.bindPopup(
      `<div style="min-width:150px"><strong style="font-size:12px;color:#0f172a">${userLocation ? 'Your Located Coordinates' : 'Jaipur Airport HQ'}</strong><p style="margin:4px 0 0;font-size:11px;color:#475569">Route starting point reference</p></div>`
    );

    startMarkerRef.current = marker;

    if (userLocation) {
      map.panTo([pos.lat, pos.lng]);
    }
  }, [userLocation]);

  // 4. Recompute the free OSRM route whenever the start point or destination changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    setRouteInfo(null); // shows "Calculating road overlay..." while in flight

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

  // Detect and indicate current geolocation coord values
  const locateUser = () => {
    setLoadingLocation(true);
    setLocationError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
          setBookingSynced(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation(null);
          setLoadingLocation(false);
          setLocationError('Could not access your location. Defaulting to Jaipur Tourist Hub.');
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    } else {
      setUserLocation(null);
      setLoadingLocation(false);
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Dispatch custom event values straight to Booking Form state
  const handleBookSelectedRoute = () => {
    const pickupVal = userLocation
      ? `My Location (Real-time GPS Coords)`
      : 'Jaipur City / Airport';

    const event = new CustomEvent('select-custom-route', {
      detail: {
        pickup: pickupVal,
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
    <section id="location" className="py-24 bg-slate-50 border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
            <Sparkles size={11} className="text-orange-500 animate-pulse" /> Live Travel Map
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Tourist Hotspots & Routes
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-semibold mt-2">
            Interact with our customized live map to plan scenic outstation tourist packages. Compute real-time routes directly from your current location!
          </p>
        </div>

        {/* Master Flex Grid panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Controls & Metrics Side bar panel */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-slate-150 rounded-3xl p-6 shadow-xl space-y-6">

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Step 1 — Geolocation Pin</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Start Point Option</h3>

              <button
                onClick={locateUser}
                disabled={loadingLocation}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-2xl shadow-md font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-75 cursor-pointer"
              >
                <LocateFixed size={16} className={loadingLocation ? "animate-spin text-orange-400" : "text-orange-400"} />
                {loadingLocation ? 'Locating Coordinate...' : userLocation ? 'Current Location Active' : 'Detect My Location'}
              </button>

              {locationError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold text-amber-800">
                    <span className="font-extrabold block text-amber-900 leading-none mb-1">Location Notice</span>
                    {locationError}
                  </div>
                </div>
              )}

              {userLocation ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                  <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold text-emerald-850">
                    <span className="font-extrabold block text-emerald-900 leading-none mb-1">Located Successfully</span>
                    Coords: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
                  </div>
                </div>
              ) : (
                !locationError && (
                  <p className="text-slate-550 text-[11px] leading-relaxed font-semibold">
                    Defaulting to <b className="text-slate-700">Jaipur State Capital</b>. Tap above to track your GPS position.
                  </p>
                )
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Hotspot details dropdown */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Step 2 — Destination Spot</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Target Sights</h3>

              <div className="space-y-2">
                {HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedHotspot(spot);
                      setBookingSynced(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between gap-3 ${
                      selectedHotspot.id === spot.id
                        ? 'border-orange-500 bg-orange-50/40 text-slate-900 font-extrabold shadow-sm ring-1 ring-orange-500/20'
                        : 'border-slate-100 hover:bg-slate-50 bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <MapPin size={14} className={selectedHotspot.id === spot.id ? "text-orange-500" : "text-slate-400"} />
                      <span className="truncate">{spot.name}</span>
                    </div>
                    <ChevronRight size={12} className={selectedHotspot.id === spot.id ? "text-orange-500" : "text-slate-400"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Computed distance card overlay */}
            <div className="bg-slate-900 text-white rounded-2xl p-4.5 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Driving Overlay Stats</span>
                <span className="text-[10px] bg-orange-600 text-slate-950 font-black px-2 py-0.5 rounded leading-none uppercase">Computed Route</span>
              </div>

              {routeInfo ? (
                routeInfo.error ? (
                  <div className="text-red-400 font-extrabold text-xs flex items-center gap-1.5 py-2">
                    <AlertCircle size={14} /> {routeInfo.error}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 divide-x divide-slate-800 text-center">
                    <div>
                      <span className="text-[9px] text-slate-450 uppercase font-black block">Est. Distance</span>
                      <span className="text-base sm:text-lg font-black text-orange-450 text-white">{routeInfo.distance}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 uppercase font-black block">Drive Time</span>
                      <span className="text-base sm:text-lg font-black text-orange-450 text-white">{routeInfo.duration}</span>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-slate-500 text-xs font-bold py-1 animate-pulse">Calculating road overlay...</div>
              )}

              <hr className="border-slate-800/80 my-2" />

              <button
                onClick={handleBookSelectedRoute}
                className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 p-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                {bookingSynced ? (
                  <>
                    <CheckCircle size={14} /> Synced with Booking Desk!
                  </>
                ) : (
                  <>
                    <Navigation size={14} className="fill-slate-950" /> Instant Book This Route
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Free, key-free Leaflet + OSRM map viewport */}
          <div className="lg:col-span-8 relative w-full h-[520px] lg:h-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
            <div ref={mapContainerRef} className="absolute inset-0" />
          </div>

        </div>

      </div>
    </section>
  );
}
