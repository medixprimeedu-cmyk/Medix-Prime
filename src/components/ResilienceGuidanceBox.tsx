import React from 'react';
import { HeartHandshake, Compass, RotateCcw, Lightbulb, MessageCircleHeart, ArrowRight } from 'lucide-react';

export const ResilienceGuidanceBox: React.FC = () => {
  const guidanceItems = [
    {
      icon: HeartHandshake,
      title: 'একটি গ্রেড তোমার মেধার একমাত্র পরিচয় নয়',
      description: 'HSC জীবনের অসংখ্য পরীক্ষার একটি ধাপ মাত্র। ইতিহাস সাক্ষী—অগণিত সফল মানুষের যাত্রা শুরু হয়েছিল কোনো এক পরীক্ষায় হোঁচট খাওয়ার পর।',
      accentColor: 'text-[#006B98] bg-[#006B98]/10',
    },
    {
      icon: RotateCcw,
      title: 'বোর্ড চ্যালেঞ্জ বা খাতা পুনর্নিরীক্ষণের সুযোগ',
      description: 'যদি নিজের লেখার ওপর দৃঢ় আত্মবিশ্বাস থাকে, তবে শিক্ষা বোর্ডের নির্ধারিত নিয়মে টেলিটকের মাধ্যমে খাতা পুনর্নিরীক্ষণের (Board Challenge) আবেদন করতে পারো।',
      accentColor: 'text-[#B39724] bg-[#B39724]/10',
    },
    {
      icon: Compass,
      title: 'ভবিষ্যতের অজস্র বিকল্প পথ এখনও উন্মুক্ত',
      description: 'বিশ্ববিদ্যালয় ও মেডিকেল ছাড়াও স্কিলস, প্রযুক্তি, ডিপ্লোমা, আন্তর্জাতিক উচ্চশিক্ষা ও ফ্রিল্যান্সিংয়ে সাফল্যের অজস্র সম্ভাবনাময় দ্বার খোলা রয়েছে।',
      accentColor: 'text-[#006B98] bg-[#006B98]/10',
    },
    {
      icon: MessageCircleHeart,
      title: 'হতাশা চেপে না রেখে আপনজনের সাথে ভাগ করো',
      description: 'একাকী মন খারাপ না করে পরিবার, শিক্ষক বা বিশ্বস্ত বন্ধুদের সাথে কথা বলো। সাময়িক এই কষ্ট তোমাকে আরও পরিণত ও ধৈর্যশীল করে তুলবে।',
      accentColor: 'text-rose-600 bg-rose-50',
    },
    {
      icon: Lightbulb,
      title: 'নতুন লক্ষ্য নির্ধারণ ও ঘুরে দাঁড়ানোর অঙ্গীকার',
      description: 'ফলাফল যা-ই হোক, মূল লড়াই শুরু হয় এখান থেকেই। Medix Prime তোমার প্রতিটি ধাপে সঠিক ও গঠনমূলক দিকনির্দেশনা দিতে অঙ্গীকারবদ্ধ।',
      accentColor: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-4 pt-1">
      {/* Box Header Banner */}
      <div className="bg-gradient-to-r from-[#092C43] to-[#006B98] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-[#B39724] flex items-center justify-center shrink-0 border border-white/20 mt-0.5">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#B39724]/20 border border-[#B39724]/40 text-[#FAF8F4] text-[11px] font-heading font-medium">
              <span>বিশেষ অনুপ্রেরণা</span>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-white leading-tight">
              খারাপ বা আশানুরূপ ফল না হলে ভেঙে না পড়ার পরামর্শ
            </h3>
            <p className="font-body text-xs sm:text-sm text-gray-200 leading-relaxed">
              একটি পরীক্ষার ফলাফল কখনো তোমার জীবনের শেষ কথা বা মেধার চূড়ান্ত মানদণ্ড নয়।
            </p>
          </div>
        </div>
      </div>

      {/* Guidance Cards List */}
      <div className="space-y-2.5">
        {guidanceItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-xl p-3.5 sm:p-4 border border-[#E2E8F0] hover:border-[#006B98]/30 transition-all shadow-2xs group flex items-start gap-3"
            >
              <div className={`w-8 h-8 rounded-lg ${item.accentColor} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-heading text-sm font-bold text-[#172B3A] group-hover:text-[#006B98] transition-colors">
                  {item.title}
                </h4>
                <p className="font-body text-xs sm:text-[13px] text-[#617381] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
