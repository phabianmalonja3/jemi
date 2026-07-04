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
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaChevronLeft,
  FaChevronRight,

} from "react-icons/fa";
import { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { heroSlides } from "@/lib/constants/heros";
import PhotographyPackages from "@/components/web/PhotographyPackages";
import Footer from "@/components/web/Footer";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Package type definition
interface Package {
  duration: string;
  features: string[];
  name: string;
  price: number;
  icon?: any;
  popular?: boolean;
  description?: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const galleryRef = useRef(null);
  const testimonialsRef = useRef(null);

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

      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 80,
        opacity: 0,
        rotationX: 15,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        scale: 0.7,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "back.out(0.8)",
      });

      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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
    { number: "500+", label: "Happy Clients", icon: FaUsers, color: "emerald" },
    { number: "50+", label: "Tour Locations", icon: FaMapMarkerAlt, color: "amber" },
    { number: "1000+", label: "Photo Sessions", icon: FaCamera, color: "sky" },
    { number: "98%", label: "5-Star Reviews", icon: FaStar, color: "yellow" },
  ];

  const packages: Package[] = [
    {
      name: "Premium Safari Session",
      duration: "4 Hours",
      price: 450.0,
      features: [
        "60 edited photos",
        "Online gallery for 1 year",
        "2 locations included",
        "Drone shots"
      ],
      icon: FaCamera,
      popular: true,
      description: "Capture the wild beauty of Africa with our premium safari photography experience.",
    },
    {
      name: "Cultural Explorer",
      duration: "3 Hours",
      price: 249.0,
      features: [
        "40 edited photos",
        "Online gallery for 6 months",
        "1 location included",
        "Local guide insights"
      ],
      icon: FaMapMarkerAlt,
      popular: false,
      description: "Document your journey through historical sites and local traditions.",
    },
    {
      name: "Destination Wedding",
      duration: "Full Day",
      price: 999.0,
      features: [
        "300+ edited photos",
        "Online gallery for 2 years",
        "Multiple locations",
        "Wedding album included"
      ],
      icon: FaCalendarAlt,
      popular: true,
      description: "Professional wedding photography in breathtaking locations worldwide.",
    },
  ];

  const gallery = [
    "/images/hero.jpg",
    "/gallery-2.jpg",
    "/gallery-3.jpg",
    "/gallery-4.jpg",
    "/gallery-5.jpg",
    "/gallery-6.jpg",
    "/gallery-7.jpg",
    "/gallery-8.jpg",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Bali, Indonesia",
      rating: 5,
      text: "Absolutely amazing experience! The photos captured the essence of our adventure perfectly. Every shot tells a story!",
      image: "/avatar-1.jpg",
    },
    {
      name: "Michael Chen",
      location: "Santorini, Greece",
      rating: 5,
      text: "Professional, creative, and so much fun to work with. Best travel decision we made! The golden hour shots are breathtaking.",
      image: "/avatar-2.jpg",
    },
    {
      name: "Emma Rodriguez",
      location: "Machu Picchu, Peru",
      rating: 5,
      text: "The attention to detail and passion for photography made our trip unforgettable! Highly recommend to any traveler.",
      image: "/avatar-3.jpg",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  

  return (
    <>
      <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading photographers</p>
            </div>
          </div>
        }></Suspense>
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt={`Slide ${currentSlide + 1}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </motion.div>
        </AnimatePresence>

        {!isMobile && (
          <>
            <button onClick={prevSlide} className="absolute left-4 md:left-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 hover:scale-110">
              <FaChevronLeft className="text-xl" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 md:right-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 text-white transition-all duration-300 hover:scale-110">
              <FaChevronRight className="text-xl" />
            </button>
          </>
        )}

        <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${currentSlide === index ? "w-8 md:w-10 h-1.5 md:h-2 bg-emerald-400 shadow-lg" : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/40 hover:bg-white/80"}`}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <div  className="hero-badge">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
              <FaCamera className="text-emerald-400 text-sm" />
              <span className="text-white text-sm font-medium tracking-wide">{heroSlides[currentSlide].tag}</span>
            </div>
          </div>

          <h1 key={`title-${currentSlide}`} className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {heroSlides[currentSlide].title}<br />
            <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              {heroSlides[currentSlide].highlight}
            </span>
          </h1>

          <motion.p key={`subtitle-${currentSlide}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          <div className="hero-button flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/booking" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white h-12 md:h-14 px-10 rounded-full shadow-xl">
                Book Your Adventure <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/portfolio" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-2 border-white/80 text-white hover:bg-white/20 h-12 md:h-14 px-10 rounded-full">
                View Portfolio
              </Button>
            </Link>
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

      <PhotographyPackages />

  
      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 md:py-24 px-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden ring-2 ring-[#25632D]">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <div className="flex text-yellow-400 text-xs"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                  </div>
                </div>
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}