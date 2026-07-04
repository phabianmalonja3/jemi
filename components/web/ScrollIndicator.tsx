// components/ScrollIndicator.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export const ScrollIndicator = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    if (usePathname().startsWith("/admin") || usePathname().startsWith("/photographer") ) return null;


    return (
        <>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#25632D] to-emerald-600 z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Scroll to Top Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg z-40 transition-all duration-300 hover:scale-110"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </motion.button>
        </>
    );
};