import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Copy, Check } from 'lucide-react';

interface UniversityMajor {
  majorName: string;
  faculty: string;
  topInstitutions: string[];
  careerProspects: string[];
  minPrerequisite: string;
  description: string;
}

const MAJOR_DATABASE: Record<string, UniversityMajor[]> = {
  biology: [
    {
      majorName: 'এমবিবিএস ও বিডিএস (MBBS / BDS)',
      faculty: 'চিকিৎসাবিজ্ঞান অনুষদ',
      topInstitutions: [
        'ঢাকা মেডিকেল (DMC), সলিমুল্লাহ (SSMC), সোহরাওয়ার্দী (ShSMC), চট্টগ্রাম, রাজশাহী, ময়মনসিংহ, সিলেট ওসমানীসহ ৩৭টি সরকারি মেডিকেল',
        'AFMC, ৫টি আর্মি মেডিকেল ও ৬৭টি বেসরকারি মেডিকেল কলেজ',
        'ঢাকা ডেন্টাল কলেজ (DDC) ও ৮টি সরকারি ডেন্টাল ইউনিট',
      ],
      careerProspects: ['বিসিএস (স্বাস্থ্য) ক্যাডার', 'ক্লিনিক্যাল কনসালট্যান্ট (FCPS/MD/MS)', 'মেডিকেল অফিসার ও সার্জন'],
      minPrerequisite: 'বিজ্ঞান বিভাগ, মোট জিপিএ ৯.০০+ এবং এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০',
      description: 'মানবদেহ, রোগ নির্ণয়, সার্জারি ও চিকিৎসাসেবার সর্বোচ্চ পেশাগত ডিগ্রি।',
    },
    {
      majorName: 'ফার্মাসি (B.Pharm)',
      faculty: 'ফার্মাসি অনুষদ',
      topInstitutions: [
        'ঢাকা বিশ্ববিদ্যালয় (DU), জাহাঙ্গীরনগর (JU), রাজশাহী (RU), চট্টগ্রাম (CU), জগন্নাথ (JnU), খুলনা (KU)',
        'SUST, NSTU, JUST, MBSTU, PUST, কুমিল্লা ও ইসলামী বিশ্ববিদ্যালয়',
        'বেসরকারি: NSU, BRACU, EWU, DIU, IUB, IIUC, UAP, Stamford',
      ],
      careerProspects: ['ওষুধ শিল্পের গবেষণা ও কোয়ালিটি অ্যাসিউরেন্স', 'হসপিটাল ও ক্লিনিক্যাল ফার্মাসিস্ট', 'আন্তর্জাতিক ফার্মাসিউটিক্যালস'],
      minPrerequisite: 'এইচএসসি জীববিজ্ঞান ও রসায়নে ন্যূনতম জিপি ৪.০০',
      description: 'ওষুধ আবিষ্কার, ড্রাগ ফর্মুলেশন, মান নিয়ন্ত্রণ ও ফার্মাকোলজি বিজ্ঞান।',
    },
    {
      majorName: 'জেনেটিক ইঞ্জিনিয়ারিং, বায়োকেমিস্ট্রি ও কৃষিবিজ্ঞান',
      faculty: 'জীববিজ্ঞান ও কৃষি অনুষদ',
      topInstitutions: [
        'ঢাকা, রাজশাহী, চট্টগ্রাম, জাহাঙ্গীরনগর, SUST, JUST, NSTU, কুবি, বেরোবি, ইবি',
        'কৃষি গুচ্ছ (৯টি): BAU, SAU, GAU, CVASU, সিলেট, খুলনা, পটুয়াখালী, হবিগঞ্জ ও কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়',
      ],
      careerProspects: ['বায়োটেক রিসার্চার', 'কৃষি ও ভেটেরিনারি বিশেষজ্ঞ', 'BFRI, BCSIR ও আন্তর্জাতিক ল্যাবে গবেষণা'],
      minPrerequisite: 'বিজ্ঞান শাখায় মোট জিপিএ ৮.০০–৮.৫০ (কৃষিতে ৪.০০+ পৃথকভাবে)',
      description: 'জিনতত্ত্ব, ভ্যাকসিন, খাদ্য নিরাপত্তা ও প্রাণিসম্পদ গবেষণার আধুনিক বিজ্ঞান।',
    },
  ],
  math_physics: [
    {
      majorName: 'কম্পিউটার সায়েন্স ও সফটওয়্যার ইঞ্জিনিয়ারিং (CSE / SWE)',
      faculty: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
      topInstitutions: [
        'বুয়েট (BUET), কুয়েট (KUET), রুয়েট (RUET), চুয়েট (CUET), MIST, IUT, DUET, AAUB',
        'ঢাকা, রাজশাহী, চট্টগ্রাম, জাহাঙ্গীরনগর, SUST ও জিএসটি গুচ্ছের ২৪টি বিশ্ববিদ্যালয়',
        'বেসরকারি: NSU, BRACU, AUST, AIUB, IUB, UIU, DIU, EWU, IIUC',
      ],
      careerProspects: ['সফটওয়্যার ইঞ্জিনিয়ার', 'এআই ও ডেটা সায়েন্টিস্ট', 'গ্লোবাল রিমোট ডেভেলপার ও সাইবার সিকিউরিটি'],
      minPrerequisite: 'বিজ্ঞান শাখা এবং উচ্চতর গণিত ও পদার্থবিজ্ঞানে উচ্চ গ্রেড (বুয়েট/প্রকৌশলে A+)',
      description: 'অ্যালগরিদম, কৃত্রিম বুদ্ধিমত্তা, সফটওয়্যার আর্কিটেকচার ও ক্লাউড কম্পিউটিং।',
    },
    {
      majorName: 'ইলেকট্রিক্যাল, সিভিল, মেকানিক্যাল ও টেক্সটাইল প্রকৌশল',
      faculty: 'প্রকৌশল অনুষদসমূহ',
      topInstitutions: [
        'বুয়েট (BUET), কুয়েট, রুয়েট, চুয়েট, MIST, IUT, BUTEX, DUET, বাংলাদেশ মেরিটাইম ও এভিয়েশন বিশ্ববিদ্যালয়',
        'ঢাকা বিশ্ববিদ্যালয় প্রযুক্তি ইউনিট ও রাবি/চবি প্রকৌশল অনুষদ',
        'বেসরকারি: AUST, AIUB, NSU, BRACU, IUB, UIU (IEB স্বীকৃত প্রোগ্রাম)',
      ],
      careerProspects: ['পাওয়ার গ্রিড ও সেমিকন্ডাক্টর', 'অবকাঠামো ও সিভিল প্রজেক্ট', 'টেক্সটাইল ও শিল্প উৎপাদন খাত'],
      minPrerequisite: 'এইচএসসি পদার্থবিজ্ঞান, রসায়ন ও উচ্চতর গণিত আবশ্যক',
      description: 'বিদ্যুৎ, অবকাঠামো, যন্ত্রকৌশল, রোবটিক্স ও টেক্সটাইল শিল্পের প্রকৌশল ডিগ্রি।',
    },
  ],
  business: [
    {
      majorName: 'বিবিএ — ফিন্যান্স, অ্যাকাউন্টিং ও মার্কেটিং (BBA / IBA)',
      faculty: 'ব্যবসায় শিক্ষা অনুষদ',
      topInstitutions: [
        'ঢাবি আইবিএ (IBA) ও ব্যবসায় শিক্ষা অনুষদ (FBS), বিইউপি (BUP), রাবি, চবি, জাবি (IBA-JU), জগন্নাথ',
        'জিএসটি গুচ্ছ ও সরকারি ৭ কলেজ (ঢাকা কলেজ ও অন্যান্য)',
        'বেসরকারি: NSU, BRACU, EWU, IUB, AIUB, UIU, DIU, IIUC',
      ],
      careerProspects: ['বাংলাদেশ ব্যাংক ও বাণিজ্যিক ব্যাংক', 'চার্টার্ড অ্যাকাউন্ট্যান্ট (CA / ACCA)', 'বহুজাতিক কর্পোরেট ম্যানেজমেন্ট'],
      minPrerequisite: 'ব্যবসায় শিক্ষায় মোট জিপিএ ৭.৫০+ (বিজ্ঞান/মানবিক থেকেও আবেদনযোগ্য)',
      description: 'আর্থিক ব্যবস্থাপনা, বিনিয়োগ বিশ্লেষণ, করপোরেট কৌশল ও ব্র্যান্ড নেতৃত্ব।',
    },
  ],
  humanities: [
    {
      majorName: 'আইন (LLB), অর্থনীতি ও আন্তর্জাতিক সম্পর্ক (IR)',
      faculty: 'কলা, আইন ও সামাজিক বিজ্ঞান অনুষদ',
      topInstitutions: [
        'ঢাবি (B-Unit), রাবি, চবি, জাবি, জবি, ইবি, খুলনা ও বিইউপি (BUP)',
        'জিএসটি গুচ্ছ ‘B’ ইউনিট, সরকারি ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়ের ঐতিহ্যবাহী সরকারি কলেজসমূহ',
        'বেসরকারি: BRACU, NSU, EWU, AIUB, IIUC, DIU (বার কাউন্সিল স্বীকৃত)',
      ],
      careerProspects: ['বাংলাদেশ জুডিশিয়াল সার্ভিস (বিচারক/BJS)', 'আইনজীবী (অ্যাডভোকেট)', 'বিসিএস প্রশাসন/পররাষ্ট্র ক্যাডার ও জাতিসংঘ সংস্থা'],
      minPrerequisite: 'মানবিক শাখায় মোট জিপিএ ৬.৫০–৭.৫০ (বাংলা ও ইংরেজিতে ন্যূনতম শর্তসহ)',
      description: 'সংবিধান, দেওয়ানি ও ফৌজদারি আইন, কূটনীতি এবং রাষ্ট্রীয় অর্থনীতি ও জননীতি।',
    },
  ],
};

