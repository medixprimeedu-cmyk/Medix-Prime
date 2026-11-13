/**
 * HSC '26 - আমার গল্প Journey Card Type Definitions
 */

export type CardThemeId =
  | 'original'
  | 'midnight-neon'
  | 'y2k-chrome'
  | 'scrapbook'
  | 'wrapped'
  | 'pixel-quest'
  | 'manga'
  | 'pastel-cloud'
  | 'campus-id'
  | 'street-poster'
  | 'minimal-mono';

export interface CardThemeMeta {
  id: CardThemeId;
  nameBn: string;
  nameEn: string;
  tagline: string;
  accentColor: string;
  bgHex: string;
  icon: string;
}

export const CARD_THEMES: CardThemeMeta[] = [
  {
    id: 'original',
    nameBn: 'অরিজিনাল স্টোরি',
    nameEn: 'Original Story',
    tagline: 'ক্লাসিক ভিন্টেজ ও স্টাডি কর্নার',
    accentColor: '#CCFF00',
    bgHex: '#FAF7F0',
    icon: '✨',
  },
  {
    id: 'midnight-neon',
    nameBn: 'মিডনাইট নিয়ন',
    nameEn: 'Midnight Neon',
    tagline: 'সাইবারপাঙ্ক ও গ্লোয়িং ডার্ক ভাইব',
    accentColor: '#00F0FF',
    bgHex: '#0B0D1B',
    icon: '⚡',
  },
  {
    id: 'y2k-chrome',
    nameBn: 'ওয়াই-টু-কে ক্রোম',
    nameEn: 'Y2K Chrome',
    tagline: 'হোলোগ্রাফিক সিলভার ও ২০০০ এর সাইবার',
    accentColor: '#38BDF8',
    bgHex: '#0F172A',
    icon: '💿',
  },
  {
    id: 'scrapbook',
    nameBn: 'স্ক্র্যাপবুক মেমোরিজ',
    nameEn: 'Scrapbook Memories',
    tagline: 'নোটবুক, রঙিন টেপ ও পোলারয়েড স্মৃতি',
    accentColor: '#F59E0B',
    bgHex: '#F6EFE9',
    icon: '📎',
  },
  {
    id: 'wrapped',
    nameBn: 'স্পটিফাই র‍্যাপড',
    nameEn: 'Spotify Wrapped',
    tagline: 'বোল্ড ইনফোগ্রাফিক ও মিউজিক স্ট্যাটস',
    accentColor: '#1DB954',
    bgHex: '#121212',
    icon: '🎧',
  },
  {
    id: 'pixel-quest',
    nameBn: 'পিক্সেল কোয়েস্ট',
    nameEn: 'Pixel Quest',
    tagline: 'রেট্রো ৮-বিট আরপিজি গেম কার্ড',
    accentColor: '#FACC15',
    bgHex: '#14142B',
    icon: '👾',
  },
  {
    id: 'manga',
    nameBn: 'মাঙ্গা স্টাডি আর্ক',
    nameEn: 'Manga Study Arc',
    tagline: 'ড্রামাটিক ইংক, স্পিড লাইন ও কমিক বুস্ট',
    accentColor: '#FFFFFF',
    bgHex: '#0A0A0A',
    icon: '💥',
  },
  {
    id: 'pastel-cloud',
    nameBn: 'প্যাস্টেল ক্লাউড',
    nameEn: 'Pastel Cloud',
    tagline: 'সফট ল্যাভেন্ডার ও ড্রিমি ক্লাউড ভাইব',
    accentColor: '#C084FC',
    bgHex: '#FAF5FF',
    icon: '☁️',
  },
  {
    id: 'campus-id',
    nameBn: 'ক্যাম্পাস আইডি',
    nameEn: 'Campus ID',
    tagline: 'অফিশিয়াল স্টুডেন্ট কার্ড ও বারকোড',
    accentColor: '#3B82F6',
    bgHex: '#0B132B',
    icon: '🪪',
  },
  {
    id: 'street-poster',
    nameBn: 'স্ট্রিট পোস্টার',
    nameEn: 'Street Poster',
    tagline: 'রিসোগ্রাফ, ডিস্ট্রেসড টাইপো ও আর্ট',
    accentColor: '#FF4D00',
    bgHex: '#191716',
    icon: '🛹',
  },
  {
    id: 'minimal-mono',
    nameBn: 'মিনিমালিস্ট মনো',
    nameEn: 'Minimal Mono',
    tagline: 'সুইস গ্রিড, ব্ল্যাক অ্যান্ড হোয়াইট আভিজাত্য',
    accentColor: '#000000',
    bgHex: '#FFFFFF',
    icon: '📐',
  },
];

