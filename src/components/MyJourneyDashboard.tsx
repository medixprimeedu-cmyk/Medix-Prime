import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  Heart,
  Clock,
  GraduationCap,
  Building2,
  ArrowUpRight,
  Trash2,
  Edit3,
  LogOut,
  TrendingUp,
  CheckCircle2,
  PartyPopper,
  Sparkles,
  Wand2,
  Eye,
  EyeOff,
  Share2,
  Check,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';
import { STUDENT_INTELLIGENCE_TOOLS } from '../data/studentIntelligenceTools';
import { StudentEntryData } from '../pages/EntryFormPage';
import { ToolIcon } from './tools/ToolIcon';
import { JourneyMilestones } from './JourneyMilestones';
import { SpecialAchievements } from './SpecialAchievements';
import { PomodoroTimerCard } from './PomodoroTimerCard';
import { fireCategoryConfetti } from './CategoryConfettiCelebration';
import { playRareBadgeChime } from '../utils/soundFeedback';
import { formatBengaliDateTime, loadCardHistory } from '../utils/cardStorage';
import { copyToClipboard, toBengaliDigits } from '../utils/bengaliUtils';
import {
  ACTIVITY_UPDATED_EVENT,
  COMPLETED_TOOLS_UPDATED_EVENT,
  FAVORITES_UPDATED_EVENT,
  RecentToolActivityItem,
  clearRecentToolActivity,
  dispatchCategoryCelebration,
  getCategoryCompletionSummary,
  loadCompletedToolIds,
  loadFavoriteToolIds,
  loadRecentToolActivity,
  loadVisitedToolIds,
  toggleFavoriteToolId,
} from '../utils/studentDashboardStorage';

interface MyJourneyDashboardProps {
  studentEntry: StudentEntryData | null;
  onLogout?: () => void;
}

