import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { Emotion } from "../data/emotions";

interface ParticleLayerProps {
  emotion: Emotion;
}

const PARTICLE_COUNT = 24;
const GLYPH_COUNT = 12;

export function ParticleLayer({ emotion }: ParticleLayerProps) {
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const size = 3 + ((index * 7) % 18);
    const left = (index * 37) % 100;
    const top = (index * 53) % 100;
    const delay = (index % 9) * -0.55;
    const duration = 7 + (index % 8);
    const style = {
      "--accent": emotion.accentColor,
      "--delay": `${delay}s`,
      "--duration": `${duration}s`,
      "--size": `${size}px`,
      left: `${left}%`,
      top: `${top}%`,
    } as CSSProperties;

    return (
      <span
        className={`particle particle-${emotion.effect}`}
        key={`${emotion.id}-${index}`}
        style={style}
      />
    );
  }), [emotion.accentColor, emotion.effect, emotion.id]);

  const glyphs = useMemo(() => Array.from({ length: GLYPH_COUNT }, (_, index) => {
    const width = 80 + ((index * 29) % 180);
    const left = (index * 23 + 8) % 94;
    const top = (index * 41 + 6) % 88;
    const delay = (index % 6) * -0.7;
    const duration = 5 + (index % 7);
    const rotation = -34 + ((index * 17) % 68);
    const style = {
      "--accent": emotion.accentColor,
      "--delay": `${delay}s`,
      "--duration": `${duration}s`,
      "--rotation": `${rotation}deg`,
      "--width": `${width}px`,
      left: `${left}%`,
      top: `${top}%`,
    } as CSSProperties;

    return <span className={`mood-glyph glyph-${emotion.effect}`} key={`${emotion.id}-glyph-${index}`} style={style} />;
  }), [emotion.accentColor, emotion.effect, emotion.id]);

  return (
    <div className={`particle-layer effect-${emotion.effect}`}>
      <div className="mood-glyph-layer">{glyphs}</div>
      {particles}
    </div>
  );
}
