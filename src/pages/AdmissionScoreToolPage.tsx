import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Info, ExternalLink, HelpCircle } from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { VERIFIED_ADMISSION_PROGRAMS, VerifiedAdmissionProgram, toBengaliNumber, cleanDecimal } from '../data/admissionRules';

export const AdmissionScoreToolPage: React.FC = () => {
  // Form State
  const [selectedProgramId, setSelectedProgramId] = useState<string>('dgme-mbbs');
  const [totalQuestionsInput, setTotalQuestionsInput] = useState<string>('100');
  const [correctAnswersInput, setCorrectAnswersInput] = useState<string>('');
  const [wrongAnswersInput, setWrongAnswersInput] = useState<string>('');
  const [markPerCorrectInput, setMarkPerCorrectInput] = useState<string>('1.0');
  const [negativeMarkInput, setNegativeMarkInput] = useState<string>('0.25');

  // Academic Score inclusion (Optional toggle)
  const [includeAcademic, setIncludeAcademic] = useState<boolean>(true);
  const [sscGpa, setSscGpa] = useState<string>('');
  const [hscGpa, setHscGpa] = useState<string>('');
  const [candidateCategory, setCandidateCategory] = useState<'first_time' | 'second_time_general' | 'second_time_admitted'>('first_time');

  // Trigger state
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Selected Program
  const program: VerifiedAdmissionProgram = useMemo(() => {
    return VERIFIED_ADMISSION_PROGRAMS.find((p) => p.id === selectedProgramId) || VERIFIED_ADMISSION_PROGRAMS[0];
  }, [selectedProgramId]);

  // Update question counts when program changes
  useEffect(() => {
    setTotalQuestionsInput(program.exam.totalQuestions.toString());
    setMarkPerCorrectInput(program.exam.markPerCorrect.toString());
    setNegativeMarkInput(program.exam.negativeMarkPerWrong.toString());
    setIsCalculated(false);
  }, [program]);

  // Derived Unanswered Questions count
  const totalQuestions = parseInt(totalQuestionsInput, 10) || 0;
  const correctCount = parseInt(correctAnswersInput, 10) || 0;
  const wrongCount = parseInt(wrongAnswersInput, 10) || 0;
  const unansweredCount = Math.max(0, totalQuestions - correctCount - wrongCount);

  // Handle Reset
  const handleReset = () => {
    setTotalQuestionsInput(program.exam.totalQuestions.toString());
    setCorrectAnswersInput('');
    setWrongAnswersInput('');
    setSscGpa('');
    setHscGpa('');
    setCandidateCategory('first_time');
    setIsCalculated(false);
    setValidationError(null);
  };

  // Handle Submit
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (isNaN(totalQuestions) || totalQuestions <= 0) {
      setValidationError('মোট প্রশ্ন সংখ্যা একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে।');
      setIsCalculated(false);
      return;
    }
    if (correctAnswersInput === '' || isNaN(correctCount) || correctCount < 0) {
      setValidationError('সঠিক উত্তরের সংখ্যা (০ বা তার বেশি) প্রদান করুন।');
      setIsCalculated(false);
      return;
    }
    if (wrongAnswersInput === '' || isNaN(wrongCount) || wrongCount < 0) {
      setValidationError('ভুল উত্তরের সংখ্যা (০ বা তার বেশি) প্রদান করুন।');
      setIsCalculated(false);
      return;
    }
    if (correctCount + wrongCount > totalQuestions) {
      setValidationError(`সঠিক (${toBengaliNumber(correctCount)}) ও ভুল (${toBengaliNumber(wrongCount)}) উত্তরের যোগফল মোট প্রশ্ন (${toBengaliNumber(totalQuestions)})-এর চেয়ে বেশি হতে পারে না!`);
      setIsCalculated(false);
      return;
    }

    if (includeAcademic) {
      if (sscGpa !== '') {
        const s = parseFloat(sscGpa);
        if (isNaN(s) || s < 0 || s > 5.0) {
          setValidationError('SSC GPA ০.০০ থেকে ৫.০০-এর মধ্যে হতে হবে।');
          setIsCalculated(false);
          return;
        }
      }
      if (hscGpa !== '') {
        const h = parseFloat(hscGpa);
        if (isNaN(h) || h < 0 || h > 5.0) {
          setValidationError('HSC GPA ০.০০ থেকে ৫.০০-এর মধ্যে হতে হবে।');
          setIsCalculated(false);
          return;
        }
      }
    }

    setIsCalculated(true);
  };

  // Calculation Results
  const calculation = useMemo(() => {
    if (!isCalculated) return null;

    const markPerCorrect = parseFloat(markPerCorrectInput) || 1.0;
    const negMark = parseFloat(negativeMarkInput) || 0.25;

    const earnedMarks = cleanDecimal(correctCount * markPerCorrect);
    const deductedMarks = cleanDecimal(wrongCount * negMark);
    // Note: Do not silently clamp negative scores to 0.00 unless officially defined
    const netTestScore = cleanDecimal(earnedMarks - deductedMarks);

    // Pass mark check
    const passedExam = netTestScore >= program.exam.passMark;

    // Academic scores
    const ssc = cleanDecimal(parseFloat(sscGpa) || 0);
    const hsc = cleanDecimal(parseFloat(hscGpa) || 0);
    const hasAcademicGpa = sscGpa !== '' && hscGpa !== '';

    let sscContribution = 0;
    let hscContribution = 0;
    let academicDeduction = 0;

    if (hasAcademicGpa) {
      sscContribution = cleanDecimal(ssc * program.scoringFormula.sscGpaMultiplier);
      hscContribution = cleanDecimal(hsc * program.scoringFormula.hscGpaMultiplier);

      if (candidateCategory === 'second_time_general') {
        academicDeduction = program.scoringFormula.secondTimeDeductionGeneral;
      } else if (candidateCategory === 'second_time_admitted') {
        academicDeduction = program.scoringFormula.secondTimeDeductionAdmitted;
      }
    }

    const academicTotal = cleanDecimal(sscContribution + hscContribution - academicDeduction);
    const finalCombinedScore = cleanDecimal(netTestScore + academicTotal);

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
      markPerCorrect,
      negMark,
      earnedMarks,
      deductedMarks,
      netTestScore,
      passedExam,
      hasAcademicGpa,
      ssc,
      hsc,
      sscContribution,
      hscContribution,
      academicDeduction,
      academicTotal,
      finalCombinedScore,
    };
  }, [isCalculated, totalQuestions, correctCount, wrongCount, unansweredCount, markPerCorrectInput, negativeMarkInput, sscGpa, hscGpa, candidateCategory, program]);

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
            ভর্তি টুল ৩ / ৩
          </span>
        </div>

        {/* Title Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#2B1055] text-xs font-heading font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>স্কোর ও নেগেটিভ মার্কিং প্রসেসর</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#172B3A] tracking-tight">
            ভর্তি স্কোর ও নেগেটিভ মার্ক
          </h1>

          <p className="font-body text-sm text-[#617381] leading-relaxed max-w-2xl">
            ভর্তি পরীক্ষার সঠিক ও ভুল উত্তরের সংখ্যা থেকে অফিসিয়াল নেগেটিভ মার্কিং (০.২৫), নেট প্রাপ্ত নম্বর এবং এসএসসি-এইচএসসি জিপিএ যুক্ত করে মোট চূড়ান্ত ভর্তি স্কোর নিখুঁতভাবে গণনা করো।
          </p>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleCalculate} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-5">
          <h2 className="text-lg font-heading font-bold text-[#172B3A] pb-3 border-b border-[#F1F5F9] flex items-center justify-between">
            <span>পরীক্ষার তথ্য ও উত্তর সংখ্যা</span>
            <span className="text-xs font-normal text-[#617381]">সঠিক ও ভুলের সংখ্যা লিখুন</span>
          </h2>

          {/* Program Select */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
              ১. ভর্তি পরীক্ষার মডেল / প্রোগ্রাম নির্বাচন করো *
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white font-heading text-sm text-[#172B3A] focus:outline-hidden focus:ring-2 focus:ring-[#2B1055]"
            >
              {VERIFIED_ADMISSION_PROGRAMS.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.institutionShort} ({prog.verifiedSession}) — মোট প্রশ্ন {toBengaliNumber(prog.exam.totalQuestions)}টি, নেগেটিভ {toBengaliNumber(prog.exam.negativeMarkPerWrong)}
                </option>
              ))}
            </select>
          </div>

          {/* Question Breakdown Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Questions */}
            <div className="space-y-1.5">
              <label htmlFor="total-q" className="text-xs sm:text-sm font-heading font-bold text-[#172B3A] block">
                ২. মোট প্রশ্ন সংখ্যা *
              </label>
              <input
                id="total-q"
                type="number"
                min="1"
                max="200"
                value={totalQuestionsInput}
                onChange={(e) => setTotalQuestionsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-gray-50 font-latin font-bold text-sm text-[#172B3A]"
                required
              />
            </div>

            {/* Correct Answers */}
            <div className="space-y-1.5">
              <label htmlFor="correct-q" className="text-xs sm:text-sm font-heading font-bold text-emerald-800 block">
                ৩. সঠিক উত্তর সংখ্যা (Correct) *
              </label>
              <input
                id="correct-q"
                type="number"
                min="0"
                max={totalQuestions}
                placeholder="যেমন: ৭০"
                value={correctAnswersInput}
                onChange={(e) => setCorrectAnswersInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 font-latin font-bold text-sm text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Wrong Answers */}
            <div className="space-y-1.5">
              <label htmlFor="wrong-q" className="text-xs sm:text-sm font-heading font-bold text-rose-800 block">
                ৪. ভুল উত্তর সংখ্যা (Wrong) *
              </label>
              <input
                id="wrong-q"
                type="number"
                min="0"
                max={totalQuestions}
                placeholder="যেমন: ১২"
                value={wrongAnswersInput}
                onChange={(e) => setWrongAnswersInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50/30 font-latin font-bold text-sm text-rose-950 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

          </div>

          {/* Automatically Derived Unanswered Banner */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] flex items-center justify-between text-xs font-heading">
            <span className="text-gray-600">
              ৫. অনুত্তরিত প্রশ্ন (Unanswered - স্বয়ংক্রিয় হিসাব):
            </span>
            <span className="font-latin font-bold text-sm text-[#172B3A] bg-white px-3 py-1 rounded-lg border border-[#E2E8F0]">
              {toBengaliNumber(unansweredCount)} টি
            </span>
          </div>

          {/* Marking Rules Preview (Editable / Pre-configured) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-gray-600 font-heading">প্রতিটি সঠিক উত্তরের মান:</span>
              <span className="font-latin font-bold text-emerald-700">+{toBengaliNumber(markPerCorrectInput)} নম্বর</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-gray-600 font-heading">প্রতিটি ভুল উত্তরের কর্তন (নেগেটিভ):</span>
              <span className="font-latin font-bold text-rose-700">-{toBengaliNumber(negativeMarkInput)} নম্বর</span>
            </div>
          </div>

          {/* Optional Academic GPA inclusion Toggle */}
          <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAcademic}
                onChange={(e) => setIncludeAcademic(e.target.checked)}
                className="w-4 h-4 accent-[#2B1055]"
              />
              <span className="text-xs sm:text-sm font-heading font-bold text-[#172B3A]">
                একাডেমিক জিপিএ (SSC ও HSC) যোগ করে চূড়ান্ত ভর্তি স্কোর হিসাব করো
              </span>
            </label>

            {includeAcademic && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-heading font-semibold text-gray-700 block">
                      SSC GPA (৪র্থ বিষয়সহ):
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      placeholder="যেমন: ৫.০০"
                      value={sscGpa}
                      onChange={(e) => setSscGpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white font-latin font-semibold text-xs text-[#172B3A]"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-heading font-semibold text-gray-700 block">
                      HSC GPA (৪র্থ বিষয়সহ):
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      placeholder="যেমন: ৫.০০"
                      value={hscGpa}
                      onChange={(e) => setHscGpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white font-latin font-semibold text-xs text-[#172B3A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-heading font-semibold text-gray-700 block">
                    পরীক্ষার্থীর ক্যাটাগরি:
                  </span>
                  <div className="flex flex-wrap gap-4 text-xs font-heading">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="cat"
                        checked={candidateCategory === 'first_time'}
                        onChange={() => setCandidateCategory('first_time')}
                      />
                      <span>১ম বার</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="cat"
                        checked={candidateCategory === 'second_time_general'}
                        onChange={() => setCandidateCategory('second_time_general')}
                        disabled={!program.eligibility.allowsSecondTime}
                      />
                      <span>২য় বার সাধারণ (কর্তন: -{toBengaliNumber(program.scoringFormula.secondTimeDeductionGeneral)})</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-[#2B1055] hover:bg-[#3B185F] text-[#CCFF00] font-heading font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>স্কোর হিসাব করুন</span>
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

        {/* RESULTS SECTION (Rendered only after calculation) */}
        {calculation && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-xs font-heading font-semibold text-[#2B1055] uppercase tracking-wide block">
                    ফলাফল সারসংক্ষেপ
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#172B3A]">
                    পরীক্ষার নেট নম্বর ও চূড়ান্ত স্কোর
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {calculation.passedExam ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-heading font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>পরীক্ষায় উত্তীর্ণ (পাস মার্ক {toBengaliNumber(program.exam.passMark)})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 font-heading font-bold text-xs">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>পাস নম্বর ({toBengaliNumber(program.exam.passMark)}) পূরণ হয়নি</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Big Scores Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Net Admission Test Score */}
                <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-center space-y-2">
                  <span className="text-xs font-heading font-bold text-purple-900 uppercase tracking-wide block">
                    ভর্তি পরীক্ষায় নেট প্রাপ্ত নম্বর
                  </span>
                  <div className={`text-4xl sm:text-5xl font-latin font-black tracking-tight ${calculation.netTestScore < 0 ? 'text-rose-600' : 'text-[#2B1055]'}`}>
                    {toBengaliNumber(calculation.netTestScore)}
                  </div>
                  <span className="text-[11px] font-heading text-purple-800 block">
                    পূর্ণমান: {toBengaliNumber(program.exam.totalMarks)} নম্বর
                  </span>
                </div>

                {/* 2. Combined Merit Score (if academic GPA included) */}
                <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center space-y-2">
                  <span className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wide block">
                    সর্বমোট সম্মিলিত মেধা স্কোর
                  </span>
                  <div className="text-4xl sm:text-5xl font-latin font-black text-emerald-950 tracking-tight">
                    {calculation.hasAcademicGpa
                      ? toBengaliNumber(calculation.finalCombinedScore)
                      : toBengaliNumber(calculation.netTestScore)}
                  </div>
                  <span className="text-[11px] font-heading text-emerald-800 block">
                    সর্বমোট পূর্ণমান: {toBengaliNumber(program.scoringFormula.totalMeritMarks)} নম্বর
                  </span>
                </div>

              </div>

              {/* Step-by-Step Breakdown Grid */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#172B3A]">
                  ধাপে ধাপে নম্বর হিসাব (অফিসিয়াল মার্কিং ফর্মুলা):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-emerald-700 font-heading block font-semibold">
                      ১. সঠিক উত্তর থেকে প্রাপ্ত নম্বর
                    </span>
                    <span className="font-heading font-bold text-sm text-[#172B3A]">
                      {toBengaliNumber(calculation.correctCount)} × {toBengaliNumber(calculation.markPerCorrect)} = +{toBengaliNumber(calculation.earnedMarks)} নম্বর
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-rose-700 font-heading block font-semibold">
                      ২. ভুল উত্তরের নেগেটিভ মার্কিং কর্তন
                    </span>
                    <span className="font-heading font-bold text-sm text-rose-700">
                      {toBengaliNumber(calculation.wrongCount)} × {toBengaliNumber(calculation.negMark)} = -{toBengaliNumber(calculation.deductedMarks)} নম্বর
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-gray-600 font-heading block font-semibold">
                      ৩. নেট পরীক্ষার নম্বর
                    </span>
                    <span className="font-heading font-bold text-sm text-[#172B3A]">
                      {toBengaliNumber(calculation.earnedMarks)} - {toBengaliNumber(calculation.deductedMarks)} = {toBengaliNumber(calculation.netTestScore)} নম্বর
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-gray-600 font-heading block font-semibold">
                      ৪. একাডেমিক জিপিএ স্কোর (SSC ও HSC)
                    </span>
                    <span className="font-heading font-bold text-sm text-[#172B3A]">
                      {calculation.hasAcademicGpa
                        ? `SSC (${toBengaliNumber(calculation.sscContribution)}) + HSC (${toBengaliNumber(calculation.hscContribution)}) = ${toBengaliNumber(calculation.sscContribution + calculation.hscContribution)} নম্বর`
                        : 'একাডেমিক জিপিএ তথ্য দেওয়া হয়নি'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Exact Substituted Equation */}
              <div className="p-4 rounded-xl bg-gray-50 border border-[#E2E8F0] space-y-2">
                <span className="text-xs font-heading font-bold text-[#172B3A] block">
                  প্রতিষ্ঠানের অফিসিয়াল সূত্র ও তোমার প্রদত্ত মান:
                </span>
                <div className="p-2.5 rounded-lg bg-white border border-[#CBD5E1] font-latin font-bold text-xs sm:text-sm text-[#2B1055] text-center">
                  চূড়ান্ত স্কোর = [{toBengaliNumber(calculation.earnedMarks)} - {toBengaliNumber(calculation.deductedMarks)}]
                  {calculation.hasAcademicGpa && ` + SSC (${toBengaliNumber(calculation.sscContribution)}) + HSC (${toBengaliNumber(calculation.hscContribution)})`}
                  {calculation.academicDeduction > 0 && ` - কর্তন (${toBengaliNumber(calculation.academicDeduction)})`}
                  {' = '}
                  {calculation.hasAcademicGpa ? toBengaliNumber(calculation.finalCombinedScore) : toBengaliNumber(calculation.netTestScore)}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-body leading-relaxed space-y-1">
                <span className="font-heading font-bold text-gray-700 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>অফিসিয়াল বিজ্ঞপ্তি নোটিশ:</span>
                </span>
                <p>
                  ভর্তি পরীক্ষার ফলাফল ও মেধা তালিকা সম্পূর্ণভাবে সংশ্লিষ্ট কর্তৃপক্ষ কর্তৃক আনুষ্ঠানিকভাবে প্রকাশিত ওএমআর শিট মূল্যায়নের ওপর নির্ভরশীল। এই ক্যালকুলেটর কোনো সম্ভাব্য মেরিট পজিশন বা র‍্যাঙ্ক তৈরি করে না।
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
