"use client"; // This is now a client component

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaClock, FaCheckCircle, FaCamera, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Package } from '../../types/index';


const IconMap = {
  camera: FaCamera,
  location: FaMapMarkerAlt,
  event: FaCalendarAlt,
};

export default function PhotographyPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {

  

      try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/packages`);
        console.log(response.data)


        
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'TSH', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  if (loading) return <div className="py-20 text-center">Loading packages...</div>;

  return (
    <section className="py-16 md:py-24 px-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Photography Packages
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Choose from our curated photography experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const Icon =  FaCamera;
            return (
              <div 
                key={pkg.id} 
                className=" bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl relative overflow-hidden group border border-transparent hover:border-emerald-500/30 transition-all duration-300"
              >
               
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="text-2xl text-[#25632D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm text-zinc-500 mb-4">{pkg.description}</p>
                <div className="flex items-center gap-2 mb-4 text-[#25632D] text-xs font-bold uppercase tracking-wider">
                  <FaClock /> {pkg.duration}
                </div>
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature,i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <FaCheckCircle className="text-[#25632D] text-xs flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="text-3xl font-bold text-[#25632D] mb-6">{formatPrice(pkg.price)}</div>
               
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}