import { STUDENT_INTELLIGENCE_TOOLS, ToolCategory, ToolDefinition } from '../data/studentIntelligenceTools';

export const FAVORITE_TOOLS_STORAGE_KEY = 'medix_prime_favorite_tools_v1';
export const RECENT_ACTIVITY_STORAGE_KEY = 'medix_prime_recent_activity_v1';
export const VISITED_TOOLS_ALL_STORAGE_KEY = 'medix_prime_visited_tools_all_v1';
export const COMPLETED_TOOLS_STORAGE_KEY = 'medix_prime_completed_tools_v1';
export const CELEBRATED_CATEGORIES_STORAGE_KEY = 'medix_prime_celebrated_categories_v1';

export const FAVORITES_UPDATED_EVENT = 'medix:favorites-updated';
export const ACTIVITY_UPDATED_EVENT = 'medix:activity-updated';
export const COMPLETED_TOOLS_UPDATED_EVENT = 'medix:completed-tools-updated';
export const CATEGORY_COMPLETED_EVENT = 'medix:category-completed';

const MAX_RECENT_ACTIVITIES = 6;

export type CoreToolCategory = Exclude<ToolCategory, 'all'>;

export interface CoreCategoryMeta {
  key: CoreToolCategory;
  labelBn: string;
  shortLabelBn: string;
  accentColor: string;
}

export const CORE_TOOL_CATEGORIES: CoreCategoryMeta[] = [
  {
    key: 'academic',
    labelBn: 'একাডেমিক সরঞ্জাম',
    shortLabelBn: 'একাডেমিক',
    accentColor: '#38BDF8',
  },
  {
    key: 'career',
    labelBn: 'ক্যারিয়ার সরঞ্জাম',
    shortLabelBn: 'ক্যারিয়ার',
    accentColor: '#F472B6',
  },
  {
    key: 'university',
    labelBn: 'বিশ্ববিদ্যালয় সরঞ্জাম',
    shortLabelBn: 'বিশ্ববিদ্যালয়',
    accentColor: '#10B981',
  },
  {
    key: 'personal',
    labelBn: 'ব্যক্তিগত উন্নয়ন',
    shortLabelBn: 'ব্যক্তিগত উন্নয়ন',
    accentColor: '#A855F7',
  },
];

export interface CategoryProgressItem extends CoreCategoryMeta {
  completedCount: number;
  totalCount: number;
  isCompleted: boolean;
  tools: ToolDefinition[];
}

export interface RecentToolActivityItem {
  toolId: string;
  nameBn: string;
  path: string;
  iconName: string;
  accentColor: string;
  visitedAt: number;
  visitCount: number;
}

export function loadFavoriteToolIds(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(FAVORITE_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveFavoriteToolIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAVORITE_TOOLS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore quota/private-mode errors
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: ids }));
}

export function toggleFavoriteToolId(toolId: string): string[] {
  const current = loadFavoriteToolIds();
  const updated = current.includes(toolId)
    ? current.filter((id) => id !== toolId)
    : [...current, toolId];
  saveFavoriteToolIds(updated);
  return updated;
}

export function loadRecentToolActivity(): RecentToolActivityItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(RECENT_ACTIVITY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentToolActivityItem =>
          item &&
          typeof item === 'object' &&
          typeof item.toolId === 'string' &&
          typeof item.nameBn === 'string' &&
          typeof item.path === 'string' &&
          typeof item.visitedAt === 'number'
      )
      .slice(0, MAX_RECENT_ACTIVITIES);
  } catch {
    return [];
  }
}

export function loadVisitedToolIds(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const rawAll = window.localStorage.getItem(VISITED_TOOLS_ALL_STORAGE_KEY);
    const parsedAll = rawAll ? JSON.parse(rawAll) : [];
    const allIds = Array.isArray(parsedAll)
      ? parsedAll.filter((id): id is string => typeof id === 'string')
      : [];

    // Ensure union with any existing recent activity items
    const recentIds = loadRecentToolActivity().map((item) => item.toolId);
    const merged = Array.from(new Set([...allIds, ...recentIds]));
    return merged;
  } catch {
    return loadRecentToolActivity().map((item) => item.toolId);
  }
}

