/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider, useRouter } from './hooks/useRouter';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { MyJourneyDashboard } from './components/MyJourneyDashboard';
import { PageTransition, TransitionDirection } from './components/PageTransition';
import { StudentIntelligenceToolsSection } from './components/tools/StudentIntelligenceToolsSection';
import { EcosystemBox } from './components/EcosystemBox';
import { FeedbackBox } from './components/FeedbackBox';
import { CategoryConfettiCelebration } from './components/CategoryConfettiCelebration';
import { recordToolVisit, resolveToolByPath } from './utils/studentDashboardStorage';

// Pre-existing admission pages (Preserved)
import { GpaTargetToolPage } from './pages/GpaTargetToolPage';
import { AdmissionEligibilityToolPage } from './pages/AdmissionEligibilityToolPage';
import { AdmissionScoreToolPage } from './pages/AdmissionScoreToolPage';

// 20 Student Intelligence Tool Pages
import { GpaGradeCalculatorPage } from './pages/tools/GpaGradeCalculatorPage';
import { GpaTargetPredictorPage } from './pages/tools/GpaTargetPredictorPage';
import { ResultImprovementPlannerPage } from './pages/tools/ResultImprovementPlannerPage';
import { SubjectCombinationAdvisorPage } from './pages/tools/SubjectCombinationAdvisorPage';
import { AcademicEligibilityCheckerPage } from './pages/tools/AcademicEligibilityCheckerPage';
import { CareerExplorerPage } from './pages/tools/CareerExplorerPage';
import { CareerRoadmapGeneratorPage } from './pages/tools/CareerRoadmapGeneratorPage';
import { SkillStrengthFinderPage } from './pages/tools/SkillStrengthFinderPage';
import { SubjectMajorFinderPage } from './pages/tools/SubjectMajorFinderPage';
import { CareerComparisonToolPage } from './pages/tools/CareerComparisonToolPage';
import { UniversityFinderPage } from './pages/tools/UniversityFinderPage';
import { AdmissionCostCalculatorPage } from './pages/tools/AdmissionCostCalculatorPage';
import { UniversityComparatorPage } from './pages/tools/UniversityComparatorPage';
import { ScholarshipMatcherPage } from './pages/tools/ScholarshipMatcherPage';
import { TimeValueCalculatorPage } from './pages/tools/TimeValueCalculatorPage';
import { StudyHabitAnalyzerPage } from './pages/tools/StudyHabitAnalyzerPage';
import { DigitalSkillFinderPage } from './pages/tools/DigitalSkillFinderPage';
import { StudentBudgetPlannerPage } from './pages/tools/StudentBudgetPlannerPage';
import { OpportunityRadarPage } from './pages/tools/OpportunityRadarPage';

// Dedicated Informational & Entry Pages
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { EntryFormPage, StudentEntryData } from './pages/EntryFormPage';

const STUDENT_ENTRY_STORAGE_KEY = 'medix_prime_student_entry';

function getStoredStudentEntry(): StudentEntryData | null {
  try {
    const raw = localStorage.getItem(STUDENT_ENTRY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.name && parsed.studentClass && parsed.institution && parsed.phone) {
      return parsed as StudentEntryData;
    }
    return null;
  } catch {
    return null;
  }
}

