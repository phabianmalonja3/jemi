"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, User, Wallet, Settings, LogOut,
  LayoutDashboard, Shield, Users, FileText,
  ChevronLeft, ChevronRight, Briefcase, BarChart3,
  Package, Calendar, Activity, Menu, X as CloseIcon,
  ArrowLeftRight,
  Bell,
  Globe,
  Settings2,
  Cog,
  Smartphone
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// --- Navigation Config ---

const ADMIN_LINKS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
  { icon: Package, label: "Package Manager", href: "/dashboard/admin/packages" },
  { icon: Wallet, label: "Wallet Management", href: "/dashboard/admin/wallet" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/dashboard/admin/transactions" },
  { icon: Bell, label: "Notifications", href: "/dashboard/admin/notifications" },
  { icon: Cog, label: "Settings", href: "/dashboard/admin/profile" },
  { icon: Smartphone, label: "App Updates", href: "/dashboard/admin/applications/versions" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/admin/bookings" }
 

  // <Bell size={20} />
];

const SidebarItem = ({ icon: Icon, label, href, active, isCollapsed, onClick }: any) => (
  <Link href={href || "#"} onClick={onClick} className="relative group">
    <div className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1",
      active
        ? "bg-emerald-600 text-white shadow-md"
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
    )}>
      <div className={cn("flex shrink-0 items-center justify-center", isCollapsed ? "w-full" : "")}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={cn("font-semibold text-sm whitespace-nowrap transition-opacity", isCollapsed ? "lg:hidden" : "opacity-100")}>
        {label}
      </span>
      {isCollapsed && (
        <div className="absolute left-14 scale-0 group-hover:scale-100 transition-all duration-200 origin-left z-[100] bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg pointer-events-none shadow-lg whitespace-nowrap hidden lg:block">
          {label}
        </div>
      )}
    </div>
  </Link>
);

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile state
  const pathname = usePathname();
  const { user, logout  } = useAuth();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setTimeout(() => { window.location.href = "/auth/login"; }, 1000);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const userInitial = user.name?.charAt(0).toUpperCase() || "U";
  const userName = user.name?.split(' ')[0] || user.name || "User";

  return (
    <>

    
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-[50]">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                {userInitial}
            </div>
            <span className="font-bold text-slate-800 text-sm">Jemigraph</span>
        </div>
        <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="px-2">
    <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
      <div className="relative">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
      </div>
      {(!isCollapsed || isMobileOpen) && <span className="font-semibold text-sm">Notifications</span>}
    </button>
  </div>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>
      

      {/* --- SIDEBAR (Desktop & Mobile) --- */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 260,
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isMobileOpen ? 0 : -260) : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-[100] shadow-xl lg:shadow-md transition-transform lg:translate-x-0",
          isMobileOpen ? "w-[260px]" : ""
        )}
      >

        
        <div className="flex flex-col h-full p-4">

          
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end mb-2">
            <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400">
                <CloseIcon size={20} />
            </button>
          </div>
    <Link  href={"/"} >

          <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-emerald-700">
  <Globe size={20} />
</div>
    </Link>

          

          {/* User Profile Info */}
          <div className={cn("mb-6", (isCollapsed && !isMobileOpen) ? "flex flex-col items-center" : "px-2")}>
            <div className="relative inline-block group">
            
             
              
            </div>
            
           {(!isCollapsed || isMobileOpen) && (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="mt-3 flex items-center gap-3" // Tunatumia flex ili picha iwe kushoto
  >


    
    {/* Hapa ndipo Avatar ilipo */}
    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-bold text-sm uppercase">
      {userInitial}
    </div>

    {/* Maelezo ya mtumiaji */}
    <div className="overflow-hidden">
      <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
        {userName}
      </h2>
      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
        {user.email}
      </p>
    </div>
  </motion.div>
)}
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
              <div>
                {(!isCollapsed || isMobileOpen) && <p className="text-[10px] font-bold text-rose-500 uppercase mb-3 ml-2">Admin Control</p>}
                {ADMIN_LINKS.map(link => (
                  <SidebarItem key={link.href} {...link} active={pathname === link.href} isCollapsed={isCollapsed && !isMobileOpen} />
                ))}
              </div>
           
          </nav>

          <div className="pt-4 mt-auto border-t border-slate-100 space-y-1">
            {/* <SidebarItem icon={Settings} label="Settings" href="/dashboard/profile" active={pathname === "/dashboard/profile"} isCollapsed={isCollapsed && !isMobileOpen} /> */}
            <button onClick={handleLogout} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50", (isCollapsed && !isMobileOpen) && "justify-center")}>
              <LogOut size={20} />
              {(!isCollapsed || isMobileOpen) && <span className="font-semibold text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-6 z-[110] bg-white border border-slate-200 rounded-lg p-1.5 shadow-md lg:flex hidden items-center justify-center cursor-pointer transition-all duration-300",
          isCollapsed ? "left-[72px]" : "left-[252px]"
        )}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300",
        "lg:ml-[260px]", // Default desktop margin
        isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]",
        "ml-0 pt-16 lg:pt-0" // Add top padding on mobile for the Top Bar
      )} />
    </>
  );
}