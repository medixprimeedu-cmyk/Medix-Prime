import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Radar, Calendar, Building2, CheckCircle2 } from 'lucide-react';

interface OpportunityItem {
  id: string;
  title: string;
  category: 'অলিম্পিয়াড ও বিজ্ঞান' | 'স্কিল ও প্রতিযোগিতা' | 'বিশ্বমানের ফ্রি কোর্স';
  organizer: string;
  audience: string;
  seasonSchedule: string;
  benefits: string;
  officialPortal: string;
}

const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'bdmo',
    title: 'বাংলাদেশ গণিত অলিম্পিয়াড (BdMO)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'বাংলাদেশ গণিত অলিম্পিয়াড কমিটি ও প্রথম আলো',
    audience: 'প্রাইমারি, জুনিয়র, সেকেন্ডারি ও হায়ার সেকেন্ডারি (কলেজ)',
    seasonSchedule: 'অনলাইন বাছাই: ডিসেম্বর–জানুয়ারি | জাতীয় উৎসব: ফেব্রুয়ারি–মার্চ',
    benefits: 'আন্তর্জাতিক গণিত অলিম্পিয়াডে (IMO) বাংলাদেশের প্রতিনিধিত্বের সুযোগ, সনদ ও বিশ্বমানের গাণিতিক মেধা যাচাই।',
    officialPortal: 'matholympiad.org.bd',
  },
  {
    id: 'bdpho',
    title: 'বাংলাদেশ ফিজিক্স অলিম্পিয়াড (BdPhO)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'বাংলাদেশ ফিজিক্স অলিম্পিয়াড কমিটি',
    audience: 'সপ্তম থেকে দ্বাদশ শ্রেণি (SSC ও HSC পরীক্ষার্থী)',
    seasonSchedule: 'নিবন্ধন ও আঞ্চলিক পর্ব: ডিসেম্বর–জানুয়ারি | জাতীয় পর্ব: ফেব্রুয়ারি',
    benefits: 'আন্তর্জাতিক ফিজিক্স অলিম্পিয়াড (IPhO)-এ অংশগ্রহণের সুযোগ এবং বুয়েট ও বিজ্ঞান বিশ্ববিদ্যালয়ে গবেষণার ভিত্তি তৈরি।',
    officialPortal: 'bdpho.org',
  },
  {
    id: 'bdbo',
    title: 'বাংলাদেশ বায়োলজি অলিম্পিয়াড (BdBO)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'বাংলাদেশ জীববিজ্ঞান অলিম্পিয়াড (BdBO)',
    audience: 'জুনিয়র (৬ষ্ঠ-৮ম), সেকেন্ডারি (৯ম-১০ম) ও হায়ার সেকেন্ডারি (১১শ-১২শ)',
    seasonSchedule: 'নিবন্ধন ও আঞ্চলিক উৎসব: জানুয়ারি–মার্চ | জাতীয় বায়োক্যাম্প: এপ্রিল–মে',
    benefits: 'আন্তর্জাতিক জীববিজ্ঞান অলিম্পিয়াডে (IBO) বাংলাদেশের প্রতিনিধিত্ব; মেডিকেল ও বায়োটেকনোলজি ভর্তিচ্ছুদের জন্য অনন্য প্রস্তুতি।',
    officialPortal: 'bdbo.net',
  },
  {
    id: 'bdcho',
    title: 'বাংলাদেশ কেমিস্ট্রি অলিম্পিয়াড (BdChO)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'বাংলাদেশ রসায়ন সমিতি ও ঢাকা বিশ্ববিদ্যালয় রসায়ন বিভাগ',
    audience: 'একাদশ ও দ্বাদশ শ্রেণির বিজ্ঞান বিভাগের শিক্ষার্থী',
    seasonSchedule: 'প্রাথমিক ও জাতীয় পর্ব: নভেম্বর – জানুয়ারি',
    benefits: 'আন্তর্জাতিক রসায়ন অলিম্পিয়াড (IChO)-এর জন্য নির্বাচিত হয়ে ল্যাব ও তাত্ত্বিক রসায়নে বিশ্বমঞ্চে প্রতিযোগিতা।',
    officialPortal: 'bcs.org.bd',
  },
  {
    id: 'bdoi',
    title: 'বাংলাদেশ ইনফরমেটিক্স অলিম্পিয়াড (BdOI)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'বাংলাদেশ ইনফরমেটিক্স অলিম্পিয়াড ও তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
    audience: 'স্কুল ও কলেজ পর্যায়ের প্রোগ্রামিং আগ্রহী শিক্ষার্থী',
    seasonSchedule: 'জাতীয় বাছাই ও ক্যাম্প: মার্চ – মে',
    benefits: 'সি/সি++ অ্যালগরিদম দক্ষতা এবং আন্তর্জাতিক ইনফরমেটিক্স অলিম্পিয়াডে (IOI) অংশগ্রহণের সুযোগ।',
    officialPortal: 'bdoi.org',
  },
  {
    id: 'robot-olympiad',
    title: 'বাংলাদেশ রোবট অলিম্পিয়াড (BdRO)',
    category: 'স্কিল ও প্রতিযোগিতা',
    organizer: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ ও ঢাকা বিশ্ববিদ্যালয় রোবটিক্স বিভাগ',
    audience: '৭ থেকে ১৮ বছর বয়সী শিক্ষার্থী',
    seasonSchedule: 'আবেদন ও জাতীয় পর্ব: জুলাই – সেপ্টেম্বর',
    benefits: 'আন্তর্জাতিক রোবট অলিম্পিয়াডে (IRO) বাংলাদেশের প্রতিনিধিত্ব ও হাতে-কলমে রোবটিক্স/মেকাট্রনিক্স অভিজ্ঞতা।',
    officialPortal: 'bdro.org',
  },
  {
    id: 'nmst-science-fair',
    title: 'জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহ ও বিজ্ঞান মেলা (NMST)',
    category: 'অলিম্পিয়াড ও বিজ্ঞান',
    organizer: 'জাতীয় বিজ্ঞান ও প্রযুক্তি জাদুঘর (NMST), বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয়',
    audience: 'উপজেলা, জেলা ও জাতীয় পর্যায়ের স্কুল ও কলেজ শিক্ষার্থী',
    seasonSchedule: 'প্রতি বছর মার্চ – জুন (উপজেলা ও জেলা প্রশাসন কর্তৃক ঘোষিত)',
    benefits: 'উদ্ভাবনী বৈজ্ঞানিক প্রজেক্ট প্রদর্শন, বিজ্ঞান অলিম্পিয়াড ও কুইজ প্রতিযোগিতায় সরকারি পদক ও অনুদান।',
    officialPortal: 'nmst.gov.bd',
  },
  {
    id: 'nasa-space-apps-bd',
    title: 'নাসা স্পেস অ্যাপস চ্যালেঞ্জ বাংলাদেশ (NASA Space Apps)',
    category: 'স্কিল ও প্রতিযোগিতা',
    organizer: 'বেসিস (BASIS) ও বেসিস স্টুডেন্টস ফোরাম',
    audience: 'কলেজ ও বিশ্ববিদ্যালয়ের কোডার, বিজ্ঞানী, ডিজাইনার ও স্টোরিটেলার',
    seasonSchedule: 'প্রতি বছর সেপ্টেম্বর – অক্টোবর (বৈশ্বিক হ্যাকাথন)',
    benefits: 'মহাকাশ ও পৃথিবী বিষয়ক ডাটা ব্যবহার করে সমাধান উদ্ভাবন ও বিশ্ব চ্যাম্পিয়ন হয়ে নাসা সদরদপ্তর পরিদর্শনের সুযোগ।',
    officialPortal: 'spaceappschallenge.org',
  },
  {
    id: 'harvard-cs50',
    title: 'হার্ভার্ড বিশ্ববিদ্যালয়ের ফ্রি CS50 কম্পিউটার সায়েন্স কোর্স',
    category: 'বিশ্বমানের ফ্রি কোর্স',
    organizer: 'Harvard University (edX / CS50.harvard.edu)',
    audience: 'এইচএসসি ও বিশ্ববিদ্যালয় পর্যায়ের সকল শিক্ষার্থী',
    seasonSchedule: 'সারা বছর উন্মুক্ত (নিজের গতিতে সম্পন্নযোগ্য)',
    benefits: 'C, Python, SQL ও Web প্রোগ্রামিংয়ের বিশ্বমানের সম্পূর্ণ ফ্রি লেকচার ও ফ্রি হার্ভার্ড সনদ।',
    officialPortal: 'cs50.harvard.edu/x',
  },
  {
    id: 'google-certificates',
    title: 'গুগল ক্যারিয়ার সার্টিফিকেটস ও এআই এসেনশিয়ালস',
    category: 'বিশ্বমানের ফ্রি কোর্স',
    organizer: 'Google / Coursera (আর্থিক সহায়তা সুবিধাসহ)',
    audience: 'বাংলাদেশের কলেজ ও বিশ্ববিদ্যালয় শিক্ষার্থী',
    seasonSchedule: 'সারা বছর আবেদনযোগ্য (Financial Aid সহ)',
    benefits: 'Data Analytics, Cybersecurity, UX Design ও IT Support-এ আন্তর্জাতিক ইন্ডাস্ট্রি স্বীকৃত দক্ষতা অর্জন।',
    officialPortal: 'grow.google/certificates',
  },
];

