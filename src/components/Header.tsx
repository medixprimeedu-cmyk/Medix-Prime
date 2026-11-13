import React from 'react';
import { MedixPrimeLogo } from './MedixPrimeLogo';
import { FeedbackHeaderButton } from './FeedbackHeaderButton';
import { ShareMenuButton } from './ShareMenuButton';
import { ThemeToggleButton } from './ThemeToggleButton';
import { Link, useRouter } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPath !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#060D17]/95 border-[#172740]'
          : 'bg-[#FFFFFF]/95 border-[#E2E8F0]'
      }`}
    >
      <div className="w-full px-2.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Left: Medix Prime Logo */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center shrink-0 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2B1055] rounded-lg p-0.5 transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Medix Prime Home"
        >
          <MedixPrimeLogo size="md" />
        </a>

        {/* Right: Small Links ('আমাদের সম্পর্কে', 'গোপনীয়তা নীতি'), Feedback, Share, and Theme Toggle Switch */}
        <div className="flex items-center gap-1 sm:gap-2.5 pr-0.5 sm:pr-2">
          <Link
            href="/about"
            className={`text-[10.5px] sm:text-xs font-heading font-medium px-1.5 sm:px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/about'
                ? isDark
                  ? 'text-[#00D2FF] font-semibold bg-white/5'
                  : 'text-[#006B98] font-semibold bg-sky-50'
                : isDark
                ? 'text-gray-300 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            আমাদের সম্পর্কে
          </Link>

          <Link
            href="/privacy"
            className={`text-[10.5px] sm:text-xs font-heading font-medium px-1.5 sm:px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentPath === '/privacy'
                ? isDark
                  ? 'text-[#00D2FF] font-semibold bg-white/5'
                  : 'text-[#006B98] font-semibold bg-sky-50'
                : isDark
                ? 'text-gray-300 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            গোপনীয়তা নীতি
          </Link>

          <FeedbackHeaderButton />

          <ShareMenuButton />

          {/* Theme Toggle Switch (Light / Dark) */}
          <div className="shrink-0">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
};

