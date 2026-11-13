import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Calculator, RotateCcw, Copy, Check, Info } from 'lucide-react';

interface SubjectInput {
  id: string;
  name: string;
  grade: string;
  isOptional?: boolean;
}

type ExamType = 'hsc' | 'ssc';
type StreamType = 'science' | 'humanities' | 'business';

function getSubjectsPreset(exam: ExamType, stream: StreamType): SubjectInput[] {
  if (exam === 'hsc') {
    if (stream === 'science') {
      return [
        { id: 'bangla', name: 'বাংলা', grade: '5.00' },
        { id: 'english', name: 'ইংরেজি', grade: '5.00' },
        { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
        { id: 'physics', name: 'পদার্থবিজ্ঞান', grade: '5.00' },
        { id: 'chemistry', name: 'রসায়ন', grade: '5.00' },
        { id: 'biology', name: 'জীববিজ্ঞান', grade: '5.00' },
        { id: 'optional', name: '৪র্থ বিষয় (উচ্চতর গণিত / জীববিজ্ঞান)', grade: '5.00', isOptional: true },
      ];
    }
    if (stream === 'business') {
      return [
        { id: 'bangla', name: 'বাংলা', grade: '5.00' },
        { id: 'english', name: 'ইংরেজি', grade: '5.00' },
        { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
        { id: 'accounting', name: 'হিসাববিজ্ঞান', grade: '5.00' },
        { id: 'management', name: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', grade: '5.00' },
        { id: 'finance', name: 'ফিন্যান্স, ব্যাংকিং ও বিমা', grade: '5.00' },
        { id: 'optional', name: '৪র্থ বিষয় (উৎপাদন ব্যবস্থাপনা / অর্থনীতি / পরিসংখ্যান)', grade: '5.00', isOptional: true },
      ];
    }
    return [
      { id: 'bangla', name: 'বাংলা', grade: '5.00' },
      { id: 'english', name: 'ইংরেজি', grade: '5.00' },
      { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
      { id: 'economics', name: 'অর্থনীতি', grade: '5.00' },
      { id: 'civics', name: 'পৌরনীতি ও সুশাসন', grade: '5.00' },
      { id: 'history', name: 'ইতিহাস / ইসলামের ইতিহাস ও সংস্কৃতি', grade: '5.00' },
      { id: 'optional', name: '৪র্থ বিষয় (যুক্তিবিদ্যা / সমাজবিজ্ঞান / ভূগোল)', grade: '5.00', isOptional: true },
    ];
  }

  // SSC Real Board Subjects
  if (stream === 'science') {
    return [
      { id: 'bangla', name: 'বাংলা', grade: '5.00' },
      { id: 'english', name: 'ইংরেজি', grade: '5.00' },
      { id: 'math', name: 'গণিত', grade: '5.00' },
      { id: 'bgs', name: 'বাংলাদেশ ও বিশ্বপরিচয়', grade: '5.00' },
      { id: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', grade: '5.00' },
      { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
      { id: 'physics', name: 'পদার্থবিজ্ঞান', grade: '5.00' },
      { id: 'chemistry', name: 'রসায়ন', grade: '5.00' },
      { id: 'biology', name: 'জীববিজ্ঞান', grade: '5.00' },
      { id: 'optional', name: '৪র্থ বিষয় (উচ্চতর গণিত / কৃষিশিক্ষা)', grade: '5.00', isOptional: true },
    ];
  }
  if (stream === 'business') {
    return [
      { id: 'bangla', name: 'বাংলা', grade: '5.00' },
      { id: 'english', name: 'ইংরেজি', grade: '5.00' },
      { id: 'math', name: 'গণিত', grade: '5.00' },
      { id: 'science', name: 'সাধারণ বিজ্ঞান', grade: '5.00' },
      { id: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', grade: '5.00' },
      { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
      { id: 'accounting', name: 'হিসাববিজ্ঞান', grade: '5.00' },
      { id: 'finance', name: 'ফিন্যান্স ও ব্যাংকিং', grade: '5.00' },
      { id: 'ent', name: 'ব্যবসায় উদ্যোগ', grade: '5.00' },
      { id: 'optional', name: '৪র্থ বিষয় (কৃষিশিক্ষা / গার্হস্থ্য বিজ্ঞান)', grade: '5.00', isOptional: true },
    ];
  }
  return [
    { id: 'bangla', name: 'বাংলা', grade: '5.00' },
    { id: 'english', name: 'ইংরেজি', grade: '5.00' },
    { id: 'math', name: 'গণিত', grade: '5.00' },
    { id: 'science', name: 'সাধারণ বিজ্ঞান', grade: '5.00' },
    { id: 'religion', name: 'ধর্ম ও নৈতিক শিক্ষা', grade: '5.00' },
    { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: '5.00' },
    { id: 'history', name: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা', grade: '5.00' },
    { id: 'geography', name: 'ভূগোল ও পরিবেশ', grade: '5.00' },
    { id: 'civics', name: 'পৌরনীতি ও নাগরিকতা', grade: '5.00' },
    { id: 'optional', name: '৪র্থ বিষয় (অর্থনীতি / কৃষিশিক্ষা)', grade: '5.00', isOptional: true },
  ];
}

const GRADE_POINTS = [
  { grade: 'A+', point: '5.00', marks: '৮০–১০০' },
  { grade: 'A', point: '4.00', marks: '৭০–৭৯' },
  { grade: 'A-', point: '3.50', marks: '৬০–৬৯' },
  { grade: 'B', point: '3.00', marks: '৫০–৫৯' },
  { grade: 'C', point: '2.00', marks: '৪০–৪৯' },
  { grade: 'D', point: '1.00', marks: '৩৩–৩৯' },
  { grade: 'F', point: '0.00', marks: '০–৩২' },
];

export const GpaGradeCalculatorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [examType, setExamType] = useState<ExamType>('hsc');
  const [stream, setStream] = useState<StreamType>('science');
  const [subjects, setSubjects] = useState<SubjectInput[]>(() => getSubjectsPreset('hsc', 'science'));
  const [result, setResult] = useState<{
    totalGpa: number;
    gpaWithoutFourth: number;
    hasFailed: boolean;
    failedSubjects: string[];
    fourthSubjectBonus: number;
    mandatorySubjectsCount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExamOrStreamChange = (newExam: ExamType, newStream: StreamType) => {
    setExamType(newExam);
    setStream(newStream);
    setSubjects(getSubjectsPreset(newExam, newStream));
    setResult(null);
  };

  const handleGradeChange = (id: string, newGrade: string) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, grade: newGrade } : s)));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    let mandatorySum = 0;
    let mandatoryCount = 0;
    let optionalBonus = 0;
    const failedList: string[] = [];

    subjects.forEach((sub) => {
      const pt = parseFloat(sub.grade);
      if (sub.isOptional) {
        if (pt > 2.0) optionalBonus = pt - 2.0;
      } else {
        if (pt === 0) failedList.push(sub.name);
        mandatorySum += pt;
        mandatoryCount += 1;
      }
    });

    const hasFailed = failedList.length > 0;
    const rawWithoutFourth = hasFailed ? 0 : mandatorySum / mandatoryCount;
    let calculatedGpa = hasFailed ? 0 : (mandatorySum + optionalBonus) / mandatoryCount;
    if (calculatedGpa > 5.0) calculatedGpa = 5.0;

    setResult({
      totalGpa: parseFloat(calculatedGpa.toFixed(2)),
      gpaWithoutFourth: parseFloat(rawWithoutFourth.toFixed(2)),
      hasFailed,
      failedSubjects: failedList,
      fourthSubjectBonus: parseFloat(optionalBonus.toFixed(2)),
      mandatorySubjectsCount: mandatoryCount,
    });
  };

  const handleReset = () => {
    setSubjects(getSubjectsPreset(examType, stream));
    setResult(null);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `MEDIX PRIME জিপিএ ফলাফল\nপরীক্ষা: ${examType.toUpperCase()}\nমোট জিপিএ (৪র্থ বিষয়সহ): ${result.hasFailed ? 'F (অকৃতকার্য)' : result.totalGpa.toFixed(2)}\n৪র্থ বিষয় ছাড়া জিপিএ: ${result.hasFailed ? 'F' : result.gpaWithoutFourth.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      toolNumber="০১"
      toolName="জিপিএ ও গ্রেড ক্যালকুলেটর"
      categoryLabel="একাডেমিক সরঞ্জাম"
      iconName="Calculator"
      accentColor="#38BDF8"
      description="বাংলাদেশ মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ডের অফিসিয়াল নিয়মানুযায়ী ৪র্থ বিষয়ের বোনাস পয়েন্টসহ SSC ও HSC পরীক্ষার নির্ভুল GPA হিসাব করুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-7 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/20">
            <div>
              <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                পরীক্ষা, বিভাগ ও বিষয়ের গ্রেড
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                বোর্ডের নিয়ম অনুযায়ী ৪র্থ বিষয়ে ২.০০-এর অতিরিক্ত পয়েন্ট যোগ হবে
              </p>
            </div>

            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              {(['hsc', 'ssc'] as const).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleExamOrStreamChange(ex, stream)}
                  className={`px-3 py-1 rounded-lg text-xs font-latin font-bold transition-all cursor-pointer ${
                    examType === ex
                      ? 'bg-[#006B98] text-white shadow-xs'
                      : isDark
                      ? 'text-gray-300'
                      : 'text-slate-700'
                  }`}
                >
                  {ex.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Stream Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: 'science', label: 'বিজ্ঞান' },
              { id: 'business', label: 'ব্যবসায় শিক্ষা' },
              { id: 'humanities', label: 'মানবিক' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleExamOrStreamChange(examType, st.id as StreamType)}
                className={`py-2 px-3 rounded-xl text-xs font-heading font-bold border transition-all cursor-pointer ${
                  stream === st.id
                    ? 'bg-[#38BDF8] text-[#060D17] border-[#38BDF8]'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleCalculate} className="space-y-2.5">
            {subjects.map((sub, idx) => (
              <div
                key={sub.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border transition-colors ${
                  sub.isOptional
                    ? isDark
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-amber-50 border-amber-200'
                    : isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 text-[11px] font-latin font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {idx + 1}.
                  </span>
                  <div>
                    <span className={`font-heading text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {sub.name}
                    </span>
                    {sub.isOptional && (
                      <span className="text-[10px] font-heading font-medium text-amber-500 block">
                        ৪র্থ বিষয়: ২.০০-এর অতিরিক্ত পয়েন্ট বোনাস হিসেবে যুক্ত হয়
                      </span>
                    )}
                  </div>
                </div>

                <select
                  value={sub.grade}
                  onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-latin font-bold border transition-colors focus:outline-hidden self-end sm:self-auto ${
                    isDark
                      ? 'bg-[#060D17] border-white/20 text-white focus:border-[#00D2FF]'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
                  }`}
                >
                  {GRADE_POINTS.map((gp) => (
                    <option key={gp.grade} value={gp.point}>
                      {gp.grade} ({gp.point} — নম্বর {gp.marks})
                    </option>
                  ))}
                </select>
              </div>
            ))}

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
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#006B98] text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>জিপিএ হিসাব করুন</span>
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
              ফলাফল ও গ্রেড বিবরণী
            </h3>

            {result ? (
              <div className="space-y-4 py-3">
                <div
                  className={`inline-block px-8 py-5 rounded-3xl border ${
                    result.hasFailed
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : isDark
                      ? 'bg-sky-500/10 border-sky-500/30 text-[#00D2FF]'
                      : 'bg-sky-50 border-sky-200 text-[#006B98]'
                  }`}
                >
                  <span className={`text-xs font-heading block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    মোট জিপিএ (৪র্থ বিষয়সহ)
                  </span>
                  <div className="text-4xl sm:text-5xl font-latin font-black tracking-tight">
                    {result.hasFailed ? 'F' : result.totalGpa.toFixed(2)}
                  </div>
                  <span className="text-xs font-heading font-bold mt-1 block">
                    {result.hasFailed
                      ? 'অকৃতকার্য'
                      : result.totalGpa === 5.0
                      ? 'গ্রেড: A+ (সর্বোচ্চ ফলাফল)'
                      : result.totalGpa >= 4.0
                      ? 'গ্রেড: A'
                      : result.totalGpa >= 3.5
                      ? 'গ্রেড: A-'
                      : 'উত্তীর্ণ'}
                  </span>
                </div>

                <div
                  className={`text-left p-3.5 rounded-xl text-xs font-heading space-y-2 border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>৪র্থ বিষয় ছাড়া জিপিএ:</span>
                    <span className="font-latin font-bold">{result.hasFailed ? 'F' : result.gpaWithoutFourth.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>আবশ্যিক বিষয়:</span>
                    <span className="font-bold">{result.mandatorySubjectsCount}টি</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>৪র্থ বিষয় বোনাস:</span>
                    <span className="font-bold text-amber-500">+{result.fourthSubjectBonus}</span>
                  </div>
                  {result.hasFailed && (
                    <div className="text-rose-500 text-[11px] pt-1 border-t border-rose-500/20">
                      অকৃতকার্য বিষয়: {result.failedSubjects.join(', ')}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyResult}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDark ? 'border-white/15 hover:bg-white/5 text-white' : 'border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">ফলাফল কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ফলাফল কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <p className={`font-heading text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  বিষয়গুলোর গ্রেড নির্বাচন করে “জিপিএ হিসাব করুন” বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>

          <div
            className={`p-4 rounded-2xl border text-xs font-heading ${
              isDark ? 'bg-[#0B1526]/60 border-[#172740]' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`flex items-center gap-1.5 font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <Info className="w-4 h-4 text-[#006B98] dark:text-[#00D2FF]" />
              <span>বাংলাদেশ শিক্ষা বোর্ড গ্রেডিং স্কেল</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-[11px] text-center pt-1 font-latin">
              <div className={`p-1.5 rounded ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>80-100: A+ (5)</div>
              <div className={`p-1.5 rounded ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>70-79: A (4)</div>
              <div className={`p-1.5 rounded ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>60-69: A- (3.5)</div>
              <div className={`p-1.5 rounded ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>50-59: B (3)</div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
