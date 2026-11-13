import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Clock, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react';

const toBn = (n: number | string): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const TimeValueCalculatorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [studyHours, setStudyHours] = useState<string>('5');
  const [screenTime, setScreenTime] = useState<string>('3');
  const [sleepHours, setSleepHours] = useState<string>('7');

  const analysis = useMemo(() => {
    const study = Math.min(18, Math.max(0, parseFloat(studyHours) || 0));
    const screen = Math.min(18, Math.max(0, parseFloat(screenTime) || 0));
    const sleep = Math.min(14, Math.max(0, parseFloat(sleepHours) || 0));

    const yearlyStudy = Math.round(study * 365);
    const yearlyScreen = Math.round(screen * 365);
    const totalAllocated = Math.min(24, study + screen + sleep);
    const otherHours = Math.max(0, Number((24 - (study + screen + sleep)).toFixed(1)));

    const productiveBase = study + screen * 0.25;
    const focusScore =
      study + screen > 0
        ? Math.min(100, Math.round((study / Math.max(1, productiveBase)) * 100))
        : 0;

    let feedback = '';
    if (screen > study) {
      feedback =
        'আপনার বিনোদন/অপ্রয়োজনীয় স্ক্রিন টাইম পড়াশোনার সময়ের চেয়ে বেশি। প্রতিদিন মাত্র ১.৫ ঘণ্টা স্ক্রিন টাইম কমিয়ে মূল পাঠ্যবই ও অনুশীলনে ব্যয় করলে বছরে প্রায় ৫৪৭ ঘণ্টা অতিরিক্ত প্রস্তুতি নিশ্চিত করা সম্ভব।';
    } else if (study >= 6 && sleep >= 6.5 && screen <= 2.5) {
      feedback =
        'আপনার সময় বণ্টন চমৎকার ও ভারসাম্যপূর্ণ। নিয়মিত ঘুম ও গভীর মনোযোগের এই ধারা বজায় রাখলে বোর্ড পরীক্ষা ও ভর্তি যুদ্ধে এগিয়ে থাকবেন।';
    } else if (sleep < 6) {
      feedback =
        'আপনার ঘুম ৬ ঘণ্টার কম হওয়ায় স্মৃতিশক্তি ও পড়াশোনা ধরে রাখার ক্ষমতা ব্যাহত হতে পারে। অন্তত ৬.৫ – ৭ ঘণ্টা নিরবচ্ছিন্ন ঘুম নিশ্চিত করুন।';
    } else {
      feedback =
        'আপনার পড়াশোনার সময় মোটামুটি ভালো। অপ্রয়োজনীয় সোশ্যাল মিডিয়া স্ক্রলিং কমিয়ে আরও ২ ঘণ্টা গভীর ফোকাস সেশন (Pomodoro) যোগ করলে ফলাফল দ্রুত উন্নত হবে।';
    }

    return {
      study,
      screen,
      sleep,
      otherHours,
      totalAllocated,
      yearlyStudy,
      yearlyScreen,
      focusScore,
      feedback,
    };
  }, [studyHours, screenTime, sleepHours]);

  const handleReset = () => {
    setStudyHours('5');
    setScreenTime('3');
    setSleepHours('7');
  };

  return (
    <ToolPageLayout
      toolNumber="১৬"
      toolName="সময় মূল্যায়ন ক্যালকুলেটর"
      categoryLabel="ব্যক্তিগত উন্নয়ন"
      iconName="Clock"
      accentColor="#06B6D4"
      description="দৈনিক ২৪ ঘণ্টার পড়াশোনা, স্ক্রিন টাইম এবং ঘুমের হিসাব বিশ্লেষণ করে বাৎসরিক উৎপাদনশীল সময়ের মূল্য ও প্রোডাক্টিভিটি সূচক যাচাই করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              দৈনিক সময় বিভাজন (ঘণ্টা)
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
            ২৪ ঘণ্টার মধ্যে প্রতিদিনের গড় ব্যয়িত সময় বসান
          </p>

          <div className="space-y-4">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                মনোযোগী পড়াশোনার সময় (ঘণ্টা/দিন):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="18"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                অপ্রয়োজনীয় স্ক্রিন টাইম ও সোশ্যাল মিডিয়া (ঘণ্টা/দিন):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="18"
                value={screenTime}
                onChange={(e) => setScreenTime(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ঘুমের সময় (ঘণ্টা/দিন):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="14"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              />
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-heading flex justify-between items-center ${
                isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>দৈনন্দিন অন্যান্য কাজ (খাওয়া, যাতায়াত, প্রার্থনা):</span>
              <span className="font-bold">{toBn(analysis.otherHours)} ঘণ্টা</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1526] to-[#071A26] border-cyan-500/30 shadow-[0_10px_30px_rgba(6,182,212,0.12)]'
                : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-200 shadow-sm'
            }`}
          >
            <span className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-800'}`}>
              বাৎসরিক সময়ের প্রভাব ও ফোকাস সূচক
            </span>
            <div className="flex items-baseline gap-2 mb-5">
              <span className={`text-4xl font-heading font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {toBn(analysis.focusScore)}%
              </span>
              <span className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                পড়াশোনার অনুপাত স্কোর
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className={`text-xs font-heading block ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                  ১ বছরে মোট পড়াশোনা:
                </span>
                <span className={`font-heading font-black text-xl block mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>
                  {toBn(analysis.yearlyStudy.toLocaleString())} ঘণ্টা
                </span>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <span className={`text-xs font-heading block ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>
                  ১ বছরে স্ক্রিনে ব্যয়িত সময়:
                </span>
                <span className={`font-heading font-black text-xl block mt-1 ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>
                  {toBn(analysis.yearlyScreen.toLocaleString())} ঘণ্টা
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs font-heading leading-relaxed flex items-start gap-2.5 ${
                analysis.screen > analysis.study || analysis.sleep < 6
                  ? isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                  : isDark
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-950'
              }`}
            >
              {analysis.screen > analysis.study || analysis.sleep < 6 ? (
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              ) : (
                <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
              )}
              <div>
                <span className="font-bold block mb-0.5">বিশ্লেষণ ও কর্মপরামর্শ:</span>
                {analysis.feedback}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
