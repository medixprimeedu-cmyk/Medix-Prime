import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Timer,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { playTimerDoneChime } from '../utils/soundFeedback';

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface ModeConfig {
  key: PomodoroMode;
  labelBn: string;
  durationSeconds: number;
  accentColor: string;
}

const POMODORO_MODES: Record<PomodoroMode, ModeConfig> = {
  focus: {
    key: 'focus',
    labelBn: 'ফোকাস সেশন (২৫ মি.)',
    durationSeconds: 25 * 60,
    accentColor: '#00D2FF',
  },
  shortBreak: {
    key: 'shortBreak',
    labelBn: 'বিরতি (৫ মি.)',
    durationSeconds: 5 * 60,
    accentColor: '#34D399',
  },
  longBreak: {
    key: 'longBreak',
    labelBn: 'দীর্ঘ বিরতি (১৫ মি.)',
    durationSeconds: 15 * 60,
    accentColor: '#A78BFA',
  },
};

const FOCUS_SUBJECTS = [
  'সাধারণ পড়াশোনা',
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'জীববিজ্ঞান',
  'উচ্চতর গণিত',
  'বাংলা / ইংরেজি',
] as const;

type FocusSubject = (typeof FOCUS_SUBJECTS)[number];

const POMODORO_SESSIONS_KEY = 'medix_prime_pomodoro_sessions_v1';

interface StoredSessionStats {
  dateKey: string;
  count: number;
  totalMinutes: number;
  lastSubject?: FocusSubject;
}

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadTodayStats(): { count: number; totalMinutes: number; subject: FocusSubject } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { count: 0, totalMinutes: 0, subject: 'সাধারণ পড়াশোনা' };
  }
  try {
    const raw = window.localStorage.getItem(POMODORO_SESSIONS_KEY);
    if (!raw) return { count: 0, totalMinutes: 0, subject: 'সাধারণ পড়াশোনা' };
    const parsed = JSON.parse(raw) as Partial<StoredSessionStats>;
    const today = getTodayDateKey();
    const subject =
      parsed.lastSubject && FOCUS_SUBJECTS.includes(parsed.lastSubject)
        ? parsed.lastSubject
        : 'সাধারণ পড়াশোনা';

    if (parsed && parsed.dateKey === today && typeof parsed.count === 'number') {
      const safeCount = Math.max(0, Math.floor(parsed.count));
      const safeMinutes =
        typeof parsed.totalMinutes === 'number'
          ? Math.max(0, Math.floor(parsed.totalMinutes))
          : safeCount * 25;
      return { count: safeCount, totalMinutes: safeMinutes, subject };
    }
    return { count: 0, totalMinutes: 0, subject };
  } catch {
    return { count: 0, totalMinutes: 0, subject: 'সাধারণ পড়াশোনা' };
  }
}

function saveTodayStats(count: number, totalMinutes: number, subject: FocusSubject): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const payload: StoredSessionStats = {
      dateKey: getTodayDateKey(),
      count,
      totalMinutes,
      lastSubject: subject,
    };
    window.localStorage.setItem(POMODORO_SESSIONS_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors
  }
}

function formatClockBn(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return `${toBengaliDigits(mm)}:${toBengaliDigits(ss)}`;
}

