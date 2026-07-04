



export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface UserFilters {
  page: number;
  size: number;
  name?: string;
  sort: string;
  order: "asc" | "desc";
  role?: "ADMIN" | "PHOTOGRAPHER";
}
export interface Photographer {
    id: string;
    email: string;
    name: string | null;
    rating: number | null;
    isBusy: boolean;
    isOnline: boolean;
    role: 'PHOTOGRAPHER' | 'ADMIN' | 'USER'; // Add other roles as needed
}


// types/index.ts

// Base Photographer type from API
export interface Photographer {
    id: string;
    email: string;
    name: string | null;
    rating: number | null;
    isBusy: boolean;
    isOnline: boolean;
    role: 'PHOTOGRAPHER' | 'ADMIN' | 'USER'; // Add other roles as needed
}

// Enhanced Photographer type with additional UI fields
export interface EnhancedPhotographer extends Photographer {
    specialty: string;
    location: string;
    image: string;
    bio: string;
    experience: string;
    sessions: number;
    displayName: string;
    displayRating: number;
    achievements?: string[];
    instagram?: string;
    facebook?: string;
    twitter?: string;
    quote?: string;
}

// Package type for photography packages
export interface Package {
    id: string;
    name: string;
    duration: string;
    price: number;
    currency: string;
    features: string[];
    description: string;
    isActive?: boolean;
}

// Time Slot type for availability
export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
    date?: string;
}

// Booking request type
export interface BookingRequest {
    photographerId: string;
    photographerName: string;
    packageId: string;
    packageName: string;
    packagePrice: number;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    specialRequests?: string;
    bookingDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';
}

// Booking response type
export interface BookingResponse {
    id: string;
    bookingReference: string;
    status: string;
    message: string;
    createdAt: string;
}


export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PHOTOGRAPHER";
  createdAt: string;
  avatar?: string;
 enabled: boolean;
};
// Paginated API Response
export interface PaginatedResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
    };
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}

// Filter options
export interface PhotographerFilters {
    specialty?: string;
    minRating?: number;
    location?: string;
    isOnline?: boolean;
    isAvailable?: boolean;
    searchQuery?: string;
}

// Helper functions for Photographer data
export const getDisplayName = (photographer: Photographer): string => {
    if (photographer.name && photographer.name.trim() !== "") {
        return photographer.name;
    }
    const emailName = photographer.email.split('@')[0];
    if (emailName && emailName !== "photographer" && emailName !== "admin") {
        return emailName.split('.').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    return `Jemigraph Pro`;
};

export const getDisplayRating = (photographer: Photographer): number => {
    if (photographer.rating && photographer.rating > 0) {
        return photographer.rating;
    }
    const hash = photographer.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 20) / 10;
};

export const getSpecialtyFromId = (id: string): string => {
    const specialties = [
        "Adventure & Landscape", 
        "Cultural & Portrait", 
        "Wedding & Romance",
        "Wildlife & Nature", 
        "Urban & Street", 
        "Underwater & Marine"
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return specialties[hash % specialties.length];
};

export const getLocationFromId = (id: string): string => {
    const locations = [
        "New York, NY", "Los Angeles, CA", "London, UK", "Paris, France",
        "Tokyo, Japan", "Sydney, Australia", "Cape Town, SA", "Bali, Indonesia"
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return locations[hash % locations.length];
};

export const getBioFromId = (id: string): string => {
    const bios = [
        `Award-winning photographer with over 8 years of experience capturing life's most precious moments across the globe.`,
        `Visual storyteller specializing in authentic, emotion-driven photography that stands the test of time.`,
        `Creative director and photographer with a passion for blending natural light with artistic composition.`,
        `Internationally published photographer known for unique perspective and attention to detail.`,
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bios[hash % bios.length];
};

export const getSessionCount = (id: string): number => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 20 + (hash % 180);
};

export const getExperienceYears = (id: string): number => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 10);
};

// Enhance photographer with additional fields
export const enhancePhotographer = (photographer: Photographer): EnhancedPhotographer => {
    return {
        ...photographer,
        displayName: getDisplayName(photographer),
        displayRating: getDisplayRating(photographer),
        specialty: getSpecialtyFromId(photographer.id),
        location: getLocationFromId(photographer.id),
        image: `/api/placeholder/500/600?seed=${photographer.id}`,
        bio: getBioFromId(photographer.id),
        experience: `${getExperienceYears(photographer.id)}+ Years`,
        sessions: getSessionCount(photographer.id),
    };
};

// Default packages
export const DEFAULT_PACKAGES: Package[] = [
    {
        id: "basic",
        name: "Basic Session",
        duration: "1 hour",
        price: 199,
        currency: "USD",
        features: ["30 edited photos", "Online gallery", "1 location"],
        description: "Perfect for quick sessions and headshots",
        isActive: true
    },
    {
        id: "standard",
        name: "Standard Session",
        duration: "2 hours",
        price: 349,
        currency: "USD",
        features: ["60 edited photos", "Online gallery", "2 locations", "Print rights"],
        description: "Great for family portraits and events",
        isActive: true
    },
    {
        id: "premium",
        name: "Premium Session",
        duration: "4 hours",
        price: 599,
        currency: "USD",
        features: ["120 edited photos", "Online gallery", "Unlimited locations", "Print rights", "Photo album"],
        description: "Full coverage for weddings and special occasions",
        isActive: true
    }
];

// Default time slots
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
    { id: "1", time: "09:00 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "11:00 AM", available: true },
    { id: "4", time: "12:00 PM", available: true },
    { id: "5", time: "01:00 PM", available: true },
    { id: "6", time: "02:00 PM", available: true },
    { id: "7", time: "03:00 PM", available: true },
    { id: "8", time: "04:00 PM", available: true },
    { id: "9", time: "05:00 PM", available: true },
];