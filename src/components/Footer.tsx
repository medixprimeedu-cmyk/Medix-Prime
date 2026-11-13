import React from 'react';
import { ArrowUp } from 'lucide-react';
import { MedixPrimeLogo } from './MedixPrimeLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MedixPrimeLogo size="sm" />
            <span className="text-xs text-[#617381] font-body">
              © ২০২৬ <strong className="font-latin text-[#172B3A]">MEDIX PRIME</strong> • সর্বস্বত্ব সংরক্ষিত
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-[#172B3A] hover:text-[#006B98] transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200"
            >
              <span>উপরে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
