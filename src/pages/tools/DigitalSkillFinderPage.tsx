import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Laptop, Clock, Layers } from 'lucide-react';

interface DigitalSkill {
  id: string;
  name: string;
  category: string;
  interestTag: 'coding' | 'design' | 'marketing' | 'data';
  totalHoursNeeded: number;
  demand: 'অত্যন্ত উচ্চ' | 'উচ্চ';
  tools: string[];
  bdOpportunity: string;
  startingSteps: string[];
}

const DIGITAL_SKILLS: DigitalSkill[] = [
  {
    id: 'web-dev',
    name: 'ফুল-স্ট্যাক ওয়েব ও অ্যাপ ডেভেলপমেন্ট',
    category: 'সফটওয়্যার ও ওয়েব ইঞ্জিনিয়ারিং',
    interestTag: 'coding',
    totalHoursNeeded: 320,
    demand: 'অত্যন্ত উচ্চ',
    tools: ['HTML/CSS & Tailwind', 'TypeScript / JavaScript', 'React / Next.js', 'Node.js & PostgreSQL'],
    bdOpportunity: 'দেশের সফটওয়্যার কোম্পানি, ফ্রিল্যান্সিং (Upwork/Fiverr) ও আন্তর্জাতিক রিমোট চাকরি (৳৪০,০০০ – ৳১,৫০,০০০+)',
    startingSteps: [
      'এইচটিএমএল, সিএসএস ও জাভাস্ক্রিপ্টের মূল ভিত্তি শেখা',
      'রিঅ্যাক্ট (React) দিয়ে অন্তত ৩টি বাস্তব প্রজেক্ট গিটহাবে প্রকাশ করা',
      'ব্যাকএন্ড এপিআই, ডাটাবেজ ও ডেপ্লয়মেন্ট অনুশীলন',
    ],
  },
  {
    id: 'python-ai',
    name: 'পাইথন প্রোগ্রামিং ও এআই অটোমেশন',
    category: 'কৃত্রিম বুদ্ধিমত্তা ও অটোমেশন',
    interestTag: 'coding',
    totalHoursNeeded: 260,
    demand: 'অত্যন্ত উচ্চ',
    tools: ['Python', 'NumPy & Pandas', 'Scikit-learn / PyTorch', 'LLM API ও Workflow Automation'],
    bdOpportunity: 'এআই ডেভেলপার, ডাটা ইঞ্জিনিয়ার, বিদেশি রিসার্চ ও টেক স্টার্টআপ ক্যারিয়ার',
    startingSteps: [
      'পাইথন বেসিক সিনট্যাক্স, ফাংশন ও অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং',
      'ডাটা ক্লিনিং ও ভিজ্যুয়ালাইজেশন লাইব্রেরি ব্যবহার',
      'এপিআই ভিত্তিক স্মার্ট অটোমেশন ও মিনি এআই অ্যাপ্লিকেশন তৈরি',
    ],
  },
  {
    id: 'ui-ux',
    name: 'ইউআই/ইউএক্স ডিজাইন ও প্রোডাক্ট ডিজাইন',
    category: 'ক্রিয়েটিভ ও ডিজিটাল ডিজাইন',
    interestTag: 'design',
    totalHoursNeeded: 180,
    demand: 'উচ্চ',
    tools: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    bdOpportunity: 'দেশীয় প্রযুক্তি কোম্পানি, ডিজাইন এজেন্সি এবং গ্লোবাল রিমোট প্রোডাক্ট টিম (৳৩৫,০০০ – ৳১,০০,০০০+)',
    startingSteps: [
      'কালার থিওরি, টাইপোগ্রাফি ও গ্রিড লেআউটের নিয়ম শেখা',
      'ফিগমা (Figma) ব্যবহার করে মোবাইল ও ওয়েব অ্যাপের পূর্ণাঙ্গ কেস স্টাডি তৈরি',
      'বিহ্যান্স (Behance) ও ড্রিবল (Dribbble) পোর্টফোলিও সমৃদ্ধ করা',
    ],
  },
  {
    id: 'video-motion',
    name: 'ভিডিও এডিটিং ও মোশন গ্রাফিক্স',
    category: 'ডিজিটাল মিডিয়া ও কন্টেন্ট',
    interestTag: 'design',
    totalHoursNeeded: 150,
    demand: 'উচ্চ',
    tools: ['Premiere Pro / DaVinci Resolve', 'After Effects', 'Sound Design', 'Storytelling'],
    bdOpportunity: 'এডু-টেক প্ল্যাটফর্ম, মিডিয়া এজেন্সি, ইউটিউব চ্যানেল ও আন্তর্জাতিক ক্লায়েন্ট প্রজেক্ট',
    startingSteps: [
      'কাট, ট্রানজিশন, কালার গ্রেডিং ও অডিও সিঙ্কিং শেখা',
      'আফটার ইফেক্টস দিয়ে ইনফোগ্রাফিক ও এক্সপ্লেইনার অ্যানিমেশন তৈরি',
      'শিক্ষামূলক ও ব্র্যান্ড স্টোরি শোরিল (Showreel) প্রস্তুত করা',
    ],
  },
  {
    id: 'digital-marketing',
    name: 'ডিজিটাল মার্কেটিং, এসইও ও পারফরম্যান্স অ্যাডস',
    category: 'গ্রোথ মার্কেটিং ও ই-কমার্স',
    interestTag: 'marketing',
    totalHoursNeeded: 140,
    demand: 'উচ্চ',
    tools: ['SEO & Search Console', 'Google Analytics 4', 'Meta & Google Ads', 'Content Strategy'],
    bdOpportunity: 'দেশের ই-কমার্স ব্র্যান্ড, কর্পোরেট মার্কেটিং ও ফ্রিল্যান্সিং এজেন্সি (৳২৫,০০০ – ৳৮০,০০০+)',
    startingSteps: [
      'সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও কীওয়ার্ড রিসার্চ শেখা',
      'গুগল অ্যানালিটিক্স ও অ্যাড ক্যাম্পেইন পারফরম্যান্স বিশ্লেষণ',
      'বাস্তব কোনো ওয়েবসাইট বা স্টার্টআপ প্রজেক্টে ক্যাম্পেইন অনুশীলন',
    ],
  },
  {
    id: 'data-excel',
    name: 'ডাটা অ্যানালিটিক্স, এক্সেল ও পাওয়ার বিআই',
    category: 'বিজনেস ইন্টেলিজেন্স ও অ্যানালিটিক্স',
    interestTag: 'data',
    totalHoursNeeded: 160,
    demand: 'অত্যন্ত উচ্চ',
    tools: ['Microsoft Excel (Advanced)', 'SQL', 'Power BI / Looker Studio', 'Statistics'],
    bdOpportunity: 'ব্যাংক, টেলিকম, কর্পোরেট অডিট, গবেষণা সংস্থা (আইসিডিডিআর,বি/ব্র্যাক) এবং ই-কমার্স খাত',
    startingSteps: [
      'এক্সেল পিভট টেবিল, এক্সলুকআপ (XLOOKUP) ও ড্যাশবোর্ড ডিজাইন শেখা',
      'রিলেশনাল ডাটাবেজের জন্য এসকিউএল (SQL) কোয়েরি অনুশীলন',
      'পাওয়ার বিআই দিয়ে বাস্তব ব্যবসায়িক বা স্বাস্থ্য তথ্যের ড্যাশবোর্ড তৈরি',
    ],
  },
];

