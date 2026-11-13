import { EducationBoard, ExaminationOption } from '../types';

export const APP_CONFIG = {
  appName: 'MEDIX PRIME',
  brandTaglineBn: 'তোমার ফলাফল, নতুন পথের শুরু।',
  brandSubtagBn: 'HSC ও সমমানের ফলাফল দেখার সহজ উদ্যোগ। তোমার পরবর্তী শিক্ষাযাত্রার সঙ্গী হতে আসছে Medix Prime।',
  officialPortalUrl: 'https://educationboardresults.gov.bd/v2/home',
  
  // Configurable community URL; if empty, UI shows "কমিউনিটি লিংক শিগগিরই যুক্ত হবে"
  communityUrl: '', 

  // In accordance with instructions: No verified result API is supplied yet.
  // When false: shows visible honest unconfigured notice, doesn't invent fake results or send identifiers.
  isResultApiConfigured: false,

  defaultYear: '2026',
};

export const EXAMINATION_OPTIONS: ExaminationOption[] = [
  { code: 'hsc', labelBn: 'HSC / সমমান (HSC / Equivalent)', labelEn: 'HSC / Equivalent' },
  { code: 'alim', labelBn: 'আলিম (Alim - Madrasah)', labelEn: 'Alim' },
  { code: 'vocational', labelBn: 'HSC (ভোকেশনাল / Vocational)', labelEn: 'HSC (Vocational)' },
  { code: 'bm', labelBn: 'HSC (বিএম / Business Management)', labelEn: 'HSC (BM)' },
  { code: 'diploma_commerce', labelBn: 'ডিপ্লোমা ইন কমার্স (Diploma in Commerce)', labelEn: 'Diploma in Commerce' },
  { code: 'diploma_business', labelBn: 'ডিপ্লোমা ইন বিজনেস স্টাডিজ (DIBS)', labelEn: 'Diploma in Business Studies' },
];

export const EDUCATION_BOARDS: EducationBoard[] = [
  { code: 'dhaka', labelBn: 'ঢাকা (Dhaka)', labelEn: 'Dhaka' },
  { code: 'chattogram', labelBn: 'চট্টগ্রাম (Chattogram)', labelEn: 'Chattogram' },
  { code: 'rajshahi', labelBn: 'রাজশাহী (Rajshahi)', labelEn: 'Rajshahi' },
  { code: 'cumilla', labelBn: 'কুমিল্লা (Cumilla)', labelEn: 'Cumilla' },
  { code: 'jashore', labelBn: 'যশোর (Jashore)', labelEn: 'Jashore' },
  { code: 'barishal', labelBn: 'বরিশাল (Barishal)', labelEn: 'Barishal' },
  { code: 'sylhet', labelBn: 'সিলেট (Sylhet)', labelEn: 'Sylhet' },
  { code: 'dinajpur', labelBn: 'দিনাজপুর (Dinajpur)', labelEn: 'Dinajpur' },
  { code: 'mymensingh', labelBn: 'ময়মনসিংহ (Mymensingh)', labelEn: 'Mymensingh' },
  { code: 'madrasah', labelBn: 'মাদ্রাসা (Madrasah)', labelEn: 'Madrasah' },
  { code: 'technical', labelBn: 'কারিগরি (Technical)', labelEn: 'Technical' },
  { code: 'dibs', labelBn: 'ডিআইবিএস (DIBS - Dhaka)', labelEn: 'DIBS' },
];

export const EXAMINATION_YEARS: string[] = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
];
