import React, { useEffect, useState } from 'react';
import { BookOpen, Check, Copy, Quote, RefreshCw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { copyToClipboard, toBengaliDigits } from '../utils/bengaliUtils';

interface StudyQuote {
  id: number;
  text: string;
  author: string;
  topic: string;
}

const HSC_MOTIVATION_QUOTES: StudyQuote[] = [
  {
    id: 1,
    text: 'প্রতিদিন একটু একটু করে পড়াশোনা করাই পরীক্ষার হলে বড় সাফল্যের সবচেয়ে বড় গোপন সূত্র।',
    author: 'এইচএসসি প্রস্তুতি দর্শন',
    topic: 'ধারাবাহিকতা',
  },
  {
    id: 2,
    text: 'স্বপ্ন সেটা নয় যেটা তুমি ঘুমিয়ে দেখো, স্বপ্ন সেটাই যেটা পূরণের অদম্য ইচ্ছা তোমাকে ঘুমোতে দেয় না।',
    author: 'এ. পি. জে. আব্দুল কালাম',
    topic: 'লক্ষ্য ও অনুপ্রেরণা',
  },
  {
    id: 3,
    text: 'আজকের একটি কঠিন অধ্যায় আয়ত্ত করতে পারলে, আগামীকালের ভর্তি পরীক্ষার একটি ধাপ তুমি এগিয়ে থাকবে।',
    author: 'মেডিক্স প্রাইম মেন্টর নোট',
    topic: 'এইচএসসি ফোকাস',
  },
  {
    id: 4,
    text: 'সাফল্যের কোনো শর্টকাট নেই—এটি প্রস্তুতি, কঠোর পরিশ্রম এবং ভুল থেকে শেখার সম্মিলিত ফলাফল।',
    author: 'কলিন পাওয়েল',
    topic: 'অধ্যবসায়',
  },
  {
    id: 5,
    text: 'কঠিন সূত্র বা টপিক ভয় না পেয়ে ছোট ছোট অংশে ভাগ করে বুঝে পড়ো—বিজ্ঞান তখনই আনন্দের হয়ে উঠবে।',
    author: 'স্টাডি স্ট্র্যাটেজি',
    topic: 'স্মার্ট স্টাডি',
  },
  {
    id: 6,
    text: 'মেধার চেয়েও নিয়মিত চর্চা ও অধ্যবসায় একজন শিক্ষার্থীকে অনেক দূর এগিয়ে নিয়ে যায়।',
    author: 'আলবার্ট আইনস্টাইন (ভাবানুবাদ)',
    topic: 'চর্চা ও পরিশ্রম',
  },
  {
    id: 7,
    text: 'সময় নষ্ট না করে আজ যে ২৫ মিনিট মনোযোগ দিয়ে পড়বে, সেটিই তোমার আত্মবিশ্বাস দ্বিগুণ করে দেবে।',
    author: 'ফোকাস নীতি',
    topic: 'সময় ব্যবস্থাপনা',
  },
  {
    id: 8,
    text: 'প্রশ্নভীতি দূর করার সেরা উপায় হলো ভুলগুলো চিহ্নিত করে সেগুলোকে নিজের শক্তিতে রূপান্তর করা।',
    author: 'পরীক্ষা কৌশল',
    topic: 'আত্মবিশ্বাস',
  },
  {
    id: 9,
    text: 'তোমার গতকালের চেয়ে আজকের প্রস্তুতি ১ শতাংশ ভালো হলেই তুমি সঠিক পথে আছো।',
    author: 'দৈনিক উন্নয়ন নীতি',
    topic: 'অগ্রগতি',
  },
  {
    id: 10,
    text: 'বিশ্রাম ও পর্যাপ্ত ঘুম ছাড়া মস্তিষ্ক তথ্য গুছিয়ে রাখতে পারে না—তাই পড়ার পাশাপাশি বিশ্রামকেও গুরুত্ব দাও।',
    author: 'স্মার্ট লার্নিং',
    topic: 'সুস্থ রুটিন',
  },
  {
    id: 11,
    text: 'সবার সাথে প্রতিযোগিতা করার আগে নিজের গতকালের সংস্করণকে ছাড়িয়ে যাওয়ার চেষ্টা করো।',
    author: 'আত্ম-উন্নয়ন',
    topic: 'মনোবল',
  },
  {
    id: 12,
    text: 'বইয়ের প্রতিটি পৃষ্ঠা তোমাকে কেবল নম্বরই দেয় না, বরং চিন্তার স্বচ্ছতা ও ভবিষ্যৎ গড়ার শক্তি জোগায়।',
    author: 'শিক্ষা ভাবনা',
    topic: 'জ্ঞানার্জন',
  },
  {
    id: 13,
    text: 'যে বিষয়ে ভয় লাগে, আজ সেটির সবচেয়ে সহজ অনুচ্ছেদ দিয়ে শুরু করো—শুরু করাটাই অর্ধেক জয়।',
    author: 'প্রস্তুতি গাইড',
    topic: 'সাহস',
  },
  {
    id: 14,
    text: 'উদ্বেগ নয়, সুশৃঙ্খল পরিকল্পনা ও নিয়মিত রিভিশনই বোর্ড ও ভর্তি পরীক্ষার চূড়ান্ত সাফল্য এনে দেয়।',
    author: 'রিভিশন সূত্র',
    topic: 'পরিকল্পনা',
  },
  {
    id: 15,
    text: 'তুমি যা শিখছো তা শুধু মুখস্থ কোরো না, "কেন" এবং "কীভাবে" প্রশ্ন করো—তাহলেই তা দীর্ঘদিন মনে থাকবে।',
    author: 'গভীর অধ্যয়ন',
    topic: 'ধারণা স্পষ্টতা',
  },
  {
    id: 16,
    text: 'যতই দেরি মনে হোক না কেন, ঠিক এই মুহূর্ত থেকেই নতুন উদ্যমে শুরু করার সুযোগ সবসময় তোমার হাতে।',
    author: 'নতুন শুরু',
    topic: 'ইতিবাচক মানসিকতা',
  },
  {
    id: 17,
    text: 'স্বপ্নের বিশ্ববিদ্যালয়ে পৌঁছানোর পথটি তৈরি হয় আজকের নীরব পড়ার টেবিলের পরিশ্রম থেকে।',
    author: 'ভর্তি প্রস্তুতি',
    topic: 'স্বপ্নপূরণ',
  },
  {
    id: 18,
    text: 'যত বেশি অনুশীলন করবে, পরীক্ষার হলে প্রশ্নগুলো ততই পরিচিত ও সহজ মনে হবে।',
    author: 'মক টেস্ট দর্শন',
    topic: 'অনুশীলন',
  },
];

const DAILY_MOTIVATION_STORAGE_KEY = 'medix_prime_daily_motivation_v1';

interface StoredDailyMotivation {
  dateKey: string;
  quoteId: number;
  recentIds: number[];
}

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTodayDateBn(): string {
  const monthsBn = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];
  const now = new Date();
  const day = toBengaliDigits(now.getDate());
  const month = monthsBn[now.getMonth()] || '';
  const year = toBengaliDigits(now.getFullYear());
  return `${day} ${month}, ${year}`;
}