const toBn = (n: number): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const DigitalSkillFinderPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [interest, setInterest] = useState<'all' | 'coding' | 'design' | 'marketing' | 'data'>('all');
  const [weeklyHours, setWeeklyHours] = useState<number>(10);

  const skillsWithTimeline = useMemo(() => {
    const filtered =
      interest === 'all'
        ? DIGITAL_SKILLS
        : DIGITAL_SKILLS.filter((s) => s.interestTag === interest);

    return filtered.map((skill) => {
      const weeks = Math.max(1, Math.ceil(skill.totalHoursNeeded / Math.max(1, weeklyHours)));
      const months = Number((weeks / 4.3).toFixed(1));
      return { ...skill, weeks, months };
    });
  }, [interest, weeklyHours]);

  return (
    <ToolPageLayout
      toolNumber="১৮"
      toolName="ডিজিটাল স্কিল ফাইন্ডার"
      categoryLabel="ব্যক্তিগত উন্নয়ন"
      iconName="Laptop"
      accentColor="#14B8A6"
      description="পড়াশোনার পাশাপাশি বর্তমান যুগোপযোগী কোন প্রযুক্তিগত দক্ষতা শিখবেন এবং সপ্তাহে আপনার বরাদ্দ সময় অনুযায়ী কত দিনে আয়ত্ত করতে পারবেন তা দেখুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                আপনার আগ্রহের ক্ষেত্র বাছুন:
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value as typeof interest)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-teal-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="all">সবগুলো আধুনিক ডিজিটাল স্কিল</option>
                <option value="coding">প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট ও এআই</option>
                <option value="design">ইউআই/ইউএক্স ডিজাইন, ভিডিও এডিটিং ও মোশন</option>
                <option value="marketing">ডিজিটাল মার্কেটিং, এসইও ও ব্র্যান্ড গ্রোথ</option>
                <option value="data">ডাটা অ্যানালিটিক্স, এক্সেল ও বিজনেস ইন্টেলিজেন্স</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-heading font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  সপ্তাহে কত ঘণ্টা স্কিল শেখার জন্য দিতে পারবেন?
                </label>
                <span className={`text-sm font-heading font-black ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
                  {toBn(weeklyHours)} ঘণ্টা / সপ্তাহ
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={35}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className={`flex justify-between text-[11px] font-heading mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>৩ ঘণ্টা (হালকা)</span>
                <span>১৫ ঘণ্টা (নিয়মিত)</span>
                <span>৩৫ ঘণ্টা (নিবিড়)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillsWithTimeline.map((skill) => (
            <div
              key={skill.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                        : 'bg-teal-50 border-teal-200 text-teal-800'
                    }`}
                  >
                    {skill.category}
                  </span>
                  <span
                    className={`text-[11px] font-heading font-bold px-2 py-0.5 rounded-md ${
                      isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    চাহিদা: {skill.demand}
                  </span>
                </div>

                <h3 className={`font-heading font-bold text-base sm:text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {skill.name}
                </h3>

                <div
                  className={`p-3 rounded-xl border mb-3 flex items-center justify-between text-xs font-heading ${
                    isDark ? 'bg-teal-500/10 border-teal-500/25' : 'bg-teal-50 border-teal-200'
                  }`}
                >
                  <span className={`flex items-center gap-1.5 font-semibold ${isDark ? 'text-teal-200' : 'text-teal-900'}`}>
                    <Clock className="w-4 h-4" />
                    <span>প্রস্তুতির আনুমানিক সময়:</span>
                  </span>
                  <span className={`font-black ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>
                    {toBn(skill.weeks)} সপ্তাহ (~{toBn(skill.months)} মাস)
                  </span>
                </div>

                <p className={`text-xs font-heading leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>কর্মসংস্থান ও আয়:</strong>{' '}
                  {skill.bdOpportunity}
                </p>

                <div className="mb-3">
                  <span className={`text-[11px] font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    শেখার মূল সফটওয়্যার ও টুলস:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tools.map((t, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-md font-latin text-[11px] font-semibold border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`pt-3 border-t text-xs font-heading ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <span className={`font-bold flex items-center gap-1.5 mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span>ধাপভিত্তিক শুরু:</span>
                </span>
                <ol className="space-y-1 pl-4 list-decimal">
                  {skill.startingSteps.map((step, idx) => (
                    <li key={idx} className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};
