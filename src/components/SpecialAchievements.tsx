import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Coins,
  Compass,
  Crown,
  Gem,
  GraduationCap,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';
import { STUDENT_INTELLIGENCE_TOOLS, ToolDefinition } from '../data/studentIntelligenceTools';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { playRareBadgeChime, syncAndDetectNewSpecials } from '../utils/soundFeedback';

type RarityTier = 'rare' | 'epic' | 'mythic';

interface AchievementDefinition {
  id: string;
  titleBn: string;
  subtitleBn: string;
  rarity: RarityTier;
  rarityLabelBn: string;
  accentColor: string;
  secondaryColor: string;
  Icon: React.FC<{ className?: string }>;
  requiredToolIds?: string[];
  evaluateProgress: (usedSet: Set<string>) => {
    current: number;
    target: number;
    unlocked: boolean;
    missingTools: ToolDefinition[];
  };
}

const RARITY_STYLES: Record<
  RarityTier,
  { darkBadge: string; lightBadge: string }
> = {
  rare: {
    darkBadge: 'bg-sky-500/20 border-sky-400/40 text-sky-300',
    lightBadge: 'bg-sky-50 border-sky-300 text-sky-800',
  },
  epic: {
    darkBadge: 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-300',
    lightBadge: 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-800',
  },
  mythic: {
    darkBadge: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
    lightBadge: 'bg-amber-50 border-amber-300 text-amber-800',
  },
};

function evaluateToolSet(usedSet: Set<string>, toolIds: string[]) {
  const tools = toolIds
    .map((id) => STUDENT_INTELLIGENCE_TOOLS.find((t) => t.id === id))
    .filter((t): t is ToolDefinition => Boolean(t));
  const completed = tools.filter((t) => usedSet.has(t.id));
  const missingTools = tools.filter((t) => !usedSet.has(t.id));
  return {
    current: completed.length,
    target: tools.length,
    unlocked: tools.length > 0 && missingTools.length === 0,
    missingTools,
  };
}

