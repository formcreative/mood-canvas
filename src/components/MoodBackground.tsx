import { motion, useReducedMotion } from "framer-motion";
import type { Emotion } from "../data/emotions";
import { ParticleLayer } from "./ParticleLayer";

interface MoodBackgroundProps {
  emotion: Emotion;
}

export function MoodBackground({ emotion }: MoodBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const gradient = `radial-gradient(circle at 20% 20%, ${emotion.gradient[1]} 0%, transparent 36%),
    radial-gradient(circle at 80% 12%, ${emotion.gradient[2]} 0%, transparent 30%),
    radial-gradient(circle at 50% 92%, ${emotion.gradient[3]} 0%, transparent 34%),
    linear-gradient(135deg, ${emotion.gradient.join(", ")})`;

  return (
    <motion.div
      aria-hidden="true"
      className="mood-background"
      animate={{ background: gradient }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: "easeInOut" }}
    >
      <div className="gradient-orb gradient-orb-one" />
      <div className="gradient-orb gradient-orb-two" />
      <div className="grain" />
      <ParticleLayer emotion={emotion} />
    </motion.div>
  );
}
