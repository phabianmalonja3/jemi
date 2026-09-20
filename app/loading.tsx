"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/web/LoadingSpinner";

const Loading = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Skrini nzima ya kijani (Full Screen)
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#25632D] backdrop-blur-md"
            >
             
                    {/* Tunatumia ile component yako hapa moja kwa moja */}
                    <LoadingSpinner size="lg" message="" color="border-white"/>
                    
                
               
            </motion.div>
        </AnimatePresence>
    );
};

export default Loading;