"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaHome, FaSync, FaExclamationTriangle, FaBug } from "react-icons/fa";

export default function ServerError() {
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900 flex items-center justify-center px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
                {/* Animated 500 Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-8xl sm:text-9xl font-extrabold text-red-900 dark:text-red-500 opacity-20">
                        500
                    </h1>
                    <div className="-mt-16 sm:-mt-20 relative z-10">
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                            >
                                <FaExclamationTriangle className="text-4xl sm:text-5xl text-red-600 dark:text-red-400" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">
                            Server Error
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-4">
                            Something went wrong on our end. We&#39;re working to fix the issue. 
                            Please try again in a few moments.
                        </p>
                    </div>
                </motion.div>

                {/* Error Code Reference */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 sm:mb-8"
                >
                    <code className="px-3 py-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-md text-xs sm:text-sm">
                        Error: Internal Server Error
                    </code>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full bg-red-900 hover:bg-red-800 text-white gap-2 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
                            <FaHome /> Back to Home
                        </Button>
                    </Link>

                    <Button 
                        variant="outline" 
                        className="w-full sm:w-auto gap-2 h-11 sm:h-12 px-6 sm:px-8 border-zinc-300 dark:border-zinc-700 text-sm sm:text-base"
                        onClick={() => window.location.reload()}
                    >
                        <FaSync /> Try Again
                    </Button>
                </motion.div>

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 sm:mt-12 text-center"
                >
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                        Need help?{" "}
                        <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">
                            Contact our support team
                        </Link>
                    </p>
                </motion.div>

                {/* Decorative Element */}
                <motion.div
                    className="mt-12 sm:mt-16 opacity-10 flex justify-center"
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-red-900 rounded-full" />
                </motion.div>
            </div>
        </div>
    );
}