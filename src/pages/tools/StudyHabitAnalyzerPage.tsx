import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Brain, CheckCircle2, RotateCcw } from 'lucide-react';

const toBn = (n: number): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const StudyHabitAnalyzerPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [focusDuration, setFocusDuration] = useState<'under20' | '45min' | '90min'>('45min');
  const [phoneHabit, setPhoneHabit] = useState<'desk' | 'silent_other_room'>('desk');
  const [revisionFreq, setRevisionFreq] = useState<'daily' | 'before_exam'>('daily');
  const [activeRecall, setActiveRecall] = useState<'read_only' | 'test_self'>('test_self');
  const [noteMethod, setNoteMethod] = useState<'structured' | 'unorganized'>('structured');

  const evaluation = useMemo(() => {
    let score = 45;
    if (focusDuration === '45min') score += 12;
    if (focusDuration === '90min') score += 16;
    if (phoneHabit === 'silent_other_room') score += 14;
    if (revisionFreq === 'daily') score += 13;
    if (activeRecall === 'test_self') score += 12;
    if (noteMethod === 'structured') score += 8;

    score = Math.min(100, score);

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (focusDuration === '90min' || focusDuration === '45min') {
      strengths.push('দীর্ঘ ও নিয়ন্ত্রিত মনোযোগ সেশন বজায় রাখার সক্ষমতা রয়েছে।');
    } else {
      improvements.push('২০ মিনিটের কম মনোযোগ থাকে — পমোডোরো পদ্ধতিতে (২৫ মিনিট পড়া + ৫ মিনিট বিরতি) ধাপে ধাপে সময় বাড়ান।');
    }

    if (phoneHabit === 'silent_other_room') {
      strengths.push('পড়ার সময় মোবাইল ফোন দূরে রাখা মনোযোগ বিচ্ছিন্নতা প্রায় ৬০% কমিয়ে দেয়।');
    } else {
      improvements.push('পড়ার টেবিলে ফোন রাখা মনোযোগ নষ্টের বড় কারণ। পড়া শুরু করার আগে ফোন অন্য ঘরে বা ডু নট ডিস্টার্ব মোডে রাখুন।');
    }

    if (revisionFreq === 'daily') {
      strengths.push('দৈনিক রিভিশন অভ্যাস (স্পেসড রিপিটিশন) পরীক্ষার আগে চাপ কমিয়ে দীর্ঘমেয়াদি স্মৃতিশক্তি বাড়ায়।');
    } else {
      improvements.push('শুধু পরীক্ষার আগে পড়লে দীর্ঘমেয়াদি স্মৃতিতে থাকে না — প্রতিদিন অন্তত ৩০–৪৫ মিনিট আগের পড়া রিভিশন দিন।');
    }

    if (activeRecall === 'test_self') {
      strengths.push('নিজেকে পরীক্ষা করা (Active Recall) ও বিগত প্রশ্ন সমাধান করা বোর্ড ও ভর্তি পরীক্ষায় সর্বোচ্চ নম্বর আনে।');
    } else {
      improvements.push('শুধুমাত্র পাঠ্যবই রিডিং না পড়ে একটি অধ্যায় শেষে বই বন্ধ করে মূল পয়েন্ট ও প্রশ্ন নিজে সমাধান করুন।');
    }

    if (noteMethod === 'structured') {
      strengths.push('গোছানো নোট ও অধ্যায়ভিত্তিক সূত্রের খাতা পরীক্ষার আগের রাতে দ্রুত রিভিশনে সাহায্য করে।');
    } else {
      improvements.push('গুরুত্বপূর্ণ সূত্র, বিক্রিয়া ও তথ্য একটি আলাদা রিভিশন নোটবুকে গুছিয়ে লিখুন।');
    }

    let badge = 'উন্নতির সুযোগ রয়েছে';
    if (score >= 85) badge = 'অসাধারণ ও সুশৃঙ্খল অভ্যাস';
    else if (score >= 68) badge = 'সন্তোষজনক ধারা';

    return { score, strengths, improvements, badge };
  }, [focusDuration, phoneHabit, revisionFreq, activeRecall, noteMethod]);

  const handleReset = () => {
    setFocusDuration('45min');
    setPhoneHabit('desk');
    setRevisionFreq('daily');
    setActiveRecall('test_self');
    setNoteMethod('structured');
  };

  return (
    <ToolPageLayout
      toolNumber="১৭"
      toolName="পড়ার অভ্যাস বিশ্লেষক"
      categoryLabel="ব্যক্তিগত উন্নয়ন"
      iconName="Brain"
      accentColor="#A855F7"
      description="আপনার বর্তমান মনোযোগ, রিভিশন, মোবাইল ব্যবহার এবং অনুশীলনের অভ্যাস যাচাই করে বৈজ্ঞানিক উপায়ে পড়াশোনার মান বাড়ান।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              পড়ার অভ্যাস মূল্যায়ন
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
            নিচের ৫টি প্রশ্নে আপনার প্রকৃত অভ্যাসের সাথে মিলে যাওয়া বিকল্প নির্বাচন করুন
          </p>

          <div className="space-y-4">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ১. একটানা কত সময় পূর্ণ মনোযোগ দিয়ে পড়তে পারেন?
              </label>
              <select
                value={focusDuration}
                onChange={(e) => setFocusDuration(e.target.value as typeof focusDuration)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="under20">২০ মিনিটের কম (ঘন ঘন মনোযোগ ভেঙে যায়)</option>
                <option value="45min">৪০ – ৫০ মিনিট (পমোডোরো বা নিয়ন্ত্রিত সেশন)</option>
                <option value="90min">৬০ – ৯০ মিনিট বা তার বেশি (গভীর মনোযোগ)</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ২. পড়ার সময় আপনার স্মার্টফোন কোথায় থাকে?
              </label>
              <select
                value={phoneHabit}
                onChange={(e) => setPhoneHabit(e.target.value as typeof phoneHabit)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="desk">পড়ার টেবিলেই হাতের কাছে (নোটিফিকেশন আসে)</option>
                <option value="silent_other_room">সাইলেন্ট বা ডু নট ডিস্টার্ব মোডে অন্য কক্ষে/দূরে রাখা</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ৩. পূর্বে পড়া অধ্যায়গুলো রিভিশন দেওয়ার অভ্যাস কেমন?
              </label>
              <select
                value={revisionFreq}
                onChange={(e) => setRevisionFreq(e.target.value as typeof revisionFreq)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="daily">নিয়মিত (প্রতিদিন বা সপ্তাহে অন্তত ২–৩ দিন রিভিশন)</option>
                <option value="before_exam">শুধুমাত্র পরীক্ষার আগের রাতে বা কয়েকদিন আগে</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ৪. পড়া শেষে আয়ত্ত হয়েছে কিনা কীভাবে যাচাই করেন?
              </label>
              <select
                value={activeRecall}
                onChange={(e) => setActiveRecall(e.target.value as typeof activeRecall)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="test_self">বই বন্ধ করে লিখে যাচাই ও বিগত বোর্ড/ভর্তি প্রশ্ন সমাধান</option>
                <option value="read_only">শুধুমাত্র পাঠ্যবই ও গাইড রিডিং পড়ে যাই</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ৫. নোট ও সূত্র সংরক্ষণের ধরন কেমন?
              </label>
              <select
                value={noteMethod}
                onChange={(e) => setNoteMethod(e.target.value as typeof noteMethod)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="structured">বিষয়ভিত্তিক পরিচ্ছন্ন নোট ও ফর্মুলা/ভুল সংশোধনী খাতা আছে</option>
                <option value="unorganized">নির্দিষ্ট কোনো গুছানো নোট বা সূত্রের খাতা নেই</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1526] to-[#1A0E2E] border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.12)]'
                : 'bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-xs font-heading font-bold ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                অধ্যয়ন দক্ষতা স্কোর
              </span>
              <span
                className={`text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-900'
                }`}
              >
                {evaluation.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-4xl font-heading font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {toBn(evaluation.score)} / ১০০
              </span>
            </div>

            <div className={`w-full h-2.5 rounded-full overflow-hidden mb-5 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${evaluation.score}%` }}
              />
            </div>

            {evaluation.strengths.length > 0 && (
              <div className="space-y-2 mb-4">
                <span className={`text-xs font-heading font-bold block ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                  আপনার ইতিবাচক দিকসমূহ:
                </span>
                {evaluation.strengths.map((st, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs font-heading p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            )}

            {evaluation.improvements.length > 0 && (
              <div className="space-y-2">
                <span className={`text-xs font-heading font-bold block ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                  কার্যকর উন্নয়নের পরামর্শ:
                </span>
                {evaluation.improvements.map((imp, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs font-heading p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-amber-500/10 border-amber-500/25 text-amber-100'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <Brain className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
