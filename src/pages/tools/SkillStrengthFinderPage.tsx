import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Award, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';

const toBn = (n: number): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const SkillStrengthFinderPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [q1, setQ1] = useState<number>(8);
  const [q2, setQ2] = useState<number>(8);
  const [q3, setQ3] = useState<number>(7);
  const [q4, setQ4] = useState<number>(6);
  const [q5, setQ5] = useState<number>(7);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const categories = [
      {
        id: 'analytical',
        name: 'বিশ্লেষণী ও বৈজ্ঞানিক দক্ষতা',
        score: Math.round((q1 + q3 * 0.4) / 1.4),
        careers: [
          'এমবিবিএস / বিডিএস চিকিৎসক (ঢামেক সহ ৩৭টি সরকারি মেডিকেল ও এএফএমসি)',
          'ডাটা সায়েন্টিস্ট / সফটওয়্যার ইঞ্জিনিয়ার (বুয়েট, সিকেআরইউইটি, ঢাবি, সাস্ট, ব্র্যাক)',
          'ফার্মাসিস্ট ও মলিকুলার বায়োলজিস্ট (ঢাবি, জাবি, রাবি, এনএসইউ)',
        ],
      },
      {
        id: 'empathy',
        name: 'মানবিক সহমর্মিতা ও জনসেবা',
        score: q2,
        careers: [
          'ক্লিনিক্যাল চিকিৎসক ও পাবলিক হেলথ স্পেশালিস্ট',
          'বিসিএস ক্যাডার ও জনসেবা (ঢাবি, জাবি, রাবি, চবি, জবি, গুচ্ছ ও জাতীয় বিশ্ববিদ্যালয়)',
          'সাইকোলজিস্ট ও একাডেমিক মেন্টর',
        ],
      },
      {
        id: 'leadership',
        name: 'নেতৃত্ব ও কৌশলগত ব্যবস্থাপনা',
        score: Math.round((q4 + q5 * 0.35) / 1.35),
        careers: [
          'বিসিএস প্রশাসন / পররাষ্ট্র / পুলিশ ক্যাডার ও সরকারি নীতিনির্ধারণ',
          'চার্টার্ড অ্যাকাউন্ট্যান্ট (ICAB) ও কর্পোরেট ফিন্যান্স (ঢাবি IBA / ব্যবসায় অনুষদ)',
          'প্রজেক্ট লিড, আইটি ম্যানেজমেন্ট ও উদ্যোক্তা',
        ],
      },
      {
        id: 'creativity',
        name: 'সৃজনশীল উদ্ভাবন ও উপস্থাপন',
        score: Math.round((q3 + q5) / 2),
        careers: [
          'স্থাপত্য (Architecture — বুয়েট, চুয়েট, খুবি, অস্ট) ও প্রোডাক্ট ডিজাইন',
          'আইন ও মুট কোর্ট / বিচার বিভাগ (BJS ও বার কাউন্সিল)',
          'ডিজিটাল মার্কেটিং ও এডু-টেক কন্টেন্ট স্ট্র্যাটেজিস্ট',
        ],
      },
    ];

    const sorted = [...categories].sort((a, b) => b.score - a.score);
    const overallAverage = Math.round(((q1 + q2 + q3 + q4 + q5) / 5) * 10);
    return { sorted, topStrength: sorted[0], overallAverage };
  }, [q1, q2, q3, q4, q5]);

  const handleReset = () => {
    setQ1(8);
    setQ2(8);
    setQ3(7);
    setQ4(6);
    setQ5(7);
  };

  const handleCopy = () => {
    const text = `MEDIX PRIME — দক্ষতা ও শক্তি মূল্যায়ন\nসর্বোচ্চ সক্ষমতার ক্ষেত্র: ${results.topStrength.name} (${toBn(results.topStrength.score * 10)}%)\nসামগ্রিক স্কোর: ${toBn(results.overallAverage)}%\nপ্রস্তাবিত পেশা ও বিশ্ববিদ্যালয়:\n- ${results.topStrength.careers.join('\n- ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const questions = [
    {
      label: '১. গাণিতিক, বৈজ্ঞানিক ও জটিল যুক্তিভিত্তিক সমস্যা সমাধানে আপনার স্বাচ্ছন্দ্য কতটুকু?',
      val: q1,
      setter: setQ1,
    },
    {
      label: '২. মানুষের সেবা, সহমর্মিতা ও ধৈর্য ধরে অন্যকে সাহায্য করার প্রবণতা কেমন?',
      val: q2,
      setter: setQ2,
    },
    {
      label: '৩. গভীর পড়াশোনা, বিজ্ঞানভিত্তিক গবেষণা ও নতুন তথ্য উদঘাটনে আগ্রহ কতটুকু?',
      val: q3,
      setter: setQ3,
    },
    {
      label: '৪. দল পরিচালনা, দ্রুত সিদ্ধান্ত গ্রহণ ও দায়িত্ব কাঁধে নেওয়ার মানসিকতা কেমন?',
      val: q4,
      setter: setQ4,
    },
    {
      label: '৫. বাংলা ও ইংরেজিতে স্পষ্ট উপস্থাপনা, লেখালেখি এবং সৃজনশীল চিন্তাধারা কেমন?',
      val: q5,
      setter: setQ5,
    },
  ];

  return (
    <ToolPageLayout
      toolNumber="০৮"
      toolName="দক্ষতা ও শক্তি নির্দেশক"
      categoryLabel="ক্যারিয়ার সরঞ্জাম"
      iconName="Award"
      accentColor="#FB923C"
      description="আপনার সহজাত ৫টি মূল মানসিক ও বুদ্ধিবৃত্তিক শক্তির স্কেল মূল্যায়ন করে উপযুক্ত উচ্চশিক্ষা ও পেশাগত ক্ষেত্র নির্ণয় করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              আত্ম-মূল্যায়ন সূচক (১ থেকে ১০)
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className={`inline-flex items-center gap-1 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
          <p className={`text-xs mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            স্লাইডার সরিয়ে নিজের বাস্তব সক্ষমতা অনুযায়ী নম্বর দিন
          </p>

          <div className="space-y-5">
            {questions.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className={`text-xs font-heading font-bold leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {item.label}
                  </label>
                  <span
                    className={`font-heading font-black text-sm shrink-0 ${
                      isDark ? 'text-orange-400' : 'text-orange-700'
                    }`}
                  >
                    {toBn(item.val)} / ১০
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={item.val}
                  onChange={(e) => item.setter(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1526] to-[#201207] border-orange-500/30 shadow-[0_10px_30px_rgba(251,146,60,0.12)]'
                : 'bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-700'}`} />
                <span className={`text-xs font-heading font-bold ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>
                  আপনার প্রধান শক্তির ক্ষেত্র
                </span>
              </div>
              <span
                className={`text-xs font-heading font-bold px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-900'
                }`}
              >
                গড় সূচক: {toBn(results.overallAverage)}%
              </span>
            </div>

            <h3 className={`text-lg sm:text-xl font-heading font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {results.topStrength.name}
            </h3>
            <p className={`text-xs font-heading mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              এই সক্ষমতা অনুযায়ী বাংলাদেশের শীর্ষ শিক্ষা ও পেশাগত ক্ষেত্রসমূহ:
            </p>

            <div className="space-y-2 mb-4">
              {results.topStrength.careers.map((car, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 text-xs font-heading font-semibold p-2.5 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-white border-orange-200/80 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{car}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'border-white/15 text-slate-200 hover:bg-white/10'
                  : 'border-orange-300 text-orange-900 hover:bg-orange-100/60'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">মূল্যায়ন ফলাফল কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ফলাফল কপি করুন</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h4 className={`text-xs font-heading font-bold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              ৪টি দক্ষতা ক্যাটাগরির তুলনামূলক সূচক:
            </h4>
            <div className="space-y-3">
              {results.sorted.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-heading font-semibold">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{cat.name}</span>
                    <span className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                      {toBn(cat.score * 10)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${cat.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
