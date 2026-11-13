import { APP_CONFIG, EDUCATION_BOARDS, EXAMINATION_OPTIONS } from '../config/appConfig';
import { ResultQuery, ResultServiceResponse, StudentResult } from '../types';
import { normalizeBengaliDigits } from '../utils/bengaliUtils';

/**
 * Result Service Interface
 * Keeps data fetching and provider configuration separate from UI presentation.
 */

// Simulated mock results used exclusively for testing UI layouts and print templates
export const SAMPLE_SUCCESSFUL_RESULT: StudentResult = {
  studentName: 'মুনজেরিন আহমেদ (Munjereen Ahmed)',
  fatherName: 'মো. রফিকুল ইসলাম',
  motherName: 'নাজমুন নাহার',
  institute: 'নটর ডেম কলেজ, ঢাকা (Notre Dame College)',
  roll: '148920',
  registration: '1910482910',
  board: 'dhaka',
  boardBn: 'ঢাকা',
  examination: 'hsc',
  examinationBn: 'HSC / সমমান',
  year: '2026',
  status: 'PASSED',
  statusBn: 'উত্তীর্ণ (PASSED)',
  gpa: 5.0,
  publishedAt: '2026-10-28',
  subjectGrades: [
    { code: '101', name: 'বাংলা (Bangla)', grade: 'A+', gradePoint: 5.0 },
    { code: '107', name: 'ইংরেজি (English)', grade: 'A+', gradePoint: 5.0 },
    { code: '174', name: 'পদার্থবিজ্ঞান (Physics)', grade: 'A+', gradePoint: 5.0 },
    { code: '176', name: 'রসায়ন (Chemistry)', grade: 'A+', gradePoint: 5.0 },
    { code: '178', name: 'উচ্চতর গণিত (Higher Mathematics)', grade: 'A+', gradePoint: 5.0 },
    { code: '180', name: 'জীববিজ্ঞান (Biology - 4th Subject)', grade: 'A+', gradePoint: 5.0 },
    { code: '275', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', grade: 'A+', gradePoint: 5.0 },
  ],
};

class ResultService {
  /**
   * Primary entry point for querying HSC Results.
   * If API is not configured (the default production state), it returns unconfigured_notice
   * without transmitting roll or registration numbers anywhere.
   */
  async queryResult(query: ResultQuery): Promise<ResultServiceResponse> {
    const normalizedRoll = normalizeBengaliDigits(query.roll);
    const normalizedReg = normalizeBengaliDigits(query.registration);

    // Strict Rule: When no API is configured, return the honest notice and do NOT send data.
    if (!APP_CONFIG.isResultApiConfigured) {
      return {
        isConfigured: false,
        status: 'unconfigured_notice',
        messageBn: 'সরাসরি রেজাল্ট সেবা এখনো চালু হয়নি। আপাতত অফিসিয়াল পোর্টাল থেকে ফল দেখো।',
        messageEn: 'Direct result service is not yet enabled. Please check results via the official government portal.',
      };
    }

    // When an actual backend API endpoint is supplied in the future:
    try {
      // Future implementation hook:
      // const response = await fetch('/api/results/hsc', { method: 'POST', body: JSON.stringify({ ...query, roll: normalizedRoll, registration: normalizedReg }) });
      // return await response.json();
      return {
        isConfigured: true,
        status: 'service_error',
        messageBn: 'সার্ভিস সংযোগ বিচ্ছিন্ন বা সময় শেষ। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      };
    } catch {
      return {
        isConfigured: true,
        status: 'service_error',
        messageBn: 'সার্ভিস সাময়িকভাবে অনুপলব্ধ। দয়া করে অফিসিয়াল পোর্টাল ব্যবহার করো।',
      };
    }
  }

  /**
   * Helper to resolve board label in Bengali
   */
  getBoardLabelBn(code: string): string {
    const found = EDUCATION_BOARDS.find((b) => b.code.toLowerCase() === code.toLowerCase());
    return found ? found.labelBn : code;
  }

  /**
   * Helper to resolve examination label in Bengali
   */
  getExamLabelBn(code: string): string {
    const found = EXAMINATION_OPTIONS.find((e) => e.code.toLowerCase() === code.toLowerCase());
    return found ? found.labelBn : code;
  }
}

export const resultService = new ResultService();
