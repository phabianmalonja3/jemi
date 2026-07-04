"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    FaCamera,
    FaEnvelope,
    FaMapMarkerAlt,
    FaStar,
    FaAward,
    FaCalendarAlt,
    FaSearch,
    FaTimes,
    FaWifi,
    FaUser,
    FaAt,
    FaChevronDown
} from "react-icons/fa";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/web/Footer";


if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}




// Generate consistent rating
const getDisplayName = (photographer: Photographer): string => {
    if (photographer.name && photographer.name.trim() !== "") {
        return photographer.name;
    }
    const emailName = photographer.email.split('@')[0];
    if (emailName && emailName !== "photographer" && emailName !== "admin") {
        return emailName.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return `Jemigraph Pro`;
};

const getDisplayRating = (photographer: Photographer): number => {
    if (photographer.rating && photographer.rating > 0) {
        return photographer.rating;
    }
    const hash = photographer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 20) / 10;
};

// Generate consistent session count
const getSessionCount = (photographer: Photographer): number => {
    const hash = photographer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 20 + (hash % 180);
};


const getPhotographerDetails = (photographer: Photographer): Photographer => {
    const locations = [
        "New York, NY", "Los Angeles, CA", "London, UK", "Paris, France",
        "Tokyo, Japan", "Sydney, Australia", "Cape Town, SA", "Bali, Indonesia",
        "Chicago, IL", "Miami, FL", "Austin, TX", "Seattle, WA", "Denver, CO"
    ];
    const bioTemplates = [
        `Award-winning photographer with over 8 years of experience capturing life's most precious moments across the globe.`,
        `Visual storyteller specializing in authentic, emotion-driven photography that stands the test of time.`,
        `Creative director and photographer with a passion for blending natural light with artistic composition.`,
        `Internationally published photographer known for unique perspective and attention to detail.`,
        `Passionate about capturing raw emotions and creating timeless memories that last forever.`
    ];
    const quotes = [
        "Photography is the story I fail to put into words.",
        "Capturing moments, creating memories that last a lifetime.",
        "Every picture tells a story, let me help you tell yours.",
        "The best thing about a picture is that it never changes, even when the people in it do."
    ];

    const hash = photographer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = getDisplayRating(photographer);
    const sessions = getSessionCount(photographer);
    const experienceYears = 3 + (hash % 10);

    return {
        ...photographer,
        name: getDisplayName(photographer),
        rating: rating,
        specialty: "Professional Photographer",
        location: locations[hash % locations.length],
        profileImage: photographer.profileImage,
        bio: bioTemplates[hash % bioTemplates.length],
        quote: quotes[hash % quotes.length],
        experience: `${experienceYears}+ Years`,
        sessions: sessions,
        achievements: [
            "International Photography Award Winner",
            `${Math.floor(rating * 20)}+ Satisfied Clients`,
            "Featured in National Geographic",
            "Master of Light & Composition"
        ].slice(0, 3),
        instagram: `https://instagram.com/${photographer.email.split('@')[0]}`,
        facebook: `https://facebook.com/${photographer.email.split('@')[0]}`,
        twitter: `https://twitter.com/${photographer.email.split('@')[0]}`
    };
};