export const PomodoroTimerCard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const initialStats = loadTodayStats();
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(POMODORO_MODES.focus.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsToday, setSessionsToday] = useState<number>(initialStats.count);
  const [focusMinutesToday, setFocusMinutesToday] = useState<number>(initialStats.totalMinutes);
  const [selectedSubject, setSelectedSubject] = useState<FocusSubject>(initialStats.subject);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const targetEndRef = useRef<number | null>(null);

  const currentConfig = POMODORO_MODES[mode];
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((currentConfig.durationSeconds - secondsLeft) / currentConfig.durationSeconds) * 100)
    )
  );

  // Cycle position (4 focus sessions = 1 complete Pomodoro cycle)
  const completedInCycle = sessionsToday % 4;

  const completeCurrentInterval = (playAudio: boolean) => {
    setIsRunning(false);
    targetEndRef.current = null;
    if (playAudio) {
      playTimerDoneChime();
    }

    if (mode === 'focus') {
      const nextCount = sessionsToday + 1;
      const nextMinutes = focusMinutesToday + 25;
      setSessionsToday(nextCount);
      setFocusMinutesToday(nextMinutes);
      saveTodayStats(nextCount, nextMinutes, selectedSubject);

      const shouldTakeLongBreak = nextCount % 4 === 0;
      const nextBreakMode: PomodoroMode = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';
      setMode(nextBreakMode);
      setSecondsLeft(POMODORO_MODES[nextBreakMode].durationSeconds);
      setStatusMessage(
        shouldTakeLongBreak
          ? `চমৎকার! টানা ৪টি ফোকাস সেশন (${selectedSubject}) সম্পন্ন হয়েছে। এবার ১৫ মিনিট দীর্ঘ বিরতি নিন।`
          : `২৫ মিনিটের ফোকাস সেশন (${selectedSubject}) সম্পন্ন! এবার ৫ মিনিট বিরতি নিন।`
      );
    } else {
      setMode('focus');
      setSecondsLeft(POMODORO_MODES.focus.durationSeconds);
      setStatusMessage('বিরতি শেষ! নতুন ২৫ মিনিটের ফোকাস সেশন শুরু করতে পারেন।');
    }
  };

  const completeCallbackRef = useRef<(playAudio: boolean) => void>(() => {});
  completeCallbackRef.current = completeCurrentInterval;

  // Pomodoro countdown ticker
  useEffect(() => {
    if (!isRunning) {
      targetEndRef.current = null;
      return;
    }

    targetEndRef.current = Date.now() + secondsLeft * 1000;

    const interval = window.setInterval(() => {
      if (targetEndRef.current === null) return;
      const remaining = Math.ceil((targetEndRef.current - Date.now()) / 1000);

      if (remaining <= 0) {
        window.clearInterval(interval);
        completeCallbackRef.current(true);
      } else {
        setSecondsLeft(remaining);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [isRunning, mode]);

  const handleModeChange = (nextMode: PomodoroMode) => {
    setIsRunning(false);
    targetEndRef.current = null;
    setMode(nextMode);
    setSecondsLeft(POMODORO_MODES[nextMode].durationSeconds);
    setStatusMessage(null);
  };

  const handleSubjectChange = (subject: FocusSubject) => {
    setSelectedSubject(subject);
    saveTodayStats(sessionsToday, focusMinutesToday, subject);
  };

  const handleToggleRun = () => {
    setStatusMessage(null);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    targetEndRef.current = null;
    setSecondsLeft(currentConfig.durationSeconds);
    setStatusMessage(null);
  };

  const handleSkipOrComplete = () => {
    completeCurrentInterval(false);
  };

  return (
    <div
      aria-label="ফোকাস সেশন টাইমার"
      className={`p-3.5 sm:p-4 rounded-2xl border transition-colors ${
        isDark ? 'bg-[#060D17]/85 border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Title, Metadata & Mode Switcher */}
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                mode === 'focus'
                  ? isDark
                    ? 'bg-[#00D2FF]/15 text-[#38BDF8]'
                    : 'bg-sky-50 text-[#006B98]'
                  : isDark
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
            </div>

            <div className="min-w-0">
              <h3
                className={`font-heading font-bold text-xs sm:text-sm truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                ফোকাস সেশন টাইমার
              </h3>
              <p
                className={`text-[11px] font-heading flex flex-wrap items-center gap-1.5 tabular-nums ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <span>আজ {toBengaliDigits(sessionsToday)}টি সেশন</span>
                <span aria-hidden="true">·</span>
                <span>মোট {toBengaliDigits(focusMinutesToday)} মিনিট</span>
                <span aria-hidden="true">·</span>
                <span>{selectedSubject}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.values(POMODORO_MODES) as ModeConfig[]).map((item) => {
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleModeChange(item.key)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] sm:text-[11px] font-heading font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                    active
                      ? isDark
                        ? 'bg-[#00D2FF]/20 border-[#00D2FF]/50 text-[#38BDF8]'
                        : 'bg-sky-50 border-sky-300 text-[#006B98]'
                      : isDark
                      ? 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.labelBn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Digital Clock + Controls + 4-Session Cycle Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center lg:items-end lg:flex-col justify-between gap-2 shrink-0">
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-2">
              {mode !== 'focus' && (
                <Coffee className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
              )}
              <span
                aria-live="off"
                className={`font-heading font-extrabold text-xl sm:text-2xl tabular-nums tracking-tight ${
                  isDark ? 'text-white' : 'text-[#092C43]'
                }`}
              >
                {formatClockBn(secondsLeft)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleRun}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-heading font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                  isRunning
                    ? isDark
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 hover:bg-amber-500/30'
                      : 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
                    : isDark
                    ? 'bg-[#00D2FF] border-[#00D2FF] text-[#060D17] hover:bg-[#38BDF8]'
                    : 'bg-[#006B98] border-[#006B98] text-white hover:bg-[#02557A]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>বিরাম</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>শুরু করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                aria-label="টাইমার রিসেট করুন"
                title="রিসেট"
                className={`p-2 rounded-xl border transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleSkipOrComplete}
                aria-label={mode === 'focus' ? 'সেশন সম্পন্ন হিসেবে চিহ্নিত করুন' : 'বিরতি শেষ করে ফোকাসে ফিরুন'}
                title={mode === 'focus' ? 'সেশন সম্পন্ন' : 'ফোকাসে ফিরুন'}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-heading font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {mode === 'focus' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>সম্পন্ন</span>
                  </>
                ) : (
                  <>
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>ফোকাস</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Interval Cycle Blocks */}
          <div className="flex items-center gap-2 text-[10px] font-heading">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              পমোডোরো চক্র ({toBengaliDigits(completedInCycle)}/{toBengaliDigits(4)}):
            </span>
            <div className="flex items-center gap-1" aria-label={`৪টির মধ্যে ${toBengaliDigits(completedInCycle)}টি সেশন সম্পন্ন`}>
              {[0, 1, 2, 3].map((step) => {
                const filled = step < completedInCycle;
                return (
                  <span
                    key={step}
                    className={`w-5 h-1.5 rounded-full transition-colors ${
                      filled
                        ? isDark
                          ? 'bg-[#00D2FF]'
                          : 'bg-[#006B98]'
                        : isDark
                        ? 'bg-white/15'
                        : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slim Progress Bar */}
      <div
        className={`mt-2.5 w-full h-1.5 rounded-full overflow-hidden ${
          isDark ? 'bg-white/10' : 'bg-slate-200'
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: currentConfig.accentColor,
          }}
        />
      </div>

      {/* Subject Focus Selector */}
      <div
        className={`mt-2.5 pt-2.5 border-t flex flex-wrap items-center gap-1.5 ${
          isDark ? 'border-white/10' : 'border-slate-100'
        }`}
      >
        <span className={`text-[10.5px] font-heading font-semibold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          বিষয়:
        </span>
        {FOCUS_SUBJECTS.map((subject) => {
          const active = selectedSubject === subject;
          return (
            <button
              key={subject}
              type="button"
              onClick={() => handleSubjectChange(subject)}
              className={`px-2 py-0.5 rounded-md border text-[10px] font-heading font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? isDark
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-slate-800 border-slate-800 text-white'
                  : isDark
                  ? 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
                  : 'bg-transparent border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {statusMessage && (
        <p
          role="status"
          className={`mt-2 text-[11px] font-heading font-semibold ${
            isDark ? 'text-emerald-300' : 'text-emerald-700'
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};
