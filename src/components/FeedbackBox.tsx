import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { StudentEntryData } from '../pages/EntryFormPage';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { Link } from '../hooks/useRouter';

interface FeedbackBoxProps {
  studentEntry: StudentEntryData | null;
}

const FEEDBACK_CATEGORIES = [
  'মতামত',
  'পরামর্শ',
  'নতুন টুলের প্রস্তাব',
  'সমস্যা ও সমাধান',
] as const;

const MAX_MESSAGE_LENGTH = 1000;

export const FeedbackBox: React.FC<FeedbackBoxProps> = ({ studentEntry }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [category, setCategory] = useState<(typeof FEEDBACK_CATEGORIES)[number]>('মতামত');
  const [senderName, setSenderName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const displayName = studentEntry?.name?.trim() || senderName.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedMsg = message.trim();
    if (trimmedMsg.length < 5) {
      setError('অনুগ্রহ করে অন্তত ৫ অক্ষরের একটি স্পষ্ট মতামত বা পরামর্শ লিখুন।');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: trimmedMsg,
          studentName: displayName || undefined,
          studentClass: studentEntry?.studentClass || undefined,
          institution: studentEntry?.institution || undefined,
          phone: studentEntry?.phone || undefined,
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok || !resData.ok) {
        throw new Error(resData.error || 'মতামত পাঠাতে সমস্যা হয়েছে।');
      }

      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'মতামত পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="feedback-suggestion-section"
      className={`py-10 sm:py-14 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#07101C] border-[#172740] text-white' : 'bg-[#F8FAFC] border-slate-200 text-[#0F172A]'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className={`rounded-3xl border p-5 sm:p-8 transition-colors ${
            isDark
              ? 'bg-[#0B1526]/95 border-[#172740] shadow-[0_14px_40px_rgba(0,0,0,0.35)]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isDark
                    ? 'bg-[#00D2FF]/15 border-[#00D2FF]/35 text-[#38BDF8]'
                    : 'bg-sky-50 border-sky-200 text-[#006B98]'
                }`}
              >
                <MessageSquarePlus className="w-5 h-5" />
              </div>

              <div>
                <h2
                  className={`font-heading font-extrabold text-lg sm:text-xl ${
                    isDark ? 'text-white' : 'text-[#092C43]'
                  }`}
                >
                  মতামত ও পরামর্শ বক্স
                </h2>
                <p className={`text-xs sm:text-sm font-body mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  প্ল্যাটফর্মের উন্নয়ন, নতুন টুলের চাহিদা বা আপনার মূল্যবান পরামর্শ সরাসরি আমাদের কাছে পাঠান
                </p>
              </div>
            </div>

            {studentEntry?.name && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-heading font-semibold self-start sm:self-center shrink-0 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <User className={`w-3.5 h-3.5 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`} />
                <span>{studentEntry.name}</span>
              </span>
            )}
          </div>

          {submitted ? (
            <div
              className={`p-6 rounded-2xl border text-center space-y-3 ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-base sm:text-lg">
                আপনার {category} সফলভাবে গৃহীত হয়েছে!
              </h3>
              <p className={`text-xs sm:text-sm font-body ${isDark ? 'text-emerald-200/80' : 'text-emerald-800'}`}>
                MEDIX PRIME টিমকে সহায়তা করার জন্য আন্তরিক ধন্যবাদ।
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-heading font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                    : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>আরেকটি মতামত / পরামর্শ পাঠান</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  className={`p-3 rounded-xl border text-xs font-heading flex items-center gap-2 ${
                    isDark
                      ? 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category Chips */}
              <div>
                <span className={`block text-xs font-heading font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  বিষয় নির্বাচন করুন:
                </span>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_CATEGORIES.map((item) => {
                    const active = category === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold border transition-all cursor-pointer ${
                          active
                            ? isDark
                              ? 'bg-[#00D2FF] border-[#00D2FF] text-[#060D17]'
                              : 'bg-[#006B98] border-[#006B98] text-white'
                            : isDark
                            ? 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Name input if student is browsing without stored name */}
              {!studentEntry?.name && (
                <div>
                  <label
                    htmlFor="feedback-sender-name"
                    className={`block text-xs font-heading font-bold mb-1.5 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    আপনার নাম (ঐচ্ছিক):
                  </label>
                  <input
                    id="feedback-sender-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="আপনার নাম লিখতে পারেন"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-heading transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                    }`}
                  />
                </div>
              )}

              {/* Message Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="feedback-message"
                    className={`text-xs font-heading font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                  >
                    আপনার {category} বিস্তারিত লিখুন *
                  </label>
                  <span className={`text-[11px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {toBengaliDigits(message.length)} / {toBengaliDigits(MAX_MESSAGE_LENGTH)}
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার মূল্যবান মতামত, নতুন কোনো টুলের চাহিদা বা পরামর্শ এখানে লিখুন..."
                  required
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-body leading-relaxed resize-y transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#00D2FF] text-[#060D17] hover:brightness-110'
                      : 'bg-gradient-to-r from-[#092C43] to-[#006B98] text-white hover:brightness-110'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'টেলিগ্রামে পাঠানো হচ্ছে...' : 'মতামত ও পরামর্শ পাঠান'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer links: আমাদের সম্পর্কে & গোপনীয়তা নীতি */}
          <div
            className={`mt-6 pt-5 border-t flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-heading font-semibold ${
              isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'
            }`}
          >
            <Link
              href="/about"
              className={`inline-flex items-center gap-1.5 hover:underline cursor-pointer transition-colors ${isDark ? 'hover:text-[#00D2FF]' : 'hover:text-[#006B98]'}`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>আমাদের সম্পর্কে</span>
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/privacy"
              className={`inline-flex items-center gap-1.5 hover:underline cursor-pointer transition-colors ${isDark ? 'hover:text-[#00D2FF]' : 'hover:text-[#006B98]'}`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>গোপনীয়তা নীতি</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
