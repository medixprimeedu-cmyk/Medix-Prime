import React, { useMemo, useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Compass, RotateCcw, Copy, Check, GraduationCap, Building2 } from 'lucide-react';

interface CareerProfile {
  id: string;
  title: string;
  field: string;
  interestTag: 'science' | 'tech' | 'business' | 'social';
  workTag: 'hands_on' | 'remote_desk' | 'research' | 'leadership';
  goalTag: 'social_impact' | 'global_income' | 'power_prestige' | 'innovation';
  whyFit: string;
  educationReq: string;
  bdInstitutions: string[];
  keySkills: string[];
  startingSalary: string;
  alternativePaths: string[];
}

const CAREER_DATABASE: CareerProfile[] = [
  {
    id: 'mbbs-doctor',
    title: 'চিকিৎসক ও বিশেষজ্ঞ ডাক্তার (এমবিবিএস)',
    field: 'স্বাস্থ্যসেবা ও ক্লিনিক্যাল সায়েন্স',
    interestTag: 'science',
    workTag: 'hands_on',
    goalTag: 'social_impact',
    whyFit:
      'মানুষের সরাসরি চিকিৎসা, জরুরি রোগী ব্যবস্থাপনা এবং জীববিজ্ঞান ও মানবদেহ বিষয়ে গভীর আগ্রহের সাথে সরাসরি সামঞ্জস্যপূর্ণ।',
    educationReq:
      'এইচএসসি (বিজ্ঞান ও জীববিজ্ঞানসহ) ➔ ডিজিএমই (DGME) মেডিকেল ভর্তি পরীক্ষা ➔ ৫ বছর এমবিবিএস ➔ ১ বছর ইন্টার্নশিপ ➔ বিএমডিসি (BMDC) নিবন্ধন ➔ এফসিপিএস / এমডি / এমএস / বিসিএস (স্বাস্থ্য)',
    bdInstitutions: [
      'ঢাকা মেডিকেল কলেজ (DMC) ও ৩৭টি সরকারি মেডিকেল কলেজ',
      'আর্মড ফোর্সেস মেডিকেল কলেজ (AFMC) ও ৫টি আর্মি মেডিকেল কলেজ',
      'বাংলাদেশ মেডিকেল বিশ্ববিদ্যালয় (BMU — স্নাতকোত্তর)',
      'স্বীকৃত বেসরকারি মেডিকেল কলেজসমূহ (ইব্রাহিম, বারডেম, হলি ফ্যামিলি, আদ্-দ্বীন, নর্থ সাউথ/ইস্ট ওয়েস্ট প্রভৃতি)',
    ],
    keySkills: [
      'ক্লিনিক্যাল রোগ নির্ণয় ও চিকিৎসা ব্যবস্থাপনা',
      'জরুরি পরিস্থিতিতে দ্রুত ও নির্ভুল সিদ্ধান্ত',
      'রোগীর প্রতি সহমর্মিতা ও পেশাগত নৈতিকতা',
      'গবেষণা ও আধুনিক চিকিৎসা নির্দেশিকা অনুসরণ',
    ],
    startingSalary: 'জাতীয় বেতন স্কেল গ্রেড-৯ (সরকারি) ও বেসরকারি হাসপাতালে ৳৪০,০০০ – ৳৮৫,০০০+',
    alternativePaths: ['ডেন্টাল সার্জন (বিডিএস)', 'পাবলিক হেলথ স্পেশালিস্ট (এমপিএইচ)', 'মেডিকেল রিসার্চ (আইসিডিডিআর,বি)'],
  },
  {
    id: 'software-ai-engineer',
    title: 'সফটওয়্যার ও কৃত্রিম বুদ্ধিমত্তা প্রকৌশলী (সিএসই / এআই)',
    field: 'তথ্যপ্রযুক্তি ও প্রকৌশল',
    interestTag: 'tech',
    workTag: 'remote_desk',
    goalTag: 'innovation',
    whyFit:
      'গাণিতিক যুক্তি, অ্যালগরিদম বিশ্লেষণ, সফটওয়্যার নির্মাণ এবং দেশি বা বৈশ্বিক রিমোট প্রযুক্তিক্ষেত্রে কাজের সাথে উপযুক্ত।',
    educationReq:
      'এইচএসসি (উচ্চতর গণিত ও পদার্থবিজ্ঞানসহ) ➔ বুয়েট / সিকেআরইউইটি / ঢাবি / জাবি / শাবিপ্রবি / আইইউটি / বেসরকারি বিশ্ববিদ্যালয় ➔ ৪ বছর বিএসসি ইন সিএসই বা সফটওয়্যার ইঞ্জিনিয়ারিং',
    bdInstitutions: [
      'বুয়েট (BUET), কুয়েট (KUET), রুয়েট (RUET), চুয়েট (CUET), এমআইএসটি (MIST), আইইউটি (IUT)',
      'ঢাকা বিশ্ববিদ্যালয় (CSE ও IIT), জাহাঙ্গীরনগর, রাজশাহী, চট্টগ্রাম, খুলনা বিশ্ববিদ্যালয়',
      'শাবিপ্রবি (SUST) ও জিএসটি গুচ্ছভুক্ত বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়সমূহ',
      'ব্র্যাক বিশ্ববিদ্যালয়, এনএসইউ, এআইইউবি, ইউআইইউ, ইস্ট ওয়েস্ট, অস্ট, ডিআইইউ',
    ],
    keySkills: [
      'প্রোগ্রামিং (C++, Python, TypeScript, Java)',
      'ডাটা স্ট্রাকচার, অ্যালগরিদম ও সিস্টেম ডিজাইন',
      'ক্লাউড, ওয়েব/মোবাইল আর্কিটেকচার ও ডাটাবেজ',
      'মেশিন লার্নিং ও এআই ইন্টিগ্রেশন',
    ],
    startingSalary: '৳৪০,০০০ – ৳১,১০,০০০ (দেশীয় টেক কোম্পানি) ও আন্তর্জাতিক রিমোট ক্যারিয়ারে উচ্চতর আয়',
    alternativePaths: ['ডাটা সায়েন্টিস্ট', 'সাইবার সিকিউরিটি বিশ্লেষক', 'প্রোডাক্ট ও ক্লাউড আর্কিটেক্ট'],
  },
  {
    id: 'pharmacy-biotech-scientist',
    title: 'ফার্মাসিস্ট ও বায়োটেকনোলজি গবেষক',
    field: 'ওষুধ শিল্প ও জৈবপ্রযুক্তি',
    interestTag: 'science',
    workTag: 'research',
    goalTag: 'innovation',
    whyFit:
      'রসায়ন, জীববিজ্ঞান ও ল্যাবরেটরি গবেষণার মাধ্যমে নতুন ওষুধ উদ্ভাবন ও মান নিয়ন্ত্রণে কাজ করার জন্য আদর্শ।',
    educationReq:
      'এইচএসসি (রসায়ন, জীববিজ্ঞান ও পদার্থবিজ্ঞানসহ) ➔ বি.ফার্ম (৪ বছর + প্রফেশনাল এম.ফার্ম) অথবা বায়োকেমিস্ট্রি / জেনেটিক ইঞ্জিনিয়ারিং (৪ বছর) ➔ ফার্মেসি কাউন্সিল নিবন্ধন',
    bdInstitutions: [
      'ঢাকা বিশ্ববিদ্যালয় (ফার্মেসি অনুষদ, প্রাণরসায়ন, জেনেটিক ইঞ্জিনিয়ারিং)',
      'জাহাঙ্গীরনগর, রাজশাহী, চট্টগ্রাম, খুলনা, জগন্নাথ ও কুমিল্লা বিশ্ববিদ্যালয়',
      'নোয়াখালী বিজ্ঞান ও প্রযুক্তি, যশোর বিজ্ঞান ও প্রযুক্তি, মাভাবিপ্রবি, ইসলামি বিশ্ববিদ্যালয়',
      'নর্থ সাউথ (NSU), ব্র্যাক (BRACU), ইস্ট ওয়েস্ট (EWU), এশিয়া প্যাসিফিক (UAP), ড্যাফোডিল (DIU)',
    ],
    keySkills: [
      'ওষুধ ফর্মুলেশন ও কোয়ালিটি কন্ট্রোল (QC/QA)',
      'পিসিআর, ডিএনএ বিশ্লেষণ ও মলিকুলার রিসার্চ',
      'জিএমপি (GMP) ও আন্তর্জাতিক রেগুলেটরি মানদণ্ড',
      'বায়ো-ইনফরমেটিক্স ও গবেষণাপত্র বিশ্লেষণ',
    ],
    startingSalary: '৳৩২,০০০ – ৳৭০,০০০ (শীর্ষ ফার্মাসিউটিক্যালস: স্কয়ার, ইনসেপ্টা, বেক্সিমকো, রেনাটা ও গবেষণা ল্যাব)',
    alternativePaths: ['ক্লিনিক্যাল রিসার্চ অ্যাসোসিয়েট', 'রেগুলেটরি অ্যাফেয়ার্স স্পেশালিস্ট', 'উচ্চশিক্ষা ও পিএইচডি'],
  },
  {
    id: 'finance-chartered-accountant',
    title: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (সিএ) ও কর্পোরেট ফিন্যান্স বিশ্লেষক',
    field: 'ব্যাংকিং, অডিট ও কর্পোরেট অর্থনীতি',
    interestTag: 'business',
    workTag: 'leadership',
    goalTag: 'global_income',
    whyFit:
      'ব্যবসা বিশ্লেষণ, হিসাববিজ্ঞান, কর্পোরেট কৌশল এবং উচ্চ বেতনের বাণিজ্যিক ও ব্যাংকিং খাতে নেতৃত্ব দিতে আগ্রহীদের জন্য সেরা।',
    educationReq:
      'এইচএসসি (যেকোনো বিভাগ) ➔ বিবিএ (অ্যাকাউন্টিং/ফিন্যান্স/আইবিএ) ➔ আইসিএবি (ICAB — CA), এসিসিএ (ACCA), অথবা সিএফএ (CFA)',
    bdInstitutions: [
      'ঢাকা বিশ্ববিদ্যালয় (IBA ও ব্যবসায় শিক্ষা অনুষদ — গ ইউনিট)',
      'জাহাঙ্গীরনগর (IBA-JU), বিইউপি (BUP), রাজশাহী ও চট্টগ্রাম বিশ্ববিদ্যালয় (BBA)',
      'আইসিএবি (ICAB) নিবন্ধিত ফার্মে আর্টিকেলশিপ',
      'এনএসইউ (NSU), ব্র্যাক বিশ্ববিদ্যালয়, ইস্ট ওয়েস্ট, আইইউবি, এআইইউবি, ইউআইইউ',
    ],
    keySkills: [
      'আর্থিক প্রতিবেদন বিশ্লেষণ ও IFRS মানদণ্ড',
      'কর, ভ্যাট ও অডিট কমপ্লায়েন্স',
      'বিনিয়োগ ও কর্পোরেট ঝুঁকি মূল্যায়ন',
      'এক্সেল মডেলিং ও ব্যবসায়িক নেতৃত্ব',
    ],
    startingSalary: '৳৪৫,০০০ – ৳১,২৫,০০০+ (সিএ/সিএফএ সম্পন্ন করলে বহুজাতিক কোম্পানি ও ব্যাংকে উচ্চ বেতন)',
    alternativePaths: ['ইনভেস্টমেন্ট ব্যাংকার', 'কর্পোরেট ট্যাক্স উপদেষ্টা', 'ম্যানেজমেন্ট কনসালট্যান্ট'],
  },
  {
    id: 'bcs-civil-service',
    title: 'বিসিএস ক্যাডার ও পাবলিক অ্যাডমিনিস্ট্রেটর',
    field: 'জনপ্রশাসন, পররাষ্ট্র ও রাষ্ট্রীয় নীতিনির্ধারণ',
    interestTag: 'social',
    workTag: 'leadership',
    goalTag: 'power_prestige',
    whyFit:
      'রাষ্ট্রীয় নীতিনির্ধারণ, মাঠ প্রশাসনে জনসেবা, আইনশৃঙ্খলা বা পররাষ্ট্র দপ্তরে সম্মানজনক নেতৃত্বদানে আগ্রহীদের জন্য প্রযোজ্য।',
    educationReq:
      '৪ বছর মেয়াদী স্নাতক/স্নাতকোত্তর (স্বীকৃত সরকারি/বেসরকারি/জাতীয় বিশ্ববিদ্যালয়) ➔ সরকারি কর্ম কমিশন (BPSC) বিসিএস প্রিলিমিনারি, লিখিত ও মৌখিক পরীক্ষা',
    bdInstitutions: [
      'ঢাকা, রাজশাহী, চট্টগ্রাম, জাহাঙ্গীরনগর, খুলনা, বরিশাল, কুমিল্লা বিশ্ববিদ্যালয়',
      'জগন্নাথ বিশ্ববিদ্যালয়, বিইউপি ও গুচ্ছভুক্ত সকল পাবলিক বিশ্ববিদ্যালয়',
      'ঢাকা অধিভুক্ত সরকারি ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়ের অধিভুক্ত কলেজসমূহ',
      'প্রকৌশল, কৃষি ও মেডিকেল স্নাতকদের জন্য টেকনিক্যাল ও জেনারেল ক্যাডার সুযোগ',
    ],
    keySkills: [
      'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি এবং সংবিধান',
      'প্রশাসনিক সিদ্ধান্ত গ্রহণ ও জনসংযোগ',
      'বাংলা ও ইংরেজি বিশ্লেষণী রচনা দক্ষতা',
      'নৈতিক দৃঢ়তা ও দুর্যোগ/মাঠ ব্যবস্থাপনা',
    ],
    startingSalary: 'জাতীয় বেতন স্কেল গ্রেড-৯ (সরকারি বাসস্থান, পরিবহন, চিকিৎসা ও পেনশন সুবিধাসহ)',
    alternativePaths: ['বাংলাদেশ ব্যাংক সহকারী পরিচালক', 'আন্তর্জাতিক সংস্থা (UN/UNDP/World Bank)', 'পাবলিক পলিসি গবেষক'],
  },
  {
    id: 'law-judiciary',
    title: 'আইনজীবী ও বাংলাদেশ জুডিশিয়াল সার্ভিস (বিচারক)',
    field: 'আইন, বিচার বিভাগ ও কর্পোরেট লিগ্যাল',
    interestTag: 'social',
    workTag: 'hands_on',
    goalTag: 'power_prestige',
    whyFit:
      'সংবিধান, ন্যায়বিচার, যুক্তিতর্ক এবং কর্পোরেট বা আদালতে আইনি অধিকার প্রতিষ্ঠায় কাজ করতে চাইলে এটি অনন্য পথ।',
    educationReq:
      'এইচএসসি ➔ ৪ বছর এলএলবি (সম্মান) ➔ বাংলাদেশ বার কাউন্সিল অ্যাডভোকেট সনদ পরীক্ষা অথবা বিজিএসসি (BJSC) সহকারী জজ নিয়োগ পরীক্ষা',
    bdInstitutions: [
      'ঢাকা বিশ্ববিদ্যালয়, রাজশাহী বিশ্ববিদ্যালয়, চট্টগ্রাম বিশ্ববিদ্যালয় (আইন অনুষদ)',
      'জগন্নাথ, জাহাঙ্গীরনগর, খুলনা, ইসলামী বিশ্ববিদ্যালয় ও বিইউপি (BUP)',
      'গুচ্ছভুক্ত পাবলিক বিশ্ববিদ্যালয়সমূহের আইন বিভাগ',
      'ব্র্যাক বিশ্ববিদ্যালয়, নর্থ সাউথ, ইস্ট ওয়েস্ট ও এলএলবি স্বীকৃত বিশ্ববিদ্যালয়',
    ],
    keySkills: [
      'সাংবিধানিক, দেওয়ানি ও ফৌজদারি আইন বিশ্লেষণ',
      'লিগ্যাল ড্রাফটিং ও যুক্তি উপস্থাপন',
      'কর্পোরেট চুক্তি ও মেধাস্বত্ব (IP) আইন',
      'গবেষণা ও সাক্ষ্য-প্রমাণ মূল্যায়ন',
    ],
    startingSalary: 'সহকারী জজ (বিজিএসসি বেতন কাঠামো) এবং সুপ্রিম কোর্ট/কর্পোরেট আইন পেশায় অভিজ্ঞতাভেদে উচ্চ আয়',
    alternativePaths: ['কর্পোরেট লিগ্যাল অ্যাডভাইজার', 'আন্তর্জাতিক মানবাধিকার বিশ্লেষক', 'ব্যারিস্টার-অ্যাট-ল'],
  },
];

