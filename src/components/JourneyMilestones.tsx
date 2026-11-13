import React, { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, Compass, Crown, Lock, Sparkles, Target, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { STUDENT_INTELLIGENCE_TOOLS } from '../data/studentIntelligenceTools';
import { toBengaliDigits } from '../utils/bengaliUtils';
import {
  SOUND_PREF_UPDATED_EVENT,
  isSoundFeedbackEnabled,
  playMilestoneChime,
  setSoundFeedbackEnabled,
  syncAndDetectNewMilestones,
} from '../utils/soundFeedback';

interface MilestoneTier {
  id: string;
  threshold: number;
  titleBn: string;
  accentColor: string;
  Icon: React.FC<{ className?: string }>;
}

const MILESTONE_TIERS: MilestoneTier[] = [
  {
    id: 'first-step',
    threshold: 1,
    titleBn: 'প্রথম পদক্ষেপ',
    accentColor: '#38BDF8',
    Icon: Compass,
  },
  {
    id: 'curious-explorer',
    threshold: 3,
    titleBn: 'সচেতন অনুসন্ধানী',
    accentColor: '#34D399',
    Icon: Sparkles,
  },
  {
    id: 'smart-planner',
    threshold: 5,
    titleBn: 'স্মার্ট পরিকল্পনাকারী',
    accentColor: '#A78BFA',
    Icon: Target,
  },
  {
    id: 'admission-strategist',
    threshold: 10,
    titleBn: 'ভর্তি ও ক্যারিয়ার কৌশলী',
    accentColor: '#F59E0B',
    Icon: Award,
  },
  {
    id: 'medix-master',
    threshold: 20,
    titleBn: 'মেডিক্স প্রাইম মাস্টার',
    accentColor: '#EC4899',
    Icon: Crown,
  },
];

interface JourneyMilestonesProps {
  visitedToolsCount: number;
}

export const JourneyMilestones: React.FC<JourneyMilestonesProps> = ({ visitedToolsCount }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => isSoundFeedbackEnabled());

  const totalTools = STUDENT_INTELLIGENCE_TOOLS.length;
  const effectiveToolCount = Math.min(totalTools, Math.max(visitedToolsCount, 0));
  const unlockedMilestones = useMemo(
    () => MILESTONE_TIERS.filter((m) => effectiveToolCount >= m.threshold),
    [effectiveToolCount]
  );
  const earnedCount = unlockedMilestones.length;
  const nextMilestone = MILESTONE_TIERS.find((m) => effectiveToolCount < m.threshold);

  useEffect(() => {
    const syncSound = () => setSoundEnabled(isSoundFeedbackEnabled());
    window.addEventListener(SOUND_PREF_UPDATED_EVENT, syncSound);
    window.addEventListener('storage', syncSound);
    return () => {
      window.removeEventListener(SOUND_PREF_UPDATED_EVENT, syncSound);
      window.removeEventListener('storage', syncSound);
    };
  }, []);

  useEffect(() => {
    const unlockedIds = unlockedMilestones.map((m) => m.id);
    const newlyUnlocked = syncAndDetectNewMilestones(unlockedIds);
    if (newlyUnlocked.length > 0) {
      playMilestoneChime();
    }
  }, [unlockedMilestones]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundFeedbackEnabled(next);
    setSoundEnabled(next);
    if (next) {
      playMilestoneChime();
    }
  };

  return (
    <div
      className={`mt-3 p-3 rounded-xl border transition-colors ${
        isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Trophy className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <h3 className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
            মাইলফলক ব্যাজ
          </h3>
          <span
            className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {toBengaliDigits(earnedCount)}/{toBengaliDigits(MILESTONE_TIERS.length)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p className={`text-[10px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {nextMilestone
              ? `পরবর্তী: ${nextMilestone.titleBn} (আরও ${toBengaliDigits(
                  nextMilestone.threshold - effectiveToolCount
                )}টি টুল)`
              : 'সকল ২০টি টুল সম্পন্ন!'}
          </p>

          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundEnabled ? 'অর্জন সাউন্ড বন্ধ করুন' : 'অর্জন সাউন্ড চালু করুন'}
            aria-pressed={soundEnabled}
            title={soundEnabled ? 'সাউন্ড চালু (বন্ধ করতে ক্লিক করুন)' : 'সাউন্ড বন্ধ (চালু করতে ক্লিক করুন)'}
            className={`p-1 rounded-md border transition-colors cursor-pointer ${
              soundEnabled
                ? isDark
                  ? 'bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                : isDark
                ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Compact Badge Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MILESTONE_TIERS.map((tier) => {
          const isUnlocked = effectiveToolCount >= tier.threshold;
          const IconComponent = tier.Icon;

          return (
            <div
              key={tier.id}
              className={`rounded-lg px-2.5 py-2 border flex items-center gap-2 transition-all ${
                isUnlocked
                  ? isDark
                    ? 'bg-white/[0.06] border-white/20'
                    : 'bg-slate-50 border-slate-300'
                  : isDark
                  ? 'bg-white/[0.02] border-white/10 opacity-65'
                  : 'bg-slate-50/40 border-slate-200 opacity-70'
              }`}
              style={isUnlocked ? { borderColor: `${tier.accentColor}55` } : undefined}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={
                  isUnlocked
                    ? { backgroundColor: `${tier.accentColor}22`, color: tier.accentColor }
                    : {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                        color: isDark ? '#64748B' : '#94A3B8',
                      }
                }
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-heading font-bold text-[10px] leading-tight truncate ${
                    isUnlocked ? (isDark ? 'text-white' : 'text-slate-900') : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {tier.titleBn}
                </p>
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-heading ${
                    isUnlocked
                      ? isDark
                        ? 'text-emerald-300'
                        : 'text-emerald-700'
                      : isDark
                      ? 'text-slate-500'
                      : 'text-slate-500'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>অর্জিত</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-2.5 h-2.5" />
                      <span>{toBengaliDigits(tier.threshold)}টি</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
