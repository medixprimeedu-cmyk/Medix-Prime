import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { TrendingUp, RotateCcw, Copy, Check } from 'lucide-react';

interface WeakSubject {
  name: string;
  currentMarks: number;
  targetMarks: number;
  priority: 'উচ্চ অগ্রাধিকার' | 'মাঝারি অগ্রাধিকার' | 'নিয়মিত রিভিশন';
  hoursNeededPerWeek: number;
  strategy: string;
}

const DEFAULT_SUBJECTS = 'পদার্থবিজ্ঞান: ৪৮\nউচ্চতর গণিত: ৫২\nরসায়ন: ৬৪\nইংরেজি: ৫৮';

function normalizeBanglaDigits(str: string): string {
  return str.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
}

export const ResultImprovementPlannerPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [subjectsText, setSubjectsText] = useState<string>(DEFAULT_SUBJECTS);
  const [targetOverallMarks, setTargetOverallMarks] = useState<string>('80');
  const [weeklyAvailableHours, setWeeklyAvailableHours] = useState<string>('21');

  const [plan, setPlan] = useState<{
    subjects: WeakSubject[];
    totalStudyHours: number;
    actionSteps: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = subjectsText.split('\n').filter((l) => l.trim().length > 0);
    const target = Math.min(100, Math.max(40, parseInt(normalizeBanglaDigits(targetOverallMarks), 10) || 80));
    const weeklyHours = Math.max(5, parseInt(normalizeBanglaDigits(weeklyAvailableHours), 10) || 21);

    const rawParsed = lines.map((line) => {
      const parts = line.split(':');
      const name = parts[0]?.trim() || 'বিষয়';
      const current = Math.min(100, Math.max(0, parseInt(normalizeBanglaDigits(parts[1]?.trim() || '50'), 10) || 50));
      const gap = Math.max(0, target - current);
      return { name, current, gap };
    });

    const totalGap = rawParsed.reduce((sum, item) => sum + Math.max(5, item.gap), 0) || 1;

    const parsedSubjects: WeakSubject[] = rawParsed.map(({ name, current, gap }) => {
      const priority: WeakSubject['priority'] =
        gap > 25 ? 'উচ্চ অগ্রাধিকার' : gap > 12 ? 'মাঝারি অগ্রাধিকার' : 'নিয়মিত রিভিশন';
      const hours = Math.max(2, Math.round((Math.max(5, gap) / totalGap) * weeklyHours));

      let strategy = '';
      if (gap > 25) {
        strategy = 'মূল পাঠ্যবইয়ের বেসিক সূত্র ও অধ্যায়ভিত্তিক কনসেপ্ট সমাধান + বিগত ৫ বছরের বোর্ড সৃজনশীল অনুশীলন।';
      } else if (gap > 12) {
        strategy = 'গাণিতিক সমস্যা নিয়মিত চর্চা, অধ্যায়ভিত্তিক সংক্ষিপ্ত নোট তৈরি ও সময় ধরে মডেল টেস্ট দেওয়া।';
      } else {
        strategy = 'গুরুত্বপূর্ণ MCQ, জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্নের নিয়মিত রিভিশন চালিয়ে যাওয়া।';
      }

      return {
        name,
        currentMarks: current,
        targetMarks: target,
        priority,
        hoursNeededPerWeek: hours,
        strategy,
      };
    });

    parsedSubjects.sort((a, b) => (b.targetMarks - b.currentMarks) - (a.targetMarks - a.currentMarks));
    const totalHours = parsedSubjects.reduce((acc, s) => acc + s.hoursNeededPerWeek, 0);

    const steps = [
      '১ম সপ্তাহ: সবচেয়ে বেশি গ্যাপ থাকা বিষয়গুলোর দুর্বল অধ্যায় তালিকাভুক্ত করে মূল বই থেকে বেসিক সম্পন্ন করা।',
      '২য়–৩য় সপ্তাহ: প্রতিটি বিষয়ের বোর্ড প্রশ্ন ও গাণিতিক সমস্যা খাতায় লিখে সমাধান করা এবং ভুলগুলো চিহ্নিত করা।',
      '৪র্থ সপ্তাহ: ঘড়ি ধরে পূর্ণাঙ্গ সিলেবাসের ওপর মডেল টেস্ট দিয়ে সময় ও নম্বর যাচাই করা।',
    ];

    setPlan({
      subjects: parsedSubjects,
      totalStudyHours: totalHours,
      actionSteps: steps,
    });
  };

  const handleReset = () => {
    setSubjectsText(DEFAULT_SUBJECTS);
    setTargetOverallMarks('80');
    setWeeklyAvailableHours('21');
    setPlan(null);
  };

  const handleCopy = () => {
    if (!plan) return;
    const text =
      `MEDIX PRIME রেজাল্ট উন্নয়ন পরিকল্পনা:\nটার্গেট নম্বর: ${targetOverallMarks}\nমোট সাপ্তাহিক পড়াশোনা: ${plan.totalStudyHours} ঘণ্টা\n` +
      plan.subjects.map((s) => `- ${s.name}: ${s.currentMarks} -> ${s.targetMarks} (${s.hoursNeededPerWeek} ঘণ্টা/সপ্তাহ)`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      toolNumber="০৩"
      toolName="রেজাল্ট ইম্প্রুভমেন্ট প্ল্যানার"
      categoryLabel="একাডেমিক সরঞ্জাম"
      iconName="TrendingUp"
      accentColor="#34D399"
      description="কোন বিষয়ে কত নম্বর পাচ্ছেন এবং বোর্ড পরীক্ষায় A+ (৮০+) পেতে কোন বিষয়ে সপ্তাহে কত ঘণ্টা সময় দেওয়া জরুরি তার বাস্তবসম্মত সাপ্তাহিক রুটিন তৈরি করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <h2 className={`font-heading font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
            বিষয় ও বর্তমান নম্বর লিখুন
          </h2>
          <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            প্রতি লাইনে বিষয়ের নাম এবং কোলন (:) দিয়ে বর্তমান নম্বর লিখুন
          </p>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="text-xs font-heading font-bold block mb-1">বিষয় ও প্রাপ্ত নম্বর</label>
              <textarea
                rows={5}
                value={subjectsText}
                onChange={(e) => setSubjectsText(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs font-heading font-medium border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-emerald-400'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-heading font-bold block mb-1">লক্ষ্যমাত্রা নম্বর (প্রতি ১০০-এ)</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={targetOverallMarks}
                  onChange={(e) => setTargetOverallMarks(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-latin font-bold border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white focus:border-emerald-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold block mb-1">সাপ্তাহিক অধ্যয়ন সময় (ঘণ্টা)</label>
                <input
                  type="number"
                  min="5"
                  max="70"
                  value={weeklyAvailableHours}
                  onChange={(e) => setWeeklyAvailableHours(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-latin font-bold border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white focus:border-emerald-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 gap-3">
              <button
                type="button"
                onClick={handleReset}
                className={`px-4 py-2.5 rounded-xl border text-xs font-heading font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'border-white/15 hover:bg-white/5 text-gray-300'
                    : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>

              <button
                type="submit"
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>কর্মপরিকল্পনা তৈরি করুন</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className={`font-heading font-bold text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              অগ্রাধিকারভিত্তিক উন্নয়ন পরিকল্পনা
            </h3>

            {plan ? (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  {plan.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs font-heading space-y-1.5 transition-colors ${
                        sub.priority === 'উচ্চ অগ্রাধিকার'
                          ? isDark
                            ? 'bg-rose-500/10 border-rose-500/30'
                            : 'bg-rose-50 border-rose-200'
                          : sub.priority === 'মাঝারি অগ্রাধিকার'
                          ? isDark
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-amber-50 border-amber-200'
                          : isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{sub.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              sub.priority === 'উচ্চ অগ্রাধিকার'
                                ? 'bg-rose-500/20 text-rose-500'
                                : sub.priority === 'মাঝারি অগ্রাধিকার'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {sub.priority}
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {sub.hoursNeededPerWeek} ঘণ্টা/সপ্তাহ
                          </span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>বর্তমান: {sub.currentMarks}</span>
                        <span>→</span>
                        <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          টার্গেট: {sub.targetMarks} (ব্যবধান {Math.max(0, sub.targetMarks - sub.currentMarks)} নম্বর)
                        </span>
                      </div>

                      <p className={`text-[11px] pt-1.5 border-t ${isDark ? 'text-slate-300 border-white/10' : 'text-slate-700 border-slate-200'}`}>
                        কৌশল: {sub.strategy}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-xs font-heading space-y-1.5 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>সাপ্তাহিক বাস্তবায়ন ধাপ:</span>
                  {plan.actionSteps.map((step, idx) => (
                    <p key={idx} className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {step}
                    </p>
                  ))}
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
                      <span className="text-emerald-500">পরিকল্পনা কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>পরিকল্পনা কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className={`font-heading text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  বিষয় ও নম্বর প্রদান করে “কর্মপরিকল্পনা তৈরি করুন” বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
