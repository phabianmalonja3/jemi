"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navigation, User, Camera } from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default center (Dar es Salaam, Tanzania)
const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083];

// Validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' && 
    !isNaN(lat) && 
    !isNaN(lng) && 
    isFinite(lat) && 
    isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
};

// Custom SVG Icons for better look
const createCustomIcon = (color: string, icon: string, isAnimated: boolean = false) => {
  const svgIcon = L.divIcon({
    className: 'custom-div-icon',
    html: renderToStaticMarkup(
      <div className={`relative ${isAnimated ? 'animate-bounce' : ''}`}>
        <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
          {icon === 'client' ? (
            <User size={18} className="text-white" />
          ) : icon === 'pro' ? (
            <Camera size={18} className="text-white" />
          ) : (
            <Navigation size={18} className="text-white" />
          )}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
      </div>
    ),
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -40],
  });
  return svgIcon;
};

// Custom Pulse Icon for Pro (animated)
const createPulseIcon = (color: string) => {
  const svgIcon = L.divIcon({
    className: 'custom-div-icon',
    html: renderToStaticMarkup(
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className={`w-12 h-12 ${color} rounded-full opacity-75`} />
        </div>
        <div className="relative w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <Camera size={18} className="text-white" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-emerald-500" />
      </div>
    ),
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -40],
  });
  return svgIcon;
};

// Auto-fit bounds component with animation
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 1) {
      // Filter out invalid positions
      const validPositions = positions.filter(pos => 
        isValidCoordinate(pos[0], pos[1])
      );
      
      if (validPositions.length > 1) {
        const bounds = L.latLngBounds(validPositions);
        map.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1 });
      }
    }
  }, [positions, map]);
  return null;
}

// Route animation component
function AnimatedRoute({ positions }: { positions: [number, number][] }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!positions || positions.length < 2) return;
    
    // Filter out invalid positions
    const validPositions = positions.filter(pos => 
      isValidCoordinate(pos[0], pos[1])
    );
    
    if (validPositions.length < 2) return;
    
    const animate = () => {
      let startTime: number;
      const duration = 2000;
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);
        
        if (newProgress < 1) {
          requestAnimationFrame(step);
        }
      };
      
      requestAnimationFrame(step);
    };
    
    animate();
  }, [positions]);
  
  if (!positions || positions.length < 2) return null;
  
  // Filter valid positions
  const validPositions = positions.filter(pos => 
    isValidCoordinate(pos[0], pos[1])
  );
  
  if (validPositions.length < 2) return null;
  
  // Calculate partial route for animation
  const totalPoints = validPositions.length;
  const pointCount = Math.floor(totalPoints * progress);
  const animatedPoints = validPositions.slice(0, Math.max(2, pointCount));
  
  return (
    <>
      {/* Full route line (background) */}
      <Polyline 
        positions={validPositions} 
        color="#94a3b8"
        weight={3}
        opacity={0.3}
        lineCap="round"
        lineJoin="round"
      />
      
      {/* Animated route line (foreground) */}
      {animatedPoints.length > 1 && (
        <Polyline 
          positions={animatedPoints} 
          color="#10b981"
          weight={5}
          opacity={0.9}
          lineCap="round"
          lineJoin="round"
          className="animate-pulse"
        />
      )}
      
      {/* Animated car/traveler icon along the route */}
      {progress < 1 && validPositions.length > 1 && (
        <TravelingMarker positions={validPositions} progress={progress} />
      )}
    </>
  );
}

