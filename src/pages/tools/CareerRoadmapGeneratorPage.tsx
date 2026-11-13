import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { Milestone, Copy, Check, CheckCircle2, RotateCcw } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  timeframe: string;
  milestones: string[];
  actionTips: string;
}

interface CareerTrack {
  id: string;
  label: string;
  subtitle: string;
  totalDuration: string;
  targetInstitutions: string;
  phases: RoadmapPhase[];
}

const ROADMAP_TRACKS: Record<string, CareerTrack> = {
  doctor: {
    id: 'doctor',
    label: 'চিকিৎসক (এমবিবিএস ও এফসিপিএস / এমডি)',
    subtitle: 'স্বাস্থ্য শিক্ষা অধিদপ্তর (DGME) মেডিকেল ভর্তি পরীক্ষা থেকে বিশেষজ্ঞ চিকিৎসক',
    totalDuration: '৮ – ১১ বছর (এমবিবিএস + ইন্টার্নশিপ + স্নাতকোত্তর)',
    targetInstitutions:
      'ঢাকা, চট্টগ্রাম, রাজশাহী, স্যার সলিমুল্লাহ, শহীদ সোহরাওয়ার্দীসহ ৩৭টি সরকারি মেডিকেল, AFMC ও স্বীকৃত বেসরকারি মেডিকেল কলেজ',
    phases: [
      {
        phase: 'ধাপ ১: এইচএসসি বিজ্ঞান ও মূল পাঠ্যবই দক্ষতা',
        timeframe: 'একাদশ ও দ্বাদশ শ্রেণি',
        milestones: [
          'জীববিজ্ঞান, রসায়ন ও পদার্থবিজ্ঞানের প্রতিটি মূল পাঠ্যবই (হাজারী-নাগ, আজমল, মাজেদা বেগম, তপন/ইসহাক) গভীরভাবে আয়ত্ত করা',
          'এসএসসি ও এইচএসসিতে সমন্বিত জিপিএ ১০.০০ বা অন্তত ৯.০০–৯.৫০+ নিশ্চিত করা',
          'ইংরেজি ও সাধারণ জ্ঞান (বাংলাদেশের মুক্তিযুদ্ধ, ইতিহাস ও সাম্প্রতিক স্বাস্থ্য তথ্য) নিয়মিত চর্চা',
        ],
        actionTips: 'মেডিকেল ভর্তি পরীক্ষায় মূল পাঠ্যবইয়ের প্রতি লাইন থেকেই প্রশ্ন আসে, তাই অনুশীলনী ও মূল বই রিভিশনকে প্রাধান্য দিন।',
      },
      {
        phase: 'ধাপ ২: ডিজিএমই (DGME) কেন্দ্রীয় মেডিকেল ভর্তি পরীক্ষা',
        timeframe: 'এইচএসসির পর ৩ – ৫ মাস',
        milestones: [
          '১০০ নম্বরের এমসিকিউ পরীক্ষা: জীববিজ্ঞান ৩০, রসায়ন ২৫, পদার্থবিজ্ঞান ২০, ইংরেজি ১৫, সাধারণ জ্ঞান ১০ (নেগেটিভ মার্কিং ০.২৫)',
          'এসএসসি জিপিএ x ১৫ + এইচএসসি জিপিএ x ২৫ (অর্থাৎ মোট ১০০ জিপিএ নম্বর) ও লিখিত ১০০ = ২০০ নম্বরে মেধাক্রম',
          'সরকারি ৩৭টি মেডিকেল কলেজ ও আর্মড ফোর্সেস মেডিকেল কলেজে (AFMC) একসাথে প্রস্তুতি',
        ],
        actionTips: 'সাপ্তাহিক পূর্ণাঙ্গ ২০০/১০০ নম্বরের ওএমআর (OMR) মডেল টেস্ট দিয়ে নেগেটিভ মার্কিং কমানো জরুরি।',
      },
      {
        phase: 'ধাপ ৩: ৫ বছর এমবিবিএস ও ১ বছর ইন্টার্নশিপ',
        timeframe: '৬ বছর',
        milestones: [
          'অ্যানাটমি, ফিজিওলজি, বায়োকেমিস্ট্রি (১ম প্রফ), প্যাথলজি-মাইক্রোবায়োলজি-ফার্মাকোলজি (২য় ও ৩য় প্রফ) ও মেডিসিন-সার্জারি-গাইনি (চূড়ান্ত প্রফ)',
          '১ বছর আবাসিক ইন্টার্নশিপ সম্পন্ন করে বিএমডিসি (BMDC) স্থায়ী রেজিস্ট্রেশন অর্জন',
        ],
        actionTips: 'ওয়ার্ড ক্লাসে রোগীর হিস্ট্রি নেওয়া ও ক্লিনিক্যাল এক্সামিনেশন শুরু থেকেই মনোযোগ দিয়ে শিখুন।',
      },
      {
        phase: 'ধাপ ৪: বিসিএস (স্বাস্থ্য) ও এফসিপিএস / এমডি / এমএস',
        timeframe: '৩ – ৫ বছর',
        milestones: [
          'সরকারি চাকরির জন্য বিসিএস (স্বাস্থ্য) ক্যাডার পরীক্ষায় অংশগ্রহণ',
          'বিসিপিএস (BCPS)-এর এফসিপিএস (FCPS) পার্ট-১ বা বাংলাদেশ মেডিকেল বিশ্ববিদ্যালয়ের (BMU) অধীনে রেসিডেন্সি (MD/MS)',
        ],
        actionTips: 'কোন বিভাগে (মেডিসিন, সার্জারি, কার্ডিওলজি, নিউরোলজি, পেডিয়াট্রিক্স) বিশেষজ্ঞ হতে চান তা ইন্টার্নশিপেই ঠিক করুন।',
      },
    ],
  },
  engineering: {
    id: 'engineering',
    label: 'প্রকৌশলী ও সফটওয়্যার আর্কিটেক্ট (বুয়েট / সিকেআরইউইটি / সিএসই)',
    subtitle: 'উচ্চতর গণিত, পদার্থবিজ্ঞান ও প্রোগ্রামিং থেকে শীর্ষ প্রযুক্তি ক্যারিয়ার',
    totalDuration: '৪ বছর (বিএসসি ইঞ্জিনিয়ারিং)',
    targetInstitutions:
      'বুয়েট (BUET), কুয়েট, রুয়েট, চুয়েট, এমআইএসটি, আইইউটি, ডুয়েট, বুটেক্স, ঢাবি/শাবিপ্রবি ও ব্র্যাক/এনএসইউ/অস্ট/এআইইউবি',
    phases: [
      {
        phase: 'ধাপ ১: গণিত, পদার্থ ও রসায়নে গাণিতিক ভিত',
        timeframe: 'এইচএসসি (১ম ও ২য় বর্ষ)',
        milestones: [
          'ক্যালকুলাস, ভেক্টর, জ্যামিতি, বলবিদ্যা ও তড়িৎ-চুম্বকত্বের গভীর ধারণা ও গাণিতিক সমস্যা সমাধান',
          'পদার্থবিজ্ঞান, রসায়ন ও উচ্চতর গণিতে সর্বোচ্চ নম্বর (৯০%+) ধরে রাখা যাতে বুয়েট প্রাক-নির্বাচনীতে উত্তীর্ণ হওয়া যায়',
        ],
        actionTips: 'কেবল সূত্র মুখস্থ না করে প্রমাণ ও বাস্তব প্রয়োগ বুঝে জটিল গাণিতিক সমস্যার সমাধান অনুশীলন করুন।',
      },
      {
        phase: 'ধাপ ২: প্রকৌশল বিশ্ববিদ্যালয় ভর্তি যুদ্ধ',
        timeframe: 'এইচএসসির পর ৪ – ৫ মাস',
        milestones: [
          'বুয়েট প্রিলিমিনারি ও লিখিত (গণিত, পদার্থ, রসায়ন — গভীর বিশ্লেষণধর্মী প্রশ্ন)',
          'প্রকৌশল গুচ্ছ (কুয়েট, রুয়েট, চুয়েট) এবং এমআইএসটি (MIST), আইইউটি (IUT), ঢাবি ক ইউনিট ও শাবিপ্রবি/গুচ্ছ',
        ],
        actionTips: 'সময় ব্যবস্থাপনার জন্য বিগত ১৫ বছরের বুয়েট ও সিকেআরইউইটি প্রশ্নপত্র ধরে ধরে লিখিত অনুশীলন করুন।',
      },
      {
        phase: 'ধাপ ৩: কম্পিউটার সায়েন্স / ইঞ্জিনিয়ারিং প্র্যাকটিস',
        timeframe: '৪ বছর স্নাতক',
        milestones: [
          '১ম বর্ষ থেকেই সি/সি++/পাইথন, ডাটা স্ট্রাকচার, অ্যালগরিদম এবং প্রবলেম সলভিং (Codeforces / LeetCode)',
          'আইইইই (IEEE) / আইসিপিসি (ICPC) প্রোগ্রামিং কনটেস্ট, হ্যাকাথন ও ওপেন-সোর্স/ইন্ডাস্ট্রি ইন্টার্নশিপ',
        ],
        actionTips: 'সিজিপিএ-র পাশাপাশি কমপক্ষে ২–৩টি প্রোডাকশন-মানের প্রজেক্ট ও গিটহাব পোর্টফোলিও তৈরি রাখুন।',
      },
      {
        phase: 'ধাপ ৪: ইন্ডাস্ট্রি প্লেসমেন্ট ও গ্লোবাল ক্যারিয়ার',
        timeframe: 'স্নাতক শেষ ও পরবর্তী ১ বছর',
        milestones: [
          'দেশীয় শীর্ষ সফটওয়্যার/টেলিকম/প্রকৌশল প্রতিষ্ঠান (Brain Station 23, Enosis, Samsung R&D, Therap, Pathao, bKash) বা রিমোট টেক জব',
          'বিদেশে এমএস/পিএইচডি (GRE + IELTS) অথবা সিনিয়র সফটওয়্যার/ক্লাউড আর্কিটেক্ট পদে উন্নীত হওয়া',
        ],
        actionTips: 'সিস্টেম ডিজাইন, এআই ইন্টিগ্রেশন এবং পরিচ্ছন্ন কোডিং স্ট্যান্ডার্ড আয়ত্ত করলে বৈশ্বিক বেতনে কাজ পাওয়া সহজ হয়।',
      },
    ],
  },
  bcs: {
    id: 'bcs',
    label: 'বিসিএস ক্যাডার ও সরকারি নীতিনির্ধারণী প্রশাসন',
    subtitle: 'স্বীকৃত বিশ্ববিদ্যালয়ে স্নাতক থেকে বিপিএসসি (BPSC) ক্যাডার সার্ভিস',
    totalDuration: '৫ – ৬.৫ বছর (স্নাতক + বিসিএস চক্র)',
    targetInstitutions:
      'ঢাবি, জাবি, রাবি, চবি, জবি, খুবি, বিইউপি, গুচ্ছের ২৪ বিশ্ববিদ্যালয়, সরকারি ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়',
    phases: [
      {
        phase: 'ধাপ ১: স্নাতক ভিত্তি ও ভাষাগত দক্ষতা',
        timeframe: 'স্নাতক ১ম – ৩য় বর্ষ',
        milestones: [
          'নিজের অনার্সের মূল বিষয়ে ভালো ফলাফল ও নিয়মিত বাংলা-ইংরেজি পত্রিকা (প্রথম আলো / ডেইলি স্টার) পড়ার অভ্যাস',
          'ইংরেজি গ্রামার, অনুবাদ ও বিশ্লেষণাত্মক লেখার দক্ষতা তৈরি করা',
        ],
        actionTips: 'অনার্সের প্রথম দুই বছর থেকেই প্রতিদিন মাত্র ৪০ মিনিট ইংরেজি অনুবাদ ও গণিত চর্চা বিসিএস-এ বিশাল এগিয়ে রাখে।',
      },
      {
        phase: 'ধাপ ২: বিসিএস প্রিলিমিনারি ২০০ নম্বরের প্রস্তুতি',
        timeframe: 'অনার্স ৪র্থ বর্ষ / স্নাতকোত্তর',
        milestones: [
          '১০টি বিষয়: বাংলা (৩৫), ইংরেজি (৩৫), বাংলাদেশ বিষয়াবলি (৩০), আন্তর্জাতিক (২০), গণিত (১৫), মানসিক দক্ষতা (১৫), বিজ্ঞান (১৫), কম্পিউটার (১৫), ভূগোল (১০), নৈতিকতা (১০)',
          'তথ্যনির্ভর মূল পাঠ্যবই (নবম-দশম শ্রেণির বাংলা ব্যাকরণ, সাধারণ বিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয়) সম্পূর্ণ করা',
        ],
        actionTips: 'নেগেটিভ মার্কিং (০.৫০) এড়াতে কেবল নিশ্চিত প্রশ্নগুলো উত্তর দেওয়ার কৌশল মডেল টেস্টে আয়ত্ত করুন।',
      },
      {
        phase: 'ধাপ ৩: বিসিএস লিখিত ৯০০ নম্বর ও ভাইভা (২০০)',
        timeframe: 'প্রিলিমিনারি উত্তীর্ণ হওয়ার পর',
        milestones: [
          'বাংলা (২০০), ইংরেজি (২০০), বাংলাদেশ (২০০), আন্তর্জাতিক (১০০), গাণিতিক যুক্তি ও মানসিক দক্ষতা (১০০), সাধারণ বিজ্ঞান ও প্রযুক্তি (১০০)',
          'তথ্য-উপাত্ত, সংবিধানের অনুচ্ছেদ, অর্থনৈতিক সমীক্ষা ও মানচিত্রসহ গুছানো লিখিত উত্তর উপস্থাপন',
        ],
        actionTips: 'গতানুগতিক মুখস্থ উত্তরের চেয়ে প্রাসঙ্গিক ডাটা, চার্ট ও আন্তর্জাতিক রেফারেন্স লিখিত পরীক্ষায় বেশি নম্বর এনে দেয়।',
      },
      {
        phase: 'ধাপ ৪: ক্যাডার সুপারিশ ও বুনিয়াদি প্রশিক্ষণ',
        timeframe: 'চূড়ান্ত গেজেট',
        milestones: [
          'পছন্দক্রম অনুযায়ী প্রশাসন, পররাষ্ট্র, পুলিশ, কর, শুল্ক বা শিক্ষা ক্যাডারে নিয়োগ',
          'বিপিএটিসি (BPATC) সাভারে বুনিয়াদি প্রশিক্ষণ সম্পন্ন করে মাঠ প্রশাসন বা মন্ত্রণালয়ে যোগদান',
        ],
        actionTips: 'বিকল্প ব্যাকআপ হিসেবে বাংলাদেশ ব্যাংক এডি (AD) ও সরকারি ব্যাংক/মন্ত্রণালয়ের নিয়োগ পরীক্ষাতেও অংশ নিন।',
      },
    ],
  },
  ca_finance: {
    id: 'ca_finance',
    label: 'চার্টার্ড অ্যাকাউন্ট্যান্ট (সিএ) ও কর্পোরেট ফিন্যান্স',
    subtitle: 'আইসিএবি (ICAB) বা এসিসিএ (ACCA) ও আইবিএ/বিবিএ সমন্বিত পেশা',
    totalDuration: '৪ – ৬ বছর',
    targetInstitutions:
      'ঢাবি IBA ও ব্যবসায় শিক্ষা অনুষদ, জাবি IBA, বিইউপি, রাবি/চবি এবং এনএসইউ/ব্র্যাক/ইস্ট ওয়েস্ট + ICAB নিবন্ধিত অডিট ফার্ম',
    phases: [
      {
        phase: 'ধাপ ১: বিবিএ / অ্যাকাউন্টিং ভিত্তি বা সরাসরি সিএ',
        timeframe: 'এইচএসসি পরবর্তী ১ম বছর',
        milestones: [
          'হিসাববিজ্ঞান, ফিন্যান্স, ব্যবসায়িক আইন এবং মাইক্রোসফট এক্সেল-এর শক্ত ভিত্তি তৈরি',
          'ঢাবি (গ/আইবিএ), জাবি, রাবি, চবি বা শীর্ষ বেসরকারি বিশ্ববিদ্যালয়ে বিবিএ ভর্তি অথবা এইচএসসি পর সরাসরি সিএ প্রি-আর্টিকেলশিপ',
        ],
        actionTips: 'বিবিএ করার পাশাপাশি ফিন্যান্স ও অ্যাকাউন্টিংয়ের আন্তর্জাতিক মানদণ্ড (IFRS/IAS) সম্পর্কে ধারণা নিন।',
      },
      {
        phase: 'ধাপ ২: সিএ আর্টিকেলশিপ (ICAB / ACCA)',
        timeframe: '৩ – ৩.৫ বছর',
        milestones: [
          'আইসিএবি স্বীকৃত শীর্ষ অডিট ফার্মে (যেমন: A. Qasem, Rahman Rahman Huq [KPMG], Hoda Vasi Chowdhury, ACNABIN) ৩ বছরের আর্টিকেলশিপ',
          'Certificate Level, Professional Level এবং Advanced Level পরীক্ষাসমূহ উত্তীর্ণ হওয়া',
        ],
        actionTips: 'আর্টিকেলশিপ চলাকালীন বাস্তব অডিট, কর-ভ্যাট ও ফিন্যান্সিয়াল রিপোর্টিংয়ের অভিজ্ঞতাই আসল সম্পদ।',
      },
      {
        phase: 'ধাপ ৩: এসোসিয়েট ও সিনিয়র কর্পোরেট নেতৃত্ব',
        timeframe: 'সিএ সনদ অর্জনের পর',
        milestones: [
          'বহুজাতিক কোম্পানি, বাণিজ্যিক ব্যাংক, টেলিকম ও শীর্ষ শিল্প গ্রুপে ফিন্যান্স কন্ট্রোলার, অডিট প্রধান বা CFO পদে নিয়োগ',
          'স্বাধীন চার্টার্ড অ্যাকাউন্ট্যান্সি ফার্মের পার্টনার হিসেবে পরামর্শক সেবা প্রদান',
        ],
        actionTips: 'ব্যবসায়িক যোগাযোগ দক্ষতা ও ডাটা অ্যানালিটিক্স (Power BI) যুক্ত করলে পদোন্নতি দ্রুত হয়।',
      },
    ],
  },
  pharmacy_biotech: {
    id: 'pharmacy_biotech',
    label: 'ফার্মাসিস্ট ও বায়োটেকনোলজি গবেষক',
    subtitle: 'ওষুধ শিল্প, ক্লিনিক্যাল গবেষণা ও আন্তর্জাতিক উচ্চশিক্ষা',
    totalDuration: '৪ – ৬ বছর (বি.ফার্ম/বিএসসি + এমএস/পিএইচডি)',
    targetInstitutions:
      'ঢাবি, জাবি, রাবি, চবি, খুবি, জবি, কুবি, নোবিপ্রবি, যবিপ্রবি, মাভাবিপ্রবি এবং এনএসইউ, ব্র্যাক, ইস্ট ওয়েস্ট ও এশিয়া প্যাসিফিক',
    phases: [
      {
        phase: 'ধাপ ১: জীববিজ্ঞান ও জৈব রসায়ন প্রস্তুতি',
        timeframe: 'এইচএসসি বিজ্ঞান',
        milestones: [
          'রসায়ন (বিশেষত জৈব রসায়ন) ও জীববিজ্ঞানে দৃঢ় দখল অর্জন',
          'ঢাবি ক, জাবি ডি, রাবি/চবি এবং জিএসটি গুচ্ছ ও বেসরকারি বিশ্ববিদ্যালয়ের ফার্মেসি ভর্তি পরীক্ষা',
        ],
        actionTips: 'বাংলাদেশে বি.ফার্ম পড়ার আগে প্রতিষ্ঠানটি বাংলাদেশ ফার্মেসি কাউন্সিল (PCB) অনুমোদিত কিনা যাচাই করে নেবেন।',
      },
      {
        phase: 'ধাপ ২: বি.ফার্ম / বায়োটেকনোলজি স্নাতক ও ইন্ডাস্ট্রি প্রশিক্ষণ',
        timeframe: '৪ বছর',
        milestones: [
          'ফার্মাকোলজি, ফার্মাসিউটিক্যাল কেমিস্ট্রি, মাইক্রোবায়োলজি ও মলিকুলার বায়োলজিতে সিজিপিএ ৩.৫০+ রাখা',
          'দেশের শীর্ষ ফার্মাসিউটিক্যাল কারখানায় (Square, Incepta, Beximco, Renata, Aristopharma) ইন-প্ল্যান্ট ট্রেনিং',
        ],
        actionTips: 'তৃতীয় বর্ষ থেকেই শিক্ষকদের সাথে রিভিউ পেপার বা ল্যাব গবেষণায় যুক্ত হলে বিদেশে স্কলারশিপ সহজ হয়।',
      },
      {
        phase: 'ধাপ ৩: ইন্ডাস্ট্রি প্লেসমেন্ট বা আন্তর্জাতিক পিএইচডি',
        timeframe: '১ – ৪ বছর',
        milestones: [
          'পিসিবি (PCB) ‘এ’ গ্রেড ফার্মাসিস্ট রেজিস্ট্রেশন গ্রহণ',
          'হসপিটাল ফার্মাসি, প্রোডাকশন/QA/R&D অফিসার অথবা যুক্তরাষ্ট্র/ইউরোপ/জাপানে পূর্ণ স্কলারশিপে এমএস-পিএইচডি',
        ],
        actionTips: 'R&D ও রেগুলেটরি অ্যাফেয়ার্স বিভাগে কাজ করলে দেশ-বিদেশে উচ্চ চাহিদা পাওয়া যায়।',
      },
    ],
  },
  law_bjs: {
    id: 'law_bjs',
    label: 'আইনজীবী ও জুডিশিয়াল ম্যাজিস্ট্রেট (BJS)',
    subtitle: 'এলএলবি (অনার্স) থেকে বার কাউন্সিল ও বিচার বিভাগীয় ক্যাডার',
    totalDuration: '৫ – ৬ বছর',
    targetInstitutions:
      'ঢাবি, রাবি, চবি, জবি, জাবি, খুবি, ইবি, বিইউপি ও গুচ্ছভুক্ত পাবলিক বিশ্ববিদ্যালয়ের আইন অনুষদ',
    phases: [
      {
        phase: 'ধাপ ১: ভাষা ও বিশ্লেষণমূলক দক্ষতায় ভর্তি প্রস্তুতি',
        timeframe: 'এইচএসসি পর ৩ – ৪ মাস',
        milestones: [
          'বাংলা, ইংরেজি ও সাধারণ জ্ঞানে সর্বোচ্চ স্কোর করে ঢাবি খ/চ, রাবি, চবি, বিইউপি বা গুচ্ছের আইন বিভাগে ভর্তি',
        ],
        actionTips: 'আইন বিভাগে আসন সংখ্যা সীমিত হওয়ায় ইংরেজি রিডিং ও বিশ্লেষণধর্মী সাধারণ জ্ঞানে এগিয়ে থাকা আবশ্যক।',
      },
      {
        phase: 'ধাপ ২: ৪ বছর এলএলবি (সম্মান) ও মুট কোর্ট',
        timeframe: '৪ বছর',
        milestones: [
          'বাংলাদেশের সংবিধান, পেনাল কোড, সিপিসি, সিআরপিসি, এভিডেন্স অ্যাক্ট, চুক্তি আইন ও কর্পোরেট আইন আয়ত্ত করা',
          'জাতীয় ও আন্তর্জাতিক মুট কোর্ট (Moot Court) প্রতিযোগিতায় অংশগ্রহণ',
        ],
        actionTips: 'প্রথম বর্ষ থেকেই আইনি ধারা মুখস্থের বদলে প্রকৃত মামলার রায় (Judgment) পড়ার অভ্যাস গড়ে তুলুন।',
      },
      {
        phase: 'ধাপ ৩: বিজিএসসি (সহকারী জজ) ও বার কাউন্সিল সনদ',
        timeframe: '১ – ২ বছর',
        milestones: [
          'বাংলাদেশ জুডিশিয়াল সার্ভিস কমিশন (BJSC)-এর প্রিলিমিনারি, লিখিত (১০০০ নম্বর) ও ভাইভা পরীক্ষায় উত্তীর্ণ হয়ে সহকারী জজ হিসেবে নিয়োগ',
          'অথবা বাংলাদেশ বার কাউন্সিল পরীক্ষায় উত্তীর্ণ হয়ে জেলা জজ কোর্ট ও সুপ্রিম কোর্টে আইন পেশায় যোগদান',
        ],
        actionTips: 'একজন সিনিয়র আইনজীবীর চেম্বারে নিয়মিত পিউপিলেজ করলে লিখিত ড্রাফটিং ও ব্যবহারিক জ্ঞান দ্রুত সমৃদ্ধ হয়।',
      },
    ],
  },
};

