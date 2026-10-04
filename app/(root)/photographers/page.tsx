"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    FaCamera,
    FaEnvelope,
    FaStar,
    FaCalendarAlt,
    FaSearch,
    FaTimes,
    FaWifi,
    FaUser,
    FaAt,
    FaChevronDown,
    FaPhone,
    FaMapMarkerAlt,
    FaInstagram,
    FaImage,
    FaClock,
    FaMoneyBillWave,
    FaCheckCircle,
    FaPhoneAlt,
} from "react-icons/fa";

import { useEffect, useRef, useState, useCallback } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Footer from "@/components/web/Footer";
import LoadingSpinner from "@/components/web/LoadingSpinner";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const VERIFIED_ICON = "/icons/verification.svg";

/* ============================================================
   TYPES
============================================================ */

interface GalleryItem {
    id: string;
    fileType: "IMAGE" | "VIDEO" | string;
    fileUrl: string;
}

interface Package {
    id: string;
    name: string;
    level: string;
    duration: number;
    price: number;
    features: string[];
}

interface Photographer {
    id: string;

    name?: string | null;
    displayName?: string | null;

    email: string;
    phone?: string | null;

    bio?: string | null;

    address?: string | null;

    profileImage?: string | null;
    profileImageUrl?: string | null;

    latitude?: number | null;
    longitude?: number | null;

    isVerified: boolean;
    isBusy?: boolean;
    isOnline?: boolean;

    averageRating?: number;
    rating?: number;
    totalReviews?: number;

    role?: string;

    instagram?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    website?: string | null;

    gallery?: GalleryItem[];

    packages?: Package[];

    /* UI helper fields */
    location?: string;
}

interface PageableResponse {
    content: Photographer[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/* ============================================================
   HELPERS
============================================================ */

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Return photographer display name.
 */
const getDisplayName = (
    photographer: Photographer
): string => {
    if (
        photographer.displayName &&
        photographer.displayName.trim()
    ) {
        return photographer.displayName.trim();
    }

    if (
        photographer.name &&
        photographer.name.trim()
    ) {
        return photographer.name.trim();
    }

    if (photographer.email) {
        const emailName =
            photographer.email.split("@")[0];

        if (emailName) {
            return emailName
                .split(/[._-]/)
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1)
                )
                .join(" ");
        }
    }

    return "Photographer";
};

/**
 * Return real rating from backend.
 */
const getDisplayRating = (
    photographer: Photographer
): number => {
    if (
        typeof photographer.averageRating ===
            "number" &&
        photographer.averageRating > 0
    ) {
        return photographer.averageRating;
    }

    if (
        typeof photographer.rating ===
            "number" &&
        photographer.rating > 0
    ) {
        return photographer.rating;
    }

    return 0;
};

/**
 * Format Tanzania phone number.
 */
const formatTanzaniaPhone = (
    phone?: string | null
): string => {
    if (!phone) {
        return "";
    }

    const cleaned = phone.replace(/\D/g, "");

    if (!cleaned) {
        return "";
    }

    if (cleaned.startsWith("255")) {
        return `+${cleaned}`;
    }

    if (cleaned.startsWith("0")) {
        return `+255${cleaned.slice(1)}`;
    }

    return `+255${cleaned}`;
};

/**
 * Get full media URL.
 *
 * Example:
 * /uploads/media/image.jpg
 *
 * becomes:
 * https://api-domain.com/uploads/media/image.jpg
 */
const getMediaUrl = (
    fileUrl?: string | null
): string => {
    if (!fileUrl) {
        return "/default_user.svg";
    }

    if (
        fileUrl.startsWith("http://") ||
        fileUrl.startsWith("https://")
    ) {
        return fileUrl;
    }

    return `${API_URL}${fileUrl}`;
};

/**
 * Get package price.
 */
const formatPrice = (
    price?: number
): string => {
    if (
        typeof price !== "number"
    ) {
        return "Price not available";
    }

    return new Intl.NumberFormat(
        "en-TZ"
    ).format(price);
};

/**
 * Enhance backend data without inventing information.
 */
const normalizePhotographer = (
    photographer: Photographer
): Photographer => {
    return {
        ...photographer,

        name: getDisplayName(
            photographer
        ),

        location:
            photographer.address ||
            "Tanzania",

        rating:
            getDisplayRating(
                photographer
            ),

        totalReviews:
            photographer.totalReviews || 0,

        bio:
            photographer.bio || "",

        phone:
            photographer.phone || null,

        gallery:
            photographer.gallery || [],

        packages:
            photographer.packages || [],
    };
};

