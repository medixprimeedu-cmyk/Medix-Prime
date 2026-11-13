import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Server } from 'lucide-react';

interface ResultSkeletonLoaderProps {
  searchedRoll?: string;
  searchedBoard?: string;
}

export const ResultSkeletonLoader: React.FC<ResultSkeletonLoaderProps> = ({
  searchedRoll,
  searchedBoard,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: 'শিক্ষা বোর্ড সার্ভারের সাথে নিরাপদ সংযোগ স্থাপন হচ্ছে...',
      subtitle: searchedBoard ? `${searchedBoard} বোর্ডের ডাটাবেজে অনুরোধ পাঠানো হয়েছে` : 'কেন্দ্রীয় ডাটাবেজে সংযোগ হচ্ছে',
      icon: Server,
    },
    {
      title: 'রোল ও রেজিস্ট্রেশন নম্বর যাচাই করা হচ্ছে...',
      subtitle: searchedRoll ? `রোল: ${searchedRoll} এর গেজেট রেকর্ড খোঁজা হচ্ছে` : 'এডমিট কার্ডের রেকর্ড মিলানো হচ্ছে',
      icon: Database,
    },
    {
      title: 'বিষয়ভিত্তিক গ্রেড ও মার্কশিট সংকলন করা হচ্ছে...',
      subtitle: 'জিপিএ ও ফলাফল প্রস্তুত হচ্ছে',
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 600);
    const timer2 = setTimeout(() => setStepIndex(2), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#006B98]/20 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Top Animated Feedback Bar */}
      <div className="bg-gradient-to-r from-[#092C43] to-[#006B98] p-5 text-white relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-20" />

        <div className="flex items-center gap-4 relative z-10">
          {/* Dual Brand Spinner */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-3 border-white/20" />
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#B39724] border-r-[#006B98] animate-spin" />
            <CurrentIcon className="w-5 h-5 text-white/90 animate-pulse" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-latin font-bold uppercase tracking-wider text-[#B39724]">
                PROCESSING REQUEST • STEP {stepIndex + 1}/3
              </span>
              <span className="text-xs text-white/70 font-latin animate-pulse">অনুসন্ধান চলছে...</span>
            </div>
            <h3 className="font-heading text-sm sm:text-base font-bold text-white leading-tight">
              {steps[stepIndex].title}
            </h3>
            <p className="font-body text-xs text-white/75 truncate">
              {steps[stepIndex].subtitle}
            </p>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="mt-4 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B39724] to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Skeleton Marksheet Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Skeleton Candidate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F4] border border-[#E2E8F0]">
          <div className="space-y-2 w-full sm:w-2/3">
            <div className="h-3 w-20 bg-gray-200 rounded-sm animate-pulse" />
            <div className="h-5 w-48 sm:w-64 bg-gray-300 rounded-md animate-shimmer" />
            <div className="h-3 w-36 sm:w-52 bg-gray-200 rounded-sm animate-pulse" />
          </div>

          {/* Skeleton GPA Pill */}
          <div className="w-28 h-12 bg-white rounded-xl border border-[#006B98]/20 flex items-center justify-center p-2 shrink-0 animate-shimmer">
            <div className="h-6 w-16 bg-[#006B98]/20 rounded-md" />
          </div>
        </div>

        {/* Skeleton Candidate Info Grid (4 blocks) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pb-4 border-b border-[#E2E8F0]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5 p-2 rounded-lg bg-[#FAF8F4]/50">
              <div className="h-2.5 w-14 bg-gray-200 rounded-xs animate-pulse" />
              <div className="h-4 w-20 bg-gray-300 rounded-sm animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Skeleton Subject Grades Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-40 bg-gray-300 rounded-sm animate-shimmer" />
            <div className="h-3 w-24 bg-gray-200 rounded-xs animate-pulse" />
          </div>

          <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
            {/* Table Header Skeleton */}
            <div className="bg-[#FAF8F4] p-3 border-b border-[#E2E8F0] flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded-xs" />
              <div className="h-3 w-36 bg-gray-200 rounded-xs" />
              <div className="h-3 w-14 bg-gray-200 rounded-xs" />
              <div className="h-3 w-14 bg-gray-200 rounded-xs" />
            </div>

            {/* Table Rows Skeletons */}
            <div className="divide-y divide-[#E2E8F0]">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="p-3 flex items-center justify-between gap-3 animate-shimmer">
                  <div className="h-3 w-8 bg-gray-200 rounded-xs" />
                  <div className="h-3.5 flex-1 max-w-[200px] bg-gray-200 rounded-xs" />
                  <div className="h-4 w-8 bg-[#006B98]/15 rounded-md" />
                  <div className="h-3.5 w-8 bg-gray-200 rounded-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Footer Info */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#617381] font-body">
          <span className="w-2 h-2 rounded-full bg-[#006B98] animate-ping" />
          <span>শিক্ষা বোর্ডের নিয়ম মেনে তথ্য প্রসেস করা হচ্ছে...</span>
        </div>
      </div>
    </div>
  );
};