const toBn = (n: number): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const CareerExplorerPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [academicInterest, setAcademicInterest] = useState<'science' | 'tech' | 'business' | 'social'>('science');
  const [workStyle, setWorkStyle] = useState<'hands_on' | 'remote_desk' | 'research' | 'leadership'>('hands_on');
  const [careerGoal, setCareerGoal] = useState<'social_impact' | 'global_income' | 'power_prestige' | 'innovation'>('social_impact');

  const [selectedId, setSelectedId] = useState<string>(CAREER_DATABASE[0].id);
  const [copied, setCopied] = useState(false);

  const rankedCareers = useMemo(() => {
    return CAREER_DATABASE.map((career) => {
      let score = 58;
      if (career.interestTag === academicInterest) score += 22;
      else if (
        (academicInterest === 'science' && career.interestTag === 'tech') ||
        (academicInterest === 'business' && career.interestTag === 'social')
      ) {
        score += 8;
      }

      if (career.workTag === workStyle) score += 12;
      else if (
        (workStyle === 'research' && career.workTag === 'remote_desk') ||
        (workStyle === 'leadership' && career.workTag === 'hands_on')
      ) {
        score += 5;
      }

      if (career.goalTag === careerGoal) score += 8;
      else if (careerGoal === 'global_income' && career.goalTag === 'innovation') score += 4;

      return { ...career, matchScore: Math.min(99, score) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [academicInterest, workStyle, careerGoal]);

  const selectedCareer = useMemo(
    () => rankedCareers.find((c) => c.id === selectedId) ?? rankedCareers[0],
    [rankedCareers, selectedId]
  );

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedId(rankedCareers[0].id);
  };

  const handleReset = () => {
    setAcademicInterest('science');
    setWorkStyle('hands_on');
    setCareerGoal('social_impact');
    setSelectedId(CAREER_DATABASE[0].id);
  };

  const handleCopy = () => {
    const text = `MEDIX PRIME — ক্যারিয়ার এক্সপ্লোরার\nপেশা: ${selectedCareer.title}\nক্ষেত্র: ${selectedCareer.field}\nউপযোগিতা: ${toBn(selectedCareer.matchScore)}%\nকেন উপযুক্ত: ${selectedCareer.whyFit}\nশিক্ষাগত ধাপ: ${selectedCareer.educationReq}\nপ্রতিষ্ঠানসমূহ: ${selectedCareer.bdInstitutions.join(' | ')}\nবেতন/সম্ভাবনা: ${selectedCareer.startingSalary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      toolNumber="০৬"
      toolName="ক্যারিয়ার এক্সপ্লোরার"
      categoryLabel="ক্যারিয়ার সরঞ্জাম"
      iconName="Compass"
      accentColor="#F472B6"
      description="আপনার বিষয়ের আগ্রহ, কাজের ধরন ও ভবিষ্যৎ লক্ষ্য বিশ্লেষণ করে বাংলাদেশের বাস্তব উচ্চশিক্ষা ও পেশাগত পথ খুঁজে নিন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-heading font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              আগ্রহ ও লক্ষ্য নির্ধারণ
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className={`inline-flex items-center gap-1 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            তিনটি প্রশ্নের উত্তর দিলে তাৎক্ষণিকভাবে সেরা ম্যাচিং ক্যারিয়ার সাজানো হবে
          </p>

          <form onSubmit={handleExplore} className="space-y-4">
            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ১. কোন ধরনের বিষয়ে আপনার আগ্রহ সবচেয়ে বেশি?
              </label>
              <select
                value={academicInterest}
                onChange={(e) => setAcademicInterest(e.target.value as typeof academicInterest)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-pink-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="science">জীববিজ্ঞান, চিকিৎসা বিজ্ঞান ও রসায়ন</option>
                <option value="tech">গণিত, পদার্থবিজ্ঞান, কম্পিউটার ও প্রকৌশল</option>
                <option value="business">ব্যবসায় শিক্ষা, হিসাববিজ্ঞান, ফিন্যান্স ও অর্থনীতি</option>
                <option value="social">আইন, সমাজবিজ্ঞান, প্রশাসন ও জননীতি</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ২. কাজের কোন পরিবেশ আপনার বেশি পছন্দের?
              </label>
              <select
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value as typeof workStyle)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-pink-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="hands_on">সরাসরি মানুষের সেবা ও মাঠ পর্যায়ের কাজ</option>
                <option value="remote_desk">লজিক্যাল কোডিং, প্রযুক্তি নির্মাণ ও রিমোট কাজের সুযোগ</option>
                <option value="research">গবেষণাগার, নিরীক্ষা ও বৈজ্ঞানিক বিশ্লেষণ</option>
                <option value="leadership">নেতৃত্ব, ব্যবস্থাপনা ও নীতিনির্ধারণী সিদ্ধান্ত গ্রহণ</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-heading font-bold block mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ৩. কর্মজীবনের প্রধান লক্ষ্য কী?
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value as typeof careerGoal)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-heading font-semibold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-pink-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                <option value="social_impact">মানবসেবা ও সরাসরি জীবন রক্ষা</option>
                <option value="innovation">প্রযুক্তিগত উদ্ভাবন ও গবেষণা</option>
                <option value="global_income">বৈশ্বিক কর্মক্ষেত্র ও উচ্চ কর্পোরেট আয়</option>
                <option value="power_prestige">রাষ্ট্রীয় সম্মান, বিচার বা প্রশাসনিক দায়িত্ব</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>সেরা ক্যারিয়ার বিশ্লেষণ করুন</span>
            </button>
          </form>

          <div className="mt-5 space-y-2">
            <span className={`text-xs font-heading font-bold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              সামঞ্জস্যপূর্ণ ক্যারিয়ার তালিকা:
            </span>
            {rankedCareers.map((c) => {
              const active = selectedCareer.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-pink-500/20 border-pink-500/50 text-white'
                        : 'bg-pink-50 border-pink-400 text-pink-950 shadow-2xs'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                  <span
                    className={`text-[11px] font-bold shrink-0 ml-2 ${
                      isDark ? 'text-pink-400' : 'text-pink-700'
                    }`}
                  >
                    {toBn(c.matchScore)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div
              className={`flex items-start justify-between gap-4 mb-4 pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div>
                <span
                  className={`text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-pink-500/15 border-pink-500/30 text-pink-300'
                      : 'bg-pink-50 border-pink-200 text-pink-800'
                  }`}
                >
                  {selectedCareer.field}
                </span>
                <h3 className={`text-lg sm:text-xl font-heading font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedCareer.title}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-2xl font-heading font-black ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>
                  {toBn(selectedCareer.matchScore)}%
                </span>
                <span className={`block text-[11px] font-heading ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  মিলের হার
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-heading">
              <div
                className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-50 border-pink-200'
                }`}
              >
                <span className={`font-bold block mb-1 ${isDark ? 'text-pink-300' : 'text-pink-900'}`}>
                  কেন এই পথটি আপনার জন্য উপযুক্ত?
                </span>
                <p className={`leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedCareer.whyFit}
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  <GraduationCap className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-700'}`} />
                  <span>প্রাতিষ্ঠানিক যোগ্যতা ও ধাপসমূহ:</span>
                </span>
                <p className={`pl-5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedCareer.educationReq}
                </p>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  <Building2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                  <span>বাংলাদেশে পড়ার প্রধান বিশ্ববিদ্যালয় ও প্রতিষ্ঠানসমূহ:</span>
                </span>
                <ul className="space-y-1 pl-5 list-disc">
                  {selectedCareer.bdInstitutions.map((inst, idx) => (
                    <li key={idx} className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  অপরিহার্য পেশাগত দক্ষতা:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCareer.keySkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-md font-medium text-[11px] border ${
                        isDark
                          ? 'bg-white/10 border-white/10 text-slate-200'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    শুরুর বেতন কাঠামো (বাংলাদেশ):
                  </span>
                  <span className={`font-bold text-xs mt-1 block leading-snug ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    {selectedCareer.startingSalary}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    সংশ্লিষ্ট বিকল্প পেশা:
                  </span>
                  <span className={`text-[11px] font-medium block mt-1 leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {selectedCareer.alternativePaths.join(', ')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? 'border-white/15 text-slate-200 hover:bg-white/10'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">ক্যারিয়ার প্রোফাইল কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ক্যারিয়ার তথ্য কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
