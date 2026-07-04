// components/CircularScrollIndicator.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const CircularScrollIndicator = () => {
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

    return (
        <>
            {/* Top Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Circular Progress Indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-8 right-8 z-40"
            >
                <div className="relative w-12 h-12">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-emerald-200 dark:text-emerald-800"
                        />
                        <motion.circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-emerald-600"
                            style={{ pathLength: scrollYProgress }}
                        />
                    </svg>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="absolute inset-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-white"
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
                    </button>
                </div>
            </motion.div>
        </>
    );
};