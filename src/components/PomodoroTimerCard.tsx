import React, { useEffect, useRef, useState } from 'react';
import { Coffee, Flame, Pause, Play, RotateCcw, Timer } from 'lucide-react';
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
    labelBn: 'ফোকাস (২৫ মি.)',
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

const POMODORO_SESSIONS_KEY = 'medix_prime_pomodoro_sessions_v1';

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadTodaySessions(): number {
  if (typeof window === 'undefined' || !window.localStorage) return 0;
  try {
    const raw = window.localStorage.getItem(POMODORO_SESSIONS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const today = getTodayDateKey();
    if (parsed && parsed.dateKey === today && typeof parsed.count === 'number') {
      return Math.max(0, Math.floor(parsed.count));
    }
    return 0;
  } catch {
    return 0;
  }
}

function saveTodaySessions(count: number): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(
      POMODORO_SESSIONS_KEY,
      JSON.stringify({ dateKey: getTodayDateKey(), count })
    );
  } catch {
    // Ignore storage quota/private-mode errors
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

  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(POMODORO_MODES.focus.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsToday, setSessionsToday] = useState<number>(() => loadTodaySessions());
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
        targetEndRef.current = null;
        setIsRunning(false);
        playTimerDoneChime();

        if (mode === 'focus') {
          setSessionsToday((prev) => {
            const next = prev + 1;
            saveTodaySessions(next);
            return next;
          });
          setMode('shortBreak');
          setSecondsLeft(POMODORO_MODES.shortBreak.durationSeconds);
          setStatusMessage('ফোকাস সেশন সম্পন্ন! এবার ৫ মিনিট বিরতি নিন।');
        } else {
          setMode('focus');
          setSecondsLeft(POMODORO_MODES.focus.durationSeconds);
          setStatusMessage('বিরতি শেষ! নতুন ফোকাস সেশন শুরু করতে পারেন।');
        }
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

  return (
    <div
      className={`mt-3 p-3 rounded-xl border transition-colors ${
        isDark ? 'bg-[#060D17]/75 border-white/10' : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: Title + Session Count + Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <Timer
              className={`w-3.5 h-3.5 shrink-0 ${
                mode === 'focus'
                  ? isDark
                    ? 'text-[#38BDF8]'
                    : 'text-[#006B98]'
                  : isDark
                  ? 'text-emerald-400'
                  : 'text-emerald-600'
              }`}
            />
            <h3 className={`font-heading font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
              পমোডোরো স্টাডি টাইমার
            </h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <Flame className="w-2.5 h-2.5" />
              <span>আজ {toBengaliDigits(sessionsToday)} সেশন</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {(Object.values(POMODORO_MODES) as ModeConfig[]).map((item) => {
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleModeChange(item.key)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-heading font-bold transition-colors cursor-pointer ${
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

        {/* Right: Digital Clock + Progress + Start/Pause & Reset Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          <div className="flex items-center gap-2">
            {mode !== 'focus' && (
              <Coffee className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`} />
            )}
            <span
              aria-live="off"
              className={`font-heading font-extrabold text-lg sm:text-xl tabular-nums tracking-tight ${
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
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
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
                  <Pause className="w-3 h-3" />
                  <span>বিরাম</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>শুরু করুন</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="টাইমার রিসেট করুন"
              title="রিসেট"
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
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

      {statusMessage && (
        <p
          role="status"
          className={`mt-1.5 text-[11px] font-heading font-semibold ${
            isDark ? 'text-emerald-300' : 'text-emerald-700'
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};