export const MyJourneyDashboard: React.FC<MyJourneyDashboardProps> = ({ studentEntry, onLogout }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteToolIds());
  const [completedIds, setCompletedIds] = useState<string[]>(() => loadCompletedToolIds());
  const [recentActivity, setRecentActivity] = useState<RecentToolActivityItem[]>(() =>
    loadRecentToolActivity()
  );
  const [visitedToolIds, setVisitedToolIds] = useState<string[]>(() => loadVisitedToolIds());
  const [savedCardsCount, setSavedCardsCount] = useState<number>(() => loadCardHistory().length);
  const [specialMenuOpen, setSpecialMenuOpen] = useState(false);
  const [showSpecialAchievements, setShowSpecialAchievements] = useState(true);
  const [goalShareStatus, setGoalShareStatus] = useState<'shared' | 'copied' | null>(null);
  const specialMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!specialMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (specialMenuRef.current && !specialMenuRef.current.contains(e.target as Node)) {
        setSpecialMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSpecialMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [specialMenuOpen]);

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(loadFavoriteToolIds());
    const syncCompleted = () => setCompletedIds(loadCompletedToolIds());
    const syncActivity = () => {
      setRecentActivity(loadRecentToolActivity());
      setVisitedToolIds(loadVisitedToolIds());
    };
    const syncStorage = () => {
      syncFavorites();
      syncCompleted();
      syncActivity();
      setSavedCardsCount(loadCardHistory().length);
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
    window.addEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, syncActivity);
    window.addEventListener('storage', syncStorage);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
      window.removeEventListener(COMPLETED_TOOLS_UPDATED_EVENT, syncCompleted);
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, syncActivity);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  const categoryProgressList = useMemo(
    () => getCategoryCompletionSummary(completedIds),
    [completedIds]
  );

  const recommendedNextTool = useMemo(() => {
    const usedSet = new Set([...visitedToolIds, ...completedIds]);
    return (
      STUDENT_INTELLIGENCE_TOOLS.find((tool) => !usedSet.has(tool.id)) ??
      STUDENT_INTELLIGENCE_TOOLS[0]
    );
  }, [visitedToolIds, completedIds]);

  const pinnedTools = useMemo(() => {
    const favSet = new Set(favoriteIds);
    return STUDENT_INTELLIGENCE_TOOLS.filter((tool) => favSet.has(tool.id));
  }, [favoriteIds]);

  const totalVisitsCount = useMemo(
    () => recentActivity.reduce((sum, item) => sum + (item.visitCount || 1), 0),
    [recentActivity]
  );

  const totalToolsCount = STUDENT_INTELLIGENCE_TOOLS.length;
  const exploredToolsCount = Math.min(totalToolsCount, visitedToolIds.length);
  const journeyProgressPercent =
    totalToolsCount > 0 ? Math.round((exploredToolsCount / totalToolsCount) * 100) : 0;

  const studentName = studentEntry?.name?.trim() || 'শিক্ষার্থী';
  const studentClassLabel = studentEntry?.studentClass || 'HSC';

  const handleShareGoal = async () => {
    const completedCategories = categoryProgressList
      .filter((c) => c.isCompleted)
      .map((c) => c.labelBn);
    const pendingCategories = categoryProgressList
      .filter((c) => !c.isCompleted)
      .slice(0, 2)
      .map((c) => `${c.shortLabelBn} (${toBengaliDigits(c.completedCount)}/${toBengaliDigits(c.totalCount)})`);

    const topPinnedGoals = pinnedTools.slice(0, 3).map((t) => t.nameBn);
    const cardHistory = loadCardHistory();
    const latestGoalNote = cardHistory[0]?.cardData
      ? (cardHistory[0].cardData.achievement || cardHistory[0].cardData.studyHabit || '').trim()
      : '';

    const lines: string[] = [
      `🎯 MEDIX PRIME — ${studentName} (${studentClassLabel})-এর প্রস্তুতির লক্ষ্য ও অগ্রগতি`,
    ];

    if (studentEntry?.institution) {
      lines.push(`🏫 প্রতিষ্ঠান: ${studentEntry.institution}`);
    }

    lines.push(
      `📊 বর্তমান অগ্রগতি: ${toBengaliDigits(exploredToolsCount)}/${toBengaliDigits(totalToolsCount)}টি টুল (${toBengaliDigits(journeyProgressPercent)}%) • ${toBengaliDigits(completedIds.length)}টি টাস্ক সম্পন্ন`
    );

    if (topPinnedGoals.length > 0) {
      lines.push(`⭐ শীর্ষ লক্ষ্য (পিন করা টুলস): ${topPinnedGoals.join(', ')}`);
    } else if (pendingCategories.length > 0) {
      lines.push(`🚀 পরবর্তী লক্ষ্য: ${pendingCategories.join(', ')}`);
    }

    if (completedCategories.length > 0) {
      lines.push(`🏆 সম্পন্ন ক্যাটাগরি: ${completedCategories.join(', ')}`);
    }

    if (latestGoalNote) {
      lines.push(`💡 ব্যক্তিগত লক্ষ্য: "${latestGoalNote}"`);
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = lines.join('\n');

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${studentName}-এর Medix Prime প্রস্তুতির লক্ষ্য`,
          text: shareText,
          url: shareUrl || undefined,
        });
        setGoalShareStatus('shared');
        window.setTimeout(() => {
          setGoalShareStatus((prev) => (prev === 'shared' ? null : prev));
        }, 2500);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    const fullSnippet = shareUrl ? `${shareText}\n${shareUrl}` : shareText;
    const copiedOk = await copyToClipboard(fullSnippet);
    if (copiedOk) {
      setGoalShareStatus('copied');
      window.setTimeout(() => {
        setGoalShareStatus((prev) => (prev === 'copied' ? null : prev));
      }, 2500);
    }
  };

  return (
    <section
      id="my-journey-dashboard"
      className={`pt-4 pb-2 sm:pt-5 sm:pb-3 relative overflow-x-clip transition-colors duration-300 ${
        isDark ? 'bg-[#081220] text-white' : 'bg-[#FFFFFF] text-[#0F172A]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`rounded-2xl border p-3.5 sm:p-4.5 transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#0B1526] via-[#0D1A30] to-[#081322] border-[#1B2F4D] shadow-[0_8px_24px_rgba(0,107,152,0.14)]'
              : 'bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0F9FF] border-slate-200 shadow-xs'
          }`}
        >
          {/* Compact Top Bar: Student Name + Class + Institution + Small Edit & Logout Buttons */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isDark
                    ? 'bg-[#00D2FF]/15 border-[#00D2FF]/35 text-[#38BDF8]'
                    : 'bg-sky-50 border-sky-200 text-[#006B98]'
                }`}
              >
                <Compass className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2
                    className={`text-sm sm:text-base font-heading font-extrabold tracking-tight truncate ${
                      isDark ? 'text-white' : 'text-[#092C43]'
                    }`}
                  >
                    {studentName}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <GraduationCap className="w-2.5 h-2.5" />
                    <span>{studentClassLabel}</span>
                  </span>
                </div>

                {studentEntry?.institution && (
                  <p
                    className={`text-[11px] font-heading flex items-center gap-1 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Building2 className="w-3 h-3 shrink-0 opacity-80" />
                    <span className="truncate">{studentEntry.institution}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
              {/* Small 'বিশেষ' Special Option Dropdown */}
              <div className="relative" ref={specialMenuRef}>
                <button
                  type="button"
                  onClick={() => setSpecialMenuOpen((prev) => !prev)}
                  aria-expanded={specialMenuOpen}
                  aria-haspopup="menu"
                  title="বিশেষ অপশন"
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                    specialMenuOpen
                      ? isDark
                        ? 'bg-fuchsia-500/25 border-fuchsia-400/55 text-fuchsia-200'
                        : 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800'
                      : isDark
                      ? 'bg-fuchsia-500/15 border-fuchsia-400/35 text-fuchsia-300 hover:bg-fuchsia-500/25'
                      : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>বিশেষ</span>
                </button>

                {specialMenuOpen && (
                  <div
                    role="menu"
                    className={`absolute right-0 top-full mt-1.5 w-60 p-2 rounded-xl border shadow-2xl z-30 space-y-1 ${
                      isDark
                        ? 'bg-[#0F1E36] border-[#1E3A5F] text-slate-100 shadow-[0_14px_34px_rgba(0,0,0,0.65)]'
                        : 'bg-white border-slate-200 text-slate-800 shadow-[0_14px_34px_rgba(15,23,42,0.16)]'
                    }`}
                  >
                    <p
                      className={`px-2 py-1 text-[10px] font-heading font-bold border-b mb-1 ${
                        isDark ? 'text-fuchsia-300 border-white/10' : 'text-fuchsia-700 border-slate-100'
                      }`}
                    >
                      বিশেষ অপশন
                    </p>

                    <Link
                      href={recommendedNextTool.path}
                      onClick={() => setSpecialMenuOpen(false)}
                      role="menuitem"
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-white/10 text-slate-100' : 'hover:bg-sky-50 text-slate-800'
                      }`}
                    >
                      <Wand2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`} />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[9.5px] opacity-75">পরবর্তী সেরা টুল</span>
                        <span className="block truncate font-bold">{recommendedNextTool.nameBn}</span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setShowSpecialAchievements((prev) => !prev);
                        setSpecialMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/10 text-slate-100' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      {showSpecialAchievements ? (
                        <EyeOff className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      )}
                      <span>
                        {showSpecialAchievements ? 'বিশেষ অর্জন লুকান' : 'বিশেষ অর্জন দেখুন'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        fireCategoryConfetti('#EC4899');
                        playRareBadgeChime();
                        setSpecialMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-heading font-semibold transition-colors cursor-pointer text-left ${
                        isDark ? 'hover:bg-white/10 text-slate-100' : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <PartyPopper className="w-3.5 h-3.5 shrink-0 text-pink-400" />
                      <span>অগ্রগতি উদযাপন করুন</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleShareGoal}
                aria-label="বন্ধুদের সাথে লক্ষ্য ও অগ্রগতি শেয়ার করুন"
                title="বর্তমান অগ্রগতি ও শীর্ষ লক্ষ্য শেয়ার করুন"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                  goalShareStatus
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : isDark
                    ? 'bg-[#00D2FF]/15 border-[#00D2FF]/40 text-[#38BDF8] hover:bg-[#00D2FF]/25'
                    : 'bg-sky-50 border-sky-200 text-[#006B98] hover:bg-sky-100'
                }`}
              >
                {goalShareStatus ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Share2 className="w-3 h-3" />
                )}
                <span>
                  {goalShareStatus === 'shared'
                    ? 'শেয়ার হয়েছে ✓'
                    : goalShareStatus === 'copied'
                    ? 'লক্ষ্য কপি হয়েছে ✓'
                    : 'লক্ষ্য শেয়ার'}
                </span>
              </button>

              <Link
                href="/entry"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>তথ্য হালনাগাদ</span>
              </Link>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="লগআউট করুন"
                  title="লগআউট"
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <LogOut className="w-3 h-3" />
                  <span>লগআউট</span>
                </button>
              )}
            </div>
          </div>

          {/* Journey Progress Bar */}
          <div
            className={`mb-3 px-3 py-2.5 rounded-xl border ${
              isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`} />
                <span className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  যাত্রার অগ্রগতি
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-heading">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {toBengaliDigits(exploredToolsCount)} / {toBengaliDigits(totalToolsCount)}টি টুল পরিদর্শিত
                </span>
                <span
                  className={`font-extrabold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-[#00D2FF]/15 border-[#00D2FF]/30 text-[#38BDF8]'
                      : 'bg-sky-50 border-sky-200 text-[#006B98]'
                  }`}
                >
                  {toBengaliDigits(journeyProgressPercent)}%
                </span>
              </div>
            </div>

            <div
              role="progressbar"
              aria-label="যাত্রার অগ্রগতি"
              aria-valuenow={journeyProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}
            >
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] via-[#00D2FF] to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${journeyProgressPercent}%` }}
              />
            </div>

            {/* Compact 4-Category Task Completion Strip */}
            <div
              className={`mt-2.5 pt-2.5 border-t grid grid-cols-2 sm:grid-cols-4 gap-1.5 ${
                isDark ? 'border-white/10' : 'border-slate-200/80'
              }`}
            >
              {categoryProgressList.map((cat) => {
                const nextPendingTool = cat.tools.find((t) => !completedIds.includes(t.id));
                const chipClass = `flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-heading transition-colors ${
                  cat.isCompleted
                    ? isDark
                      ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                    : isDark
                    ? 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-[#00D2FF]/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#006B98]/40'
                }`;

                if (cat.isCompleted) {
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => dispatchCategoryCelebration(cat)}
                      title={`${cat.labelBn} সম্পন্ন হয়েছে — উদযাপন দেখতে ক্লিক করুন`}
                      className={chipClass}
                    >
                      <span className="inline-flex items-center gap-1 font-bold truncate">
                        <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
                        <span className="truncate">{cat.shortLabelBn}</span>
                      </span>
                      <span className="inline-flex items-center gap-0.5 font-extrabold shrink-0">
                        <PartyPopper className="w-2.5 h-2.5 text-amber-400" />
                        <span>
                          {toBengaliDigits(cat.completedCount)}/{toBengaliDigits(cat.totalCount)}
                        </span>
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={cat.key}
                    href={nextPendingTool ? nextPendingTool.path : '/'}
                    title={`${cat.labelBn} — পরবর্তী অসম্পূর্ণ টুলে যান`}
                    className={`${chipClass} cursor-pointer`}
                  >
                    <span className="font-semibold truncate">{cat.shortLabelBn}</span>
                    <span
                      className={`font-bold shrink-0 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {toBengaliDigits(cat.completedCount)}/{toBengaliDigits(cat.totalCount)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Compact Two-Column Body: Pinned Tools + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left: Pinned Tools */}
            <div
              className={`lg:col-span-6 p-3 rounded-xl border ${
                isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <h3 className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    পিন করা টুলস
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {toBengaliDigits(pinnedTools.length)}টি
                </span>
              </div>

              {pinnedTools.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {pinnedTools.map((tool) => (
                    <div
                      key={tool.id}
                      className={`inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg border text-[11px] font-heading font-semibold transition-colors ${
                        isDark
                          ? 'bg-white/[0.04] border-white/10 hover:border-[#00D2FF]/50 text-slate-100'
                          : 'bg-slate-50 border-slate-200 hover:border-[#006B98]/40 text-slate-800'
                      }`}
                    >
                      <Link href={tool.path} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <span style={{ color: tool.accentColor }}>
                          <ToolIcon name={tool.iconName} className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate max-w-[140px]">{tool.nameBn}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteToolId(tool.id)}
                        title="পিন সরান"
                        aria-label={`${tool.nameBn} পিন সরান`}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isDark ? 'text-rose-400 hover:bg-rose-500/20' : 'text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-[11px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  নিচের টুল কার্ডের <Heart className="w-3 h-3 inline text-rose-500 mx-0.5" /> আইকনে ক্লিক করে প্রিয় টুল পিন করুন।
                </p>
              )}
            </div>

            {/* Right: Compact Recent Activity */}
            <div
              className={`lg:col-span-6 p-3 rounded-xl border ${
                isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`} />
                  <h3 className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    সাম্প্রতিক কার্যক্রম
                  </h3>
                  <span className={`text-[10px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ({toBengaliDigits(recentActivity.length)} টুল • {toBengaliDigits(totalVisitsCount)} ভিজিট
                    {savedCardsCount > 0 ? ` • ${toBengaliDigits(savedCardsCount)} কার্ড` : ''})
                  </span>
                </div>

                {recentActivity.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRecentToolActivity}
                    className={`inline-flex items-center gap-1 text-[10px] font-heading font-semibold px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                      isDark
                        ? 'text-slate-400 hover:text-rose-300 hover:bg-white/5'
                        : 'text-slate-500 hover:text-rose-700 hover:bg-slate-100'
                    }`}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>

              {recentActivity.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {recentActivity.slice(0, 3).map((activity) => (
                    <Link
                      key={activity.toolId}
                      href={activity.path}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-heading transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-slate-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-sky-50/50 text-slate-800'
                      }`}
                    >
                      <span style={{ color: activity.accentColor }}>
                        <ToolIcon name={activity.iconName} className="w-3 h-3" />
                      </span>
                      <span className="font-semibold truncate max-w-[130px]">{activity.nameBn}</span>
                      <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        • {formatBengaliDateTime(activity.visitedAt)}
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={`text-[11px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  নিচের যেকোনো টুল ওপেন করলে এখানে সাম্প্রতিক ব্যবহার দেখা যাবে।
                </p>
              )}
            </div>
          </div>

          {/* Compact Pomodoro Study Timer */}
          <PomodoroTimerCard />

          {/* Compact Milestones & Earned Badges */}
          <JourneyMilestones visitedToolsCount={visitedToolIds.length} />

          {/* Special Achievements: Rare Shiny Combination Badges */}
          {showSpecialAchievements && (
            <SpecialAchievements visitedToolIds={visitedToolIds} completedToolIds={completedIds} />
          )}
        </div>
      </div>
    </section>
  );
};
