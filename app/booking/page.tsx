"use client";

import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Camera,
  Image as ImageIcon,
  Phone,
  ChevronLeft,
  Navigation,
  Star,
  Clock,
  Loader2,
  MapPin,
  User,
  CheckCircle,
  Sparkles,
  Mail,
} from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamic import for Map to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/web/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-emerald-600 mx-auto mb-2" size={24} />
        <span className="text-[9px] text-slate-400 font-black tracking-widest">
          LOADING MAP...
        </span>
      </div>
    </div>
  ),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";

const PACKAGES = [
  { 
    id: "quick", 
    name: "Quickie", 
    icon: <Zap size={16} />, 
    price: 15000, 
    desc: "15 min",
    features: ["5 Photos", "Basic Edit"],
    color: "amber"
  },
  { 
    id: "std", 
    name: "Standard", 
    icon: <Camera size={16} />, 
    price: 45000, 
    desc: "1 hour",
    features: ["20 Photos", "Pro Edit"],
    color: "emerald"
  },
  { 
    id: "pro", 
    name: "Premium", 
    icon: <ImageIcon size={16} />, 
    price: 90000, 
    desc: "2 hours",
    features: ["All Raw", "Premium"],
    color: "purple"
  },
];

interface Location { lat: number; lng: number; }
interface Package { 
  id: string; 
  name: string; 
  icon: JSX.Element; 
  price: number; 
  desc: string;
  features: string[];
  color: string;
}
interface Pro { 
  name: string; 
  phone?: string; 
  email?: string;
  avatar?: string; 
  rating?: number;
  lat?: number;
  lng?: number;
  eta?: string;
  distance?: string;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [matchedPro, setMatchedPro] = useState<Pro | null>(null);
  const [photographerLocation, setPhotographerLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [eta, setEta] = useState<string>("5-10");
  const [distance, setDistance] = useState<string>("1.2");

  // WebSocket for matching and location tracking
  useEffect(() => {
    if (currentStep !== 3 || !bookingRef) return;

    const socket = new SockJS(`${BASE_URL}/ws-jemigraph`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        // Subscribe to match updates
        client.subscribe(`/topic/match/${bookingRef}`, (msg) => {
          const proData = JSON.parse(msg.body);


          console.log(proData)
          setMatchedPro(proData);
          
          // Set initial photographer location from match data
          if (proData.lat && proData.lng) {
            setPhotographerLocation({ lat: proData.lat, lng: proData.lng });
          }
          
          setCurrentStep(4);
          toast.success("Professional Found!", {
            description: `${proData.name} is on their way to you.`,
          });
        });
        
        // Subscribe to real-time location updates from photographer
        client.subscribe(`/topic/location/${bookingRef}`, (msg) => {
          const locationData = JSON.parse(msg.body);
          if (locationData.lat && locationData.lng) {
            setPhotographerLocation({ lat: locationData.lat, lng: locationData.lng });
            
            // Update ETA and distance if provided
            if (locationData.eta) setEta(locationData.eta);
            if (locationData.distance) setDistance(locationData.distance);
          }
        });
      },
    });

    client.activate();
    return () => { 
      client.deactivate(); 
    };
  }, [currentStep, bookingRef]);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("GPS not supported");
        reject("No Geolocation Support");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        (err) => {
          toast.error("Please enable GPS to find nearby photographers");
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const startSearch = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in all details");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const coords = await getCurrentLocation();
      const ref = `JG-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
      setBookingRef(ref);

      await axios.post(`${BASE_URL}/jobs/request`, {
        bookingId: ref,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        packageType: selectedPkg?.name,
        price: selectedPkg?.price,
        lat: coords.lat,
        lng: coords.lng,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error("Booking Error:", error);
      if (typeof error !== 'string') {
        toast.error("Failed to submit request. Check your internet connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step 1 - Package Selection
  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 pt-4 h-full flex flex-col overflow-y-auto"
    >
      <div className="mb-5 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-md mb-2">
          <Camera size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Book a Photographer</h1>
        <p className="text-slate-400 text-[10px] mt-0.5">Choose your package</p>
      </div>

      <div className="space-y-2.5 flex-1">
        {PACKAGES.map((pkg) => (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            key={pkg.id}
            onClick={() => { setSelectedPkg(pkg); setCurrentStep(2); }}
            className={cn(
              "w-full text-left p-3.5 rounded-xl border transition-all duration-300",
              selectedPkg?.id === pkg.id 
                ? "border-emerald-500 bg-emerald-50/50 shadow-md" 
                : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  pkg.color === "amber" ? "bg-amber-50" : pkg.color === "emerald" ? "bg-emerald-50" : "bg-purple-50"
                )}>
                  {pkg.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{pkg.name}</h4>
                  <p className="text-[9px] text-slate-400">{pkg.desc}</p>
                  <div className="flex gap-1.5 mt-1">
                    {pkg.features.map((feature, i) => (
                      <span key={i} className="text-[7px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-black text-slate-900 text-sm">
                TSh {pkg.price.toLocaleString()}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  // Render Step 2 - Contact Details with Email
  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="p-4 pt-4 h-full flex flex-col"
    >
      <button 
        onClick={() => setCurrentStep(1)} 
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 mb-4 text-xs font-medium w-fit"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900">Your Details</h2>
        <p className="text-slate-400 text-[10px] mt-0.5">We'll connect you with the best photographer</p>
      </div>

      <div className="space-y-3 flex-1">
        {/* Full Name */}
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 block">
            Full Name
          </label>
          <div className="relative">
            <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 block">
            Email Address
          </label>
          <div className="relative">
            <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              type="email"
              placeholder="johndoe@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 block">
            Phone Number
          </label>
          <div className="relative">
            <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              placeholder="0712 345 678"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Selected Package Summary */}
        {selectedPkg && (
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 mt-2">
            <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Selected Package</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedPkg.name}</p>
                <p className="text-[9px] text-slate-500">{selectedPkg.desc}</p>
              </div>
              <p className="font-black text-emerald-600 text-sm">TSh {selectedPkg.price.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Button at Bottom */}
      <div className="pt-4 pb-2 mt-auto">
        <button 
          onClick={startSearch} 
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={16} /> Finding Location...</>
          ) : (
            <><Navigation size={16} /> Find Photographer</>
          )}
        </button>
      </div>
    </motion.div>
  );

  // Render Step 3 - Searching
  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center p-6 bg-white"
    >
      <div className="relative w-32 h-32 mb-6">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} 
          transition={{ repeat: Infinity, duration: 2 }} 
          className="absolute inset-0 bg-emerald-100 rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} 
          className="absolute inset-0 bg-emerald-200 rounded-full" 
        />
        <div className="relative z-10 bg-emerald-600 rounded-full w-full h-full flex items-center justify-center shadow-xl">
          <Navigation size={36} className="text-white animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-xl font-black text-slate-900">Finding Your Pro</h2>
      <p className="text-slate-400 text-center mt-1 text-xs">Scanning for photographers near you...</p>
      <div className="flex items-center gap-2 mt-3">
        <Loader2 className="animate-spin text-emerald-600" size={12} />
        <span className="text-[9px] text-slate-400 font-medium">This takes about 10-15 seconds</span>
      </div>
    </motion.div>
  );

  // Render Step 4 - Matched & Tracking
  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 relative">
        <MapWithNoSSR 
          userLocation={userLocation} 
          photographerLocation={photographerLocation}
          matchedPro={matchedPro} 
        />
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-[9px] font-bold shadow-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            Pro En Route
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-t-2xl shadow-2xl border-t p-4"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
              {matchedPro?.name?.charAt(0) || "P"}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{matchedPro?.name || "Professional"}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-slate-700">{matchedPro?.rating || 4.9}</span>
                <span className="text-[8px] text-slate-400">• Verified</span>
              </div>
              {matchedPro?.email && (
                <p className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Mail size={8} /> {matchedPro.email}
                </p>
              )}
            </div>
          </div>
          
          <a 
            href={`tel:${matchedPro?.phone}`} 
            className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md transition-all hover:bg-emerald-700 active:scale-95"
          >
            <Phone size={18} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock size={8} /> ETA
            </p>
            <p className="font-black text-slate-900 text-sm">{matchedPro?.eta || eta} min</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={8} /> Distance
            </p>
            <p className="font-black text-slate-900 text-sm">{matchedPro?.distance || distance} km</p>
          </div>
        </div>

        {/* Client Info Summary */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-[8px] text-slate-400">Package</p>
              <p className="text-xs font-bold text-slate-900">{selectedPkg?.name}</p>
            </div>
            <p className="text-base font-black text-emerald-600">TSh {selectedPkg?.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-50">
            <div>
              <p className="text-[8px] text-slate-400">Your Contact</p>
              <p className="text-[9px] font-medium text-slate-700">{form.name}</p>
              <p className="text-[8px] text-slate-400">{form.email} • {form.phone}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen pt-14">
      <Toaster position="top-center" richColors theme="light" />
      <main className="max-w-md mx-auto h-[calc(100vh-3.5rem)] relative bg-white shadow-xl overflow-hidden rounded-t-2xl">
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && matchedPro && renderStep4()}
        </AnimatePresence>
      </main>
    </div>
  );
}