export const OpportunityRadarPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = OPPORTUNITIES.filter(
    (item) => categoryFilter === 'all' || item.category === categoryFilter
  );

  return (
    <ToolPageLayout
      toolNumber="২০"
      toolName="সুযোগ ও বৃত্তি রাডার"
      categoryLabel="ব্যক্তিগত উন্নয়ন"
      iconName="Radar"
      accentColor="#EF4444"
      description="বাংলাদেশের জাতীয় গণিত, পদার্থ, জীববিজ্ঞান, রসায়ন ও ইনফরমেটিক্স অলিম্পিয়াড, রোবট অলিম্পিয়াড, এনএমএসটি বিজ্ঞান মেলা এবং বিশ্বমানের ফ্রি প্রোগ্রামসমূহের নির্ভরযোগ্য তালিকা।"
    >
      <div className="space-y-6">
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {['all', 'অলিম্পিয়াড ও বিজ্ঞান', 'স্কিল ও প্রতিযোগিতা', 'বিশ্বমানের ফ্রি কোর্স'].map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer border ${
                    active
                      ? isDark
                        ? 'bg-rose-500/20 border-rose-500/50 text-white'
                        : 'bg-rose-600 border-rose-600 text-white'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'all' ? 'সকল সুযোগ' : cat}
                </button>
              );
            })}
          </div>

          <span className={`text-xs font-heading font-semibold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            মোট প্রোগ্রাম: {filtered.length}টি
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {item.category}
                  </span>

                  <span
                    className={`text-[11px] font-latin font-bold px-2 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-sky-300'
                        : 'bg-sky-50 border-sky-200 text-sky-800'
                    }`}
                  >
                    {item.officialPortal}
                  </span>
                </div>

                <h3 className={`font-heading font-bold text-base sm:text-lg mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>

                <p className={`text-xs font-heading flex items-center gap-1.5 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>আয়োজক: {item.organizer}</span>
                </p>

                <div
                  className={`p-3 rounded-xl border text-xs font-heading mb-3 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`font-bold flex items-center gap-1.5 mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>অংশগ্রহণের সুবিধা ও গুরুত্ব:</span>
                  </span>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {item.benefits}
                  </p>
                </div>

                <p className={`text-[11px] font-heading ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>যোগ্য শিক্ষার্থী:</strong> {item.audience}
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t flex items-center gap-2 text-xs font-heading ${
                  isDark ? 'border-white/10 text-amber-300' : 'border-slate-200 text-amber-900'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{item.seasonSchedule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};
