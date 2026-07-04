"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  Power, Activity, Star, CheckCircle, 
  Loader2, Navigation, Bell, MapPin, 
  Clock, Wallet, ShieldCheck, Zap, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';

// Dynamic Import ya MiniMap kuzuia SSR Errors (Next.js)
// const MiniMap = dynamic(() => import('@/components/web/MiniMap'), { 
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
//       <span className="text-xs text-emerald-500 font-black tracking-[0.2em] animate-pulse">
//         CALIBRATING GPS...
//       </span>
//     </div>
//   )
// });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v0.1';

// Logic ya Umbali
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export default function PhotographerDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [pro, setPro] = useState(null);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>(null);
  const stompClient = useRef<Client | null>(null);


  
const { user } = useAuth();



  // Geo-location Tracking
  useEffect(() => {


    const { name } = user || {}; 

console.log(name);
    let watchId: number;
    if (isOnline) {


      watchId = navigator.geolocation.watchPosition(
        (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => toast.error("GPS Error: " + err.message),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [isOnline]);

  // WebSocket Connection
  useEffect(() => {

    // setPro(localStorage.getItem("user"))
    if (isOnline) {
      const socket = new SockJS(`${BASE_URL}/ws-jemigraph`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          client.subscribe('/topic/nearby-jobs', (message) => {
            const raw = JSON.parse(message.body);
            setJobs(prev => [{
              id: raw.bookingId,
              title: raw.packageType || "Photo Session",
              location: raw.location || "Dar es Salaam",
              price: raw.price || 0,
              status: 'pending',
              lat: raw.lat,
              lng: raw.lng,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              client: { name: raw.clientName, rating: 4.9 },
            }, ...prev]);
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => null);
            toast.info("New job request nearby!");
          });
        },
      });
      stompClient.current = client;
      client.activate();
    } else {
      stompClient.current?.deactivate();
      setJobs([]); 
    }
    return () => { stompClient.current?.deactivate(); };
  }, [isOnline]);

  const handleAccept = async (id: string) => {


    setIsAccepting(id);
    try {
      const res = await axios.post(`${BASE_URL}/jobs/accept`, {
        bookingId: id,
        lat: myLocation?.lat,
        lng: myLocation?.lng,
        proId: user?.id,
        name: user?.name
      });

      if (res.data.status === "MATCHED") {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'accepted' } : j));
        toast.success("Job accepted! The client can see you now.");
      }
    } catch (err) {
      toast.error("This job has already been taken.");
      setJobs(prev => prev.filter(j => j.id !== id));
    } finally {
      setIsAccepting(null);
    }
  };

  // Stats
  const completedJobs = jobs.filter(j => j.status === 'accepted').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const totalEarnings = jobs.reduce((sum, j) => sum + (j.status === 'accepted' ? j.price : 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto p-6 space-y-8 pb-32">
        
        {/* Header Stats - Larger */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-slate-900">{completedJobs}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-amber-600">{pendingJobs}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earnings</p>
            <p className="text-base font-black text-emerald-600">TSh {totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Bar - Larger */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Activity size={20} className={isOnline ? "text-emerald-600" : "text-slate-300"} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <p className={cn("text-sm font-bold uppercase", isOnline ? "text-emerald-600" : "text-slate-400")}>
                {isOnline ? "Online & Ready" : "Offline"}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap size={12} className="text-amber-500" /> Signal
            </p>
            <p className="text-[10px] font-bold text-slate-700">STABLE</p>
          </div>
        </div>

        {/* Radar Toggle Button - Larger */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOnline(!isOnline)}
          className={cn(
            "w-full p-10 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center gap-4",
            isOnline 
              ? "bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100/50" 
              : "bg-white border-slate-200 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30"
          )}
        >
          <div className={cn(
            "p-6 rounded-full transition-all duration-500",
            isOnline ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 scale-105" : "bg-slate-100"
          )}>
            <Power size={40} className={cn("transition-colors", isOnline ? "text-white" : "text-slate-400")} />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">
              {isOnline ? "RADAR ACTIVE" : "GO ONLINE"}
            </h2>
            <div className="flex items-center gap-2 justify-center mt-2">
              <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                {isOnline ? "Scanning for nearby clients" : "Tap to receive orders"}
              </p>
            </div>
          </div>
        </motion.button>

        {/* Jobs Section */}
        <div className="space-y-5">
          <div className="flex justify-between items-center px-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-emerald-600" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nearby Requests</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {jobs.length} Found
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center space-y-5 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-200">
                  <Navigation size={32} className="text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Searching Zone...</p>
                  <p className="text-[10px] text-slate-400 font-medium">Keep the app open for instant alerts</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {jobs.map((job, index) => {
                  const distance = myLocation ? calculateDistance(myLocation.lat, myLocation.lng, job.lat, job.lng) : null;
                  return (
                    <motion.div 
                      key={job.id} layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Mini Map Area - Larger */}
                      <div className="h-44 relative bg-slate-100">
                        {/* <MiniMap 
                          clientLat={job.lat} clientLng={job.lng} 
                          proLat={myLocation?.lat} proLng={myLocation?.lng} 
                        /> */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute top-4 left-4 flex gap-3">
                          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1.5 shadow-sm">
                            <Navigation size={10} fill="currentColor" /> {distance || "--"} KM
                          </div>
                          <div className="bg-white/90 backdrop-blur-sm text-slate-600 px-3 py-1.5 rounded-full text-[9px] font-bold border border-slate-200 flex items-center gap-1.5">
                            <Clock size={10} /> {job.time}
                          </div>
                        </div>
                      </div>

                      {/* Job Details - Larger */}
                      <div className="p-6 space-y-5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center font-bold text-emerald-700 text-xl">
                              {job.client.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  <Star size={12} className="text-amber-500 fill-amber-500" />
                                  <span className="text-[10px] font-bold text-slate-600">{job.client.rating}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <MapPin size={10} /> {job.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                            <p className="text-xl font-bold text-emerald-600">
                              TSh {job.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons - Larger */}
                        <div className="flex gap-3">
                          {job.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))}
                                className="px-5 py-3.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all"
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => handleAccept(job.id)}
                                disabled={isAccepting === job.id}
                                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 rounded-xl font-bold text-[11px] uppercase tracking-wider text-white shadow-sm transition-all flex items-center justify-center gap-2"
                              >
                                {isAccepting === job.id ? <Loader2 className="animate-spin" size={16}/> : "Accept Job"}
                              </button>
                            </>
                          ) : (
                            <div className="w-full py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-bold text-[11px] uppercase tracking-wider">
                              <CheckCircle size={16} /> Confirmed
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Earnings Summary - Larger */}
        {jobs.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Today's Summary</p>
                <p className="text-base font-bold text-slate-900 mt-1">Total Earnings</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-emerald-600">TSh {totalEarnings.toLocaleString()}</p>
                <p className="text-[9px] text-emerald-600 font-medium flex items-center gap-1 justify-end">
                  <TrendingUp size={12} /> +12% from yesterday
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}