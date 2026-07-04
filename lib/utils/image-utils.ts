// lib/image-utils.ts
export const getFullImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Remove any /api/v0.1 prefix if present
    let cleanPath = imagePath;
    if (cleanPath.includes('/api/v0.1')) {
        cleanPath = cleanPath.replace('/api/v0.1', '');
    }
    
    // Make sure it starts with /uploads/
    if (!cleanPath.startsWith('/uploads/')) {
        cleanPath = '/uploads/profiles/' + cleanPath.replace(/^\/+/, '');
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v0.1', '') || 'http://172.20.10.2:8080';
    return `${baseUrl}${cleanPath}`;
};

export const getApiUrl = (endpoint: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://172.20.10.2:8080/api/v0.1';
    return `${baseUrl}${endpoint}`;
};