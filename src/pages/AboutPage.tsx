import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Compass,
  GraduationCap,
  BookOpenCheck,
  Target,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';

const ABOUT_HIGHLIGHT_BOXES = [
  {
    icon: Target,
    title: 'শিক্ষার্থী-কেন্দ্রিক ডিজিটাল সহায়তা',
    description:
      'এসএসসি ও এইচএসসি পর্যায়ের শিক্ষার্থীদের একাডেমিক হিসাব, বিষয় নির্বাচন ও প্রস্তুতিকে সহজ ও নির্ভুলভাবে উপস্থাপন করা।',
    accent: '#006B98',
  },
  {
    icon: GraduationCap,
    title: 'বাংলাদেশের সকল বিশ্ববিদ্যালয়ের তথ্য',
    description:
      'দেশের সকল পাবলিক, মেডিকেল, প্রকৌশল, কৃষি, জিএসটি গুচ্ছ ও অনুমোদিত বেসরকারি বিশ্ববিদ্যালয়ের বাস্তব ও আপডেট তথ্য সরবরাহ করা।',
    accent: '#10B981',
  },
  {
    icon: Compass,
    title: 'সঠিক ক্যারিয়ার দিকনির্দেশনা',
    description:
      'নিজস্ব দক্ষতা, আগ্রহ ও একাডেমিক পটভূমির ভিত্তিতে ভবিষ্যতের উপযুক্ত পেশা ও উচ্চশিক্ষার পথ খুঁজে পেতে সাহায্য করা।',
    accent: '#F59E0B',
  },
  {
    icon: BookOpenCheck,
    title: 'বাস্তবসম্মত ও যাচাইকৃত বিশ্লেষণ',
    description:
      'কোনো অনুমান নয়—সরকারি বোর্ড ও বিশ্ববিদ্যালয়ের অফিসিয়াল নীতিমালার আলোকে শিক্ষার্থীদের জন্য স্বচ্ছ দিকনির্দেশনা প্রদান।',
    accent: '#8B5CF6',
  },
];

export const AboutPage: React.FC = () => {
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
            {/* Left Column: Mission Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold ${
                  isDark
                    ? 'bg-[#00D2FF]/15 text-[#00D2FF]'
                    : 'bg-[#006B98]/10 text-[#006B98]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>আমাদের পরিচিতি ও লক্ষ্য</span>
              </div>

              <h1
                className={`font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-[#092C43]'
                }`}
              >
                আমাদের সম্পর্কে
              </h1>

              <div
                className={`font-body text-base sm:text-lg leading-[1.85] space-y-4 ${
                  isDark ? 'text-gray-200' : 'text-[#1E293B]'
                }`}
              >
                <p>
                  MEDIX PRIME একটি আধুনিক শিক্ষার্থী-কেন্দ্রিক ডিজিটাল প্ল্যাটফর্ম, যার লক্ষ্য প্রযুক্তির মাধ্যমে শিক্ষাকে আরও সহজ, স্মার্ট ও সবার জন্য সহজলভ্য করে তোলা।
                </p>

                <p>
                  আমরা বিশ্বাস করি, প্রতিটি শিক্ষার্থীর শেখার সুযোগ, সঠিক দিকনির্দেশনা এবং নিজের ভবিষ্যৎ গড়ার অধিকার রয়েছে।
                </p>

                <div
                  className={`pt-4 border-t ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <p
                    className={`font-heading font-bold text-base sm:text-lg tracking-wide ${
                      isDark ? 'text-[#00D2FF]' : 'text-[#006B98]'
                    }`}
                  >
                    MEDIX PRIME — Empowering Every Student. Building a Smarter Future.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[400px] aspect-4/3 sm:aspect-square flex items-center justify-center">
                <div
                  className={`relative w-full h-full rounded-[45%_55%_65%_35%/45%_45%_55%_55%] overflow-hidden flex items-center justify-center p-3 shadow-2xl transition-transform duration-500 hover:scale-[1.02] border ${
                    isDark
                      ? 'bg-[#152433] border-[#2A435C]/60'
                      : 'bg-[#223945] border-[#334E5C]'
                  }`}
                >
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-05_203405_acb7f098.png"
                    alt="MEDIX PRIME Student & Medical Education Illustration"
                    className="w-full h-full object-cover object-right select-none pointer-events-none scale-110"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Structured Pillar Boxes with New Lucide Icons */}
          <div
            className={`mt-10 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            {ABOUT_HIGHLIGHT_BOXES.map((box, idx) => {
              const IconComp = box.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#060D17]/80 border-[#172740] hover:border-[#00D2FF]/40'
                      : 'bg-slate-50/90 border-slate-200 hover:border-[#006B98]/40 shadow-2xs'
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
