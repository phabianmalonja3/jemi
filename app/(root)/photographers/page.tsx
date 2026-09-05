"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FaCamera,
    FaEnvelope,
    FaStar,
    FaAward,
    FaCalendarAlt,
    FaSearch,
    FaTimes,
    FaWifi,
    FaUser,
    FaAt,
    FaChevronDown,
    FaCheckCircle,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/web/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// HELPERS
// ============================================================

const getDisplayName = (photographer: Photographer): string => {
    if (photographer.name && photographer.name.trim() !== "") {
        return photographer.name;
    }

    const emailName = photographer.email.split("@")[0];

    if (
        emailName &&
        emailName !== "photographer" &&
        emailName !== "admin"
    ) {
        return emailName
            .split(".")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    }

    return "Jemigraph Pro";
};

const getDisplayRating = (
    photographer: Photographer
): number => {
    if (
        photographer.averageRating &&
        photographer.averageRating > 0
    ) {
        return photographer.averageRating;
    }

    return 0;
};

const getSessionCount = (
    photographer: Photographer
): number => {
    return photographer.totalReviews || 0;
};

const getPhotographerDetails = (
    photographer: Photographer
): Photographer => {
    const quotes = [
        "Photography is the story I fail to put into words.",
        "Capturing moments, creating memories that last a lifetime.",
        "Every picture tells a story, let me help you tell yours.",
        "The best thing about a picture is that it never changes.",
    ];

    const hash = photographer.id
        .split("")
        .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
        );

    const rating = getDisplayRating(photographer);
    const sessions = getSessionCount(photographer);
    const experienceYears = 3 + (hash % 10);

    return {
        ...photographer,

        name: getDisplayName(photographer),

        rating: rating,

        specialty: "Professional Photographer",

        location: "Tanzania",

        profileImage: photographer.profileImage,

        bio: photographer.bio || "",

        quote: quotes[hash % quotes.length],

        experience: `${experienceYears}+ Years`,

        sessions: sessions,

        phone:
            photographer.phone || "Not provided",

        achievements: [
            "International Photography Award Winner",
            `${Math.floor(rating * 20)}+ Satisfied Clients`,
            "Master of Light & Composition",
        ],

        instagram: `https://instagram.com/${photographer.email.split("@")[0]}`,

        facebook: `https://facebook.com/${photographer.email.split("@")[0]}`,

        twitter: `https://twitter.com/${photographer.email.split("@")[0]}`,
    };
};

// ============================================================
// PAGE
// ============================================================

