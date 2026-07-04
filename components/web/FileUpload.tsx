"use client";
import { useState } from 'react';
import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFile } from '@/actions/upload';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await uploadFile(formData);
      setStatus('success');
      setTimeout(() => { setStatus('idle'); setFile(null); }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border-2 border-dashed border-emerald-200 rounded-2xl hover:border-emerald-400 transition-colors">
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="flex flex-col items-center gap-4">
        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-2">
              <Upload size={32} />
            </div>
            <p className="text-sm font-semibold text-gray-700">Bonyeza kupakia picha</p>
            <p className="text-xs text-gray-400">PNG, JPG hadi 10MB</p>
          </label>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded text-white"><Upload size={16}/></div>
                <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
            >
              {status === 'uploading' ? <Loader2 className="animate-spin" /> : 'Anza Kupakia'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
            >
              <CheckCircle2 size={16} /> Imekamilika!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}