/* ============================================================
   PAGE
============================================================ */

export default function PhotographersPage() {
    const [
        photographersData,
        setPhotographersData,
    ] =
        useState<PageableResponse | null>(
            null
        );

    const [
        photographers,
        setPhotographers,
    ] =
        useState<Photographer[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [
        selectedPhotographer,
        setSelectedPhotographer,
    ] =
        useState<Photographer | null>(
            null
        );

    const [searchQuery, setSearchQuery] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [searchField, setSearchField] =
        useState<
            | "all"
            | "name"
            | "email"
            | "phone"
            | "location"
        >("all");

    const [showVerifiedOnly] =
        useState(true);

    const heroRef =
        useRef<HTMLElement | null>(
            null
        );

    const teamRef =
        useRef<HTMLElement | null>(
            null
        );

    const gridRef =
        useRef<HTMLDivElement | null>(
            null
        );

    /* ============================================================
       FETCH PHOTOGRAPHERS
    ============================================================ */

    const fetchPhotographers = async (
        page: number = 0
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await fetch(
                    `${API_URL}/photographers?page=${page}&size=20`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        cache: "no-store",
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Could not load photographers."
                );
            }

            const data: PageableResponse =
                await response.json();

            console.log(
                "Fetched photographers:",
                data
            );

            let content =
                data.content || [];

            if (showVerifiedOnly) {
                content =
                    content.filter(
                        (photographer) =>
                            photographer.isVerified ===
                            true
                    );
            }

            const normalized =
                content.map(
                    normalizePhotographer
                );

            setPhotographersData({
                ...data,
                content,
            });

            setPhotographers(
                normalized
            );

            /*
             * Backend already gives pagination.
             *
             * Do not calculate pages from filtered
             * content because that can produce wrong
             * pagination when backend pagination is used.
             */
            setTotalPages(
                data.totalPages || 1
            );
        } catch (err: any) {
            console.error(err);

            setError(
                err?.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotographers(
            currentPage
        );
    }, [
        currentPage,
        showVerifiedOnly,
    ]);

    /* ============================================================
       SEARCH
    ============================================================ */

    const filteredPhotographers =
        useCallback(() => {
            let filtered = [
                ...photographers,
            ];

            if (searchQuery.trim()) {
                const query =
                    searchQuery
                        .toLowerCase()
                        .trim();

                filtered =
                    filtered.filter(
                        (
                            photographer
                        ) => {
                            switch (
                                searchField
                            ) {
                                case "name":
                                    return (
                                        photographer.name
                                            ?.toLowerCase()
                                            .includes(
                                                query
                                            ) ||
                                        photographer.displayName
                                            ?.toLowerCase()
                                            .includes(
                                                query
                                            ) ||
                                        false
                                    );

                                case "email":
                                    return photographer.email
                                        .toLowerCase()
                                        .includes(
                                            query
                                        );

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
                                        photographer.address
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

                                case "all":
                                default:
                                    return (
                                        photographer.name
                                            ?.toLowerCase()
                                            .includes(
                                                query
                                            ) ||
                                        photographer.displayName
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
                                        photographer.address
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

    /* ============================================================
       ANIMATIONS
    ============================================================ */

    useEffect(() => {
        if (
            loading ||
            displayedPhotographers.length ===
                0
        ) {
            return;
        }

        const timer =
            setTimeout(() => {
                const ctx =
                    gsap.context(
                        () => {
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

                            if (
                                cards.length >
                                0
                            ) {
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
                                        scrollTrigger:
                                            {
                                                trigger:
                                                    teamRef.current,
                                                start: "top 85%",
                                                toggleActions:
                                                    "play none none reverse",
                                            },
                                    }
                                );
                            }
                        }
                    );

                return () =>
                    ctx.revert();
            }, 100);

        return () =>
            clearTimeout(timer);
    }, [
        loading,
        displayedPhotographers,
    ]);

    /* ============================================================
       ACTIONS
    ============================================================ */

    const handleViewProfile = (
        photographer: Photographer
    ) => {
        setSelectedPhotographer(
            photographer
        );

        /*
         * Prevent background page scrolling
         * while modal is open.
         */
        document.body.style.overflow =
            "hidden";
    };

    const closeProfile = () => {
        setSelectedPhotographer(
            null
        );

        document.body.style.overflow =
            "";
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow =
                "";
        };
    }, []);

    const clearSearch = () => {
        setSearchQuery("");
        setSearchField("all");
    };

    const getSearchPlaceholder =
        () => {
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

    /* ============================================================
       ERROR
    ============================================================ */

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

    /* ============================================================
       RETURN
    ============================================================ */

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

                    <div className="absolute top-20 left-10 text-white/5 text-7xl animate-pulse">
                        <FaCamera />
                    </div>

                    <div className="absolute bottom-20 right-10 text-white/5 text-9xl animate-pulse">
                        <FaCamera />
                    </div>

                    <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 hero-content opacity-0">
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
                                            value={
                                                searchQuery
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setSearchQuery(
                                                    e
                                                        .target
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
                                        (
                                            filter
                                        ) => {
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
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    y: [
                                        0,
                                        10,
                                        0,
                                    ],
                                }}
                                transition={{
                                    repeat:
                                        Infinity,
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
                                        className="text-[#25632D]"
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
                            <LoadingSpinner
                                message="Loading Photographers..."
                                size="md"
                            />
                        ) : (
                            <>
                                <div
                                    ref={
                                        gridRef
                                    }
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {displayedPhotographers.map(
                                        (
                                            photographer
                                        ) => {
                                            const phone =
                                                formatTanzaniaPhone(
                                                    photographer.phone
                                                );

                                            const rating =
                                                getDisplayRating(
                                                    photographer
                                                );

                                            const image =
                                                photographer.profileImage ||
                                                photographer.profileImageUrl;

                                            return (
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
                                                                    getMediaUrl(
                                                                        image
                                                                    )
                                                                }
                                                                fill
                                                                className="object-cover"
                                                                alt={
                                                                    photographer.name ||
                                                                    "Photographer"
                                                                }
                                                                unoptimized
                                                            />

                                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                            {/* STATUS */}

                                                            <div className="absolute top-4 right-4 z-10">
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
                                                            </div>

                                                            {/* RATING */}

                                                            <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                                                <FaStar className="text-yellow-400 text-sm" />

                                                                <span className="text-white text-sm font-semibold">
                                                                    {rating.toFixed(
                                                                        1
                                                                    )}
                                                                </span>

                                                                <span className="text-white/70 text-xs">
                                                                    (
                                                                    {
                                                                        photographer.totalReviews
                                                                    }{" "}
                                                                    reviews)
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
                                                                    <Image
                                                                        src={
                                                                            VERIFIED_ICON
                                                                        }
                                                                        alt="Verified"
                                                                        width={
                                                                            32
                                                                        }
                                                                        height={
                                                                            32
                                                                        }
                                                                        className="shrink-0 ml-2"
                                                                    />
                                                                )}
                                                            </div>

                                                            {/* EMAIL */}

                                                            <div className="space-y-2 mb-4">
                                                                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                                    <FaEnvelope className="text-[#25632D] text-xs shrink-0" />

                                                                    <span className="truncate">
                                                                        {
                                                                            photographer.email
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {/* PHONE */}

                                                                {phone && (
                                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                                        <FaPhoneAlt className="text-[#25632D] text-xs shrink-0" />

                                                                        <a
                                                                            href={`tel:${phone}`}
                                                                            className="hover:text-[#25632D]"
                                                                        >
                                                                            {
                                                                                phone
                                                                            }
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {/* ADDRESS */}

                                                                {photographer.address && (
                                                                    <div className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                                        <FaMapMarkerAlt className="text-[#25632D] text-xs shrink-0 mt-1" />

                                                                        <span className="line-clamp-2">
                                                                            {
                                                                                photographer.address
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* BIO */}

                                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-5 line-clamp-2">
                                                                {
                                                                    photographer.bio
                                                                }
                                                            </p>

                                                            {/* PACKAGE */}

                                                            {photographer.packages &&
                                                                photographer.packages.length >
                                                                    0 && (
                                                                    <div className="mb-5 p-4 rounded-xl bg-[#EAF4EC] dark:bg-[#25632D]/20">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                    Starting Package
                                                                                </p>

                                                                                <p className="font-bold text-[#25632D]">
                                                                                    {
                                                                                        photographer
                                                                                            .packages[0]
                                                                                            .name
                                                                                    }
                                                                                </p>
                                                                            </div>

                                                                            <div className="text-right">
                                                                                <p className="text-xs text-zinc-500">
                                                                                    Price
                                                                                </p>

                                                                                <p className="font-bold text-zinc-900 dark:text-white">
                                                                                    TSh{" "}
                                                                                    {formatPrice(
                                                                                        photographer
                                                                                            .packages[0]
                                                                                            .price
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* ACTIONS */}

                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={`mailto:${photographer.email}`}
                                                                    className="flex-1 text-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-[#EAF4EC] hover:text-[#25632D] transition text-sm"
                                                                >
                                                                    Email
                                                                </a>

                                                                {phone && (
                                                                    <a
                                                                        href={`tel:${phone}`}
                                                                        className="flex-1 text-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 transition text-sm"
                                                                    >
                                                                        Call
                                                                    </a>
                                                                )}

                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 bg-[#25632D] hover:bg-[#1e5125] text-white"
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
                                            );
                                        }
                                    )}
                                </div>

                                {/* NO RESULTS */}

                                {displayedPhotographers.length ===
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
                                            Try changing
                                            your search
                                            criteria.
                                        </p>

                                        {searchQuery && (
                                            <Button
                                                onClick={
                                                    clearSearch
                                                }
                                                className="mt-6 bg-[#25632D]"
                                            >
                                                Clear Search
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
                                            (
                                                _,
                                                i
                                            ) => {
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
                            onClick={
                                closeProfile
                            }
                        >
                            <motion.div
                                initial={{
                                    scale: 0.95,
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    scale: 0.95,
                                    opacity: 0,
                                    y: 20,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="bg-white dark:bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >
                                {/* ==================================================
                                    MODAL HEADER
                                ================================================== */}

                                <div className="relative">
                                    <button
                                        onClick={
                                            closeProfile
                                        }
                                        className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 rounded-full p-3 text-white transition"
                                    >
                                        <FaTimes />
                                    </button>

                                    <div className="relative h-80 md:h-96 bg-[#25632D]">
                                        <Image
                                            src={getMediaUrl(
                                                selectedPhotographer.profileImage ||
                                                    selectedPhotographer.profileImageUrl
                                            )}
                                            alt={
                                                selectedPhotographer.name ||
                                                "Photographer"
                                            }
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        <div className="absolute bottom-8 left-6 md:left-8 right-6 text-white">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-3xl md:text-4xl font-bold">
                                                    {
                                                        selectedPhotographer.name
                                                    }
                                                </h2>

                                                {selectedPhotographer.isVerified && (
                                                    <Image
                                                        src={
                                                            VERIFIED_ICON
                                                        }
                                                        alt="Verified"
                                                        width={
                                                            30
                                                        }
                                                        height={
                                                            30
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <p className="text-white/80 mt-2">
                                                Professional
                                                Photographer
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm flex items-center gap-2">
                                                    <FaStar className="text-yellow-400" />

                                                    {getDisplayRating(
                                                        selectedPhotographer
                                                    ).toFixed(
                                                        1
                                                    )}

                                                    <span className="text-white/70">
                                                        (
                                                        {
                                                            selectedPhotographer.totalReviews
                                                        }{" "}
                                                        reviews)
                                                    </span>
                                                </span>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        !selectedPhotographer.isBusy &&
                                                        selectedPhotographer.isOnline
                                                            ? "bg-green-500"
                                                            : selectedPhotographer.isBusy
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                    }`}
                                                >
                                                    {!selectedPhotographer.isBusy &&
                                                    selectedPhotographer.isOnline
                                                        ? "Available"
                                                        : selectedPhotographer.isBusy
                                                        ? "Booked"
                                                        : "Offline"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ==================================================
                                    MODAL BODY
                                ================================================== */}

                                <div className="p-6 md:p-8">
                                    <div className="grid lg:grid-cols-3 gap-8">

                                        {/* LEFT / MAIN */}

                                        <div className="lg:col-span-2 space-y-8">

                                            {/* BIO */}

                                            <section>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                                    Biography
                                                </h3>

                                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                                                    {selectedPhotographer.bio ||
                                                        "No biography provided."}
                                                </p>
                                            </section>

                                            {/* CONTACT DETAILS */}

                                            <section>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                                    Contact
                                                    Details
                                                </h3>

                                                <div className="grid sm:grid-cols-2 gap-4">

                                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                                        <FaEnvelope className="text-[#25632D] mt-1" />

                                                        <div className="min-w-0">
                                                            <p className="text-xs text-zinc-500">
                                                                Email
                                                            </p>

                                                            <a
                                                                href={`mailto:${selectedPhotographer.email}`}
                                                                className="text-sm font-medium text-zinc-800 dark:text-white break-all hover:text-[#25632D]"
                                                            >
                                                                {
                                                                    selectedPhotographer.email
                                                                }
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {selectedPhotographer.phone && (
                                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                                            <FaPhone className="text-[#25632D] mt-1" />

                                                            <div>
                                                                <p className="text-xs text-zinc-500">
                                                                    Phone
                                                                </p>

                                                                <a
                                                                    href={`tel:${formatTanzaniaPhone(
                                                                        selectedPhotographer.phone
                                                                    )}`}
                                                                    className="text-sm font-medium text-zinc-800 dark:text-white hover:text-[#25632D]"
                                                                >
                                                                    {formatTanzaniaPhone(
                                                                        selectedPhotographer.phone
                                                                    )}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {selectedPhotographer.address && (
                                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 sm:col-span-2">
                                                            <FaMapMarkerAlt className="text-[#25632D] mt-1" />

                                                            <div>
                                                                <p className="text-xs text-zinc-500">
                                                                    Address
                                                                </p>

                                                                <p className="text-sm font-medium text-zinc-800 dark:text-white">
                                                                    {
                                                                        selectedPhotographer.address
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>

                                            {/* PACKAGES */}

                                            <section>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                                        Photography
                                                        Packages
                                                    </h3>

                                                    <span className="text-sm text-zinc-500">
                                                        {
                                                            selectedPhotographer
                                                                .packages
                                                                ?.length
                                                        }{" "}
                                                        package
                                                        {selectedPhotographer
                                                            .packages
                                                            ?.length !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </span>
                                                </div>

                                                {selectedPhotographer.packages &&
                                                selectedPhotographer.packages.length >
                                                    0 ? (
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {selectedPhotographer.packages.map(
                                                            (
                                                                pkg
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        pkg.id
                                                                    }
                                                                    className="border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 hover:border-[#25632D] transition"
                                                                >
                                                                    <div className="flex justify-between items-start gap-3 mb-4">
                                                                        <div>
                                                                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-[#EAF4EC] text-[#25632D] font-semibold mb-2">
                                                                                {
                                                                                    pkg.level
                                                                                }
                                                                            </span>

                                                                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                                                                                {
                                                                                    pkg.name
                                                                                }
                                                                            </h4>
                                                                        </div>

                                                                        <FaCamera className="text-[#25632D]" />
                                                                    </div>

                                                                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                                                                        <FaClock className="text-[#25632D]" />

                                                                        {
                                                                            pkg.duration
                                                                        }{" "}
                                                                        hour
                                                                        {pkg.duration !==
                                                                        1
                                                                            ? "s"
                                                                            : ""}
                                                                    </div>

                                                                    <div className="flex items-center gap-2 mb-4">
                                                                        <FaMoneyBillWave className="text-[#25632D]" />

                                                                        <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                                                            TSh{" "}
                                                                            {formatPrice(
                                                                                pkg.price
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                    {pkg.features &&
                                                                        pkg
                                                                            .features
                                                                            .length >
                                                                            0 && (
                                                                            <div>
                                                                                <p className="text-xs text-zinc-500 mb-2">
                                                                                    Includes
                                                                                </p>

                                                                                <ul className="space-y-2">
                                                                                    {pkg.features.map(
                                                                                        (
                                                                                            feature,
                                                                                            index
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                                                                                            >
                                                                                                <FaCheckCircle className="text-green-500 shrink-0" />

                                                                                                {
                                                                                                    feature
                                                                                                }
                                                                                            </li>
                                                                                        )
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center text-zinc-500">
                                                        No packages
                                                        available.
                                                    </div>
                                                )}
                                            </section>

                                            {/* GALLERY */}

                                            <section>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <FaImage className="text-[#25632D]" />

                                                    Portfolio
                                                </h3>

                                                {selectedPhotographer.gallery &&
                                                selectedPhotographer.gallery.length >
                                                    0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {selectedPhotographer.gallery
                                                            .filter(
                                                                (
                                                                    item
                                                                ) =>
                                                                    item.fileType ===
                                                                        "IMAGE" ||
                                                                    !item.fileType
                                                            )
                                                            .map(
                                                                (
                                                                    item
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group"
                                                                    >
                                                                        <Image
                                                                            src={getMediaUrl(
                                                                                item.fileUrl
                                                                            )}
                                                                            alt={`${selectedPhotographer.name} portfolio`}
                                                                            fill
                                                                            unoptimized
                                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-center">
                                                        <FaImage className="text-3xl text-zinc-400 mx-auto mb-3" />

                                                        <p className="text-zinc-500">
                                                            No portfolio
                                                            images
                                                            available.
                                                        </p>
                                                    </div>
                                                )}
                                            </section>
                                        </div>

                                        {/* RIGHT SIDEBAR */}

                                        <aside className="space-y-5">

                                            {/* VERIFIED */}

                                            {selectedPhotographer.isVerified && (
                                                <div className="p-5 rounded-2xl bg-[#EAF4EC] dark:bg-[#25632D]/20">
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={
                                                                VERIFIED_ICON
                                                            }
                                                            alt="Verified"
                                                            width={
                                                                28
                                                            }
                                                            height={
                                                                28
                                                            }
                                                        />

                                                        <div>
                                                            <p className="font-bold text-[#25632D] dark:text-green-300">
                                                                Verified
                                                                Photographer
                                                            </p>

                                                            <p className="text-xs text-zinc-500 mt-1">
                                                                This photographer
                                                                has been
                                                                verified.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* RATING */}

                                            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                                                <p className="text-xs text-zinc-500 mb-2">
                                                    Rating
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <FaStar className="text-yellow-400 text-xl" />

                                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                                                        {getDisplayRating(
                                                            selectedPhotographer
                                                        ).toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-zinc-500 mt-1">
                                                    {
                                                        selectedPhotographer.totalReviews
                                                    }{" "}
                                                    reviews
                                                </p>
                                            </div>

                                            {/* SOCIAL */}

                                            {(selectedPhotographer.instagram ||
                                                selectedPhotographer.facebook ||
                                                selectedPhotographer.website) && (
                                                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                                                    <p className="font-semibold text-zinc-900 dark:text-white mb-3">
                                                        Social
                                                        & Links
                                                    </p>

                                                    <div className="space-y-2">
                                                        {selectedPhotographer.instagram && (
                                                            <a
                                                                href={
                                                                    selectedPhotographer.instagram
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-pink-50 hover:text-pink-600 transition"
                                                            >
                                                                <FaInstagram />

                                                                <span className="text-sm">
                                                                    Instagram
                                                                </span>
                                                            </a>
                                                        )}

                                                        {selectedPhotographer.facebook && (
                                                            <a
                                                                href={
                                                                    selectedPhotographer.facebook
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-blue-50 hover:text-blue-600 transition"
                                                            >
                                                                <span className="text-sm">
                                                                    Facebook
                                                                </span>
                                                            </a>
                                                        )}

                                                        {selectedPhotographer.website && (
                                                            <a
                                                                href={
                                                                    selectedPhotographer.website
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-green-50 hover:text-green-600 transition"
                                                            >
                                                                <span className="text-sm">
                                                                    Website
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* CONTACT BUTTONS */}

                                            <div className="space-y-3">
                                                <a
                                                    href={`mailto:${selectedPhotographer.email}`}
                                                    className="block"
                                                >
                                                    <Button className="w-full bg-[#25632D] hover:bg-[#1e5125] text-white">
                                                        <FaEnvelope className="mr-2" />
                                                        Send Email
                                                    </Button>
                                                </a>

                                                {selectedPhotographer.phone && (
                                                    <a
                                                        href={`tel:${formatTanzaniaPhone(
                                                            selectedPhotographer.phone
                                                        )}`}
                                                        className="block"
                                                    >
                                                        <Button className="w-full bg-[#1e5125] hover:bg-[#1e5125] text-white">
                                                            <FaPhoneAlt className="mr-2" />
                                                            Call{" "}
                                                            {formatTanzaniaPhone(
                                                                selectedPhotographer.phone
                                                            )}
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </aside>
                                    </div>

                                    {/* CLOSE */}

                                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-8 flex justify-end ">
                                        <Button
                                            variant="outline"
                                            onClick={
                                                closeProfile
                                            }
                                        >
                                            Close
                                        </Button>
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
