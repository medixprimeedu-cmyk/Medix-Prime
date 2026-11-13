import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';
import { Link } from '../hooks/useRouter';
import { toBengaliDigits } from '../utils/bengaliUtils';
import {
  CATEGORY_COMPLETED_EVENT,
  CategoryProgressItem,
} from '../utils/studentDashboardStorage';
import { playRareBadgeChime } from '../utils/soundFeedback';

export function fireCategoryConfetti(accentColor?: string): () => void {
  const palette = [
    accentColor || '#00D2FF',
    '#38BDF8',
    '#34D399',
    '#FBBF24',
    '#F472B6',
    '#A78BFA',
  ];

  // Initial celebratory center cannon burst
  confetti({
    particleCount: 85,
    spread: 75,
    startVelocity: 42,
    origin: { x: 0.5, y: 0.62 },
    colors: palette,
    disableForReducedMotion: true,
    zIndex: 1000,
  });

  // Staggered dual-side bursts
  const t1 = window.setTimeout(() => {
    confetti({
      particleCount: 48,
      angle: 60,
      spread: 58,
      startVelocity: 45,
      origin: { x: 0.08, y: 0.68 },
      colors: palette,
      disableForReducedMotion: true,
      zIndex: 1000,
    });
    confetti({
      particleCount: 48,
      angle: 120,
      spread: 58,
      startVelocity: 45,
      origin: { x: 0.92, y: 0.68 },
      colors: palette,
      disableForReducedMotion: true,
      zIndex: 1000,
    });
  }, 180);

  const t2 = window.setTimeout(() => {
    confetti({
      particleCount: 36,
      spread: 100,
      decay: 0.91,
      scalar: 0.9,
      origin: { x: 0.5, y: 0.35 },
      colors: palette,
      disableForReducedMotion: true,
      zIndex: 1000,
    });
  }, 420);

  return () => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}

export const CategoryConfettiCelebration: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [celebratedCategory, setCelebratedCategory] = useState<CategoryProgressItem | null>(null);
  const cleanupTimersRef = useRef<(() => void) | null>(null);
  const autoDismissRef = useRef<number | null>(null);

  const dismissBanner = useCallback(() => {
    setCelebratedCategory(null);
    if (autoDismissRef.current !== null) {
      window.clearTimeout(autoDismissRef.current);
      autoDismissRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleCategoryCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<CategoryProgressItem>;
      const detail = customEvent.detail;
      if (!detail || !detail.labelBn) return;

      if (cleanupTimersRef.current) {
        cleanupTimersRef.current();
      }
      if (autoDismissRef.current !== null) {
        window.clearTimeout(autoDismissRef.current);
      }

      cleanupTimersRef.current = fireCategoryConfetti(detail.accentColor);
      playRareBadgeChime();
      setCelebratedCategory(detail);

      autoDismissRef.current = window.setTimeout(() => {
        setCelebratedCategory(null);
        autoDismissRef.current = null;
      }, 6500);
    };

    window.addEventListener(CATEGORY_COMPLETED_EVENT, handleCategoryCompleted);
    return () => {
      window.removeEventListener(CATEGORY_COMPLETED_EVENT, handleCategoryCompleted);
      if (cleanupTimersRef.current) {
        cleanupTimersRef.current();
      }
      if (autoDismissRef.current !== null) {
        window.clearTimeout(autoDismissRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-md pointer-events-none">
      <AnimatePresence>
        {celebratedCategory && (
          <motion.div
            key={celebratedCategory.key}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto rounded-2xl border p-3.5 sm:p-4 shadow-2xl flex items-start gap-3 ${
              isDark
                ? 'bg-[#0B182E]/95 backdrop-blur-md border-emerald-400/45 text-white shadow-[0_14px_40px_rgba(0,0,0,0.65)]'
                : 'bg-white/95 backdrop-blur-md border-emerald-300 text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.18)]'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${celebratedCategory.accentColor}22`,
                borderColor: `${celebratedCategory.accentColor}45`,
                color: celebratedCategory.accentColor,
              }}
            >
              <Trophy className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <PartyPopper className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <p
                  className={`font-heading font-extrabold text-xs sm:text-sm ${
                    isDark ? 'text-emerald-300' : 'text-emerald-700'
                  }`}
                >
                  অভিনন্দন! ক্যাটাগরি সম্পন্ন
                </p>
              </div>

              <p className={`font-heading text-xs leading-snug ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span className="font-bold">{celebratedCategory.labelBn}</span> বিভাগের{' '}
                {toBengaliDigits(celebratedCategory.totalCount)}টি প্রয়োজনীয় টুল কাজই আপনি সফলভাবে সম্পন্ন করেছেন।
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Link
                  href="/"
                  onClick={dismissBanner}
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/35'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  অন্য ক্যাটাগরি দেখুন
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={dismissBanner}
              aria-label="অভিনন্দন বার্তা বন্ধ করুন"
              className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
