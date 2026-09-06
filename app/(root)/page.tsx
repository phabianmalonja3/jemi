"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaUsers,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

import { heroSlides } from "@/lib/constants/heros";
import Footer from "@/components/web/Footer";
import TestMonies from "@/components/web/TestMonies";
import PaymentModal from "@/components/web/PaymentModal"; // Hakikisha path ya faili hili ni sahihi
import { AlertCircle, Check, Loader2, Sparkles } from "lucide-react";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  
  // State za kudhibiti Modal ya Malipo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.2:8080";

  // Kupokea Vifurushi (Plans) kutoka Backend kupitia Axios
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await axios.get(`${API_URL}/subscription-plans`);
        setPlans(response.data);
      } catch (err) {
        setPlans([]);
        setErrorMessage("Imeshindikana kupakia vifurushi. Tafadhali jaribu tena.");
      } finally {
        setFetchingPlans(false);
      }
    }

    fetchPlans();
  }, [API_URL]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title",
        { y: 120, opacity: 0, rotationX: -15 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".hero-button",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.2)" }
      );
      gsap.fromTo(
        ".hero-badge",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.1, ease: "back.out(1.5)" }
      );

      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [isLoading]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const stats = [
    { number: "500+", label: "Happy Clients", icon: FaUsers },
    { number: "50+", label: "Tour Locations", icon: FaMapMarkerAlt },
    { number: "1000+", label: "Photo Sessions", icon: FaCamera },
    { number: "98%", label: "5-Star Reviews", icon: FaStar },
  ];

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
            </div>
          </div>
        }
      ></Suspense>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black overflow-x-hidden">
        {/* Hero Section */}
        <section
  ref={heroRef}
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
>
  {/* Background Video */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 md:py-24 px-4 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="text-2xl text-emerald-600" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-white">{stat.number}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription Packages Section */}
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Choose Your Subscription Package
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Pay easily through your mobile phone and continue enjoying our services seamlessly.
              </p>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
            </div>

            {fetchingPlans ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-[#357738]" />
                <span className="ml-2 text-slate-600">Loading packages...</span>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-xl mx-auto p-8">
                <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No Packages Available</h3>
                <p className="mt-2 text-sm text-slate-500">
                  There are currently no active subscription packages available. Please check back later or contact support.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-x-8">
                {plans.map((plan) => {
                  const isPopular = plan.name === "QUARTERLY";
                  return (
                    <div
                      key={plan.id}
                      className={`relative bg-white rounded-2xl shadow-xl border ${
                        isPopular ? "border-[#357738] ring-2 ring-[#357738]" : "border-slate-200"
                      } p-8 flex flex-col justify-between`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[#357738] text-white shadow-md">
                            <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                          </span>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-bold text-slate-950 uppercase tracking-wide">{plan.name}</h3>
                        <p className="mt-4 text-slate-500 text-sm">{plan.description}</p>

                        <div className="mt-6">
                          <span className="text-4xl font-extrabold text-slate-900">
                            TZS {plan.price.toLocaleString()}
                          </span>
                          <span className="text-base font-medium text-slate-500"> / {plan.durationInDays} days</span>
                        </div>

                        <ul className="mt-6 space-y-4">
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="ml-3 text-sm text-slate-600">Access for {plan.durationInDays} days</p>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="ml-3 text-sm text-slate-600">Full system capabilities</p>
                          </li>
                        </ul>
                      </div>

                      {/* Kitufe cha Kuchagua Kifurushi kinachofungua Modal */}
                      <div className="mt-8">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsModalOpen(true);
                          }}
                          className="w-full bg-[#357738] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6430] transition shadow-md"
                        >
                          Choose Plan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <TestMonies />
        <Footer />

        {/* Modal ya Malipo */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedPlan={selectedPlan}
          onSuccessfulPayment={(msg) => {
            setSuccessMessage(msg);
          }}
        />
      </div>
    </>
  );
}