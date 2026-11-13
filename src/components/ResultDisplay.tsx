import React from 'react';
import { ExternalLink, Printer, RotateCcw, AlertCircle, CheckCircle2, Info, FileText } from 'lucide-react';
import { StudentResult, FetchState } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { toBengaliDigits } from '../utils/bengaliUtils';

import { ResultSkeletonLoader } from './ResultSkeletonLoader';

interface ResultDisplayProps {
  state: FetchState;
  result?: StudentResult;
  onReset: () => void;
  searchedRoll?: string;
  searchedReg?: string;
  searchedBoard?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  state,
  result,
  onReset,
  searchedRoll,
  searchedReg,
  searchedBoard,
}) => {
  if (state === 'idle') {
    return null;
  }

  // State 1: Honest Unconfigured API Notice
  if (state === 'unconfigured_notice') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#B39724]/40 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#B39724]/10 text-[#8f7718] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#172B3A]">
                সরাসরি রেজাল্ট সেবা এখনো চালু হয়নি
              </h3>
              <p className="font-body text-[#172B3A] text-sm sm:text-base leading-relaxed mt-1 font-medium">
                আপাতত অফিসিয়াল পোর্টাল থেকে ফল দেখো।
              </p>
            </div>

            <div className="bg-[#FAF8F4] rounded-xl p-3.5 border border-[#E2E8F0] text-xs sm:text-sm text-[#617381] space-y-1.5 font-body">
              <p className="flex items-center gap-1.5 text-[#172B3A] font-medium">
                <FileText className="w-4 h-4 text-[#006B98] shrink-0" />
                <span>অফিসিয়াল পোর্টালে দেখার নিয়ম:</span>
              </p>
              <p className="leading-relaxed">
                শিক্ষা বোর্ডের সুরক্ষা নীতি অনুসারে অফিসিয়াল পোর্টালে গিয়ে তোমার পরীক্ষা, বোর্ড, বছর, রোল, রেজিস্ট্রেশন নম্বর এবং নিরাপত্তা ক্যাপচা পুনরায় পূরণ করে ফল সংগ্রহ করতে হবে।
              </p>
              {searchedRoll && (
                <p className="text-[11px] text-[#617381]/80 pt-1">
                  গোপনীয়তার নিশ্চয়তা: তোমার প্রদত্ত তথ্য (রোল: <span className="font-latin font-medium">{searchedRoll}</span>) কোনো অননুমোদিত সার্ভারে প্রেরণ বা সংরক্ষণ করা হয়নি।
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={APP_CONFIG.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#006B98] hover:bg-[#00567a] text-white font-heading font-semibold text-sm transition-all shadow-xs hover:shadow-md"
              >
                <span>অফিসিয়াল রেজাল্ট পোর্টালে যাও</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[#172B3A] font-heading font-medium text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-[#617381]" />
                <span>তথ্য পরিবর্তন করো</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Visual Loading Feedback with Skeleton Marksheet & Spinner
  if (state === 'loading') {
    return (
      <ResultSkeletonLoader
        searchedRoll={searchedRoll}
        searchedBoard={searchedBoard}
      />
    );
  }

  // State 3: Not Found
  if (state === 'not_found') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl border border-red-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="font-heading text-lg font-bold text-[#172B3A]">
              কোনো ফলাফল খুঁজে পাওয়া যায়নি
            </h3>
            <p className="font-body text-sm text-[#617381] leading-relaxed">
              তোমার প্রদত্ত রোল নম্বর বা রেজিস্ট্রেশন নম্বরটির সাথে শিক্ষা বোর্ডের তথ্যের মিল পাওয়া যায়নি। দয়া করে এডমিট কার্ড দেখে তথ্য পুনরায় যাচাই করো।
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B98] text-white font-heading font-medium text-sm hover:bg-[#00567a] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>পুনরায় চেষ্টা করো</span>
              </button>
              <a
                href={APP_CONFIG.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[#172B3A] font-heading font-medium text-sm transition-colors"
              >
                <span>অফিসিয়াল পোর্টাল</span>
                <ExternalLink className="w-4 h-4 text-[#617381]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Not Published
  if (state === 'not_published') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl border border-amber-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="font-heading text-lg font-bold text-[#172B3A]">
              ফলাফল এখনো প্রকাশিত হয়নি
            </h3>
            <p className="font-body text-sm text-[#617381] leading-relaxed">
              শিক্ষা বোর্ড কর্তৃক নির্ধারিত সময় অনুযায়ী ফলাফল প্রকাশিত হওয়ার পর তা অনলাইনে দেখা যাবে।
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[#172B3A] font-heading font-medium text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ফর্ম রিসেট করো</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 5: Service Error / Timeout
  if (state === 'service_error') {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl border border-red-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="font-heading text-lg font-bold text-[#172B3A]">
              সার্ভিস সংযোগ বিচ্ছিন্ন বা সময় শেষ
            </h3>
            <p className="font-body text-sm text-[#617381] leading-relaxed">
              ফলাফল প্রকাশের সময় সার্ভারে অতিরিক্ত চাপের কারণে সাময়িক সংযোগ সমস্যা হতে পারে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করো অথবা সরকারি সার্ভারে সরাসরি প্রবেশ করো।
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={APP_CONFIG.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B98] text-white font-heading font-medium text-sm hover:bg-[#00567a] transition-colors"
              >
                <span>অফিসিয়াল পোর্টাল ব্যবহার করো</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[#172B3A] font-heading font-medium text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>পুনরায় চেষ্টা</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 6: Full Success Result Marksheet
  if (state === 'success' && result) {
    return (
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden print-area">
        {/* Top Header of Result Card */}
        <div className="bg-gradient-to-r from-[#092C43] to-[#006B98] text-white px-5 sm:px-7 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-latin uppercase tracking-wider text-[#B39724] font-semibold">
              OFFICIAL HSC RESULT SHEET
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight">
              {result.boardBn} শিক্ষা বোর্ড • {result.examinationBn} {toBengaliDigits(result.year)}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#FAF8F4]/15 backdrop-blur-xs text-white border border-white/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B39724]" />
              {result.statusBn}
            </span>
          </div>
        </div>

        {/* GPA & Highlight Banner */}
        <div className="px-5 sm:px-7 py-5 bg-[#FAF8F4] border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-heading text-[#617381]">শিক্ষার্থীর নাম</span>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#172B3A]">
              {result.studentName}
            </h4>
            {result.institute && (
              <p className="text-xs sm:text-sm text-[#617381] font-body">
                প্রতিষ্ঠান: <span className="text-[#172B3A] font-medium">{result.institute}</span>
              </p>
            )}
          </div>

          {/* GPA Badge */}
          <div className="flex items-baseline gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#006B98]/20 shadow-xs">
            <span className="text-xs font-heading text-[#617381] font-medium">প্রাপ্ত জিপিএ:</span>
            <span className="font-latin text-2xl sm:text-3xl font-extrabold text-[#006B98]">
              {result.gpa.toFixed(2)}
            </span>
            <span className="text-xs text-[#B39724] font-heading font-bold">
              ({result.gpa >= 5 ? 'A+' : result.gpa >= 4 ? 'A' : result.gpa >= 3.5 ? 'A-' : 'PASS'})
            </span>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="px-5 sm:px-7 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 pb-5 border-b border-[#E2E8F0] text-sm">
            <div className="space-y-0.5">
              <span className="text-xs text-[#617381] font-heading">রোল নম্বর</span>
              <p className="font-latin font-bold text-[#172B3A] text-base">{result.roll}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[#617381] font-heading">রেজিস্ট্রেশন নম্বর</span>
              <p className="font-latin font-bold text-[#172B3A] text-base">{result.registration}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[#617381] font-heading">বোর্ড</span>
              <p className="font-heading font-semibold text-[#172B3A]">{result.boardBn}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[#617381] font-heading">পরীক্ষার বছর</span>
              <p className="font-latin font-bold text-[#172B3A] text-base">{result.year}</p>
            </div>

            {result.fatherName && (
              <div className="space-y-0.5 col-span-2">
                <span className="text-xs text-[#617381] font-heading">পিতার নাম</span>
                <p className="font-heading text-[#172B3A] font-medium">{result.fatherName}</p>
              </div>
            )}
            {result.motherName && (
              <div className="space-y-0.5 col-span-2">
                <span className="text-xs text-[#617381] font-heading">মাতার নাম</span>
                <p className="font-heading text-[#172B3A] font-medium">{result.motherName}</p>
              </div>
            )}
          </div>

          {/* Subject Grades Table */}
          {result.subjectGrades && result.subjectGrades.length > 0 && (
            <div className="pt-5 space-y-3">
              <h5 className="font-heading font-bold text-[#172B3A] text-base flex items-center justify-between">
                <span>বিষয়ভিত্তিক ফলাফল (Subject Grades)</span>
                <span className="text-xs text-[#617381] font-normal">বোর্ড মূল্যায়িত তালিকা</span>
              </h5>

              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#FAF8F4] border-b border-[#E2E8F0] font-heading text-xs text-[#617381]">
                      <th className="py-2.5 px-3.5 font-semibold">কোড</th>
                      <th className="py-2.5 px-3.5 font-semibold">বিষয়ের নাম</th>
                      <th className="py-2.5 px-3.5 font-semibold text-center">লেটার গ্রেড</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">গ্রেড পয়েন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] font-body text-xs sm:text-sm">
                    {result.subjectGrades.map((sub) => (
                      <tr key={sub.code} className="hover:bg-[#FAF8F4]/60 transition-colors">
                        <td className="py-2.5 px-3.5 font-latin font-medium text-[#617381]">{sub.code}</td>
                        <td className="py-2.5 px-3.5 font-medium text-[#172B3A]">{sub.name}</td>
                        <td className="py-2.5 px-3.5 text-center font-latin font-bold text-[#006B98]">
                          {sub.grade}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-latin font-semibold text-[#172B3A]">
                          {sub.gradePoint.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Bar (Print & Search Again) */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
            <span className="text-xs text-[#617381] font-body text-center sm:text-left">
              ফলাফল সংশ্লিষ্ট শিক্ষা বোর্ডের সার্ভার ডাটার ওপর ভিত্তি করে প্রদর্শিত।
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#092C43] hover:bg-[#123d5a] text-white font-heading font-medium text-sm transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#B39724]" />
                <span>প্রিন্ট / সেভ করো</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#FAF8F4] text-[#172B3A] font-heading font-medium text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-[#617381]" />
                <span>অন্য রেজাল্ট দেখো</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
