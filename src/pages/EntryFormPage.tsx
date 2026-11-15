import React, { useEffect, useState } from 'react';
import {
  User,
  GraduationCap,
  Building2,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  BookOpenCheck,
  UserPlus,
  LogIn,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MedixPrimeLogo } from '../components/MedixPrimeLogo';
import { useTheme } from '../hooks/useTheme';
import {
  clearRegistrationDraft,
  clearRememberedLogin,
  findSavedAccount,
  loadRegistrationDraft,
  loadRememberedLogin,
  saveRegistrationDraft,
  saveRememberedLogin,
  saveStudentAccountLocally,
} from '../utils/studentAuthStorage';

export interface StudentEntryData {
  name: string;
  studentClass: 'SSC' | 'HSC';
  institution: string;
  phone: string;
  studentPhoto?: string;
  enteredAt: string;
}

interface EntryFormPageProps {
  initialData?: StudentEntryData | null;
  onSuccess: (data: StudentEntryData) => void;
}

export const EntryFormPage: React.FC<EntryFormPageProps> = ({ initialData, onSuccess }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isUpdateMode = Boolean(initialData);
  const initialRemembered = !isUpdateMode ? loadRememberedLogin() : null;
  const initialDraft = !isUpdateMode ? loadRegistrationDraft() : null;

  const [activeTab, setActiveTab] = useState<'register' | 'login'>(
    initialRemembered ? 'login' : 'register'
  );

  // Registration states (restoring draft automatically if not updating an active session)
  const [name, setName] = useState(initialData?.name || initialDraft?.name || '');
  const [studentClass, setStudentClass] = useState<'SSC' | 'HSC'>(
    initialData?.studentClass || initialDraft?.studentClass || 'HSC'
  );
  const [institution, setInstitution] = useState(
    initialData?.institution || initialDraft?.institution || ''
  );
  const [regPhone, setRegPhone] = useState(initialData?.phone || initialDraft?.phone || '');
  const [regPin, setRegPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);

  // Login & Auto-save states
  const [rememberedAccount, setRememberedAccount] = useState(initialRemembered);
  const [loginPhone, setLoginPhone] = useState(initialRemembered?.phone || '');
  const [loginPin, setLoginPin] = useState(initialRemembered?.pin || '');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [autoSaveCredentials, setAutoSaveCredentials] = useState<boolean>(
    initialRemembered ? initialRemembered.autoSaveEnabled : true
  );
  const [draftSavedNotice, setDraftSavedNotice] = useState<boolean>(
    Boolean(!isUpdateMode && initialDraft && (initialDraft.name || initialDraft.institution || initialDraft.phone))
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save registration draft fields as the student types
  useEffect(() => {
    if (isUpdateMode) return;
    const hasContent =
      name.trim().length > 0 || institution.trim().length > 0 || regPhone.trim().length > 0;
    saveRegistrationDraft({
      name,
      studentClass,
      institution,
      phone: regPhone,
    });
    setDraftSavedNotice(hasContent);
  }, [name, studentClass, institution, regPhone, isUpdateMode]);

  const normalizeDigits = (raw: string) =>
    raw
      .replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
      .replace(/[^\d+]/g, '');

  const extractBdPhone = (raw: string): string => {
    const normalized = normalizeDigits(raw.trim());
    if (normalized.startsWith('+88')) return normalized.slice(3);
    if (normalized.startsWith('88') && normalized.length === 13) return normalized.slice(2);
    return normalized;
  };

  const extractPin = (raw: string): string => normalizeDigits(raw).replace(/\+/g, '');

  const handleTabSwitch = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    setError(null);
  };

  const finalizeEntry = (studentPayload: StudentEntryData, pin: string) => {
    clearRegistrationDraft();

    const localSaved = findSavedAccount(studentPayload.phone);
    const mergedPayload: StudentEntryData = {
      ...studentPayload,
      studentPhoto: studentPayload.studentPhoto || localSaved?.studentPhoto,
    };

    // Always auto-save registration profile locally so account survives server restarts
    saveStudentAccountLocally({
      ...mergedPayload,
      pin,
    });

    if (autoSaveCredentials) {
      saveRememberedLogin({
        phone: mergedPayload.phone,
        pin,
        name: mergedPayload.name,
        autoSaveEnabled: true,
      });
    } else {
      clearRememberedLogin();
    }

    onSuccess(mergedPayload);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedInst = institution.trim();
    const cleanedBdPhone = extractBdPhone(regPhone);
    const cleanedPin = extractPin(regPin);

    if (trimmedName.length < 2) {
      setError('অনুগ্রহ করে শিক্ষার্থীর সঠিক নাম লিখুন।');
      return;
    }
    if (trimmedInst.length < 3) {
      setError('অনুগ্রহ করে আপনার শিক্ষা প্রতিষ্ঠানের পূর্ণ নাম লিখুন।');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(cleanedBdPhone)) {
      setError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নাম্বার লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!/^\d{4,6}$/.test(cleanedPin)) {
      setError('অনুগ্রহ করে ৪ থেকে ৬ ডিজিটের পিন নাম্বার দিন (যেমন: 1234)।');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/student-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          studentClass,
          institution: trimmedInst,
          phone: cleanedBdPhone,
          pin: cleanedPin,
          mode: isUpdateMode ? 'update' : 'register',
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setLoginPhone(cleanedBdPhone);
          setLoginPin(cleanedPin);
        }
        throw new Error(resData.error || 'তথ্য সংরক্ষণে সমস্যা হয়েছে।');
      }

      const studentPayload: StudentEntryData = resData.student || {
        name: trimmedName,
        studentClass,
        institution: trimmedInst,
        phone: cleanedBdPhone,
        studentPhoto: initialData?.studentPhoto,
        enteredAt: new Date().toISOString(),
      };

      finalizeEntry(studentPayload, cleanedPin);
    } catch (err: any) {
      setError(err?.message || 'তথ্য পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const performDirectLogin = async (phoneInput: string, pinInput: string) => {
    setError(null);

    const cleanedBdPhone = extractBdPhone(phoneInput);
    const cleanedPin = extractPin(pinInput);

    if (!/^01[3-9]\d{8}$/.test(cleanedBdPhone)) {
      setError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নাম্বার লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!/^\d{4,6}$/.test(cleanedPin)) {
      setError('আপনার নিবন্ধিত ৪ থেকে ৬ ডিজিটের পিন নাম্বার লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanedBdPhone,
          pin: cleanedPin,
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.student) {
        finalizeEntry(resData.student as StudentEntryData, cleanedPin);
        return;
      }

      // If server store was reset or doesn't yet have this number, check locally auto-saved registration
      const localMatch = findSavedAccount(cleanedBdPhone);
      const isUnregisteredOnServer =
        response.status === 401 &&
        typeof resData.error === 'string' &&
        resData.error.includes('নিবন্ধিত নয়');

      if (localMatch && localMatch.pin === cleanedPin && (isUnregisteredOnServer || !response.ok)) {
        // Silently re-sync local registration back to server
        fetch('/api/student-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: localMatch.name,
            studentClass: localMatch.studentClass,
            institution: localMatch.institution,
            phone: localMatch.phone,
            pin: localMatch.pin,
            mode: 'update',
          }),
        }).catch(() => {});

        finalizeEntry(
          {
            name: localMatch.name,
            studentClass: localMatch.studentClass,
            institution: localMatch.institution,
            phone: localMatch.phone,
            studentPhoto: localMatch.studentPhoto,
            enteredAt: new Date().toISOString(),
          },
          cleanedPin
        );
        return;
      }

      throw new Error(resData.error || 'মোবাইল নাম্বার বা পিন সঠিক নয়।');
    } catch (err: any) {
      setError(err?.message || 'লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performDirectLogin(loginPhone, loginPin);
  };

  const handleClearRemembered = () => {
    clearRememberedLogin();
    setRememberedAccount(null);
    setLoginPhone('');
    setLoginPin('');
    setError(null);
  };

  return (
    <div
      className={`min-h-[calc(100vh-5rem)] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 transition-colors duration-300 ${
        isDark ? 'bg-[#060D17] text-white' : 'bg-[#F1F5F9] text-[#0F172A]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`max-w-5xl w-full rounded-3xl overflow-hidden border transition-colors ${
          isDark
            ? 'bg-[#0B1526]/95 border-[#172740] shadow-[0_24px_60px_rgba(0,0,0,0.5)]'
            : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Side: MEDIX PRIME Logo & Overview */}
          <div
            className={`lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r ${
              isDark
                ? 'bg-gradient-to-br from-[#081526] via-[#0B1E36] to-[#081220] border-[#172740]'
                : 'bg-gradient-to-br from-[#E6F4FA] via-[#F0F9FF] to-[#FFFFFF] border-slate-200'
            }`}
          >
            <div className="relative z-10 space-y-5">
              <div
                className={`inline-flex p-3 rounded-2xl border ${
                  isDark ? 'bg-white/95 border-white/20 shadow-lg' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <MedixPrimeLogo size="lg" />
              </div>

              <div className="space-y-2">
                <p
                  className={`text-xs font-heading font-bold tracking-wide ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'
                  }`}
                >
                  শিক্ষার্থী প্রবেশ পোর্টাল · অটো-সেভ ও পিন লগইন
                </p>

                <h1
                  className={`font-heading font-extrabold text-2xl sm:text-3xl leading-snug ${
                    isDark ? 'text-white' : 'text-[#092C43]'
                  }`}
                >
                  MEDIX PRIME-এ স্বাগতম
                </h1>

                <p
                  className={`font-body text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  নতুন শিক্ষার্থী হলে তথ্য ও পিন দিয়ে রেজিস্ট্রেশন করুন—তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে। পরবর্তী সময়ে শুধুমাত্র মোবাইল নাম্বার ও পিন দিয়েই সরাসরি ওয়েবসাইটে প্রবেশ করতে পারবেন।
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div
                  className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-heading ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'
                  }`}
                >
                  <BookOpenCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`} />
                  <span>এসএসসি ও এইচএসসি ২০টি বাস্তবভিত্তিক শিক্ষার্থী টুলস</span>
                </div>
                <div
                  className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-heading ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>বাংলাদেশের সকল বিশ্ববিদ্যালয় ও মেডিকেলের আপডেট তথ্য</span>
                </div>
                <div
                  className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-heading ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>অটো-সেভ রেজিস্ট্রেশন ও নাম্বার-পিনে সরাসরি প্রবেশ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Registration & Login Sectors */}
          <div className="lg:col-span-7 p-6 sm:p-9">
            {/* Two-Sector Switcher: রেজিস্ট্রেশন / লগইন */}
            <div
              className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border mb-6 ${
                isDark ? 'bg-[#060D17] border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? isDark
                      ? 'bg-[#00D2FF] text-[#060D17] shadow-sm'
                      : 'bg-[#006B98] text-white shadow-sm'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isUpdateMode ? 'তথ্য হালনাগাদ' : 'রেজিস্ট্রেশন'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? isDark
                      ? 'bg-[#00D2FF] text-[#060D17] shadow-sm'
                      : 'bg-[#006B98] text-white shadow-sm'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>সরাসরি লগইন</span>
              </button>
            </div>

            {error && (
              <div
                className={`mb-5 p-3.5 rounded-xl border text-xs sm:text-sm font-heading flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isDark
                    ? 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {activeTab === 'register' && loginPhone && (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className={`text-xs font-bold underline shrink-0 cursor-pointer ${
                      isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'
                    }`}
                  >
                    সরাসরি লগইনে যান
                  </button>
                )}
              </div>
            )}

            {activeTab === 'register' ? (
              <div>
                <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2
                      className={`font-heading font-extrabold text-xl sm:text-2xl ${
                        isDark ? 'text-white' : 'text-[#092C43]'
                      }`}
                    >
                      {isUpdateMode ? 'প্রোফাইল ও পিন হালনাগাদ' : 'নতুন শিক্ষার্থী রেজিস্ট্রেশন'}
                    </h2>
                    <p className={`text-xs sm:text-sm font-body mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      আপনার তথ্য ও একটি ৪–৬ ডিজিটের পিন নাম্বার সেট করে প্রবেশ করুন
                    </p>
                  </div>

                  {!isUpdateMode && draftSavedNotice && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-heading font-semibold ${
                        isDark ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>খসড়া অটো-সেভ হচ্ছে</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Field 1: Student Name */}
                  <div>
                    <label
                      htmlFor="entry-name"
                      className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      ১. শিক্ষার্থীর নাম *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="entry-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        required
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-heading transition-colors focus:outline-hidden ${
                          isDark
                            ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field 2: Class (SSC / HSC) */}
                  <div>
                    <span
                      className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      ২. শ্রেণী (SSC / HSC) *
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {(['SSC', 'HSC'] as const).map((cls) => {
                        const active = studentClass === cls;
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setStudentClass(cls)}
                            className={`py-2.5 px-4 rounded-xl border text-sm font-heading font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              active
                                ? isDark
                                  ? 'bg-[#00D2FF] text-[#060D17] border-[#00D2FF] shadow-md'
                                  : 'bg-[#006B98] text-white border-[#006B98] shadow-md'
                                : isDark
                                ? 'bg-[#060D17] border-white/15 text-slate-300 hover:border-white/30'
                                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {active && <CheckCircle2 className="w-4 h-4" />}
                            <span>{cls === 'SSC' ? 'SSC (এসএসসি)' : 'HSC (এইচএসসি)'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 3: Institution Name */}
                  <div>
                    <label
                      htmlFor="entry-institution"
                      className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      ৩. শিক্ষা প্রতিষ্ঠানের নাম *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="entry-institution"
                        type="text"
                        autoComplete="organization"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="আপনার স্কুল বা কলেজের পূর্ণ নাম লিখুন"
                        required
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-heading transition-colors focus:outline-hidden ${
                          isDark
                            ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fields 4 & 5: Mobile Number + PIN Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="entry-phone"
                        className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        ৪. মোবাইল নাম্বার *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="entry-phone"
                          type="tel"
                          autoComplete="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          required
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-latin font-semibold transition-colors focus:outline-hidden ${
                            isDark
                              ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="entry-pin"
                        className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        ৫. পিন নাম্বার (৪–৬ সংখ্যা) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="entry-pin"
                          type={showRegPin ? 'text' : 'password'}
                          inputMode="numeric"
                          autoComplete="new-password"
                          maxLength={6}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value)}
                          placeholder="যেমন: 1234"
                          required
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-latin font-semibold tracking-widest transition-colors focus:outline-hidden ${
                            isDark
                              ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 placeholder:tracking-normal focus:border-[#00D2FF]'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-[#006B98] focus:bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPin((prev) => !prev)}
                          aria-label={showRegPin ? 'পিন লুকান' : 'পিন দেখুন'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showRegPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Auto-save credentials checkbox */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none pt-0.5">
                    <input
                      type="checkbox"
                      checked={autoSaveCredentials}
                      onChange={(e) => setAutoSaveCredentials(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#006B98] cursor-pointer"
                    />
                    <span className={`text-xs font-heading ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      পরবর্তী সরাসরি লগইনের জন্য মোবাইল নাম্বার ও পিন অটো-সেভ রাখুন
                    </span>
                  </label>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                        isDark
                          ? 'bg-gradient-to-r from-[#0284C7] to-[#00D2FF] text-[#060D17] hover:brightness-110'
                          : 'bg-gradient-to-r from-[#092C43] to-[#006B98] text-white hover:brightness-110'
                      }`}
                    >
                      <span>
                        {isSubmitting
                          ? 'তথ্য যাচাই ও সংরক্ষণ হচ্ছে...'
                          : isUpdateMode
                          ? 'তথ্য হালনাগাদ ও প্রবেশ করুন'
                          : 'রেজিস্ট্রেশন ও প্রবেশ করুন'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <h2
                    className={`font-heading font-extrabold text-xl sm:text-2xl ${
                      isDark ? 'text-white' : 'text-[#092C43]'
                    }`}
                  >
                    নাম্বার ও পিন দিয়ে সরাসরি লগইন
                  </h2>
                  <p className={`text-xs sm:text-sm font-body mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    পূর্বে রেজিস্ট্রেশন করা থাকলে শুধুমাত্র মোবাইল নাম্বার ও পিন নাম্বার দিয়েই সরাসরি ওয়েবসাইটে প্রবেশ করুন
                  </p>
                </div>

                {/* One-click Direct Login Card when saved registration exists */}
                {rememberedAccount && (
                  <div
                    className={`mb-5 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-[#060D17] border-[#00D2FF]/35'
                        : 'bg-sky-50/70 border-sky-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-[11px] font-heading font-bold ${isDark ? 'text-[#38BDF8]' : 'text-[#006B98]'}`}>
                        সংরক্ষিত রেজিস্ট্রেশন পাওয়া গেছে
                      </p>
                      <p className={`text-sm font-heading font-extrabold truncate ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                        {rememberedAccount.name || 'শিক্ষার্থী'} ·{' '}
                        <span className="font-latin">{rememberedAccount.phone}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => performDirectLogin(rememberedAccount.phone, rememberedAccount.pin)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold cursor-pointer transition-all disabled:opacity-60 ${
                          isDark
                            ? 'bg-[#00D2FF] text-[#060D17] hover:bg-[#38BDF8]'
                            : 'bg-[#006B98] text-white hover:bg-[#02557A]'
                        }`}
                      >
                        <span>সরাসরি প্রবেশ করুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleClearRemembered}
                        aria-label="সংরক্ষিত লগইন মুছুন"
                        title="অন্য নাম্বারে লগইন করুন"
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:text-rose-300 hover:border-rose-400/40'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Login Mobile Number */}
                  <div>
                    <label
                      htmlFor="login-phone"
                      className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      মোবাইল নাম্বার *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-phone"
                        type="tel"
                        autoComplete="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-latin font-semibold transition-colors focus:outline-hidden ${
                          isDark
                            ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 focus:border-[#00D2FF]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#006B98] focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Login PIN Number */}
                  <div>
                    <label
                      htmlFor="login-pin"
                      className={`block text-xs sm:text-sm font-heading font-bold mb-1.5 ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      পিন নাম্বার *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-pin"
                        type={showLoginPin ? 'text' : 'password'}
                        inputMode="numeric"
                        autoComplete="current-password"
                        maxLength={6}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="আপনার ৪–৬ ডিজিটের পিন দিন"
                        required
                        className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm font-latin font-semibold tracking-widest transition-colors focus:outline-hidden ${
                          isDark
                            ? 'bg-[#060D17] border-white/15 text-white placeholder:text-slate-500 placeholder:tracking-normal focus:border-[#00D2FF]'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-[#006B98] focus:bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPin((prev) => !prev)}
                        aria-label={showLoginPin ? 'পিন লুকান' : 'পিন দেখুন'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Auto-save credentials toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSaveCredentials}
                      onChange={(e) => setAutoSaveCredentials(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#006B98] cursor-pointer"
                    />
                    <span className={`text-xs font-heading ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      নাম্বার ও পিন অটো-সেভ করে রাখুন
                    </span>
                  </label>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                        isDark
                          ? 'bg-gradient-to-r from-[#0284C7] to-[#00D2FF] text-[#060D17] hover:brightness-110'
                          : 'bg-gradient-to-r from-[#092C43] to-[#006B98] text-white hover:brightness-110'
                      }`}
                    >
                      <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'লগইন ও প্রবেশ করুন'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