export default function PhotographersPage() {
    const [photographersData, setPhotographersData] = useState<PageableResponse | null>(null);
    const [photographers, setPhotographers] = useState<Photographer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchField, setSearchField] = useState<"all" | "name" | "email" | "location">("all");

    const heroRef = useRef(null);
    const teamRef = useRef(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Fetch data from API
    const fetchPhotographers = async (page: number = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/photographers?page=${page}&size=12`);
            if (!response.ok) throw new Error("Could not load photographers.");
            const data: PageableResponse = await response.json();



            console.log("Fetched photographers data:", data); // Debugging line


            const enhancedPhotographers = data.content.map(getPhotographerDetails);
            setPhotographersData(data);
            setPhotographers(enhancedPhotographers);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotographers(currentPage);
    }, [currentPage]);

    // Filter logic with search by name, email, location
    const filteredPhotographers = useCallback(() => {
        let filtered = [...photographers];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();

            filtered = filtered.filter(photographer => {
                switch (searchField) {
                    case "name":
                        return photographer.name?.toLowerCase().includes(query) || false;
                    case "email":
                        return photographer.email.toLowerCase().includes(query);

                    case "all":
                    default:
                        return (
                            photographer.name?.toLowerCase().includes(query) ||
                            photographer.email.toLowerCase().includes(query) ||

                            false
                        );
                }
            });
        }

        return filtered;
    }, [photographers, searchQuery, searchField]);

    const displayedPhotographers = filteredPhotographers();

    // GSAP Animations
    useEffect(() => {
        if (loading || displayedPhotographers.length === 0) return;

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.fromTo(".hero-content",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                );

                const cards = document.querySelectorAll('.photographer-card');
                if (cards.length > 0) {
                    gsap.fromTo(cards,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: teamRef.current,
                                start: "top 85%",
                                toggleActions: "play none none reverse",
                            }
                        }
                    );
                }
            });

            return () => ctx.revert();
        }, 100);

        return () => clearTimeout(timer);
    }, [loading, displayedPhotographers]);

    const handleViewProfile = (photographer: Photographer) => {
        setSelectedPhotographer(photographer);
    };

    const handleBookNow = (photographerId: string) => {
        window.location.href = `/photographer/${photographerId}`;
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchField("all");
    };

    const getSearchPlaceholder = () => {
        switch (searchField) {
            case "name": return "Search by photographer name...";
            case "email": return "Search by email address...";
            // case "location": return "Search by location...";
            default: return "Search by name, email, or location...";
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <FaCamera className="text-3xl text-red-500" />
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <Button onClick={() => fetchPhotographers(currentPage)} className="bg-emerald-600 hover:bg-emerald-700">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
       <>
        <div className="flex flex-col min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Modern Hero Section */}
            <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#25632D] via-emerald-800 to-teal-900">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Floating camera icons */}
                <div className="absolute top-20 left-10 text-white/5 text-7xl animate-pulse">
                    <FaCamera />
                </div>
                <div className="absolute bottom-20 right-10 text-white/5 text-9xl animate-pulse delay-1000">
                    <FaCamera />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 hero-content opacity-0">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >

                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                            Find Your Perfect
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                                Photographer
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                            Connect with world-class photographers who capture life's most precious moments with creativity and passion
                        </p>

                        {/* Search Section */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 shadow-2xl">
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
                                    <Input
                                        type="text"
                                        placeholder={getSearchPlaceholder()}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-32 py-6 text-base bg-transparent border-white/20 text-white placeholder:text-emerald-200/60 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white transition p-1"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Search filter chips */}
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {[
                                    { id: "all", label: "All Fields", icon: FaSearch },
                                    { id: "name", label: "Name", icon: FaUser },
                                    { id: "email", label: "Email", icon: FaAt },

                                ].map((filter) => {
                                    const Icon = filter.icon;
                                    return (
                                        <button
                                            key={filter.id}
                                            onClick={() => setSearchField(filter.id as typeof searchField)}
                                            className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 backdrop-blur-sm ${searchField === filter.id
                                                ? "bg-emerald-500 text-white shadow-lg"
                                                : "bg-white/10 text-emerald-100 hover:bg-white/20"
                                                }`}
                                        >
                                            <Icon className="text-xs" />
                                            {filter.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
                        >
                            <FaChevronDown className="text-white/50 text-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results info */}
            {!loading && (
                <div className="max-w-6xl mx-auto px-6 pt-8">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{displayedPhotographers.length}</span>
                            <span> photographer{displayedPhotographers.length !== 1 ? 's' : ''} available</span>
                            {searchQuery && (
                                <span className="ml-2">
                                    matching <span className="font-medium">"{searchQuery}"</span>
                                    {searchField !== "all" && ` in ${searchField}`}
                                </span>
                            )}
                        </div>

                        {searchQuery && displayedPhotographers.length === 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="text-emerald-600 hover:text-emerald-700"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Photographers Grid */}
            <section ref={teamRef} className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600" />
                                <FaCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 text-xl" />
                            </div>
                            <p className="mt-6 text-zinc-500 font-medium">Finding talented photographers...</p>
                        </div>
                    ) : (
                        <>
                            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedPhotographers.map((photographer) => (
                                    <div
                                        key={photographer.id}
                                        className="photographer-card opacity-0 group"
                                    >
                                        <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                            {/* Photographer Image */}
                                            <div className="relative h-80 overflow-hidden  py-8">
                                                <div className="absolute inset-0 bg-gradient-to-br py-8 bg-gray-200 flex items-center justify-center">
                                                    {/* <FaCamera className="text-5xl text-emerald-400" /> */}


                                                </div>





                                                <div className="p-8">
                                                    <div className="p-8">

                                                       
                                                        <Image
                                                            src={photographer.profileImage ? `${process.env.NEXT_PUBLIC_API_URL}${photographer.profileImage}` : `/default_user.svg`}
                                                            fill
                                                            className="object-cover w-full h-full rounded-t-2xl"
                                                            alt={photographer.name?.toString() || "Photographer"}

                                                            unoptimized
                                                        />
                                                    </div>
                                                </div>


                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm ${!photographer.isBusy && photographer.isOnline
                                                        ? "bg-green-500 text-white"
                                                        : photographer.isBusy
                                                            ? "bg-red-500 text-white"
                                                            : "bg-gray-500/90 text-white"
                                                        }`}>
                                                        {!photographer.isBusy && photographer.isOnline ? (
                                                            <>
                                                                <FaWifi className="text-xs" /> Available
                                                            </>
                                                        ) : photographer.isBusy ? (
                                                            "Booked"
                                                        ) : (
                                                            "Offline"
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                                    <FaStar className="text-yellow-400 text-sm" />
                                                    <span className="text-white text-sm font-semibold">{photographer.rating?.toFixed(1)}</span>
                                                    <span className="text-white/70 text-xs">({photographer.sessions}+ sessions)</span>
                                                </div>

                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                        <FaCamera className="text-white text-2xl" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                                    {photographer.name}
                                                </h3>

                                                <div className="space-y-1.5 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                        <FaEnvelope className="text-emerald-500 text-xs shrink-0" />
                                                        <span className="truncate">{photographer.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                        <FaMapMarkerAlt className="text-emerald-500 text-xs shrink-0" />
                                                        <span>{photographer.location}</span>
                                                    </div>
                                                </div>

                                                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                                                    {photographer.bio}
                                                </p>

                                                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                                                    <div>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Experience</p>
                                                        <p className="font-semibold text-zinc-900 dark:text-white">{photographer.experience}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Sessions</p>
                                                        <p className="font-semibold text-zinc-900 dark:text-white">{photographer.sessions}+</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mb-4">
                                                    <a href={`mailto:${photographer.email}`} className="flex-1 text-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition text-sm">
                                                        Email
                                                    </a>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                        onClick={() => handleViewProfile(photographer)}
                                                    >
                                                        View Profile
                                                    </Button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No results */}
                            {!loading && displayedPhotographers.length === 0 && (
                                <div className="text-center py-24">
                                    <div className="w-24 h-24 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                                        <FaSearch className="text-4xl text-zinc-400" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">No photographers found</h3>
                                    <p className="text-zinc-500 max-w-md mx-auto">
                                        {searchQuery
                                            ? `We couldn't find any photographers matching "${searchQuery}"`
                                            : "No photographers are currently available"}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            onClick={clearSearch}
                                            className="mt-6 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && displayedPhotographers.length > 0 && (
                        <div className="flex justify-center gap-2 mt-12">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = i;
                                    if (totalPages > 5) {
                                        if (currentPage > 2) {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        if (pageNum >= totalPages) return null;
                                    }
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={currentPage === pageNum ? "bg-emerald-600" : ""}
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Photographer Profile Modal */}
            <AnimatePresence>
                {selectedPhotographer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedPhotographer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <button
                                    onClick={() => setSelectedPhotographer(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition"
                                >
                                    <FaTimes />
                                </button>

                                <div className="relative h-96">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                                        <FaCamera className="text-6xl text-emerald-400" />
                                    </div>
                                    <Image
                                        src={selectedPhotographer.profileImage || `/api/placeholder/500/600?seed=${selectedPhotographer.id}`}
                                        alt={selectedPhotographer.name || "Photographer"}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h2 className="text-3xl font-bold mb-2">{selectedPhotographer.name}</h2>
                                        <div className="text-lg text-emerald-300">Professional Photographer</div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Biography</h3>
                                            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {selectedPhotographer.bio}
                                            </div>
                                            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg italic">
                                                <p className="text-emerald-800 dark:text-emerald-300">
                                                    "{selectedPhotographer.quote}"
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Details</h3>
                                            <div className="space-y-3">

                                                <div className="flex items-center gap-3">
                                                    <FaEnvelope className="text-emerald-600" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="text-emerald-600" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.experience} Experience</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.rating?.toFixed(1)} Rating ({selectedPhotographer.sessions}+ sessions)</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-white">Achievements</h3>
                                            <ul className="space-y-2">
                                                {selectedPhotographer.achievements?.map((achievement, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                                        <FaAward className="text-emerald-600 text-sm" />
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 flex gap-4">

                                        <Button variant="outline" onClick={() => setSelectedPhotographer(null)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
       <Footer />
       </>
    );
}