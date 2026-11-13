import React, { useState, useMemo } from 'react';
import {
  Compass,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { ToolPageLayout } from '../components/tools/ToolPageLayout';
import { useTheme } from '../hooks/useTheme';
import {
  VERIFIED_ADMISSION_PROGRAMS,
  VerifiedAdmissionProgram,
  toBengaliNumber,
  cleanDecimal,
} from '../data/admissionRules';

interface ChecklistItem {
  id: string;
  label: string;
  required: string;
  studentValue: string;
  passed: boolean;
  missingInfo?: boolean;
}

interface EvaluationResult {
  program: VerifiedAdmissionProgram;
  status: 'eligible' | 'not_eligible' | 'more_info_needed';
  checklist: ChecklistItem[];
}

export const AdmissionEligibilityToolPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sscYear, setSscYear] = useState<number>(2024);
  const [hscYear, setHscYear] = useState<number>(2026);
  const [sscGpa, setSscGpa] = useState<string>('5.00');
  const [hscGpa, setHscGpa] = useState<string>('5.00');
  const [stream, setStream] = useState<'Science' | 'Humanities' | 'Business'>('Science');
  const [educationSystem, setEducationSystem] = useState<'national' | 'madrasah' | 'english_medium'>('national');
  const [isSecondTimer, setIsSecondTimer] = useState<boolean>(false);
  const [isTribal, setIsTribal] = useState<boolean>(false);

  const [hscBiologyGp, setHscBiologyGp] = useState<string>('5.00');
  const [hscHigherMathGp, setHscHigherMathGp] = useState<string>('5.00');
  const [hscPhysicsGp, setHscPhysicsGp] = useState<string>('5.00');
  const [hscChemistryGp, setHscChemistryGp] = useState<string>('5.00');

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'eligible' | 'not_eligible'>('all');

  const handleReset = () => {
    setSscYear(2024);
    setHscYear(2026);
    setSscGpa('5.00');
    setHscGpa('5.00');
    setStream('Science');
    setEducationSystem('national');
    setIsSecondTimer(false);
    setIsTribal(false);
    setHscBiologyGp('5.00');
    setHscHigherMathGp('5.00');
    setHscPhysicsGp('5.00');
    setHscChemistryGp('5.00');
    setIsEvaluated(false);
    setValidationError(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const ssc = parseFloat(sscGpa);
    const hsc = parseFloat(hscGpa);

    if (isNaN(ssc) || ssc < 0 || ssc > 5.0) {
      setValidationError('সঠিক এসএসসি জিপিএ (০.০০ থেকে ৫.০০) লিখুন।');
      setIsEvaluated(false);
      return;
    }
    if (isNaN(hsc) || hsc < 0 || hsc > 5.0) {
      setValidationError('সঠিক এইচএসসি জিপিএ (০.০০ থেকে ৫.০০) লিখুন।');
      setIsEvaluated(false);
      return;
    }

    setIsEvaluated(true);
  };

  const results: EvaluationResult[] = useMemo(() => {
    if (!isEvaluated) return [];

    const ssc = cleanDecimal(parseFloat(sscGpa) || 0);
    const hsc = cleanDecimal(parseFloat(hscGpa) || 0);
    const combinedGpa = cleanDecimal(ssc + hsc);
    const bioGp = hscBiologyGp !== '' ? cleanDecimal(parseFloat(hscBiologyGp)) : null;
    const mathGp = hscHigherMathGp !== '' ? cleanDecimal(parseFloat(hscHigherMathGp)) : null;
    const physGp = hscPhysicsGp !== '' ? cleanDecimal(parseFloat(hscPhysicsGp)) : null;
    const chemGp = hscChemistryGp !== '' ? cleanDecimal(parseFloat(hscChemistryGp)) : null;

    return VERIFIED_ADMISSION_PROGRAMS.map((prog) => {
      const checklist: ChecklistItem[] = [];
      let hasMissingInfo = false;
      let hasFailedRequirement = false;

      const streamMatches = prog.eligibility.acceptedStreams.includes(stream);
      checklist.push({
        id: 'stream',
        label: 'শিক্ষা বিভাগ',
        required: prog.eligibility.acceptedStreams
          .map((s) => (s === 'Science' ? 'বিজ্ঞান' : s === 'Humanities' ? 'মানবিক' : 'ব্যবসায় শিক্ষা'))
          .join(' / '),
        studentValue: stream === 'Science' ? 'বিজ্ঞান' : stream === 'Humanities' ? 'মানবিক' : 'ব্যবসায় শিক্ষা',
        passed: streamMatches,
      });
      if (!streamMatches) hasFailedRequirement = true;

      const hscYearMatches = prog.eligibility.acceptedHscYears.includes(hscYear);
      const secondTimeAllowed = prog.eligibility.allowsSecondTime;
      const isSecondTimeFailure = isSecondTimer && !secondTimeAllowed;
      const hscPassed = hscYearMatches && !isSecondTimeFailure;

      checklist.push({
        id: 'hsc_year',
        label: 'পাসের বছর ও ২য় বার সুযোগ',
        required: secondTimeAllowed
          ? `${prog.eligibility.acceptedHscYears.map((y) => toBengaliNumber(y, 0)).join(', ')} (২য় বার প্রযোজ্য)`
          : `${prog.eligibility.acceptedHscYears.map((y) => toBengaliNumber(y, 0)).join(', ')} (শুধু ১ম বার)`,
        studentValue: `${toBengaliNumber(hscYear, 0)} ${isSecondTimer ? '(২য় বার)' : '(১ম বার)'}`,
        passed: hscPassed,
      });
      if (!hscPassed) hasFailedRequirement = true;

      const minSsc =
        isTribal && prog.eligibility.minSscGpaTribal !== undefined
          ? prog.eligibility.minSscGpaTribal
          : prog.eligibility.minSscGpaGeneral;
      const sscPassed = ssc >= minSsc;
      checklist.push({
        id: 'ssc_gpa',
        label: 'এসএসসি ন্যূনতম জিপিএ',
        required: `ন্যূনতম ${toBengaliNumber(minSsc)}`,
        studentValue: toBengaliNumber(ssc),
        passed: sscPassed,
      });
      if (!sscPassed) hasFailedRequirement = true;

      const minHsc =
        isTribal && prog.eligibility.minHscGpaTribal !== undefined
          ? prog.eligibility.minHscGpaTribal
          : prog.eligibility.minHscGpaGeneral;
      const hscGpaPassed = hsc >= minHsc;
      checklist.push({
        id: 'hsc_gpa',
        label: 'এইচএসসি ন্যূনতম জিপিএ',
        required: `ন্যূনতম ${toBengaliNumber(minHsc)}`,
        studentValue: toBengaliNumber(hsc),
        passed: hscGpaPassed,
      });
      if (!hscGpaPassed) hasFailedRequirement = true;

      const minCombined =
        isTribal && prog.eligibility.minCombinedGpaTribal !== undefined
          ? prog.eligibility.minCombinedGpaTribal
          : prog.eligibility.minCombinedGpaGeneral;
      const combinedPassed = combinedGpa >= minCombined;
      checklist.push({
        id: 'combined_gpa',
        label: 'মোট সম্মিলিত জিপিএ',
        required: `ন্যূনতম ${toBengaliNumber(minCombined)}`,
        studentValue: toBengaliNumber(combinedGpa),
        passed: combinedPassed,
      });
      if (!combinedPassed) hasFailedRequirement = true;

      if (prog.eligibility.subjectRequirements && stream === 'Science') {
        for (const req of prog.eligibility.subjectRequirements) {
          const sub = req.subject.toLowerCase();
          const val = sub.includes('biology')
            ? bioGp
            : sub.includes('math')
            ? mathGp
            : sub.includes('physic')
            ? physGp
            : sub.includes('chem')
            ? chemGp
            : null;

          if (val === null) {
            checklist.push({
              id: `sub_${req.subject}`,
              label: req.labelBangla,
              required: `ন্যূনতম ${toBengaliNumber(req.minGradePoint)}`,
              studentValue: 'তথ্য দেওয়া হয়নি',
              passed: false,
              missingInfo: true,
            });
            hasMissingInfo = true;
          } else {
            const passed = val >= req.minGradePoint;
            checklist.push({
              id: `sub_${req.subject}`,
              label: req.labelBangla,
              required: `ন্যূনতম ${toBengaliNumber(req.minGradePoint)}`,
              studentValue: toBengaliNumber(val),
              passed,
            });
            if (!passed) hasFailedRequirement = true;
          }
        }
      }

      const status = hasFailedRequirement
        ? 'not_eligible'
        : hasMissingInfo
        ? 'more_info_needed'
        : 'eligible';

      return { program: prog, status, checklist };
    });
  }, [
    isEvaluated,
    sscYear,
    hscYear,
    sscGpa,
    hscGpa,
    stream,
    isSecondTimer,
    isTribal,
    hscBiologyGp,
    hscHigherMathGp,
    hscPhysicsGp,
    hscChemistryGp,
  ]);

  const filteredResults = useMemo(() => {
    if (filterStatus === 'all') return results;
    return results.filter((r) => r.status === filterStatus);
  }, [results, filterStatus]);

  const eligibleCount = results.filter((r) => r.status === 'eligible').length;
  const notEligibleCount = results.filter((r) => r.status === 'not_eligible').length;

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-heading font-semibold transition-colors focus:outline-hidden ${
    isDark
      ? 'bg-[#060D17] border-white/20 text-white focus:border-[#10B981]'
      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
  }`;

  return (
    <ToolPageLayout
      toolNumber="১২"
      toolName="ভর্তি যোগ্যতা যাচাইকারী"
      categoryLabel="বিশ্ববিদ্যালয় সরঞ্জাম"
      iconName="CheckCircle2"
      accentColor="#10B981"
      description="আপনার এসএসসি ও এইচএসসি জিপিএ, পাসের সাল এবং বিষয়ভিত্তিক পয়েন্ট অনুযায়ী বাংলাদেশের সকল মেডিকেল, প্রকৌশল, পাবলিক, গুচ্ছ, কৃষি, ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়ে ভর্তির যোগ্যতা যাচাই করুন।"
    >
      <div className="space-y-6">
        <form
          onSubmit={handleCheck}
          className={`rounded-2xl p-5 sm:p-7 border space-y-5 transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/20">
            <h2 className={`text-base sm:text-lg font-heading font-bold ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
              শিক্ষাগত তথ্য প্রদান করুন
            </h2>
            <span className={`text-xs font-heading ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              সর্বমোট {toBengaliNumber(VERIFIED_ADMISSION_PROGRAMS.length, 0)}টি ভর্তি ইউনিট ও ক্যাটাগরি
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold block">১. শিক্ষা শাখা</label>
              <select value={stream} onChange={(e) => setStream(e.target.value as any)} className={inputClass}>
                <option value="Science">বিজ্ঞান</option>
                <option value="Humanities">মানবিক</option>
                <option value="Business">ব্যবসায় শিক্ষা</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold block">২. শিক্ষাক্রম</label>
              <select
                value={educationSystem}
                onChange={(e) => setEducationSystem(e.target.value as any)}
                className={inputClass}
              >
                <option value="national">সাধারণ বোর্ড (SSC / HSC)</option>
                <option value="madrasah">মাদ্রাসা বোর্ড (দাখিল / আলিম)</option>
                <option value="english_medium">ইংলিশ মিডিয়াম (O / A Level)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold block">৩. এসএসসি পাসের বছর</label>
              <select
                value={sscYear}
                onChange={(e) => setSscYear(parseInt(e.target.value, 10))}
                className={inputClass}
              >
                <option value={2024}>২০২৪</option>
                <option value={2023}>২০২৩</option>
                <option value={2022}>২০২২</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold block">৪. এইচএসসি পাসের বছর</label>
              <select
                value={hscYear}
                onChange={(e) => setHscYear(parseInt(e.target.value, 10))}
                className={inputClass}
              >
                <option value={2026}>২০২৬ (১ম বার)</option>
                <option value={2025}>২০২৫ (২য় বার)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="elig-ssc-gpa" className="text-xs font-heading font-bold block">
                ৫. এসএসসি জিপিএ *
              </label>
              <input
                id="elig-ssc-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={sscGpa}
                onChange={(e) => setSscGpa(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="elig-hsc-gpa" className="text-xs font-heading font-bold block">
                ৬. এইচএসসি জিপিএ *
              </label>
              <input
                id="elig-hsc-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={hscGpa}
                onChange={(e) => setHscGpa(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="font-heading text-xs font-bold block">২য় বার পরীক্ষার্থী?</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  পূর্বের বছরে পরীক্ষা দিয়ে থাকলে
                </span>
              </div>
              <input
                type="checkbox"
                checked={isSecondTimer}
                onChange={(e) => setIsSecondTimer(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>

            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="font-heading text-xs font-bold block">পার্বত্য ও ক্ষুদ্র নৃ-গোষ্ঠী?</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  মেডিকেল কোটা প্রযোজ্য
                </span>
              </div>
              <input
                type="checkbox"
                checked={isTribal}
                onChange={(e) => setIsTribal(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>
          </div>

          {stream === 'Science' && (
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-sky-500/10 border-sky-500/25' : 'bg-sky-50 border-sky-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#006B98] dark:text-[#38BDF8]">
                <Info className="w-4 h-4" />
                <span>বিষয়ভিত্তিক এইচএসসি গ্রেড পয়েন্ট (মেডিকেল ও প্রকৌশল যাচাইয়ের জন্য):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-heading font-semibold block mb-1">জীববিজ্ঞান জিপি</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    value={hscBiologyGp}
                    onChange={(e) => setHscBiologyGp(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-heading font-semibold block mb-1">উচ্চতর গণিত জিপি</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    value={hscHigherMathGp}
                    onChange={(e) => setHscHigherMathGp(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-heading font-semibold block mb-1">পদার্থবিজ্ঞান জিপি</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    value={hscPhysicsGp}
                    onChange={(e) => setHscPhysicsGp(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-heading font-semibold block mb-1">রসায়ন জিপি</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    value={hscChemistryGp}
                    onChange={(e) => setHscChemistryGp(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className={`py-3 px-5 rounded-xl border text-xs sm:text-sm font-heading font-semibold flex items-center gap-1.5 cursor-pointer ${
                isDark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>রিসেট</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>যোগ্যতা যাচাই করুন</span>
            </button>
          </div>
        </form>

        {isEvaluated && (
          <div className="space-y-5">
            <div
              className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-heading font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>যোগ্য: {toBengaliNumber(eligibleCount, 0)}টি</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 font-heading font-bold text-xs">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>শর্ত পূরণ হয়নি: {toBengaliNumber(notEligibleCount, 0)}টি</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-heading">
                {[
                  { id: 'all', label: `সব (${toBengaliNumber(results.length, 0)})` },
                  { id: 'eligible', label: `যোগ্য (${toBengaliNumber(eligibleCount, 0)})` },
                  { id: 'not_eligible', label: `অযোগ্য (${toBengaliNumber(notEligibleCount, 0)})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterStatus(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer font-semibold transition-all ${
                      filterStatus === tab.id
                        ? 'bg-[#006B98] text-white'
                        : isDark
                        ? 'bg-white/5 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredResults.map(({ program, status, checklist }) => {
                const isEligible = status === 'eligible';
                const isNotEligible = status === 'not_eligible';

                return (
                  <div
                    key={program.id}
                    className={`rounded-2xl border p-5 space-y-4 transition-colors ${
                      isDark ? 'bg-[#0B1526]/85' : 'bg-white shadow-xs'
                    } ${
                      isEligible
                        ? isDark
                          ? 'border-emerald-500/40'
                          : 'border-emerald-300'
                        : isNotEligible
                        ? isDark
                          ? 'border-rose-500/30'
                          : 'border-rose-200'
                        : isDark
                        ? 'border-sky-500/30'
                        : 'border-sky-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/15">
                      <div>
                        <span className="text-xs font-heading font-semibold text-[#006B98] dark:text-[#38BDF8] block">
                          {program.institution}
                        </span>
                        <h3 className={`text-base sm:text-lg font-heading font-bold ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                          {program.programName}
                        </h3>
                      </div>

                      {isEligible ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-heading font-bold text-xs shrink-0 self-start">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>আবেদনের যোগ্য</span>
                        </span>
                      ) : isNotEligible ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 font-heading font-bold text-xs shrink-0 self-start">
                          <XCircle className="w-4 h-4" />
                          <span>শর্ত পূরণ হয়নি</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-500 font-heading font-bold text-xs shrink-0 self-start">
                          <HelpCircle className="w-4 h-4" />
                          <span>তথ্য প্রয়োজন</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      {checklist.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 ${
                            item.passed
                              ? isDark
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : item.missingInfo
                              ? isDark
                                ? 'bg-sky-500/10 border-sky-500/25 text-sky-200'
                                : 'bg-sky-50 border-sky-200 text-sky-950'
                              : isDark
                              ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
                              : 'bg-rose-50 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-heading font-semibold block">{item.label}</span>
                            <span className="text-[11px] opacity-80 block">শর্ত: {item.required}</span>
                            <span className="text-[11px] font-bold block">আপনার: {item.studentValue}</span>
                          </div>
                          {item.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : item.missingInfo ? (
                            <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-heading">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {program.scoringFormula.formulaDescriptionBangla}
                      </span>
                      <a
                        href={program.authority.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#006B98] dark:text-[#38BDF8] font-bold hover:underline"
                      >
                        <span>অফিসিয়াল পোর্টাল</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};
