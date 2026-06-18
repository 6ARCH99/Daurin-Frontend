import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Search, Navigation2, Filter, MapPin, X, ChevronRight, Clock, Phone } from 'lucide-react';
import { api } from '../services/api';
import Reveal from '../components/motion/Reveal.jsx';
import RevealGrid from '../components/motion/RevealGrid.jsx';

// Simple Interactive Map Component using OpenStreetMap tiles
const InteractiveMap = ({ dropPoints, userLocation, onMarkerClick, selectedPoint, onMapReady }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const LRef = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const routeRef = useRef(null); // store route polyline
  // Initialize map
  useEffect(() => {
    
    let mounted = true;
    
    const initMap = async () => {
      try {
        setIsLoading(true);
        
        // Dynamic import leaflet
        let L;
        try {
          const leaflet = await import('leaflet');
          L = leaflet.default || leaflet;
        } catch (importErr) {
          console.warn('Leaflet not available, using fallback', importErr);
          if (mounted) {
            setMapError('Peta tidak tersedia saat ini');
            setIsLoading(false);
          }
          return;
        }
        
        if (!mounted || !mapRef.current) return;

        // Calculate center
        let center = [-6.2088, 106.8456]; // Default Jakarta

        // Create map
        const map = L.map(mapRef.current).setView(center, 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        if (mounted) {
          mapInstanceRef.current = map;
          LRef.current = L;
          setIsLoading(false);
          if (onMapReady) onMapReady(map);
        }
      } catch (err) {
        console.error('Failed to load map:', err);
        if (mounted) {
          setMapError('Gagal memuat peta. Silakan coba lagi.');
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          LRef.current = null;
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []); // Only init once - prevent white screen from re-renders

  // Effect to update markers and view when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    // Update center if selected point or user location changed
    let newCenter = null;
    let newZoom = null;
    
    // If a route should be displayed (selected point + user location), draw a polyline
    if (selectedPoint?.lat && selectedPoint?.lng && userLocation?.lat && userLocation?.lng) {
      // Remove previous route if any
      if (routeRef.current) {
        map.removeLayer(routeRef.current);
        routeRef.current = null;
      }
      const latlngs = [
        [userLocation.lat, userLocation.lng],
        [selectedPoint.lat, selectedPoint.lng],
      ];
      routeRef.current = L.polyline(latlngs, { color: '#EBA332', weight: 4 }).addTo(map);
      // Adjust view to include both points and route
      map.fitBounds(routeRef.current.getBounds(), { padding: [50, 50] });
    }

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => {
      try {
        map.removeLayer(marker);
      } catch {
        // Ignore
      }
    });
    markersRef.current = [];

    // Add user location marker
    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="background-color: #1A3022; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      try {
        const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('Lokasi Anda');
        markersRef.current.push({ marker: userMarker, data: null });
      } catch (e) {
        console.warn('Failed to add user marker:', e);
      }
    }

    // Add drop point markers
    if (dropPoints && Array.isArray(dropPoints)) {
      dropPoints.forEach((dp) => {
        if (dp?.lat && dp?.lng) {
          const isSelected = selectedPoint?.id === dp.id;
          try {
            const marker = L.marker([dp.lat, dp.lng], {
              icon: L.divIcon({
                className: 'custom-drop-marker',
                html: `<div style="background-color: ${isSelected ? '#EBA332' : '#68A67D'}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 24],
              })
            })
              .addTo(map)
              .bindPopup(`<b>${dp.name || 'Drop Point'}</b><br/>${dp.address || ''}`);
            
            marker.on('click', () => onMarkerClick && onMarkerClick(dp));
            markersRef.current.push({ marker, data: dp });
          } catch (markerErr) {
            console.warn('Failed to create marker:', markerErr);
          }
        }
      });
    }
  }, [dropPoints, userLocation, selectedPoint, onMarkerClick]);

  if (mapError) {
    return (
      <div className="w-full h-[500px] bg-red-50 rounded-[24px] border border-red-200 flex flex-col items-center justify-center gap-3 p-6">
        <MapPin className="w-12 h-12 text-red-400" strokeWidth={1.5} />
        <p className="font-display text-xl font-semibold text-red-700">Gagal Memuat Peta</p>
        <p className="font-sans text-sm text-red-500">{mapError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-[24px] overflow-hidden border border-gray-200 bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 z-[400] flex flex-col items-center justify-center gap-3 bg-gray-50">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1A3022] rounded-full animate-[spin_1s_linear_infinite]" />
          <p className="text-sm text-gray-500">Memuat peta...</p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      <button
        type="button"
        onClick={() => {
          if (userLocation?.lat && userLocation?.lng && mapInstanceRef.current) {
            mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
          } else if (document.getElementById('btn-my-location')) {
            document.getElementById('btn-my-location').click();
          }
        }}
        className="absolute bottom-6 right-6 z-[400] bg-white p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-transform hover:scale-105 active:scale-95"
        title="Pusatkan ke lokasi saya"
      >
        <Navigation2 className="w-6 h-6 text-[#1A3022]" strokeWidth={2.5} />
      </button>
    </div>
  );
};

const MATERIALS = [
  { id: 'all', label: 'Semua', api: '' },
  { id: 'plastic', label: 'Plastik', api: 'plastik' },
  { id: 'paper', label: 'Kertas', api: 'kertas' },
  { id: 'metal', label: 'Logam', api: 'logam' },
  { id: 'glass', label: 'Kaca', api: 'kaca' },
  { id: 'electronic', label: 'Elektronik', api: 'elektronik' },
];

const normalizeMaterials = (materials) => {
  if (Array.isArray(materials)) {
    return materials.map((material) => String(material).trim()).filter(Boolean);
  }

  if (typeof materials === 'string') {
    return materials.split(',').map((material) => material.trim()).filter(Boolean);
  }

  return [];
};

const DropPointPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [viewMode, setViewMode] = useState('daftar');
  const [dropPoints, setDropPoints] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    // #region debug-point E:window-errors
    const report = (kind, payload) => fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'drop-point-blank-screen',
        runId: 'pre-fix',
        hypothesisId: 'E',
        location: 'DropPointPage.jsx:window',
        msg: `[DEBUG] ${kind}`,
        data: payload,
        ts: Date.now(),
      }),
    }).catch(() => {});
    const onError = (event) => report('window-error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
    const onRejection = (event) => report('unhandled-rejection', {
      reason: String(event.reason?.message || event.reason || 'unknown'),
    });
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    report('page-mounted', { viewMode: 'daftar' });
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
    // #endregion
  }, []);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const mat = MATERIALS.find((m) => m.label === activeFilter);
      const res = await api.getDropPoints({
        q: searchTerm.trim() || undefined,
        material: mat?.api || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
      });
      // #region debug-point A:api-shape
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'drop-point-blank-screen',
          runId: 'pre-fix',
          hypothesisId: 'A',
          location: 'DropPointPage.jsx:fetchPoints-success',
          msg: '[DEBUG] Drop point payload received',
          data: {
            isArray: Array.isArray(res.data),
            count: Array.isArray(res.data) ? res.data.length : -1,
            firstMaterialsType: Array.isArray(res.data) && res.data[0]
              ? typeof res.data[0].materials
              : 'missing',
            firstMaterialsIsArray: Array.isArray(res.data) && res.data[0]
              ? Array.isArray(res.data[0].materials)
              : false,
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setDropPoints(res.data || []);
    } catch (err) {
      // #region debug-point C:api-error
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'drop-point-blank-screen',
          runId: 'pre-fix',
          hypothesisId: 'C',
          location: 'DropPointPage.jsx:fetchPoints-error',
          msg: '[DEBUG] Drop point request failed',
          data: { message: err.message },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setError(err.message);
      setDropPoints([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilter, coords]);

  useEffect(() => {
    // #region debug-point B:state-shape
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'drop-point-blank-screen',
        runId: 'pre-fix',
        hypothesisId: 'B',
        location: 'DropPointPage.jsx:state',
        msg: '[DEBUG] Drop point state updated',
        data: {
          loading,
          error,
          count: dropPoints.length,
          firstMaterialsType: dropPoints[0] ? typeof dropPoints[0].materials : 'missing',
          firstMaterialsIsArray: dropPoints[0] ? Array.isArray(dropPoints[0].materials) : false,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [dropPoints, loading, error]);

  useEffect(() => {
    // Debounce the fetch to avoid rapid re-renders
    const t = setTimeout(() => {
      fetchPoints();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchPoints]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung browser ini.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError('Izin lokasi ditolak.')
    );
  };

  const [distanceToPoint, setDistanceToPoint] = useState(null);
  const handlePointSelect = (point) => {
    setSelectedPoint(point);
    setViewMode('peta');
    // calculate distance if we have user location
    if (coords?.lat && coords?.lng && point?.lat && point?.lng) {
      const R = 6371; // km
      const dLat = ((point.lat - coords.lat) * Math.PI) / 180;
      const dLng = ((point.lng - coords.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords.lat * Math.PI) / 180) *
          Math.cos((point.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      setDistanceToPoint(d.toFixed(2));
    } else {
      setDistanceToPoint(null);
    }
  };


  const mapsUrl = (dp) =>
    `https://www.google.com/maps/dir/?api=1&destination=${dp.lat},${dp.lng}`;

  return (
    <div className="app-page text-left">
      <div className="app-page-inner max-w-7xl">
        <Reveal className="app-page-header">
          <h1 className="font-display text-[2.25rem] font-semibold text-[#1A3022] tracking-tight leading-tight mb-2">
            Drop Point Finder
          </h1>
          <p className="font-sans text-sm font-normal text-gray-500">
            Temukan titik pengumpulan sampah terdekat dari lokasimu dengan mudah.
          </p>
        </Reveal>

        {error && (
          <p className="mb-4 font-sans text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <Reveal delay={100} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, alamat, atau wilayah..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-[#1A3022]/10 font-sans text-sm font-normal text-[#1A3022] placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            id="btn-my-location"
            type="button"
            onClick={useMyLocation}
            className="bg-[#1A3022] text-white px-8 py-4 rounded-2xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2d4a37] shrink-0 shadow-sm"
          >
            <Navigation2 className="w-5 h-5" strokeWidth={2.5} />
            Lokasi Saat Ini
          </button>
        </Reveal>

        <Reveal delay={200} className="mb-8">
          <p className="font-sans text-xs font-semibold text-[#1A3022] mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2D6A4F]" strokeWidth={2.5} />
            Filter Berdasarkan Material:
          </p>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveFilter(m.label)}
                className={`px-5 py-2.5 rounded-full font-sans text-sm font-semibold border transition-all ${
                  activeFilter === m.label
                    ? 'bg-[#1A3022] text-white border-[#1A3022]'
                    : 'bg-white text-[#1A3022] border-gray-200 hover:border-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={300} className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[2]">
            <div className="flex justify-between items-center mb-6">
              <p className="font-sans text-sm font-normal text-gray-500">
                {loading ? 'Memuat…' : `${dropPoints.length} Drop Point ditemukan`}
              </p>
              <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('daftar')}
                  className={`px-4 py-2 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    viewMode === 'daftar' ? 'bg-[#1A3022] text-white' : 'text-gray-500'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Daftar
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('peta')}
                  className={`px-4 py-2 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    viewMode === 'peta' ? 'bg-[#1A3022] text-white' : 'text-gray-500'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Peta
                </button>
              </div>
            </div>

            {viewMode === 'daftar' ? (
              <RevealGrid className="grid grid-cols-1 gap-4">
                {dropPoints.map((dp) => (
                  <div key={dp.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-lg font-semibold text-[#1A3022]">{dp.name}</h3>
                          <span
                            className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded ${
                              dp.isOpen ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-100'
                            }`}
                          >
                            {dp.isOpen ? 'Buka' : 'Tutup'}
                          </span>
                        </div>
                        <p className="font-sans text-xs font-normal text-gray-500">{dp.address}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-sans text-sm font-semibold text-[#EBA332]">
                          ⭐ {dp.rating}
                        </p>
                        <p className="font-sans text-xs text-gray-400">({dp.reviewCount} ulasan)</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-sans text-[10px] text-gray-400">Jam Buka</p>
                          <p className="font-sans text-xs font-semibold text-[#1A3022]">{dp.openTime} - {dp.closeTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-sans text-[10px] text-gray-400">Telepon</p>
                          <p className="font-sans text-xs font-semibold text-[#1A3022]">{dp.phone || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-sans text-[10px] text-gray-400">Jarak</p>
                          <p className="font-sans text-xs font-semibold text-[#1A3022]">{dp.distanceKm != null ? `${dp.distanceKm} km` : '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-sans text-[10px] text-gray-400">Kota</p>
                          <p className="font-sans text-xs font-semibold text-[#1A3022]">{dp.city}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <p className="font-sans text-[10px] font-bold uppercase text-gray-400 mb-2">
                          Material yang Diterima:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {normalizeMaterials(dp.materials).map((mat, i) => (
                            <span
                              key={i}
                              className="font-sans text-[10px] font-semibold bg-[#F5F5F0] text-[#1A3022] px-3 py-1 rounded-full"
                            >
                              {mat.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedPoint(dp);
                          setViewMode('peta');
                        }}
                        className="flex-1 bg-[#1A3022] text-white py-3 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2d4a37]"
                      >
                        <MapPin className="w-4 h-4" />
                        Lihat di Peta
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPoint(dp);
                          setViewMode('peta');
                        }}
                        className="flex-1 bg-white text-[#1A3022] border-2 border-[#1A3022] py-3 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
                      >
                        <Navigation2 className="w-4 h-4" />
                        Petunjuk Arah
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && dropPoints.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="font-sans text-sm text-gray-400">Tidak ada drop point ditemukan.</p>
                    <p className="font-sans text-xs text-gray-300 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  </div>
                )}
              </RevealGrid>
            ) : (
              <InteractiveMap 
                dropPoints={dropPoints} 
                userLocation={coords}
                onMarkeronClick={(dp) => {
                  setSelectedPoint(dp);
                  setViewMode('peta');
                }}
                selectedPoint={selectedPoint}
              />
            )}
          </div>

          {viewMode === 'daftar' && (
            <div className="flex-1">
              <div className="bg-gradient-to-br from-[#68A67D] to-[#1A3022] rounded-[24px] p-8 text-white sticky top-24">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/80">
                    {selectedPoint ? 'Drop Point Terpilih' : 'Drop Point Terdekat'}
                  </p>
                </div>
                
                {selectedPoint ? (
                  <>
                    <h2 className="font-display text-2xl font-semibold mb-2">{selectedPoint.name}</h2>
                    <p className="font-sans text-sm text-white/80 mb-4">{selectedPoint.address}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ {selectedPoint.rating}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedPoint.city}
                      </span>
                      {distanceToPoint && (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                          {distanceToPoint} km
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPoint(null)}
                        className="flex-1 bg-white/20 text-white py-3 rounded-xl font-sans text-sm font-semibold hover:bg-white/30"
                      >
                        Tutup
                      </button>
                      <a
                        href={mapsUrl(selectedPoint)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-white text-[#1A3022] py-3 rounded-xl font-sans text-sm font-semibold text-center hover:bg-gray-100"
                      >
                        Petunjuk Arah
                      </a>
                    </div>
                  </>
                ) : dropPoints[0] ? (
                  <>
                    <h2 className="font-display text-2xl font-semibold mb-4">{dropPoints[0].name}</h2>
                    <div className="space-y-3 mb-8 font-sans text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span>{dropPoints[0].openTime} - {dropPoints[0].closeTime}</span>
                      </div>
                      {dropPoints[0].distanceKm != null && (
                        <div className="flex items-center gap-2">
                          <Navigation2 className="w-4 h-4 text-white/60" />
                          <span>{dropPoints[0].distanceKm} km dari lokasimu</span>
                        </div>
                      )}
                      <p className="leading-relaxed opacity-95">{dropPoints[0].address}</p>
                    </div>
                    <a
                      href={mapsUrl(dropPoints[0])}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center bg-white text-[#1A3022] py-4 rounded-2xl font-sans text-sm font-semibold hover:bg-gray-100"
                    >
                      Petunjuk Arah
                    </a>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Tidak ada drop point terdekat</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
};

export default DropPointPage;