export function recordToolVisit(tool: ToolDefinition): RecentToolActivityItem[] {
  if (typeof window === 'undefined') return [];
  const current = loadRecentToolActivity();
  const existing = current.find((item) => item.toolId === tool.id);
  const nextItem: RecentToolActivityItem = {
    toolId: tool.id,
    nameBn: tool.nameBn,
    path: tool.path,
    iconName: tool.iconName,
    accentColor: tool.accentColor,
    visitedAt: Date.now(),
    visitCount: existing ? existing.visitCount + 1 : 1,
  };

  const remaining = current.filter((item) => item.toolId !== tool.id);
  const updated = [nextItem, ...remaining].slice(0, MAX_RECENT_ACTIVITIES);

  const visitedIds = Array.from(new Set([...loadVisitedToolIds(), tool.id]));

  try {
    window.localStorage.setItem(RECENT_ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    window.localStorage.setItem(VISITED_TOOLS_ALL_STORAGE_KEY, JSON.stringify(visitedIds));
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(ACTIVITY_UPDATED_EVENT, { detail: updated }));
  return updated;
}

export function clearRecentToolActivity(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENT_ACTIVITY_STORAGE_KEY);
  } catch {
    // Ignore
  }
  window.dispatchEvent(new CustomEvent(ACTIVITY_UPDATED_EVENT, { detail: [] }));
}

export function loadCompletedToolIds(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function loadCelebratedCategories(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(CELEBRATED_CATEGORIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveCelebratedCategories(categories: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CELEBRATED_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Ignore storage errors
  }
}

export function getCategoryCompletionSummary(completedIds?: string[]): CategoryProgressItem[] {
  const activeIds = new Set(completedIds ?? loadCompletedToolIds());
  return CORE_TOOL_CATEGORIES.map((meta) => {
    const tools = STUDENT_INTELLIGENCE_TOOLS.filter((tool) => tool.category === meta.key);
    const completedCount = tools.filter((tool) => activeIds.has(tool.id)).length;
    const totalCount = tools.length;
    return {
      ...meta,
      completedCount,
      totalCount,
      isCompleted: totalCount > 0 && completedCount === totalCount,
      tools,
    };
  });
}

export function dispatchCategoryCelebration(categorySummary: CategoryProgressItem): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CATEGORY_COMPLETED_EVENT, { detail: categorySummary }));
}

export function saveCompletedToolIds(ids: string[]): CategoryProgressItem | null {
  if (typeof window === 'undefined') return null;
  const uniqueIds = Array.from(new Set(ids));
  try {
    window.localStorage.setItem(COMPLETED_TOOLS_STORAGE_KEY, JSON.stringify(uniqueIds));
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(COMPLETED_TOOLS_UPDATED_EVENT, { detail: uniqueIds }));

  const summary = getCategoryCompletionSummary(uniqueIds);
  const celebrated = loadCelebratedCategories();

  // Keep celebrated list synced: if a category drops below 100%, allow re-celebration when re-completed
  const stillCompletedKeys = celebrated.filter((catKey) =>
    summary.some((item) => item.key === catKey && item.isCompleted)
  );

  const newlyCompletedCategory =
    summary.find((item) => item.isCompleted && !stillCompletedKeys.includes(item.key)) ?? null;

  if (newlyCompletedCategory) {
    saveCelebratedCategories([...stillCompletedKeys, newlyCompletedCategory.key]);
    dispatchCategoryCelebration(newlyCompletedCategory);
  } else if (stillCompletedKeys.length !== celebrated.length) {
    saveCelebratedCategories(stillCompletedKeys);
  }

  return newlyCompletedCategory;
}

export function toggleCompletedToolId(toolId: string): {
  completedIds: string[];
  newlyCompletedCategory: CategoryProgressItem | null;
} {
  const current = loadCompletedToolIds();
  const updated = current.includes(toolId)
    ? current.filter((id) => id !== toolId)
    : [...current, toolId];
  const newlyCompletedCategory = saveCompletedToolIds(updated);
  return { completedIds: updated, newlyCompletedCategory };
}

export function resolveToolByPath(pathname: string): ToolDefinition | undefined {
  const pathAliasMap: Record<string, string> = {
    '/tools/gpa-target': '/tools/gpa-target-predictor',
    '/tools/admission-eligibility': '/tools/admission-eligibility-checker',
    '/tools/scholarship-opportunity-radar': '/tools/opportunity-radar',
  };
  const normalized = pathAliasMap[pathname] || pathname;
  return STUDENT_INTELLIGENCE_TOOLS.find((tool) => tool.path === normalized);
}

export function resolveToolByNumber(toolNumber: string): ToolDefinition | undefined {
  return STUDENT_INTELLIGENCE_TOOLS.find((tool) => tool.number === toolNumber);
}