const SPECIAL_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'academic-pioneer',
    titleBn: 'একাডেমিক অগ্রদূত',
    subtitleBn: 'সবগুলো একাডেমিক টুল (৫/৫) ব্যবহার করে অর্জিত',
    rarity: 'rare',
    rarityLabelBn: 'বিরল',
    accentColor: '#38BDF8',
    secondaryColor: '#2DD4BF',
    Icon: GraduationCap,
    evaluateProgress: (usedSet) =>
      evaluateToolSet(usedSet, [
        'gpa-grade-calculator',
        'gpa-target-predictor',
        'result-improvement-planner',
        'subject-combination-advisor',
        'academic-eligibility-checker',
      ]),
  },
  {
    id: 'planner-pro',
    titleBn: 'প্ল্যানার প্রো',
    subtitleBn: 'সকল পরিকল্পনা ও বাজেট টুল (৪/৪) ব্যবহার করে অর্জিত',
    rarity: 'epic',
    rarityLabelBn: 'অসাধারণ',
    accentColor: '#A78BFA',
    secondaryColor: '#38BDF8',
    Icon: Compass,
    evaluateProgress: (usedSet) =>
      evaluateToolSet(usedSet, [
        'gpa-target-predictor',
        'result-improvement-planner',
        'career-roadmap-generator',
        'student-budget-planner',
      ]),
  },
  {
    id: 'admission-strategist',
    titleBn: 'ভর্তি কৌশলবিদ',
    subtitleBn: 'বিশ্ববিদ্যালয় বিভাগের সব টুল (৫/৫) ব্যবহার করে অর্জিত',
    rarity: 'rare',
    rarityLabelBn: 'বিরল',
    accentColor: '#10B981',
    secondaryColor: '#38BDF8',
    Icon: Building2,
    evaluateProgress: (usedSet) =>
      evaluateToolSet(usedSet, [
        'university-finder',
        'admission-eligibility-checker',
        'admission-cost-calculator',
        'university-comparator',
        'scholarship-matcher',
      ]),
  },
  {
    id: 'career-architect',
    titleBn: 'ক্যারিয়ার স্থপতি',
    subtitleBn: 'সবগুলো ক্যারিয়ার টুল (৫/৫) ব্যবহার করে অর্জিত',
    rarity: 'epic',
    rarityLabelBn: 'অসাধারণ',
    accentColor: '#F472B6',
    secondaryColor: '#A78BFA',
    Icon: Briefcase,
    evaluateProgress: (usedSet) =>
      evaluateToolSet(usedSet, [
        'career-explorer',
        'career-roadmap-generator',
        'skill-strength-finder',
        'subject-major-finder',
        'career-comparison-tool',
      ]),
  },
  {
    id: 'scholarship-ace',
    titleBn: 'আর্থিক ও বৃত্তি বিশেষজ্ঞ',
    subtitleBn: 'আর্থিক ও বৃত্তি সম্পর্কিত সব টুল (৪/৪) ব্যবহার করে অর্জিত',
    rarity: 'rare',
    rarityLabelBn: 'বিরল',
    accentColor: '#FBBF24',
    secondaryColor: '#F59E0B',
    Icon: Coins,
    evaluateProgress: (usedSet) =>
      evaluateToolSet(usedSet, [
        'admission-cost-calculator',
        'scholarship-matcher',
        'student-budget-planner',
        'scholarship-opportunity-radar',
      ]),
  },
  {
    id: 'quad-explorer-legend',
    titleBn: 'চতুর্মুখী কিংবদন্তি',
    subtitleBn: '৪টি ক্যাটাগরির প্রতিটি থেকে অন্তত ২টি করে মোট ৮টি টুল ব্যবহার করুন',
    rarity: 'mythic',
    rarityLabelBn: 'কিংবদন্তি',
    accentColor: '#F59E0B',
    secondaryColor: '#EC4899',
    Icon: Crown,
    evaluateProgress: (usedSet) => {
      const categories: Array<'academic' | 'career' | 'university' | 'personal'> = [
        'academic',
        'career',
        'university',
        'personal',
      ];
      let score = 0;
      const missingTools: ToolDefinition[] = [];

      for (const cat of categories) {
        const catTools = STUDENT_INTELLIGENCE_TOOLS.filter((t) => t.category === cat);
        const usedInCat = catTools.filter((t) => usedSet.has(t.id));
        score += Math.min(2, usedInCat.length);
        if (usedInCat.length < 2) {
          const needed = 2 - usedInCat.length;
          const remaining = catTools.filter((t) => !usedSet.has(t.id)).slice(0, needed);
          missingTools.push(...remaining);
        }
      }

      return {
        current: score,
        target: 8,
        unlocked: score >= 8,
        missingTools,
      };
    },
  },
];

interface SpecialAchievementsProps {
  visitedToolIds: string[];
  completedToolIds: string[];
}

