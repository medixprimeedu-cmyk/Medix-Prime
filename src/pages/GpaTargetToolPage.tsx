import React, { useState, useMemo } from 'react';
import { Target, ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2, Info, ExternalLink, HelpCircle, Users } from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { VERIFIED_ADMISSION_PROGRAMS, VerifiedAdmissionProgram, toBengaliNumber, cleanDecimal } from '../data/admissionRules';

export const GpaTargetToolPage: React.FC = () => {
  // Form State
  const [selectedProgramId, setSelectedProgramId] = useState<string>('dgme-mbbs');
  const [sscGpa, setSscGpa] = useState<string>('');
  const [hscGpa, setHscGpa] = useState<string>('');
  const [candidateCategory, setCandidateCategory] = useState<'first_time' | 'second_time_general' | 'second_time_admitted'>('first_time');
  const [isTribal, setIsTribal] = useState<boolean>(false);
  const [targetScore, setTargetScore] = useState<string>('');

  // Optional Comparison State
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [compSscGpa, setCompSscGpa] = useState<string>('');
  const [compHscGpa, setCompHscGpa] = useState<string>('');
  const [compCategory, setCompCategory] = useState<'first_time' | 'second_time_general' | 'second_time_admitted'>('first_time');

  // Trigger calculation result visibility
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Selected Program
  const program: VerifiedAdmissionProgram = useMemo(() => {
    return VERIFIED_ADMISSION_PROGRAMS.find((p) => p.id === selectedProgramId) || VERIFIED_ADMISSION_PROGRAMS[0];
  }, [selectedProgramId]);

  // Handle Reset
  const handleReset = () => {
    setSscGpa('');
    setHscGpa('');
    setCandidateCategory('first_time');
    setIsTribal(false);
    setTargetScore('');
    setShowComparison(false);
    setCompSscGpa('');
    setCompHscGpa('');
    setCompCategory('first_time');
    setIsCalculated(false);
    setValidationError(null);
  };

  // Handle Calculate
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const ssc = parseFloat(sscGpa);
    const hsc = parseFloat(hscGpa);
    const target = parseFloat(targetScore);

    if (isNaN(ssc) || ssc < 0 || ssc > 5.0) {
      setValidationError('অনুগ্রহ করে সঠিক SSC GPA (০.০০ থেকে ৫.০০) প্রদান করুন।');
      setIsCalculated(false);
      return;
    }
    if (isNaN(hsc) || hsc < 0 || hsc > 5.0) {
      setValidationError('অনুগ্রহ করে সঠিক HSC GPA (০.০০ থেকে ৫.০০) প্রদান করুন।');
      setIsCalculated(false);
      return;
    }
    if (isNaN(target) || target <= 0) {
      setValidationError('অনুগ্রহ করে তোমার প্রত্যাশিত টার্গেট স্কোর লিখুন।');
      setIsCalculated(false);
      return;
    }

    setIsCalculated(true);
  };

  // Primary Calculation Results
  const calculation = useMemo(() => {
    if (!isCalculated) return null;

    const ssc = cleanDecimal(parseFloat(sscGpa) || 0);
    const hsc = cleanDecimal(parseFloat(hscGpa) || 0);
    const target = cleanDecimal(parseFloat(targetScore) || 0);

    const sscMultiplier = program.scoringFormula.sscGpaMultiplier;
    const hscMultiplier = program.scoringFormula.hscGpaMultiplier;

    const sscScore = cleanDecimal(ssc * sscMultiplier);
    const hscScore = cleanDecimal(hsc * hscMultiplier);

    let deduction = 0;
    if (candidateCategory === 'second_time_general') {
      deduction = program.scoringFormula.secondTimeDeductionGeneral;
    } else if (candidateCategory === 'second_time_admitted') {
      deduction = program.scoringFormula.secondTimeDeductionAdmitted;
    }

    const currentAcademicTotal = cleanDecimal(sscScore + hscScore - deduction);
    const requiredExamMarks = cleanDecimal(target - currentAcademicTotal);

    // Max Achievable Score under this formula
    const maxSscScore = cleanDecimal(5.0 * sscMultiplier);
    const maxHscScore = cleanDecimal(5.0 * hscMultiplier);
    const maxAcademic = cleanDecimal(maxSscScore + maxHscScore - deduction);
    const maxAchievable = cleanDecimal(program.exam.totalMarks + maxAcademic);

    // Check Eligibility boundaries
    const minSsc = isTribal && program.eligibility.minSscGpaTribal !== undefined
      ? program.eligibility.minSscGpaTribal
      : program.eligibility.minSscGpaGeneral;
    const minHsc = isTribal && program.eligibility.minHscGpaTribal !== undefined
      ? program.eligibility.minHscGpaTribal
      : program.eligibility.minHscGpaGeneral;
    const minCombined = isTribal && program.eligibility.minCombinedGpaTribal !== undefined
      ? program.eligibility.minCombinedGpaTribal
      : program.eligibility.minCombinedGpaGeneral;

    const meetsSsc = ssc >= minSsc;
    const meetsHsc = hsc >= minHsc;
    const meetsCombined = cleanDecimal(ssc + hsc) >= minCombined;
    const isEligible = meetsSsc && meetsHsc && meetsCombined;

    // Increments (usually 0.25 on MCQ)
    const increment = program.exam.negativeMarkPerWrong || 0.25;
    const remainder = Math.abs(requiredExamMarks % increment);
    const isIncrementAttainable = remainder < 0.001 || Math.abs(remainder - increment) < 0.001;
    const nextAttainableMarks = !isIncrementAttainable && requiredExamMarks > 0
      ? cleanDecimal(Math.ceil(requiredExamMarks / increment) * increment)
      : requiredExamMarks;

    return {
      ssc,
      hsc,
      target,
      sscScore,
      hscScore,
      deduction,
      currentAcademicTotal,
      requiredExamMarks,
      nextAttainableMarks,
      isIncrementAttainable,
      maxAchievable,
      isEligible,
      minSsc,
      minHsc,
      minCombined,
      meetsSsc,
      meetsHsc,
      meetsCombined,
    };
  }, [isCalculated, sscGpa, hscGpa, targetScore, candidateCategory, isTribal, program]);

  // Comparison Calculation
  const comparison = useMemo(() => {
    if (!showComparison || !calculation) return null;
    const cSsc = cleanDecimal(parseFloat(compSscGpa) || 0);
    const cHsc = cleanDecimal(parseFloat(compHscGpa) || 0);
    if (isNaN(cSsc) || isNaN(cHsc) || cSsc <= 0 || cHsc <= 0) return null;

    const sscMultiplier = program.scoringFormula.sscGpaMultiplier;
    const hscMultiplier = program.scoringFormula.hscGpaMultiplier;
    const cSscScore = cleanDecimal(cSsc * sscMultiplier);
    const cHscScore = cleanDecimal(cHsc * hscMultiplier);

    let cDeduction = 0;
    if (compCategory === 'second_time_general') {
      cDeduction = program.scoringFormula.secondTimeDeductionGeneral;
    } else if (compCategory === 'second_time_admitted') {
      cDeduction = program.scoringFormula.secondTimeDeductionAdmitted;
    }

    const cAcademicTotal = cleanDecimal(cSscScore + cHscScore - cDeduction);
    const cRequiredExamMarks = cleanDecimal(calculation.target - cAcademicTotal);
    const diff = cleanDecimal(calculation.requiredExamMarks - cRequiredExamMarks);

    return {
      cSsc,
      cHsc,
      cAcademicTotal,
      cRequiredExamMarks,
      diff,
    };
  }, [showComparison, calculation, compSscGpa, compHscGpa, compCategory, program]);

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#172B3A] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-medium text-[#006B98] hover:text-[#092C43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরুন</span>
          </Link>

          <span className="text-xs font-heading text-[#617381] bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
            ভর্তি টুল ১ / ৩
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-heading font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>টার্গেট ক্যালকুলেটর</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#172B3A] tracking-tight">
            আমার GPA, আমার টার্গেট
          </h1>

          <p className="font-body text-sm text-[#617381] leading-relaxed max-w-2xl">
            তোমার প্রত্যাশিত টার্গেট মোট স্কোর অর্জন করতে সংশ্লিষ্ট বিশ্ববিদ্যালয়ের অফিসিয়াল নম্বর বণ্টন অনুযায়ী ভর্তি পরীক্ষায় ঠিক কত নম্বর পেতে হবে তা নির্ভুলভাবে হিসাব করো।
          </p>
        </div>

        {/* Session & Circular Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm space-y-2 font-body">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold text-amber-950">
                অফিসিয়াল সার্কুলার তথ্য ও সেশন স্ট্যাটাস:
              </p>
              <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                {program.hsc2026NoticeBangla}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-heading font-medium text-amber-900">
                <span className="bg-amber-100/80 px-2 py-0.5 rounded-md">
                  যাচাইকৃত সেশন: <strong>{program.verifiedSession}</strong>
                </span>
                <span>•</span>
                <span>কর্তৃপক্ষ: {program.authority.name}</span>
                <span>•</span>
                <a
                  href={program.authority.circularUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#006B98] hover:underline font-bold"
                >
                  <span>অফিসিয়াল পোর্টাল</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-lg font-heading font-bold text-[#172B3A] pb-3 border-b border-[#F1F5F9] flex items-center justify-between">
            <span>তথ্য প্রদান করো</span>
            <span className="text-xs font-normal text-[#617381]">(* চিহ্নিত ফিল্ডগুলো আবশ্যক)</span>
          </h2>

          {/* Program Selection Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="program-select" className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
              ১. ভর্তি প্রোগ্রাম ও প্রতিষ্ঠান নির্বাচন করো *
            </label>
            <select
              id="program-select"
              value={selectedProgramId}
              onChange={(e) => {
                setSelectedProgramId(e.target.value);
                setIsCalculated(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white font-heading text-sm text-[#172B3A] focus:outline-hidden focus:ring-2 focus:ring-[#006B98]"
            >
              {VERIFIED_ADMISSION_PROGRAMS.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.institutionShort} — {prog.programName} ({prog.verifiedSession})
                </option>
              ))}
            </select>
          </div>

          {/* SSC & HSC GPA Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ssc-gpa" className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
                ২. SSC / সমমান GPA (৪র্থ বিষয়সহ) *
              </label>
              <input
                id="ssc-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                placeholder="যেমন: ৫.০০"
                value={sscGpa}
                onChange={(e) => setSscGpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white font-latin font-semibold text-sm text-[#172B3A] focus:outline-hidden focus:ring-2 focus:ring-[#006B98]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hsc-gpa" className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
                ৩. HSC / সমমান GPA (৪র্থ বিষয়সহ) *
              </label>
              <input
                id="hsc-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                placeholder="যেমন: ৫.০০"
                value={hscGpa}
                onChange={(e) => setHscGpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white font-latin font-semibold text-sm text-[#172B3A] focus:outline-hidden focus:ring-2 focus:ring-[#006B98]"
                required
              />
            </div>
          </div>

          {/* Candidate Category & Second Timer rules */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
              ৪. পরীক্ষার্থীর ধরন ও ক্যাটাগরি *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                candidateCategory === 'first_time'
                  ? 'border-[#006B98] bg-[#006B98]/5 text-[#006B98] font-bold'
                  : 'border-[#CBD5E1] bg-white text-[#172B3A] hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="candidateCategory"
                    checked={candidateCategory === 'first_time'}
                    onChange={() => setCandidateCategory('first_time')}
                    className="accent-[#006B98]"
                  />
                  <span className="text-xs font-heading">১ম বার পরীক্ষার্থী</span>
                </div>
                <span className="text-[10px] text-gray-500 font-body mt-1">কোনো নম্বর কর্তন নেই</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                candidateCategory === 'second_time_general'
                  ? 'border-[#006B98] bg-[#006B98]/5 text-[#006B98] font-bold'
                  : 'border-[#CBD5E1] bg-white text-[#172B3A] hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="candidateCategory"
                    checked={candidateCategory === 'second_time_general'}
                    onChange={() => setCandidateCategory('second_time_general')}
                    disabled={!program.eligibility.allowsSecondTime}
                    className="accent-[#006B98]"
                  />
                  <span className="text-xs font-heading">২য় বার (সাধারণ)</span>
                </div>
                <span className="text-[10px] text-gray-500 font-body mt-1">
                  {program.eligibility.allowsSecondTime
                    ? `অফিসিয়াল কর্তন: -${toBengaliNumber(program.scoringFormula.secondTimeDeductionGeneral)}`
                    : 'এই প্রোগ্রামে ২য় বার গ্রহণযোগ্য নয়'}
                </span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                candidateCategory === 'second_time_admitted'
                  ? 'border-[#006B98] bg-[#006B98]/5 text-[#006B98] font-bold'
                  : 'border-[#CBD5E1] bg-white text-[#172B3A] hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="candidateCategory"
                    checked={candidateCategory === 'second_time_admitted'}
                    onChange={() => setCandidateCategory('second_time_admitted')}
                    disabled={!program.eligibility.allowsSecondTime}
                    className="accent-[#006B98]"
                  />
                  <span className="text-xs font-heading">পূর্বে ভর্তিকৃত ২য় বার</span>
                </div>
                <span className="text-[10px] text-gray-500 font-body mt-1">
                  {program.eligibility.allowsSecondTime
                    ? `অফিসিয়াল কর্তন: -${toBengaliNumber(program.scoringFormula.secondTimeDeductionAdmitted)}`
                    : 'গ্রহণযোগ্য নয়'}
                </span>
              </label>
            </div>
          </div>

          {/* Quota Option (If program supports tribal relaxation) */}
          {program.eligibility.minCombinedGpaTribal !== undefined && (
            <div className="p-3 bg-gray-50 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="font-heading text-xs sm:text-sm font-bold text-[#172B3A] block">
                  উপজাতি / অনগ্রসর ও পার্বত্য জেলা কোটা
                </span>
                <span className="text-[11px] font-body text-[#617381]">
                  মেডিকেলে উপজাতি প্রার্থীদের মোট জিপিএ ন্যূনতম ৮.০০ শর্ত প্রযোজ্য।
                </span>
              </div>
              <input
                type="checkbox"
                checked={isTribal}
                onChange={(e) => setIsTribal(e.target.checked)}
                className="w-4 h-4 accent-[#006B98] cursor-pointer"
              />
            </div>
          )}

          {/* Desired Target Score Input */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="target-score" className="text-xs sm:text-sm font-heading font-bold text-[#172B3A]">
                ৫. তোমার প্রত্যাশিত টার্গেট মোট স্কোর লিখুন *
              </label>
              <span className="text-xs font-heading text-[#006B98] font-semibold">
                পূর্ণমান: {toBengaliNumber(program.scoringFormula.totalMeritMarks)}
              </span>
            </div>
            <input
              id="target-score"
              type="number"
              step="0.25"
              min="0"
              max={program.scoringFormula.totalMeritMarks + 50}
              placeholder={`যেমন: ${program.scoringFormula.totalMeritMarks === 300 ? '২৬০.০০' : program.scoringFormula.totalMeritMarks === 120 ? '১০৫.০০' : '৭৫.০০'}`}
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white font-latin font-bold text-base text-[#172B3A] focus:outline-hidden focus:ring-2 focus:ring-[#006B98]"
              required
            />
            <p className="text-[11px] text-[#617381] font-body">
              * {program.institutionShort}-এর মেধা স্কোর সর্বমোট {toBengaliNumber(program.scoringFormula.totalMeritMarks)} নম্বরের ভিত্তিতে নির্ধারিত হয়।
            </p>
          </div>

          {/* Optional Comparison Toggle */}
          <div className="pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#006B98] hover:underline"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{showComparison ? 'প্রতিদ্বন্দ্বী তুলনা বন্ধ করো' : 'অন্য প্রার্থীর সাথে তুলনা করো (ঐচ্ছিক)'}</span>
            </button>

            {showComparison && (
              <div className="mt-3 p-4 rounded-xl bg-purple-50/60 border border-purple-200/60 space-y-3 animate-fadeIn">
                <span className="text-xs font-heading font-bold text-[#2B1055] block">
                  প্রতিদ্বন্দ্বী / অন্য পরীক্ষার্থীর তথ্য
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="অন্য প্রার্থীর SSC GPA"
                    value={compSscGpa}
                    onChange={(e) => setCompSscGpa(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-purple-200 bg-white text-xs font-latin font-semibold text-[#172B3A]"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="অন্য প্রার্থীর HSC GPA"
                    value={compHscGpa}
                    onChange={(e) => setCompHscGpa(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-purple-200 bg-white text-xs font-latin font-semibold text-[#172B3A]"
                  />
                </div>
                <div className="flex gap-4 text-xs font-heading">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="compCat"
                      checked={compCategory === 'first_time'}
                      onChange={() => setCompCategory('first_time')}
                    />
                    <span>১ম বার</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="compCat"
                      checked={compCategory === 'second_time_general'}
                      onChange={() => setCompCategory('second_time_general')}
                      disabled={!program.eligibility.allowsSecondTime}
                    />
                    <span>২য় বার (সাধারণ)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Actions: Calculate & Reset */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-[#006B98] hover:bg-[#00567a] text-white font-heading font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>হিসাব করুন</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-5 rounded-xl border border-[#CBD5E1] hover:bg-gray-50 text-[#617381] font-heading font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>রিসেট</span>
            </button>
          </div>
        </form>

        {/* RESULTS SECTION (Rendered only after valid user input) */}
        {calculation && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Eligibility Alert (if student does not meet minimum GPA requirements) */}
            {!calculation.isEligible && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm space-y-1.5 font-body">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-rose-950 text-sm">
                      সতর্কতা: আবেদনের ন্যূনতম জিপিএ শর্ত পূরণ হচ্ছে না
                    </h4>
                    <p className="text-xs text-rose-800">
                      {program.institutionShort}-এ আবেদনের জন্য ন্যূনতম SSC জিপিএ {toBengaliNumber(calculation.minSsc)}, HSC জিপিএ {toBengaliNumber(calculation.minHsc)} এবং মোট জিপিএ {toBengaliNumber(calculation.minCombined)} প্রয়োজন। তোমার SSC ({toBengaliNumber(calculation.ssc)}) ও HSC ({toBengaliNumber(calculation.hsc)}) জিপিএ এই ন্যূনতম শর্তের নিচে রয়েছে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Core Output Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-xs font-heading font-semibold text-[#006B98] uppercase tracking-wide block">
                    ফলাফল বিশ্লেষণ
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#172B3A]">
                    ভর্তি পরীক্ষায় প্রয়োজনীয় নম্বর
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-gray-500 font-heading block">টার্গেট স্কোর</span>
                  <span className="text-lg font-latin font-bold text-[#006B98]">
                    {toBengaliNumber(calculation.target)} / {toBengaliNumber(program.scoringFormula.totalMeritMarks)}
                  </span>
                </div>
              </div>

              {/* Big Highlight Box */}
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${
                calculation.requiredExamMarks > program.exam.totalMarks
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : calculation.target > calculation.maxAchievable
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : calculation.requiredExamMarks <= 0
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <span className="text-xs font-heading font-bold uppercase tracking-wider block opacity-80">
                  ভর্তি পরীক্ষায় প্রয়োজনীয় নেট নম্বর (পূর্ণমান: {toBengaliNumber(program.exam.totalMarks)})
                </span>

                <div className="text-4xl sm:text-5xl font-latin font-black tracking-tight">
                  {toBengaliNumber(calculation.requiredExamMarks)}
                </div>

                {/* State Explanations */}
                <div className="pt-2 text-xs sm:text-sm font-heading font-medium max-w-xl mx-auto space-y-1">
                  {calculation.target > calculation.maxAchievable ? (
                    <p className="text-rose-700">
                      ⚠️ তোমার নির্বাচিত টার্গেট ({toBengaliNumber(calculation.target)}) এই প্রোগ্রামে সর্বোচ্চ সম্ভাব্য স্কোরের ({toBengaliNumber(calculation.maxAchievable)}) চেয়ে বেশি। এটি অর্জনযোগ্য নয়।
                    </p>
                  ) : calculation.requiredExamMarks > program.exam.totalMarks ? (
                    <p className="text-rose-700">
                      ⚠️ লক্ষ্যমাত্রা অর্জনে পরীক্ষায় {toBengaliNumber(calculation.requiredExamMarks)} নম্বর প্রয়োজন, যা ভর্তি পরীক্ষার পূর্ণমান ({toBengaliNumber(program.exam.totalMarks)})-এর চেয়ে বেশি। বর্তমান GPA নিয়ে এই টার্গেট অর্জন সম্ভব নয়।
                    </p>
                  ) : calculation.requiredExamMarks <= 0 ? (
                    <div className="space-y-1">
                      <p className="text-blue-800">
                        🎉 তোমার বর্তমান একাডেমিক স্কোর ({toBengaliNumber(calculation.currentAcademicTotal)}) ইতিমধ্যে লক্ষ্যমাত্রা ({toBengaliNumber(calculation.target)}) অর্জন বা অতিক্রম করেছে!
                      </p>
                      <p className="text-[11px] text-blue-700">
                        * তবে অফিসিয়াল নিয়মানুযায়ী লিখিত পরীক্ষায় ন্যূনতম পাস নম্বর <strong>({toBengaliNumber(program.exam.passMark)})</strong> অর্জন করা বাধ্যতামূলক।
                      </p>
                    </div>
                  ) : calculation.requiredExamMarks < program.exam.passMark ? (
                    <div className="space-y-1">
                      <p className="text-emerald-800">
                        গাণিতিকভাবে {toBengaliNumber(calculation.requiredExamMarks)} নম্বর পেলেই টার্গেট পূরণ হয়।
                      </p>
                      <p className="text-amber-800 text-[11px] font-bold">
                        * তবে {program.institutionShort}-এর অফিসিয়াল ন্যূনতম পাস নম্বর <strong>{toBengaliNumber(program.exam.passMark)}</strong>। মেধা তালিকায় স্থান পেতে অন্তত {toBengaliNumber(program.exam.passMark)} পেতে হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-emerald-800">
                      <p>
                        ভর্তি পরীক্ষায় ১০০ নম্বরের মধ্যে অন্তত <strong>{toBengaliNumber(calculation.requiredExamMarks)}</strong> পেলেই তোমার কাঙ্ক্ষিত টার্গেট স্কোর অর্জিত হবে।
                      </p>
                      {!calculation.isIncrementAttainable && (
                        <p className="text-[11px] text-emerald-700">
                          (০.২৫ নেগেটিভ মার্কিং ইনক্রিমেন্টের ভিত্তিতে পরবর্তী অর্জনযোগ্য পূর্ণ স্কোর: <strong>{toBengaliNumber(calculation.nextAttainableMarks)}</strong>)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step Breakdown Grid */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#172B3A]">
                  ধাপে ধাপে নম্বর বিশ্লেষণ (অফিসিয়াল ফর্মুলা):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-gray-500 font-heading block">১. SSC একাডেমিক স্কোর অবদান</span>
                    <span className="font-heading font-bold text-sm text-[#172B3A]">
                      GPA {toBengaliNumber(calculation.ssc)} × {toBengaliNumber(program.scoringFormula.sscGpaMultiplier)} = {toBengaliNumber(calculation.sscScore)} নম্বর
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      (সর্বোচ্চ: {toBengaliNumber(5 * program.scoringFormula.sscGpaMultiplier)} নম্বর)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-gray-500 font-heading block">২. HSC একাডেমিক স্কোর অবদান</span>
                    <span className="font-heading font-bold text-sm text-[#172B3A]">
                      GPA {toBengaliNumber(calculation.hsc)} × {toBengaliNumber(program.scoringFormula.hscGpaMultiplier)} = {toBengaliNumber(calculation.hscScore)} নম্বর
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      (সর্বোচ্চ: {toBengaliNumber(5 * program.scoringFormula.hscGpaMultiplier)} নম্বর)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-gray-500 font-heading block">৩. প্রযোজ্য অফিসিয়াল কর্তন</span>
                    <span className={`font-heading font-bold text-sm ${calculation.deduction > 0 ? 'text-rose-600' : 'text-[#172B3A]'}`}>
                      {calculation.deduction > 0 ? `-${toBengaliNumber(calculation.deduction)} নম্বর` : '০.০০ নম্বর (কোনো কর্তন নেই)'}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {candidateCategory === 'first_time' ? '১ম বার পরীক্ষার্থী' : '২য় বার পরীক্ষার্থীর অফিসিয়াল কর্তন'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
                    <span className="text-emerald-800 font-heading block">৪. বর্তমান মোট একাডেমিক স্কোর</span>
                    <span className="font-heading font-bold text-sm text-emerald-950">
                      {toBengaliNumber(calculation.currentAcademicTotal)} নম্বর
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      (সর্বোচ্চ সম্ভব: {toBengaliNumber(program.scoringFormula.maxAcademicScore)} নম্বর)
                    </span>
                  </div>
                </div>
              </div>

              {/* Exact Formula with Substituted Numbers */}
              <div className="p-4 rounded-xl bg-[#092C43]/5 border border-[#092C43]/15 space-y-2">
                <span className="text-xs font-heading font-bold text-[#092C43] block">
                  প্রতিষ্ঠানের অফিসিয়াল সূত্র ও তোমার প্রদত্ত মান:
                </span>
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] font-latin font-bold text-xs sm:text-sm text-[#092C43] text-center">
                  টার্গেট ({toBengaliNumber(calculation.target)}) = পরীক্ষা ({toBengaliNumber(calculation.requiredExamMarks)}) + SSC ({toBengaliNumber(calculation.sscScore)}) + HSC ({toBengaliNumber(calculation.hscScore)}) - কর্তন ({toBengaliNumber(calculation.deduction)})
                </div>
                <p className="text-[11px] text-[#617381] font-body leading-relaxed">
                  * {program.scoringFormula.formulaDescriptionBangla}
                </p>
              </div>

              {/* Comparison Results (if enabled) */}
              {comparison && (
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs sm:text-sm space-y-2 font-body">
                  <div className="flex items-center gap-2 text-purple-900 font-heading font-bold">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>অন্য প্রার্থীর সাথে তুলনামূলক বিশ্লেষণ:</span>
                  </div>
                  <p className="text-purple-900">
                    তোমার একাডেমিক স্কোর <strong>{toBengaliNumber(calculation.currentAcademicTotal)}</strong> এবং অপর প্রার্থীর একাডেমিক স্কোর <strong>{toBengaliNumber(comparison.cAcademicTotal)}</strong>।
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-purple-200 font-heading font-bold text-center text-[#2B1055]">
                    {comparison.diff > 0 ? (
                      <span>তোমাকে অপর প্রার্থীর চেয়ে ভর্তি পরীক্ষায় <strong>{toBengaliNumber(Math.abs(comparison.diff))} নম্বর বেশি</strong> পেতে হবে।</span>
                    ) : comparison.diff < 0 ? (
                      <span>তোমার একাডেমিক অগ্রগামিতার কারণে অপর প্রার্থীর চেয়ে <strong>{toBengaliNumber(Math.abs(comparison.diff))} নম্বর কম</strong> পেলেও একই টার্গেট অর্জিত হবে।</span>
                    ) : (
                      <span>উভয়ের একাডেমিক স্কোর সমান, তাই দুজনকেই পরীক্ষায় সমান নম্বর পেতে হবে।</span>
                    )}
                  </div>
                </div>
              )}

              {/* Strict Official Disclaimer */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-body leading-relaxed space-y-1">
                <span className="font-heading font-bold text-gray-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-500" />
                  <span>অফিসিয়াল নীতি ও সীমাবদ্ধতা নোটিশ:</span>
                </span>
                <p>
                  এই ক্যালকুলেটরটি শুধুমাত্র সংশ্লিষ্ট বিশ্ববিদ্যালয়ের যাচাইকৃত নম্বর বণ্টন ও গাণিতিক সূত্রের ভিত্তিতে প্রয়োজনীয় নম্বর হিসাব করে। কোনো টার্গেট স্কোরই ভর্তির নিশ্চয়তা, কাট-অফ মার্ক বা মেধা তালিকায় অবস্থানের ভবিষ্যদ্বাণী নয়। প্রতিটি শিক্ষাবর্ষের প্রশ্নপত্রের কাঠিন্য ও প্রতিদ্বন্দ্বীদের স্কোরের ওপর ভিত্তি করে প্রকৃত কাট-অফ পরিবর্তিত হয়।
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
