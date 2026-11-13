import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../../hooks/useRouter';
import { useTheme } from '../../hooks/useTheme';
import { STUDENT_INTELLIGENCE_TOOLS, ToolDefinition } from '../../data/studentIntelligenceTools';
import { ToolIcon } from './ToolIcon';
import { toBengaliDigits } from '../../utils/bengaliUtils';
import {
  COMPLETED_TOOLS_UPDATED_EVENT,
  FAVORITES_UPDATED_EVENT,
  loadCompletedToolIds,
  loadFavoriteToolIds,
  toggleCompletedToolId,
  toggleFavoriteToolId,
} from '../../utils/studentDashboardStorage';

type FilterKey = 'all' | 'academic' | 'career' | 'university' | 'financial' | 'personal';

const FINANCIAL_TOOL_IDS = new Set([
  'admission-cost-calculator',
  'scholarship-matcher',
  'student-budget-planner',
  'scholarship-opportunity-radar',
]);

interface FilterTab {
  key: FilterKey;
  labelBn: string;
  matcher: (tool: ToolDefinition) => boolean;
}

const FILTER_TABS: FilterTab[] = [
  { key: 'all', labelBn: 'সবগুলো', matcher: () => true },
  { key: 'academic', labelBn: 'একাডেমিক', matcher: (t) => t.category === 'academic' },
  { key: 'career', labelBn: 'ক্যারিয়ার', matcher: (t) => t.category === 'career' },
  { key: 'university', labelBn: 'বিশ্ববিদ্যালয়', matcher: (t) => t.category === 'university' },
  { key: 'financial', labelBn: 'আর্থিক ও বৃত্তি', matcher: (t) => FINANCIAL_TOOL_IDS.has(t.id) },
  { key: 'personal', labelBn: 'ব্যক্তিগত উন্নয়ন', matcher: (t) => t.category === 'personal' },
];

