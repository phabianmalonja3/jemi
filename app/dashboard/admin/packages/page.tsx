"use client";

import { useState, useEffect } from "react";
import { 
  Package, Plus, Search, Trash2, Edit2, 
  RefreshCw, Clock, DollarSign, List,
  Filter, AlertCircle, Loader2, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { FaMoneyBillAlt } from "react-icons/fa";

// --- Types ---
type PackageData = {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";

const apiClient = axios.create({ baseURL: API_BASE_URL });

// Auth Interceptor (Shared with your user management logic)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/packages");
      setPackages(response.data);
    } catch (error: any) {
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await apiClient.delete(`/packages/${id}`);
      setPackages(packages.filter(p => p.id !== id));
      toast.success("Package deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Package className="text-emerald-600" size={24} />
            </div>
            Service Packages
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure pricing and service features</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => { setIsEditMode(false); setSelectedPackage(null); setIsModalOpen(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
            <Plus size={18} /> Add Package
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20}/></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total</p>
            <p className="text-lg font-bold">{packages.length}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" size={32} /></div>
        ) : filteredPackages.map((pkg) => (
          <motion.div 
            layout
            key={pkg.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setSelectedPackage(pkg); setIsEditMode(true); setIsModalOpen(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <FaMoneyBillAlt size={16} /> Tsh {pkg.price}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock size={16} /> {pkg.duration}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-50">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <PackageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        packageData={selectedPackage}
        isEditMode={isEditMode}
        onRefresh={fetchPackages}
      />
    </div>
  );
}

// --- Sub-component: Package Modal ---
function PackageModal({ isOpen, onClose, packageData, isEditMode, onRefresh }: any) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: "",
    features: [""]
  });

  useEffect(() => {
    if (packageData) setFormData(packageData);
    else setFormData({ name: "", price: 0, duration: "", features: [""] });
  }, [packageData, isOpen]);

  const addFeature = () => setFormData({...formData, features: [...formData.features, ""]});
  const updateFeature = (index: number, val: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = val;
    setFormData({...formData, features: newFeatures});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) await apiClient.put(`/packages/${packageData.id}`, formData);
      else await apiClient.post("/packages", formData);
      toast.success("Saved successfully");
      onRefresh();
      onClose();
    } catch (error) { toast.error("Save failed"); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h2 className="text-xl font-bold">{isEditMode ? "Edit Package" : "New Package"}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Package Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Price (Tsh)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border p-2.5 rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                  <input required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-50 border p-2.5 rounded-lg" placeholder="e.g. 4 Hours" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase">Features</label>
                  <button type="button" onClick={addFeature} className="text-emerald-600 text-xs font-bold hover:underline">+ Add</button>
                </div>
                {formData.features.map((f, i) => (
                  <input key={i} value={f} onChange={e => updateFeature(i, e.target.value)} className="w-full bg-slate-50 border p-2 rounded-lg text-sm mb-2" placeholder="Feature description..." />
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 border rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-[2] py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20">Save Package</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}