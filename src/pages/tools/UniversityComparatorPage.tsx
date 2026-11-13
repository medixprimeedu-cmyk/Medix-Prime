import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { BANGLADESH_INSTITUTIONS } from '../../data/bangladeshInstitutions';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';

export const UniversityComparatorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [univAId, setUnivAId] = useState<string>('du');
  const [univBId, setUnivBId] = useState<string>('dmc');
  const [copied, setCopied] = useState(false);

  const univA = BANGLADESH_INSTITUTIONS.find((u) => u.id === univAId) || BANGLADESH_INSTITUTIONS[0];
  const univB = BANGLADESH_INSTITUTIONS.find((u) => u.id === univBId) || BANGLADESH_INSTITUTIONS[1];

  const handleCopy = () => {
    const text = `MEDIX PRIME বিশ্ববিদ্যালয় তুলনা:\n${univA.nameBangla} বনাম ${univB.nameBangla}\nঅবস্থান: ${univA.location} বনাম ${univB.location}\nভর্তি পদ্ধতি: ${univA.examSystem} বনাম ${univB.examSystem}\nআবাসন: ${univA.hallFacilities} বনাম ${univB.hallFacilities}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectClass = `w-full px-3 py-2.5 rounded-xl text-xs font-heading font-bold border transition-colors focus:outline-hidden ${
    isDark
      ? 'bg-[#060D17] border-white/20 text-white focus:border-pink-400'
      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
  }`;

  const labelMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const valueText = isDark ? 'text-slate-200' : 'text-slate-800';

  return (
    <ToolPageLayout
      toolNumber="১৪"
      toolName="বিশ্ববিদ্যালয় তুলনাকারী"
      categoryLabel="বিশ্ববিদ্যালয় সরঞ্জাম"
      iconName="GitCompare"
      accentColor="#EC4899"
      description="বাংলাদেশের যেকোনো দুটি বিশ্ববিদ্যালয় বা মেডিকেল কলেজের ভর্তি যোগ্যতা, পরীক্ষা পদ্ধতি, আবাসিক হল, গবেষণাগার, টিউশন ও জীবনযাত্রার খরচের সরাসরি তুলনা দেখুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex-1 w-full">
            <label className={`text-xs font-heading font-bold block mb-1 ${labelMuted}`}>
              প্রথম বিশ্ববিদ্যালয় / প্রতিষ্ঠান:
            </label>
            <select value={univAId} onChange={(e) => setUnivAId(e.target.value)} className={selectClass}>
              {BANGLADESH_INSTITUTIONS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBangla} — ({u.category})
                </option>
              ))}
            </select>
          </div>

          <div className="shrink-0 p-2.5 rounded-full bg-pink-500/15 text-pink-500 border border-pink-500/30">
            <ArrowRightLeft className="w-5 h-5" />
          </div>

          <div className="flex-1 w-full">
            <label className={`text-xs font-heading font-bold block mb-1 ${labelMuted}`}>
              দ্বিতীয় বিশ্ববিদ্যালয় / প্রতিষ্ঠান:
            </label>
            <select value={univBId} onChange={(e) => setUnivBId(e.target.value)} className={selectClass}>
              {BANGLADESH_INSTITUTIONS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBangla} — ({u.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className={`rounded-2xl border overflow-hidden transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div
            className={`grid grid-cols-2 text-center p-4 border-b font-heading font-bold text-xs sm:text-sm ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="text-pink-500 border-r border-slate-300/30 pr-2 truncate">
              {univA.nameBangla}
            </div>
            <div className="text-[#006B98] dark:text-sky-400 pl-2 truncate">
              {univB.nameBangla}
            </div>
          </div>

          <div className={`divide-y text-xs font-heading ${isDark ? 'divide-white/10' : 'divide-slate-200'}`}>
            {[
              { label: 'ধরন ও অবস্থান', valA: `${univA.category} • ${univA.location} (প্রতিষ্ঠা: ${univA.established})`, valB: `${univB.category} • ${univB.location} (প্রতিষ্ঠা: ${univB.established})` },
              { label: 'ক্যাম্পাস আয়তন', valA: univA.campusArea, valB: univB.campusArea },
              { label: 'আবাসিক হল সুবিধা', valA: univA.hallFacilities, valB: univB.hallFacilities },
              { label: 'ন্যূনতম জিপিএ শর্ত', valA: univA.minGpa, valB: univB.minGpa },
              { label: 'ভর্তি পরীক্ষা পদ্ধতি', valA: univA.examSystem, valB: univB.examSystem },
              { label: 'ল্যাব ও গবেষণা সুবিধা', valA: univA.labAndResearch, valB: univB.labAndResearch },
              {
                label: 'বাৎসরিক টিউশন ও মাসিক আবাসন',
                valA: `টিউশন: ৳${univA.yearlyTuition.toLocaleString()} / বছর • হল: ৳${univA.monthlyHallExpense.toLocaleString()}/মাস`,
                valB: `টিউশন: ৳${univB.yearlyTuition.toLocaleString()} / বছর • হল: ৳${univB.monthlyHallExpense.toLocaleString()}/মাস`,
              },
            ].map((row, idx) => (
              <div key={idx} className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold block mb-1 ${labelMuted}`}>{row.label}:</span>
                  <span className={`font-semibold leading-relaxed ${valueText}`}>{row.valA}</span>
                </div>
                <div className={`border-l pl-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className={`text-[10px] font-bold block mb-1 ${labelMuted}`}>{row.label}:</span>
                  <span className={`font-semibold leading-relaxed ${valueText}`}>{row.valB}</span>
                </div>
              </div>
            ))}

            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <span className={`text-[10px] font-bold block mb-1.5 ${labelMuted}`}>প্রধান বিভাগ ও অনুষদ:</span>
                <div className="flex flex-wrap gap-1">
                  {univA.popularFaculties.map((s, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-md text-[10px] border ${
                        isDark ? 'bg-white/10 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`border-l pl-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-bold block mb-1.5 ${labelMuted}`}>প্রধান বিভাগ ও অনুষদ:</span>
                <div className="flex flex-wrap gap-1">
                  {univB.popularFaculties.map((s, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-md text-[10px] border ${
                        isDark ? 'bg-white/10 border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 border-t flex justify-end ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={handleCopy}
              className={`py-2 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'border-white/15 hover:bg-white/10 text-pink-400'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-pink-600'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'তুলনা কপি হয়েছে!' : 'তুলনা কপি করুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
