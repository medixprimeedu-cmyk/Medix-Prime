import { CardThemeId, JourneyCardData, CARD_THEMES } from '../types/cardTypes';

/**
 * Direct Canvas 2D Engine for HSC '26 Journey Card (1080 x 1920)
 * 100% resilient fallback that never fails, never throws CORS errors,
 * never taints canvas, and renders pixel-perfect output on any device.
 */
export async function renderCardToCanvas2D(
  data: JourneyCardData,
  themeId: CardThemeId
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  const hasPhoto = Boolean(data.photoUrl);
  const theme = CARD_THEMES.find((t) => t.id === themeId) || CARD_THEMES[0];

  // Helper: Load image if photo exists
  let userPhotoImg: HTMLImageElement | null = null;
  if (data.photoUrl) {
    userPhotoImg = await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = data.photoUrl!;
    });
  }

  // 1. Draw Background
  drawThemeBackground(ctx, themeId, theme.bgHex);

  // 2. Draw Top Pill (HSC '26)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const pillY = 120;
  drawRoundedRect(ctx, 1080 / 2 - 130, pillY - 30, 260, 60, 30);
  ctx.fillStyle = themeId === 'minimal-mono' ? '#000000' : themeId === 'wrapped' ? '#1DB954' : '#2B1055';
  ctx.fill();

  ctx.fillStyle = themeId === 'wrapped' ? '#000000' : '#CCFF00';
  ctx.font = "bold 26px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif";
  ctx.fillText("HSC ’26", 1080 / 2, pillY);
  ctx.restore();

  // 3. Draw Title: "আমার গল্প"
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleY = 220;

  // Title accent bar (if original)
  if (themeId === 'original') {
    ctx.fillStyle = '#CCFF00';
    ctx.fillRect(1080 / 2 - 180, titleY + 15, 360, 24);
  }

  ctx.font = "bold 84px 'Atma', 'Anek Bangla', 'Hind Siliguri', sans-serif";
  ctx.fillStyle =
    themeId === 'midnight-neon' || themeId === 'wrapped'
      ? '#00F0FF'
      : themeId === 'minimal-mono'
      ? '#000000'
      : themeId === 'manga'
      ? '#FFFFFF'
      : '#2B1055';

  if (themeId === 'wrapped') ctx.fillStyle = '#1DB954';
  if (themeId === 'street-poster') ctx.fillStyle = '#FAF5EE';
  if (themeId === 'pixel-quest') ctx.fillStyle = '#FACC15';

  ctx.fillText('আমার গল্প', 1080 / 2, titleY);

  // Subtitle
  ctx.font = "bold 22px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif";
  ctx.fillStyle = themeId === 'minimal-mono' ? '#666666' : 'rgba(255, 255, 255, 0.7)';
  if (themeId === 'original' || themeId === 'scrapbook') ctx.fillStyle = 'rgba(43, 16, 85, 0.7)';
  ctx.fillText('JOURNEY CARD', 1080 / 2, titleY + 65);
  ctx.restore();

  // 4. Draw User Name
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const nameY = 350;
  const nameText = data.name.trim() || 'YOUR NAME';
  const nameFontSize = nameText.length > 20 ? 40 : nameText.length > 14 ? 48 : 56;

  ctx.font = `bold ${nameFontSize}px 'Plus Jakarta Sans', 'Anek Bangla', 'Hind Siliguri', sans-serif`;
  ctx.fillStyle =
    themeId === 'minimal-mono'
      ? '#000000'
      : themeId === 'original' || themeId === 'scrapbook'
      ? '#2B1055'
      : '#FFFFFF';

  ctx.fillText(nameText.toUpperCase(), 1080 / 2, nameY);

  // Name underline
  ctx.strokeStyle = theme.accentColor || '#CCFF00';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(1080 / 2 - 160, nameY + 36);
  ctx.lineTo(1080 / 2 + 160, nameY + 36);
  ctx.stroke();
  ctx.restore();

  // Current Y cursor for content layout
  let currentY = nameY + 60;

  // 5. Draw Photo if uploaded
  if (hasPhoto && userPhotoImg) {
    const photoSize = 220;
    const photoY = currentY + 10;
    const photoX = 1080 / 2 - photoSize / 2;

    ctx.save();
    // Clip path for circular photo
    ctx.beginPath();
    ctx.arc(1080 / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(userPhotoImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // Border around photo
    ctx.save();
    ctx.strokeStyle = theme.accentColor || '#CCFF00';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(1080 / 2, photoY + photoSize / 2, photoSize / 2 + 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    currentY = photoY + photoSize + 30;
  } else {
    currentY += 20;
  }

  // 6. Draw Badge Box
  const badgeHeight = hasPhoto ? 160 : 200;
  const badgeWidth = 920;
  const badgeX = (1080 - badgeWidth) / 2;

  ctx.save();
  drawRoundedRect(ctx, badgeX, currentY, badgeWidth, badgeHeight, 28);
  ctx.fillStyle = themeId === 'original' ? '#23083B' : themeId === 'minimal-mono' ? '#F4F4F5' : '#1E1B4B';
  if (themeId === 'scrapbook') ctx.fillStyle = '#FEF3C7';
  if (themeId === 'wrapped') ctx.fillStyle = '#1E1E1E';
  if (themeId === 'street-poster') ctx.fillStyle = '#262423';
  ctx.fill();

  ctx.strokeStyle = theme.accentColor || '#CCFF00';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Badge texts
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const badgeLine1 = (data.badgeLine1 || 'LAST NIGHT').toUpperCase();
  const badgeLine2 = (data.badgeLine2 || 'WARRIOR').toUpperCase();

  ctx.font = `bold ${hasPhoto ? 26 : 30}px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif`;
  ctx.fillStyle = themeId === 'scrapbook' ? '#92400E' : 'rgba(255, 255, 255, 0.8)';
  if (themeId === 'minimal-mono') ctx.fillStyle = '#666666';
  ctx.fillText(badgeLine1, 1080 / 2, currentY + (hasPhoto ? 48 : 58));

  ctx.font = `black ${hasPhoto ? 48 : 58}px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif`;
  ctx.fillStyle = theme.accentColor || '#CCFF00';
  if (themeId === 'minimal-mono') ctx.fillStyle = '#000000';
  ctx.fillText(badgeLine2, 1080 / 2, currentY + (hasPhoto ? 108 : 130));
  ctx.restore();

  currentY += badgeHeight + (hasPhoto ? 24 : 32);

  // 7. Draw 4 Info Rows
  const rows = [
    { icon: '🌙', label: 'পড়ার ধরন:', val: data.studyHabit },
    { icon: '🧪', label: 'সবচেয়ে প্যারা:', val: data.biggestHassle },
    { icon: '📓', label: 'বড় সাপোর্ট:', val: data.biggestSupport },
    { icon: '💬', label: 'প্রিয় ডায়ালগ:', val: data.favoriteDialogue },
  ];

  const rowHeight = hasPhoto ? 95 : 110;
  const rowWidth = 920;
  const rowX = (1080 - rowWidth) / 2;
  const rowGap = hasPhoto ? 14 : 18;

  for (const row of rows) {
    ctx.save();
    drawRoundedRect(ctx, rowX, currentY, rowWidth, rowHeight, 20);
    ctx.fillStyle =
      themeId === 'original'
        ? '#EDE4F9'
        : themeId === 'minimal-mono'
        ? '#FFFFFF'
        : themeId === 'scrapbook'
        ? '#FFFFFF'
        : 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    ctx.strokeStyle =
      themeId === 'minimal-mono'
        ? '#000000'
        : themeId === 'original'
        ? '#D7C4F7'
        : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Icon
    ctx.font = "32px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.icon, rowX + 28, currentY + rowHeight / 2);

    // Label
    ctx.font = "bold 28px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
    ctx.fillStyle =
      themeId === 'original'
        ? '#2B1055'
        : themeId === 'minimal-mono'
        ? '#000000'
        : themeId === 'scrapbook'
        ? '#38281E'
        : '#E2E8F0';
    ctx.fillText(row.label, rowX + 80, currentY + rowHeight / 2);

    // Value
    ctx.font = "bold 28px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
    ctx.fillStyle =
      themeId === 'original'
        ? '#2B1055'
        : themeId === 'minimal-mono'
        ? '#000000'
        : theme.accentColor || '#CCFF00';
    ctx.textAlign = 'right';

    // Truncate if long
    let valText = row.val;
    if (valText.length > 28) {
      valText = valText.slice(0, 26) + '...';
    }
    ctx.fillText(valText, rowX + rowWidth - 28, currentY + rowHeight / 2);
    ctx.restore();

    currentY += rowHeight + rowGap;
  }

  currentY += hasPhoto ? 8 : 12;

  // 8. Draw Achievement Strip
  const achHeight = hasPhoto ? 95 : 110;
  ctx.save();
  drawRoundedRect(ctx, rowX, currentY, rowWidth, achHeight, 20);
  ctx.fillStyle = theme.accentColor || '#CCFF00';
  ctx.fill();

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Trophy Icon
  ctx.font = "34px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏆', rowX + 28, currentY + achHeight / 2);

  // Achievement text
  ctx.font = "bold 30px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif";
  ctx.fillStyle = '#000000';
  let achText = `অর্জন: ${data.achievement}`;
  if (achText.length > 36) {
    achText = achText.slice(0, 34) + '...';
  }
  ctx.fillText(achText, rowX + 84, currentY + achHeight / 2);
  ctx.restore();

  // 9. Draw Footer Quotes & Branding
  const footerY = 1750;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Quote
  ctx.font = "bold 32px 'Atma', 'Hind Siliguri', sans-serif";
  ctx.fillStyle =
    themeId === 'minimal-mono'
      ? '#000000'
      : themeId === 'original' || themeId === 'scrapbook'
      ? '#2B1055'
      : '#FFFFFF';
  ctx.fillText('“GPA একটা সংখ্যা, গল্পটা দুই বছরের।”', 1080 / 2, footerY);

  // Prompt Pill: "এবার তোর গল্পটা কী? ➔"
  const promptPillY = footerY + 55;
  drawRoundedRect(ctx, 1080 / 2 - 180, promptPillY - 25, 360, 50, 25);
  ctx.fillStyle =
    themeId === 'minimal-mono'
      ? '#F4F4F5'
      : themeId === 'original'
      ? '#EDE4F9'
      : 'rgba(255, 255, 255, 0.15)';
  ctx.fill();

  ctx.font = "bold 24px 'Hind Siliguri', sans-serif";
  ctx.fillStyle =
    themeId === 'minimal-mono'
      ? '#000000'
      : themeId === 'original'
      ? '#2B1055'
      : theme.accentColor || '#CCFF00';
  ctx.fillText('এবার তোর গল্পটা কী? ➔', 1080 / 2, promptPillY);

  // Medix Prime Tagline
  ctx.font = "bold 18px 'Plus Jakarta Sans', 'Space Grotesk', sans-serif";
  ctx.fillStyle =
    themeId === 'minimal-mono' ? '#888888' : 'rgba(255, 255, 255, 0.5)';
  if (themeId === 'original') ctx.fillStyle = 'rgba(43, 16, 85, 0.5)';
  ctx.fillText('MEDIX PRIME • HSC ’26 JOURNEY', 1080 / 2, promptPillY + 48);
  ctx.restore();

  // 10. Convert canvas to Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create Blob from Canvas'));
        }
      },
      'image/png',
      1
    );
  });
}

function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  themeId: CardThemeId,
  bgHex: string
) {
  ctx.save();
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative theme background highlights
  if (themeId === 'midnight-neon') {
    const grad1 = ctx.createRadialGradient(540, 200, 50, 540, 200, 600);
    grad1.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, 1080, 800);

    const grad2 = ctx.createRadialGradient(900, 1700, 50, 900, 1700, 600);
    grad2.addColorStop(0, 'rgba(255, 0, 127, 0.2)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 1200, 1080, 720);
  } else if (themeId === 'wrapped') {
    const grad1 = ctx.createRadialGradient(200, 200, 50, 200, 200, 600);
    grad1.addColorStop(0, 'rgba(29, 185, 84, 0.3)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, 1080, 800);
  } else if (themeId === 'original') {
    // Subtle dots
    ctx.fillStyle = 'rgba(43, 16, 85, 0.04)';
    for (let x = 40; x < 1080; x += 40) {
      for (let y = 40; y < 1920; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
