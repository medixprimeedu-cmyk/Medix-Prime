import React, { useEffect, useRef, useState } from 'react';
import {
  MessageSquarePlus,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from '../hooks/useRouter';

const STUDENT_ENTRY_STORAGE_KEY = 'medix_prime_student_entry';

const CATEGORIES = ['মতামত', 'পরামর্শ', 'নতুন টুল', 'সমস্যা'] as const;

function readStoredStudent() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STUDENT_ENTRY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const FeedbackHeaderButton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('মতামত');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleIconClick = () => {
    const section = document.getElementById('feedback-suggestion-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('feedback-message') as HTMLTextAreaElement | null;
      if (input) {
        setTimeout(() => input.focus({ preventScroll: true }), 450);
      }
      return;
    }

    setSubmitted(false);
    setError(null);
    setIsOpen((prev) => !prev);
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError('অন্তত ৫ অক্ষরের মতামত বা পরামর্শ লিখুন।');
      return;
    }

    const stored = readStoredStudent();
    setIsSending(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: trimmed,
          studentName: stored?.name || undefined,
          studentClass: stored?.studentClass || undefined,
          institution: stored?.institution || undefined,
          phone: stored?.phone || undefined,
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok || !resData.ok) {
        throw new Error(resData.error || 'পাঠাতে সমস্যা হয়েছে।');
      }

      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'পাঠানো যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleIconClick}
        aria-expanded={isOpen}
        aria-label="মতামত ও পরামর্শ বক্স"
        title="মতামত ও পরামর্শ"
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
        <MessageSquarePlus className="w-4 h-4 shrink-0" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="মতামত ও পরামর্শ"
          className={`absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl border p-4 z-50 shadow-xl ${
            isDark
              ? 'bg-[#0B1526] border-[#1E3554] text-white shadow-[0_16px_40px_rgba(0,0,0,0.65)]'
              : 'bg-white border-slate-200 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.14)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-current/10">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-[#00D2FF]/15 text-[#38BDF8]' : 'bg-sky-50 text-[#006B98]'
                }`}
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm">মতামত ও পরামর্শ</h3>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="বন্ধ করুন"
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-4 text-center space-y-2.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-heading font-bold">আপনার বার্তা টেলিগ্রামে পাঠানো হয়েছে!</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={`text-[11px] font-heading font-semibold underline cursor-pointer ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'
                }`}
              >
                আরেকটি লিখুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuickSubmit} className="space-y-3">
              {error && (
                <div
                  className={`p-2 rounded-lg border text-[11px] font-heading flex items-center gap-1.5 ${
                    isDark ? 'bg-rose-500/15 border-rose-500/35 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold border transition-colors cursor-pointer ${
                      category === item
                        ? isDark
                          ? 'bg-[#00D2FF] border-[#00D2FF] text-[#060D17]'
                          : 'bg-[#006B98] border-[#006B98] text-white'
                        : isDark
                        ? 'bg-white/5 border-white/15 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার মতামত বা পরামর্শ লিখুন..."
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-body resize-none focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                }`}
              />

              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#00D2FF] text-[#060D17]'
                    : 'bg-gradient-to-r from-[#092C43] to-[#006B98] text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}</span>
              </button>
            </form>
          )}

          {/* Footer links: আমাদের সম্পর্কে & গোপনীয়তা নীতি */}
          <div
            className={`mt-3 pt-3 border-t flex items-center justify-around gap-2 text-xs font-heading font-medium ${
              isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
            }`}
          >
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`inline-flex items-center gap-1 hover:underline cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>আমাদের সম্পর্কে</span>
            </Link>
            <span className="opacity-40">|</span>
            <Link
              href="/privacy"
              onClick={() => setIsOpen(false)}
              className={`inline-flex items-center gap-1 hover:underline cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>গোপনীয়তা নীতি</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
