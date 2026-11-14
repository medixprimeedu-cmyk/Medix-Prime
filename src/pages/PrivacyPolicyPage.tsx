import React from 'react';
import {
  ArrowLeft,
  Database,
  EyeOff,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';

const PRIVACY_PILLAR_BOXES = [
  {
    icon: Database,
    title: 'প্রয়োজনীয় ন্যূনতম তথ্য',
    description:
      'শুধুমাত্র শিক্ষার্থীর নাম, শ্রেণী, শিক্ষা প্রতিষ্ঠান ও যোগাযোগের নম্বর সেবার মান উন্নয়ন ও সঠিক দিকনির্দেশনার জন্য গ্রহণ করা হয়।',
    accent: '#10B981',
  },
  {
    icon: EyeOff,
    title: 'তৃতীয় পক্ষের কাছে বিক্রি নয়',
    description:
      'ব্যবহারকারীর অনুমতি ব্যতীত কোনো ব্যক্তিগত তথ্য বিজ্ঞাপনদাতা বা তৃতীয় পক্ষের নিকট হস্তান্তর, বিক্রয় বা প্রকাশ করা হয় না।',
    accent: '#006B98',
  },
  {
    icon: ShieldCheck,
    title: 'সুরক্ষিত সংরক্ষণ ব্যবস্থা',
    description:
      'তথ্যের নিরাপত্তা ও অখণ্ডতা বজায় রাখতে আধুনিক সার্ভার-সাইড সুরক্ষা ও এনক্রিপ্টেড যোগাযোগ ব্যবস্থা ব্যবহার করা হয়।',
    accent: '#8B5CF6',
  },
  {
    icon: UserCheck,
    title: 'স্বচ্ছতা ও ব্যবহারকারীর সম্মতি',
    description:
      'MEDIX PRIME-এর সকল টুল সম্পূর্ণ বিনামূল্যে ও স্বচ্ছ নীতির অধীনে পরিচালিত হয়—আপনার সম্মতিই আমাদের অঙ্গীকার।',
    accent: '#F59E0B',
  },
];

export const PrivacyPolicyPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-[calc(100vh-5rem)] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-10 transition-colors duration-300 ${
        isDark ? 'bg-[#060D17] text-white' : 'bg-[#DCE5EC] text-[#0F172A]'
      }`}
    >
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <div>
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-medium transition-all px-3.5 py-2 rounded-xl ${
              isDark
                ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                : 'text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>
        </div>

        <div
          className={`rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-300 border space-y-8 ${
            isDark
              ? 'bg-[#0B1526]/90 border-[#172740] shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
              : 'bg-white/90 backdrop-blur-md border-slate-200/80 shadow-[0_20px_45px_rgba(15,23,42,0.06)]'
          }`}
        >
          <div className="space-y-2">
            <h1
              className={`font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-[#092C43]'
              }`}
            >
              গোপনীয়তা নীতি
            </h1>
            <p className={`font-body text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              MEDIX PRIME-এর ডেটা সুরক্ষা ও গোপনীয়তা নীতি সংক্রান্ত নীতিমালা।
            </p>
          </div>

          <div
            className={`pt-6 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            {PRIVACY_PILLAR_BOXES.map((box, idx) => {
              const IconComp = box.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#060D17]/80 border-[#172740] hover:border-emerald-400/40'
                      : 'bg-slate-50/90 border-slate-200 hover:border-emerald-500/40 shadow-2xs'
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 border"
                    style={{
                      backgroundColor: `${box.accent}18`,
                      borderColor: `${box.accent}35`,
                      color: box.accent,
                    }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h2
                    className={`font-heading font-bold text-sm sm:text-base mb-1.5 ${
                      isDark ? 'text-white' : 'text-[#092C43]'
                    }`}
                  >
                    {box.title}
                  </h2>
                  <p
                    className={`font-body text-xs sm:text-[13px] leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {box.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
