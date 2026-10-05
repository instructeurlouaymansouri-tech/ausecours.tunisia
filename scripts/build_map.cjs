const fs = require('fs');

const hospitalMapCode = `import React, { useState, useMemo } from 'react';
import { Language, Hospital } from '../types';
import { translations } from '../i18n/translations';
import { hospitalsData } from '../data/hospitalsData';
import { 
  MapPin, 
  PhoneCall, 
  Search, 
  Filter, 
  Building2, 
  Flame, 
  Baby, 
  Crosshair
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

interface HospitalMapPageProps {
  currentLang: Language;
}

const createGtaHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-hospital-marker',
    html: \`
      <div style="
        width: 38px;
        height: 38px;
        background: radial-gradient(circle, #ff1a35 0%, #b91c1c 100%);
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 20px #ff1a35, 0 0 35px rgba(255, 26, 53, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 900;
        font-family: sans-serif;
        font-size: 19px;
        cursor: pointer;
        animation: emergency-pulse 2s infinite ease-in-out;
      ">
        H
      </div>
    \`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

const createUserAvatarIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: \`
      <div style="
        width: 44px;
        height: 44px;
        border: 3px solid #00f0ff;
        border-radius: 50%;
        box-shadow: 0 0 25px #00f0ff;
        overflow: hidden;
        background: #000;
        cursor: pointer;
      ">
        <img src="/assets/assistant-avatar.jpg" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    \`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export const HospitalMapPage: React.FC<HospitalMapPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('All');
  const [selectedFacilityType, setSelectedFacilityType] = useState('All');
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.6781, 10.0963]);
  const [mapZoom, setMapZoom] = useState(7);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const userCoords: [number, number] = [36.8065, 10.1815];

  const governorates = [
    'All', 'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
    'Beja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax',
    'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const filteredHospitals = useMemo(() => {
    return hospitalsData
      .map(h => ({
        ...h,
        distanceKm: calculateDistance(userCoords[0], userCoords[1], h.lat, h.lng)
      }))
      .filter(h => {
        const matchesGov = selectedGov === 'All' || h.governorate.toLowerCase() === selectedGov.toLowerCase();
        const matchesType = selectedFacilityType === 'All' || h.type === selectedFacilityType;
        const matchesSearch = 
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.nameAr.includes(searchQuery) ||
          h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.governorate.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGov && matchesType && matchesSearch;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [searchQuery, selectedGov, selectedFacilityType]);

  const handleFlyToHospital = (h: Hospital) => {
    setSelectedHospital(h);
    setMapCenter([h.lat, h.lng]);
    setMapZoom(14);
  };

  const handleFlyToUser = () => {
    setMapCenter(userCoords);
    setMapZoom(13);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{t.hospitalsPage.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.hospitalsPage.heading}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-medium">
          {t.hospitalsPage.subheading}
        </p>
      </div>

      <div className="glass-panel p-4 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.hospitalsPage.searchPlaceholder}
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-red-500 rounded-2xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-red-400" />
            <span>Governorate:</span>
          </div>
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
          >
            {governorates.map(gov => (
              <option key={gov} value={gov}>
                {gov === 'All' ? t.hospitalsPage.filterAll : gov}
              </option>
            ))}
          </select>

          <select
            value={selectedFacilityType}
            onChange={(e) => setSelectedFacilityType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
          >
            <option value="All">All Facilities</option>
            <option value="CHU">University Hospitals (CHU)</option>
            <option value="Regional">Regional Hospitals</option>
            <option value="Specialized">Specialized Centers (Burn/Pediatric)</option>
            <option value="Private">Private Emergency Clinics</option>
          </select>

          <button
            onClick={handleFlyToUser}
            className="px-3 py-2 rounded-xl bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-600/50 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t.hospitalsPage.myLocation}</span>
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl h-[580px] relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#07090e' }}
          >
            <MapController center={mapCenter} zoom={mapZoom} />

            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> Dark Matter'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Marker position={userCoords} icon={createUserAvatarIcon()}>
              <Popup>
                <div className="p-2 text-center text-xs">
                  <strong className="text-cyan-400 block font-black mb-1">YOUR LOCATION</strong>
                  <span>Emergency Paramedic Beacon Active</span>
                </div>
              </Popup>
            </Marker>

            {filteredHospitals.map(h => (
              <Marker
                key={h.id}
                position={[h.lat, h.lng]}
                icon={createGtaHospitalIcon()}
                eventHandlers={{
                  click: () => handleFlyToHospital(h)
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 text-xs min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-black text-red-400">{h.type}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">24/7 ER</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">
                      {currentLang === 'ar' || currentLang === 'tn' ? h.nameAr : h.name}
                    </h4>
                    <p className="text-slate-300 text-[11px]">{h.address}</p>
                    
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={\`tel:\${h.emergencyPhone}\`}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-red-600 text-white font-bold text-center text-xs flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call ER</span>
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute top-4 left-4 z-[1000] bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/40 text-xs font-black text-white flex items-center gap-2 pointer-events-none">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{filteredHospitals.length} Hospitals & Emergency Centers Active</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-red-500" />
              <span>{t.hospitalsPage.nearestTitle} ({filteredHospitals.length})</span>
            </h3>
          </div>

          {filteredHospitals.map(h => {
            const isSelected = selectedHospital?.id === h.id;
            return (
              <div
                key={h.id}
                onClick={() => handleFlyToHospital(h)}
                className={\`p-4 rounded-2xl glass-panel border transition-all cursor-pointer space-y-3 \${
                  isSelected 
                    ? 'border-red-500 bg-red-950/30 shadow-[0_0_25px_rgba(239,68,68,0.25)]' 
                    : 'border-slate-800 hover:border-slate-600'
                }\`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-red-600/30 text-red-400 text-[10px] font-black uppercase">
                        {h.type}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {h.governorate} • {h.city}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white">
                      {currentLang === 'ar' || currentLang === 'tn' ? h.nameAr : h.name}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-cyan-400 font-mono">
                      {h.distanceKm} {t.hospitalsPage.km}
                    </span>
                    <span className="text-[10px] block text-slate-400">
                      {t.hospitalsPage.distance}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-300">
                  {h.is24_7 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      ✓ 24/7 ER
                    </span>
                  )}
                  {h.hasBurnUnit && (
                    <span className="px-2 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/40 text-orange-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" /> Burn Unit
                    </span>
                  )}
                  {h.hasPediatricEmergency && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                      <Baby className="w-3 h-3 text-purple-400" /> Pediatric ER
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={\`tel:\${h.emergencyPhone}\`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{t.hospitalsPage.callHospital} ({h.emergencyPhone})</span>
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlyToHospital(h);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    {t.hospitalsPage.flyToMap}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
`;

fs.writeFileSync('src/components/HospitalMapPage.tsx', hospitalMapCode, 'utf8');
console.log('HospitalMapPage.tsx created!');
