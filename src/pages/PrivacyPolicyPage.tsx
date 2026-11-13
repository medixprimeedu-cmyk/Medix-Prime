import React from 'react';
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  Key,
  FileText,
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
        {/* Top Back Navigation Link */}
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

        {/* Main Display Card */}
        <div
          className={`rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-300 border ${
            isDark
              ? 'bg-[#0B1526]/90 border-[#172740] shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
              : 'bg-white/90 backdrop-blur-md border-slate-200/80 shadow-[0_20px_45px_rgba(15,23,42,0.06)]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Core Privacy Statements */}
            <div className="lg:col-span-7 space-y-5">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold ${
                  isDark
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-emerald-500/10 text-emerald-700'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>নিরাপত্তা ও তথ্যের সুরক্ষা</span>
              </div>

              <h1
                className={`font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-[#092C43]'
                }`}
              >
                গোপনীয়তা নীতি
              </h1>

              <div
                className={`font-body text-base sm:text-lg leading-[1.85] space-y-4 ${
                  isDark ? 'text-gray-200' : 'text-[#1E293B]'
                }`}
              >
                <p>
                  MEDIX PRIME ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা ও নিরাপত্তাকে গুরুত্ব দেয়। আমরা শুধুমাত্র সেবা প্রদান ও উন্নত করার প্রয়োজনে প্রয়োজনীয় তথ্য সংগ্রহ করি।
                </p>

                <p>
                  ব্যবহারকারীর ব্যক্তিগত তথ্য অনুমতি ছাড়া তৃতীয় পক্ষের কাছে বিক্রি বা প্রকাশ করা হয় না। তথ্যের নিরাপত্তা বজায় রাখতে আমরা যথাযথ ব্যবস্থা গ্রহণের চেষ্টা করি।
                </p>

                <p>
                  MEDIX PRIME ব্যবহার করার মাধ্যমে আপনি এই গোপনীয়তা নীতিতে সম্মতি প্রদান করছেন।
                </p>

                <div
                  className={`pt-4 border-t ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <p
                    className={`font-heading font-bold text-base sm:text-lg tracking-wide ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    আপনার তথ্য, আপনার গোপনীয়তা—আমাদের অগ্রাধিকার।
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Privacy & Security Badge Composition */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[400px] aspect-4/3 sm:aspect-square flex items-center justify-center">
                <div
                  className={`relative w-full h-full rounded-[45%_55%_65%_35%/45%_45%_55%_55%] overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl transition-transform duration-500 hover:scale-[1.02] border ${
                    isDark
                      ? 'bg-[#152433] border-[#2A435C]/60 text-white'
                      : 'bg-[#223945] border-[#334E5C] text-white'
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-emerald-400/20 to-sky-500/20 border-2 border-emerald-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                        <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-linear-to-tr from-[#006B98] to-[#00D2FF] border-2 border-[#223945] flex items-center justify-center shadow-lg">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="space-y-2.5 max-w-xs">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-heading font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>নিরাপদ ও সুরক্ষিত</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-[11px] text-gray-300 font-heading">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3 text-sky-400" /> তথ্য সুরক্ষা
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-400" /> স্বচ্ছ নীতি
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Structured Privacy Pillar Boxes with New Lucide Icons */}
          <div
            className={`mt-10 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
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
