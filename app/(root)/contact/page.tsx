"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaPaperPlane,
    FaHeadset,
    FaWhatsapp,
} from "react-icons/fa";

import Footer from "@/components/web/Footer";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // TODO: Connect this to your backend API
            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                category: "",
                message: "",
            });

        } catch (error) {
            console.error("Contact form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: "Email Us",
            details: [
                "info@jemigraph.co.tz",
                "support@jemigraph.co.tz",
            ],
            link: "mailto:info@jemigraph.co.tz",
        },
        {
            icon: FaPhone,
            title: "Call Us",
            details: [
                "+255 791 069 302",
                "+255 628 000 347",
            ],
            link: "tel:+255628000347",
        },
        {
            icon: FaMapMarkerAlt,
            title: "Visit Us",
            details: [
                "Gezaulole",
                "Tanzania",
                "Kigamboni, Dar es Salaam",
            ],
            link: "https://maps.google.com",
        },
        {
            icon: FaClock,
            title: "Business Hours",
            details: [
                "Monday - Friday: 9AM - 6PM",
                "Saturday: 10AM - 4PM",
                "Sunday: Closed",
            ],
            link: null,
        },
    ];

    return (
        <>
            <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">

                {/* =====================================================
                    HERO SECTION
                ====================================================== */}

                <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">

                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">

                        <Image
                            src="/banners/contact-hero.png"
                            alt="Contact Jemigraph"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Jemigraph Green Overlay */}
                        <div className="absolute inset-0 bg-[#25632D]/85" />

                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.8,
                            }}
                        >

                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">

                                <FaHeadset className="text-white" />

                                <span className="text-white text-sm font-medium">
                                    Get in Touch
                                </span>

                            </div>

                        </motion.div>

                        <motion.h1
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                            }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5"
                        >
                            Let&#39;s Start a Conversation
                        </motion.h1>

                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3,
                            }}
                            className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto"
                        >
                            Have questions about our tours? Need a custom
                            photography experience? We&#39;re here to help!
                        </motion.p>

                    </div>

                </section>


                {/* =====================================================
                    CONTACT INFORMATION
                ====================================================== */}

                <section className="py-16 px-6 relative z-20">

                    <div className="max-w-6xl mx-auto">

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {contactInfo.map((info, index) => {

                                const Icon = info.icon;

                                return (

                                    <motion.div
                                        key={index}
                                        initial={{
                                            opacity: 0,
                                            y: 30,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            delay: index * 0.1,
                                        }}
                                    >

                                        <Card className="h-full border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                            <CardContent className="p-6 text-center">

                                                {/* Icon */}

                                                <div className="w-14 h-14 bg-[#25632D]/10 rounded-full flex items-center justify-center mx-auto mb-5">

                                                    <Icon className="text-xl text-[#25632D]" />

                                                </div>

                                                {/* Title */}

                                                <h3 className="font-bold text-zinc-900 dark:text-white mb-3">
                                                    {info.title}
                                                </h3>

                                                {/* Details */}

                                                <div className="space-y-1">

                                                    {info.details.map(
                                                        (detail, idx) => (

                                                            <p
                                                                key={idx}
                                                                className="text-sm text-zinc-600 dark:text-zinc-400"
                                                            >
                                                                {detail}
                                                            </p>

                                                        )
                                                    )}

                                                </div>

                                                {/* Link */}

                                                {info.link && (

                                                    <a
                                                        href={info.link}
                                                        target={
                                                            info.link.startsWith(
                                                                "http"
                                                            )
                                                                ? "_blank"
                                                                : undefined
                                                        }
                                                        rel={
                                                            info.link.startsWith(
                                                                "http"
                                                            )
                                                                ? "noopener noreferrer"
                                                                : undefined
                                                        }
                                                        className="inline-block mt-4 text-[#25632D] hover:text-[#1e5125] text-sm font-semibold transition-colors"
                                                    >
                                                        Get in Touch →
                                                    </a>

                                                )}

                                            </CardContent>

                                        </Card>

                                    </motion.div>

                                );

                            })}

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CONTACT FORM + MAP
                ====================================================== */}

                <section className="py-16 px-6">

                    <div className="max-w-6xl mx-auto">

                        <div className="grid lg:grid-cols-2 gap-12">

                            {/* =================================================
                                CONTACT FORM
                            ================================================== */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: -30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.6,
                                }}
                            >

                                <Badge
                                    variant="secondary"
                                    className="mb-4 bg-[#25632D]/10 text-[#25632D] border border-[#25632D]/20"
                                >
                                    Send a Message
                                </Badge>

                                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                                    We&#39;d Love to Hear From You
                                </h2>

                                <p className="text-zinc-600 dark:text-zinc-400 mb-7">
                                    Fill out the form below and our team will
                                    get back to you within 24 hours.
                                </p>


                                {/* FORM */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >

                                    {/* Name + Email */}

                                    <div className="grid md:grid-cols-2 gap-4">

                                        <div className="space-y-2">

                                            <Label htmlFor="name">
                                                Full Name *
                                            </Label>

                                            <Input
                                                id="name"
                                                required
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="focus-visible:ring-[#25632D]"
                                            />

                                        </div>


                                        <div className="space-y-2">

                                            <Label htmlFor="email">
                                                Email Address *
                                            </Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="hello@example.com"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="focus-visible:ring-[#25632D]"
                                            />

                                        </div>

                                    </div>


                                    {/* Subject + Category */}

                                    <div className="grid md:grid-cols-2 gap-4">

                                        <div className="space-y-2">

                                            <Label htmlFor="subject">
                                                Subject *
                                            </Label>

                                            <Input
                                                id="subject"
                                                required
                                                placeholder="Booking inquiry"
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        subject: e.target.value,
                                                    })
                                                }
                                                className="focus-visible:ring-[#25632D]"
                                            />

                                        </div>


                                        <div className="space-y-2">

                                            <Label htmlFor="category">
                                                Category
                                            </Label>

                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        category: value,
                                                    })
                                                }
                                            >

                                                <SelectTrigger className="focus:ring-[#25632D]">

                                                    <SelectValue
                                                        placeholder="Select a category"
                                                    />

                                                </SelectTrigger>

                                                <SelectContent>

                                                    <SelectItem value="booking">
                                                        Booking Inquiry
                                                    </SelectItem>

                                                    <SelectItem value="custom">
                                                        Custom Tour Request
                                                    </SelectItem>

                                                    <SelectItem value="partnership">
                                                        Partnership Opportunity
                                                    </SelectItem>

                                                    <SelectItem value="support">
                                                        Technical Support
                                                    </SelectItem>

                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>

                                                </SelectContent>

                                            </Select>

                                        </div>

                                    </div>


                                    {/* Message */}

                                    <div className="space-y-2">

                                        <Label htmlFor="message">
                                            Message *
                                        </Label>

                                        <Textarea
                                            id="message"
                                            required
                                            placeholder="Tell us about your photography interests, questions, or special requests..."
                                            rows={6}
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                            className="focus-visible:ring-[#25632D]"
                                        />

                                    </div>


                                    {/* Submit */}

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#25632D] hover:bg-[#1e5125] text-white"
                                    >

                                        {isSubmitting ? (
                                            <>
                                                Sending...

                                                <FaPaperPlane className="ml-2 animate-pulse" />
                                            </>
                                        ) : (
                                            <>
                                                Send Message

                                                <FaPaperPlane className="ml-2" />
                                            </>
                                        )}

                                    </Button>

                                </form>

                            </motion.div>


                            {/* =================================================
                                RIGHT SIDE
                            ================================================== */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.6,
                                }}
                                className="space-y-6"
                            >

                                {/* =================================================
                                    MAP
                                ================================================== */}

                                <Card>

                                    <CardHeader>

                                        <CardTitle>
                                            Find Us
                                        </CardTitle>

                                        <CardDescription>
                                            Our office in Gezaulole
                                        </CardDescription>

                                    </CardHeader>

                                    <CardContent>

                                        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">

                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.210643298583!2d39.41159817317805!3d-6.865342467166217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185dc9928f39a6a9%3A0xe023acf1eb609ebc!2sGezaulole!5e0!3m2!1sen!2stz!4v1783752671016!5m2!1sen!2stz"
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    border: 0,
                                                }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                            />

                                        </div>

                                    </CardContent>

                                </Card>


                                {/* =================================================
                                    WHATSAPP SUPPORT
                                ================================================== */}

                                <Card>

                                    <CardHeader>

                                        <CardTitle>
                                            24/7 Support
                                        </CardTitle>

                                        <CardDescription>
                                            We&#39;re always here to help
                                        </CardDescription>

                                    </CardHeader>

                                    <CardContent>

                                        <a
                                            href="https://wa.me/255754321654"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 group"
                                        >

                                            <div className="w-12 h-12 rounded-full bg-[#25632D]/10 flex items-center justify-center">

                                                <FaWhatsapp className="text-2xl text-[#25632D]" />

                                            </div>

                                            <div>

                                                <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-[#25632D] transition-colors">
                                                    WhatsApp Support
                                                </p>

                                                <p className="text-sm text-zinc-500">
                                                    +255 754 321 654
                                                </p>

                                            </div>

                                        </a>

                                    </CardContent>

                                </Card>


                                {/* =================================================
                                    SOCIAL MEDIA
                                ================================================== */}

                                <Card>

                                    <CardHeader>

                                        <CardTitle>
                                            Follow Us
                                        </CardTitle>

                                        <CardDescription>
                                            Stay connected on social media
                                        </CardDescription>

                                    </CardHeader>

                                    <CardContent>

                                        <div className="flex gap-4">

                                            {/* Instagram */}

                                            <a
                                                href="#"
                                                aria-label="Instagram"
                                                className="w-11 h-11 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[#25632D] transition-all duration-300 group"
                                            >

                                                <FaInstagram className="text-xl text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors" />

                                            </a>


                                            {/* Facebook */}

                                            <a
                                                href="#"
                                                aria-label="Facebook"
                                                className="w-11 h-11 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[#25632D] transition-all duration-300 group"
                                            >

                                                <FaFacebook className="text-xl text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors" />

                                            </a>


                                            {/* Twitter */}

                                            <a
                                                href="#"
                                                aria-label="Twitter"
                                                className="w-11 h-11 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[#25632D] transition-all duration-300 group"
                                            >

                                                <FaTwitter className="text-xl text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors" />

                                            </a>


                                            {/* YouTube */}

                                            <a
                                                href="#"
                                                aria-label="YouTube"
                                                className="w-11 h-11 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[#25632D] transition-all duration-300 group"
                                            >

                                                <FaYoutube className="text-xl text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors" />

                                            </a>

                                        </div>

                                    </CardContent>

                                </Card>

                            </motion.div>

                        </div>

                    </div>

                </section>

            </div>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <Footer />

        </>
    );
}