function resolveRoute(
  currentPath: string,
  studentEntry: StudentEntryData | null,
  onEntrySuccess: (data: StudentEntryData) => void,
  onLogout: () => void
): { key: string; node: React.ReactNode; isHome: boolean } {
  // Entry Form route (or initial gate when landing on '/' without entry data)
  if (currentPath === '/entry' || (currentPath === '/' && !studentEntry)) {
    return {
      key: '/entry',
      node: <EntryFormPage initialData={studentEntry} onSuccess={onEntrySuccess} />,
      isHome: false,
    };
  }

  // Dedicated Pages: Journey Dashboard, About & Privacy Policy
  if (currentPath === '/journey') {
    return {
      key: '/journey',
      node: <MyJourneyDashboard studentEntry={studentEntry} onLogout={onLogout} />,
      isHome: false,
    };
  }

  if (currentPath === '/about') {
    return { key: '/about', node: <AboutPage />, isHome: false };
  }

  if (currentPath === '/privacy' || currentPath === '/privacy-policy') {
    return { key: '/privacy', node: <PrivacyPolicyPage />, isHome: false };
  }

  // 1. GPA & Grade Calculator
  if (currentPath === '/tools/gpa-grade-calculator') {
    return { key: '/tools/gpa-grade-calculator', node: <GpaGradeCalculatorPage />, isHome: false };
  }

  // 2. GPA Target Predictor
  if (currentPath === '/tools/gpa-target-predictor' || currentPath === '/tools/gpa-target') {
    return { key: '/tools/gpa-target-predictor', node: <GpaTargetPredictorPage />, isHome: false };
  }

  // 3. Result Improvement Planner
  if (currentPath === '/tools/result-improvement-planner') {
    return { key: '/tools/result-improvement-planner', node: <ResultImprovementPlannerPage />, isHome: false };
  }

  // 4. Subject Combination Advisor
  if (currentPath === '/tools/subject-combination-advisor') {
    return { key: '/tools/subject-combination-advisor', node: <SubjectCombinationAdvisorPage />, isHome: false };
  }

  // 5. Academic Eligibility Checker
  if (currentPath === '/tools/academic-eligibility-checker') {
    return { key: '/tools/academic-eligibility-checker', node: <AcademicEligibilityCheckerPage />, isHome: false };
  }

  // 6. Career Explorer
  if (currentPath === '/tools/career-explorer') {
    return { key: '/tools/career-explorer', node: <CareerExplorerPage />, isHome: false };
  }

  // 7. Career Roadmap Generator
  if (currentPath === '/tools/career-roadmap-generator') {
    return { key: '/tools/career-roadmap-generator', node: <CareerRoadmapGeneratorPage />, isHome: false };
  }

  // 8. Skill & Strength Finder
  if (currentPath === '/tools/skill-strength-finder') {
    return { key: '/tools/skill-strength-finder', node: <SkillStrengthFinderPage />, isHome: false };
  }

  // 9. Subject & Major Finder
  if (currentPath === '/tools/subject-major-finder') {
    return { key: '/tools/subject-major-finder', node: <SubjectMajorFinderPage />, isHome: false };
  }

  // 10. Career Comparison Tool
  if (currentPath === '/tools/career-comparison-tool') {
    return { key: '/tools/career-comparison-tool', node: <CareerComparisonToolPage />, isHome: false };
  }

  // 11. University Finder
  if (currentPath === '/tools/university-finder') {
    return { key: '/tools/university-finder', node: <UniversityFinderPage />, isHome: false };
  }

  // 12. Admission Eligibility Checker (Integrated official checker)
  if (currentPath === '/tools/admission-eligibility-checker' || currentPath === '/tools/admission-eligibility') {
    return { key: '/tools/admission-eligibility-checker', node: <AdmissionEligibilityToolPage />, isHome: false };
  }

  // 13. Admission Cost Calculator
  if (currentPath === '/tools/admission-cost-calculator') {
    return { key: '/tools/admission-cost-calculator', node: <AdmissionCostCalculatorPage />, isHome: false };
  }

  // 14. University Comparator
  if (currentPath === '/tools/university-comparator') {
    return { key: '/tools/university-comparator', node: <UniversityComparatorPage />, isHome: false };
  }

  // 15. Scholarship Matcher
  if (currentPath === '/tools/scholarship-matcher') {
    return { key: '/tools/scholarship-matcher', node: <ScholarshipMatcherPage />, isHome: false };
  }

  // 16. Time Value Calculator
  if (currentPath === '/tools/time-value-calculator') {
    return { key: '/tools/time-value-calculator', node: <TimeValueCalculatorPage />, isHome: false };
  }

  // 17. Study Habit Analyzer
  if (currentPath === '/tools/study-habit-analyzer') {
    return { key: '/tools/study-habit-analyzer', node: <StudyHabitAnalyzerPage />, isHome: false };
  }

  // 18. Digital Skill Finder
  if (currentPath === '/tools/digital-skill-finder') {
    return { key: '/tools/digital-skill-finder', node: <DigitalSkillFinderPage />, isHome: false };
  }

  // 19. Student Budget Planner
  if (currentPath === '/tools/student-budget-planner') {
    return { key: '/tools/student-budget-planner', node: <StudentBudgetPlannerPage />, isHome: false };
  }

  // 20. Opportunity Radar
  if (currentPath === '/tools/opportunity-radar' || currentPath === '/tools/scholarship-opportunity-radar') {
    return { key: '/tools/opportunity-radar', node: <OpportunityRadarPage />, isHome: false };
  }

  // Pre-existing Admission Score Tool (Preserved)
  if (currentPath === '/tools/admission-score') {
    return { key: '/tools/admission-score', node: <AdmissionScoreToolPage />, isHome: false };
  }

  // Pre-existing GPA Target route (Preserved)
  if (currentPath === '/tools/gpa-target-legacy') {
    return { key: '/tools/gpa-target-legacy', node: <GpaTargetToolPage />, isHome: false };
  }

  // Default Homepage View:
  // 1. My Journey Dashboard (Student greeting, pinned tools, recent activity summary)
  // 2. Student Intelligence Tools Section (Placed ABOVE Future Learning Technologies)
  // 3. Existing Future Learning Technologies EcosystemBox (Unchanged)
  return {
    key: '/',
    isHome: true,
    node: (
      <>
        <MyJourneyDashboard studentEntry={studentEntry} onLogout={onLogout} />

        {/* NEW SECTION: Student Intelligence Tools (Placed immediately ABOVE Future Learning Technologies) */}
        <StudentIntelligenceToolsSection />

        {/* UNTOUCHED EXISTING SECTION: Future Learning Technologies */}
        <EcosystemBox />

        {/* Feedback & Suggestion Box (Forwards directly to Telegram Bot) */}
        <FeedbackBox studentEntry={studentEntry} />
      </>
    ),
  };
}

