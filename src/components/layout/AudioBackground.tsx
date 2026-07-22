import { useEffect, useRef } from "react";
import { useExperience } from "@/context/ExperienceContext";

const audioSrc = "/media/hedwigs-theme.mp3";

export function AudioBackground() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { registerAudio } = useExperience();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.65;
    audio.loop = true;
    registerAudio(audio);
    return () => registerAudio(null);
  }, [registerAudio]);

  return <audio ref={audioRef} src={audioSrc} loop preload="auto" />;
}
