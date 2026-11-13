import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { BANGLADESH_INSTITUTIONS } from '../../data/bangladeshInstitutions';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const AdmissionCostCalculatorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [institutionId, setInstitutionId] = useState<string>('du');
  const [stayType, setStayType] = useState<'hall' | 'mess' | 'home'>('hall');
  const [scholarshipPercent, setScholarshipPercent] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const selectedInst =
    BANGLADESH_INSTITUTIONS.find((i) => i.id === institutionId) || BANGLADESH_INSTITUTIONS[0];

  const annualLivingCost =
    stayType === 'home'
      ? 0
      : stayType === 'mess'
      ? selectedInst.monthlyMessExpense * 12
      : selectedInst.monthlyHallExpense * 12;

  const tuitionWaiverAmount = Math.round((selectedInst.yearlyTuition * scholarshipPercent) / 100);
  const finalYearlyTuition = Math.max(0, selectedInst.yearlyTuition - tuitionWaiverAmount);

  const calculatedFirstYear =
    selectedInst.applicationFee +
    selectedInst.admissionFee +
    finalYearlyTuition +
    selectedInst.booksAndSupplies +
    annualLivingCost;

  const durationYears = selectedInst.category === 'মেডিকেল ও ডেন্টাল' ? 5 : 4;
  const subsequentYearCost = finalYearlyTuition + selectedInst.booksAndSupplies + annualLivingCost;
  const calculatedTotalDegree = calculatedFirstYear + subsequentYearCost * (durationYears - 1);

  const handleReset = () => {
    setInstitutionId('du');
    setStayType('hall');
    setScholarshipPercent(0);
  };

  const handleCopy = () => {
    const text = `MEDIX PRIME ভর্তি ব্যয় হিসাব:\nপ্রতিষ্ঠান: ${selectedInst.nameBangla}\n১ম বছরের মোট খরচ: ৳${calculatedFirstYear.toLocaleString()}\n${durationYears} বছরের আনুমানিক মোট ব্যয়: ৳${calculatedTotalDegree.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      toolNumber="১৩"
      toolName="ভর্তি ব্যয় ক্যালকুলেটর"
      categoryLabel="বিশ্ববিদ্যালয় সরঞ্জাম"
      iconName="Coins"
      accentColor="#F59E0B"
      description="বাংলাদেশের সরকারি, মেডিকেল, প্রকৌশল, কৃষি, ৭ কলেজ, জাতীয় বিশ্ববিদ্যালয় ও বেসরকারি বিশ্ববিদ্যালয়ের আবেদন ফি, ভর্তি ফি, টিউশন ও থাকা-খাওয়ার প্রকৃত হিসাব তৈরি করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
              বিশ্ববিদ্যালয় ও আবাসন নির্বাচন
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className={`text-xs font-heading font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer ${
                isDark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>রিসেট</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-heading font-bold block mb-1.5">
                ১. বিশ্ববিদ্যালয় / মেডিকেল কলেজ নির্বাচন করুন
              </label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-amber-400'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                {BANGLADESH_INSTITUTIONS.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nameBangla} ({inst.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold block mb-1.5">২. থাকার ব্যবস্থা</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hall', label: 'আবাসিক হল' },
                  { id: 'mess', label: 'বাইরের মেস/বাসা' },
                  { id: 'home', label: 'নিজের বাড়ি' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStayType(st.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-heading font-bold border transition-all cursor-pointer ${
                      stayType === st.id
                        ? 'bg-amber-500 text-black border-amber-500 shadow-xs'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-heading mb-1">
                <span className="font-bold">৩. টিউশন ফি ওয়েভার / বৃত্তি সুবিধা:</span>
                <span className="font-latin font-bold text-amber-500">{scholarshipPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={scholarshipPercent}
                onChange={(e) => setScholarshipPercent(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className={`text-[11px] font-heading block mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ভর্তি পরীক্ষায় কৃতিত্ব ও জিপিএ ৫.০০ ভিত্তিতে বেসরকারি বিশ্ববিদ্যালয়ে ২০%–১০০% ওয়েভার পাওয়া যায়
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-200/20">
              <div>
                <span className="text-[11px] font-heading font-bold text-amber-500 block">
                  {selectedInst.category}
                </span>
                <h3 className={`font-heading font-bold text-base ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                  {selectedInst.nameBangla}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-latin font-black text-amber-500">
                  ৳{calculatedFirstYear.toLocaleString()}
                </span>
                <span className={`text-[11px] block font-heading ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ১ম বছরের আনুমানিক খরচ
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-heading">
              <div className="flex justify-between py-1.5 border-b border-slate-200/15">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>১. আবেদন ফরম ফি:</span>
                <span className="font-latin font-semibold">৳{selectedInst.applicationFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200/15">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>২. এককালীন ভর্তি ও রেজিস্ট্রেশন ফি:</span>
                <span className="font-latin font-semibold">৳{selectedInst.admissionFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200/15">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>৩. ১ম বছরের টিউশন ও একাডেমিক ফি:</span>
                <span className="font-latin font-semibold text-emerald-500">
                  ৳{finalYearlyTuition.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200/15">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>৪. বই, নোটস ও ব্যবহারিক উপকরণ:</span>
                <span className="font-latin font-semibold">৳{selectedInst.booksAndSupplies.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-200/15">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>৫. বাৎসরিক আবাসন ও খাবার খরচ (১২ মাস):</span>
                <span className="font-latin font-semibold text-amber-500">৳{annualLivingCost.toLocaleString()}</span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs mt-3 ${
                  isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <span>সম্পূর্ণ {durationYears} বছরের আনুমানিক শিক্ষা ব্যয়:</span>
                <span className="font-latin text-sm">৳{calculatedTotalDegree.toLocaleString()}</span>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDark
                      ? 'border-white/15 hover:bg-white/5 text-amber-400'
                      : 'border-slate-300 hover:bg-slate-50 text-amber-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">বাজেট কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ব্যয় হিসাব কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
