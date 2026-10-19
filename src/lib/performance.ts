import { writable } from 'svelte/store';

export type Quality = 'high' | 'medium' | 'basic';
export type Preference = Quality | 'auto';
export type Signals = {
  threads: number | null;
  memory: number | null;
  saveData: boolean;
  reducedMotion: boolean;
  width: number;
  height: number;
  touch: boolean;
};

// Missing signals receive a neutral score, not a fabricated hardware value.
export function classify(signals: Signals): { mode: Quality; score: number } {
  const cpu = signals.threads === null ? 1 : signals.threads >= 8 ? 2 : signals.threads >= 4 ? 1 : 0;
  const ram = signals.memory === null ? 1 : signals.memory >= 8 ? 2 : signals.memory >= 4 ? 1 : 0;
  const score = cpu + ram;
  const constrained = signals.saveData || (signals.threads !== null && signals.threads <= 2) || (signals.memory !== null && signals.memory <= 2);
  return { score, mode: signals.reducedMotion || constrained ? 'basic' : score >= 3 ? 'high' : score >= 2 ? 'medium' : 'basic' };
}

export function effectiveMode(preference: Preference, detected: Quality, reducedMotion: boolean): Quality {
  return reducedMotion ? 'basic' : preference === 'auto' ? detected : preference;
}

export const performanceProfile = writable<{
  ready: boolean; preference: Preference; detected: Quality; mode: Quality; score: number; signals: Signals | null;
}>({ ready: false, preference: 'auto', detected: 'medium', mode: 'basic', score: 0, signals: null });

export function initializePerformance() {
  let preference: Preference = 'auto';
  try {
    const saved = localStorage.getItem('sypher-quality');
    if (saved === 'auto' || saved === 'high' || saved === 'medium' || saved === 'basic') preference = saved;
  } catch { /* Storage can be blocked; the session remains functional. */ }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(pointer: coarse)');
  const device = navigator as Navigator & { deviceMemory?: number; connection?: EventTarget & { saveData?: boolean } };
  const update = () => {
    const signals: Signals = {
      threads: navigator.hardwareConcurrency > 0 ? navigator.hardwareConcurrency : null,
      memory: device.deviceMemory && device.deviceMemory > 0 ? device.deviceMemory : null,
      saveData: device.connection?.saveData ?? false,
      reducedMotion: motion.matches, width: window.screen.width, height: window.screen.height, touch: pointer.matches,
    };
    const { mode: detected, score } = classify(signals);
    const mode = effectiveMode(preference, detected, signals.reducedMotion);
    document.documentElement.dataset.quality = mode;
    performanceProfile.set({ ready: true, preference, detected, mode, score, signals });
    window.dispatchEvent(new Event('sypher-quality-change'));
  };
  const change = (event: Event) => {
    preference = (event as CustomEvent<Preference>).detail;
    try { localStorage.setItem('sypher-quality', preference); } catch { /* Optional persistence. */ }
    update();
  };
  update();
  motion.addEventListener('change', update);
  pointer.addEventListener('change', update);
  window.addEventListener('resize', update);
  device.connection?.addEventListener('change', update);
  window.addEventListener('sypher-quality-select', change);
  window.addEventListener('sypher-quality-analyze', update);
  return () => {
    motion.removeEventListener('change', update);
    pointer.removeEventListener('change', update);
    window.removeEventListener('resize', update);
    device.connection?.removeEventListener('change', update);
    window.removeEventListener('sypher-quality-select', change);
    window.removeEventListener('sypher-quality-analyze', update);
  };
}

export function selectQuality(preference: Preference) {
  window.dispatchEvent(new CustomEvent('sypher-quality-select', { detail: preference }));
}

export function reanalyzePerformance() {
  window.dispatchEvent(new Event('sypher-quality-analyze'));
}

// Prevent source downloads in lighter modes; only play visible decorative videos.
export function adaptiveVideo(node: HTMLVideoElement, source: string) {
  let near = false;
  const sync = () => {
    if (document.documentElement.dataset.quality === 'high') {
      if (near && !node.getAttribute('src')) node.src = source;
      if (near && !document.hidden) void node.play().catch(() => {});
      else node.pause();
    } else {
      node.pause();
      if (node.hasAttribute('src')) { node.removeAttribute('src'); node.load(); }
    }
  };
  const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; sync(); }, { rootMargin: '100px' });
  observer.observe(node);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('sypher-quality-change', sync);
  return { destroy() { observer.disconnect(); node.pause(); document.removeEventListener('visibilitychange', sync); window.removeEventListener('sypher-quality-change', sync); } };
}