export const StudentIntelligenceToolsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteToolIds());
  const [completedIds, setCompletedIds] = useState<string[]>(() => loadCompletedToolIds());
  const [selectedCategory, setSelectedCategory] = useState<FilterKey>('all');
  const [openTipId, setOpenTipId] = useState<string | null>(null);
  const [hoveredTipId, setHoveredTipId] = useState<string | null>(null);

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(loadFavoriteToolIds());
    const syncCompleted = () => setCompletedIds(loadCompletedToolIds());
    const syncAll = () => {
      syncFavorites();
      syncCompleted();
    };
    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
    window.addEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
      window.removeEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
      window.removeEventListener('storage', syncAll);
    };
  }, []);

  useEffect(() => {
    if (!openTipId) return;
    const handleDismiss = () => setOpenTipId(null);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenTipId(null);
    };
    document.addEventListener('click', handleDismiss);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleDismiss);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [openTipId]);

  const toggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavoriteToolId(toolId);
    setFavoriteIds(updated);
  };

  const toggleCompleted = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { completedIds: updated } = toggleCompletedToolId(toolId);
    setCompletedIds(updated);
  };

  const toggleQuickTip = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenTipId((prev) => (prev === toolId ? null : toolId));
  };

  const orderedTools = useMemo(() => {
    const activeTab = FILTER_TABS.find((tab) => tab.key === selectedCategory) || FILTER_TABS[0];
    const filtered = STUDENT_INTELLIGENCE_TOOLS.filter(activeTab.matcher);
    const favSet = new Set(favoriteIds);
    const pinned = filtered.filter((tool) => favSet.has(tool.id));
    const others = filtered.filter((tool) => !favSet.has(tool.id));
    return [...pinned, ...others];
  }, [favoriteIds, selectedCategory]);

  return (
    <section
      id="student-intelligence-tools-section"
      className={`py-10 sm:py-14 relative overflow-x-clip transition-colors duration-300 ${
        isDark ? 'bg-[#081220] text-white' : 'bg-[#FFFFFF] text-[#0F172A]'
      }`}
    >
      {/* Ambient subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00D2FF]/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/10 blur-[140px] rounded-full" />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#38BDF8]/08 blur-[120px] rounded-full" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,107,152,0.8) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header + Category Filter Bar */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight transition-colors mb-5 sm:mb-6 ${
              isDark ? 'text-white drop-shadow-sm' : 'text-[#092C43]'
            }`}
          >
            শিক্ষার্থীদের বুদ্ধিবৃত্তিক সরঞ্জাম
          </h2>

          {/* Category Filter Pills */}
          <div
            role="tablist"
            aria-label="টুল ক্যাটাগরি ফিল্টার"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {FILTER_TABS.map((tab) => {
              const isActive = selectedCategory === tab.key;
              const matchingTools = STUDENT_INTELLIGENCE_TOOLS.filter(tab.matcher);
              const count = matchingTools.length;
              const isTabFullyCompleted =
                count > 0 && matchingTools.every((t) => completedIds.includes(t.id));

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-[#00D2FF] border-[#00D2FF] text-[#060D17] shadow-[0_6px_18px_rgba(0,210,255,0.28)]'
                        : 'bg-[#006B98] border-[#006B98] text-white shadow-[0_6px_16px_rgba(0,107,152,0.22)]'
                      : isDark
                      ? 'bg-[#0B1526]/90 border-[#1B2F4D] text-slate-300 hover:text-white hover:border-[#00D2FF]/50 hover:bg-[#0F1E36]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-[#092C43] hover:border-[#006B98]/40 hover:bg-sky-50/60'
                  }`}
                >
                  {isTabFullyCompleted && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-emerald-900' : 'text-emerald-500'
                      }`}
                    />
                  )}
                  <span>{tab.labelBn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                      isActive
                        ? isDark
                          ? 'bg-[#060D17]/15 text-[#060D17]'
                          : 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {toBengaliDigits(count)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clickable Tool Cards Grid (4 col desktop, 3 col tablet, 2 col mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {orderedTools.map((tool, idx) => {
            const isFavorite = favoriteIds.includes(tool.id);
            const isCompleted = completedIds.includes(tool.id);
            const showTip = openTipId === tool.id || hoveredTipId === tool.id;

            return (
              <motion.div
                key={tool.id}
                layout
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={showTip ? 'relative z-20' : 'relative z-0'}
              >
                <Link
                  href={tool.path}
                  className={`group relative h-full rounded-2xl px-4 pt-9 pb-9 sm:px-6 sm:py-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border ${
                    isFavorite
                      ? isDark
                        ? 'bg-[#0D1C33]/95 border-rose-400/50 hover:border-rose-400 hover:bg-[#0F1E36] hover:-translate-y-1.5 shadow-[0_8px_24px_rgba(244,63,94,0.16)]'
                        : 'bg-rose-50/40 border-rose-300/90 hover:border-rose-400 hover:bg-rose-50/70 hover:-translate-y-1.5 shadow-[0_8px_20px_rgba(244,63,94,0.08)]'
                      : isDark
                      ? 'bg-[#0B1526]/85 backdrop-blur-xs border-[#172740] hover:border-[#00D2FF]/60 hover:bg-[#0F1E36] hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,107,152,0.35)]'
                      : 'bg-white border-slate-200/90 hover:border-[#006B98]/50 hover:bg-slate-50/90 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(0,107,152,0.12)]'
                  }`}
                >
                  {/* Top-Left Quick Tip Icon & Tooltip */}
                  <div
                    className="absolute top-2.5 left-2.5 z-20"
                    onMouseEnter={() => setHoveredTipId(tool.id)}
                    onMouseLeave={() => setHoveredTipId((prev) => (prev === tool.id ? null : prev))}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleQuickTip(e, tool.id)}
                      onFocus={() => setHoveredTipId(tool.id)}
                      onBlur={() => setHoveredTipId((prev) => (prev === tool.id ? null : prev))}
                      aria-label={`${tool.nameBn} ব্যবহারের টিপস`}
                      aria-expanded={showTip}
                      title="কেন ব্যবহার করবেন?"
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        showTip
                          ? isDark
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 scale-105'
                            : 'bg-amber-100 border-amber-300 text-amber-700 scale-105'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-400 opacity-75 group-hover:opacity-100 hover:text-amber-300 hover:border-amber-400/35 hover:bg-amber-500/10'
                          : 'bg-slate-100/90 border-slate-200 text-slate-500 opacity-80 group-hover:opacity-100 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {showTip && (
                      <div
                        role="tooltip"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={`absolute top-full mt-2 w-52 sm:w-64 p-3 rounded-xl border text-left text-[11px] sm:text-xs font-heading leading-relaxed shadow-xl z-30 ${
                          idx % 2 === 1 ? '-left-20 md:left-0' : 'left-0'
                        } ${
                          isDark
                            ? 'bg-[#0F1E36] border-amber-400/40 text-slate-100 shadow-[0_12px_28px_rgba(0,0,0,0.65)]'
                            : 'bg-white border-amber-300 text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.16)]'
                        }`}
                      >
                        <span
                          className={`block font-bold text-[10px] mb-1 ${
                            isDark ? 'text-amber-300' : 'text-amber-700'
                          }`}
                        >
                          কেন ব্যবহার করবেন?
                        </span>
                        <p>{tool.quickTipBn}</p>
                      </div>
                    )}
                  </div>

                  {/* Top-Right Favorite Pin Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, tool.id)}
                    aria-label={isFavorite ? `${tool.nameBn} পিন সরান` : `${tool.nameBn} উপরে পিন করুন`}
                    aria-pressed={isFavorite}
                    title={isFavorite ? 'পিন সরান' : 'উপরে পিন করুন'}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-10 border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-400 ${
                      isFavorite
                        ? isDark
                          ? 'bg-rose-500/20 border-rose-400/40 text-rose-400 hover:bg-rose-500/30 scale-105'
                          : 'bg-rose-100 border-rose-300 text-rose-600 hover:bg-rose-200 scale-105'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-400 opacity-75 group-hover:opacity-100 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/10'
                        : 'bg-slate-100/90 border-slate-200 text-slate-400 opacity-80 group-hover:opacity-100 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                        isFavorite ? 'fill-current scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                  </button>

                  {/* Attractive Icon Container with subtle glow & hover scale */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3.5 transition-all duration-300 group-hover:scale-110 shadow-xs border"
                    style={{
                      backgroundColor: `${tool.accentColor}15`,
                      borderColor: `${tool.accentColor}35`,
                      color: tool.accentColor,
                    }}
                  >
                    <ToolIcon name={tool.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* Bottom-Right Task Completion Check Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleCompleted(e, tool.id)}
                    aria-label={
                      isCompleted
                        ? `${tool.nameBn} কাজ সম্পন্ন (বাতিল করুন)`
                        : `${tool.nameBn} কাজ সম্পন্ন হিসেবে চিহ্নিত করুন`
                    }
                    aria-pressed={isCompleted}
                    title={isCompleted ? 'কাজ সম্পন্ন হয়েছে' : 'কাজ সম্পন্ন চিহ্নিত করুন'}
                    className={`absolute bottom-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-10 border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isCompleted
                        ? isDark
                          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 scale-105'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 scale-105'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-400 opacity-65 group-hover:opacity-100 hover:text-emerald-300 hover:border-emerald-400/35 hover:bg-emerald-500/10'
                        : 'bg-slate-100/90 border-slate-200 text-slate-400 opacity-75 group-hover:opacity-100 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Tool Headline in Attractive Bengali Typography */}
                  <h3
                    className={`font-heading font-bold text-sm sm:text-[15px] lg:text-base leading-snug transition-colors line-clamp-2 ${
                      isDark
                        ? 'text-white group-hover:text-[#38BDF8]'
                        : 'text-[#092C43] group-hover:text-[#006B98]'
                    }`}
                  >
                    {tool.nameBn}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

