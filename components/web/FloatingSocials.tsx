"use client";

import { FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const socials = [
  { 
    icon: FaInstagram, 
    href: "https://instagram.com/your-handle", 
    label: "Instagram", 
    color: "hover:text-pink-500" 
  },
  { 
    icon: FaTwitter, 
    href: "https://twitter.com/your-handle", 
    label: "Twitter", 
    color: "hover:text-blue-400" 
  },
  { 
    icon: FaLinkedin, 
    href: "https://linkedin.com/in/your-handle", 
    label: "LinkedIn", 
    color: "hover:text-blue-700" 
  },
  { 
    icon: FaWhatsapp, 
    href: "https://wa.me/your-phone-number", 
    label: "WhatsApp", 
    color: "hover:text-green-500" 
  },
];

export function FloatingSocials() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 md:bottom-0 z-50 flex flex-col items-center gap-6">
      {/* Container for Icons */}
      <div className="flex flex-row md:flex-col gap-5 bg-white/80 backdrop-blur-md md:bg-transparent p-3 md:p-0 rounded-full shadow-lg md:shadow-none border md:border-none border-slate-200">
        {socials.map((social) => (
          <Link
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-300 transform hover:-translate-y-1 ${social.color} text-slate-600`}
            aria-label={social.label}
          >
            <social.icon size={22} />
          </Link>
        ))}
      </div>

      {/* Vertical Line - Only visible on desktop (md and up) */}
      <div className="hidden md:block w-[1px] h-24 bg-slate-300"></div>
    </div>
  );
}