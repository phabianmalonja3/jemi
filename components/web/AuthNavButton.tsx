"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLock, FaUserShield } from "react-icons/fa"; // Unaweza kutumia icon ya Dashboard au User

function AuthNavButton() {
    const [hasToken, setHasToken] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        if (token) {
            setHasToken(true);
        }
    }, []);

    // Zuia kuonyesha tofauti ya server/client kabla hajapandishwa kwenye browser
    if (!mounted) {
        return (
            <div className="bg-[#25632D] text-white px-8 py-2.5 rounded-2xl font-bold text-[11px] tracking-widest opacity-0">
                LOADING
            </div>
        );
    }

    return (
        <Link
            href={hasToken ? "/dashboard" : "/auth/login"}
            className="bg-[#25632D] hover:bg-emerald-700 text-white px-8 py-2.5 rounded-2xl font-bold text-[11px] tracking-widest shadow-lg flex items-center gap-2 transition-all"
        >
            {hasToken ? (
                <>
                    <FaUserShield className="text-[10px]" /> DASHBOARD
                </>
            ) : (
                <>
                    <FaLock className="text-[10px]" /> LOGIN
                </>
            )}
        </Link>
    );
}

export default AuthNavButton;