function pickRandomQuote(excludeIds: number[]): StudyQuote {
  const candidates = HSC_MOTIVATION_QUOTES.filter((q) => !excludeIds.includes(q.id));
  const pool = candidates.length > 0 ? candidates : HSC_MOTIVATION_QUOTES;
  const randomIdx = Math.floor(Math.random() * pool.length);
  return pool[randomIdx] || HSC_MOTIVATION_QUOTES[0];
}

function loadOrCreateTodayQuote(): StudyQuote {
  const todayKey = getTodayDateKey();
  if (typeof window === 'undefined' || !window.localStorage) {
    return HSC_MOTIVATION_QUOTES[0];
  }

  try {
    const raw = window.localStorage.getItem(DAILY_MOTIVATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredDailyMotivation>;
      if (parsed.dateKey === todayKey && typeof parsed.quoteId === 'number') {
        const matched = HSC_MOTIVATION_QUOTES.find((q) => q.id === parsed.quoteId);
        if (matched) return matched;
      }

      const recentIds = Array.isArray(parsed.recentIds) ? parsed.recentIds : [];
      const exclude = typeof parsed.quoteId === 'number'
        ? Array.from(new Set([...recentIds.slice(-6), parsed.quoteId]))
        : recentIds.slice(-6);

      const nextQuote = pickRandomQuote(exclude);
      const updatedRecent = [...exclude, nextQuote.id].slice(-8);

      window.localStorage.setItem(
        DAILY_MOTIVATION_STORAGE_KEY,
        JSON.stringify({
          dateKey: todayKey,
          quoteId: nextQuote.id,
          recentIds: updatedRecent,
        })
      );
      return nextQuote;
    }
  } catch {
    // Ignore storage read errors
  }

  const initialQuote = pickRandomQuote([]);
  try {
    window.localStorage.setItem(
      DAILY_MOTIVATION_STORAGE_KEY,
      JSON.stringify({
        dateKey: todayKey,
        quoteId: initialQuote.id,
        recentIds: [initialQuote.id],
      })
    );
  } catch {
    // Ignore storage write errors
  }
  return initialQuote;
}

