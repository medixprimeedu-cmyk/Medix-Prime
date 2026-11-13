import React, { useEffect, useRef, useState } from 'react';
import { Share2, Link2, Check, Send, X, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { copyToClipboard } from '../utils/bengaliUtils';
import { loadCardHistory } from '../utils/cardStorage';

const STUDENT_ENTRY_STORAGE_KEY = 'medix_prime_student_entry';

interface StoredStudentSummary {
  name: string;
  studentClass: 'SSC' | 'HSC';
  institution: string;
}

function getStudentSummary(): StoredStudentSummary | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STUDENT_ENTRY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string' && parsed.name.trim()) {
      return {
        name: parsed.name.trim(),
        studentClass: parsed.studentClass === 'SSC' ? 'SSC' : 'HSC',
        institution: typeof parsed.institution === 'string' ? parsed.institution.trim() : '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const ShareMenuButton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<'link_copied' | 'journey_shared' | 'journey_copied' | null>(null);
  const [studentSummary, setStudentSummary] = useState<StoredStudentSummary | null>(null);
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refresh dynamic student & journey state whenever menu opens
  useEffect(() => {
    if (isOpen) {
      setStudentSummary(getStudentSummary());
      const history = loadCardHistory();
      if (history.length > 0 && history[0].cardData) {
        const card = history[0].cardData;
        const snippet = card.achievement || card.studyHabit || card.favoriteDialogue;
        setLatestAchievement(snippet ? snippet.trim() : null);
      } else {
        setLatestAchievement(null);
      }
    }
  }, [isOpen]);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getAppUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  };

  const buildJourneySharePayload = () => {
    const appUrl = getAppUrl();
    const lines: string[] = ['MEDIX PRIME — শিক্ষার্থীর শিক্ষাজীবন ও স্মার্ট প্রস্তুতি'];

    if (studentSummary) {
      lines.push(`শিক্ষার্থী: ${studentSummary.name} (${studentSummary.studentClass})`);
      if (studentSummary.institution) {
        lines.push(`প্রতিষ্ঠান: ${studentSummary.institution}`);
      }
    }

    if (latestAchievement) {
      lines.push(`আমার যাত্রার অর্জন: "${latestAchievement}"`);
    }

    lines.push(
      'একাডেমিক জিপিএ, ক্যারিয়ার রোডম্যাপ ও বাংলাদেশের বিশ্ববিদ্যালয় ভর্তি যোগ্যতা যাচাইয়ের ২০টি ফ্রি বুদ্ধিবৃত্তিক টুল ব্যবহার করতে ভিজিট করুন:'
    );

    return {
      title: 'MEDIX PRIME — শিক্ষার্থীর স্মার্ট প্ল্যাটফর্ম',
      text: lines.join('\n'),
      url: appUrl,
    };
  };

  const showTempStatus = (status: 'link_copied' | 'journey_shared' | 'journey_copied') => {
    setStatusMessage(status);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === status ? null : prev));
    }, 2500);
  };

  const handleCopyDirectLink = async () => {
    const url = getAppUrl();
    const ok = await copyToClipboard(url);
    if (ok) {
      showTempStatus('link_copied');
    }
  };

  const handleShareJourney = async () => {
    const payload = buildJourneySharePayload();

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url,
        });
        showTempStatus('journey_shared');
        return;
      } catch (err: unknown) {
        // If user intentionally cancelled native share sheet, do nothing
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // Otherwise fall back seamlessly to copying the journey summary + link
      }
    }

    const fullText = `${payload.text}\n${payload.url}`;
    const ok = await copyToClipboard(fullText);
    if (ok) {
      showTempStatus('journey_copied');
    }
  };

  const appUrl = getAppUrl();
  const supportsWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="MEDIX PRIME অ্যাপ ও জার্নির তথ্য শেয়ার করুন"
        title="শেয়ার করুন"
        className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 cursor-pointer border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] hover:scale-105 active:scale-95 ${
          isOpen
            ? isDark
              ? 'bg-[#00D2FF]/20 border-[#00D2FF]/50 text-[#38BDF8]'
              : 'bg-sky-50 border-[#006B98]/40 text-[#006B98]'
            : isDark
            ? 'bg-white/[0.08] border-white/15 text-slate-200 hover:bg-white/[0.14] hover:text-white'
            : 'bg-[#F1F5F9] border-[#CBD5E1] text-slate-800 hover:bg-slate-200/80 hover:text-slate-950'
        }`}
      >
        <Share2 className="w-4 h-4 shrink-0" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="শেয়ার অপশনসমূহ"
          className={`absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl border p-4 z-50 transition-all shadow-xl ${
            isDark
              ? 'bg-[#0B1526] border-[#1E3554] text-white shadow-[0_16px_40px_rgba(0,0,0,0.65)]'
              : 'bg-white border-slate-200 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.14)]'
          }`}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-current/10">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-[#00D2FF]/15 text-[#38BDF8]' : 'bg-sky-50 text-[#006B98]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs sm:text-sm leading-tight">
                  MEDIX PRIME শেয়ার করুন
                </h3>
                <p className={`text-[10px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  সরাসরি লিংক কপি বা জার্নির তথ্য পাঠান
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="শেয়ার মেনু বন্ধ করুন"
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Direct App Link Preview */}
          <div
            className={`px-3 py-2 rounded-xl border text-[11px] font-latin truncate mb-3 ${
              isDark ? 'bg-[#060D17] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title={appUrl}
          >
            {appUrl}
          </div>

          {/* Student Journey Preview Badge (if saved) */}
          {(studentSummary || latestAchievement) && (
            <div
              className={`p-2.5 rounded-xl border mb-3 text-[11px] font-heading leading-relaxed ${
                isDark
                  ? 'bg-[#0F223D]/60 border-[#00D2FF]/25 text-slate-200'
                  : 'bg-sky-50/70 border-sky-200 text-slate-700'
              }`}
            >
              <div className={`flex items-center gap-1.5 font-bold mb-0.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`}>
                <Sparkles className="w-3 h-3" />
                <span>আপনার জার্নির সংযুক্ত তথ্য:</span>
              </div>
              {studentSummary && (
                <p className="truncate">
                  {studentSummary.name} • {studentSummary.studentClass}
                  {studentSummary.institution ? ` • ${studentSummary.institution}` : ''}
                </p>
              )}
              {latestAchievement && <p className="truncate opacity-85">“{latestAchievement}”</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCopyDirectLink}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-heading font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                statusMessage === 'link_copied'
                  ? isDark
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : isDark
                  ? 'bg-white/5 border-white/15 text-slate-100 hover:bg-white/10'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {statusMessage === 'link_copied' ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Link2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                )}
                <span>
                  {statusMessage === 'link_copied' ? 'অ্যাপের লিংক কপি হয়েছে!' : 'সরাসরি অ্যাপের লিংক কপি করুন'}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleShareJourney}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-heading font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
                statusMessage === 'journey_shared' || statusMessage === 'journey_copied'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#006B98] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {statusMessage === 'journey_shared' || statusMessage === 'journey_copied' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <Send className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {statusMessage === 'journey_shared'
                    ? 'জার্নির তথ্য শেয়ার হয়েছে!'
                    : statusMessage === 'journey_copied'
                    ? 'জার্নির তথ্যসহ লিংক কপি হয়েছে!'
                    : supportsWebShare
                    ? 'জার্নির তথ্য শেয়ার করুন'
                    : 'জার্নির তথ্য ও লিংক শেয়ার/কপি করুন'}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
