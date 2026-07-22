import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const BASE_BGM_VOLUME = 0.35;

type ExperienceContextValue = {
  hasEntered: boolean;
  enteredAt: number | null;
  enter: () => Promise<void>;
  registerAudio: (audio: HTMLAudioElement | null) => void;
  bgmVolume: number;
  setBgmVolume: (targetVolume: number, fadeMs?: number) => void;
  duckBgm: (duckRatio?: number, fadeMs?: number) => void;
  restoreBgm: (fadeMs?: number) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [enteredAt, setEnteredAt] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeAnimRef = useRef<number | null>(null);
  const currentVolumeRef = useRef<number>(BASE_BGM_VOLUME);

  const setBgmVolume = useCallback((targetVol: number, fadeMs = 1500) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    const startVol = currentVolumeRef.current;
    const startTime = performance.now();
    const clampedTarget = Math.max(0, Math.min(1, targetVol));

    const updateFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / fadeMs);
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newVol = startVol + (clampedTarget - startVol) * easeProgress;
      currentVolumeRef.current = newVol;
      if (audioRef.current) {
        audioRef.current.volume = newVol;
      }

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(updateFade);
      }
    };

    fadeAnimRef.current = requestAnimationFrame(updateFade);
  }, []);

  const duckBgm = useCallback(
    (duckRatio = 0.2, fadeMs = 1500) => {
      setBgmVolume(BASE_BGM_VOLUME * duckRatio, fadeMs);
    },
    [setBgmVolume],
  );

  const restoreBgm = useCallback(
    (fadeMs = 1500) => {
      setBgmVolume(BASE_BGM_VOLUME, fadeMs);
    },
    [setBgmVolume],
  );

  const registerAudio = useCallback((audio: HTMLAudioElement | null) => {
    audioRef.current = audio;
    if (audio) {
      audio.volume = currentVolumeRef.current;
    }
  }, []);

  const enter = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = BASE_BGM_VOLUME;
      currentVolumeRef.current = BASE_BGM_VOLUME;
      audio.loop = true;
      try {
        await audio.play();
      } catch {
        // Browser blocked playback despite user gesture — site still proceeds.
      }
    }
    setEnteredAt(Date.now());
    setHasEntered(true);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
    };
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        hasEntered,
        enteredAt,
        enter,
        registerAudio,
        bgmVolume: currentVolumeRef.current,
        setBgmVolume,
        duckBgm,
        restoreBgm,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within ExperienceProvider");
  return ctx;
}