export const SpecialAchievements: React.FC<SpecialAchievementsProps> = ({
  visitedToolIds,
  completedToolIds,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const usedSet = useMemo(
    () => new Set([...visitedToolIds, ...completedToolIds]),
    [visitedToolIds, completedToolIds]
  );

  const evaluatedAchievements = useMemo(
    () =>
      SPECIAL_ACHIEVEMENTS.map((item) => ({
        ...item,
        progress: item.evaluateProgress(usedSet),
      })),
    [usedSet]
  );

  const unlockedIds = useMemo(
    () => evaluatedAchievements.filter((a) => a.progress.unlocked).map((a) => a.id),
    [evaluatedAchievements]
  );

  useEffect(() => {
    const newlyUnlocked = syncAndDetectNewSpecials(unlockedIds);
    if (newlyUnlocked.length > 0) {
      playRareBadgeChime();
    }
  }, [unlockedIds]);

  const unlockedCount = unlockedIds.length;
  const selectedAchievement =
    evaluatedAchievements.find((a) => a.id === selectedId) ?? null;

  return (
    <div
      className={`mt-3 p-3 rounded-xl border transition-colors ${
        isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Gem className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`} />
          <h3 className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
            বিশেষ অর্জনসমূহ
          </h3>
          <span
            className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-fuchsia-500/15 border-fuchsia-400/30 text-fuchsia-300'
                : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'
            }`}
          >
            {toBengaliDigits(unlockedCount)}/{toBengaliDigits(SPECIAL_ACHIEVEMENTS.length)}
          </span>
        </div>

        <p className={`text-[10px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          শর্ত দেখতে যেকোনো ব্যাজে ক্লিক করুন
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {evaluatedAchievements.map((badge) => {
          const { unlocked, current, target } = badge.progress;
          const IconComponent = badge.Icon;
          const isSelected = selectedId === badge.id;
          const rarityStyle = RARITY_STYLES[badge.rarity];

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => setSelectedId((prev) => (prev === badge.id ? null : badge.id))}
              aria-expanded={isSelected}
              className={`relative overflow-hidden text-left rounded-xl p-2.5 border transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                unlocked
                  ? isDark
                    ? 'bg-gradient-to-br from-white/[0.11] via-white/[0.05] to-transparent hover:-translate-y-0.5'
                    : 'bg-gradient-to-br from-white via-amber-50/35 to-sky-50/40 hover:-translate-y-0.5 shadow-xs'
                  : isDark
                  ? 'bg-white/[0.02] border-white/10 opacity-75 hover:opacity-100 hover:border-white/20'
                  : 'bg-slate-50/60 border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
              } ${isSelected ? 'ring-1 ring-[#00D2FF]/60' : ''}`}
              style={
                unlocked
                  ? {
                      borderColor: `${badge.accentColor}75`,
                      boxShadow: isDark
                        ? `0 6px 20px -4px ${badge.accentColor}38, inset 0 1px 0 rgba(255,255,255,0.18)`
                        : `0 6px 16px -4px ${badge.accentColor}28, inset 0 1px 0 rgba(255,255,255,0.9)`,
                    }
                  : undefined
              }
            >
              {/* Subtle metallic sheen overlay when unlocked */}
              {unlocked && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-35"
                  style={{
                    background: `radial-gradient(circle, ${badge.accentColor}, ${badge.secondaryColor})`,
                  }}
                />
              )}

              {/* Shiny Metallic Icon Emblem */}
              <div
                className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  unlocked ? 'shadow-sm' : ''
                }`}
                style={
                  unlocked
                    ? {
                        background: `linear-gradient(135deg, ${badge.accentColor}38, ${badge.secondaryColor}28)`,
                        borderColor: `${badge.accentColor}70`,
                        color: badge.accentColor,
                      }
                    : {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                        color: isDark ? '#64748B' : '#94A3B8',
                      }
                }
              >
                <IconComponent className="w-4 h-4" />
                {unlocked && (
                  <Sparkles
                    className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400 drop-shadow-xs"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 relative z-10">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p
                    className={`font-heading font-bold text-[11px] leading-tight truncate ${
                      unlocked
                        ? isDark
                          ? 'text-white'
                          : 'text-slate-900'
                        : isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {badge.titleBn}
                  </p>
                  <span
                    className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                      isDark ? rarityStyle.darkBadge : rarityStyle.lightBadge
                    }`}
                  >
                    {badge.rarityLabelBn}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[9.5px] font-heading">
                  {unlocked ? (
                    <span className={`inline-flex items-center gap-0.5 font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>আনলক হয়েছে</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Lock className="w-2.5 h-2.5" />
                      <span>
                        {toBengaliDigits(current)}/{toBengaliDigits(target)} টুল
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Achievement Requirement Detail Strip */}
      {selectedAchievement && (
        <div
          className={`mt-2.5 p-2.5 rounded-lg border text-[11px] font-heading ${
            isDark ? 'bg-white/[0.04] border-white/15 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
            <span className="font-bold">
              {selectedAchievement.titleBn} — {selectedAchievement.subtitleBn}
            </span>
            <span
              className={`text-[10px] font-bold ${
                selectedAchievement.progress.unlocked
                  ? isDark
                    ? 'text-emerald-300'
                    : 'text-emerald-700'
                  : isDark
                  ? 'text-amber-300'
                  : 'text-amber-700'
              }`}
            >
              {toBengaliDigits(selectedAchievement.progress.current)}/
              {toBengaliDigits(selectedAchievement.progress.target)} সম্পন্ন
            </span>
          </div>

          {selectedAchievement.progress.unlocked ? (
            <p className={`text-[10.5px] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              অভিনন্দন! এই বিরল ব্যাজটি আপনার ঝুলিতে যুক্ত হয়েছে।
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                বাকি টুলস:
              </span>
              {selectedAchievement.progress.missingTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/35 text-[#38BDF8] hover:bg-[#00D2FF]/20'
                      : 'bg-white border-sky-200 text-[#006B98] hover:bg-sky-50'
                  }`}
                >
                  <span>{tool.nameBn}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
