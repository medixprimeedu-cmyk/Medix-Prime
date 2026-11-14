import React from 'react';
import {
  ArrowLeft,
  Rocket,
  Award,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';

const ABOUT_HIGHLIGHT_BOXES = [
  {
    icon: Rocket,
    title: 'শিক্ষার্থী-কেন্দ্রিক ডিজিটাল সহায়তা',
    description:
      'এসএসসি ও এইচএসসি পর্যায়ের শিক্ষার্থীদের একাডেমিক হিসাব, বিষয় নির্বাচন ও প্রস্তুতিকে সহজ ও নির্ভুলভাবে উপস্থাপন করা।',
    accent: '#00D2FF',
  },
  {
    icon: Award,
    title: 'বাংলাদেশের সকল বিশ্ববিদ্যালয়ের তথ্য',
    description:
      'দেশের সকল পাবলিক, মেডিকেল, প্রকৌশল, কৃষি, জিএসটি গুচ্ছ ও অনুমোদিত বেসরকারি বিশ্ববিদ্যালয়ের বাস্তব ও আপডেট তথ্য সরবরাহ করা।',
    accent: '#34D399',
  },
  {
    icon: Lightbulb,
    title: 'সঠিক ক্যারিয়ার দিকনির্দেশনা',
    description:
      'নিজস্ব দক্ষতা, আগ্রহ ও একাডেমিক পটভূমির ভিত্তিতে ভবিষ্যতের উপযুক্ত পেশা ও উচ্চশিক্ষার পথ খুঁজে পেতে সাহায্য করা।',
    accent: '#FBBF24',
  },
  {
    icon: ShieldCheck,
    title: 'বাস্তবসম্মত ও যাচাইকৃত বিশ্লেষণ',
    description:
      'কোনো অনুমান নয়—সরকারি বোর্ড ও বিশ্ববিদ্যালয়ের অফিসিয়াল নীতিমালার আলোকে শিক্ষার্থীদের জন্য স্বচ্ছ দিকনির্দেশনা প্রদান।',
    accent: '#A78BFA',
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
              আমাদের সম্পর্কে
            </h1>
            <p className={`font-body text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              MEDIX PRIME সম্পর্কে বিস্তারিত ও আমাদের প্রধান লক্ষ্যসমূহ।
            </p>
          </div>

          <div
            className={`pt-6 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
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
