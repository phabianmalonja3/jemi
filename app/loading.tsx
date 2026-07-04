"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Loading = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white"
                >
                    <div className="flex flex-col items-center">
                        
                        {/* --- LOGO WITH BREATHING EFFECT --- */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: 1, 
                                scale: [1, 1.05, 1], 
                            }}
                            transition={{ 
                                opacity: { duration: 1 },
                                scale: { 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }
                            }}
                            className="relative w-36 h-36 md:w-48 md:h-48 mb-8"
                        >
                            {/* Subdued Glow Background */}
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1] 
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute inset-0 bg-white  rounded-full"
                            />

                            <Image
                                src="/logo.png"
                                alt="Jemgraph Logo"
                                fill
                                className="object-contain relative z-10"
                                priority
                            />
                        </motion.div>

                    
                    </div>

                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-10"
                    >
                        
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loading;