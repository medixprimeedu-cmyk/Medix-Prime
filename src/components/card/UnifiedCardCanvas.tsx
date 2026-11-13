import React from 'react';
import { CardThemeId, JourneyCardData } from '../../types/cardTypes';

interface UnifiedCardCanvasProps {
  data: JourneyCardData;
  themeId: CardThemeId;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const UnifiedCardCanvas: React.FC<UnifiedCardCanvasProps> = ({
  data,
  themeId,
  canvasRef,
  className = '',
}) => {
  const hasPhoto = Boolean(data.photoUrl);
  const nameText = data.name.trim() || 'YOUR NAME';
  const nameLength = nameText.length;
  const nameFontSize = nameLength > 20 ? 36 : nameLength > 14 ? 44 : 54;

  const badge1 = data.badgeLine1.trim() || 'LAST NIGHT';
  const badge2 = data.badgeLine2.trim() || 'WARRIOR';

  // Render Theme Contents
  const renderThemeContent = () => {
    switch (themeId) {
      case 'midnight-neon':
        return renderMidnightNeon();
      case 'y2k-chrome':
        return renderY2KChrome();
      case 'scrapbook':
        return renderScrapbook();
      case 'wrapped':
        return renderWrapped();
      case 'pixel-quest':
        return renderPixelQuest();
      case 'manga':
        return renderManga();
      case 'pastel-cloud':
        return renderPastelCloud();
      case 'campus-id':
        return renderCampusID();
      case 'street-poster':
        return renderStreetPoster();
      case 'minimal-mono':
        return renderMinimalMono();
      case 'original':
      default:
        return renderOriginal();
    }
  };

  /* -------------------------------------------------------------
   * 1. ORIGINAL STORY THEME (1080 x 1920)
   * ------------------------------------------------------------- */
  const renderOriginal = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#FAF7F0',
          color: '#2B1055',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#2B1055 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Top Corner Illustrations */}
        <div className="absolute top-6 left-6 pointer-events-none w-44 h-44 z-10">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M22 28L4 70H48L28 28Z" fill="#CCFF00" fillOpacity="0.28" />
            <path d="M6 35C6 32 10 32 10 35H6Z" fill="#2B1055" />
            <path d="M8 32C8 20 18 10 24 18" stroke="#2B1055" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 16L32 24L26 28L14 20Z" fill="#3B185F" stroke="#2B1055" strokeWidth="1.5" />
            <path d="M26 28L32 24" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 14C12 12 16 16 14 22C10 20 6 18 6 14Z" fill="#84CC16" />
            <path d="M2 18C6 18 10 22 8 26C4 26 2 22 2 18Z" fill="#A3E635" />
          </svg>
        </div>

        <div className="absolute top-6 right-6 pointer-events-none w-44 h-44 z-10 flex justify-end">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M24 16L26 10L28 16L34 18L28 20L26 26L24 20L18 18Z" fill="#CCFF00" />
            <path d="M68 36L69 32L70 36L74 37L70 38L69 42L68 38L64 37Z" fill="#CCFF00" />
            <polygon points="50,8 74,18 50,28 26,18" fill="#2B1055" stroke="#3B185F" strokeWidth="1.5" />
            <path d="M38 23V31C38 35 62 35 62 31V23" fill="#1F0733" />
            <path d="M50 18C44 22 42 28 42 34" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" />
            <circle cx="42" cy="35" r="2.5" fill="#CCFF00" />
          </svg>
        </div>

        {/* Bottom Corner Illustrations */}
        <div className="absolute bottom-6 left-6 pointer-events-none w-44 h-44 z-10">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <polygon points="10,64 28,54 44,60 26,70" fill="#EDE4F9" stroke="#2B1055" strokeWidth="1.5" />
            <line x1="16" y1="62" x2="26" y2="57" stroke="#2B1055" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="32" y1="50" x2="48" y2="66" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="72" r="5" fill="#84CC16" />
          </svg>
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-none w-44 h-44 z-10">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <rect x="42" y="66" width="30" height="7" rx="1.5" fill="#3B185F" stroke="#2B1055" strokeWidth="1.5" />
            <rect x="45" y="58" width="28" height="7" rx="1.5" fill="#00D2FF" stroke="#2B1055" strokeWidth="1.5" />
            <rect x="48" y="50" width="24" height="7" rx="1.5" fill="#CCFF00" stroke="#2B1055" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute top-[28%] right-10 text-3xl text-[#CCFF00] font-black">✦</div>
        <div className="absolute top-[38%] left-10 text-4xl text-[#CCFF00] font-black">★</div>
        <div className="absolute bottom-[28%] left-12 text-3xl text-[#CCFF00] font-black">✦</div>
        <div className="absolute bottom-[38%] right-12 text-4xl text-[#CCFF00] font-black">★</div>

        {/* CONTENT */}
        <div className="relative z-20 flex flex-col h-full justify-between">
          
          {/* HEADER & NAME & OPTIONAL PHOTO */}
          <div className="text-center flex flex-col items-center">
            {/* Pill */}
            <div
              className="px-8 py-2 rounded-full text-xl font-black uppercase tracking-widest shadow-md inline-block mb-3"
              style={{
                backgroundColor: '#2B1055',
                color: '#CCFF00',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              HSC ’26
            </div>

            {/* Title */}
            <div className="relative inline-block my-1">
              <div
                className="absolute inset-x-[-24px] bottom-1 h-8 bg-[#CCFF00] -rotate-1 rounded-sm -z-10"
                style={{ clipPath: 'polygon(0% 15%, 100% 0%, 98% 85%, 2% 100%)' }}
              />
              <h1
                className="font-extrabold tracking-tight px-4 leading-none text-center"
                style={{
                  fontSize: '84px',
                  color: '#2B1055',
                  fontFamily: "'Atma', 'Anek Bangla', cursive",
                }}
              >
                আমার গল্প
              </h1>
            </div>

            <div
              className="text-lg font-black tracking-[0.3em] uppercase mt-1 mb-2"
              style={{
                color: 'rgba(43, 16, 85, 0.75)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              JOURNEY CARD
            </div>

            {/* Personalized Name */}
            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#CCFF00] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: data.name ? '#2B1055' : 'rgba(43, 16, 85, 0.4)',
                  fontFamily: "'Plus Jakarta Sans', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {/* OPTIONAL PHOTO IMMEDIATELY BELOW NAME */}
            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-full overflow-hidden border-[6px] border-[#2B1055] shadow-xl relative bg-white"
                  style={{ boxShadow: '0 12px 28px rgba(43, 16, 85, 0.3)' }}
                >
                  <img src={data.photoUrl} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#CCFF00] pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE: Two Line Illustrated Banner */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center border-4 border-[#CCFF00] shadow-xl text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              background: 'linear-gradient(135deg, #23083B 0%, #2E0B4D 50%, #1F0733 100%)',
              margin: '0 10px',
            }}
          >
            {/* Illustrated Crescent Moon */}
            <div className="absolute top-4 left-6 w-16 h-16 pointer-events-none">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M22 6C15 6 10 11 10 18C10 25 15 28 22 28C14 28 7 22 7 15C7 8 14 6 22 6Z" fill="#CCFF00" />
              </svg>
            </div>
            {/* Illustrated Clouds on Right */}
            <div className="absolute top-5 right-6 w-20 h-14 pointer-events-none">
              <svg viewBox="0 0 40 28" fill="none" className="w-full h-full">
                <path d="M12 20H32C35 20 37 17 37 14C37 11 34 9 31 9C30 5 26 3 22 3C18 3 14 5 13 8C10 8 7 11 7 14C7 17 9 20 12 20Z" fill="#EDE4F9" fillOpacity="0.3" />
                <circle cx="34" cy="4" r="2" fill="#CCFF00" />
              </svg>
            </div>

            <div className="relative z-10 space-y-1">
              <p
                className="font-extrabold tracking-widest text-white uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Plus Jakarta Sans', 'Anek Bangla', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#CCFF00] uppercase"
                style={{
                  fontSize: hasPhoto ? '46px' : '56px',
                  fontFamily: "'Plus Jakarta Sans', 'Anek Bangla', sans-serif",
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border-2 border-[#D7C4F7] shadow-sm"
                style={{
                  backgroundColor: '#EDE4F9',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#2B1055',
                      color: '#CCFF00',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#2B1055]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#2B1055] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-2xl border-4 border-[#2B1055] shadow-md px-6 mx-2"
            style={{
              backgroundColor: '#CCFF00',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#2B1055',
                color: '#CCFF00',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#2B1055] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', 'Anek Bangla', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-[#2B1055]"
              style={{
                fontSize: '34px',
                fontFamily: "'Atma', 'Anek Bangla', cursive",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border-2 border-[#D7C4F7]"
              style={{
                backgroundColor: '#EDE4F9',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#2B1055',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-[#2B1055]/60 uppercase pt-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 JOURNEY
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 2. MIDNIGHT NEON THEME (Cyberpunk / Synthwave Glow)
   * ------------------------------------------------------------- */
  const renderMidnightNeon = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#090B16',
          color: '#E0F2FE',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
        }}
      >
        {/* Glowing cyber grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top/bottom neon glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00F0FF]/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#FF007F]/15 blur-[140px] pointer-events-none rounded-full" />

        {/* Corner Neon Angle Accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#00F0FF] pointer-events-none" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#FF007F] pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#FF007F] pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#00F0FF] pointer-events-none" />

        <div className="relative z-20 flex flex-col h-full justify-between">
          
          {/* HEADER & NAME & OPTIONAL PHOTO */}
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-full text-xl font-black uppercase tracking-widest inline-block mb-3 border border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                color: '#00F0FF',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ⚡ HSC ’26 // CYBERPUNK
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#FFFFFF',
                textShadow: '0 0 25px rgba(0, 240, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.4)',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.35em] uppercase mt-1 mb-2 text-[#FF007F]"
              style={{
                textShadow: '0 0 15px rgba(255, 0, 127, 0.6)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              NEON CHRONICLES
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#00F0FF] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: data.name ? '#00F0FF' : 'rgba(0, 240, 255, 0.4)',
                  textShadow: data.name ? '0 0 20px rgba(0, 240, 255, 0.6)' : 'none',
                  fontFamily: "'Space Grotesk', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.5)] relative bg-[#0B0D1B]"
                >
                  <img src={data.photoUrl} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#FF007F] pointer-events-none opacity-60" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-[#FF007F] shadow-[0_0_35px_rgba(255,0,127,0.35)] text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              background: 'linear-gradient(135deg, rgba(255,0,127,0.15) 0%, rgba(9,11,22,0.9) 60%, rgba(0,240,255,0.15) 100%)',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#00F0FF] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: '0 0 10px rgba(0,240,255,0.6)',
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.15em] text-[#FFE600] uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: '0 0 25px rgba(255, 230, 0, 0.7)',
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold shrink-0 border border-[#00F0FF]/60"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: 'rgba(0, 240, 255, 0.15)',
                      color: '#00F0FF',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#E2E8F0]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#00F0FF] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                    textShadow: '0 0 10px rgba(0,240,255,0.4)',
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-2xl border-2 border-[#FF007F] shadow-[0_0_25px_rgba(255,0,127,0.4)] px-6 mx-2"
            style={{
              backgroundColor: 'rgba(255, 0, 127, 0.15)',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0 border border-[#FF007F]"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#FF007F',
                color: '#FFFFFF',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-white truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
                textShadow: '0 0 15px rgba(0,240,255,0.6)',
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-[#00F0FF]"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#00F0FF',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black text-[#FF007F]">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.3em] text-[#64748B] uppercase pt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 PROTOCOL
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 3. Y2K CHROME THEME (Metallic Silver, Holographic Accents)
   * ------------------------------------------------------------- */
  const renderY2KChrome = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 20%, #1E293B 0%, #0F172A 70%, #020617 100%)',
          color: '#F8FAFC',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Holographic Starbursts */}
        <div className="absolute top-12 left-12 text-6xl text-[#38BDF8]/60 font-black">✦</div>
        <div className="absolute top-20 right-14 text-7xl text-[#F472B6]/60 font-black">✧</div>
        <div className="absolute bottom-24 left-10 text-7xl text-[#F472B6]/60 font-black">✧</div>
        <div className="absolute bottom-20 right-12 text-6xl text-[#38BDF8]/60 font-black">✦</div>

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-full text-xl font-black uppercase tracking-widest inline-block mb-3 border-2 border-[#CBD5E1] shadow-lg"
              style={{
                background: 'linear-gradient(90deg, #E2E8F0, #94A3B8, #E2E8F0)',
                color: '#0F172A',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              💿 Y2K CYBER EDITION • 2026
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 50%, #64748B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.35em] uppercase mt-1 mb-2 text-[#38BDF8]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              VIRTUAL MEMORY CARD
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#38BDF8] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-[#E2E8F0] shadow-2xl relative bg-[#1E293B]"
                  style={{ boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)' }}
                >
                  <img src={data.photoUrl} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-2 border-[#38BDF8]/60 rounded-3xl pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center border-3 border-[#CBD5E1] shadow-2xl text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(30,41,59,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#E2E8F0] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  background: 'linear-gradient(90deg, #38BDF8, #F472B6, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/20 shadow-lg"
                style={{
                  background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold shrink-0 border border-white/30"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
                      color: '#0F172A',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#E2E8F0]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#38BDF8] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-2xl border-2 border-[#CBD5E1] shadow-xl px-6 mx-2"
            style={{
              background: 'linear-gradient(90deg, #E2E8F0, #CBD5E1)',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#0F172A',
                color: '#38BDF8',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#0F172A] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-white/30"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#38BDF8',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black text-[#F472B6]">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.3em] text-[#94A3B8] uppercase pt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 CHROME
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 4. SCRAPBOOK MEMORIES THEME (Washi Tape, Polaroid, Vintage)
   * ------------------------------------------------------------- */
  const renderScrapbook = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#F6EFE9',
          color: '#38281E',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Paper texture dot lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(#8C6B53 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Decorative Washi Tapes at corners */}
        <div
          className="absolute -top-3 left-16 w-36 h-10 bg-[#FBBF24]/80 -rotate-6 shadow-xs border-y border-[#D97706]/30 pointer-events-none z-10"
          style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}
        />
        <div
          className="absolute -top-3 right-16 w-36 h-10 bg-[#6EE7B7]/80 rotate-6 shadow-xs border-y border-[#059669]/30 pointer-events-none z-10"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)' }}
        />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-lg text-xl font-black uppercase tracking-widest inline-block mb-3 border-2 border-[#8C6B53] shadow-xs"
              style={{
                backgroundColor: '#FFFBEB',
                color: '#78350F',
                fontFamily: "'Atma', cursive",
              }}
            >
              📎 স্মৃতি খাতা • HSC ’26
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#38281E',
                fontFamily: "'Atma', cursive",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-bold tracking-[0.25em] uppercase mt-1 mb-2 text-[#92400E]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              SCRAPBOOK EDITION
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-dashed border-[#B45309] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#38281E',
                  fontFamily: "'Atma', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="p-3 pb-8 bg-white rounded-md shadow-xl border border-gray-300 relative -rotate-2"
                  style={{ width: '220px' }}
                >
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FCA5A5]/80 shadow-xs pointer-events-none"
                    style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}
                  />
                  <div className="w-full aspect-square overflow-hidden bg-gray-100">
                    <img src={data.photoUrl} alt="Polaroid" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center border-3 border-[#92400E] shadow-md text-center"
            style={{
              padding: hasPhoto ? '20px 28px' : '32px 36px',
              backgroundColor: '#FEF3C7',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#92400E] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Atma', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.1em] text-[#78350F] uppercase"
                style={{
                  fontSize: hasPhoto ? '46px' : '56px',
                  fontFamily: "'Atma', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-[#D6C7B8] shadow-xs"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-lg flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#FEF3C7',
                      color: '#78350F',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#38281E]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#78350F] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-xl border-2 border-[#B45309] shadow-md px-6 mx-2"
            style={{
              backgroundColor: '#FDE68A',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-lg flex items-center justify-center shrink-0"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#78350F',
                color: '#FEF3C7',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#78350F] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-[#38281E]"
              style={{
                fontSize: '34px',
                fontFamily: "'Atma', cursive",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-[#D6C7B8]"
              style={{
                backgroundColor: '#FFFFFF',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#78350F',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-bold tracking-[0.25em] text-[#8C6B53] uppercase pt-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 MEMORIES
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 5. SPOTIFY WRAPPED THEME (Bold High Contrast, Audio Wave)
   * ------------------------------------------------------------- */
  const renderWrapped = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#121212',
          color: '#FFFFFF',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Dynamic geometric angled background blocks */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40 blur-[120px]"
          style={{ backgroundColor: '#1DB954' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[130px]"
          style={{ backgroundColor: '#8B5CF6' }}
        />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            {/* Spotify Pill */}
            <div
              className="px-8 py-2 rounded-full text-xl font-black uppercase tracking-widest inline-block mb-3"
              style={{
                backgroundColor: '#1DB954',
                color: '#000000',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ● HSC ’26 WRAPPED
            </div>

            <h1
              className="font-black tracking-tighter px-4 leading-none text-center"
              style={{
                fontSize: '88px',
                color: '#1DB954',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.3em] uppercase mt-1 mb-2 text-[#A7F3D0]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              TOP STUDENT STATS
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#1DB954] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FFFFFF',
                  fontFamily: "'Plus Jakarta Sans', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#1DB954] shadow-[0_10px_30px_rgba(29,185,84,0.4)] relative bg-[#282828]"
                >
                  <img src={data.photoUrl} alt="Album Art" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE: Top Genre / Title Box */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-xl text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#1E1E1E',
              border: '3px solid #1DB954',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#A7F3D0] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#1DB954] uppercase"
                style={{
                  fontSize: hasPhoto ? '50px' : '60px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS: Track List Feel */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl shadow-sm border border-white/10"
                style={{
                  backgroundColor: '#242424',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#1DB954',
                      color: '#000000',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-white"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#1DB954] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP: Track Progress */}
          <div
            className="flex items-center gap-5 rounded-2xl shadow-md px-6 mx-2"
            style={{
              backgroundColor: '#1DB954',
              color: '#000000',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#000000',
                color: '#1DB954',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#000000] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-[#1DB954]"
              style={{
                backgroundColor: '#1E1E1E',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#1DB954',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-[#6B7280] uppercase pt-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 WRAPPED
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 6. PIXEL QUEST THEME (Retro 8-bit RPG Game Card)
   * ------------------------------------------------------------- */
  const renderPixelQuest = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#14142B',
          color: '#F8FAFC',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Pixel grid styling */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4C1D95 1px, transparent 1px),
              linear-gradient(to bottom, #4C1D95 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-6 py-2 rounded-none text-xl font-black uppercase tracking-widest inline-block mb-3 border-4 border-[#FACC15] shadow-md"
              style={{
                backgroundColor: '#1E1B4B',
                color: '#FACC15',
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              👾 LVL 26 QUEST CARD
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#FACC15',
                fontFamily: "'Anek Bangla', sans-serif",
                textShadow: '4px 4px 0px #78350F',
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.3em] uppercase mt-1 mb-2 text-[#38BDF8]"
              style={{ fontFamily: "'Space Grotesk', monospace" }}
            >
              HP: 100/100 • MANA: 100/100
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#FACC15] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-none overflow-hidden border-4 border-[#FACC15] shadow-2xl relative bg-[#1E1B4B]"
                  style={{ boxShadow: '6px 6px 0px #000000' }}
                >
                  <img src={data.photoUrl} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE: RPG Title Plate */}
          <div
            className="relative rounded-none overflow-hidden flex flex-col items-center justify-center border-4 border-[#FACC15] text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#1E1B4B',
              boxShadow: '6px 6px 0px #000000',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#38BDF8] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#FACC15] uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  fontFamily: "'Space Grotesk', monospace",
                  textShadow: '3px 3px 0px #78350F',
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS: Game Stats */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-none border-2 border-[#4338CA]"
                style={{
                  backgroundColor: '#1F1B4E',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-none flex items-center justify-center font-bold shrink-0 border border-[#FACC15]"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#14142B',
                      color: '#FACC15',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#E0E7FF]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#FACC15] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-none border-3 border-[#FACC15] px-6 mx-2"
            style={{
              backgroundColor: '#FACC15',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
              boxShadow: '4px 4px 0px #000000',
            }}
          >
            <div
              className="rounded-none flex items-center justify-center shrink-0 border border-black"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#000000',
                color: '#FACC15',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#000000] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-none border-2 border-[#FACC15]"
              style={{
                backgroundColor: '#1E1B4B',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#FACC15',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-[#818CF8] uppercase pt-1"
              style={{ fontFamily: "'Space Grotesk', monospace" }}
            >
              MEDIX PRIME • HSC ’26 QUEST
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 7. MANGA STUDY ARC THEME (Speed Lines, Comic Halftone, Ink)
   * ------------------------------------------------------------- */
  const renderManga = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#0A0A0A',
          color: '#FFFFFF',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Manga Halftone / Screentone Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#FFFFFF 2px, transparent 2px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Speed lines from borders */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-none text-xl font-black uppercase tracking-widest inline-block mb-3 border-4 border-white shadow-xl"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              💥 MANGA CHAPTER: HSC ’26
            </div>

            <h1
              className="font-black tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '88px',
                color: '#FFFFFF',
                textShadow: '5px 5px 0px #333333',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.35em] uppercase mt-1 mb-2 text-[#E5E5E5]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              THE FINAL EXAM ARC
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-white inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FFFFFF',
                  fontFamily: "'Syne', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-none overflow-hidden border-4 border-white shadow-2xl relative bg-white"
                  style={{ filter: 'grayscale(100%) contrast(120%)' }}
                >
                  <img src={data.photoUrl} alt="Manga Character" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE: Action Speech Bubble */}
          <div
            className="relative rounded-none overflow-hidden flex flex-col items-center justify-center border-4 border-white text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#171717',
              margin: '0 10px',
              boxShadow: '6px 6px 0px #FFFFFF',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#A3A3A3] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-white uppercase"
                style={{
                  fontSize: hasPhoto ? '50px' : '60px',
                  fontFamily: "'Syne', sans-serif",
                  textShadow: '3px 3px 0px #000000',
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS: Comic Panels */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-none border-2 border-white/80"
                style={{
                  backgroundColor: '#121212',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                  boxShadow: '4px 4px 0px #FFFFFF',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-none flex items-center justify-center font-bold shrink-0 border border-white"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-white"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-white text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-none border-4 border-white px-6 mx-2"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
              boxShadow: '4px 4px 0px #737373',
            }}
          >
            <div
              className="rounded-none flex items-center justify-center shrink-0 border border-black"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#000000] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-none border-2 border-white"
              style={{
                backgroundColor: '#000000',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-[#737373] uppercase pt-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 ARC
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 8. PASTEL CLOUD THEME (Dreamy Lavender, Mint, Soft Stickers)
   * ------------------------------------------------------------- */
  const renderPastelCloud = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FAF5FF 0%, #F5F3FF 50%, #EDE9FE 100%)',
          color: '#4C1D95',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Soft dreamy pastel circles */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#E0E7FF]/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#FCE7F3]/60 blur-3xl pointer-events-none" />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-full text-xl font-bold uppercase tracking-widest inline-block mb-3 border-2 border-[#DDD6FE] shadow-sm"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#6D28D9',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ☁️ PASTEL CLOUD • HSC ’26
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#5B21B6',
                fontFamily: "'Atma', cursive",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-bold tracking-[0.25em] uppercase mt-1 mb-2 text-[#7C3AED]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              SWEET MEMORIES
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#C084FC] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#4C1D95',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-full overflow-hidden border-6 border-white shadow-xl relative bg-white"
                  style={{ boxShadow: '0 12px 30px rgba(124, 58, 237, 0.2)' }}
                >
                  <img src={data.photoUrl} alt="Pastel portrait" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-[#DDD6FE] shadow-md text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#FFFFFF',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#7C3AED] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#5B21B6] uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-[#EDE9FE] shadow-xs"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#F3E8FF',
                      color: '#7C3AED',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#4C1D95]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#6D28D9] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-2xl border-2 border-[#C084FC] shadow-sm px-6 mx-2"
            style={{
              backgroundColor: '#F3E8FF',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center shrink-0"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#5B21B6] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-[#4C1D95]"
              style={{
                fontSize: '34px',
                fontFamily: "'Atma', cursive",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-[#DDD6FE]"
              style={{
                backgroundColor: '#FFFFFF',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#6D28D9',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black text-[#C084FC]">➔</span>
            </div>

            <div
              className="text-lg font-bold tracking-[0.25em] text-[#8B5CF6] uppercase pt-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 DREAM
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 9. CAMPUS ID THEME (Official Student Accreditation Pass)
   * ------------------------------------------------------------- */
  const renderCampusID = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Top lanyard clip punch hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full border-2 border-gray-600 shadow-inner z-30" />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center pt-4">
            <div
              className="px-8 py-2 rounded-lg text-xl font-black uppercase tracking-widest inline-block mb-3 border border-[#3B82F6]"
              style={{
                backgroundColor: '#1E3A8A',
                color: '#60A5FA',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              🪪 STUDENT IDENTITY CARD
            </div>

            <h1
              className="font-extrabold tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#FFFFFF',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.3em] uppercase mt-1 mb-2 text-[#60A5FA]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ID: HSC26-BD-88942
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#3B82F6] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-xl overflow-hidden border-4 border-[#3B82F6] shadow-2xl relative bg-[#1E293B]"
                >
                  <img src={data.photoUrl} alt="ID Photo" className="w-full h-full object-cover" />
                  {/* Holographic Security Overlay */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-blue-600/90 text-[10px] text-white font-mono rounded">
                    VERIFIED
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-[#3B82F6] shadow-lg text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#1E293B',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#93C5FD] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#38BDF8] uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-gray-700 shadow-sm"
                style={{
                  backgroundColor: '#1E293B',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-lg flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#E2E8F0]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#60A5FA] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-xl border-2 border-[#3B82F6] shadow-md px-6 mx-2"
            style={{
              backgroundColor: '#1D4ED8',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-lg flex items-center justify-center shrink-0 bg-white text-blue-800"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-white truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-white"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-full border border-[#3B82F6]"
              style={{
                backgroundColor: '#1E293B',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#60A5FA',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            {/* Faux Barcode Line */}
            <div className="flex justify-center items-center gap-1.5 opacity-60 pt-1">
              {[8, 3, 6, 2, 8, 4, 2, 7, 3, 5, 2, 8, 3, 6, 4, 9, 2, 6].map((w, idx) => (
                <div key={idx} className="bg-white h-7" style={{ width: `${w * 2}px` }} />
              ))}
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-gray-500 uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MEDIX PRIME • OFFICIAL CANDIDATE
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 10. STREET POSTER THEME (Risograph, Industrial Orange, Tape)
   * ------------------------------------------------------------- */
  const renderStreetPoster = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#181716',
          color: '#FAF5EE',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Distressed xerox texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px)',
          }}
        />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-none text-xl font-black uppercase tracking-widest inline-block mb-3 border-2 border-[#FF4D00]"
              style={{
                backgroundColor: '#FF4D00',
                color: '#000000',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              🛹 STREET POSTER // HSC ’26
            </div>

            <h1
              className="font-black tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '88px',
                color: '#FAF5EE',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-black tracking-[0.35em] uppercase mt-1 mb-2 text-[#FF4D00]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              RAW & UNFILTERED
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-4 border-[#FF4D00] inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#FAF5EE',
                  fontFamily: "'Syne', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-none overflow-hidden border-4 border-[#FF4D00] shadow-2xl relative bg-[#262423] rotate-1"
                >
                  <img src={data.photoUrl} alt="Street photo" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-none overflow-hidden flex flex-col items-center justify-center border-4 border-[#FAF5EE] shadow-2xl text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#262423',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-extrabold tracking-widest text-[#FF4D00] uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-[#FAF5EE] uppercase"
                style={{
                  fontSize: hasPhoto ? '50px' : '60px',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-none border border-[#FAF5EE]/30"
                style={{
                  backgroundColor: '#262423',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-none flex items-center justify-center font-bold shrink-0"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#FF4D00',
                      color: '#000000',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-[#FAF5EE]"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-extrabold text-[#FF4D00] text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-none border-3 border-[#FAF5EE] px-6 mx-2"
            style={{
              backgroundColor: '#FF4D00',
              color: '#000000',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-none flex items-center justify-center shrink-0 bg-black text-white"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-black text-[#000000] truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-[#FAF5EE]"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-none border border-[#FF4D00]"
              style={{
                backgroundColor: '#262423',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#FF4D00',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-black tracking-[0.25em] text-[#78716C] uppercase pt-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 STREET
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 11. MINIMAL MONO THEME (Swiss Grid, Brutalist Monochrome)
   * ------------------------------------------------------------- */
  const renderMinimalMono = () => {
    return (
      <div
        className="w-full h-full relative flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          padding: '70px 65px 60px 65px',
          fontFamily: "'Hind Siliguri', sans-serif",
        }}
      >
        {/* Subtle 1px crisp grid border */}
        <div className="absolute inset-8 border-2 border-black pointer-events-none" />

        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="text-center flex flex-col items-center">
            <div
              className="px-8 py-2 rounded-none text-xl font-bold uppercase tracking-widest inline-block mb-3 border-2 border-black"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              EDITION 2026 // HSC
            </div>

            <h1
              className="font-black tracking-tight px-4 leading-none text-center"
              style={{
                fontSize: '84px',
                color: '#000000',
                fontFamily: "'Anek Bangla', sans-serif",
              }}
            >
              আমার গল্প
            </h1>

            <div
              className="text-lg font-medium tracking-[0.35em] uppercase mt-1 mb-2 text-gray-500"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MINIMAL ARCHIVE
            </div>

            <div className="min-h-[70px] flex items-center justify-center">
              <span
                className="font-black uppercase tracking-wider px-6 py-1 border-b-2 border-black inline-block"
                style={{
                  fontSize: `${nameFontSize}px`,
                  color: '#000000',
                  fontFamily: "'Space Grotesk', 'Anek Bangla', sans-serif",
                }}
              >
                {nameText}
              </span>
            </div>

            {hasPhoto && (
              <div className="mt-3 mb-1 flex justify-center">
                <div
                  className="w-48 h-48 rounded-none overflow-hidden border-2 border-black shadow-sm relative bg-gray-100"
                  style={{ filter: 'grayscale(100%)' }}
                >
                  <img src={data.photoUrl} alt="Mono portrait" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* BADGE */}
          <div
            className="relative rounded-none overflow-hidden flex flex-col items-center justify-center border-2 border-black text-center"
            style={{
              padding: hasPhoto ? '24px 30px' : '36px 40px',
              backgroundColor: '#FFFFFF',
              margin: '0 10px',
            }}
          >
            <div className="space-y-1">
              <p
                className="font-bold tracking-widest text-gray-600 uppercase"
                style={{
                  fontSize: hasPhoto ? '26px' : '30px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge1}
              </p>
              <p
                className="font-black tracking-[0.12em] text-black uppercase"
                style={{
                  fontSize: hasPhoto ? '48px' : '58px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {badge2}
              </p>
            </div>
          </div>

          {/* FOUR INFO ROWS */}
          <div className="flex flex-col gap-3.5 px-2">
            {[
              { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
              { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
              { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
              { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-none border border-black"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: hasPhoto ? '16px 28px' : '22px 32px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-none flex items-center justify-center font-bold shrink-0 border border-black"
                    style={{
                      width: hasPhoto ? '52px' : '60px',
                      height: hasPhoto ? '52px' : '60px',
                      backgroundColor: '#F4F4F5',
                      color: '#000000',
                      fontSize: hasPhoto ? '26px' : '30px',
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    className="font-bold text-black"
                    style={{
                      fontSize: hasPhoto ? '28px' : '32px',
                      fontFamily: "'Hind Siliguri', sans-serif",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-bold text-black text-right truncate max-w-[55%]"
                  style={{
                    fontSize: hasPhoto ? '28px' : '32px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENT STRIP */}
          <div
            className="flex items-center gap-5 rounded-none border-2 border-black px-6 mx-2"
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: hasPhoto ? '18px 28px' : '24px 32px',
            }}
          >
            <div
              className="rounded-none flex items-center justify-center shrink-0 bg-white text-black"
              style={{
                width: hasPhoto ? '58px' : '66px',
                height: hasPhoto ? '58px' : '66px',
                fontSize: hasPhoto ? '30px' : '36px',
              }}
            >
              🏆
            </div>
            <div
              className="font-bold text-white truncate flex-1"
              style={{
                fontSize: hasPhoto ? '30px' : '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              অর্জন: {data.achievement}
            </div>
          </div>

          {/* FOOTER & QUOTE */}
          <div className="text-center space-y-3 pt-2">
            <p
              className="font-bold text-black"
              style={{
                fontSize: '34px',
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              “GPA একটা সংখ্যা, গল্পটা দুই বছরের।”
            </p>

            <div
              className="inline-flex items-center gap-3 px-8 py-2 rounded-none border border-black"
              style={{
                backgroundColor: '#FFFFFF',
                fontSize: '26px',
                fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 800,
                color: '#000000',
              }}
            >
              <span>এবার তোর গল্পটা কী?</span>
              <span className="font-black">➔</span>
            </div>

            <div
              className="text-lg font-bold tracking-[0.25em] text-gray-500 uppercase pt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              MEDIX PRIME • HSC ’26 MONO
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      id="canonical-journey-card-canvas"
      className={`relative select-none ${className}`}
      style={{
        width: '1080px',
        height: '1920px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        // Critical for crisp non-shifting font rendering in html-to-image
        fontFeatureSettings: '"kern" 1, "liga" 1',
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {renderThemeContent()}
    </div>
  );
};
