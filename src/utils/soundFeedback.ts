const SOUND_PREF_STORAGE_KEY = 'medix_prime_sound_enabled_v1';
const SEEN_ACHIEVEMENTS_STORAGE_KEY = 'medix_prime_seen_achievements_v1';

export const SOUND_PREF_UPDATED_EVENT = 'medix:sound-pref-updated';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {
        // Autoplay restriction before user interaction; ignore cleanly
      });
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function isSoundFeedbackEnabled(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return true;
  try {
    const saved = window.localStorage.getItem(SOUND_PREF_STORAGE_KEY);
    if (saved === 'false') return false;
    return true;
  } catch {
    return true;
  }
}

export function setSoundFeedbackEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_PREF_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(SOUND_PREF_UPDATED_EVENT, { detail: enabled }));
}

function playNoteSequence(
  notes: Array<{ freq: number; delay: number; duration: number; gain: number; type?: OscillatorType }>
): void {
  if (!isSoundFeedbackEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const scheduleNotes = () => {
    try {
      const now = ctx.currentTime;
      for (const note of notes) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const startTime = now + note.delay;

        osc.type = note.type ?? 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(note.gain, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.duration + 0.02);
      }
    } catch {
      // Ignore audio synthesis errors
    }
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(scheduleNotes).catch(() => {
      // Autoplay blocked before user gesture
    });
    return;
  }

  scheduleNotes();
}

/**
 * Warm ascending major chime when a milestone badge is earned.
 */
export function playMilestoneChime(): void {
  playNoteSequence([
    { freq: 523.25, delay: 0, duration: 0.22, gain: 0.055, type: 'sine' }, // C5
    { freq: 659.25, delay: 0.08, duration: 0.24, gain: 0.055, type: 'sine' }, // E5
    { freq: 783.99, delay: 0.16, duration: 0.3, gain: 0.06, type: 'sine' }, // G5
    { freq: 1046.5, delay: 0.24, duration: 0.42, gain: 0.065, type: 'triangle' }, // C6
  ]);
}

/**
 * Sparkling celebratory chime when a rare Special Achievement or Category is completed.
 */
export function playRareBadgeChime(): void {
  playNoteSequence([
    { freq: 587.33, delay: 0, duration: 0.2, gain: 0.05, type: 'sine' }, // D5
    { freq: 783.99, delay: 0.07, duration: 0.24, gain: 0.055, type: 'sine' }, // G5
    { freq: 987.77, delay: 0.14, duration: 0.28, gain: 0.055, type: 'sine' }, // B5
    { freq: 1174.66, delay: 0.21, duration: 0.35, gain: 0.06, type: 'triangle' }, // D6
    { freq: 1567.98, delay: 0.29, duration: 0.48, gain: 0.05, type: 'sine' }, // G6
  ]);
}

/**
 * Soft two-tone bell chime for Pomodoro study timer completion.
 */
export function playTimerDoneChime(): void {
  playNoteSequence([
    { freq: 523.25, delay: 0, duration: 0.32, gain: 0.07, type: 'sine' },
    { freq: 659.25, delay: 0.16, duration: 0.42, gain: 0.07, type: 'sine' },
  ]);
}

interface SeenAchievementsState {
  milestones: string[];
  specials: string[];
}

function loadSeenAchievements(): SeenAchievementsState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { milestones: [], specials: [] };
  }
  try {
    const raw = window.localStorage.getItem(SEEN_ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return { milestones: [], specials: [] };
    const parsed = JSON.parse(raw);
    return {
      milestones: Array.isArray(parsed?.milestones)
        ? parsed.milestones.filter((id: unknown): id is string => typeof id === 'string')
        : [],
      specials: Array.isArray(parsed?.specials)
        ? parsed.specials.filter((id: unknown): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return { milestones: [], specials: [] };
  }
}

function saveSeenAchievements(state: SeenAchievementsState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(SEEN_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function syncAndDetectNewMilestones(unlockedIds: string[]): string[] {
  const seen = loadSeenAchievements();
  const seenSet = new Set(seen.milestones);
  const newlyUnlocked = unlockedIds.filter((id) => !seenSet.has(id));

  // Persist current unlocked set (allowing re-trigger only if lock state changes)
  saveSeenAchievements({ ...seen, milestones: unlockedIds });
  return newlyUnlocked;
}

export function syncAndDetectNewSpecials(unlockedIds: string[]): string[] {
  const seen = loadSeenAchievements();
  const seenSet = new Set(seen.specials);
  const newlyUnlocked = unlockedIds.filter((id) => !seenSet.has(id));

  saveSeenAchievements({ ...seen, specials: unlockedIds });
  return newlyUnlocked;
}
