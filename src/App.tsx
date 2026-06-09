import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { EmotionChips } from "./components/EmotionChips";
import { MoodBackground } from "./components/MoodBackground";
import { MoodInput } from "./components/MoodInput";
import { WallpaperButton } from "./components/WallpaperButton";
import { emotions, neutralEmotion, type Emotion } from "./data/emotions";
import { detectEmotion } from "./utils/detectEmotion";

function App() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(neutralEmotion);
  const [lastSubmitted, setLastSubmitted] = useState("okay");
  const shouldReduceMotion = useReducedMotion();

  const responseKey = useMemo(
    () => `${selectedEmotion.id}-${lastSubmitted}`,
    [lastSubmitted, selectedEmotion.id],
  );

  function handleMoodSubmit(value: string) {
    const nextEmotion = detectEmotion(value);
    setSelectedEmotion(nextEmotion);
    setLastSubmitted(value.trim() || nextEmotion.label.toLowerCase());
  }

  function handleChipSelect(emotion: Emotion) {
    setSelectedEmotion(emotion);
    setLastSubmitted(emotion.label.toLowerCase());
  }

  return (
    <main className="app" style={{ color: selectedEmotion.textColor }}>
      <MoodBackground emotion={selectedEmotion} />
      <section className="content-shell">
        <motion.p
          className="eyebrow"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 0.82, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
        >
          Mood Palette
        </motion.p>
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            delay: shouldReduceMotion ? 0 : 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          How are you feeling today?
        </motion.h1>
        <MoodInput accentColor={selectedEmotion.accentColor} onSubmit={handleMoodSubmit} />
        <AnimatePresence mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="response-message"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(5px)" }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(5px)" }}
            key={responseKey}
            role="status"
            transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: "easeOut" }}
          >
            {selectedEmotion.responseMessage}
          </motion.p>
        </AnimatePresence>
        <EmotionChips emotions={emotions} onSelect={handleChipSelect} selectedId={selectedEmotion.id} />
        <div className="wallpaper-panel">
          <WallpaperButton emotion={selectedEmotion} />
          <p>Save this mood as a wallpaper and let your phone reflect how you feel.</p>
        </div>
      </section>
    </main>
  );
}

export default App;
