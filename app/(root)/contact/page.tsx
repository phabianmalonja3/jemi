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
    FaCheckCircle,
    FaHeadset,
    FaGlobe,
    FaWhatsapp
} from "react-icons/fa";

import Footer from "@/components/web/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {toast} from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

//       toast({
//      titleT: "Message Sent! 🎉",
//     description: "We'll get back to you within 24 hours. Thank you for reaching out!",
// });

        setFormData({
            name: "",
            email: "",
            subject: "",
            category: "",
            message: ""
        });
        setIsSubmitting(false);
    };

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: "Email Us",
            details: ["info@jemigraph.co.tz", "support@jemigraph.co.tz"],
            link: "mailto:info@jemigraph.co.tz"
        },
        {
            icon: FaPhone,
            title: "Call Us",
            details: ["+255 713 132 128", "+255 628 000 347"],
            link: "tel:+255628000347"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Visit Us",
            details: ["Geza", "Tanzania", "Kigambon Dar es salaam"],
            link: "https://maps.google.com"
        },
        {
            icon: FaClock,
            title: "Business Hours",
            details: ["Monday - Friday: 9AM - 6PM EST", "Saturday: 10AM - 4PM EST", "Sunday: Closed"],
            link: null
        }
    ];

    const faqs = [
        {
            question: "How do I book a photography tour?",
            answer: "You can book directly through our website by selecting an event or photographer and completing the booking form. You'll receive a confirmation email with all details."
        },
        {
            question: "What equipment do I need?",
            answer: "A camera (DSLR, mirrorless, or even a smartphone with good camera), extra batteries, memory cards, and comfortable walking shoes. We provide tripods and other equipment if needed."
        },
        {
            question: "Can I request a custom private tour?",
            answer: "Absolutely! Contact us with your requirements, and we'll create a personalized photography experience tailored to your needs and skill level."
        },
        {


            question: "What's your cancellation policy?",
            answer: "Free cancellation up to 14 days before the event. 50% refund up to 7 days before. No refunds within 7 days, but you can transfer to another date."
        },
        {
            question: "Do you offer group discounts?",
            answer: "Yes! Groups of 4 or more receive 10% off. Contact us for special group rates and corporate photography workshops."
        },
        {
            question: "Are the tours suitable for beginners?",
            answer: "Yes! Our tours cater to all skill levels. Our photographers provide guidance based on your experience level, from basic camera settings to advanced techniques."
        }
    ];

    return (
        <>
        <div className="flex flex-col min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-75 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/banners/contact-hero.png"
                        alt="Contact us"
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
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <FaHeadset className="text-emerald-400" />
                            <span className="text-white text-sm">Get in Touch</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Let&#39;s Start a Conversation
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg text-gray-200 max-w-2xl mx-auto"
                    >
                        Have questions about our tours? Need a custom photography experience? We&#39;re here to help!
                    </motion.p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 px-6 mt-16 relative z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Icon className="text-xl text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white mb-3">
                                                {info.title}
                                            </h3>
                                            <div className="space-y-1">
                                                {info.details.map((detail, idx) => (
                                                    <p key={idx} className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        {detail}
                                                    </p>
                                                ))}
                                            </div>
                                            {info.link && (
                                                <a href={info.link} className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
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

            {/* Contact Form & Map Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge variant="secondary" className="mb-4">Send a Message</Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                                We&#39;d Love to Hear From You
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            required
                                            placeholder="client "
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            required
                                            placeholder="Booking inquiry"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({...formData, category: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="booking">Booking Inquiry</SelectItem>
                                                <SelectItem value="custom">Custom Tour Request</SelectItem>
                                                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                                <SelectItem value="support">Technical Support</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        placeholder="Tell us about your photography interests, questions, or special requests..."
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>Sending... <FaPaperPlane className="ml-2 animate-pulse" /></>
                                    ) : (
                                        <>Send Message <FaPaperPlane className="ml-2" /></>
                                    )}
                                </Button>
                            </form>
                        </motion.div>

                        {/* Map & Support Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <Card>
    <CardHeader>
        <CardTitle>Find Us</CardTitle>
        <CardDescription>Our office in Gezaulole</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.210643298583!2d39.41159817317805!3d-6.865342467166217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185dc9928f39a6a9%3A0xe023acf1eb609ebc!2sGezaulole!5e0!3m2!1sen!2stz!4v1783752671016!5m2!1sen!2stz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
            />
        </div>
    </CardContent>
</Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>24/7 Support</CardTitle>
                                    <CardDescription>We&#39;re always here to help</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FaWhatsapp className="text-2xl text-green-500" />
                                        <div>
                                            <p className="font-semibold">WhatsApp Support</p>
                                            <p className="text-sm text-zinc-500">+255 (0) 754 321 654</p>
                                        </div>
                                    </div>
                                    
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Follow Us</CardTitle>
                                    <CardDescription>Stay connected on social media</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                            <FaInstagram className="text-xl text-zinc-600 dark:text-zinc-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                            <FaFacebook className="text-xl text-zinc-600 dark:text-zinc-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                            <FaTwitter className="text-xl text-zinc-600 dark:text-zinc-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                            <FaYoutube className="text-xl text-zinc-600 dark:text-zinc-400" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>


        </div>
        < Footer/>
        </>
    );
}