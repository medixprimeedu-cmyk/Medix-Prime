import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Layers, RotateCcw, Copy, Check } from 'lucide-react';

interface Recommendation {
  group: string;
  recommendedSubjects: string[];
  fourthSubjectSuggestion: string;
  eligibleUniversities: string[];
  prerequisites: string[];
  rationale: string;
}

export const SubjectCombinationAdvisorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [academicGroup, setAcademicGroup] = useState<'science' | 'humanities' | 'business'>('science');
  const [interestArea, setInterestArea] = useState<string>('medical');
  const [mathAptitude, setMathAptitude] = useState<'high' | 'medium' | 'low'>('high');

  const [advice, setAdvice] = useState<Recommendation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAdvise = (e: React.FormEvent) => {
    e.preventDefault();

    let rec: Recommendation;

    if (academicGroup === 'science') {
      if (interestArea === 'medical') {
        rec = {
          group: 'বিজ্ঞান বিভাগ — মেডিকেল ও স্বাস্থ্যবিজ্ঞান লক্ষ্য',
          recommendedSubjects: ['বাংলা ও ইংরেজি', 'আইসিটি', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান'],
          fourthSubjectSuggestion:
            mathAptitude === 'high'
              ? 'উচ্চতর গণিত (৪র্থ বিষয় হিসেবে রাখলে মেডিকেল ছাড়াও ঢাবি ‘ক’, জিএসটি ও কৃষি গুচ্ছে পূর্ণ সুযোগ থাকবে)'
              : 'কৃষিশিক্ষা বা মনোবিজ্ঞান (বোর্ড জিপিএ ৫.০০ সহজে নিশ্চিত করার জন্য)',
          eligibleUniversities: [
            '৩৭টি সরকারি মেডিকেল ও ৬৭টি বেসরকারি মেডিকেল (DGME)',
            'AFMC ও ৫টি আর্মি মেডিকেল কলেজ',
            'ঢাকা ডেন্টাল কলেজ ও সরকারি ডেন্টাল ইউনিটসমূহ (BDS)',
            'কৃষি গুচ্ছের ৯টি বিশ্ববিদ্যালয় (BAU, SAU, GAU, CVASU)',
            'ঢাকা, রাজশাহী, চট্টগ্রাম, জাহাঙ্গীরনগর ও জিএসটি গুচ্ছের জীববিজ্ঞান ও ফার্মাসি অনুষদ',
          ],
          prerequisites: [
            'মেডিকেল ও ডেন্টাল পরীক্ষায় আবেদনের জন্য এসএসসি ও এইচএসসি মিলিয়ে জিপিএ ৯.০০ এবং এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০ (A গ্রেড) বাধ্যতামূলক।',
          ],
          rationale:
            'জীববিজ্ঞানকে মূল নৈর্বাচনিক বিষয় হিসেবে রাখলে মেডিকেল, ডেন্টাল, কৃষি ও ফার্মাসি সব শাখার দুয়ার খোলা থাকে।',
        };
      } else if (interestArea === 'engineering') {
        rec = {
          group: 'বিজ্ঞান বিভাগ — প্রকৌশল ও প্রযুক্তি লক্ষ্য',
          recommendedSubjects: ['বাংলা ও ইংরেজি', 'আইসিটি', 'পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত'],
          fourthSubjectSuggestion:
            'জীববিজ্ঞান (৪র্থ বিষয় হিসেবে নিলে পাশাপাশি মেডিকেল, ফার্মাসি ও কৃষি গুচ্ছেও পরীক্ষার সুযোগ থাকে)',
          eligibleUniversities: [
            'বুয়েট (BUET)',
            'কুয়েট (KUET), রুয়েট (RUET), চুয়েট (CUET)',
            'MIST, IUT, BUTEX ও ঢাকা প্রকৌশল বিশ্ববিদ্যালয় (প্রযোজ্য ক্ষেত্রে)',
            'SUST, ঢাবি, রাবি, চবি, জাবি ও জিএসটি গুচ্ছের ইঞ্জিনিয়ারিং/বিজ্ঞান অনুষদ',
            'NSU, BRACU, AUST, AIUB, UIU, DIU প্রকৌশল অনুষদ',
          ],
          prerequisites: [
            'বুয়েট ও প্রকৌশল গুচ্ছের জন্য পদার্থ, রসায়ন ও উচ্চতর গণিতে জিপি ৫.০০ (A+) এবং সম্মিলিত উচ্চ নম্বর থাকা প্রয়োজন।',
          ],
          rationale:
            'উচ্চতর গণিত মূল বিষয় এবং জীববিজ্ঞান ৪র্থ বিষয় হিসেবে রাখা বাংলাদেশের বিজ্ঞান শিক্ষার্থীদের জন্য সবচেয়ে ভারসাম্যপূর্ণ কম্বিনেশন।',
        };
      } else {
        rec = {
          group: 'বিজ্ঞান বিভাগ — সমন্বিত বিশ্ববিদ্যালয় ও গবেষণা লক্ষ্য',
          recommendedSubjects: ['বাংলা ও ইংরেজি', 'আইসিটি', 'পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত / জীববিজ্ঞান'],
          fourthSubjectSuggestion: 'জীববিজ্ঞান অথবা পরিসংখ্যান / কৃষিশিক্ষা',
          eligibleUniversities: [
            'ঢাকা, রাজশাহী, চট্টগ্রাম, জাহাঙ্গীরনগর, জগন্নাথ, খুলনা ও বিইউপি',
            'জিএসটি (GST) গুচ্ছভুক্ত ২৪টি সাধারণ ও প্রযুক্তি বিশ্ববিদ্যালয়',
            'কৃষি গুচ্ছ (ACAS) ৯টি বিশ্ববিদ্যালয় ও ঢাবির ৭টি কলেজ',
            'জাতীয় বিশ্ববিদ্যালয় ও অনুমোদিত সকল বেসরকারি বিশ্ববিদ্যালয়',
          ],
          prerequisites: [
            'অধিকাংশ পাবলিক বিশ্ববিদ্যালয়ের বিজ্ঞান ইউনিটে মোট জিপিএ ৭.৫০ থেকে ৮.৫০ প্রয়োজন।',
          ],
          rationale:
            'এই কম্বিনেশন সাধারণ বিজ্ঞান, বায়োটেকনোলজি, ডেটা সায়েন্স, আইবিএ এবং বিবিএ—সব শাখায় ভর্তির সুযোগ দেয়।',
        };
      }
    } else if (academicGroup === 'business') {
      rec = {
        group: 'ব্যবসায় শিক্ষা বিভাগ',
        recommendedSubjects: ['বাংলা ও ইংরেজি', 'আইসিটি', 'হিসাববিজ্ঞান', 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', 'ফিন্যান্স, ব্যাংকিং ও বিমা'],
        fourthSubjectSuggestion: 'অর্থনীতি অথবা পরিসংখ্যান (আইবিএ, অর্থনীতি ও বিবিএ ভর্তিতে সহায়ক)',
        eligibleUniversities: [
          'ঢাকা বিশ্ববিদ্যালয় ব্যবসায় শিক্ষা ইউনিট (FBS) ও আইবিএ (IBA)',
          'রাবি, চবি, জাবি, বিইউপি ও জিএসটি গুচ্ছ ‘C’ ইউনিট',
          'ঢাকার সরকারি ৭টি কলেজ ও জাতীয় বিশ্ববিদ্যালয় অনার্স',
          'NSU, BRACU, EWU, AIUB, IUB, DIU ও UIU বিবিএ প্রোগ্রাম',
        ],
        prerequisites: [
          'এইচএসসিতে হিসাববিজ্ঞান থাকা বিশ্ববিদ্যালয়ের বাণিজ্য ইউনিটের জন্য অত্যন্ত জরুরি; আইবিএ-তে ইংরেজি ও গণিত দক্ষতা আবশ্যক।',
        ],
        rationale:
          'হিসাববিজ্ঞান, ফিন্যান্স এবং অর্থনীতির সমন্বয় বিবিএ, চার্টার্ড অ্যাকাউন্ট্যান্সি (CA) ও ব্যাংকিং ক্যারিয়ারের ভিত্তি গড়ে দেয়।',
      };
    } else {
      rec = {
        group: 'মানবিক বিভাগ',
        recommendedSubjects: ['বাংলা ও ইংরেজি', 'আইসিটি', 'অর্থনীতি', 'পৌরনীতি ও সুশাসন', 'যুক্তিবিদ্যা / ইতিহাস'],
        fourthSubjectSuggestion: 'ইসলামের ইতিহাস ও সংস্কৃতি / সমাজবিজ্ঞান / ভূগোল',
        eligibleUniversities: [
          'ঢাকা বিশ্ববিদ্যালয় কলা, আইন ও সামাজিক বিজ্ঞান ইউনিট',
          'রাবি, চবি, জাবি, বিইউপি ও জিএসটি গুচ্ছ ‘B’ ইউনিট',
          'সরকারি ৭টি কলেজ ও জাতীয় বিশ্ববিদ্যালয় (রাবি/ঢাকা/দেশসেরা সরকারি কলেজ)',
          'বেসরকারি বিশ্ববিদ্যালয়ের আইন (LLB), ইংরেজি ও মিডিয়া স্টাডিজ',
        ],
        prerequisites: [
          'আইন ও আন্তর্জাতিক সম্পর্ক বিষয়ের জন্য এইচএসসি বাংলা ও ইংরেজিতে ভালো গ্রেড থাকা আবশ্যক।',
        ],
        rationale:
          'অর্থনীতি ও পৌরনীতির জ্ঞান বিশ্ববিদ্যালয়ের কলা-সামাজিক বিজ্ঞান ভর্তি এবং ভবিষ্যৎ বিসিএস/জুডিশিয়াল প্রস্তুতিতে সহায়ক।',
      };
    }

    setAdvice(rec);
  };

  const handleReset = () => {
    setAcademicGroup('science');
    setInterestArea('medical');
    setMathAptitude('high');
    setAdvice(null);
  };

  const handleCopy = () => {
    if (!advice) return;
    const text = `MEDIX PRIME বিষয় নির্বাচন পরামর্শ:\nবিভাগ: ${advice.group}\nমূল বিষয়: ${advice.recommendedSubjects.join(', ')}\n৪র্থ বিষয়: ${advice.fourthSubjectSuggestion}\nলক্ষ্য বিশ্ববিদ্যালয়: ${advice.eligibleUniversities.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectClass = `w-full px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
    isDark
      ? 'bg-[#060D17] border-white/20 text-white focus:border-amber-400'
      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
  }`;

  return (
    <ToolPageLayout
      toolNumber="০৪"
      toolName="বিষয় কম্বিনেশন পরামর্শক"
      categoryLabel="একাডেমিক সরঞ্জাম"
      iconName="Layers"
      accentColor="#FBBF24"
      description="জাতীয় শিক্ষাক্রম অনুযায়ী আপনার বিভাগ ও লক্ষ্য অনুযায়ী কোন মূল ও ৪র্থ বিষয় নিলে মেডিকেল, প্রকৌশল, ঢাবি, রাবি, চবি, জাবি, গুচ্ছ, কৃষি ও বেসরকারি বিশ্ববিদ্যালয়ে আবেদনের পূর্ণ সুযোগ থাকবে তা জানুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <h2 className={`font-heading font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
            শিক্ষা বিভাগ ও লক্ষ্য নির্বাচন
          </h2>
          <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            কলেজ ও বোর্ড রেজিস্ট্রেশনের জন্য সঠিক বিষয় তালিকা
          </p>

          <form onSubmit={handleAdvise} className="space-y-4">
            <div>
              <label className="text-xs font-heading font-bold block mb-1">১. পড়াশোনার বিভাগ</label>
              <select
                value={academicGroup}
                onChange={(e) => setAcademicGroup(e.target.value as any)}
                className={selectClass}
              >
                <option value="science">বিজ্ঞান বিভাগ</option>
                <option value="humanities">মানবিক বিভাগ</option>
                <option value="business">ব্যবসায় শিক্ষা বিভাগ</option>
              </select>
            </div>

            {academicGroup === 'science' && (
              <div>
                <label className="text-xs font-heading font-bold block mb-1">২. প্রধান উচ্চশিক্ষা লক্ষ্য</label>
                <select value={interestArea} onChange={(e) => setInterestArea(e.target.value)} className={selectClass}>
                  <option value="medical">মেডিকেল ও ডেন্টাল</option>
                  <option value="engineering">বুয়েট, কুয়েট, রুয়েট, চুয়েট ও প্রকৌশল</option>
                  <option value="general_science">পাবলিক বিশ্ববিদ্যালয়, ফার্মাসি ও গবেষণা</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-heading font-bold block mb-1">৩. গণিতে দক্ষতা</label>
              <select value={mathAptitude} onChange={(e) => setMathAptitude(e.target.value as any)} className={selectClass}>
                <option value="high">উচ্চ (গাণিতিক সমস্যা সহজে সমাধান করতে পারি)</option>
                <option value="medium">মাঝারি (চর্চা করলে ভালো করা যায়)</option>
                <option value="low">সাধারণ (জীববিজ্ঞান বা তত্ত্বীয় বিষয়ে বেশি আগ্রহ)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 gap-3">
              <button
                type="button"
                onClick={handleReset}
                className={`px-4 py-2.5 rounded-xl border text-xs font-heading font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isDark ? 'border-white/15 hover:bg-white/5 text-gray-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>

              <button
                type="submit"
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>পরামর্শ দেখুন</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className={`font-heading font-bold text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              সুপারিশকৃত বিষয় কম্বিনেশন ও বিশ্ববিদ্যালয়ের সুযোগ
            </h3>

            {advice ? (
              <div className="space-y-4 text-xs font-heading">
                <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">
                    মূল বিষয়সমূহ:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {advice.recommendedSubjects.map((s, i) => (
                      <span
                        key={i}
                        className={`px-2.5 py-1 rounded-lg font-bold border ${
                          isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-white border-amber-200 text-slate-900'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className="font-bold text-amber-600 dark:text-amber-400 block pt-1">
                    ৪র্থ বিষয় পরামর্শ:
                  </span>
                  <p className={`font-semibold ${isDark ? 'text-amber-200' : 'text-slate-800'}`}>{advice.fourthSubjectSuggestion}</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    আবেদনযোগ্য বাংলাদেশি বিশ্ববিদ্যালয় ও প্রতিষ্ঠানসমূহ:
                  </span>
                  <ul className="space-y-1 pt-1">
                    {advice.eligibleUniversities.map((u, idx) => (
                      <li key={idx} className={isDark ? 'text-sky-300' : 'text-[#006B98] font-medium'}>
                        • {u}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>ভর্তি পূর্বশর্ত ও বিশ্লেষণ:</span>
                  {advice.prerequisites.map((p, idx) => (
                    <p key={idx} className={isDark ? 'text-slate-300' : 'text-slate-600'}>• {p}</p>
                  ))}
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>• {advice.rationale}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'border-white/15 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">পরামর্শ কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>পরামর্শ কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <p className={`font-heading text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  আপনার বিভাগ ও লক্ষ্য সিলেক্ট করে পরামর্শ বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
