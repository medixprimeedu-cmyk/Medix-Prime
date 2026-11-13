import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Scale, CheckCircle2 } from 'lucide-react';

interface CareerDetails {
  id: string;
  name: string;
  studyYears: string;
  costEstimate: string;
  bdInstitutions: string;
  startingSalary: string;
  growthRate: string;
  workLifeBalance: string;
  jobSecurity: string;
  stressLevel: string;
  globalDemand: string;
}

const CAREERS_DATA: CareerDetails[] = [
  {
    id: 'doctor',
    name: 'চিকিৎসক ও বিশেষজ্ঞ ডাক্তার (এমবিবিএস)',
    studyYears: '৫ বছর এমবিবিএস + ১ বছর ইন্টার্ন + ৩–৫ বছর এফসিপিএস/এমডি',
    costEstimate: 'সরকারি ৩৭ মেডিকেল/এএফএমসি: ~৳১–২ লাখ | বেসরকারি মেডিকেল: ~৳২০–২৮ লাখ (সরকারি নির্ধারিত ফি ও ইন্টার্নশিপসহ)',
    bdInstitutions: 'ঢামেক, সলিমুল্লাহ, চট্টগ্রাম, রাজশাহী, এএফএমসি ও বিএমডিসি অনুমোদিত সরকারি-বেসরকারি মেডিকেল',
    startingSalary: 'গ্রেড-৯ সরকারি (৳৩৫,০০০–৳৫০,০০০+ ভাতাসহ); বিশেষজ্ঞ পর্যায়ে উচ্চতর আয়',
    growthRate: 'অত্যন্ত স্থিতিশীল ও আজীবন চাহিদাসম্পন্ন',
    workLifeBalance: 'শুরুতে মাঝারি-কঠিন (নাইট শিফট ও জরুরি ডিউটি)',
    jobSecurity: 'সর্বোচ্চ (সরকারি বিসিএস স্বাস্থ্য + স্বাধীন প্র্যাকটিস)',
    stressLevel: 'উচ্চ (সরাসরি রোগীর জীবন ও জরুরি সিদ্ধান্ত)',
    globalDemand: 'অত্যন্ত উচ্চ (PLAB, USMLE, AMC দিয়ে বিদেশে সুযোগ)',
  },
  {
    id: 'software',
    name: 'সফটওয়্যার ও এআই ইঞ্জিনিয়ার (সিএসই)',
    studyYears: '৪ বছর বিএসসি ইন সিএসই / সফটওয়্যার ইঞ্জিনিয়ারিং',
    costEstimate: 'পাবলিক বিশ্ববিদ্যালয়: ~৳৫০ হাজার–৳১.৫ লাখ | প্রাইভেট (ব্র্যাক/এনএসইউ/এআইইউবি/অস্ট): ~৳৬–১২ লাখ',
    bdInstitutions: 'বুয়েট, কুয়েট, রুয়েট, চুয়েট, এমআইএসটি, আইইউটি, ঢাবি, সাস্ট, ব্র্যাক, এনএসইউ, এআইইউবি, ইউআইইউ',
    startingSalary: '৳৩৫,০০০ – ৳৯০,০০০+ (দক্ষতাভেদে দেশি ও রিমোট বৈদেশিক কোম্পানিতে আরও বেশি)',
    growthRate: 'অত্যন্ত দ্রুত (অভিজ্ঞতাভেদে ৩–৫ বছরে দ্বিগুণ থেকে চারগুণ)',
    workLifeBalance: 'ভালো (ফ্লেক্সিবল বা রিমোট/হাইব্রিড কাজের সুবিধা)',
    jobSecurity: 'দক্ষতা-নির্ভর (নিয়মিত নতুন প্রযুক্তি শেখা জরুরি)',
    stressLevel: 'মাঝারি (ডেডলাইন ও সিস্টেম ডেলিভারি চাপ)',
    globalDemand: 'সর্বোচ্চ (বাংলাদেশে বসেই যুক্তরাষ্ট্র/ইউরোপের রিমোট চাকরি)',
  },
  {
    id: 'bcs',
    name: 'বিসিএস ক্যাডার ও রাষ্ট্রীয় প্রশাসন',
    studyYears: '৪ বছর স্নাতক + ১–২ বছর বিসিএস (প্রিলি-লিখিত-ভাইভা) প্রস্তুতি',
    costEstimate: 'পাবলিক/জাতীয় বিশ্ববিদ্যালয়ে খুব সাশ্রয়ী (৳৩০ হাজার–৳১ লাখের মধ্যে)',
    bdInstitutions: 'ঢাবি, জাবি, রাবি, চবি, জবি, খুবি, বিইউপি, গুচ্ছ বিশ্ববিদ্যালয়, ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়',
    startingSalary: 'জাতীয় বেতন স্কেল গ্রেড-৯ (বাসস্থান, পরিবহন ও রাষ্ট্রীয় সুবিধাসহ)',
    growthRate: 'নির্ধারিত সরকারি পদোন্নতি সোপান',
    workLifeBalance: 'মাঝারি থেকে ভালো (মাঠ প্রশাসনে কাজের চাপ বেশি)',
    jobSecurity: 'সর্বোচ্চ (স্থায়ী সরকারি চাকরি ও পেনশন/গ্র্যাচুইটি)',
    stressLevel: 'মাঝারি-উচ্চ (জনপ্রশাসন, আইনশৃঙ্খলা ও দায়িত্বশীলতা)',
    globalDemand: 'দেশের ভেতর সর্বোচ্চ মর্যাদা ও পররাষ্ট্র ক্যাডারে কূটনৈতিক সুযোগ',
  },
  {
    id: 'ca',
    name: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (সিএ) ও কর্পোরেট ফিন্যান্স',
    studyYears: '৪ বছর বিবিএ + ৩ বছর আর্টিকেলশিপ / সরাসরি সিএ ৩.৫ বছর',
    costEstimate: 'আইসিএবি টিউশন ও পরীক্ষা ফি সাশ্রয়ী (আর্টিকেলশিপে ভাতা পাওয়া যায়); বিবিএ সরকারি: ~৳১ লাখ, বেসরকারি: ~৳৫–১০ লাখ',
    bdInstitutions: 'ঢাবি IBA ও ব্যবসায় অনুষদ, জাবি IBA, বিইউপি, রাবি, চবি, এনএসইউ, ব্র্যাক ও ICAB নিবন্ধিত ফার্ম',
    startingSalary: 'সিএ সম্পন্ন হলে ৳৬০,০০০ – ৳১,৫০,০০০+ (বহুজাতিক ও শীর্ষ ব্যাংক)',
    growthRate: 'দ্রুত (সিনিয়র অডিটর/CFO পর্যায়ে উচ্চ প্যাকেজ)',
    workLifeBalance: 'অডিট মৌসুমে চাপ বেশি, সাধারণ সময়ে ভালো',
    jobSecurity: 'উচ্চ (আইনগতভাবে কর্পোরেট অডিট বাধ্যতামূলক)',
    stressLevel: 'মাঝারি-উচ্চ (আর্থিক নিরীক্ষা ও ট্যাক্স সময়সীমা)',
    globalDemand: 'উচ্চ (UK, মধ্যপ্রাচ্য, কানাডা, অস্ট্রেলিয়া)',
  },
  {
    id: 'pharmacist',
    name: 'ফার্মাসিস্ট ও বায়োটেকনোলজি গবেষক',
    studyYears: '৪ বছর বি.ফার্ম + ১ বছর এম.ফার্ম / গবেষণা',
    costEstimate: 'পাবলিক বিশ্ববিদ্যালয়: ~৳১ লাখ | প্রাইভেট (এনএসইউ/ইডব্লিউইউ/ব্র্যাক/ইউএপি): ~৳৭–১০ লাখ',
    bdInstitutions: 'ঢাবি, জাবি, রাবি, চবি, খুবি, জবি, নোবিপ্রবি, যবিপ্রবি, মাভাবিপ্রবি এবং এনএসইউ, ইস্ট ওয়েস্ট, ব্র্যাক',
    startingSalary: '৳৩০,০০০ – ৳৬৫,০০০ (শীর্ষ ফার্মা কোম্পানি ও গবেষণা প্রতিষ্ঠান)',
    growthRate: 'ধারাবাহিক (ওষুধ রপ্তানি ও R&D খাতে স্থিতিশীল বৃদ্ধি)',
    workLifeBalance: 'ভালো (নির্ধারিত কর্পোরেট ও ল্যাব শিফট)',
    jobSecurity: 'উচ্চ (দেশের ক্রমবর্ধমান ওষুধ ও স্বাস্থ্য খাত)',
    stressLevel: 'মাঝারি (গুণগত মান ও রেগুলেটরি সতর্কতা)',
    globalDemand: 'অত্যন্ত উচ্চ (উত্তর আমেরিকা ও ইউরোপে গবেষণা ও রেজিস্ট্রেশন)',
  },
  {
    id: 'lawyer',
    name: 'বিচারক (BJS) ও কর্পোরেট আইনজীবী',
    studyYears: '৪ বছর এলএলবি (সম্মান) + ১ বছর এলএলএম / বার কাউন্সিল ও বিজিএসসি',
    costEstimate: 'পাবলিক বিশ্ববিদ্যালয়: ~৳৫০ হাজার–৳১.২ লাখ | বেসরকারি: ~৳৫–৯ লাখ',
    bdInstitutions: 'ঢাবি, রাবি, চবি, জবি, জাবি, খুবি, ইবি, বিইউপি ও গুচ্ছ বিশ্ববিদ্যালয়ের আইন বিভাগ',
    startingSalary: 'সহকারী জজ (বিজিএসসি স্কেল ও সুবিধাসহ) অথবা কর্পোরেট ল ফার্মে ৳৩০,০০০–৳৮০,০০০+',
    growthRate: 'অভিজ্ঞতা ও মামলার দক্ষতা বৃদ্ধির সাথে দ্রুত বৃদ্ধি পায়',
    workLifeBalance: 'সহকারী জজ ও কর্পোরেট ইন-হাউসে সুশৃঙ্খল; প্র্যাকটিসে শ্রমসাধ্য',
    jobSecurity: 'বিজিএসসিতে সর্বোচ্চ; স্বাধীন আইন পেশায় সুনাম-নির্ভর',
    stressLevel: 'মাঝারি-উচ্চ (আইনি বিশ্লেষণ ও ন্যায়বিচারের দায়িত্ব)',
    globalDemand: 'আন্তর্জাতিক সালিশি, কর্পোরেট ও মানবাধিকার সংস্থায় চাহিদা রয়েছে',
  },
];

