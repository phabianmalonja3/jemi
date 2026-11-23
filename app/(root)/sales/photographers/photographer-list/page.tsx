
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaCamera,
    FaSearch,
    FaTimes,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaStar,
    FaCheckCircle,
    FaClock,
    FaWifi,
    FaUser,
    FaChevronLeft,
    FaChevronRight,
    FaSync,
} from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";

/* ============================================================
   TYPES
============================================================ */

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

    isVerified?: boolean;
    isOnline?: boolean;
    isBusy?: boolean;

    averageRating?: number;
    rating?: number;
    totalReviews?: number;

    role?: string;

    createdAt?: string;
    updatedAt?: string;

    packages?: {
        id: string;
        name: string;
        level?: string;
        price?: number;
    }[];
}

interface PageableResponse {
    content: Photographer[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/* ============================================================
   CONFIGURATION
============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/* ============================================================
   HELPERS
============================================================ */

const getPhotographerName = (
    photographer: Photographer
): string => {
    if (photographer.displayName?.trim()) {
        return photographer.displayName.trim();
    }

    if (photographer.name?.trim()) {
        return photographer.name.trim();
    }

    if (photographer.email) {
        return photographer.email.split("@")[0];
    }

    return "Photographer";
};

const getRating = (photographer: Photographer): number => {
    if (
        typeof photographer.averageRating === "number" &&
        photographer.averageRating > 0
    ) {
        return photographer.averageRating;
    }

    if (
        typeof photographer.rating === "number" &&
        photographer.rating > 0
    ) {
        return photographer.rating;
    }

    return 0;
};

const formatPhone = (phone?: string | null): string => {
    if (!phone) return "Not provided";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("255")) {
        return `+${cleaned}`;
    }

    if (cleaned.startsWith("0")) {
        return `+255${cleaned.slice(1)}`;
    }

    return phone;
};

const getInitials = (name: string): string => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

/* ============================================================
   PAGE
============================================================ */

export default function SalesPhotographersPage() {
    const router = useRouter();

    const { user, isLoading: authLoading } = useAuth();

    const [photographers, setPhotographers] = useState<Photographer[]>([]);

    const [selectedPhotographer, setSelectedPhotographer] =
        useState<Photographer | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [verificationFilter, setVerificationFilter] =
        useState("ALL");

    const [availabilityFilter, setAvailabilityFilter] =
        useState("ALL");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    /* ========================================================
       AUTHORIZATION
    ======================================================== */

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "SALES") {
            router.replace(
                user.role === "ADMIN"
                    ? "/dashboard"
                    : "/login"
            );
        }
    }, [user, authLoading, router]);

    /* ========================================================
       FETCH PHOTOGRAPHERS
    ======================================================== */

    const fetchPhotographers = useCallback(
        async (page = 0, showRefreshing = false) => {
            try {
                if (showRefreshing) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/photographers?page=${page}&size=${pageSize}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        cache: "no-store",
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("is_login");

                    router.replace("/login");
                    return;
                }

                if (response.status === 403) {
                    throw new Error(
                        "You are not authorized to view photographers."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        `Failed to load photographers (${response.status}).`
                    );
                }

                const data: PageableResponse = await response.json();

                const content = Array.isArray(data.content)
                    ? data.content
                    : [];

                const photographerUsers = content.filter(
                    (item) =>
                        !item.role ||
                        item.role.toUpperCase() === "PHOTOGRAPHER"
                );

                setPhotographers(photographerUsers);

                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
                setCurrentPage(data.number ?? page);

            } catch (err) {
                console.error("Photographers fetch error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading photographers."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [router, pageSize]
    );

    useEffect(() => {
        if (authLoading || user?.role !== "SALES") return;

        fetchPhotographers(currentPage);
    }, [
        authLoading,
        user,
        currentPage,
        pageSize,
        fetchPhotographers,
    ]);

    /* ========================================================
       FILTERING AND SEARCH
    ======================================================== */

    const filteredPhotographers = useMemo(() => {
        let result = [...photographers];

        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter((photographer) => {
                const name = getPhotographerName(photographer);

                return (
                    name.toLowerCase().includes(query) ||
                    photographer.email?.toLowerCase().includes(query) ||
                    photographer.phone?.toLowerCase().includes(query) ||
                    photographer.address?.toLowerCase().includes(query)
                );
            });
        }

        if (verificationFilter === "VERIFIED") {
            result = result.filter((p) => p.isVerified === true);
        }

        if (verificationFilter === "UNVERIFIED") {
            result = result.filter((p) => p.isVerified !== true);
        }

        if (availabilityFilter === "ONLINE") {
            result = result.filter(
                (p) => p.isOnline === true && p.isBusy !== true
            );
        }

        if (availabilityFilter === "OFFLINE") {
            result = result.filter((p) => p.isOnline !== true);
        }

        if (availabilityFilter === "BUSY") {
            result = result.filter((p) => p.isBusy === true);
        }

        return result;
    }, [
        photographers,
        search,
        verificationFilter,
        availabilityFilter,
    ]);

    /* ========================================================
       STATISTICS
    ======================================================== */

    const verifiedCount = photographers.filter(
        (p) => p.isVerified === true
    ).length;

    const unverifiedCount = photographers.filter(
        (p) => p.isVerified !== true
    ).length;

    const onlineCount = photographers.filter(
        (p) => p.isOnline === true && p.isBusy !== true
    ).length;

    /* ========================================================
       PAGINATION
    ======================================================== */

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage((previous) => previous - 1);
        }
    };

    const handleNext = () => {
        if (currentPage + 1 < totalPages) {
            setCurrentPage((previous) => previous + 1);
        }
    };

    const handlePageSizeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0);
    };

    /* ========================================================
       LOADING AUTH
    ======================================================== */

    if (authLoading || !user || user.role !== "SALES") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#25632D] border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-sm text-zinc-500">
                        Checking access...
                    </p>
                </div>
            </div>
        );
    }

    /* ========================================================
       PAGE UI
    ======================================================== */

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#25632D]/10 flex items-center justify-center">
                            <FaCamera className="text-[#25632D] text-xl" />
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
                                Photographers
                            </h1>

                            <p className="text-sm text-zinc-500">
                                Manage and view registered photographers
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() =>
                            fetchPhotographers(currentPage, true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25632D] text-white hover:bg-[#1e5125] transition disabled:opacity-50"
                    >
                        <FaSync
                            className={refreshing ? "animate-spin" : ""}
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                </div>

                {/* STATISTICS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <StatCard
                        title="Total Photographers"
                        value={totalElements}
                        icon={<FaCamera />}
                        description="Registered photographers"
                    />

                    <StatCard
                        title="Verified"
                        value={verifiedCount}
                        icon={<FaCheckCircle />}
                        description="Verified on this page"
                        color="green"
                    />

                    <StatCard
                        title="Unverified"
                        value={unverifiedCount}
                        icon={<FaClock />}
                        description="Pending verification on this page"
                        color="orange"
                    />

                    <StatCard
                        title="Available Online"
                        value={onlineCount}
                        icon={<FaWifi />}
                        description="Online and not busy on this page"
                        color="blue"
                    />

                </div>

                {/* SEARCH AND FILTERS */}

                <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-5 mb-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="relative">

                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, email, phone..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#25632D]"
                            />

                        </div>

                        <select
                            value={verificationFilter}
                            onChange={(e) =>
                                setVerificationFilter(e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-[#25632D]"
                        >
                            <option value="ALL">All verification statuses</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="UNVERIFIED">Unverified</option>
                        </select>

                        <select
                            value={availabilityFilter}
                            onChange={(e) =>
                                setAvailabilityFilter(e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 outline-none focus:ring-2 focus:ring-[#25632D]"
                        >
                            <option value="ALL">All availability statuses</option>
                            <option value="ONLINE">Available online</option>
                            <option value="OFFLINE">Offline</option>
                            <option value="BUSY">Busy / Booked</option>
                        </select>

                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-3 mt-4">

                        <p className="text-sm text-zinc-500">
                            Showing{" "}
                            <strong className="text-zinc-900">
                                {filteredPhotographers.length}
                            </strong>{" "}
                            photographers on this page
                        </p>

                        {(search ||
                            verificationFilter !== "ALL" ||
                            availabilityFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setVerificationFilter("ALL");
                                    setAvailabilityFilter("ALL");
                                }}
                                className="text-sm text-[#25632D] font-semibold hover:underline"
                            >
                                Clear filters
                            </button>
                        )}

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">

                        <p className="text-red-600 font-medium">
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                fetchPhotographers(currentPage)
                            }
                            className="mt-3 text-sm font-semibold text-red-700 underline"
                        >
                            Try again
                        </button>

                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white">

                        <div className="w-10 h-10 border-4 border-[#25632D] border-t-transparent rounded-full animate-spin" />

                        <p className="mt-4 text-zinc-500">
                            Loading photographers...
                        </p>

                    </div>
                ) : (
                    <>

                        {/* PHOTOGRAPHERS TABLE */}

                        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">

                            <div className="overflow-x-auto">

                                <table className="w-full text-left bg-white">

                                    <thead className="bg-zinc-50">
                                        <tr>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Photographer
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Contact
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Location
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Rating
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Verification
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Availability
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase text-zinc-500 whitespace-nowrap">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-zinc-100">

                                        {filteredPhotographers.map((photographer) => {

                                            const name = getPhotographerName(photographer);
                                            const rating = getRating(photographer);

                                            return (
                                                <tr
                                                    key={photographer.id}
                                                    className="bg-white hover:bg-zinc-50 transition"
                                                >

                                                    {/* PHOTOGRAPHER */}

                                                    <td className="px-6 py-4 bg-white">
                                                        <div className="flex items-center gap-3 min-w-[210px]">

                                                            <div className="w-11 h-11 rounded-full bg-[#25632D]/10 text-[#25632D] flex items-center justify-center font-bold overflow-hidden shrink-0">

                                                                {photographer.profileImage ||
                                                                photographer.profileImageUrl ? (
                                                                    <img
                                                                        src={
    photographer.profileImage
        ? `${API_URL}${photographer.profileImage}`
        : photographer.profileImageUrl || "/default-avatar.png"
}
                                                                        alt={name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    getInitials(name)
                                                                )}

                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="font-semibold text-zinc-900 truncate">
                                                                    {name}
                                                                </p>

                                                                <p className="text-xs text-zinc-500">
                                                                    ID: {photographer.id}
                                                                </p>

                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* CONTACT */}

                                                    <td className="px-6 py-4 bg-white">
                                                        <div className="space-y-1 min-w-[180px]">

                                                            <p className="text-sm text-zinc-700 flex items-center gap-2">
                                                                <FaEnvelope className="text-zinc-400 text-xs shrink-0" />
                                                                {photographer.email}
                                                            </p>

                                                            <p className="text-sm text-zinc-500 flex items-center gap-2">
                                                                <FaPhone className="text-zinc-400 text-xs shrink-0" />
                                                                {formatPhone(photographer.phone)}
                                                            </p>

                                                        </div>
                                                    </td>

                                                    {/* LOCATION */}

                                                    <td className="px-6 py-4 bg-white">
                                                        <p className="text-sm text-zinc-600 flex items-center gap-2 min-w-[130px]">
                                                            <FaMapMarkerAlt className="text-zinc-400 shrink-0" />
                                                            {photographer.address || "Not provided"}
                                                        </p>
                                                    </td>

                                                    {/* RATING */}

                                                    <td className="px-6 py-4 bg-white">
                                                        <div className="flex items-center gap-1 text-sm">

                                                            <FaStar className="text-yellow-400" />

                                                            <span className="font-semibold text-zinc-800">
                                                                {rating.toFixed(1)}
                                                            </span>

                                                            <span className="text-xs text-zinc-400">
                                                                ({photographer.totalReviews ?? 0})
                                                            </span>

                                                        </div>
                                                    </td>

                                                    {/* VERIFICATION */}

                                                    <td className="px-6 py-4 bg-white">
                                                        {photographer.isVerified ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                                <FaCheckCircle />
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                                                <FaClock />
                                                                Unverified
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* AVAILABILITY */}

                                                    <td className="px-6 py-4 bg-white">
                                                        {photographer.isBusy ? (
                                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                                Busy
                                                            </span>
                                                        ) : photographer.isOnline ? (
                                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                                Online
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-xs font-semibold">
                                                                Offline
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* ACTION */}

                                                    <td className="px-6 py-4 bg-white">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedPhotographer(photographer)
                                                            }
                                                            className="px-4 py-2 rounded-lg bg-[#25632D]/10 text-[#25632D] text-sm font-semibold hover:bg-[#25632D] hover:text-white transition whitespace-nowrap"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                            {/* EMPTY STATE */}

                            {filteredPhotographers.length === 0 && (
                                <div className="text-center py-16 px-4 bg-white">

                                    <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
                                        <FaUser className="text-2xl text-zinc-400" />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-zinc-800">
                                        No photographers found
                                    </h3>

                                    <p className="mt-1 text-sm text-zinc-500">
                                        Try changing your search or filters.
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* PAGINATION */}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 bg-white border border-zinc-200 rounded-xl p-4">

                            {/* PAGE SIZE */}

                            <div className="flex items-center gap-3">

                                <span className="text-sm text-zinc-600">
                                    Rows per page:
                                </span>

                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-800 text-sm outline-none focus:ring-2 focus:ring-[#25632D]"
                                >
                                    {[5, 10, 25, 50, 100].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* RECORD INFORMATION */}

                            <p className="text-sm text-zinc-500 text-center">

                                Showing{" "}

                                <strong className="text-zinc-900">
                                    {totalElements === 0
                                        ? 0
                                        : currentPage * pageSize + 1}
                                    {" - "}
                                    {Math.min(
                                        (currentPage + 1) * pageSize,
                                        totalElements
                                    )}
                                </strong>

                                {" "}of{" "}

                                <strong className="text-zinc-900">
                                    {totalElements}
                                </strong>

                                {" "}photographers

                            </p>

                            {/* PAGE NAVIGATION */}

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={handlePrevious}
                                    disabled={currentPage === 0}
                                    className="w-9 h-9 rounded-lg border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 disabled:opacity-30 hover:bg-zinc-100 transition"
                                >
                                    <FaChevronLeft />
                                </button>

                                <span className="px-3 py-2 text-sm font-semibold text-zinc-700 whitespace-nowrap">
                                    Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
                                </span>

                                <button
                                    onClick={handleNext}
                                    disabled={
                                        totalPages === 0 ||
                                        currentPage + 1 >= totalPages
                                    }
                                    className="w-9 h-9 rounded-lg border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 disabled:opacity-30 hover:bg-zinc-100 transition"
                                >
                                    <FaChevronRight />
                                </button>

                            </div>

                        </div>

                    </>
                )}

            </div>

            {/* ====================================================
                PHOTOGRAPHER DETAILS MODAL
            ==================================================== */}

            {selectedPhotographer && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedPhotographer(null)}
                >

                    <div
                        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">

                            <h2 className="font-bold text-lg text-zinc-900">
                                Photographer Details
                            </h2>

                            <button
                                onClick={() => setSelectedPhotographer(null)}
                                className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-red-500"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* PROFILE */}

                        <div className="p-6">

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                                <div className="w-28 h-28 rounded-2xl bg-[#25632D]/10 flex items-center justify-center text-3xl font-bold text-[#25632D] overflow-hidden shrink-0">

                                    {selectedPhotographer.profileImage ||
                                    selectedPhotographer.profileImageUrl ? (
                                        <img
                                            src={
                                                (selectedPhotographer.profileImage ||
                                                    selectedPhotographer.profileImageUrl)!
                                            }
                                            alt={getPhotographerName(selectedPhotographer)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(
                                            getPhotographerName(selectedPhotographer)
                                        )
                                    )}

                                </div>

                                <div className="text-center sm:text-left">

                                    <h3 className="text-2xl font-bold text-zinc-900">
                                        {getPhotographerName(selectedPhotographer)}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        {selectedPhotographer.email}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">

                                        {selectedPhotographer.isVerified ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                                Unverified
                                            </span>
                                        )}

                                        {selectedPhotographer.isBusy ? (
                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                Busy
                                            </span>
                                        ) : selectedPhotographer.isOnline ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                Online
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold">
                                                Offline
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* CONTACT INFORMATION */}

                            <div className="mt-8">

                                <h4 className="font-bold text-zinc-900 mb-4">
                                    Contact Information
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <DetailItem
                                        icon={<FaEnvelope />}
                                        label="Email"
                                        value={selectedPhotographer.email}
                                    />

                                    <DetailItem
                                        icon={<FaPhone />}
                                        label="Phone"
                                        value={formatPhone(selectedPhotographer.phone)}
                                    />

                                    <DetailItem
                                        icon={<FaMapMarkerAlt />}
                                        label="Location"
                                        value={selectedPhotographer.address || "Not provided"}
                                    />

                                    <DetailItem
                                        icon={<FaStar />}
                                        label="Rating"
                                        value={`${getRating(selectedPhotographer).toFixed(1)} / 5`}
                                    />

                                    <DetailItem
                                        icon={<FaUser />}
                                        label="Total Reviews"
                                        value={String(selectedPhotographer.totalReviews ?? 0)}
                                    />

                                    <DetailItem
                                        icon={<FaCamera />}
                                        label="Photographer ID"
                                        value={selectedPhotographer.id}
                                    />

                                </div>

                            </div>

                            {/* BIO */}

                            <div className="mt-8">

                                <h4 className="font-bold text-zinc-900 mb-3">
                                    Biography
                                </h4>

                                <div className="bg-zinc-50 rounded-xl p-4">

                                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                                        {selectedPhotographer.bio ||
                                            "No biography provided."}
                                    </p>

                                </div>

                            </div>

                            {/* PACKAGES */}

                            <div className="mt-8">

                                <h4 className="font-bold text-zinc-900 mb-3">
                                    Packages
                                </h4>

                                {selectedPhotographer.packages &&
                                selectedPhotographer.packages.length > 0 ? (

                                    <div className="space-y-3">

                                        {selectedPhotographer.packages.map((pkg) => (

                                            <div
                                                key={pkg.id}
                                                className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-3 bg-white"
                                            >

                                                <div>

                                                    <p className="font-semibold text-zinc-800">
                                                        {pkg.name}
                                                    </p>

                                                    <p className="text-xs text-zinc-500 mt-1">
                                                        {pkg.level || "Package"}
                                                    </p>

                                                </div>

                                                {typeof pkg.price === "number" && (
                                                    <p className="font-bold text-[#25632D] whitespace-nowrap">
                                                        TZS{" "}
                                                        {new Intl.NumberFormat("en-TZ").format(pkg.price)}
                                                    </p>
                                                )}

                                            </div>

                                        ))}

                                    </div>

                                ) : (

                                    <p className="text-sm text-zinc-500 bg-zinc-50 rounded-xl p-4">
                                        No packages available.
                                    </p>

                                )}

                            </div>

                            {/* CLOSE */}

                            <button
                                onClick={() => setSelectedPhotographer(null)}
                                className="w-full mt-8 py-3 rounded-xl bg-[#25632D] text-white font-semibold hover:bg-[#1e5125] transition"
                            >
                                Close Details
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

/* ============================================================
   STAT CARD COMPONENT
============================================================ */

function StatCard({
    title,
    value,
    icon,
    description,
    color = "green",
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
    color?: "green" | "orange" | "blue";
}) {
    const colors = {
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        blue: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm text-zinc-500">
                    {title}
                </p>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>

            </div>

            <h3 className="text-3xl font-bold text-zinc-900 mt-4">
                {value.toLocaleString()}
            </h3>

            <p className="text-xs text-zinc-400 mt-1">
                {description}
            </p>

        </div>
    );
}

/* ============================================================
   DETAIL ITEM COMPONENT
============================================================ */

function DetailItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="bg-zinc-50 rounded-xl p-4">

            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                {icon}
                {label}
            </div>

            <p className="text-sm font-medium text-zinc-800 break-all">
                {value}
            </p>

        </div>
    );
}