const toBn = (n: number): string =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export const CareerRoadmapGeneratorPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedTrackKey, setSelectedTrackKey] = useState<string>('doctor');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const track = ROADMAP_TRACKS[selectedTrackKey];

  const toggleMilestone = (key: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalItems = track.phases.reduce((sum, p) => sum + p.milestones.length, 0);
  const completedCount = track.phases.reduce(
    (sum, p, pIdx) =>
      sum + p.milestones.filter((_, mIdx) => completedMilestones[`${selectedTrackKey}-${pIdx}-${mIdx}`]).length,
    0
  );
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const handleCopy = () => {
    let text = `MEDIX PRIME — ক্যারিয়ার রোডম্যাপ: ${track.label}\nলক্ষ্য প্রতিষ্ঠান: ${track.targetInstitutions}\n\n`;
    track.phases.forEach((p, idx) => {
      text += `${idx + 1}. ${p.phase} (${p.timeframe})\n`;
      p.milestones.forEach((m) => {
        text += `   • ${m}\n`;
      });
      text += `   পরামর্শ: ${p.actionTips}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetProgress = () => {
    setCompletedMilestones({});
  };

  return (
    <ToolPageLayout
      toolNumber="০৭"
      toolName="ক্যারিয়ার রোডম্যাপ জেনারেটর"
      categoryLabel="ক্যারিয়ার সরঞ্জাম"
      iconName="Milestone"
      accentColor="#A78BFA"
      description="আপনার কাঙ্ক্ষিত পেশা নির্বাচন করে এইচএসসি, বাংলাদেশের প্রাসঙ্গিক ভর্তি পরীক্ষা ও বিশ্ববিদ্যালয়ভিত্তিক ধাপসমূহ এবং অগ্রগতি ট্র্যাক করুন।"
    >
      <div className="space-y-6">
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-heading font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                আপনার কাঙ্ক্ষিত ক্যারিয়ার পথ নির্বাচন করুন:
              </label>
              <select
                value={selectedTrackKey}
                onChange={(e) => setSelectedTrackKey(e.target.value)}
                className={`w-full md:w-96 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-purple-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98]'
                }`}
              >
                {Object.values(ROADMAP_TRACKS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right">
                <span className={`text-[11px] font-heading block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  সম্পন্ন মাইলফলক
                </span>
                <span className={`text-sm font-heading font-black ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  {toBn(completedCount)} / {toBn(totalItems)} ({toBn(progressPercent)}%)
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetProgress}
                className={`px-3 py-2 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'border-white/15 text-slate-300 hover:bg-white/10'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl border text-xs font-heading font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'border-white/15 text-slate-200 hover:bg-white/10'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>রোডম্যাপ কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t text-xs font-heading flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'
            }`}
          >
            <div>
              <span className="font-bold">সংশ্লিষ্ট প্রতিষ্ঠান: </span>
              <span>{track.targetInstitutions}</span>
            </div>
            <span
              className={`shrink-0 font-bold px-2.5 py-1 rounded-lg ${
                isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-50 text-purple-800'
              }`}
            >
              মোট সময়: {track.totalDuration}
            </span>
          </div>

          <div
            className={`w-full h-2 rounded-full overflow-hidden mt-3 ${
              isDark ? 'bg-white/10' : 'bg-slate-200'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {track.phases.map((phaseItem, pIdx) => (
            <div
              key={pIdx}
              className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
                isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-sm border shrink-0 ${
                      isDark
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                        : 'bg-purple-100 border-purple-200 text-purple-800'
                    }`}
                  >
                    {toBn(pIdx + 1)}
                  </div>
                  <h3 className={`font-heading font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {phaseItem.phase}
                  </h3>
                </div>

                <span
                  className={`text-[11px] font-heading font-bold px-2.5 py-1 rounded-md self-start sm:self-auto ${
                    isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  সময়কাল: {phaseItem.timeframe}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {phaseItem.milestones.map((m, mIdx) => {
                  const key = `${selectedTrackKey}-${pIdx}-${mIdx}`;
                  const isDone = !!completedMilestones[key];
                  return (
                    <button
                      key={mIdx}
                      type="button"
                      onClick={() => toggleMilestone(key)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-heading flex items-start gap-2.5 transition-all cursor-pointer ${
                        isDone
                          ? isDark
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isDone ? 'text-emerald-500' : isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      />
                      <span className={isDone ? 'line-through opacity-80' : ''}>{m}</span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`p-3 rounded-xl border text-xs font-heading ${
                  isDark
                    ? 'bg-purple-500/10 border-purple-500/25 text-purple-200'
                    : 'bg-purple-50 border-purple-200 text-purple-950'
                }`}
              >
                <span className="font-bold">কৌশলগত পরামর্শ: </span>
                <span>{phaseItem.actionTips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};