export const CareerComparisonToolPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [careerAId, setCareerAId] = useState<string>('doctor');
  const [careerBId, setCareerBId] = useState<string>('software');

  const cA = CAREERS_DATA.find((c) => c.id === careerAId) || CAREERS_DATA[0];
  const cB = CAREERS_DATA.find((c) => c.id === careerBId) || CAREERS_DATA[1];

  const metrics: { label: string; key: keyof CareerDetails }[] = [
    { label: 'পড়াশোনা ও প্রশিক্ষণের সময়কাল', key: 'studyYears' },
    { label: 'আনুমানিক শিক্ষা ব্যয় (বাংলাদেশ)', key: 'costEstimate' },
    { label: 'প্রধান শিক্ষা প্রতিষ্ঠানসমূহ', key: 'bdInstitutions' },
    { label: 'শুরুর সম্ভাব্য বেতন ও সুবিধা', key: 'startingSalary' },
    { label: 'ক্যারিয়ার বৃদ্ধির গতি', key: 'growthRate' },
    { label: 'কর্ম-জীবন ভারসাম্য', key: 'workLifeBalance' },
    { label: 'চাকরির নিরাপত্তা ও স্থায়িত্ব', key: 'jobSecurity' },
    { label: 'পেশাগত কাজের চাপ', key: 'stressLevel' },
    { label: 'আন্তর্জাতিক ও বৈশ্বিক চাহিদা', key: 'globalDemand' },
  ];

  return (
    <ToolPageLayout
      toolNumber="১০"
      toolName="ক্যারিয়ার তুলনা টুল"
      categoryLabel="ক্যারিয়ার সরঞ্জাম"
      iconName="Scale"
      accentColor="#C084FC"
      description="বাংলাদেশের প্রেক্ষাপটে যেকোনো দুটি পেশার শিক্ষা সময়কাল, আনুমানিক খরচ, সংশ্লিষ্ট বিশ্ববিদ্যালয়, বেতন এবং আন্তর্জাতিক সুযোগের সরাসরি তুলনা করুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                প্রথম ক্যারিয়ার নির্বাচন করুন (ক):
              </label>
              <select
                value={careerAId}
                onChange={(e) => setCareerAId(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-purple-500/40 text-white focus:border-purple-400'
                    : 'bg-purple-50/40 border-purple-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                {CAREERS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>
                দ্বিতীয় ক্যারিয়ার নির্বাচন করুন (খ):
              </label>
              <select
                value={careerBId}
                onChange={(e) => setCareerBId(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-sky-500/40 text-white focus:border-sky-400'
                    : 'bg-sky-50/40 border-sky-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                {CAREERS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className={`overflow-x-auto rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-xs font-heading font-extrabold ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <th className={`p-4 w-1/4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>তুলনার মাপকাঠি</th>
                <th className={`p-4 w-3/8 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>{cA.name}</th>
                <th className={`p-4 w-3/8 ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>{cB.name}</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-heading ${isDark ? 'divide-white/10' : 'divide-slate-200'}`}>
              {metrics.map((m, idx) => (
                <tr key={idx} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'} transition-colors`}>
                  <td className={`p-4 font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{m.label}</td>
                  <td className={`p-4 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {cA[m.key]}
                  </td>
                  <td className={`p-4 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {cB[m.key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-2xl border text-xs font-heading leading-relaxed flex items-start gap-2.5 ${
            isDark
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
              : 'bg-purple-50 border-purple-200 text-purple-950'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-purple-400' : 'text-purple-700'}`} />
          <div>
            <span className="font-bold block mb-0.5">সিদ্ধান্ত গ্রহণের দিকনির্দেশনা:</span>
            চূড়ান্ত পেশা বাছাইয়ে কেবল শুরুর বেতন নয়, বরং আপনার পছন্দের বিষয়ে ৫–১০ বছর একটানা কাজ করার আগ্রহ এবং পারিবারিক আর্থিক সক্ষমতাকে সমান গুরুত্ব দিন।
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
