import React from 'react';
import { Target, Compass, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '../../hooks/useRouter';

export const AdmissionToolsSection: React.FC = () => {
  const tools = [
    {
      id: 'gpa-target',
      href: '/tools/gpa-target',
      title: 'আমার GPA, আমার টার্গেট',
      description: 'টার্গেট স্কোর পেতে ভর্তি পরীক্ষায় কত প্রয়োজন?',
      badge: 'টার্গেট ক্যালকুলেটর',
      icon: Target,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      accentColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
      badgeColor: 'bg-emerald-100/70 text-emerald-800',
    },
    {
      id: 'admission-eligibility',
      href: '/tools/admission-eligibility',
      title: 'কোথায় আবেদন করতে পারব?',
      description: 'অফিসিয়াল শর্ত অনুযায়ী আবেদনের যোগ্যতা যাচাই করো।',
      badge: 'যোগ্যতা নির্ণায়ক',
      icon: Compass,
      iconBg: 'bg-sky-50 text-[#006B98] border border-sky-200/60',
      accentColor: 'hover:border-[#006B98]/50 hover:shadow-sky-500/5',
      badgeColor: 'bg-sky-100/70 text-[#006B98]',
    },
    {
      id: 'admission-score',
      href: '/tools/admission-score',
      title: 'ভর্তি স্কোর ও নেগেティブ মার্ক',
      description: 'সঠিক-ভুল উত্তর থেকে নেট নম্বর ও মোট ভর্তি স্কোর।',
      badge: 'স্কোর প্রসেসর',
      icon: Calculator,
      iconBg: 'bg-purple-50 text-[#2B1055] border border-purple-200/60',
      accentColor: 'hover:border-[#2B1055]/50 hover:shadow-purple-500/5',
      badgeColor: 'bg-purple-100/70 text-[#2B1055]',
    },
  ];

  return (
    <section id="admission-tools-section" className="py-12 sm:py-16 bg-[#FAF8F4] border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006B98]/10 border border-[#006B98]/20 text-[#006B98] text-xs font-heading font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অফিসিয়াল ভর্তি সহায়িকা</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#172B3A] tracking-tight">
            ভর্তি প্রস্তুতির প্রয়োজনীয় টুলস
          </h2>

          <p className="font-body text-sm sm:text-base text-[#617381]">
            তোমার তথ্য দিয়ে হিসাব করো, আবেদনের যোগ্যতা যাচাই করো।
          </p>
        </div>

        {/* 3 Clickable Option Boxes: Desktop 3-in-a-row, Mobile stacked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] ${tool.accentColor} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between focus:outline-hidden focus:ring-2 focus:ring-[#006B98] focus:ring-offset-2`}
                aria-label={`${tool.title} — ${tool.description}`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#172B3A] group-hover:text-[#006B98] transition-colors leading-snug">
                      {tool.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-[#617381] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Trigger */}
                <div className="pt-5 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-heading font-semibold text-[#006B98]">
                  <span>টুল ব্যবহার করো</span>
                  <div className="w-7 h-7 rounded-full bg-[#006B98]/10 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-[#006B98] group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Verified Notice Footer */}
        <div className="mt-8 text-center text-xs text-[#617381] font-body">
          <p>
            * মেডিকেল (DGME), ঢাকা বিশ্ববিদ্যালয় (DU), বুয়েট (BUET), কৃষি গুচ্ছ ও GST সমন্বিত ২০২৬–২৭ সেশনের নতুন অফিসিয়াল সার্কুলার ও নিয়মানুযায়ী প্রস্তুতকৃত।
          </p>
        </div>

      </div>
    </section>
  );
};
