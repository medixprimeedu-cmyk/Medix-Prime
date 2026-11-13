/**
 * Medix Prime HSC Result Portal Type Definitions
 */

export type ExaminationType =
  | 'hsc'
  | 'alim'
  | 'vocational'
  | 'bm'
  | 'diploma_commerce'
  | 'diploma_business';

export interface EducationBoard {
  code: string;
  labelBn: string;
  labelEn: string;
}

export interface ExaminationOption {
  code: ExaminationType;
  labelBn: string;
  labelEn: string;
}

export interface ResultQuery {
  examination: ExaminationType;
  board: string;
  year: string;
  roll: string;
  registration: string;
}

export interface SubjectGrade {
  code: string;
  name: string;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number;
}

export type ResultStatus = 'PASSED' | 'FAILED' | 'WITHHELD' | 'EXPELLED';

export interface StudentResult {
  studentName: string;
  fatherName?: string;
  motherName?: string;
  institute?: string;
  roll: string;
  registration: string;
  board: string;
  boardBn: string;
  examination: string;
  examinationBn: string;
  year: string;
  status: ResultStatus;
  statusBn: string;
  gpa: number;
  subjectGrades: SubjectGrade[];
  publishedAt?: string;
}

export type FetchState =
  | 'idle'
  | 'unconfigured_notice'
  | 'loading'
  | 'success'
  | 'not_found'
  | 'not_published'
  | 'service_error';

export interface ResultServiceResponse {
  isConfigured: boolean;
  status: FetchState;
  result?: StudentResult;
  messageBn?: string;
  messageEn?: string;
}
