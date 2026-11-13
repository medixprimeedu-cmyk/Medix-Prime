import React from 'react';

interface MedixPrimeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'header' | 'ecosystem' | 'footer' | 'raw';
  showSubtitle?: boolean;
  showText?: boolean;
}

export const MedixPrimeLogo: React.FC<MedixPrimeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'header',
}) => {
  // Sizing for the new Medix Prime PNG logo
  const getHeightStyle = () => {
    switch (size) {
      case 'sm':
        return 'h-9 sm:h-11';
      case 'lg':
        return 'h-14 sm:h-18';
      case 'md':
      default:
        return 'h-11 sm:h-13';
    }
  };

  if (variant === 'ecosystem') {
    return (
      <div className={`inline-flex items-center bg-white/95 px-4 py-2 rounded-xl shadow-xs border border-white/40 ${className}`}>
        <img
          src="/assets/medix_prime_logo.png"
          alt="MEDIX PRIME Logo"
          className="h-10 sm:h-12 w-auto object-contain select-none"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/medix_prime_logo.png"
        alt="MEDIX PRIME Logo"
        className={`${getHeightStyle()} w-auto object-contain select-none drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
