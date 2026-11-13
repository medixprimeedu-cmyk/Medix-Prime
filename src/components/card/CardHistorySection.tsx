import React, { useState } from 'react';
import { History, Download, Trash2, Check, ArrowUpRight, FileText } from 'lucide-react';
import { SavedCardHistoryItem, CARD_THEMES } from '../../types/cardTypes';
import { formatBengaliDateTime } from '../../utils/cardStorage';

interface CardHistorySectionProps {
  history: SavedCardHistoryItem[];
  onLoadCard: (item: SavedCardHistoryItem) => void;
  onRedownloadCard: (item: SavedCardHistoryItem, format?: 'png' | 'pdf') => Promise<void>;
  onDeleteCard: (id: string) => void;
  onClearHistory: () => void;
}

export const CardHistorySection: React.FC<CardHistorySectionProps> = ({
  history,
  onLoadCard,
  onRedownloadCard,
  onDeleteCard,
  onClearHistory,
}) => {
  const [downloadingState, setDownloadingState] = useState<{ id: string; format: 'png' | 'pdf' } | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleLoad = (item: SavedCardHistoryItem) => {
    setLoadedId(item.id);
    onLoadCard(item);
    setTimeout(() => setLoadedId(null), 2500);
  };

  const handleDownload = async (item: SavedCardHistoryItem, format: 'png' | 'pdf') => {
    try {
      setDownloadingState({ id: item.id, format });
      await onRedownloadCard(item, format);
    } finally {
      setDownloadingState(null);
    }
  };

  return (
    <div className="mt-12 sm:mt-16 pt-8 border-t border-[#2B1055]/15">
      <div className="bg-white rounded-3xl border border-[#2B1055]/20 p-5 sm:p-7 shadow-sm">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2B1055] text-[#CCFF00] flex items-center justify-center font-bold text-lg shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#172B3A]">
                  সংরক্ষিত কার্ড হিস্ট্রি
                </h3>
                <span className="text-[11px] font-latin font-black px-2 py-0.5 rounded-full bg-[#EDE4F9] text-[#2B1055]">
                  {history.length} / 5
                </span>
              </div>
              <p className="font-body text-xs text-[#617381]">
                তোমার শেষ ৫টি তৈরি করা কার্ড সংরক্ষিত আছে — PNG বা PDF ফরম্যাটে যে কোনো সময় আবার ডাউনলোড করো।
              </p>
            </div>
          </div>

          {/* Action buttons on header */}
          {history.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              {confirmClear ? (
                <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-xl border border-red-200">
                  <span className="text-[11px] font-heading font-medium text-red-700 px-1">
                    সব মুছবেন?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-heading font-bold hover:bg-red-700 cursor-pointer"
                  >
                    হ্যাঁ, মুছুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 rounded-lg bg-white text-gray-700 border border-gray-300 text-[10px] font-heading hover:bg-gray-50 cursor-pointer"
                  >
                    না
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-heading font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>সব মুছুন</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F4] border border-[#E2E8F0] mx-auto flex items-center justify-center text-2xl shadow-2xs">
              🗂️
            </div>
            <h4 className="font-heading text-base font-bold text-[#172B3A]">
              এখনও কোনো কার্ড হিস্ট্রিতে নেই
            </h4>
            <p className="font-body text-xs text-[#617381] leading-relaxed">
              উপরের ফর্মে তোমার তথ্য সাজিয়ে <span className="font-bold text-[#2B1055]">“PNG ডাউনলোড”</span> বা <span className="font-bold text-[#172B3A]">“PDF ডাউনলোড”</span> চাপলেই কার্ডটি স্বয়ংক্রিয়ভাবে এখানে সেভ হয়ে যাবে।
            </p>
          </div>
        ) : (
          /* Cards Grid: up to 5 cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
            {history.map((item) => {
              const themeMeta =
                CARD_THEMES.find((t) => t.id === item.themeId) || CARD_THEMES[0];
              const isLoaded = loadedId === item.id;
              const isDownloadingThis = downloadingState?.id === item.id;
              const displayName = item.cardData.name.trim() || 'নামহীন শিক্ষার্থী';

              return (
                <div
                  key={item.id}
                  className="relative group rounded-2xl border border-[#2B1055]/15 bg-[#FAF8F4]/60 hover:bg-white hover:border-[#2B1055]/30 p-4 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  {/* Card Header: Theme Pill + Time */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold"
                        style={{
                          backgroundColor: `${themeMeta.accentColor}25`,
                          color: themeMeta.bgHex === '#FFFFFF' || themeMeta.bgHex === '#FAF7F0' ? '#2B1055' : '#172B3A',
                          border: `1px solid ${themeMeta.accentColor}60`,
                        }}
                      >
                        <span>{themeMeta.icon}</span>
                        <span>{themeMeta.nameBn}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-latin font-medium text-[#617381]">
                          {formatBengaliDateTime(item.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteCard(item.id)}
                          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="এই কার্ডটি হিস্ট্রি থেকে মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content Summary */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Photo or Default Avatar */}
                      <div className="w-11 h-11 rounded-xl shrink-0 overflow-hidden bg-white border border-[#2B1055]/15 shadow-2xs flex items-center justify-center">
                        {item.cardData.photoUrl ? (
                          <img
                            src={item.cardData.photoUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-playful font-black text-sm text-[#2B1055]">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Name & Badges */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-playful font-black text-base text-[#172B3A] truncate">
                          {displayName}
                        </h4>
                        <div className="inline-block mt-0.5 px-1.5 py-0.2 rounded-xs bg-[#2B1055] text-[#CCFF00] font-latin font-black text-[9px] tracking-wide uppercase truncate max-w-full">
                          {item.cardData.badgeLine1} {item.cardData.badgeLine2}
                        </div>
                      </div>
                    </div>

                    {/* Key Attributes Snippets */}
                    <div className="space-y-1 bg-white/80 rounded-xl p-2.5 border border-[#E2E8F0] text-[11px] font-heading mb-3">
                      <div className="flex items-center justify-between text-[#172B3A] gap-1">
                        <span className="text-[#617381] text-[10px] shrink-0">পড়ার ধরন:</span>
                        <span className="font-medium truncate">{item.cardData.studyHabit}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#172B3A] gap-1">
                        <span className="text-[#617381] text-[10px] shrink-0">প্যারা:</span>
                        <span className="font-medium truncate">{item.cardData.biggestHassle}</span>
                      </div>
                      <div className="text-[#2B1055] italic text-[10px] truncate pt-0.5 border-t border-gray-100 font-medium">
                        “{item.cardData.favoriteDialogue}”
                      </div>
                    </div>
                  </div>

                  {/* Actions Row: Load, PNG, and PDF */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#E2E8F0]/70">
                    {/* Load into Editor Button */}
                    <button
                      type="button"
                      onClick={() => handleLoad(item)}
                      className="py-1.5 px-1 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#2B1055]/20 text-[#2B1055] font-heading font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      title="কার্ডের তথ্য এডিটরে লোড করুন"
                    >
                      {isLoaded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="text-emerald-700">লোড!</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-[#2B1055] shrink-0" />
                          <span>লোড</span>
                        </>
                      )}
                    </button>

                    {/* Re-download PNG Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(item, 'png')}
                      disabled={isDownloadingThis}
                      className={`py-1.5 px-1 rounded-xl bg-[#2B1055] hover:bg-[#3B185F] text-[#CCFF00] font-heading font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs hover:shadow-xs transition-all ${
                        isDownloadingThis && downloadingState?.format === 'png' ? 'opacity-80 cursor-wait' : 'cursor-pointer'
                      }`}
                      title="১০৮০×১৯২০ PNG ডাউনলোড করুন"
                    >
                      {isDownloadingThis && downloadingState?.format === 'png' ? (
                        <div className="w-3 h-3 rounded-full border-2 border-[#CCFF00]/40 border-t-[#CCFF00] animate-spin" />
                      ) : (
                        <Download className="w-3 h-3 shrink-0" />
                      )}
                      <span>PNG</span>
                    </button>

                    {/* Re-download PDF Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(item, 'pdf')}
                      disabled={isDownloadingThis}
                      className={`py-1.5 px-1 rounded-xl bg-[#172B3A] hover:bg-[#203A4E] text-[#38BDF8] font-heading font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs hover:shadow-xs transition-all ${
                        isDownloadingThis && downloadingState?.format === 'pdf' ? 'opacity-80 cursor-wait' : 'cursor-pointer'
                      }`}
                      title="স্ট্যান্ডার্ড A4 পেজ PDF ডাউনলোড করুন"
                    >
                      {isDownloadingThis && downloadingState?.format === 'pdf' ? (
                        <div className="w-3 h-3 rounded-full border-2 border-[#38BDF8]/40 border-t-[#38BDF8] animate-spin" />
                      ) : (
                        <FileText className="w-3 h-3 shrink-0" />
                      )}
                      <span>PDF</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
