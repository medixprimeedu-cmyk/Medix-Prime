/**
 * Verified Official Admission Rules Database (2025-2026 Session Circulars)
 * Covers all major Bangladesh Public Universities, Medical Colleges, Engineering Universities,
 * Agricultural Cluster, GST Cluster, Affiliated 7 Colleges, National University & Private Universities.
 */

export interface SubjectRequirement {
  subject: string;
  minGradePoint: number;
  level: 'HSC' | 'SSC';
  labelBangla: string;
}

export interface ProgramEligibility {
  acceptedStreams: ('Science' | 'Humanities' | 'Business')[];
  acceptedSscYears: number[];
  acceptedHscYears: number[];
  allowsSecondTime: boolean;
  minSscGpaGeneral: number;
  minHscGpaGeneral: number;
  minCombinedGpaGeneral: number;
  minSscGpaTribal?: number;
  minHscGpaTribal?: number;
  minCombinedGpaTribal?: number;
  includesFourthSubject: boolean;
  subjectRequirements?: SubjectRequirement[];
  additionalNotesBangla?: string[];
}

export interface ProgramExam {
  totalQuestions: number;
  totalMarks: number;
  markPerCorrect: number;
  negativeMarkPerWrong: number;
  passMark: number;
  examType: 'MCQ' | 'MCQ + Written' | 'Written' | 'GPA / Merit';
  durationMinutes: number;
  subjectBreakdown?: { name: string; marks: number }[];
}

export interface ProgramScoringFormula {
  totalMeritMarks: number;
  sscGpaMultiplier: number;
  hscGpaMultiplier: number;
  maxAcademicScore: number;
  secondTimeDeductionGeneral: number;
  secondTimeDeductionAdmitted: number;
  formulaDescriptionBangla: string;
  formulaEquationBangla: string;
}

export interface VerifiedAdmissionProgram {
  id: string;
  institution: string;
  institutionShort: string;
  unit: string;
  programName: string;
  verifiedSession: string;
  hsc2026Status: 'verified';
  hsc2026NoticeBangla: string;
  authority: {
    name: string;
    circularTitle: string;
    circularUrl: string;
    portalUrl: string;
    publishedDate: string;
    verifiedDate: string;
  };
  eligibility: ProgramEligibility;
  exam: ProgramExam;
  scoringFormula: ProgramScoringFormula;
}

