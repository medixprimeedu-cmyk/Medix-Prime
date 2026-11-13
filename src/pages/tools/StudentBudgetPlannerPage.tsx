import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Wallet, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

interface LivingPreset {
  id: string;
  label: string;
  budget: string;
  rent: string;
  food: string;
  transport: string;
  academic: string;
  personal: string;
}

const LIVING_PRESETS: LivingPreset[] = [
  {
    id: 'public_hall',
    label: 'পাবলিক বিশ্ববিদ্যালয় আবাসিক হল (সাশ্রয়ী)',
    budget: '7500',
    rent: '500',
    food: '3800',
    transport: '600',
    academic: '900',
    personal: '800',
  },
  {
    id: 'dhaka_mess',
    label: 'ঢাকা শহরের মেস / হোস্টেল (ভর্তি বা স্নাতক শিক্ষার্থী)',
    budget: '14000',
    rent: '4800',
    food: '4800',
    transport: '1200',
    academic: '1200',
    personal: '1000',
  },
  {
    id: 'divisional_mess',
    label: 'বিভাগীয় শহরের মেস (চট্টগ্রাম/রাজশাহী/সিলেট/খুলনা)',
    budget: '10500',
    rent: '3200',
    food: '4000',
    transport: '800',
    academic: '1000',
    personal: '800',
  },
  {
    id: 'home_living',
    label: 'নিজ বাসায় থেকে পড়াশোনা',
    budget: '6000',
    rent: '0',
    food: '1500',
    transport: '1400',
    academic: '1200',
    personal: '900',
  },
];

