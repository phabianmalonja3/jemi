export  const EventLists=[
        
        {
        coverImage: "/event-bali-cover.jpg",
        location: "Bali, Indonesia",
        date: "2024-06-15",
        endDate: "2024-06-20",
        price: 1299,
        originalPrice: 1599,
        spots: 12,
        totalSpots: 15,
        category: "workshop",
        type: "Photography Workshop",
        difficulty: "Beginner to Intermediate",
        duration: "5 days",
        languages: ["English", "Indonesian"],
        included: [
            "Professional photography guidance",
            "Accommodation (5 nights)",
            "Meals (breakfast & lunch)",
            "Transportation between locations",
            "Entry fees to all locations",
            "Post-processing session"
        ],
        itinerary: [
            { day: 1, title: "Arrival & Introduction", description: "Welcome dinner, gear check, and workshop overview" },
            { day: 2, title: "Rice Terraces & Waterfalls", description: "Sunrise shoot at Tegallalang, afternoon at Tegenungan Waterfall" },
            { day: 3, title: "Temple Photography", description: "Explore Tanah Lot and Uluwatu temples at golden hour" },
            { day: 4, title: "Cultural Portraits", description: "Street photography in Ubud, traditional dance performance" },
            { day: 5, title: "Beach Sunset & Editing", description: "Beach photography workshop, post-processing session" }
        ],
        photographer: {
            name: "Alex Morgan",
            role: "Lead Adventure Photographer",
            image: "/photographer-1.jpg"
        },
        rating: 4.9,
        reviews: 128,
        featured: true
    },
    {
        id: 2,
        title: "Safari Photography Expedition",
        description: "Witness and capture Africa's magnificent wildlife on this 7-day safari adventure.",
        longDescription: "Embark on the ultimate wildlife photography safari in Tanzania's Serengeti and Ngorongoro Crater. This expedition focuses on animal behavior, action photography, and capturing the raw beauty of African landscapes.",
        image: "/event-safari.jpg",
        coverImage: "/event-safari-cover.jpg",
        location: "Serengeti, Tanzania",
        date: "2024-07-10",
        endDate: "2024-07-17",
        price: 2499,
        originalPrice: 2999,
        spots: 8,
        totalSpots: 12,
        category: "expedition",
        type: "Wildlife Expedition",
        difficulty: "Intermediate to Advanced",
        duration: "7 days",
        languages: ["English"],
        included: [
            "Game drives in open vehicles",
            "Luxury tented accommodation",
            "All meals",
            "Professional wildlife photography guide",
            "Park entry fees",
            "Post-processing masterclass"
        ],
        itinerary: [
            { day: 1, title: "Arrival in Arusha", description: "Welcome briefing and equipment preparation" },
            { day: 2, title: "Lake Manyara", description: "Tree-climbing lions and flamingo photography" },
            { day: 3, title: "Serengeti Central", description: "Great migration and predator action" },
            { day: 4, title: "Serengeti North", description: "River crossings and crocodile action" },
            { day: 5, title: "Ngorongoro Crater", description: "Big Five photography in the crater" },
            { day: 6, title: "Maasai Village", description: "Cultural portrait photography" },
            { day: 7, title: "Departure", description: "Farewell breakfast and photo sharing" }
        ],
        photographer: {
            name: "Emma Watson",
            role: "Wildlife & Nature Photographer",
            image: "/photographer-4.jpg"
        },
        rating: 5.0,
        reviews: 94,
        featured: true
    },
    {
        id: 3,
        title: "Northern Lights Photo Tour",
        description: "Chase the Aurora Borealis across Iceland's most photogenic landscapes.",
        longDescription: "Experience the magic of the Northern Lights while learning night photography techniques. This tour takes you to Iceland's best Aurora viewing spots including Jökulsárlón Glacier Lagoon and Kirkjufell Mountain.",
        image: "/event-northern-lights.jpg",
        coverImage: "/event-northern-lights-cover.jpg",
        location: "Iceland",
        date: "2024-09-05",
        endDate: "2024-09-10",
        price: 1899,
        originalPrice: 2199,
        spots: 10,
        totalSpots: 14,
        category: "tour",
        type: "Northern Lights Tour",
        difficulty: "Beginner to Intermediate",
        duration: "5 days",
        languages: ["English"],
        included: [
            "Night photography workshops",
            "4x4 transportation",
            "Accommodation",
            "Warm drinks & snacks",
            "Tripod rental",
            "Post-processing guide"
        ],
        itinerary: [
            { day: 1, title: "Reykjavik & Gear Check", description: "Equipment review and Aurora forecast workshop" },
            { day: 2, title: "Golden Circle", description: "Thingvellir, Gullfoss, and Geysir photography" },
            { day: 3, title: "South Coast", description: "Seljalandsfoss and Skógafoss waterfalls" },
            { day: 4, title: "Jökulsárlón", description: "Glacier lagoon and Diamond Beach at sunrise" },
            { day: 5, title: "Northern Lights Hunt", description: "Full night Aurora photography expedition" }
        ],
        photographer: {
            name: "David Kim",
            role: "Night & Landscape Photographer",
            image: "/photographer-3.jpg"
        },
        rating: 4.8,
        reviews: 76,
        featured: false
    },
    {
        id: 4,
        title: "Venice Carnival Photo Tour",
        description: "Capture the mystery and romance of Venice during the famous Carnival season.",
        longDescription: "Join us for a unique photography experience during Venice Carnival. Learn street and portrait photography while capturing elaborate costumes, masks, and the city's stunning architecture.",
        image: "/event-venice.jpg",
        coverImage: "/event-venice-cover.jpg",
        location: "Venice, Italy",
        date: "2025-02-10",
        endDate: "2025-02-15",
        price: 1599,
        originalPrice: 1899,
        spots: 15,
        totalSpots: 18,
        category: "tour",
        type: "Cultural Photography",
        difficulty: "All Levels",
        duration: "5 days",
        languages: ["English", "Italian"],
        included: [
            "Private gondola photo session",
            "Costume portrait sessions",
            "Accommodation in historic hotel",
            "Water taxi transportation",
            "Entry to exclusive Carnival events",
            "Editing workshop"
        ],
        itinerary: [
            { day: 1, title: "Arrival & Introduction", description: "Carnival history and photography techniques" },
            { day: 2, title: "St. Mark's Square", description: "Crowd and costume photography" },
            { day: 3, title: "Hidden Venice", description: "Off-the-beaten-path locations" },
            { day: 4, title: "Gondola Session", description: "Private gondola photo shoot" },
            { day: 5, title: "Farewell & Editing", description: "Photo review and editing session" }
        ],
        photographer: {
            name: "Sofia Rodriguez",
            role: "Cultural & Portrait Specialist",
            image: "/photographer-2.jpg"
        },
        rating: 4.9,
        reviews: 103,
        featured: true
    },
    {
        id: 5,
        title: "Japanese Cherry Blossom Workshop",
        description: "Photograph Japan's iconic cherry blossoms during peak bloom season.",
        longDescription: "Capture the ephemeral beauty of sakura season in Japan's most photogenic locations including Tokyo, Kyoto, and Mount Fuji.",
        image: "/event-japan.jpg",
        coverImage: "/event-japan-cover.jpg",
        location: "Japan",
        date: "2025-03-20",
        endDate: "2025-03-28",
        price: 2299,
        originalPrice: 2599,
        spots: 10,
        totalSpots: 12,
        category: "workshop",
        type: "Spring Photography",
        difficulty: "All Levels",
        duration: "8 days",
        languages: ["English", "Japanese"],
        included: [
            "JR Rail Pass (7 days)",
            "Accommodation",
            "Expert photography guidance",
            "Early morning shoots",
            "Night photography sessions",
            "Cultural experiences"
        ],
        itinerary: [
            { day: 1, title: "Tokyo Arrival", description: "Welcome dinner and gear check" },
            { day: 2, title: "Shinjuku Gyoen", description: "Garden and cherry blossom photography" },
            { day: 3, title: "Mount Fuji", description: "Fuji with cherry blossoms foreground" },
            { day: 4, title: "Kyoto", description: "Philosopher's Path and temples" },
            { day: 5, title: "Arashiyama", description: "Bamboo forest and cherry blossoms" },
            { day: 6, title: "Osaka", description: "Osaka Castle night photography" },
            { day: 7, title: "Nara", description: "Deer park and temple photography" },
            { day: 8, title: "Departure", description: "Final photo review and farewell" }
        ],
        photographer: {
            name: "Marcus Thompson",
            role: "Urban & Street Photographer",
            image: "/photographer-5.jpg"
        },
        rating: 4.9,
        reviews: 67,
        featured: false
    },
    {
        id: 6,
        title: "Underwater Photography Course",
        description: "Learn underwater photography techniques in the crystal-clear waters of Maldives.",
        longDescription: "Master underwater photography with professional guidance in one of the world's best diving locations. Perfect for both beginners and experienced divers.",
        image: "/event-maldives.jpg",
        coverImage: "/event-maldives-cover.jpg",
        location: "Maldives",
        date: "2024-08-10",
        endDate: "2024-08-17",
        price: 2799,
        originalPrice: 3299,
        spots: 6,
        totalSpots: 8,
        category: "expedition",
        type: "Underwater Workshop",
        difficulty: "Intermediate",
        duration: "7 days",
        languages: ["English"],
        included: [
            "Diving certification (if needed)",
            "Underwater housing rental",
            "Luxury overwater villa",
            "All meals",
            "Boat trips to dive sites",
            "Underwater editing session"
        ],
        itinerary: [
            { day: 1, title: "Arrival & Equipment Setup", description: "Gear check and pool practice" },
            { day: 2, title: "House Reef", description: "Introduction to underwater photography" },
            { day: 3, title: "Shipwreck", description: "Wreck photography techniques" },
            { day: 4, title: "Manta Ray Point", description: "Wide-angle wildlife photography" },
            { day: 5, title: "Coral Gardens", description: "Macro photography workshop" },
            { day: 6, title: "Night Dive", description: "Night photography with artificial lighting" },
            { day: 7, title: "Departure", description: "Photo review and certificate ceremony" }
        ],
        photographer: {
            name: "Priya Sharma",
            role: "Underwater & Marine Specialist",
            image: "/photographer-6.jpg"
        },
        rating: 4.8,
        reviews: 54,
        featured: true
    }
];
