import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Imagen del producto
      </label>

      <AnimatePresence mode="wait">
        {preview ?
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 group">

            <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
              onClick={removeImage}
              type="button"
              className="p-2 bg-white rounded-full text-rose-600 hover:bg-rose-50 transition-colors shadow-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div> :

        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className={`
              relative w-full h-48 rounded-xl border-2 border-dashed 
              flex flex-col items-center justify-center text-center p-6
              transition-colors cursor-pointer
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
            `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}>

            <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              Haz clic para subir o arrastra una imagen
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PNG, JPG o WEBP (max. 2MB)
            </p>
            <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange} />

          </motion.div>
        }
      </AnimatePresence>
    </div>);

}