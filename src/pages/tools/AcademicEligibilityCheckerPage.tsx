import React, { useState } from 'react';
import { ToolPageLayout } from '../../components/tools/ToolPageLayout';
import { useTheme } from '../../hooks/useTheme';
import { VERIFIED_ADMISSION_PROGRAMS, toBengaliNumber } from '../../data/admissionRules';
import { CheckSquare, RotateCcw, Copy, Check, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export const AcademicEligibilityCheckerPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sscGpa, setSscGpa] = useState<string>('4.80');
  const [hscGpa, setHscGpa] = useState<string>('4.90');
  const [stream, setStream] = useState<'Science' | 'Humanities' | 'Business'>('Science');
  const [bioGpa, setBioGpa] = useState<string>('4.00');
  const [mathGpa, setMathGpa] = useState<string>('5.00');
  const [isSecondTimer, setIsSecondTimer] = useState<boolean>(false);

  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const totalCombined = (parseFloat(sscGpa) || 0) + (parseFloat(hscGpa) || 0);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluated(true);
  };

  const handleReset = () => {
    setSscGpa('4.80');
    setHscGpa('4.90');
    setStream('Science');
    setBioGpa('4.00');
    setMathGpa('5.00');
    setIsSecondTimer(false);
    setEvaluated(false);
  };

  const handleCopy = () => {
    const text = `MEDIX PRIME একাডেমিক যোগ্যতা রিপোর্ট\nএসএসসি: ${sscGpa}, এইচএসসি: ${hscGpa}, মোট: ${totalCombined.toFixed(2)}\nশাখা: ${stream === 'Science' ? 'বিজ্ঞান' : stream === 'Humanities' ? 'মানবিক' : 'ব্যবসায় শিক্ষা'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = `w-full px-3 py-2 rounded-xl text-xs font-heading font-bold border transition-colors focus:outline-hidden ${
    isDark
      ? 'bg-[#060D17] border-white/20 text-white focus:border-teal-400'
      : 'bg-white border-slate-300 text-slate-900 focus:border-[#006B98]'
  }`;

  return (
    <ToolPageLayout
      toolNumber="০৫"
      toolName="একাডেমিক যোগ্যতা যাচাইকারী"
      categoryLabel="একাডেমিক সরঞ্জাম"
      iconName="CheckSquare"
      accentColor="#2DD4BF"
      description="আপনার এসএসসি ও এইচএসসি ফলাফলের সাথে বাংলাদেশের সকল মেডিকেল, প্রকৌশল (BUET/CKRUET/MIST/IUT/BUTEX), ঢাবি, রাবি, চবি, জাবি, জিএসটি গুচ্ছ, কৃষি গুচ্ছ, ৭ কলেজ ও জাতীয় বিশ্ববিদ্যালয়ের যোগ্যতা মিলিয়ে দেখুন।"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div
          className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <h2 className={`font-heading font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
            একাডেমিক ফলাফল প্রদান করুন
          </h2>
          <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            বোর্ডের প্রাপ্ত জিপিএ ও শাখা অনুযায়ী যাচাই করুন
          </p>

          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="text-xs font-heading font-bold block mb-1">পড়াশোনার বিভাগ</label>
              <select value={stream} onChange={(e) => setStream(e.target.value as any)} className={inputClass}>
                <option value="Science">বিজ্ঞান</option>
                <option value="Humanities">মানবিক</option>
                <option value="Business">ব্যবসায় শিক্ষা</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-heading font-bold block mb-1">এসএসসি জিপিএ</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={sscGpa}
                  onChange={(e) => setSscGpa(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold block mb-1">এইচএসসি জিপিএ</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={hscGpa}
                  onChange={(e) => setHscGpa(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {stream === 'Science' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-heading font-bold block mb-1">জীববিজ্ঞান জিপি (মেডিকেল)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5.0"
                    value={bioGpa}
                    onChange={(e) => setBioGpa(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-heading font-bold block mb-1">উচ্চতর গণিত জিপি (প্রকৌশল)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5.0"
                    value={mathGpa}
                    onChange={(e) => setMathGpa(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-heading ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="font-semibold">২য় বার পরীক্ষার্থী (Second Timer)</span>
              <input
                type="checkbox"
                checked={isSecondTimer}
                onChange={(e) => setIsSecondTimer(e.target.checked)}
                className="w-4 h-4 accent-teal-500"
              />
            </label>

            <div
              className={`p-3 rounded-xl border text-xs font-heading flex items-center justify-between ${
                isDark
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                  : 'bg-teal-50 border-teal-200 text-teal-900'
              }`}
            >
              <span>মোট সম্মিলিত জিপিএ:</span>
              <strong className="font-latin text-sm font-black">{totalCombined.toFixed(2)}</strong>
            </div>

            <div className="flex items-center justify-between pt-2 gap-3">
              <button
                type="button"
                onClick={handleReset}
                className={`px-4 py-2.5 rounded-xl border text-xs font-heading font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'border-white/10 hover:bg-white/5 text-gray-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>

              <button
                type="submit"
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>যোগ্যতা যাচাই করুন</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-[#0B1526]/85 border-[#172740]' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-heading font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                বাংলাদেশের বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের সার্কুলার যাচাই ({toBengaliNumber(VERIFIED_ADMISSION_PROGRAMS.length, 0)}টি ক্যাটাগরি)
              </h3>
              {evaluated && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-teal-500 font-semibold hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {VERIFIED_ADMISSION_PROGRAMS.map((rule) => {
                const ssc = parseFloat(sscGpa) || 0;
                const hsc = parseFloat(hscGpa) || 0;
                const combined = ssc + hsc;
                const bio = parseFloat(bioGpa) || 0;
                const math = parseFloat(mathGpa) || 0;

                let isEligible = true;
                const failureReasons: string[] = [];

                if (!rule.eligibility.acceptedStreams.includes(stream)) {
                  isEligible = false;
                  failureReasons.push('এই ইউনিটে আপনার শিক্ষা শাখা গ্রহণযোগ্য নয়।');
                }
                if (isSecondTimer && !rule.eligibility.allowsSecondTime) {
                  isEligible = false;
                  failureReasons.push('এই প্রতিষ্ঠানে ২য় বার পরীক্ষার সুযোগ নেই।');
                }
                if (ssc < rule.eligibility.minSscGpaGeneral) {
                  isEligible = false;
                  failureReasons.push(`এসএসসি জিপিএ ন্যূনতম ${toBengaliNumber(rule.eligibility.minSscGpaGeneral)} প্রয়োজন।`);
                }
                if (hsc < rule.eligibility.minHscGpaGeneral) {
                  isEligible = false;
                  failureReasons.push(`এইচএসসি জিপিএ ন্যূনতম ${toBengaliNumber(rule.eligibility.minHscGpaGeneral)} প্রয়োজন।`);
                }
                if (combined < rule.eligibility.minCombinedGpaGeneral) {
                  isEligible = false;
                  failureReasons.push(`মোট জিপিএ ন্যূনতম ${toBengaliNumber(rule.eligibility.minCombinedGpaGeneral)} প্রয়োজন।`);
                }
                if ((rule.id === 'dgme-mbbs' || rule.id === 'dgme-bds' || rule.id === 'afmc-mbbs') && stream === 'Science' && bio < 4.0) {
                  isEligible = false;
                  failureReasons.push('মেডিকেলের জন্য এইচএসসি জীববিজ্ঞানে ন্যূনতম জিপি ৪.০০ প্রয়োজন।');
                }
                if (rule.id === 'buet-engineering' && stream === 'Science' && math < 5.0) {
                  isEligible = false;
                  failureReasons.push('বুয়েটের জন্য উচ্চতর গণিতে জিপি ৫.০০ (A+) প্রয়োজন।');
                }

                return (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-xl border text-xs font-heading space-y-1.5 transition-colors ${
                      !evaluated
                        ? isDark
                          ? 'bg-white/5 border-white/5'
                          : 'bg-slate-50 border-slate-200'
                        : isEligible
                        ? isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-emerald-50 border-emerald-200'
                        : isDark
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-[#092C43]'}`}>
                          {rule.institution}
                        </span>
                        <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {rule.programName}
                        </span>
                      </div>

                      {evaluated ? (
                        isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[11px] shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>যোগ্য</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold text-[11px] shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>শর্ত অপূর্ণ</span>
                          </span>
                        )
                      ) : (
                        <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          যাচাই করুন
                        </span>
                      )}
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 text-[11px] pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span>
                        শর্ত: SSC {toBengaliNumber(rule.eligibility.minSscGpaGeneral)}, HSC{' '}
                        {toBengaliNumber(rule.eligibility.minHscGpaGeneral)}, মোট{' '}
                        {toBengaliNumber(rule.eligibility.minCombinedGpaGeneral)}
                      </span>
                      <a
                        href={rule.authority.circularUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 inline-flex items-center gap-0.5 font-semibold hover:underline"
                      >
                        <span>অফিসিয়াল ওয়েবসাইট</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {evaluated && !isEligible && (
                      <div className="text-rose-500 text-[11px] space-y-0.5 pt-1 border-t border-rose-500/20">
                        {failureReasons.map((r, i) => (
                          <p key={i}>• {r}</p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
