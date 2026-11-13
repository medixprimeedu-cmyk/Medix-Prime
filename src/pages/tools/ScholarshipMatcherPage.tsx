import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Sparkles, CheckCircle2, Globe, Award } from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  country: string;
  scope: 'national' | 'international';
  level: string;
  minGpa: number;
  benefits: string;
  fundingType: 'সম্পূর্ণ অর্থায়ন' | 'আংশিক বা টিউশন ওয়েভার';
  cycle: string;
  eligibilityNote: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'board-merit',
    name: 'বাংলাদেশ শিক্ষা বোর্ড মেধাবৃত্তি (ট্যালেন্টপুল ও সাধারণ)',
    country: 'বাংলাদেশ (সকল শিক্ষা বোর্ড)',
    scope: 'national',
    level: 'এসএসসি, এইচএসসি ও স্নাতক',
    minGpa: 4.8,
    benefits: 'বিনা বেতনে অধ্যয়ন + মাসিক নির্ধারিত বৃত্তি ও এককালীন বই-পত্র অনুদান (বিভাগীয় বোর্ডের ফলাফলের ওপর ভিত্তি করে)',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'বোর্ড পরীক্ষার ফলাফল প্রকাশের পর প্রতি বছর গেজেট',
    eligibilityNote: 'নিজ শিক্ষা বোর্ডে শীর্ষ মেধাক্রম ও গোল্ডেন/সর্বোচ্চ নম্বরপ্রাপ্ত শিক্ষার্থীরা স্বয়ংক্রিয়ভাবে মনোনীত হয়।',
  },
  {
    id: 'dbbl-scholarship',
    name: 'ডাচ-বাংলা ব্যাংক (DBBL) শিক্ষাবৃত্তি',
    country: 'বাংলাদেশ',
    scope: 'national',
    level: 'এইচএসসি ও স্নাতক (মেডিকেল, প্রকৌশল ও বিশ্ববিদ্যালয়)',
    minGpa: 4.75,
    benefits: 'মাসিক নির্ধারিত আর্থিক অনুদান (৳২,৫০০ – ৳৩,৫০০+) + পাঠ্যবই ও পোশাকের জন্য বাৎসরিক ভাতা',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'এসএসসি ও এইচএসসি ফল প্রকাশের ১–২ মাসের মধ্যে অনলাইন আবেদন',
    eligibilityNote: 'অসচ্ছল ও মেধাবী শিক্ষার্থীরা (বিশেষত গ্রামাঞ্চল ও উচ্চ জিপিএধারী) অগ্রাধিকার পান।',
  },
  {
    id: 'pm-education-trust',
    name: 'প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্ট উপবৃত্তি ও ভর্তি সহায়তা',
    country: 'বাংলাদেশ',
    scope: 'national',
    level: 'স্নাতক (পাস/সম্মান) ও মেডিকেল/প্রকৌশল/পাবলিক',
    minGpa: 3.5,
    benefits: 'এককালীন ভর্তি সহায়তা (৳৫,০০০ – ৳১০,০০০) ও বাৎসরিক উপবৃত্তি',
    fundingType: 'আংশিক বা টিউশন ওয়েভার',
    cycle: 'প্রতি শিক্ষাবর্ষে অনলাইন (e-stipend) আবেদন',
    eligibilityNote: 'সকল সরকারি, স্বায়ত্তশাসিত এবং জাতীয় বিশ্ববিদ্যালয় অধিভুক্ত প্রতিষ্ঠানের আর্থিক সহায়তা-প্রত্যাশী শিক্ষার্থীরা আবেদনযোগ্য।',
  },
  {
    id: 'private-univ-merit',
    name: 'বাংলাদেশের শীর্ষ বেসরকারি বিশ্ববিদ্যালয় মেধা ওয়েভার (NSU, BRACU, EWU, AIUB, UIU, DIU, AUST)',
    country: 'বাংলাদেশ',
    scope: 'national',
    level: 'স্নাতক (অনার্স / বিএসসি / বিবিএ / বি.ফার্ম)',
    minGpa: 4.5,
    benefits: 'গোল্ডেন জিপিএ ৫.০০, এসএসসি+এইচএসসি ১০.০০ বা ভর্তি পরীক্ষায় শীর্ষ অবস্থানের ভিত্তিতে ২৫% থেকে ১০০% টিউশন ফি মওকুফ',
    fundingType: 'আংশিক বা টিউশন ওয়েভার',
    cycle: 'প্রতি সেমিস্টার (Spring, Summer, Fall)',
    eligibilityNote: 'বিনামূল্যে অধ্যয়নের পাশাপাশি মুক্তিযোদ্ধা কোটা ও সিজিপিএ-ভিত্তিক পরবর্তী সেমিস্টার বৃত্তিও চালু থাকে।',
  },
  {
    id: 'turkiye-burslari',
    name: 'তুরস্ক সরকারি বৃত্তি (Türkiye Bursları)',
    country: 'তুরস্ক',
    scope: 'international',
    level: 'স্নাতক, স্নাতকোত্তর ও পিএইচডি',
    minGpa: 3.5,
    benefits: '১০০% টিউশন ফি, রাউন্ড-ট্রিপ বিমান টিকিট, বিনামূল্যে আবাসন, স্বাস্থ্য বিমা, ১ বছরের তুর্কি ভাষা কোর্স ও মাসিক ভাতা',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'প্রতি বছর ১০ জানুয়ারি – ২০ ফেব্রুয়ারি',
    eligibilityNote: 'মেডিকেল ও ইঞ্জিনিয়ারিংয়ের জন্য ন্যূনতম ৯০% এবং অন্যান্য বিষয়ে ৭০%+ নম্বর প্রয়োজন।',
  },
  {
    id: 'mext-japan',
    name: 'জাপান সরকারি মেক্সট বৃত্তি (MEXT Scholarship)',
    country: 'জাপান',
    scope: 'international',
    level: 'স্নাতক ও গবেষণা (স্নাতকোত্তর/পিএইচডি)',
    minGpa: 4.2,
    benefits: 'সম্পূর্ণ টিউশন ফি, মাসিক জীবনযাপন ভাতা (~¥১১৭,০০০ – ¥১৪৫,০০০), বিমান টিকিট ও ভিসা সহায়তা',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'প্রতি বছর মে – জুন (বাংলাদেশ শিক্ষা মন্ত্রণালয় ও জাপান দূতাবাস)',
    eligibilityNote: 'দূতাবাস ও বিশ্ববিদ্যালয়ের লিখিত পরীক্ষা ও সাক্ষাৎকারের মাধ্যমে চূড়ান্ত নির্বাচন।',
  },
  {
    id: 'stipendium-hungaricum',
    name: 'হাঙ্গেরি সরকারি বৃত্তি (Stipendium Hungaricum)',
    country: 'হাঙ্গেরি',
    scope: 'international',
    level: 'স্নাতক, স্নাতকোত্তর ও পিএইচডি',
    minGpa: 4.0,
    benefits: 'সম্পূর্ণ টিউশন ফি মওকুফ, ডরমিটরি আবাসন ভাতা, স্বাস্থ্য বিমা ও মাসিক অনুদান (বাংলাদেশ শিক্ষা মন্ত্রণালয়ের মাধ্যমে মনোনয়ন)',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'প্রতি বছর নভেম্বর – জানুয়ারি',
    eligibilityNote: 'IELTS বা বিশ্ববিদ্যালয়ের ইংরেজি দক্ষতা সনদ ও শিক্ষা মন্ত্রণালয়ের (MoE) অনলাইন পোর্টালে আবেদন আবশ্যক।',
  },
  {
    id: 'gks-korea',
    name: 'দক্ষিণ কোরিয়া সরকারি বৃত্তি (GKS / KGSP)',
    country: 'দক্ষিণ কোরিয়া',
    scope: 'international',
    level: 'স্নাতক ও স্নাতকোত্তর',
    minGpa: 4.0,
    benefits: 'সম্পূর্ণ টিউশন ফি, বিমান ভাড়া, ১ বছরের কোরিয়ান ভাষা প্রশিক্ষণ, মাসিক ভাতা ও গবেষণা অনুদান',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'স্নাতক: সেপ্টেম্বর–অক্টোবর | স্নাতকোত্তর: ফেব্রুয়ারি–মার্চ',
    eligibilityNote: 'এমব্যাসি ট্র্যাক ও ইউনিভার্সিটি ট্র্যাক—উভয় মাধ্যমেই বাংলাদেশি শিক্ষার্থীরা আবেদন করতে পারেন।',
  },
  {
    id: 'csc-china',
    name: 'চায়নিজ গভর্নমেন্ট স্কলারশিপ (CSC)',
    country: 'চীন',
    scope: 'international',
    level: 'স্নাতক ও স্নাতকোত্তর',
    minGpa: 3.7,
    benefits: 'টিউশন ফি মওকুফ, বিনামূল্যে ক্যাম্পাস হোস্টেল, চিকিৎসা বিমা ও মাসিক জীবনযাপন ভাতা',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'প্রতি বছর জানুয়ারি – মার্চ',
    eligibilityNote: 'ইঞ্জিনিয়ারিং, মেডিকেল ও প্রযুক্তিসংশ্লিষ্ট বিষয়ে ব্যাপক আসন ও বাংলাদেশ দূতাবাসের মাধ্যমে মনোনয়ন।',
  },
  {
    id: 'iccr-india',
    name: 'আইসিসিআর ভারত সরকারি বৃত্তি (ICCR Scholarship)',
    country: 'ভারত',
    scope: 'international',
    level: 'স্নাতক ও স্নাতকোত্তর',
    minGpa: 3.5,
    benefits: 'সম্পূর্ণ টিউশন ফি, হোস্টেল আবাসন, মাসিক বৃত্তি ও বিমান ভাড়া',
    fundingType: 'সম্পূর্ণ অর্থায়ন',
    cycle: 'প্রতি বছর মার্চ – এপ্রিল (ঢাকাস্থ ভারতীয় হাইকমিশন)',
    eligibilityNote: 'ইঞ্জিনিয়ারিং, বিজ্ঞান, মানবিক ও বাণিজ্যে ভারতের শীর্ষ সরকারি বিশ্ববিদ্যালয়ে পড়ার সুযোগ।',
  },
];

