import React, { useState, useMemo } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { BANGLADESH_INSTITUTIONS, InstitutionCategory } from '../../data/bangladeshInstitutions';
import { Search, ExternalLink, MapPin } from 'lucide-react';

const CATEGORY_OPTIONS: ('সবগুলো' | InstitutionCategory)[] = [
  'সবগুলো',
  'পাবলিক সাধারণ',
  'বিজ্ঞান ও প্রযুক্তি',
  'প্রকৌশল ও বিশেষায়িত',
  'মেডিকেল ও ডেন্টাল',
  'কৃষি বিশ্ববিদ্যালয়',
  'বেসরকারি বিশ্ববিদ্যালয়',
  'জাতীয় ও সাত কলেজ',
];

export const UniversityFinderPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [typeFilter, setTypeFilter] = useState<'সবগুলো' | InstitutionCategory>('সবগুলো');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BANGLADESH_INSTITUTIONS.filter((u) => {
      const matchesType = typeFilter === 'সবগুলো' || u.category === typeFilter;
      const matchesSearch =
        q === '' ||
        u.nameBangla.toLowerCase().includes(q) ||
        u.nameEnglish.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.popularFaculties.some((f) => f.toLowerCase().includes(q));

      return matchesType && matchesSearch;
    });
  }, [typeFilter, search]);

  return (
    <ToolPageLayout
      toolNumber="১১"
      toolName="বিশ্ববিদ্যালয় ফাইন্ডার"
      categoryLabel="বিশ্ববিদ্যালয় সরঞ্জাম"
      iconName="GraduationCap"
      accentColor="#38BDF8"
      description="বাংলাদেশের সকল সরকারি সাধারণ, বিজ্ঞান ও প্রযুক্তি, প্রকৌশল, মেডিকেল ও ডেন্টাল, কৃষি গুচ্ছ, অনুমোদিত বেসরকারি বিশ্ববিদ্যালয়, সরকারি ৭ কলেজ এবং জাতীয় বিশ্ববিদ্যালয়ের সম্পূর্ণ তথ্য ও অফিসিয়াল পোর্টাল খুঁজুন।"
    >
      <div className="space-y-6">
        {/* Search & Filter Header */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col gap-4 transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className={`text-xs font-heading font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              মোট {filtered.length}টি প্রতিষ্ঠান ও বিশ্ববিদ্যালয় গুচ্ছ প্রদর্শিত হচ্ছে
            </span>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="বিশ্ববিদ্যালয়, জেলা বা বিভাগ খুঁজুন..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-heading border transition-colors focus:outline-hidden ${
                  isDark
                    ? 'bg-[#060D17] border-white/20 text-white focus:border-[#38BDF8]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#006B98] focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTypeFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                  typeFilter === cat
                    ? 'bg-[#006B98] text-white font-bold shadow-xs'
                    : isDark
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Universities List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filtered.map((univ) => (
            <div
              key={univ.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDark
                  ? 'bg-[#0B1526]/85 border-[#172740] hover:border-[#38BDF8]/60 hover:shadow-md'
                  : 'bg-white border-slate-200 shadow-sm hover:border-[#006B98]/50 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'
                        : 'bg-sky-50 border-sky-200 text-[#006B98]'
                    }`}
                  >
                    {univ.category}
                  </span>
                  <span
                    className={`text-[11px] font-heading flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[130px]">{univ.location}</span>
                  </span>
                </div>

                <h3
                  className={`font-heading font-bold text-base mb-1 leading-snug ${
                    isDark ? 'text-white' : 'text-[#092C43]'
                  }`}
                >
                  {univ.nameBangla}
                </h3>
                <span className={`text-[11px] font-heading block mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  প্রতিষ্ঠা: {univ.established} • আবাসন: {univ.hallFacilities}
                </span>

                <div className="space-y-2.5 text-xs font-heading border-t border-slate-200/20 pt-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`block text-[10px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      ভর্তির ন্যূনতম জিপিএ ও পদ্ধতি:
                    </span>
                    <span className={`font-semibold text-[11px] block ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {univ.minGpa}
                    </span>
                    <span className={`text-[10px] block mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {univ.examSystem}
                    </span>
                  </div>

                  <div>
                    <span className={`block text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      প্রধান বিভাগ ও অনুষদসমূহ:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {univ.popularFaculties.slice(0, 5).map((f, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-md text-[10px] border ${
                            isDark
                              ? 'bg-white/10 border-white/10 text-slate-200'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/20 flex gap-2">
                <a
                  href={univ.admissionPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-2 px-3 rounded-xl font-heading font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isDark
                      ? 'bg-sky-500/15 hover:bg-sky-500/25 text-[#38BDF8]'
                      : 'bg-sky-50 hover:bg-sky-100 text-[#006B98] border border-sky-200'
                  }`}
                >
                  <span>ভর্তি পোর্টাল</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={univ.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 px-3 rounded-xl font-heading font-semibold text-xs transition-colors border ${
                    isDark
                      ? 'border-white/15 text-slate-300 hover:bg-white/5'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  মূল সাইট
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};
