import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Share2, Check, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useRouter } from '../../hooks/useRouter';
import { useTheme } from '../../hooks/useTheme';
import { ToolIcon } from './ToolIcon';
import { toBengaliDigits } from '../../utils/bengaliUtils';
import {
  COMPLETED_TOOLS_UPDATED_EVENT,
  getCategoryCompletionSummary,
  loadCompletedToolIds,
  resolveToolByNumber,
  resolveToolByPath,
  toggleCompletedToolId,
} from '../../utils/studentDashboardStorage';

interface ToolPageLayoutProps {
  toolNumber: string;
  toolName: string;
  categoryLabel: string;
  iconName: string;
  accentColor: string;
  description: string;
  children: React.ReactNode;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  toolNumber,
  toolName,
  categoryLabel,
  iconName,
  accentColor,
  description,
  children,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { currentPath } = useRouter();
  const [copied, setCopied] = useState(false);
  const [completedToolIds, setCompletedToolIds] = useState<string[]>(() => loadCompletedToolIds());

  useEffect(() => {
    const syncCompleted = () => setCompletedToolIds(loadCompletedToolIds());
    window.addEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
    window.addEventListener('storage', syncCompleted);
    return () => {
      window.removeEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
      window.removeEventListener('storage', syncCompleted);
    };
  }, []);

  const currentTool = useMemo(
    () => resolveToolByPath(currentPath) || resolveToolByNumber(toolNumber),
    [currentPath, toolNumber]
  );

  const categoryProgress = useMemo(() => {
    if (!currentTool) return null;
    const allCategories = getCategoryCompletionSummary(completedToolIds);
    return allCategories.find((item) => item.key === currentTool.category) ?? null;
  }, [currentTool, completedToolIds]);

  const isToolCompleted = currentTool ? completedToolIds.includes(currentTool.id) : false;

  const handleToggleCompleted = () => {
    if (!currentTool) return;
    const { completedIds } = toggleCompletedToolId(currentTool.id);
    setCompletedToolIds(completedIds);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] py-8 sm:py-12 transition-colors duration-300 ${
        isDark ? 'bg-[#060D17] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-heading font-semibold transition-all duration-200 cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সব টুলসে ফিরে যান</span>
          </Link>

          <div className="flex items-center gap-2">
            {currentTool && (
              <button
                type="button"
                onClick={handleToggleCompleted}
                aria-pressed={isToolCompleted}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer ${
                  isToolCompleted
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                    : isDark
                    ? 'bg-[#00D2FF]/15 border-[#00D2FF]/40 text-[#38BDF8] hover:bg-[#00D2FF]/25'
                    : 'bg-sky-50 border-sky-200 text-[#006B98] hover:bg-sky-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isToolCompleted ? 'কাজ সম্পন্ন ✓' : 'কাজ সম্পন্ন করুন'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-heading font-medium transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">লিংক কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>শেয়ার</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tool Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className={`p-5 sm:p-7 rounded-3xl border mb-8 transition-colors ${
            isDark
              ? 'bg-[#0B1526]/90 border-[#172740] shadow-[0_4px_25px_rgba(0,107,152,0.15)]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <ToolIcon name={iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="font-heading font-bold text-[11px] px-2.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  টুল {toolNumber}
                </span>
                <span
                  className={`font-heading text-xs font-medium ${
                    isDark ? 'text-gray-400' : 'text-slate-500'
                  }`}
                >
                  • {categoryLabel}
                </span>
                {categoryProgress && (
                  <span
                    className={`font-heading text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      categoryProgress.isCompleted
                        ? isDark
                          ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {categoryProgress.shortLabelBn}: {toBengaliDigits(categoryProgress.completedCount)}/
                    {toBengaliDigits(categoryProgress.totalCount)} সম্পন্ন
                  </span>
                )}
              </div>

              <h1
                className={`text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-[#092C43]'
                }`}
              >
                {toolName}
              </h1>
              <p
                className={`mt-1.5 font-body text-xs sm:text-sm max-w-2xl leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-slate-600'
                }`}
              >
                {description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tool Workspace Component */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {children}
        </motion.div>

        {/* Bottom Category Task Completion Card */}
        {currentTool && categoryProgress && (
          <div
            className={`mt-8 p-4 sm:p-5 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#0B1526]/90 border-[#1B2F4D]'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    categoryProgress.isCompleted
                      ? isDark
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isDark
                      ? 'bg-[#00D2FF]/15 border-[#00D2FF]/35 text-[#38BDF8]'
                      : 'bg-sky-50 border-sky-200 text-[#006B98]'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className={`font-heading font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                    {categoryProgress.labelBn} ক্যাটাগরি টাস্ক ({toBengaliDigits(categoryProgress.completedCount)}/
                    {toBengaliDigits(categoryProgress.totalCount)} সম্পন্ন)
                  </h2>
                  <p className={`font-body text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {categoryProgress.isCompleted
                      ? 'দারুণ! এই ক্যাটাগরির সব টুল কাজ সম্পন্ন হয়েছে।'
                      : `ক্যাটাগরির সব ${toBengaliDigits(categoryProgress.totalCount)}টি টুলের কাজ সম্পন্ন করলে বিশেষ উদযাপন আনলক হবে।`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleCompleted}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer shrink-0 ${
                  isToolCompleted
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                    : isDark
                    ? 'bg-[#00D2FF] border-[#00D2FF] text-[#060D17] hover:bg-[#38BDF8]'
                    : 'bg-[#006B98] border-[#006B98] text-white hover:bg-[#02557A]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isToolCompleted ? 'টুলের কাজ সম্পন্ন হয়েছে ✓' : 'এই টুলের কাজ সম্পন্ন হিসেবে চিহ্নিত করুন'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryProgress.tools.map((toolItem) => {
                const done = completedToolIds.includes(toolItem.id);
                const isCurrent = toolItem.id === currentTool.id;
                return (
                  <Link
                    key={toolItem.id}
                    href={toolItem.path}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
                      isCurrent
                        ? isDark
                          ? 'border-[#00D2FF]/60 bg-[#00D2FF]/10 text-white'
                          : 'border-[#006B98]/50 bg-sky-50 text-[#092C43]'
                        : done
                        ? isDark
                          ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : isDark
                        ? 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 opacity-50 shrink-0" />
                    )}
                    <span>{toolItem.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