// Moving marker component
function TravelingMarker({ positions, progress }: { positions: [number, number][]; progress: number }) {
  const map = useMap();
  
  // Calculate position along the polyline
  const getPositionAtProgress = (points: [number, number][], prog: number): [number, number] | null => {
    if (!points || points.length < 2) return null;
    
    let totalDistance = 0;
    const distances = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = L.latLng(points[i][0], points[i][1]);
      const p2 = L.latLng(points[i + 1][0], points[i + 1][1]);
      const distance = p1.distanceTo(p2);
      distances.push(distance);
      totalDistance += distance;
    }
    
    const targetDistance = totalDistance * prog;
    let accumulated = 0;
    
    for (let i = 0; i < distances.length; i++) {
      if (targetDistance <= accumulated + distances[i]) {
        const ratio = (targetDistance - accumulated) / distances[i];
        const lat = points[i][0] + (points[i + 1][0] - points[i][0]) * ratio;
        const lng = points[i][1] + (points[i + 1][1] - points[i][1]) * ratio;
        
        if (isValidCoordinate(lat, lng)) {
          return [lat, lng];
        }
        return null;
      }
      accumulated += distances[i];
    }
    
    const lastPoint = points[points.length - 1];
    if (isValidCoordinate(lastPoint[0], lastPoint[1])) {
      return lastPoint;
    }
    return null;
  };
  
  const currentPos = getPositionAtProgress(positions, progress);
  
  if (!currentPos) return null;
  
  // Create moving car icon
  const carIcon = L.divIcon({
    className: 'custom-div-icon',
    html: renderToStaticMarkup(
      <div className="relative">
        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
          <Navigation size={16} className="text-white" />
        </div>
      </div>
    ),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
  
  useEffect(() => {
    if (currentPos && map && progress < 1 && isValidCoordinate(currentPos[0], currentPos[1])) {
      map.panTo(currentPos, { animate: true, duration: 0.5 });
    }
  }, [currentPos, map, progress]);
  
  return <Marker position={currentPos} icon={carIcon} />;
}

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  photographerLocation: { lat: number; lng: number } | null;
  matchedPro: any;
}

export default function Map({ userLocation, photographerLocation, matchedPro }: MapProps) {
  // Validate and set client position
  const clientPos: [number, number] | null = (userLocation && isValidCoordinate(userLocation.lat, userLocation.lng)) 
    ? [userLocation.lat, userLocation.lng] 
    : null;

  // Validate and set photographer position
  const proPos: [number, number] | null = (photographerLocation && isValidCoordinate(photographerLocation.lat, photographerLocation.lng)) 
    ? [photographerLocation.lat, photographerLocation.lng] 
    : null;

  // Create path points from photographer to client (only if both are valid)
  const pathPoints: [number, number][] = (clientPos && proPos) ? [proPos, clientPos] : [];
  
  // Determine center - use client location if available, otherwise default
  const center: [number, number] = clientPos || DEFAULT_CENTER;

  // Custom icons
  const clientMarkerIcon = createCustomIcon('bg-blue-500', 'client');
  const proMarkerIcon = createPulseIcon('bg-emerald-500');

  // If no valid locations, show a message
  if (!clientPos && !proPos) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center flex-col gap-3">
        <Navigation size={48} className="text-slate-300" />
        <p className="text-slate-400 text-sm font-medium">Loading map...</p>
        <p className="text-slate-300 text-xs">Waiting for location data</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={14} 
      className="h-full w-full" 
      zoomControl={true}
      attributionControl={false}
      style={{ background: '#f0fdf4' }}
    >
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      
      {/* Animated Route Line - Only show if both positions exist */}
      {pathPoints.length > 1 && <AnimatedRoute positions={pathPoints} />}

      {/* Auto Zoom - Only if both positions exist */}
      {pathPoints.length > 1 && <FitBounds positions={pathPoints} />}

      {/* Client Marker */}
      {clientPos && (
        <Marker position={clientPos} icon={clientMarkerIcon}>
          <Popup>
            <div className="text-center py-1">
              <p className="font-bold text-sm text-slate-900">Your Location</p>
              <p className="text-[9px] text-slate-500">Pickup Point</p>
              <div className="mt-1 px-2 py-0.5 bg-blue-100 rounded-full text-[8px] font-bold text-blue-700">
                Client
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Photographer Marker - Only if photographer location exists */}
      {proPos && (
        <Marker position={proPos} icon={proMarkerIcon}>
          <Popup>
            <div className="text-center py-1">
              <p className="font-bold text-sm text-emerald-600">{matchedPro?.name || "Professional"}</p>
              <p className="text-[9px] text-slate-500">En Route to You</p>
              <div className="mt-1 px-2 py-0.5 bg-emerald-100 rounded-full text-[8px] font-bold text-emerald-700">
                ETA: {matchedPro?.eta || "5-10"} min
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}