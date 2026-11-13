import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, RefreshCw, Wand2, Share2, Check, ArrowDown, AlertCircle, BookmarkCheck, FileText } from 'lucide-react';
import { JourneyCardData, DEFAULT_CARD_DATA, PRESET_OPTIONS, CardThemeId, CARD_THEMES, SavedCardHistoryItem } from '../types/cardTypes';
import { UnifiedCardCanvas } from './card/UnifiedCardCanvas';
import { ThemeSelector } from './card/ThemeSelector';
import { PhotoUploadCrop } from './card/PhotoUploadCrop';
import { CardHistorySection } from './card/CardHistorySection';
import { exportCardAsPng, exportCardAsPdf } from '../utils/cardExporter';
import { copyToClipboard } from '../utils/bengaliUtils';
import {
  loadCardHistory,
  saveCardToHistory,
  deleteCardFromHistory,
  clearCardHistory,
} from '../utils/cardStorage';

export const CardGeneratorSection: React.FC = () => {
  const [cardData, setCardData] = useState<JourneyCardData>(DEFAULT_CARD_DATA);
  const [activeTheme, setActiveTheme] = useState<CardThemeId>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'png' | 'pdf' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<SavedCardHistoryItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadCardHistory());
  }, []);

  // Responsive scale calculation for the 1080x1920 canvas
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.35);

  // Reference for unscaled 1080x1920 DOM node dedicated to export
  const exportCardRef = useRef<HTMLDivElement>(null);
  const liveCardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Calculate proportional scale so 1080x1920 fits nicely into the responsive preview column
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth;
        if (w > 0) {
          setScale(w / 1080);
        }
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (previewContainerRef.current) {
      resizeObserver.observe(previewContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  // Field update handlers
  const handleFieldChange = (field: keyof JourneyCardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitlePreset = (line1: string, line2: string) => {
    setCardData((prev) => ({
      ...prev,
      badgeLine1: line1,
      badgeLine2: line2,
    }));
  };

  const handlePhotoChange = (newPhotoUrl?: string) => {
    setCardData((prev) => ({
      ...prev,
      photoUrl: newPhotoUrl,
    }));
  };

  // Reset to default sample values
  const handleReset = () => {
    setCardData(DEFAULT_CARD_DATA);
    setActiveTheme('original');
    setDownloadError(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Explicit Save to History action
  const handleManualSave = () => {
    const updated = saveCardToHistory(cardData, activeTheme);
    setHistory(updated);
    setNotification('কার্ডটি হিস্ট্রিতে সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Load a previously saved card back into the editor & preview
  const handleLoadFromHistory = (item: SavedCardHistoryItem) => {
    setCardData({ ...item.cardData });
    setActiveTheme(item.themeId);
    setNotification(`"${item.cardData.name || 'কার্ড'}" এর তথ্য সফলভাবে লোড হয়েছে!`);
    setTimeout(() => setNotification(null), 3000);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Re-download a card from history without having to manually re-enter data
  const handleRedownloadFromHistory = async (item: SavedCardHistoryItem, format: 'png' | 'pdf' = 'png') => {
    try {
      if (format === 'pdf') {
        await exportCardAsPdf({
          element: null,
          cardData: item.cardData,
          themeId: item.themeId,
        });
      } else {
        await exportCardAsPng({
          element: null,
          cardData: item.cardData,
          themeId: item.themeId,
        });
      }
    } catch (err) {
      console.error(`History card re-download ${format} failed:`, err);
      setDownloadError('সংরক্ষিত কার্ডটি ডাউনলোডে সাময়িক সমস্যা হয়েছে।');
    }
  };

  // Delete card from history
  const handleDeleteFromHistory = (id: string) => {
    const updated = deleteCardFromHistory(id);
    setHistory(updated);
  };

  // Clear all card history
  const handleClearHistory = () => {
    clearCardHistory();
    setHistory([]);
  };

  // High-Quality Export Handler for both PNG (1080x1920) and PDF (Standard Page) with auto-save to history
  const handleDownload = async (format: 'png' | 'pdf' = 'png') => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadingFormat(format);
      setDownloadError(null);

      const targetElement =
        (exportCardRef.current?.querySelector('#canonical-journey-card-canvas') as HTMLElement) ||
        liveCardRef.current ||
        exportCardRef.current;

      if (format === 'pdf') {
        await exportCardAsPdf({
          element: targetElement,
          cardData,
          themeId: activeTheme,
        });
      } else {
        await exportCardAsPng({
          element: targetElement,
          cardData,
          themeId: activeTheme,
        });
      }

      // Automatically save to localStorage history on successful generation/download
      const updatedHistory = saveCardToHistory(cardData, activeTheme);
      setHistory(updatedHistory);
      setNotification(
        format === 'pdf'
          ? 'স্ট্যান্ডার্ড পেজ PDF সফলভাবে ডাউনলোড হয়েছে এবং হিস্ট্রিতে সংরক্ষিত হয়েছে!'
          : '১০৮০×১৯২০ HD PNG সফলভাবে ডাউনলোড হয়েছে এবং হিস্ট্রিতে সংরক্ষিত হয়েছে!'
      );
      setTimeout(() => setNotification(null), 3500);
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
      setDownloadError('কার্ডের ফাইল তৈরিতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsDownloading(false);
      setDownloadingFormat(null);
    }
  };

  // Quick share / copy link
  const handleShare = async () => {
    const ok = await copyToClipboard(window.location.href);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentThemeMeta = CARD_THEMES.find((t) => t.id === activeTheme) || CARD_THEMES[0];

  return (
    <section id="card-generator-section" className="pt-6 sm:pt-10 pb-14 sm:pb-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B1055] text-[#CCFF00] text-xs font-latin font-black tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MEDIX PRIME SPECIAL</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playful font-black text-[#2B1055] tracking-tight leading-tight">
            HSC ’26 — আমার গল্প
          </h1>

          {/* Subtitle */}
          <p className="font-heading text-base sm:text-lg text-[#617381] font-medium">
            তোমার দুই বছরের গল্প এক কার্ডে।
          </p>

          {/* Quick Jump CTA Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2B1055] to-[#3B185F] text-[#CCFF00] font-heading font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wand2 className="w-4 h-4" />
              <span>আমার কার্ড বানাই</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace: Editor Form on Left, Live 9:16 Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: PERSONALIZATION FORM */}
          <div ref={formRef} className="lg:col-span-7 space-y-3">
            <div className="bg-white rounded-2xl border border-[#2B1055]/20 p-3.5 sm:p-4 shadow-xs transition-all">
              
              {/* Form Card Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2B1055] text-[#CCFF00] flex items-center justify-center font-bold text-xs shadow-xs">
                    ✍️
                  </div>
                  <div>
                    <h2 className="font-heading text-sm sm:text-base font-bold text-[#172B3A] leading-tight">
                      কার্ডের তথ্য সাজাও
                    </h2>
                    <p className="font-body text-[10px] text-[#617381]">
                      তথ্য পরিবর্তন করলে ডানের কার্ডে সরাসরি আপডেট হবে
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[10px] font-heading font-medium text-[#617381] hover:text-[#172B3A] transition-colors cursor-pointer"
                  title="নমুনা তথ্যে রিসেট করো"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>রিসেট</span>
                </button>
              </div>

              {/* Theme Picker Component */}
              <div className="mb-3 pb-3 border-b border-[#E2E8F0]">
                <ThemeSelector
                  activeTheme={activeTheme}
                  onThemeSelect={(tId) => setActiveTheme(tId)}
                />
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3">
                
                {/* 1. Name */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-name" className="text-[11px] font-heading font-bold text-[#172B3A]">
                      ১. তোমার নাম (Name)
                    </label>
                    <span className="text-[9px] text-[#617381] font-latin">বাংলা বা ইংরেজি</span>
                  </div>
                  <input
                    id="card-name"
                    type="text"
                    maxLength={28}
                    value={cardData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="যেমন: KOWSHIQ বা কাউশিক"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FAF8F4]/50 font-latin font-bold text-[#2B1055] text-xs focus:bg-white focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Optional Photo Upload & Crop (Placed immediately below name) */}
                <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E2E8F0]/80">
                  <PhotoUploadCrop
                    photoUrl={cardData.photoUrl}
                    onPhotoChange={handlePhotoChange}
                  />
                </div>

                {/* 2. Title / Epithet Badge (Line 1 & Line 2) */}
                <div className="space-y-1 p-2 rounded-xl bg-[#EDE4F9]/40 border border-[#D7C4F7]/70">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-heading font-bold text-[#2B1055] flex items-center gap-1">
                      <span>২. উপাধি ব্যাজ (Title Badge)</span>
                      <span className="text-[8px] bg-[#CCFF00] text-[#2B1055] font-black px-1 py-0.2 rounded-xs">
                        CUSTOMIZABLE
                      </span>
                    </label>
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_OPTIONS.titles.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleTitlePreset(preset.line1, preset.line2)}
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-latin font-bold transition-all cursor-pointer ${
                          cardData.badgeLine1 === preset.line1 && cardData.badgeLine2 === preset.line2
                            ? 'bg-[#2B1055] text-[#CCFF00] shadow-2xs'
                            : 'bg-white text-[#2B1055] border border-[#D7C4F7] hover:bg-[#EDE4F9]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="block text-[9px] font-heading text-[#617381] mb-0.5">Line 1:</span>
                      <input
                        type="text"
                        maxLength={20}
                        value={cardData.badgeLine1}
                        onChange={(e) => handleFieldChange('badgeLine1', e.target.value)}
                        placeholder="যেমন: LAST NIGHT"
                        className="w-full px-2 py-1 rounded-md border border-[#D7C4F7] bg-white font-latin font-bold text-[11px] text-[#2B1055] uppercase focus:outline-hidden focus:ring-1 focus:ring-[#2B1055]"
                      />
                    </div>
                    <div>
                      <span className="block text-[9px] font-heading text-[#617381] mb-0.5">Line 2:</span>
                      <input
                        type="text"
                        maxLength={20}
                        value={cardData.badgeLine2}
                        onChange={(e) => handleFieldChange('badgeLine2', e.target.value)}
                        placeholder="যেমন: WARRIOR"
                        className="w-full px-2 py-1 rounded-md border border-[#D7C4F7] bg-white font-latin font-bold text-[11px] text-[#2B1055] uppercase focus:outline-hidden focus:ring-1 focus:ring-[#2B1055]"
                      />
                    </div>
                  </div>
                </div>

                {/* Subgrid Row 1: Study Habit & Biggest Hassle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 3. পড়ার ধরন (Study Habit) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1">
                      <span>🌙 ৩. পড়ার ধরন</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_OPTIONS.studyHabits.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFieldChange('studyHabit', preset)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-heading transition-all cursor-pointer ${
                            cardData.studyHabit === preset
                              ? 'bg-[#2B1055] text-white font-semibold'
                              : 'bg-[#FAF8F4] text-[#172B3A] border border-[#E2E8F0] hover:bg-[#EDE4F9]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      maxLength={35}
                      value={cardData.studyHabit}
                      onChange={(e) => handleFieldChange('studyHabit', e.target.value)}
                      placeholder="নিজের মতো লেখো..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white font-heading text-xs text-[#172B3A] focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055]"
                    />
                  </div>

                  {/* 4. সবচেয়ে প্যারা (Biggest Hassle) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1">
                      <span>🧪 ৪. সবচেয়ে প্যারা</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_OPTIONS.biggestHassles.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFieldChange('biggestHassle', preset)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-heading transition-all cursor-pointer ${
                            cardData.biggestHassle === preset
                              ? 'bg-[#2B1055] text-white font-semibold'
                              : 'bg-[#FAF8F4] text-[#172B3A] border border-[#E2E8F0] hover:bg-[#EDE4F9]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      maxLength={35}
                      value={cardData.biggestHassle}
                      onChange={(e) => handleFieldChange('biggestHassle', e.target.value)}
                      placeholder="যেমন: Chemistry বা Physics"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white font-heading text-xs text-[#172B3A] focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055]"
                    />
                  </div>
                </div>

                {/* Subgrid Row 2: Biggest Support & Favorite Dialogue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 5. বড় সাপোর্ট (Biggest Support) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1">
                      <span>📓 ৫. বড় সাপোর্ট</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_OPTIONS.biggestSupports.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFieldChange('biggestSupport', preset)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-heading transition-all cursor-pointer ${
                            cardData.biggestSupport === preset
                              ? 'bg-[#2B1055] text-white font-semibold'
                              : 'bg-[#FAF8F4] text-[#172B3A] border border-[#E2E8F0] hover:bg-[#EDE4F9]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      maxLength={35}
                      value={cardData.biggestSupport}
                      onChange={(e) => handleFieldChange('biggestSupport', e.target.value)}
                      placeholder="যেমন: বন্ধুর নোট বা আম্মুর দোয়া"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white font-heading text-xs text-[#172B3A] focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055]"
                    />
                  </div>

                  {/* 6. প্রিয় ডায়ালগ (Favorite Dialogue) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1">
                      <span>💬 ৬. প্রিয় ডায়ালগ</span>
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_OPTIONS.favoriteDialogues.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFieldChange('favoriteDialogue', preset)}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-heading transition-all cursor-pointer ${
                            cardData.favoriteDialogue === preset
                              ? 'bg-[#2B1055] text-white font-semibold'
                              : 'bg-[#FAF8F4] text-[#172B3A] border border-[#E2E8F0] hover:bg-[#EDE4F9]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      maxLength={40}
                      value={cardData.favoriteDialogue}
                      onChange={(e) => handleFieldChange('favoriteDialogue', e.target.value)}
                      placeholder="যেমন: এইটা কি সিলেবাসে ছিল?"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white font-heading text-xs text-[#172B3A] focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055]"
                    />
                  </div>
                </div>

                {/* 7. অর্জন (Achievement) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1">
                    <span>🏆 ৭. অর্জন</span>
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_OPTIONS.achievements.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleFieldChange('achievement', preset)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-heading transition-all cursor-pointer ${
                          cardData.achievement === preset
                            ? 'bg-[#2B1055] text-white font-semibold'
                            : 'bg-[#FAF8F4] text-[#172B3A] border border-[#E2E8F0] hover:bg-[#EDE4F9]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    maxLength={40}
                    value={cardData.achievement}
                    onChange={(e) => handleFieldChange('achievement', e.target.value)}
                    placeholder="যেমন: শেষ পর্যন্ত লড়ে গেছি!"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white font-heading text-xs text-[#172B3A] focus:outline-hidden focus:ring-1.5 focus:ring-[#2B1055]/30 focus:border-[#2B1055]"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT: PROPORTIONAL 9:16 LIVE PREVIEW & DOWNLOAD CONTROLS */}
          <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
            
            {/* Top Indicator */}
            <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2">
              <span className="text-xs font-heading font-bold text-[#2B1055] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
                <span>লাইভ প্রিভিউ ({currentThemeMeta.nameBn})</span>
              </span>
              <span className="text-[11px] font-latin font-bold text-[#617381] bg-gray-100 px-2 py-0.5 rounded-full">
                1080 × 1920 HD
              </span>
            </div>

            {/* RESPONSIVE PROPORTIONALLY SCALED PREVIEW CONTAINER */}
            <div
              ref={previewContainerRef}
              className="w-full max-w-[420px] aspect-[9/16] relative rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#2B1055]/20 bg-gray-900"
              style={{
                boxShadow: '0 25px 50px -12px rgba(43, 16, 85, 0.35)',
              }}
            >
              {/* Scale the canonical 1080x1920 canvas smoothly to fit container */}
              <div
                style={{
                  width: '1080px',
                  height: '1920px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                <UnifiedCardCanvas
                  canvasRef={liveCardRef}
                  data={cardData}
                  themeId={activeTheme}
                />
              </div>
            </div>

            {/* EXTERNAL WORKING ACTION BUTTONS */}
            <div className="w-full max-w-[420px] mt-5 space-y-2.5">
              
              {/* Dual Download Options: High-Resolution PNG & High-Resolution Standard Page PDF */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* PNG Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  disabled={isDownloading}
                  className={`py-3 px-3 rounded-2xl bg-[#2B1055] hover:bg-[#3B185F] text-[#CCFF00] font-heading font-extrabold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-[#CCFF00] ${
                    isDownloading ? 'opacity-80 cursor-wait' : 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                  title="১০৮০×১৯২০ রেজুলেশনে PNG ছবি ডাউনলোড করুন"
                >
                  {isDownloading && downloadingFormat === 'png' ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-[#CCFF00]/40 border-t-[#CCFF00] animate-spin" />
                      <span className="text-xs">তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#CCFF00] shrink-0" />
                      <div className="text-left">
                        <div className="leading-tight text-xs sm:text-sm">PNG ডাউনলোড</div>
                        <div className="text-[9px] font-latin font-bold text-[#CCFF00]/85">1080×1920 HD</div>
                      </div>
                    </>
                  )}
                </button>

                {/* PDF Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownload('pdf')}
                  disabled={isDownloading}
                  className={`py-3 px-3 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-[#38BDF8] font-heading font-extrabold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-[#38BDF8] ${
                    isDownloading ? 'opacity-80 cursor-wait' : 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                  title="স্ট্যান্ডার্ড A4 পেজে ১০৮০×১৯২০ অনুপাতে হাই-রেজুলেশন PDF ডাউনলোড করুন"
                >
                  {isDownloading && downloadingFormat === 'pdf' ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-[#38BDF8]/40 border-t-[#38BDF8] animate-spin" />
                      <span className="text-xs">তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <div className="text-left">
                        <div className="leading-tight text-xs sm:text-sm">PDF ডাউনলোড</div>
                        <div className="text-[9px] font-latin font-bold text-[#38BDF8]/85">স্ট্যান্ডার্ড পেজ</div>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Error Alert */}
              {downloadError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-heading flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{downloadError}</span>
                </div>
              )}

              {/* Notification Banner */}
              {notification && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-heading font-medium flex items-center gap-2 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{notification}</span>
                </div>
              )}

              {/* Secondary Buttons: Edit Again, Save to History & Share */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#2B1055] font-heading font-bold text-xs border border-[#2B1055]/20 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="ফর্মে তথ্য এডিট করতে যান"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#2B1055]" />
                  <span>তথ্য এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={handleManualSave}
                  className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#2B1055] font-heading font-bold text-xs border border-[#2B1055]/20 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="বর্তমান কার্ডটি হিস্ট্রিতে সংরক্ষণ করুন"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>কার্ড সেভ</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#2B1055] font-heading font-bold text-xs border border-[#2B1055]/20 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="সাইটের লিংক কপি করুন"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">কপি!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#2B1055]" />
                      <span>শেয়ার</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Note */}
              <p className="text-center text-[11px] text-[#617381] font-body pt-1">
                ডাউনলোড করা ছবিটি ফেসবুক, ইনস্টাগ্রাম স্টোরি ও হোয়াটসঅ্যাপ স্ট্যাটাসে শেয়ার করার জন্য পারফেক্ট সাইজ (৯:১৬, ১০৮০×১৯২০)।
              </p>

            </div>

          </div>

        </div>

        {/* SAVED CARDS HISTORY (LOCALSTORAGE - LAST 5 CARDS) */}
        <CardHistorySection
          history={history}
          onLoadCard={handleLoadFromHistory}
          onRedownloadCard={handleRedownloadFromHistory}
          onDeleteCard={handleDeleteFromHistory}
          onClearHistory={handleClearHistory}
        />

      </div>

      {/* UN-SCALED 1080x1920 CANVAS HOST PROPERLY MOUNTED FOR EXPORT */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1080px',
          height: '1920px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
          opacity: 0,
        }}
      >
        <div ref={exportCardRef} style={{ width: '1080px', height: '1920px' }}>
          <UnifiedCardCanvas
            data={cardData}
            themeId={activeTheme}
          />
        </div>
      </div>

    </section>
  );
};
