import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Target, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react';

export const GpaTargetPredictorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentGpa, setCurrentGpa] = useState<string>('4.20');
  const [completedSubjects, setCompletedSubjects] = useState<string>('4');
  const [targetGpa, setTargetGpa] = useState<string>('4.75');
  const [remainingSubjects, setRemainingSubjects] = useState<string>('3');

  const [prediction, setPrediction] = useState<{
    achievable: boolean;
    maxPossible: number;
    requiredAvgGpa: number;
    explanation: string;
    targetBreakdown: { subject: string; targetGrade: string; point: number }[];
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const curr = parseFloat(currentGpa);
    const comp = parseInt(completedSubjects, 10);
    const target = parseFloat(targetGpa);
    const rem = parseInt(remainingSubjects, 10);

    if (isNaN(curr) || curr < 0 || curr > 5.0) {
      setError('বর্তমান জিপিএ ০.০০ থেকে ৫.০০ এর মধ্যে হতে হবে।');
      return;
    }
    if (isNaN(target) || target < 0 || target > 5.0) {
      setError('লক্ষ্যমাত্রা জিপিএ ০.০০ থেকে ৫.০০ এর মধ্যে হতে হবে।');
      return;
    }
    if (isNaN(comp) || comp < 1) {
      setError('সম্পন্ন বিষয়ের সংখ্যা অন্তত ১ হতে হবে।');
      return;
    }
    if (isNaN(rem) || rem < 1) {
      setError('বাকি বিষয়ের সংখ্যা অন্তত ১ হতে হবে।');
      return;
    }

    const totalSubjects = comp + rem;
    const requiredTotalPoints = target * totalSubjects;
    const currentEarnedPoints = curr * comp;
    const neededFromRemaining = requiredTotalPoints - currentEarnedPoints;
    const requiredAvgGpa = neededFromRemaining / rem;
    const maxPossible = (currentEarnedPoints + 5.0 * rem) / totalSubjects;

    const achievable = requiredAvgGpa <= 5.0 && requiredAvgGpa >= 0;

    let explanation = '';
    if (!achievable && requiredAvgGpa > 5.0) {
      explanation = `বাকি ${rem}টি বিষয়ে সর্বোচ্চ ৫.০০ পেলেও চূড়ান্ত গড় হবে সর্বোচ্চ ${maxPossible.toFixed(2)}। তাই ${target.toFixed(2)} অর্জন করতে অতিরিক্ত ৪র্থ বিষয় বোনাস অথবা উন্নতি পরীক্ষা প্রয়োজন।`;
    } else if (requiredAvgGpa <= 0) {
      explanation = `আপনার বর্তমান অর্জিত পয়েন্ট ইতিমধ্যেই ${target.toFixed(2)} লক্ষ্যমাত্রা ছাড়িয়ে গেছে; বাকি বিষয়গুলোতে পাস করলে লক্ষ্য পূরণ হবে।`;
    } else {
      explanation = `${target.toFixed(2)} জিপিএ অর্জনের জন্য বাকি ${rem}টি বিষয়ের প্রতিটিতে গড়ে ন্যূনতম ${requiredAvgGpa.toFixed(2)} পয়েন্ট পেতে হবে।`;
    }

    const clampedReq = Math.min(5.0, Math.max(1.0, parseFloat(requiredAvgGpa.toFixed(2))));
    const gradeLabel =
      clampedReq > 4.0
        ? 'A+ (৮০–১০০ নম্বর)'
        : clampedReq > 3.5
        ? 'A (৭০–৭৯ নম্বর)'
        : clampedReq > 3.0
        ? 'A- (৬০–৬৯ নম্বর)'
        : 'B (৫০–৫৯ নম্বর)';

    const breakdown = Array.from({ length: rem }).map((_, i) => ({
      subject: `অবশিষ্ট বিষয় ${i + 1}`,
      targetGrade: gradeLabel,
      point: clampedReq,
    }));

    setPrediction({
      achievable,
      maxPossible: parseFloat(maxPossible.toFixed(2)),
      requiredAvgGpa: parseFloat(Math.max(0, requiredAvgGpa).toFixed(2)),
      explanation,
      targetBreakdown: breakdown,
    });
  };

  const handleReset = () => {
    setCurrentGpa('4.20');
    setCompletedSubjects('4');
    setTargetGpa('4.75');
    setRemainingSubjects('3');
    setPrediction(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!prediction) return;
    const text = `MEDIX PRIME জিপিএ লক্ষ্য পূর্বাভাস:\nবর্তমান: ${currentGpa}, লক্ষ্য: ${targetGpa}\nবাকি বিষয়ে প্রয়োজনীয় গড় পয়েন্ট: ${prediction.achievable ? prediction.requiredAvgGpa : 'অসম্ভব'}\n${prediction.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = `w-full px-3 py-2 rounded-xl text-xs font-latin font-bold border transition-colors focus:outline-hidden ${
    isDark
      ? 'bg-[#060D17] border-white/20 text-white focus:border-[#818CF8]'
      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
  }`;

  return (
    <ToolPageLayout
      toolNumber="০২"
      toolName="জিপিএ টার্গেট প্রেডিক্টর"
      categoryLabel="একাডেমিক সরঞ্জাম"
      iconName="Target"
      accentColor="#818CF8"
      description="আপনার সম্পন্ন পরীক্ষার গড় জিপিএ এবং কাঙ্ক্ষিত চূড়ান্ত লক্ষ্য ইনপুট দিয়ে জানুন বাকি বিষয়গুলোতে গড়ে কত গ্রেড পয়েন্ট ও নম্বর পেতে হবে।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-7 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <h2 className={`font-heading font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
            লক্ষ্যমাত্রা নির্ধারণ
          </h2>
          <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            বাংলাদেশ শিক্ষা বোর্ডের ৫.০০ স্কেল অনুযায়ী গাণিতিক হিসাব
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-heading flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-heading font-bold block mb-1">১. বর্তমান গড় জিপিএ</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={currentGpa}
                  onChange={(e) => setCurrentGpa(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold block mb-1">২. সম্পন্ন বিষয়ের সংখ্যা</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={completedSubjects}
                  onChange={(e) => setCompletedSubjects(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-heading font-bold block mb-1">৩. কাঙ্ক্ষিত টার্গেট জিপিএ</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold block mb-1">৪. অবশিষ্ট বিষয়ের সংখ্যা</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={remainingSubjects}
                  onChange={(e) => setRemainingSubjects(e.target.value)}
                  className={inputClass}
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
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" />
                <span>টার্গেট হিসাব করুন</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div
            className={`p-6 rounded-2xl border text-center transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className={`font-heading font-bold text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              প্রেডিকশন ফলাফল
            </h3>

            {prediction ? (
              <div className="space-y-4 py-3">
                <div
                  className={`inline-block px-7 py-4 rounded-3xl border ${
                    prediction.achievable
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  }`}
                >
                  <span className={`text-xs font-heading block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    বাকি বিষয়গুলোতে প্রয়োজনীয় গড় পয়েন্ট
                  </span>
                  <div className="text-3xl sm:text-4xl font-latin font-black tracking-tight">
                    {prediction.achievable ? `${prediction.requiredAvgGpa.toFixed(2)}` : 'অসম্ভব'}
                  </div>
                  <span className="text-xs font-heading font-bold mt-1 block">
                    {prediction.achievable ? 'লক্ষ্য অর্জনযোগ্য' : `সর্বোচ্চ সম্ভব ${prediction.maxPossible.toFixed(2)}`}
                  </span>
                </div>

                <div
                  className={`text-left p-3.5 rounded-xl text-xs font-heading leading-relaxed border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p>{prediction.explanation}</p>
                </div>

                {prediction.achievable && (
                  <div className="text-left space-y-1.5 pt-1">
                    <span className={`text-xs font-heading font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      বাকি বিষয়ের লক্ষ্য বিভাজন:
                    </span>
                    {prediction.targetBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-heading border ${
                          isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{item.subject}</span>
                        <span className="font-bold text-indigo-500">{item.targetGrade}</span>
                      </div>
                    ))}
                  </div>
                )}

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
                      <span className="text-emerald-500">কপি হয়েছে!</span>
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
              <div className="py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <p className={`font-heading text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  আপনার বর্তমান ও কাঙ্ক্ষিত জিপিএ দিয়ে হিসাব বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