export default function PhotographersPage() {
    const [
        photographersData,
        setPhotographersData,
    ] = useState<PageableResponse | null>(null);

    const [photographers, setPhotographers] =
        useState<Photographer[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [
        selectedPhotographer,
        setSelectedPhotographer,
    ] = useState<Photographer | null>(null);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [searchField, setSearchField] =
        useState<
            "all" |
            "name" |
            "email" |
            "phone" |
            "location"
        >("all");

    const [showVerifiedOnly, setShowVerifiedOnly] =
        useState(true);

    const heroRef = useRef(null);
    const teamRef = useRef(null);
    const gridRef =
        useRef<HTMLDivElement>(null);

    // ============================================================
    // FETCH PHOTOGRAPHERS
    // ============================================================

    const fetchPhotographers = async (
        page: number = 0
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/photographers?page=${page}&size=12`
            );

            if (!response.ok) {
                throw new Error(
                    "Could not load photographers."
                );
            }

            const data: PageableResponse =
                await response.json();

            let filteredContent = data.content;

            if (showVerifiedOnly) {
                filteredContent =
                    data.content.filter(
                        (photographer) =>
                            photographer.isVerified === true
                    );
            }

            const enhancedPhotographers =
                filteredContent.map(
                    getPhotographerDetails
                );

            setPhotographersData({
                ...data,
                content: filteredContent,
            });

            setPhotographers(
                enhancedPhotographers
            );

            setTotalPages(
                Math.ceil(
                    filteredContent.length /
                        data.size
                ) || 1
            );
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotographers(currentPage);
    }, [
        currentPage,
        showVerifiedOnly,
    ]);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredPhotographers =
        useCallback(() => {
            let filtered = [...photographers];

            if (searchQuery.trim()) {
                const query =
                    searchQuery
                        .toLowerCase()
                        .trim();

                filtered = filtered.filter(
                    (photographer) => {
                        switch (searchField) {
                            case "name":
                                return (
                                    photographer.name
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    false
                                );

                            case "email":
                                return photographer.email
                                    .toLowerCase()
                                    .includes(query);

                            case "phone":
                                return (
                                    photographer.phone
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    false
                                );

                            case "location":
                                return (
                                    photographer.location
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    false
                                );

                            case "all":
                            default:
                                return (
                                    photographer.name
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    photographer.email
                                        .toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    photographer.phone
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    photographer.location
                                        ?.toLowerCase()
                                        .includes(
                                            query
                                        ) ||
                                    false
                                );
                        }
                    }
                );
            }

            return filtered;
        }, [
            photographers,
            searchQuery,
            searchField,
        ]);

    const displayedPhotographers =
        filteredPhotographers();

    // ============================================================
    // ANIMATIONS
    // ============================================================

    useEffect(() => {
        if (
            loading ||
            displayedPhotographers.length === 0
        ) {
            return;
        }

        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    ".hero-content",
                    {
                        y: 50,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                    }
                );

                const cards =
                    document.querySelectorAll(
                        ".photographer-card"
                    );

                if (cards.length > 0) {
                    gsap.fromTo(
                        cards,
                        {
                            y: 50,
                            opacity: 0,
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger:
                                    teamRef.current,
                                start: "top 85%",
                                toggleActions:
                                    "play none none reverse",
                            },
                        }
                    );
                }
            });

            return () => ctx.revert();
        }, 100);

        return () =>
            clearTimeout(timer);
    }, [
        loading,
        displayedPhotographers,
    ]);

    // ============================================================
    // ACTIONS
    // ============================================================

    const handleViewProfile = (
        photographer: Photographer
    ) => {
        setSelectedPhotographer(
            photographer
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchField("all");
    };

    const getSearchPlaceholder = () => {
        switch (searchField) {
            case "name":
                return "Search by photographer name...";

            case "email":
                return "Search by email address...";

            case "phone":
                return "Search by phone number...";

            case "location":
                return "Search by location...";

            default:
                return "Search by name, email, phone, or location...";
        }
    };

    const formatPhoneNumber = (
        phone: string
    ) => {
        if (
            !phone ||
            phone === "Not provided"
        ) {
            return phone;
        }

        const cleaned =
            phone.replace(/\D/g, "");

        if (cleaned.length === 10) {
            return `(${cleaned.slice(
                0,
                3
            )}) ${cleaned.slice(
                3,
                6
            )}-${cleaned.slice(6, 10)}`;
        }

        return phone;
    };

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <FaCamera className="text-3xl text-red-500" />
                    </div>

                    <p className="text-red-500 font-medium">
                        {error}
                    </p>

                    <Button
                        onClick={() =>
                            fetchPhotographers(
                                currentPage
                            )
                        }
                        className="bg-[#25632D] hover:bg-[#1e5125]"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================
    // RETURN
    // ============================================================

    return (
        <>
            <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">

                {/* ==================================================
                    HERO
                ================================================== */}

                <section
                    ref={heroRef}
                    className="relative overflow-hidden bg-[#25632D]"
                >
                    {/* Pattern - NO GRADIENT */}

                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 2px 2px, white 1px, transparent 1px)",
                                backgroundSize:
                                    "40px 40px",
                            }}
                        />
                    </div>

                    {/* Floating Camera */}

                    <div className="absolute top-20 left-10 text-white/5 text-7xl animate-pulse">
                        <FaCamera />
                    </div>

                    <div className="absolute bottom-20 right-10 text-white/5 text-9xl animate-pulse">
                        <FaCamera />
                    </div>

                    <div
                        ref={heroRef}
                        className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 hero-content opacity-0"
                    >
                        <div className="text-center">

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                                Find Your Perfect

                                <span className="block text-[#D8F3DC]">
                                    Photographer
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                                Connect with world-class
                                photographers who capture
                                life's most precious moments
                                with creativity and passion.
                            </p>

                            {/* SEARCH */}

                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 shadow-2xl">

                                    <div className="relative">

                                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />

                                        <Input
                                            type="text"
                                            placeholder={getSearchPlaceholder()}
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="pl-12 pr-32 py-6 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent"
                                        />

                                        {searchQuery && (
                                            <button
                                                onClick={
                                                    clearSearch
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-1"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}

                                    </div>
                                </div>

                                {/* FILTERS */}

                                <div className="flex flex-wrap gap-2 justify-center mt-4">

                                    {[
                                        {
                                            id: "all",
                                            label: "All Fields",
                                            icon: FaSearch,
                                        },
                                        {
                                            id: "name",
                                            label: "Name",
                                            icon: FaUser,
                                        },
                                        {
                                            id: "email",
                                            label: "Email",
                                            icon: FaAt,
                                        },
                                        {
                                            id: "phone",
                                            label: "Phone",
                                            icon: FaPhone,
                                        },
                                        {
                                            id: "location",
                                            label: "Location",
                                            icon: FaMapMarkerAlt,
                                        },
                                    ].map(
                                        (filter) => {
                                            const Icon =
                                                filter.icon;

                                            return (
                                                <button
                                                    key={
                                                        filter.id
                                                    }
                                                    onClick={() =>
                                                        setSearchField(
                                                            filter.id as typeof searchField
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                                                        searchField ===
                                                        filter.id
                                                            ? "bg-white text-[#25632D] shadow-lg"
                                                            : "bg-white/10 text-white hover:bg-white/20"
                                                    }`}
                                                >
                                                    <Icon className="text-xs" />

                                                    {
                                                        filter.label
                                                    }
                                                </button>
                                            );
                                        }
                                    )}

                                    {/* VERIFIED */}

                                    <button
                                        onClick={() =>
                                            setShowVerifiedOnly(
                                                !showVerifiedOnly
                                            )
                                        }
                                        className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                                            showVerifiedOnly
                                                ? "bg-blue-500 text-white shadow-lg"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                    >
                                        <FaCheckCircle className="text-xs" />

                                        Verified Only
                                    </button>

                                </div>
                            </div>

                            {/* SCROLL */}

                            <motion.div
                                animate={{
                                    y: [0, 10, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
                            >
                                <FaChevronDown className="text-white/50 text-2xl" />
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* ==================================================
                    RESULTS
                ================================================== */}

                {!loading && (
                    <div className="max-w-6xl mx-auto px-6 pt-8 w-full">

                        <div className="flex justify-between items-center flex-wrap gap-4">

                            <div className="text-sm text-zinc-600 dark:text-zinc-400">

                                <span className="font-semibold text-[#25632D]">
                                    {
                                        displayedPhotographers.length
                                    }
                                </span>

                                <span>
                                    {" "}
                                    photographer
                                    {displayedPhotographers.length !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    available
                                </span>

                                {showVerifiedOnly && (
                                    <span className="ml-2 text-blue-600">
                                        <FaCheckCircle className="inline mr-1 text-xs" />
                                        Verified only
                                    </span>
                                )}

                                {searchQuery && (
                                    <span className="ml-2">
                                        matching{" "}
                                        <span className="font-medium">
                                            "{searchQuery}"
                                        </span>
                                    </span>
                                )}

                            </div>

                            {searchQuery &&
                                displayedPhotographers.length ===
                                    0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={
                                            clearSearch
                                        }
                                        className="text-[#25632D] hover:text-[#1e5125]"
                                    >
                                        Clear Search
                                    </Button>
                                )}

                        </div>
                    </div>
                )}

                {/* ==================================================
                    PHOTOGRAPHERS
                ================================================== */}

                <section
                    ref={teamRef}
                    className="py-12 px-6"
                >
                    <div className="max-w-6xl mx-auto">

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">

                                <div className="relative">

                                    <div className="w-16 h-16 border-4 border-[#D8F3DC] rounded-full animate-spin border-t-[#25632D]" />

                                    <FaCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#25632D] text-xl" />

                                </div>

                                <p className="mt-6 text-zinc-500 font-medium">
                                    Finding talented
                                    photographers...
                                </p>

                            </div>
                        ) : (
                            <>
                                <div
                                    ref={gridRef}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >

                                    {displayedPhotographers.map(
                                        (
                                            photographer
                                        ) => (
                                            <div
                                                key={
                                                    photographer.id
                                                }
                                                className="photographer-card opacity-0 group"
                                            >

                                                <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                                                    {/* IMAGE */}

                                                    <div className="relative h-80 overflow-hidden bg-zinc-200">

                                                        <Image
                                                            src={
                                                                photographer.profileImage
                                                                    ? `${process.env.NEXT_PUBLIC_API_URL}${photographer.profileImage}`
                                                                    : "/default_user.svg"
                                                            }
                                                            fill
                                                            className="object-cover"
                                                            alt={
                                                                photographer.name?.toString() ||
                                                                "Photographer"
                                                            }
                                                            unoptimized
                                                        />

                                                        {/* DARK OVERLAY */}

                                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                        {/* STATUS */}

                                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">

                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm ${
                                                                    !photographer.isBusy &&
                                                                    photographer.isOnline
                                                                        ? "bg-green-500 text-white"
                                                                        : photographer.isBusy
                                                                        ? "bg-red-500 text-white"
                                                                        : "bg-gray-500/90 text-white"
                                                                }`}
                                                            >

                                                                {!photographer.isBusy &&
                                                                photographer.isOnline ? (
                                                                    <>
                                                                        <FaWifi className="text-xs" />
                                                                        Available
                                                                    </>
                                                                ) : photographer.isBusy ? (
                                                                    "Booked"
                                                                ) : (
                                                                    "Offline"
                                                                )}

                                                            </span>

                                                            {photographer.isVerified && (
                                                                <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-blue-500/90 text-white">

                                                                    <FaCheckCircle className="text-xs" />

                                                                    Verified

                                                                </span>
                                                            )}

                                                        </div>

                                                        {/* RATING */}

                                                        <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">

                                                            <FaStar className="text-yellow-400 text-sm" />

                                                            <span className="text-white text-sm font-semibold">
                                                                {photographer.rating?.toFixed(
                                                                    1
                                                                )}
                                                            </span>

                                                            <span className="text-white/70 text-xs">
                                                                (
                                                                {
                                                                    photographer.totalReviews
                                                                }{" "}
                                                                sessions)
                                                            </span>

                                                        </div>

                                                    </div>

                                                    {/* CARD CONTENT */}

                                                    <div className="p-6">

                                                        <div className="flex items-center justify-between mb-2">

                                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white truncate">
                                                                {
                                                                    photographer.name
                                                                }
                                                            </h3>

                                                            {photographer.isVerified && (
                                                                <FaCheckCircle className="text-blue-500 text-lg shrink-0 ml-2" />
                                                            )}

                                                        </div>

                                                        <div className="space-y-1.5 mb-4">

                                                            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">

                                                                <FaEnvelope className="text-[#25632D] text-xs shrink-0" />

                                                                <span className="truncate">
                                                                    {
                                                                        photographer.email
                                                                    }
                                                                </span>

                                                            </div>

                                                            {photographer.phone &&
                                                                photographer.phone !==
                                                                    "Not provided" && (
                                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">

                                                                        <FaPhone className="text-[#25632D] text-xs shrink-0" />

                                                                        <span className="truncate">
                                                                            {formatPhoneNumber(
                                                                                photographer.phone
                                                                            )}
                                                                        </span>

                                                                    </div>
                                                                )}

                                                        </div>

                                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                                                            {
                                                                photographer.bio
                                                            }
                                                        </p>

                                                        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">

                                                            <div>
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                    Experience
                                                                </p>

                                                                <p className="font-semibold text-zinc-900 dark:text-white">
                                                                    {
                                                                        photographer.experience
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                    Sessions
                                                                </p>

                                                                <p className="font-semibold text-zinc-900 dark:text-white">
                                                                    {
                                                                        photographer.sessions
                                                                    }+
                                                                </p>
                                                            </div>

                                                        </div>

                                                        {/* ACTIONS */}

                                                        <div className="flex gap-2 mb-4">

                                                            <a
                                                                href={`mailto:${photographer.email}`}
                                                                className="flex-1 text-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-[#EAF4EC] dark:hover:bg-[#25632D]/20 hover:text-[#25632D] transition text-sm"
                                                            >
                                                                Email
                                                            </a>

                                                            {photographer.phone &&
                                                                photographer.phone !==
                                                                    "Not provided" && (
                                                                    <a
                                                                        href={`tel:${photographer.phone.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        )}`}
                                                                        className="flex-1 text-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition text-sm"
                                                                    >
                                                                        Call
                                                                    </a>
                                                                )}

                                                            <Button
                                                                size="sm"
                                                                className="flex-1 bg-[#25632D] hover:bg-[#1e5125]"
                                                                onClick={() =>
                                                                    handleViewProfile(
                                                                        photographer
                                                                    )
                                                                }
                                                            >
                                                                View Profile
                                                            </Button>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>

                                {/* NO RESULTS */}

                                {!loading &&
                                    displayedPhotographers.length ===
                                        0 && (
                                        <div className="text-center py-24">

                                            <div className="w-24 h-24 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                                                <FaSearch className="text-4xl text-zinc-400" />
                                            </div>

                                            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
                                                No photographers
                                                found
                                            </h3>

                                            <p className="text-zinc-500 max-w-md mx-auto">
                                                {searchQuery
                                                    ? `We couldn't find any photographers matching "${searchQuery}"`
                                                    : showVerifiedOnly
                                                    ? "No verified photographers are currently available"
                                                    : "No photographers are currently available"}
                                            </p>

                                            {searchQuery && (
                                                <Button
                                                    onClick={
                                                        clearSearch
                                                    }
                                                    className="mt-6 bg-[#25632D] hover:bg-[#1e5125]"
                                                >
                                                    Clear Search
                                                </Button>
                                            )}

                                            {!searchQuery &&
                                                showVerifiedOnly && (
                                                    <Button
                                                        onClick={() =>
                                                            setShowVerifiedOnly(
                                                                false
                                                            )
                                                        }
                                                        className="mt-6 bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Show All
                                                        Photographers
                                                    </Button>
                                                )}

                                        </div>
                                    )}

                            </>
                        )}

                        {/* ==================================================
                            PAGINATION
                        ================================================== */}

                        {!loading &&
                            totalPages > 1 &&
                            displayedPhotographers.length >
                                0 && (
                                <div className="flex justify-center gap-2 mt-12">

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setCurrentPage(
                                                (
                                                    prev
                                                ) =>
                                                    Math.max(
                                                        0,
                                                        prev -
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            0
                                        }
                                    >
                                        Previous
                                    </Button>

                                    <div className="flex items-center gap-2">

                                        {Array.from(
                                            {
                                                length: Math.min(
                                                    5,
                                                    totalPages
                                                ),
                                            },
                                            (_, i) => {
                                                let pageNum =
                                                    i;

                                                if (
                                                    totalPages >
                                                    5
                                                ) {
                                                    if (
                                                        currentPage >
                                                        2
                                                    ) {
                                                        pageNum =
                                                            currentPage -
                                                            2 +
                                                            i;
                                                    }

                                                    if (
                                                        pageNum >=
                                                        totalPages
                                                    ) {
                                                        return null;
                                                    }
                                                }

                                                return (
                                                    <Button
                                                        key={
                                                            pageNum
                                                        }
                                                        variant={
                                                            currentPage ===
                                                            pageNum
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                pageNum
                                                            )
                                                        }
                                                        className={
                                                            currentPage ===
                                                            pageNum
                                                                ? "bg-[#25632D] hover:bg-[#1e5125]"
                                                                : ""
                                                        }
                                                    >
                                                        {pageNum +
                                                            1}
                                                    </Button>
                                                );
                                            }
                                        )}

                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setCurrentPage(
                                                (
                                                    prev
                                                ) =>
                                                    Math.min(
                                                        totalPages -
                                                            1,
                                                        prev +
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages -
                                                1
                                        }
                                    >
                                        Next
                                    </Button>

                                </div>
                            )}

                    </div>
                </section>

                {/* ==================================================
                    PROFILE MODAL
                ================================================== */}

                <AnimatePresence>
                    {selectedPhotographer && (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
                            onClick={() =>
                                setSelectedPhotographer(
                                    null
                                )
                            }
                        >

                            <motion.div
                                initial={{
                                    scale: 0.9,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                exit={{
                                    scale: 0.9,
                                    opacity: 0,
                                }}
                                className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                {/* MODAL IMAGE */}

                                <div className="relative">

                                    <button
                                        onClick={() =>
                                            setSelectedPhotographer(
                                                null
                                            )
                                        }
                                        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition"
                                    >
                                        <FaTimes />
                                    </button>

                                    <div className="relative h-96 bg-[#25632D]">

                                        <Image
                                            src={
                                                selectedPhotographer.profileImage
                                                    ? `${process.env.NEXT_PUBLIC_API_URL}${selectedPhotographer.profileImage}`
                                                    : "/default_user.svg"
                                            }
                                            alt={
                                                selectedPhotographer.name ||
                                                "Photographer"
                                            }
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />

                                        <div className="absolute inset-0 bg-black/40" />

                                        <div className="absolute bottom-6 left-6 text-white">

                                            <div className="flex items-center gap-2">

                                                <h2 className="text-3xl font-bold mb-2">
                                                    {
                                                        selectedPhotographer.name
                                                    }
                                                </h2>

                                                {selectedPhotographer.isVerified && (
                                                    <FaCheckCircle className="text-blue-400 text-2xl" />
                                                )}

                                            </div>

                                            <div className="text-lg text-white/80">
                                                Professional
                                                Photographer
                                            </div>

                                        </div>

                                    </div>

                                    {/* MODAL BODY */}

                                    <div className="p-8">

                                        <div className="grid md:grid-cols-2 gap-8 mb-8">

                                            <div>

                                                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">
                                                    Biography
                                                </h3>

                                                <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    {
                                                        selectedPhotographer.bio
                                                    }
                                                </div>

                                                <div className="mt-4 p-4 bg-[#EAF4EC] dark:bg-[#25632D]/20 rounded-lg italic">
                                                    <p className="text-[#25632D] dark:text-green-300">
                                                        "
                                                        {
                                                            selectedPhotographer.quote
                                                        }
                                                        "
                                                    </p>
                                                </div>

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">
                                                    Details
                                                </h3>

                                                <div className="space-y-3">

                                                    <div className="flex items-center gap-3">
                                                        <FaEnvelope className="text-[#25632D]" />
                                                        <span className="text-zinc-700 dark:text-zinc-300">
                                                            {
                                                                selectedPhotographer.email
                                                            }
                                                        </span>
                                                    </div>

                                                    {selectedPhotographer.phone &&
                                                        selectedPhotographer.phone !==
                                                            "Not provided" && (
                                                            <div className="flex items-center gap-3">
                                                                <FaPhone className="text-[#25632D]" />

                                                                <span className="text-zinc-700 dark:text-zinc-300">
                                                                    {formatPhoneNumber(
                                                                        selectedPhotographer.phone
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}

                                                    <div className="flex items-center gap-3">
                                                        <FaCalendarAlt className="text-[#25632D]" />

                                                        <span className="text-zinc-700 dark:text-zinc-300">
                                                            {
                                                                selectedPhotographer.experience
                                                            }{" "}
                                                            Experience
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <FaStar className="text-yellow-400" />

                                                        <span className="text-zinc-700 dark:text-zinc-300">
                                                            {
                                                                selectedPhotographer.rating?.toFixed(
                                                                    1
                                                                )
                                                            }{" "}
                                                            Rating (
                                                            {
                                                                selectedPhotographer.sessions
                                                            }
                                                            + sessions)
                                                        </span>
                                                    </div>

                                                    {selectedPhotographer.isVerified && (
                                                        <div className="flex items-center gap-3">
                                                            <FaCheckCircle className="text-blue-500" />

                                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                                Verified
                                                                Photographer
                                                            </span>
                                                        </div>
                                                    )}

                                                </div>

                                                <h3 className="text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-white">
                                                    Achievements
                                                </h3>

                                                <ul className="space-y-2">

                                                    {selectedPhotographer.achievements?.map(
                                                        (
                                                            achievement,
                                                            idx
                                                        ) => (
                                                            <li
                                                                key={
                                                                    idx
                                                                }
                                                                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                                                            >
                                                                <FaAward className="text-[#25632D] text-sm" />

                                                                {
                                                                    achievement
                                                                }
                                                            </li>
                                                        )
                                                    )}

                                                </ul>

                                                {/* CONTACT */}

                                                <div className="mt-6 flex gap-3">

                                                    <a
                                                        href={`mailto:${selectedPhotographer.email}`}
                                                        className="flex-1"
                                                    >
                                                        <Button className="w-full bg-[#25632D] hover:bg-[#1e5125]">
                                                            <FaEnvelope className="mr-2" />
                                                            Email
                                                        </Button>
                                                    </a>

                                                    {selectedPhotographer.phone &&
                                                        selectedPhotographer.phone !==
                                                            "Not provided" && (
                                                            <a
                                                                href={`tel:${selectedPhotographer.phone.replace(
                                                                    /\D/g,
                                                                    ""
                                                                )}`}
                                                                className="flex-1"
                                                            >
                                                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                                    <FaPhone className="mr-2" />
                                                                    Call
                                                                </Button>
                                                            </a>
                                                        )}

                                                </div>

                                            </div>

                                        </div>

                                        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 flex gap-4">

                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setSelectedPhotographer(
                                                        null
                                                    )
                                                }
                                            >
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

            {/* FOOTER */}

            <Footer />
        </>
    );
}
