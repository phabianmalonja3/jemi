import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/web/Footer";
import { 
    FaCamera, 
    FaHeart, 
    FaAward, 
    FaGlobe, 
    FaInstagram, 
    FaTwitter, 
    FaGlobeAmericas 
} from "react-icons/fa";

// Define TypeScript interface for team members matching your backend response
interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image: string;
    social: {
        instagram?: string;
        twitter?: string;
        website?: string;
    };
}

async function getTeamMembers(): Promise<TeamMember[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`, {
            cache: "no-store", // Ensures fresh data on every request
        });

        if (!res.ok) {
            throw new Error("Failed to fetch team members from backend");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching team:", error);
        return []; // Fallback to empty array if backend is down
    }
}

export default async function AboutPage() {
    const team = await getTeamMembers();

    const values = [
        {
            title: "Passion for Photography",
            description: "We live and breathe photography. Every member of our team shares an unbridled passion for capturing beautiful moments.",
            icon: FaCamera,
            bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
            textClass: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: "Authentic Experiences",
            description: "We believe in genuine connections and authentic travel experiences that go beyond typical tourist spots.",
            icon: FaHeart,
            bgClass: "bg-rose-100 dark:bg-rose-900/30",
            textClass: "text-rose-600 dark:text-rose-400"
        },
        {
            title: "Professional Excellence",
            description: "Our photographers are award-winning professionals dedicated to delivering the highest quality work.",
            icon: FaAward,
            bgClass: "bg-blue-100 dark:bg-blue-900/30",
            textClass: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Sustainable Tourism",
            description: "We're committed to responsible travel practices that protect and preserve local communities and environments.",
            icon: FaGlobe,
            bgClass: "bg-green-100 dark:bg-green-900/30",
            textClass: "text-green-600 dark:text-green-400"
        }
    ];

    return (
        <>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/banners/about_us.jpg"
                        alt="About us hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Capturing Moments,
                        <br />
                        <span className="text-emerald-400">Creating Memories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        We're on a mission to connect passionate photographers with extraordinary travel experiences around the globe
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge variant="secondary" className="mb-4">Our Journey</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                                From a Dream to a Global Community
                            </h2>
                            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                                <p>
                                    Founded in 2018 by a group of passionate photographers, PhotoTours was born from a simple idea:
                                    combine the love for travel with the art of photography. What started as small group workshops
                                    in Bali has grown into a global network of expert photographers and adventure seekers.
                                </p>
                                <p>
                                    Today, we've helped over 5,000 travelers capture their most precious moments across 120+ destinations
                                    worldwide. Our team of 50+ professional photographers brings together diverse expertise.
                                </p>
                            </div>
                        </div>

                        <div className="relative grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <Image src="/images/avatar.png" alt="Story 1" fill className="object-cover" />
                                </div>
                                <div className="relative h-48 rounded-lg overflow-hidden">
                                    <Image src="/images/avatar.png" alt="Story 2" fill className="object-cover" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="relative h-48 rounded-lg overflow-hidden">
                                    <Image src="/images/avatar.png" alt="Story 3" fill className="object-cover" />
                                </div>
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <Image src="/images/avatar.png" alt="Story 4" fill className="object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 px-6 bg-zinc-100/50 dark:bg-zinc-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">What Drives Us</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card key={index} className="h-full text-center hover:shadow-xl transition-all duration-300">
                                    <CardContent className="pt-6">
                                        <div className={`w-16 h-16 ${value.bgClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <Icon className={`text-2xl ${value.textClass}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section (Dynamic from Backend) */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">Meet the Team</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                            Behind the Lens
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            The passionate individuals who make our photography tours extraordinary
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <Card key={index} className="overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
                                <div className="relative h-80 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                    <Image
                                        src={
                                            member.image 
                                                ? (member.image.startsWith("http") ? member.image : `${process.env.NEXT_PUBLIC_API_URL}${member.image}`)
                                                : "/default_user.svg"
                                        }
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <CardHeader className="flex-grow">
                                    <CardTitle className="text-xl">{member.name}</CardTitle>
                                    <CardDescription className="text-emerald-600 dark:text-emerald-400 font-medium">
                                        {member.role}
                                    </CardDescription>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                        {member.bio}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-3">
                                        {member.social?.instagram && (
                                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-600 transition">
                                                <FaInstagram className="text-xl" />
                                            </a>
                                        )}
                                        {member.social?.twitter && (
                                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-600 transition">
                                                <FaTwitter className="text-xl" />
                                            </a>
                                        )}
                                        {member.social?.website && (
                                            <a href={member.social.website} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-600 transition">
                                                <FaGlobeAmericas className="text-xl" />
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
        <Footer />
        </>
    );
}