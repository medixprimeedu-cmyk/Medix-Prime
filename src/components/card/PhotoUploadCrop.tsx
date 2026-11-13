import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Image as ImageIcon, Trash2, ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react';

interface PhotoUploadCropProps {
  photoUrl?: string;
  onPhotoChange: (newPhotoUrl?: string) => void;
}

export const PhotoUploadCrop: React.FC<PhotoUploadCropProps> = ({
  photoUrl,
  onPhotoChange,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Zoom & Pan state for crop
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle file selection with Bengali validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format (JPG, PNG, WebP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('শুধুমাত্র JPG, PNG বা WebP ফরম্যাটের ছবি আপলোড করুন।');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে। অন্য ছোট ছবি নির্বাচন করুন।');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read as Data URL and open cropper
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsCropModalOpen(true);
    };
    reader.onerror = () => {
      setErrorMsg('ছবি পড়তে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Crop & generate 400x400 high-resolution result
  const handleConfirmCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const cropSize = 400; // Output pixel size

    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Fill white background just in case
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cropSize, cropSize);

    // Calculate crop parameters
    const containerRect = container.getBoundingClientRect();
    const maskSize = Math.min(containerRect.width, containerRect.height) * 0.8;
    
    // Scale factor from visual mask to 400x400 output
    const scaleRatio = cropSize / maskSize;

    // Center of container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    ctx.save();
    // Translate to canvas center
    ctx.translate(cropSize / 2, cropSize / 2);
    // Apply pan scaled
    ctx.translate(pan.x * scaleRatio, pan.y * scaleRatio);
    // Apply zoom
    ctx.scale(zoom, zoom);

    // Draw image centered
    const imgNaturalW = img.naturalWidth;
    const imgNaturalH = img.naturalHeight;
    // Base fit: fit inside the visual mask
    const baseScale = maskSize / Math.min(imgNaturalW, imgNaturalH);
    const drawW = imgNaturalW * baseScale * scaleRatio;
    const drawH = imgNaturalH * baseScale * scaleRatio;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onPhotoChange(croppedDataUrl);
    setIsCropModalOpen(false);
    setRawImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = () => {
    onPhotoChange(undefined);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="user-photo-upload"
      />

      <div className="flex items-center justify-between">
        <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#2B1055]" />
          <span>নিজের ছবি যোগ করুন (ঐচ্ছিক)</span>
        </label>
        {photoUrl && (
          <span className="text-[9px] text-emerald-700 font-heading font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            ✓ ছবি যুক্ত আছে
          </span>
        )}
      </div>

      {/* Active Photo State OR Upload Button */}
      {photoUrl ? (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F4] border border-[#E2E8F0]">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#2B1055] shrink-0 bg-white shadow-2xs">
            <img src={photoUrl} alt="User profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-heading font-bold text-[#172B3A] truncate">
              কার্ডে ছবি ফ্রেম সেট হয়েছে
            </p>
            <p className="text-[9px] text-[#617381] font-body">
              কার্ডে নামের ঠিক নিচে থিম অনুযায়ী প্রদর্শিত হবে
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-md text-[10px] font-heading font-bold bg-[#2B1055] text-white hover:bg-[#3B185F] transition-colors"
            >
              পরিবর্তন
            </button>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              title="ছবি মুছুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#2B1055]/30 hover:border-[#2B1055] bg-[#FAF8F4]/50 hover:bg-[#EDE4F9]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-white border border-[#2B1055]/15 flex items-center justify-center text-[#2B1055] group-hover:scale-105 transition-transform shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-heading font-bold text-[#2B1055]">
              গ্যালারি বা ডিভাইস থেকে ছবি নির্বাচন করুন
            </div>
            <div className="text-[9px] text-[#617381] font-latin">
              JPG, PNG, WebP • সর্বোচ্চ 5MB
            </div>
          </div>
        </button>
      )}

      {/* Bengali validation error banner */}
      {errorMsg && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-heading flex items-start gap-1.5 animate-fadeIn">
          <span className="shrink-0 font-bold">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Crop / Zoom / Pan Modal */}
      {isCropModalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-gray-200 space-y-3">
            
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-heading font-bold text-sm text-[#172B3A] flex items-center gap-1.5">
                <Move className="w-4 h-4 text-[#2B1055]" />
                <span>ছবিটি অ্যাডজাস্ট করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCropModalOpen(false);
                  setRawImageSrc(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewport with circular/square framing overlay */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative w-full aspect-square bg-[#1E293B] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
            >
              <img
                ref={imageRef}
                src={rawImageSrc}
                alt="Source preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />

              {/* Circular framing guide overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[80%] h-[80%] rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                </div>
              </div>

              {/* Hint badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full pointer-events-none">
                টেনে সরান বা জুম করুন
              </div>
            </div>

            {/* Zoom Slider Controls */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#617381] font-heading">
                <span className="flex items-center gap-1"><ZoomOut className="w-3 h-3" /> জুম আউট</span>
                <span className="font-latin font-bold text-[#2B1055]">{zoom.toFixed(1)}x</span>
                <span className="flex items-center gap-1">জুম ইন <ZoomIn className="w-3 h-3" /></span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#2B1055] cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsCropModalOpen(false);
                  setRawImageSrc(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-heading font-medium text-gray-700 hover:bg-gray-100"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                className="px-4 py-1.5 rounded-lg bg-[#2B1055] text-[#CCFF00] text-xs font-heading font-bold hover:bg-[#3B185F] flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>ছবি ঠিক আছে</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