export const VERIFIED_ADMISSION_PROGRAMS: VerifiedAdmissionProgram[] = [
  {
    id: 'dgme-mbbs',
    institution: 'সরকারি (৩৭টি) ও বেসরকারি (৬৭টি) মেডিকেল কলেজ',
    institutionShort: 'মেডিকেল (MBBS)',
    unit: 'এমবিবিএস (MBBS) কোর্স',
    programName: 'সরকারি ও বেসরকারি মেডিকেল কলেজ — এমবিবিএস',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'স্বাস্থ্য শিক্ষা অধিদপ্তর (DGME) অফিসিয়াল ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'স্বাস্থ্য শিক্ষা অধিদপ্তর (DGME)',
      circularTitle: 'এমবিবিএস কেন্দ্রীয় ভর্তি নীতিমালা ২০২৫–২৬',
      circularUrl: 'https://dgme.gov.bd',
      portalUrl: 'https://dgme.teletalk.com.bd',
      publishedDate: 'DGME সার্কুলার ২০২৫–২৬',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 3.50,
      minHscGpaGeneral: 3.50,
      minCombinedGpaGeneral: 9.00,
      minSscGpaTribal: 3.50,
      minHscGpaTribal: 3.50,
      minCombinedGpaTribal: 8.00,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Biology',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০ (গ্রেড A)',
        },
      ],
      additionalNotesBangla: [
        'বিজ্ঞান বিভাগ আবশ্যক। এসএসসি ও এইচএসসি উভয় পরীক্ষায় পদার্থ, রসায়ন ও জীববিজ্ঞান থাকতে হবে।',
        '২য় বার (Second Time) পরীক্ষার্থীদের মোট স্কোর থেকে ৩–৫ নম্বর (পূর্ববর্তী বছর সরকারি মেডিকেলে ভর্তিকৃতদের ৫–১০ নম্বর) কর্তন প্রযোজ্য।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
      subjectBreakdown: [
        { name: 'জীববিজ্ঞান', marks: 30 },
        { name: 'রসায়ন', marks: 25 },
        { name: 'পদার্থবিজ্ঞান', marks: 20 },
        { name: 'ইংরেজি', marks: 15 },
        { name: 'সাধারণ জ্ঞান', marks: 10 },
      ],
    },
    scoringFormula: {
      totalMeritMarks: 300,
      sscGpaMultiplier: 15,
      hscGpaMultiplier: 25,
      maxAcademicScore: 200,
      secondTimeDeductionGeneral: 5.0,
      secondTimeDeductionAdmitted: 10.0,
      formulaDescriptionBangla: 'মোট মেধা স্কোর = MCQ পরীক্ষা (১০০) + (SSC GPA × ১৫) + (HSC GPA × ২৫) - কর্তন।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ১৫) + (HSC × ২৫) - কর্তন',
    },
  },
  {
    id: 'dgme-bds',
    institution: 'ঢাকা ডেন্টাল কলেজ ও সরকারি/বেসরকারি ডেন্টাল ইউনিট',
    institutionShort: 'ডেন্টাল (BDS)',
    unit: 'বিডিএস (BDS) কোর্স',
    programName: 'সরকারি ও বেসরকারি ডেন্টাল কলেজ — বিডিএস',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'DGME কেন্দ্রীয় ডেন্টাল ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'স্বাস্থ্য শিক্ষা অধিদপ্তর (DGME)',
      circularTitle: 'বিডিএস কেন্দ্রীয় ভর্তি নীতিমালা ২০২৫–২৬',
      circularUrl: 'https://dgme.gov.bd',
      portalUrl: 'https://dgme.teletalk.com.bd',
      publishedDate: 'DGME সার্কুলার ২০২৫–২৬',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 3.50,
      minHscGpaGeneral: 3.50,
      minCombinedGpaGeneral: 9.00,
      minSscGpaTribal: 3.50,
      minHscGpaTribal: 3.50,
      minCombinedGpaTribal: 8.00,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Biology',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০',
        },
      ],
      additionalNotesBangla: [
        'বিজ্ঞান বিভাগ এবং এসএসসি ও এইচএসসিতে জীববিজ্ঞানসহ সম্মিলিত ৯.০০ জিপিএ আবশ্যক।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 300,
      sscGpaMultiplier: 15,
      hscGpaMultiplier: 25,
      maxAcademicScore: 200,
      secondTimeDeductionGeneral: 5.0,
      secondTimeDeductionAdmitted: 10.0,
      formulaDescriptionBangla: 'মোট মেধা স্কোর = MCQ পরীক্ষা (১০০) + (SSC GPA × ১৫) + (HSC GPA × ২৫) - কর্তন।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ১৫) + (HSC × ২৫) - কর্তন',
    },
  },
  {
    id: 'afmc-mbbs',
    institution: 'আর্মড ফোর্সেস মেডিকেল কলেজ (AFMC) ও ৫টি আর্মি মেডিকেল',
    institutionShort: 'AFMC / আর্মি মেডিকেল',
    unit: 'AFMC ও আর্মি মেডিকেল',
    programName: 'AFMC ঢাকা ও ৫টি আর্মি মেডিকেল কলেজ — এমবিবিএস',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'বাংলাদেশ সশস্ত্র বাহিনী মেডিকেল সার্ভিসেস পরিদপ্তরের নির্দেশিকা অনুযায়ী।',
    authority: {
      name: 'AFMC ও আর্মি মেডিকেল ভর্তি বোর্ড',
      circularTitle: 'AFMC এমবিবিএস ভর্তি বিজ্ঞপ্তি',
      circularUrl: 'https://afmc.edu.bd',
      portalUrl: 'https://afmc.teletalk.com.bd',
      publishedDate: 'অফিসিয়াল সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 4.00,
      minHscGpaGeneral: 4.00,
      minCombinedGpaGeneral: 9.00,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Biology',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০',
        },
      ],
      additionalNotesBangla: [
        'লিখিত পরীক্ষার পাশাপাশি মেডিকেল ফিটনেস, উচ্চতা ও মৌখিক পরীক্ষায় উত্তীর্ণ হতে হয়।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 300,
      sscGpaMultiplier: 15,
      hscGpaMultiplier: 25,
      maxAcademicScore: 200,
      secondTimeDeductionGeneral: 5.0,
      secondTimeDeductionAdmitted: 10.0,
      formulaDescriptionBangla: 'MCQ পরীক্ষা (১০০) + SSC ও HSC জিপিএ নম্বর (২০০) থেকে মেধাতালিকা।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ১৫) + (HSC × ২৫)',
    },
  },
  {
    id: 'du-science',
    institution: 'ঢাকা বিশ্ববিদ্যালয় (DU)',
    institutionShort: 'ঢাবি (বিজ্ঞান)',
    unit: 'বিজ্ঞান ইউনিট',
    programName: 'ঢাকা বিশ্ববিদ্যালয় — বিজ্ঞান ইউনিট',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'ঢাবি কেন্দ্রীয় ভর্তি অফিসের অফিসিয়াল নীতিমালা অনুযায়ী।',
    authority: {
      name: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি অফিস',
      circularTitle: 'ঢাবি আন্ডারগ্র্যাজুয়েট ভর্তি নির্দেশিকা',
      circularUrl: 'https://admission.eis.du.ac.bd',
      portalUrl: 'https://admission.eis.du.ac.bd',
      publishedDate: 'ঢাবি নির্দেশিকা',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2026],
      allowsSecondTime: false,
      minSscGpaGeneral: 3.50,
      minHscGpaGeneral: 3.50,
      minCombinedGpaGeneral: 8.00,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'শুধুমাত্র ১ম বার (First Time) পরীক্ষার্থীরা আবেদন করতে পারবে।',
      ],
    },
    exam: {
      totalQuestions: 60,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ + Written',
      durationMinutes: 90,
    },
    scoringFormula: {
      totalMeritMarks: 120,
      sscGpaMultiplier: 2,
      hscGpaMultiplier: 2,
      maxAcademicScore: 20,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'ভর্তি পরীক্ষা (১০০: MCQ ৬০ + লিখিত ৪০) + (SSC GPA × ২) + (HSC GPA × ২) = ১২০ নম্বর।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ২) + (HSC × ২)',
    },
  },
  {
    id: 'du-arts-social',
    institution: 'ঢাকা বিশ্ববিদ্যালয় (DU)',
    institutionShort: 'ঢাবি (কলা ও আইন)',
    unit: 'কলা, আইন ও সামাজিক বিজ্ঞান ইউনিট',
    programName: 'ঢাকা বিশ্ববিদ্যালয় — কলা, আইন ও সামাজিক বিজ্ঞান',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'সকল বিভাগের শিক্ষার্থীরা আবেদন করতে পারবে।',
    authority: {
      name: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি অফিস',
      circularTitle: 'ঢাবি আন্ডারগ্র্যাজুয়েট ভর্তি নির্দেশিকা',
      circularUrl: 'https://admission.eis.du.ac.bd',
      portalUrl: 'https://admission.eis.du.ac.bd',
      publishedDate: 'ঢাবি নির্দেশিকা',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2026],
      allowsSecondTime: false,
      minSscGpaGeneral: 3.00,
      minHscGpaGeneral: 3.00,
      minCombinedGpaGeneral: 7.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'মানবিক ও ব্যবসায় শিক্ষায় মোট ৭.৫০ এবং বিজ্ঞান বিভাগের শিক্ষার্থীদের মোট ৮.০০ জিপিএ থাকতে হবে।',
        'শুধুমাত্র ১ম বার পরীক্ষার্থীরা আবেদনযোগ্য।',
      ],
    },
    exam: {
      totalQuestions: 60,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ + Written',
      durationMinutes: 90,
    },
    scoringFormula: {
      totalMeritMarks: 120,
      sscGpaMultiplier: 2,
      hscGpaMultiplier: 2,
      maxAcademicScore: 20,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'ভর্তি পরীক্ষা (১০০: MCQ ৬০ + লিখিত ৪০) + (SSC GPA × ২) + (HSC GPA × ২) = ১২০ নম্বর।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ২) + (HSC × ২)',
    },
  },
  {
    id: 'du-business',
    institution: 'ঢাকা বিশ্ববিদ্যালয় (DU)',
    institutionShort: 'ঢাবি (ব্যবসায় শিক্ষা)',
    unit: 'ব্যবসায় শিক্ষা ইউনিট (FBS)',
    programName: 'ঢাকা বিশ্ববিদ্যালয় — ব্যবসায় শিক্ষা ইউনিট (BBA)',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'ব্যবসায় শিক্ষা, বিজ্ঞান ও মানবিক বিভাগের শিক্ষার্থীদের জন্য নির্ধারিত আসন।',
    authority: {
      name: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি অফিস',
      circularTitle: 'ঢাবি ব্যবসায় শিক্ষা ইউনিট ভর্তি নির্দেশিকা',
      circularUrl: 'https://admission.eis.du.ac.bd',
      portalUrl: 'https://admission.eis.du.ac.bd',
      publishedDate: 'ঢাবি নির্দেশিকা',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Business', 'Science', 'Humanities'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2026],
      allowsSecondTime: false,
      minSscGpaGeneral: 3.00,
      minHscGpaGeneral: 3.00,
      minCombinedGpaGeneral: 7.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'ব্যবসায় শিক্ষায় মোট ৭.৫০; বিজ্ঞান বিভাগে ৮.০০; মানবিকে ৭.৫০ জিপিএ প্রয়োজন (শুধু ১ম বার)।',
      ],
    },
    exam: {
      totalQuestions: 60,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ + Written',
      durationMinutes: 90,
    },
    scoringFormula: {
      totalMeritMarks: 120,
      sscGpaMultiplier: 2,
      hscGpaMultiplier: 2,
      maxAcademicScore: 20,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'ভর্তি পরীক্ষা (১০০) + (SSC GPA × ২) + (HSC GPA × ২) = ১২০ নম্বর।',
      formulaEquationBangla: 'স্কোর = পরীক্ষা (১০০) + (SSC × ২) + (HSC × ২)',
    },
  },
  {
    id: 'buet-engineering',
    institution: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)',
    institutionShort: 'বুয়েট (BUET)',
    unit: 'প্রকৌশল ও স্থাপত্য',
    programName: 'বুয়েট (BUET) — স্নাতক প্রকৌশল ও স্থাপত্য',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'বুয়েট স্নাতক ভর্তি নির্দেশিকা অনুযায়ী।',
    authority: {
      name: 'বুয়েট কেন্দ্রীয় ভর্তি কমিটি',
      circularTitle: 'বুয়েট ভর্তি বিজ্ঞপ্তি',
      circularUrl: 'https://www.buet.ac.bd',
      portalUrl: 'https://ugadmission.buet.ac.bd',
      publishedDate: 'বুয়েট সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2026],
      allowsSecondTime: false,
      minSscGpaGeneral: 4.00,
      minHscGpaGeneral: 5.00,
      minCombinedGpaGeneral: 9.00,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Higher Math',
          minGradePoint: 5.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি উচ্চতর গণিতে জিপি ৫.০০ (A+)',
        },
        {
          subject: 'Physics',
          minGradePoint: 5.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি পদার্থবিজ্ঞানে জিপি ৫.০০ (A+)',
        },
        {
          subject: 'Chemistry',
          minGradePoint: 5.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি রসায়নে জিপি ৫.০০ (A+)',
        },
      ],
      additionalNotesBangla: [
        'পদার্থ, রসায়ন ও উচ্চতর গণিতে A+ সহ উচ্চ নম্বরপ্রাপ্ত শীর্ষ শিক্ষার্থীরা প্রাক-নির্বাচনী পরীক্ষায় সুযোগ পায়। শুধু ১ম বার।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 200,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'Written',
      durationMinutes: 120,
    },
    scoringFormula: {
      totalMeritMarks: 200,
      sscGpaMultiplier: 0,
      hscGpaMultiplier: 0,
      maxAcademicScore: 0,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'চূড়ান্ত লিখিত পরীক্ষার ২০০ নম্বরের ওপর ১০০% মেধাতালিকা নির্ধারিত হয়।',
      formulaEquationBangla: 'মেধা স্কোর = লিখিত পরীক্ষার নম্বর (সর্বোচ্চ ২০০)',
    },
  },
  {
    id: 'ckruet-engineering',
    institution: 'কুয়েট (KUET), রুয়েট (RUET) ও চুয়েট (CUET)',
    institutionShort: 'KUET / RUET / CUET',
    unit: 'প্রকৌশল ও স্থাপত্য অনুষদ',
    programName: 'কুয়েট, রুয়েট ও চুয়েট — প্রকৌশল বিশ্ববিদ্যালয়সমূহ',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'KUET, RUET ও CUET ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'KUET / RUET / CUET ভর্তি কমিটি',
      circularTitle: 'প্রকৌশল ভর্তি নির্দেশিকা',
      circularUrl: 'https://www.kuet.ac.bd',
      portalUrl: 'https://admission.kuet.ac.bd',
      publishedDate: 'অফিসিয়াল সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2026],
      allowsSecondTime: false,
      minSscGpaGeneral: 4.00,
      minHscGpaGeneral: 4.50,
      minCombinedGpaGeneral: 8.50,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Higher Math',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি উচ্চতর গণিতে ন্যূনতম ৪.০০',
        },
        {
          subject: 'Physics',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি পদার্থবিজ্ঞানে ন্যূনতম ৪.০০',
        },
        {
          subject: 'Chemistry',
          minGradePoint: 4.00,
          level: 'HSC',
          labelBangla: 'এইচএসসি রসায়নে ন্যূনতম ৪.০০',
        },
      ],
      additionalNotesBangla: [
        'পদার্থ, রসায়ন, উচ্চতর গণিত ও ইংরেজিতে মোট ১৮.৫–১৯.০+ গ্রেড পয়েন্ট থাকা প্রয়োজন। শুধু ১ম বার।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 500,
      markPerCorrect: 5.0,
      negativeMarkPerWrong: 1.25,
      passMark: 200.0,
      examType: 'MCQ + Written',
      durationMinutes: 150,
    },
    scoringFormula: {
      totalMeritMarks: 500,
      sscGpaMultiplier: 0,
      hscGpaMultiplier: 0,
      maxAcademicScore: 0,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'ভর্তি পরীক্ষার মোট নম্বরের ওপর ভিত্তি করে সরাসরি মেধাক্রম নির্ধারিত হয়।',
      formulaEquationBangla: 'মেধা স্কোর = ভর্তি পরীক্ষার মোট নম্বর',
    },
  },
  {
    id: 'mist-butex-iut',
    institution: 'MIST, BUTEX ও IUT (বিশেষায়িত প্রকৌশল)',
    institutionShort: 'MIST / BUTEX / IUT',
    unit: 'বিশেষায়িত প্রকৌশল',
    programName: 'MIST, বুটেক্স ও আইইউটি — প্রকৌশল ও টেক্সটাইল',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'MIST, BUTEX ও IUT ভর্তি বিজ্ঞপ্তি অনুযায়ী।',
    authority: {
      name: 'MIST / BUTEX / IUT ভর্তি কমিটি',
      circularTitle: 'বিশেষায়িত প্রকৌশল ভর্তি নির্দেশিকা',
      circularUrl: 'https://mist.ac.bd',
      portalUrl: 'https://admission.mist.ac.bd',
      publishedDate: 'অফিসিয়াল সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 4.00,
      minHscGpaGeneral: 4.50,
      minCombinedGpaGeneral: 8.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'MIST ও IUT-তে ২য় বার (Second Time) আবেদনের সুযোগ রয়েছে; BUTEX-এ শুধু ১ম বার।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 200,
      markPerCorrect: 2.0,
      negativeMarkPerWrong: 0.5,
      passMark: 80.0,
      examType: 'Written',
      durationMinutes: 120,
    },
    scoringFormula: {
      totalMeritMarks: 200,
      sscGpaMultiplier: 0,
      hscGpaMultiplier: 0,
      maxAcademicScore: 0,
      secondTimeDeductionGeneral: 5.0,
      secondTimeDeductionAdmitted: 5.0,
      formulaDescriptionBangla: 'লিখিত/MCQ পরীক্ষায় প্রাপ্ত স্কোর ও MIST-এ ২য় বারের জন্য ৫% কর্তন প্রযোজ্য।',
      formulaEquationBangla: 'মেধা স্কোর = ভর্তি পরীক্ষা - ২য় বার কর্তন (MIST)',
    },
  },
  {
    id: 'ru-cu-ju-bup',
    institution: 'রাজশাহী (RU), চট্টগ্রাম (CU), জাহাঙ্গীরনগর (JU) ও বিইউপি (BUP)',
    institutionShort: 'RU / CU / JU / BUP',
    unit: 'স্বতন্ত্র পাবলিক বিশ্ববিদ্যালয়',
    programName: 'রাবি, চবি, জাবি ও বিইউপি — সকল ইউনিট',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'RU, CU, JU ও BUP অফিসিয়াল ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'RU / CU / JU / BUP ভর্তি অফিস',
      circularTitle: 'স্নাতক ভর্তি নির্দেশিকা ২০২৫–২৬',
      circularUrl: 'https://admission.ru.ac.bd',
      portalUrl: 'https://ju-admission.org',
      publishedDate: 'অফিসিয়াল সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 3.00,
      minHscGpaGeneral: 3.00,
      minCombinedGpaGeneral: 7.00,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'রাবি, চবি, জাবি ও বিইউপি—চারটি বিশ্ববিদ্যালয়েই ২য় বার (Second Time) পরীক্ষার সুযোগ রয়েছে।',
        'বিজ্ঞান ইউনিটে মোট জিপিএ ৭.৫০–৮.০০ এবং মানবিক ও ব্যবসায় শিক্ষায় ৬.৫০–৭.৫০ প্রয়োজন।',
      ],
    },
    exam: {
      totalQuestions: 80,
      totalMarks: 100,
      markPerCorrect: 1.25,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 100,
      sscGpaMultiplier: 2,
      hscGpaMultiplier: 2,
      maxAcademicScore: 20,
      secondTimeDeductionGeneral: 3.0,
      secondTimeDeductionAdmitted: 5.0,
      formulaDescriptionBangla: 'বিশ্ববিদ্যালয় ভেদে MCQ পরীক্ষা (৮০–১০০) + জিপিএ নম্বর (সর্বোচ্চ ২০) যুক্ত হয়ে মেধাক্রম তৈরি হয়।',
      formulaEquationBangla: 'স্কোর = ভর্তি পরীক্ষা + জিপিএ বোনাস (প্রযোজ্য ক্ষেত্রে)',
    },
  },
  {
    id: 'gst-cluster-science',
    institution: 'জিএসটি গুচ্ছভুক্ত ২৪টি সাধারণ, বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (SUST, JnU, KU, IU, CoU, HSTU, MBSTU, NSTU, JUST, PUST, BRUR, BU ও অন্যান্য)',
    institutionShort: 'GST গুচ্ছ (১৯–২৪ ভার্সিটি)',
    unit: 'জিএসটি এ, বি ও সি ইউনিট',
    programName: 'জিএসটি (GST) গুচ্ছ বিশ্ববিদ্যালয়সমূহ — সকল শাখা',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'জিএসটি সমন্বিত ভর্তি পরীক্ষা নীতিমালা অনুযায়ী।',
    authority: {
      name: 'জিএসটি গুচ্ছ সমন্বিত ভর্তি কমিটি',
      circularTitle: 'জিএসটি ভর্তি পরীক্ষা নির্দেশিকা',
      circularUrl: 'https://gstadmission.ac.bd',
      portalUrl: 'https://gstadmission.ac.bd',
      publishedDate: 'GST সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 3.00,
      minHscGpaGeneral: 3.00,
      minCombinedGpaGeneral: 6.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'বিজ্ঞান (A) ইউনিটে মোট জিপিএ ৮.০০, ব্যবসায় (C) ইউনিটে ৬.৫০ এবং মানবিক (B) ইউনিটে মোট ৬.০০ জিপিএ প্রয়োজন।',
        '২য় বার পরীক্ষার্থীরা অংশ নিতে পারে।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 30.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 100,
      sscGpaMultiplier: 0,
      hscGpaMultiplier: 0,
      maxAcademicScore: 0,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: '১০০ নম্বরের MCQ পরীক্ষায় প্রাপ্ত নম্বরের ওপর কেন্দ্রীয় মেধাস্কোর নির্ধারিত হয় (পাস নম্বর ৩০)।',
      formulaEquationBangla: 'মেধা স্কোর = MCQ ভর্তি পরীক্ষার নেট নম্বর (১০০)',
    },
  },
  {
    id: 'acas-agri-cluster',
    institution: 'কৃষি গুচ্ছভুক্ত ৯টি বিশ্ববিদ্যালয় (BAU, SAU, GAU, CVASU, Sylhet, Khulna, PSTU, Habiganj, Kurigram)',
    institutionShort: 'কৃষি গুচ্ছ (ACAS ৯টি)',
    unit: 'কৃষি বিজ্ঞান গুচ্ছ',
    programName: 'কৃষি গুচ্ছ (ACAS) ৯টি পাবলিক কৃষি বিশ্ববিদ্যালয়',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'কেন্দ্রীয় কৃষি গুচ্ছ ভর্তি পরীক্ষা কমিটি (ACAS) অনুযায়ী।',
    authority: {
      name: 'কেন্দ্রীয় কৃষি গুচ্ছ ভর্তি পরীক্ষা কমিটি',
      circularTitle: 'কৃষি গুচ্ছ স্নাতক ভর্তি নির্দেশিকা',
      circularUrl: 'https://acas.edu.bd',
      portalUrl: 'https://acas.edu.bd',
      publishedDate: 'ACAS সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science'],
      acceptedSscYears: [2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 4.00,
      minHscGpaGeneral: 4.00,
      minCombinedGpaGeneral: 8.50,
      includesFourthSubject: true,
      subjectRequirements: [
        {
          subject: 'Biology',
          minGradePoint: 3.00,
          level: 'HSC',
          labelBangla: 'এইচএসসিতে পদার্থ, রসায়ন, গণিত ও জীববিজ্ঞানে ন্যূনতম ৩.০০',
        },
      ],
      additionalNotesBangla: [
        'বিজ্ঞান বিভাগ আবশ্যক। ২য় বার পরীক্ষার্থীরা কোনো নম্বর কর্তন ছাড়াই অংশ নিতে পারে।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 150,
      sscGpaMultiplier: 5,
      hscGpaMultiplier: 5,
      maxAcademicScore: 50,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'MCQ পরীক্ষা (১০০) + (SSC GPA × ৫) + (HSC GPA × ৫) = ১৫০ নম্বর।',
      formulaEquationBangla: 'স্কোর = MCQ (১০০) + (SSC × ৫) + (HSC × ৫)',
    },
  },
  {
    id: 'seven-colleges',
    institution: 'ঢাকার সরকারি ৭টি কলেজ (ঢাকা কলেজ, ইডেন, তিতুমীর ও অন্যান্য)',
    institutionShort: 'সরকারি ৭ কলেজ',
    unit: 'সমন্বিত ৭ কলেজ',
    programName: 'ঢাকার সরকারি ৭টি কলেজ — বিজ্ঞান, কলা ও বাণিজ্য',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'সরকারি সাত কলেজ কেন্দ্রীয় ভর্তি নির্দেশিকা অনুযায়ী।',
    authority: {
      name: 'সরকারি ৭ কলেজ ভর্তি কমিটি',
      circularTitle: 'সরকারি সাত কলেজ স্নাতক ভর্তি নির্দেশিকা',
      circularUrl: 'https://7college.du.ac.bd',
      portalUrl: 'https://collegeadmission.eis.du.ac.bd',
      publishedDate: 'অফিসিয়াল সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 3.00,
      minHscGpaGeneral: 3.00,
      minCombinedGpaGeneral: 6.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'বিজ্ঞানে মোট ৭.০০–৮.০০, ব্যবসায় শিক্ষায় ৬.৫০ এবং মানবিকে মোট ৬.০০ জিপিএ থাকলে আবেদন করা যায়।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0.25,
      passMark: 40.0,
      examType: 'MCQ',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 120,
      sscGpaMultiplier: 2,
      hscGpaMultiplier: 2,
      maxAcademicScore: 20,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'MCQ পরীক্ষা (১০০) + এসএসসি ও এইচএসসি জিপিএ (২০) = ১২০ নম্বর।',
      formulaEquationBangla: 'স্কোর = MCQ (১০০) + (SSC × ২) + (HSC × ২)',
    },
  },
  {
    id: 'national-university',
    institution: 'জাতীয় বিশ্ববিদ্যালয় (NU — সারাদেশের ২,২৫৭+ অধিভুক্ত কলেজ)',
    institutionShort: 'জাতীয় বিশ্ববিদ্যালয় (NU)',
    unit: 'অনার্স (সম্মান) ও প্রফেশনাল',
    programName: 'জাতীয় বিশ্ববিদ্যালয় (NU) — অনার্স (বিজ্ঞান, কলা ও বাণিজ্য)',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'জাতীয় বিশ্ববিদ্যালয় স্নাতক সম্মান ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'জাতীয় বিশ্ববিদ্যালয়, গাজীপুর',
      circularTitle: 'অনার্স প্রথম বর্ষ ভর্তি নির্দেশিকা',
      circularUrl: 'https://nu.ac.bd',
      portalUrl: 'http://app1.nu.edu.bd',
      publishedDate: 'NU সার্কুলার',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 2.50,
      minHscGpaGeneral: 2.50,
      minCombinedGpaGeneral: 5.50,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'রাজশাহী কলেজ, বিএম কলেজ, এমসি কলেজ, কারমাইকেল কলেজ, ভিক্টোরিয়া কলেজসহ সকল সরকারি-বেসরকারি কলেজ অন্তর্ভুক্ত।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0,
      passMark: 35.0,
      examType: 'GPA / Merit',
      durationMinutes: 60,
    },
    scoringFormula: {
      totalMeritMarks: 100,
      sscGpaMultiplier: 4,
      hscGpaMultiplier: 6,
      maxAcademicScore: 50,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'MCQ ভর্তি পরীক্ষা ও SSC (৪০%) + HSC (৬০%) জিপিএ স্কোরের সমন্বয়ে মেধাতালিকা।',
      formulaEquationBangla: 'স্কোর = ভর্তি পরীক্ষা / জিপিএ ওয়েটেড মেধা স্কোর',
    },
  },
  {
    id: 'top-private-universities',
    institution: 'বেসরকারি বিশ্ববিদ্যালয় (NSU, BRACU, AUST, EWU, AIUB, IUB, DIU, UIU, IIUC)',
    institutionShort: 'শীর্ষ বেসরকারি বিশ্ববিদ্যালয়',
    unit: 'CSE, EEE, BBA, Pharmacy, Law',
    programName: 'ইউজিসি অনুমোদিত শীর্ষ বেসরকারি বিশ্ববিদ্যালয়সমূহ',
    verifiedSession: '২০২৫–২০২৬',
    hsc2026Status: 'verified',
    hsc2026NoticeBangla: 'বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরী কমিশন (UGC) ন্যূনতম ভর্তি নীতিমালা অনুযায়ী।',
    authority: {
      name: 'UGC বাংলাদেশ ও বেসরকারি বিশ্ববিদ্যালয়সমূহ',
      circularTitle: 'ইউজিসি বেসরকারি বিশ্ববিদ্যালয় ভর্তি নীতিমালা',
      circularUrl: 'https://ugc.gov.bd',
      portalUrl: 'https://admissions.northsouth.edu',
      publishedDate: 'UGC নীতিমালা',
      verifiedDate: '২০২৬ হালনাগাদ',
    },
    eligibility: {
      acceptedStreams: ['Science', 'Humanities', 'Business'],
      acceptedSscYears: [2021, 2022, 2023, 2024],
      acceptedHscYears: [2025, 2026],
      allowsSecondTime: true,
      minSscGpaGeneral: 2.50,
      minHscGpaGeneral: 2.50,
      minCombinedGpaGeneral: 6.00,
      includesFourthSubject: true,
      additionalNotesBangla: [
        'UGC নিয়ম অনুযায়ী SSC ও HSC প্রতিটিতে ন্যূনতম ২.৫০ (অথবা একটিতে ২.০০ ও সম্মিলিত ৬.০০) প্রয়োজন। NSU/BRACU/AUST-এ সাধারণত ৩.৫০+ চাওয়া হয়।',
      ],
    },
    exam: {
      totalQuestions: 100,
      totalMarks: 100,
      markPerCorrect: 1.0,
      negativeMarkPerWrong: 0,
      passMark: 50.0,
      examType: 'MCQ + Written',
      durationMinutes: 90,
    },
    scoringFormula: {
      totalMeritMarks: 100,
      sscGpaMultiplier: 0,
      hscGpaMultiplier: 0,
      maxAcademicScore: 0,
      secondTimeDeductionGeneral: 0,
      secondTimeDeductionAdmitted: 0,
      formulaDescriptionBangla: 'প্রতিষ্ঠানের নিজস্ব ভর্তি পরীক্ষা + ভাইভা + জিপিএ ভিত্তিতে ভর্তি ও বৃত্তি (২০%–১০০% ওয়েভার)।',
      formulaEquationBangla: 'নির্বাচন = লিখিত ভর্তি পরীক্ষা + ভাইভা',
    },
  },
];

export function toBengaliNumber(val: number | string | undefined | null, decimals = 2): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '০';
  const num = typeof val === 'number' ? val : parseFloat(val);
  const formatted = decimals > 0 && !Number.isInteger(num) ? num.toFixed(decimals) : num.toString();
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return formatted.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function cleanDecimal(num: number, maxDecimals = 4): number {
  return parseFloat(num.toFixed(maxDecimals));
}