function getTransitionDirection(
  currentIsHome: boolean,
  previousPath: string | null
): TransitionDirection {
  const prevWasHome = previousPath === null || previousPath === '/';
  if (!currentIsHome && prevWasHome) return 'toTool';
  if (currentIsHome && !prevWasHome) return 'toHome';
  return 'lateral';
}

function AppContent() {
  const { currentPath, previousPath, navigate } = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [studentEntry, setStudentEntry] = React.useState<StudentEntryData | null>(() => getStoredStudentEntry());

  React.useEffect(() => {
    const matchedTool = resolveToolByPath(currentPath);
    if (matchedTool) {
      recordToolVisit(matchedTool);
    }
  }, [currentPath]);

  const handleEntrySuccess = React.useCallback(
    (data: StudentEntryData) => {
      try {
        localStorage.setItem(STUDENT_ENTRY_STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Ignore storage errors if private mode restricts storage
      }
      setStudentEntry(data);
      navigate('/');
    },
    [navigate]
  );

  const handleLogout = React.useCallback(() => {
    try {
      localStorage.removeItem(STUDENT_ENTRY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    setStudentEntry(null);
    navigate('/entry');
  }, [navigate]);

  const { key, node, isHome } = resolveRoute(currentPath, studentEntry, handleEntrySuccess, handleLogout);
  const direction = getTransitionDirection(isHome, previousPath);

  return (
    <div
      className={`min-h-screen flex flex-col font-body transition-colors duration-300 ${
        isDark ? 'bg-[#060D17] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Persistent Navigation Header with Left-Aligned Logo & Right-Aligned Theme Toggle Button */}
      <Header />

      {/* Global Confetti Celebration when a student completes all tools in a category */}
      <CategoryConfettiCelebration />

      {/* Main Content Area with Smooth Directional Page Transitions */}
      <main className="flex-1 overflow-x-clip">
        <PageTransition routeKey={key} direction={direction}>
          {node}
        </PageTransition>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