const toBn = (n: number): string =>
  n.toFixed(2).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const ScholarshipMatcherPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [gpa, setGpa] = useState<string>('4.80');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'national' | 'international'>('all');
  const [fundingFilter, setFundingFilter] = useState<string>('all');

  const userGpa = Math.min(5, Math.max(0, parseFloat(gpa) || 0));

  const matches = useMemo(() => {
    return SCHOLARSHIPS.filter((s) => {
      const meetsGpa = userGpa >= s.minGpa;
      const matchesScope = scopeFilter === 'all' || s.scope === scopeFilter;
      const matchesFund = fundingFilter === 'all' || s.fundingType === fundingFilter;
      return meetsGpa && matchesScope && matchesFund;
    });
  }, [userGpa, scopeFilter, fundingFilter]);

  return (
    <ToolPageLayout
      toolNumber="১৫"
      toolName="স্কলারশিপ ম্যাচিং টুল"
      categoryLabel="বিশ্ববিদ্যালয় সরঞ্জাম"
      iconName="Sparkles"
      accentColor="#8B5CF6"
      description="আপনার জিপিএ অনুযায়ী বাংলাদেশের সরকারি বোর্ড বৃত্তি, ডাচ-বাংলা, প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্ট, বেসরকারি বিশ্ববিদ্যালয় ওয়েভার এবং আন্তর্জাতিক সরকারি বৃত্তি খুঁজুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                আপনার এসএসসি / এইচএসসি জিপিএ (৫.০০-এর মধ্যে):
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                বৃত্তির পরিধি:
              </label>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value as typeof scopeFilter)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="all">সকল দেশি ও বিদেশি বৃত্তি</option>
                <option value="national">শুধুমাত্র বাংলাদেশ (দেশীয় বৃত্তি ও ওয়েভার)</option>
                <option value="international">শুধুমাত্র আন্তর্জাতিক (সরকারি ফুল-ফান্ড)</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                অর্থায়নের ধরন:
              </label>
              <select
                value={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="all">সব ধরনের অর্থায়ন</option>
                <option value="সম্পূর্ণ অর্থায়ন">সম্পূর্ণ অর্থায়ন (Full Funding)</option>
                <option value="আংশিক বা টিউশন ওয়েভার">আংশিক বৃত্তি ও টিউশন ওয়েভার</option>
              </select>
            </div>
          </div>

          <p className={`text-xs font-heading mt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            মিল পাওয়া গেছে: <strong className={isDark ? 'text-purple-300' : 'text-purple-800'}>{matches.length}টি</strong> বৃত্তি সুযোগ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((sch) => (
            <div
              key={sch.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full border ${
                      sch.scope === 'national'
                        ? isDark
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDark
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        : 'bg-purple-50 border-purple-200 text-purple-800'
                    }`}
                  >
                    {sch.scope === 'national' ? <Award className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    <span>{sch.country}</span>
                  </span>

                  <span
                    className={`text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                        : 'bg-sky-50 border-sky-200 text-sky-800'
                    }`}
                  >
                    {sch.fundingType}
                  </span>
                </div>

                <h3 className={`font-heading font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {sch.name}
                </h3>
                <p className={`text-[11px] font-heading mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  পর্যায়: {sch.level} | ন্যূনতম জিপিএ: {toBn(sch.minGpa)}
                </p>

                <div
                  className={`p-3 rounded-xl border text-xs font-heading mb-3 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`font-bold block mb-0.5 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                    সুবিধা ও আর্থিক সহায়তা:
                  </span>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {sch.benefits}
                  </p>
                </div>

                <p className={`text-[11px] font-heading leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>যোগ্যতা নোট:</strong> {sch.eligibilityNote}
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-heading ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>আবেদনের সময়:</span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                  {sch.cycle}
                </span>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div
              className={`md:col-span-2 p-8 text-center rounded-2xl border font-heading text-sm ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              আপনার প্রদত্ত জিপিএ এবং ফিল্টার অনুযায়ী কোনো বৃত্তি পাওয়া যায়নি। জিপিএ বা ফিল্টার পরিবর্তন করে পুনরায় দেখুন।
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};
