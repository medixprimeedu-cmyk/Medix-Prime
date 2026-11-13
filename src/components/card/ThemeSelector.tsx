import React from 'react';
import { CardThemeId, CARD_THEMES } from '../../types/cardTypes';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  activeTheme: CardThemeId;
  onThemeSelect: (themeId: CardThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  activeTheme,
  onThemeSelect,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-heading font-bold text-[#172B3A] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#2B1055]" />
          <span>কার্ডের ডিজাইন বেছে নাও (১১টি Gen Z থিম)</span>
        </label>
        <span className="text-[9px] text-[#2B1055] font-latin font-bold bg-[#EDE4F9] px-2 py-0.5 rounded-full">
          11 THEMES
        </span>
      </div>

      {/* Horizontal Scrollable Thumbnails / Responsive Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-gray-300">
        {CARD_THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeSelect(theme.id)}
              className={`flex-shrink-0 w-24 p-1.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'border-[#2B1055] bg-white ring-2 ring-[#2B1055] shadow-sm scale-[1.02]'
                  : 'border-gray-200 bg-[#FAF8F4] hover:bg-white hover:border-[#2B1055]/40 hover:shadow-2xs'
              }`}
            >
              {/* Mini visual mockup card representation */}
              <div
                className="w-full aspect-[9/16] rounded-lg overflow-hidden relative border flex flex-col justify-between p-1 shadow-2xs"
                style={{
                  backgroundColor: theme.bgHex,
                  borderColor: theme.accentColor,
                }}
              >
                {/* Mini Header */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-2.5 h-1 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="text-[7px]">{theme.icon}</span>
                </div>

                {/* Mini Circle (Photo or avatar representation) */}
                <div className="flex justify-center my-auto">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{
                      borderColor: theme.accentColor,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>

                {/* Mini Rows */}
                <div className="space-y-0.5 w-full">
                  <div
                    className="h-1 rounded-xs w-full opacity-60"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <div
                    className="h-1 rounded-xs w-3/4 opacity-40"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>

                {/* Checkmark indicator for selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#2B1055]/30 backdrop-blur-[0.5px] flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#CCFF00] text-[#2B1055] flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Name */}
              <div className="mt-1.5 text-center">
                <p
                  className={`text-[10px] font-heading font-bold truncate leading-tight ${
                    isSelected ? 'text-[#2B1055]' : 'text-gray-700'
                  }`}
                >
                  {theme.nameBn}
                </p>
                <p className="text-[8px] font-latin text-gray-400 truncate">
                  {theme.nameEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