export const SubjectMajorFinderPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [favSubject, setFavSubject] = useState<string>('biology');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const matchedMajors = MAJOR_DATABASE[favSubject] || MAJOR_DATABASE.biology;

  const handleCopy = (m: UniversityMajor, idx: number) => {
    const text = `মেজর: ${m.majorName}\nঅনুষদ: ${m.faculty}\nবিশ্ববিদ্যালয়সমূহ: ${m.topInstitutions.join(' | ')}\nক্যারিয়ার: ${m.careerProspects.join(', ')}\nপূর্বশর্ত: ${m.minPrerequisite}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolPageLayout
      toolNumber="০৯"
      toolName="বিষয় ও মেজর ফাইন্ডার"
      categoryLabel="ক্যারিয়ার সরঞ্জাম"
      iconName="BookOpen"
      accentColor="#60A5FA"
      description="আপনার প্রিয় বিষয়গুলোর সাথে মিলিয়ে বাংলাদেশের সকল পাবলিক, মেডিকেল, প্রকৌশল, কৃষি, ৭ কলেজ, জাতীয় ও বেসরকারি বিশ্ববিদ্যালয়ের উপযুক্ত ডিগ্রি ও বিষয় খুঁজুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center gap-2 transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <span className={`text-xs font-heading font-bold mr-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            আগ্রহের ক্ষেত্র নির্বাচন করুন:
          </span>
          {[
            { id: 'biology', label: 'জীববিজ্ঞান ও চিকিৎসাবিজ্ঞান' },
            { id: 'math_physics', label: 'গণিত, পদার্থ ও প্রকৌশল' },
            { id: 'business', label: 'ব্যবসা, ফিন্যান্স ও হিসাববিজ্ঞান' },
            { id: 'humanities', label: 'আইন, অর্থনীতি ও মানবিক' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFavSubject(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                favSubject === tab.id
                  ? 'bg-[#006B98] text-white shadow-xs'
                  : isDark
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {matchedMajors.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDark
                  ? 'bg-[#0B1526]/85 border-[#172740] hover:border-blue-400/50'
                  : 'bg-white border-slate-200 shadow-sm hover:border-[#006B98]/50'
              }`}
            >
              <div>
                <span className="text-[11px] font-heading font-bold text-[#006B98] dark:text-blue-400 block mb-1">
                  {m.faculty}
                </span>
                <h3 className={`font-heading font-bold text-base mb-2 ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                  {m.majorName}
                </h3>
                <p className={`font-body text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {m.description}
                </p>

                <div className="space-y-2.5 text-xs font-heading border-t border-slate-200/20 pt-3">
                  <div>
                    <span className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      বাংলাদেশের প্রযোজ্য বিশ্ববিদ্যালয় ও কলেজ:
                    </span>
                    <ul className={`space-y-1 text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {m.topInstitutions.map((inst, i) => (
                        <li key={i}>• {inst}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className={`block text-[11px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      ভবিষ্যৎ কর্মক্ষেত্র:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {m.careerProspects.join(', ')}
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl text-[11px] border ${
                      isDark ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span className={`block font-bold mb-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      ভর্তি যোগ্যতা:
                    </span>
                    <span>{m.minPrerequisite}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/20">
                <button
                  type="button"
                  onClick={() => handleCopy(m, idx)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'border-white/15 hover:bg-white/5 text-blue-400'
                      : 'border-slate-300 hover:bg-slate-50 text-[#006B98]'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>তথ্য কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};
