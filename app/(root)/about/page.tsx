"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FaCamera,
    FaHeart,
    FaGlobe,
    FaUsers,
    FaAward,
    FaStar,
    FaQuoteLeft,
    FaArrowRight,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock
} from "react-icons/fa";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/web/Footer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
    const statsRef = useRef(null);
    const teamRef = useRef(null);
    const valuesRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-number", {
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                innerHTML: 0,
                duration: 2,
                snap: "innerHTML",
                stagger: 0.3,
                ease: "power1.inOut"
            });

            gsap.from(".team-member", {
                scrollTrigger: {
                    trigger: teamRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
            });

            gsap.from(".value-card", {
                scrollTrigger: {
                    trigger: valuesRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
                scale: 0.9,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
            });
        });

        return () => ctx.revert();
    }, []);

  

    const values = [
        {
            title: "Passion for Photography",
            description: "We live and breathe photography. Every member of our team shares an unbridled passion for capturing beautiful moments.",
            icon: FaCamera,
            color: "emerald"
        },
        {
            title: "Authentic Experiences",
            description: "We believe in genuine connections and authentic travel experiences that go beyond typical tourist spots.",
            icon: FaHeart,
            color: "rose"
        },
        {
            title: "Professional Excellence",
            description: "Our photographers are award-winning professionals dedicated to delivering the highest quality work.",
            icon: FaAward,
            color: "blue"
        },
        {
            title: "Sustainable Tourism",
            description: "We're committed to responsible travel practices that protect and preserve local communities and environments.",
            icon: FaGlobe,
            color: "green"
        }
    ];

    const team = [
        {
            name: "Jeremiah lutego weslaus",
            role: "Founder & Lead Photographer",
            bio: "Former National Geographic photographer with over 15 years of experience capturing the world's most breathtaking locations.",
             image: "/images/ceo.jpeg",
            social: { instagram: "#", twitter: "#" }
        },
        {
  name: "Phabian Ezekiel Malonja",
  role: "System Developer & Visual Ethnographer",
  bio: "Award-winning portrait and cultural photographer who has documented traditions in over 40 countries, now bridging legacy storytelling with digital systems.",
  image: "/default_user.svg",
  social: { 
    instagram: "https://instagram.com/phabian.malonja", 
    twitter: "https://twitter.com/phabian_malonja",
    website: "https://phabianmalonja.com" // optional addition
  }
},
        {
            name: "David Kim",
            role: "Workshop Director",
            bio: "Passionate educator and landscape photographer dedicated to helping others master their craft.",
          image: "/default_user.svg",
            social: { instagram: "#", twitter: "#" }
        },
        {
            name: "Emma Watson",
            role: "Wildlife Specialist",
            bio: "Marine biologist turned wildlife photographer, specializing in conservation storytelling.",
             image: "/default_user.svg",
            social: { instagram: "#", twitter: "#" }
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >

                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Capturing Moments,
                        <br />
                        <span className="text-emerald-400">Creating Memories</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                    >
                        We're on a mission to connect passionate photographers with extraordinary travel experiences around the globe
                    </motion.p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
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
                                    worldwide. Our team of 50+ professional photographers brings together diverse expertise, from wildlife
                                    photography in Africa to cultural portraits in Asia and landscape photography in Europe.
                                </p>
                                <p>
                                    But beyond the numbers, we're most proud of the community we've built. Every photo shared, every
                                    skill learned, and every friendship formed on our tours is a testament to the power of visual storytelling.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="relative h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src="/images/avatar.png"
                                            alt="Story 1"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src="/images/avatar.png"
                                            alt="Story 2"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="relative h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src="/images/avatar.png"
                                            alt="Story 3"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative h-64 rounded-lg overflow-hidden">
                                        <Image
                                               src="/images/avatar.png"
                                            alt="Story 4"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section ref={valuesRef} className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <Badge variant="secondary" className="mb-4">What Drives Us</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="value-card group"
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="h-full text-center hover:shadow-xl transition-all duration-300">
                                        <CardContent className="pt-6">
                                            <div className={`w-16 h-16 bg-${value.color}-100 dark:bg-${value.color}-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className={`text-2xl text-${value.color}-600 dark:text-${value.color}-400`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                                {value.title}
                                            </h3>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                                {value.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>



            {/* Team Section */}
            <section ref={teamRef} className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <Badge variant="secondary" className="mb-4">Meet the Team</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                            Behind the Lens
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            The passionate individuals who make our photography tours extraordinary
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="team-member group"
                                whileHover={{ y: -5 }}
                            >
                                <Card className="overflow-hidden">
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardHeader>
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
                                            <a href={member.social.instagram} className="text-zinc-400 hover:text-emerald-600 transition">
                                                <FaInstagram className="text-xl" />
                                            </a>
                                            <a href={member.social.twitter} className="text-zinc-400 hover:text-emerald-600 transition">
                                                <FaTwitter className="text-xl" />
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
        <Footer />
        </>
    );
}