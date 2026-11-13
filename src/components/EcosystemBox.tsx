import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface TechCardItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}

export const EcosystemBox: React.FC = () => {
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const techCards: TechCardItem[] = [
    {
      id: 'virtual-lab',
      title: 'Virtual Lab',
      tag: 'SIMULATION',
      desc: 'ল্যাব ছাড়াই স্মার্টফোনে বাস্তবধর্মী পদার্থ ও রসায়নের পরীক্ষা-নিরীক্ষা।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Base */}
          <path d="M8 34H32" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 34V30H28V34" fill="#6D28D9" fillOpacity="0.4" stroke="#A78BFA" strokeWidth="1.5" />
          {/* Arm and Stage */}
          <path d="M26 30C26 23 23 18 18 18" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 25H23" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
          {/* Eyepiece and Objective */}
          <rect x="14" y="6" width="6" height="15" rx="2" transform="rotate(-30 14 6)" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <circle cx="21" cy="9" r="2.5" fill="#E0E7FF" />
          <circle cx="13" cy="23" r="1.5" fill="#FDE047" />
        </svg>
      ),
    },
    {
      id: 'ar-3d',
      title: 'AR / 3D Learning',
      tag: 'IMMERSIVE',
      desc: 'বায়োলজি অ্যানাটমি ও জটিল ত্রিমাত্রিক ডায়াগ্রাম অগমেন্টেড রিয়্যালিটিতে সরাসরি দেখা।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Headset Strap */}
          <path d="M9 19C9 13 31 13 31 19" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3 2" />
          {/* Goggles Frame */}
          <rect x="8" y="17" width="24" height="12" rx="5" fill="#00D2FF" stroke="#38BDF8" strokeWidth="2" />
          {/* Visor Glare & Bridge */}
          <circle cx="15" cy="23" r="3.5" fill="#0284C7" />
          <circle cx="25" cy="23" r="3.5" fill="#0284C7" />
          <path d="M18 25C19 23.5 21 23.5 22 25" stroke="#00D2FF" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 20L15 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </svg>
      ),
    },
    {
      id: 'offline-learning',
      title: 'Offline Learning',
      tag: 'NO INTERNET',
      desc: 'ইন্টারনেট ছাড়াই সকল ভিডিও লেকচার ও রিভিশন নোটস যে কোনো সময় পড়ার সুবিধা।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Signal / Progress Bars in vibrant blue gradient */}
          <rect x="8" y="27" width="4.5" height="7" rx="1.5" fill="#38BDF8" />
          <rect x="14.5" y="21" width="4.5" height="13" rx="1.5" fill="#0284C7" />
          <rect x="21" y="15" width="4.5" height="19" rx="1.5" fill="#2563EB" />
          <rect x="27.5" y="9" width="4.5" height="25" rx="1.5" fill="#1D4ED8" />
        </svg>
      ),
    },
    {
      id: 'ai-exam-simulator',
      title: 'AI Exam Simulator',
      tag: 'ADAPTIVE AI',
      desc: 'বোর্ড ও মেডিকেল স্ট্যান্ডার্ডে কৃত্রিম বুদ্ধিমত্তা চালিত তাৎক্ষণিক পরীক্ষা মূল্যায়ন।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Slanted Test Tube with green bubbling chemical */}
          <g transform="rotate(40 20 20)">
            <rect x="17" y="5" width="7" height="24" rx="3.5" stroke="#E0E7FF" strokeWidth="2" fill="none" />
            <path d="M17 17H24V25.5C24 27.433 22.433 29 20.5 29C18.567 29 17 27.433 17 25.5V17Z" fill="#84CC16" />
            {/* Bubbles */}
            <circle cx="19.5" cy="20" r="1" fill="#FEF08A" />
            <circle cx="21.5" cy="24" r="1.5" fill="#ECFCCB" />
          </g>
          {/* Reaction glow */}
          <circle cx="28" cy="12" r="1" fill="#A3E635" />
          <circle cx="10" cy="27" r="1.5" fill="#38BDF8" />
        </svg>
      ),
    },
    {
      id: 'one-minute-learning',
      title: '1-Minute Learning',
      tag: 'FAST REVISION',
      desc: '১ মিনিটের মাইক্রো-ক্যাপসুলে কঠিন কনসেপ্ট ও সূত্রের দ্রুত রিভিশন।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Vibrant orange lightning bolt */}
          <path
            d="M22 6L11 21H20L18 34L29 19H20L22 6Z"
            fill="url(#lightningGrad)"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="lightningGrad" x1="11" y1="6" x2="29" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#EAB308" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      id: 'smart-doubt-map',
      title: 'Smart Doubt Map',
      tag: 'KNOWLEDGE GRAPH',
      desc: 'তোমার দুর্বল অধ্যায় চিহ্নিত করে ঠিক কোন টপিকটি রিভিশন দিতে হবে তা ম্যাপ করা।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Folded Map */}
          <path d="M8 12L15 9L25 13L32 10V29L25 32L15 28L8 31V12Z" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M15 9V28" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M25 13V32" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Location Pin */}
          <circle cx="20" cy="18" r="3.5" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
          <circle cx="20" cy="18" r="1.2" fill="white" />
        </svg>
      ),
    },
    {
      id: 'exam-readiness-score',
      title: 'Exam Readiness Score',
      tag: 'PREDICTIVE',
      desc: 'প্রতিদিনের পড়া ও মক টেস্টের তথ্যের ভিত্তিতে রিয়েল-টাইম ভর্তি প্রস্তুতি স্কোর।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Archery Target */}
          <circle cx="20" cy="20" r="13" stroke="#F43F5E" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="8.5" stroke="#FB7185" strokeWidth="2" fill="#FFE4E6" fillOpacity="0.2" />
          <circle cx="20" cy="20" r="4" fill="#E11D48" />
          {/* Cyan Arrow / Dart hitting center */}
          <path d="M27 13L20 20" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 11L29 15" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'ai-focus-mode',
      title: 'AI Focus Mode',
      tag: 'DEEP WORK',
      desc: 'পড়াশোনার সময় মনোযোগ ধরে রাখতে স্মার্ট ডিসট্র্যাকশন ব্লকার ও স্টাডি টাইমার।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Meditating Yogi / Lotus Figure in warm golden tone */}
          <circle cx="20" cy="12" r="3.5" fill="#F59E0B" />
          <path
            d="M14 26C14 22 17 20 20 20C23 20 26 22 26 26"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10 29C11 26 15 26 18 28L20 29L22 28C25 26 29 26 30 29"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Focus aura dot */}
          <circle cx="20" cy="6" r="1.5" fill="#FDE047" className="animate-pulse" />
        </svg>
      ),
    },
    {
      id: 'mentor-network',
      title: 'Mentor Network',
      tag: '1-ON-1 GUIDANCE',
      desc: 'মেডিকেল ও শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ সিনিয়রদের সাথে ওয়ান-অন-ওয়ান গাইডেন্স।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Golden Handshake */}
          <path
            d="M8 17L15 22L19 19L16 15L10 15L8 17Z"
            fill="#D97706"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          <path
            d="M32 17L25 22L21 19L24 15L30 15L32 17Z"
            fill="#B45309"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          {/* Interlocked fingers */}
          <path
            d="M16 21L20 24L24 21"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="1.5" fill="#FEF3C7" />
        </svg>
      ),
    },
    {
      id: 'global-classroom',
      title: 'Global Classroom',
      tag: 'PEER HUB',
      desc: 'দেশজুড়ে সকল ভবিষ্যৎ ডাক্তার ও বিজ্ঞান শিক্ষার্থীদের সাথে যৌথ ডিসকাশন ফোরাম।',
      icon: (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
          {/* Wireframe Globe in Cyan */}
          <circle cx="20" cy="20" r="12" stroke="#00D2FF" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="6" ry="12" stroke="#00D2FF" strokeWidth="1.8" />
          <line x1="8" y1="20" x2="32" y2="20" stroke="#00D2FF" strokeWidth="1.8" />
          <path d="M11 14C14 16 26 16 29 14" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 26C14 24 26 24 29 26" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="ecosystem-section"
      className={`py-12 sm:py-20 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#060D17] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Background ambient lighting */}
      {isDark ? (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#006B98]/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-[#00D2FF]/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[250px] bg-[#B39724]/12 blur-[120px] pointer-events-none rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#006B98]/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[250px] bg-[#00D2FF]/08 blur-[100px] pointer-events-none rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,107,152,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Futuristic Top Badge */}
        <div className="flex justify-center mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              isDark
                ? 'bg-[#006B98]/25 border-[#00D2FF]/30 shadow-[0_0_15px_rgba(0,210,255,0.15)] text-[#38BDF8]'
                : 'bg-white border-[#006B98]/20 shadow-xs text-[#006B98]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="font-latin text-[11px] font-bold tracking-wider uppercase">
              MEDIX PRIME NEXT-GEN ECOSYSTEM
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl sm:text-4xl filter drop-shadow-[0_0_16px_rgba(56,189,248,0.7)] animate-bounce duration-1000">
              🌏
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-latin font-extrabold tracking-tight drop-shadow-sm transition-colors ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              Future Learning Technologies
            </h2>
          </div>

          <p className={`font-heading text-sm sm:text-base font-medium transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <span className={`font-latin font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#006B98]'}`}>MEDIX PRIME</span> ধাপে ধাপে একটি{' '}
            <span className="font-latin font-semibold text-[#0284C7] dark:text-[#38BDF8]">Complete Education Ecosystem</span> হবে।
          </p>
        </div>

        {/* 10 Technology Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
          {techCards.map((card) => {
            const isActive = activeCardId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCardId(isActive ? null : card.id)}
                className={`group relative rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer border ${
                  isDark
                    ? isActive
                      ? 'border-[#00D2FF] bg-[#0F223D] shadow-[0_0_25px_rgba(0,210,255,0.35)] -translate-y-1'
                      : 'bg-[#0B1526]/90 backdrop-blur-xs border-[#172740] hover:border-[#38BDF8]/60 hover:bg-[#0F1E36] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,107,152,0.3)]'
                    : isActive
                      ? 'border-[#006B98] bg-white shadow-[0_0_20px_rgba(0,107,152,0.2)] -translate-y-1'
                      : 'bg-white border-slate-200 hover:border-[#006B98]/50 hover:bg-slate-50/80 hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Tech tag pill */}
                <div className="mb-2">
                  <span
                    className={`font-latin text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border transition-colors uppercase ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-gray-300 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/40'
                        : 'bg-slate-100 border-slate-200 text-slate-600 group-hover:text-[#006B98] group-hover:border-[#006B98]/30'
                    }`}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Icon Container with glowing hover motion */}
                <div className="h-12 w-12 rounded-xl flex items-center justify-center my-1 group-hover:scale-115 transition-transform duration-300 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  {card.icon}
                </div>

                {/* Title */}
                <h3
                  className={`font-latin font-bold text-xs sm:text-sm lg:text-[13.5px] leading-snug transition-colors mt-1 mb-2 ${
                    isDark
                      ? 'text-white group-hover:text-[#38BDF8]'
                      : 'text-[#0F172A] group-hover:text-[#006B98]'
                  }`}
                >
                  {card.title}
                </h3>

                {/* Micro preview on active / subtle hint */}
                {isActive ? (
                  <p
                    className={`font-heading text-[11px] leading-relaxed pt-1.5 border-t animate-fadeIn ${
                      isDark ? 'text-[#A5F3FC] border-white/10' : 'text-[#0369A1] border-slate-100'
                    }`}
                  >
                    {card.desc}
                  </p>
                ) : (
                  <span
                    className={`font-heading text-[10px] transition-colors ${
                      isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    ক্লিক করে জানো ➔
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Card Highlight Banner if any card is clicked */}
        {activeCardId && (
          <div
            className={`mt-6 p-4 rounded-xl border text-center animate-fadeIn max-w-2xl mx-auto flex items-center justify-between gap-4 ${
              isDark
                ? 'bg-[#0F223D]/90 border-[#00D2FF]/40 text-gray-200'
                : 'bg-white border-[#006B98]/30 text-slate-700 shadow-md'
            }`}
          >
            <div className="text-left">
              <span
                className={`text-[10px] font-latin font-bold uppercase tracking-wider block ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'
                }`}
              >
                ফিচার বিবরণী
              </span>
              <p className="font-heading text-xs sm:text-sm pt-0.5">
                {techCards.find((c) => c.id === activeCardId)?.desc}
              </p>
            </div>
            <button
              onClick={() => setActiveCardId(null)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isDark
                  ? 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              বন্ধ করো
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
