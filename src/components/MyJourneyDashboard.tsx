import React, { useRef, useState } from 'react';
import {
  Compass,
  GraduationCap,
  Building2,
  Edit3,
  LogOut,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Link } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';
import { StudentEntryData } from '../pages/EntryFormPage';
import { PomodoroTimerCard } from './PomodoroTimerCard';

const STUDENT_ENTRY_STORAGE_KEY = 'medix_prime_student_entry';

interface MyJourneyDashboardProps {
  studentEntry: StudentEntryData | null;
  onLogout?: () => void;
}

export const MyJourneyDashboard: React.FC<MyJourneyDashboardProps> = ({ studentEntry, onLogout }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentEntry, setCurrentEntry] = useState<StudentEntryData | null>(studentEntry);
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const studentName = currentEntry?.name?.trim() || 'শিক্ষার্থী';
  const studentClassLabel = currentEntry?.studentClass || 'HSC';
  const studentPhoto = currentEntry?.studentPhoto;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (base64String) {
        const updatedEntry: StudentEntryData = {
          name: currentEntry?.name || 'শিক্ষার্থী',
          studentClass: currentEntry?.studentClass || 'HSC',
          institution: currentEntry?.institution || '',
          phone: currentEntry?.phone || '',
          studentPhoto: base64String,
          enteredAt: currentEntry?.enteredAt || new Date().toISOString(),
        };

        setCurrentEntry(updatedEntry);
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(STUDENT_ENTRY_STORAGE_KEY, JSON.stringify(updatedEntry));
          } catch {
            // Ignore storage errors
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="my-journey-dashboard"
      className={`pt-4 pb-2 sm:pt-5 sm:pb-3 relative overflow-x-clip transition-colors duration-300 ${
        isDark ? 'bg-[#081220] text-white' : 'bg-[#FFFFFF] text-[#0F172A]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`rounded-2xl border p-3.5 sm:p-4.5 transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#0B1526] via-[#0D1A30] to-[#081322] border-[#1B2F4D] shadow-[0_8px_24px_rgba(0,107,152,0.14)]'
              : 'bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0F9FF] border-slate-200 shadow-xs'
          }`}
        >
          {/* Top Bar: Short Square Student Image (Left) + Name & Details + Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 ${
              isExpanded ? 'border-b mb-3' : ''
            } ${isDark ? 'border-white/10' : 'border-slate-200'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Short Square Box for Student Image / Avatar (Positioned Left of Student Name) */}
              <div className="relative group shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  aria-label="ছাত্রের ছবি আপলোড করুন"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="ছবি পরিবর্তন করতে ক্লিক করুন"
                  aria-label="ছাত্রের ছবি আপলোড বা পরিবর্তন করুন"
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                    isDark
                      ? 'bg-[#00D2FF]/15 border-[#00D2FF]/35 text-[#38BDF8]'
                      : 'bg-sky-50 border-sky-200 text-[#006B98]'
                  }`}
                >
                  {studentPhoto ? (
                    <img
                      src={studentPhoto}
                      alt={studentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-1">
                      <Compass className="w-5 h-5 mb-0.5 opacity-90" />
                      <span className="text-[9px] font-heading font-bold leading-none">ছবি</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-4 h-4" />
                  </div>
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2
                    className={`text-sm sm:text-base font-heading font-extrabold tracking-tight truncate ${
                      isDark ? 'text-white' : 'text-[#092C43]'
                    }`}
                  >
                    {studentName}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <GraduationCap className="w-2.5 h-2.5" />
                    <span>{studentClassLabel}</span>
                  </span>
                </div>

                {currentEntry?.institution && (
                  <p
                    className={`text-[11px] font-heading flex items-center gap-1 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Building2 className="w-3 h-3 shrink-0 opacity-80" />
                    <span className="truncate">{currentEntry.institution}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
              <Link
                href="/entry"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>তথ্য হালনাগাদ</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}
                title={isExpanded ? 'সংক্ষিপ্ত ভিউ' : 'বিস্তারিত ভিউ'}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                  isExpanded
                    ? isDark
                      ? 'bg-[#00D2FF]/20 border-[#00D2FF]/50 text-[#38BDF8]'
                      : 'bg-sky-100 border-sky-300 text-[#006B98]'
                    : isDark
                    ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>টাইমার ও অপশন</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="লগআউট করুন"
                  title="লগআউট"
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-heading font-bold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <LogOut className="w-3 h-3" />
                  <span>লগআউট</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Pomodoro Study Timer Section */}
          {isExpanded && (
            <div className="space-y-3 mt-2 pt-2">
              <PomodoroTimerCard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
