import React from 'react';
import { ClipboardList, Edit3, Award } from 'lucide-react';

export const HowToSection: React.FC = () => {
  const steps = [
    {
      number: '০১',
      title: 'তথ্য প্রস্তুত রাখো',
      description: 'বোর্ড, বছর, রোল ও রেজিস্ট্রেশন মিলিয়ে নাও।',
      icon: ClipboardList,
    },
    {
      number: '০২',
      title: 'সঠিক তথ্য দাও',
      description: 'প্রয়োজনীয় ঘরগুলো নির্ভুলভাবে পূরণ করো।',
      icon: Edit3,
    },
    {
      number: '০৩',
      title: 'ফলাফল যাচাই করো',
      description: 'ফল পাওয়া গেলে তথ্য মিলিয়ে সেভ বা প্রিন্ট করে রাখো।',
      icon: Award,
    },
  ];

  return (
    <section id="how-to-section" className="py-12 sm:py-16 bg-[#FFFFFF] border-y border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          <span className="text-xs font-latin font-bold text-[#006B98] tracking-wider uppercase">
            EASY 3-STEP GUIDE
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#172B3A]">
            যেভাবে রেজাল্ট দেখবে
          </h2>
          <p className="font-body text-[#617381] text-sm sm:text-base">
            সহজ তিন ধাপে তোমার উচ্চমাধ্যমিক ফলাফল দেখার সাধারণ নির্দেশিকা।
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F4] rounded-2xl p-6 border border-[#E2E8F0] relative hover:border-[#006B98]/30 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] text-[#006B98] flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-latin text-2xl font-extrabold text-[#006B98]/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#172B3A]">
                    {step.title}
                  </h3>

                  <p className="font-body text-sm text-[#617381] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E2E8F0]/80 text-[11px] font-heading text-[#617381]/80">
                  ধাপ {step.number} নির্দেশিকা
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