const toBn = (n: number): string =>
  Math.round(n).toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const StudentBudgetPlannerPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedPreset, setSelectedPreset] = useState<string>('dhaka_mess');
  const [monthlyBudget, setMonthlyBudget] = useState<string>('14000');
  const [rent, setRent] = useState<string>('4800');
  const [food, setFood] = useState<string>('4800');
  const [transport, setTransport] = useState<string>('1200');
  const [academic, setAcademic] = useState<string>('1200');
  const [personal, setPersonal] = useState<string>('1000');

  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = LIVING_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setMonthlyBudget(p.budget);
    setRent(p.rent);
    setFood(p.food);
    setTransport(p.transport);
    setAcademic(p.academic);
    setPersonal(p.personal);
  };

  const budgetCalc = useMemo(() => {
    const income = Math.max(0, parseFloat(monthlyBudget) || 0);
    const r = Math.max(0, parseFloat(rent) || 0);
    const f = Math.max(0, parseFloat(food) || 0);
    const t = Math.max(0, parseFloat(transport) || 0);
    const a = Math.max(0, parseFloat(academic) || 0);
    const p = Math.max(0, parseFloat(personal) || 0);

    const totalExpenses = r + f + t + a + p;
    const netSavings = income - totalExpenses;
    const isSurplus = netSavings >= 0;
    const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

    return {
      income,
      totalExpenses,
      netSavings,
      isSurplus,
      savingsRate,
      breakdown: [
        { label: 'হল / মেস / বাসা ভাড়া', amount: r, color: 'bg-sky-500' },
        { label: 'খাবার ও মেস/ডাইনিং খরচ', amount: f, color: 'bg-emerald-500' },
        { label: 'যাতায়াত ও ইন্টারনেট', amount: t, color: 'bg-amber-500' },
        { label: 'বই, প্রিন্ট ও কোর্স সামগ্রী', amount: a, color: 'bg-purple-500' },
        { label: 'ব্যক্তিগত ও জরুরি প্রয়োজন', amount: p, color: 'bg-rose-500' },
      ],
    };
  }, [monthlyBudget, rent, food, transport, academic, personal]);

  return (
    <ToolPageLayout
      toolNumber="১৯"
      toolName="শিক্ষার্থী বাজেট প্ল্যানার"
      categoryLabel="ব্যক্তিগত উন্নয়ন"
      iconName="Wallet"
      accentColor="#10B981"
      description="বাংলাদেশের আবাসিক হল, ঢাকার মেস বা নিজ বাসায় থেকে মাসিক পকেট মানি, খাবার, যাতায়াত ও শিক্ষা খরচের ভারসাম্যপূর্ণ বাজেট ও সঞ্চয় পরিকল্পনা তৈরি করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              আয় ও মাসিক খরচের বিবরণ (টাকা)
            </h2>
            <button
              type="button"
              onClick={() => applyPreset('dhaka_mess')}
              className={`inline-flex items-center gap-1 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            অবস্থান অনুযায়ী প্রস্তুত প্রিসেট বাছুন অথবা নিজের হিসাব বসান
          </p>

          <div className="mb-4">
            <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              বসবাসের ধরন অনুযায়ী দ্রুত প্রিসেট:
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => applyPreset(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                isDark
                  ? 'bg-[#060D17] border-white/20 text-white focus:border-emerald-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
              }`}
            >
              {LIVING_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                মাসিক মোট বাজেট / পকেট মানি (৳):
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-emerald-500/40 text-white focus:border-emerald-400'
                    : 'bg-emerald-50/40 border-emerald-300 text-slate-900 focus:border-[#006B98]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  বাসা / মেস / হল ভাড়া (৳):
                </label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  খাবার ও নাস্তা (৳):
                </label>
                <input
                  type="number"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  যাতায়াত ও মোবাইল ডাটা (৳):
                </label>
                <input
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  বই, খাতা ও কোর্স (৳):
                </label>
                <input
                  type="number"
                  value={academic}
                  onChange={(e) => setAcademic(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ব্যক্তিগত ও জরুরি চিকিৎসা খরচ (৳):
              </label>
              <input
                type="number"
                value={personal}
                onChange={(e) => setPersonal(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl font-latin font-bold text-sm border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1526] to-[#081F18] border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.12)]'
                : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-xs font-heading font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                {budgetCalc.isSurplus ? 'মাসিক নিট সঞ্চয় / উদ্বৃত্ত' : 'মাসিক ঘাটতি (বাজেট অতিক্রম)'}
              </span>
              <span
                className={`text-xs font-heading font-bold px-2.5 py-0.5 rounded-full ${
                  budgetCalc.isSurplus
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-900'
                    : isDark
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                মোট খরচ: ৳{toBn(budgetCalc.totalExpenses)}
              </span>
            </div>

            <div
              className={`text-3xl sm:text-4xl font-heading font-black mb-5 ${
                budgetCalc.isSurplus
                  ? isDark
                    ? 'text-emerald-400'
                    : 'text-emerald-800'
                  : isDark
                  ? 'text-rose-400'
                  : 'text-rose-700'
              }`}
            >
              {budgetCalc.isSurplus ? '+' : '-'}৳{toBn(Math.abs(budgetCalc.netSavings))}
            </div>

            <div className="space-y-3 mb-5">
              {budgetCalc.breakdown.map((item, idx) => {
                const pct =
                  budgetCalc.totalExpenses > 0
                    ? Math.round((item.amount / budgetCalc.totalExpenses) * 100)
                    : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-heading font-semibold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{item.label}</span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        ৳{toBn(item.amount)} ({toBn(pct)}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`p-3.5 rounded-xl border text-xs font-heading leading-relaxed flex items-start gap-2.5 ${
                budgetCalc.isSurplus
                  ? isDark
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : isDark
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-100'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {budgetCalc.isSurplus ? (
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
              ) : (
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-rose-400' : 'text-rose-700'}`} />
              )}
              <div>
                <span className="font-bold block mb-0.5">আর্থিক পর্যবেক্ষণ:</span>
                {budgetCalc.isSurplus
                  ? `মাসিক খরচের পরও আপনি প্রায় ${toBn(budgetCalc.savingsRate)}% (৳${toBn(
                      budgetCalc.netSavings
                    )}) সঞ্চয় করতে পারছেন, যা জরুরি তহবিল বা বই/কোর্স কেনায় ব্যবহারযোগ্য।`
                  : `আপনার ব্যয় মাসিক বাজেটের চেয়ে ৳${toBn(
                      Math.abs(budgetCalc.netSavings)
                    )} বেশি। খাবার, যাতায়াত বা ব্যক্তিগত খাত থেকে অপ্রয়োজনীয় ব্যয় কমানো প্রয়োজন।`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
