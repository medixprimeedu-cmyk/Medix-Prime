import { toBlob, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { CardThemeId, JourneyCardData } from '../types/cardTypes';
import { renderCardToCanvas2D } from './cardCanvasRenderer';

export interface ExportCardParams {
  element: HTMLElement | null;
  cardData: JourneyCardData;
  themeId: CardThemeId;
}

/**
 * Universal high-resolution card rasterizer
 * Generates both Blob and base64 Data URL using multi-layer fallback:
 * 1. html-to-image (fast DOM rasterization)
 * 2. Canvas 2D direct renderer (100% fail-safe fallback)
 */
export async function generateCardImage({
  element,
  cardData,
  themeId,
}: ExportCardParams): Promise<{ blob: Blob; dataUrl: string }> {
  // 1. Wait for document fonts to finish loading
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if fonts API throws
    }
  }

  // 2. Wait for any <img> inside the element to fully decode
  if (element) {
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(async (img) => {
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
        if ('decode' in img) {
          try {
            await img.decode();
          } catch {
            // Ignore decode failures
          }
        }
      })
    );
  }

  // Small delay for DOM paint stabilization
  await new Promise((resolve) => setTimeout(resolve, 80));

  let finalBlob: Blob | null = null;
  let finalDataUrl: string | null = null;

  // ATTEMPT 1: toPng with html-to-image
  if (element) {
    try {
      const dataUrl = await toPng(element, {
        width: 1080,
        height: 1920,
        canvasWidth: 1080,
        canvasHeight: 1920,
        pixelRatio: 1,
        skipFonts: true, // Prevents CORS remote font stylesheet crashes
        fontEmbedCSS: '', // Bypasses getWebFontCSS
        cacheBust: false,
        quality: 1,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          margin: '0',
          width: '1080px',
          height: '1920px',
          opacity: '1',
          visibility: 'visible',
        },
      });

      if (dataUrl && dataUrl.startsWith('data:image')) {
        finalDataUrl = dataUrl;
        finalBlob = dataURItoBlob(dataUrl);
      }
    } catch (err1) {
      console.warn('html-to-image toPng failed, trying toBlob...', err1);
    }
  }

  // ATTEMPT 2: toBlob with html-to-image
  if (!finalBlob && element) {
    try {
      finalBlob = await toBlob(element, {
        width: 1080,
        height: 1920,
        canvasWidth: 1080,
        canvasHeight: 1920,
        pixelRatio: 1,
        skipFonts: true,
        fontEmbedCSS: '',
        cacheBust: false,
        quality: 1,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
          margin: '0',
          width: '1080px',
          height: '1920px',
          opacity: '1',
          visibility: 'visible',
        },
      });

      if (finalBlob) {
        finalDataUrl = await blobToDataURL(finalBlob);
      }
    } catch (err2) {
      console.warn('html-to-image toBlob failed, activating Canvas 2D fallback...', err2);
    }
  }

  // ATTEMPT 3: Canvas 2D Direct Render Engine (Guaranteed)
  if (!finalBlob || !finalDataUrl) {
    console.info('Using Canvas 2D direct card renderer for export');
    finalBlob = await renderCardToCanvas2D(cardData, themeId);
    finalDataUrl = await blobToDataURL(finalBlob);
  }

  return { blob: finalBlob, dataUrl: finalDataUrl };
}

/**
 * Universal Failproof 1080 × 1920 PNG Card Exporter
 */
export async function exportCardAsPng(params: ExportCardParams): Promise<void> {
  const { blob } = await generateCardImage(params);
  const filename = getSanitizedFilename(params.cardData.name, params.themeId, 'png');
  triggerBlobDownload(blob, filename);
}

/**
 * High-Resolution Standard Page PDF Exporter
 * Maintains the exact 1080x1920 (9:16) aspect ratio centered on a standard A4 portrait page
 */
export async function exportCardAsPdf(params: ExportCardParams): Promise<void> {
  const { dataUrl } = await generateCardImage(params);

  // Initialize jsPDF with standard A4 portrait (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

  // Maintain strict 1080 x 1920 (9:16) aspect ratio
  const targetRatio = 1080 / 1920; // 0.5625

  // Standard comfortable margins: 8mm top & bottom
  const cardHeight = pageHeight - 16; // 281 mm
  const cardWidth = cardHeight * targetRatio; // 158.0625 mm

  // Center horizontally on the page
  const x = (pageWidth - cardWidth) / 2; // ~25.97 mm
  const y = 8; // 8 mm margin from top

  // Embed the high-resolution 1080x1920 raster into the PDF
  doc.addImage(dataUrl, 'PNG', x, y, cardWidth, cardHeight, undefined, 'FAST');

  // Set standard document metadata
  const displayName = params.cardData.name.trim() || 'My Story';
  doc.setProperties({
    title: `HSC '26 Journey Card - ${displayName}`,
    subject: "HSC '26 আমার গল্প",
    author: 'Medix Prime',
    creator: 'Medix Prime Education',
  });

  const filename = getSanitizedFilename(params.cardData.name, params.themeId, 'pdf');
  doc.save(filename);
}

/**
 * Helper to build sanitized file names
 */
function getSanitizedFilename(name: string, themeId: string, ext: 'png' | 'pdf'): string {
  const sanitizedName =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0980-\u09FF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30) || 'kowshiq';

  return `hsc26-${sanitizedName}-${themeId}.${ext}`;
}

/**
 * Converts a base64 Data URI to a binary Blob
 */
function dataURItoBlob(dataURI: string): Blob {
  const parts = dataURI.split(',');
  const byteString = atob(parts[1]);
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeString = mimeMatch ? mimeMatch[1] : 'image/png';

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Converts a Blob to a base64 Data URI
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Universal download trigger for Blobs across Desktop and Mobile browsers
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Append to body for Firefox / Safari compatibility
  document.body.appendChild(link);
  link.click();

  // Cleanup after browser has begun download
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 3000);
}
