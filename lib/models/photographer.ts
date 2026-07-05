interface Photographer {
    id: string;
    email: string;
    name: string | null;
    rating: number | null;
    isBusy: boolean;
    isOnline: boolean;
    role: string;
    specialty?: string;
    location?: string;
    profileImage?: string;
    averageRating?: null | number;
    totalReviews?: null | number;
    bio?: string;
    quote?: string;
    experience?: string;
    sessions?: number;
    achievements?: string[];
    instagram?: string;
    facebook?: string;
    twitter?: string;
}


interface PageableResponse {
    content: Photographer[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: any;
    size: number;
    sort: any;
    totalElements: number;
    totalPages: number;
}

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