export const DailyStudyMotivationCard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [quote, setQuote] = useState<StudyQuote>(() => loadOrCreateTodayQuote());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleShuffleQuote = () => {
    const nextQuote = pickRandomQuote([quote.id]);
    setQuote(nextQuote);
    setCopied(false);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(DAILY_MOTIVATION_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Partial<StoredDailyMotivation>) : {};
        const prevRecent = Array.isArray(parsed.recentIds) ? parsed.recentIds : [];
        const updatedRecent = Array.from(new Set([...prevRecent, nextQuote.id])).slice(-8);

        window.localStorage.setItem(
          DAILY_MOTIVATION_STORAGE_KEY,
          JSON.stringify({
            dateKey: getTodayDateKey(),
            quoteId: nextQuote.id,
            recentIds: updatedRecent,
          })
        );
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handleCopyQuote = async () => {
    const textToCopy = `"${quote.text}" — ${quote.author}`;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
    }
  };

  return (
    <div
      aria-label="দৈনিক পড়াশোনার অনুপ্রেরণা"
      className={`p-3.5 sm:p-4 rounded-2xl border transition-colors ${
        isDark ? 'bg-[#060D17]/85 border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#00D2FF]/15 text-[#38BDF8]' : 'bg-sky-50 text-[#006B98]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3
              className={`font-heading font-bold text-xs sm:text-sm truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              দৈনিক পড়াশোনার অনুপ্রেরণা
            </h3>
            <p
              className={`text-[11px] font-heading flex flex-wrap items-center gap-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <span>{formatTodayDateBn()}</span>
              <span aria-hidden="true">·</span>
              <span>এইচএসসি স্টাডি বার্তা</span>
              <span aria-hidden="true">·</span>
              <span>{quote.topic}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleShuffleQuote}
            aria-label="অন্য অনুপ্রেরণামূলক উক্তি দেখুন"
            title="অন্য উক্তি দেখুন"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-heading font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>নতুন উক্তি</span>
          </button>

          <button
            type="button"
            onClick={handleCopyQuote}
            aria-label={copied ? 'উক্তি কপি হয়েছে' : 'উক্তি কপি করুন'}
            title="উক্তি কপি করুন"
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
              copied
                ? isDark
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div
        className={`pt-2.5 border-t flex items-start gap-2.5 ${
          isDark ? 'border-white/10' : 'border-slate-100'
        }`}
      >
        <Quote
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            isDark ? 'text-[#38BDF8]/80' : 'text-[#006B98]/75'
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0 space-y-1">
          <blockquote
            className={`font-body text-xs sm:text-[13.5px] leading-relaxed font-medium ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            “{quote.text}”
          </blockquote>
          <p
            className={`text-[11px] font-heading font-semibold ${
              isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'
            }`}
          >
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};