export interface JourneyCardData {
  name: string;
  photoUrl?: string; // Optional user photo as base64/URL
  badgeLine1: string;
  badgeLine2: string;
  studyHabit: string;
  biggestHassle: string;
  biggestSupport: string;
  favoriteDialogue: string;
  achievement: string;
}

export interface SavedCardHistoryItem {
  id: string;
  createdAt: number;
  cardData: JourneyCardData;
  themeId: CardThemeId;
}

export const DEFAULT_CARD_DATA: JourneyCardData = {
  name: '',
  badgeLine1: 'LAST NIGHT',
  badgeLine2: 'WARRIOR',
  studyHabit: 'শেষ রাতের যোদ্ধা',
  biggestHassle: 'Chemistry',
  biggestSupport: 'বন্ধুর নোট',
  favoriteDialogue: 'এইটা কি সিলেবাসে ছিল?',
  achievement: 'শেষ পর্যন্ত লড়ে গেছি!',
};

export const PRESET_OPTIONS = {
  titles: [
    { line1: 'LAST NIGHT', line2: 'WARRIOR', label: 'Last Night Warrior' },
    { line1: 'SYLLABUS', line2: 'SURVIVOR', label: 'Syllabus Survivor' },
    { line1: 'ONE NIGHT', line2: 'LEGEND', label: 'One Night Legend' },
    { line1: 'COFFEE', line2: 'ADDICT', label: 'Coffee Addict' },
    { line1: 'BACKBENCH', line2: 'BOSS', label: 'Backbench Boss' },
    { line1: 'CHILL', line2: 'SCHOLAR', label: 'Chill Scholar' },
    { line1: 'শেষ রাতের', line2: 'যোদ্ধা', label: 'শেষ রাতের যোদ্ধা' },
  ],
  studyHabits: [
    'শেষ রাতের যোদ্ধা',
    'পরীক্ষার আগের দিন রিডিং',
    'সারা বছর রিল্যাক্স, শেষে প্যানিক',
    'গ্রুপ স্টাডি স্পেশালিস্ট',
    'রুটিন বানাই কিন্তু পড়ি না',
    'প্লাস পাওয়ার সাধক',
    'ইউটিউব ওয়ান-শট ভরসা',
  ],
  biggestHassles: [
    'Chemistry',
    'Physics ২য় পত্র',
    'Higher Math ইন্টিগ্রেশন',
    'Biology বোটানি সাইকেল',
    'ICT সি প্রোগ্রামিং',
    'সকাল ৮টায় প্র্যাকটিক্যাল',
    'বাংলা ২য় পত্র ব্যাকরণ',
  ],
  biggestSupports: [
    'বন্ধুর নোট',
    'এক কাপ কড়া চা',
    'ইউটিউব ওয়ান-শট ক্লাস',
    'শেষ মুহূর্তের সাজেশন',
    'আম্মুর দোয়া',
    'টেস্ট পেপার সল্ভ',
    'পরীক্ষা হলের বন্ধু',
  ],
  favoriteDialogues: [
    'এইটা কি সিলেবাসে ছিল?',
    'দোস্ত, কিছু পারি নাই!',
    'কালকে থেকে সিরিয়াস পড়ব',
    'আর এক ঘণ্টা ঘুমাই',
    'পাস করলেই আলহামদুলিল্লাহ!',
    'আরেহ প্রশ্ন একদম সহজ হইছে',
    'দোস্ত ৫ নম্বরটা বলবি প্লিজ?',
  ],
  achievements: [
    'শেষ পর্যন্ত লড়ে গেছি!',
    'প্র্যাকটিক্যাল খাতা জমা দিতে পারছি',
    'পুরো বই অন্তত একবার উল্টাইছি',
    'সব পরীক্ষা টাইমে পৌঁছাইছি',
    'বন্ধুদের হতাশা থেকে বাঁচাইছি',
    'পড়াশোনার মাঝেও হাসি রাখছি',
  ],
};
