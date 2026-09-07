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
  className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black"
>
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

      {/* Video */}
      <div className="w-full order-1 lg:order-2">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-auto max-h-[70vh] object-contain"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">

        {/* Badge */}
        <div className="hero-badge">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <FaCamera className="text-emerald-400 text-sm" />

            <span className="text-white text-sm font-medium tracking-wide">
              Photography
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Capture Your
          <br />

          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            Perfect Moments
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0"
        >
          Creating beautiful memories through professional photography
          and unforgettable experiences.
        </motion.p>

        {/* Booking Button */}
        <div className="hero-button flex justify-center lg:justify-start px-4 lg:px-0">
         <Link href="/photographers" className="w-full sm:w-auto">
  <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 text-white h-12 md:h-14 px-10 rounded-full shadow-xl">
    See Our Professional Photographers
    <FaArrowRight className="ml-2" />
  </Button>
</Link>

        </div>

      </div>

    </div>
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
  <div 
  className="relative min-h-screen overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
  style={{ backgroundColor: "#102d17" }}
>
  {/* Glassmorphism Background Effects */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
    <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />
    <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
        Choose Your{" "}
        <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
          Subscription Package
        </span>
      </h1>

      <p className="mt-4 text-base sm:text-lg text-slate-300">
        Pay easily through your mobile phone and continue enjoying our
        services seamlessly.
      </p>

      {/* Error */}
      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/15 backdrop-blur-xl px-5 py-4 text-sm text-red-200 shadow-xl">
          {errorMessage}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 backdrop-blur-xl px-5 py-4 text-sm text-emerald-200 shadow-xl">
          {successMessage}
        </div>
      )}
    </div>

    {/* Loading */}
    {fetchingPlans ? (
      <div className="flex justify-center items-center py-20">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl shadow-xl">
          <Loader2 className="animate-spin h-6 w-6 text-emerald-400" />

          <span className="text-slate-200">
            Loading packages...
          </span>
        </div>
      </div>

    ) : plans.length === 0 ? (

      /* Empty State */
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-8 text-center shadow-2xl backdrop-blur-xl">

        <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />

        <h3 className="text-lg font-semibold text-white">
          No Packages Available
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          There are currently no active subscription packages available.
          Please check back later or contact support.
        </p>

      </div>

    ) : (

      /* Plans */
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">

        {plans.map((plan) => {

          const isPopular = plan.name === "QUARTERLY";

          return (
            <div
              key={plan.id}
              className={`
                group relative overflow-hidden
                rounded-3xl
                p-[1px]
                transition-all duration-500
                hover:-translate-y-2
                hover:shadow-2xl
                ${
                  isPopular
                    ? "bg-gradient-to-b from-emerald-300/80 via-emerald-500/40 to-transparent"
                    : "bg-gradient-to-b from-white/20 via-white/10 to-transparent"
                }
              `}
            >

              {/* Card */}
              <div
                className={`
                  relative h-full rounded-3xl
                  bg-black/40
                  backdrop-blur-2xl
                  border border-white/[0.08]
                  p-8
                  flex flex-col justify-between
                  shadow-2xl
                  ${
                    isPopular
                      ? "shadow-emerald-950/60"
                      : "shadow-black/40"
                  }
                `}
              >

                {/* Decorative Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20" />

                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-b-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-900/30">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={isPopular ? "pt-5" : ""}>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-7">

                    <span className="text-4xl font-extrabold tracking-tight text-white">
                      TZS {plan.price.toLocaleString()}
                    </span>

                    <span className="ml-1 text-sm font-medium text-slate-400">
                      / {plan.durationInDays} days
                    </span>

                  </div>

                  {/* Features */}
                  <ul className="mt-7 space-y-4">

                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>

                      <p className="text-sm text-slate-300">
                        Access for {plan.durationInDays} days
                      </p>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>

                      <p className="text-sm text-slate-300">
                        Full system capabilities
                      </p>
                    </li>

                  </ul>

                </div>

                {/* Choose Button */}
                <div className="mt-8">

                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsModalOpen(true);
                    }}
                    className="
                      group/btn
                      relative
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border border-emerald-400/20
                      bg-gradient-to-r
                      from-emerald-600
                      to-green-500
                      py-3.5
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-emerald-950/30
                      transition-all
                      duration-300
                      hover:from-emerald-500
                      hover:to-green-400
                      hover:shadow-emerald-500/20
                      hover:scale-[1.02]
                      active:scale-[0.98]
                    "
                  >
                    <span className="relative z-10">
                      Choose Plan
                    </span>

                    {/* Button shine */}
                    <span className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover/btn:translate-x-full
                    " />

                  </button>

                </div>

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